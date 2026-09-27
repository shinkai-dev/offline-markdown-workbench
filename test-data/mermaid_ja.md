# 技術詳細設計書：マイクロサービスECプラットフォーム

| メタデータ | 詳細内容 |
| --- | --- |
| **ドキュメントバージョン** | 1.2.0 |
| **ステータス** | 承認済み (Approved) |
| **作成者** | プリンシパル・システムアーキテクト |
| **対象リリース** | 2026年 第4四半期 |

---

## 1. エグゼクティブ・サマリー（概要）

本技術設計書（TDD）は、次世代ECマイクロサービスプラットフォームのシステムアーキテクチャ、統合パターン、およびデータ永続化モデルを定義するものです。本システムは、高トラフィックなトランザクション処理に耐えうる設計となっており、分散システム間における複数パーティのイベントフロー、並びにクラウドネイティブなマイクロサービス間におけるレジリエンス（障害復旧性）の高いリカバリ機構を備えています。

---

## 2. エンドツーエンド・システムシーケンス図

以下のシーケンス図は、システム全体に関わるリクエストのライフサイクルを示しています。ユーザーの新規アカウント登録、商品検索から、分散環境下での複雑な決済トランザクション処理、外部決済ゲートウェイ連携、非同期での在庫ロック、および配送指示（出荷処理）までの一連の流れを網羅しています。

```mermaid
sequenceDiagram
    autonumber
    actor Customer as ユーザー (Browser / App)
    participant Edge as API Gateway / 境界ルーティング
    participant Auth as 認証・アイデンティティ基盤
    participant Catalog as 商品カタログサービス
    participant Search as 検索エンジン (Elasticsearch)
    participant Cart as ショッピングカートサービス
    participant Order as 注文管理サービス (OMS)
    participant Stock as 在庫・倉庫管理システム
    participant Payment as 外部決済ゲートウェイ
    participant Loyalty as ポイント・ロイヤリティ基盤
    participant Notification as 非同期通知サービス
    participant Fulfillment as 配送・物流連携サービス

    Note over Customer, Fulfillment: フェーズ 1: ユーザー認証＆セッション初期化

    Customer->>Edge: POST /api/v1/auth/register (会員登録情報)
    Edge->>Auth: 登録リクエストの転送
    Auth->>Auth: 入力値検証 ＆ パスワードハッシュ化
    
    alt アカウントが既に存在する場合
        Auth-->>Edge: HTTP 409 Conflict (重複エラー)
        Edge-->>Customer: 登録エラー画面の表示
    else アカウント作成成功
        Auth->>Auth: JWTベアラートークンの発行
        Auth-->>Edge: HTTP 201 Created (トークン + ユーザーオブジェクト)
        Edge-->>Customer: 安全なHTTP-Only Cookieの設定 ＆ マイページへリダイレクト
    end

    Note over Customer, Fulfillment: フェーズ 2: 商品検索・閲覧 ＆ カート操作

    Customer->>Edge: GET /api/v1/products/search?q=スニーカー
    Edge->>Catalog: 検索クエリの振り分け
    Catalog->>Search: 全文検索インデックスの実行
    Search-->>Catalog: 一致する商品IDリストとスコアの返却
    Catalog->>Catalog: 商品メタデータおよび価格情報の付与
    Catalog-->>Edge: HTTP 200 OK (商品リストJSON)
    Edge-->>Customer: 商品検索結果のレンダリング表示

    Customer->>Edge: POST /api/v1/cart/items (商品ID, 数量: 1)
    Edge->>Cart: アクティブセッションのカートへ追加
    Cart->>Cart: カートルールの検証 ＆ 再計算処理
    Cart-->>Edge: HTTP 200 OK (更新後カートオブジェクト)
    Edge-->>Customer: カートバッジの更新表示

    Note over Customer, Fulfillment: フェーズ 3: 分散チェックアウト ＆ トランザクション処理

    Customer->>Edge: POST /api/v1/checkout/submit (決済情報, 配送先住所)
    Edge->>Order: 分散チェックアウトフローの開始
    
    Order->>Order: 注文ID(OrderID)発行 ＆ ステータス変更: "PENDING_PAYMENT" (決済待ち)

    par 在庫の仮押さえ ＆ ポイント引き落とし準備
        Order->>Stock: POST /api/v1/stock/reserve (商品リスト, 注文ID)
        Stock->>Stock: 在庫ユニットのロック (TTL: 15分間)
        Stock-->>Order: 確保完了レスポンス (在庫ロック完了)
    and
        Order->>Loyalty: POST /api/v1/loyalty/hold (ユーザーID, 利用ポイント)
        Loyalty->>Loyalty: 利用要求ポイントの仮押さえ
        Loyalty-->>Order: ポイント仮押さえ完了レスポンス
    end

    alt 在庫またはポイントの仮押さえ失敗
        Order->>Stock: 在庫仮押さえのキャンセル (ロールバック)
        Order->>Loyalty: 仮押さえポイントの解放 (ロールバック)
        Order->>Order: ステータス変更: "FAILED_CHECKOUT" (購入失敗)
        Order-->>Edge: HTTP 422 Unprocessable Entity
        Edge-->>Customer: 「在庫切れまたはポイント無効」エラーの表示
    else すべての仮押さえ処理が成功
        Order->>Payment: クレジットカード決済の実行 (決済金額, トークン)
        
        opt 3Dセキュア 2.0 (本人認証) が発火した場合
            Payment-->>Order: 3Dセキュア認証用リダイレクトURLの返却
            Order-->>Edge: HTTP 302 Found (3Dセキュアポータル)
            Edge-->>Customer: カード会社の本号認証ページへリダイレクト
            Customer->>Payment: ワンタイムパスワード / 生体認証の入力
            Payment-->>Customer: 認証完了 (コールバック)
            Customer->>Edge: POST /api/v1/checkout/3ds-callback
            Edge->>Order: トランザクション処理の再開
        end

        Payment-->>Order: 決済承認完了 (決済トランザクションID発行)

        Order->>Order: ステータス変更: "PAYMENT_CONFIRMED" (決済完了)
        
        par 分散状態の確定 (本コミット)
            Order->>Stock: 在庫確保の確定 (永久控除)
            Stock-->>Order: 在庫減算完了
        and
            Order->>Loyalty: ポイント引き落としの確定
            Loyalty-->>Order: ポイント減算完了
        end

        Order-->>Edge: HTTP 200 OK (注文確定サマリー)
        Edge-->>Customer: 注文完了画面の表示
    end

    Note over Customer, Fulfillment: フェーズ 4: 非同期での注文後処理

    Order->>Notification: イベント発行: ORDER_PLACED (Kafkaによる非同期イベント)
    Notification->>Notification: メール/SMSテンプレートの生成
    Notification->>Customer: 完了メールの送信 (購入明細 ＆ 追跡用リンク)

    Order->>Fulfillment: イベント発行: FULFILLMENT_REQUESTED (出荷リクエスト)
    Fulfillment->>Fulfillment: ピッキングリスト ＆ 配送ラベルの生成
    Fulfillment-->>Order: 追跡情報の更新 (送り状番号の割り当て)
    
    Note right of Customer: 数日後
    Fulfillment->>Notification: イベント発行: ORDER_DELIVERED (配達完了)
    Notification->>Customer: プッシュ通知の送信 (「お荷物が配達されました」)

```

