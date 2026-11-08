/* Local, finite interactive diagrams for the completed solution lessons. */
(() => {
  'use strict';
  const M=window.AstroSolutionMath,colors=['#345c70','#b25930','#48715c','#8b5c83'];
  const sample=(fn,a,b,n=120)=>Array.from({length:n+1},(_,i)=>{const x=a+(b-a)*i/n;return{x,y:fn(x)};});
  function plot(lines,{xlabel,ylabel,xmax=1,ymin=0,ymax=10,cursor=null}) {
    const X=x=>70+510*x/xmax,Y=y=>235-180*(y-ymin)/(ymax-ymin);
    return `<svg viewBox="0 0 640 320" role="img" aria-label="${ylabel}"><text x="70" y="25">${ylabel}</text>${Array.from({length:5},(_,i)=>{const y=ymin+(ymax-ymin)*i/4;return`<path d="M70 ${Y(y)}H580" stroke="#d9dfd4"/><text x="58" y="${Y(y)+4}" text-anchor="end">${Number(y.toPrecision(3))}</text>`;}).join('')}${Array.from({length:5},(_,i)=>`<text x="${X(xmax*i/4)}" y="257" text-anchor="middle">${Number((xmax*i/4).toPrecision(3))}</text>`).join('')}${lines.map((l,i)=>`<path d="${l.points.map((p,j)=>`${j?'L':'M'}${X(p.x).toFixed(2)} ${Y(p.y).toFixed(2)}`).join(' ')}" stroke="${colors[i]}" stroke-width="2.5" fill="none"/>`).join('')}${cursor===null?'':`<path d="M${X(cursor)} 55V235" stroke="#23332c" stroke-dasharray="4 4"/>`}<path d="M70 55V235H580" stroke="#89968c" fill="none"/><text x="325" y="282" text-anchor="middle">${xlabel}</text>${lines.map((l,i)=>`<text x="${80+(i%2)*260}" y="${303+Math.floor(i/2)*17}" fill="${colors[i]}" font-size="12">${l.name}</text>`).join('')}</svg>`;
  }
  function mount(el,locale){
    const kind=el.dataset.lab,t=(ja,en)=>locale==='ja'?ja:en,fmt=x=>Number(x).toLocaleString(locale,{maximumSignificantDigits:5});
    const range=(id,label,min,max,step,value)=>`<label for="${id}">${label} = <output for="${id}" id="${id}-value"></output></label><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}">`;
    const stats=items=>`<div class="readout">${items.map(([id,label])=>`<div class="stat"><small>${label}</small><strong id="${id}"></strong></div>`).join('')}</div>`;
    el.className='lab advanced-lab solution-extension-lab';
    const value=id=>Number(el.querySelector('#'+id).value),put=(id,s)=>{el.querySelector('#'+id).textContent=s;};
    const outputs=()=>el.querySelectorAll('input').forEach(i=>put(i.id+'-value',fmt(i.value)));
    if(kind==='kerr'){
      el.innerHTML=`<h3>${t('回転と三つの境界を比べる','Compare spin and characteristic radii')}</h3>${range('k-spin','χ',0,.998,.002,.8)}${range('k-theta','θ / π',.05,.95,.01,.5)}${range('k-offset','R − R₊',.05,8,.05,.3)}${stats([['k-h','R₊'],['k-e','Rₑ(θ)'],['k-is','ISCO (+ / −)'],['k-w','ΩZ GM/c³']])}<p id="k-state" role="status"></p><div class="gas-plot k-plot"></div><p class="lab-note">${t('横軸χ、縦軸はGM/c²単位のBoyer–Lindquist座標半径。破線位置の代わりに黒い縦線で現在のχを示す。角速度は固定R,θの観測者の値で、円軌道の角速度ではない。','Horizontal: spin χ. Vertical: Boyer–Lindquist radius in GM/c² units. The black vertical line marks the selected spin. Angular velocity refers to a fixed-R,θ observer, not a circular geodesic.')} ${t('図は横にスクロールできます。','Scroll the plot horizontally if needed.')}</p>`;
      const render=()=>{
        outputs();const chi=value('k-spin'),theta=Math.PI*value('k-theta'),h=1+Math.sqrt(1-chi*chi),R=h+value('k-offset'),d=M.kerr(chi,theta,R);
        put('k-h',fmt(d.horizon));put('k-e',fmt(d.ergo));put('k-is',fmt(d.prograde)+' / '+fmt(d.retrograde));put('k-w',fmt(d.omega));
        put('k-state',`R = ${fmt(R)}; Ω ∈ (${fmt(d.omegaMin)}, ${fmt(d.omegaMax)}). `+(d.staticRate===null?t('静止不可：エルゴ領域。Ω＝0は許されない。','Inside the ergoregion: Ω = 0 is not allowed.'):t('静止可能。dτ/dt = ','Static observers are possible. dτ/dt = ')+fmt(d.staticRate)));
        el.querySelector('.k-plot').innerHTML=plot([
          {name:t('地平面 R₊','Horizon R₊'),points:sample(x=>1+Math.sqrt(1-x*x),0,1)},
          {name:t('静止限界 Rₑ(θ)','Static limit Rₑ(θ)'),points:sample(x=>1+Math.sqrt(1-x*x*Math.cos(theta)**2),0,1)},
          {name:t('順行 ISCO','Prograde ISCO'),points:sample(x=>M.isco(x),0,1)},
          {name:t('逆行 ISCO','Retrograde ISCO'),points:sample(x=>M.isco(x,-1),0,1)}
        ],{xlabel:'χ',ylabel:'R / (GM/c²)',ymax:10,cursor:chi}).replace('viewBox="0 0 640 320"','viewBox="0 0 640 340"');
      };el.addEventListener('input',render);render();return;
    }
    if(kind==='tomimatsu-sato'){
      el.innerHTML=`<h3>${t('KerrとTS2の四重極','Kerr and TS2 quadrupoles')}</h3>${range('ts-q','q = J/M²',0,.98,.01,.5)}${stats([['ts-k','QKerr / M³'],['ts-2','QTS2 / M³'],['ts-ring','ρring / M'],['ts-f','Re ℰ (x=3, y=0.4)']])}<p id="ts-state" role="status"></p><div class="gas-plot ts-plot"></div><p class="lab-note">${t('両曲線は同じMとJで比較。環の位置は特異点の円筒座標で、物質の半径や観測像ではない。q＝0にはx＞1の環の根がない。','Compare both curves at equal M and J. Ring position is a cylindrical coordinate of a singularity, not a material radius or observed image. At q = 0 there is no ring root with x > 1.')} ${t('横にスクロールできます。','Scroll horizontally if needed.')}</p>`;
      const render=()=>{outputs();const q=value('ts-q'),ring=M.ring(q);put('ts-k',fmt(M.quadrupole(q,1)));put('ts-2',fmt(M.quadrupole(q)));put('ts-ring',ring?fmt(ring.rhoOverM):t('外側の環なし','No exterior ring'));put('ts-f',fmt(M.ernst(3,.4,q).re));put('ts-state',t('四重極の差 ΔQ/M³ = ','Quadrupole difference ΔQ/M³ = ')+fmt(M.quadrupole(q)-M.quadrupole(q,1))+(ring?`; x₀ = ${fmt(ring.x)}`:''));el.querySelector('.ts-plot').innerHTML=plot([{name:'Kerr · δ=1',points:sample(x=>M.quadrupole(x,1),0,.999)},{name:'TS2 · δ=2',points:sample(x=>M.quadrupole(x),0,.999)}],{xlabel:'q = J/M²',ylabel:'Q / M³',ymin:-1,ymax:0,cursor:q});};
      el.addEventListener('input',render);render();return;
    }
    let result=M.collapse(.7);
    el.innerHTML=`<h3>${t('一様な雲の形を追う','Follow a homogeneous cloud')}</h3>${range('lms-q','q₀ = c₀/a₀',.4,2.5,.05,.7)}${range('lms-time','τ / τcut',0,1,.002,0)}${stats([['lms-ratio','c/a'],['lms-density','ρ/ρ₀'],['lms-t','τ = t√(2πGρ₀)'],['lms-energy',t('最大相対エネルギー誤差','Maximum relative energy error')]])}<div class="gas-plot lms-shape"></div><div class="gas-plot lms-track"></div><p id="lms-state" class="lab-note" role="status"></p><p class="lab-note">${t('黒線は選択した時刻。図の半軸は初期a₀と同じ長さ尺度で表示。再生は計算した時間軌跡に沿い、特異点の手前の打切りで終了する。図は横にスクロールできます。','The black line marks the selected time. Shape uses a fixed initial-a₀ length scale. Playback follows the computed time history and ends at a pre-singularity cutoff. Scroll plots horizontally if needed.')}</p>`;
    const render=()=>{
      outputs();const ps=result.points,end=ps.at(-1).time,time=value('lms-time')*end;
      let hi=ps.findIndex(p=>p.time>=time);if(hi<0)hi=ps.length-1;const lo=Math.max(0,hi-1),w=hi===lo?0:(time-ps[lo].time)/(ps[hi].time-ps[lo].time);
      const a=ps[lo].a+(ps[hi].a-ps[lo].a)*w,c=ps[lo].c+(ps[hi].c-ps[lo].c)*w;
      put('lms-ratio',fmt(c/a));put('lms-density',fmt(result.q0/(a*a*c)));put('lms-t',fmt(time));put('lms-energy',result.energyError.toExponential(2));
      const scale=90/Math.max(1,result.q0),ellipse=(cx,a,c,color)=>`<ellipse cx="${cx}" cy="120" rx="${a*scale}" ry="${c*scale}" fill="${color}" fill-opacity=".2" stroke="${color}" stroke-width="2"/>`;
      el.querySelector('.lms-shape').innerHTML=`<svg viewBox="0 0 640 250" role="img" aria-label="${t('同じ尺度で表示する初期と現在の断面','Initial and current sections at the same scale')}">${ellipse(175,1,result.q0,colors[0])}${ellipse(465,a,c,colors[1])}<text x="175" y="235" text-anchor="middle">${t('初期','Initial')}</text><text x="465" y="235" text-anchor="middle">τ = ${fmt(time)}</text></svg>`;
      el.querySelector('.lms-track').innerHTML=plot([{name:'a/a₀',points:ps.map(p=>({x:p.time,y:p.a}))},{name:'c/c₀',points:ps.map(p=>({x:p.time,y:p.c/result.q0}))}],{xlabel:'τ = t√(2πGρ₀)',ylabel:t('初期値で割った半軸','Axes / initial axes'),xmax:end,ymax:1,cursor:time});
      put('lms-state',`τcut = ${fmt(end)}; `+t('短軸／長軸または初期比半軸が0.03に達する手前まで。点がつぶれた後の運動は計算しない。','Stop at a short/long-axis or initial-normalized-axis cutoff of 0.03; no post-caustic motion is computed.'));
    };
    el.addEventListener('input',event=>{if(event.target.id==='lms-q'){result=M.collapse(value('lms-q'));el.querySelector('#lms-time').value=0;}render();});render();
    window.AstroAnimation.mount(el,{locale,min:0,max:1,duration:14000,read:()=>value('lms-time'),write:v=>{el.querySelector('#lms-time').value=v;render();}});
  }
  window.AstroSolutionLabs={mount,supports:id=>['kerr','tomimatsu-sato','lin-mestel-shu'].includes(id)};
})();
