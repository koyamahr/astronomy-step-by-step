/* A catalogue of model assumptions, boundary data and mathematical solution types. */
(() => {
  'use strict';
  const title=['ソリューションライブラリー','Solution library'];
  const desc=['天体物理の解を、仮定・境界条件・解の形・適用範囲で比較する。','Compare astrophysical solutions by assumptions, boundary data, mathematical form, and validity.'];
  const domains={balance:['重力平衡','Gravitational equilibrium'],flow:['流れと相似解','Flows and similarity'],structure:['宇宙構造と崩壊','Structure and collapse'],radiation:['放射と電離','Radiation and ionization'],statistics:['統計と緩和','Statistics and relaxation'],relativity:['相対論の時空','Relativistic spacetimes']};
  const entries=[];
  function add(id,domain,kind,equation,assumptions,boundary,parameters,limits) {
    const chapter=window.AstroAdvanced.chapters.find(c=>c.id===id);
    entries.push({id,domain,kind,equation,assumptions,boundary,parameters,limits,title:chapter.title,status:'ready',route:`#/advanced/${id}`,reference:window.AstroAdvanced.sources[chapter.refs[0]]});
  }
  add('lane-emden','balance',['解析的特殊例＋数値解','Analytic special cases and numerical solutions'],
    'ξ⁻² d(ξ² dθ/dξ)/dξ = −θⁿ',
    ['球対称、静水圧平衡、ポリトロープP＝Kρ¹⁺¹⁄ⁿ。','Spherical hydrostatic equilibrium with a polytropic law P = Kρ¹⁺¹⁄ⁿ.'],
    ['中心θ＝1、θ′＝0から積分し、有限半径の模型では最初の零点を表面とする。','Integrate from θ(0) = 1 and θ′(0) = 0; use the first zero as the surface for finite-radius models.'],
    ['指数n、K、中心密度ρc。','Polytropic index n, K, and central density ρc.'],
    ['n＝0,1,5には解析式がある。全てのnで有限な星の表面があるわけではない。','Closed forms exist for n = 0, 1, 5. A finite surface does not exist for every n.']);
  add('bonnor-ebert','balance',['数値的な平衡系列','Numerical equilibrium sequence'],
    'ξ⁻² d(ξ² dψ/dξ)/dξ = e<sup>−ψ</sup>',
    ['球対称、等温、磁場・回転なし。外圧で切り取った自己重力ガス。','Spherical isothermal self-gravity, without rotation or magnetic fields, truncated by external pressure.'],
    ['中心ψ＝ψ′＝0。表面圧P(R)を外圧と一致させる。','Regular centre ψ = ψ′ = 0; match the surface gas pressure to the external pressure.'],
    ['音速、中心密度、無次元の切断半径。','Sound speed, central density, and dimensionless truncation radius.'],
    ['平衡を計算することと安定性の判定を区別する。臨界値は指定した外圧・等温の条件による。','Computing equilibria and testing their stability are distinct. Critical values belong to the stated isothermal, pressure-confined problem.']);
  add('isothermal-cylinder','balance',['厳密な解析的平衡解','Exact analytic equilibrium'],
    'ρ(r) = ρc[1 + r²/(8H²)]<sup>−2</sup>,　H² = cₛ²/(4πGρc)',
    ['無限長、軸対称、等温、磁場・回転なし。','Infinite, axisymmetric, isothermal cylinder with no rotation or magnetic field.'],
    ['軸上で密度有限・勾配ゼロ。外圧があれば半径Rで切り取る。','Finite density and zero gradient on the axis; optional truncation at radius R by external pressure.'],
    ['音速、中心密度、切断した線密度の割合。','Sound speed, central density, and truncated line-mass fraction.'],
    ['有限なのは単位長さあたりの限界質量2cₛ²/G。無限長の総質量や有限フィラメントの端は扱わない。','The limiting line mass is 2cₛ²/G. Total mass of an infinite filament and finite-filament ends are different issues.']);
  add('ellipsoids','balance',['均質楕円体の厳密なポテンシャル','Exact potential of a homogeneous ellipsoid'],
    'Φ = πGρ(A₁x² + A₂y² + A₃z²) + constant',
    ['一定密度の楕円体の内部。まず形を指定して重力場を求める。','A prescribed homogeneous ellipsoid; first compute its interior gravitational field.'],
    ['有限な内部場、表面で外部ポテンシャルに連続。係数は軸長の積分で決まる。','Finite interior field and continuous matching to the exterior potential; axis integrals determine the coefficients.'],
    ['半軸a,b,cと密度。','Semiaxes a, b, c and density.'],
    ['任意の指定した形が回転流体の平衡とは限らない。平衡系列はテンソルビリアル章で扱う。','An arbitrarily prescribed ellipsoid need not be a rotating fluid equilibrium. See the tensor-virial chapter for equilibrium sequences.']);
  add('tensor-virial','balance',['解析的な条件＋平衡系列の数値計算','Analytic conditions and numerical equilibrium sequences'],
    'Maclaurin: a = b;　Jacobi: a &gt; b &gt; c',
    ['均質・非圧縮の自己重力流体、剛体回転、自由表面。','Homogeneous incompressible self-gravitating fluid in uniform rotation with a free surface.'],
    ['表面圧ゼロ。重力と遠心ポテンシャルの和を表面で一定にする。','Zero surface pressure; total gravitational and centrifugal potential is constant on the surface.'],
    ['軸比、角速度、密度。','Axis ratios, angular speed, and density.'],
    ['平衡の分岐と粘性・力学的不安定性は同じ条件ではない。圧縮性の星へ直接転用しない。','Equilibrium bifurcation, secular instability, and dynamical instability differ. Do not directly apply incompressible thresholds to compressible stars.']);
  add('bondi','flow',['臨界点を通る定常解','Steady transonic solution'],
    'Ṁ = 4πr²ρv;　rₛ = GM/(2cₛ²)　(isothermal)',
    ['球対称、定常、中心質量が支配。パネルでは等温。','Steady spherical inflow dominated by a central mass; the panel is isothermal.'],
    ['遠方の密度・音速と、音速点を滑らかに通る流入枝。','Specify far-field density and sound speed; select the inflow branch passing smoothly through the sonic point.'],
    ['中心質量、遠方密度、音速。','Central mass, ambient density, and sound speed.'],
    ['回転・磁場・放射フィードバックを省く。音速点を通らない定常枝もある。','Omit rotation, magnetic fields, and radiative feedback. Other stationary branches need not cross the sonic point.']);
  add('parker-wind','flow',['臨界点を通る定常解','Steady transonic solution'],
    '(v − cₛ²/v) dv/dr = 2cₛ²/r − GM/r²',
    ['球対称、定常、等温の流出。温度を保つ加熱機構は入力側。','Steady spherical isothermal outflow; the mechanism maintaining temperature is supplied.'],
    ['内側の亜音速から音速点を経て外側の超音速へ。密度の規格化を別に与える。','Join an inner subsonic flow to an outer supersonic flow through the sonic point; supply density normalization separately.'],
    ['中心質量、音速、流量または基準密度。','Central mass, sound speed, and mass flux or reference density.'],
    ['Bondiと方程式は似るが、枝と境界条件が違う。実際の太陽風の温度・磁場構造は省く。','Similar equations to Bondi, but different branches and boundary conditions. Omit the actual solar wind’s thermal and magnetic structure.']);
  add('sedov','flow',['第1種の相似解・プロファイルは数値積分','First-kind similarity; numerically integrated profiles'],
    'R(t) = β(Et²/ρ₀)<sup>1/5</sup>',
    ['点爆発、一様な周囲密度、理想気体、断熱的な強い衝撃波。','Point explosion into uniform gas with an ideal equation of state and a strong adiabatic shock.'],
    ['外側は衝撃波の跳び、内部は正則性と全エネルギーの規格化。','Shock jumps at the outer boundary, interior regularity, and total-energy normalization.'],
    ['爆発エネルギー、周囲密度、比熱比、時刻。','Explosion energy, ambient density, adiabatic index, and time.'],
    ['R∝t²⁄⁵だけでは内部構造は決まらない。放射損失や放出物が支配する段階には使わない。','The radius scaling alone does not determine the profiles. Excludes ejecta-dominated and strongly radiative stages.']);
  add('isothermal-collapse','flow',['相似ODEの数値解','Numerical similarity solutions'],
    'x = r/(cₛt),　ρ = α(x)/(4πGt²),　Ṁ = m₀cₛ³/G',
    ['球対称・等温・自己重力。ここで表示するのは中心形成後。','Spherical isothermal self-gravity; displayed profiles are after central formation.'],
    ['Shuは特異等温球から内側へ崩壊。LPHは動く外側を持つ別の継続解。','Shu collapse joins a singular isothermal envelope; LPH is a distinct continuation with a moving envelope.'],
    ['音速、時刻、遠方の密度・速度で指定する解の族。','Sound speed, time, and the family specified by outer density and velocity.'],
    ['同じ相似変数でも境界条件が違えば降着係数が違う。LPHの遠方係数は丸めた文献値を入力。','Identical similarity variables do not imply identical accretion coefficients. Rounded published LPH outer coefficients are supplied inputs.']);
  add('viscous-disk','flow',['指定粘性則の解析的相似解','Analytic similarity for a prescribed viscosity'],
    '∂Σ/∂t = (3/r)∂[r<sup>1/2</sup>∂(νΣr<sup>1/2</sup>)/∂r]/∂r',
    ['薄い軸対称のKepler円盤、ν∝rᵞ、外部トルクなし。','Thin axisymmetric Keplerian disk with ν ∝ rᵞ and no external torque.'],
    ['原点の無トルク条件、無限に広がる外側、有限の質量・角運動量。','Zero torque at the origin, an infinite outer domain, and finite mass and angular momentum.'],
    ['粘性の指数γ、初期の質量・長さ尺度、無次元時刻。','Viscosity exponent γ, initial mass and length scales, and dimensionless time.'],
    ['輸送係数は指定する。MRIの乱流を直接解く模型でも、風で角運動量を失う模型でもない。','Viscosity is prescribed. Does not directly solve MRI turbulence or angular-momentum loss in a wind.']);
  add('zeldovich','structure',['1次のLagrange近似','First-order Lagrangian approximation'],
    'x(q,t) = q + D(t)s(q);　ρ/ρ̄ = 1/det(∂x/∂q)',
    ['圧力を無視した宇宙構造の成長。軌道交差前の単一流。','Pressureless structure growth before shell crossing, in a single-stream description.'],
    ['初期変位場と成長因子を指定する。','Supply the initial displacement field and growth factor.'],
    ['初期変位の振幅・形、成長因子。','Initial displacement amplitude and shape, and growth factor.'],
    ['一般の3次元重力進化の厳密解ではない。行列式が0になる後へ単一流として延長しない。','Not an exact solution of general three-dimensional gravitational evolution. Do not continue as a single stream after the Jacobian vanishes.']);
  add('stromgren','radiation',['光子収支の平衡解・理想化した前線解','Photon-balance equilibrium and an idealized front'],
    'Rₛ³ = 3QH/(4παB nₑnₚ)',
    ['一様な純水素、光子を閉じ込める、case Bの再結合。','Uniform pure hydrogen, ionization-bounded radiation, and case-B recombination.'],
    ['中心の電離光子数率。平衡では全再結合数と一致。','Supply the central ionizing-photon rate; at equilibrium it balances integrated recombinations.'],
    ['光子数率、密度、再結合係数。','Photon rate, density, and recombination coefficient.'],
    ['塵・光子の逃走を省く。静的な電離平衡と、その後の圧力駆動膨張は別。','Omit dust and photon leakage. Static ionization balance differs from later pressure-driven expansion.']);
  add('fokker-planck','statistics',['OU閉包の解析解','Analytic Ornstein–Uhlenbeck closure'],
    '∂f/∂t = γ∂(vf)/∂v + D∂²f/∂v²',
    ['1次元の線形ドリフト、一定拡散係数、Gaussian初期分布。','One-dimensional linear drift, constant diffusion, and an initially Gaussian distribution.'],
    ['速度無限遠で流束ゼロ、確率の全積分1。','Vanishing flux at infinite velocity and unit total probability.'],
    ['γ、D、初期の平均と分散。','γ, D, and initial mean and variance.'],
    ['星団の自己無撞着なFokker–Planck解ではない。重力場や係数の時間変化を省いた基準解。','A benchmark, not a self-consistent cluster Fokker–Planck solution. Omits evolving gravity and transport coefficients.']);
  add('schwarzschild','relativity',['真空Einstein方程式の厳密解','Exact vacuum Einstein solution'],
    'ds² = −(1−2r<sub>g</sub>/r)c²dt² + (1−2r<sub>g</sub>/r)<sup>−1</sup>dr² + r²dΩ²',
    ['球対称の真空、漸近平坦。中心の質量Mで規格化。','Spherical vacuum, asymptotic flatness, and normalization by the central mass M.'],
    ['遠方でMinkowski時空に近づき、tを遠方の静止時計に合わせる。','Approach Minkowski spacetime far away and normalize t to a distant static clock.'],
    ['M。r<sub>g</sub>＝GM/c²。粒子の軌道には保存エネルギーと角運動量も必要。','M, with r<sub>g</sub> = GM/c². A test-particle orbit additionally needs conserved energy and angular momentum.'],
    ['星の内部や回転を含まない。r＝2r<sub>g</sub>の座標の問題とr＝0の曲率特異点を区別する。','Excludes stellar interiors and rotation. Distinguish the coordinate problem at 2r<sub>g</sub> from the curvature singularity at r = 0.']);
  function planned(id,domain,name,kind,equation,assumptions,boundary,parameters,limits,reference) {
    entries.push({id,domain,title:name,kind,equation,assumptions,boundary,parameters,limits,reference,status:'planned'});
  }
  planned('kerr','relativity',['Kerr解','Kerr spacetime'],['真空Einstein方程式の厳密解','Exact vacuum Einstein solution'],'a* = cJ/(GM²)',
    ['定常・軸対称、回転する真空時空。','Stationary axisymmetric rotating vacuum spacetime.'],['漸近平坦。ブラックホールとして使う際の地平面と正則性を確認する。','Asymptotic flatness; check horizon and regularity when interpreting it as a black hole.'],['質量Mと角運動量J。','Mass M and angular momentum J.'],['本文は未公開。回転による引きずり、地平面とエルゴ領域、回転方向別の円軌道を扱う構想。','Lesson not yet published. Planned scope: frame dragging, horizons versus the ergoregion, and prograde/retrograde circular orbits.'],['Kerr (1963)','https://doi.org/10.1103/PhysRevLett.11.237']);
  planned('tomimatsu-sato','relativity',['富松–佐藤解','Tomimatsu–Sato spacetimes'],['定常・軸対称の厳密解の族','Family of exact stationary axisymmetric solutions'],'δ = 1, 2, …',
    ['漸近平坦な軸対称真空解。変形を含む解の族。','Asymptotically flat axisymmetric vacuum solutions with a deformation family.'],['計量の解であることに加え、特異点・因果構造を別に調べる。','In addition to solving the field equations, examine singularities and causal structure.'],['質量、回転のパラメーター、整数δ。','Mass, rotation parameters, and integer δ.'],['本文は未公開。δ＝1はKerr。δ＞1を、そのまま一般的なブラックホールの外部時空とはみなさない。','Lesson not yet published. δ = 1 gives Kerr; do not automatically interpret δ > 1 as the exterior of a regular black hole.'],['Tomimatsu & Sato (1972)','https://doi.org/10.1103/PhysRevLett.29.1344']);
  planned('lin-mestel-shu','structure',['Lin–Mestel–Shuの一様楕円体の崩壊','Lin–Mestel–Shu uniform-spheroid collapse'],['圧力なしの一様楕円体の運動','Pressureless homogeneous spheroid dynamics'],'P = 0;　rotation = 0',
    ['一様・非回転・圧力なしの自己重力楕円体。','Homogeneous nonrotating pressure-free self-gravitating spheroid.'],['初期の軸比・密度・収縮速度を指定し、特異なつぶれの前まで追う。','Supply initial axis ratios, density, and contraction velocities; follow evolution before singular collapse.'],['初期形状と密度、時刻。','Initial shape and density, and time.'],['本文は未公開。「回転楕円体」は形の名称で、回転運動を意味しない。Shuの等温球崩壊とは仮定が違う。','Lesson not yet published. A spheroid is a shape, not a statement that the body rotates. Assumptions differ from Shu’s isothermal spherical collapse.'],['Lin, Mestel & Shu (1965)','https://ntrs.nasa.gov/citations/19660039487']);
  const index=lang=>lang==='ja'?0:1;
  function matching(query='',domain='all',status='all') {
    const term=query.normalize('NFKC').trim().toLocaleLowerCase();
    return entries.filter(e=>(domain==='all'||e.domain===domain)&&(status==='all'||e.status===status)&&(!term||[e.id,e.equation,...e.title,...e.kind,...e.assumptions,...e.boundary,...e.parameters,...e.limits].join(' ').normalize('NFKC').toLocaleLowerCase().includes(term)));
  }
  function cards(list,language) {
    const i=index(language),t=(ja,en)=>i===0?ja:en;
    if(!list.length)return `<p class="solution-empty">${t('該当する解がありません。検索語や分野を変えてください。','No matching solutions. Change the search term or filters.')}</p>`;
    return list.map(e=>`<article class="solution-card" id="solution-${e.id}"><div class="solution-card-top"><span>${domains[e.domain][i]}</span><span class="volume-state ${e.status==='planned'?'planned':''}">${e.status==='ready'?t('本文公開中','Lesson available'):t('構想・本文未公開','Planned · no lesson')}</span></div><h2>${e.title[i]}</h2><p class="solution-kind">${e.kind[i]}</p><div class="solution-equation math">${e.equation}</div><p>${e.assumptions[i]}</p><details><summary>${t('境界条件・パラメーター・適用範囲','Boundary data, parameters, and validity')}</summary><dl>${[['境界・初期条件','Boundary / initial data','boundary'],['自由なパラメーター','Free parameters','parameters'],['適用範囲と注意','Validity and caveats','limits']].map(([ja,en,key])=>`<dt>${t(ja,en)}</dt><dd>${e[key][i]}</dd>`).join('')}</dl></details><div class="solution-card-links">${e.route?`<a class="text-link" href="${e.route}">${t('導出と操作図を読む','Read the derivation and explore')} ↗</a>`:''}<a href="${e.reference[1]}" target="_blank" rel="noopener noreferrer">${e.reference[0]} ↗</a></div></article>`).join('');
  }
  function renderBody(language) {
    const i=index(language),t=(ja,en)=>i===0?ja:en,ready=entries.filter(e=>e.status==='ready').length;
    return `<article class="solution-library wrap"><header class="solution-head"><div class="eyebrow">SOLUTION LIBRARY</div><h1>${title[i]}</h1><p class="solution-dek">${desc[i]}</p><div class="solution-counts"><span>${t('本文への入口','Lessons available')} <b>${ready}</b></span><span>${t('今後の構想','Planned entries')} <b>${entries.length-ready}</b></span><span>${t('比較する分野','Fields')} <b>${Object.keys(domains).length}</b></span></div><p>${t('同じ方程式でも、初期条件や境界条件が違えば別の解になる。名前を集めるだけでなく、何を仮定し、何を決めれば解が選ばれるかを読むための索引です。','The same equations can yield different solutions when initial or boundary data change. This index connects named solutions to the assumptions and data that select them.')}</p><aside class="callout">${t('「厳密な解」「相似解」「近似解」「数値解」は別の分類軸です。相似解のプロファイルを数値積分で求めることもあります。平衡解が存在することと安定であることも区別します。','Exact, similarity, approximate, and numerical describe different aspects of a solution. A similarity profile can require numerical integration. Existence of an equilibrium also differs from its stability.')}</aside></header><section class="solution-tools" aria-label="${t('解を探す','Find solutions')}"><div><label for="solution-search">${t('名前・仮定・境界条件で検索','Search names, assumptions, or boundary data')}</label><input id="solution-search" type="search" placeholder="${t('例：等温、真空、Bondi','e.g. isothermal, vacuum, Bondi')}" autocomplete="off"></div><div><label for="solution-domain">${t('分野','Field')}</label><select id="solution-domain"><option value="all">${t('すべての分野','All fields')}</option>${Object.entries(domains).map(([key,label])=>`<option value="${key}">${label[i]}</option>`).join('')}</select></div><div><label for="solution-status">${t('公開状況','Availability')}</label><select id="solution-status"><option value="all">${t('公開中と構想','Available and planned')}</option><option value="ready">${t('本文公開中','Lesson available')}</option><option value="planned">${t('構想のみ','Planned only')}</option></select></div><button type="button" id="solution-reset">${t('絞り込みを解除','Clear filters')}</button></section><p id="solution-result-count" class="solution-result-count" role="status">${t(`${entries.length}件を表示`,`${entries.length} entries`)}</p><div id="solution-results" class="solution-grid">${cards(entries,language)}</div><aside class="solution-footer callout">${t('本文公開中の項目は、既存の発展編の解説へつながります。構想の3項目には本文へのリンクを付けていません。原論文の図をすべて再現するライブラリーではなく、模型と解法を比較する入口です。','Available entries link to worked advanced chapters. The three planned entries have no lesson link. This is a guide to comparing models and solution methods, not a complete reproduction of every original paper figure.')}</aside></article>`;
  }
  function mount(root,language) {
    const search=root.querySelector('#solution-search');if(!search)return;
    const domain=root.querySelector('#solution-domain'),status=root.querySelector('#solution-status'),result=root.querySelector('#solution-results'),count=root.querySelector('#solution-result-count');
    const rewrite=()=>{result.querySelectorAll('a[href^="#/"]').forEach(a=>{a.href=window.AstroRouting.path(a.getAttribute('href').slice(1),language);});};
    const update=()=>{const list=matching(search.value,domain.value,status.value);result.innerHTML=cards(list,language);rewrite();count.textContent=language==='ja'?`${entries.length}件中${list.length}件を表示`:`${list.length} of ${entries.length} entries`;};
    search.addEventListener('input',update);domain.addEventListener('change',update);status.addEventListener('change',update);
    root.querySelector('#solution-reset').addEventListener('click',()=>{search.value='';domain.value='all';status.value='all';update();search.focus();});rewrite();
  }
  window.AstroSolutions={title,desc,domains,entries,matching,renderBody,mount};
})();
