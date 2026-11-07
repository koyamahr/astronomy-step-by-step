/* Bilingual lessons: supplied microphysics, conserved quantities, and competing clocks. */
(() => {
  'use strict';
  const A=window.AstroAdvanced,topics=window.AstroSeries.groups.flatMap(g=>g.topics);
  let language='ja';
  const t=(ja,en)=>language==='ja'?ja:en;
  const p=(ja,en)=>`<p>${t(ja,en)}</p>`;
  const f=(a,b)=>`<span class="frac"><span>${a}</span><span>${b}</span></span>`;
  const eq=html=>`<div class="equation"><div class="math">${html}</div></div>`;
  const s=(n,ja,en,...body)=>`<section><h2><span class="step-no">${String(n).padStart(2,'0')}</span>${t(ja,en)}</h2>${body.join('')}</section>`;
  const note=(ja,en)=>`<aside class="callout">${t(ja,en)}</aside>`;
  const lab=id=>`<div data-lab="${id}"></div>`;
  Object.assign(A.sources,{
    twoTShocks:['Vink et al. (2015) · Electron–ion temperature ratios at collisionless shocks','https://arxiv.org/abs/1407.4499'],
    exchangeFLASH:['FLASH User Guide §18.5 · Heat exchange, equations (18.267)–(18.270)','https://flash.pas.rochester.edu/site/flashcode/user_support/flash_ug_devel/node123.html'],
    ambipolarHillier:['Hillier (2024) · Ambipolar diffusion and the limits of small ion–neutral drift','https://arxiv.org/abs/2403.16847'],
    ambipolarDrag:['Duffin & Pudritz (2008) · Simulating hydromagnetic processes in star formation','https://arxiv.org/abs/0810.0299'],
    forrey2013:['Forrey (2013) · Three-body H₂ formation, equation (6) and Figure 1','https://arxiv.org/abs/1306.5163']
  });
  const add=(id,minutes,prereq,goal,question,answer,refs)=>{
    const topic=topics.find(c=>c.id===id);
    A.chapters.push({id,title:topic.title,desc:topic.question,minutes,prereq,goal,question,answer,refs,bridge:'matter'});
  };
  add('two-temperature',30,['理想気体、熱容量、指数関数、1階の微分方程式','Ideal gases, heat capacities, exponentials, and first-order ODEs'],['電子とイオンの温度差をエネルギー保存から追い、交換時間と流れの時間を区別する。','Follow electron–ion temperature differences using energy conservation, and distinguish exchange and flow times.'],['電子・陽子が同数で、交換時間τを一定とする。温度差が最初の1/eになる時間はτか、τ/2か。','For equal electron and proton densities and constant exchange time τ, does the temperature difference fall by e in τ or τ/2?'],['両方の温度が動くため、d(Tᵢ−Tₑ)/dt＝−2(Tᵢ−Tₑ)/τ。温度差の減衰時間はτ/2。イオン温度を外から固定した模型とは異なる。','Both temperatures change, so d(Tᵢ−Tₑ)/dt = −2(Tᵢ−Tₑ)/τ. The difference decays in τ/2, unlike a model with externally fixed ion temperature.'],['twoTShocks','exchangeFLASH']);
  add('ambipolar-diffusion',35,['Lorentz力、圧力、拡散方程式、自由落下時間','Lorentz force, pressure, diffusion, and free-fall time'],['磁場を支える荷電粒子と中性ガスのずれから拡散時間を導き、強結合と低ドリフトの仮定を確認する。','Derive a diffusion clock from charge–neutral drift and check strong-coupling and small-drift assumptions.'],['密度・電離度・磁場を固定して凹凸の長さLを2倍にすると、拡散時間と初期ドリフト速度は何倍か。','At fixed density, ionization, and field, double the perturbation scale L. How do diffusion time and initial drift speed change?'],['ηは一定なのでtAD＝L²/ηは4倍。振幅の比εを固定するとvD,max＝εη/Lは1/2倍。Lは波長そのものではなく1/kである。','With fixed η, tAD = L²/η grows fourfold and vD,max = εη/L halves at fixed fractional amplitude ε. L is 1/k, not the wavelength.'],['ambipolarHillier','ambipolarDrag']);
  add('three-body-chemistry',30,['反応式、個数密度、変数分離、自由落下時間','Reaction equations, number density, separation of variables, and free-fall time'],['水素原子核を保存して分子の割合を解き、3体反応の密度依存と化学・重力の時間を比較する。','Conserve hydrogen nuclei, solve the molecular fraction, and compare density-dependent chemical and gravitational clocks.'],['同じ温度で水素原子核密度を10倍にすると、半分が分子になる時間と自由落下時間の比は何倍か。','At fixed temperature, increase hydrogen-nucleus density tenfold. How does the ratio of half-conversion time to free-fall time change?'],['t₅₀∝n⁻²、tff∝n⁻¹ᐟ²なので、比は10⁻³ᐟ²≈0.0316倍。高密度ほど、重力の時計と比べても反応が速くなる。これは温度と密度を固定した化学模型の比較。','Since t₅₀ ∝ n⁻² and tff ∝ n⁻¹ᐟ², the ratio falls by 10⁻³ᐟ² ≈ 0.0316. Chemistry gains on the gravitational clock at high density; the chemical model itself holds temperature and density fixed.'],['forrey2013']);
  const bodies={};
  bodies['two-temperature']=()=>[
    s(1,'温度は「ガス全体で一つ」とは限らない','A gas need not have just one temperature',
      p('温度は粒子の不規則な運動の尺度である。電子の集団と陽子の集団が、それぞれ内部では熱的な速度分布を持っていても、二つの集団が同じ温度とは限らない。薄い宇宙のプラズマでは、集団の間でエネルギーを交換するのに時間がかかる。','Temperature measures random particle motion. Electrons and protons can each have a thermal distribution while having different temperatures. A temperature for each species already assumes internal thermalization; it does not require that the two species have finished exchanging energy with each other.'),
      p('例えば衝撃波の後では、粒子種ごとの加熱の配分が問題になる。ここでは初期比β＝Tₑ₀/Tᵢ₀を入力する。全体の保存則だけでβが決まるとはしない。その後に起こるCoulomb衝突による温度交換だけを切り出す。','A collisionless shock can leave different species with different shares of the thermal energy. Supply the initial ratio β = Tₑ₀/Tᵢ₀ rather than deriving it from the total jump conditions. Then isolate subsequent Coulomb energy exchange from the much more complicated shock heating process.'),
      note('模型は完全電離した純水素、nₑ＝nᵢ＝n、非相対論的な粒子、一定密度・一定体積。外部加熱、放射冷却、膨張は含めない。','Assume fully ionized pure hydrogen with nₑ = nᵢ = n, nonrelativistic particles, fixed density and volume. Omit external heating, radiation losses, and expansion.')),
    s(2,'片方が受け取った熱を、もう片方から引く','Energy gained by one species is lost by the other',
      eq(`uₑ=${f('3','2')}nk<sub>B</sub>Tₑ,　uᵢ=${f('3','2')}nk<sub>B</sub>Tᵢ<br>Qₑᵢ=${f('3','2')}nk<sub>B</sub>${f('Tᵢ−Tₑ','tₑᵢ')}`),
      p('Qₑᵢは電子が単位体積・単位時間に受け取る熱で、Tᵢ＞Tₑなら正である。陽子側には同じ量が負符号で入る。熱容量が等しいので、温度の式は対称になる。和をとると右辺が消え、全熱エネルギーの保存を直接確かめられる。','Qₑᵢ is energy received by electrons per volume per time and is positive when ions are hotter. The ions lose exactly that amount. Equal number densities give equal heat capacities, so the two temperature equations have opposite right-hand sides. Adding them checks conservation before any numerical calculation.'),
      eq(`${f('dTₑ','dt')}=${f('Tᵢ−Tₑ','tₑᵢ')},　${f('dTᵢ','dt')}=−${f('Tᵢ−Tₑ','tₑᵢ')}<br>Tₑ+Tᵢ=Tₑ₀+Tᵢ₀,　T̄=${f('Tₑ₀+Tᵢ₀','2')}`)),
    s(3,'指数関数と、係数2の意味','Exponential relaxation and the factor of two',
      p('温度差Δ＝Tᵢ−Tₑを作ると、片方が下がり、もう片方が上がる効果が足し合わさる。交換時間を一定τと近似すれば、変数分離で積分できる。','Subtract the electron equation from the ion equation. Cooling of ions and heating of electrons both reduce the difference Δ = Tᵢ−Tₑ. For a constant exchange time τ, separation of variables gives a simple benchmark.'),
      eq(`${f('dΔ','dt')}=−${f('2Δ','τ')}　⇒　${f('dΔ','Δ')}=−${f('2dt','τ')}<br>Δ=Δ₀e<sup>−2t/τ</sup>,　Tₑ=T̄−${f('Δ','2')},　Tᵢ=T̄+${f('Δ','2')}`),
      p('τは電子の式に現れる交換時間で、温度差の1/e減衰時間はτ/2。イオンを無限の熱浴として固定すれば別の式になる。この係数の違いは、どちらの温度も動かしているかで確認できる。','Here τ is the exchange time in the electron equation; the difference has an e-folding time τ/2. Holding ions at a prescribed temperature would instead describe an external heat reservoir. Checking which temperatures are allowed to change prevents a factor-of-two error.')),
    s(4,'衝突の係数を入力し、緩和を追う','Supply the collision time and follow relaxation',
      p('弱く結合した古典的プラズマの標準的な交換時間を入力として借りる。以下はSI表記で、nはm⁻³、温度はK、電荷はCで入れる。Coulomb対数lnΛはここでは30に固定し、衝突の微視的導出へは進まない。','Supply the standard exchange time for a weakly coupled classical plasma. In the SI formula below, use density in m⁻³, temperatures in K, and charge in coulombs. Fix the dimensionless Coulomb logarithm at 30 instead of deriving the collision integral.'),
      eq(`tₑᵢ=${f('3mₑmₚ','8√(2π) n [e²/(4πε₀)]² lnΛ')} (${f('k<sub>B</sub>Tₑ','mₑ')}+${f('k<sub>B</sub>Tᵢ','mₚ')})<sup>3/2</sup>`),
      p('電子の熱速度の項が支配するとtₑᵢ∝Tₑ³ᐟ²/nとなる。電子が温まるにつれ交換が遅くなるため、図では係数を固定せず更新する。kBTをkeVで表示するが、温度そのものがエネルギーになったのではない。1 keVは約1.16×10⁷ Kに対応する。','When the electron thermal-speed term dominates, tₑᵢ scales as Tₑ³ᐟ²/n. Heating electrons then slows exchange, so the panel updates the coefficient rather than using a single exponential. Labels in keV mean kBT, an energy representation of temperature; 1 keV corresponds to about 1.16 × 10⁷ K.'),
      lab('two-temperature'),
      p('計算ではy＝ln(Δ₀/Δ)を使い、dt/dy＝tₑᵢ/2をSimpson積分して時刻を逆に求める。温度の和は解析的に保存し、正の温度差を保つ。初めから同温度なら変化しない。','Numerically integrate dt/dy = tₑᵢ/2 with y = ln(Δ₀/Δ), then invert the cumulative time. Simpson integration and local bisection give the temperatures while their sum is preserved analytically. The difference stays positive, and equal initial temperatures remain equal.')),
    s(5,'どの時計と比べるか','Choose the relevant competing clock',
      p('流れがその領域を通過する時間tflowと、平衡近くの温度差の減衰時間tₑᵢ(T̄)/2を比べる。後者が長ければ、ガスが移動してしまうまで温度差が残りうる。ただし交換時間は途中で変わるので、比だけでなく時間曲線も見る。','Compare the flow residence time with the near-equilibrium difference-decay time tₑᵢ(T̄)/2. A long exchange clock permits a difference to survive passage through the region. Since the coefficient changes during relaxation, inspect the trajectory as well as the single clock ratio.'),
      p('これは実際の流体運動を解いた模型ではなく、tflowは比較するための入力である。長期間2温度を保つ天体では、電子とイオンを別々に加熱・冷却する過程も考える必要がある。','The panel is a closed parcel calculation, not a simulated flow. Its residence time is an external comparison scale. Maintaining two temperatures indefinitely requires sources or sinks that distinguish species; exchange alone eventually produces one temperature.'),
      p('<a href="#/advanced/shock-acceleration">衝撃波と粒子加速</a>の熱の配分、<a href="#/advanced/sunyaev-zeldovich">SZ効果</a>が測る電子圧力へつながる。全圧はnkB(Tₑ＋Tᵢ)だが、電子圧力はnkBTₑ。この違いが観測の解釈にも現れる。','Connect to heating in <a href="#/advanced/shock-acceleration">shocks and particle acceleration</a> and electron pressure in the <a href="#/advanced/sunyaev-zeldovich">SZ effect</a>. Total pressure is nkB(Tₑ+Tᵢ), whereas the electron pressure is nkBTₑ. Equal total energy therefore does not guarantee equal electron-pressure signals.'))
  ].join('');
  bodies['ambipolar-diffusion']=()=>[
    s(1,'中性ガスは、磁場を直接感じない','Neutrals do not directly feel the magnetic force',
      p('分子雲の大部分は電荷を持たない粒子である。磁場と結びつく少数の荷電粒子が中性粒子と衝突することで、力が伝わる。二つの速度が少し違えば、磁場と中性ガスの間に相対的なずれが生じる。ここで扱う両極性拡散は、このイオン・中性粒子のずれである。','Most particles in a molecular cloud are neutral. A small charged component couples to the magnetic field and transfers momentum to neutrals through collisions. Different velocities allow magnetic flux to move relative to neutral material. Here ambipolar diffusion specifically means this ion–neutral drift in a weakly ionized astrophysical gas.'),
      note('荷電粒子が磁場に十分結びつき、イオンの慣性を無視できる近似を使う。電子とイオンの電荷分離を解く模型ではない。Ohmic抵抗、Hall効果、荷電ダストの分布も省く。','Assume charges are sufficiently tied to the field and neglect ion inertia. This model does not solve charge separation. Omit Ohmic resistance, Hall effects, and a distribution of charged dust grains.')),
    s(2,'磁気力を摩擦で受け渡す','Balance magnetic force against drag',
      p('イオンと中性粒子の速度差をvD＝vᵢ−vₙとする。イオンが受ける摩擦は−γρᵢρₙvD。磁気力とつり合わせると、速度差が得られる。以下はCGS–Gauss表記で、ρはg cm⁻³、BはGである。','Let vD = vᵢ−vₙ. Drag on the ions is −γρᵢρₙvD. Balancing it against the Lorentz force determines the drift. Use Gaussian CGS units below: densities in g cm⁻³ and field strength in gauss. The drag coefficient is a supplied material input with dimensions, not a dimensionless efficiency.'),
      eq(`γρᵢρₙ<b>v</b><sub>D</sub> ≈ ${f('(∇×<b>B</b>)×<b>B</b>','4π')}<br>η<sub>AD</sub>=${f('B²','4πγρᵢρₙ')},　t<sub>AD</sub>∼${f('L²','η<sub>AD</sub>')}`),
      p('ηADはcm²/sを持つ磁場の拡散係数で、電気抵抗そのものの単位ではない。一定の電離度で密度を上げると摩擦が増え、同じ磁場の凹凸の移動は遅くなる。磁場が強いほど力も大きい。','ηAD has units cm²/s and is a magnetic diffusivity, rather than an electrical resistance. At fixed number ionization fraction, increasing gas density strengthens drag and slows the relaxation of a fixed field pattern. A stronger field increases the magnetic force as well as the diffusivity.')),
    s(3,'一つの波を選ぶと、拡散を解ける','A single Fourier mode makes diffusion solvable',
      p('中性ガスを静止した一定密度の背景とし、z方向の磁場がx方向に少し変化するとする。B₀の周りで線形化し、ηADをB₀の値に固定する。長さL＝1/k、波長λ＝2πLを明示して、波長と拡散時間の係数を混ぜない。','Prescribe a static, uniform neutral background and a z-directed field varying weakly along x. Linearize about B₀ and hold ηAD at its background value. Define L = 1/k and wavelength λ = 2πL; using the wavelength in place of L would introduce a factor of 4π² in the decay clock.'),
      eq(`${f('∂δB','∂t')}=η<sub>AD</sub>${f('∂²δB','∂x²')}<br>${f('B<sub>z</sub>','B₀')}=1+ε cos(x/L)e<sup>−t/t<sub>AD</sub></sup>,　t<sub>AD</sub>=${f('L²','η<sub>AD</sub>')}`),
      p('山から谷へ荷電粒子と磁場が動き、凹凸がならされる。中性粒子を固定したこの模型では、磁場の形が減衰するだけで、雲の収縮そのものは計算しない。ε＝0.1に固定する。','Charges and field drift away from magnetic maxima toward minima, flattening the pattern. Set ε = 0.1. The neutral background is externally prescribed, so this is a diffusion benchmark, not a self-consistent collapsing cloud. Terms beyond linear order in ε are omitted.'),
      eq(`v<sub>D,x</sub>≈${f('εη<sub>AD</sub>','L')}sin(x/L)e<sup>−t/t<sub>AD</sub></sup>`)),
    s(4,'磁場の凹凸と、重力の時計','Compare field smoothing with a gravitational clock',
      p('入力は中性粒子の個数密度nₙと、個数比χᵢ＝nᵢ/nₙ。質量比とは区別する。ρₙ＝2.33mₚnₙ、ρᵢ＝29mₚχᵢnₙとし、代表的な分子イオンの質量を与える。γ＝3.5×10¹³ cm³ g⁻¹ s⁻¹、B₀＝30 μG、T＝10 Kを固定する。組成に依存する代表値であり、普遍定数ではない。','Inputs are neutral-particle number density nₙ and number ratio χᵢ = nᵢ/nₙ, not an ion mass fraction. Set ρₙ = 2.33mₚnₙ and ρᵢ = 29mₚχᵢnₙ for a representative molecular ion. Supply γ = 3.5 × 10¹³ cm³ g⁻¹ s⁻¹, B₀ = 30 μG, and T = 10 K. These composition-dependent choices are illustrative inputs, not universal constants.'),
      eq(`t<sub>ff</sub>=√${f('3π','32Gρₙ')},　t<sub>in</sub>=${f('1','γρₙ')},　t<sub>ni</sub>=${f('1','γρᵢ')}`),
      p('tffは同じ密度の一様球の自由落下時間を比較の時計として借りる。tᵢₙはイオンが中性粒子との摩擦で速度を変える時間、tₙᵢはその逆。イオンの慣性を捨てるには、tᵢₙが磁場の変化時間より短い必要がある。強結合は、速度差が厳密にゼロという意味ではない。','Borrow the free-fall time of a uniform sphere at the same density solely as a gravitational clock. tᵢₙ measures ion momentum adjustment to neutrals; tₙᵢ measures neutral adjustment to ions. Neglecting ion inertia requires tᵢₙ to be short relative to field evolution. Strong coupling does not require exactly zero drift.'),
      lab('ambipolar-diffusion')),
    s(5,'消えた磁気エネルギーと、近似の限界','Dissipation and limits of the approximation',
      p('一波長で平均した磁場の摂動エネルギーはε²B₀² exp(−2t/tAD)/(16π)。その減少率は、同じ線形近似の摩擦加熱γρᵢρₙ⟨vD²⟩と一致する。エネルギーが何もなく消えるわけではないが、この図ではガス温度の変化を連立していない。','The wavelength-averaged perturbation energy is ε²B₀² exp(−2t/tAD)/(16π). Its loss rate equals the averaged drag heating γρᵢρₙ⟨vD²⟩ to the retained order. This provides an energy check. Dissipated energy would heat matter, although the panel does not evolve temperature or neutral motion.'),
      p('低ドリフトの係数を使うには、速度差が粒子の熱速度より十分小さいことも必要である。図はvD,max/cₛとtᵢₙ/tADを示す。比が大きい場合は、固定した係数の実天体への適用を保留する。ここでcₛを熱速度の目安とし、表示の境界値を厳密な安定限界とはしない。','The constant low-drift coefficient also assumes drift well below particle thermal speeds. Inspect vD,max/cₛ and tᵢₙ/tAD. Large values signal that interpreting the fixed-coefficient result physically requires more care. Sound speed is a thermal-speed proxy here, and the displayed flag is a heuristic validity check, not a sharp stability threshold.'),
      p('<a href="#/advanced/mri">MRI</a>の理想MHD、<a href="#/advanced/isothermal-cylinder">フィラメントの磁場なし平衡</a>と比べると、「磁場とガスが一緒に動く」という仮定の意味が見えてくる。磁場の拡散時間が短いだけで、必ず星が作られるとは結論しない。','Compare with ideal MHD in <a href="#/advanced/mri">MRI</a> and the unmagnetized <a href="#/advanced/isothermal-cylinder">isothermal filament</a>. This identifies where flux freezing enters an argument. A short diffusion time alone does not prove that a cloud must form a star; forces, geometry, and boundary conditions still matter.'))
  ].join('');
  bodies['three-body-chemistry']=()=>[
    s(1,'第三の原子は、結合のエネルギーを運ぶ','The third atom carries away energy',
      eq('H + H + H → H₂ + H'),
      p('二つの水素原子が結びつくには、余ったエネルギーと運動量を別の何かへ渡す必要がある。この反応では、近くの第三の原子がその受け取り役になる。第三のHは反応後にもHとして残る。これは化学の3体反応であり、三つの星の重力散乱ではない。','To form a bound molecule, two hydrogen atoms must transfer excess energy and momentum elsewhere. A third atom provides a collision partner that can carry them away. That partner remains an H atom after the event. This is a three-body chemical reaction, distinct from gravitational encounters involving three stars.'),
      p('塵の乏しい原始ガスの高密度部分を考える入口になる。ここでは反応係数を入力し、分子がどの速さで増えるかに集中する。原子間ポテンシャルや量子散乱の計算は扱わない。','This offers an entry to molecular formation in dense primordial gas with little dust. Supply a reaction coefficient and focus on how rapidly composition changes. The microscopic potential and quantum-scattering calculation belong in the reference, rather than becoming a separate subject in this guide.')),
    s(2,'反応回数と、失われる原子の数を分ける','Count events separately from consumed atoms',
      p('単位体積・単位時間の反応回数をR₃＝k₃nH³と定義する。この規約に組合せの係数を含めるので、後から1/3!を掛けない。一度の反応でH₂は1個増え、自由なHは正味2個減る。','Define the event rate per volume and time by R₃ = k₃nH³. The adopted coefficient includes the counting convention; do not append an extra 1/3! factor. Each event makes one molecule and consumes two free atoms net. The third atom is present on both sides of the reaction.'),
      eq(`${f('dn<sub>H₂</sub>','dt')}=k₃n<sub>H</sub>³,　${f('dn<sub>H</sub>','dt')}=−2k₃n<sub>H</sub>³<br>n<sub>N</sub>≡n<sub>H</sub>+2n<sub>H₂</sub> = ${t('一定','constant')}`),
      p('nNは水素原子核の数密度。分子の中の原子核も2個と数える。一定体積の閉じた純水素ガスなら、原子から分子へ変わってもnNは変わらない。HとH₂の個数の和は保存しない。','nN is the hydrogen-nucleus density, counting two nuclei inside each molecule. It remains constant in a closed, fixed-volume pure-hydrogen parcel. The sum of atom and molecule counts is not conserved: forming a molecule changes the number of independently moving particles.')),
    s(3,'分子になった原子核の割合を解く','Solve for the fraction of nuclei in molecules',
      eq(`x≡${f('2n<sub>H₂</sub>','n<sub>N</sub>')},　n<sub>H</sub>=n<sub>N</sub>(1−x)<br>${f('dx','dt')}=2k₃n<sub>N</sub>²(1−x)³`),
      p('初めはすべて原子、x(0)＝0とする。温度と密度を固定してk₃を一定とし、変数を左右へ分ける。分子が増えると出会える自由原子が減るため、一定速度で分子化が進むわけではない。','Start with entirely atomic gas, x(0) = 0. Hold temperature and nucleus density fixed so k₃ is constant, then separate variables. Conversion slows as free atoms are depleted. A single initial rate therefore cannot be multiplied by an arbitrarily long time to obtain the final molecular fraction.'),
      eq(`∫₀ˣ${f('dx′','(1−x′)³')}=2k₃n<sub>N</sub>²t<br>${f('(1−x)<sup>−2</sup>−1','2')}=2k₃n<sub>N</sub>²t<br>x=1−(1+4k₃n<sub>N</sub>²t)<sup>−1/2</sup>`),
      eq(`x(t₅₀)=${f('1','2')}　⇒　t₅₀=${f('3','4k₃n<sub>N</sub>²')}`),
      p('x＝1/2は原子核の半分が分子に入った状態。そのとき分子の個数密度はnN/4であり、nN/2ではない。係数2の定義を図でも確かめる。','At x = 1/2, half the nuclei reside in molecules, but the molecular number density is nN/4, not nN/2. Keep the nuclei fraction and molecular particle count distinct when interpreting both the equations and the panel.')),
    s(4,'密度が、重力との競争を変える','Density changes the competition with gravity',
      p('Forrey（2013）の式(6)を反応係数の入力に使う。下式のTKは温度をKで割った数値で、k₃の単位はcm⁶ s⁻¹。パネルは600–3000 Kに限定する。係数は当該反応の計算に基づく近似式で、すべての反応を代表する定数ではない。','Use equation (6) of Forrey (2013) as the rate input. TK denotes the numerical temperature in kelvins; k₃ is in cm⁶ s⁻¹. The panel restricts temperature to 600–3000 K. This fit describes the specified reaction and does not replace an entire chemical network.'),
      eq(`T<sub>K</sub>≡${f('T','1 K')},　k₃=(6×10<sup>−32</sup>T<sub>K</sub><sup>−1/4</sup>+2×10<sup>−31</sup>T<sub>K</sub><sup>−1/2</sup>) ${t('cm⁶ s⁻¹','cm⁶ s⁻¹')}<br>t<sub>ff</sub>=√${f('3π','32Gmₚn<sub>N</sub>')}<br>${f('t₅₀','t<sub>ff</sub>')}∝n<sub>N</sub><sup>−3/2</sup>　(${t('T一定','fixed T')})`),
      p('反応回数はn³、原子1個あたりではn²に比例する。自由落下の速まり方n¹ᐟ²より強いので、高密度ほど化学の時計が重力の時計に追いつく。図のtffは一様球の比較時間であり、化学模型の中で密度が上昇しているわけではない。','Events scale as density cubed, while the rate per atom scales as density squared. This grows faster than the inverse free-fall time, which scales as nN¹ᐟ². High density can therefore make chemistry fast relative to gravity. The displayed tff is a uniform-sphere comparison clock; the chemical parcel itself is not collapsing.'),
      lab('three-body-chemistry')),
    s(5,'分子ができると、温度にも影響する','Molecular formation also affects thermal evolution',
      p('基底状態のH₂の結合エネルギー約4.48 eVを尺度にすれば、原子核1個あたりの結合エネルギーの減少量は4.48x/2 eVとなる。放出分がどれだけ熱や内部励起へ入るかは別の問題である。このパネルは温度を固定するので、放出したエネルギーから勝手に温度上昇を計算しない。','Using about 4.48 eV for ground-state H₂ binding gives a binding-energy change of 4.48x/2 eV per initial nucleus. Its partition into heat, internal excitation, and later radiation requires additional physics. Since temperature is prescribed here, the panel reports only this energy scale and does not infer a temperature increase.'),
      p('実際の原始星形成では、逆向きの衝突解離、H₂を第三の粒子とする反応、低密度でのH⁻経由の形成、放射冷却、収縮による圧縮を連立する。特に高温・分子化後期へ進むと、片道だけの反応模型では化学平衡を求められない。','A realistic primordial collapse couples reverse collisional dissociation, H₂ as a third partner, low-density H⁻ pathways, cooling, and compression. Reactions omitted here become especially consequential at high temperature and late conversion. The one-way model cannot determine chemical equilibrium or a self-consistent primordial-star trajectory.'),
      p('<a href="#/advanced/isothermal-collapse">等温崩壊</a>が温度一定を仮定したのに対し、この章は組成一定という仮定を外す小さな一歩。次の段階では、同じ原子核保存にエネルギー式と流体方程式を加える。まず保存する数と時間尺度を見分けることが、複雑な計算の入口になる。','Relative to <a href="#/advanced/isothermal-collapse">isothermal collapse</a>, this is a small step that relaxes the assumption of fixed composition. A more complete model adds energy and fluid equations to the same nucleus bookkeeping. Identifying the conserved count and the competing clocks is a useful first step before solving that coupled system.'))
  ].join('');
  const order=topics.map(c=>c.id);A.chapters.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));
  const previous=A.renderBody;
  const connections={
    'shock-acceleration':['衝撃波が電子とイオンを違う温度にした後、どの速さで同温度に戻るかは<a href="#/advanced/two-temperature">2温度プラズマ</a>で調べる。','After a shock leaves electrons and ions at different temperatures, follow their equilibration in <a href="#/advanced/two-temperature">two-temperature plasmas</a>.'],
    mri:['低電離ガスで磁場と中性粒子がずれる時間は、<a href="#/advanced/ambipolar-diffusion">両極性拡散</a>で比較する。','Compare the clock for magnetic flux to slip relative to weakly ionized gas in <a href="#/advanced/ambipolar-diffusion">ambipolar diffusion</a>.'],
    'isothermal-collapse':['高密度で水素の組成が変わる速さは、<a href="#/advanced/three-body-chemistry">3体化学反応</a>で重力の時計と比べる。','Compare high-density molecular conversion with a gravitational clock in <a href="#/advanced/three-body-chemistry">three-body chemistry</a>.']
  };
  A.renderBody=(id,locale)=>{
    language=locale;
    if(Object.prototype.hasOwnProperty.call(bodies,id))return bodies[id]();
    return previous(id,locale)+(connections[id]?note(...connections[id]):'');
  };
})();
