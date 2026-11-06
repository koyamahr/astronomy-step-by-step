/* Interactive teaching diagrams for the remaining advanced chapters. */
(() => {
  'use strict';
  const M=window.AstroDynamics,C=M.C;
  const ids=new Set(['hayashi','ellipsoids','tensor-virial','zeldovich','isothermal-collapse','relaxation','fokker-planck','gravothermal','viscous-disk','goldreich-julian']);
  const samples=(fn,a,b,n=240)=>Array.from({length:n+1},(_,i)=>{const x=a+(b-a)*i/n;return{x,y:fn(x)};});
  const range=(id,label,min,max,step,value)=>`<label for="${id}">${label} = <output id="${id}-value" for="${id}"></output></label><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}">`;
  const select=(id,label,options)=>`<label for="${id}">${label}</label><select id="${id}">${options.map(([value,text])=>`<option value="${value}">${text}</option>`).join('')}</select>`;
  function chart(id,title,xlabel,ylabel,xd,yd,curves,markers=[],guides=[]) {
    const X=x=>68+(x-xd[0])/(xd[1]-xd[0])*510,Y=y=>235-(y-yd[0])/(yd[1]-yd[0])*190;
    const path=points=>points.map((p,i)=>`${i?'L':'M'}${X(p.x).toFixed(3)} ${Y(p.y).toFixed(3)}`).join(' ');
    const ticks=Array.from({length:5},(_,i)=>{const x=xd[0]+(xd[1]-xd[0])*i/4,y=yd[0]+(yd[1]-yd[0])*i/4;return`<path d="M${X(x)} 45V235M68 ${Y(y)}H578" stroke="#d9dfd4" stroke-dasharray="3 4"/><text x="${X(x)}" y="257" text-anchor="middle">${Number(x.toPrecision(3))}</text><text x="58" y="${Y(y)+4}" text-anchor="end">${Number(y.toPrecision(3))}</text>`;}).join('');
    return `<svg viewBox="0 0 640 295" role="img" aria-labelledby="${id}-title"><title id="${id}-title">${title}</title><defs><clipPath id="${id}-clip"><rect x="68" y="45" width="510" height="190"/></clipPath></defs><text x="68" y="23">${ylabel}</text>${ticks}<g clip-path="url(#${id}-clip)">${guides.map(g=>g.x!==undefined?`<path d="M${X(g.x)} 45V235" stroke="${g.color||'#b25930'}" stroke-dasharray="4 4"/>`:`<path d="M68 ${Y(g.y)}H578" stroke="#8a9d8e" stroke-dasharray="4 4"/>`).join('')}${curves.map(c=>`<path d="${path(c.points)}" fill="none" stroke="${c.color||'#48715c'}" stroke-width="2.6" ${c.dash?'stroke-dasharray="6 4"':''}/>`).join('')}${markers.map(m=>`<circle cx="${X(m.x)}" cy="${Y(m.y)}" r="4.5" fill="${m.color||'#b25930'}" stroke="white"/>`).join('')}</g><path d="M68 45V235H578" stroke="#8c9c8e" fill="none"/><text x="323" y="284" text-anchor="middle">${xlabel}</text></svg>`;
  }
  function shapeViews(title,a,b,c) {
    return `<svg viewBox="0 0 640 250" role="img" aria-label="${title}"><title>${title}</title><text x="170" y="30" text-anchor="middle">x–z</text><text x="470" y="30" text-anchor="middle">y–z</text>${[[170,a],[470,b]].map(([x,r])=>`<ellipse cx="${x}" cy="130" rx="${72*r}" ry="${72*c}" fill="#dce7d9" stroke="#48715c" stroke-width="2"/><path d="M${x-140} 130H${x+140}M${x} 45V220" stroke="#91a08f" stroke-dasharray="3 3"/>`).join('')}<text x="320" y="240" text-anchor="middle">${title}</text></svg>`;
  }
  function mount(el,locale) {
    const t=(ja,en)=>locale==='ja'?ja:en;
    const fmt=x=>x.toLocaleString(locale,{maximumSignificantDigits:4,notation:x!==0&&(Math.abs(x)<.001||Math.abs(x)>=1e5)?'scientific':'standard'});
    const value=id=>Number(el.querySelector('#'+id).value),put=(id,text)=>{el.querySelector('#'+id).textContent=text;};
    const plot=html=>{el.querySelector('.dynamics-plot').innerHTML=html;};
    const status=text=>{el.querySelector('.dynamics-status').textContent=text;};
    function shell(title,controls,entries,note) {
      el.className='lab advanced-lab';
      el.innerHTML=`<h3>${title}</h3>${controls}<div class="readout">${entries.map(([id,label])=>`<div class="stat"><small>${label}</small><strong id="${id}"></strong></div>`).join('')}</div><p class="plot-scroll-hint lab-note">${t('図は横にスクロールできます。','Scroll plots horizontally to read the axes.')}</p><div class="gas-plot dynamics-plot"></div><p class="dynamics-status lab-note" role="status"></p><p class="lab-note">${note}</p>`;
    }
    function bind(update,animation) {
      const render=()=>{el.querySelectorAll('input[type=range]').forEach(input=>put(input.id+'-value',fmt(Number(input.value))));update();};
      el.addEventListener('input',render);el.addEventListener('change',render);render();
      if(animation)window.AstroAnimation.mount(el,{locale,...animation,write:x=>{el.querySelector('#'+animation.input).value=x;render();}});
    }
    const id=el.dataset.lab;
    if(id==='hayashi') {
      shell(t('動かして確かめる：収縮する星のH–R図','Explore: a contracting star on the H–R diagram'),range('dyn-mass','M / M☉',.2,1,.05,.5)+range('dyn-time','t / t₀',0,20,.05,0),[['hy-temperature','Teff / K'],['hy-radius','R / R☉'],['hy-luminosity','L / L☉'],['hy-time',t('経過時間 / Myr','Elapsed time / Myr')]],t('灰色の破線は全区間の模型、赤点は選択時刻。温度軸は左ほど高温。円は初期半径と現在の半径の比較。核融合と放射核を含まない指定模型で、実在星の進化曲線ではない。','Dashed gray: the full model path; red: selected time. Hotter temperatures are leftward. Circles compare initial and current radius. This specified model omits nuclear burning and radiative cores; it is not a realistic evolution track.'));
      bind(()=>{
        const mass=value('dyn-mass'),tau=value('dyn-time'),d=M.hayashi(mass,tau);
        put('hy-temperature',fmt(d.temperature));put('hy-radius',fmt(d.radius/C.solarRadius));put('hy-luminosity',fmt(d.luminosity/C.luminosity));put('hy-time',fmt(d.time/C.year/1e6));
        const track=samples(x=>x,0,20).map(p=>{const q=M.hayashi(mass,p.x);return{x:q.temperature,y:Math.log10(q.luminosity/C.luminosity)};});
        plot(chart('hayashi-track',t('重力収縮だけの模型のH–Rトラック','Contraction-only model H–R track'),'Teff / K','log₁₀(L/L☉)',[4200,2800],[-2,1],[{points:track,color:'#89968c',dash:true}],[{x:d.temperature,y:Math.log10(d.luminosity/C.luminosity)}])+`<svg viewBox="0 0 640 220" role="img" aria-label="${t('初期半径と現在の半径','Initial versus current radius')}"><circle cx="320" cy="105" r="80" fill="none" stroke="#89968c" stroke-dasharray="5 4"/><circle cx="320" cy="105" r="${80*d.radiusRatio}" fill="#e4b97e" stroke="#b25930"/><text x="320" y="210" text-anchor="middle">R / R₀ = ${fmt(d.radiusRatio)}</text></svg>`);
        status(t(`t₀＝${fmt(d.time0/C.year/1e6)} Myr。再生はt/t₀を等速で進め、エネルギー式からRとLを更新する。`,`t₀ = ${fmt(d.time0/C.year/1e6)} Myr. Playback advances t/t₀ uniformly and updates R,L from the energy model.`));
      },{input:'dyn-time',min:0,max:20,read:()=>value('dyn-time')});return;
    }
    if(id==='ellipsoids') {
      shell(t('確かめる：同じ体積、異なる形','Explore: equal volume, different shape'),range('dyn-b','b/a',.5,1,.025,1)+range('dyn-c','c/a',.2,1,.025,.6),[['ell-a1','A₁'],['ell-a2','A₂'],['ell-a3','A₃'],['ell-sum','Σ Aᵢ']],t('等体積半径を1に固定。下の二つの図はx–zとy–zの断面。星や銀河の時間発展ではなく、指定した均質な形の内部重力を比較する。','Equal-volume radius is fixed to one. The lower figures are x–z and y–z cross sections, comparing interior gravity of prescribed homogeneous shapes rather than time evolution.'));
      bind(()=>{
        const b=value('dyn-b'),c=value('dyn-c'),a=(1/(b*c))**(1/3),d=M.ellipsoid(a,a*b,a*c);
        d.A.forEach((x,i)=>put('ell-a'+(i+1),fmt(x)));put('ell-sum',fmt(d.poissonSum));
        plot(`<svg viewBox="0 0 640 220" role="img" aria-label="${t('方向ごとの重力係数','Gravity coefficients by direction')}">${d.A.map((x,i)=>`<rect x="${110+i*155}" y="${175-70*x}" width="70" height="${70*x}" fill="${['#48715c','#517d8d','#b25930'][i]}"/><text x="${145+i*155}" y="200" text-anchor="middle">A${i+1} = ${fmt(x)}</text>`).join('')}</svg>`+shapeViews(t('等体積の楕円体の断面','Equal-volume ellipsoid cross sections'),...d.axes));
        status(t(`−W/(GM²)＝${fmt(d.binding)}（等体積半径を1とした単位）。和の2はPoisson方程式の検算で、計算後に強制した値ではない。`,`−W/(GM²) = ${fmt(d.binding)} in equal-volume-radius units. The sum of two checks Poisson’s equation; it is not imposed afterwards.`));
      });return;
    }
    if(id==='tensor-virial') {
      shell(t('解いて比べる：二つの回転平衡','Solve and compare: two rotating equilibria'),range('dyn-e',t('Maclaurinのe','Maclaurin e'),0,.97,.005,.6)+range('dyn-b',t('Jacobiのb/a','Jacobi b/a'),.4,.99,.01,.8),[['rot-mac','Ω²/(πGρ): Maclaurin'],['rot-jac','Ω²/(πGρ): Jacobi'],['rot-axis','c/a: Jacobi'],['rot-energy','T/|W|: Maclaurin']],t('緑：MaclaurinのT/|W|。茶色：Jacobiの平衡系列。縦の破線はMaclaurinの既知の永年・力学的不安定性のしきい値。これらは計算した固有値ではない。二つの選択点は同じ角運動量とは限らない。','Green: Maclaurin T/|W|; brown: Jacobi equilibria. Vertical dashed lines mark supplied Maclaurin secular/dynamical thresholds, not computed eigenvalues. Selected figures need not have equal angular momentum.'));
      const mac=samples(e=>M.maclaurin(e).energyRatio,0,.97,120),jac=samples(x=>x,.4,.999,35).map(p=>{const d=M.jacobi(p.x);return{x:Math.sqrt(1-d.c*d.c),y:d.energyRatio};});
      bind(()=>{
        const e=value('dyn-e'),d=M.maclaurin(e),j=M.jacobi(value('dyn-b'));
        put('rot-mac',fmt(d.omegaSquared));put('rot-jac',fmt(j.omegaSquared));put('rot-axis',fmt(j.c));put('rot-energy',fmt(d.energyRatio));
        plot(chart('rotating-figures',t('回転平衡系列と既知の安定性目盛り','Rotating equilibria with supplied stability landmarks'),'e₁₃ = √(1−c²/a²)','T / |W|',[0,.98],[0,.4],[{points:mac},{points:jac,color:'#b25930'}],[{x:e,y:d.energyRatio},{x:Math.sqrt(1-j.c*j.c),y:j.energyRatio,color:'#517d8d'}],[{x:.81267},{x:.95289}]) + shapeViews(t('選択したJacobi図形の等体積断面','Equal-volume cross sections of selected Jacobi figure'),...(j.axes.map(x=>x/(j.volume**(1/3))))));
        status(t(`Jacobiの表面条件の残差＝${fmt(j.residual)}。Maclaurin点は${e<.81267?'最初の永年不安定性のしきい値より手前':e<.95289?'永年しきい値の先、力学的しきい値の手前':'既知の力学的しきい値の先'}。`,`Jacobi surface-condition residual = ${fmt(j.residual)}. The Maclaurin point is ${e<.81267?'below the first secular threshold':e<.95289?'above the secular but below the dynamical threshold':'above the supplied dynamical threshold'}.`));
      });return;
    }
    if(id==='zeldovich') {
      shell(t('動かして確かめる：粒子の圧縮と密度','Explore: particle compression and density'),range('dyn-growth','D (A = 1)',0,.95,.005,.5),[['zel-jacobian','min J'],['zel-density','max(ρ/ρ̄)'],['zel-linear','max δL'],['zel-nonlinear','max δ']],t('上の灰色が初期の等間隔のラベル、下の色付きが写像後の位置。曲線はEuler位置xでの密度。再生はDを等速で増やし、軌道交差の前で止まる。宇宙時間やガスの衝撃波は解かない。','Gray points: equally spaced initial labels; coloured points: mapped positions. The curve gives density versus Eulerian x. Playback advances D uniformly and stops before shell crossing; it does not solve cosmic time or gas shocks.'));
      bind(()=>{
        const D=value('dyn-growth'),peak=M.zeldovich(0,D);
        put('zel-jacobian',fmt(peak.jacobian));put('zel-density',fmt(peak.density));put('zel-linear',fmt(D));put('zel-nonlinear',fmt(peak.density-1));
        const map=samples(q=>q,-Math.PI,Math.PI,320).map(p=>{const d=M.zeldovich(p.x,D);return{x:d.x,y:d.density};});
        const dots=Array.from({length:41},(_,i)=>{const q=-Math.PI+i*Math.PI/20,d=M.zeldovich(q,D);return`<circle cx="${68+(q+Math.PI)/(2*Math.PI)*510}" cy="48" r="3" fill="#a4aea3"/><circle cx="${68+(d.x+Math.PI)/(2*Math.PI)*510}" cy="112" r="3.2" fill="#b25930"/>`;}).join('');
        plot(`<svg viewBox="0 0 640 150" role="img" aria-label="${t('初期と変位後の粒子','Initial and displaced particles')}"><text x="15" y="52">q</text><text x="15" y="116">x</text>${dots}</svg>`+chart('zel-density',t('一方向に圧縮した密度分布','Density in a one-axis compression'),'x (k = 1)','ρ / ρ̄',[-Math.PI,Math.PI],[0,20],[{points:map}],[{x:0,y:peak.density}]));
        status(t(`DA＝${fmt(D)}。初期ラベルの質量は固定で、密度と体積の積は保存される。`,`DA = ${fmt(D)}. Labelled masses stay fixed; density times mapped volume is conserved.`));
      },{input:'dyn-growth',min:0,max:.95,read:()=>value('dyn-growth')});return;
    }
    if(id==='isothermal-collapse') {
      shell(t('比べる：二つの境界条件と漸近形','Compare: two boundaries and asymptotic profiles'),select('dyn-family',t('解の族','Solution family'),[['shu','Shu'],['lph','Larson–Penston–Hunter']])+range('dyn-sound','cₛ / (km s⁻¹)',.2,.6,.025,.2)+range('dyn-time',t('中心形成後 / kyr','After central formation / kyr'),10,100,1,30),[['col-rate','Ṁ / (M☉ yr⁻¹)'],['col-mass','Mcentral / M☉'],['col-scale','cₛt / au'],['col-coefficient','m₀']],t('緑：選択した族、灰色の破線：他方。内側x≤0.03は自由落下の漸近式、外側x≥10は遠方の漸近式。間の空白は未積分の領域で、曲線を補間していない。Shuの外側静止解はx≥1で厳密だが、比較の表示区間は共通にしている。','Green: selected family; dashed gray: the other. x≤0.03 uses inner free fall; x≥10 uses outer asymptotes. The blank intermediate region is not integrated or interpolated. Shu’s exterior is exact for x≥1, but both displayed ranges are kept identical.'));
      bind(()=>{
        const name=el.querySelector('#dyn-family').value,d=M.collapseScales(name,value('dyn-sound'),value('dyn-time')),other=M.collapseScales(name==='shu'?'lph':'shu',value('dyn-sound'),value('dyn-time'));
        put('col-rate',fmt(d.rate*C.year/C.solar));put('col-mass',fmt(d.mass/C.solar));put('col-scale',fmt(d.scale/C.au));put('col-coefficient',fmt(d.m0));
        const curves=[];
        for(const [model,color,dash] of [[other,'#89968c',true],[d,'#48715c',false]])for(const [a,b,inner] of [[-4,Math.log10(.03),true],[1,2,false]]) curves.push({color,dash,points:samples(z=>z,a,b,100).map(p=>{const x=10**p.x,alpha=inner?model.innerAlpha(x):model.outerA/(x*x),time=value('dyn-time')*1000*C.year;return{x:Math.log10(model.scale*x/C.au),y:Math.log10(alpha/(4*Math.PI*C.G*time*time))};})});
        plot(chart('collapse-asymptotes',t('内外の漸近密度のみを比較','Inner and outer asymptotic densities only'),'log₁₀(r / au)','log₁₀[ρ / (kg m⁻³)]',[-3,6],[-22,-6],curves));
        status(t(`遠方ではαx²≈${fmt(d.outerA)}、u/cₛ≈${fmt(d.outerV)}。cₛtは${name==='shu'?'Shuの膨張波の位置':'相似半径の尺度で、膨張波の位置ではない'}。`,`Outer αx² ≈ ${fmt(d.outerA)} and u/cₛ ≈ ${fmt(d.outerV)}. cₛt is ${name==='shu'?'the Shu expansion-wave radius':'a similarity scale, not an expansion-wave front'}.`));
      });return;
    }
    if(id==='relaxation') {
      shell(t('確かめる：公転と緩和の時間の隔たり','Explore: dynamical versus relaxation times'),range('dyn-count','log₁₀ N',3,6,.05,4)+range('dyn-radius','rₕ / pc',1,10,.25,3),[['rel-dynamical','tdyn / Myr'],['rel-relaxation','trh / Myr'],['rel-ratio','trh / tdyn'],['rel-log','ln(0.4N)']],t('m＝0.5 M☉を固定し、0.138の半質量緩和時間の規約を使う。図は時間尺度の比較で、実際の星の軌道や質量分離の動画ではない。','Fixed stellar mass m = 0.5 M☉, using the 0.138 half-mass convention. The plot compares timescales, not trajectories or a mass-segregation movie.'));
      bind(()=>{
        const N=10**value('dyn-count'),radius=value('dyn-radius'),d=M.relaxation(N,radius);
        put('rel-dynamical',fmt(d.dynamicalTime/C.year/1e6));put('rel-relaxation',fmt(d.halfMassTime/C.year/1e6));put('rel-ratio',fmt(d.ratio));put('rel-log',fmt(d.coulombLog));
        plot(chart('relaxation-scales',t('半質量緩和時間と動力学時間','Half-mass relaxation and dynamical times'),'log₁₀ N','log₁₀(time / Myr)',[3,6],[-2,5],[{points:samples(x=>Math.log10(M.relaxation(10**x,radius).halfMassTime/C.year/1e6),3,6)},{points:samples(x=>Math.log10(M.relaxation(10**x,radius).dynamicalTime/C.year/1e6),3,6),color:'#89968c',dash:true}],[{x:Math.log10(N),y:Math.log10(d.halfMassTime/C.year/1e6)}]));
        status(t('緑：半質量緩和時間。灰色：定義した動力学時間。Nを変える操作は異なる星団の比較で、同じ星団の時間進化ではない。','Green: half-mass relaxation time; gray: the defined dynamical time. Changing N compares different clusters rather than following one cluster in time.'));
      });return;
    }
    if(id==='fokker-planck') {
      shell(t('動かして確かめる：偏りと広がりの競争','Explore: drift versus spreading'),range('dyn-time',t('無次元時間','Dimensionless time'),0,5,.025,0)+range('dyn-drift','γ',0,2,.1,1),[['fp-mean','μ'],['fp-variance','V'],['fp-width','√V'],['fp-equilibrium','Veq = D/γ']],t('D＝0.5、μ₀＝2、V₀＝0.0625。緑：現在、灰色の破線：初期分布、茶色の破線：γ>0での平衡。全実数上で規格化され、表示範囲外の裾もある。これは自己無撞着な星団のFP計算ではない。','D = 0.5, μ₀ = 2, V₀ = 0.0625. Green: current; dashed gray: initial; dashed brown: equilibrium if γ>0. Normalization is over the real line, including tails outside the window. This is not a self-consistent cluster FP calculation.'));
      const initial=M.ornsteinUhlenbeck(0);
      bind(()=>{
        const time=value('dyn-time'),gamma=value('dyn-drift'),d=M.ornsteinUhlenbeck(time,gamma);
        put('fp-mean',fmt(d.mean));put('fp-variance',fmt(d.variance));put('fp-width',fmt(Math.sqrt(d.variance)));put('fp-equilibrium',gamma>0?fmt(.5/gamma):t('なし','None'));
        const curves=[{points:samples(initial.density,-4,4),color:'#89968c',dash:true}];
        if(gamma>0){const variance=.5/gamma;curves.push({points:samples(x=>Math.exp(-x*x/(2*variance))/Math.sqrt(2*Math.PI*variance),-4,4),color:'#b25930',dash:true});}
        curves.push({points:samples(d.density,-4,4)});
        plot(chart('fp-gaussian',t('Ornstein–Uhlenbeck模型の解析解','Analytic Ornstein–Uhlenbeck solution'),'x','f(x,t)',[-4,4],[0,1.7],curves,[{x:d.mean,y:d.density(d.mean)}]));
        status(t(gamma===0?'引き戻しがないので、平均はそのままで分散が増え続ける。再生は無次元時間を等速で進める。':'平均が0へ近づき、分散がD/γへ近づく。再生は無次元時間を等速で進める。',gamma===0?'No restoring drift: mean stays fixed while variance grows. Playback advances dimensionless time uniformly.':'Mean approaches zero and variance approaches D/γ. Playback advances dimensionless time uniformly.'));
      },{input:'dyn-time',min:0,max:5,read:()=>value('dyn-time')});return;
    }
    if(id==='gravothermal') {
      shell(t('解いて確かめる：固定する量で変わる安定性','Solve and check: stability depends on constraints'),select('dyn-ensemble',t('摂動で固定する量','Perturbation constraints'),[['energy',t('M, R, E（断熱壁）','M, R, E (insulating wall)')],['temperature',t('M, R, T（熱浴）','M, R, T (heat bath)')]])+range('dyn-edge','ξᵦ',6,55,.1,20)+select('dyn-step',t('積分の刻み幅','Integration step'),[['0.01','0.01'],['0.005','0.005']]),[['gr-contrast','ρc / ρb'],['gr-eta','η = GM/(Rcₛ²)'],['gr-energy','Λ = −ER/(GM²)'],['gr-limit',t('選択条件の臨界密度比','Critical contrast for selected constraints')]],t('緑は最初の安定性限界の手前、茶色の破線は先。青点は選択した平衡。横軸がエネルギー、縦軸が逆温度の無次元量。系列の移動は時間発展ではない。','Green: before the first stability limit; dashed brown: beyond it; blue: selected equilibrium. Axes are dimensionless energy and inverse temperature. Moving along the sequence is not time evolution.'));
      const cache=new Map();
      bind(()=>{
        const step=value('dyn-step');if(!cache.has(step))cache.set(step,M.gravothermal(60,step));
        const all=cache.get(step),d=M.gravothermal(value('dyn-edge'),step).edge,energy=el.querySelector('#dyn-ensemble').value==='energy',critical=energy?all.microcanonical:all.canonical;
        put('gr-contrast',fmt(d.contrast));put('gr-eta',fmt(d.eta));put('gr-energy',fmt(d.lambda));put('gr-limit',fmt(critical.contrast));
        const convert=points=>points.filter(p=>p.lambda>=-.5).map(p=>({x:p.lambda,y:p.eta}));
        plot(chart('gravo-spiral',t('箱に入れた等温球の平衡系列','Equilibrium sequence of boxed isothermal spheres'),'Λ = −ER/(GM²)','η = GM/(Rcₛ²)',[-.5,.36],[0,2.7],[{points:convert(all.points.filter(p=>p.x<=critical.x))},{points:convert(all.points.filter(p=>p.x>=critical.x)),color:'#b25930',dash:true}],[{x:d.lambda,y:d.eta,color:'#517d8d'},{x:critical.lambda,y:critical.eta}]));
        status(t(`この条件では、選択した平衡は最初の限界の${d.x<critical.x?'手前':'先'}。臨界ξ≈${fmt(critical.x)}。局所的な平均場の安定性であり、開いた星団をこの数字だけで判定しない。`,`Under these constraints the selected equilibrium lies ${d.x<critical.x?'before':'beyond'} the first limit, at ξ ≈ ${fmt(critical.x)}. This is local mean-field stability, not a direct classifier of an open cluster.`));
      });return;
    }
    if(id==='viscous-disk') {
      shell(t('動かして確かめる：降着しながら広がる円盤','Explore: a spreading, accreting disk'),range('dyn-time','t / ts',0,8,.025,0)+range('dyn-viscosity','γ (ν ∝ rᵞ)',0,1.5,.05,1),[['vd-mass','Md / M₀'],['vd-radius','Rc / R₁'],['vd-rate','Ṁin / (M₀/ts)'],['vd-reversal','rturn / R₁']],t('緑：選択時刻、灰色の破線：t＝0。縦軸は初期質量M₀あたり・log₁₀rあたりの質量で、残存質量へ規格化し直していない。再生はt/tsを等速で進める。風も外部供給もない特定の相似解。','Green: selected time; dashed gray: t = 0. The vertical axis is mass per log₁₀ radius divided by initial mass M₀, not renormalized to remaining mass. Playback advances t/ts uniformly for a particular solution with no wind or external supply.'));
      bind(()=>{
        const time=value('dyn-time'),gamma=value('dyn-viscosity'),d=M.viscousDisk(1,time,gamma);
        put('vd-mass',fmt(d.mass));put('vd-radius',fmt(d.characteristicRadius));put('vd-rate',fmt(d.rate));put('vd-reversal',fmt(d.reversalRadius));
        const initial=samples(x=>Math.LN10*M.viscousDisk(10**x,0,gamma).massPerLn,-3,3),current=samples(x=>Math.LN10*M.viscousDisk(10**x,time,gamma).massPerLn,-3,3);
        const arrows=[.1,1,10,100].map(r=>{const v=M.viscousDisk(r,time,gamma).velocity,x=68+(Math.log10(r)+3)/6*510,sign=v>=0?1:-1;return`<path d="M${x-sign*12} 40H${x+sign*12}l${-sign*6} -5m${sign*6} 5l${-sign*6} 5" fill="none" stroke="${v>=0?'#517d8d':'#b25930'}" stroke-width="2"/><text x="${x}" y="70" text-anchor="middle">${r} R₁</text>`;}).join('');
        plot(chart('viscous-profile',t('粘性円盤相似解の質量分布','Similarity-disk mass distribution'),'log₁₀(r/R₁)','ln(10) 2πr²Σ / M₀',[-3,3],[0,2],[{points:initial,color:'#89968c',dash:true},{points:current}],[],[{x:Math.log10(d.reversalRadius)}])+`<svg viewBox="0 0 640 95" role="img" aria-label="${t('半径方向の流れの符号','Signs of radial flow')}">${arrows}</svg>`);
        status(t(`中心へ移った質量は初期質量の${fmt(100*(1-d.mass))}%。縦線rturnより内は内向き、外は外向き。矢印の長さは流速の大きさを表さない。`,`Accreted mass is ${fmt(100*(1-d.mass))}% of initial mass. Flow is inward below rturn and outward above it. Arrow lengths do not encode speed.`));
      },{input:'dyn-time',min:0,max:8,read:()=>value('dyn-time')});return;
    }
    if(id==='goldreich-julian') {
      shell(t('確かめる：必要な電荷の大きさと符号','Explore: required charge magnitude and sign'),range('dyn-period','P / s',.01,2,.01,1)+range('dyn-field','log₁₀(Bp / G)',10,13,.1,12)+range('dyn-theta','θ / deg',0,90,.1,0),[['gj-number','nGJ / cm⁻³'],['gj-charge','ρGJ / (C m⁻³)'],['gj-cylinder','RLC / km'],['gj-cap','rpc / m']],t('Ωと双極子軸が整列した星の表面で評価。θは北極からの角度、Bpは極の磁場。GJは正味の電荷の尺度で、対プラズマの総数ではない。極冠は半径12 kmの整列双極子の見積もり。','Evaluated on an aligned-dipole surface: θ is colatitude and Bp is polar field. GJ measures net charge, not total pair density. The cap estimate uses a 12 km aligned-dipole star.'));
      bind(()=>{
        const theta=value('dyn-theta'),d=M.goldreichJulian(value('dyn-period'),value('dyn-field'),theta);
        put('gj-number',fmt(d.numberCm3));put('gj-charge',fmt(d.charge));put('gj-cylinder',fmt(d.lightCylinder/1000));put('gj-cap',fmt(d.capRadius));
        const normalized=x=>-.5*(3*Math.cos(x*Math.PI/180)**2-1),angle=theta*Math.PI/180,x=320+65*Math.sin(angle),y=110-65*Math.cos(angle);
        plot(chart('gj-charge',t('整列双極子表面の近似電荷密度','Approximate surface charge on an aligned dipole'),'θ / deg','ρGJ / (2ε₀ΩBp)',[0,90],[-1,.5],[{points:samples(normalized,0,90)}],[{x:theta,y:normalized(theta)}],[{y:0},{x:d.nullAngle}])+`<svg viewBox="0 0 640 220" role="img" aria-label="${t('星の表面の選択位置','Selected surface location')}"><circle cx="320" cy="110" r="65" fill="#dce7d9" stroke="#48715c"/><path d="M320 185V15l-5 8m5 -8l5 8" stroke="#517d8d" fill="none"/><text x="337" y="24">Ω, Bp</text><path d="M320 110L${x} ${y}" stroke="#89968c"/><circle cx="${x}" cy="${y}" r="5" fill="#b25930"/><text x="420" y="110">θ = ${fmt(theta)}°</text><text x="320" y="210" text-anchor="middle">${t('星の半径12 km。光円柱はこの縮尺の外。','Stellar radius 12 km; the light cylinder is off this scale.')}</text></svg>`);
        status(t(`ρGJの符号は${d.charge<0?'負':'正'}、近似の中性面はθ≈${fmt(d.nullAngle)}°。符号が変わる面の付近では、省いた項や電流の影響も確認する必要がある。`,`The sign of ρGJ is ${d.charge<0?'negative':'positive'}; the approximate null is θ ≈ ${fmt(d.nullAngle)}°. Near that surface, neglected terms and currents also require attention.`));
      });
    }
  }
  window.AstroDynamicsLabs={supports:id=>ids.has(id),mount};
})();