---

## 3. ハイレベル・システムアーキテクチャ概要

本システムは、Elastic Kubernetes Service (EKS) クラスター上で稼働するイベント駆動型マイクロサービスアーキテクチャを採用しています。

```
                                  +-----------------------+
                                  |   API Gateway (Edge)  |
                                  +-----------+-----------+
                                              |
      +-------------------+-------------------+-------------------+-------------------+
      |                   |                   |                   |                   |
+-----+-----+       +-----+-----+       +-----+-----+       +-----+-----+       +-----+-----+
| 認証・認可  |       | カタログ  |       | カート    |       | 注文管理  |       | 在庫・倉庫 |
| サービス  |       | サービス  |       | サービス  |       | (OMS)     |       | サービス  |
+-----------+       +-----------+       +-----------+       +-----------+       +-----------+

```

### 主要コンポーネント

* **API Gateway / 境界ルーティング**: TLS終端、レート制限（Token Bucketアルゴリズム）、認証トークン検証、およびリクエストのルーティングを担当。
* **注文管理サービス (OMS)**: 分散処理における Saga オーケストレーターとして機能し、一連の注文トランザクションを制御。
* **在庫・倉庫管理サービス**: 在庫割り当て、TTL（有効期限）付きロックによる一時保持、および倉庫側システムとの同期を担当。
* **外部連携インターフェース**: 外部決済ゲートウェイ（Stripe / Adyenなど）、通知配信基盤（Twilio / SendGridなど）、および宅配業者APIとの連携。

---

## 4. 主要な非機能要件 (NFRs)

* **性能・レイテンシ (Performance & Latency)**:
* 参照系API：P95レスポンスタイム < 200ms
* 更新系（決済処理）API：P99レスポンスタイム < 1,200ms


* **可用性 (Availability)**:
* マルチリージョン構成（Active-Passive）により、年間 99.99% の稼働率を目標とする。


* **データ整合性 (Data Consistency)**:
* カタログインデックスおよび通知サービスは **結果的整合性 (Eventual Consistency)** を許容。
* 注文・決済・在庫割り当てについては、Sagaパターンの補償トランザクションを用いて **厳密なトランザクション整合性** を保持。



---