# 市区町村議会会議録検索リンク

[localgovjp](https://github.com/code4fukui/localgovjp) の自治体一覧をもとに、都道府県別に `cities_all.xml` に記載した会議録検索などへの URL を一覧する静的サイトです。`<url>` が空の市区町村はリンクを出さず、`<result>` が `ok` の件数を参考表示します。

## このリポジトリに含まれるもの

| ファイル | 説明 |
|----------|------|
| `index.html` | ページ本体 |
| `style.css` | スタイル |
| `script.js` | `cities_all.xml` を読み込み、リストを描画 |
| `cities_all.xml` | 都道府県 → `<municipality>`（`ja` / `en` / `url` / `result`） |
| `favicon.svg` | ファビコン |
| `checks/*.mjs` | 会議録 URL 検査用スクリプト（`node checks/check_ssp.mjs` など。親の `cities_all.xml` を読む） |
| `results/` | 上記チェックの出力 XML（`check_*_YYYYMMDD_HHmm.xml`） |

`merge_xml.mjs`（直下）は `results/check_*.xml` を `cities_all.xml` にマージする。例: `node merge_xml.mjs results/check_ssp_xxx.xml`

CSV や XML 再生成用のその他スクリプトは **Git には含めていません**（ローカル開発用に別管理してください）。

## ローカルでの表示

`fetch` で XML を読むため、`file://` 直開きでは環境によって失敗することがあります。プロジェクトフォルダをルートにした簡易サーバーで開いてください。

```bash
npx --yes serve .
```

## データの出典

自治体一覧の基礎データは [localgovjp](https://github.com/code4fukui/localgovjp)（[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)）を加工したものです。英字スラッグ・各 `<url>`・`result` は別途取得・付与した値です。

## ライセンス

本リポジトリのオリジナル部分のライセンスは未指定です。必要に応じて `LICENSE` を追加してください。第三者データ・サービス（localgovjp、リンク先の各サイト）の利用条件は各提供元に従います。
