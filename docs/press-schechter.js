/* Press–Schechter: EdS spherical collapse, Gaussian mass accounting, and playback. */
(() => {
  'use strict';
  const threshold = 3 / 5 * (3 * Math.PI / 2) ** (2 / 3);
  // Twice the upper standard-normal tail, with a factored, finite Simpson integral.
  // The omitted tail is exponentially suppressed by another e^-40.
  function collapsedFraction(nu, steps = 2048) {
    if (!(Number.isFinite(nu) && nu >= 0 && Number.isInteger(steps) && steps >= 64 && steps <= 16384 && steps % 2 === 0)) throw new RangeError('Invalid peak height or Simpson step count.');
    if (nu === 0) return 1;
    if (nu > 38.6) return 0; // Below representable double-precision mass fractions.
    const end = 80 / (Math.sqrt(nu * nu + 80) + nu), h = end / steps;
    const integrand = u => Math.exp(-nu * u - u * u / 2);
    let sum = 1 + integrand(end);
    for (let i = 1; i < steps; i++) sum += (i % 2 ? 4 : 2) * integrand(i * h);
    return Math.min(1, Math.sqrt(2 / Math.PI) * Math.exp(-nu * nu / 2) * h * sum / 3);
  }
  function sphericalCollapse(theta) {
    if (!(Number.isFinite(theta) && theta >= 0 && theta <= 2 * Math.PI)) throw new RangeError('Require 0 <= theta <= 2 pi.');
    if (theta === 0) return { time: 0, radius: 0, linear: 0, nonlinear: 0 };
    const theta2 = theta * theta;
    const eta = theta < .05 ? theta ** 3 / 6 * (1 - theta2 / 20 + theta2 ** 2 / 840 - theta2 ** 3 / 60480) : theta - Math.sin(theta);
    const radial = 2 * Math.sin(theta / 2) ** 2;
    // Series avoids subtracting two nearly equal densities near the origin.
    const nonlinear = theta < .01 ? 3 * theta2 / 20 + 37 * theta2 ** 2 / 2800 : 4.5 * eta ** 2 / radial ** 3 - 1;
    return { time: eta / (2 * Math.PI), radius: radial / 2, linear: 3 / 5 * (.75 * eta) ** (2 / 3), nonlinear: theta === 2 * Math.PI ? Infinity : nonlinear };
  }
  function massShape(massRatio, spectralIndex = -2, growth = 1) {
    if (!(Number.isFinite(massRatio) && massRatio > 0 && Number.isFinite(spectralIndex) && spectralIndex > -3 && spectralIndex < 1 && Number.isFinite(growth) && growth > 0)) throw new RangeError('Require M/M0 > 0, -3 < n < 1, D > 0.');
    const p = (spectralIndex + 3) / 6, nu = massRatio ** p / growth;
    const massPerLn = Math.sqrt(2 / Math.PI) * p * nu * Math.exp(-nu * nu / 2);
    return { p, nu, sigma: threshold / nu, massPerLn, massPerDex: Math.LN10 * massPerLn, numberPerDex: Math.LN10 * massPerLn / massRatio, characteristicMass: growth ** (1 / p) };
  }

  const advanced = window.AstroAdvanced;
  Object.assign(advanced.sources, {
    ps1974: ['Press & Schechter (1974) · Formation of galaxies and clusters by self-similar gravitational condensation', 'https://articles.adsabs.harvard.edu/pdf/1974ApJ...187..425P'],
    excursion1991: ['Bond, Cole, Efstathiou & Kaiser (1991) · Excursion set mass functions, §3.1 and equation (3.9)', 'https://articles.adsabs.harvard.edu/pdf/1991ApJ...379..440B'],
    psCollapse: ['Bovy · Dynamics and Astrophysics of Galaxies, §17.2: spherical collapse', 'https://galaxiesbook.org/chapters/IV-01.-Formation-of-Dark-Matter-Halos_2-Spherical-collapse-of-overdensities-in-the-Universe.html'],
    psMass: ['Bovy · Dynamics and Astrophysics of Galaxies, §17.4: halo mass function', 'https://galaxiesbook.org/chapters/IV-01.-Formation-of-Dark-Matter-Halos_4-The-halo-mass-function.html']
  });
  const chapter = {
    id: 'press-schechter', title: ['Press–Schechter理論とハローの質量関数', 'Press–Schechter theory and the halo mass function'],
    desc: ['宇宙の密度ゆらぎを数え、どの質量のハローがどれだけ存在するかを求める。', 'Count cosmic density fluctuations to predict the abundance of dark-matter halos by mass.'],
    minutes: 40, prereq: ['宇宙膨張とJeans章、微積分、正規分布、対数', 'Cosmic expansion and Jeans chapters, calculus, normal distributions, and logarithms'],
    goal: ['球対称崩壊のしきい値、Gaussianの裾、質量と個数の換算をつなぎ、係数2と模型の適用範囲を説明する。', 'Connect spherical collapse, Gaussian tails, and mass-to-number conversion, explaining the factor of two and model limits.'],
    question: ['P(k)∝k⁻²の模型で、Dを1から1/2にするとM*は何倍か。また同じM＝M₀で、νとF(>M)はどう変わるか。', 'For P(k) ∝ k⁻², halve D from 1. How does M* change? At fixed M = M₀, what happens to ν and F(>M)?'],
    answer: ['p＝1/6なのでM*∝D⁶。M*は1/64倍になる。同じM₀ではνが1から2へ増え、質量割合Fは約0.3173から0.04550へ減る。これは個数の割合ではなく、M₀より重いハローに属する物質の質量割合である。', 'p = 1/6, so M* ∝ D⁶ and decreases by 64. At fixed M₀, ν rises from 1 to 2 and F falls from about 0.3173 to 0.04550. This is a fraction of mass in halos heavier than M₀, not a fraction of halo counts.'],
    refs: ['ps1974', 'excursion1991', 'psCollapse', 'psMass'], bridge: 'expansion'
  };
  let language = 'ja';
  const t = (ja, en) => language === 'ja' ? ja : en;
  const p = (ja, en) => `<p>${t(ja, en)}</p>`;
  const f = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
  const eq = html => `<div class="equation"><div class="math">${html}</div></div>`;
  const section = (n, ja, en, ...body) => `<section><h2><span class="step-no">${String(n).padStart(2, '0')}</span>${t(ja, en)}</h2>${body.join('')}</section>`;
  const note = (ja, en) => `<aside class="callout">${t(ja, en)}</aside>`;
  function body() {
    return [
      section(1, '小さなむらから、天体の個数へ', 'From small fluctuations to halo abundances',
        p('宇宙の平均密度から少し高い場所は、重力で物質を集める。Press–Schechter理論は、初期の密度ゆらぎの統計と崩壊の条件を結び、質量ごとにハローの個数を見積もる。ここでハローは、重力で束縛されたダークマターの構造を指す。', 'Regions slightly denser than the cosmic mean can attract more matter. Press–Schechter theory combines fluctuation statistics with a collapse criterion to estimate halo abundances by mass. A halo here means a gravitationally bound dark-matter structure.'),
        p('密度コントラストδを定義し、初めは|δ|≪1とする。<a href="#/advanced/jeans">Jeans章</a>の静止したガスとは異なり、背景の膨張を含め、圧力の無視できる物質の成長を考える。非線形な密度をいつまでも正規分布と仮定するのではなく、線形理論で外挿したδを統計の変数に使う。', 'Define density contrast δ, initially with |δ| ≪ 1. Include cosmic expansion and pressureless matter growth, extending beyond the static gas in the <a href="#/advanced/jeans">Jeans chapter</a>. The statistical variable is the linearly extrapolated contrast; the actual late nonlinear density field is not assumed to remain Gaussian.'),
        eq(`δ ≡ ${f('ρ−ρ̄','ρ̄')},　δ<sub>L</sub>(t) = D(t)δ<sub>L</sub>(t₀),　D(t₀) = 1`),
        note('以下の再生模型は、平坦・物質のみのEinstein–de Sitter宇宙を使う。この場合D＝a、a(t₀)＝1、a∝t<sup>2/3</sup>。実際のΛCDM宇宙で低赤方偏移までD＝aと置く近似ではない。', 'Playback uses a flat, matter-only Einstein–de Sitter universe: D = a, a(t₀) = 1, and a ∝ t<sup>2/3</sup>. This is not an assertion that D = a remains exact at low redshift in ΛCDM.')),
      section(2, 'どの大きさで、ならして測るか', 'Choose a mass scale by smoothing',
        p('小さな球で平均した密度と、大きな球で平均した密度は同じではない。規格化した窓Wで密度をならし、そのばらつきをσ(M,t)と書く。実空間のtop-hat窓なら半径R内を同じ重みで平均する。Rは共動半径で、最終的なハロー半径とは違う。', 'Averages over small and large regions need not agree. Smooth the field with a normalized window W and call its rms fluctuation σ(M,t). A real-space top-hat averages uniformly within a comoving radius R, which differs from the final halo radius.'),
        eq(`M = ${f('4π','3')}ρ̄<sub>m,0</sub>R³,　σ²(M,t) ≡ ⟨δ<sub>L,R</sub>²⟩<br>σ(M,t) = D(t)σ(M,t₀)`),
        p('ρ̄<sub>m,0</sub>は基準時刻の平均物質密度。共動体積で個数を数えるときは、この密度と組み合わせる。Gaussianな初期場を線形に平滑化すれば、平均0、分散σ²のGaussianになる。', 'Here ρ̄<sub>m,0</sub> is the mean matter density at the reference epoch, matching the comoving volume used for number densities. Linear smoothing of an initially Gaussian field gives a zero-mean Gaussian with variance σ².'),
        eq(`p(δ<sub>L</sub>|M,t) = ${f('1','√(2π)σ')}exp(−${f('δ<sub>L</sub>²','2σ²')})`),
        p('σは同じ質量スケールでの揺らぎの強さであって、個々のハローの密度そのものではない。大きなσほど、同じしきい値を超える場所が増える。', 'σ measures fluctuation strength at a mass scale, not the density of an individual halo. A larger σ places more of the distribution above a fixed threshold.')),
      section(3, '球対称崩壊から1.686が現れる', 'Spherical collapse gives a threshold of 1.686',
        p('一様な過密領域を、圧力のない球として考える。殻の交差を起こす前は内部質量Mが一定で、殻はR̈＝−GM/R²に従う。成長モードに対応する解は、展開パラメーターθを使って次の形で書ける。', 'Model a uniform overdense region as a pressureless sphere. Before shell crossing, each shell encloses constant mass M and obeys R̈ = −GM/R². The growing-mode solution can be written parametrically:'),
        eq(`R = A(1−cos θ),　t = B(θ−sin θ),　A³ = GMB²`),
        p('θ＝πで最大半径に達し、θ＝2πで形式上R＝0になる。背景密度ρ̄＝1/(6πGt²)と球の密度3M/(4πR³)を割り算すると、実際の非線形な密度コントラストを求められる。', 'The sphere turns around at θ = π and formally reaches R = 0 at θ = 2π. Divide its density 3M/(4πR³) by the background density 1/(6πGt²) to obtain the nonlinear contrast.'),
        eq(`1+δ<sub>NL</sub> = ${f('9','2')}${f('(θ−sin θ)²','(1−cos θ)³')}`),
        p('θが小さいとθ−sinθ≈θ³/6、δ<sub>NL</sub>≈3θ²/20。これをD∝t<sup>2/3</sup>で外挿した線形成長の式と合わせると、次のδ<sub>L</sub>になる。', 'At small θ, θ−sinθ ≈ θ³/6 and δ<sub>NL</sub> ≈ 3θ²/20. Match this to linear growth proportional to t<sup>2/3</sup>, then extrapolate:'),
        eq(`δ<sub>L</sub>(θ) = ${f('3','5')}[${f('3','4')}(θ−sin θ)]<sup>2/3</sup><br>δ<sub>c</sub> = δ<sub>L</sub>(2π) = ${f('3','5')}(${f('3π','2')})<sup>2/3</sup> ≈ 1.68647`),
        note('1.686は崩壊時の実際の密度差ではない。球が形式上潰れる時刻に、線形理論を延長して割り当てた値である。実際のハローは殻の交差やビリアル化を経る。R＝0の点まで物理的に追跡できた、という意味ではない。', '1.686 is a linearly extrapolated contrast at the formal collapse time, not the actual halo overdensity. Real halos undergo shell crossing and virialization; the singular R = 0 solution does not describe their internal evolution.')),
      section(4, 'Gaussianの裾を、質量割合へ対応させる', 'Relate a Gaussian tail to a mass fraction',
        p('ν＝δ<sub>c</sub>/σをピークの高さと呼ぶ。同じしきい値でも、σが小さければνは大きく、超える場所は稀になる。まず一つの平滑化スケールでしきい値を超える確率Pを求める。u＝δ<sub>L</sub>/σと変数変換すればよい。', 'Define peak height ν = δ<sub>c</sub>/σ. A smaller σ makes the same threshold rarer. First compute the probability P of exceeding it at one smoothing scale by substituting u = δ<sub>L</sub>/σ.'),
        eq(`P = ∫<sub>ν</sub><sup>∞</sup>${f('e<sup>−u²/2</sup>','√(2π)')}du = ${f('1','2')}erfc(${f('ν','√2')})`),
        p('Press–Schechterの処方では、Mより大きなハローに属する質量割合をF(>M)＝2Pと置く。erfcは新しい物理法則ではなく、Gaussianの裾の積分を表す関数名である。', 'The Press–Schechter prescription assigns mass fraction F(>M) = 2P to halos above M. The complementary error function erfc is a name for this Gaussian-tail integral, not an additional physical law.'),
        eq(`F(>M,t) = erfc(${f('ν','√2')}),　ν = ${f('δ<sub>c</sub>','σ(M,t)')}`),
        p('ν＝1ならP≈0.1587、F≈0.3173。ν＝2ならF≈0.04550、ν＝3なら約0.002700になる。大きなνの天体が急激に少なくなる仕組みが、指数関数の裾に入っている。係数2はここで自明に導けたわけではなく、次の節で扱う。', 'For ν = 1, P ≈ 0.1587 and F ≈ 0.3173; at ν = 2, F ≈ 0.04550, and at ν = 3, F ≈ 0.002700. The Gaussian tail makes high-ν objects rare. The factor of two has not yet been derived; it requires the next section.')),
      section(5, '係数2とcloud-in-cloud問題', 'The factor of two and cloud-in-cloud accounting',
        p('小さな領域だけではしきい値以下でも、それを含む大きな領域が崩壊する場合がある。また大きなハローの中の小さな領域を別々の独立した天体として数える危険もある。一つのスケールで上側確率を数えるだけでは、物質の所属先を決められない。', 'A region below threshold on one scale can lie inside a larger collapsing region. Smaller regions inside a larger halo can also be counted as separate objects. A single-scale tail probability alone does not consistently assign matter to halos.'),
        p('σ→∞の極限でもPは1/2までしか増えない。2倍すれば全質量を数える規格化になるが、「正負が半分ずつだから2倍」という説明だけでは、入れ子になった領域の問題は解決していない。', 'Even as σ → ∞, P approaches only 1/2. Doubling restores total-mass normalization, but symmetry between positive and negative contrasts alone does not solve the nested-region problem.'),
        p('Bondらのexcursion-set理論は、同じ位置で大きい平滑化スケールから小さいスケールへたどり、しきい値を最初に超えた場所で質量を割り当てる。Gaussian場をsharp-k窓で平滑化し、一定の障壁を使う場合、独立な増分を持つランダムウォークになり、反射原理から係数2を含む結果を導ける。', 'Excursion-set theory follows one position from large smoothing scales to small ones and assigns mass at the first threshold crossing. A Gaussian field with a sharp-k window and constant barrier has independent random-walk increments; a reflection argument yields the factor of two.'),
        `<details class="advanced"><summary>${t('発展：最初に超える分布を式で書く', 'Extension: the first-crossing distribution')}</summary>${eq(`S ≡ σ²,　f<sub>first</sub>(S) = ${f('δ<sub>c</sub>','√(2π)S<sup>3/2</sup>')}exp(−${f('δ<sub>c</sub>²','2S')})<br>F(>M) = ∫<sub>0</sub><sup>S(M)</sup>f<sub>first</sub>(S)dS`)}${p('ここでは反射原理の結果を入力とし、拡散方程式の解法までは進まない。実空間top-hat窓やGaussian窓ではステップ間に相関があり、この単純な導出をそのまま移せない。窓と質量の対応を含め、PS処方と厳密なfirst-crossing解の条件を区別する。', 'We supply the reflection-principle result without solving a diffusion equation here. Real-space top-hat and Gaussian windows correlate the steps, so this simple derivation cannot be transferred unchanged. Distinguish the PS prescription, including its mass–window mapping, from the conditions of an exact first-crossing solution.')}</details>`),
      section(6, '質量を数える式から、個数を数える式へ', 'Convert mass fractions into number densities',
        p('n(M,t)dMを共動単位体積にある質量MからM+dMのハローの個数と定義する。Fの負の微分が、この狭い区間に入る質量割合になる。それにρ̄<sub>m,0</sub>を掛け、ハロー1個の質量Mで割る。', 'Let n(M,t)dM be the number of halos per comoving volume in the interval [M,M+dM]. Minus the differential of F gives the mass fraction in this interval. Multiply by mean comoving matter density and divide by the mass per halo.'),
        eq(`M n(M,t)dM = −ρ̄<sub>m,0</sub>${f('∂F','∂M')}dM`),
        p('νがMとともに増える場合、∂F/∂ν＝−√(2/π)exp(−ν²/2)、∂ν/∂M＝(ν/M)|∂lnσ/∂lnM|。連鎖律でつなげば、質量関数が得られる。', 'When ν increases with M, ∂F/∂ν = −√(2/π)exp(−ν²/2) and ∂ν/∂M = (ν/M)|∂lnσ/∂lnM|. Apply the chain rule:'),
        eq(`n(M,t) = √(${f('2','π')})${f('ρ̄<sub>m,0</sub>','M²')}ν|${f('∂lnσ','∂lnM')}|e<sup>−ν²/2</sup>`),
        p('nの単位は「共動体積の逆数×質量の逆数」。対数質量で個数を数えるならdn<sub>halo</sub>/dlnM＝Mn(M)、質量の割合ならψ＝M²n(M)/ρ̄<sub>m,0</sub>である。縦軸に何を描くかで、同じ模型でも曲線の見え方が変わる。', 'n has units of inverse comoving volume per unit mass. Number per natural-log mass is Mn(M), whereas mass fraction per natural-log mass is ψ = M²n(M)/ρ̄<sub>m,0</sub>. These are distinct vertical axes and give different curve shapes.'),
        eq(`ψ(M,t) ≡ ${f('M²n(M,t)','ρ̄<sub>m,0</sub>')},　∫<sub>0</sub><sup>∞</sup>ψ(M,t)dlnM = 1`),
        p('これは各時刻に存在するハローの質量分布で、単位時間あたりの生成率ではない。合体で小さなハローが大きなハローに取り込まれる履歴を求めるには、条件付きの分布などへ理論を拡張する。', 'This is the distribution of halos present at each epoch, not a formation rate per unit time. Merger histories require further ingredients such as conditional mass distributions.'),
        note('この全質量の規格化は、単調に増大するσがM→0で∞へ至る理想化を含む。小スケールのパワーに切断がある模型へ無条件に当てはめない。', 'Total-mass normalization assumes monotonically increasing σ reaching infinity as M → 0. Do not impose it unchanged on a model with a small-scale cutoff.')),
      section(7, 'べき乗スペクトルで、時間発展を見通す', 'Use a power-law spectrum to expose time scaling',
        p('パワースペクトルP(k)は波数ごとの密度ゆらぎの強さを表す。P(k)∝k<sup>n</sup>とし、窓をW(kR)と書く。q＝kRへの変数変換でRの依存性を積分の外へ出せる。ここでのnはスペクトル指数で、質量関数n(M)とは別の記号の使い方である。', 'The power spectrum describes fluctuation strength by wavenumber. For P(k) ∝ k<sup>n</sup> and a window W(kR), substitute q = kR to factor out the radius dependence. Spectral index n is distinct from the mass-function notation n(M).'),
        eq(`σ²(R) = ${f('1','2π²')}∫<sub>0</sub><sup>∞</sup>k²P(k)|W(kR)|²dk ∝ R<sup>−(n+3)</sup><br>σ(M,t) ∝ D(t)M<sup>−p</sup>,　p = ${f('n+3','6')}`),
        p('実空間top-hat窓では、純粋なべき乗を全波数まで延長した積分が収束する範囲は−3&lt;n&lt;1。操作図はこの範囲内の理想模型を使う。転送関数やσ₈を使う観測宇宙論の精密計算ではない。', 'For a real-space top-hat, a pure power law extending over all wavenumbers converges for −3 < n < 1. The panel stays within this idealized range; it does not compute a transfer function or calibrate σ₈ for precision cosmology.'),
        eq(`σ(M,t) = δ<sub>c</sub>D(t)(${f('M','M₀')})<sup>−p</sup>,　ν = ${f('(M/M₀)<sup>p</sup>','D(t)')}<br>σ(M*,t) = δ<sub>c</sub>　⇒　${f('M*','M₀')} = D<sup>1/p</sup>`),
        p('M₀はD＝1でν＝1となる任意の基準質量。M*は質量で重み付けした対数分布ψの極大でもある。n＝−2ならp＝1/6でM*∝D⁶。横軸をM/M*へ換えると、同じnの曲線が重なる相似性を見られる。', 'M₀ is an arbitrary reference mass where ν = 1 at D = 1. M* also maximizes the mass-weighted logarithmic distribution ψ. For n = −2, p = 1/6 and M* ∝ D⁶. Scaling the horizontal axis by M* makes curves at fixed n overlap.'),
        '<div data-lab="press-schechter"></div>'),
      section(8, '図と論文の、どこを照合したか', 'What the plots do and do not reproduce',
        p('操作図の分布は、上で導いた式を再計算した教材図である。Bond et al. (1991)式(3.9)との対応は、同論文のA＝本章のS＝σ²、fᵥ＝δ<sub>c</sub>、|dlnA/dlnM|＝2p。この置き換えでψ＝√(2/π)pνexp(−ν²/2)が一致する。基準時刻のA＝σ²(t₀)を固定する規約なら、障壁をfᵥ＝δ<sub>c</sub>/D(t)とすれば同じνになる。', 'These teaching plots recompute the equations above. To compare with Bond et al. (1991), equation (3.9), identify their A with S = σ², their fᵥ with δ<sub>c</sub>, and |dlnA/dlnM| with 2p. This gives the same ψ = √(2/π)pνexp(−ν²/2). Equivalently, keep A = σ²(t₀) fixed and use barrier fᵥ = δ<sub>c</sub>/D(t) to obtain the same ν.'),
        p('確認しているのは、この解析式、Gaussianの裾の標準値、質量規格化、時間の比例則である。原論文の図の画像、N体計算の測定点、CDMの転送関数を用いた曲線を再現したものではない。例えばBondらのFig. 5aはCDMスペクトルであり、このべき乗模型と条件が違う。', 'Checks cover the analytic expression, standard Gaussian-tail values, mass normalization, and time scaling. These are not copies of paper figures, N-body data, or curves using a CDM transfer function. For example, Bond et al. Figure 5a uses a CDM spectrum, unlike this power-law model.'),
        p('図の出典を示すときは、式からの再計算、特定の原図の再現、観測・計算データとの比較を分ける。図の番号だけを付けて、異なる条件の曲線を同じ結果として扱わない。', 'Distinguish recomputing an equation, reproducing a named figure, and comparing measured data. A citation alone does not make curves computed under different conditions identical.')),
      section(9, 'ハローから光る銀河へ', 'From dark halos to luminous galaxies',
        p('PS理論は、初期のゆらぎからハローの統計へ進む重要な橋である。一方、ガスが冷えて星になる割合、超新星や活動銀河核による加熱、合体後の形などはこの式に含まれない。ハロー1個と可視光で数える銀河1個を、無条件に一対一対応させない。', 'PS theory bridges initial fluctuations and halo statistics. It does not specify gas cooling, star-formation efficiency, supernova or active-galactic-nucleus heating, or post-merger morphology. One halo cannot automatically be equated with one observed luminous galaxy.'),
        p('球対称のしきい値、窓の選び方、非球対称な崩壊によって予測は変わる。数値計算で較正した質量関数の代わりに精密な観測予測をするためではなく、指数的な希少性と階層的形成の仕組みを理解する道具として使おう。', 'Predictions depend on spherical-collapse assumptions, filtering, and nonspherical dynamics. Use this chapter to understand exponential rarity and hierarchical formation, with simulation-calibrated mass functions needed for more precise observational predictions.'))
    ].join('');
  }

  advanced.chapters.push(chapter);
  const order = window.AstroSeries.groups.flatMap(group => group.topics.map(topic => topic.id));
  advanced.chapters.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  const previousRender = advanced.renderBody;
  advanced.renderBody = (id, locale) => { if (id !== chapter.id) return previousRender(id, locale); language = locale; return body(); };
  // Panel is defined below; models stay usable without a browser DOM for physics checks.
  window.AstroPressSchechter = { threshold, collapsedFraction, sphericalCollapse, massShape };
})();

