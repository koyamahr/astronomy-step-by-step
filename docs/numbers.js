/* Supplement: numerical scales, physical constants, and SI/Gaussian CGS conventions. */
(() => {
  'use strict';
  const C = Object.freeze({ c: 299792458, h: 6.62607015e-34, k: 1.380649e-23, e: 1.602176634e-19, me: 9.1093837139e-31, alpha: 7.2973525643e-3, G: 6.67430e-11, au: 149597870700, gmSun: 1.3271244e20, mu0: 1.25663706127e-6, year: 31557600 });
  const pc = C.au * 648000 / Math.PI, hbar = C.h / (2 * Math.PI), solarMass = C.gmSun / C.G;
  const eGaussian = Math.sqrt(C.alpha * hbar * 1e7 * C.c * 100);
  const refs = [
    ['NIST · CODATA 2022 constants', 'https://physics.nist.gov/cuu/pdf/all.pdf'],
    ['IAU · Parsec and astronomical units (2015)', 'https://www.iau.org/static/resolutions/IAU2015_English.pdf'],
    ['IAU · Nominal solar conversion constants (2015)', 'https://www.iau.org/common/Uploaded%20files/IAUGA2015-Resolution-B3-recommended-nominal-conversion.pdf'],
    ['NASA LAMBDA · Hubble constant', 'https://lambda.gsfc.nasa.gov/education/graphic_history/hubb_const.html'],
    ['NRAO · Constants, units, and dimensions', 'https://www.cv.nrao.edu/~sransom/web/A6.html'],
    ['NIST · Magnetic unit conversions', 'https://www.nist.gov/document/unitschartpdf']
  ];
  const title = ['宇宙物理の数字と単位', 'Numbers and units for astrophysics'];
  const desc = ['pcから微細構造定数まで。値・桁・SIとCGS–Gauss系を一緒に確かめる。', 'From parsecs to the fine-structure constant: values, scales, and SI versus Gaussian CGS.'];
  const entries = [
    { symbol: 'c', name: ['真空の光速', 'Speed of light in vacuum'], si: '2.997 924 58 × 10<sup>8</sup> m s<sup>−1</sup>', cgs: '2.997 924 58 × 10<sup>10</sup> cm s<sup>−1</sup>', kind: ['定義で固定', 'Exact by definition'] },
    { symbol: 'G', name: ['ニュートンの重力定数', 'Newtonian gravitational constant'], si: '6.674 30 × 10<sup>−11</sup> m³ kg<sup>−1</sup> s<sup>−2</sup>', cgs: '6.674 30 × 10<sup>−8</sup> cm³ g<sup>−1</sup> s<sup>−2</sup>', kind: ['測定値', 'Measured'] },
    { symbol: 'h', name: ['プランク定数', 'Planck constant'], si: '6.626 070 15 × 10<sup>−34</sup> J s', cgs: '6.626 070 15 × 10<sup>−27</sup> erg s', kind: ['定義で固定', 'Exact by definition'] },
    { symbol: 'ℏ = h/(2π)', name: ['換算プランク定数', 'Reduced Planck constant'], si: '1.054 571 817… × 10<sup>−34</sup> J s', cgs: '1.054 571 817… × 10<sup>−27</sup> erg s', kind: ['定義値から計算・表示は丸め', 'Derived from exact inputs; rounded display'] },
    { symbol: 'mₑ', name: ['電子の静止質量', 'Electron rest mass'], si: '9.109 383 7139 × 10<sup>−31</sup> kg', cgs: '9.109 383 7139 × 10<sup>−28</sup> g', kind: ['測定値', 'Measured'] },
    { symbol: 'mₑc²', name: ['電子の静止エネルギー', 'Electron rest energy'], si: '8.187 105 788… × 10<sup>−14</sup> J', cgs: '8.187 105 788… × 10<sup>−7</sup> erg<br>≈ 0.510 998 950 69 MeV', kind: ['質量とは次元が異なる', 'Energy, a different dimension from mass'] },
    { symbol: 'kB', name: ['ボルツマン定数', 'Boltzmann constant'], si: '1.380 649 × 10<sup>−23</sup> J K<sup>−1</sup>', cgs: '1.380 649 × 10<sup>−16</sup> erg K<sup>−1</sup>', kind: ['定義で固定', 'Exact by definition'] },
    { symbol: 'e', name: ['電気素量（電荷の大きさ）', 'Elementary charge magnitude'], si: '1.602 176 634 × 10<sup>−19</sup> C', cgs: '≈ 4.803 204 71 × 10<sup>−10</sup> statC', kind: ['SIの値は固定・Gauss系では電荷の次元も変わる', 'Exact in SI; Gaussian charge has different dimensions'] },
    { symbol: 'α', name: ['微細構造定数', 'Fine-structure constant'], si: '7.297 352 5643 × 10<sup>−3</sup>', cgs: '同じ値 / same value<br>α<sup>−1</sup> ≈ 137.035 999 177', kind: ['無次元の測定値', 'Measured and dimensionless'] },
    { symbol: '1 pc', name: ['パーセク', 'Parsec'], si: '≈ 3.085 677 581 49 × 10<sup>16</sup> m', cgs: '≈ 3.085 677 581 49 × 10<sup>18</sup> cm<br>≈ 3.261 56 ly', kind: ['定義は(648000/π) au・表示は丸め', 'Defined as (648000/π) au; rounded display'] },
    { symbol: 'M☉', name: ['太陽質量の目安', 'Solar mass scale'], si: '≈ 1.9884 × 10<sup>30</sup> kg', cgs: '≈ 1.9884 × 10<sup>33</sup> g', kind: ['厳密な定義定数ではない', 'Not an exact defining constant'] },
    { symbol: 'H₀', name: ['ハッブル定数：換算の例', 'Hubble constant: conversion example'], si: '70 km s<sup>−1</sup> Mpc<sup>−1</sup>', cgs: '≈ 2.2685 × 10<sup>−18</sup> s<sup>−1</sup>', kind: ['70は計算例・合意した厳密値ではない', '70 is illustrative, not an exact consensus value'] }
  ];
  function convert(kind, value) {
    if (!(Number.isFinite(value) && value >= 0)) throw new RangeError('Use a finite, nonnegative value.');
    if (kind === 'pc') return { m: value * pc, cm: value * pc * 100, ly: value * pc / (C.c * C.year) };
    if (kind === 'solar') return { kg: value * solarMass, g: value * solarMass * 1000 };
    if (kind === 'energy') return { J: value * C.e, erg: value * C.e * 1e7, kelvin: value * C.e / C.k };
    if (kind === 'field') return { tesla: value * 1e-4, cgsEnergyDensity: value ** 2 / (8 * Math.PI), siEnergyDensity: (value * 1e-4) ** 2 / (2 * C.mu0) };
    throw new RangeError('Unknown conversion.');
  }
  function hubble(value) {
    if (!(Number.isFinite(value) && value > 0)) throw new RangeError('H0 must be positive.');
    const perSecond = value * 1000 / (pc * 1e6);
    return { perSecond, timeSeconds: 1 / perSecond, timeGyr: 1 / perSecond / C.year / 1e9 };
  }
  function renderBody(locale) {
    const t = (ja, en) => locale === 'ja' ? ja : en, tr = pair => pair[locale === 'ja' ? 0 : 1];
    const p = (ja, en) => `<p>${t(ja, en)}</p>`;
    const f = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
    const eq = html => `<div class="equation"><div class="math">${html}</div></div>`;
    const s = (n, ja, en, ...body) => `<section><h2><span class="step-no">${n}</span>${t(ja, en)}</h2>${body.join('')}</section>`;
    const note = (ja, en) => `<aside class="callout">${t(ja, en)}</aside>`;
    return [
      s('01', 'まずは、桁の見当をつける', 'Start with orders of magnitude',
        p('計算の前に、答えがどの桁になるかを考えると単位の間違いを見つけやすい。丸暗記より、単位と一緒に使い、必要になったら値を引き直すための番外編である。', 'Estimating the order of magnitude before calculating helps catch unit errors. This supplement is a reference to use with units, rather than a demand to memorize every digit.'),
        eq(`c ≈ 3×10<sup>10</sup> cm/s,　G ≈ 6.7×10<sup>−8</sup> cm³ g<sup>−1</sup> s<sup>−2</sup><br>1 pc ≈ 3×10<sup>18</sup> cm,　M<sub>☉</sub> ≈ 2×10<sup>33</sup> g<br>h ≈ 6.6×10<sup>−27</sup> erg s,　m<sub>e</sub> ≈ 9.1×10<sup>−28</sup> g<br>m<sub>e</sub>c² ≈ 511 keV,　α ≈ ${f('1','137')}`),
        note('以下はCODATA 2022、IAUの定義・公称換算値に基づく参照値で、測定の不確かさは省略している。「定義で固定」「測定値」「天体の尺度」「計算例」を区別する。丸めた数値を並べているので、表示桁の先まで正確だとは解釈しない。', 'The reference values use CODATA 2022 and IAU definitions or nominal conversions, with measurement uncertainties omitted. Distinguish defining values, measurements, astronomical scales, and illustrative choices. Rounded displays do not imply precision beyond their shown digits.'),
        `<div class="constant-grid">${entries.map(row => `<div class="constant-card"><div class="constant-symbol">${row.symbol}</div><h3>${tr(row.name)}</h3><dl><dt>SI</dt><dd>${row.si}</dd><dt>${t('CGS / 関連値', 'CGS / related value')}</dt><dd>${row.symbol === 'α' ? t('同じ値', 'Same value') + '<br>α<sup>−1</sup> ≈ 137.035 999 177' : row.cgs}</dd></dl><small>${tr(row.kind)}</small></div>`).join('')}</div>`),
      s('02', '光速c・重力定数Gと、CGSの換算', 'c, G, and mechanical CGS conversions',
        p('CGSは長さcm・質量g・時間sを基本にした単位系。SIのm・kg・sから、どの次元に何回掛けるかを追う。光速cはSIで正確に299792458 m/sと定められており、1 m＝100 cmなのでCGSでの数値は100倍になる。', 'CGS uses centimetres, grams, and seconds. Convert from SI metres, kilograms, and seconds by tracking each dimensional power. The SI value c = 299792458 m/s is exact; since 1 m = 100 cm, its CGS numerical value is one hundred times larger.'),
        eq(`1 erg = 1 g cm² s<sup>−2</sup> = 10<sup>−7</sup> J<br>1 dyn = 1 g cm s<sup>−2</sup> = 10<sup>−5</sup> N<br>1 g/cm³ = 10³ kg/m³<br>1 dyn/cm² = 0.1 Pa,　1 erg/cm³ = 0.1 J/m³`),
        p('重力定数はF＝Gm₁m₂/r²から[G]＝長さ³/(質量×時間²)。したがって、SIからCGSへは100³/1000＝1000倍する。', 'From F = Gm₁m₂/r², G has dimensions length³/(mass × time²). Going from SI to CGS multiplies its numerical value by 100³/1000 = 1000.'),
        eq(`G ≈ 6.67430×10<sup>−11</sup> ${f('m³','kg s²')} = 6.67430×10<sup>−8</sup> ${f('cm³','g s²')}`),
        note('cやhと違い、Gは測定して求める定数である。CODATA 2022のGの相対標準不確かさは約2.2×10⁻⁵。桁数の多さと、定義で正確に決まることは別である。', 'Unlike c or h, G is measured. Its CODATA 2022 relative standard uncertainty is about 2.2×10⁻⁵. A long numerical value is not the same thing as an exact defining value.')),
      s('03', 'pc・光年・太陽質量をつなぐ', 'Connect parsecs, light-years, and solar masses',
        p('パーセクは年周視差から生まれた距離の単位で、現在の定義は1 pc＝(648000/π) au。1角秒＝π/648000 radなので、微小角の関係d≈1 au/pとつながる。1 auは正確に149597870700 mである。', 'The parsec originated with annual parallax and is defined as 1 pc = (648000/π) au. Since one arcsecond is π/648000 radians, this connects to the small-angle relation d ≈ 1 au/p. One au is exactly 149597870700 m.'),
        eq(`1 pc ≈ 3.08568×10<sup>18</sup> cm ≈ 3.26156 ly<br>1 kpc = 10³ pc,　1 Mpc = 10⁶ pc<br>1 ly = c×(365.25×86400 s) ≈ 9.46073×10<sup>17</sup> cm`),
        p('ここで光年の年は365.25日のユリウス年を使う。太陽質量は約2×10³³ gという桁が便利だが、kgで正確に固定された普遍定数ではない。精密な軌道計算ではGMの組合せがよく求まり、IAUは太陽の公称質量パラメータを定義している。', 'The light-year here uses the Julian year of 365.25 days. The solar mass scale, about 2×10³³ g, is useful but is not an exact universal constant in kilograms. Orbital dynamics constrains GM well, and the IAU defines a nominal solar mass parameter.'),
        eq(`(GM)<sub>☉</sub><sup>N</sup> = 1.3271244×10<sup>20</sup> m³ s<sup>−2</sup><br>${f('(GM)<sub>☉</sub><sup>N</sup>','G')} ≈ 1.9884×10<sup>30</sup> kg`),
        note('上付きNは公称値を表す。公称GMは正確な換算基準であり、その瞬間の太陽の真のGMそのものという意味ではない。Gで割った質量は、Gの測定の不確かさを受け継ぐ。', 'The superscript N denotes a nominal value. Nominal GM is an exact conversion reference, not a claim about the Sun’s instantaneous true GM. Dividing it by measured G introduces G’s uncertainty.')),
      s('04', 'hとℏ、電子の質量とエネルギー', 'h versus ℏ, and electron mass versus energy',
        p('周波数νが一秒あたりの波の回数、角周波数ω＝2πνが一秒あたりの位相の変化なら、光子のエネルギーはhν＝ℏω。同じ物理を、周波数の書き方に合わせて表している。', 'Frequency ν counts cycles per second, while angular frequency ω = 2πν measures phase change per second. Photon energy is hν = ℏω: the same physics with matching frequency conventions.'),
        eq(`ℏ = ${f('h','2π')},　E = hν = ℏω = ${f('hc','λ')}<br>hc ≈ 1239.84 eV nm,　ℏc ≈ 197.327 MeV fm`),
        p('電子のレストマスは静止質量m_e。511 keVはm_ec²というエネルギーで、質量を書くなら511 keV/c²となる。eVは電圧ではなくエネルギーの単位である。', 'Electron rest mass is m_e. The value 511 keV is the rest energy m_ec²; the mass can be written as 511 keV/c². An electron volt is an energy unit, not a voltage.'),
        eq(`1 eV = 1.602176634×10<sup>−19</sup> J = 1.602176634×10<sup>−12</sup> erg<br>m<sub>e</sub>c² ≈ 8.18711×10<sup>−7</sup> erg ≈ 0.510999 MeV`),
        p('微細構造定数αは無次元で、SIでもGauss系でも同じ値になる。真空・低エネルギーの値として約1/137を使う。円盤の輸送効率を表すαモデルとは別の量である。', 'The fine-structure constant α is dimensionless and has the same value in SI and Gaussian units. Its vacuum, low-energy value is approximately 1/137. It is distinct from the alpha used for disk transport efficiency.'),
        eq(`α = ${f('e<sub>SI</sub>²','4πε₀ℏc')} = ${f('e<sub>G</sub>²','ℏc')} ≈ ${f('1','137.036')}<br>${f('1','2')}α²m<sub>e</sub>c² ≈ 13.6 eV`),
        p('最後の式は水素原子の基底状態の束縛エネルギーの目安で、原子核が固定されている近似を使う。電子の静止エネルギーとαから、原子の光のエネルギー尺度へつながる。', 'The final expression estimates the hydrogen ground-state binding energy with a fixed nucleus. Electron rest energy and α thus connect to atomic photon-energy scales.')),
      s('05', 'ハッブル定数の単位をほどく', 'Unpack the Hubble constant’s units',
        p('H₀は現在の宇宙の膨張率を測定・モデルから推定する量であり、定義で固定した普遍定数ではない。ここでは単位換算の例として70 km/s/Mpcを選ぶ。測定法による違いがあり、70を唯一の正解や最新の合意値とはしない。', 'H₀ is the present expansion rate inferred from measurements and modelling, not an exact defining universal constant. Use 70 km/s/Mpc as a conversion example, not as a unique answer or a claim of current consensus.'),
        eq(`H₀ = ${f('70×10⁵ cm/s','3.08568×10²⁴ cm')} ≈ 2.2685×10<sup>−18</sup> s<sup>−1</sup><br>H₀<sup>−1</sup> ≈ 4.408×10<sup>17</sup> s ≈ 13.97 Gyr`),
        '<div data-lab="hubble-units"></div>',
        note('H₀⁻¹はハッブル時間で、宇宙年齢と常に等しいわけではない。H(t)の時間変化を含む宇宙モデルが年齢を決める。論文でH₀＝100h km/s/Mpcと書くときの小文字hも、プランク定数hとは別の無次元量である。', 'H₀⁻¹ is the Hubble time, not necessarily the age of the universe. The age depends on a cosmological model and the history of H(t). The dimensionless h in H₀ = 100h km/s/Mpc is also unrelated to Planck’s constant h.')),
      s('06', 'CGS–Gauss系では、式も一緒に替える', 'In Gaussian CGS, convert equations as well as values',
        p('電磁気にはCGS静電単位系、電磁単位系、Gauss系などがあり、単にCGSとだけ書くと曖昧である。以下では天文学で使われるGauss系を明示し、電荷をstatC、磁束密度BをG（gauss）で表す。重力定数Gと磁場の単位Gも文脈で区別する。', 'Electromagnetic CGS conventions include electrostatic, electromagnetic, and Gaussian systems. Here use Gaussian CGS explicitly: charge in statC and magnetic flux density B in gauss (G). Distinguish G as a magnetic unit from G as the gravitational constant.'),
        `<div class="formula-comparison" tabindex="0" role="region" aria-label="${t('SIとGauss系の式の比較。狭い画面では横にスクロールできます。', 'SI and Gaussian formula comparison; scroll horizontally on narrow screens.')}"><table><caption>${t('同じ物理を、対応する単位系の式で書く', 'The same physics in matched conventions')}</caption><thead><tr><th scope="col">${t('量・法則', 'Quantity / law')}</th><th scope="col">SI</th><th scope="col">CGS–Gauss</th></tr></thead><tbody><tr><th scope="row">${t('クーロン力の大きさ', 'Coulomb-force magnitude')}</th><td>F = |q₁q₂|/(4πε₀r²)</td><td>F = |q₁q₂|/r²</td></tr><tr><th scope="row">${t('ローレンツ力', 'Lorentz force')}</th><td>F⃗ = q(E⃗ + v⃗ × B⃗)</td><td>F⃗ = q(E⃗ + (v⃗/c) × B⃗)</td></tr><tr><th scope="row">${t('真空の磁場エネルギー密度', 'Vacuum magnetic energy density')}</th><td>uB = B²/(2μ₀)</td><td>uB = B²/(8π)</td></tr><tr><th scope="row">${t('非相対論的な電子の旋回角周波数', 'Nonrelativistic electron gyrofrequency')}</th><td>ωB = eB/mₑ</td><td>ωB = eB/(mₑc)</td></tr><tr><th scope="row">${t('古典的電子半径', 'Classical electron radius')}</th><td>rₑ = e²/(4πε₀mₑc²)</td><td>rₑ = e²/(mₑc²)</td></tr></tbody></table></div>`,
        p('Gauss系のクーロン力から[q]²＝[力][長さ]²＝g cm³ s⁻²。したがって電荷の次元はg¹ᐟ² cm³ᐟ² s⁻¹となる。電場と磁場の次元はどちらもg¹ᐟ² cm⁻¹ᐟ² s⁻¹で、ローレンツ力のv/cは無次元である。', 'Gaussian Coulomb’s law gives [q]² = [force][length]² = g cm³ s⁻², so charge has dimensions g^(1/2) cm^(3/2) s⁻¹. Electric and magnetic fields both have dimensions g^(1/2) cm^(−1/2) s⁻¹; v/c in the Lorentz force is dimensionless.'),
        eq(`1 G = 10<sup>−4</sup> T,　1 μG = 10<sup>−10</sup> T<br>1 statC ≈ 3.33564×10<sup>−10</sup> C`),
        p('同じ物理量でも、電荷・場の数値と式の係数をまとめて対応させる。SIの電荷の数値をGauss系の式へそのまま入れたり、ε₀とμ₀を単に1と置いたりしない。現在のSIではμ₀も測定値で、μ₀≈4π×10⁻⁷ H/mは近似である。', 'Match charge and field values together with the equation’s coefficients. Do not insert SI charge numbers into Gaussian equations or simply set ε₀ and μ₀ to one. In the current SI, μ₀ is measured; μ₀ ≈ 4π×10⁻⁷ H/m is an approximation.'),
        p('例えば1 Gの磁場なら、Gauss系でu_B＝1/(8π)≈0.03979 erg/cm³。1 G＝10⁻⁴ TとSIの式を使うと約0.003979 J/m³となり、エネルギー密度の換算で一致する。', 'For B = 1 G, Gaussian u_B = 1/(8π) ≈ 0.03979 erg/cm³. Using 10⁻⁴ T in the SI formula gives about 0.003979 J/m³, agreeing after energy-density conversion.')),
      s('07', '自分で換算して確かめる', 'Try the conversions',
        '<div data-lab="number-converter"></div>',
        p('磁場の換算では、CGSとSIのエネルギー密度も並べる。電子ボルトからKへの表示は、同じエネルギーをk_BTと等置した等価温度であり、どんな粒子集団にも温度を割り当てる操作ではない。', 'The field conversion also compares magnetic energy densities. An eV-to-K readout is the equivalent temperature from E = k_BT, not an assignment of temperature to every possible particle population.'),
        `<aside class="quiz"><div class="eyebrow">CHECK THE UNITS</div><h2>${t('単位と一緒に計算しよう', 'Calculate with the units')}</h2>${p('1 pcをcmへ、電子の静止質量をgへ直すとき、それぞれ数値は何倍になるか。Gの場合はなぜ100倍ではないか。', 'When converting 1 pc from metres to centimetres, and electron mass from kilograms to grams, what are the factors? Why is the factor for G not one hundred?')}<details><summary>${t('答えを見る', 'Show the answer')}</summary>${p('長さは100倍、質量は1000倍。Gは長さ³/質量/時間²なので100³/1000＝1000倍になる。量の次元を先に書けば、指数の取り違えを防げる。', 'Length gains a factor 100 and mass a factor 1000. Since G has dimensions length³/mass/time², its factor is 100³/1000 = 1000. Writing dimensions first helps prevent exponent mistakes.')}</details></aside>`)
    ].join('');
  }
  function mount(el, locale) {
    const t = (ja, en) => locale === 'ja' ? ja : en;
    const number = value => value === 0 ? '0' : value.toExponential(5);
    el.className = 'lab number-lab';
    if (el.dataset.lab === 'hubble-units') {
      el.innerHTML = `<h3>${t('確かめる：H₀の単位と時間尺度', 'Explore: H₀ units and timescale')}</h3><label for="units-hubble">H₀ = <output id="units-hubble-value" for="units-hubble"></output> km s⁻¹ Mpc⁻¹</label><input id="units-hubble" type="range" min="50" max="90" step="0.1" value="70"><div class="readout"><div class="stat"><small>H₀ [s⁻¹]</small><strong id="units-hubble-si"></strong></div><div class="stat"><small>H₀⁻¹ [Gyr]</small><strong id="units-hubble-time"></strong></div></div><p class="lab-note">${t('70は換算の代表例。スライダーは測定データへの当てはめではない。表示はハッブル時間で、宇宙年齢ではない。', '70 is an illustrative conversion choice. The slider does not fit observations. It displays Hubble time, not the age of the universe.')}</p>`;
      const update = () => {
        const value = Number(el.querySelector('input').value), data = hubble(value);
        el.querySelector('#units-hubble-value').textContent = value.toFixed(1);
        el.querySelector('#units-hubble-si').textContent = number(data.perSecond);
        el.querySelector('#units-hubble-time').textContent = data.timeGyr.toFixed(3);
      };
      el.querySelector('input').addEventListener('input', update); update();
    }
    if (el.dataset.lab === 'number-converter') {
      el.innerHTML = `<h3>${t('確かめる：天文で使う単位の換算', 'Explore: astronomical unit conversions')}</h3><label for="number-kind">${t('入力する物理量', 'Input quantity')}</label><select id="number-kind"><option value="pc">${t('距離 [pc]', 'Distance [pc]')}</option><option value="solar">${t('質量 [M☉：公称GM/G]', 'Mass [M☉: nominal GM/G]')}</option><option value="energy">${t('エネルギー [eV]', 'Energy [eV]')}</option><option value="field">${t('磁場 [G：gauss]', 'Magnetic field [G: gauss]')}</option></select><label for="number-value">${t('入力値（上で選んだ単位）', 'Value in the selected unit')}</label><input id="number-value" type="number" min="0" max="1e30" step="any" value="1"><div class="readout" id="number-result" aria-live="polite"></div><p class="lab-note" id="number-note" role="status"></p>`;
      const update = () => {
        const kind = el.querySelector('select').value, value = el.querySelector('input').valueAsNumber;
        if (!Number.isFinite(value) || value < 0 || value > 1e30) {
          el.querySelector('#number-result').innerHTML = '';
          el.querySelector('#number-note').textContent = t('0以上、10³⁰以下の有限の数を入力してください。', 'Enter a finite number between zero and 10³⁰.');
          return;
        }
        const data = convert(kind, value);
        const labels = { m: 'm', cm: 'cm', ly: 'ly', kg: 'kg', g: 'g', J: 'J', erg: 'erg', kelvin: t('E＝kBTの等価温度 [K]', 'Equivalent T from E = kBT [K]'), tesla: 'T', cgsEnergyDensity: 'uB [erg/cm³]', siEnergyDensity: 'uB [J/m³]' };
        el.querySelector('#number-result').innerHTML = Object.entries(data).map(([key, result]) => `<div class="stat"><small>${labels[key]}</small><strong>${number(result)}</strong></div>`).join('');
        el.querySelector('#number-note').textContent = kind === 'field' ? t('磁場エネルギー密度は真空の式で計算。SIにはCODATA 2022のμ₀を使い、表示の精度でGauss系と一致する。', 'Magnetic energy uses vacuum formulas. SI uses CODATA 2022 μ₀ and agrees with Gaussian CGS at the displayed precision.') : kind === 'solar' ? t('IAUの公称GMをCODATA 2022のGで割った換算尺度。現在の太陽質量を誤差なく定義するものではない。', 'Uses nominal IAU GM divided by CODATA 2022 G; it does not define the current solar mass without uncertainty.') : kind === 'energy' ? t('Kの表示はE/kBというエネルギー尺度。電子の静止エネルギーなら約511000 eVを入力。', 'The K readout is the energy scale E/kB. For electron rest energy enter about 511000 eV.') : t('光年は365.25日のユリウス年を使用。', 'The light-year uses a Julian year of 365.25 days.');
      };
      el.querySelectorAll('input,select').forEach(input => input.addEventListener('input', update)); update();
    }
  }
  window.AstroNumbers = { title, desc, refs, entries, constants: C, pc, hbar, solarMass, eGaussian, convert, hubble, renderBody, mount };
})();
