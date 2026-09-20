# 横幅・高さリサイズテスト

右端をドラッグして横幅、右下をドラッグして縦横を変更してください。

| ID | システム名 | 非常に長い説明列 | URL | 担当チーム | ステータス | 備考 |
|---:|---|---|---|---|---|---|
| 1 | Core API | この列は長い文章を意図的に入れています。列幅を変更して、折り返しと横スクロールの挙動を確認してください。<br>2行目もあります。 | https://example.invalid/api/v1/very/long/path | Platform | 稼働 | テスト用 |
| 2 | Worker | 非同期処理を担当します。大量行と組み合わせた場合にも表内部だけがスクロールすることを確認します。 | https://example.invalid/worker | Backend | 確認中 | テスト用 |
| 3 | Frontend | UIからAPIを呼び出します。<br>エラー時には通知を表示します。 | https://example.invalid/front | Web | 稼働 | テスト用 |
