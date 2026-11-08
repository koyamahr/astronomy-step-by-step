/* Worked lessons completing the three previously planned solution-library entries. */
(() => {
  'use strict';
  const A=window.AstroAdvanced,S=window.AstroSeries;
  const topics=[
    {id:'kerr',title:['Kerr解：回転・エルゴ領域・ISCO','Kerr: rotation, the ergoregion, and the ISCO'],question:['回転すると、静止できない領域と安定円軌道はどう変わるか。','How does rotation change the region forbidding static observers and the stable circular orbits?'],method:['計量から角速度の許容範囲を導き、赤道面の半径ポテンシャルから順行・逆行のISCOを調べる。','Derive allowed angular velocities from the metric, then use the equatorial radial potential to compare prograde and retrograde ISCOs.'],reference:['Bardeen, Press & Teukolsky (1972)','https://articles.adsabs.harvard.edu/pdf/1972ApJ...178..347B']},
    {id:'tomimatsu-sato',title:['富松–佐藤解：Ernstポテンシャルと四重極','Tomimatsu–Sato: Ernst potentials and the quadrupole'],question:['同じ質量と角運動量でも、Kerrとは違う真空時空を作れるか。','Can vacuum spacetimes with the same mass and angular momentum differ from Kerr?'],method:['δ＝2のErnstポテンシャルを入力とし、軸上の展開から質量・角運動量・四重極を読み、環状特異点の条件を調べる。','Start from the δ = 2 Ernst potential, extract the first multipoles from axis data, and examine the ring-singularity condition.'],reference:['Manko (2012), equations (9)–(12)','https://arxiv.org/abs/1110.6564']},
    {id:'lin-mestel-shu',title:['Lin–Mestel–Shu：一様楕円体の崩壊','Lin–Mestel–Shu: collapse of a uniform spheroid'],question:['圧力のない雲の小さな非球対称性は、崩壊中にどう育つか。','How does a small departure from spherical shape grow during pressure-free collapse?'],method:['一様楕円体の内部重力を使い、質量保存と相似的な速度場から二つの半軸の運動方程式を導いて積分する。','Use the interior field of a homogeneous ellipsoid and mass conservation to derive and integrate the two axis equations.'],reference:['Lin, Mestel & Shu (1965)','https://doi.org/10.1086/148428']}
  ];
  S.groups.find(g=>g.topics.some(t=>t.id==='schwarzschild')).topics.push(...topics.slice(0,2));
  S.groups.find(g=>g.topics.some(t=>t.id==='zeldovich')).topics.push(topics[2]);
  Object.assign(A.sources,{
    kerrOriginal:['Kerr (1963) · Gravitational field of a spinning mass','https://doi.org/10.1103/PhysRevLett.11.237'],
    kerrBPT:topics[0].reference,
    kerrReview:['Teukolsky (2015) · The Kerr Metric','https://arxiv.org/abs/1410.2130'],
    tsOriginal:['Tomimatsu & Sato (1972) · New exact solution','https://doi.org/10.1103/PhysRevLett.29.1344'],
    tsMultipoles:topics[1].reference,
    tsStructure:['Gegenberg et al. (2011) · Geometry and causal structure','https://arxiv.org/abs/1010.2803'],
    lmsOriginal:topics[2].reference,
    lmsArchive:['NASA NTRS · Lin, Mestel & Shu bibliographic record','https://ntrs.nasa.gov/citations/19660039487'],
    lmsDynamics:['Tohline (1982) · Hydrodynamic collapse, §3','https://www.phys.lsu.edu/faculty/tohline/papers/Tohline1982.HydroCollapse.pdf']
  });
  const metadata={
    kerr:{minutes:45,bridge:'relativity',prereq:['Schwarzschild解、微分、保存量','Schwarzschild geometry, derivatives, and conserved quantities'],goal:['地平面と静止限界を区別し、回転の向きで変わる円軌道を計算する。','Distinguish the horizon from the static limit and compute the spin dependence of circular orbits.'],question:['赤道面の静止限界がR＝2のままでも、地平面が内側へ動くと何が起きるか。','If the equatorial static limit stays at R = 2 while the horizon moves inward, what changes?'],answer:['地平面の外に、遠方に対して静止できないエルゴ領域が広がる。脱出不可能という条件ではなく、許される時間的運動に共回転が必要になる。','An exterior ergoregion opens up. It forbids static timelike observers, rather than escape itself; permitted stationary timelike motion must co-rotate.'],refs:['kerrOriginal','kerrBPT','kerrReview']},
    'tomimatsu-sato':{minutes:45,bridge:'relativity',prereq:['Kerr解、複素数、級数展開','Kerr geometry, complex numbers, and series expansions'],goal:['同じMとJでも四重極が違うことを導き、厳密解と正則なブラックホールを区別する。','Derive a quadrupole difference at fixed M and J, separating an exact vacuum solution from a regular black hole.'],question:['q＝0でδ＝2の時空はSchwarzschildになるか。','Does the δ = 2 spacetime become Schwarzschild at q = 0?'],answer:['ならない。Q/M³＝−1/4が残り、静的だが球対称ではない。δ＝1ならq＝0でSchwarzschildになる。','No. Q/M³ = −1/4 remains: it is static but nonspherical. At δ = 1, q = 0 instead gives Schwarzschild.'],refs:['tsOriginal','tsMultipoles','tsStructure']},
    'lin-mestel-shu':{minutes:40,bridge:'virial',prereq:['楕円体の重力、常微分方程式、質量保存','Ellipsoidal gravity, ordinary differential equations, and mass conservation'],goal:['半軸の運動を計算し、球・扁平・細長い雲の崩壊を比較する。','Compute axis evolution and compare spherical, oblate, and prolate collapse.'],question:['初期密度を4倍にし、初期形状を同じにすると、同じ軸比へ達する物理時間はどう変わるか。','At fixed initial shape, quadruple the initial density. What happens to the physical time needed to reach the same shape?'],answer:['時間単位(2πGρ₀)⁻¹/²が半分になる。初期速度も同じ無次元条件なら、無次元の軌跡は同じで物理時間が半分になる。','The time unit (2πGρ₀)⁻¹/² halves. With the same dimensionless initial velocities, the dimensionless track is unchanged and physical times halve.'],refs:['lmsOriginal','lmsArchive','lmsDynamics']}
  };
  topics.forEach(topic=>A.chapters.push({id:topic.id,title:topic.title,desc:topic.question,...metadata[topic.id]}));
  function render(id,locale){
    const t=(ja,en)=>locale==='ja'?ja:en,p=(ja,en)=>`<p>${t(ja,en)}</p>`,eq=x=>`<div class="equation"><div class="math">${x}</div></div>`;
    const section=(n,ja,en,...body)=>`<section><h2><span class="step-no">0${n}</span>${t(ja,en)}</h2>${body.join('')}</section>`;
    const note=(ja,en)=>`<aside class="callout">${t(ja,en)}</aside>`;
    if(id==='kerr')return[
      section(1,'回転する時空のものさし','A ruler for rotating spacetime',
        p('Schwarzschildの球対称性を離れ、定常・軸対称・真空・漸近平坦なKerr計量を既知の厳密解として使う。電荷はゼロ、周囲の円盤や試験粒子の自己重力は無視する。以下はG＝c＝M＝1で、物理半径はGM/c²、時間はGM/c³を掛けて戻す。χ＝cJ/(GM²)は0以上とし、軌道の向きを別に選ぶ。','Take the stationary, axisymmetric, asymptotically flat Kerr vacuum metric as a supplied exact solution. Set electric charge to zero and neglect disc and test-particle self-gravity. Use G = c = M = 1: restore physical lengths with GM/c² and times with GM/c³. Let χ = cJ/(GM²) be nonnegative and label the orbital direction separately.'),
        eq('Σ = R² + χ² cos²θ,　Δ = R² − 2R + χ²<br>ds² = −(1−2R/Σ)dt² − (4χR sin²θ/Σ)dt dφ + (Σ/Δ)dR² + Σdθ²<br>　+ [R²+χ²+2χ²R sin²θ/Σ]sin²θ dφ²'),
        p('交差項の係数は2gₜφである。χ＝0ならSchwarzschildに戻る。RはBoyer–Lindquist座標で、回転時には球の面積半径ではない。式からの帰結を導く章であり、Einstein方程式から計量を構成するテンソル計算は参照資料へ譲る。','The mixed coefficient is 2gₜφ. Setting χ = 0 recovers Schwarzschild. R is a Boyer–Lindquist coordinate, not an areal radius when the spin is nonzero. We derive consequences of the metric; its construction from the Einstein equations is left to the references.')),
      section(2,'地平面と静止限界を分ける','Separate the horizon and static limit',
        p('外側の地平面はΔ＝0の大きい根。固定したR,θ,φでの静止時計はds²＝gₜₜdt²なので、時間的であるにはgₜₜ＜0が必要となる。gₜₜ＝0の外側の根を静止限界と呼ぶ。','The outer horizon is the larger root of Δ = 0. An observer at fixed R, θ, and φ has ds² = gₜₜdt² and can be timelike only where gₜₜ < 0. The outer root of gₜₜ = 0 defines the static limit.'),
        eq('R₊ = 1 + √(1−χ²)<br>Rₑ(θ) = 1 + √(1−χ²cos²θ)'),
        p('極では両者が一致し、赤道面の静止限界はχによらずR＝2。この間では静止はできないが、回転しながら時間的に動ける。静止限界は脱出不能な境界ではない。パネルは外部だけを扱い、地平面を横切る座標系や極限χ＝1の軌道は再生しない。','The surfaces meet at the poles; the equatorial static limit remains at R = 2. Between them static observers are impossible, but rotating timelike observers can exist. The static limit is not a no-escape boundary. The panel stays in the exterior and does not evolve horizon-crossing or exactly extremal orbits.')),
      section(3,'許される角速度と引きずり','Allowed angular velocities and frame dragging',
        p('Rとθを一定にし、Ω＝dφ/dtで回る観測者を考える。計量に代入し、二次式が負になるΩの区間を求める。光的な両端は次式で、時間的な観測者はその内側にある。','Hold R and θ fixed and rotate at Ω = dφ/dt. Substitution into the metric gives a quadratic that must be negative. Its null endpoints bound the allowed angular velocities of stationary timelike observers.'),
        eq('gₜₜ + 2gₜφΩ + gφφΩ² &lt; 0<br>Ω₋ &lt; Ω &lt; Ω₊,　Ω± = [−gₜφ ± √(gₜφ²−gₜₜgφφ)]/gφφ<br>ΩZ = −gₜφ/gφφ = 2χR / [(R²+χ²)²−χ²Δsin²θ]'),
        p('角運動量pφ＝gₜφuᵗ＋gφφuφがゼロでもΩZは一般にゼロでない。これが局所的な非回転観測者の引きずりである。その観測者も固定半径を保つ加速度が必要で、自由落下や円軌道の角速度と同一視しない。','Even zero angular momentum pφ = gₜφuᵗ + gφφuφ generally requires a nonzero ΩZ. This describes frame dragging of a locally nonrotating observer. Such a fixed-radius observer generally needs acceleration; ΩZ is not the angular velocity of a freely orbiting particle.')),
      section(4,'円軌道からISCOへ','From circular orbits to the ISCO',
        p('赤道面の質量を持つ試験粒子では、保存エネルギーEと比角運動量Lを使って半径の運動を分離できる。Carter定数は赤道面でゼロ。円軌道の二条件と、半径方向の安定性が限界になる条件を組み合わせる。','For a massive equatorial test particle, conserved specific energy E and angular momentum L separate the radial motion. The Carter constant vanishes in the equatorial plane. Combine the two circular-orbit conditions with marginal radial stability.'),
        eq('Σ²(dR/dτ)² = ℛ(R)<br>ℛ = [E(R²+χ²)−χL]² − Δ[R²+(L−χE)²]<br>ℛ = ∂Rℛ = ∂²Rℛ = 0<br>⇒ R² − 6R + 8sχ√R − 3χ² = 0'),
        p('微分ではE,Lを固定し、消去した後でs＝＋1を順行、s＝−1を逆行とする。外部の適切な根を選ぶと、次の閉じた式になる。','Differentiate at fixed E and L, then eliminate them. Set s = +1 for prograde and s = −1 for retrograde motion. Selecting the physical exterior branch yields the closed expression below.'),
        eq('Z₁ = 1 + (1−χ²)<sup>1/3</sup>[(1+χ)<sup>1/3</sup>+(1−χ)<sup>1/3</sup>]<br>Z₂ = √(3χ²+Z₁²)<br>R<sub>ISCO,s</sub> = 3+Z₂−s√[(3−Z₁)(3+Z₁+2Z₂)]'),
        p('χ＝0で両方向とも6。χ→1では順行の極限は1、逆行は9である。ただしχ＝1の地平面に普通の時間的円軌道を置く意味ではない。ISCOの内側にも落下物質は存在でき、圧力や磁場がある円盤の内縁は別の問題である。','At χ = 0 both branches give six. As χ approaches one, the prograde limit is one and the retrograde limit is nine. This does not place an ordinary timelike orbit on the exactly extremal horizon. Infall can occur inside the ISCO; pressure and magnetic stresses make a disc inner edge a different question.')),
      section(5,'回転の強さを変えて比較する','Compare different spins','<div data-lab="kerr"></div>',note('線は本文の式から計算した座標半径。観測された影でも、粒子の軌道積分でもない。入力変更は異なる定常時空の比較で、ブラックホールが時間とともに回転を増すアニメーションではない。','Curves show coordinate radii computed from the equations, not an observed shadow or integrated trajectories. Changing inputs compares stationary spacetimes; it is not a time evolution of a spinning-up black hole.'))
    ].join('');
    if(id==='tomimatsu-sato')return[
      section(1,'厳密解は、必ずしもブラックホールではない','An exact solution need not be a regular black hole',
        p('定常・軸対称・漸近平坦な真空解にはKerr以外の例がある。富松–佐藤の整数δで区別する族ではδ＝1がKerr。本章はδ＝2に絞り、既知のErnstポテンシャルから物理的な差を読む。正則な地平面などを仮定するブラックホールの一意性定理とは、仮定が同じではない。','Stationary, axisymmetric, asymptotically flat vacuum solutions need not be Kerr. In the Tomimatsu–Sato family, labelled by an integer δ, δ = 1 is Kerr. Focus on δ = 2 and read physical differences from its supplied Ernst potential. The assumptions differ from black-hole uniqueness theorems requiring a regular horizon.'),
        eq('G = c = 1,　p²+q² = 1,　p &gt; 0,　|q| &lt; 1<br>ρ = κ√[(x²−1)(1−y²)],　z = κxy<br>M = 2κ/p,　J = M²q'),
        p('x＞1、−1≤y≤1は長球座標で、ρは円筒座標の半径。物質密度ではない。以下のMは幾何学的な質量GM/c²。δ＝2の質量規格化はKerrのM＝κ/pと違うため、同じxを同じ物理半径と見なして比較しない。','Here x > 1 and −1 ≤ y ≤ 1 are prolate spheroidal coordinates; ρ is a cylindrical coordinate, not a material density. M denotes the geometrized mass GM/c². The δ = 2 normalization differs from Kerr’s M = κ/p, so equal x values do not mean equal physical radii.')),
      section(2,'複素ポテンシャルで解を指定する','Specify the solution with a complex potential',
        p('定常な軸対称真空の場を、Ernstポテンシャルℰ＝f＋iψで記述する。f＝−gₜₜ、ψは回転に関係するtwistポテンシャル。ここでは次の多項式を既知の解として与える。i²＝−1で、通常の絶対値と複素共役を区別する。','Write the stationary axisymmetric vacuum field using the Ernst potential ℰ = f + iψ, where f = −gₜₜ and ψ is the twist potential. Supply the following polynomial solution. Complex arithmetic uses i² = −1; modulus and complex conjugation are not ordinary real squaring.'),
        eq('ℰ = (A−B)/(A+B)<br>A = p²(x⁴−1)+q²(y⁴−1)−2ipqxy(x²−y²)<br>B = 2px(x²−1)+2iqy(y²−1)'),
        p('真空方程式はこの座標で次の複素偏微分方程式へまとめられる。これは出発点として借りる場の方程式である。右辺は微分の複素数としての二乗であり、絶対値二乗ではない。実装は特異点から離れた点で差分残差と、別表示によるfの一致を検査する。','The vacuum equations reduce to the complex PDE below, taken as the supplied field equation. The right side uses complex squares of derivatives, not squared moduli. Numerical checks compare finite-difference residuals away from singularities and f computed from an independent metric representation.'),
        eq('Re(ℰ){∂x[(x²−1)∂xℰ]+∂y[(1−y²)∂yℰ]}<br>　= (x²−1)(∂xℰ)²+(1−y²)(∂yℰ)²')),
      section(3,'軸上の展開から四重極を読む','Read the quadrupole from axis data',
        p('上側の軸y＝1ではz＝κx。ξ＝(1−ℰ)/(1＋ℰ)＝B/Aを作ると共通因子を消せる。無限遠の1/z展開で、最初の三つの係数はこの規約の質量M、iJ、質量四重極Qを与える。さらに高い次数では係数をそのまま全多重極と同一視できない。','On the upper axis y = 1, z = κx. Form ξ = (1−ℰ)/(1+ℰ) = B/A and cancel the common factor. In its asymptotic 1/z expansion, the first three coefficients give M, iJ, and the mass quadrupole Q in this convention. Higher coefficients cannot all be identified directly with relativistic multipoles.'),
        eq('ξ<sub>axis</sub> = 2px/[p²(x²+1)−2ipqx]<br>　= 2/(px)+4iq/(p²x²)−[2/p+8q²/p³]/x³+O(x<sup>−4</sup>)<br>　= M/z+iJ/z²+Q/z³+O(z<sup>−4</sup>)<br>Q<sub>TS2</sub>/M³ = −(1+3q²)/4<br>Q<sub>Kerr</sub>/M³ = −q²<br>(Q<sub>TS2</sub>−Q<sub>Kerr</sub>)/M³ = −(1−q²)/4'),
        p('同じM,J、つまり同じqでも四重極が違う。q＝0のTS2にはQ＝−M³/4が残り、非回転でも球対称にならない。この符号はMankoの式(10)に合わせる。四重極をニュートン力学の均質楕円体の軸比へ直接置き換えない。','At fixed M and J, hence fixed q, the quadrupoles differ. Nonrotating TS2 retains Q = −M³/4 and is not spherical. The sign follows Manko’s equation (10). Do not translate this relativistic quadrupole directly into the axis ratio of a homogeneous Newtonian spheroid.')),
      section(4,'環状特異点を見落とさない','Locate the ring singularity',
        p('0＜|q|＜1の赤道面y＝0でA＋B＝0を解くと、x＞1の環状特異点の位置を得る。下の多項式はx＞1で単調増加し、x＝1で−q²、無限遠で正だから、根は一つ。パネルは二分法でこの根を求める。','For 0 < |q| < 1 on y = 0, the condition A+B = 0 locates a ring singularity with x > 1. The polynomial below increases monotonically for x > 1, is −q² at one, and becomes positive at infinity. The panel finds its unique root by bisection.'),
        eq('p²x₀⁴+2px₀(x₀²−1)−1 = 0<br>ρ<sub>ring</sub>/M = (p/2)√(x₀²−1)'),
        p('q＝0では根が境界x＝1へ退き、外側の環状特異点の式をそのまま使わない。TS2には閉じた時間的曲線などの因果構造の問題もあり、通常の回転ブラックホールの代替と即断しない。本章は環の位置を計算し、完全な因果図や全測地線を再構成するものではない。','At q = 0 the root retreats to the boundary x = 1; the exterior-ring interpretation no longer applies. TS2 also has causal pathologies including closed timelike curves. It is not automatically an alternative model of an ordinary rotating black hole. This lesson computes the ring location without reconstructing the full causal diagram or all geodesics.')),
      section(5,'同じ質量と回転で比べる','Compare at fixed mass and spin','<div data-lab="tomimatsu-sato"></div>',note('四重極と環の座標は本文から再計算した理論値。輪の絵はブラックホールの影や物質の輪ではない。qは連続だがδは整数の解の指定であり、変形を時間発展として動かさない。','Multipoles and ring coordinates are recomputed theoretical quantities. A singular ring is neither a black-hole shadow nor a material ring. Spin q is continuous, whereas δ labels integer solution families; parameter comparison is not time evolution.'))
    ].join('');
    return[
      section(1,'球から少し外れた雲を落とす','Let a slightly nonspherical cloud fall',
        p('同じ初期密度の雲でも、形が違えば内部の重力は方向ごとに違う。Lin–Mestel–Shuの模型は、一様・非回転・圧力なしの孤立した楕円体を考える。宇宙膨張、磁場、乱流、衝撃波を省き、軸がつぶれる前だけを扱う。「回転楕円体」は形の名称で、物体が回っている意味ではない。','Shape changes the directional gravitational field even at fixed initial density. Consider an isolated, homogeneous, nonrotating pressure-free spheroid: no expansion, magnetic field, turbulence, or shocks. Follow it only before an axis collapses. A spheroid is a shape; it does not imply that the cloud rotates.'),
        eq('a₁ = a₂ = a(t),　a₃ = c(t),　q = c/a<br>M = (4π/3)ρa²c = constant<br>ρ(t)/ρ₀ = a₀²c₀/[a(t)²c(t)]'),
        p('半軸に比例した速度場vᵢ＝(ȧᵢ/aᵢ)xᵢを使う。この一様楕円体の内部重力もxᵢに比例するので、軌道交差前には一様性と楕円体の形を保つ自己整合な運動になる。任意の密度分布を楕円体に見立てる近似とは区別する。','Use the homologous velocity field vᵢ = (ȧᵢ/aᵢ)xᵢ. The interior gravitational acceleration of a homogeneous ellipsoid is also linear in xᵢ, so this gives a self-consistent homogeneous evolution before caustics. It is not an exact description of arbitrary nonuniform clouds.')),
      section(2,'重力係数から半軸の運動へ','From gravitational coefficients to axis motion',
        p('楕円体の重力ポテンシャルの章の係数Aᵢを使う。内部でgᵢ＝−2πGρAᵢxᵢ、係数の和は2。表面の流体要素に運動方程式を適用すると、二つの常微分方程式になる。','Use the coefficients Aᵢ from the ellipsoidal-potential chapter. Inside the cloud gᵢ = −2πGρAᵢxᵢ and their sum is two. Applying the pressure-free equation of motion to surface elements produces two ordinary differential equations.'),
        eq('Aᵢ = a₁a₂a₃∫₀<sup>∞</sup>du/[(aᵢ²+u)√((a₁²+u)(a₂²+u)(a₃²+u))]<br>2Aₐ+A<sub>c</sub> = 2<br>ä = −2πGρAₐa,　c̈ = −2πGρA<sub>c</sub>c'),
        p('扁平q＜1ならe＝√(1−q²)を使い、細長いq＞1ならe＝√(1−q⁻²)を使う。球に近い場合は打ち消し誤差を避ける級数を使う。重力係数の大小だけでなく、重力加速度には半軸も掛かることに注意する。','For oblate q < 1 use e = √(1−q²); for prolate q > 1 use e = √(1−q⁻²). Use series near the sphere to avoid cancellation. The acceleration includes the axis length as well as its gravitational coefficient.'),
        eq('q &lt; 1:　A<sub>c</sub> = 2[1−q arccos(q)/e]/e²<br>q &gt; 1:　A<sub>c</sub> = (1−e²)[ln((1+e)/(1−e))−2e]/e³<br>q = 1:　Aₐ = A<sub>c</sub> = 2/3,　Aₐ = (2−A<sub>c</sub>)/2')),
      section(3,'初期条件と時計をそろえる','Specify initial conditions and a time unit',
        p('a₀を長さ単位、t₀＝(2πGρ₀)⁻¹/²を時間単位にする。以下のa,cは無次元で、初期値はa＝1,c＝q₀、速度はどちらもゼロ。上付きの点の代わりにプライムで無次元時刻τの微分を表す。','Use a₀ as the length unit and t₀ = (2πGρ₀)⁻¹/² as the time unit. The dimensionless initial conditions are a = 1, c = q₀, with both velocities zero. Primes denote derivatives with respect to dimensionless time τ.'),
        eq('D = ρ/ρ₀ = q₀/(a²c)<br>a″ = −DAₐa,　c″ = −DA<sub>c</sub>c'),
        p('初期密度を変えると物理時間がρ₀⁻¹/²で伸縮する。同じ密度でq₀を変える比較は、a₀を固定しているため質量も変わる。パネルはこの初期条件の族を積分するのであって、初期収縮速度や外圧まで自由に選ぶ計算器ではない。','Changing the initial density rescales physical time by ρ₀⁻¹/². Varying q₀ at fixed a₀ and initial density also changes the mass. The panel integrates this stated family; it does not allow arbitrary initial contraction velocities or external pressures.')),
      section(4,'球の解析解とエネルギーで検査する','Check against spherical collapse and energy conservation',
        p('球ではa＝c＝bとしてb″＝−2/(3b²)。静止から出発する解は補助角ηを使って書ける。これは数値計算を独立に検査できる基準となる。','For a sphere, a = c = b and b″ = −2/(3b²). The initially stationary solution has the parametric form below, providing an independent numerical benchmark.'),
        eq('b = (1+cosη)/2,　τ = (√3/4)(η+sinη)<br>τ<sub>ff</sub> = π√3/4,　t<sub>ff</sub> = √[3π/(32Gρ₀)]'),
        p('全エネルギーも一定になる。単位質量あたりの運動エネルギーは、各方向で平均xᵢ²＝aᵢ²/5を使う。位置エネルギーの積分と合わせれば、無次元の保存量を計算できる。','Total energy supplies a second check. The mean squared coordinate along an axis is aᵢ²/5, which determines the kinetic energy per unit mass. Combine it with the potential-energy integral to obtain a dimensionless invariant.'),
        eq('ℋ = (2a′²+c′²)/10 − (q₀/5)I(a,c)<br>I = ∫₀<sup>∞</sup>du/[(a²+u)√(c²+u)]<br>q &lt; 1: I = 2 arccos(q)/(a√(1−q²))<br>q &gt; 1: I = 2 arcosh(q)/(a√(q²−1))'),
        p('扁平な雲はさらに平たく、細長い雲はさらに細長くなる。軸がゼロになると密度が発散し、以後をこの滑らかな一様流として続けられない。パネルは最小の初期比半軸または現在の短軸／長軸が0.03へ達したところで止める。これは特異点への到達時刻そのものではなく、計算の打切り条件である。','Oblate clouds flatten further; prolate clouds become more elongated. A vanishing axis makes the density diverge and ends the smooth homogeneous flow. Stop when either the smallest initial-normalized axis or the current short/long axis ratio reaches 0.03. This is a numerical cutoff, not a measured singularity time.')),
      section(5,'形と密度の変化を追う','Follow shape and density','<div data-lab="lin-mestel-shu"></div>',note('軸の運動方程式を積分した教材図。Linらの特定の原図や粒子シミュレーションの再現ではない。圧力を含むShuの等温球崩壊や、軌道交差前のZel’dovich近似とは仮定が異なる。','Teaching plots integrate the axis equations; they do not reproduce a particular original figure or particle simulation. Assumptions differ from pressure-supported Shu collapse and from the pre-crossing Zel’dovich approximation.'))
    ].join('');
  }
  const previous=A.renderBody;
  A.renderBody=(id,locale)=>metadata[id]?render(id,locale):previous(id,locale);
})();
