/* The advanced volume combines worked chapters with a clearly marked syllabus. */
(() => {
  const name = ['理論天文学の道具箱', 'Theoretical Astrophysics, Step by Step'];
  const volumes = {
    foundations: {
      title: ['入門編', 'Foundations'],
      subtitle: ['高校数学の式変形でたどる宇宙', 'Exploring the universe through school algebra']
    },
    advanced: {
      title: ['発展編', 'Advanced'],
      subtitle: ['平衡・不安定性・輸送・相似解', 'Equilibrium, instability, transport, and similarity solutions']
    }
  };
  const groups = [
    {
      title: ['星と雲の平衡、その限界', 'Equilibrium and limits of stars and clouds'],
      intro: ['入門編のビリアル定理と白色矮星から、球とフィラメントの内部構造を解く段階へ。', 'From the foundational virial theorem and white dwarfs to the internal structure of spheres and filaments.'],
      bridge: 'virial',
      topics: [
        {
          id: 'lane-emden', title: ['Lane–Emden方程式とポリトロープ', 'Lane–Emden equation and polytropes'],
          question: ['圧力と密度の関係を決めると、星の半径と質量はどう決まるか。', 'How does a pressure–density relation determine stellar mass and radius?'],
          method: ['静水圧平衡と質量保存から無次元方程式へ。中心の正則条件、表面の零点、n＝3とチャンドラセカール質量をつなぐ。', 'Reduce hydrostatic balance and mass conservation to a dimensionless equation. Connect central regularity, the surface zero, and the n = 3 model to the Chandrasekhar mass.'],
          reference: ['Princeton · Polytropes', 'https://www.astro.princeton.edu/~gk/A403/polytrop.pdf']
        },
        {
          id: 'bonnor-ebert', title: ['Bonnor–Ebert球と外圧', 'Bonnor–Ebert spheres and external pressure'],
          question: ['同じ温度のガス雲を外から圧縮すると、どこで平衡が不安定になるか。', 'When does an externally compressed isothermal gas cloud become unstable?'],
          method: ['等温球の方程式を外圧で区切り、平衡系列をたどる。温度・外圧など、何を固定した安定性なのかを明示する。', 'Truncate an isothermal sphere at a specified external pressure and follow equilibrium sequences. State the quantities held fixed when assessing stability.'],
          reference: ['Bonnor (1956)', 'https://articles.adsabs.harvard.edu/pdf/1956MNRAS.116..351B']
        },
        {
          id: 'isothermal-cylinder', title: ['Ostrikerの等温円柱と限界線密度', 'Ostriker’s isothermal cylinder and critical line mass'],
          question: ['細長いガスのフィラメントは、単位長さあたりどれだけの質量を支えられるか。', 'How much mass per unit length can a long gaseous filament support?'],
          method: ['円柱のGauss則と静水圧平衡から解析解を作る。平らな中心、外側のr⁻⁴、線密度2cₛ²/G、外圧で切り取る場合と柱密度を区別する。J. P. Ostrikerを追悼する章。', 'Derive an analytic equilibrium from cylindrical Gauss’s law and hydrostatic balance. Connect the flat centre, r⁻⁴ envelope and line mass 2cₛ²/G, distinguishing pressure truncation and projected column density. A chapter remembering J. P. Ostriker.'],
          reference: ['Ostriker (1964), §III, equations (56)–(61)', 'https://articles.adsabs.harvard.edu/pdf/1964ApJ...140.1056O']
        },
        {
          id: 'hayashi', title: ['林限界と林トラック', 'Hayashi limit and Hayashi tracks'],
          question: ['重力収縮する前主系列星は、なぜほぼ一定の有効温度で暗くなるのか。', 'Why can a contracting pre-main-sequence star fade at nearly constant effective temperature?'],
          method: ['n＝3/2のポリトロープから完全対流の近似へ進み、光球の境界条件とH⁻の不透明度を結ぶ。L＝4πR²σT_eff⁴で収縮するトラックを読み、林限界の位置を決める大気物理と、進化の時間を決めるエネルギー収支を分ける。放射核ができる場合のHenyeyトラックとの違いも扱う。', 'Connect an n = 3/2 polytrope to approximate full convection, photospheric boundary conditions, and H⁻ opacity. Use L = 4πR²σT_eff⁴ to read the contracting track, separating the atmospheric physics setting the Hayashi limit from the energy budget setting its timescale. Distinguish Henyey tracks when a radiative core develops.'],
          reference: ['Princeton · Hayashi limit', 'https://www.astro.princeton.edu/~gk/A403/hayashi.pdf']
        }
      ]
    },
    {
      title: ['回転と非球対称の重力平衡', 'Rotation and nonspherical gravitational equilibrium'],
      intro: ['球を離れ、形と運動を方向ごとに考える。', 'Move beyond spheres and connect shape to motion along different axes.'],
      bridge: 'virial',
      topics: [
        {
          id: 'ellipsoids', title: ['楕円体の重力ポテンシャル', 'Gravitational potentials of ellipsoids'],
          question: ['同じ質量でも、潰したり伸ばしたりすると内部の重力はどう変わるか。', 'At fixed mass, how does flattening or elongation change the internal gravity?'],
          method: ['均質楕円体を入口に、ポテンシャルと軸比の関係を調べる。軸対称と三軸の形を比較する。', 'Begin with homogeneous ellipsoids, relating their potentials to axis ratios and comparing axisymmetric and triaxial shapes.'],
          reference: ['Binney · Dynamics of elliptical galaxies', 'https://ned.ipac.caltech.edu/level5/March04/Binney/Binney_contents.html']
        },
        {
          id: 'tensor-virial', title: ['テンソルビリアルとMaclaurin／Jacobi系列', 'Tensor virial theorem and Maclaurin/Jacobi sequences'],
          question: ['回転する流体はどんな形で平衡でき、その形は安定か。', 'Which rotating fluid shapes can be in equilibrium, and are they stable?'],
          method: ['方向ごとのつり合いから回転楕円体と三軸楕円体へ。平衡の存在、分岐、安定性を区別し、星の集団の平衡との違いも扱う。', 'Use directional balances to study spheroidal and triaxial fluid figures. Separate equilibrium, bifurcation, and stability, and distinguish fluid figures from stellar systems.'],
          reference: ['Lebovitz (1961)', 'https://articles.adsabs.harvard.edu/pdf/1961ApJ...134..500L']
        }
      ]
    },
    {
      title: ['重力不安定性と宇宙構造', 'Gravitational instability and cosmic structure'],
      intro: ['背景と揺らぎを分け、何が成長するのかを問う。', 'Separate background from perturbations and ask which disturbances grow.'],
      bridge: 'expansion',
      topics: [
        {
          id: 'jeans', title: ['Jeans不安定性とJeans swindle', 'Jeans instability and the Jeans swindle'],
          question: ['圧力はどの波長の重力収縮を止められるか。一様な背景の重力をどう扱うか。', 'Which wavelengths can pressure stabilize, and how should the gravity of a uniform background be treated?'],
          method: ['連続・運動・Poisson方程式を線形化して分散関係へ。静止した背景の仮定と、膨張宇宙での扱いを比較する。', 'Linearize continuity, momentum, and Poisson equations to obtain a dispersion relation. Compare a static background assumption with an expanding cosmological background.'],
          reference: ['Falco et al. · Why does the Jeans swindle work?', 'https://arxiv.org/abs/1210.3363']
        },
        {
          id: 'zeldovich', title: ['Zel’dovich近似とパンケーキ', 'Zel’dovich approximation and pancakes'],
          question: ['重力で集まる物質は、なぜ最初から球になるとは限らないのか。', 'Why does gravitational clustering not necessarily begin by forming spheres?'],
          method: ['ラグランジュ座標の写像と質量保存から密度を求め、一方向の圧縮を調べる。軌道交差で近似が破れる意味を説明する。', 'Use a Lagrangian map and mass conservation to obtain density and study one-axis compression. Explain the breakdown at shell crossing.'],
          reference: ['Zel’dovich (1970)', 'https://www.giss.nasa.gov/staff/mway/cluster/zeldovich.pdf']
        },
        {
          id: 'press-schechter', title: ['Press–Schechter理論とハローの質量関数', 'Press–Schechter theory and the halo mass function'],
          question: ['初期の密度ゆらぎから、質量ごとのハローの個数をどう予測するか。', 'How can initial density fluctuations predict halo abundances by mass?'],
          method: ['球対称崩壊で線形しきい値δcを求め、Gaussianの裾を質量割合へ対応させる。cloud-in-cloud問題と係数2を区別し、質量関数・べき乗模型の相似性・銀河形成への適用範囲を調べる。', 'Derive the linear spherical-collapse threshold, relate Gaussian tails to mass fractions, and explain cloud-in-cloud accounting and the factor of two. Obtain the mass function and power-law self-similarity, with limits for galaxy formation.'],
          reference: ['Press & Schechter (1974)', 'https://articles.adsabs.harvard.edu/pdf/1974ApJ...187..425P']
        }
      ]
    },
    {
      title: ['流体境界の不安定性', 'Instabilities of fluid interfaces'],
      intro: ['境界の小さな揺れから、浮力・速度差による成長と混合の入口へ。', 'Use small interface disturbances to study buoyancy, shear-driven growth, and the onset of mixing.'],
      bridge: 'matter',
      topics: [
        {
          id: 'rayleigh-taylor', title: ['Rayleigh–Taylor不安定性', 'Rayleigh–Taylor instability'],
          question: ['重い流体が軽い流体の上にあると、境界はどの速さで変形するか。', 'How quickly does an interface deform when denser fluid is above lighter fluid?'],
          method: ['ポテンシャル流と境界の運動・圧力条件からω²＝−Agkへ。Atwood数、成長時間、短波長極限、非線形混合との違いを調べる。', 'Derive ω² = −Agk from potential flow and kinematic/pressure conditions. Examine Atwood number, growth time, short wavelengths, and the distinction from nonlinear mixing.'],
          reference: ['Maryland · Hydrodynamics', 'https://pages.astro.umd.edu/~diemer/erebos/teaching/astr670/notes_hydro.pdf']
        },
        {
          id: 'kelvin-helmholtz', title: ['Kelvin–Helmholtz不安定性', 'Kelvin–Helmholtz instability'],
          question: ['境界に沿う速度差は、どうして波を育てるのか。', 'Why does a velocity difference along an interface amplify waves?'],
          method: ['移流を含む境界条件から分散関係を導き、波の移動と成長を分ける。密度差・重力・有限の速度層の影響を比較する。', 'Include advection in interface conditions, derive the dispersion relation, and separate wave drift from growth. Compare density contrast, gravity, and finite shear thickness.'],
          reference: ['MIT · Interfacial phenomena', 'https://ocw.mit.edu/courses/18-357-interfacial-phenomena-fall-2010/04759cfc15c79928ca9f72a18b3864dd_MIT18_357F10_lec_all.pdf']
        }
      ]
    },
    {
      title: ['流体・相似解と高エネルギー放射', 'Fluids, similarity solutions, and high-energy radiation'],
      intro: ['爆風と重力崩壊を相似解で読み、衝撃波から粒子加速・放射へつなぐ。', 'Study blast waves and collapse with similarity solutions, then connect shocks to particle acceleration and radiation.'],
      bridge: 'structure',
      topics: [
        {
          id: 'bondi', title: ['Bondi降着と音速点', 'Bondi accretion and the sonic point'],
          question: ['静かな周囲のガスは、どんな流れで中心の天体へ落ちるか。', 'How does gas from a quiet surrounding medium flow toward a central object?'],
          method: ['定常・球対称の質量保存と運動方程式から、重力半径r_B＝GM/c_s,∞²と音速点を導く。等温模型をParker風と対にして読み、断熱模型では外側の密度・音速・比熱比から降着率が選ばれることを調べる。単なる自由落下の見積もりと臨界点を通る解を区別する。', 'Use steady spherical mass and momentum conservation to derive r_B = GM/c_s,∞² and the sonic point. Pair the isothermal model with Parker wind, then examine how outer density, sound speed, and heat-capacity ratio select adiabatic accretion. Distinguish free-fall estimates from a transonic critical solution.'],
          reference: ['Bondi (1952)', 'https://articles.adsabs.harvard.edu/pdf/1952MNRAS.112..195B']
        },
        {
          id: 'parker-wind', title: ['Parker風と超音速流出', 'Parker wind and transonic outflow'],
          question: ['熱い恒星大気は、どうやって重力に逆らい超音速で吹き出すか。', 'How does a hot stellar atmosphere escape gravity and become a supersonic wind?'],
          method: ['等温・球対称・定常流の風方程式(u−c_s²/u)du/dr＝2c_s²/r−GM/r²を導き、r_s＝GM/(2c_s²)で正則に音速を通る枝を選ぶ。Bondi降着との接続、境界条件、等温を保つ加熱が必要なこと、実際の太陽風の磁場との違いを扱う。', 'Derive the steady spherical isothermal wind equation (u−c_s²/u)du/dr = 2c_s²/r−GM/r² and select a regular transonic branch at r_s = GM/(2c_s²). Connect to Bondi accretion, boundary conditions, the heating needed to maintain isothermality, and magnetic effects in the real solar wind.'],
          reference: ['Parker (1958)', 'https://articles.adsabs.harvard.edu/pdf/1958ApJ...128..664P']
        },
        {
          id: 'sedov', title: ['Sedov–Taylor解とRankine–Hugoniot条件', 'Sedov–Taylor and Rankine–Hugoniot conditions'],
          question: ['放出エネルギーと周囲の密度から、爆風の半径はどう成長するか。', 'How does a blast radius grow given an explosion energy and ambient density?'],
          method: ['保存則から衝撃波の跳躍条件を導き、次元解析と相似変数で内部の速度・密度・圧力を解く。強い衝撃波、エネルギー保存などの条件を確認する。', 'Derive shock jump conditions from conservation, then use dimensional analysis and similarity variables to solve the internal profiles. State strong-shock and energy-conservation assumptions.'],
          reference: ['Taylor (1950)', 'https://homepage.physics.uiowa.edu/~ghowes/teach/2023phys7729/docs/Taylor50a.pdf']
        },
        {
          id: 'isothermal-collapse', title: ['Larson–Penston／Shuの等温崩壊', 'Larson–Penston and Shu isothermal collapse'],
          question: ['同じ等温ガスの方程式から、なぜ異なる崩壊解が選ばれるか。', 'Why do the same isothermal gas equations admit different collapse solutions?'],
          method: ['球対称の流体方程式を相似変換し、音速点と初期・境界条件を調べる。両者を自動的な前後の進化段階として扱わない。', 'Apply similarity transformations to spherical gas dynamics and examine sonic points and initial/boundary conditions. Do not identify the two solutions as automatically successive stages.'],
          reference: ['Shu (1977)', 'https://articles.adsabs.harvard.edu/pdf/1977ApJ...214..488S']
        },
        {
          id: 'shock-acceleration', title: ['衝撃波と粒子加速', 'Shocks and particle acceleration'],
          question: ['衝撃波を往復する粒子は、なぜべき乗のエネルギー分布になるか。', 'Why do particles cycling across a shock acquire a power-law energy distribution?'],
          method: ['Rankine–Hugoniot条件の圧縮比から、一次Fermi加速の増幅率と逃走確率を求める。加速時間と閉じ込め・冷却の限界を区別する。', 'Connect shock compression to first-order Fermi gains and escape probability. Distinguish acceleration time, confinement, and cooling limits.'],
          reference: ['Maryland · Particle acceleration', 'https://www.astro.umd.edu/~miller/teaching/astr688m/lecture04.pdf']
        },
        {
          id: 'synchrotron', title: ['シンクロトロン放射と電子の冷却', 'Synchrotron radiation and electron cooling'],
          question: ['加速電子の分布と磁場は、電波・X線のスペクトルにどう現れるか。', 'How do accelerated electrons and magnetic fields shape radio and X-ray spectra?'],
          method: ['代表周波数・放射パワー・冷却時間を求め、電子のべき乗分布を光のスペクトルへ変換する。継続注入での冷却折れ曲がりを導く。', 'Compute characteristic frequency, power, and cooling time, translate electron power laws into light spectra, and derive a continuous-injection cooling break.'],
          reference: ['NRAO · Synchrotron radiation', 'https://www.cv.nrao.edu/~sransom/web/Ch5.html']
        }
      ]
    },
    {
      title: ['星団の統計力学と緩和', 'Statistical mechanics and relaxation of star clusters'],
      intro: ['一つの軌道から、分布とエネルギー輸送の進化へ。', 'From individual orbits to evolving distributions and energy transport.'],
      bridge: 'virial',
      topics: [
        {
          id: 'relaxation', title: ['2体緩和と重力散乱', 'Two-body relaxation and gravitational encounters'],
          question: ['小さな重力散乱が積み重なると、いつ軌道が大きく変わるか。', 'When do accumulated weak gravitational encounters significantly change an orbit?'],
          method: ['散乱の見積もりとランダムウォークから緩和時間へ。星の直接衝突や、孤立した二体軌道の問題とは区別する。', 'Connect encounter estimates and a random walk to relaxation time. Distinguish this process from direct stellar collisions and isolated two-body orbits.'],
          reference: ['Yale · Astrophysical flows', 'https://www.astro.yale.edu/vdbosch/Astrophysical_Flows.pdf']
        },
        {
          id: 'fokker-planck', title: ['Fokker–Planck方程式', 'Fokker–Planck equation'],
          question: ['遭遇による平均的な偏りとばらつきから、分布の変化をどう記述するか。', 'How do drift and diffusion from encounters describe changes in a distribution?'],
          method: ['一変数の模型でドリフト・拡散を読み、星団の軌道平均と自己無撞着な重力場へ進む。分布の定義と保存則を確認する。', 'Start with drift and diffusion in a one-variable model, then introduce orbit averaging and self-consistent gravity for clusters. Specify the distribution and conservation laws.'],
          reference: ['Cohn (1979)', 'https://adsabs.harvard.edu/pdf/1979ApJ...234.1036C']
        },
        {
          id: 'gravothermal', title: ['グラボサーマル・カタストロフィー', 'Gravothermal catastrophe'],
          question: ['外側へエネルギーを渡す中心核が、さらに熱くなり収縮するのはなぜか。', 'Why can a core heat up and contract as it transfers energy outward?'],
          method: ['負の熱容量と緩和による輸送をつなぐ。固定する熱力学的条件による安定性の違い、連星加熱、崩壊後の振動へ進む。', 'Connect negative heat capacity with relaxation-driven transport. Examine thermodynamic constraints, binary heating, and post-collapse oscillations.'],
          reference: ['Lynden-Bell & Wood (1968)', 'https://academic.oup.com/mnras/article/138/4/495/2604346']
        }
      ]
    },
    {
      title: ['円盤の輸送と重力不安定性', 'Disk transport and gravitational instability'],
      intro: ['角運動量輸送を入口に、降着・円盤風・α・MRI・自己重力をつなぐ。', 'Start with angular-momentum transport, then connect accretion, winds, alpha, MRI, and self-gravity.'],
      bridge: 'matter',
      topics: [
        {
          id: 'angular-momentum', title: ['角運動量輸送と降着', 'Angular-momentum transport and accretion'],
          question: ['ガスが中心へ降着するには、角運動量をどこへ渡せばよいか。', 'Where must gas transfer angular momentum in order to accrete?'],
          method: ['円軌道のj＝√(GMr)から降着の条件を導き、二つの環で全角運動量と軌道エネルギーを確かめる。応力による半径方向の輸送と円盤風による持ち出し、定常円盤のトルク収支を区別してα・MRIへ接続する。', 'Use circular-orbit j = √(GMr) to establish the requirement for accretion. Check total angular momentum and orbital energy with two rings, distinguish radial stress transport from wind removal, and build the steady torque budget leading to alpha and MRI.'],
          reference: ['Princeton · Accretion disks', 'https://www.astro.princeton.edu/~gk/A403/disk.pdf']
        },
        {
          id: 'alpha-disk', title: ['薄い円盤とShakura–Sunyaevのαモデル', 'Thin disks and the Shakura–Sunyaev alpha model'],
          question: ['回転するガスが中心へ落ちるには、角運動量をどう運べばよいか。', 'How must a rotating gas redistribute angular momentum to accrete?'],
          method: ['鉛直平衡から厚みを見積もり、有効粘性ν＝αc_sHを導入。αが輸送効率のモデルであり、輸送の原因自体を決めないことを明示する。', 'Estimate the scale height from vertical balance and introduce effective viscosity ν = αc_sH. Explain that alpha parametrizes transport efficiency rather than determining its physical cause.'],
          reference: ['Chambers (2009) · Viscous disk model', 'https://doi.org/10.1088/0004-637x/705/2/1206']
        },
        {
          id: 'mri', title: ['Balbus–Hawley不安定性：MRI', 'Balbus–Hawley instability: MRI'],
          question: ['流体力学的には安定な差動回転円盤が、弱い磁場で不安定になるのはなぜか。', 'Why can a weak magnetic field destabilize a differentially rotating disk that is hydrodynamically stable?'],
          method: ['磁力線の張力による角運動量交換から磁気回転不安定性を理解する。局所・軸対称・理想MHDの鉛直磁場で、Ωが外向きに減少する場合の分散関係と成長率を扱う。ケプラー回転の最大成長率3Ω/4を調べ、α輸送との接続、原始惑星系円盤の低電離での非理想MHDの必要性を明示する。', 'Use magnetic tension and angular-momentum exchange to introduce magnetorotational instability. In local axisymmetric ideal MHD with vertical field, derive the dispersion relation and growth when Ω decreases outward. Examine the Keplerian maximum growth rate 3Ω/4, the link to alpha transport, and nonideal effects in poorly ionized protoplanetary disks.'],
          reference: ['Balbus & Hawley (1991)', 'https://articles.adsabs.harvard.edu/pdf/1991ApJ...376..214B']
        },
        {
          id: 'viscous-disk', title: ['Lynden–Bell–Pringleの粘性円盤相似解', 'Lynden–Bell–Pringle viscous-disk similarity solutions'],
          question: ['物質は中心へ降着するのに、円盤の外側はなぜ広がるのか。', 'Why can a disk spread outward while mass accretes toward the centre?'],
          method: ['質量と角運動量の保存から面密度の進化方程式へ。粘性の半径依存性を指定して相似解を求め、降着と外向きの角運動量輸送を追う。', 'Derive surface-density evolution from mass and angular-momentum conservation. Prescribe radial viscosity to obtain similarity solutions and track accretion and outward angular-momentum transport.'],
          reference: ['Lynden-Bell & Pringle (1974)', 'https://academic.oup.com/mnras/article/168/3/603/990948']
        },
        {
          id: 'toomre-q', title: ['Toomre Q、冷却、円盤の分裂', 'Toomre Q, cooling, and disk fragmentation'],
          question: ['圧力と回転は自己重力に勝てるか。不安定な円盤は必ず分裂するか。', 'Can pressure and rotation resist self-gravity, and must an unstable disk fragment?'],
          method: ['薄いガス円盤の局所分散関係からQを導く。軸対称の線形安定条件と、冷却を含む非線形の分裂条件を区別する。', 'Derive Q from a local dispersion relation for a thin gas disk. Distinguish axisymmetric linear stability from nonlinear fragmentation with cooling.'],
          reference: ['Gammie (2001)', 'https://arxiv.org/abs/astro-ph/0101501']
        }
      ]
    },
    {
      title: ['電離・散乱と天体ガスの観測', 'Ionization, scattering, and observing cosmic gas'],
      intro: ['光とガスの相互作用から、電離領域の大きさと銀河団の圧力を測る。', 'Use light–gas interactions to measure ionized regions and galaxy-cluster pressure.'],
      bridge: 'atom',
      topics: [
        {
          id: 'stromgren', title: ['Strömgren球と電離・再結合', 'Strömgren spheres, ionization, and recombination'],
          question: ['星の周りの水素ガスは、どこまで電離されて光るか。', 'How large an ionized hydrogen region can a star maintain?'],
          method: ['一様密度・純水素・電離光子を閉じ込める静的模型で、Q_H＝(4π/3)R_S³α_B n_e n_pから電離半径を導く。再結合時間、case Bと局所再吸収、光子の逃走・塵吸収の仮定を確認し、初期の電離前線と後の圧力駆動膨張を静的平衡から区別する。', 'For uniform, pure-hydrogen, ionization-bounded gas, derive the equilibrium radius from Q_H = (4π/3)R_S³α_B n_e n_p. Examine recombination time, case B and local reabsorption, photon escape, and dust absorption. Distinguish static balance from the initial ionization front and later pressure-driven expansion.'],
          reference: ['Strömgren (1939)', 'https://articles.adsabs.harvard.edu/pdf/1939ApJ....89..526S']
        },
        {
          id: 'sunyaev-zeldovich', title: ['逆コンプトン散乱とSunyaev–Zel’dovich効果', 'Inverse Compton scattering and the Sunyaev–Zel’dovich effect'],
          question: ['銀河団の熱いガスは、宇宙背景放射をどう変え、何を教えてくれるか。', 'How does hot cluster gas change the CMB, and what can that tell us?'],
          method: ['散乱光学的厚さと電子温度からyを求め、視線積分で電子圧力へ結ぶ。Kompaneets近似から熱的SZスペクトルと低周波の減光・約217 GHzの零点を求め、運動学的SZと相対論的補正の限界を区別する。', 'Build y from scattering optical depth and electron temperature, then connect it to integrated electron pressure. Derive the thermal spectrum, low-frequency deficit, and approximately 217 GHz null from the Kompaneets limit. Distinguish kinetic SZ and limitations from relativistic corrections.'],
          reference: ['Carlstrom, Holder & Reese (2002)', 'https://arxiv.org/abs/astro-ph/0208192']
        }
      ]
    },
    {
      title: ['中性子星とパルサー磁気圏', 'Neutron stars and pulsar magnetospheres'],
      intro: ['回転と磁場から必要な電荷を数え、粒子加速と放射へつなぐ。', 'Count the charge required by rotation and magnetic fields, then connect to acceleration and radiation.'],
      bridge: 'scattering',
      topics: [
        {
          id: 'goldreich-julian', title: ['Goldreich–Julian密度と共回転', 'Goldreich–Julian density and corotation'],
          question: ['回転する中性子星の磁気圏には、どんな電荷密度が必要か。', 'What charge density is needed in the magnetosphere of a rotating neutron star?'],
          method: ['共回転の電場E＝−(Ω×r)×Bとガウスの法則から、平坦時空・準静的で電流の項を省く近似のρ_GJ≈−2ε₀Ω·B（SI）を導く。n_GJ＝|ρ_GJ|/eは電荷数密度の尺度であり、電子・陽電子の総数密度とは区別する。光円柱、電荷不足と加速ギャップへの接続を扱い、この近似を磁気圏全体に適用しない。', 'Use corotation E = −(Ω×r)×B and Gauss’s law to derive ρ_GJ ≈ −2ε₀Ω·B in SI, in a flat-spacetime quasistatic approximation neglecting the current term. Distinguish n_GJ = |ρ_GJ|/e from the total electron–positron density. Connect to the light cylinder and charge-starved acceleration gaps without extending the approximation throughout the magnetosphere.'],
          reference: ['Goldreich & Julian (1969)', 'https://articles.adsabs.harvard.edu/pdf/1969ApJ...157..869G']
        }
      ]
    }
  ];
  window.AstroSeries = { name, volumes, groups };
})();
