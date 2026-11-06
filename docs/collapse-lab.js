/* Density, inward speed and labelled mass shells from the same similarity ODE. */
(() => {
  'use strict';
  const M=window.AstroCollapse,C=window.AstroDynamics.C;
  const colors={shu:'#345c70',lph:'#48715c'};
  const power = n => `10<tspan baseline-shift="super" font-size="10">${n}</tspan>`;
  function graph(id,title,xlabel,ylabel,xd,yd,curves,front,zeroLabel,slope) {
    const X=x=>78+(x-xd[0])/(xd[1]-xd[0])*510,Y=y=>245-(y-yd[0])/(yd[1]-yd[0])*190;
    const ticks=[];
    for(let x=Math.ceil(xd[0]);x<=xd[1];x++)ticks.push(`<path d="M${X(x)} 55V245" stroke="#d9dfd4"/><text x="${X(x)}" y="270" text-anchor="middle">${power(x)}</text>`);
    for(let y=Math.ceil(yd[0]);y<=yd[1];y+=2)ticks.push(`<path d="M78 ${Y(y)}H588" stroke="#d9dfd4" stroke-dasharray="3 4"/><text x="67" y="${Y(y)+5}" text-anchor="end">${power(y)}</text>`);
    const path=points=>points.map((p,i)=>`${i?'L':'M'}${X(p.x).toFixed(2)} ${Y(p.y).toFixed(2)}`).join(' ');
    const boundary=front>=xd[0]&&front<=xd[1]?`<path d="M${X(front)} 55V245" stroke="#b25930" stroke-dasharray="5 4"/>`:'';
    const shade=zeroLabel?`<rect x="${X(Math.max(xd[0],front))}" y="55" width="${Math.max(0,588-X(Math.max(xd[0],front)))}" height="190" fill="#eef0ec"/><text x="${(X(Math.max(xd[0],front))+588)/2}" y="78" text-anchor="middle">${zeroLabel}</text>`:'';
    return `<svg viewBox="0 0 640 313" role="img" aria-labelledby="${id}-title"><title id="${id}-title">${title}</title><defs><clipPath id="${id}-clip"><rect x="78" y="55" width="510" height="190"/></clipPath></defs><text x="78" y="23">${ylabel}</text><text x="78" y="45">${slope}</text>${ticks.join('')}<g clip-path="url(#${id}-clip)">${shade}${curves.map(c=>`<path d="${path(c.points)}" fill="none" stroke="${c.color}" stroke-width="2.8"/>`).join('')}${boundary}</g><path d="M78 55V245H588" stroke="#8c9c8e" fill="none"/><text x="333" y="299" text-anchor="middle">${xlabel}</text></svg>`;
  }
  function mount(el,locale) {
    const t=(ja,en)=>locale==='ja'?ja:en;
    const fmt=x=>x.toLocaleString(locale,{maximumSignificantDigits:4,notation:Math.abs(x)>0&&Math.abs(x)<.001?'scientific':'standard'});
    const radii=[2000,3500,5500,8000,11000,15000,19000];
    el.className='lab advanced-lab collapse-lab';
    el.innerHTML=`<h3>${t('比べる・動かす：ShuとLPHの等温崩壊','Compare and animate: Shu and LPH isothermal collapse')}</h3>
      <p class="lab-note">${t('中心形成後 t > 0。LPはHunterによる継続解（LPH）を表示します。異なる境界条件から選ばれた二つの解の比較です。','After central formation, t > 0. LP is shown through Hunter’s post-formation continuation (LPH). These are two solutions selected by different boundary conditions.')}</p>
      <label for="collapse-sound">cₛ / (km s⁻¹) = <output id="collapse-sound-value" for="collapse-sound"></output></label><input id="collapse-sound" type="range" min=".2" max=".6" step=".025" value=".2">
      <label for="collapse-time">${t('中心形成後の時間 / kyr','Time since central formation / kyr')} = <output id="collapse-time-value" for="collapse-time"></output></label><input id="collapse-time" type="range" min="10" max="100" step=".1" value="30">
      <label for="collapse-axes">${t('グラフの座標','Plot coordinates')}</label><select id="collapse-axes"><option value="physical">${t('実際の半径・密度・速度（時間で変化）','Physical radius, density and speed (time-dependent)')}</option><option value="similarity">${t('相似座標 x・α・|v|（同じ形に重なる）','Similarity coordinates x, α and |v| (fixed shape)')}</option></select>
      <div class="readout"><div class="stat"><small>Shu: Ṁ / (M☉ yr⁻¹)</small><strong id="collapse-shu-rate"></strong></div><div class="stat"><small>LPH: Ṁ / (M☉ yr⁻¹)</small><strong id="collapse-lph-rate"></strong></div><div class="stat"><small>Shu: M★ / M☉</small><strong id="collapse-shu-mass"></strong></div><div class="stat"><small>LPH: M★ / M☉</small><strong id="collapse-lph-mass"></strong></div></div>
      <p class="collapse-legend"><span class="collapse-key collapse-shu">Shu</span><span class="collapse-key collapse-lph">Larson–Penston–Hunter</span><span class="collapse-key collapse-front">${t('Shuの膨張波 r = cₛt','Shu expansion wave r = cₛt')}</span></p>
      <p class="plot-scroll-hint lab-note">${t('図は横にスクロールできます。','Scroll plots horizontally to read the axes.')}</p><div class="gas-plot collapse-profiles"></div>
      <p class="lab-note">${t('両軸は対数。流入速度は負の u の大きさ |u| を描きます。Shuの外側は厳密に u = 0 なので対数軸に点を打てず、灰色の領域で示します。橙色の線はガス粒子ではなく、崩壊開始を外へ伝える波の先端です。','Both axes are logarithmic. Inward speed means the magnitude |u| of negative radial velocity. Shu’s exact u = 0 exterior cannot be plotted on a logarithmic axis and is indicated by shading. The orange line is the outward-moving onset of infall, not a gas particle.')}</p>
      <h4>${t('同じガスの殻は、どこへ動く？','Where does the same gas shell move?')}</h4><div class="gas-plot collapse-shells"></div>
      <p class="lab-note">${t('下図の半径は線形目盛り。点は10 kyrで選んだガスの殻で、各殻の内側の総質量（中心星を含む）を一定にして位置を追います。各点は等しい質量ではありません。星の記号は実際の半径を表しません。二つの模型で初期の半径は同じですが、密度と質量は異なります。','The lower diagram uses a linear radius scale. Dots track shells selected at 10 kyr by keeping their enclosed total mass, including the central star, fixed. Dots do not represent equal masses. The star symbol is not a physical stellar radius. Initial radii agree between the two models, while densities and masses differ.')}</p>
      <p class="collapse-status lab-note" role="status"></p>
      <details class="collapse-method"><summary>${t('計算方法と文献との照合','Numerical method and reference checks')}</summary><p>${t('曲線は内外の漸近式をつないだ近似ではなく、相似ODEの数値積分です。Shuは遠方の密度係数 A = 2 + ε, 2 + 2ε, 2 + 3ε（ε = 10⁻⁶）の流れからA → 2⁺へ二次外挿し、x ≥ 1は厳密な静止解に置き換えます。これはShu (1977) §IIの方法に従います。LPHは遠方の丸めた係数 A = 8.86、v∞ = −3.28から積分します。','Profiles numerically integrate the similarity ODE rather than joining inner and outer asymptotes. Shu uses quadratic extrapolation to A → 2⁺ from A = 2 + ε, 2 + 2ε, 2 + 3ε (ε = 10⁻⁶), replacing x ≥ 1 with the exact static exterior, following Shu (1977), §II. LPH is integrated from the rounded outer data A = 8.86, v∞ = −3.28.')}</p><p class="collapse-numerics"></p><p>${t('密度・速度は4段Runge–Kutta法で求め、図は保存した数値点の間を補間しています。質量関係 m = x²α(x−v) と m′ = x²α、刻み幅を半分にした結果、自由落下の極限、Shu (1977) Table 2との一致を検算します。有限の雲の外端、回転、磁場、加熱は含めません。','Fourth-order Runge–Kutta integration supplies density and velocity; plots interpolate stored numerical samples. Checks cover m = x²α(x−v), m′ = x²α, half-step convergence, free-fall limits and Shu (1977), Table 2. Finite outer boundaries, rotation, magnetic fields and heating are omitted.')}</p></details>`;
    const put=(id,value)=>{el.querySelector('#'+id).textContent=value;};
    const update=()=>{
      const sound=Number(el.querySelector('#collapse-sound').value),time=Number(el.querySelector('#collapse-time').value),similarity=el.querySelector('#collapse-axes').value==='similarity';
      put('collapse-sound-value',fmt(sound));put('collapse-time-value',fmt(time));
      const models=['shu','lph'].map(branch=>({branch,s:M.scales(branch,sound,time),color:colors[branch]}));
      models.forEach(({branch,s})=>{put(`collapse-${branch}-rate`,fmt(s.rate*C.year/C.solar));put(`collapse-${branch}-mass`,fmt(s.mass/C.solar));});
      const xd=similarity?[-3,2]:[1,5],front=similarity?0:Math.log10(models[0].s.scale/C.au);
      const sampleZ=[...new Set([...Array.from({length:401},(_,i)=>xd[0]+(xd[1]-xd[0])*i/400),...[-.1,-.03,-.01,-.003,-.001,-.0003,-.0001,-.00003,-.00001,0].map(d=>front+d)])].filter(z=>z>=xd[0]&&z<=xd[1]).sort((a,b)=>a-b);
      const curves=kind=>models.map(({s,color})=>({color,points:sampleZ.map(z=>{
        const x=10**z,point=similarity?M.at(s.profile,x):M.physical(s,x);
        const y=kind==='density'?(similarity?point.alpha:point.density/1000):(similarity?-point.v:-point.velocity/1000);
        return y>0?{x:z,y:Math.log10(y)}:null;
      }).filter(Boolean)}));
      el.querySelector('.collapse-profiles').innerHTML=graph('collapse-density',t('ShuとLPHの密度プロファイル：両対数','Shu and LPH density profiles: log–log'),similarity?'x = r / (cₛt)':'r / au',similarity?'α = 4πGt²ρ':'ρ / (g cm⁻³)',xd,similarity?[-5,6]:[-23,-10],curves('density'),front,'',t('内側の傾き −3/2、外側の傾き −2','Inner slope −3/2; outer slope −2'))+
        graph('collapse-speed',t('ShuとLPHの流入速度プロファイル：両対数','Shu and LPH inward-speed profiles: log–log'),similarity?'x = r / (cₛt)':'r / au',similarity?'|v| = |u| / cₛ':'|u| / (km s⁻¹)',xd,[-4,3],curves('speed'),front,'Shu: u = 0',t('内側の傾き −1/2、LPHの外側は一定へ','Inner slope −1/2; LPH approaches constant outer speed'));
      const X=r=>95+r/20000*490;
      const rows=models.map(({branch,s,color},index)=>{
        const y=62+index*79,shells=radii.map(r=>M.shell(branch,r,sound,time)),accreted=shells.filter(p=>p.accreted).length;
        const wave=branch==='shu'?`<path d="M${X(s.scale/C.au)} ${y-22}v42" stroke="#b25930" stroke-width="2" stroke-dasharray="4 3"/>`:'';
        const points=shells.filter(p=>!p.accreted).map(p=>`<circle cx="${X(p.radiusAu).toFixed(2)}" cy="${y}" r="5" fill="${color}" stroke="white"/>`).join('');
        return `<text x="12" y="${y+5}">${branch==='shu'?'Shu':'LPH'}</text><path d="M95 ${y}H585" stroke="#bdc9bb"/><circle cx="95" cy="${y}" r="8" fill="#b25930"/>${wave}${points}<text x="95" y="${y+31}">M★ = ${fmt(s.mass/C.solar)} M☉ · ${t('中心へ到達した点','dots accreted')}: ${accreted} / ${radii.length}</text>`;
      }).join('');
      el.querySelector('.collapse-shells').innerHTML=`<svg viewBox="0 0 640 235" role="img" aria-label="${t('ShuとLPHで、質量を追跡したガス殻の位置','Mass-labelled shell positions for Shu and LPH')}"><text x="95" y="23">t = ${fmt(time)} kyr · cₛ = ${fmt(sound)} km s⁻¹</text>${rows}${[0,5000,10000,15000,20000].map(r=>`<text x="${X(r)}" y="207" text-anchor="middle">${r/1000}</text>`).join('')}<text x="340" y="230" text-anchor="middle">r / (10³ au)</text></svg>`;
      el.querySelector('.collapse-status').textContent=t(`Shuの膨張波：${fmt(models[0].s.scale/C.au)} au。外側の点は波が届くまで静止し、LPHでは外側も初めから流入します。相似座標の曲線は時間を進めても変わりません。`,`Shu expansion wave: ${fmt(models[0].s.scale/C.au)} au. Exterior shells stay at rest until reached; LPH’s envelope is already infalling. Similarity-coordinate profiles stay fixed as time advances.`);
      el.querySelector('.collapse-numerics').textContent=t(`計算値 m₀：Shu ${fmt(models[0].s.m0)}、LPH ${fmt(models[1].s.m0)}。文献の概数はそれぞれ0.975、46.9です。LPHの小さな差（約0.2%）には遠方条件の丸めが効きます。表示の降着率と中心質量には、積分したプロファイルと同じm₀を使っています。`,`Computed m₀: Shu ${fmt(models[0].s.m0)}, LPH ${fmt(models[1].s.m0)}; approximate literature values are 0.975 and 46.9. Rounded outer conditions affect the small LPH difference (about 0.2%). Displayed accretion rates and central masses use the same m₀ as the integrated profiles.`);
    };
    el.addEventListener('input',update);el.addEventListener('change',update);update();
    window.AstroAnimation.mount(el,{locale,input:'collapse-time',min:10,max:100,read:()=>Number(el.querySelector('#collapse-time').value),write:value=>{el.querySelector('#collapse-time').value=value;update();},duration:18000});
  }
  window.AstroCollapseLab={mount};
})();
