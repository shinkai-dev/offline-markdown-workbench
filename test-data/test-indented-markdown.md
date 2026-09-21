# インデントMarkdown描画テスト

この文書は、見出し・コードブロック・Mermaidの開始/終了フェンスに余分な空白があっても正しく描画できることを確認するテストです。

    ## H2：4スペース

        ### H3：8スペース

  #### H4：2スペース

       ##### H5：7スペース

    ###### H6：4スペース

       ####### H7：拡張見出し

        ######## H8：拡張見出し

   ######### H9：拡張見出し

      ########## H10：拡張見出し

## インデントされたコードフェンス

    ```python
    class UserService:
        def __init__(self, repository):
            self.repository = repository

        def find(self, user_id):
            # インデントされたコードも保持される
            return self.repository.find(user_id)
    ```

## フェンスだけインデントされたコード

       ```javascript
       function greet(name) {
           return `Hello, ${name}`;
       }
       ```

## インデントされたMermaid

      ```mermaid
      flowchart TD
          A[開始] --> B{判定}
          B -->|Yes| C[処理]
          B -->|No| D[終了]
      ```

## Mermaidの別パターン

        ```mermaid
        sequenceDiagram
            participant A as 利用者
            participant B as システム
            A->>B: 開始
            B-->>A: 完了
        ```

## 通常のコードフェンスとの比較

```python
class Normal:
    def run(self):
        return "通常のフェンス"
```

## 確認項目

- [ ] H1〜H10が見出しとして認識される
- [ ] 先頭に空白があるHタグが本文として表示されない
- [ ] インデントされたPythonコードがコードブロックになる
- [ ] インデントされたJavaScriptコードがコードブロックになる
- [ ] インデントされたMermaidが図として描画される
- [ ] コード内部のインデントは維持される
