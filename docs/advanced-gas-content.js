/* Worked lessons: pressure-confined clouds, spherical flows, ionization, and disks. */
(() => {
  'use strict';
  const advanced = window.AstroAdvanced;
  let language = 'ja';
  const t = (ja, en) => language === 'ja' ? ja : en;
  const p = (ja, en) => `<p>${t(ja, en)}</p>`;
  const f = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
  const eq = (html, ja = '', en = '') => `<div class="equation"><div class="math">${html}</div>${ja ? `<div class="caption">${t(ja, en)}</div>` : ''}</div>`;
  const s = (n, ja, en, ...body) => `<section><h2><span class="step-no">${String(n).padStart(2, '0')}</span>${t(ja, en)}</h2>${body.join('')}</section>`;
  const note = (ja, en) => `<aside class="callout">${t(ja, en)}</aside>`;
  Object.assign(advanced.sources, {
    ostriker1964: ['Ostriker (1964) · The equilibrium of polytropic and isothermal cylinders, §III, equations (56)–(61)', 'https://articles.adsabs.harvard.edu/pdf/1964ApJ...140.1056O'],
    ostrikerMemorial: ['Princeton University (14 April 2025) · Remembering Jeremiah P. Ostriker', 'https://www.princeton.edu/news/2025/04/14/astrophysicist-jeremiah-p-ostriker-pioneer-modern-cosmology-and-source-inspiration'],
    filament2012: ['Fischera & Martin (2012) · Physical properties of interstellar filaments', 'https://doi.org/10.1051/0004-6361/201218961'],
    be1956: ['Bonnor (1956) · Boyle’s law and gravitational instability', 'https://articles.adsabs.harvard.edu/pdf/1956MNRAS.116..351B'],
    beStability: ['Sipilä, Harju & Juvela (2011) · Stability of Bonnor–Ebert spheres', 'https://arxiv.org/abs/1108.5275'],
    jeansSwindle: ['Falco et al. (2013) · Why does the Jeans swindle work?', 'https://arxiv.org/abs/1210.3363'],
    bondi1952: ['Bondi (1952) · On spherically symmetrical accretion', 'https://articles.adsabs.harvard.edu/pdf/1952MNRAS.112..195B'],
    sphericalNotes: ['Charles University · Spherically symmetric accretion', 'https://astro.troja.mff.cuni.cz/vyuka/AST024/online/index.php?page=acc_spherical'],
    parker1958: ['Parker (1958) · Dynamics of the interplanetary gas and magnetic fields', 'https://articles.adsabs.harvard.edu/pdf/1958ApJ...128..664P'],
    stromgren1939: ['Strömgren (1939) · The physical state of interstellar hydrogen', 'https://articles.adsabs.harvard.edu/pdf/1939ApJ....89..526S'],
    hiiNotes: ['Quillen · AST242: H II regions and ionization fronts', 'https://astro.pas.rochester.edu/~aquillen/ast242/lecturenotes7.pdf'],
    ss1973: ['Shakura & Sunyaev (1973) · Black holes in binary systems', 'https://articles.adsabs.harvard.edu/pdf/1973A%26A....24..337S'],
    qNotes: ['Pe’er · Galaxies and their properties: gas-disk stability', 'https://asafpeer2.ph.biu.ac.il/wp-content/uploads/2020/08/Galaxies1.pdf'],
    gammie2001: ['Gammie (2001) · Gravitational instability in cooling gaseous disks', 'https://arxiv.org/abs/astro-ph/0101501'],
    mri1991: ['Balbus & Hawley (1991) · A local shear instability in weakly magnetized disks', 'https://articles.adsabs.harvard.edu/pdf/1991ApJ...376..214B']
  });
  const chapters = [
    {
      id: 'isothermal-cylinder', title: ['Ostrikerの等温円柱と限界線密度', 'Ostriker’s isothermal cylinder and critical line mass'],
      desc: ['J. P. Ostrikerを偲び、球とは異なる重力と、フィラメントを支える限界を解析解でたどる。', 'Remembering J. P. Ostriker through an analytic model of filament gravity and its limiting mass per length.'],
      minutes: 30, prereq: ['静水圧平衡、Gaussの法則、微分と積分', 'Hydrostatic balance, Gauss’s law, differentiation and integration'],
      goal: ['円柱の重力から密度プロファイルを導き、r⁻⁴の裾と有限の限界線密度を確かめ、球対称・投影量・外圧の違いを説明する。', 'Derive the cylindrical density profile, verify its r⁻⁴ envelope and finite limiting line mass, and distinguish spherical geometry, projection and external pressure.'],
      question: ['温度を同じにして中心密度を4倍にすると、限界線密度と、全線密度の半分を含む半径は何倍になるか。', 'At fixed temperature, quadruple central density. How do the critical line mass and the radius enclosing half the full line mass change?'],
      answer: ['限界線密度2cₛ²/Gは中心密度に依存しないので同じ。半線密度半径a＝√8Hはρ<sub>c</sub><sup>−1/2</sup>に比例して1/2倍になる。より細く濃い円柱になっても、無限半径まで積分した線密度は変わらない。', 'The critical line mass 2cₛ²/G is independent of central density and stays unchanged. The half-line-mass radius a = √8H scales as ρ<sub>c</sub><sup>−1/2</sup> and halves. A narrower, denser cylinder has the same line mass integrated to infinite radius.'],
      refs: ['ostriker1964', 'filament2012', 'ostrikerMemorial'], bridge: 'virial'
    },
    {
      id: 'bonnor-ebert', title: ['Bonnor–Ebert球と雲の限界質量', 'Bonnor–Ebert spheres and a cloud’s limiting mass'],
      desc: ['外圧で囲まれた等温の雲は、どこまで自重を支えられるか。', 'How much self-gravity can a pressure-confined isothermal cloud support?'],
      minutes: 35, prereq: ['Lane–Emden章、常微分方程式、指数関数、無次元化', 'The Lane–Emden chapter, ODEs, exponentials, and nondimensionalization'],
      goal: ['等温球の方程式を作り、外圧を固定した質量系列の極大からBonnor–Ebert限界を読み、有限の雲と無限の等温球を区別する。', 'Formulate an isothermal sphere, locate the maximum mass at fixed external pressure, and distinguish a finite cloud from an infinite isothermal sphere.'],
      question: ['音速を同じにして外圧を4倍にすると、臨界質量と臨界半径はどうなるか。この比較で中心と表面の密度比は変わるか。', 'At fixed sound speed, quadruple the external pressure. How do critical mass, critical radius, and the central-to-edge density contrast change?'],
      answer: ['臨界質量と半径はともにP<sub>ext</sub><sup>−1/2</sup>に比例して1/2倍。臨界の無次元半径は同じなので密度比は約14.0のまま。中心密度と表面密度の絶対値はどちらも4倍になる。', 'Critical mass and radius both scale as P<sub>ext</sub><sup>−1/2</sup>, so both halve. The critical dimensionless radius is unchanged and the contrast stays near 14.0. Both absolute central and edge densities quadruple.'],
      refs: ['be1956', 'beStability'], bridge: 'virial'
    },
    {
      id: 'jeans', title: ['Jeans不安定性とJeans swindle', 'Jeans instability and the Jeans swindle'],
      desc: ['重力が勝つ波長を導き、一様な背景をどう扱ったかを確かめる。', 'Derive the wavelengths dominated by gravity and inspect the treatment of the uniform background.'],
      minutes: 30, prereq: ['流体の保存則、偏微分、線形化、平面波', 'Fluid conservation, partial derivatives, linearization, and plane waves'],
      goal: ['連続・運動・Poisson方程式を線形化して分散関係を導き、Jeans長と成長時間を求め、背景重力を差し引く模型の限界を説明する。', 'Linearize continuity, momentum, and Poisson equations, derive the Jeans length and growth time, and explain the limits of subtracting background gravity.'],
      question: ['音速を固定し密度を4倍にすると、Jeans長、ここで定義したJeans質量、重力の時間尺度はそれぞれ何倍か。', 'At fixed sound speed, quadruple density. How do Jeans wavelength, the mass convention used here, and the gravitational timescale change?'],
      answer: ['三つともρ₀<sup>−1/2</sup>に比例するので1/2倍。波長λ<sub>J</sub>/2を半径とする球で質量を定義している。質量をρλ<sub>J</sub>³と定義すると係数は変わるが、この密度・音速依存性は変わらない。', 'All three scale as ρ₀<sup>−1/2</sup>, so all halve. The mass here is that of a sphere of radius λ<sub>J</sub>/2. Defining it as ρλ<sub>J</sub>³ changes a numerical coefficient, not its density and sound-speed scaling.'],
      refs: ['jeansSwindle', 'qNotes'], bridge: 'virial'
    },
    {
      id: 'bondi', title: ['Bondi降着と音速点', 'Bondi accretion and the sonic point'],
      desc: ['質量保存と圧力の勾配から、中心へ流れ込む臨界解を選ぶ。', 'Use mass conservation and a pressure gradient to select a critical inflow.'],
      minutes: 35, prereq: ['常微分方程式、対数、定常流の保存則', 'ODEs, logarithms, and steady-flow conservation'],
      goal: ['球対称の等温流の方程式を導き、音速点で正則な降着解と降着率を求め、圧力を無視した自由落下との違いを説明する。', 'Derive spherical isothermal flow, find the regular transonic accretion solution and its rate, and distinguish it from pressure-free free fall.'],
      question: ['外側の密度は同じで、中心質量と外側の音速を両方2倍にすると、Bondi半径と等温降着率はそれぞれ何倍か。', 'At fixed outer density, double both the central mass and the outer sound speed. How do Bondi radius and isothermal accretion rate change?'],
      answer: ['r<sub>B</sub>∝M/c<sub>s</sub>²なので1/2倍。降着率はM²ρ∞/c<sub>s</sub>³に比例し、4/8＝1/2倍。音速の増大は圧力の支えを強くする。等温の無次元係数λは同じである。', 'r<sub>B</sub> ∝ M/c<sub>s</sub>² halves. The rate scales as M²ρ∞/c<sub>s</sub>³, giving 4/8 = 1/2. Increased sound speed strengthens pressure support; the isothermal dimensionless coefficient λ stays fixed.'],
      refs: ['bondi1952', 'sphericalNotes'], bridge: 'eddington'
    },
    {
      id: 'parker-wind', title: ['Parker風と超音速流出', 'Parker wind and transonic outflow'],
      desc: ['熱い大気は、どうして重力に逆らって外へ加速できるか。', 'How can a hot atmosphere accelerate outward against gravity?'],
      minutes: 30, prereq: ['Bondi章、微分と対数、境界条件', 'The Bondi chapter, derivatives, logarithms, and boundary conditions'],
      goal: ['Bondi流と共通の風方程式から流出の枝を選び、音速点・加熱・外側の境界条件の役割を分ける。', 'Select the outflow branch of the equation shared with Bondi flow and separate sonic regularity, heating, and outer boundary conditions.'],
      question: ['中心質量と平均分子量を同じにし、等温温度を4倍にすると、音速と音速点半径はどう変わるか。音速点だけで質量放出率は決まるか。', 'At fixed central mass and mean molecular weight, quadruple the isothermal temperature. How do sound speed and sonic radius change? Does the sonic point alone fix mass loss?'],
      answer: ['c<sub>s</sub>∝√Tなので2倍、r<sub>s</sub>∝1/c<sub>s</sub>²なので1/4倍。質量放出率4πr²ρuには密度の規格化が残り、底の密度などの境界条件が必要。速度の臨界曲線だけでは決まらない。', 'Sound speed doubles because c<sub>s</sub> ∝ √T; sonic radius decreases by four. The mass-loss rate 4πr²ρu still needs a density normalization, such as a base density. The critical velocity curve alone does not fix it.'],
      refs: ['parker1958', 'sphericalNotes'], bridge: 'sun'
    },
    {
      id: 'stromgren', title: ['Strömgren球と電離前線', 'Strömgren spheres and ionization fronts'],
      desc: ['光子を数えて、星のまわりの電離領域の大きさと成長を求める。', 'Count photons to find the size and early growth of an ionized region around a star.'],
      minutes: 30, prereq: ['体積、指数関数、一次の常微分方程式', 'Volumes, exponentials, and a first-order ODE'],
      goal: ['電離光子と再結合の釣り合いから半径を導き、体積の時間発展を解き、気体の運動を無視した範囲を説明する。', 'Derive the equilibrium radius from photon and recombination balance, solve volume growth, and explain the neglect of gas motion.'],
      question: ['光子供給率を8倍、水素原子核の密度を2倍にすると、平衡半径と再結合時間はそれぞれ何倍になるか。', 'Multiply the ionizing-photon rate by eight and hydrogen-nucleus density by two. How do equilibrium radius and recombination time change?'],
      answer: ['R<sub>S</sub>∝(S/n<sub>H</sub>²)<sup>1/3</sup>なので2<sup>1/3</sup>≈1.26倍。t<sub>rec</sub>＝1/(α<sub>B</sub> n<sub>H</sub>)は1/2倍。温度とα<sub>B</sub>を同じとし、全電離した純水素でn<sub>e</sub>＝n<sub>p</sub>＝n<sub>H</sub>という条件を使った。', 'R<sub>S</sub> ∝ (S/n<sub>H</sub>²)<sup>1/3</sup> increases by 2<sup>1/3</sup>, about 1.26. The recombination time 1/(α<sub>B</sub> n<sub>H</sub>) halves. This holds at fixed temperature and α<sub>B</sub>, for fully ionized pure hydrogen with n<sub>e</sub> = n<sub>p</sub> = n<sub>H</sub>.'],
      refs: ['stromgren1939', 'hiiNotes'], bridge: 'atom'
    },
    {
      id: 'alpha-disk', title: ['α円盤と粘性型の降着', 'Alpha disks and viscous-type accretion'],
      desc: ['輸送を一つの係数で表し、円盤の厚み・降着率・明るさを結ぶ。', 'Parametrize transport and connect disk thickness, accretion rate, and luminosity.'],
      minutes: 35, prereq: ['角運動量輸送章、微分・積分、ケプラー回転', 'Angular-momentum transport, calculus, and Keplerian rotation'],
      goal: ['鉛直平衡からHを導き、ν＝αc<sub>s</sub>Hの規約を明示して、定常円盤の質量・角運動量・エネルギーの収支をつなぐ。', 'Derive scale height from vertical balance, define the ν = αc<sub>s</sub>H convention, and connect steady mass, angular-momentum, and energy budgets.'],
      question: ['半径、中心質量、H/r、面密度を固定し、αを3倍にする。内縁から十分遠い定常円盤でν、降着率、粘性時間はどう変わるか。', 'At fixed radius, central mass, H/r, and surface density, triple alpha. Far from the inner edge of a steady disk, what happens to viscosity, accretion rate, and viscous time?'],
      answer: ['νとṀ≈3πνΣは3倍、t<sub>ν</sub>∼r²/νは1/3倍。温度やΣを同時に変えてよいとは仮定していない。この比較は輸送の規約と固定する量を指定して初めて意味を持つ。', 'Viscosity and Ṁ ≈ 3πνΣ triple; t<sub>ν</sub> ∼ r²/ν falls to one-third. Temperature and surface density have not been allowed to change simultaneously. The comparison requires an explicit convention and fixed inputs.'],
      refs: ['ss1973', 'accretionDisk', 'diskWind'], bridge: 'structure'
    },
    {
      id: 'mri', title: ['MRI：磁場と差動回転の不安定性', 'MRI: magnetic fields and differential rotation'],
      desc: ['流体だけなら安定な円盤でも、弱い磁気張力が成長を生む。', 'Weak magnetic tension can destabilize a disk that is hydrodynamically stable.'],
      minutes: 35, prereq: ['角運動量輸送、線形化、行列式、二次方程式', 'Angular-momentum transport, linearization, determinants, and quadratic equations'],
      goal: ['局所的な磁気張力とCoriolis力の式から分散関係を導き、成長する波数帯と最大成長率を求め、線形成長と輸送の飽和を区別する。', 'Derive the dispersion relation from local tension and Coriolis forces, find the unstable band and maximum growth, and distinguish linear growth from transport saturation.'],
      question: ['ケプラー回転で最も速く育つ波を固定する。密度と波数を保って磁場を2倍にすると、その波は成長し続けるか。円盤のすべての波が安定化したと言えるか。', 'Fix the fastest-growing Keplerian mode. At fixed density and wavenumber, double the magnetic field. Does that mode still grow? Have all disk modes become stable?'],
      answer: ['もとのb²＝15/16が4倍の15/4となり、不安定条件b²<3を外れるので、その波は成長しない。別の長波長ではbを小さくできるため、全モードの安定化とは限らない。実際には円盤内に波長が収まるかも必要。', 'Its b² rises from 15/16 to 15/4, outside b² < 3, so that mode stops growing. Other, longer wavelengths can have smaller b; this is not stability of every mode. The wavelength must also fit within the real disk.'],
      refs: ['mri1991', 'diskTransport'], bridge: 'matter'
    },
    {
      id: 'toomre-q', title: ['Toomre Qと円盤の自己重力', 'Toomre Q and disk self-gravity'],
      desc: ['圧力・回転・重力の競争を、波長ごとの分散関係で読む。', 'Read the competition between pressure, rotation, and gravity at each wavelength.'],
      minutes: 35, prereq: ['Jeans章、線形化、回転座標、平方完成', 'The Jeans chapter, linearization, rotating frames, and completing the square'],
      goal: ['薄い気体円盤の分散関係を作り、平方完成からQ<1と不安定帯を導き、線形不安定と実際の分裂を区別する。', 'Construct the thin-gas-disk dispersion relation, derive Q < 1 and the unstable band by completing the square, and distinguish linear instability from fragmentation.'],
      question: ['Q＝0.8の気体円盤で、x＝kc<sub>s</sub>/κの不安定帯、最も速く育つx、最大成長率σ/κを求めよう。', 'For a gas disk with Q = 0.8, find the unstable interval in x = kc<sub>s</sub>/κ, the fastest-growing x, and maximum σ/κ.'],
      answer: ['不安定帯は0.5<x<2、最速はx＝1/Q＝1.25、σ<sub>max</sub>/κ＝√(1/Q²−1)＝0.75。端点は中立で指数成長率0。これは局所的・軸対称・無限に薄い気体円盤の結果で、直ちに惑星や星への分裂を保証しない。', 'The unstable band is 0.5 < x < 2, fastest growth is at x = 1.25, and maximum σ/κ = 0.75. The endpoints are neutral. These results assume a local, axisymmetric, razor-thin gas disk and do not guarantee fragmentation into planets or stars.'],
      refs: ['qNotes', 'gammie2001'], bridge: 'virial'
    }
  ];
  const bodies = {};
  // Lesson bodies are defined below before extending the common reader.
  bodies['isothermal-cylinder'] = () => [
    s(1, 'Jeremiah P. Ostrikerを偲んで', 'In memory of Jeremiah P. Ostriker',
      note('Jeremiah P. Ostriker（1937–2025）は、2025年4月6日に87歳で亡くなった。ダークマター、銀河形成、星間物質の研究と、教育・共同研究に残した仕事を偲び、1964年の等温円柱解を自分の手で確かめる章を置く。', 'Jeremiah P. Ostriker (1937–2025) died on 6 April 2025, aged 87. We remember his work on dark matter, galaxy formation and the interstellar medium, and his contributions to teaching and collaboration, by working through his 1964 isothermal-cylinder solution.'),
      p(`<a href="${advanced.sources.ostrikerMemorial[1]}" target="_blank" rel="noopener noreferrer">Jeremiah P. Ostrikerを偲んで — Princeton大学の追悼記事 ↗</a>（2025年4月14日、英語）。研究の功績と、共同研究者や教え子の回想を紹介している。`, `<a href="${advanced.sources.ostrikerMemorial[1]}" target="_blank" rel="noopener noreferrer">In memory of Jeremiah P. Ostriker — Princeton University tribute ↗</a> (14 April 2025). The article describes his scientific contributions and shares recollections from colleagues and former students.`),
      p('長く細い分子雲のフィラメントを、軸方向に一様な円柱で近似する。重力と圧力の釣り合いという基本は星と同じだが、球から円柱へ形を変えるだけで、密度の裾と質量の限界は変わる。追悼は、著名な結果を名前だけ覚えるのではなく、その式をもう一度使ってみることから始めたい。', 'Approximate a long molecular filament by a cylinder uniform along its axis. Gravity still balances pressure, as in a star, but changing geometry alters the density envelope and mass limit. Here the tribute takes the form of deriving and using a result, rather than only remembering its name.'),
      p('原論文の§IIIをたどる。Ostriker自身も脚注でStodółkiewicz (1963)による先行する同じ解を挙げており、Stodółkiewicz–Ostriker解とも呼ばれる。以下では記号と長さの規格化をこの教材用にそろえる。', 'We follow §III of the original paper. Ostriker’s footnote acknowledges the same solution obtained by Stodółkiewicz (1963); it is also called the Stodółkiewicz–Ostriker solution. Notation and length scales below are chosen for this guide.')),
    s(2, '球の質量から、円柱の線密度へ', 'From spherical mass to cylindrical line mass',
      p('軸からの距離をr、内側の単位長さあたりの質量をλ(r)と書く。ここでのλは体積密度でも、観測の柱密度でもなく、質量÷長さである。軸方向の端を無視できる長い円柱、等温、静止、非回転を仮定し、磁場と乱流による支えは含めない。', 'Let r measure distance from the axis, and λ(r) be the enclosed mass per unit length. Line mass is mass divided by length, distinct from volume density or projected column density. Assume a long, static, isothermal, nonrotating cylinder, neglecting ends, magnetic fields and turbulent support.'),
      `<figure class="concept-figure"><svg viewBox="0 0 640 190" role="img" aria-label="${t('長い円柱の単位長さと、軸からの半径','Unit length along a cylinder and radius from its axis')}"><title>${t('円柱の形と線密度 λ = M/L','Cylindrical geometry and line mass λ = M/L')}</title><path d="M80 50H400V140H80Z" fill="#dce7d9" stroke="#48715c"/><ellipse cx="80" cy="95" rx="23" ry="45" fill="#eaf0e8" stroke="#48715c"/><ellipse cx="400" cy="95" rx="23" ry="45" fill="#c1d2bd" stroke="#48715c"/><path d="M50 95H440" stroke="#8c9c8e" stroke-dasharray="4 4"/><path d="M160 35V155M310 35V155" stroke="#b25930" stroke-dasharray="4 4"/><text x="235" y="175" text-anchor="middle">L · λ = M/L</text><circle cx="535" cy="95" r="52" fill="#eaf0e8" stroke="#48715c"/><circle cx="535" cy="95" r="3" fill="#b25930"/><path d="M535 95H587" stroke="#b25930"/><text x="558" y="86">r</text><text x="535" y="175" text-anchor="middle">${t('断面','Cross section')}</text></svg><figcaption>${t('長さLの部分に含まれる質量をLで割る。重力は軸に垂直な方向を向く。','Divide the mass in a segment by its length L. Gravity points toward the axis, perpendicular to it.')}</figcaption></figure>`,
      eq(`λ(r)=∫<sub>0</sub><sup>r</sup>2πr′ρ(r′)dr′,　${f('dλ','dr')}=2πrρ<br>g<sub>r</sub>=−${f('2Gλ(r)','r')}`),
      p('円柱のGauss面の側面積は2πrLだから、重力の大きさ×2πrL＝4πGλLとなる。球のGM/r²とは半径依存性が違う。中心ではλ∝r²なので、重力は発散せずrに比例して0へ近づく。', 'A cylindrical Gaussian surface has side area 2πrL, so gravity times 2πrL equals 4πGλL. This differs from spherical GM/r². Near a regular centre λ ∝ r², so gravity tends to zero linearly rather than diverging.')),
    s(3, '等温の釣り合いを、一つの方程式へ', 'Reduce isothermal balance to one equation',
      eq(`P=c<sub>s</sub>²ρ,　c<sub>s</sub>²${f('dlnρ','dr')}=−${f('2Gλ','r')}<br>${f('1','r')}${f('d','dr')}(r${f('dlnρ','dr')})=−${f('4πGρ','c<sub>s</sub>²')}`),
      p('ρ＝ρ<sub>c</sub>e<sup>−ψ</sup>と書き、H＝cₛ/√(4πGρ<sub>c</sub>)、ξ＝r/Hを入れる。中心の条件はψ(0)＝ψ′(0)＝0。球の等温Lane–Emden方程式にあった2ψ′/ξが、円柱ではψ′/ξになる。', 'Write ρ = ρ<sub>c</sub>e<sup>−ψ</sup>, H = cₛ/√(4πGρ<sub>c</sub>), and ξ = r/H. Regular central conditions are ψ(0) = ψ′(0) = 0. The spherical isothermal Lane–Emden term 2ψ′/ξ becomes ψ′/ξ for a cylinder.'),
      eq(`ψ″+${f('1','ξ')}ψ′=e<sup>−ψ</sup>`),
      p('円柱の式は、球の解を半径だけ置き換えて流用したものではない。空間の形が面積の増え方を変え、その違いが微分方程式の係数に残っている。', 'This is not the spherical solution with a relabelled radius. Geometry changes the growth of Gaussian surface area, leaving a different coefficient in the differential equation.')),
    s(4, '解析解を代入して、r⁻⁴を確かめる', 'Verify the analytic solution and its r⁻⁴ envelope',
      eq(`ψ=2ln(1+${f('ξ²','8')}),　ρ(r)=ρ<sub>c</sub>(1+${f('r²','8H²')})<sup>−2</sup><br>a≡√8H,　ρ(r)=${f('ρ<sub>c</sub>','(1+r²/a²)²')}`),
      eq(`ψ′=${f('4ξ','8+ξ²')},　ψ″+${f('ψ′','ξ')}=${f('64','(8+ξ²)²')}=(1+${f('ξ²','8')})<sup>−2</sup>`),
      p('中心r≪aでは密度がほぼ一定で、r≫aではρ∝r⁻⁴になる。球の特異等温解のr⁻²とは異なる。aは「ここから突然傾きが変わる境界」ではなく、平らな中心から裾へ滑らかに移る尺度である。', 'Density is nearly constant for r ≪ a and falls as r⁻⁴ for r ≫ a, unlike the r⁻² singular isothermal sphere. The scale a marks a smooth transition rather than an abrupt density boundary.'),
      p('微分方程式を数値積分して初めて形が得られる場合と違い、ここでは式を代入して恒等的に釣り合うことまで確かめられる。解析解が計算法の検算にもなる理由である。', 'Unlike a profile known only by numerical integration, this closed form can be substituted to verify the equation identically. This also makes it a useful numerical benchmark.')),
    s(5, '半径を無限にしても、線密度は有限', 'Infinite radial extent but finite line mass',
      eq(`λ(r)=2πρ<sub>c</sub>∫<sub>0</sub><sup>r</sup>${f('r′dr′','(1+r′²/a²)²')}=πρ<sub>c</sub>a²${f('r²','r²+a²')}<br>λ(r)=${f('2c<sub>s</sub>²','G')}${f('r²','r²+a²')},　λ<sub>crit</sub>≡λ(∞)=${f('2c<sub>s</sub>²','G')}`),
      p('中心密度を上げると円柱が細くなるため、無限半径まで積分した線密度からρ<sub>c</sub>が消える。r＝aなら線密度の半分を含む。無限に長い円柱の総質量が有限という意味ではなく、有限なのは単位長さあたりの質量である。', 'Increasing central density narrows the cylinder, cancelling ρ<sub>c</sub> from its full line mass. Radius a encloses half that line mass. The total mass of an infinitely long cylinder is still infinite: the finite quantity is mass per unit length.'),
      eq(`c<sub>s</sub>²=${f('k<sub>B</sub>T','μm<sub>p</sub>')},　λ<sub>crit</sub>≈16.5(${f('T','10 K')})(${f('2.33','μ')}) M<sub>☉</sub> pc<sup>−1</sup>`),
      p('この熱圧力だけの静止円柱では、これを超える線密度を支える平衡はない。ただし、軸方向の分裂、有限の端からの収縮、磁場・回転・乱流による支えは別の問題であり、この式一つで実在のフィラメントの運命が決まるわけではない。', 'This static cylinder supported only by thermal pressure cannot support a larger line mass. Axial fragmentation, end-driven contraction and magnetic, rotational or turbulent support are separate questions; this one formula does not determine every real filament’s fate.')),
    s(6, '外圧で切り取る、観測へ投影する', 'Pressure truncation and observational projection',
      p('外圧で半径Rに切り取れば、線密度は極限より小さい。f＝λ(R)/λ<sub>crit</sub>と置くと、表面密度と中心密度の関係も式変形で求まる。', 'Truncating at radius R with external pressure gives a line mass below the limit. Set f = λ(R)/λ<sub>crit</sub> to obtain the surface-to-central density relation algebraically.'),
      eq(`R=a√(${f('f','1−f')}),　${f('ρ(R)','ρ<sub>c</sub>')}=(1−f)²,　P<sub>ext</sub>=c<sub>s</sub>²ρ(R)`),
      '<div data-lab="isothermal-cylinder"></div>',
      p('横から見た柱密度Σは、体積密度ρを視線方向に積分した量である。半径を無限に延ばした上の解析解では、軸からの投影距離bに対して次式となり、裾はb⁻³であってr⁻⁴ではない。外圧で切った有限半径の円柱では、視線の積分区間も変わる。', 'The side-on projected column density Σ integrates volume density along the line of sight. For the radially unbounded analytic model, it follows the formula below at projected distance b and falls as b⁻³, not r⁻⁴. A pressure-truncated cylinder has a different, finite line-of-sight integration range.'),
      eq(`Σ(b)=∫<sub>−∞</sub><sup>∞</sup>ρ(√(b²+z²))dz=${f('πρ<sub>c</sub>a','2')}(1+${f('b²','a²')})<sup>−3/2</sup>`),
      note('パネルは異なる静止平衡を比較する。スライダーは時間ではなく、円柱が収縮する動画ではない。球との違いは<a href="#/advanced/bonnor-ebert">Bonnor–Ebert球</a>、時間発展との違いは<a href="#/advanced/isothermal-collapse">LPH・Shu崩壊</a>へ進むと確かめられる。', 'The panel compares static equilibria. Sliders are not time and do not animate physical contraction. Compare geometry with <a href="#/advanced/bonnor-ebert">Bonnor–Ebert spheres</a> and time evolution with <a href="#/advanced/isothermal-collapse">LPH/Shu collapse</a>.'))
  ].join('');
  bodies['bonnor-ebert'] = () => [
    s(1, '雲の表面にも圧力がある', 'A cloud has pressure at its boundary',
      p('分子雲の中の小さな高密度領域を考える。星と違い、表面で圧力を0にするとは限らない。周囲の気体が外から押すため、外圧P<sub>ext</sub>と等しい圧力で雲を切り取る。球対称、静止、等温、非回転を仮定し、磁場と乱流の支えは含めない。', 'Consider a dense core inside a molecular cloud. Its surface need not have zero pressure: surrounding gas confines it. Truncate the cloud where its pressure equals an external pressure P<sub>ext</sub>. Assume a static, spherical, isothermal, nonrotating gas without magnetic or turbulent support.'),
      eq(`P = c<sub>s</sub>²ρ,　${f('dP','dr')} = −${f('GM(r)ρ','r²')},　${f('dM','dr')} = 4πr²ρ`),
      p('音速c<sub>s</sub>は空間全体で一定の入力とする。温度を一定に保つ熱の出入りは、この模型の外から与える条件である。外圧を上げれば密度の高い雲を作れるが、どれだけの質量でも静止できるとは限らない。', 'Treat the sound speed as a spatially constant input. Heat exchange maintaining that temperature is a closure condition, not solved here. Raising external pressure can produce a denser core, but does not imply that any mass can remain in equilibrium.')),
    s(2, '等温球の無次元方程式を作る', 'Construct the dimensionless isothermal sphere',
      p('中心密度ρ<sub>c</sub>からの低下を、指数関数でρ＝ρ<sub>c</sub>exp(−ψ)と表す。静水圧の式はc<sub>s</sub>²dψ/dr＝GM/r²となる。長さaと無次元半径ξを選び、中心から積分できる二つの一階の式にする。', 'Write the density decrease as ρ = ρ<sub>c</sub>exp(−ψ). Hydrostatic balance becomes c<sub>s</sub>²dψ/dr = GM/r². Choose a length a and dimensionless radius ξ, then express the problem as two first-order equations that can be integrated from the centre.'),
      eq(`a = ${f('c<sub>s</sub>','√(4πGρ<sub>c</sub>)')},　r = aξ,　M = 4πa³ρ<sub>c</sub>m<br>${f('dψ','dξ')} = ${f('m','ξ²')},　${f('dm','dξ')} = ξ²e<sup>−ψ</sup>`),
      eq(`${f('1','ξ²')}${f('d','dξ')}(ξ²${f('dψ','dξ')}) = e<sup>−ψ</sup>`),
      note('有限のポリトロープ指数を使ったLane–Emden章とは、長さの規格化も表面の定義も異なる。等温球の密度は有限の半径では0にならない。ここでは、外圧と一致する場所が表面である。', 'This differs from finite-index polytropes in both length scaling and boundary definition. Isothermal density does not vanish at a finite radius. Here the surface is where pressure matches the confining pressure.')),
    s(3, '中心の特異な見かけを避ける', 'Start regularly at the centre',
      p('対称性からψ(0)＝0、ψ′(0)＝0、m(0)＝0とする。ただしm/ξ²をξ＝0で直接計算すると0/0になる。ψ＝Aξ²+Bξ⁴+…を方程式へ代入して係数を比較すると、積分の開始値が得られる。', 'Symmetry requires ψ(0) = ψ′(0) = m(0) = 0, but directly evaluating m/ξ² gives 0/0. Insert a series ψ = Aξ² + Bξ⁴ + … into the equation and compare coefficients to obtain regular starting values.'),
      eq(`ψ = ${f('ξ²','6')}−${f('ξ⁴','120')}+${f('ξ⁶','1890')}+…<br>m = ${f('ξ³','3')}−${f('ξ⁵','30')}+${f('ξ⁷','315')}+…`),
      p('操作図ではこの級数から始め、四次Runge–Kutta法で積分する。密度や質量を先に観測値へ合わせるのではなく、まず単位のない解の形を求める。刻み幅を半分にして臨界点が動かないことも確認できる。', 'The panel starts with this series and integrates using fourth-order Runge–Kutta. Determine the dimensionless structure before matching physical density or mass. Halving the integration step also lets you check that the critical point is numerically resolved.')),
    s(4, '外圧を固定して質量を比較する', 'Compare masses at fixed external pressure',
      p('表面をξ<sub>b</sub>とすればP<sub>ext</sub>＝c<sub>s</sub>²ρ<sub>c</sub>exp(−ψ<sub>b</sub>)。この関係で中心密度を消すと、質量は物理的な尺度と無次元の関数μの積になる。μは平均分子量ではなく、ここで定義する無次元質量である。', 'At an edge ξ<sub>b</sub>, P<sub>ext</sub> = c<sub>s</sub>²ρ<sub>c</sub>exp(−ψ<sub>b</sub>). Eliminate central density to separate physical mass into a dimensional scale and a function μ. This μ denotes dimensionless mass, not mean molecular weight.'),
      eq(`M = ${f('c<sub>s</sub>⁴','G<sup>3/2</sup>P<sub>ext</sub><sup>1/2</sup>')} μ(ξ<sub>b</sub>),　μ = ${f('m e<sup>−ψ/2</sup>','√(4π)')}<br>R = ${f('c<sub>s</sub>²','√(GP<sub>ext</sub>)')}${f('ξ<sub>b</sub> e<sup>−ψ<sub>b</sub>/2</sup>','√(4π)')}`),
      '<div data-lab="bonnor-ebert"></div>',
      p('ξ<sub>b</sub>を変える操作は、音速と外圧を固定したまま、中心密度と雲の質量を変えた平衡の系列である。同じ雲が時間とともに右へ進むアニメーションではない。', 'Varying ξ<sub>b</sub> compares equilibria at fixed sound speed and external pressure, while central density and mass change. It is not a time animation of a single cloud moving along the curve.')),
    s(5, '極大の先では、等温の支えが足りない', 'The mass maximum marks a stability boundary',
      p('μを微分するとμ′＝exp(−ψ/2)[m′−mψ′/2]/√(4π)。二つの一階の式を代入すれば、極大の候補はm²＝2ξ⁴exp(−ψ)を満たす。中心からたどった最初の極大は次の値になる。', 'Differentiate μ and insert the two first-order equations. A turning point satisfies m² = 2ξ⁴exp(−ψ). The first maximum encountered along the regular central solution gives the following values.'),
      eq(`ξ<sub>crit</sub> ≈ 6.451,　${f('ρ<sub>c</sub>','ρ<sub>b</sub>')} ≈ 14.04<br>M<sub>BE</sub> ≈ 1.182 ${f('c<sub>s</sub>⁴','G<sup>3/2</sup>P<sub>ext</sub><sup>1/2</sup>')}`),
      p('この外圧で囲まれた等温模型では、最初の極大までの系列は球対称の微小な圧縮に対して安定で、先の系列は不安定になる。極大が安定性の境目になること自体は、動的な摂動解析に基づく結果として使う。静水圧の積分だけで全種類の不安定性を証明したわけではない。', 'For this pressure-confined isothermal model, configurations before the first maximum are stable to small radial compression, whereas those beyond it are unstable. Identifying the turning point with radial stability uses a result of dynamical perturbation analysis; hydrostatic integration alone is not a proof about every possible disturbance.'),
      note('実際の雲に磁場、非等温構造、回転、乱流があれば限界は変わる。観測した密度比が14を超えたという一つの情報だけから、崩壊中であると断定しない。<a href="#/advanced/jeans">Jeans章</a>では、境界のない局所模型との違いを比べる。', 'Magnetic fields, temperature gradients, rotation, and turbulence change the threshold. An observed contrast above 14 alone does not establish ongoing collapse. The <a href="#/advanced/jeans">Jeans chapter</a> compares this finite cloud with an unbounded local model.'))
  ].join('');

  bodies.jeans = () => [
    s(1, '圧縮された場所で、二つの応答が競争する', 'Two responses compete in a compression',
      p('ガスの一部が周りより少し密になると、その部分へ重力が働く。一方、圧力の増大は密度差をならす向きに働く。大きさが異なる波を一つずつ調べれば、どの波長で重力が勝つかを計算できる。ここでは回転、磁場、粘性、背景の膨張を含めない。', 'A small overdensity attracts additional gas, while its pressure increase tends to erase the contrast. Examine individual wavelengths to determine where gravity wins. Exclude rotation, magnetic fields, viscosity, and expansion of the background in this model.'),
      eq(`ρ = ρ₀(1+δ),　P = P₀+c<sub>s</sub>²ρ₀δ<br>c<sub>s</sub>² = (${f('∂P','∂ρ')})<sub>background</sub>`),
      p('δは無次元の密度の揺らぎで、|δ|≪1とする。等温か断熱かで圧力応答の音速は異なる。以下ではどちらかに対応する一定のc<sub>s</sub>を、閉じた模型の入力として使う。', 'The density contrast δ is dimensionless and satisfies |δ| ≪ 1. Isothermal and adiabatic responses have different sound speeds. Use the constant c<sub>s</sub> appropriate to the chosen closure rather than silently switching between them.')),
    s(2, '背景の重力をどうしたのか', 'What happened to background gravity?',
      p('無限に広がる一様な密度ρ₀を静止させ、同時に通常のPoisson方程式を満たそうとすると問題がある。背景の圧力勾配は0なのに、∇²Φ₀＝4πGρ₀は0ではない。静止した一様背景と背景重力0は、そのままでは自己無撞着でない。', 'An infinite uniform density at rest creates a background problem: its pressure gradient vanishes, but ordinary Poisson gravity requires ∇²Φ₀ = 4πGρ₀, not zero. A static homogeneous background with zero gravitational field is not self-consistent without an additional prescription.'),
      note('ここでは背景を差し引いた局所模型として、揺らぎのポテンシャルφだけに∇²φ＝4πG(ρ−ρ₀)を課す。この操作がJeans swindleと呼ばれる問題の核心である。宇宙膨張を含む成長方程式には別途Hubble摩擦があり、以下の静止模型と同じ式ではない。', 'Define a background-subtracted local model with ∇²φ = 4πG(ρ−ρ₀). The treatment of background gravity is the issue behind the Jeans swindle. Cosmological perturbations include Hubble damping and are not governed by the same static-background equation.'),
      p('有限の雲の境界条件まで含めて平衡を求めたいときは、<a href="#/advanced/bonnor-ebert">Bonnor–Ebert球</a>のような別の模型が必要になる。ここでは、局所的な波長の競争を取り出す目的を明確にして使う。', 'To solve a finite cloud with its boundary conditions, use a different model such as a <a href="#/advanced/bonnor-ebert">Bonnor–Ebert sphere</a>. The purpose here is the local competition between pressure and gravity at each wavelength.')),
    s(3, '三つの方程式から速度を消す', 'Eliminate velocity from three equations',
      p('揺らぎの速度をuとする。連続の式と運動方程式で、δuのような二次の項を捨てる。連続の式を時間で微分し、運動方程式の発散を代入すると、δだけの方程式を作れる。', 'Let u denote perturbation velocity. Linearize continuity and momentum, discarding quadratic terms such as δu. Differentiate continuity in time and substitute the divergence of momentum to obtain an equation for density contrast alone.'),
      eq(`${f('∂δ','∂t')}+∇·u = 0<br>${f('∂u','∂t')} = −c<sub>s</sub>²∇δ−∇φ,　∇²φ = 4πGρ₀δ`),
      eq(`${f('∂²δ','∂t²')} = c<sub>s</sub>²∇²δ+4πGρ₀δ`),
      p('密度の山では重力の項が同じ符号で山を高くする。一方、波の山に対する二階の空間微分は負になり、音速を掛けた項は押し戻す。微分の符号を実際に確かめれば、両者の役割を暗記せずに読める。', 'The gravitational term reinforces a density peak. The spatial second derivative of a wave is negative at that peak, so the sound-speed term restores it. Checking these derivative signs explains the competition without memorizing the final criterion.')),
    s(4, '微分を波数と周波数に置き換える', 'Replace derivatives with wavenumber and frequency',
      p('平面波δ＝δ₁exp[i(k·r−ωt)]を代入する。時間で二度微分すると−ω²、空間では−k²が掛かる。ω²>0は振動、ω²<0はω＝iσの増幅と減衰の二つの解を持つ。', 'Insert a plane wave δ = δ₁exp[i(k·r−ωt)]. The second time derivative supplies −ω² and the Laplacian supplies −k². Positive ω² gives oscillations; negative ω² allows growing and decaying solutions with ω = iσ.'),
      eq(`ω² = c<sub>s</sub>²k²−4πGρ₀<br>k<sub>J</sub> = ${f('√(4πGρ₀)','c<sub>s</sub>')},　λ<sub>J</sub> = ${f('2π','k<sub>J</sub>')} = c<sub>s</sub>√(${f('π','Gρ₀')})`),
      p('λ>λ<sub>J</sub>なら増幅する。逆に短波長では圧力項がk²に比例して強くなる。k＝0そのものは平均密度を変えるため、この背景を差し引いた模型の摂動には含めない。図のk→0は長波長への形式的な極限である。', 'Wavelengths longer than λ<sub>J</sub> are unstable. At short wavelengths the pressure term increases as k². The exact k = 0 mode changes the mean density and is excluded from the background-subtracted perturbations; the plotted long-wave endpoint is a formal limit.'),
      '<div data-lab="jeans"></div>'),
    s(5, '長さ、質量、時間を別々に定義する', 'Define length, mass, and time separately',
      eq(`M<sub>J</sub> ≡ ${f('4π','3')}ρ₀(${f('λ<sub>J</sub>','2')})³ = ${f('π<sup>5/2</sup>','6')}${f('c<sub>s</sub>³','G<sup>3/2</sup>ρ₀<sup>1/2</sup>')}<br>t<sub>J</sub> ≡ ${f('1','√(4πGρ₀)')},　σt<sub>J</sub> = √[1−(k/k<sub>J</sub>)²]`),
      p('Jeans質量の数値係数は、どの形・どの長さの領域を質量に換算するかで変わる。ここでは波長の半分を球の半径に選んだ。一方、重力が圧力に勝つ波長の条件は先ほどの分散関係から直接決まっている。', 'The numerical coefficient in a Jeans mass depends on the geometry and length used to convert a wavelength into mass. Here the sphere’s radius is half a wavelength. The wavelength criterion itself follows directly from the dispersion relation.'),
      p('実際にδが1程度になると、捨てた二次の項が重要になる。線形成長率から崩壊後の星の数や質量まで予測することはできない。回転する薄い円盤なら、<a href="#/advanced/toomre-q">Toomre Q</a>のように回転による応答も加える。', 'When δ approaches order unity, the omitted nonlinear terms matter. A linear growth rate does not predict the number or masses of the eventual stars. For a rotating thin disk, include the rotational response as in <a href="#/advanced/toomre-q">Toomre Q</a>.'))
  ].join('');
  bodies.bondi = () => [
    s(1, '角運動量のない流れを取り出す', 'Isolate a flow without angular momentum',
      p('中心質量Mの天体を、遠方ではほぼ静止したガスが囲む。密度ρ∞と音速c<sub>s</sub>を外側の条件として与える。定常・球対称、ガス自身の重力は無視し、角運動量と磁場も含めない。まず等温P＝c<sub>s</sub>²ρの模型を解く。', 'Let a mass M be surrounded by gas nearly at rest far away, with specified density ρ∞ and sound speed c<sub>s</sub>. Assume steady spherical flow, neglect the gas’s self-gravity, angular momentum, and magnetic fields, and first use the isothermal closure P = c<sub>s</sub>²ρ.'),
      p('内向きの速さをu>0と書く。半径が小さくなっても、単位時間に球面を通過する質量は同じである。速度が増すことと密度が増すことを、流路の面積4πr²と合わせて数える。', 'Write the inward speed as u > 0. The mass passing through each sphere per unit time is constant. The changing area 4πr² links the increase of speed to the increase of density.'),
      eq(`Ṁ = 4πr²ρu,　${f('d lnρ','dr')} = −${f('2','r')}−${f('1','u')}${f('du','dr')}`)),
    s(2, '圧力勾配を消して流れの方程式へ', 'Eliminate the density gradient',
      p('圧力は内へ落ちるガスを押し返す。運動方程式にP＝c<sub>s</sub>²ρを入れ、質量保存でd lnρ/drを消す。速さuは正に定義したが、uの半径微分は内へ加速する流れで負になる。', 'Pressure opposes infall. Insert the isothermal relation into momentum balance and use mass conservation to eliminate d lnρ/dr. Although u is positive, its radial derivative is negative for an inflow accelerating toward smaller radius.'),
      eq(`u${f('du','dr')} = −c<sub>s</sub>²${f('d lnρ','dr')}−${f('GM','r²')}<br>(u−${f('c<sub>s</sub>²','u')})${f('du','dr')} = ${f('2c<sub>s</sub>²','r')}−${f('GM','r²')}`),
      p('u＝c<sub>s</sub>では左辺の係数が0になる。傾きが有限で滑らかに音速を通るなら、右辺も同時に0でなければならない。こうして音速点が選ばれる。単に分母を0にして計算を止める場所ではない。', 'At u = c<sub>s</sub>, the coefficient on the left vanishes. A smooth solution with finite slope requires the right-hand side to vanish there too. This regularity selects the sonic point rather than merely identifying a division-by-zero failure.'),
      eq(`r<sub>s</sub> = ${f('GM','2c<sub>s</sub>²')},　r<sub>B</sub> ≡ ${f('GM','c<sub>s</sub>²')} = 2r<sub>s</sub>`),
      note('Bondi半径には2を含める別の慣習もある。本章はr<sub>B</sub>＝GM/c<sub>s</sub>²と定義する。半径の規約と降着率の無次元係数を、別々の資料から無条件に混ぜない。', 'Some authors include a factor of two in the Bondi radius. Here r<sub>B</sub> = GM/c<sub>s</sub>². Do not mix a radius convention from one source with a dimensionless rate coefficient from another.')),
    s(3, '積分して、臨界解の枝を選ぶ', 'Integrate and select the critical branch',
      p('x＝r/r<sub>s</sub>、マッハ数𝓜＝u/c<sub>s</sub>を使う。流れの方程式を積分し、x＝1で𝓜＝1となるように積分定数を決める。', 'Use x = r/r<sub>s</sub> and Mach number 𝓜 = u/c<sub>s</sub>. Integrate the flow equation and choose the constant so that x = 1 and 𝓜 = 1 coincide.'),
      eq(`(𝓜−${f('1','𝓜')})${f('d𝓜','dx')} = ${f('2','x')}−${f('2','x²')}<br>𝓜²−ln(𝓜²) = 4ln x+${f('4','x')}−3`),
      p('x>1では亜音速、x<1では超音速の枝をつなぐのが、外側で静かなガスからのBondi降着である。音速点で展開するとd𝓜/dx＝−1。反対の＋1の枝は、<a href="#/advanced/parker-wind">Parker風</a>で使う。', 'Bondi inflow from a quiet reservoir joins the subsonic branch at x > 1 to the supersonic branch at x < 1. Expansion at the sonic point gives d𝓜/dx = −1. The opposite slope, +1, belongs to the <a href="#/advanced/parker-wind">Parker wind</a> branch.'),
      '<div data-lab="bondi"></div>',
      p('パネルは音速点をまたいで微分方程式を直接割り算する代わりに、この積分式を二分法で解く。ln(𝓜²)を未知数にすれば、小さい速さでも正のマッハ数が得られる。曲線の各点を元の積分式へ戻して検算できる。', 'Instead of dividing the ODE across its critical point, the panel bisects the integrated relation. Solving for ln(𝓜²) preserves positive Mach numbers even at small speeds. Substituting each plotted point back into the relation provides a direct residual check.')),
    s(4, '音速点の密度から降着率を求める', 'Obtain the accretion rate from sonic density',
      p('運動方程式をもう一つの形で積分すると、等温流のBernoulli関係が得られる。遠方でu→0、ρ→ρ∞を使い、音速点r<sub>s</sub>へ代入する。', 'Integrating momentum in another form gives an isothermal Bernoulli relation. Set its constant using u → 0 and ρ → ρ∞ at infinity, then evaluate at the sonic point.'),
      eq(`${f('u²','2')}+c<sub>s</sub>²ln(${f('ρ','ρ∞')})−${f('GM','r')} = 0<br>${f('ρ<sub>s</sub>','ρ∞')} = e<sup>3/2</sup>`),
      eq(`Ṁ<sub>B</sub> = 4πr<sub>s</sub>²ρ<sub>s</sub>c<sub>s</sub> = 4πλ${f('(GM)²ρ∞','c<sub>s</sub>³')},　λ = ${f('e<sup>3/2</sup>','4')} ≈ 1.1204`),
      p('r<sub>B</sub>²ρ∞c<sub>s</sub>という次元の見積もりだけでは、係数λは決まらない。外側の条件、圧力、音速点をつなぐ臨界解が係数を選んだ。密度を2倍にすれば流速の形は変わらず、質量流量が2倍になる。', 'The dimensional estimate r<sub>B</sub>²ρ∞c<sub>s</sub> does not determine λ. Its value comes from connecting the outer reservoir through pressure support and sonic regularity. Doubling the density normalization leaves the velocity profile unchanged and doubles the mass flux.')),
    s(5, '断熱の模型では何が変わるか', 'What changes for a polytropic flow?',
      p('等温ではなくP＝Kρ<sup>γ</sup>、一定Kとすれば、局所音速a²＝γP/ρが半径で変わる。遠方の音速a∞に対して、質量保存・音速点・Bernoulli関係を組み合わせた標準結果は次の形になる。', 'For P = Kρ<sup>γ</sup> with constant K, the local sound speed a² = γP/ρ varies with radius. Combining mass conservation, sonic regularity, and Bernoulli balance yields the following standard relations in terms of the outer sound speed a∞.'),
      eq(`r<sub>s</sub> = ${f('(5−3γ)GM','4a∞²')},　a<sub>s</sub>² = ${f('2a∞²','5−3γ')}<br>λ(γ) = ${f('1','4')}[${f('2','5−3γ')}]<sup>(5−3γ)/[2(γ−1)]</sup>　(1&lt;γ&lt;5/3)`),
      p('γ→1で等温の係数へ、γ→5/3でλ→1/4へ近づく。ただし後者ではニュートン模型の音速点がr＝0へ寄り、有限半径の正則点として扱う式をそのまま代入できない。パネルは等温解だけを表示している。', 'The limit γ → 1 recovers the isothermal coefficient; γ → 5/3 gives λ → 1/4. In the latter limit the Newtonian sonic point moves to r = 0, so a formula for a finite regular critical point cannot simply be evaluated there. The panel displays only the isothermal solution.'),
      note('実際の降着では角運動量、磁場、冷却、放射の押し返しや天体の運動が重要になりうる。Bondi率を、そのままブラックホールへ届く質量や観測される光度と同一視しない。', 'Angular momentum, fields, cooling, radiative feedback, and motion through the gas can alter real accretion. A Bondi rate is not automatically the mass reaching a black hole or the luminosity seen by an observer.'))
  ].join('');

  bodies['parker-wind'] = () => [
    s(1, '熱い大気を静止させ続けられるか', 'Can a hot atmosphere remain static?',
      p('太陽のコロナのような熱い大気では、圧力勾配が外向きにガスを押す。まず中心質量Mのニュートン重力、等温、球対称、定常という最小の模型を考える。磁場、回転、電子とイオンの温度差はまだ含めない。', 'In a hot atmosphere such as the solar corona, a pressure gradient pushes gas outward. Begin with Newtonian gravity from a mass M and an isothermal, spherical, steady gas. Magnetic fields, rotation, and electron–ion temperature differences are not yet included.'),
      eq(`c<sub>s</sub>² = ${f('k<sub>B</sub>T','μm<sub>p</sub>')}`),
      p('μは粒子1個あたりの平均質量を陽子質量で割った値である。例ではμ＝0.6を指定する。音速は等温音速なので、断熱音速に現れる比熱比γをこの式に追加してはいけない。', 'Here μ is the mean mass per particle in proton-mass units; the example specifies μ = 0.6. This is the isothermal sound speed, so do not insert the heat-capacity ratio used in an adiabatic sound speed.')),
    s(2, '風にも質量保存と運動方程式を使う', 'Apply mass and momentum conservation to a wind',
      p('今回はu>0を外向き速度として使う。定常流の質量放出率は4πr²ρuで一定。密度勾配を消すと、Bondi章とまったく同じ速さの微分方程式になる。違いは解の枝と境界条件である。', 'Now define u > 0 as the outward velocity. A steady wind has constant mass-loss rate 4πr²ρu. Eliminating the density gradient yields the same speed equation as in the Bondi chapter; the branch and boundary conditions distinguish the physical flows.'),
      eq(`Ṁ<sub>wind</sub> = 4πr²ρu<br>(u−${f('c<sub>s</sub>²','u')})${f('du','dr')} = ${f('2c<sub>s</sub>²','r')}−${f('GM','r²')}`),
      p('右辺はr<sub>s</sub>より内で負、外で正である。亜音速側では左辺のu−c<sub>s</sub>²/uも負なので、内側でもdu/drは正になれる。重力が内向きであることと、流れが外向きに加速することは矛盾しない。圧力勾配を含む全体の収支を見る。', 'The right-hand side is negative inside r<sub>s</sub> and positive outside. On the subsonic branch the left-hand coefficient is also negative, so du/dr can be positive even inside the critical radius. Inward gravity does not forbid outward acceleration: include the pressure gradient in the force budget.')),
    s(3, '音速を滑らかに通る加速の枝', 'The smooth accelerating sonic branch',
      eq(`r<sub>s</sub> = ${f('GM','2c<sub>s</sub>²')},　x = ${f('r','r<sub>s</sub>')},　𝓜 = ${f('u','c<sub>s</sub>')}<br>𝓜²−ln(𝓜²) = 4ln x+${f('4','x')}−3`),
      p('x<1で亜音速、x>1で超音速の解をつなぐ。音速点で分子と分母を同時に展開すればd𝓜/dx＝＋1となる。Bondiの内向きの速さでは−1だった。同じ曲線族でも、半径に沿って選ぶ枝を間違えると物理が反対になる。', 'Connect a subsonic branch at x < 1 to a supersonic branch at x > 1. Expanding numerator and denominator together at the sonic point gives d𝓜/dx = +1, compared with −1 for Bondi’s inward speed. Choosing the wrong branch reverses the physical interpretation.'),
      '<div data-lab="parker-wind"></div>',
      p('図では二つの臨界曲線を比較する。各点は積分式を二分法で解いており、音速点での0/0を数値的な発散と取り違えない方法を使っている。', 'The plot compares the two critical curves. Each point is obtained by bisection of the integrated relation, avoiding a numerical division by zero at the sonic point.')),
    s(4, 'なぜ静水圧の解だけでは足りないのか', 'Why hydrostatic balance can be insufficient',
      p('u＝0と置いた等温の静水圧平衡も積分できる。底の半径r₀と密度ρ₀を使うと、密度の変化は次の形になる。', 'The static isothermal equation can also be integrated. Given a base radius r₀ and density ρ₀, its density profile is:'),
      eq(`${f('ρ(r)','ρ₀')} = exp[${f('GM','c<sub>s</sub>²')}(${f('1','r')}−${f('1','r₀')})]`),
      p('r→∞でも密度は0にならず、有限の値へ近づく。十分に低圧な外側へ接続する場合には、この静止した大気の境界条件が合わなくなる。外側に圧力を与えれば亜音速のbreeze解もありうるので、「方程式を書けば必ずこの風だけ」とは言わない。', 'Density tends to a finite nonzero value at infinity. Such a static atmosphere cannot match a sufficiently low-pressure exterior. A confined outer boundary can permit a subsonic breeze, so writing the differential equation alone does not uniquely demand the transonic wind.'),
      note('臨界点の条件は解を選ぶ重要な条件だが、加熱の仕方、底の状態、外側への接続も必要である。安定な流れが時間発展で選ばれる議論は、ここで解く定常問題より広い。', 'Critical regularity is important, but heating, base conditions, and the outer connection also matter. Dynamical selection of a stable flow is a larger problem than the steady equations solved here.')),
    s(5, '太陽の尺度と、等温という仮定の代価', 'Solar scales and the cost of isothermality',
      p('M＝太陽質量、T＝10<sup>6</sup> K、μ＝0.6ならc<sub>s</sub>≈117 km/s、r<sub>s</sub>≈6.9太陽半径となる。温度が高いほど重力に対して圧力が効き、音速点が内へ移る。', 'For one solar mass, T = 10<sup>6</sup> K, and μ = 0.6, the isothermal sound speed is about 117 km/s and the sonic point about 6.9 solar radii. Raising temperature moves the sonic point inward as pressure becomes stronger relative to gravity.'),
      p('速度の形を求めても、密度の規格化は残る。底の密度などを与えなければ質量放出率は決まらない。また膨張するガスを等温に保つには加熱が必要で、この模型はエネルギー方程式を解いていない。大きなrで𝓜²≈4 ln xとなり、有限の終端速度すら予測しない。', 'A velocity profile still leaves density normalization unspecified, so a base density or equivalent boundary condition is needed for mass loss. Expansion requires heating to remain isothermal; this model does not solve an energy equation. At large radius 𝓜² ≈ 4 ln x, so it does not even predict a finite terminal speed.'),
      p('実際の太陽風は磁化され、加熱・熱伝導・衝突の少なさも重要である。Parker風は音速点を持つ流出の基本模型として使う。円盤の回転から角運動量を持ち出す磁気円盤風とは区別する。', 'Real solar wind is magnetized, with heating, conduction, and weak collisionality also important. Use Parker flow as a basic transonic outflow model, distinct from a magnetized disk wind extracting rotational angular momentum.'))
  ].join('');
  bodies.stromgren = () => [
    s(1, '星の光を、エネルギーではなく個数で数える', 'Count ionizing photons, not just luminosity',
      p('高温の星の周囲に、電離した水素の領域H II領域ができる。水素の電離には13.6 eV以上の光子が必要で、Lyαの10.2 eVとは異なる。必要なのは星の全光度だけでなく、このしきい値以上の光子を毎秒何個放つかである。', 'Hot stars create regions of ionized hydrogen, called H II regions. Ionizing hydrogen requires a photon of at least 13.6 eV, unlike the 10.2 eV Lyα transition. The relevant input is the rate of photons above this threshold, rather than total stellar luminosity alone.'),
      eq(`S ≡ ∫<sub>ν₀</sub><sup>∞</sup>${f('L<sub>ν</sub>','hν')}dν,　hν₀ = 13.6 eV`),
      p('Sの単位はs<sup>−1</sup>。光度を光子1個のエネルギーで割って個数へ直す。以下は純水素、一様な原子核密度n<sub>H</sub>、一定のS、ダストなしを仮定し、電離した内部はほぼ完全電離として扱う。', 'S has units s<sup>−1</sup>: divide spectral luminosity by photon energy before integrating. Assume pure hydrogen of uniform nucleus density n<sub>H</sub>, a constant source S, no dust, and a nearly fully ionized interior.')),
    s(2, '再結合で失う電離を数える', 'Count the recombinations that remove ions',
      p('自由電子と陽子が出会って再結合する率はαn<sub>e</sub>n<sub>p</sub>。再結合で直接基底状態へ落ちると、別の水素を電離できる光子が出る。これが近くで再吸収されるon-the-spot近似では、その過程は星からの新しい光子を消費する正味の再結合として数えない。', 'Recombination occurs at rate αn<sub>e</sub>n<sub>p</sub>. Direct recombination to the ground state emits another ionizing photon. In the on-the-spot approximation, that photon is absorbed nearby, so this event does not require a new stellar photon in the net ionization budget.'),
      eq(`α<sub>B</sub>(10⁴ K) ≈ 2.6 × 10<sup>−13</sup> cm³ s<sup>−1</sup><br>${f('dN<sub>rec</sub>','dt dV')} = α<sub>B</sub>n<sub>e</sub>n<sub>p</sub> ≈ α<sub>B</sub>n<sub>H</sub>²`),
      p('α<sub>B</sub>は励起状態への再結合を集計したCase Bの係数で、ここでは温度とともに与える入力である。電離光子が外へ逃げるほど薄い雲や、ダストが多く吸収する領域には、このままの光子収支を使えない。', 'The Case B coefficient α<sub>B</sub> counts recombinations to excited states and is supplied at the assumed temperature. The same photon budget does not apply unchanged to a cloud that leaks ionizing photons or absorbs many of them in dust.')),
    s(3, '供給と消費の釣り合いが球の大きさを決める', 'Balance supply and consumption to find the radius',
      p('電離領域の体積をV＝4πR³/3とする。平衡では供給Sが内部全体の正味の再結合率に等しい。密度を一定として積分すれば、半径を三乗から解くだけでよい。', 'Let the ionized volume be V = 4πR³/3. In equilibrium, the supplied photon rate equals the integrated net recombination rate. At constant density, solving this volume balance gives the radius directly.'),
      eq(`S = ${f('4π','3')}R<sub>S</sub>³α<sub>B</sub>n<sub>H</sub>²<br>R<sub>S</sub> = [${f('3S','4πα<sub>B</sub>n<sub>H</sub>²')}]<sup>1/3</sup>`),
      p('S＝10<sup>49</sup> s<sup>−1</sup>、n<sub>H</sub>＝100 cm<sup>−3</sup>、上のα<sub>B</sub>なら約3.15 pc。密度が2倍になると、同じ体積での再結合は4倍になり、半径は2<sup>−2/3</sup>倍へ縮む。', 'For S = 10<sup>49</sup> s<sup>−1</sup>, n<sub>H</sub> = 100 cm<sup>−3</sup>, and the stated coefficient, R<sub>S</sub> is about 3.15 pc. Doubling density quadruples recombinations per unit volume and reduces the radius by 2<sup>−2/3</sup>.')),
    s(4, '余った光子で新しい原子を電離する', 'Excess photons ionize newly reached gas',
      p('最初は中性のガスとする。領域が広がる間、光子の一部は既存の領域の再結合を補い、残りが新しく加わるn<sub>H</sub>dV/dt個の原子を電離する。気体そのものは動かず、境界だけが進む模型である。', 'Start with neutral gas. During growth, some photons replace recombinations in the existing ionized volume, while the remainder ionizes n<sub>H</sub>dV/dt newly reached atoms. The gas stays fixed; only the ionization boundary advances.'),
      eq(`n<sub>H</sub>${f('dV','dt')} = S−α<sub>B</sub>n<sub>H</sub>²V<br>${f('dV','dt')}+${f('V','t<sub>rec</sub>')} = ${f('S','n<sub>H</sub>')},　t<sub>rec</sub> = ${f('1','α<sub>B</sub>n<sub>H</sub>')}`),
      p('V＝V<sub>S</sub>＋Wと置くとW′＝−W/t<sub>rec</sub>なので、Wは指数関数で減る。V(0)＝0という初期条件を使い、最後に体積の三乗根を取る。', 'Set V = V<sub>S</sub> + W. Then W′ = −W/t<sub>rec</sub>, so W decays exponentially. Apply V(0) = 0 and take the cube root only after obtaining the volume.'),
      eq(`V(t) = V<sub>S</sub>[1−e<sup>−t/t<sub>rec</sub></sup>]<br>R(t) = R<sub>S</sub>[1−e<sup>−t/t<sub>rec</sub></sup>]<sup>1/3</sup>`),
      '<div data-lab="stromgren"></div>'),
    s(5, '平衡半径と、実際に膨張するH II領域', 'An ionization radius versus an expanding H II region',
      p('上の例ではt<sub>rec</sub>≈1.22×10³年。t＝t<sub>rec</sub>では体積は平衡の約63%、半径は約86%となる。半径が時間に比例して進むわけではない。図の円は電離状態の境界であり、すべてのガスがその速さで移動していることを表さない。', 'In the example, t<sub>rec</sub> is about 1.22 × 10³ yr. At one recombination time, volume is about 63% and radius about 86% of equilibrium. Radius does not advance linearly with time. The circle marks an ionization boundary, not the velocity of all the gas.'),
      note('この非相対論的な光子勘定をt→0へ延長すると、形式上は前線速度が無限大になる。光の伝播時間を無視したためで、R/c程度以下の早い段階や光速に近い前線には適用しない。さらに後では加熱された気体が圧力で膨張し、衝撃波を伴うこともある。そこでは流体の運動も解く必要がある。', 'Extrapolating this instantaneous, nonrelativistic photon budget to t → 0 formally produces infinite front speed. Do not apply it before light-travel times of order R/c or to relativistic fronts. Later, heated gas can expand under pressure and drive shocks; that phase requires gas dynamics.'),
      p('密度のむらでは平均n<sub>H</sub>の二乗でなく、平均したn<sub>e</sub>n<sub>p</sub>が再結合を決める。観測した大きさだけから星の年齢や光子供給を一意に決めず、漏れ、ダスト、密度構造、膨張の段階を確かめる。', 'In a clumpy medium, recombinations depend on the average of n<sub>e</sub>n<sub>p</sub>, not simply the square of mean density. A measured radius alone does not uniquely determine stellar age or photon output without checking leakage, dust, density structure, and dynamical stage.'))
  ].join('');

  bodies['alpha-disk'] = () => [
    s(1, '原因の代わりに、輸送の強さを指定する', 'Specify transport strength without choosing its cause',
      p('<a href="#/advanced/angular-momentum">角運動量輸送の章</a>では、内向きの降着に外向きの角運動量流束が伴うことを学んだ。その応力を計算する代わりに、有効な動粘性係数νを指定するのが粘性型の円盤模型である。分子衝突の粘性だけを指すわけではない。', 'The <a href="#/advanced/angular-momentum">transport chapter</a> related inward accretion to outward angular-momentum flux. A viscous-type disk prescribes an effective kinematic viscosity ν instead of deriving its stresses microscopically; ν need not represent molecular collisions.'),
      eq(`ν ≡ αc<sub>s</sub>H,　[ν] = m² s<sup>−1</sup>`),
      p('本章はこの式でαを定義する。速度の尺度c<sub>s</sub>と長さHの積を使う次元の模型であって、αの値を導いた式ではない。MRI、自己重力、風など、どの機構が重要かは別に調べる。', 'This equation defines our alpha convention. It is a dimensional closure using a velocity c<sub>s</sub> and length H, not a derivation of alpha’s value. MRI, self-gravity, winds, or other mechanisms must be assessed separately.')),
    s(2, '鉛直方向のつり合いから厚みを出す', 'Derive thickness from vertical balance',
      p('中心質量Mが支配する薄い円盤を考える。|z|≪rなら鉛直重力は−Ω<sub>K</sub>²z、Ω<sub>K</sub>²＝GM/r³。鉛直方向に等温のP＝ρc<sub>s</sub>²を入れると、密度はGaussianになる。', 'For a thin disk dominated by a central mass M, vertical gravity is −Ω<sub>K</sub>²z at |z| ≪ r, with Ω<sub>K</sub>² = GM/r³. A vertically isothermal closure P = ρc<sub>s</sub>² gives a Gaussian density profile.'),
      eq(`c<sub>s</sub>²${f('d lnρ','dz')} = −Ω<sub>K</sub>²z<br>ρ(z) = ρ(0)exp(−${f('z²','2H²')}),　H = ${f('c<sub>s</sub>','Ω<sub>K</sub>')}`),
      p('HはGaussianの尺度であり、突然ガスがなくなる表面ではない。これを代入すればν＝αH²Ω<sub>K</sub>。H/rが小さいほど、半径方向に物質を移す粘性時間は公転の時間より長くなる。', 'H is a Gaussian scale height, not a sharp edge. Substitution gives ν = αH²Ω<sub>K</sub>. A small aspect ratio H/r makes radial viscous evolution slow compared with orbital motion.'),
      eq(`t<sub>ν</sub> ∼ ${f('r²','ν')} = ${f('1','α') }(${f('r','H')})²Ω<sub>K</sub><sup>−1</sup>`)),
    s(3, '応力の符号とαの規約をそろえる', 'Keep the stress sign and alpha convention explicit',
      p('Wを鉛直積分した外向き正の輸送応力と定義する。ケプラー回転はdΩ/dr<0なので、正のνに対しW＝−νΣr dΩ/drは正になる。Σは面密度で、体積密度ρと単位が異なる。', 'Define W as vertically integrated stress transporting angular momentum outward, with positive sign for outward transport. Keplerian shear has dΩ/dr < 0, so W = −νΣr dΩ/dr is positive for positive ν. Surface density Σ has different units from volume density ρ.'),
      eq(`W = −νΣr${f('dΩ','dr')} = ${f('3','2')}νΣΩ,　𝒢 = 2πr²W = 3πνΣj`),
      note('ν＝αc<sub>s</sub>Hの規約ではW＝(3/2)αΣc<sub>s</sub>²。一方で応力そのものをαΣc<sub>s</sub>²と定義する文献もあり、そのαとは3/2の係数が違う。同じα記号だから同じ数値だと思わない。', 'Our viscosity convention gives W = (3/2)αΣc<sub>s</sub>². A convention defining stress directly as αΣc<sub>s</sub>² has a different alpha by a factor of 3/2. The same symbol does not guarantee the same numerical normalization.')),
    s(4, '定常の降着率へつなぐ', 'Connect the torque to a steady accretion rate',
      p('風や質量源なしの定常状態で、内縁r<sub>in</sub>のトルクを0とする。前章の𝒢＝Ṁ(j−j<sub>in</sub>)と組み合わせ、j＝√(GMr)を代入すれば、νΣと降着率の関係を得る。', 'Assume steady flow with no wind or mass sources and zero torque at an inner radius r<sub>in</sub>. Combine 𝒢 = Ṁ(j−j<sub>in</sub>) with j = √(GMr) to obtain the relation between viscosity, surface density, and accretion.'),
      eq(`νΣ = ${f('Ṁ','3π')}[1−√(${f('r<sub>in</sub>','r')})]<br>r ≫ r<sub>in</sub> :　Ṁ ≈ 3πνΣ,　v<sub>r</sub> ≈ −${f('3ν','2r')}`),
      '<div data-lab="alpha-disk"></div>',
      p('パネルは太陽質量の中心天体とΣ＝100 g cm<sup>−2</sup>を仮定し、H/r、α、半径を入力する。放射平衡から温度やΣを解いてはいない。αだけを動かす比較と、円盤の全体構造が変わる比較を混同しない。', 'The panel assumes a one-solar-mass central object and Σ = 100 g cm<sup>−2</sup>, with aspect ratio, alpha, and radius as inputs. It does not solve a radiative equilibrium for temperature or surface density. Changing alpha alone is different from recomputing an entire disk structure.')),
    s(5, '解放エネルギーはどこで放射されるか', 'Where is the released energy radiated?',
      p('単位面積の加熱は応力とずれの積に結びつく。上下両面から局所的に放射する薄い円盤では、一面あたりの流束Fは以下になる。ここでは熱の移流や風によるエネルギー損失を省く。', 'Dissipation combines stress with shear. If a thin disk radiates the dissipated energy locally from its two faces, the flux from one face is given below. Advected heat and energy carried off by a wind are neglected.'),
      eq(`2F = νΣ(r${f('dΩ','dr')})² = ${f('9','4')}νΣΩ²<br>F(r) = ${f('3GMṀ','8πr³')}[1−√(${f('r<sub>in</sub>','r')})]`),
      eq(`L = ∫<sub>r<sub>in</sub></sub><sup>∞</sup>4πrF(r)dr = ${f('GMṀ','2r<sub>in</sub>')}`),
      p('積分の4πr drは上下両面の面積である。F＝σ<sub>SB</sub>T<sub>eff</sub>⁴で定義した有効温度と、Hを決める内部の温度は同じとは限らない。中心天体の表面や境界層でさらに放出される光も、この円盤だけのLには含まれない。', 'The area 4πr dr includes both faces. The effective temperature defined by F = σ<sub>SB</sub>T<sub>eff</sub>⁴ need not equal the internal temperature setting H. Additional emission from a stellar surface or boundary layer is not included in this disk luminosity.')),
    s(6, 'αで表せないことも残る', 'What alpha does not determine',
      p('αモデルは輸送を閉じる有用な出発点だが、原因の理論の代わりではない。磁場に結びつかないガスでは理想MHDのMRIをそのまま使えず、鉛直の円盤風が主要な輸送なら、半径方向の粘性だけの模型も十分ではない。', 'Alpha provides a useful closure, but does not replace a theory of the transport mechanism. Ideal-MHD MRI cannot simply be imposed when gas is poorly coupled to fields; a disk dominated by vertical wind torques is not fully described by radial viscosity alone.'),
      p('<a href="#/advanced/mri">MRI</a>は差動回転からの線形成長を、<a href="#/advanced/toomre-q">Toomre Q</a>は自己重力による線形不安定性を調べる。どちらも、それだけで飽和したαを一意に与えるわけではない。', '<a href="#/advanced/mri">MRI</a> examines linear extraction of differential-rotation energy; <a href="#/advanced/toomre-q">Toomre Q</a> examines linear gravitational instability. Neither by itself uniquely specifies a saturated alpha.'))
  ].join('');
  bodies.mri = () => [
    s(1, '回転が速い内側と、遅い外側をつなぐ', 'Connect a faster inner orbit to a slower outer orbit',
      p('中心天体のまわりのケプラー円盤では、外側ほど角速度Ωは小さいが、比角運動量j＝r²Ωは大きい。流体だけの軸対称な半径方向の入れ替えには安定でも、磁場が離れたガスを結ぶと事情が変わる。これが磁気回転不安定性MRIの入口である。', 'A Keplerian disk has angular velocity decreasing outward, but specific angular momentum j = r²Ω increasing outward. Even when hydrodynamic axisymmetric radial exchanges are stable, magnetic coupling changes the problem. This is the starting point of magnetorotational instability, MRI.'),
      eq(`q ≡ −${f('d lnΩ','d ln r')},　κ² = 4Ω²+${f('dΩ²','d ln r')} = 2(2−q)Ω²`),
      p('q＝3/2がケプラー回転。κは小さく半径をずらした粒子の振動を表すエピサイクル周波数である。ここでは0≤q<2を扱い、流体だけのRayleigh不安定性がある場合と分ける。', 'Keplerian rotation has q = 3/2. The epicyclic frequency κ describes the oscillation of a slightly radially displaced orbit. Restrict the model to 0 ≤ q < 2, separating MRI from hydrodynamic Rayleigh instability.')),
    s(2, '弱いばねのような磁気張力', 'Magnetic tension acts like a weak spring',
      p('二つのガス要素が磁力線で結ばれているとする。内側が先行して線を引き延ばすと、張力は内側を減速し、外側を加速する。内側は角運動量を失ってさらに内へ、外側は受け取ってさらに外へ動ける。ずれが増す正のフィードバックが生じる。', 'Imagine two fluid elements connected by a field line. The faster inner element stretches the connection, so tension slows the inner element and accelerates the outer one. Losing angular momentum lets the inner element move inward, while the outer element moves outward. The separation can reinforce itself.'),
      p('定量化する模型は、局所的な回転座標、理想MHD、非圧縮、鉛直に一様な磁場B、鉛直波数kの軸対称摂動である。Alfvén速度v<sub>A</sub>と張力の振動数の二乗Kを定義する。', 'Quantify this using a local rotating frame, ideal MHD, incompressibility, a uniform vertical field B, and axisymmetric disturbances with vertical wavenumber k. Define the Alfvén speed and a tension frequency squared K.'),
      eq(`v<sub>A</sub> = ${f('B','√(μ₀ρ)')},　K = k²v<sub>A</sub>²`),
      note('式はSI単位。Kはばね定数そのものではなく、単位質量あたりの復元係数に対応し、単位はs<sup>−2</sup>である。弱い磁場でもkが大きいと張力の効果は大きくなる。', 'These are SI expressions. K is not a spring constant in force per length; it is a restoring coefficient per unit mass with units s<sup>−2</sup>. Even a weak field can provide appreciable tension at a sufficiently large wavenumber.')),
    s(3, '二つの変位の連立方程式', 'Coupled displacement equations',
      p('半径方向の変位をξ<sub>x</sub>、回転方向をξ<sub>y</sub>とする。線形化した運動方程式は、Coriolis力、差動回転の潮汐項、磁気張力を含む。これらの局所方程式を理想MHDからの入力として使い、その先の固有値は自分で求める。', 'Let ξ<sub>x</sub> be radial displacement and ξ<sub>y</sub> azimuthal displacement. The linear local equations contain Coriolis forces, the differential-rotation tidal term, and tension. Take these equations as the ideal-MHD input, then derive their eigenvalues explicitly.'),
      eq(`ξ̈<sub>x</sub>−2Ωξ̇<sub>y</sub> = (2qΩ²−K)ξ<sub>x</sub><br>ξ̈<sub>y</sub>+2Ωξ̇<sub>x</sub> = −Kξ<sub>y</sub>`),
      p('ξ∝exp(st)を代入すると、一度の微分がs、二度の微分がs²になる。二つの変位がともに0という解以外を得るには、係数の行列式が0であればよい。', 'Substitute ξ ∝ exp(st), replacing first and second derivatives by s and s². A nonzero displacement requires the determinant of the coefficient matrix to vanish.'),
      eq(`(s²+K−2qΩ²)ξ<sub>x</sub>−2Ωsξ<sub>y</sub> = 0<br>2Ωsξ<sub>x</sub>+(s²+K)ξ<sub>y</sub> = 0`),
      eq(`s⁴+(κ²+2K)s²+K(K−2qΩ²) = 0`)),
    s(4, '四次式を、s²の二次式として解く', 'Solve a quadratic in s squared',
      p('b＝kv<sub>A</sub>/Ω、z＝s²/Ω²、κ̂²＝κ²/Ω²＝2(2−q)と置く。四次方程式に見えてもzについては二次方程式である。大きい方の根が正なら、s>0の増幅解がある。', 'Set b = kv<sub>A</sub>/Ω, z = s²/Ω², and κ̂² = 2(2−q). The quartic in s is a quadratic in z. A positive larger root permits an exponentially growing solution with s > 0.'),
      eq(`z²+(κ̂²+2b²)z+b²(b²−2q) = 0<br>z<sub>+</sub> = ${f('−(κ̂²+2b²)+√(κ̂⁴+16b²)','2')}`),
      p('0&lt;q&lt;2では、0&lt;b²&lt;2qなら定数項が負で二つのzの符号が逆になり、正の根がある。b＝0そのものには成長がなく、張力が強すぎるb²≥2qでもこのモードは育たない。', 'For 0 < q < 2, the interval 0 < b² < 2q makes the constant term negative, producing one positive and one negative root. There is no growth at exactly b = 0; sufficiently strong tension, b² ≥ 2q, also suppresses this mode.'),
      '<div data-lab="mri"></div>'),
    s(5, '最も速く育つ波長を求める', 'Find the fastest-growing wavelength',
      p('z<sub>+</sub>をb²で微分して0と置くと、−1＋4/√(κ̂⁴+16b²)＝0。これを整理すれば、最適な張力と最大成長率が得られる。', 'Differentiate z<sub>+</sub> with respect to b² and set the derivative to zero: −1 + 4/√(κ̂⁴+16b²) = 0. Rearrangement gives the optimum tension and maximum growth rate.'),
      eq(`b<sub>max</sub>² = ${f('q(4−q)','4')},　s<sub>max</sub> = ${f('qΩ','2')}<br>q = ${f('3','2')} :　b<sub>max</sub>² = ${f('15','16')},　s<sub>max</sub> = ${f('3Ω','4')}`),
      p('ケプラー回転では増幅のe倍時間が4/(3Ω)、公転周期2π/Ωの約0.21倍になる。これは小さい摂動の線形成長の時間であり、その後も無限に指数関数で増えるという予測ではない。', 'For Keplerian rotation the e-folding time is 4/(3Ω), about 0.21 of an orbit 2π/Ω. This is the linear growth time of a small perturbation, not a prediction of unlimited exponential amplification.')),
    s(6, 'MRIがあることと、αが分かることは別', 'MRI growth does not fix a saturated alpha',
      p('実際の円盤では、波長2π/kが円盤の厚みの中へ収まる必要がある。磁場とガスの結びつきが弱ければ、抵抗や両極性拡散などによって条件も変わる。これらを含めない理想模型の不安定帯だけで、原始惑星系円盤全体の活動性を断定できない。', 'A real mode must fit within the disk thickness. Resistivity, ambipolar diffusion, and other nonideal effects alter the result when field–gas coupling is weak. The ideal unstable band alone cannot establish activity throughout a protoplanetary disk.'),
      p('さらに、線形固有値は非線形な飽和や平均の輸送応力を決めない。<a href="#/advanced/alpha-disk">α円盤</a>のαを得るには、磁場の構造、非線形相互作用、境界条件などを含めた追加の計算が必要である。', 'Linear eigenvalues do not determine nonlinear saturation or the mean transport stress. Obtaining the alpha used in an <a href="#/advanced/alpha-disk">alpha disk</a> requires additional calculations including field geometry, nonlinear interactions, and boundary conditions.'))
  ].join('');

  bodies['toomre-q'] = () => [
    s(1, '円盤では、長い波を回転も支える', 'Rotation also resists long waves in a disk',
      p('Jeansの一様な三次元ガスとは違い、円盤は薄く回転している。局所的な半径方向の圧縮では、圧力のほかにCoriolis力と軌道の応答が働く。無限に薄い気体円盤、局所近似、軸対称、一定の音速を仮定して、波長ごとの競争を調べよう。', 'Unlike a uniform three-dimensional Jeans medium, a disk is thin and rotating. A local radial compression involves Coriolis and orbital responses as well as pressure. Use a razor-thin gas disk, a local approximation, axisymmetry, and constant sound speed to examine each wavelength.'),
      eq(`κ² = ${f('1','r³')}${f('d(r⁴Ω²)','dr')} = 4Ω²+2rΩ${f('dΩ','dr')}`),
      p('κはエピサイクル周波数で、ケプラー回転ではΩと等しい。以下で使うΣは円盤の面密度である。三次元の体積密度ρを、そのまま同じ位置に入れない。', 'κ is the epicyclic frequency and equals Ω for Keplerian rotation. The density Σ below is mass per disk area, not the three-dimensional density ρ.')),
    s(2, '薄いシートの重力を求める', 'Obtain the gravity of a thin sheet',
      p('面密度の波δΣ exp(ikx)に対して、円盤の外のポテンシャルはz方向にexp(−|kz|)で減衰する。薄いシートをまたいでPoisson方程式を積分すると、鉛直微分の跳びが4πGδΣに等しくなる。', 'For a surface-density wave δΣ exp(ikx), the potential outside the disk decays vertically as exp(−|kz|). Integrating Poisson’s equation across the sheet equates the jump of the vertical derivative to 4πGδΣ.'),
      eq(`δΦ(z) = δΦ(0)e<sup>−|kz|</sup><br>−2|k|δΦ(0) = 4πGδΣ　⇒　δΦ(0) = −${f('2πGδΣ','|k|')}`),
      p('三次元の一様ガスとはk依存性が違うことが重要である。厚みを0としたため、この式を使えるのは波長と円盤厚みの関係に注意した局所模型であり、有限厚の重力低減はまだ含まない。', 'The wavenumber dependence differs from a uniform three-dimensional medium. This expression assumes zero thickness; a finite disk thickness weakens self-gravity at short wavelengths and requires a modified kernel.')),
    s(3, '質量と二方向の運動を線形化する', 'Linearize mass and two momentum equations',
      p('摂動をexp[i(kx−ωt)]とし、uを半径方向、vを回転方向の速度の揺らぎとする。連続の式と二つの運動方程式を書き、面密度とvをuで表せば消去できる。', 'Use disturbances exp[i(kx−ωt)], with radial velocity perturbation u and azimuthal perturbation v. Continuity and the two momentum equations let us express surface-density and azimuthal perturbations in terms of u, then eliminate them.'),
      eq(`−iωδΣ+ikΣu = 0<br>−iωu−2Ωv = −ik(c<sub>s</sub>²${f('δΣ','Σ')}+δΦ)<br>−iωv+${f('κ²','2Ω')}u = 0`),
      eq(`ω² = κ²+c<sub>s</sub>²k²−2πGΣ|k|`),
      p('右辺の第1項は回転、第2項は圧力、第3項は自己重力である。回転項は長波長を、圧力項は短波長を安定化する。その間に自己重力が勝つ帯があるかを、次に調べる。', 'The three terms represent rotation, pressure, and self-gravity. Rotation stabilizes long waves, while pressure stabilizes short waves. We now ask whether gravity dominates an intermediate band.')),
    s(4, '平方完成からQの境目を出す', 'Complete the square to obtain Q',
      eq(`Q ≡ ${f('c<sub>s</sub>κ','πGΣ')},　x ≡ ${f('|k|c<sub>s</sub>','κ')}<br>${f('ω²','κ²')} = 1+x²−${f('2x','Q')} = (x−${f('1','Q')})²+1−${f('1','Q²')}`),
      p('xに対する最小値は1−1/Q²であり、x＝1/Qで実現する。Q>1ならどのxでもω²>0、Q<1なら負になる波数帯がある。Q＝1ではx＝1が中立で、指数成長率は0になる。', 'The minimum is 1−1/Q² at x = 1/Q. All modes have positive ω² when Q > 1. If Q < 1, a band has negative ω². At Q = 1 the mode x = 1 is neutral, with zero exponential growth rate.'),
      '<div data-lab="toomre-q"></div>',
      note('これは気体のQで、分母はπGΣ。衝突の少ない恒星円盤では速度分布を含めた応答が違い、よく使われる恒星Qの分母は3.36GΣになる。同じ式の音速を速度分散へ置き換えるだけでは導出にならない。', 'This is gas Q, with denominator πGΣ. A collisionless stellar disk has a different response involving its velocity distribution; a common stellar Q uses 3.36GΣ. Replacing sound speed with a dispersion is not a derivation of that result.')),
    s(5, '不安定な帯と、最も速い波', 'The unstable band and fastest-growing mode',
      p('Q<1でω²＝0を解くと帯の端点が分かる。その内側でω＝iσと置けば、成長率も求められる。最大成長は最も長い波ではなく、圧力と重力の間にある有限の波長で起きる。', 'For Q < 1, solve ω² = 0 to find the band edges and set ω = iσ inside the band. Maximum growth occurs at a finite wavelength between pressure and rotational stabilization, not at the longest possible wave.'),
      eq(`x<sub>±</sub> = ${f('1±√(1−Q²)','Q')},　x<sub>−</sub>&lt;x&lt;x<sub>+</sub><br>k<sub>max</sub> = ${f('πGΣ','c<sub>s</sub>²')},　λ<sub>max</sub> = ${f('2c<sub>s</sub>²','GΣ')}<br>${f('σ<sub>max</sub>','κ')} = √(${f('1','Q²')}−1)`),
      p('例えばQ＝0.8ならxは0.5から2の間で不安定で、最速のx＝1.25でσ＝0.75κとなる。この予測が意味を持つには、波長が円盤の全体半径より十分小さいという局所近似も満たす必要がある。', 'For Q = 0.8, the unstable interval is 0.5 < x < 2, with σ = 0.75κ at x = 1.25. Applying this prediction also requires wavelengths sufficiently small compared with the disk radius for the local approximation.')),
    s(6, 'Q<1だから惑星ができる、とは言えない', 'Q below one does not guarantee planet formation',
      p('圧縮が進むと加熱が圧力を上げることがある。放射冷却が遅ければ、線形に不安定でも、渦状構造と加熱を伴う状態へ落ち着く可能性がある。冷却時間とΩの積などが非線形な結果を分ける追加の量になる。', 'Compression can heat the gas and increase pressure. With slow radiative cooling, a linearly unstable disk may settle into a heated spiral or gravito-turbulent state rather than fragment. Quantities such as cooling time multiplied by Ω provide additional information about nonlinear outcomes.'),
      p('冷却による分裂の境目は状態方程式、数値解像度、照射、境界条件などにも依存し、普遍的な一つの数字ではない。Qは局所的な軸対称の線形安定性の指標として使い、形成される天体の種類や質量を直接割り当てない。', 'Cooling thresholds depend on the equation of state, resolution, irradiation, boundary conditions, and other assumptions; there is no single universal number. Use Q as a local axisymmetric linear-stability diagnostic, not a direct assignment of fragment type or mass.'))
  ].join('');

  // Metadata is rendered as HTML by the shared reader, like the lesson bodies.
  const subs = { ext: 'ext', rec: 'rec', max: 'max', crit: 'crit', BE: 'BE', J: 'J', S: 'S', H: 'H', B: 'B', s: 's', ν: 'ν' };
  for (const chapter of chapters) for (const field of ['question', 'answer']) chapter[field] = chapter[field].map(text => text.replace(/_([A-Za-z]+|ν)/g, (_, sub) => `<sub>${subs[sub] || sub}</sub>`).replace(/\^\(([^)]+)\)/g, '<sup>$1</sup>'));
  advanced.chapters.push(...chapters);
  // Arrange published chapters in the syllabus's physical order, not release order.
  const order = window.AstroSeries.groups.flatMap(group => group.topics.map(topic => topic.id));
  advanced.chapters.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  const originalRender = advanced.renderBody;
  advanced.renderBody = (id, locale) => {
    if (!Object.prototype.hasOwnProperty.call(bodies, id)) return originalRender(id, locale);
    language = locale;
    return bodies[id]();
  };
})();
