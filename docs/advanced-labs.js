/* Numerical experiments for the advanced worked chapters. */
(() => {
  'use strict';
  const { laneEmden, sedov } = window.AstroAdvancedMath;
  const chart = (id, title, xLabel, yLabel, curves, ticks = '') => `<svg viewBox="0 0 600 280" role="img" aria-labelledby="${id}-title"><title id="${id}-title">${title}</title><path d="M55 30V230H575" fill="none" stroke="#9faea4"/><path d="M55 30H575M55 130H575" fill="none" stroke="#d8dfd5" stroke-dasharray="3 4"/><text x="12" y="35">1</text><text x="27" y="234">0</text><text x="70" y="18">${yLabel}</text><text x="235" y="270">${xLabel}</text>${ticks}${curves}</svg>`;
  const curve = (points, x, y) => points.filter((_, i) => i % Math.max(1, Math.floor(points.length / 600)) === 0 || i === points.length - 1).map((p, i) => `${i ? 'L' : 'M'}${x(p).toFixed(3)} ${y(p).toFixed(3)}`).join(' ');
  const line = (id, color) => `<path id="${id}" fill="none" stroke="${color}" stroke-width="2.5"/>`;
  const stepControl = (id, t) => `<label for="${id}">${t('数値積分の刻み幅', 'Numerical integration step')}</label><select id="${id}"><option value="coarse">${t('標準', 'Standard')}</option><option value="fine">${t('半分の刻みで再計算', 'Recalculate with half the step')}</option></select>`;
  function mount(el, locale) {
    const t = (ja, en) => locale === 'ja' ? ja : en;
    const fmt = value => value.toLocaleString(locale, { maximumSignificantDigits: 5 });
    el.className = 'lab advanced-lab';
    if (['rayleigh-taylor', 'kelvin-helmholtz'].includes(el.dataset.lab)) {
      const kh = el.dataset.lab === 'kelvin-helmholtz';
      el.innerHTML = `<h3>${t('確かめる：境界の線形成長', 'Explore: linear interface growth')}</h3><label for="interface-ratio">ρ₁ / ρ₂</label><select id="interface-ratio"><option value="0.25">0.25</option><option value="1" ${kh ? 'selected' : ''}>1</option><option value="3" ${kh ? '' : 'selected'}>3</option><option value="4">4</option></select><label for="interface-k">k L₀ = <output id="interface-k-value"></output></label><input id="interface-k" type="range" min="0.5" max="4" step="0.05" value="1">${kh ? `<label for="interface-gravity">${t('下向き加速度', 'Downward acceleration')}</label><select id="interface-gravity"><option value="0">g = 0</option><option value="1">g = L₀ / t₀²</option></select><label for="interface-shear">|ΔU| / (L₀/t₀) = <output id="interface-shear-value"></output></label><input id="interface-shear" type="range" min="0" max="2" step="0.05" value="1">` : ''}<label for="interface-time">t / t₀ = <output id="interface-time-value"></output></label><input id="interface-time" type="range" min="0" max="3" step="0.05" value="1"><div class="readout"><div class="stat"><small>Atwood A</small><strong id="interface-atwood"></strong></div><div class="stat"><small>σ t₀</small><strong id="interface-growth"></strong></div><div class="stat"><small>${t('e倍の時間 τ / t₀', 'E-folding time τ / t₀')}</small><strong id="interface-tau"></strong></div><div class="stat"><small>${t('振動角周波数 |Ω| t₀', 'Oscillation frequency |Ω| t₀')}</small><strong id="interface-frequency"></strong></div></div><svg viewBox="0 0 600 210" role="img" aria-labelledby="interface-title"><title id="interface-title">${t('上側と下側の流体の間の単一の線形モード。変形は拡大表示。', 'A single linear mode between upper and lower fluids; displacement is magnified.')}</title><rect x="20" y="20" width="560" height="85" fill="#dce6e8"/><rect x="20" y="105" width="560" height="85" fill="#ebe0cf"/><text x="30" y="40">ρ₁</text><text x="30" y="180">ρ₂</text><path d="M20 105H580" stroke="#bbc8bc" stroke-dasharray="4 4"/><path id="interface-wave" fill="none" stroke="#bb592f" stroke-width="2.5"/></svg><p id="interface-check" class="lab-note" role="status"></p><p class="lab-note">${t('L₀とt₀は任意の長さ・時間の単位。図の横幅は1波長、変形は10倍に拡大。初期値はkζ₀＝0.005。k|ζ|>0.1で線形波の表示を停止する。この0.1は表示の目安で、厳密な安定性の境界ではない。', 'L₀ and t₀ are chosen length/time units. The plot spans one wavelength with displacement magnified 10 times; initially kζ₀ = 0.005. The linear-wave display stops at k|ζ| > 0.1, a display threshold rather than an exact stability boundary.')} ${kh ? t('U₁＝ΔU/2、U₂＝−ΔU/2。gも選ぶとRTとKHを合わせた分散関係を使う。', 'U₁ = ΔU/2, U₂ = −ΔU/2. Selecting gravity uses the combined RT/KH relation.') : t('g＝L₀/t₀²、流速は0。', 'g = L₀/t₀², with zero background velocities.')}</p>`;
      const update = () => {
        const ratio = Number(el.querySelector('#interface-ratio').value), k = Number(el.querySelector('#interface-k').value);
        const time = Number(el.querySelector('#interface-time').value), shear = kh ? Number(el.querySelector('#interface-shear').value) : 0;
        const gravity = kh ? Number(el.querySelector('#interface-gravity').value) : 1;
        const mode = window.AstroAdvancedMath.interfaceMode(ratio, k, gravity, shear);
        el.querySelector('#interface-k-value').textContent = k.toFixed(2);
        el.querySelector('#interface-time-value').textContent = time.toFixed(2);
        if (kh) el.querySelector('#interface-shear-value').textContent = shear.toFixed(2);
        el.querySelector('#interface-atwood').textContent = mode.atwood.toFixed(4);
        el.querySelector('#interface-growth').textContent = mode.growth.toFixed(4);
        el.querySelector('#interface-tau').textContent = mode.growth ? (1 / mode.growth).toFixed(4) : '—';
        el.querySelector('#interface-frequency').textContent = mode.frequency.toFixed(4);
        // Growing branch when unstable; a standing wave at zero initial speed when stable.
        const envelope = mode.growth ? Math.exp(mode.growth * time) : Math.cos(mode.frequency * time);
        const smallness = .005 * Math.abs(envelope);
        const points = Array.from({ length: 201 }, (_, i) => ({ x: i / 200, y: envelope * Math.cos(2 * Math.PI * i / 200 - k * mode.drift * time) }));
        el.querySelector('#interface-wave').setAttribute('d', smallness <= .1 ? curve(points, p => 20 + 560 * p.x, p => 105 - 560 * 10 * .005 / (2 * Math.PI) * p.y) : '');
        el.querySelector('#interface-check').textContent = `${mode.growth ? t('成長する枝を表示。', 'Showing the growing branch. ') : mode.frequency ? t('安定な振動を表示。', 'Showing stable oscillation. ') : t('成長も復元力もない。', 'No growth or restoring force. ')} k|ζ| = ${smallness.toFixed(4)}. ${smallness > .1 ? t('線形範囲の目安を超えたため、波形表示を停止。', 'Wave display stopped beyond the linear-regime threshold.') : t('線形理論の模式図で、渦や混合を計算したものではない。', 'A schematic linear mode; vortices and mixing are not simulated.')}`;
      };
      el.querySelectorAll('select,input').forEach(input => input.addEventListener('input', update)); update();
    }
    if (el.dataset.lab === 'lane-emden') {
      el.innerHTML = `<h3>${t('解いて確かめる：星の無次元構造', 'Solve and check: dimensionless stellar structure')}</h3><label for="le-index">${t('ポリトロープ指数', 'Polytropic index')}</label><select id="le-index"><option value="1">n = 1</option><option value="1.5">n = 3/2</option><option value="3" selected>n = 3</option></select>${stepControl('le-step', t)}${chart('le', t('表面までのθと相対密度の数値解', 'Numerical θ and relative density up to the surface'), 'r / R', 'θ, ρ/ρc', line('le-theta', '#345c70') + line('le-density', '#bb592f'), '<text x="53" y="250">0</text><text x="565" y="250">1</text>')}<p class="lab-note">${t('青：θ、橙：密度ρ/ρ_c＝θⁿ。横軸は各模型の表面で割った半径。', 'Blue: θ; orange: density ρ/ρ_c = θⁿ. Radius is divided by each model’s surface radius.')}</p><div class="readout"><div class="stat"><small>ξ₁</small><strong id="le-radius"></strong></div><div class="stat"><small>μₙ = −ξ₁²θ′(ξ₁)</small><strong id="le-mass"></strong></div><div class="stat"><small>ρc / ρmean</small><strong id="le-concentration"></strong></div><div class="stat"><small>${t('積分刻み Δξ', 'Integration step Δξ')}</small><strong id="le-h"></strong></div></div><p class="lab-note" id="le-check" role="status"></p>`;
      const update = () => {
        const n = Number(el.querySelector('#le-index').value), h = el.querySelector('#le-step').value === 'fine' ? .001 : .002;
        const data = laneEmden(n, h);
        for (const [id, value] of [['radius', data.radius], ['mass', data.mass], ['concentration', data.concentration], ['h', h]]) el.querySelector(`#le-${id}`).textContent = fmt(value);
        el.querySelector('#le-theta').setAttribute('d', curve(data.points, p => 55 + 520 * p.x / data.radius, p => 230 - 200 * p.theta));
        el.querySelector('#le-density').setAttribute('d', curve(data.points, p => 55 + 520 * p.x / data.radius, p => 230 - 200 * p.density));
        el.querySelector('#le-check').textContent = n === 1 ? `${t('解析解のξ₁＝πとの差：', 'Difference from the analytic ξ₁ = π: ')}${Math.abs(data.radius - Math.PI).toExponential(2)}` : t('nとKを固定すると、この形は同じ。中心密度の変更はaを通じて実際の半径と質量を変える。', 'At fixed n and K this shape is fixed. Changing central density changes physical radius and mass through a.');
      };
      el.querySelectorAll('select').forEach(input => input.addEventListener('input', update)); update();
    }
    if (el.dataset.lab === 'sedov') {
      el.innerHTML = `<h3>${t('解いて確かめる：衝撃波の内側', 'Solve and check: inside the shock')}</h3>${stepControl('sedov-step', t)}${chart('sedov', t('強い衝撃波の内側の速度、密度、圧力の数値解', 'Numerical velocity, density and pressure inside a strong shock'), 'x = r / R', t('衝撃波直後の値で規格化', 'Normalized to immediate post-shock values'), line('sedov-v', '#345c70') + line('sedov-g', '#bb592f') + line('sedov-z', '#648950'), '<text x="53" y="250">0</text><text x="565" y="250">1</text>')}<p class="lab-note">${t('青：V/(3/4)、橙：G/4、緑：Z/(3/4)。x＝1が波面。0.05≤x≤1を数値積分。', 'Blue: V/(3/4); orange: G/4; green: Z/(3/4). The front is at x = 1. Numerically integrated on 0.05 ≤ x ≤ 1.')}</p><div class="readout"><div class="stat"><small>β</small><strong id="sedov-beta"></strong></div><div class="stat"><small>${t('掃き集めた質量との比', 'Enclosed / swept-up mass')}</small><strong id="sedov-mass"></strong></div></div><p class="lab-note" id="sedov-check" role="status"></p>`;
      const update = () => {
        const h = el.querySelector('#sedov-step').value === 'fine' ? .00025 : .0005, data = sedov(h);
        for (const [key, scale] of [['v', .75], ['g', 4], ['z', .75]]) el.querySelector(`#sedov-${key}`).setAttribute('d', curve(data.points, p => 55 + 520 * p.x, p => 230 - 200 * p[key] / scale));
        el.querySelector('#sedov-beta').textContent = data.beta.toFixed(6);
        el.querySelector('#sedov-mass').textContent = data.massRatio.toFixed(6);
        el.querySelector('#sedov-check').textContent = `|Δx| = ${h}; I ≈ ${fmt(data.integral)}. ${t('質量比の理想値は1。中心補正と離散化の誤差を含む。', 'The ideal mass ratio is one. Values include central-core and discretization errors.')}`;
      };
      el.querySelector('select').addEventListener('input', update); update();
    }
    if (el.dataset.lab === 'acceleration') {
      el.innerHTML = `<h3>${t('確かめる：圧縮比とべき乗の傾き', 'Explore: compression and spectral slope')}</h3><label for="dsa-mach">${t('上流のマッハ数', 'Upstream Mach number')} ℳ₁ = <output id="dsa-mach-value"></output></label><input id="dsa-mach" type="range" min="2" max="30" step="0.1" value="10"><div class="readout"><div class="stat"><small>χ (γgas = 5/3)</small><strong id="dsa-compression"></strong></div><div class="stat"><small>dN/dE ∝ E⁻ˢ</small><strong id="dsa-slope"></strong></div></div><p id="dsa-check" class="lab-note" role="status"></p><p class="lab-note">${t('Rankine–Hugoniot条件からχを計算し、試験粒子近似のsへ変換する。上流の速さは十分非相対論的とする。有限マッハ数ではχ<4なのでs>2。', 'Computes χ from the shock jump conditions and converts it to test-particle slope s. The upstream flow is assumed sufficiently nonrelativistic. At finite Mach number, χ < 4 and s > 2.')}</p>`;
      const update = () => {
        const mach = Number(el.querySelector('input').value), chi = 4 * mach * mach / (mach * mach + 3), slope = (chi + 2) / (chi - 1);
        el.querySelector('#dsa-mach-value').textContent = mach.toFixed(1);
        el.querySelector('#dsa-compression').textContent = chi.toFixed(4);
        el.querySelector('#dsa-slope').textContent = `s = ${slope.toFixed(4)}`;
        el.querySelector('#dsa-check').textContent = `${t('冷却前の薄いシンクロトロン放射なら、', 'For uncooled, optically thin synchrotron emission, ')}α = (s−1)/2 = ${((slope - 1) / 2).toFixed(4)}. ${t('次の章へつながる関係。', 'This connects to the next chapter.')}`;
      };
      el.querySelector('input').addEventListener('input', update); update();
    }
    if (el.dataset.lab === 'synchrotron') {
      el.innerHTML = `<h3>${t('確かめる：電子のエネルギーと冷却', 'Explore: electron energy and cooling')}</h3><label for="syn-gamma">log₁₀ γ = <output id="syn-gamma-value"></output></label><input id="syn-gamma" type="range" min="3" max="8" step="0.01" value="4"><label for="syn-field">log₁₀(B / μG) = <output id="syn-field-value"></output></label><input id="syn-field" type="range" min="0" max="3" step="0.01" value="1"><div class="readout"><div class="stat"><small>${t('代表臨界周波数 νc [Hz]', 'Representative critical νc [Hz]')}</small><strong id="syn-frequency"></strong></div><div class="stat"><small>${t('等方平均の冷却時間 [年]', 'Isotropic cooling time [yr]')}</small><strong id="syn-time"></strong></div><div class="stat"><small>E [GeV]</small><strong id="syn-energy"></strong></div><div class="stat"><small>hνc [eV]</small><strong id="syn-photon"></strong></div></div>${chart('cooling', t('一定磁場のもとでの電子の冷却：γ(t)/γ₀＝1/(1+t/t₀)', 'Electron cooling at fixed field: γ(t)/γ₀ = 1/(1+t/t₀)'), 't / t₀', 'γ(t) / γ₀', line('syn-curve', '#345c70'), '<text x="53" y="250">0</text><text x="565" y="250">5</text>')}<p class="lab-note" id="syn-check" role="status"></p><p class="lab-note">${t('等方的なピッチ角分布を仮定し、代表周波数にはsinψ＝√(2/3)を使う。これは角度平均スペクトルのピークではない。パワーと冷却時間は⟨sin²ψ⟩＝2/3による平均値。グラフは単電子スペクトルではなく、同じ無次元形になる冷却曲線である。', 'Assumes isotropic pitch angles, using sinψ = √(2/3) for a representative frequency, not the peak of an angle-averaged spectrum. Power and cooling use ⟨sin²ψ⟩ = 2/3. The graph is the universal dimensionless cooling curve, not a single-electron spectrum.')}</p>`;
      const points = Array.from({ length: 101 }, (_, i) => ({ t: i / 20, ratio: 1 / (1 + i / 20) }));
      el.querySelector('#syn-curve').setAttribute('d', curve(points, p => 55 + 104 * p.t, p => 230 - 200 * p.ratio));
      const update = () => {
        const logGamma = Number(el.querySelector('#syn-gamma').value), logB = Number(el.querySelector('#syn-field').value);
        const gamma = 10 ** logGamma, b = 10 ** logB * 1e-10;
        const me = 9.1093837139e-31, c = 299792458, e = 1.602176634e-19, sigma = 6.6524587051e-29;
        const ub = b * b / (2 * 1.25663706127e-6);
        const nu = 3 * e * b / (4 * Math.PI * me) * gamma * gamma * Math.sqrt(2 / 3);
        const time = 3 * me * c / (4 * sigma * ub * gamma) / 31557600;
        el.querySelector('#syn-gamma-value').textContent = logGamma.toFixed(2);
        el.querySelector('#syn-field-value').textContent = logB.toFixed(2);
        el.querySelector('#syn-frequency').textContent = nu.toExponential(3);
        el.querySelector('#syn-time').textContent = time.toExponential(3);
        el.querySelector('#syn-energy').textContent = (gamma * me * c * c / e / 1e9).toExponential(3);
        el.querySelector('#syn-photon').textContent = (6.62607015e-34 * nu / e).toExponential(3);
        el.querySelector('#syn-check').textContent = `t₀ = ${time.toExponential(3)} ${t('年。t＝t₀でγは初期値の半分になる。逆Compton損失や膨張は含まない。', 'yr. At t = t₀, γ falls to half its initial value. Inverse-Compton and expansion losses are omitted.')}`;
      };
      el.querySelectorAll('input').forEach(input => input.addEventListener('input', update)); update();
    }
  }
  window.AstroAdvancedLabs = { mount };
})();
