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
    if (el.dataset.lab === 'angular-momentum') {
      el.innerHTML = `<h3>${t('確かめる：二つの環で角運動量を交換する', 'Explore: exchange angular momentum between two rings')}</h3><label for="ring-transfer">δ = δJ / J₀ = <output id="ring-transfer-value" for="ring-transfer"></output></label><input id="ring-transfer" type="range" min="0" max="0.3" step="0.001" value="0.1"><svg viewBox="0 0 600 420" role="img" aria-labelledby="ring-title"><title id="ring-title">${t('角運動量交換後の二つの円軌道。中心質量と各環の質量は固定。', 'Two circular end-state orbits after exchange, with central and ring masses fixed.')}</title><defs><marker id="ring-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#64866e"/></marker></defs><g fill="none" stroke="#b7c3b8" stroke-dasharray="4 6"><circle cx="300" cy="210" r="31"/><circle cx="300" cy="210" r="124"/></g><circle id="ring-inner" cx="300" cy="210" fill="none" stroke="#bb592f" stroke-width="3"/><circle id="ring-outer" cx="300" cy="210" fill="none" stroke="#345c70" stroke-width="3"/><circle cx="300" cy="210" r="6" fill="#cc9e5e"/><line id="ring-exchange-arrow" y1="210" y2="210" stroke="#64866e" stroke-width="2" marker-end="url(#ring-arrow)"/><text id="ring-inner-label" y="214" text-anchor="end">${t('内環', 'inner')}</text><text id="ring-outer-label" y="214">${t('外環', 'outer')}</text><text x="350" y="193">δJ →</text><text x="25" y="26">${t('破線：最初の円軌道', 'Dashed: initial circular orbits')}</text><text x="25" y="399">${t('矢印：角運動量の交換（物質の軌跡ではない）', 'Arrow: angular-momentum transfer, not a material trajectory')}</text></svg><p class="lab-note">${t('橙：内環、青：外環。図の半径はr/r₀に比例する。スライダーは時間ではなく、交換量δ。二つの環の質量は変わらない。', 'Orange: inner ring; blue: outer ring. Drawn radii are proportional to r/r₀. The slider sets exchanged angular momentum δ, not time. Both ring masses stay fixed.')}</p><div class="readout"><div class="stat"><small>rin / r₀</small><strong id="ring-inner-radius"></strong></div><div class="stat"><small>rout / r₀</small><strong id="ring-outer-radius"></strong></div><div class="stat"><small>(Jin + Jout) / J₀</small><strong id="ring-total-j"></strong></div><div class="stat"><small>${t('解放エネルギー / E₀', 'Released energy / E₀')}</small><strong id="ring-release"></strong></div></div><p id="ring-check" class="lab-note" role="status"></p>`;
      const update = () => {
        const transfer = Number(el.querySelector('input').value), data = window.AstroAdvancedMath.ringExchange(transfer);
        el.querySelector('#ring-transfer-value').textContent = transfer.toFixed(3);
        for (const [id, value] of [['inner-radius', data.innerRadius], ['outer-radius', data.outerRadius], ['total-j', data.totalJ], ['release', data.releasedEnergy]]) el.querySelector(`#ring-${id}`).textContent = value.toFixed(4);
        el.querySelector('#ring-inner').setAttribute('r', 31 * data.innerRadius); el.querySelector('#ring-outer').setAttribute('r', 31 * data.outerRadius);
        el.querySelector('#ring-inner-label').setAttribute('x', 300 - 31 * data.innerRadius - 8); el.querySelector('#ring-outer-label').setAttribute('x', 300 + 31 * data.outerRadius + 8);
        el.querySelector('#ring-exchange-arrow').setAttribute('x1', 300 + 31 * data.innerRadius + 8); el.querySelector('#ring-exchange-arrow').setAttribute('x2', 300 + 31 * data.outerRadius - 8);
        el.querySelector('#ring-check').textContent = `Jin/J₀ = ${data.innerJ.toFixed(3)}, Jout/J₀ = ${data.outerJ.toFixed(3)}; Eorb/E₀ = ${data.energy.toFixed(4)}. ${t('全角運動量は3で一定。減った軌道エネルギーが、他の形へ移るエネルギーになる。', 'Total angular momentum stays at 3. The decrease in orbital energy is available to other energy channels.')}`;
      };
      el.querySelector('input').addEventListener('input', update); update();
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
    if (el.dataset.lab === 'sunyaev-zeldovich') {
      el.innerHTML = `<h3>${t('確かめる：銀河団が残すSZスペクトル', 'Explore: a galaxy cluster’s SZ spectrum')}</h3><label for="sz-temperature">kBTₑ = <output id="sz-temperature-value"></output> keV</label><input id="sz-temperature" type="range" min="1" max="12" step="0.1" value="8"><label for="sz-density">log₁₀(nₑ / cm⁻³) = <output id="sz-density-value"></output></label><input id="sz-density" type="range" min="-4" max="-2.5" step="0.01" value="-3"><label for="sz-depth">L = <output id="sz-depth-value"></output> Mpc</label><input id="sz-depth" type="range" min="0.1" max="2" step="0.01" value="1"><label for="sz-frequency">${t('読み取る周波数', 'Readout frequency')} ν = <output id="sz-frequency-value"></output> GHz</label><input id="sz-frequency" type="range" min="20" max="400" step="0.5" value="150"><label for="sz-velocity">${t('発展：視線速度（正＝遠ざかる）', 'Extension: line-of-sight velocity (positive = receding)')}</label><select id="sz-velocity"><option value="0">${t('0 km/s：熱的SZのみ', '0 km/s: thermal SZ only')}</option><option value="300">+300 km/s</option><option value="-300">−300 km/s</option><option value="1000">+1000 km/s</option><option value="-1000">−1000 km/s</option></select><svg viewBox="0 0 600 310" role="img" aria-labelledby="sz-title"><title id="sz-title">${t('周波数とCMB強度差。熱的成分と、速度を選んだ場合の合計。', 'CMB intensity difference versus frequency: thermal component and, when velocity is selected, the total.')}</title><path d="M65 40V255H575" fill="none" stroke="#9faea4"/><line id="sz-zero" x1="65" x2="575" stroke="#aebbb0"/><line id="sz-null" x1="330.1" x2="330.1" y1="40" y2="255" stroke="#abb5b3" stroke-dasharray="3 5"/><text x="336" y="52">217.5 GHz</text><text x="45" y="151">0</text><text x="17" y="44" id="sz-ymax"></text><text x="17" y="259" id="sz-ymin"></text><text x="65" y="20">ΔIν [MJy/sr]</text><text x="65" y="278">20</text><text x="555" y="278">400</text><text x="262" y="300">ν [GHz]</text><path id="sz-thermal" fill="none" stroke="#bb592f" stroke-width="2.5"/><path id="sz-total" fill="none" stroke="#345c70" stroke-width="2" stroke-dasharray="6 3"/><circle id="sz-point" r="5" fill="#345c70"/></svg><p class="lab-note">${t('橙：熱的SZ。青破線：速度を選んだときの熱的＋運動学的SZ。点：指定周波数の合計。縦軸は設定ごとに変わるため、振幅は数値と目盛りで比較する。', 'Orange: thermal SZ. Blue dashed: thermal plus kinetic SZ when a velocity is selected. Point: total at the chosen frequency. The vertical scale adapts; compare amplitudes using the readouts and tick labels.')}</p><div class="readout"><div class="stat"><small>τ</small><strong id="sz-tau"></strong></div><div class="stat"><small>Compton y</small><strong id="sz-y"></strong></div><div class="stat"><small>ΔTth [μK CMB]</small><strong id="sz-thermal-temperature"></strong></div><div class="stat"><small>ΔTkin [μK CMB]</small><strong id="sz-kinetic-temperature"></strong></div></div><p id="sz-check" class="lab-note" role="status"></p><p class="lab-note">${t('一様な電子ガス、T₀＝2.7255 K、非相対論的・小τ・小yの一次式。相対論的補正、多重散乱、塵・電波源・CMB本来の揺らぎは含まない。ΔTはCMB熱力学温度への一次換算であり、電子温度やCMB全体の新しい温度ではない。1 MJy/sr＝10⁻²⁰ W m⁻² Hz⁻¹ sr⁻¹。', 'A uniform electron slab with T₀ = 2.7255 K, using leading nonrelativistic, small-τ, small-y formulas. Relativistic corrections, multiple scattering, dust, radio sources, and primary CMB fluctuations are omitted. ΔT is a linear CMB thermodynamic-temperature conversion, not electron temperature or a new temperature for the full CMB. 1 MJy/sr = 10⁻²⁰ W m⁻² Hz⁻¹ sr⁻¹.')}</p>`;
      const update = () => {
        const temp = Number(el.querySelector('#sz-temperature').value), logDensity = Number(el.querySelector('#sz-density').value);
        const length = Number(el.querySelector('#sz-depth').value), frequency = Number(el.querySelector('#sz-frequency').value), velocity = Number(el.querySelector('#sz-velocity').value);
        const { szModel, szSpectrum } = window.AstroAdvancedMath;
        const model = szModel(temp, 10 ** logDensity, length, velocity), selected = szSpectrum(frequency, model.y, model.tau, velocity);
        for (const [id, value] of [['temperature', temp.toFixed(1)], ['density', logDensity.toFixed(2)], ['depth', length.toFixed(2)], ['frequency', frequency.toFixed(1)]]) el.querySelector(`#sz-${id}-value`).textContent = value;
        const points = Array.from({ length: 381 }, (_, i) => { const nu = 20 + i; const data = szSpectrum(nu, model.y, model.tau, velocity); return { nu, thermal: data.thermalIntensity, total: data.thermalIntensity + data.kineticIntensity }; });
        const limit = Math.max(...points.flatMap(p => [Math.abs(p.thermal), Math.abs(p.total)])) * 1.15;
        const x = nu => 65 + (nu - 20) / 380 * 510, y = value => 147.5 - value / limit * 107.5;
        el.querySelector('#sz-thermal').setAttribute('d', curve(points, p => x(p.nu), p => y(p.thermal)));
        el.querySelector('#sz-total').setAttribute('d', velocity ? curve(points, p => x(p.nu), p => y(p.total)) : '');
        el.querySelector('#sz-zero').setAttribute('y1', 147.5); el.querySelector('#sz-zero').setAttribute('y2', 147.5);
        el.querySelector('#sz-null').setAttribute('x1', x(217.5074)); el.querySelector('#sz-null').setAttribute('x2', x(217.5074));
        el.querySelector('#sz-point').setAttribute('cx', x(frequency)); el.querySelector('#sz-point').setAttribute('cy', y(selected.thermalIntensity + selected.kineticIntensity));
        el.querySelector('#sz-ymax').textContent = limit < .01 ? limit.toExponential(1) : limit.toFixed(3); el.querySelector('#sz-ymin').textContent = limit < .01 ? (-limit).toExponential(1) : (-limit).toFixed(3);
        el.querySelector('#sz-tau').textContent = model.tau.toExponential(3); el.querySelector('#sz-y').textContent = model.y.toExponential(3);
        el.querySelector('#sz-thermal-temperature').textContent = selected.thermalMuK.toFixed(2); el.querySelector('#sz-kinetic-temperature').textContent = selected.kineticMuK.toFixed(2);
        el.querySelector('#sz-check').textContent = `ΔIν = ${(selected.thermalIntensity + selected.kineticIntensity).toExponential(3)} MJy/sr. ${t('低周波極限：', 'Low-frequency limit: ')}ΔTth → ${model.rayleighJeansMuK.toFixed(2)} μK. θₑ = ${model.theta.toFixed(4)}.`;
      };
      el.querySelectorAll('input,select').forEach(input => input.addEventListener('input', update)); update();
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
