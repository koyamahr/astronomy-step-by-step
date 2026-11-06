/* Worked final syllabus chapters; mathematical inputs and plot limits are explicit. */
(() => {
  'use strict';
  const A=window.AstroAdvanced, topics=window.AstroSeries.groups.flatMap(g=>g.topics);
  let language='ja';
  const t=(ja,en)=>language==='ja'?ja:en;
  const p=(ja,en)=>`<p>${t(ja,en).replace(/\b([A-Za-z]+)_([A-Za-z]+)/g,'$1<sub>$2</sub>')}</p>`;
  const f=(a,b)=>`<span class="frac"><span>${a}</span><span>${b}</span></span>`;
  const eq=html=>`<div class="equation"><div class="math">${html}</div></div>`;
  const s=(n,ja,en,...body)=>`<section><h2><span class="step-no">${String(n).padStart(2,'0')}</span>${t(ja,en)}</h2>${body.join('')}</section>`;
  const note=(ja,en)=>`<aside class="callout">${t(ja,en)}</aside>`;
  const lab=id=>`<div data-lab="${id}"></div>`;
  Object.assign(A.sources,{
    hayashiNotes:['Princeton · Hayashi limit, equations (s2.26)–(s2.32)','https://www.astro.princeton.edu/~gk/A403/hayashi.pdf'],
    ellipsoidNotes:['Fitzpatrick · Hydrostatics: ellipsoidal potentials and rotating figures','https://farside.ph.utexas.edu/teaching/336L/Fluidhtml/node36.html'],
    virialTensor:['Lebovitz (1961) · The virial tensor and rotating figures','https://articles.adsabs.harvard.edu/pdf/1961ApJ...134..500L'],
    zeldovich1970:['Zel’dovich (1970) · Gravitational instability: an approximate theory','https://www.giss.nasa.gov/staff/mway/cluster/zeldovich.pdf'],
    shu1977:['Shu (1977) · Self-similar collapse of isothermal spheres','https://articles.adsabs.harvard.edu/pdf/1977ApJ...214..488S'],
    hunter1977:['Hunter (1977) · The collapse of unstable isothermal spheres','https://articles.adsabs.harvard.edu/pdf/1977ApJ...218..834H'],
    collapseStudy:['Gong & Ostriker (2009) · Protostar formation in supersonic flows','https://arxiv.org/abs/0904.3568'],
    clusterNotes:['van den Bosch · Astrophysical flows: gravitational encounters and relaxation','https://www.astro.yale.edu/vdbosch/Astrophysical_Flows.pdf'],
    cohn1979:['Cohn (1979) · Numerical integration of the Fokker–Planck equation','https://articles.adsabs.harvard.edu/pdf/1979ApJ...234.1036C'],
    gravothermal1968:['Lynden-Bell & Wood (1968) · The gravothermal catastrophe','https://academic.oup.com/mnras/article/138/4/495/2604346'],
    gravothermalStudy:['Sormani & Bertin (2013) · Stability under different thermodynamic constraints','https://doi.org/10.1051/0004-6361/201220665'],
    diskSimilarity1974:['Lynden-Bell & Pringle (1974) · The evolution of viscous discs','https://academic.oup.com/mnras/article/168/3/603/990948'],
    diskSimilarityNotes:['Tanaka · Fundamentals of planet formation: viscous disk similarity','https://jupiter.astr.tohoku.ac.jp/~hidekazu/lecture/planetform_basic_english.pdf'],
    gj1969:['Goldreich & Julian (1969) · Pulsar electrodynamics','https://articles.adsabs.harvard.edu/pdf/1969ApJ...157..869G']
  });
  const chapters=[];
  function ch(id,minutes,prereq,goal,question,answer,refs,bridge='virial') {
    const topic=topics.find(x=>x.id===id);
    chapters.push({id,title:topic.title,desc:topic.question,minutes,prereq,goal,question,answer,refs,bridge});
  }
  ch('hayashi',35,['Lane–Emden章、理想気体、微積分とべき乗','Lane–Emden, ideal gas, calculus and powers'],['光球の境界条件と対流の近似を結び、有効温度が変わりにくい理由と重力収縮の時間を導く。','Connect photospheric and convective assumptions to a nearly constant effective temperature and a contraction timescale.'],['この章の不透明度の指数で、質量を固定して半径を半分にすると、有効温度と光度はそれぞれ何倍か。','With this chapter’s opacity powers, halve radius at fixed mass. How do effective temperature and luminosity change?'],['ε＝1/43.8なので温度は2<sup>−ε</sup>≈0.984倍、光度は2<sup>−(2+4ε)</sup>≈0.235倍。温度の変化は小さく、主な明るさの変化は表面積から来る。この係数は精密な恒星進化計算ではなく、指定した大気近似の結果。','With ε = 1/43.8, temperature changes by 2<sup>−ε</sup> ≈ 0.984 and luminosity by 2<sup>−(2+4ε)</sup> ≈ 0.235. The small temperature change leaves area as the main luminosity factor. These powers belong to the stated atmosphere approximation, not a detailed evolution calculation.'],['hayashiNotes'],'structure');
  ch('ellipsoids',30,['Newton重力、積分、Poisson方程式','Newtonian gravity, integration and Poisson’s equation'],['均質楕円体の内部重力を三つの係数で表し、球の極限、軸比、位置による変化を確かめる。','Express a homogeneous ellipsoid’s interior gravity through three coefficients and check axis ratios, positions and the spherical limit.'],['a＝b＝c＝RならA₁、A₂、A₃はいくつになり、内部重力はどの式へ戻るか。','For a = b = c = R, what are the three A coefficients and the interior gravitational field?'],['対称性とA₁＋A₂＋A₃＝2から各Aᵢ＝2/3。gᵢ＝−(4π/3)Gρxᵢで、一様な球の内部では重力が中心からの距離に比例する。外部の逆二乗則とは別の式である。','Symmetry and the sum rule give Aᵢ = 2/3. Thus gᵢ = −(4π/3)Gρxᵢ: interior gravity grows linearly with distance. This differs from the exterior inverse-square field.'],['ellipsoidNotes','virialTensor']);
  ch('tensor-virial',40,['楕円体章、行列、運動方程式','The ellipsoid chapter, matrices and equations of motion'],['テンソルビリアルを導き、MaclaurinとJacobiの平衡条件を解き、分岐と安定性を区別する。','Derive tensor virial balance, solve Maclaurin and Jacobi equilibria, and distinguish bifurcation from stability.'],['一様流体のMaclaurin模型で離心率e＝0.85なら、弱い粘性による不安定性と、理想流体の力学的不安定性をどう区別するか。','At e = 0.85 on the homogeneous Maclaurin sequence, distinguish weak-viscosity instability from dynamical instability.'],['0.81267より大きいので粘性がある場合の永年不安定性の領域にあるが、力学的なbar型不安定性のしきい値0.95289には達していない。回転星一般の普遍的なしきい値ではなく、均質・非圧縮模型の摂動結果。','It lies above the secular threshold 0.81267 but below the dynamical bar-mode threshold 0.95289. These are perturbation results for a homogeneous incompressible fluid, not universal rotating-star thresholds.'],['virialTensor','ellipsoidNotes']);
  ch('zeldovich',30,['宇宙膨張、質量保存、微分と行列式','Cosmic expansion, mass conservation, derivatives and determinants'],['ラグランジュ写像のJacobianから密度を求め、パンケーキと軌道交差の意味を説明する。','Obtain density from a Lagrangian map’s Jacobian and explain pancakes and shell crossing.'],['一次元の正弦波模型でDA＝0.8のとき、最も密な場所のρ/ρ̄はいくつか。DA＝1で何が破れるか。','In the one-dimensional sinusoidal model, what is the peak density ratio at DA = 0.8? What fails at DA = 1?'],['ρ/ρ̄＝1/(1−DA)＝5。密度コントラストδは4である。DA＝1では写像の微分が0となりcausticを作る。その先は一つの位置に複数の流れが来るので、単一流の密度式をそのまま延長できない。粒子の総質量が無限になるわけではない。','ρ/ρ̄ = 1/(1−DA) = 5, so δ = 4. At DA = 1 the map derivative vanishes and a caustic forms. Multiple streams can then occupy one location, invalidating a single-stream continuation; total particle mass does not become infinite.'],['zeldovich1970'],'expansion');
  ch('isothermal-collapse',40,['Bondi・Lane–Emden章、偏微分と相似変換','Bondi and Lane–Emden, partial derivatives and similarity scaling'],['等温崩壊の相似方程式を作り、ShuとLPHの境界条件、音速点、内外の漸近形を区別する。','Formulate similarity collapse and distinguish Shu/LPH boundary conditions, sonic points and asymptotic profiles.'],['同じ解の族で音速を2倍にし、中心形成後の同じ時間で比べると、降着率・中心質量・相似半径は何倍か。','Within one solution family, double sound speed and compare at the same time after central formation. How do rate, central mass and similarity radius scale?'],['降着率はcₛ³/Gに比例して8倍、中心質量も8倍、相似半径cₛtは2倍。係数m₀は族ごとに異なり、音速を変えただけでShuとLPHが切り替わるわけではない。','The rate and central mass increase by eight; cₛt doubles. The coefficient m₀ depends on the solution family. Changing sound speed alone does not switch between Shu and LPH.'],['shu1977','hunter1977','collapseStudy']);
  const bodies={};
  bodies.hayashi=()=>[
    s(1,'冷たい星の表面と、対流する内部','A cool photosphere and convective interior',
      p('核融合がまだ主な熱源でない前主系列星は、重力収縮で光る。完全対流に近い内部は、単原子の理想気体ならn＝3/2のポリトロープで近似できる。表面の温度は、内部だけでなく光が逃げる大気の条件と合わせて決まる。','A pre-main-sequence star can shine through contraction before nuclear reactions dominate. Approximate a fully convective monatomic ideal-gas interior by an n = 3/2 polytrope. Its surface temperature also requires a boundary condition where light escapes.'),
      eq(`P = Kρ<sup>5/3</sup>,　P = ℛρT,　ℛ ≡ ${f('k<sub>B</sub>','μm<sub>p</sub>')}<br>K ∝ GM<sup>1/3</sup>R`),
      p('最後の比例式はLane–Emdenのn＝3/2で中心密度を消したもの。組成と理想気体の近似を固定する。実際の電離や表面近くの超断熱層は、この単純な断熱模型から外れる。','The last scaling follows by eliminating central density from the n = 3/2 Lane–Emden structure. Hold composition fixed. Partial ionization and a superadiabatic surface layer limit this idealized adiabat.')),
    s(2,'光球の圧力を、大気から指定する','Supply a photospheric pressure',
      p('薄い平面大気ではdP/dτ＝g/κ。光球をτ≈2/3とし、層内でgとκを代表値に置くとPph≈2g/(3κph)を得る。κは質量あたりの不透明度で、ここではH⁻が効く低温の近似を入力する。微視的な導出は主題にしない。','In a thin plane atmosphere dP/dτ = g/κ. Taking representative g and κ at optical depth about 2/3 gives Pph ≈ 2g/(3κph). Supply an approximate low-temperature H⁻ opacity per unit mass; microscopic opacity theory is outside this chapter.'),
      eq(`P<sub>ph</sub> ≈ ${f('2g','3κ<sub>ph</sub>')},　g = ${f('GM','R²')}<br>κ = κ₀ρ<sup>a</sup>T<sup>b</sup>,　a = ${f('1','2')},　b = 7.7`),
      p('このべき乗は温度や組成の限られた範囲で使う近似である。係数κ₀を無次元と考えたり、この式をすべての恒星へ延長したりしない。光球温度を有効温度と近似して内部へつなぐ。','The opacity power law has a limited temperature/composition range, and κ₀ carries units. Approximate the photospheric temperature by effective temperature to connect the atmosphere and interior; do not extrapolate the law to all stars.')),
    s(3,'大きな温度指数が、弱い温度依存を生む','A strong opacity power gives a weak temperature scaling',
      p('理想気体でρ＝P/(ℛT)を消し、対流の式からP＝(ℛT)⁵ᐟ²K⁻³ᐟ²を作る。光球の条件へ代入して、同じK、M、Rを含む項をまとめる。','Eliminate density with ρ = P/(ℛT). The adiabat then gives P = (ℛT)⁵ᐟ²K⁻³ᐟ². Substitute into the photospheric condition and collect the powers of K, M and R.'),
      eq(`P<sup>a+1</sup> ∝ gκ₀<sup>−1</sup>ℛ<sup>a</sup>T<sup>a−b</sup><br>T<sub>eff</sub><sup>3a+2b+5</sup> ∝ κ₀<sup>−2</sup>M<sup>a+3</sup>R<sup>3a−1</sup>`),
      eq(`T<sub>eff</sub> ∝ M<sup>3.5/21.9</sup>R<sup>0.5/21.9</sup>,　ε ≡ ${f('1','43.8')} ≈ 0.02283<br>L = 4πR²σ<sub>SB</sub>T<sub>eff</sub>⁴ ∝ R<sup>2+4ε</sup>　(${t('M一定','fixed M')})`),
      p('半径を大きく変えても温度はわずかしか動かないので、H–R図ではほぼ縦の道すじになる。この低温側の境界を林限界と呼ぶ。近似式はその傾きを見積もるもので、精密な大気計算や禁止領域の証明を置き換えない。','A large radius change produces little temperature change, giving a nearly vertical H–R path. The cool boundary is the Hayashi limit. This scaling estimates its slope; it does not replace a detailed atmosphere calculation or establish every forbidden configuration.')),
    s(4,'明るさから収縮の時間を求める','Use luminosity to time contraction',
      p('核反応・降着・質量放出を省き、n＝3/2の全エネルギーをE＝−3GM²/(7R)とする。L＝−dE/dtから半径の時間発展を積分できる。ℓ＝2+4ε、初期値をR₀、L₀と置く。','Omit nuclear burning, accretion and mass loss, and take total energy E = −3GM²/(7R). Integrating L = −dE/dt gives a contraction law. Write ℓ = 2+4ε and use initial radius R₀ and luminosity L₀.'),
      eq(`L = −${f('3GM²','7R²')}${f('dR','dt')},　${f('R','R₀')} = (1+${f('t','t₀')})<sup>−1/(ℓ+1)</sup><br>t₀ = ${f('3GM²','7(ℓ+1)R₀L₀')}`),lab('hayashi'),
      note('図はR₀＝3太陽半径、T₀＝4000 K×(M/M☉)<sup>3.5/21.9</sup>を選んだ重力収縮の教材模型。温度の絶対値は入力で、κ₀から較正していない。主系列到達時刻、放射核の形成、実在星の進化トラックは計算していない。','The teaching model chooses R₀ = 3 solar radii and T₀ = 4000 K × (M/M☉)<sup>3.5/21.9</sup>. The temperature normalization is supplied, not calibrated from κ₀. Main-sequence arrival, radiative-core formation and realistic stellar tracks are not computed.')),
    s(5,'林トラックを離れるとき','Leaving a Hayashi track',
      p('内部に放射で熱を運ぶ領域ができると、全体をn＝3/2とする近似が使えなくなる。より高温側へ移るHenyeyトラックを理解するには、放射輸送と内部構造も解く必要がある。ほぼ縦に下がるすべての線を、同じ質量・同じ進化段階の軌道と思わない。','A radiative interior invalidates a single n = 3/2 convective model. Following a hotter Henyey track requires radiative transport and internal structure. Different nearly vertical curves need not describe the same mass or evolutionary phase.'),
      p('図の再生は、明示したエネルギー式の時間を進める。単に観測図の点を動かしたものではないが、原論文の数値トラックを再現したものでもない。温度の弱い依存と、エネルギー供給による時間の区別を読み取ろう。','Playback advances the specified energy model. It is more than moving an observational point, but it does not reproduce published numerical tracks. Separate the weak temperature dependence from the energy budget that sets elapsed time.'))
  ].join('');
  bodies.ellipsoids=()=>[
    s(1,'球の外へ、形の自由度を増やす','Let the shape depart from a sphere',
      p('密度ρが一定で半軸がa、b、cの楕円体を考える。星や銀河の精密模型ではなく、形が重力を変える仕組みを取り出したNewton模型である。内部点の条件はx²/a²+y²/b²+z²/c²≤1。','Consider a homogeneous Newtonian ellipsoid with semiaxes a, b and c. It isolates the effect of shape rather than modelling a realistic star or galaxy. Interior points satisfy x²/a²+y²/b²+z²/c² ≤ 1.'),
      eq(`M = ${f('4π','3')}ρabc,　Φ = Φ₀+πGρ(A₁x²+A₂y²+A₃z²)`),
      p('ポテンシャルが位置の二次式なので、内部の力は各座標に比例する。外部まで同じ二次式を使うことはできない。Φ₀は無限遠でΦ＝0とする規約で決まる定数である。','A quadratic interior potential gives forces linear in coordinates. This expression does not describe the exterior. The constant Φ₀ uses the convention that potential vanishes at infinity.')),
    s(2,'三つの係数を、一つの積分で定義する','Define three coefficients by quadrature',
      eq(`Δ(u) ≡ √[(a²+u)(b²+u)(c²+u)]<br>Aᵢ = abc∫<sub>0</sub><sup>∞</sup>${f('du','(aᵢ²+u)Δ(u)')},　Φ₀ = −πGρabc∫<sub>0</sub><sup>∞</sup>${f('du','Δ(u)')}`),
      p('この積分表示をNewtonポテンシャルを積み重ねた既知の解として使う。uの次元は長さの二乗で、Aᵢは無次元。三軸を同じ倍率で伸ばしてもAᵢは変わらず、軸比だけで決まる。','Use the integral representation as the supplied solution obtained from Newtonian potential theory. u has units of length squared; the Aᵢ are dimensionless and depend only on axis ratios. A common rescaling of all axes leaves them unchanged.'),
      eq(`gᵢ = −${f('∂Φ','∂xᵢ')} = −2πGρAᵢxᵢ`),
      p('図は積分の上端∞を有限区間に写して数値積分する。三係数を独立に求めてから、次の和の条件で検算する。正しい和へ強制的に規格化してはいない。','The panel maps the infinite integration interval to a finite one. It computes each coefficient independently and checks the sum below rather than enforcing it by renormalization.')),
    s(3,'Poisson方程式を満たすか','Check Poisson’s equation',
      p('1/Δの微分は−(1/2Δ)Σ1/(aᵢ²+u)。これを積分すると係数の和が境界値だけで決まる。内部のLaplacianへ代入すればPoisson方程式を確かめられる。','Differentiate 1/Δ to obtain −(1/2Δ)Σ1/(aᵢ²+u). Its integral fixes the coefficient sum from endpoint values. Inserting it into the interior Laplacian checks Poisson’s equation.'),
      eq(`A₁+A₂+A₃ = −2abc[${f('1','Δ(u)')}]<sub>0</sub><sup>∞</sup> = 2<br>∇²Φ = 2πGρΣAᵢ = 4πGρ`),lab('ellipsoids'),
      p('パネルではabc＝1となるように半軸をそろえ、質量と密度を同時に固定して形だけを比較する。縦方向に薄い形ではA₃が大きくなるが、表面までの距離cも短くなる。係数だけから表面加速度の大小を決めない。','The panel fixes abc = 1, comparing shapes at fixed mass and density. Flattening can increase A₃ while shortening c, so surface acceleration depends on both the coefficient and position.')),
    s(4,'全エネルギーと球の極限','Binding energy and the spherical limit',
      eq(`W = −${f('3GM²','10')}∫<sub>0</sub><sup>∞</sup>${f('du','Δ(u)')}<br>a=b=c=R :　Aᵢ=${f('2','3')},　W=−${f('3GM²','5R')}`),
      p('Wは自己重力の全エネルギーであり、ポテンシャルを質量に積分するときの二重計数を避ける1/2を含む。図の−W/(GM²)は長さの逆数。等体積半径を1にした比較なので、表示値をそのままジュールと読まない。','W includes the factor of one half preventing double counting of pair energy. −W/(GM²) has inverse-length units. The panel fixes the equal-volume radius to one; its displayed energy factor is not in joules.'),
      p('球の極限と軸の入れ替えは強い検算になる。数値積分で和が2、球で各2/3となることを確認してから、細長い形へ進もう。','The spherical limit and permutations of the axes give independent checks. Verify the sum of two and each spherical value of two thirds before examining elongated shapes.')),
    s(5,'回転する形へつなぐ','Add rotation and pressure',
      p('均質な形を指定するだけでは、平衡にあるとは限らない。圧力や回転によって表面全体で同じ有効ポテンシャルを作れるかを調べる必要がある。次の<a href="#/advanced/tensor-virial">テンソルビリアル章</a>でその条件を組み立てる。','A prescribed homogeneous shape need not be an equilibrium. Pressure and rotation must support an equipotential boundary. The <a href="#/advanced/tensor-virial">tensor-virial chapter</a> constructs this additional condition.'),
      note('操作図は均質楕円体の積分式の再計算。楕円銀河の観測像や論文のN体計算図を再現したものではない。恒星の衝突なしの平衡には、速度分散と軌道分布も必要になる。','The plot recomputes the homogeneous-ellipsoid integrals, not observations or N-body figures. A collisionless stellar system also needs a velocity-dispersion tensor and an orbital distribution.'))
  ].join('');
  bodies['tensor-virial']=()=>[
    s(1,'方向ごとに、広がりの二階微分を数える','Track the second derivative of size along each direction',
      p('球でない天体では、同じ全エネルギーでも方向ごとの支えが異なる。慣性テンソルIᵢⱼを時間で二度微分し、連続の式とEuler方程式を使う。表面圧0の流体で、磁場を省くと次の形になる。','Different directions can require different support even at the same total energy. Differentiate the inertia tensor twice and use continuity and Euler’s equation. For an unmagnetized fluid with zero surface pressure:'),
      eq(`Iᵢⱼ = ∫ρxᵢxⱼdV,　Tᵢⱼ = ${f('1','2')}∫ρvᵢvⱼdV<br>${f('1','2')}Ïᵢⱼ = 2Tᵢⱼ+Wᵢⱼ+Πδᵢⱼ<br>Wᵢⱼ = −∫ρxᵢ${f('∂Φ','∂xⱼ')}dV,　Π=∫PdV`),
      p('対角成分を足すと通常のスカラービリアルへ戻る。恒星の集団ではランダム運動の応力を入れるが、ここでは流体の圧力Πを使う。二つを重複して数えない。','Taking the trace recovers the scalar virial theorem. Random orbital stresses enter a stellar system; here Π represents fluid pressure. Do not double count these supports.')),
    s(2,'均質楕円体を入れる','Insert the homogeneous ellipsoid',
      eq(`Iᵢᵢ = ${f('Maᵢ²','5')},　Wᵢᵢ = −2πGρAᵢIᵢᵢ<br>Φ<sub>eff</sub> = Φ−${f('Ω²','2')}(x²+y²)`),
      p('一様に回転する非圧縮流体では、共回転系のEuler方程式を積分してP/ρ＋Φeff＝定数となる。表面でP＝0なら、三軸の端でΦeffが同じでなければならない。','A uniformly rotating incompressible fluid obeys P/ρ + Φeff = constant in its rotating frame. Zero pressure at the surface requires equal effective potentials at the three axis endpoints.'),
      eq(`(A₁−ω²/2)a²=(A₂−ω²/2)b²=A₃c²,　ω² ≡ ${f('Ω²','πGρ')}`),
      note('Jacobi図形は慣性系で回転しているので、個々のIᵢⱼを時間一定としてはいけない。たとえばÏ₁₁＝2Ω²(I₂₂−I₁₁)。これをビリアル式へ入れても同じ表面条件になる。形が共回転系で一定でも、慣性系の成分が一定とは限らない。','A Jacobi figure rotates in the inertial frame: Ï₁₁ = 2Ω²(I₂₂−I₁₁), rather than zero. Including this term recovers the same surface condition. A fixed shape in a rotating frame need not have fixed inertial tensor components.')),
    s(3,'Maclaurin：軸対称の系列','Maclaurin: an axisymmetric sequence',
      p('a＝b、q＝c/a、e＝√(1−q²)を置けば、赤道の二条件は同じになる。前章のAᵢを使って角速度を求められる。','For a = b, q = c/a and e = √(1−q²), the two equatorial conditions coincide. Use the previous chapter’s coefficients to obtain angular speed.'),
      eq(`ω²=2(A₁−q²A₃)<br> = ${f('2√(1−e²)','e³')}[(3−2e²)sin<sup>−1</sup>e−3e√(1−e²)]`),
      p('e→0ではω²≈(8/15)e²となり、球では回転は0。角速度は扁平さとともに永遠に増えるわけではない。同じ角速度に異なる形が対応する場合もあり、角速度だけでは系列上の位置を決められない。','At small e, ω² ≈ (8/15)e², so the spherical limit has zero rotation. Angular speed does not grow monotonically forever with flattening; it need not uniquely identify a figure.')),
    s(4,'Jacobi：三軸の系列を解く','Jacobi: solve a triaxial sequence',
      p('a＝1を長さの単位とし、p＝b/a、q＝c/aとする。二つの赤道条件からω²を消すと、pに対するqの方程式が得られる。図ではAᵢを積分し、qを二分法で選ぶ。','Set a = 1 and use p = b/a and q = c/a. Eliminate ω² between the equatorial conditions. The panel integrates Aᵢ and bisects for q at each specified p.'),
      eq(`${f('A₂−A₁','p<sup>−2</sup>−1')}=A₃q²,　ω²=2(A₁−A₃q²)`),lab('tensor-virial'),
      p('数値の照合例として、FitzpatrickのTable 2.2でe₁₂＝0.6、つまりb/a＝0.8の点はe₁₃≈0.85585、Ω/√(2πGρ)≈0.42827である。パネルの角速度の規格化はΩ²/(πGρ)なので、2で割って平方根を取ると参照表と比較できる。', 'As a reference check, Fitzpatrick Table 2.2 gives e₁₃ ≈ 0.85585 and Ω/√(2πGρ) ≈ 0.42827 at e₁₂ = 0.6, or b/a = 0.8. The panel uses Ω²/(πGρ); divide by two and take its square root before comparing to that table.'),
      p('Maclaurin側のeとJacobi側のpを別々に動かして比較する。二つの形は同じ角運動量の組ではない。解の連続的な系列を計算したもので、片方が時間とともに他方へ変形する流体計算ではない。','The two controls select independent equilibria, not an equal-angular-momentum pair. These are calculated equilibrium sequences, not a time-dependent transformation from one fluid shape to another.')),
    s(5,'分岐と、二種類の不安定性','Bifurcation and two kinds of instability',
      p('Jacobi系列はMaclaurinのe≈0.81267、T/|W|≈0.1375から分岐する。弱い粘性がある場合の永年不安定性と、e≈0.95289、T/|W|≈0.2738で始まる理想流体の力学的bar不安定性は別である。これらは摂動解析の既知の結果として使う。','The Jacobi branch bifurcates near e = 0.81267 and T/|W| = 0.1375. Weak-viscosity secular instability differs from the ideal-fluid dynamical bar instability near e = 0.95289 and T/|W| = 0.2738. These thresholds are supplied perturbation results.'),
      eq(`T=${f('MΩ²(a²+b²)','10')},　W=−${f('2πGρM','5')}ΣAᵢaᵢ²`),
      note('平衡条件を解いただけでは安定性は証明できない。圧縮性、差動回転、磁場、相対論、衝突のない恒星系では条件が変わる。Jacobi系列全体が安定という主張もしない。図は平衡の解析式を再計算し、原図の全曲線や摂動固有値を再現してはいない。','Solving equilibrium does not prove stability. Compressibility, differential rotation, fields, relativity and collisionless dynamics change the problem. No stability claim is made for the entire Jacobi branch; these plots recompute equilibrium equations, not all paper curves or perturbation eigenvalues.'))
  ].join('');
  bodies.zeldovich=()=>[
    s(1,'粒子の名前を固定して、位置を動かす','Label particles and move their positions',
      p('初期位置を表すラグランジュ座標qと、後の共動位置xを結ぶ。Zel’dovich近似は、初期の変位の方向を保ち、大きさを線形成長因子Dで増やす。物理位置はr＝axで、背景の膨張と固有の変位を分けている。','Map initial Lagrangian labels q to later comoving positions x. The Zel’dovich approximation keeps the initial displacement direction and multiplies its amplitude by linear growth D. Physical position is r = ax, separating background expansion from peculiar displacement.'),
      eq(`x(q,t)=q+D(t)s(q),　r=a(t)x`),
      p('これは軌道を最後まで厳密に解いた式ではない。成長モードの初期条件を使う一階のラグランジュ摂動論であり、圧力のない物質の軌道交差前を主な対象とする。','This is first-order Lagrangian perturbation theory with growing-mode initial data, not an exact general orbit solution. It primarily describes pressureless matter before shell crossing.')),
    s(2,'体積の変化から密度を求める','Density follows the volume Jacobian',
      p('同じ粒子集合の質量は保存される。初期の小体積d³qが、写像の行列式Jを掛けたd³xへ変わるので、密度はその逆数になる。','The mass of a labelled element is conserved. A small initial volume d³q maps to d³x = Jd³q; density therefore varies as the inverse determinant.'),
      eq(`J=det(δᵢⱼ+D${f('∂sᵢ','∂qⱼ')}),　${f('ρ','ρ̄')}=${f('1','J')}`),
      p('ポテンシャル型の変位で、−∂sᵢ/∂qⱼの固有値をλ₁、λ₂、λ₃とすれば、三方向の圧縮を別々に読める。最も大きな正の固有値の方向が先につぶれる。','For potential displacements, let λᵢ be eigenvalues of −∂sᵢ/∂qⱼ. Each direction has its own compression factor; the largest positive eigenvalue reaches collapse first.'),
      eq(`${f('ρ','ρ̄')}=${f('1','(1−Dλ₁)(1−Dλ₂)(1−Dλ₃)')}`)),
    s(3,'一方向が先につぶれるとパンケーキになる','One collapsing direction gives a pancake',
      p('三方向が同時につぶれるには特別な対称性が必要である。一方向だけが先に大きく圧縮されれば、薄いシートに近い形になる。この幾何学がパンケーキという名前の由来である。','Simultaneous collapse along three axes requires special symmetry. Compression along one direction first produces a sheet-like structure, hence the name pancake.'),
      eq(`s(q)=−${f('A','k')}sin(kq),　x=q−${f('DA','k')}sin(kq)<br>J=1−DAcos(kq),　${f('ρ','ρ̄')}=${f('1','1−DAcos(kq)')}`),lab('zeldovich'),
      p('図はk＝1の周期的な一次元模型。等間隔の粒子が集まる図と、同じ写像のEuler位置での密度を同時に描く。再生はDを増やす比較で、宇宙時間に等間隔の動画ではない。','The periodic one-dimensional panel uses k = 1. It displays equally spaced particle labels and the density at their mapped Eulerian positions. Playback advances D uniformly, not cosmic time.')),
    s(4,'軌道交差の先には別の記述がいる','Shell crossing ends the single-stream description',
      p('DA＝1で最初のJ＝0が現れ、causticができる。粒子の重なりはダークマターなら複数流として扱えるが、ガスなら圧力と衝撃波も重要になる。単に負のJをそのまま密度に入れると、物理的でない負の密度になってしまう。','At DA = 1 the first zero Jacobian forms a caustic. Collisionless matter can develop multiple streams; gas also needs pressure and shocks. Extending 1/J through negative Jacobians would give an unphysical negative density.'),
      note('操作範囲はDA≤0.95に制限している。図は崩壊後の銀河や衝撃波を計算せず、原論文のN体計算を再現していない。密度のピークが高くても、周期内の総質量は一定である。','Controls stop at DA ≤ 0.95. The panel does not compute post-collapse galaxies, shocks or published N-body results. Even as a peak grows, the mass in one period stays fixed.')),
    s(5,'Press–Schechterとの役割の違い','Connect geometry to halo statistics',
      p('Zel’dovichは位置の写像と形を、<a href="#/advanced/press-schechter">Press–Schechter</a>は平滑化したゆらぎからハローの統計を近似する。球対称の崩壊しきい値と、異方的な一方向の交差は同じ条件ではない。','Zel’dovich approximates positions and shapes; <a href="#/advanced/press-schechter">Press–Schechter</a> estimates halo statistics from smoothed fluctuations. A spherical-collapse threshold and anisotropic first shell crossing are different criteria.'),
      p('初期の変位の場を与えれば多次元にも拡張できるが、交差後にはN体法などが必要になる。近似が失敗する場所を知ることも、この解の大切な使い方である。','A specified displacement field extends the construction to multiple dimensions, while post-crossing evolution needs methods such as N-body dynamics. Identifying where the approximation fails is part of using it correctly.'))
  ].join('');
  bodies['isothermal-collapse']=()=>[
    s(1,'同じ方程式でも、境界条件が違う','The same equations can select different flows',
      p('等温、球対称、自己重力のあるガスの連続・運動・質量の式から始める。温度を保つ冷却は入力とし、回転と磁場は省く。Mには中心に形成された点質量も含める。','Begin with continuity, momentum and mass for a spherical self-gravitating isothermal gas. Cooling maintaining isothermality is supplied; rotation and fields are omitted. Enclosed M includes any central point mass.'),
      eq(`${f('∂ρ','∂t')}+${f('1','r²')}${f('∂','∂r')}(r²ρu)=0<br>${f('∂u','∂t')}+u${f('∂u','∂r')}=−c<sub>s</sub>²${f('∂lnρ','∂r')}−${f('GM','r²')},　${f('∂M','∂r')}=4πr²ρ`),
      p('Shu解とLarson–Penston解を、同じ雲が自動的に順に通る段階とは扱わない。中心形成前後の時間の符号と、遠方の密度・速度を指定することが解の選択に重要である。','Shu and Larson–Penston are not automatically successive stages of one cloud. The sign of time relative to central formation and the outer density/velocity select the solution.')),
    s(2,'中心形成後の相似変数を入れる','Introduce post-formation similarity variables',
      p('中心形成をt＝0として、ここではt>0の変数を使う。各項の時間のべきをそろえて代入すれば、偏微分の問題をxだけの常微分へ変えられる。','Set central formation at t = 0 and use t > 0 here. Match time powers in each term to reduce partial differential equations to ordinary equations in x.'),
      eq(`x=${f('r','c<sub>s</sub>t')},　u=c<sub>s</sub>v(x),　ρ=${f('α(x)','4πGt²')},　M=${f('c<sub>s</sub>³t','G')}m(x)<br>m=x²α(x−v),　m′=x²α`),
      eq(`[(x−v)²−1]v′=[α(x−v)−${f('2','x')}](x−v)<br>[(x−v)²−1]${f('α′','α')}=[α−${f('2(x−v)','x')}](x−v)`),
      p('音速点x−v＝1で有限の傾きを持つには、α＝2/xも必要になる。分母だけを割って積分すると0/0になるため、正則な臨界枝と大域的な境界条件を同時に選ぶ。','A regular sonic point x−v = 1 also requires α = 2/x. Directly dividing by the vanishing denominator fails; select a regular critical branch together with global boundary conditions.')),
    s(3,'Shu解：静止した特異等温球から内側へ','Shu: inside-out collapse from a singular isothermal sphere',
      eq(`x≥1 :　v=0,　α=${f('2','x²')},　ρ=${f('c<sub>s</sub>²','2πGr²')}<br>x→0 :　m→m₀,　v≈−√(${f('2m₀','x')}),　α≈√(${f('m₀','2x³')})`),
      p('外側は静止した特異等温球で、x＝1の膨張波が内向きの崩壊の開始を伝える。内側のr⁻³ᐟ²の密度と自由落下速度は、中心質量が支配する近似である。正則な大域解を選んだ数値結果m₀≈0.975を使う。','The exterior is a static singular isothermal sphere, with an expansion wave at x = 1 marking the onset of infall. Inner r⁻³ᐟ² density and free-fall velocity apply where central mass dominates. Use the supplied global-solution result m₀ ≈ 0.975.'),
      eq(`Ṁ=m₀${f('c<sub>s</sub>³','G')},　M<sub>central</sub>=m₀${f('c<sub>s</sub>³t','G')}`)),
    s(4,'LPH解：外側からすでに流入している場合','LPH: an envelope already flowing inward',
      p('Larson–Penstonの中心形成前の解をHunterが中心形成後へ継続したLPH解では、遠方でα≈8.86/x²、v≈−3.28となる。外側はShu解の約4.43倍の密度で、しかも静止していない。中心への係数はm₀≈46.9である。','The Larson–Penston flow continued through central formation by Hunter has α ≈ 8.86/x² and v ≈ −3.28 far away. The envelope is about 4.43 times denser than Shu’s static sphere and is already infalling. Its central coefficient is m₀ ≈ 46.9.'),
      lab('isothermal-collapse'),
      note('図は文献のm₀と内外の漸近式を比較する。中間領域の相似ODEは数値積分せず、曲線をつながずに空けて表示する。46.9をLarson–Penstonの中心形成前の流量や、有限の雲すべての一定降着率と同一視しない。','The panel compares literature m₀ values and asymptotic formulas. It leaves the intermediate region unplotted rather than interpolating or claiming to integrate the full similarity ODE. The value 46.9 is not a universal finite-cloud rate or the pre-formation LP flux.')),
    s(5,'何を解き、何を入力したか','Separate the derived equations from supplied eigenvalues',
      p('相似方程式と自由落下の指数はこの章で追える。一方、0.975や46.9は音速点を含む大域的な境界値問題で選ばれる数値で、単なる次元解析からは決まらない。図の空白を架空の滑らかな線で埋めないことも、解の情報を正しく伝えるために必要である。','The similarity equations and free-fall powers are derived here. Coefficients 0.975 and 46.9 come from global boundary-value problems involving critical points; dimensions alone cannot determine them. Leaving the missing profile blank avoids inventing a numerical solution.'),
      p('現実には有限の質量、回転円盤、磁場、加熱が降着率を変える。<a href="#/advanced/bonnor-ebert">Bonnor–Ebert球</a>のような有限の初期平衡からの崩壊とも比較し、何を無限遠の条件にしたのかを確認する。','Finite reservoirs, disks, fields and heating change real accretion. Compare with collapse from a finite initial equilibrium such as a <a href="#/advanced/bonnor-ebert">Bonnor–Ebert sphere</a>, and inspect what was imposed at infinity.'))
  ].join('');
  ch('relaxation',30,['ビリアル定理、重力散乱、ランダムウォーク','Virial theorem, gravitational scattering and random walks'],['弱い遭遇を衝突係数で積分し、Coulomb対数と緩和時間を導き、交差時間との違いを説明する。','Integrate weak encounters over impact parameter to derive the Coulomb logarithm and relaxation scaling, distinct from crossing time.'],['N＝10⁴から10⁵へ増やし、星1個の質量と半質量半径を同じにすると、動力学時間と半質量緩和時間は何倍か。','Raise N from 10⁴ to 10⁵ at fixed stellar mass and half-mass radius. How do dynamical and half-mass relaxation times change?'],['動力学時間は1/√10倍。緩和時間は√10 ln(4000)/ln(40000)≈2.48倍。パネルは星1個の質量を固定している。全質量を固定する別の比較ならN/ln(0.4N)の比になる。','Dynamical time decreases by √10. Relaxation time changes by √10 ln(4000)/ln(40000) ≈ 2.48. The panel fixes mass per star; fixing total mass instead gives the ratio of N/ln(0.4N).'],['clusterNotes','cohn1979']);
  ch('fokker-planck',35,['2体緩和章、確率密度、偏微分','Two-body relaxation, probability density and partial derivatives'],['小さな確率的変化からドリフト・拡散の式を作り、保存則と星団への適用条件を確かめる。','Construct drift–diffusion from small stochastic increments and check conservation and limits for star clusters.'],['A＝−γx、B＝2Dの模型で、γ＝2、D＝0.5なら長時間後の平均と分散はいくつか。γ＝0なら何が違うか。','For A = −γx and B = 2D, let γ = 2 and D = 0.5. Find the limiting mean and variance. What changes at γ = 0?'],['平均は0、分散はD/γ＝0.25、標準偏差は0.5。γ＝0では引き戻す作用がなく、分散は初期分散＋2Dtで増え、無限のx領域では規格化された定常Gaussianへは落ち着かない。','Mean tends to zero and variance to D/γ = 0.25, giving standard deviation 0.5. With γ = 0, variance grows as its initial value plus 2Dt; no normalizable stationary Gaussian is reached on the full real line.'],['cohn1979','clusterNotes']);
  ch('gravothermal',35,['ビリアル・Bonnor–Ebert・2体緩和章','Virial, Bonnor–Ebert and two-body relaxation chapters'],['負の熱容量と熱輸送をつなぎ、固定する量によって等温球の安定性が変わることを説明する。','Connect negative heat capacity to heat flow and distinguish isothermal-sphere stability under different constraints.'],['箱の中の等温球で中心と境界の密度比が100なら、固定温度と固定全エネルギーの場合で安定性をどう区別するか。','For a boxed isothermal sphere with density contrast 100, distinguish fixed-temperature from fixed-total-energy stability.'],['100は32.1より大きく709より小さい。固定M・R・Tでは不安定側だが、固定M・R・Eでは最初の安定性限界の手前で局所エントロピー極大を保てる。開いた実際の星団へこの数字をそのまま当てはめない。','100 exceeds 32.1 but is below 709: it lies beyond the first fixed-M,R,T stability limit but before the fixed-M,R,E limit for a local entropy maximum. These boxed-model values do not directly classify an open star cluster.'],['gravothermal1968','gravothermalStudy']);
  ch('viscous-disk',40,['角運動量輸送・α円盤章、偏微分と積分','Transport and alpha-disk chapters, partial derivatives and integration'],['保存則から面密度の拡散式を導き、相似解の降着・広がり・角運動量保存を検証する。','Derive surface-density diffusion and verify accretion, spreading and angular-momentum conservation in a similarity solution.'],['γ＝1でT＝1から4へ進むと、円盤の質量、特性半径、中心降着率は何倍か。角運動量はどうなるか。','For γ = 1, increase T from 1 to 4. How do disk mass, characteristic radius, central accretion rate and angular momentum change?'],['質量はT⁻¹ᐟ²で1/2倍、特性半径はTで4倍、降着率はT⁻³ᐟ²で1/8倍。無限に広い外側と原点の無トルク境界を使う模型では、残る円盤の全角運動量は一定である。','Mass halves, characteristic radius grows by four, and central accretion rate falls by eight. Total disk angular momentum stays constant for this infinite outer disk with a zero-torque boundary at the origin.'],['diskSimilarity1974','diskSimilarityNotes'],'matter');
  ch('goldreich-julian',30,['電磁気、Gaussの法則、ベクトルの積','Electromagnetism, Gauss’s law and vector products'],['共回転電場から電荷密度を導き、SI・Gauss単位、光円柱、正味電荷と対プラズマを区別する。','Derive corotation charge density, compare SI and Gaussian units, and distinguish light-cylinder limits, net charge and pair plasma.'],['同じ磁場と位置で回転周期を2倍にすると、GJ電荷密度の絶対値、光円柱半径、整列双極子の極冠半径は何倍か。','At fixed field and location, double the spin period. How do GJ charge magnitude, light-cylinder radius and aligned-dipole polar-cap radius change?'],['電荷密度はΩに比例して1/2倍。光円柱はc/Ωで2倍、極冠半径はR*√(R*/RLC)で1/√2倍。最後の式は整列双極子での幾何学的な目安で、磁気圏全体の解ではない。','Charge magnitude halves, light-cylinder radius doubles, and the aligned-dipole cap radius decreases by √2. The last result is a geometric estimate, not a solution for the global magnetosphere.'],['gj1969'],'scattering');
  bodies.relaxation=()=>[
    s(1,'滑らかな重力場と、星の粒々','Smooth gravity and discrete encounters',
      p('星団の星は、全体の平均重力場に沿って公転しながら、他の星の近くを通るたびに少し曲げられる。多数の小さな偏向が積み重なって速度が元の大きさほど変わる時間を、2体緩和時間の目安とする。星同士の表面がぶつかる衝突とは別である。','A star orbits in a cluster’s mean field and is weakly deflected by individual neighbours. Relaxation measures accumulated velocity changes becoming comparable to the original velocity. It is distinct from direct physical collisions.'),
      p('「2体」は各遭遇の近似を指し、星団を二つの星だけで置き換える意味ではない。以下は同じ質量m、ほぼ等方的な速度、弱い散乱を多数受ける模型である。','Two-body refers to an encounter approximation, not a two-star model of the cluster. Assume equal masses, roughly isotropic velocities and many weak deflections.')),
    s(2,'一度の偏向と、遭遇の回数','One deflection and its encounter rate',
      p('相対速度vで直線的に通過し、最接近距離を表す衝突係数bが十分大きいとする。垂直方向の重力を通過中に積分すると、インパルスが得られる。','For a nearly straight passage with relative speed v and sufficiently large impact parameter b, integrate the transverse gravitational acceleration over the encounter.'),
      eq(`Δv<sub>⊥</sub>≈${f('2Gm','bv')},　dΓ=2πb n v db`),
      p('nは星の個数密度。方向のランダムな偏向を二乗して足すと、遠い遭遇も数の多さで効いてくる。db/bなので、衝突係数の各対数区間が同程度の寄与をする。','n is stellar number density. Add squared, randomly directed kicks. The larger number of distant encounters compensates their smaller individual deflections, giving comparable contributions per logarithmic impact interval.'),
      eq(`${f('d⟨Δv²⟩','dt')}≈${f('8πG²m²n','v')}∫<sub>b<sub>min</sub></sub><sup>b<sub>max</sub></sup>${f('db','b')}=${f('8πG²m²n','v')}lnΛ<br>Λ≡${f('b<sub>max</sub>','b<sub>min</sub>')},　t<sub>rel</sub>≈${f('v³','8πG²m²n lnΛ')}`)),
    s(3,'Coulomb対数と、大きさの見積もり','Coulomb logarithms and cluster scaling',
      p('電磁気と似た積分なのでCoulomb対数と呼ぶが、ここで働くのは重力である。bminは大角度散乱の尺度Gm/v²程度、bmaxは系の大きさ程度と見積もる。完全に無限な範囲の積分ではない。','The analogous encounter integral gives the name Coulomb logarithm, although the force here is gravity. Estimate bmin near the large-angle scale Gm/v² and bmax near the system size; the integral has physical cutoffs.'),
      eq(`v²∼${f('GNm','R')},　t<sub>cross</sub>∼${f('R','v')},　t<sub>rel</sub>∼${f('N','lnΛ')}t<sub>cross</sub>`),
      p('前の単純なインパルスと一様球を組み合わせた係数は1/6になる。実際の密度・速度分布を平均した係数とは違うので、見積もりの係数を精密値と混ぜない。','Combining the preceding impulse model with a uniform virial sphere gives a coefficient of 1/6. Distribution-averaged coefficients differ; do not mix this estimate with a precision convention.')),
    s(4,'半質量緩和時間を使って比較する','Compare half-mass relaxation times',
      p('実用的な標準化として、半質量半径rhでの緩和時間を次の式で与える。0.138とln(0.4N)は、この等質量の近似で採用する規約であり、上の一様球から正確に導いた係数ではない。','Adopt the following conventional equal-mass half-mass relaxation estimate. The coefficient 0.138 and choice ln(0.4N) are supplied conventions, not exact consequences of the uniform-sphere calculation.'),
      eq(`t<sub>dyn</sub>≡√(${f('r<sub>h</sub>³','GNm')}),　t<sub>rh</sub>≈${f('0.138N','ln(0.4N)')}t<sub>dyn</sub>`),lab('relaxation'),
      p('パネルはm＝0.5太陽質量を固定するので、Nを増やすと全質量も増える。t<sub>dyn</sub>はN⁻¹ᐟ²、t<sub>rh</sub>はほぼN¹ᐟ²/lnNで変わる。どの量を固定した比較かが大切である。','The panel fixes m = 0.5 solar masses, so total mass grows with N. Dynamical time scales as N⁻¹ᐟ² and relaxation approximately as N¹ᐟ²/lnN. Always state which quantities are held fixed.')),
    s(5,'質量分離と、分布の進化へ','Toward segregation and distribution evolution',
      p('質量が異なる星では、エネルギー交換の偏りも加わり、重い成分が中心へ集まる傾向がある。ただし完全な等分配が必ず実現するわけではない。連星、強い散乱、潮汐場、星の進化も長期の変化に効く。','A mass spectrum introduces systematic energy exchange and a tendency for heavier objects to segregate inward. Complete equipartition need not follow. Binaries, strong encounters, tides and stellar evolution also affect long-term evolution.'),
      p('小さな平均変化とばらつきを連続の係数へまとめると、次の<a href="#/advanced/fokker-planck">Fokker–Planck方程式</a>へ進める。この図は時間尺度の式の再計算で、特定の星団のN体軌道を再現したものではない。','Collecting small mean changes and variances into continuous coefficients leads to the <a href="#/advanced/fokker-planck">Fokker–Planck equation</a>. This panel recomputes timescale estimates, not an N-body trajectory of a particular cluster.'))
  ].join('');
  bodies['fokker-planck']=()=>[
    s(1,'個々の軌道から、確率密度へ','From trajectories to a probability density',
      p('短い時間Δtで、ある量xが確率的にΔxだけ変わるとする。平均変化と二乗変化をΔtで割った極限を、ドリフトAと拡散係数Bと定義する。大きな跳びが支配する場合には、この小変化の近似は使えない。','Suppose x receives stochastic increments Δx in short intervals Δt. Define drift A and diffusion B from the first two increment moments per unit time. This small-increment approximation fails when large jumps dominate.'),
      eq(`A(x,t)=lim${f('⟨Δx⟩','Δt')},　B(x,t)=lim${f('⟨(Δx)²⟩','Δt')}`),
      p('f(x,t)は、全実数上で積分すると1になる確率密度とする。初期状態からの変位の二乗と、一回の増分の二乗を混同しない。','Let f integrate to one over the full real line. The one-step squared increment defining B is distinct from the total squared displacement since the initial time.')),
    s(2,'小さな変化を二次まで展開する','Expand the evolution through second order',
      p('短時間の遷移確率を使って次の時刻の分布を表し、Δxで展開する。高次モーメントの寄与を無視できる極限で、Fokker–Planckの式になる。Bの定義に2を含めたかどうかで、見かけの係数が変わる。','Expand the transition-probability evolution in Δx. When higher increment moments can be neglected, the first two terms give the Fokker–Planck equation. Its apparent factor of two depends on the convention used for B.'),
      eq(`${f('∂f','∂t')}=−${f('∂(Af)','∂x')}+${f('1','2')}${f('∂²(Bf)','∂x²')}=−${f('∂J','∂x')}<br>J=Af−${f('1','2')}${f('∂(Bf)','∂x')}`),
      p('両端でJ＝0なら全確率は保存する。吸収境界なら外へ出た分だけ減る。保存するかどうかは、方程式だけでなく境界条件にも依存する。','Zero boundary flux conserves total probability; an absorbing boundary removes it. Conservation depends on boundary conditions as well as the differential equation.')),
    s(3,'解ける模型：引き戻しと拡散','A solvable model: restoring drift plus diffusion',
      p('A＝−γx、B＝2D、γ≥0、D>0を選ぶ。これはOrnstein–Uhlenbeck模型で、平衡点へ引き戻す作用とランダムな加熱を組み合わせる。Gaussianの初期分布なら、Gaussianのまま平均と分散が変わる。','Choose A = −γx, B = 2D, γ ≥ 0 and D > 0. This Ornstein–Uhlenbeck model combines restoring drift with random excitation. A Gaussian initial distribution remains Gaussian while its mean and variance evolve.'),
      eq(`${f('d⟨x⟩','dt')}=−γ⟨x⟩,　${f('dV','dt')}=−2γV+2D<br>μ(t)=μ₀e<sup>−γt</sup><br>V(t)=V₀e<sup>−2γt</sup>+${f('D','γ')}(1−e<sup>−2γt</sup>)　(γ>0)`),
      p('これらのモーメント式は、PDEにxやx²を掛けて部分積分すれば得られる。γ＝0の極限はV＝V₀＋2Dtで、分散が増え続ける。','Multiply the PDE by x or x² and integrate by parts to derive the moment equations. At γ = 0 the variance is V₀ + 2Dt and keeps growing.')),
    s(4,'分布を動かして、定常状態を調べる','Animate the distribution and its stationary state',
      eq(`f(x,t)=${f('1','√(2πV(t))')}exp[−${f('(x−μ(t))²','2V(t)')}]<br>γ>0 :　f<sub>eq</sub>∝exp[−${f('γx²','2D')}]`),lab('fokker-planck'),
      note('図のxとtは無次元、D＝0.5、μ₀＝2、V₀＝0.0625。解析解を描いており、星団の自己無撞着な衝突係数を解いてはいない。表示窓の外にも裾があるので、画面に見える面積だけを1へ規格化し直していない。','The panel uses dimensionless x,t, D = 0.5, μ₀ = 2 and V₀ = 0.0625. It plots an analytic solution, not self-consistent cluster collision coefficients. Tails outside the window are retained mathematically; the visible area is not renormalized to one.')),
    s(5,'星団で使うときに追加するもの','Additional ingredients for star clusters',
      p('星団では位置と速度の分布、または軌道で平均したエネルギー分布を使う。固定ポテンシャルの模型でも、位相空間の分布f(E)と個数密度N(E)＝g(E)f(E)は異なり、状態数g(E)を入れ忘れてはいけない。','Clusters require position–velocity distributions or orbit-averaged energy distributions. Even at fixed potential, phase-space f(E) differs from number per energy N(E) = g(E)f(E); the density of states g(E) matters.'),
      p('漂いと拡散の係数は背景の星の分布に依存し、重力場はPoisson方程式と合わせて更新する。ポテンシャルが変わればエネルギー座標の変化も扱う。脱出境界、連星加熱、複数の質量成分も実際には重要である。','Encounter coefficients depend on the stellar distribution and the potential must be updated with Poisson’s equation. An evolving potential also changes energy coordinates. Escape boundaries, binaries and multiple stellar masses can be important.'),
      p('OU模型は外部の熱浴との交換を許すため、系の運動エネルギーは一般に保存しない。これを孤立星団の冷却やグラボサーマル崩壊の計算と呼ばない。','The OU model exchanges energy with a bath and generally does not conserve kinetic energy. It is not a calculation of cooling or gravothermal collapse in an isolated cluster.'))
  ].join('');
  bodies.gravothermal=()=>[
    s(1,'エネルギーを失うほど熱くなる','Losing energy can increase temperature',
      p('表面圧が無視できるビリアル平衡なら2K＋W＝0、全エネルギーE＝K＋W＝−K。外へエネルギーを失ってEがより負になると、Kが増えて中心は熱くなりうる。自己重力の負の熱容量がここに現れる。','With negligible surface pressure, virial equilibrium gives E = K+W = −K. Losing energy makes E more negative and can increase kinetic energy and temperature: self-gravity permits negative heat capacity.'),
      eq(`K=${f('3','2')}Nk<sub>B</sub>T,　C≡${f('dE','dT')}=−${f('3','2')}Nk<sub>B</sub>　(${t('表面圧なし','negligible surface pressure')})`),
      p('中心から外へ熱が流れ、中心がさらに熱くなると温度差が増し、収縮と熱流が強まる可能性がある。負の熱容量があるという事実だけで、すべての重力系が直ちに崩壊するわけではない。','Outward heat flow can further heat and contract the core, increasing the temperature difference and reinforcing transport. Negative heat capacity alone does not imply immediate collapse of every gravitating system.')),
    s(2,'安定性を問う前に、何を固定するか','Specify the constraints before asking about stability',
      p('古典的な検討では、質量Mを半径Rの球形の箱に閉じ込めた等温球を使う。外圧を固定するBonnor–Ebert球とは境界条件が違う。温度Tを固定する熱浴と、全エネルギーEを固定する断熱壁でも結果が違う。','The classical model confines mass M inside a spherical box of radius R. It differs from a fixed-pressure Bonnor–Ebert sphere. A fixed-temperature bath and an insulating fixed-energy wall also lead to different stability criteria.'),
      p('点粒子の重力では、非常に小さな中心へ粒子を集める極限を許すと全体の大域的なエントロピー極大はない。以下でいう安定は、滑らかな平均場の平衡に対する局所的・準安定な意味である。','Point-particle gravity admits arbitrarily concentrated configurations, so there is no global entropy maximum without short-distance regularization. Stability here concerns local or metastable smooth mean-field equilibria.')),
    s(3,'等温球に、エネルギーの目盛りを付ける','Add an energy scale to the isothermal sphere',
      p('Bonnor–Ebert章と同じψ、m、ξで、箱の端ξbまで積分する。密度はρ＝ρc exp(−ψ)。ただし今はMとRを固定して平衡の系列を比較する。','Integrate the same ψ,m,ξ equations used for Bonnor–Ebert spheres to a box boundary ξb, with ρ = ρc exp(−ψ). This sequence instead compares equilibria at fixed M and R.'),
      eq(`u=${f('ξ³e<sup>−ψ</sup>','m')},　v=${f('m','ξ')},　η≡${f('GM','Rc<sub>s</sub>²')}=v`),
      p('壁の圧力Pbがあるので、ここでE＝−Kを使ってはいけない。2K＋W＝3PbVとK＝3Mcₛ²/2を使って全エネルギーを求める。','Wall pressure Pb means E = −K no longer applies. Use 2K+W = 3PbV and K = 3Mcₛ²/2 to obtain the energy.'),
      eq(`E=4πR³P<sub>b</sub>−${f('3','2')}Mc<sub>s</sub>²=Mc<sub>s</sub>²(u−${f('3','2')})<br>Λ≡−${f('ER','GM²')}=${f('3/2−u','v')}`)),
    s(4,'二つの折り返しを数値で見る','Locate two different turning points',
      p('最初のηの極大はξb≈8.99、密度比≈32.1。最初のΛの極大はξb≈34.4、密度比≈709、Λ≈0.335となる。前者が固定温度、後者が固定エネルギーでの最初の安定性限界に対応することは、摂動・熱力学解析の結果として使う。','The first maximum of η occurs near ξb = 8.99 and contrast 32.1. The first maximum of Λ is near ξb = 34.4, contrast 709 and Λ = 0.335. Their identification with the first fixed-temperature and fixed-energy stability limits uses supplied thermodynamic/perturbation results.'),lab('gravothermal'),
      note('図の系列を動かす操作は時間発展ではない。固定M,Rで温度とエネルギーの異なる平衡を並べ、各平衡の摂動で何を固定するかを選んでいる。14、32.1、709は、それぞれ外圧・温度・エネルギーの条件が違う模型の値。','Moving along this sequence is not time evolution. Equilibria have different energies and temperatures at fixed M,R; the selected ensemble specifies perturbation constraints. Contrasts 14, 32.1 and 709 refer to distinct boundary/thermodynamic conditions.')),
    s(5,'実際の星団の中心核崩壊へ','Connect to core collapse in real clusters',
      p('星団では、2体緩和がエネルギーを運ぶ。外側へ熱を渡す中心核が収縮し、密度が上がって緩和が速くなることで中心核崩壊へ向かう場合がある。これは衝突のない軌道の不安定性と同じ時間尺度ではない。','In a cluster, two-body relaxation transports energy. A core losing heat can contract, raise its density and accelerate relaxation, driving core collapse. This is not the same timescale as collisionless orbital instability.'),
      p('硬い連星が遭遇でさらに硬くなると周囲へエネルギーを渡し、崩壊を止めたり、崩壊後の膨張や振動に寄与したりする。開いた系の潮汐や質量損失も重要で、箱の709を観測した星団の判定基準としてそのまま使わない。','Hard binaries can release binding energy during encounters, halting collapse and contributing to post-collapse expansion or oscillation. Tides and mass loss matter in open systems; 709 is not a direct observational classifier for real clusters.'),
      p('この操作図は等温球の平衡と安定性の目盛りを再計算する。連星生成、中心核の時間発展、原論文の粒子データは再現していない。','The panel recomputes boxed isothermal equilibria and stability landmarks. It does not simulate binary formation, a time-dependent core collapse, or paper particle data.'))
  ].join('');
  bodies['viscous-disk']=()=>[
    s(1,'定常な円盤から、時間とともに変わる円盤へ','From steady disks to evolving disks',
      p('α円盤章は定常の降着率を調べた。今度は面密度Σが時間で変わる薄いKepler円盤を扱う。中心質量Mは円盤より十分大きく一定とし、風・外部供給・自己重力を省く。半径速度vrは外向きを正とする。','The alpha chapter examined steady accretion. Now let surface density evolve in a thin Keplerian disk. A fixed central mass dominates; omit winds, external supply and disk self-gravity. Radial velocity is positive outward.'),
      eq(`${f('∂Σ','∂t')}+${f('1','r')}${f('∂','∂r')}(rΣv<sub>r</sub>)=0,　j=√(GMr)`),
      p('角運動量の保存式からj倍の質量保存式を引くと、半径方向の速度を応力の勾配へ置き換えられる。局所的な粘性の閉じ方を指定して先へ進む。','Subtract j times mass conservation from angular-momentum conservation to eliminate radial advection in favour of a stress gradient. A specified viscosity closes the model.')),
    s(2,'面密度の拡散方程式を作る','Derive surface-density diffusion',
      eq(`v<sub>r</sub>=−${f('3','Σr<sup>1/2</sup>')}${f('∂','∂r')}(νΣr<sup>1/2</sup>)<br>${f('∂Σ','∂t')}=${f('3','r')}${f('∂','∂r')}[r<sup>1/2</sup>${f('∂','∂r')}(νΣr<sup>1/2</sup>)]`),
      p('νは分子粘性だけでなく、有効な輸送係数を表す。以下ではν＝ν₁(r/R₁)ᵞ、γ<2とし、時間やΣには依存しないと指定する。一般のα円盤で温度も同時に解く問題とは異なる。','ν represents effective transport, not necessarily molecular viscosity. Prescribe ν = ν₁(r/R₁)ᵞ with γ < 2 and no dependence on time or Σ. This differs from solving temperature and transport together in a general alpha disk.'),
      eq(`x=${f('r','R₁')},　β=2−γ,　t<sub>s</sub>=${f('R₁²','3β²ν₁')},　T=1+${f('t','t<sub>s</sub>')}`)),
    s(3,'相似解を代入して確かめる','Substitute a similarity solution',
      p('原点のトルクが0、外側は無限まで広がる境界で、次の滑らかな初期分布を選ぶ。τ＝t/t<sub>s</sub>、y＝xᵝ/Tで微分すると、PDEの左右のTとxのべきがそろう。','Use zero torque at the origin, an infinite outer disk and the smooth initial profile implied below. Differentiating in τ = t/t<sub>s</sub> and y = xᵝ/T matches the powers of T and x on both sides of the PDE.'),
      eq(`Σ(r,t)=${f('M₀β','2πR₁²')}x<sup>−γ</sup>T<sup>−(5/2−γ)/β</sup>exp(−${f('x<sup>β</sup>','T')})`),
      p('この式は任意の初期円盤すべての厳密解ではない。選んだ初期分布の厳密な相似解で、ある範囲ではより一般の分布の長時間の見通しにも役立つ。','This is an exact similarity solution for a particular initial profile, not for every disk. It can also provide useful late-time intuition for broader classes of initial data.'),
      eq(`M<sub>d</sub>=M₀T<sup>−1/(2β)</sup>,　R<sub>c</sub>=R₁T<sup>1/β</sup><br>Ṁ<sub>in</sub>=${f('M₀','2βt<sub>s</sub>')}T<sup>−(5/2−γ)/β</sup>`)),
    s(4,'内側の降着と外側の広がり','Inward accretion and outward spreading',
      eq(`v<sub>r</sub>=${f('3ν','r')}[β${f('x<sup>β</sup>','T')}−${f('1','2')}]<br>r<sub>turn</sub>=R₁[${f('T','2β')}]<sup>1/β</sup>`),lab('viscous-disk'),
      p('r<sub>turn</sub>の内側は内向き、外側は外向きに流れる。図の曲線は2πr²Σ/M₀という、初期質量で規格化した対数半径あたりの質量。色の違いは時刻であり、個々の粒子の軌道を追ってはいない。','Flow is inward below r<sub>turn</sub> and outward above it. The plotted 2πr²Σ/M₀ is mass per log radius normalized to initial mass; colours denote epochs, not tracked particle trajectories.'),
      note('再生はt/t<sub>s</sub>を等速で進める。R₁、ν₁を物理単位で指定すればt<sub>s</sub>で換算できるが、画面の秒数は円盤の実時間ではない。','Playback advances t/t<sub>s</sub> uniformly. Physical R₁ and ν₁ specify t<sub>s</sub> for conversion; screen seconds are not disk time.')),
    s(5,'減った質量と、残る角運動量を数える','Account for lost mass and retained angular momentum',
      p('y＝xᵝ/Tで積分すればM<sub>d</sub>を得る。角運動量ではさらに√rが掛かり、半径の広がりが質量の減少をちょうど補う。','Substitution y = xᵝ/T gives the disk mass integral. Angular momentum carries an extra √r factor; spreading exactly compensates the decreasing mass.'),
      eq(`J=2π√(GM)∫<sub>0</sub><sup>∞</sup>Σr<sup>3/2</sup>dr=${t('一定','constant')}<br>M<sub>accreted</sub>=M₀−M<sub>d</sub>,　−${f('dM<sub>d</sub>','dt')}=Ṁ<sub>in</sub>`),
      p('原点へ落ちる物質のj→0という境界だから、角運動量は円盤に残る。有限の内縁、天体のスピン、円盤風なら収支は変わる。M₀≪Mとしたので降着による中心質量の変化も重力場には反映しない。','Accreted material has j → 0 at the origin, leaving angular momentum in the disk. Finite inner radii, stellar spin or winds change the budget. M₀ ≪ M lets us neglect the accreted mass in the central gravitational field.'),
      p('図は指定した解析解を再計算し、PDEの残差と質量・角運動量で検証する。原論文のすべての初期分布や図を再現するものではない。','The plots recompute this analytic solution, checked against the PDE and mass/angular-momentum budgets. They do not reproduce all initial profiles or figures in the original paper.'))
  ].join('');
  bodies['goldreich-julian']=()=>[
    s(1,'回転する星の磁気圏に電場ができる','Rotation creates a corotation electric field',
      p('導電性の高いプラズマが角速度Ωで共回転すると、局所的な運動による電場を打ち消す条件はE＋v×B＝0である。v＝Ω×rを入れ、まず平坦時空・準静的な近似で電荷密度を求める。','A highly conducting corotating plasma satisfies E+v×B = 0 locally. Insert v = Ω×r and first examine a flat-spacetime, quasistatic approximation to the required charge density.'),
      eq(`E=−(Ω×r)×B,　∇·E=${f('ρ<sub>e</sub>','ε₀')}　(SI)`),
      p('ここでρeは電荷密度であり、ガスの質量密度ではない。共回転条件を満たすには正味の電荷が必要になるが、これだけで電子・陽電子の総数を決めることはできない。','ρe denotes charge density, not mass density. Corotation can require a net charge; this alone does not determine the total electron–positron population.')),
    s(2,'ベクトルの恒等式からGJ密度へ','Apply a vector identity to obtain GJ density',
      eq(`∇·(v×B)=B·(∇×v)−v·(∇×B),　∇×(Ω×r)=2Ω<br>ρ<sub>e</sub>=ε₀[−2Ω·B+v·(∇×B)]`),
      p('近接領域で電流によるcurl Bの項を省けば、Goldreich–Julianの密度の尺度が得られる。省いた項を式に残しておくと、どこで単純な式が使えないかを見失いにくい。','Neglecting the current-related curl-B term in the near zone gives the Goldreich–Julian density scale. Keeping the omitted term visible clarifies where the approximation fails.'),
      eq(`ρ<sub>GJ</sub>≈−2ε₀Ω·B　(SI)<br>ρ<sub>GJ</sub>≈−${f('Ω·B','2πc')}　(Gauss)<br>n<sub>GJ</sub>≡${f('|ρ<sub>GJ</sub>|','e')}`),
      p('Gauss系では共回転電場に1/cが入り、Gaussの法則は∇·E＝4πρeとなる。SIの式へ磁場の数値だけをGaussで入れてはいけない。','Gaussian corotation includes 1/c and Gauss’s law reads ∇·E = 4πρe. Inserting a magnetic field measured in gauss directly into the SI formula is incorrect.')),
    s(3,'周期と磁場から桁を出す','Estimate the scale from period and field',
      eq(`Ω=${f('2π','P')},　n<sub>GJ</sub>≈6.94×10<sup>10</sup>${f('B<sub>∥</sub> / 10<sup>12</sup> G','P / s')}　cm<sup>−3</sup>　(${t('絶対値','magnitude')})`),
      p('B∥はΩに平行な局所磁場成分の大きさ。整列した双極子で極の磁場をBpとすると、表面ではBz＝Bp(3cos²θ−1)/2となる。θ≈54.7°で近似電荷密度の符号が変わる。','B∥ is the magnitude of the local component parallel to Ω. An aligned dipole with polar field Bp has surface Bz = Bp(3cos²θ−1)/2. The approximate charge changes sign near θ = 54.7°.'),lab('goldreich-julian'),
      note('図は半径12 kmの星の表面で整列双極子を使う近接場の見積もり。磁場構造の自己無撞着な計算、一般相対論の慣性系の引きずり、磁気圏全体の電流は解いていない。','The panel estimates the near field at the surface of a 12 km star using an aligned dipole. It does not solve field back-reaction, relativistic frame dragging or the global magnetospheric current.')),
    s(4,'光円柱と、開いた磁力線の目安','The light cylinder and a polar-cap estimate',
      p('剛体共回転なら円筒半径r⊥で速さΩr⊥となる。これが光速になるRLCより外まで、その共回転を延長できない。双極子の磁力線r＝r<sub>eq</sub> sin²θから、開いた領域の極冠の大きさを見積もれる。','Rigid corotation has speed Ωr⊥ at cylindrical radius r⊥ and cannot extend beyond the light cylinder. The dipole line r = r<sub>eq</sub> sin²θ gives a geometric estimate of the open polar cap.'),
      eq(`R<sub>LC</sub>=${f('c','Ω')}≈4.77×10⁴(${f('P','s')}) km<br>sin²θ<sub>pc</sub>≈${f('R*','R<sub>LC</sub>')},　r<sub>pc</sub>≈R*√(${f('R*','R<sub>LC</sub>')})`),
      p('極冠の式は整列した双極子で、最後の閉じた磁力線が光円柱に達するとした目安。実際には磁場が開いて電流が流れるため、真空双極子を光円柱の外まで正確な解として使わない。','This cap estimate assumes an aligned dipole whose last closed line reaches the light cylinder. Real fields open and carry currents; a vacuum dipole is not an exact exterior solution.')),
    s(5,'正味電荷と、加速・放射をつなぐ','Connect net charge to acceleration and radiation',
      p('電子・陽電子が大量にある対プラズマでも、差n₊−n₋がGJの正味電荷を作ればよい。したがって総数n₊＋n₋はnGJよりずっと大きくなりうる。nGJを総粒子数密度と同じものとして散乱率へ入れない。','A dense pair plasma can supply the required net charge through n₊−n₋ while n₊+n₋ greatly exceeds nGJ. The GJ number scale is not automatically the total density to use in scattering rates.'),
      p('必要な電荷が足りない領域では、磁場に沿う電場が十分に遮蔽されず粒子加速につながる可能性がある。放射・対生成と結びつくが、どこにギャップがあり、どのスペクトルが出るかは、この一つの密度式だけでは決まらない。','Insufficient charge can leave an unscreened field along B and permit particle acceleration, radiation and pair creation. A density scale alone does not determine gap locations or the emitted spectrum.'),
      p('この図は共回転条件の解析式の再計算であり、原論文の全球磁気圏図や観測パルスを再現していない。近似の場所と電荷の符号を読み取るために使う。','These diagrams recompute the corotation approximation, not global paper magnetospheres or observed pulses. Use them to inspect local validity and charge sign.'))
  ].join('');
  A.chapters.push(...chapters);
  const order=topics.map(x=>x.id);
  A.chapters.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));
  const previous=A.renderBody;
  A.renderBody=(id,locale)=>{if(!Object.prototype.hasOwnProperty.call(bodies,id))return previous(id,locale);language=locale;return bodies[id]();};
})();
