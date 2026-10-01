# Markdown 描画・パーサー耐久テストデータ

このファイルは、マークダウンプレビューアーやパーサーが仕様通りに描画できるか、またエッジケース（文字の消失、パース崩れなど）が発生しないかをテストするためのデータです。

## 視覚チェック用クイックリファレンス

以下を目視で確認し、右側の「❌ パース崩れの例」のようになっていないかチェックしてください。

| テスト項目 | ✅ 正しい表示（期待される結果） | ❌ よくあるパース崩れの例 |
| ----- | ----- | ----- |
| **見出し** | 大きな太字テキストとして表示される | 文頭に `#` や `###` が生のまま残る |
| **文中の `#` や `_`** | `C#` や `foo_bar` と記号付きでそのまま表示 | `C` になったり `foo`*`bar`*（斜体）になる |
| **その他の特殊記号** | `a*b*c` や `a~b` が文字のまま表示 | `a`*`b`*`c` になったり波線が消える |
| **括弧やURL** | `[draft]` や `calc(1 + 2)` がそのまま表示 | 文字が消える、リンク化して壊れる |
| **HTML記号** | `a < b && c > d` がそのまま表示 | `< b && c >` 部分がHTMLタグと見なされ消失 |
| **インラインコード** | 背景付きのコード枠で `foo_bar` と表示 | `_` が消えてイタリック化や太字化する |
| **リストのネスト** | 階層ごとにインデント（インデント下げ）される | すべて同じ階層に並んでしまう |
| **エスケープ** | `*星*` や `[リンク]` が記号のまま表示 | 勝手に斜体になったり、リンクになろうとする |

## 1. 基本記法テスト

### 1.1 見出し (Headers)

# H1 見出し

## H2 見出し

### H3 見出し

#### H4 見出し

##### H5 見出し

###### H6 見出し

### 1.2 強調・装飾 (Emphasis)

* アスタリスク単体による斜体: *Italic Text*

* アンダースコア単体による斜体: *Italic Text*

* アスタリスク2つによる太字: **Bold Text**

* アンダースコア2つによる太字: **Bold Text**

* 波線2つによる打ち消し線: ~~Strikethrough Text~~

* 複合装飾: ***Bold and Italic*** / **~~Bold Strikethrough~~**

### 1.3 引用 (Blockquotes)

> これは1段目の引用です。
>
> > これはネストされた引用です。
> >
> > > 3階層目の引用です。
>
> 引用内の複数行改行テスト。

### 1.4 リスト (Lists)

#### 箇条書きリスト

* リスト項目 1
  * ネスト項目 1-1
  * ネスト項目 1-2
    * さらにネスト 1-2-1

* プラステーブル項目 A

* マイナステーブル項目 B

#### 番号付きリスト

1. 項目 1
2. 項目 2
   1. ネストされた番号 2-1
   2. ネストされた番号 2-2
3. 項目 3

#### タスクリスト (Task List)

- [x] 完了したタスク
- [ ] 未完了のタスク
- [ ] `code_block` を含むタスク

### 1.5 コード (Code)

#### インラインコード

これは `inline_code_with_underscores` のテストです。`#1` や `$PATH` も正しく表示されるべきです。

#### フェンス付きコードブロック (Fenced Code Blocks)

```javascript
// JavaScript Test
function testParser(input_string) {
  const hash_count = 10;
  console.log(`Processing #${hash_count}: ${input_string}`);
  return input_string.replace(/_/#g, '');
}
```

```html
<!-- HTML Test -->
<div id="test-container" class="box_style">
  <p>C# & C++ Guide</p>
</div>
```

### 1.6 水平線 (Horizontal Rules)

---

### 1.7 リンク・画像 (Links & Images)

* 通常リンク: [DocBase ヘルプ](https://help.docbase.io/posts/13697)
* 自動リンク: <https://example.com>
* インライン画像: ![サンプル画像](https://via.placeholder.com/150x50 "Placeholder Image")

### 1.8 テーブル (Tables)

| ID | Name | Category | Status | Price ($) |
| ----- | ----- | ----- | ----- | ----- |
| 001 | Item_A | Category#1 | `active_state` | 1,000 |
| 002 | Item_B_Plus | Category#2 | ~~deprecated~~ | 2,500 |
| 003 | C#_Book | Education | **New** | 500 |

---

## 2. 意地悪テスト (Edge Cases & Parser Torture)

※パーサーが誤って文字を削ったり、パースエラーを起こさないかを検証する領域です。

### 2.1 文中の `#`（見出し誤判定チェック）

