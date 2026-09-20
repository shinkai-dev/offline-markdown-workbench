# Markdown 基本要素テスト

## 見出し

### 階層

通常の文章、**太字**、*斜体*、~~取り消し~~、`inline code`。

- 箇条書き
  - ネスト
- [x] 完了
- [ ] 未完了

1. 番号付き
2. 2番目

> 引用テキストです。

---

[ローカルビューアー](index.html)

![存在しない画像の安全テスト](invalid-image.png)

```python
for i in range(5):
    print(i)
```

## 危険なHTML

<script>alert("XSS")</script>

<img src=x onerror="alert('XSS')">

<a href="javascript:alert('XSS')">危険なリンク</a>
