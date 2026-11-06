/* Interactive views of the shared gas/disk models. No external plotting library. */
(() => {
  'use strict';
  const M = window.AstroAdvancedMath, C = M.gasConstants;
  const types = new Set(['bonnor-ebert', 'jeans', 'bondi', 'parker-wind', 'stromgren', 'alpha-disk', 'mri', 'toomre-q']);
  function graph(id, title, xLabel, yLabel, xd, yd, curves, point, options = {}) {
    const scale = (value, domain, log, origin, size) => origin + size * ((log ? Math.log10(value) : value) - (log ? Math.log10(domain[0]) : domain[0])) / ((log ? Math.log10(domain[1]) : domain[1]) - (log ? Math.log10(domain[0]) : domain[0]));
    const X = x => scale(x, xd, options.logX, 68, 510), Y = y => scale(y, yd, options.logY, 238, -205);
    const ticks = (domain, log) => log ? Array.from({ length: Math.floor(Math.log10(domain[1])) - Math.ceil(Math.log10(domain[0])) + 1 }, (_, i) => 10 ** (i + Math.ceil(Math.log10(domain[0])))) : Array.from({ length: 5 }, (_, i) => domain[0] + i * (domain[1] - domain[0]) / 4);
    const label = x => x === 0 ? '0' : Math.abs(x) < .001 || Math.abs(x) >= 1e5 ? x.toExponential(0) : Number(x.toPrecision(3)).toString();
    const grid = ticks(xd, options.logX).map(x => `<path d="M${X(x)} 33V238" stroke="#d9dfd4" stroke-dasharray="3 4"/><text x="${X(x)}" y="257" text-anchor="middle">${label(x)}</text>`).join('') + ticks(yd, options.logY).map(y => `<path d="M68 ${Y(y)}H578" stroke="#d9dfd4" stroke-dasharray="3 4"/><text x="58" y="${Y(y) + 4}" text-anchor="end">${label(y)}</text>`).join('');
    const paths = curves.map(({ points, color = '#48715c', dash = '' }) => `<path d="${points.map((p, i) => `${i ? 'L' : 'M'}${X(p.x).toFixed(3)} ${Y(p.y).toFixed(3)}`).join(' ')}" fill="none" stroke="${color}" stroke-width="2.5" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`).join('');
    return `<svg viewBox="0 0 640 295" role="img" aria-labelledby="${id}-title"><title id="${id}-title">${title}</title><defs><clipPath id="${id}-clip"><rect x="68" y="33" width="510" height="205"/></clipPath></defs><text x="68" y="18">${yLabel}</text>${grid}<g clip-path="url(#${id}-clip)">${options.negative && yd[0] < 0 ? `<rect x="68" y="${Y(0)}" width="510" height="${238-Y(0)}" fill="#b2593020"/>` : ''}${paths}${point ? `<circle cx="${X(point.x)}" cy="${Y(point.y)}" r="4.5" fill="#b25930" stroke="white"/>` : ''}</g><path d="M68 33V238H578" fill="none" stroke="#8c9c8e"/>${options.negative ? `<path d="M68 ${Y(0)}H578" stroke="#7e8e80"/>` : ''}<text x="323" y="285" text-anchor="middle">${xLabel}</text></svg>`;
  }
  const points = (fn, a, b, count = 240, log = false) => Array.from({ length: count + 1 }, (_, i) => { const x = log ? a * (b / a) ** (i / count) : a + (b - a) * i / count; return { x, y: fn(x) }; });
  const range = (id, label, min, max, step, value) => `<label for="${id}">${label} = <output id="${id}-value"></output></label><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}">`;
  const stats = entries => `<div class="readout">${entries.map(([id, label]) => `<div class="stat"><small>${label}</small><strong id="${id}"></strong></div>`).join('')}</div>`;
  const shell = (title, controls, entries, note) => `<h3>${title}</h3>${controls}${stats(entries)}<div class="gas-plot"></div><p class="gas-status lab-note" role="status"></p><p class="lab-note">${note}</p>`;
  function mount(el, locale) {
    const t = (ja, en) => locale === 'ja' ? ja : en;
    const fmt = value => value.toLocaleString(locale, { maximumSignificantDigits: 4, notation: value !== 0 && (Math.abs(value) >= 1e5 || Math.abs(value) < .001) ? 'scientific' : 'standard' });
    const value = id => Number(el.querySelector('#' + id).value);
    const put = (id, text) => { el.querySelector('#' + id).textContent = text; };
    const draw = svg => { el.querySelector('.gas-plot').innerHTML = svg; };
    const status = text => { el.querySelector('.gas-status').textContent = text; };
    const bind = update => {
      const render = () => {
        el.querySelectorAll('input[type="range"]').forEach(input => put(input.id + '-value', fmt(Number(input.value))));
        update();
      };
      el.addEventListener('input', render); el.addEventListener('change', render); render();
    };
    el.className = 'lab advanced-lab';
    if (['bondi', 'parker-wind'].includes(el.dataset.lab)) {
      const wind = el.dataset.lab === 'parker-wind';
      const scaleControl = wind ? range('flow-temperature', 'T / 10⁶ K', .5, 3, .1, 1) : range('flow-sound', 'cₛ / (km s⁻¹)', .2, 10, .1, 1);
      el.innerHTML = shell(t('確かめる：同じ音速点、二つの流れ', 'Explore: one sonic point, two flows'), scaleControl + range('flow-x', 'r / rₛ', .25, 10, .05, 2), [['flow-mach', '𝓜 = u/cₛ'], ['flow-sonic', wind ? 'rₛ / R☉' : 'rₛ / au'], ['flow-scale', wind ? 'cₛ / (km s⁻¹)' : 'Ṁ / (M☉ yr⁻¹)'], ['flow-density', wind ? 'ρ / ρₛ' : 'ρ / ρ∞']], t('緑：選択した流れ。灰色の破線：反対の臨界枝。両軸は対数。赤点は選択半径。速さuはどちらも正、流れの向きは異なる。Bondi例はM＝1 M☉、ρ∞＝10⁻¹⁸ kg m⁻³。風はM＝1 M☉、μ＝0.6で、密度は音速点で規格化。', 'Green: selected flow; dashed gray: the other critical branch. Both axes are logarithmic; the red dot marks the selected radius. Speed u is positive for both, but flow direction differs. Bondi uses 1 M☉ and ρ∞ = 10⁻¹⁸ kg m⁻³. The wind uses 1 M☉, μ = 0.6, and density normalized at its sonic point.'));
      const branch = wind ? 'wind' : 'bondi';
      bind(() => {
        const x = value('flow-x'), mach = M.sphericalMach(x, branch);
        const model = wind ? M.parkerModel(value('flow-temperature') * 1e6) : M.bondiModel(1, 1e-18, value('flow-sound'));
        put('flow-mach', fmt(mach)); put('flow-sonic', fmt(model.sonicRadius / (wind ? C.solarRadius : C.au)));
        put('flow-scale', fmt(wind ? model.sound / 1000 : model.rate * C.year / C.solar));
        put('flow-density', fmt((wind ? 1 : Math.exp(1.5)) / (x * x * mach)));
        draw(graph('gas-flow', t('等温の臨界流の比較', 'Critical isothermal flows'), 'r / rₛ', '𝓜 = u / cₛ', [.2, 10], [.001, 10], [{ points: points(x => M.sphericalMach(x, wind ? 'bondi' : 'wind'), .2, 10, 240, true), color: '#89968c', dash: '5 4' }, { points: points(x => M.sphericalMach(x, branch), .2, 10, 240, true) }], { x, y: mach }, { logX: true, logY: true }));
        status(t(wind ? '外向きの風：内側で亜音速、外側で超音速。密度の絶対値がなければ質量放出率は未定。' : '内向きの降着：外側で亜音速、内側で超音速。温度と外側密度は入力であり、流れの加熱冷却は解いていない。', wind ? 'Outward wind: subsonic inside, supersonic outside. Mass loss still requires an absolute density.' : 'Inward accretion: subsonic outside, supersonic inside. Temperature and reservoir density are inputs; heating and cooling are not solved.'));
      });
      return;
    }
    if (el.dataset.lab === 'bonnor-ebert') {
      el.innerHTML = shell(t('解いて確かめる：外圧を固定した平衡系列', 'Solve and check: fixed-pressure equilibria'), range('be-edge', 'ξᵦ', 1, 12, .05, 6.45) + `<label for="be-step">${t('積分の刻み幅', 'Integration step')}</label><select id="be-step"><option value="0.01">0.01</option><option value="0.005">0.005</option></select>`, [['be-mass', 'μ(ξᵦ)'], ['be-contrast', 'ρc / ρb'], ['be-critical', 'ξcrit'], ['be-peak', 'μmax']], t('緑：最初の質量極大まで。茶色の破線：極大の先。赤点は選んだ表面。中心級数と四次Runge–Kutta法で積分する。時間発展ではなく、同じcₛ・外圧での異なる平衡を比較している。', 'Green: before the first mass maximum; dashed brown: beyond it. The red dot marks the chosen edge. A central series and fourth-order Runge–Kutta integrate the structure. These are different equilibria at fixed cₛ and pressure, not time evolution.'));
      const cache = new Map();
      bind(() => {
        const step = value('be-step'); if (!cache.has(step)) cache.set(step, M.isothermalSphere(12, step));
        const all = cache.get(step), edge = M.isothermalSphere(value('be-edge'), step).edge;
        put('be-mass', fmt(edge.pressureMass)); put('be-contrast', fmt(edge.contrast)); put('be-critical', fmt(all.peak.x)); put('be-peak', fmt(all.peak.pressureMass));
        draw(graph('be-sequence', t('等温球の無次元質量と表面半径', 'Isothermal-sphere dimensionless mass versus edge radius'), 'ξᵦ', 'μ = M G³ᐟ² Pext¹ᐟ² / cₛ⁴', [0, 12], [0, 1.3], [{ points: all.points.filter(p => p.x <= all.peak.x).map(p => ({ x: p.x, y: p.pressureMass })) }, { points: all.points.filter(p => p.x >= all.peak.x).map(p => ({ x: p.x, y: p.pressureMass })), color: '#b25930', dash: '5 4' }], { x: edge.x, y: edge.pressureMass }));
        status(t(edge.x <= all.peak.x ? '最初の極大より手前：この等温・外圧一定模型では半径方向の微小摂動に安定。' : '最初の極大の先：この等温・外圧一定模型では半径方向の微小摂動に不安定。', edge.x <= all.peak.x ? 'Before the first maximum: radially stable in this fixed-pressure isothermal model.' : 'Beyond the first maximum: radially unstable in this fixed-pressure isothermal model.'));
      });
      return;
    }
    if (el.dataset.lab === 'jeans') {
      el.innerHTML = shell(t('確かめる：波長とJeans長', 'Explore: wavelength and Jeans length'), range('jeans-q', 'k / kⱼ', .1, 2, .05, .5) + range('jeans-density', 'log₁₀[ρ₀ / (kg m⁻³)]', -19, -15, .25, -17), [['jeans-length', 'λⱼ / pc'], ['jeans-mass', 'Mⱼ / M☉'], ['jeans-time', 'tⱼ / yr'], ['jeans-growth', 'σ tⱼ']], t('音速cₛ＝0.2 km/s。緑の曲線はω²/(4πGρ₀)＝(k/kⱼ)²−1。色の付いた負の領域では指数成長する。k＝0の点は形式的な長波長極限。回転や非線形崩壊は含まない。', 'Sound speed is 0.2 km/s. The green curve is ω²/(4πGρ₀) = (k/kⱼ)²−1. Negative shaded values indicate exponential growth. The k = 0 endpoint is a formal long-wave limit. Rotation and nonlinear collapse are excluded.'));
      bind(() => {
        const q = value('jeans-q'), model = M.jeansModel(.2, 10 ** value('jeans-density'), q);
        put('jeans-length', fmt(model.wavelength / C.pc)); put('jeans-mass', fmt(model.mass / C.solar)); put('jeans-time', fmt(model.gravityTime / C.year)); put('jeans-growth', fmt(model.growth));
        draw(graph('jeans-dispersion', t('Jeans分散関係', 'Jeans dispersion relation'), 'k / kⱼ', 'ω² / (4πGρ₀)', [0, 2], [-1, 3], [{ points: points(x => x * x - 1, 0, 2) }], { x: q, y: model.omegaSquared }, { negative: true }));
        status(t(q < 1 ? 'λ > λⱼ：線形に不安定。密度の揺らぎが十分小さい段階だけを記述する。' : q === 1 ? 'λ = λⱼ：中立。指数成長率は0。' : 'λ < λⱼ：この理想模型では音波として振動する。', q < 1 ? 'λ > λⱼ: linearly unstable, only while density contrast is small.' : q === 1 ? 'λ = λⱼ: neutral, with zero exponential growth.' : 'λ < λⱼ: oscillatory in this idealized model.'));
      });
      return;
    }
    if (el.dataset.lab === 'stromgren') {
      el.innerHTML = shell(t('確かめる：光子収支で広がる電離領域', 'Explore: an ionized region from photon balance'), range('hii-source', 'log₁₀[S / s⁻¹]', 48, 50, .1, 49) + range('hii-density', 'log₁₀[n / cm⁻³]', 1, 4, .1, 2) + range('hii-time', 't / tᵣₑc', 0, 5, .05, 1), [['hii-radius', 'Rₛ / pc'], ['hii-recombination', 'tᵣₑc / yr'], ['hii-front', 'R(t) / pc'], ['hii-volume', t('電離体積 / 平衡体積', 'Ionized / equilibrium volume')]], t('純水素・一様で静止したガス、αB＝2.6×10⁻¹³ cm³/s。曲線はR/Rₛ、赤点は選択時刻。加熱によるガスの膨張は含めない。ごく初期には光の有限な速さを無視した近似が破れる。', 'Uniform, static, pure hydrogen; αB = 2.6×10⁻¹³ cm³/s. The curve is R/Rₛ; the red dot marks the selected time. Gas expansion after heating is excluded. At very early times the approximation neglecting finite light speed fails.'));
      bind(() => {
        const tau = value('hii-time'), model = M.stromgrenModel(10 ** value('hii-source'), 10 ** value('hii-density'), tau);
        put('hii-radius', fmt(model.radius / C.pc)); put('hii-recombination', fmt(model.recombinationTime / C.year)); put('hii-front', fmt(model.radius * model.radiusFraction / C.pc)); put('hii-volume', fmt(model.volumeFraction));
        draw(graph('hii-growth', t('静止ガス中の電離前線の成長', 'Ionization-front growth in static gas'), 't / tᵣₑc', 'R / Rₛ', [0, 5], [0, 1], [{ points: points(x => Math.cbrt(-Math.expm1(-x)), 0, 5) }], { x: tau, y: model.radiusFraction }) + `<svg viewBox="0 0 640 235" role="img" aria-labelledby="hii-sphere-title"><title id="hii-sphere-title">${t('電離領域の断面：破線が平衡半径、青い円が現在の電離領域', 'Ionized-region cross section: dashed equilibrium radius and blue current ionized region')}</title><circle cx="320" cy="110" r="83" fill="none" stroke="#89968c" stroke-dasharray="5 4"/><circle cx="320" cy="110" r="${83 * model.radiusFraction}" fill="#aacbdb" stroke="#48758d"/><circle cx="320" cy="110" r="5" fill="#b25930"/><path d="M320 110H403" stroke="#6a7770" stroke-dasharray="3 3"/><text x="420" y="115">Rₛ</text><text x="320" y="217" text-anchor="middle">${t('青：電離領域 ／ 周囲：中性ガス（静止）', 'Blue: ionized gas / outside: neutral gas (static)')}</text></svg>`);
        status(t(`経過時間は${fmt(model.time / C.year)}年。再結合に使われる光子の割合は${fmt(100 * model.volumeFraction)}%。残りが新しい原子を電離する。`, `Elapsed time: ${fmt(model.time / C.year)} yr. Recombination consumes ${fmt(100 * model.volumeFraction)}% of source photons; the rest ionize new atoms.`));
      });
      return;
    }
    if (el.dataset.lab === 'alpha-disk') {
      el.innerHTML = shell(t('確かめる：輸送の強さと粘性時間', 'Explore: transport strength and viscous time'), range('disk-alpha', 'log₁₀ α', -4, -1, .1, -2) + range('disk-aspect', 'H / r', .02, .15, .005, .05) + `<label for="disk-radius">${t('半径 / au', 'Radius / au')}</label><select id="disk-radius"><option>1</option><option selected>10</option><option>100</option></select>`, [['disk-viscosity', 'ν / (m² s⁻¹)'], ['disk-time', 'tν / yr'], ['disk-rate', 'Ṁ / (M☉ yr⁻¹)'], ['disk-sound', 'cₛ / (km s⁻¹)']], t('M＝1 M☉、Σ＝100 g/cm²＝1000 kg/m²。ν＝αcₛHの定義を使う。Ṁは内縁から十分離れた定常円盤の局所的な見積もり。温度やΣの時間発展は解かない。両軸は対数。', 'M = 1 M☉ and Σ = 100 g/cm² = 1000 kg/m²; ν ≡ αcₛH. The rate is a local estimate for a steady disk far from its inner edge. Temperature and surface-density evolution are not solved. Both axes are logarithmic.'));
      bind(() => {
        const alpha = 10 ** value('disk-alpha'), aspect = value('disk-aspect'), radius = value('disk-radius'), model = M.alphaDisk(alpha, aspect, radius);
        put('disk-viscosity', fmt(model.viscosity)); put('disk-time', fmt(model.viscousTime / C.year)); put('disk-rate', fmt(model.rate * C.year / C.solar)); put('disk-sound', fmt(model.sound / 1000));
        const time = a => M.alphaDisk(a, aspect, radius).viscousTime / C.year;
        draw(graph('alpha-time', t('粘性時間とα', 'Viscous time versus α'), 'α', 'tν / yr', [1e-4, .1], [10 ** Math.floor(Math.log10(time(.1))), 10 ** Math.ceil(Math.log10(time(1e-4)))], [{ points: points(time, 1e-4, .1, 240, true) }], { x: alpha, y: model.viscousTime / C.year }, { logX: true, logY: true }));
        status(t(`局所の軌道周期は${fmt(2 * Math.PI / model.omega / C.year)}年。tν＝r²/νは輸送の時間尺度で、個々のガス要素の落下時間と同じ定義ではない。`, `The local orbital period is ${fmt(2 * Math.PI / model.omega / C.year)} yr. tν ≡ r²/ν is a transport timescale; it is not defined as the infall time of a gas parcel.`));
      });
      return;
    }
    if (el.dataset.lab === 'mri') {
      el.innerHTML = shell(t('確かめる：弱い磁場が不安定にする範囲', 'Explore: the unstable range of magnetic tension'), `<label for="mri-shear">q = −d ln Ω / d ln r</label><select id="mri-shear"><option value="0">0</option><option value="1">1</option><option value="1.5" selected>1.5 (Kepler)</option><option value="1.8">1.8</option></select>` + range('mri-b', 'b = k vA / Ω', 0, 2.2, .025, 1), [['mri-growth', 's / Ω'], ['mri-maximum', 'smax / Ω'], ['mri-fastest', 'bmax'], ['mri-cutoff', 'bcut']], t('理想MHD・非圧縮・一様な鉛直磁場・軸対称の鉛直波数k。緑は選択したq、灰色の破線はKepler回転。パネルは線形成長率だけを示し、飽和した乱流やαの値は求めない。', 'Ideal, incompressible MHD with a uniform vertical field and axisymmetric vertical wavenumber k. Green: selected q; dashed gray: Keplerian rotation. This panel gives linear growth, not saturated turbulence or an α value.'));
      bind(() => {
        const q = value('mri-shear'), b = value('mri-b'), model = M.mriMode(q, b);
        put('mri-growth', fmt(model.growth)); put('mri-maximum', fmt(model.maximumGrowth)); put('mri-fastest', fmt(model.fastestB)); put('mri-cutoff', fmt(model.cutoffB));
        draw(graph('mri-growth-curve', t('磁気回転不安定性の成長率', 'Magnetorotational instability growth rate'), 'b = k vA / Ω', 's / Ω', [0, 2.2], [0, 1], [{ points: points(x => M.mriMode(1.5, x).growth, 0, 2.2), color: '#89968c', dash: '5 4' }, { points: points(x => M.mriMode(q, x).growth, 0, 2.2) }], { x: b, y: model.growth }));
        status(t(model.growth > 0 ? `このモードは不安定。振幅がe倍になる時間は軌道周期の${fmt(1 / (2 * Math.PI * model.growth))}倍。` : 'このモードの指数成長率は0。ある波数で安定でも、異なる波数のモードまで安定とは限らない。', model.growth > 0 ? `This mode is unstable. Its amplitude e-folding time is ${fmt(1 / (2 * Math.PI * model.growth))} orbital periods.` : 'This mode has zero exponential growth. Stability at one wavenumber does not imply stability of modes at other wavenumbers.'));
      });
      return;
    }
    if (el.dataset.lab === 'toomre-q') {
      el.innerHTML = shell(t('確かめる：回転と圧力が守れない波長', 'Explore: wavelengths not protected by rotation and pressure'), range('toomre-q', 'Q', .5, 2, .025, .8), [['toomre-minimum', 'min(ω² / κ²)'], ['toomre-fastest', 'xmax = |k|cₛ / κ'], ['toomre-growth', 'smax / κ'], ['toomre-band', t('不安定なxの範囲', 'Unstable range of x')]], t('薄いガス円盤の局所・軸対称・線形模型。緑は選択したQ、灰色の破線はQ＝1。色の付いた負の領域が不安定。赤点は分散関係の最小値。星の円盤や冷却を伴う非線形な分裂は別の問題。', 'Local, axisymmetric, linear model of a razor-thin gas disk. Green: selected Q; dashed gray: Q = 1. Negative shaded values are unstable; the red dot is the dispersion minimum. Stellar disks and nonlinear fragmentation with cooling are separate problems.'));
      bind(() => {
        const Q = value('toomre-q'), model = M.toomreMode(Q, 1 / Q), minimum = model.omegaSquared;
        put('toomre-minimum', fmt(minimum)); put('toomre-fastest', fmt(model.fastestX)); put('toomre-growth', fmt(model.maximumGrowth)); put('toomre-band', model.band ? `${fmt(model.band[0])} < x < ${fmt(model.band[1])}` : '—');
        draw(graph('toomre-dispersion', t('ガス円盤の分散関係', 'Gas-disk dispersion relation'), 'x = |k|cₛ / κ', 'ω² / κ²', [0, 4], [-4, 18], [{ points: points(x => (x - 1) ** 2, 0, 4), color: '#89968c', dash: '5 4' }, { points: points(x => M.toomreMode(Q, x).omegaSquared, 0, 4) }], { x: model.fastestX, y: minimum }, { negative: true }));
        status(t(Q < 1 ? 'Q < 1：ある波長の帯で軸対称摂動が成長する。実際に塊へ分裂するかは冷却などにも依存する。' : Q === 1 ? 'Q = 1：x＝1で中立。指数成長率は0。' : 'Q > 1：この模型の軸対称摂動は全波数で安定。非軸対称構造や他の不安定性を排除する条件ではない。', Q < 1 ? 'Q < 1: axisymmetric perturbations grow in a band of wavelengths. Actual fragmentation also depends on cooling and other physics.' : Q === 1 ? 'Q = 1: neutral at x = 1, with zero exponential growth.' : 'Q > 1: axisymmetric perturbations are stable at every wavenumber in this model. This does not exclude non-axisymmetric structures or other instabilities.'));
      });
    }
  }
  window.AstroGasLabs = { supports: id => types.has(id), mount };
})();
