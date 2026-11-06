# 理論天文学の道具箱 / Theoretical Astrophysics, Step by Step

高校数学の式変形から、微分方程式を使う標準問題へ進む、日本語・英語の静的Web教材シリーズです。入門編16章と発展編27章を公開し、発展編全27題材の学習ガイドを整理しています。

A bilingual Japanese–English series: Foundations explores the universe through school algebra; Advanced covers equilibrium, instability, transport, and similarity solutions. All 16 foundation lessons are available. All 27 advanced worked chapters are also available, organized into a nine-area learning guide.

## ローカルで読む / Read locally

追加のインストール・ビルドは不要です。Python 3のHTTPサーバーなどで `docs/` を開きます。

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory docs
```

ブラウザで <http://127.0.0.1:4173/> を開きます。`docs/index.html` を直接開く方法でも基本機能は動作しますが、読了・言語設定の保存はブラウザによって制限されます。

No installation or build is needed. Serve `docs/` with any static HTTP server. All fonts, equations, illustrations, and application assets work without a CDN. Reference links require internet access.

## 入門編 / Foundations

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

Each chapter includes learning goals, assumptions, worked algebra, a question with an expandable answer, and references. Four interactive panels explore blackbody spectra, Eddington ratios, pressure scaling, and cosmic expansion. Cosmic expansion also has user-started playback for a constant-H model, including the elapsed model time; it does not solve the actual expansion history.

現象の姿を思い浮かべる説明図10点を、関連する本文に収録しています。逆二乗則、年周視差、原子の遷移、トムソン散乱、ランダムウォーク、星の収縮と内部構造、白色矮星、光時計、宇宙膨張を図解。図中のラベル・代替テキスト・説明文は日英対応で、各図から拡大表示できます。

Ten original explanatory SVG diagrams accompany the relevant foundation lessons. Labels, alternative text, and captions switch with the language; each figure links to a larger view. Assets are local and print in black and white.

## 発展編 / Advanced

**平衡・不安定性・輸送・相似解 / Equilibrium, instability, transport, and similarity solutions**

[発展編](https://koyamahr.github.io/astronomy-step-by-step/#/advanced)は9分野・27題材。以下の27章は、導出・確認問題・操作パネル・参考資料を日英で公開しています。全題材の本文を公開しています。

1. [Lane–Emden方程式](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/lane-emden)：静水圧平衡、無次元化、中心級数、数値積分、チャンドラセカール質量の係数。
2. [Rayleigh–Taylor不安定性](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/rayleigh-taylor)：ポテンシャル流、境界条件、Atwood数、成長時間と線形近似。
3. [Kelvin–Helmholtz不安定性](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/kelvin-helmholtz)：移流、速度差、分散関係、重力による安定化と非線形混合の区別。
4. [Sedov–Taylor爆風解](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/sedov)：Rankine–Hugoniot条件、次元解析、相似方程式、内部構造、エネルギー規格化。
5. [衝撃波と粒子加速](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/shock-acceleration)：一次Fermi加速、逃走確率、べき乗指数、加速時間と限界。
6. [シンクロトロン放射](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/synchrotron)：臨界周波数、放射パワー、電子と光の指数、冷却方程式と継続注入。
7. [逆コンプトン散乱とSZ効果](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/sunyaev-zeldovich)：Compton y、電子圧力、CMBスペクトルの変化、約217 GHzの零点、運動学的SZ。
8. [角運動量輸送と降着](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/angular-momentum)：円軌道、環の間の交換、解放エネルギー、トルク収支、円盤風、α・MRIへの接続。

9. [Bonnor–Ebert球](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/bonnor-ebert)：等温球、固定外圧の質量極大、中心級数と数値積分、安定性の条件。
10. [Jeans不安定性](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/jeans)：背景重力の扱い、線形化、分散関係、Jeans長・質量・成長時間。
11. [Bondi降着](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/bondi)：等温球対称流、音速点、Bernoulli積分、降着率と断熱流への接続。
12. [Parker風](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/parker-wind)：臨界流出解、境界条件、加熱と密度の規格化。
13. [Strömgren球](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/stromgren)：Case B、光子数の保存、電離半径と再結合時間、静止ガス中の前線成長。
14. [α円盤](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/alpha-disk)：厚さ、応力と粘性の規約、定常降着、粘性時間と放射エネルギー。
15. [MRI](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/mri)：磁気張力、変位の連立方程式、四次分散関係、不安定帯と最大成長率。
16. [Toomre Q](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/toomre-q)：薄いガス円盤の重力、分散関係、Qの導出、最速波長と冷却の役割。

17. [Press–Schechter理論](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/press-schechter)：球対称崩壊、Gaussianの裾、cloud-in-cloud問題、質量関数、成長と相似性。

18. [林限界と林トラック](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/hayashi)：光球条件、対流、不透明度の近似、収縮エネルギーとH–R図。
19. [楕円体の重力ポテンシャル](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/ellipsoids)：均質楕円体の係数積分、Poisson方程式、自己重力エネルギー。
20. [テンソルビリアルとMaclaurin／Jacobi系列](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/tensor-virial)：回転系と慣性系、表面の平衡条件、分岐と安定性。
21. [Zel’dovich近似とパンケーキ](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/zeldovich)：ラグランジュ写像、体積の行列式、軌道交差前の密度と質量保存。
22. [Larson–Penston／Shuの等温崩壊](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/isothermal-collapse)：相似方程式、音速点、初期・境界条件、文献係数と内外の漸近式。
23. [2体緩和と重力散乱](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/relaxation)：弱い散乱、Coulomb対数、交差時間と半質量緩和時間。
24. [Fokker–Planck方程式](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/fokker-planck)：ドリフト、拡散、確率流、OU解析解と星団の適用条件。
25. [グラボサーマル・カタストロフィー](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/gravothermal)：負の熱容量、箱の等温球、熱力学的条件による32.1・709の違い。
26. [粘性円盤相似解](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/viscous-disk)：面密度のPDE、降着と広がり、質量と角運動量の収支。
27. [Goldreich–Julian密度](https://koyamahr.github.io/astronomy-step-by-step/#/advanced/goldreich-julian)：共回転、正味電荷、単位系、光円柱と極冠。

- 球対称の平衡と恒星：Lane–Emden、Bonnor–Ebert球、林限界と林トラック
- 回転と非球対称：楕円体ポテンシャル、テンソルビリアルとMaclaurin／Jacobi系列
- 重力不安定性と宇宙構造：Jeans不安定性・Jeans swindle、Zel’dovichパンケーキ、Press–Schechter質量関数
- 流体境界：Rayleigh–Taylor、Kelvin–Helmholtz
- 流体・高エネルギー放射：Bondi降着、Parker風、Sedov–Taylor、Rankine–Hugoniot条件、Larson–Penston／Shu、粒子加速、シンクロトロン放射
- 星団の統計力学：2体緩和、Fokker–Planck、グラボサーマル・カタストロフィー
- 円盤：角運動量輸送と降着、αモデル、MRI（Balbus–Hawley）、Lynden–Bell–Pringle相似解、Toomre Qと冷却・分裂
- 電離・散乱とガスの観測：Strömgren球、電離・再結合の釣り合い、逆コンプトン散乱とSZ効果
- 中性子星：Goldreich–Julian密度と共回転

The advanced volume now publishes all 27 bilingual worked chapters in nine areas. Each includes assumptions, equations, a question, references, and an interactive panel. Models are checked against analytic limits, reference tables, conservation laws and PDE residuals. LP/Shu panels explicitly compare asymptotes and literature eigenvalues; they do not claim to integrate full collapse profiles. Rotating-figure and gravothermal stability thresholds are supplied perturbation results, distinct from the computed equilibria.

宇宙膨張、Press–Schechter、林トラック、Zel’dovich、Fokker–Planck、粘性円盤に、再生・一時停止・最初からの操作があります。自動再生はせず、手動入力・言語変更・章移動・非表示時に停止します。平衡系列を時間発展のようには再生しません。図の出典、規格化、原図や実データとの違いを明記します。

Six panels have finite, opt-in playback. Each states the time variable or comparison parameter used; equilibrium sequences are not animated as physical evolution. Plot provenance distinguishes recomputed theoretical models from reproductions of published figures or simulation data.

## 番外編 / Numerical supplement

[宇宙物理の数字と単位](https://koyamahr.github.io/astronomy-step-by-step/?lang=ja#/appendix/numbers)を日英で公開。光速c、重力定数G、pc、h・ℏ、電子の静止質量とエネルギー、太陽質量、H₀、微細構造定数などの参照値を収録します。SIから機械的CGSへの次元による換算と、CGS–Gauss系で電磁気の式も変わる理由を説明します。

The bilingual supplement provides 12 reference cards, dimensional conversions, SI/Gaussian electromagnetic formulas, a Hubble-time slider, and converters for distance, mass, energy, and magnetic field. CODATA 2022 values, exact definitions, nominal solar scales, and illustrative H₀ values are distinguished. The supplement does not affect chapter-completion counts.

## 教え方の方針 / Teaching scope

天体現象を主役にし、物性そのものへは広げません。状態方程式、不透明度、再結合係数などは意味と適用条件を添えて入力として使います。微視的な物性や輸送係数の詳しい導出を独立の主題にはしません。

The focus is astrophysical phenomena. Material inputs are introduced with physical meaning and validity, without separate chapters on microscopic material properties.

- 入門編は微分方程式を解かず、式変形と桁の見積もりを中心にする。発展編では微分方程式を扱う。
- エントロピー極大化と未定乗数法だけは、微分を使う任意の発展欄に置く。
- 量子の準位、ラーモアの公式、アインシュタイン関係式、相対論の結果など、出発点として借りる法則を明示する。
- チャンドラセカール質量は半径が消える理由と組成依存性まで追い、精密な係数は恒星構造計算の標準結果として区別する。
- 温度のK/℃、光度と流束、線幅のFWHM、放射密度の周波数/波長の定義を区別する。
- 掲載値や理想モデルは、観測・適用範囲・組成などの条件とともに説明する。

No differential equations are solved in Foundations. Its optional entropy-maximization section uses derivatives. Advanced uses differential equations. Supplied laws, algebraic deductions, estimates, and detailed-model coefficients are explicitly distinguished.

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
- `docs/illustrations.js`: generated bilingual figure metadata and markup
- `docs/illustrations/`: ten original diagrams in Japanese and English SVG
- `docs/series.js`: bilingual series titles, volume descriptions, and the advanced syllabus
- `docs/advanced-content.js`: eight bilingual advanced worked chapters
- `docs/advanced-math.js`: dimensionless Lane–Emden and Sedov ODE solvers
- `docs/advanced-labs.js`: advanced numerical and scaling panels
- `docs/numbers.js`: bilingual constants reference, SI/Gaussian conventions, and unit-conversion panels
- `docs/app.js`: navigation, language switching, search, separate completion records for each volume, foundation panels
- `docs/style.css`: lesson layout, print styles, and reduced-motion support
- `docs/series.css`: volume cards, syllabus layout, and responsive series navigation
- `scripts/check.mjs`: dependency-free content integrity checks
- `scripts/illustrations.json` and `scripts/export-illustrations.py`: figure captions and label translations; regenerate English assets with Python 3
- `.github/workflows/pages.yml`: GitHub Pages deployment

章の本文は `content.js` の `body()` にあります。`p(日本語, English)` などのヘルパーで両言語を対応させ、数式は共有します。翻訳時には記号の定義や近似条件も対応させてください。目次の章数表示は章データから自動更新されます。章を増やす場合は検査スクリプトの期待数も更新します。

```sh
node scripts/check.mjs
```

言語設定と読了状態は `localStorage` の `astro.language`、`astro.completed`、`astro.advanced.completed` に保存します。解析・追跡用サービスは使いません。言語はURLの `?lang=en` / `?lang=ja` でも指定できます。

## 初版の検証 / Initial validation

両言語の本文・メタデータ、HTMLの対応、参考資料キー、ローカル資産、JavaScript構文を `scripts/check.mjs` で検査します。ブラウザでの表示・切り替え・操作の検証結果は `VALIDATION.md` に記録します。各更新の公開結果はGitHubのActions画面でも確認できます。

## 数値解の検算 / Numerical checks

`node scripts/check.mjs` validates all 43 worked chapters in both languages, plus the 27-topic syllabus. Press–Schechter checks cover the EdS collapse threshold, Gaussian-tail values and convergence, mass normalization, the cumulative/differential relation, self-similar scaling, and distinct mass/number measures. The final ten chapters add checks of ellipsoidal Poisson sums and Jacobi table values, the Lagrangian mass Jacobian, contraction energy, relaxation scaling, OU normalization and PDE residuals, boxed-sphere turning points, viscous-disk mass/angular momentum/PDE budgets, collapse asymptotes, and SI/Gaussian pulsar-charge consistency. New gas/disk checks cover the Bonnor–Ebert critical mass and step convergence, transonic branches and Bernoulli conservation, Jeans scaling, ionization photon balance, viscous transport scaling, and MRI/Toomre analytic thresholds. Numerical checks also compare Lane–Emden n = 1 with sin(ξ)/ξ and ξ₁ = π; n = 3 with standard structure constants and the ideal Chandrasekhar mass; and Sedov profiles with shock jumps, swept-up mass conservation, β ≈ 1.15167, and half-step convergence. RT/KH checks cover analytic growth rates, wavenumber scaling, stable density ordering, and gravity versus shear. SZ checks cover the Rayleigh–Jeans limit, thermal null, optical-depth units, pressure degeneracy, kinetic signs, photon conservation, and mean energy gain.

数値パネルは教育用の理想模型です。仮定、規格化、中心付近の処理、近似の範囲は各章に記載しています。言語と読了記録はブラウザ内に保存し、入門編・発展編で別々に管理します。

The angular-momentum chapter opens the disk area. It distinguishes specific angular momentum from orbital speed, derives the circular-orbit energy relation dE/dJ = Ω, and compares radial stress transport with wind removal. The ring panel compares circular end states rather than integrating fluid evolution; its total angular momentum and orbital-energy budget are checked automatically. The alpha, MRI, and disk-similarity chapters develop these conservation laws in detail.

Supplement checks cover parsec and nominal solar-mass conversions, electron rest energy, the Gaussian charge relation to α, dimensional factors for G, eV-to-K scales, Hubble units and inverse scaling, invalid inputs, and SI/Gaussian magnetic energy-density agreement.
