# 高校生が知りたい天文学 / Astronomy, step by step

高校数学の式変形を中心に、光の観測から星の限界までたどる、日本語・英語の静的Web教材です。

A bilingual Japanese–English astrophysics guide, connecting observations to stellar limits through accessible algebra.

## ローカルで読む / Read locally

追加のインストール・ビルドは不要です。Python 3のHTTPサーバーなどで `docs/` を開きます。

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory docs
```

ブラウザで <http://127.0.0.1:4173/> を開きます。`docs/index.html` を直接開く方法でも基本機能は動作しますが、読了・言語設定の保存はブラウザによって制限されます。

No installation or build is needed. Serve `docs/` with any static HTTP server. All fonts, equations, illustrations, and application assets work without a CDN. Reference links require internet access.

## 内容 / Curriculum

00. 数式の道具箱 / Mathematical toolkit
01. 光と距離、宇宙の距離のはしご / Light, distance, and the cosmic distance ladder
02. 星・ガス・真空、重力と電磁気力 / Matter, gravity, and electromagnetism
03. 原子の光、リュードベリの式、Lyα / Atomic light, Rydberg formula, and Lyα
04. 自然幅と熱運動幅 / Natural and thermal line broadening
05. 古典的電子半径とトムソン散乱 / Classical electron radius and Thomson scattering
06. 平均自由行程、熱平衡、ボルツマン分布 / Mean free paths, equilibrium, Boltzmann factors
07. アインシュタインA・B係数とプランク分布 / Einstein coefficients and Planck’s law
08. ビリアル定理、収縮と加熱 / Virial theorem, contraction, and heating
09. 星の構造、質量–光度関係 / Stellar structure and mass–luminosity scaling
10. 太陽の表面温度 / Solar effective temperature
11. エディントン限界 / Eddington limit
12. チャンドラセカール質量 / Chandrasekhar mass
13. 特殊・一般相対論への入口 / An entry to special and general relativity
14. 元素合成とヘリウムの量 / Nucleosynthesis and helium abundance
15. 宇宙膨張とハッブル–ルメートルの法則 / Cosmic expansion and the Hubble–Lemaître law

各章に学習目標、仮定、途中式、確認問題、参考資料を収録。黒体スペクトル、エディントン比、縮退圧の比例則、宇宙膨張と後退速度を試す操作パネルもあります。

Each chapter includes learning goals, assumptions, worked algebra, a question with an expandable answer, and references. Four interactive panels explore blackbody spectra, Eddington ratios, pressure scaling, and cosmic expansion.

## 教え方の方針 / Teaching scope

- 微分方程式を解かず、式変形と桁の見積もりを中心にする。
- エントロピー極大化と未定乗数法だけは、微分を使う任意の発展欄に置く。
- 量子の準位、ラーモアの公式、アインシュタイン関係式、相対論の結果など、出発点として借りる法則を明示する。
- チャンドラセカール質量は半径が消える理由と組成依存性まで追い、精密な係数は恒星構造計算の標準結果として区別する。
- 温度のK/℃、光度と流束、線幅のFWHM、放射密度の周波数/波長の定義を区別する。
- 掲載値や理想モデルは、観測・適用範囲・組成などの条件とともに説明する。

No differential equations are solved. The optional entropy-maximization section uses derivatives. Supplied laws, algebraic deductions, estimates, and detailed-model coefficients are explicitly distinguished.

## GitHub Pagesで公開 / Deploy to GitHub Pages

公開先：[教材サイト](https://koyamahr.github.io/astronomy-step-by-step/) · [GitHubリポジトリ](https://github.com/koyamahr/astronomy-step-by-step)

1. このフォルダの内容をGitHubリポジトリの `main` ブランチへpushします。
2. GitHubの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定します。
3. **Actions** で **Deploy astronomy textbook to GitHub Pages** を実行します。以後 `main` へのpushで自動反映されます。

ワークフローは `docs/` のみを公開します。ルート配下・リポジトリ名配下のどちらでも動く相対パスとハッシュルーティングを使っています。公開URLはGitHubのPages画面とデプロイ結果で確認できます。

The included workflow validates and deploys `docs/` to [GitHub Pages](https://koyamahr.github.io/astronomy-step-by-step/). The source is maintained in [koyamahr/astronomy-step-by-step](https://github.com/koyamahr/astronomy-step-by-step). Further pushes to `main` update the site automatically.

設定の詳細は[GitHub公式のPagesワークフロー案内](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)も参照できます。

## 構成と編集 / Files and editing

- `docs/index.html`: HTML shell and language controls
- `docs/content.js`: all 16 bilingual lessons, formula markup, questions, and references
- `docs/app.js`: navigation, language switching, search, completion state, interactive panels
- `docs/style.css`: responsive layout, print styles, and reduced-motion support
- `scripts/check.mjs`: dependency-free content integrity checks
- `.github/workflows/pages.yml`: GitHub Pages deployment

章の本文は `content.js` の `body()` にあります。`p(日本語, English)` などのヘルパーで両言語を対応させ、数式は共有します。翻訳時には記号の定義や近似条件も対応させてください。目次の章数表示は章データから自動更新されます。章を増やす場合は検査スクリプトの期待数も更新します。

```sh
node scripts/check.mjs
```

言語設定と読了状態は `localStorage` の `astro.language` と `astro.completed` にのみ保存します。解析・追跡用サービスは使いません。言語はURLの `?lang=en` / `?lang=ja` でも指定できます。

## 初版の検証 / Initial validation

両言語の本文・メタデータ、HTMLの対応、参考資料キー、ローカル資産、JavaScript構文を `scripts/check.mjs` で検査します。ブラウザでの表示・切り替え・操作の検証結果は `VALIDATION.md` に記録します。各更新の公開結果はGitHubのActions画面でも確認できます。
