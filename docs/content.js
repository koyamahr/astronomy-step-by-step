/* Original bilingual teaching text. Equations use local HTML; no CDN is required. */
(() => {
  let language = 'ja';
  const t = (ja, en) => language === 'ja' ? ja : en;
  const diagram = id => window.AstroIllustrations.render(id, language);
  const p = (ja, en) => `<p>${t(ja, en)}</p>`;
  const f = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
  const eq = (html, ja = '', en = '') => `<div class="equation"><div class="math">${html}</div>${ja ? `<div class="caption">${t(ja, en)}</div>` : ''}</div>`;
  const s = (n, ja, en, ...body) => `<section><h2><span class="step-no">${String(n).padStart(2, '0')}</span>${t(ja, en)}</h2>${body.join('')}</section>`;
  const note = (ja, en, warning = false) => `<aside class="callout ${warning ? 'warning' : ''}">${t(ja, en)}</aside>`;
  const advanced = (ja, en, ...body) => `<details class="advanced"><summary>${t(ja, en)}</summary>${body.join('')}</details>`;
  const sources = {
    light: ['OpenStax · Radiation and spectra', 'https://openstax.org/books/astronomy-2e/pages/5-2-the-electromagnetic-spectrum'],
    atom: ['OpenStax · The Bohr model', 'https://openstax.org/books/chemistry-2e/pages/6-2-the-bohr-model'],
    pauli: ['OpenStax · The Pauli exclusion principle', 'https://openstax.org/books/college-physics/pages/30-9-the-pauli-exclusion-principle'],
    lines: ['NIST · Spectral line shapes', 'https://www.nist.gov/pml/atomic-spectroscopy-compendium-basic-ideas-notation-data-and-formulas/atomic-spectroscopy-6'],
    radius: ['NIST CODATA · Classical electron radius', 'https://physics.nist.gov/cgi-bin/cuu/Value?re'],
    thomson: ['University of Texas · Thomson scattering', 'https://farside.ph.utexas.edu/teaching/jk1/lectures/node107.html'],
    planck: ['Princeton · Radiative processes in astrophysics', 'https://www.astro.princeton.edu/~rt3504/ewExternalFiles/course_notes.pdf'],
    sun: ['OpenStax · Structure and composition of the Sun', 'https://openstax.org/books/astronomy-2e/pages/15-1-the-structure-and-composition-of-the-sun'],
    eddington: ['Princeton · Mass–luminosity relation for massive stars', 'https://www.astro.princeton.edu/~gk/A403/massive.pdf'],
    wd: ['Princeton · White dwarfs', 'https://www.astro.princeton.edu/~gk/A403/wd.pdf'],
    gr: ['JILA / University of Colorado · Schwarzschild geometry', 'https://jila.colorado.edu/~ajsh/bh/schwp.html'],
    distance: ['NASA LAMBDA · Hubble constant and distance ladder', 'https://lambda.gsfc.nasa.gov/education/graphic_history/hubb_const.html'],
    virial: ['Princeton · Astrophysics in a Nutshell: Stellar physics', 'https://assets.press.princeton.edu/chapters/s3-10772.pdf'],
    expansion: ['NASA JPL · Math of the expanding universe', 'https://www.jpl.nasa.gov/edu/resources/lesson-plan/math-of-the-expanding-universe/'],
    cosmology: ['UCLA / Ned Wright · Cosmology tutorial: Distances and scale factor', 'https://astro.ucla.edu/~wright/cosmo_02.htm'],
    helium: ['INPE · Abundance of light elements', 'https://www.gov.br/inpe/pt-br/area-conhecimento/engenharia-e-ciencias-espaciais/cgce/ciencia-espacial/astrofisica/linhas-de-pesquisa/cosmologia-cosmo/para-saber-mais-1/intro-cosmo/a-abundancia-de-elementos-leves'],
    constants: ['Particle Data Group · Astrophysical constants (2025)', 'https://pdg.lbl.gov/2025/reviews/rpp2025-rev-astrophysical-constants.pdf']
  };
  const chapters = [
    {
      id: 'tools', part: 0, minutes: 8,
      title: ['宇宙を読むための、数式の道具箱', 'A small mathematical toolkit for the universe'],
      desc: ['指数・比例・単位。式変形の「なぜ」を一つずつ。', 'Powers, proportions, and units—one algebraic step at a time.'],
      goal: ['等号と近似を区別し、比例式から変化の倍率を計算できる。', 'Distinguish equalities from estimates and calculate how a quantity scales.'],
      prereq: ['分数・平方根', 'Fractions and square roots'], refs: ['constants'],
      question: ['半径が2倍になった球。表面積と体積はそれぞれ何倍？', 'If a sphere doubles in radius, by what factors do its area and volume change?'],
      answer: ['表面積は2²＝4倍、体積は2³＝8倍。式の係数4πや4π/3は、比を取ると消えます。', 'Area grows by 2² = 4; volume grows by 2³ = 8. The geometric constants cancel when taking ratios.'],
      body: () => s(1, 'まずは「何倍になるか」', 'Start with “by what factor?”',
        p('球の表面積は A＝4πR²。半径Rを2Rに置き換えるだけで、面積の変化がわかります。宇宙物理では、このような比の計算が大きな武器になります。', 'A sphere has area A = 4πR². Replace R by 2R to find how the area changes. Ratios like this are one of the most useful tools in astrophysics.'),
        eq(`A' = 4π(2R)<sup>2</sup> = 4 × 4πR<sup>2</sup> = 4A`),
        p('a ∝ bⁿ は「aはbのn乗に比例する」という意味です。a＝Cbⁿという式で、係数Cを省いています。比を取るときはCが一定であることを確認しましょう。', 'The notation a ∝ bⁿ means a = Cbⁿ with the constant C omitted. Check that C stays fixed before using a scaling relation.')) +
        s(2, '指数をまとめる・分母を払う', 'Combine powers and clear denominators',
          eq(`R<sup>4</sup>(${f('M', 'R')})<sup>4</sup> = R<sup>4</sup>${f('M<sup>4</sup>', 'R<sup>4</sup>')} = M<sup>4</sup>`),
          p('同じ量を両辺に掛けたり、両辺を同じ量で割ったりしてよい。ただし0で割ることはできません。分数の指数は、M¹ᐟ³が立方根、M²ᐟ³がその2乗です。', 'You may multiply or divide both sides by the same quantity, provided you never divide by zero. A fractional power M^(1/3) is a cube root; M^(2/3) is its square.')) +
        s(3, '＝、≈、∼、∝を使い分ける', 'Four symbols with different jobs',
          p('<strong>＝</strong> はそのモデルでの等式。<strong>≈</strong> は数値や式の近似。<strong>∼</strong> は係数を省いた桁の見積もり。<strong>∝</strong> は一定条件での比例関係です。見積もりから厳密な係数が出たように扱わないことが大切です。', '<strong>=</strong> is an equality within a model; <strong>≈</strong> an approximation; <strong>∼</strong> an order-of-magnitude estimate with coefficients omitted; <strong>∝</strong> a scaling under fixed conditions. An estimate cannot determine an exact coefficient.')) +
        s(4, '単位も式の一部', 'Units are part of the equation',
          p('この教材は原則SI単位を使います。距離m、時間s、質量kg、温度K、エネルギーJ、光度W（J/s）です。太陽の質量M☉≈1.99×10³⁰ kg、光度L☉≈3.83×10²⁶ Wを比較の物差しにします。', 'We generally use SI: metres, seconds, kilograms, kelvin, joules, and watts (joules per second). Useful reference scales are M☉ ≈ 1.99 × 10³⁰ kg and L☉ ≈ 3.83 × 10²⁶ W.'),
          eq(`1 eV = 1.602 × 10<sup>−19</sup> J`, 'eVは小さなエネルギーを表す単位。温度は T[K]＝t[℃]＋273.15。', 'The electronvolt is a unit of energy. Temperature conversions use T[K] = t[°C] + 273.15.'),
          p('exp(x) は eˣ の別の書き方です。e≈2.718。lnはその逆で、ln(eˣ)＝xとなります。指数や対数が初めてなら、数値例から読んで構いません。', 'exp(x) means eˣ, with e ≈ 2.718. The natural logarithm reverses it: ln(eˣ) = x. If these functions are new to you, start with the numerical examples.')) +
        s(5, 'よく使う定数を、ここで確認', 'Keep these constants at hand',
          p('<strong>c</strong>：光速。<strong>G</strong>：重力の強さを決める万有引力定数。<strong>h</strong>：光の振動数をエネルギーに換えるプランク定数。<strong>ℏ＝h/(2π)</strong>：換算プランク定数。<strong>k_B</strong>：温度をエネルギーに換えるボルツマン定数。', '<strong>c</strong>: speed of light. <strong>G</strong>: gravitational constant. <strong>h</strong>: Planck’s constant, converting photon frequency to energy. <strong>ℏ = h/(2π)</strong>: reduced Planck constant. <strong>k_B</strong>: Boltzmann’s constant, converting temperature to an energy scale.'),
          eq(`G ≈ 6.674 × 10<sup>−11</sup> m<sup>3</sup>kg<sup>−1</sup>s<sup>−2</sup><br>h ≈ 6.626 × 10<sup>−34</sup> J·s<br>k<sub>B</sub> ≈ 1.381 × 10<sup>−23</sup> J/K ≈ 8.617 × 10<sup>−5</sup> eV/K`),
          p('<strong>mₑ≈9.109×10⁻³¹ kg</strong>は電子の質量、<strong>mₚ≈1.673×10⁻²⁷ kg</strong>は陽子の質量、<strong>mᵤ≈1.661×10⁻²⁷ kg</strong>は原子質量定数です。電荷の大きさを表すe≈1.602×10⁻¹⁹ Cは、指数関数の底eとは文脈で区別します。', '<strong>mₑ ≈ 9.109 × 10⁻³¹ kg</strong> is the electron mass; <strong>mₚ ≈ 1.673 × 10⁻²⁷ kg</strong> is the proton mass; <strong>mᵤ ≈ 1.661 × 10⁻²⁷ kg</strong> is the atomic mass constant. The elementary charge e ≈ 1.602 × 10⁻¹⁹ C is distinct from the base e of exponential functions; context identifies which is meant.'))
    },
    {
      id: 'distance', part: 0, minutes: 12,
      title: ['光を測る、距離を測る', 'Measuring light, measuring distance'],
      desc: ['逆二乗則から、宇宙の距離のはしごへ。', 'From the inverse-square law to the cosmic distance ladder.'],
      goal: ['光度と見かけの明るさを区別し、距離が求まる理由を説明できる。', 'Explain how luminosity differs from apparent brightness and how light reveals distance.'],
      prereq: ['比例・平方根', 'Proportions and square roots'], refs: ['light', 'distance'],
      question: ['同じ光度の星が、別の星の1/9の明るさに見えます。距離は何倍？', 'Two stars have equal luminosity. One looks nine times fainter. How much farther away is it?'],
      answer: ['3倍です。f ∝ 1/d²なので、距離の比は√9＝3。光度が同じという条件が必要です。', 'Three times farther: f ∝ 1/d², so the distance ratio is √9 = 3. Equal luminosity is essential.'],
      body: () => s(1, '光は宇宙から届く情報', 'Light carries information',
        p('電波、赤外線、可視光、紫外線、X線は、すべて電磁波です。真空中では同じ速さc≈3.00×10⁸ m/sで進みます。波長λと振動数νをつなぐのは c＝λν。光子1個のエネルギーは E＝hν＝hc/λです。', 'Radio waves, infrared, visible light, ultraviolet, and X-rays are all electromagnetic radiation. In vacuum they travel at c ≈ 3.00 × 10⁸ m/s. Wavelength λ and frequency ν obey c = λν. One photon carries E = hν = hc/λ.'),
        eq(`E[eV] ≈ ${f('1240', 'λ[nm]')}`, '500 nmの光なら約2.48 eV。短い波長ほど光子1個のエネルギーが大きい。', 'A 500 nm photon carries about 2.48 eV. Shorter wavelengths mean higher photon energies.')) +
        s(2, '光を球面に分ける', 'Spread the light over a sphere',
          p('星が1秒間に出す全エネルギーを光度Lと呼びます。距離dの球面を通る光が一様なら、1 m²に届くエネルギー流束fは、全体を面積4πd²で割った値です。', 'Luminosity L is the total energy a star emits per second. If it radiates uniformly, that energy crosses a sphere of area 4πd². The flux f is the power received per square metre.'),
          diagram('inverse-square'),
          eq(`f = ${f('L', '4πd<sup>2</sup>')}　⇒　d = √(${f('L', '4πf')})`, '吸収や方向による偏りを無視した式です。光度の単位はW、流束はW/m²。', 'This assumes no absorption and isotropic emission. Luminosity is in W; flux in W/m².')) +
        s(3, '近い星には三角測量', 'Triangulation for nearby stars',
          p('地球が太陽の周りを動くと、近い星は遠い背景に対して位置がずれます。年周視差pは、1 auの基線に対応する角度で、半年離れた最大のずれの半分です。1秒角の視差に対応する距離を1パーセク（pc）と定めます。', 'As Earth orbits the Sun, a nearby star shifts against distant background objects. Its annual parallax p corresponds to a baseline of 1 au: half the maximum shift measured six months apart. One parsec is the distance corresponding to one arcsecond.'),
          diagram('parallax'),
          eq(`d[pc] = ${f('1', 'p[arcsec]')}`, 'p＝0.05秒角なら20 pc、約65光年。光年は時間ではなく距離です。', 'A parallax of 0.05 arcseconds gives 20 pc, about 65 light-years. A light-year is a distance.')) +
        s(4, '距離のはしごは「校正の連鎖」', 'A ladder of calibrations',
          p('太陽系の測距 → 年周視差 → セファイドなどの周期–光度関係 → Ia型超新星。この順に、近くでわかった距離を使って、次の方法の本来の明るさを校正します。Ia型超新星は、光度曲線の形や色を補正して標準化します。全てが同じ明るさの爆発ではありません。', 'Solar-system ranging → stellar parallax → period–luminosity relations such as Cepheids → Type Ia supernovae. Nearby distances calibrate the intrinsic brightness used at the next stage. Type Ia supernovae must be standardized using their light-curve shapes and colours; their luminosities are not identical.'),
          eq(`v ≈ H<sub>0</sub>d,　z ≈ ${f('v', 'c')}`, '近い宇宙・小さな赤方偏移での近似。H₀は他の距離測定などで校正する必要があります。', 'Approximations for the nearby universe at small redshift. H₀ must be calibrated using other distance measurements or a cosmological model.'),
          note('遠い宇宙では単純なd＝cz/H₀は使えません。膨張の歴史を含む宇宙論モデルが必要で、距離の定義も一つではありません。', 'At large redshift, d = cz/H₀ is insufficient. You need the expansion history, a cosmological model, and a specified definition of distance.', true),
          p('<a href="#/chapter/expansion">宇宙膨張とハッブルの法則の章へ →</a>　距離が同じ割合で伸びると、なぜvが距離に比例するのかを式変形で確かめます。', '<a href="#/chapter/expansion">Continue to cosmic expansion and Hubble’s law →</a> See why uniform fractional growth makes recession speed proportional to distance.'))
    },
    {
      id: 'matter', part: 0, minutes: 9,
      title: ['星とガスと真空、宇宙を動かす力', 'Stars, gas, vacuum, and the forces of nature'],
      desc: ['電磁気力は強いのに、なぜ星では重力が効く？', 'Why does gravity govern stars when electromagnetism is so strong?'],
      goal: ['電荷の打ち消しと、重力の積み重なりを説明できる。', 'Explain charge cancellation and why gravity adds up.'],
      prereq: ['逆二乗則', 'The inverse-square law'], refs: ['sun', 'constants'],
      question: ['陽子2個の距離を2倍にしたら、電気力と重力の比は変わる？', 'If two protons are separated twice as far, does the ratio of electric to gravitational force change?'],
      answer: ['変わりません。どちらも距離の2乗に反比例するので、比ではr²が消えます。', 'No. Both forces scale as 1/r², so the distance cancels in their ratio.'],
      body: () => s(1, '宇宙の「真空」は空っぽ？', 'Is a cosmic vacuum really empty?',
        p('星の間にも原子、イオン、電子、塵、光があります。地上の空気よりはるかに薄くても、長い距離を通れば光を吸収したり散乱したりします。星の内部は高温で、原子から電子が離れたプラズマです。', 'Space between stars contains atoms, ions, electrons, dust, and radiation. Even a very dilute medium can absorb or scatter light over a long path. Hot stellar interiors are plasmas: electrons are no longer bound to individual atoms.')) +
        s(2, '二つの逆二乗則を比べる', 'Compare two inverse-square laws',
          eq(`F<sub>G</sub> = ${f('Gm<sub>p</sub><sup>2</sup>', 'r<sup>2</sup>')},　F<sub>E</sub> = ${f('e<sup>2</sup>', '4πε<sub>0</sub>r<sup>2</sup>')}`),
          eq(`${f('F<sub>E</sub>', 'F<sub>G</sub>')} = ${f('e<sup>2</sup>', '4πε<sub>0</sub>Gm<sub>p</sub><sup>2</sup>')} ≈ 1.2 × 10<sup>36</sup>`, 'eは電気素量、ε₀は真空の誘電率、mₚは陽子の質量。比は陽子同士についての値です。', 'e is the elementary charge, ε₀ the vacuum permittivity, and mₚ the proton mass. This ratio is for two protons.')) +
        s(3, '大きな天体は、ほぼ電気的に中性', 'Large objects are nearly electrically neutral',
          p('正電荷と負電荷がほぼ同数なら、遠くから見た電気力は大きく打ち消し合います。一方、通常の物質の重力は引力として積み重なります。このため、星全体のつり合いでは重力が重要になります。磁場や電磁気力が宇宙で無視できる、という意味ではありません。', 'Nearly equal positive and negative charges largely cancel the long-range electric force. Gravity from ordinary matter adds attractively. This makes gravity central to the global balance of stars, while magnetic fields and electromagnetic forces still matter in many cosmic settings.')) +
        s(4, '圧力は力を面積で割ったもの', 'Pressure is force per area',
          eq(`P = ${f('F', 'A')},　P<sub>gas</sub> = nk<sub>B</sub>T`, 'nは単位体積あたりの粒子数。理想気体の式は、粒子の衝突が生む圧力を表します。', 'n is the number of particles per unit volume. The ideal-gas equation describes pressure from particle motion.'),
          p('圧力そのものは方向を持たない量です。星を外向きに支えるのは、内側の圧力が外側より高いことで生じる力の差です。', 'Pressure itself has no direction. A star is supported by the force imbalance created when pressure is higher inside than outside.'))
    },
    {
      id: 'atom', part: 1, minutes: 12,
      title: ['原子の光と星の光 — 10.2 eVの意味', 'Atomic light and starlight: why 10.2 eV?'],
      desc: ['リュードベリの式から、ライマンα線の波長まで。', 'From the Rydberg formula to the wavelength of Lyman alpha.'],
      goal: ['水素の準位差からライマンαのエネルギーと波長を計算できる。', 'Calculate the energy and wavelength of Lyman alpha from hydrogen levels.'],
      prereq: ['光子のエネルギー・分数', 'Photon energy and fractions'], refs: ['atom', 'light'],
      question: ['水素のn＝3からn＝2への放出エネルギーは？ 紫外線でしょうか？', 'What energy is emitted in hydrogen’s n = 3 → 2 transition? Is it ultraviolet?'],
      answer: ['13.6×(1/4−1/9)≈1.89 eV。λ≈1240/1.89≈656 nmで、可視光の赤いHα線です。', '13.6 × (1/4 − 1/9) ≈ 1.89 eV. Its wavelength is about 656 nm: the red, visible Hα line.'],
      body: () => s(1, '原子には、とびとびのエネルギーがある', 'Atoms have discrete energy levels',
        p('水素原子の電子が取れるエネルギーは連続ではありません。ここでは、量子力学が与える準位の式を出発点として使います。nは1、2、3…という整数。エネルギー0は、電子が原子から離れた状態の基準です。', 'A hydrogen electron cannot have just any bound-state energy. We take the energy-level formula supplied by quantum theory as our starting point. The integer n is 1, 2, 3, …; zero energy corresponds to a separated electron and proton.'),
        diagram('atom'),
        eq(`E<sub>n</sub> ≈ −${f('13.6 eV', 'n<sup>2</sup>')}`, '単純な水素モデル。微細構造などの小さな補正は省略します。', 'A simple hydrogen model, neglecting fine structure and other small corrections.')) +
        s(2, '2から1へ落ちると、光は何eV？', 'What does a 2 → 1 transition emit?',
          eq(`E<sub>γ</sub> = E<sub>2</sub> − E<sub>1</sub> = −3.4 − (−13.6) = 10.2 eV`),
          eq(`λ = ${f('hc', 'E<sub>γ</sub>')} ≈ ${f('1240 eV·nm', '10.2 eV')} ≈ 121.6 nm`),
          p('これがライマンα（Lyα）線です。紫外線にあたり、地球の大気には強く吸収されます。宇宙の水素ガスを調べる重要な目印ですが、2→1への遷移は水素の電離ではありません。基底状態からの電離には約13.6 eVが必要です。', 'This is Lyman alpha (Lyα), an ultraviolet line strongly absorbed by Earth’s atmosphere. It is a valuable tracer of cosmic hydrogen. The 2 → 1 transition is not ionization: removing an electron from the ground state requires about 13.6 eV.')) +
        s(3, '同じことを波長で書いたリュードベリの式', 'The same idea as the Rydberg formula',
          eq(`${f('1', 'λ')} = R<sub>H</sub>(${f('1', 'n<sub>low</sub><sup>2</sup>')} − ${f('1', 'n<sub>high</sub><sup>2</sup>')})`, 'R_H≈1.097×10⁷ m⁻¹。highは上の準位、lowは下の準位。', 'R_H ≈ 1.097 × 10⁷ m⁻¹. “High” and “low” label the upper and lower levels.'),
          p('準位差の式をhcで割れば、この形になります。「別の暗記公式」ではなく、同じエネルギー保存を波長で書き直したものです。', 'Divide the energy difference by hc to obtain this expression. It is the same energy conservation statement written in terms of wavelength.')) +
        s(4, '連続光に刻まれる、原子の指紋', 'Atomic fingerprints on a continuous spectrum',
          p('高温で光学的に厚い物質は、黒体に近い連続スペクトルを出します。その手前のガスが特定の準位差に対応する光を吸収すれば、吸収線ができます。薄いガスからの放出では輝線が見えます。実際の線の強さは、元素の量だけでなく、温度・電離・光の輸送にも依存します。', 'Hot, optically thick matter emits a nearly thermal continuum. Foreground gas can absorb photons at selected transition energies, producing absorption lines. Emission from dilute gas can produce bright lines. Line strength depends on temperature, ionization, and radiation transport as well as abundance.'))
    },
    {
      id: 'width', part: 1, minutes: 13,
      title: ['スペクトル線に幅がある理由', 'Why spectral lines have width'],
      desc: ['有限の寿命と熱運動を、別々の物理として読む。', 'Read finite lifetimes and thermal motion as two distinct effects.'],
      goal: ['自然幅と熱運動幅を区別し、温度による幅の変化を計算できる。', 'Distinguish natural and thermal broadening and calculate temperature scaling.'],
      prereq: ['ドップラー効果・平方根', 'Doppler shifts and square roots'], refs: ['lines', 'planck'],
      question: ['水素ガスの温度が4倍になると、熱運動による線幅は何倍？', 'If the temperature of hydrogen gas quadruples, what happens to its thermal line width?'],
      answer: ['2倍です。熱運動幅は√(T/m)に比例します。同じ温度なら重い原子ほど狭くなります。', 'It doubles: thermal width scales as √(T/m). At the same temperature, heavier atoms have narrower thermal lines.'],
      body: () => s(1, '線の「幅」を定義する', 'First define the width',
        p('ここではピークの半分の高さで測る全幅、FWHM（半値全幅）を使います。同じ線でも、標準偏差や半幅を使うかで数値の係数が変わるので、定義をそろえる必要があります。', 'We use the full width at half maximum (FWHM): the full separation between the two half-height points. Standard deviations and half-widths have different numerical factors; always specify the convention.')) +
        s(2, '励起状態の寿命が有限だと、自然幅が生じる', 'Finite lifetimes produce natural broadening',
          p('ずっと続く完全な単色波と違って、短い時間だけ続く波には周波数の広がりがあります。寿命τの短い励起状態ほど、放出する線の自然幅が広くなります。波の解析が与える次の結果を使います。', 'A wave lasting only a finite time has a spread of frequencies, unlike an endless monochromatic wave. A shorter excited-state lifetime gives a broader natural line. We use the following result from wave analysis.'),
          eq(`Δν<sub>nat,FWHM</sub> = ${f('1', '2πτ')}`, '下の準位の寿命が十分長く、他の広がりを無視できる場合。自然線形はローレンツ型です。', 'For a long-lived lower level and negligible additional broadening. The natural profile is Lorentzian.'),
          note('「ΔEΔt≈ℏ」だけではFWHMの係数は決まりません。寿命と線形の定義を使った結果と、桁の見積もりを区別します。', 'The estimate ΔEΔt ≈ ℏ does not fix the FWHM coefficient. The exact profile convention matters.', true)) +
        s(3, '近づく原子、遠ざかる原子', 'Atoms move toward and away from us',
          eq(`${f('Δν', 'ν<sub>0</sub>')} ≈ ${f('v<sub>los</sub>', 'c')},　σ<sub>v</sub> = √(${f('k<sub>B</sub>T', 'm')})`, 'v_losは接近方向を正にとった視線速度。σ_vは1方向の速度の標準偏差。|v|≪cでの近似。', 'v_los is positive toward the observer; σ_v is the one-dimensional velocity standard deviation. We assume |v| ≪ c.'),
          eq(`Δν<sub>th,FWHM</sub> = ${f('ν<sub>0</sub>', 'c')}√(${f('8 ln 2 · k<sub>B</sub>T', 'm')})`),
          p('熱運動の視線速度がガウス分布なら、周波数の分布もガウス型になります。FWHMは標準偏差の2√(2 ln 2)≈2.355倍です。', 'A Gaussian distribution of line-of-sight thermal velocities gives a Gaussian frequency profile. Its FWHM is 2√(2 ln 2) ≈ 2.355 times the standard deviation.')) +
        s(4, '水素ガス10,000 Kで比べる', 'Compare the widths for hydrogen at 10,000 K',
          p('水素原子ではσᵥ≈9.1 km/s、熱運動FWHM≈21 km/s。Lyαのν₀≈2.47×10¹⁵ Hzを使うとΔν_th≈1.8×10¹¹ Hzです。2p状態の寿命を約1.6 nsとすると、自然幅は約1.0×10⁸ Hzとなります。', 'Hydrogen has σᵥ ≈ 9.1 km/s and a thermal FWHM of about 21 km/s. At Lyα, ν₀ ≈ 2.47 × 10¹⁵ Hz, so Δν_th ≈ 1.8 × 10¹¹ Hz. A 2p lifetime of about 1.6 ns gives a natural width near 1.0 × 10⁸ Hz.'),
          p('この例では線の中心は熱運動で大きく広がります。ただしローレンツ型の遠い裾はゆっくり減るので、自然幅が小さくても翼で重要です。両者を組み合わせたものがフォークト型。実際には衝突、乱流、自転、観測装置も線を広げます。', 'Thermal broadening dominates the core in this example, but Lorentzian wings decline slowly and can still matter far from line centre. Combining the two gives a Voigt profile. Collisions, turbulence, rotation, and instruments can add further broadening.'))
    },
    {
      id: 'scattering', part: 1, minutes: 15,
      title: ['古典的電子半径とトムソン散乱', 'The classical electron radius and Thomson scattering'],
      desc: ['電子の小さな面積が、星の明るさの限界を決める。', 'How a tiny effective area helps set a star’s luminosity limit.'],
      goal: ['rₑからσ_T、さらに不透明度κへとつなげられる。', 'Connect the scale rₑ to σ_T and then to opacity κ.'],
      prereq: ['クーロン力・エネルギー・平均値', 'Electric forces, energy, and averages'], refs: ['radius', 'thomson'],
      question: ['もし電子の質量が2倍で他の定数が同じなら、σ_Tは何倍？', 'If the electron mass doubled while other constants stayed fixed, how would σ_T change?'],
      answer: ['rₑは1/2倍、σ_Tはrₑ²に比例するので1/4倍です。', 'rₑ would halve. Since σ_T ∝ rₑ², the cross section would become one quarter as large.'],
      body: () => s(1, '電気のエネルギーと静止エネルギーを比べる', 'Compare electric and rest-energy scales',
        p('距離rでの電気的なエネルギーの尺度e²/(4πε₀r)が、電子の静止エネルギーmₑc²と等しくなる長さをrₑと定義します。両辺にrを掛け、mₑc²で割ります。', 'Define rₑ as the length at which the electric energy scale e²/(4πε₀r) equals the electron rest energy mₑc². Multiply by r, then divide by mₑc².'),
        diagram('scattering'),
        eq(`${f('e<sup>2</sup>', '4πε<sub>0</sub>r<sub>e</sub>')} = m<sub>e</sub>c<sup>2</sup>　⇒　r<sub>e</sub> = ${f('e<sup>2</sup>', '4πε<sub>0</sub>m<sub>e</sub>c<sup>2</sup>')} ≈ 2.82 × 10<sup>−15</sup> m`),
        note('これは<strong>電子の実際の半径ではありません</strong>。電磁気の定数から作った長さの尺度です。電子を球と仮定した自己エネルギーの係数は、電荷分布によって変わります。', 'This is <strong>not a measured physical radius of the electron</strong>. It is a length built from electromagnetic constants. A model of a charged sphere would have a self-energy coefficient depending on its charge distribution.', true)) +
        s(2, '光が電子を揺らし、電子が光を出す', 'Light shakes an electron, which radiates',
          p('電磁波の電場をE(t)＝E₀ cos(2πνt)とします。自由な電子は電気力を受け、加速度の振幅はa₀＝eE₀/mₑ。1周期で平均するとcos²の平均は1/2なので、⟨a²⟩＝e²E₀²/(2mₑ²)です。', 'Let the incident field be E(t) = E₀ cos(2πνt). A free electron has acceleration amplitude a₀ = eE₀/mₑ. Since the cycle average of cos² is 1/2, ⟨a²⟩ = e²E₀²/(2mₑ²).'),
          eq(`⟨P⟩ = ${f('e<sup>2</sup>⟨a<sup>2</sup>⟩', '6πε<sub>0</sub>c<sup>3</sup>')} = ${f('e<sup>4</sup>E<sub>0</sub><sup>2</sup>', '12πε<sub>0</sub>m<sub>e</sub><sup>2</sup>c<sup>3</sup>')}`, '加速する電荷が放射するラーモアの公式を出発点にします。この法則そのものの導出は扱いません。', 'We take the nonrelativistic Larmor radiation law as an input rather than deriving it here.')) +
        s(3, '散乱断面積は「放射パワー ÷ 入射流束」', 'Cross section = scattered power / incident flux',
          p('入射電磁波の平均流束は I＝ε₀cE₀²/2 です。断面積σは、幾何学的な玉の面積ではなく、入射流束を何m²ぶん集めたパワーが散乱されるかを表す有効面積です。', 'The mean incident flux is I = ε₀cE₀²/2. A scattering cross section is an effective area: it tells us how much incident power is redirected, rather than measuring a little solid ball.'),
          eq(`σ<sub>T</sub> = ${f('⟨P⟩', 'I')} = ${f('e<sup>4</sup>', '6πε<sub>0</sub><sup>2</sup>m<sub>e</sub><sup>2</sup>c<sup>4</sup>')} = ${f('8π', '3')}r<sub>e</sub><sup>2</sup>`),
          eq(`σ<sub>T</sub> ≈ 6.65 × 10<sup>−29</sup> m<sup>2</sup>`, 'E₀²が消えるので、弱い入射光の強さに依存しません。この極限では周波数にも依存しません。', 'E₀² cancels. In this weak-field limit the cross section depends on neither intensity nor frequency.')) +
        s(4, '電子1個の面積から、ガス1 kgの面積へ', 'From one electron to one kilogram of gas',
          eq(`κ<sub>e</sub> = ${f('n<sub>e</sub>σ<sub>T</sub>', 'ρ')}`, 'ρは質量密度、nₑは電子数密度。κの単位はm²/kgです。', 'ρ is mass density and nₑ electron number density. Opacity κ has units m²/kg.'),
          p('完全電離した純水素なら、陽子1個につき電子1個なのでρ≈nₑmₚ。したがってκₑ≈σ_T/mₚ≈0.040 m²/kgです。水素の質量割合Xの水素・ヘリウム混合物では、κₑ≈0.020(1＋X) m²/kg。X≈0.7なら約0.034 m²/kgになります。', 'For fully ionized pure hydrogen, one electron accompanies each proton, so ρ ≈ nₑmₚ and κₑ ≈ σ_T/mₚ ≈ 0.040 m²/kg. For a hydrogen–helium mixture with hydrogen mass fraction X, κₑ ≈ 0.020(1 + X) m²/kg, or about 0.034 at X ≈ 0.7.'),
          note('適用条件は、ほぼ静止した自由電子、弱い光、光子エネルギーhν≪mₑc²≈511 keVです。高エネルギーでは反跳を含むコンプトン散乱、束縛電子では共鳴や吸収も考える必要があります。', 'Assumptions: nearly stationary free electrons, weak fields, and hν ≪ mₑc² ≈ 511 keV. At higher energies recoil matters; for bound electrons, resonances and absorption matter too.'))
    },
    {
      id: 'thermal', part: 1, minutes: 16,
      title: ['平均自由行程、熱平衡、ボルツマン分布', 'Mean free paths, thermal equilibrium, and Boltzmann factors'],
      desc: ['ぶつかる確率から、エネルギーの分かれ方へ。', 'From the chance of a collision to the distribution of energy.'],
      goal: ['平均自由行程を計算し、熱浴からボルツマン因子が出る理由を追える。', 'Calculate a mean free path and follow why a heat bath produces Boltzmann factors.'],
      prereq: ['指数・対数（発展は微分）', 'Exponentials and logarithms; derivatives in the optional extension'], refs: ['planck', 'pauli'],
      question: ['同じ断面積の粒子が2倍の密度になったら、平均自由行程は？', 'What happens to the mean free path when the scatterer density doubles?'],
      answer: ['半分です。ℓ＝1/(nσ)。ただし相互作用の断面積が同じという条件です。', 'It halves: ℓ = 1/(nσ), assuming the interaction cross section remains unchanged.'],
      body: () => s(1, '一度ぶつかるまでの距離', 'The distance between interactions',
        p('数密度nの粒子が一様に分布し、それぞれの断面積がσなら、距離xの細い筒の中で出会う標的の目安はnσxです。平均1回に対応する距離は、nσℓ＝1から求まります。', 'If scatterers have uniform number density n and cross section σ, a narrow path of length x encounters an expected nσx targets. Set nσℓ = 1 to find the mean free path.'),
        eq(`ℓ = ${f('1', 'nσ')} = ${f('1', 'κρ')},　τ<sub>opt</sub> = ${f('R', 'ℓ')} = κρR`, '後半は一様な媒質の場合の光学的厚さ。寿命τと混同しないようτ_optと書きます。', 'The second expression is the optical depth of a uniform medium. We write τ_opt to distinguish it from a lifetime.')) +
        s(2, 'たくさん散乱すると、出口まで遠回り', 'Many scatterings make a random walk',
          p('ランダムにN回進むと、正味の距離の目安は√N ℓです。半径Rを抜けるには√N ℓ∼R、したがってN∼(R/ℓ)²。1歩にℓ/cかかるので、拡散時間の桁は次のようになります。', 'After N random steps, the net displacement is roughly √N ℓ. Escaping a region of radius R needs N ∼ (R/ℓ)² steps. Each takes ℓ/c, giving the following diffusion-time estimate.'),
          diagram('random-walk'),
          eq(`t<sub>diff</sub> ∼ ${f('R<sup>2</sup>', 'cℓ')}　(ℓ ≪ R)`),
          note('散乱だけでは必ずしも光子数や光のエネルギー分布が黒体に整うわけではありません。黒体への熱化には、十分な吸収・放出などの過程も必要です。薄いガスでは局所的な熱平衡が成り立たないこともあります。', 'Scattering alone need not establish a blackbody photon distribution. Thermalization also needs processes such as sufficient absorption and emission. Dilute gas may not be in local thermodynamic equilibrium.', true)) +
        s(3, '大きな全体は孤立、小さな一部は熱を交換', 'An isolated whole, with a subsystem exchanging heat',
          p('孤立した「小さな系＋大きな熱浴」全体では、決まった全エネルギーの微視状態を等しく数えます（ミクロカノニカルの考え方）。小さな系がエネルギーEᵢを持つ確率は、残りの熱浴がE_tot−Eᵢを持つ場合の数Ω_bathに比例します。', 'For an isolated “small system + large heat bath,” count the microstates at fixed total energy equally: the microcanonical starting point. The probability that the small system has energy Eᵢ is proportional to the bath’s number of states at E_tot − Eᵢ.'),
          eq(`S = k<sub>B</sub> ln Ω,　ΔS<sub>bath</sub> ≈ −${f('E<sub>i</sub>', 'T')}`),
          p('大きな熱浴は温度がほぼ変わらず、エネルギーをEᵢだけ失うとエントロピーが約Eᵢ/T減る、という熱力学の関係を使いました。両辺をk_Bで割って指数関数に戻すと、状態数の比は次の形です。', 'We use the thermodynamic relation that a large bath losing energy Eᵢ loses approximately Eᵢ/T of entropy while its temperature stays nearly fixed. Divide by k_B and exponentiate to obtain the ratio of state counts.'),
          eq(`p<sub>i</sub> ∝ g<sub>i</sub> exp(−${f('E<sub>i</sub>', 'k<sub>B</sub>T')})`, 'gᵢは同じエネルギーを持つ状態の数（統計的重み）。これが小系のカノニカル分布です。', 'gᵢ counts states with the same energy: their statistical weight. This is the canonical distribution of the subsystem.')) +
        s(4, '二つの準位なら、比を取るだけ', 'For two levels, simply take a ratio',
          eq(`${f('n<sub>2</sub>', 'n<sub>1</sub>')} = ${f('g<sub>2</sub>', 'g<sub>1</sub>')}exp(−${f('E<sub>2</sub>−E<sub>1</sub>', 'k<sub>B</sub>T')})`),
          p('たとえば準位差10.2 eV、T＝10⁴ Kならk_BT≈0.862 eV。指数部分はexp(−11.8)≈7.2×10⁻⁶。励起状態は熱平衡では少数になります。ただし水素全体の電離割合は別の計算が必要です。', 'For a 10.2 eV separation at 10⁴ K, k_BT ≈ 0.862 eV, giving exp(−11.8) ≈ 7.2 × 10⁻⁶. Thermal excitation is scarce. The overall ionization fraction requires a separate calculation.')) +
        advanced('発展：エントロピー極大と未定乗数 α、β', 'Extension: entropy maximization with multipliers α and β',
          p('ここだけ高校数学の微分を使います。微分方程式は使いません。古典的で独立な粒子を各準位にnᵢ個配る場合、Ω＝N! ∏gᵢⁿⁱ/nᵢ!。nᵢが十分大きいとして ln n!≈n ln n−n（スターリング近似）を使います。', 'This optional part uses derivatives, but no differential equations. For classical independent particles with populations nᵢ, Ω = N! ∏gᵢⁿⁱ/nᵢ!. At large populations use Stirling’s approximation: ln n! ≈ n ln n − n.'),
          eq(`F = ln Ω − α(Σn<sub>i</sub>−N) − β(Σn<sub>i</sub>E<sub>i</sub>−U)`),
          p('粒子数Σnᵢ＝NとエネルギーΣnᵢEᵢ＝Uを保ってlnΩを最大化します。独立なnᵢで偏微分して0と置くと、−ln(nᵢ/gᵢ)−α−βEᵢ＝0。これを指数関数に戻します。', 'Maximize lnΩ while keeping Σnᵢ = N and ΣnᵢEᵢ = U fixed. Differentiating with respect to each nᵢ gives −ln(nᵢ/gᵢ) − α − βEᵢ = 0. Exponentiate to solve.'),
          eq(`n<sub>i</sub> = g<sub>i</sub>e<sup>−α</sup>e<sup>−βE<sub>i</sub></sup>,　β = ${f('1', 'k<sub>B</sub>T')}`),
          p('最後のβの同定には熱力学のエントロピーと温度の関係を使います。αは粒子数を合わせる係数です。この数え方をそのまま光子に使うとプランク分布にはなりません。光子は粒子数が保存されないボース粒子だからです。次章ではA・B係数から導きます。', 'Identifying β uses the thermodynamic entropy–temperature relation; α normalizes particle number. Applying this classical counting directly to photons does not yield Planck’s law: photons are bosons with nonconserved number. The next chapter uses Einstein coefficients instead.'))
    },
    {
      id: 'planck', part: 1, minutes: 18,
      title: ['A・B係数からプランク分布へ', 'From Einstein A and B coefficients to Planck’s law'],
      desc: ['吸収・自然放出・誘導放出のつり合いを、式変形で解く。', 'Solve the balance of absorption, spontaneous emission, and stimulated emission.'],
      goal: ['詳細釣り合いの式をuνについて解き、分母の−1の出所を説明できる。', 'Solve detailed balance for uν and identify where the denominator’s −1 comes from.'],
      prereq: ['ボルツマン比・指数関数', 'Boltzmann ratios and exponentials'], refs: ['planck', 'light'],
      question: ['式変形で得た分母の「−1」は、三つの遷移過程のどれに由来する？', 'Which of the three processes produces the “−1” in the final denominator?'],
      answer: ['誘導放出です。吸収から誘導放出を差し引く項 n₁B₁₂−n₂B₂₁ の、第2項から現れます。', 'Stimulated emission. It comes from the second term in n₁B₁₂ − n₂B₂₁, absorption minus stimulated emission.'],
      body: () => s(1, 'まず、何を求めるか決める', 'Specify the quantity to be found',
        p('uνは単位体積・単位振動数あたりの放射エネルギー密度です。単位はJ m⁻³ Hz⁻¹。幅Δνの範囲には約uνΔνのエネルギー密度があります。二準位E₁、E₂の差はhν。n₁、n₂は準位ごとの原子数密度、g₁、g₂は統計的重みです。', 'uν is radiation energy density per unit frequency, in J m⁻³ Hz⁻¹. A narrow interval Δν contains approximately uνΔν of energy density. The two levels are separated by hν; n₁ and n₂ are their number densities and g₁ and g₂ their statistical weights.'),
        note('ここではB係数を<strong>uνを掛ける定義</strong>にそろえます。平均強度Jνを掛ける定義では係数の数値が変わります。線が十分狭く、その幅でuνがほぼ一定とします。', 'Our B coefficients multiply <strong>uν</strong>. Coefficients defined to multiply the mean intensity Jν have different numerical values. We assume a narrow line across which uν is nearly constant.')) +
        s(2, '三つの過程を書き出す', 'Write down the three processes',
          p('吸収：n₁B₁₂uν。自然放出：n₂A₂₁。誘導放出：n₂B₂₁uν。原子と放射が同じ温度で熱平衡にあるとき、上に上がる率と下に下がる率が等しくなります。', 'Absorption: n₁B₁₂uν. Spontaneous emission: n₂A₂₁. Stimulated emission: n₂B₂₁uν. When atoms and radiation share thermal equilibrium, the upward and downward transition rates balance.'),
          eq(`n<sub>1</sub>B<sub>12</sub>u<sub>ν</sub> = n<sub>2</sub>A<sub>21</sub> + n<sub>2</sub>B<sub>21</sub>u<sub>ν</sub>`)) +
        s(3, 'uνを含む項を集めて、割る', 'Collect the uν terms and divide',
          eq(`(n<sub>1</sub>B<sub>12</sub>−n<sub>2</sub>B<sub>21</sub>)u<sub>ν</sub> = n<sub>2</sub>A<sub>21</sub>`),
          eq(`u<sub>ν</sub> = ${f('A<sub>21</sub>/B<sub>21</sub>', '(n<sub>1</sub>/n<sub>2</sub>)(B<sub>12</sub>/B<sub>21</sub>)−1')}`),
          p('2行目では、分子と分母をn₂B₂₁で割っています。ここまでは熱平衡の条件を整理しただけで、まだスペクトルの形を決めきっていません。', 'In the second line we divided numerator and denominator by n₂B₂₁. So far this only rearranges the balance condition; it does not yet determine the spectrum.')) +
        s(4, 'ボルツマン比とアインシュタイン関係式を代入', 'Insert the Boltzmann ratio and Einstein relations',
          eq(`${f('n<sub>1</sub>', 'n<sub>2</sub>')} = ${f('g<sub>1</sub>', 'g<sub>2</sub>')}e<sup>hν/(k<sub>B</sub>T)</sup>,　g<sub>1</sub>B<sub>12</sub> = g<sub>2</sub>B<sub>21</sub>`),
          eq(`${f('A<sub>21</sub>', 'B<sub>21</sub>')} = ${f('8πhν<sup>3</sup>', 'c<sup>3</sup>')}`),
          p('B係数の関係は微視的な遷移の対称性に対応します。A/Bの係数は電磁波のモード数と結びつき、古典的なレイリー–ジーンズ極限との一致からも決まります。これらは追加の物理的入力です。詳細釣り合いだけから8πの係数が出るわけではありません。', 'The B relation reflects microscopic transition symmetry. The A/B ratio is linked to electromagnetic mode counting and can also be fixed by matching the classical Rayleigh–Jeans limit. These are additional physical inputs; detailed balance alone does not determine the factor 8π.')) +
        s(5, 'プランク分布に到着', 'Arrive at Planck’s law',
          eq(`u<sub>ν</sub>(T) = ${f('8πhν<sup>3</sup>', 'c<sup>3</sup>')}${f('1', 'exp(hν/k<sub>B</sub>T)−1')}`),
          p('低振動数でx＝hν/(k_BT)≪1ならeˣ−1≈x。代入するとuν≈8πν²k_BT/c³となり、レイリー–ジーンズの式を再現します。高振動数では指数関数が増加を抑えるため、短波長側へ際限なくエネルギーが増えることはありません。', 'At low frequency, x = hν/(k_BT) ≪ 1 and eˣ − 1 ≈ x. Substitution gives uν ≈ 8πν²k_BT/c³, the Rayleigh–Jeans result. At high frequency the exponential suppresses the spectrum.'),
          eq(`B<sub>ν</sub> = ${f('c', '4π')}u<sub>ν</sub>`, '等方的な熱平衡放射での関係。Bνは比強度で、uνや表面から出る流束と単位が異なります。', 'For isotropic thermal radiation. Specific intensity Bν, energy density uν, and surface flux have different units.'),
          `<div data-lab="blackbody"></div>`)
    },
    {
      id: 'virial', part: 2, minutes: 18,
      title: ['ビリアル定理 — 星は縮むと熱くなる', 'The virial theorem: why shrinking stars heat up'],
      desc: ['重力のエネルギーと熱運動を結び、負の熱容量を読む。', 'Connect gravitational energy to thermal motion and explore negative heat capacity.'],
      goal: ['2K＋U＝0から温度の尺度と、収縮で放出されるエネルギーの配分を説明できる。', 'Use 2K + U = 0 to estimate temperature and track the energy released in contraction.'],
      prereq: ['円運動・運動エネルギー・理想気体', 'Circular motion, kinetic energy, and ideal gases'], refs: ['virial', 'sun'],
      question: ['核融合のない星がゆっくり収縮し、光としてQ＝10³⁰ Jを失いました。この章のモデルでKとUはどう変化する？', 'A star without nuclear burning contracts slowly and radiates Q = 10³⁰ J. In this model, how do K and U change?'],
      answer: ['全エネルギーはΔE＝−Q。E＝−KなのでΔK＝＋10³⁰ J、U＝−2KなのでΔU＝−2×10³⁰ J。重力の位置エネルギーの減少の半分が内部の熱運動、半分が放射になります。', 'ΔE = −Q. Since E = −K, ΔK = +10³⁰ J; since U = −2K, ΔU = −2 × 10³⁰ J. Half the decrease in gravitational energy heats the gas and half is radiated.'],
      body: () => s(1, 'まず、円を回る一つの天体で確かめる', 'Begin with one body in a circular orbit',
        p('質量Mの天体の周りを、軽い天体mが半径r、速さvで円運動しているとします。重力が向心力なので、mv²/r＝GMm/r²。両辺にrを掛けるとmv²＝GMm/rになります。', 'Let a small mass m orbit a dominant mass M in a circle of radius r at speed v. Gravity supplies the centripetal force: mv²/r = GMm/r². Multiply by r to obtain mv² = GMm/r.'),
        eq(`K = ${f('mv<sup>2</sup>', '2')} = ${f('GMm', '2r')},　U = −${f('GMm', 'r')}　⇒　2K + U = 0`, 'Kは運動エネルギー、Uは重力の位置エネルギー。U＝0の基準は無限遠です。', 'K is kinetic energy and U is gravitational potential energy, with zero at infinite separation.'),
        p('円軌道ではその瞬間ごとに成り立ちます。楕円軌道や多数の粒子へ広げるときには、平均と適用条件が必要になります。', 'For a circular orbit this holds at each instant. Extending it to elliptical orbits and many particles requires averaging and conditions.')) +
        s(2, '星全体への一般化は、定理として借りる', 'Use the general theorem as a physical input',
          eq(`2⟨K⟩ + ⟨U⟩ = 0`),
          p('重力で束縛され、全体の大きさが長期的に増え続けたり減り続けたりしない系では、適切な時間平均でこの関係が得られます。⟨ ⟩は時間平均です。一般的な証明はここでは扱わず、円運動の例を手がかりに結果を使います。', 'For a gravitationally bound system whose overall extent does not keep growing or shrinking, this relation holds under suitable time averaging. Angle brackets denote time averages. We use the general result as an input, with the circular-orbit example providing intuition.'),
          note('以下では、ゆっくり進化する準静的な星を、非相対論的な単原子理想気体で支えられた自己重力系として近似します。表面での外圧、回転、磁場、放射圧を無視し、Kを粒子の熱運動エネルギーとします。激しい崩壊中や縮退・放射圧が重要な星へ、この簡単な形をそのまま使うことはできません。', 'Below we approximate a slowly evolving, quasi-static star by a self-gravitating nonrelativistic monatomic ideal gas. External surface pressure, rotation, magnetic fields, and radiation pressure are neglected, and K is the gas thermal energy. Rapid collapse, degeneracy, or dominant radiation pressure requires a different treatment.', true)) +
        s(3, '重力から、内部の温度の尺度を求める', 'Estimate an internal temperature from gravity',
          p('重力の位置エネルギーをU≈−αGM²/Rと書きます。αは密度分布に依存する無次元の構造係数です。粒子数をN＝M/(μmᵤ)、粒子1個あたりの平均運動エネルギーを3k_BT̄/2とします。T̄は粒子数で重みづけした平均温度です。', 'Write the gravitational energy as U ≈ −αGM²/R, with a dimensionless structure coefficient α depending on the density profile. Let N = M/(μmᵤ), and use a mean kinetic energy 3k_BT̄/2 per particle. T̄ is a particle-number-weighted mean temperature.'),
          eq(`2K = 3Nk<sub>B</sub>T̄ ≈ ${f('αGM<sup>2</sup>', 'R')}`),
          eq(`3${f('M', 'μm<sub>u</sub>')}k<sub>B</sub>T̄ ≈ ${f('αGM<sup>2</sup>', 'R')}　⇒　T̄ ≈ ${f('αμm<sub>u</sub>GM', '3k<sub>B</sub>R')}`),
          p('組成と構造係数を固定すればT̄ ∝ M/R。半径が半分なら平均温度は約2倍になります。太陽のMとR、μ≈0.6、例としてα＝1を使うと約460万K。これは内部の温度の尺度で、中心温度そのものや表面の5772 Kとは別です。', 'At fixed composition and structure coefficient, T̄ ∝ M/R: halving the radius approximately doubles the mean temperature. Using the Sun’s M and R, μ ≈ 0.6, and an illustrative α = 1 gives about 4.6 million K. This is an internal temperature scale, not the central temperature or the 5,772 K surface effective temperature.')) +
        s(4, '全エネルギーは、熱運動エネルギーのマイナス', 'Total energy is minus the thermal energy',
          eq(`U = −2K　⇒　E = K+U = −K = ${f('U', '2')}`),
          p('符号に注目しましょう。星が重力で束縛されているので全エネルギーは負です。同じ質量・組成でこのつり合いを保つ星が光を失ってEを小さくすると、Kは逆に大きくなります。', 'Watch the signs. A bound star has negative total energy. If it radiates while maintaining this balance at fixed mass and composition, E decreases while K increases.')) +
        s(5, '光を失うのに熱くなる：負の熱容量', 'Radiating while heating up: negative heat capacity',
          eq(`ΔE = −Q　⇒　ΔK = Q,　ΔU = −2Q　(Q &gt; 0)`),
          p('核融合などのエネルギー供給がなく、準静的に収縮する場合です。重力の位置エネルギーが2Q下がり、Qが熱運動を増やし、Qが光として外へ出ます。「半分を放射し、半分が加熱する」という関係が、式の符号だけでわかります。', 'This describes quasi-static contraction without an energy source such as nuclear burning. Gravitational energy decreases by 2Q: Q raises the thermal energy, and Q escapes as radiation. The half-and-half split follows from the signs in the energy balance.'),
          diagram('contraction'),
          note('負の熱容量は、星全体が重力による構造変化を含めて示す性質です。小さな気体の塊を体積一定で加熱したときの比熱が負になる、という意味ではありません。また、現在の太陽の主な光源は重力収縮ではなく核融合です。', 'Negative heat capacity here describes the whole self-gravitating system, including structural change. It does not mean a small gas sample has negative heat capacity at fixed volume. The present Sun is powered mainly by nuclear fusion, not contraction.'),
          p('<a href="#/chapter/structure">星の構造と質量–光度関係へ →</a>　次は重力が決める温度と、光が内部を運ばれる速さをつなぎます。', '<a href="#/chapter/structure">Continue to stellar structure and mass–luminosity scaling →</a> Connect the gravitational temperature scale to the transport of light.'))
    },
    {
      id: 'structure', part: 2, minutes: 17,
      title: ['星の構造と、質量–光度関係', 'Stellar structure and the mass–luminosity relation'],
      desc: ['重力・圧力・光のランダムウォークを結ぶ。', 'Connect gravity, pressure, and the random walk of radiation.'],
      goal: ['仮定を確認しながらL ∝ M³の式変形を追える。', 'Follow the algebra leading to L ∝ M³ and state its assumptions.'],
      prereq: ['理想気体・平均自由行程', 'Ideal gases and mean free paths'], refs: ['eddington', 'sun'],
      question: ['L ∝ M³が成り立つなら、質量2倍の星の光度と燃料寿命の比は？', 'If L ∝ M³, how do luminosity and fuel lifetime change when mass doubles?'],
      answer: ['光度は8倍。同じ燃料割合を使うなら寿命∝M/Lなので1/4倍。ただし進化や混合を省いた見積もりです。', 'Luminosity rises by 8. If the usable fuel fraction is unchanged, lifetime ∝ M/L drops to 1/4. This neglects evolution and mixing.'],
      body: () => s(1, '圧力に必要な大きさを見積もる', 'Estimate the pressure required for support',
        p('質量M、半径Rの星を、係数を省いた一つの塊として扱います。重力の力の尺度はGM²/R²。それを面積R²で割ると、支えに必要な圧力の尺度が得られます。', 'Treat a star of mass M and radius R as a single region, omitting geometric coefficients. A gravitational force scale is GM²/R². Divide by an area of order R² to estimate the supporting pressure.'),
        diagram('stellar-structure'),
        eq(`ρ ∼ ${f('M', 'R<sup>3</sup>')},　P<sub>c</sub> ∼ ${f('GM<sup>2</sup>', 'R<sup>4</sup>')}`),
        p('中心に向かうほど圧力が高い構造が必要です。これは恒星内部の詳しい分布を解いた式ではなく、代表値の桁をつなぐ式です。', 'The star needs higher pressure toward its centre. These are representative scale estimates, not a solution for the internal profiles.')) +
        s(2, '理想気体なら、中心温度はM/Rに比例', 'For gas-pressure support, central temperature scales as M/R',
          eq(`P<sub>c</sub> ∼ ${f('ρk<sub>B</sub>T<sub>c</sub>', 'μm<sub>u</sub>')}　⇒　T<sub>c</sub> ∼ ${f('μm<sub>u</sub>GM', 'k<sub>B</sub>R')}`),
          p('μは粒子1個あたりの平均質量を原子質量定数mᵤで割った値です。右辺はKの単位になります。組成を固定するとT_c ∝ M/R。表面の有効温度T_effとは別の量です。', 'μ is the mean mass per gas particle in units of the atomic mass constant mᵤ. The right-hand side has units of kelvin. At fixed composition, T_c ∝ M/R. This central temperature is different from the surface effective temperature T_eff.'),
          p('<a href="#/chapter/virial">ビリアル定理の章</a>では、星全体のエネルギーから同じM/Rの尺度を求めます。', 'The <a href="#/chapter/virial">virial theorem chapter</a> obtains the same M/R scaling from the star’s global energy.')) +
        s(3, '光が拡散して出るときの光度', 'Luminosity from radiative diffusion',
          p('熱平衡に近い内部の放射エネルギー密度をaT_c⁴とすると、蓄えられた放射エネルギーの尺度はaT_c⁴R³。拡散時間t_diff∼R²/(cℓ)で割り、ℓ＝1/(κρ)を代入します。aは放射定数です。', 'In a nearly thermal interior, radiation energy density scales as aT_c⁴, giving stored radiation energy of order aT_c⁴R³. Divide by t_diff ∼ R²/(cℓ) and insert ℓ = 1/(κρ). Here a is the radiation constant.'),
          eq(`L ∼ acT<sub>c</sub><sup>4</sup>Rℓ ∼ ${f('acRT<sub>c</sub><sup>4</sup>', 'κρ')} ∼ ${f('acR<sup>4</sup>T<sub>c</sub><sup>4</sup>', 'κM')}`)) +
        s(4, 'Rの4乗が消える', 'The fourth powers of R cancel',
          eq(`L ∝ ${f('R<sup>4</sup>(M/R)<sup>4</sup>', 'κM')} = ${f('M<sup>3</sup>', 'κ')}`),
          note('L ∝ M³は、組成一定、ほぼ一定の不透明度、気体圧が重要で、主に放射輸送する相似な星を想定したモデルです。対流が支配する低質量星や、放射圧が強い非常に重い星に同じ指数を押し付けることはできません。', 'L ∝ M³ assumes fixed composition, nearly constant opacity, important gas-pressure support, and similar radiatively transporting structures. It is not universal: convection in low-mass stars and radiation pressure in very massive stars change the relation.', true)) +
        advanced('発展：核反応の温度依存性と半径', 'Extension: nuclear temperature sensitivity and stellar radius',
          p('単位質量あたりのエネルギー生成率をε ∝ ρT_c^ηと近似すると、L_nuc∼Mε ∝ M^(η＋2)/R^(η＋3)。これを同じ一定κモデルのL ∝ M³と等置します。', 'Approximate energy production per unit mass by ε ∝ ρT_c^η. Then L_nuc ∼ Mε ∝ M^(η + 2)/R^(η + 3). Equate this to L ∝ M³ in the same constant-opacity model.'),
          eq(`R<sup>η+3</sup> ∝ M<sup>η−1</sup>　⇒　R ∝ M<sup>(η−1)/(η+3)</sup>`),
          eq(`T<sub>eff</sub> ∝ (${f('L', 'R<sup>2</sup>')})<sup>1/4</sup> ∝ M<sup>(η+11)/[4(η+3)]</sup>`),
          p('η≈16ならR ∝ M^0.79、T_eff ∝ M^0.355。これは限られた条件でのスケーリングで、実際の主系列全体を表す精密式ではありません。不透明度を変えれば、導出もやり直す必要があります。', 'For η ≈ 16 this gives R ∝ M^0.79 and T_eff ∝ M^0.355. These are restricted-model scalings, not precision formulas for the whole main sequence. Changing the opacity law requires redoing the derivation.'))
    },
    {
      id: 'sun', part: 2, minutes: 11,
      title: ['太陽の表面は、なぜ約6000度？', 'Why is the Sun’s surface about 6,000 degrees?'],
      desc: ['光度と半径から、5772 Kを計算する。', 'Calculate 5,772 K from luminosity and radius.'],
      goal: ['有効温度を計算し、「測った値からの計算」と「理論予測」を区別できる。', 'Calculate effective temperature and distinguish inference from a theoretical prediction.'],
      prereq: ['4乗根・黒体放射', 'Fourth roots and blackbody radiation'], refs: ['sun', 'light', 'constants'],
      question: ['半径が同じで光度が16倍の星は、有効温度が何倍？', 'At the same radius, how does effective temperature change if luminosity increases by 16?'],
      answer: ['2倍です。T_eff ∝ L¹ᐟ⁴。16の4乗根は2です。', 'It doubles: T_eff ∝ L^(1/4), and the fourth root of 16 is 2.'],
      body: () => s(1, 'まず「表面」と「度」をはっきりさせる', 'Clarify “surface” and “degrees”',
        p('太陽には地面のような固い表面はありません。可視光が逃げ出す層を光球と呼びます。有効温度は約5772 K、摂氏では約5500℃。「約6000度」は粗い丸めで、6000 Kと6000℃は同じではありません。', 'The Sun has no solid surface. Its photosphere is the layer from which visible light escapes. Its effective temperature is about 5,772 K, or about 5,500°C. “About 6,000 degrees” is a rough statement; 6,000 K and 6,000°C are different.')) +
        s(2, '出ていくパワー＝面積×1 m²あたりのパワー', 'Total power = area × power per unit area',
          eq(`F = σ<sub>SB</sub>T<sup>4</sup>,　L = 4πR<sup>2</sup>σ<sub>SB</sub>T<sub>eff</sub><sup>4</sup>`, 'σ_SB≈5.670×10⁻⁸ W m⁻² K⁻⁴はステファン–ボルツマン定数。散乱断面積σ_Tとは別です。', 'σ_SB ≈ 5.670 × 10⁻⁸ W m⁻² K⁻⁴ is the Stefan–Boltzmann constant, distinct from σ_T.'),
          eq(`T<sub>eff</sub> = (${f('L', '4πR<sup>2</sup>σ<sub>SB</sub>')})<sup>1/4</sup>`),
          p('L☉＝3.828×10²⁶ W、R☉＝6.957×10⁸ mを代入すると約5772 Kです。有効温度は「同じ半径・同じ光度の黒体の温度」という定義なので、実際のスペクトルが完全な黒体でなくても定義できます。', 'Insert L☉ = 3.828 × 10²⁶ W and R☉ = 6.957 × 10⁸ m to obtain about 5,772 K. Effective temperature means the temperature of a blackbody with the same radius and luminosity, even if the actual spectrum is not exactly blackbody.')) +
        s(3, 'この計算は、どこまで「なぜ」に答えた？', 'How much of “why” have we answered?',
          p('観測された光度と半径を使えば、温度は計算できます。しかし太陽の質量・組成だけから光度と半径まで予言するには、重力平衡、核融合、放射輸送、対流を結ぶ恒星モデルが必要です。平均自由行程だけで6000度が一意に決まるわけではありません。', 'Measured luminosity and radius determine effective temperature. Predicting luminosity and radius from mass and composition requires a stellar model combining gravity, nuclear reactions, radiation transport, and convection. A mean free path alone cannot select 6,000 degrees.'),
          p('内部では吸収・放出・散乱とエネルギー輸送が何度も起こります。中心から来た光子が単に少しずつ冷える、という描像では不十分です。外向きの光学的厚さが1程度になると、光は外へ逃げやすくなります。', 'Inside the Sun, absorption, emission, scattering, and energy transport happen repeatedly. It is insufficient to picture a single core photon merely cooling on its way out. Escape becomes likely where the outward optical depth is of order unity.')) +
        s(4, '色から測る、もう一つの温度', 'A second thermometer: the spectral shape',
          eq(`λ<sub>max</sub>T ≈ 2.898 × 10<sup>−3</sup> m·K`, '波長あたりの黒体スペクトルBλのピークに対するウィーンの変位則です。', 'Wien’s displacement law for the peak of the wavelength spectrum Bλ.'),
          p('5772 Kならλ_max≈502 nm。これは「太陽が緑色だけを出す」という意味ではなく、幅広い波長の光を出しています。振動数あたりのBνのピークをc/νで換算しても、Bλのピークとは一致しません。分布の横軸と単位が違うためです。', 'At 5,772 K the Bλ peak is near 502 nm. The Sun emits a broad spectrum, not just green light. Converting the peak of Bν using c/ν does not give the Bλ peak, because the spectral density is defined per a different variable.'))
    },
    {
      id: 'eddington', part: 2, minutes: 15,
      title: ['エディントン限界 — 光が重力とつり合うとき', 'The Eddington limit: when light balances gravity'],
      desc: ['トムソン散乱から、明るさの限界を導く。', 'Use Thomson scattering to derive a characteristic luminosity limit.'],
      goal: ['力を等置し、r²が消えてL_Edd＝4πGMc/κとなる過程を追える。', 'Balance forces and see why r² cancels, giving L_Edd = 4πGMc/κ.'],
      prereq: ['光の運動量・不透明度', 'Photon momentum and opacity'], refs: ['eddington', 'thomson'],
      question: ['κが一定なら、中心天体の質量が10倍になるとL_Eddは？ 半径が2倍なら？', 'At fixed κ, what happens to L_Edd if the central mass grows by ten? What if radius doubles?'],
      answer: ['質量10倍なら限界光度も10倍。このモデルでは半径に依存しません。重力と放射による加速度がともに1/r²で減るためです。', 'Ten times the mass gives ten times the limiting luminosity. Radius cancels because both accelerations fall as 1/r².'],
      body: () => s(1, '光子はエネルギーだけでなく運動量も運ぶ', 'Photons carry momentum as well as energy',
        eq(`p<sub>γ</sub> = ${f('E<sub>γ</sub>', 'c')},　f = ${f('L', '4πr<sup>2</sup>')}`),
        p('物質が光を吸収・散乱すると運動量を受け取ります。トムソン散乱の角度平均では、入射方向の運動量を流束fと有効断面積から数えられます。電場によって電子とイオンが結びつき、ガス全体が押されると考えます。', 'Matter gains momentum by absorbing or scattering radiation. For Thomson scattering, angular averaging lets us use the flux and effective cross section for the net radial momentum transfer. Electric fields couple electrons to ions, so the gas moves together.')) +
        s(2, 'まず純水素の電子＋陽子で考える', 'Start with an electron–proton pair',
          eq(`F<sub>rad</sub> = ${f('σ<sub>T</sub>L', '4πr<sup>2</sup>c')},　F<sub>grav</sub> ≈ ${f('GMm<sub>p</sub>', 'r<sup>2</sup>')}`, '中心天体の質量がM、周囲は完全電離した純水素。電子の重さは陽子に比べて無視します。', 'M is the central mass; the surrounding gas is fully ionized pure hydrogen. Electron mass is negligible compared with proton mass.')) +
        s(3, '二つの力を等しくして、r²を消す', 'Equate the forces and cancel r²',
          eq(`${f('σ<sub>T</sub>L', '4πr<sup>2</sup>c')} = ${f('GMm<sub>p</sub>', 'r<sup>2</sup>')}`),
          eq(`σ<sub>T</sub>L = 4πGMm<sub>p</sub>c　⇒　L<sub>Edd</sub> = ${f('4πGMm<sub>p</sub>c', 'σ<sub>T</sub>')}`),
          p('太陽質量1個ぶんに対して約1.26×10³¹ W、約3.3×10⁴ L☉です。質量Mに比例します。ここまで、微分方程式を解かずに係数まで求まりました。', 'For one solar mass this is approximately 1.26 × 10³¹ W, or 3.3 × 10⁴ L☉, scaling linearly with M. We obtained the coefficient from a force balance without solving a differential equation.')) +
        s(4, '組成が違うときは、不透明度で書く', 'Use opacity for a different composition',
          eq(`a<sub>rad</sub> = ${f('κL', '4πr<sup>2</sup>c')},　a<sub>grav</sub> = ${f('GM', 'r<sup>2</sup>')}`),
          eq(`L<sub>Edd</sub> = ${f('4πGMc', 'κ')}`),
          `<div data-lab="eddington"></div>`,
          note('これは球対称・定常・一定の有効不透明度を仮定したつり合いです。円盤、非一様なガス、一時的な現象などでは、この光度を超える放射がありえます。あらゆる天体に適用する絶対的な明るさの上限ではありません。', 'This balance assumes spherical symmetry, steady conditions, and a specified effective opacity. Disks, inhomogeneous gas, and transient events can exceed this luminosity. It is not an absolute cap on every astronomical source.', true))
    },
    {
      id: 'chandra', part: 2, minutes: 20,
      title: ['チャンドラセカール質量 — 白色矮星の限界', 'The Chandrasekhar mass: a white dwarf’s limit'],
      desc: ['量子の圧力と相対論が出会うと、半径が式から消える。', 'Quantum pressure meets relativity—and radius disappears from the balance.'],
      goal: ['なぜ限界質量が現れるかを、圧力の指数と半径の約分から説明できる。', 'Explain why a limiting mass appears by comparing pressure exponents and cancelling radius.'],
      prereq: ['指数・重力の圧力尺度', 'Powers and the gravitational pressure scale'], refs: ['pauli', 'wd', 'constants'],
      question: ['超相対論的な電子の圧力と重力の圧力は、半径を半分にしたとき何倍？', 'In the ultrarelativistic limit, how do degeneracy and gravitational pressure scales change if radius halves?'],
      answer: ['どちらも16倍です。ともにR⁻⁴に比例するため、縮むだけでは支える側が重力に追いつけません。', 'Both increase by 16, since both scale as R⁻⁴. Shrinking no longer improves pressure support relative to gravity.'],
      body: () => s(1, '冷えても残る、電子の縮退圧', 'Electron degeneracy pressure survives cooling',
        p('白色矮星は、主に電子の縮退圧で支えられた高密度の天体です。パウリの排他原理により、同じ量子状態を二つの電子が占めることはできません。空間状態には異なるスピンの電子が2個まで入るため、多数の電子を詰めると、高い運動量の状態まで埋まります。', 'A white dwarf is supported mainly by electron degeneracy pressure. The Pauli exclusion principle forbids two electrons from occupying the same full quantum state. A spatial state holds at most two opposite-spin electrons, so packing many electrons fills states up to high momenta.'),
        diagram('white-dwarf'),
        p('電子数密度をnₑ、平均間隔をdとするとd∼nₑ⁻¹ᐟ³。量子状態の数え上げは代表的な運動量の尺度p_F∼ℏ/dを与えます。不確定性の考え方は直感の助けになりますが、それだけで排他原理を導けるわけではありません。', 'For number density nₑ, a spacing scale is d ∼ nₑ^(−1/3). Counting quantum states gives a characteristic momentum p_F ∼ ℏ/d. Uncertainty offers intuition, but does not by itself derive the exclusion principle.'),
        eq(`p<sub>F</sub> ∼ ℏn<sub>e</sub><sup>1/3</sup>,　n<sub>e</sub> = ${f('ρ', 'μ<sub>e</sub>m<sub>u</sub>')}`, 'μₑは電子1個あたりの質量をmᵤで割った値。炭素・酸素の完全電離ガスなら約2です。', 'μₑ is mass per electron in units of mᵤ. It is about 2 for fully ionized carbon or oxygen.')) +
        s(2, 'ゆっくりした電子なら、P ∝ ρ⁵ᐟ³', 'Nonrelativistic electrons give P ∝ ρ^(5/3)',
          p('圧力は「粒子数密度×運動量×速度」の尺度P∼nₑpvで見積もれます。低速ならv≈p/mₑ。p∼ℏnₑ¹ᐟ³を代入します。', 'A pressure scale is number density × momentum × speed: P ∼ nₑpv. At low speeds, v ≈ p/mₑ. Insert p ∼ ℏnₑ^(1/3).'),
          eq(`P<sub>NR</sub> ∼ ${f('n<sub>e</sub>p<sub>F</sub><sup>2</sup>', 'm<sub>e</sub>')} ∼ ${f('ℏ<sup>2</sup>', 'm<sub>e</sub>')}n<sub>e</sub><sup>5/3</sup> ∝ ρ<sup>5/3</sup>`),
          p('ρ∼M/R³ならP_NR∝M⁵ᐟ³/R⁵。一方、重力の圧力尺度はP_G∼GM²/R⁴。半径を小さくすると電子の圧力のほうが速く増すので、つり合う半径を調整できます。組成一定で等置するとR ∝ M⁻¹ᐟ³です。', 'With ρ ∼ M/R³, P_NR ∝ M^(5/3)/R⁵, whereas P_G ∼ GM²/R⁴. Shrinking makes degeneracy pressure grow faster, allowing a new equilibrium radius. At fixed composition, balancing the scalings gives R ∝ M^(−1/3).')) +
        s(3, '相対論が、指数を変える', 'Relativity changes the exponent',
          eq(`E<sup>2</sup> = p<sup>2</sup>c<sup>2</sup> + m<sub>e</sub><sup>2</sup>c<sup>4</sup>`),
          p('これは特殊相対論から与えられるエネルギーと運動量の関係です。p≫mₑcならE≈pc、v≈c。pは増え続けても、速度はcに近づくだけです。したがって圧力の見積もりは次の形に変わります。', 'This energy–momentum relation is an input from special relativity. At p ≫ mₑc, E ≈ pc and v ≈ c. Momentum keeps increasing while speed approaches c. The pressure scaling changes to:'),
          eq(`P<sub>UR</sub> ∼ n<sub>e</sub>p<sub>F</sub>c ∼ ℏc n<sub>e</sub><sup>4/3</sup> ∼ ${f('ℏc', '(μ<sub>e</sub>m<sub>u</sub>)<sup>4/3</sup>')}${f('M<sup>4/3</sup>', 'R<sup>4</sup>')}`)) +
        s(4, '半径が消え、質量の尺度が残る', 'Cancel radius to expose a mass scale',
          eq(`${f('ℏc M<sup>4/3</sup>', '(μ<sub>e</sub>m<sub>u</sub>)<sup>4/3</sup>R<sup>4</sup>')} ∼ ${f('GM<sup>2</sup>', 'R<sup>4</sup>')}`),
          eq(`M<sup>2/3</sup> ∼ ${f('ℏc', 'G(μ<sub>e</sub>m<sub>u</sub>)<sup>4/3</sup>')}　⇒　M ∼ (${f('ℏc', 'G')})<sup>3/2</sup>${f('1', '(μ<sub>e</sub>m<sub>u</sub>)<sup>2</sup>')}`),
          p('両辺をM⁴ᐟ³で割り、最後に両辺を3/2乗しました。両方の圧力がR⁻⁴に比例するため、半径を調整する自由が消えます。これが限界質量が現れる核心です。', 'Divide by M^(4/3), then raise both sides to the power 3/2. Both pressures scale as R⁻⁴, so changing the radius no longer changes their ratio. This is the central reason a limiting mass appears.'),
          `<div data-lab="compression"></div>`) +
        s(5, '約1.4太陽質量の係数は、どこから？', 'Where does the coefficient near 1.4 solar masses come from?',
          note('ここまでの∼の計算では、正確な係数を捨てています。冷たく、非回転で、理想的な縮退電子を持つ球対称の星について、内部構造を詳しく計算した標準結果を、ここで借ります。', 'The estimates above deliberately omitted numerical coefficients. We now use the standard result from a detailed structure calculation for a cold, nonrotating, spherical star with ideal degenerate electrons.'),
          eq(`M<sub>Ch</sub> ≈ ${f('5.83', 'μ<sub>e</sub><sup>2</sup>')}M<sub>☉</sub> ≈ 1.46 (${f('2', 'μ<sub>e</sub>')})<sup>2</sup>M<sub>☉</sub>`),
          p('μₑを原子質量定数基準で定義した理想モデルでは約1.46 M☉、通常は「約1.4 M☉」と呼びます。定義や補正で1.44などの数値も現れます。実際の限界や進化には組成、電子捕獲、核反応、一般相対論、回転などが影響します。', 'With μₑ defined using the atomic mass constant, this ideal model gives about 1.46 M☉, commonly summarized as “about 1.4 M☉.” Different conventions and corrections also lead to values such as 1.44. Composition, electron capture, nuclear reactions, general relativity, and rotation affect real evolution.'),
          p('限界を超えたら必ず同じ爆発をするわけではありません。白色矮星の組成や物質が増える過程により、熱核暴走や崩壊など、行き先は異なります。', 'Crossing a limiting mass does not guarantee one particular explosion. Composition and accretion history help determine whether thermonuclear runaway, collapse, or another outcome occurs.'))
    },
    {
      id: 'relativity', part: 2, minutes: 16,
      title: ['一般相対論への入口 — 光と時計と重力', 'An entry to general relativity: light, clocks, and gravity'],
      desc: ['脱出速度の見積もりから、ブラックホールの半径と時間へ。', 'From escape-speed estimates to black-hole radii and gravitational time dilation.'],
      goal: ['ニュートン力学の見積もりと、一般相対論から与える結果を区別できる。', 'Distinguish Newtonian estimates from results supplied by general relativity.'],
      prereq: ['エネルギー保存・平方根', 'Energy conservation and square roots'], refs: ['gr', 'constants'],
      question: ['太陽と同じ質量のブラックホールは、遠くにある惑星を太陽より強く引く？', 'Would a black hole of one solar mass pull a distant planet more strongly than the Sun?'],
      answer: ['同じ距離で球対称なら、遠方の重力は同じ質量で決まります。ブラックホールの特徴は、小さな半径まで近づけることと、事象の地平面があることです。', 'At the same distant radius in spherical symmetry, the gravity depends on the same mass. What differs is the compactness and the presence of an event horizon.'],
      body: () => s(1, '特殊相対論：光時計を三平方で読む', 'Special relativity: a light clock and Pythagoras',
        p('向かい合った鏡の間を光が往復する時計を考えます。時計と一緒の人には片道の距離がℓ、時間がt₀＝ℓ/c。時計が横に速さvで動くと見る人には、光が斜めの道を通ります。光速が同じcであることを使います。', 'Imagine a clock made of light bouncing between mirrors. In its rest frame, a one-way trip covers ℓ in t₀ = ℓ/c. An observer seeing the clock move sideways at speed v sees a diagonal light path. Both measure light speed c.'),
        diagram('light-clock'),
          eq(`(ct)<sup>2</sup> = ℓ<sup>2</sup> + (vt)<sup>2</sup>　⇒　t = ${f('t<sub>0</sub>', '√(1−v<sup>2</sup>/c<sup>2</sup>)')}`),
          p('同じ二つの時計の出来事について、動く時計の固有時間t₀より、外の慣性系の時間tのほうが長くなります。これは重力の効果とは別の、特殊相対論の時間の遅れです。', 'For these same two clock events, the inertial-frame interval t exceeds the moving clock’s proper interval t₀. This is special-relativistic time dilation, distinct from gravitational time dilation.')) +
        s(2, 'ニュートン力学で、脱出速度を見積もる', 'Estimate escape speed using Newtonian mechanics',
          eq(`${f('1', '2')}mv<sub>esc</sub><sup>2</sup> = ${f('GMm', 'R')}　⇒　v<sub>esc</sub> = √(${f('2GM', 'R')})`),
          p('試しにv_esc＝cと置くとR＝2GM/c²が得られます。ただし光子に運動エネルギーmv²/2を適用できるわけではありません。この操作は特徴的な長さを見積もるヒントです。', 'Formally setting v_esc = c yields R = 2GM/c². But mv²/2 is not the kinetic energy of a photon. This is a clue to a length scale, not a derivation of a relativistic horizon.')) +
        s(3, '一般相対論の結論：シュヴァルツシルト半径', 'The relativistic result: Schwarzschild radius',
          eq(`r<sub>s</sub> = ${f('2GM', 'c<sup>2</sup>')} ≈ 2.95 (${f('M', 'M<sub>☉</sub>')}) km`),
          p('一般相対論では、重力を時空の幾何として記述します。非回転・電荷なしの球対称ブラックホールの解から、この半径が事象の地平面に対応するとわかります。地平面の内側から未来へ進む光や物体は、遠方へ出られません。解そのものの導出は、この教材の範囲外です。', 'General relativity describes gravity through spacetime geometry. Its solution for a nonrotating, uncharged, spherical black hole identifies this radius as an event horizon. Future-directed light and matter inside cannot reach the distant exterior. Deriving that spacetime solution is outside our scope.'),
          note('「脱出速度にcを入れたら同じ式になる」と「ニュートン力学でブラックホールを導いた」は別です。半径の一致だけでは、時空の因果構造は説明できません。', 'Matching the same radius by substituting c into escape speed does not derive black holes from Newtonian mechanics. The match alone does not establish spacetime’s causal structure.', true)) +
        s(4, '重力の中で静止した時計を比べる', 'Compare stationary clocks in a gravitational field',
          eq(`${f('Δτ', 'Δt')} = √(1−${f('r<sub>s</sub>', 'r')})　(r &gt; r<sub>s</sub>)`, 'Δτは半径rに静止した時計の時間、Δtは十分遠方の静止時計に対応する時間。', 'Δτ is the time recorded by a stationary clock at r; Δt corresponds to a stationary clock far away.'),
          p('これは一般相対論の解から与える式です。r＝2r_sなら比は√(1/2)≈0.707。遠方で1時間に対応する間に、その場所の静止時計は約42.4分進みます。', 'This equation is supplied by the relativistic solution. At r = 2r_s, the ratio is √(1/2) ≈ 0.707. During an interval corresponding to one hour far away, the stationary local clock advances about 42.4 minutes.'),
          note('r＝r_sに静止した時計は置けません。この式を地平面の内側にそのまま使うこともできません。落下する人が自分の時計で有限時間に地平面を通過することと矛盾しません。', 'A stationary clock cannot be placed at r = r_s, and this stationary-clock expression does not apply inside. An infalling observer can cross the horizon in finite proper time.', true))
    },
    {
      id: 'elements', part: 2, minutes: 11,
      title: ['元素合成と、ヘリウムが約25%の理由', 'Nucleosynthesis and why helium is about 25%'],
      desc: ['陽子と中性子を数えると、宇宙初期の組成が見える。', 'Count protons and neutrons to estimate a primordial abundance.'],
      goal: ['中性子と陽子の比から、ヘリウムの質量割合を計算できる。', 'Estimate the helium mass fraction from the neutron-to-proton ratio.'],
      prereq: ['粒子の数え上げ・質量割合', 'Particle counting and mass fractions'], refs: ['helium', 'sun'],
      question: ['中性子2個、陽子14個から、ヘリウム原子核が1個できたとします。ヘリウムの個数割合と質量割合は？', 'Start with 2 neutrons and 14 protons and form one helium nucleus. What are helium’s number and mass fractions?'],
      answer: ['残る水素核は12個。原子核の個数では1/(12＋1)≈7.7%、質量では4/16＝25%。個数比と質量比は違います。', 'Twelve hydrogen nuclei remain. Helium is 1/(12 + 1) ≈ 7.7% of nuclei by number, but 4/16 = 25% by mass.'],
      body: () => s(1, '宇宙初期の熱いスープ', 'The hot early universe',
        p('宇宙初期には陽子と中性子が反応で入れ替わっていました。宇宙が膨張して冷えると反応が追いつかなくなり、中性子の一部は崩壊します。原子核が効率よく作られ始める頃の比は、目安として中性子：陽子≈1：7です。この比自体の予測には、弱い相互作用と宇宙膨張の計算が必要です。', 'In the early universe, reactions converted protons and neutrons into one another. Expansion and cooling made those reactions fall behind, and some neutrons decayed. Near the onset of efficient nucleosynthesis, a useful estimate is neutron : proton ≈ 1 : 7. Predicting that ratio requires weak-interaction and expansion calculations.')) +
        s(2, '中性子2個と陽子2個で、ヘリウム4', 'Two neutrons and two protons make helium-4',
          p('中性子2個、陽子14個を用意しましょう。ほぼ全ての中性子がヘリウム4に入るとすると、ヘリウム核1個ができ、陽子12個が残ります。陽子と中性子の質量差や結合エネルギーを省けば、全部で16の質量のうち4がヘリウムです。', 'Take 2 neutrons and 14 protons. If almost all neutrons end up in helium-4, one helium nucleus forms and 12 protons remain. Neglecting nucleon mass differences and binding energies, helium contains 4 of the 16 mass units.'),
          eq(`Y<sub>p</sub> ≈ ${f('4', '16')} = 0.25`, 'Y_pは初期ヘリウムの質量割合。宇宙全体のエネルギーの25%という意味ではありません。', 'Y_p is the primordial helium mass fraction in ordinary matter, not 25% of the universe’s total energy.'),
          eq(`Y<sub>p</sub> ≈ ${f('2q', '1+q')},　q = ${f('N<sub>n</sub>', 'N<sub>p</sub>')}`, '中性子N_n個から作るヘリウムはN_n/2個。そこに入る核子は2N_n個です。', 'N_n neutrons make N_n/2 helium nuclei, containing 2N_n nucleons in total.')) +
        s(3, '星は、その先の元素を作る', 'Stars build beyond the primordial elements',
          p('初期宇宙は主に水素とヘリウム、そして少量の重水素やヘリウム3、リチウムなどを作りました。星では水素燃焼がヘリウムを増やし、その後の反応が炭素や酸素などを作ります。大質量星の進化では鉄付近までの核種が作られます。', 'Primordial nucleosynthesis produced mainly hydrogen and helium, with traces including deuterium, helium-3, and lithium. Stars turn hydrogen into more helium, then later reactions produce carbon and oxygen. Massive-star evolution can build nuclei near the iron group.'),
          p('鉄より重い元素にも複数の起源があります。進化した星の中性子捕獲や、中性子星合体などの激しい環境での速い中性子捕獲が重要です。全ての重元素を一種類の超新星だけで説明することはできません。', 'Elements heavier than iron have several origins, including slow neutron capture in evolved stars and rapid neutron capture in extreme environments such as neutron-star mergers. One kind of supernova does not explain every heavy element.')) +
        s(4, '光を読むと、物質の歴史が見える', 'Reading light reveals the history of matter',
          p('原子の準位がスペクトル線を作り、線の比や幅が温度・組成・運動を伝えます。光度と距離を組み合わせると星のエネルギーがわかり、重力と量子の法則が、その星が生きられる範囲を決めます。別々に見えた式は、同じ宇宙の違う面を結んでいます。', 'Atomic levels produce lines; line ratios and widths reveal temperature, composition, and motion. Luminosity and distance reveal energy output. Gravity and quantum physics set the conditions under which a star can exist. The equations connect different aspects of the same universe.'))
    },
    {
      id: 'expansion', part: 3, minutes: 20,
      title: ['宇宙膨張とハッブル–ルメートルの法則', 'Cosmic expansion and the Hubble–Lemaître law'],
      desc: ['距離の伸び率からv＝HD、赤方偏移、ハッブル時間へ。', 'From fractional distance growth to v = HD, redshift, and the Hubble time.'],
      goal: ['スケール因子からv＝HDを導き、赤方偏移と宇宙年齢を混同しない。', 'Obtain v = HD from a scale factor and distinguish redshift, Hubble time, and cosmic age.'],
      prereq: ['比例・速さ＝距離の変化÷時間', 'Proportions and speed as change in distance per time'], refs: ['expansion', 'cosmology', 'distance'],
      question: ['Lyαの静止波長は約121.6 nm。z＝3の銀河から届くと何nm？ 放出時のスケール因子は現在の何倍？', 'Lyα has a rest wavelength near 121.6 nm. At z = 3, what wavelength do we observe, and how large was the emission-era scale factor relative to today?'],
      answer: ['λ_obs＝(1＋3)×121.6＝486.4 nm。a_now＝1とすればa_emit＝1/(1＋3)＝0.25。「宇宙の年齢が現在の1/4だった」とは、この式だけからは言えません。', 'λ_obs = (1 + 3) × 121.6 = 486.4 nm. With a_now = 1, a_emit = 1/(1 + 3) = 0.25. This alone does not imply an age one quarter of today’s.'],
      body: () => s(1, '銀河どうしの距離に、共通の倍率をかける', 'Multiply galaxy separations by a common factor',
        p('十分大きな尺度で宇宙がほぼ一様・等方的だとする標準的なモデルを考えます。宇宙の流れに乗る点の目盛りをχ、その時刻での距離の尺度をスケール因子a(t)とすると、適切な共動距離χを使ってD(t)＝a(t)χと書けます。aは無次元で、現在をa_now＝1にそろえます。', 'In the standard large-scale model, the universe is approximately homogeneous and isotropic. For points following the cosmic flow, write their same-time proper separation as D(t) = a(t)χ, using an appropriate fixed comoving separation χ. The dimensionless scale factor a(t) is conventionally one today.'),
        diagram('expansion-space'),
        eq(`D = aχ,　D' = a'χ　⇒　${f('D\u2032', 'D')} = ${f('a\u2032', 'a')}`, 'ダッシュは別の時刻の値を表します。この行では微分の記号ではありません。', 'Primes label values at a different time; they do not denote derivatives here.'),
        p('aが1から1.1になれば、宇宙膨張に従う点どうしの距離はどこでも1.1倍です。銀河や太陽系や原子の大きさまで、同じ倍率で伸びるという意味ではありません。重力や電磁気力で束縛された系の内部では、その力が構造を決めます。', 'If a grows from 1 to 1.1, separations of points following the cosmic flow grow by 1.1. This does not make galaxies, solar systems, or atoms expand by the same factor: binding forces determine their internal structures.')) +
        s(2, '短い時間での変化を割り算すると、ハッブルの法則', 'Divide the change by time to obtain Hubble’s law',
          p('短い時間ΔtでaがΔaだけ増えるとします。χは固定なので、ΔD＝χΔa＝DΔa/a。これをΔtで割れば、距離の増える速さが得られます。', 'During a short interval Δt, let the scale factor increase by Δa. Since χ stays fixed, ΔD = χΔa = DΔa/a. Divide by Δt to find the rate of separation.'),
          eq(`${f('ΔD', 'Δt')} = (${f('Δa', 'aΔt')})D`, '右辺のaとDは時間区間の初めの値。この有限の時間区間に対する式は、χ一定なら等式です。', 'Here a and D are evaluated at the start of the interval. For fixed χ this finite-interval equation is an equality.'),
          eq(`H<sub>Δt</sub> ≡ ${f('Δa', 'aΔt')},　v<sub>Δt</sub> ≡ ${f('ΔD', 'Δt')}　⇒　v<sub>Δt</sub> = H<sub>Δt</sub>D`),
          p('十分短い時間に対応する瞬間の量をH(t)、v_recと書くと、v_rec＝H(t)D。これが一様な膨張でのハッブル–ルメートルの関係です。H(t)は単位時間あたりの割合で、現在の値がH₀。「ハッブル定数」という名前でも、宇宙の歴史を通じて一定とは限りません。', 'For instantaneous rates the relation is v_rec = H(t)D. This is the Hubble–Lemaître relation for uniform expansion. H(t) is a fractional growth rate per unit time; H₀ is its present value. The name “Hubble constant” does not make it constant throughout cosmic history.')) +
        s(3, 'どこから見ても、遠い点ほど速く離れる', 'Every observer sees more distant points separate faster',
          p('一直線にA、B、Cが並び、短い時間に各間隔が1%伸びるとします。Aから見たCはBの2倍遠ければ、距離の増加も2倍。Bから見ても、両側の点が同じ規則で離れます。地球だけが特別な膨張の中心だという結論は出ません。', 'Imagine A, B, and C on a line with every gap growing by 1% in a short time. If C is twice as far from A as B is, its separation increases twice as much. From B, both sides follow the same rule. This does not identify Earth as a special centre of expansion.'),
          `<div data-lab="expansion"></div>`,
          note('v_recは同じ宇宙時刻で定義した遠くの点との距離の変化率です。宇宙論的な遠距離ではHDがcを超えても、近くの観測者の横を物体が光より速く通ることを意味しません。この距離変化率に、局所的な速度上限cをそのまま当てはめることはできません。', 'v_rec is the change of a same-cosmic-time separation to a distant point. At cosmological distances HD can exceed c without an object locally passing an observer faster than light. The local speed limit and this distant-separation rate are different quantities.')) +
        s(4, '伸びる波長が、宇宙論的赤方偏移になる', 'Stretched wavelengths give cosmological redshift',
          eq(`z ≡ ${f('λ<sub>obs</sub>−λ<sub>emit</sub>', 'λ<sub>emit</sub>')}　⇒　1+z = ${f('λ<sub>obs</sub>', 'λ<sub>emit</sub>')}`),
          p('一様・等方な宇宙で、光の放出者と観測者が共に宇宙の流れに乗っているとき、一般相対論から次の関係が与えられます。波長の定義だけから導いたのではなく、膨張する時空を光が伝わるという追加の結果を使います。', 'For emission and observation by comoving observers in a homogeneous, isotropic universe, general relativity supplies the following relation. It is an additional result about light propagating through expanding spacetime, not an algebraic consequence of the definition of z alone.'),
          eq(`1+z = ${f('a<sub>now</sub>', 'a<sub>emit</sub>')}　⇒　a<sub>emit</sub> = ${f('1', '1+z')}　(a<sub>now</sub>=1)`),
          p('z＝1なら光を出したときのaは0.5。zが大きいとき、これを特殊相対論のドップラー式にそのまま置き換えて距離を求めることはできません。実際の観測には、銀河の固有運動や重力による赤方偏移も加わりえます。', 'At z = 1, the emission-era scale factor was 0.5. At high redshift, inserting z into a special-relativistic Doppler formula is not a general way to infer cosmic distance. Observations can also include peculiar velocities and gravitational redshifts.')) +
        s(5, '近い宇宙でなら、観測から距離を見積もれる', 'Infer distances in the nearby-universe approximation',
          eq(`z ≈ ${f('v', 'c')},　v ≈ H<sub>0</sub>D　⇒　D ≈ ${f('cz', 'H<sub>0</sub>')}`),
          p('計算例としてH₀＝70 km s⁻¹ Mpc⁻¹を使います。これは練習用の丸い値で、最新の測定値を一つに確定する意味ではありません。1 Mpc（メガパーセク）≈326万光年です。D＝10 Mpcならv≈700 km/s、D＝100 Mpcなら約7000 km/sとなります。', 'Use H₀ = 70 km s⁻¹ Mpc⁻¹ as a round teaching example, not a claim that current measurements have settled on a unique value. One megaparsec is about 3.26 million light-years. At 10 Mpc the example gives 700 km/s; at 100 Mpc, 7,000 km/s.'),
          p('z＝0.005ならv≈1500 km/s、D≈21.4 Mpc。ただし近い銀河の固有運動は、この推定に大きく影響することがあります。遠い銀河では膨張史と距離の定義も必要で、この近似式だけでは足りません。', 'For z = 0.005, v ≈ 1,500 km/s and D ≈ 21.4 Mpc. Peculiar motion can substantially affect nearby-galaxy estimates. At large distances the expansion history and the definition of distance matter, so this approximation is insufficient.')) +
        s(6, '1/H₀は時間。でも宇宙年齢そのものではない', '1/H₀ is a timescale, not automatically the age',
          eq(`H<sub>0</sub> ≈ ${f('70 km/s', '3.086×10<sup>19</sup> km')} ≈ 2.27×10<sup>−18</sup> s<sup>−1</sup>`),
          eq(`t<sub>H</sub> ≡ ${f('1', 'H<sub>0</sub>')} ≈ 4.41×10<sup>17</sup> s ≈ ${t('140億年', '14 billion years')}`, 'H₀＝70 km s⁻¹ Mpc⁻¹の例でのハッブル時間です。', 'The Hubble time for the example H₀ = 70 km s⁻¹ Mpc⁻¹.'),
          p('現在の距離Dを、現在の後退速度H₀Dで割ると1/H₀になります。しかし過去の速さがずっと今と同じだったとは限りません。宇宙年齢を得るには、過去の膨張をたどる必要があります。', 'Dividing the present separation D by the present recession rate H₀D gives 1/H₀. But that separation need not have grown at its present rate throughout the past. Determining the cosmic age requires the expansion history.'),
          note('「膨張が加速する」と「Hが増える」は同じではありません。Hは距離の絶対的な増加率ではなく、距離で割った割合です。ハッブルの法則自体は膨張の仕方を表す関係で、物質・放射・暗黒エネルギーが膨張史をどう決めるかを単独で解く法則ではありません。', 'Accelerated expansion does not necessarily mean an increasing H: H is a fractional rate, not the absolute rate of growth. Hubble’s law describes the expansion pattern; by itself it does not determine how matter, radiation, and dark energy govern the expansion history.', true))
    }
  ];
  window.AstroContent = { chapters, sources, renderBody(id, locale) { language = locale; return chapters.find(c => c.id === id).body(); } };
})();
