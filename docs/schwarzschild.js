/* Schwarzschild exterior: supplied metric, derived orbit conditions, and static clocks. */
(() => {
  'use strict';
  const C=window.AstroDynamics.C;
  const positive=(...xs)=>{if(xs.some(x=>!Number.isFinite(x)||x<=0))throw new RangeError('Positive finite inputs required');};
  function potential(R,j,photon=false) {positive(R);if(!Number.isFinite(j)||j<0)throw new RangeError('Invalid angular momentum');return(1-2/R)*((photon?0:1)+j/R**2);}
  function circles(j) {
    if(!Number.isFinite(j)||j<0)throw new RangeError('Invalid angular momentum');
    if(j<12)return[];
    if(j===12)return[{radius:6,stability:'marginal',energy:Math.sqrt(8/9)}];
    const q=Math.sqrt(1-12/j),inner=6/(1+q),outer=j*(1+q)/2;
    return[{radius:inner,stability:'unstable',energy:Math.sqrt(potential(inner,j))},{radius:outer,stability:'stable',energy:Math.sqrt(potential(outer,j))}];
  }
  function model(mass=10,R=6,time=0) { // mass in solar masses; R = r/r<sub>g</sub>; time = ct/r<sub>g</sub>
    positive(mass,R);if(R<=2||!Number.isFinite(time)||time<0)throw new RangeError('Static clocks require R > 2 and nonnegative time');
    const rg=C.G*mass*C.solar/C.c**2,unit=rg/C.c,rate=Math.sqrt(1-2/R);
    return{rg,unit,rate,redshift:1/rate-1,radius:R*rg,elapsed:time*unit,proper:time*unit*rate,photonRadius:3*rg,isco:6*rg,horizon:2*rg};
  }
  const A=window.AstroAdvanced,topic=window.AstroSeries.groups.flatMap(g=>g.topics).find(c=>c.id==='schwarzschild');
  Object.assign(A.sources,{
    schwarzschildOriginal:['Schwarzschild (1916) · Original paper, English translation','https://arxiv.org/abs/physics/9905030'],
    schwarzschildCarroll:['Carroll · General Relativity §7, metric and effective potentials','https://preposterousuniverse.com/wp-content/uploads/grnotes-seven.pdf'],
    schwarzschildClocks:['Reed College · Physics 411, Lecture 31: Gravitational redshift','https://www.reed.edu/physics/courses/Physics411/html/411/page2/files/Lecture.31.pdf']
  });
  A.chapters.push({id:'schwarzschild',title:topic.title,desc:topic.question,minutes:40,
    prereq:['入門編の相対論、微分、保存則、円運動','Foundational relativity, derivatives, conservation laws, and circular motion'],
    goal:['計量から時計の遅れを読み、保存量から有効ポテンシャルを作り、地平面・光子球・ISCOを区別する。','Read clock rates from the metric, derive an effective potential from conserved quantities, and distinguish the horizon, photon sphere, and ISCO.'],
    question:['質量を2倍にすると、地平面・光子球・ISCOの物理半径と、同じr/(GM/c²)に静止する時計の進む割合はどう変わるか。','Double the mass. How do physical horizon, photon-sphere, and ISCO radii change, and what happens to a static clock rate at fixed r/(GM/c²)?'],
    answer:['三つの物理半径はGM/c²に比例して2倍。時計の割合√(1−2/R)は無次元半径Rだけで決まり、同じRなら変わらない。時間単位GM/c³は2倍になる。','All three physical radii double because they scale with GM/c². At fixed dimensionless R, the clock factor √(1−2/R) is unchanged; the time unit GM/c³ doubles.'],
    refs:['schwarzschildOriginal','schwarzschildCarroll','schwarzschildClocks'],bridge:'relativity'});
  let language='ja';const t=(ja,en)=>language==='ja'?ja:en;
  const p=(ja,en)=>`<p>${t(ja,en)}</p>`,f=(a,b)=>`<span class="frac"><span>${a}</span><span>${b}</span></span>`;
  const eq=html=>`<div class="equation"><div class="math">${html}</div></div>`;
  const s=(n,ja,en,...body)=>`<section><h2><span class="step-no">${String(n).padStart(2,'0')}</span>${t(ja,en)}</h2>${body.join('')}</section>`;
  const note=(ja,en)=>`<aside class="callout">${t(ja,en)}</aside>`;
  function body() {return[
    s(1,'時空のものさしを、出発点にする','Start from a spacetime ruler',
      p('Einstein方程式を解いて得られる計量は、時間と距離の測り方を指定する。ここでは球対称な真空のSchwarzschild計量を既知の解として借り、そこから何を読み取れるかを追う。場の方程式のテンソル計算を全て再現する章ではない。','A metric specifies how spacetime intervals are measured. Take the Schwarzschild vacuum metric as the supplied solution, then derive consequences using conserved quantities and algebra. The full tensor calculation solving the field equations is outside this lesson.'),
      eq(`ds²=−A(r)c²dt²+A(r)<sup>−1</sup>dr²+r²(dθ²+sin²θ dφ²)<br>A(r)=1−${f('2r<sub>g</sub>','r')},　r<sub>g</sub>≡${f('GM','c²')},　R≡${f('r','r<sub>g</sub>')}`),
      p('rは球の面積が4πr²になる面積半径で、中心からの固有距離と同じとは限らない。tは遠方の静止時計に合わせた座標時刻。r<sub>g</sub>を重力半径と呼ぶこの章では、Schwarzschild半径はその2倍である。','Here r is the areal radius: spheres have area 4πr². It need not equal radial proper distance. Coordinate time t is normalized to a distant static clock. Our gravitational radius is r<sub>g</sub> = GM/c²; the Schwarzschild radius is twice this value.'),
      note('真空の外部解であり、星の内部には別の解が必要。球対称・非回転の星でも表面の外に使えるが、以下の地平面の図はブラックホールの外部として読む。','This is an exterior vacuum solution. A star needs a different interior solution. The exterior can also describe a nonrotating spherical star, but interpret the horizon sketch below as a black-hole exterior.')),
    s(2,'静止した時計と、遠方へ届く光','Static clocks and light received far away',
      p('同じr,θ,φにとどまる時計なら、空間座標の変化はゼロでds²＝−c²dτ²。τはその時計が測る固有時である。計量に代入すれば、遠方の座標時間との比がすぐ求まる。','For a clock at fixed spatial coordinates, ds² = −c²dτ². Substitute zero spatial increments into the metric to obtain its proper time τ relative to t. A local clock continues to run normally for an observer beside it.'),
      eq(`${f('dτ','dt')}=√(1−2/R),　1+z=${f('ν<sub>em</sub>','ν<sub>∞</sub>')}=${f('1','√(1−2/R)')}`),
      p('赤方偏移の式は、静止した放射源から無限遠の静止した受信者へ光を送る場合。落下する放射源なら運動の効果も加わる。R＞2で静止を保つには支える加速度が必要で、R＝2に静止した時計を置くことはできない。','The redshift formula assumes a static emitter and a static receiver at infinity. Moving emitters require additional kinematic effects. Remaining static outside the horizon requires support; a stationary clock cannot be placed on the horizon itself. The panel keeps R strictly greater than two.')),
    s(3,'保存量から、半径の運動だけを取り出す','Reduce radial motion using conserved quantities',
      p('質量を持つ試験粒子が赤道面θ＝π/2を自由落下するとする。時刻と方位角の対称性から、次のエネルギーと角運動量が保存することを出発点にする。粒子自身の重力や放射反作用は無視する。','Consider a massive test particle moving freely in the equatorial plane. Time-translation and rotational symmetries supply the following conserved quantities. Neglect the particle’s self-gravity and radiative backreaction. These orbit constants are separate from the mass parameter defining the spacetime.'),
      eq(`ℰ=A(r)${f('dt','dτ')},　ℓ=r²${f('dφ','dτ')},　λ≡${f('ℓ','cr<sub>g</sub>')},　j≡λ²`),
      p('計量をdτ²で割り、ds²/dτ²＝−c²へ保存量を代入する。dr/dτの項を一方へまとめると、ニュートン力学のエネルギー式に似た形になる。','Divide the metric by dτ², set ds²/dτ² = −c², and substitute the constants. Rearranging isolates the radial kinetic term. This is an exact test-particle relation in the supplied metric, rather than an expansion in weak gravity.'),
      eq(`−c²=−${f('c²ℰ²','A')}+${f('1','A')}(${f('dr','dτ')})²+${f('ℓ²','r²')}<br>${f('1','c²')}(${f('dr','dτ')})²+U(R)=ℰ²<br>U(R)=(1−${f('2','R')})(1+${f('j','R²')})=1−${f('2','R')}+${f('j','R²')}−${f('2j','R³')}`),
      p('半径方向の運動が可能なのはℰ²≥U。最後の−2j/R³が強い重力で重要になり、角運動量があっても内側へ落ち込める。ここでUは無次元で、エネルギーそのものℰではなくℰ²と比較する。','Radial motion requires ℰ² ≥ U. The additional −2j/R³ term changes the inner barrier. U is dimensionless and is compared with squared energy ℰ², not with ℰ. A potential plot alone is not an integration of a chosen trajectory.')),
    s(4,'円軌道を作り、安定性を調べる','Find circular orbits and test stability',
      p('円軌道では半径が変わらず、ポテンシャルの傾きもゼロ。jを固定して微分し、分母を払う。二次方程式になり、二つの円軌道が合流する条件が見える。','For a circular orbit, radial velocity and the potential slope vanish. Differentiate at fixed j and clear denominators. The resulting quadratic exposes both circular branches and the parameter at which they merge.'),
      eq(`${f('dU','dR')}=${f('2','R²')}−${f('2j','R³')}+${f('6j','R⁴')}=0<br>R²−jR+3j=0,　R<sub>±</sub>=${f('j ± √(j²−12j)','2')}<br>j=${f('R²','R−3')}　(R&gt;3)`),
      p('極小なら小さい半径のずれに対して復元するので安定、極大なら不安定。同じ角運動量を固定した二階微分へ円軌道の関係を代入する。','A minimum gives radial stability; a maximum gives instability. Evaluate the second derivative while keeping angular momentum fixed, and then insert the circular-orbit relation. Do not differentiate along a family that changes j.'),
      eq(`${f('d²U','dR²')}<sub>circular</sub>=${f('2(R−6)','R³(R−3)')}<br>R&gt;6: ${t('安定','stable')},　3&lt;R&lt;6: ${t('不安定','unstable')}<br>R<sub>ISCO</sub>=6,　j<sub>ISCO</sub>=12,　ℰ<sub>ISCO</sub>=√${f('8','9')}`),
      p('R＝6は安定枝の内端で、線形の復元項がゼロになる限界。ISCOは「それより内側に物質が存在できない半径」ではない。内側を落下する物質も、圧力や磁場で力を受ける流体もありうる。','At R = 6 the radial restoring term vanishes: this is the marginal endpoint of the stable circular branch. ISCO does not forbid matter at smaller radii. Infall and accelerated fluid motion are different from stable circular test-particle geodesics.')),
    s(5,'光子球と地平面は、別の半径','The photon sphere and horizon are different radii',
      p('光ではds²＝0を使うため、粒子の静止質量に対応する項が消える。規格化した光の半径ポテンシャルは次の形となり、極大の場所を調べれば円い光軌道が得られる。','For light, use ds² = 0. The rest-mass term disappears and the normalized radial potential is W below. Differentiate it to locate the circular null orbit. Its maximum makes that orbit unstable.'),
      eq(`W(R)=${f('1−2/R','R²')},　${f('dW','dR')}=−${f('2','R³')}+${f('6','R⁴')}=0　⇒　R<sub>ph</sub>=3`),
      p('地平面はR＝2、光子球はR＝3、ISCOはR＝6。これらをブラックホールの三つの固体表面のように考えない。光子球の座標半径と、遠方から見た捕獲の衝突係数も違う。','The horizon is at R = 2, the photon sphere at R = 3, and the ISCO at R = 6. They are not three material surfaces. Also distinguish the photon orbit’s areal radius from the impact parameter for capture measured at infinity.'),
      `<figure class="concept-figure"><svg viewBox="0 0 640 325" role="img" aria-label="${t('面積半径の比で比べる地平面2、光子球3、ISCO6','Areal-radius comparison: horizon 2, photon sphere 3, ISCO 6')}"><circle cx="250" cy="160" r="108" fill="none" stroke="#48715c" stroke-width="2"/><circle cx="250" cy="160" r="54" fill="none" stroke="#b25930" stroke-width="2" stroke-dasharray="5 4"/><circle cx="250" cy="160" r="36" fill="#102b3c"/><path d="M286 160H400M291 125H400M301 65H400" stroke="#89968c" fill="none"/><text x="410" y="167">${t('地平面','Horizon')} · 2r<tspan baseline-shift="sub" font-size="15">g</tspan></text><text x="410" y="130">${t('光子球','Photon sphere')} · 3r<tspan baseline-shift="sub" font-size="15">g</tspan></text><text x="410" y="70">ISCO · 6r<tspan baseline-shift="sub" font-size="15">g</tspan></text><text x="250" y="305" text-anchor="middle">r<tspan baseline-shift="sub" font-size="15">g</tspan> = GM/c²</text></svg><figcaption>${t('面積半径の比を示す模式図。空間の固有距離や、遠方で見える影の半径を描いた図ではない。','Sketch of areal-radius ratios; neither a proper-distance diagram nor an image of the distant shadow.')}</figcaption></figure>`,
      eq(`b<sub>crit</sub>=${f('r<sub>ph</sub>','√A(r<sub>ph</sub>)')}=3√3 r<sub>g</sub>`),
      p('Schwarzschild座標の係数は地平面で特異に見えるが、適切な座標でそこを通る自由落下を記述できる。r＝0の曲率特異点とは区別する。ここでは地平面を横切る軌道は描かない。','Schwarzschild-coordinate coefficients become singular at the horizon, whereas suitable coordinates describe infall across it. This differs from the curvature singularity at r = 0. The panel remains outside and does not draw horizon-crossing trajectories.')),
    s(6,'時計を動かし、円軌道の枝を比べる','Run clocks and compare circular branches',
      '<div data-lab="schwarzschild"></div>',
      p('時計の再生は、遠方の時刻tを進め、同じ半径に支えた時計の固有時τを計算する。ポテンシャルのパラメーターを変える操作は別で、粒子の時間発展として再生しない。','Clock playback advances distant time and computes the proper time of a supported clock at fixed radius. Changing angular momentum compares potential curves; it does not animate a test-particle orbit. The two operations answer different questions.'),
      p('j＝16なら、不安定な円軌道R＝4と安定なR＝12を比較できる。j＝12で二つはR＝6へ合流し、それより小さいjでは質量を持つ粒子の円軌道がなくなる。','Try j = 16 to compare an unstable circular orbit at R = 4 with a stable one at R = 12. At j = 12 they merge at R = 6; below that value no massive circular geodesic exists. Use the displayed branch labels to connect the graph to the algebra.'),
      p('<a href="#/solutions">ソリューションライブラリー</a>では、この真空の厳密解を流体の平衡解や相似解と比較できる。回転を加えるKerr解と、より一般の富松–佐藤解は、本文の公開状況を区別して掲載する。','The <a href="#/solutions">solution library</a> compares this exact vacuum solution with fluid equilibria and similarity models. Kerr and Tomimatsu–Sato entries are listed with their lesson availability explicitly distinguished.'))
  ].join('');}
  const previous=A.renderBody;
  A.renderBody=(id,locale)=>{if(id!=='schwarzschild')return previous(id,locale);language=locale;return body();};
  const sample=(fn,a,b,n=220)=>Array.from({length:n+1},(_,i)=>{const x=a+(b-a)*i/n;return{x,y:fn(x)};});
  function potentialPlot(j,t) {
    const X=x=>65+(x-2)/18*510,Y=y=>235-y/1.6*185;
    const path=sample(x=>potential(x,j),2,20).map((q,i)=>`${i?'L':'M'}${X(q.x).toFixed(2)} ${Y(q.y).toFixed(2)}`).join(' ');
    const roots=circles(j);
    return `<svg viewBox="0 0 640 295" role="img" aria-label="${t('質量を持つ粒子の有効ポテンシャルと円軌道','Massive-particle effective potential and circular orbits')}"><text x="65" y="25">U(R), j = ${j}</text>${[0,.4,.8,1.2,1.6].map(y=>`<path d="M65 ${Y(y)}H575" stroke="#d9dfd4" stroke-dasharray="3 4"/><text x="55" y="${Y(y)+4}" text-anchor="end">${y}</text>`).join('')}${[2,3,6,10,15,20].map(x=>`<text x="${X(x)}" y="257" text-anchor="middle">${x}</text>`).join('')}<path d="M${X(3)} 50V235M${X(6)} 50V235" stroke="#89968c" stroke-dasharray="4 4"/><path d="${path}" stroke="#345c70" stroke-width="2.7" fill="none"/>${roots.filter(q=>q.radius<=20).map(q=>`<circle cx="${X(q.radius)}" cy="${Y(potential(q.radius,j))}" r="5" stroke="white" fill="${q.stability==='stable'?'#48715c':'#b25930'}"/>`).join('')}<path d="M65 50V235H575" stroke="#89968c" fill="none"/><text x="320" y="285" text-anchor="middle">R = r / r<tspan baseline-shift="sub" font-size="11">g</tspan></text></svg>`;
  }
  function mount(el,locale) {
    const t=(ja,en)=>locale==='ja'?ja:en,fmt=x=>x.toLocaleString(locale,{maximumSignificantDigits:4,notation:x!==0&&(Math.abs(x)<.001||Math.abs(x)>1e5)?'scientific':'standard'});
    const range=(id,label,min,max,step,value)=>`<label for="${id}">${label} = <output id="${id}-value" for="${id}"></output></label><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}">`;
    el.className='lab advanced-lab schwarzschild-lab';
    el.innerHTML=`<h3>${t('動かして確かめる：二つの時計と円軌道','Explore: two clocks and circular orbits')}</h3>${range('gr-mass','log₁₀(M / M☉)',0,8,.1,1)}${range('gr-radius',t('静止時計の半径 R','Static clock radius R'),2.1,20,.1,6)}${range('gr-j','j = [ℓ / (crg)]²',9,25,.25,16)}${range('gr-time','ct / rg',0,1000,5,0)}<div class="readout">${[['gr-rate','dτ / dt'],['gr-redshift',t('重力赤方偏移 z','Gravitational redshift z')],['gr-rg','rg / km'],['gr-proper',t('静止時計の固有時 / s','Static proper time / s')]].map(([id,label])=>`<div class="stat"><small>${label}</small><strong id="${id}"></strong></div>`).join('')}</div><p class="plot-scroll-hint lab-note">${t('図は横にスクロールできます。','Scroll plots horizontally to read the axes.')}</p><div class="gas-plot gr-clocks"></div><p class="lab-note">${t('再生は時計だけを動かす。針の1周＝100rg/c。右の時計は同じRに支えた観測者の固有時。落下する時計でも、受信した映像でもない。','Playback advances clocks only. One turn = 100rg/c. Right: proper time of a supported observer at fixed R, not an infalling clock or a received optical image.')}</p><div class="gas-plot gr-potential"></div><p id="gr-state" class="gr-state lab-note" role="status"></p><p class="lab-note">${t('青＝U(R)、緑点＝安定円軌道、赤点＝不安定または限界の円軌道。破線はR＝3と6。図は2≤R≤20。比較するのは円軌道の条件であり、選んだエネルギーの軌道を積分した図ではない。本文の式から計算した教材図で、原論文図や観測像の再現ではない。','Blue: U(R); green: stable circular orbit; rust: unstable or marginal orbit. Dashed lines: R = 3 and 6. Plot domain: 2 ≤ R ≤ 20. These compare circular-orbit conditions, not integrated trajectories at a selected energy. Recomputed teaching diagram, not an original paper figure or observed image.')}</p>`;
    const value=id=>Number(el.querySelector('#'+id).value),put=(id,text)=>{el.querySelector('#'+id).textContent=text;};
    const hand=(cx,phase,color)=>{const a=phase*2*Math.PI/100-Math.PI/2;return`<circle cx="${cx}" cy="90" r="55" fill="#fffefa" stroke="#b8c9bd"/><path d="M${cx} 90L${cx+43*Math.cos(a)} ${90+43*Math.sin(a)}" stroke="${color}" stroke-width="3"/><circle cx="${cx}" cy="90" r="4" fill="${color}"/>`;};
    const render=()=>{
      el.querySelectorAll('input').forEach(input=>put(input.id+'-value',fmt(Number(input.value))));
      const R=value('gr-radius'),j=value('gr-j'),time=value('gr-time'),d=model(10**value('gr-mass'),R,time);
      put('gr-rate',fmt(d.rate));put('gr-redshift',fmt(d.redshift));put('gr-rg',fmt(d.rg/1000));put('gr-proper',fmt(d.proper));
      el.querySelector('.gr-clocks').innerHTML=`<svg viewBox="0 0 640 230" role="img" aria-label="${t('遠方の時計と、固定半径の静止時計','Distant clock and supported static clock')}"><text x="180" y="20" text-anchor="middle">${t('遠方：座標時刻 t','Distant: coordinate time t')}</text><text x="460" y="20" text-anchor="middle">${t('静止時計：固有時 τ','Static: proper time τ')}</text>${hand(180,time,'#345c70')}${hand(460,time*d.rate,'#b25930')}<text x="180" y="173" text-anchor="middle">${fmt(d.elapsed)} s</text><text x="460" y="173" text-anchor="middle">${fmt(d.proper)} s</text><text x="320" y="215" text-anchor="middle">R = ${fmt(R)}, dτ/dt = ${fmt(d.rate)}</text></svg>`;
      el.querySelector('.gr-potential').innerHTML=potentialPlot(j,t);
      const roots=circles(j),label={stable:t('安定','stable'),unstable:t('不安定','unstable'),marginal:t('限界','marginal')};
      put('gr-state',roots.length?roots.map(q=>`${label[q.stability]}: R = ${fmt(q.radius)}, ℰ = ${fmt(q.energy)}${q.radius>20?t('（図の右外）',' (off plot to the right)'):''}`).join(' / '):t('j＜12：質量を持つ粒子の円軌道なし。','j < 12: no massive circular geodesic.'));
    };
    el.addEventListener('input',render);render();
    window.AstroAnimation.mount(el,{locale,min:0,max:1000,duration:18000,read:()=>value('gr-time'),write:x=>{el.querySelector('#gr-time').value=x;render();}});
  }
  window.AstroSchwarzschild={potential,circles,model,mount};
})();