(() => {
  'use strict';
  const P = window.AstroPressSchechter;
  const series = (fn, a, b, count = 240) => Array.from({ length: count + 1 }, (_, i) => { const x = a + (b - a) * i / count; return { x, y: fn(x) }; });
  function chart(id, title, xLabel, yLabel, xd, yd, curves, marker, shade) {
    const X = x => 68 + (x - xd[0]) / (xd[1] - xd[0]) * 510, Y = y => 225 - (y - yd[0]) / (yd[1] - yd[0]) * 180;
    const path = ps => ps.map((p, i) => `${i ? 'L' : 'M'}${X(p.x).toFixed(3)} ${Y(p.y).toFixed(3)}`).join(' ');
    const axes = Array.from({ length: 5 }, (_, i) => {
      const x = xd[0] + (xd[1] - xd[0]) * i / 4, y = yd[0] + (yd[1] - yd[0]) * i / 4;
      return `<path d="M${X(x)} 45V225M68 ${Y(y)}H578" stroke="#d9dfd4" stroke-dasharray="3 4"/><text x="${X(x)}" y="248" text-anchor="middle">${Number(x.toPrecision(3))}</text><text x="58" y="${Y(y) + 4}" text-anchor="end">${Number(y.toPrecision(3))}</text>`;
    }).join('');
    return `<svg viewBox="0 0 640 286" role="img" aria-labelledby="${id}-title"><title id="${id}-title">${title}</title><defs><clipPath id="${id}-clip"><rect x="68" y="45" width="510" height="180"/></clipPath></defs><text x="68" y="23">${yLabel}</text>${axes}<g clip-path="url(#${id}-clip)">${shade && shade.length ? `<path d="M${X(shade[0].x)} 225 ${path(shade).replace(/^M/, 'L')}L${X(shade[shade.length-1].x)} 225Z" fill="#a8c9b8"/>` : ''}${curves.map(c => `<path d="${path(c.points)}" fill="none" stroke="${c.color || '#48715c'}" stroke-width="2.7" ${c.dash ? 'stroke-dasharray="6 4"' : ''}/>`).join('')}${marker ? `<line x1="${X(marker.x)}" x2="${X(marker.x)}" y1="45" y2="225" stroke="#b25930" stroke-dasharray="3 4"/><circle cx="${X(marker.x)}" cy="${Y(marker.y)}" r="4" fill="#b25930"/>` : ''}</g><path d="M68 45V225H578" fill="none" stroke="#8c9c8e"/><text x="323" y="276" text-anchor="middle">${xLabel}</text></svg>`;
  }
  P.mount = (el, locale) => {
    const t = (ja, en) => locale === 'ja' ? ja : en;
    const fmt = x => x.toLocaleString(locale, { maximumSignificantDigits: 4, notation: x !== 0 && (Math.abs(x) < .001 || Math.abs(x) >= 1e5) ? 'scientific' : 'standard' });
    el.className = 'lab advanced-lab';
    el.innerHTML = `<h3>${t('動かして確かめる：ゆらぎの成長とハローの分布', 'Explore: fluctuation growth and the halo distribution')}</h3>
      <p class="animation-caption">${t('再生は赤方偏移z＝3から0へ。Einstein–de Sitter模型のt/t₀が等速で進み、D＝a＝1/(1+z)が増える。画面の秒数は宇宙の年齢ではない。', 'Playback runs from redshift 3 to 0 at a constant rate in Einstein–de Sitter time t/t₀, increasing D = a = 1/(1+z). Screen seconds are not the age of the universe.')}</p>
      <label for="ps-redshift">z = <output id="ps-redshift-value" for="ps-redshift"></output></label><input id="ps-redshift" type="range" min="0" max="3" step="0.01" value="0">
      <label for="ps-index">P(k) ∝ kⁿ, n = <output id="ps-index-value" for="ps-index"></output></label><input id="ps-index" type="range" min="-2.5" max="0.5" step="0.1" value="-2">
      <label for="ps-mass">log₁₀(M/M₀) = <output id="ps-mass-value" for="ps-mass"></output></label><input id="ps-mass" type="range" min="-5" max="3" step="0.05" value="0">
      <label for="ps-axis">${t('分布図の横軸', 'Mass-distribution horizontal axis')}</label><select id="ps-axis"><option value="reference">log₁₀(M/M₀)</option><option value="selfsimilar">log₁₀(M/M*)</option></select>
      <div class="readout"><div class="stat"><small>D = a</small><strong id="ps-growth"></strong></div><div class="stat"><small>ν = δc / σ</small><strong id="ps-nu"></strong></div><div class="stat"><small>F(&gt;M)</small><strong id="ps-fraction"></strong></div><div class="stat"><small>M* / M₀</small><strong id="ps-characteristic"></strong></div></div>
      <p class="plot-scroll-hint lab-note">${t('図は横にスクロールできます。', 'Scroll the plots horizontally to read the axes.')}</p>
      <div class="gas-plot ps-normal"></div><p class="lab-note">${t('上：標準正規分布。緑の裾の面積はP＝F/2。νが4を超えると、しきい値は表示範囲の右に出る。', 'Above: the standard normal. The shaded tail has area P = F/2. A threshold ν above 4 lies to the right of the displayed range.')}</p>
      <div class="gas-plot ps-mass-function"></div><p class="lab-note">${t('下：質量割合の対数分布ln(10)ψ。個数の分布ではない。緑＝選択時刻、灰色の破線＝D＝1、赤点＝選択した質量。M/M*軸では、同じnの二曲線が重なる。有限の表示範囲の外にも質量はある。', 'Below: logarithmic mass-fraction density ln(10)ψ, not number density. Green: selected epoch; dashed gray: D = 1; red: selected mass. At fixed n the two curves coincide on the M/M* axis. Mass also exists outside the finite plotted interval.')}</p>
      <p id="ps-reading" class="lab-note" role="status"></p>
      <p class="lab-note">${t('図の位置づけ：Bond et al. (1991)式(3.9)をべき乗スペクトルで再計算。原論文の図・測定点そのものの再現ではない。FはGaussianの裾をSimpson法で積分し、極端に小さい値には浮動小数点の限界がある。', 'Provenance: Bond et al. (1991), equation (3.9), recomputed for a power-law spectrum. This does not reproduce the paper’s plotted data. F uses Simpson integration of a Gaussian tail; extremely small values are limited by floating-point precision.')}</p>`;
    const get = id => Number(el.querySelector('#' + id).value);
    const put = (id, text) => { el.querySelector('#' + id).textContent = text; };
    const normal = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
    function update() {
      const redshift = get('ps-redshift'), index = get('ps-index'), mu = 10 ** get('ps-mass'), growth = 1 / (1 + redshift), shape = P.massShape(mu, index, growth), fraction = P.collapsedFraction(shape.nu);
      for (const id of ['ps-redshift', 'ps-index', 'ps-mass']) put(id + '-value', fmt(get(id)));
      put('ps-growth', fmt(growth)); put('ps-nu', fmt(shape.nu)); put('ps-fraction', fraction === 0 ? '<10⁻³⁰⁰' : fmt(fraction)); put('ps-characteristic', fmt(shape.characteristicMass));
      el.querySelector('.ps-normal').innerHTML = chart('ps-gaussian', t('標準正規分布と崩壊しきい値', 'Standard normal and collapse threshold'), 'u = δL / σ', 'p(u)', [-4, 4], [0, .42], [{ points: series(normal, -4, 4) }], shape.nu <= 4 ? { x: shape.nu, y: normal(shape.nu) } : null, shape.nu < 4 ? series(normal, shape.nu, 4, 120) : null);
      const rescaled = el.querySelector('#ps-axis').value === 'selfsimilar', domain = rescaled ? [-5, 5] : [-9, 4];
      const distribution = (x, d) => P.massShape(10 ** x * (rescaled ? d ** (1 / shape.p) : 1), index, d).massPerDex;
      const markerX = Math.log10(mu / (rescaled ? shape.characteristicMass : 1));
      el.querySelector('.ps-mass-function').innerHTML = chart('ps-distribution', t('ハローの質量で重み付けした対数分布', 'Mass-weighted logarithmic halo distribution'), rescaled ? 'log₁₀(M/M*)' : 'log₁₀(M/M₀)', 'ln(10) ψ', domain, [0, .7], [{ points: series(x => distribution(x, 1), ...domain), color: '#89968c', dash: true }, { points: series(x => distribution(x, growth), ...domain) }], { x: markerX, y: shape.massPerDex });
      put('ps-reading', t(`t/t₀＝${fmt(growth ** 1.5)}、p＝${fmt(shape.p)}。選択した質量以上に属する質量割合F＝${fraction === 0 ? '<10⁻³⁰⁰' : fmt(fraction)}。`, `t/t₀ = ${fmt(growth ** 1.5)}; p = ${fmt(shape.p)}. The mass fraction in halos above the selected mass is F = ${fraction === 0 ? '<10⁻³⁰⁰' : fmt(fraction)}.`) + (markerX < domain[0] || markerX > domain[1] ? t(' 赤点は分布図の表示範囲外。', ' The red marker is outside the distribution plot.'): ''));
    }
    el.querySelectorAll('input,select').forEach(input => input.addEventListener('input', update));
    update();
    window.AstroAnimation.mount(el, { locale, min: .125, max: 1, read: () => (1 / (1 + get('ps-redshift'))) ** 1.5, write: time => { el.querySelector('#ps-redshift').value = (time ** (-2 / 3) - 1).toFixed(3); update(); } });
  };
})();
