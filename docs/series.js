/* The advanced volume currently publishes a syllabus, not completed lessons. */
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
      title: ['球対称の平衡と、その限界', 'Spherical equilibrium and its limits'],
      intro: ['入門編のビリアル定理と白色矮星から、内部構造を解く段階へ。', 'From the foundational virial theorem and white dwarfs to solving internal structure.'],
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
        }
      ]
    },
    {
      title: ['流体の時間発展と相似解', 'Fluid evolution and similarity solutions'],
      intro: ['時間と空間を組み替え、変化する現象を同じ形で読む。', 'Combine space and time into variables that reveal a recurring profile.'],
      bridge: 'structure',
      topics: [
        {
          id: 'sedov', title: ['Sedov–Taylor爆風解', 'Sedov–Taylor blast waves'],
          question: ['放出エネルギーと周囲の密度から、爆風の半径はどう成長するか。', 'How does a blast radius grow given an explosion energy and ambient density?'],
          method: ['次元解析で膨張則を求め、相似変数で内部の速度・密度・圧力を解く。強い衝撃波、エネルギー保存などの条件を確認する。', 'Obtain the expansion law by dimensional analysis, then use a similarity variable to solve the internal profiles. State strong-shock and energy-conservation assumptions.'],
          reference: ['Taylor (1950)', 'https://homepage.physics.uiowa.edu/~ghowes/teach/2023phys7729/docs/Taylor50a.pdf']
        },
        {
          id: 'isothermal-collapse', title: ['Larson–Penston／Shuの等温崩壊', 'Larson–Penston and Shu isothermal collapse'],
          question: ['同じ等温ガスの方程式から、なぜ異なる崩壊解が選ばれるか。', 'Why do the same isothermal gas equations admit different collapse solutions?'],
          method: ['球対称の流体方程式を相似変換し、音速点と初期・境界条件を調べる。両者を自動的な前後の進化段階として扱わない。', 'Apply similarity transformations to spherical gas dynamics and examine sonic points and initial/boundary conditions. Do not identify the two solutions as automatically successive stages.'],
          reference: ['Shu (1977)', 'https://articles.adsabs.harvard.edu/pdf/1977ApJ...214..488S']
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
      intro: ['原始惑星系円盤を入口に、αとQを二本柱として学ぶ。', 'Use protoplanetary disks to connect angular-momentum transport and Toomre Q.'],
      bridge: 'matter',
      topics: [
        {
          id: 'alpha-disk', title: ['薄い円盤とShakura–Sunyaevのαモデル', 'Thin disks and the Shakura–Sunyaev alpha model'],
          question: ['回転するガスが中心へ落ちるには、角運動量をどう運べばよいか。', 'How must a rotating gas redistribute angular momentum to accrete?'],
          method: ['鉛直平衡から厚みを見積もり、有効粘性ν＝αc_sHを導入。αが輸送効率のモデルであり、輸送の原因自体を決めないことを明示する。', 'Estimate the scale height from vertical balance and introduce effective viscosity ν = αc_sH. Explain that alpha parametrizes transport efficiency rather than determining its physical cause.'],
          reference: ['Chambers (2009) · Viscous disk model', 'https://doi.org/10.1088/0004-637x/705/2/1206']
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
    }
  ];
  window.AstroSeries = { name, volumes, groups };
})();