見出し（`#`）は「行頭 + `#` + 半角スペース」が基本です。以下の文脈で `#` が消えたり見出し化しないか確認してください。

* プログラミング言語: C#, F#, J#
* ソーシャルハッシュタグ: #markdown #parser_test
* 文中の記号: Issue #1234 を参照（# の前にスペースあり）
* 行頭だがスペースなし: #HeaderIsNotThis
* 数字直結: #12345

### 2.2 文中の `_`（斜体・太字誤判定チェック）

アンダースコア（`_`）を消し込んだり、勝手に `<i>` タグに変換していないか確認してください。

* スネークケース変数名: `user_first_name`, `get_data_by_id`, `__init__`
* 通常テキスト内のスネークケース: my_variable_name_test
* 連続アンダースコア: variable___name___test
* パスやURL: `/usr/local/var_log_messages/test_file.txt`

### 2.3 アスタリスク `*` / 波線 `~` / バックティック `` ` `` の文中的使用

* 数式・計算式: `2 * 3 * 4 = 24`（アスタリスクが消えて `3` が斜体にならないか）
* チルダ・波線: `~1000円`, `v1.0.0~beta.1`, `http://example.com/~user/`
* パス・ワイルドカード: `*.js` や `temp_*.tmp`
* バックティック単体（コードブロック外）: 1個の ` や 2個の `` が文言ごと消えていないか

### 2.4 角括弧 `[]` / 丸括弧 `()`（リンク・画像誤判定チェック）

* 角括弧単体: `[Draft]`, `[1]`, `Array[index]`, `[TODO]`（リンク化失敗で消えないか）
* 関数・メソッド呼出: `calc(1 + 2)`, `main(args)`
* 連続括弧: `[Notice](Important)`（実在しない見せかけリンク構造）
* 正規表現・配列表現: `[a-z0-9_]`, `[[1, 2], [3, 4]]`

### 2.5 不等号 `<` `>` / アンド `&`（HTMLエンティティ・自動リンク誤判定チェック）

* 比較演算子: `a < b` や `x > y`
* 不等号が混在する文: `1 < 2 && 3 > 2`（`< 2 && 3 >` が非表示タグ扱いされないか）
* XML/HTMLタグ風テキスト: `<component-name>`, `<UserInput>`
* アンド記号: `AT&T`, `R&D`, `Q&A`, `&amp;`（二重エスケープ崩れチェック）

### 2.6 パイプ `|` / プラス `+` / マイナス `-`（テーブル・リスト誤判定チェック）

* 文中のパイプ（テーブル外）: `command1 | command2`, `A || B`
* 行頭以外の記号: `1 + 1 = 2`, `apple - banana - cherry`
* 箇条書き風テキスト: `+1` や `-100` が文頭にあってもリスト化しないか

### 2.7 バックスラッシュ `\` / ドル記号 `$`（LaTeX/数式拡張チェック）

* Windowsパス: `C:\Users\Admin\Documents\file.txt`（`\` が後続文字ごと消失しないか）
* 金額表示: `$100` や `$50`（LaTeX数式モードに入り込んでフォントが変わらないか）
* 複数ドル記号: `Price: $10 or $20`

### 2.8 エスケープ処理 (Escaping)

バックスラッシュ（`\`）によるエスケープが機能し、リテラルとして表示されるか確認してください。

* エスケープされたアスタリスク: \*this is not italic\*
* エスケープされたアンダースコア: \_this is not italic\_
* エスケープされたハッシュ: \# This is not a header
* エスケープされたバックティック: \`not code\`
* エスケープされた波線: \~\~not strikethrough\~\~
* エスケープされたブラケット: \[Not A Link\]\(https://example.com\)

### 2.9 複雑な組み合わせ・ネスト

* **太字の中の `code_with_underscore` テスト**
* *斜体の中の `C#_Language` テスト*
* [リンクテキスト内の `code_in_link`](https://example.com)
* > 引用内での `snake_case_variable` と #hashtag、および `calc(a < b)`

### 2.10 特殊文字・XSS対策

* `<script>alert('XSS Test');</script>` (エスケープされてテキスト表示されるべき)
* `javascript:void(0)` を含むリンク構造: [XSS Link](javascript:alert('XSS'))

---

**テスト終了**