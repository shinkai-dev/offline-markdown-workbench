# ネットワーク画像テスト

## HTTPS・拡張子あり

![HTTPS PNG](https://upload.wikimedia.org/wikipedia/commons/3/3f/PNG_example_balls.png)

## HTTPS・拡張子なし（URLの末尾に拡張子がない画像URL）

![拡張子なしのネットワーク画像](https://dummyimage.com/320x120)

## 拡張子なし

![拡張子なしのネットワーク画像](https://dummyimage.com/320x120)

> ネットワーク画像はURLの拡張子ではなく、サーバーから返されるContent-Typeとブラウザの画像対応形式によって表示されます。
> URLはDOMPurify処理前に保護してから復元するため、file://で起動してもリモート画像URLが空srcへ変換されません。
