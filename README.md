# 市区町村議会会議録検索リンク

[localgovjp](https://github.com/code4fukui/localgovjp) の自治体一覧をもとに、都道府県別に [ssp.kaigiroku.net](https://ssp.kaigiroku.net/) のテナント URL へ誘導する静的サイトです。`cities_all.xml` の `<result>`（`ok` / `ng`）に応じて、リンクの有無を切り替えます。

## このリポジトリに含まれるもの

| ファイル | 説明 |
|----------|------|
| `index.html` | ページ本体 |
| `style.css` | スタイル |
| `script.js` | `cities_all.xml` を読み込み、リストを描画 |
| `cities_all.xml` | 都道府県 → 市区町村（`ja` / `en` / `result`） |
| `favicon.svg` | ファビコン |

CSV や XML 再生成用スクリプトなどは **Git には含めていません**（ローカル開発用に別管理してください）。

## ローカルでの表示

`fetch` で XML を読むため、`file://` 直開きでは環境によって失敗することがあります。プロジェクトフォルダをルートにした簡易サーバーで開いてください。

```bash
npx --yes serve .
```

## データの出典

自治体一覧の基礎データは [localgovjp](https://github.com/code4fukui/localgovjp)（[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)）を加工したものです。テナント用スラッグや `result` は別途取得・付与した値です。

## ライセンス

本リポジトリのオリジナル部分のライセンスは未指定です。必要に応じて `LICENSE` を追加してください。第三者データ・サービス（localgovjp、ssp.kaigiroku.net）の利用条件は各提供元に従います。
