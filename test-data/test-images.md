# 画像表示テスト

ブラウザ版では、**絶対 HTTP / HTTPS URL の画像だけ**を表示対象とします。
ネットワーク接続がある場合、PNG / JPEG / GIF / WebP / SVG などブラウザが対応する画像を表示できます。
GIFは通常の `<img>` として扱うため、アニメーションもそのまま再生されます。

## HTTPS画像

![Remote PNG](https://avatars.githubusercontent.com/u/287231805)

## HTTPS GIF

次のような指定は通常のGIFアニメーションとして表示されます。

```markdown
![Remote GIF](https://example.com/path/animation.gif)
```

## 非対応

以下はブラウザ版では画像として読み込みません。

```markdown
![Relative image](images/sample-image.png)
![Parent relative image](../images/sample-image.png)
![Local absolute path](C:/images/sample-image.png)
![Local file URL](file:///C:/images/sample-image.png)
```

ローカルファイルは `file://` のセキュリティ制約があるため、ブラウザ版では対象外です。
