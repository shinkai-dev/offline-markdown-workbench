# Mermaid テスト

## Flowchart

```mermaid
flowchart TD
    A[開始] --> B{認証済み？}
    B -->|Yes| C[ダッシュボード]
    B -->|No| D[ログイン]
    D --> C
```

## Graph

```mermaid
graph LR
    A[API] --> B[Service]
    B --> C[(Database)]
```

## Wide Flowchart

横方向に長い図。拡大しても横スクロールバーを使わず、図を掴んで移動して確認できます。

```mermaid
flowchart LR
    A[利用者] --> B[Webブラウザ]
    B --> C[認証ゲートウェイ]
    C --> D[API Gateway]
    D --> E[ユーザーサービス]
    E --> F[注文サービス]
    F --> G[在庫サービス]
    G --> H[決済サービス]
    H --> I[通知サービス]
    I --> J[監査ログ]
    J --> K[(Database)]
    E --> L[(User DB)]
    F --> M[(Order DB)]
    G --> N[(Inventory DB)]
    H --> O[(Payment DB)]
    I --> P[(Message Queue)]
```

## Long Sequence Diagram

横にも縦にも長いシーケンス図。枠をリサイズし、図をドラッグして各部分を確認するテスト用です。

```mermaid
sequenceDiagram
    autonumber
    actor User as 利用者
    participant Browser as ブラウザ
    participant Gateway as API Gateway
    participant Auth as 認証サービス
    participant UserSvc as ユーザーサービス
    participant OrderSvc as 注文サービス
    participant Stock as 在庫サービス
    participant Payment as 決済サービス
    participant Notify as 通知サービス
    participant Queue as メッセージキュー
    participant Audit as 監査ログ
    participant UserDB as ユーザーDB
    participant OrderDB as 注文DB
    participant StockDB as 在庫DB

    User->>Browser: 商品一覧を表示
    Browser->>Gateway: GET /products
    Gateway->>Auth: アクセストークン検証
    Auth-->>Gateway: 検証OK
    Gateway->>Stock: 商品在庫取得
    Stock->>StockDB: SELECT products
    StockDB-->>Stock: 商品・在庫情報
    Stock-->>Gateway: 商品一覧
    Gateway-->>Browser: 200 OK
    Browser-->>User: 商品一覧表示

    User->>Browser: 注文を確定
    Browser->>Gateway: POST /orders
    Gateway->>Auth: 権限確認
    Auth->>UserSvc: ユーザー情報取得
    UserSvc->>UserDB: SELECT user
    UserDB-->>UserSvc: ユーザー情報
    UserSvc-->>Auth: 利用者確認
    Auth-->>Gateway: 注文可能
    Gateway->>OrderSvc: 注文作成
    OrderSvc->>Stock: 在庫確保
    Stock->>StockDB: UPDATE stock
    StockDB-->>Stock: 更新完了
    Stock-->>OrderSvc: 在庫確保完了
    OrderSvc->>OrderDB: INSERT order
    OrderDB-->>OrderSvc: 注文ID
    OrderSvc->>Payment: 決済要求
    Payment-->>OrderSvc: 決済成功
    OrderSvc->>Queue: 注文確定イベント
    Queue->>Notify: 通知イベント配送
    Notify-->>User: 注文完了通知
    OrderSvc->>Audit: 操作ログ記録
    Audit-->>OrderSvc: 記録完了
    OrderSvc-->>Gateway: 注文完了
    Gateway-->>Browser: 201 Created
    Browser-->>User: 注文完了画面

    Note over User,Audit: 長い図をドラッグして各領域を確認する
```

## ER Diagram

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ITEM : contains
```

## Class Diagram

```mermaid
classDiagram
    class User
    class Order
    User <|-- Order
```

## State Diagram

```mermaid
stateDiagram-v2
    A --> B
    B --> C
```
