/* Opt-in time evolution of three explicitly closed nonequilibrium models. */
(() => {
  'use strict';
  const M=window.AstroNonequilibrium,C=M.C,ids=new Set(['two-temperature','ambipolar-diffusion','three-body-chemistry']);
  const colors={blue:'#345c70',rust:'#b25930',green:'#48715c',gray:'#89968c'};
  const range=(id,label,min,max,step,value)=>`<label for="${id}">${label} = <output id="${id}-value" for="${id}"></output></label><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}">`;
  const samples=(fn,a,b,n=180)=>Array.from({length:n+1},(_,i)=>{const x=a+(b-a)*i/n;return{x,y:fn(x)};});
  function chart(id,title,xlabel,ylabel,xd,yd,curves,markers=[],guides=[]) {
    const X=x=>68+(x-xd[0])/(xd[1]-xd[0])*510,Y=y=>235-(y-yd[0])/(yd[1]-yd[0])*190;
    const path=points=>points.map((p,i)=>`${i?'L':'M'}${X(p.x).toFixed(3)} ${Y(p.y).toFixed(3)}`).join(' ');
    const ticks=Array.from({length:5},(_,i)=>{const x=xd[0]+(xd[1]-xd[0])*i/4,y=yd[0]+(yd[1]-yd[0])*i/4;return`<path d="M${X(x)} 45V235M68 ${Y(y)}H578" stroke="#d9dfd4" stroke-dasharray="3 4"/><text x="${X(x)}" y="257" text-anchor="middle">${Number(x.toPrecision(3))}</text><text x="58" y="${Y(y)+4}" text-anchor="end">${Number(y.toPrecision(3))}</text>`;}).join('');
    return `<svg viewBox="0 0 640 295" role="img" aria-labelledby="${id}-title"><title id="${id}-title">${title}</title><defs><clipPath id="${id}-clip"><rect x="68" y="45" width="510" height="190"/></clipPath></defs><text x="68" y="23">${ylabel}</text>${ticks}<g clip-path="url(#${id}-clip)">${guides.map(g=>`<path d="M${X(g)} 45V235" stroke="#89968c" stroke-dasharray="4 4"/>`).join('')}${curves.map(c=>`<path d="${path(c.points)}" fill="none" stroke="${c.color}" stroke-width="2.7" ${c.dash?'stroke-dasharray="5 4"':''}/>`).join('')}${markers.map(m=>`<circle cx="${X(m.x)}" cy="${Y(m.y)}" r="4.5" fill="${m.color}" stroke="white"/>`).join('')}</g><path d="M68 45V235H578" stroke="#8c9c8e" fill="none"/><text x="323" y="284" text-anchor="middle">${xlabel}</text></svg>`;
  }
  function mount(el,locale) {
    const t=(ja,en)=>locale==='ja'?ja:en,fmt=x=>x.toLocaleString(locale,{maximumSignificantDigits:4,notation:x!==0&&(Math.abs(x)<.001||Math.abs(x)>=1e5)?'scientific':'standard'});
    const value=id=>Number(el.querySelector('#'+id).value),put=(id,text)=>{el.querySelector('#'+id).textContent=text;};
    const plot=html=>{el.querySelector('.neq-plot').innerHTML=html;},status=text=>{el.querySelector('.neq-status').textContent=text;};
    function shell(title,controls,entries,note) {
      el.className='lab advanced-lab';
      el.innerHTML=`<h3>${title}</h3>${controls}<div class="readout">${entries.map(([id,label])=>`<div class="stat"><small>${label}</small><strong id="${id}"></strong></div>`).join('')}</div><p class="plot-scroll-hint lab-note">${t('図は横にスクロールできます。','Scroll plots horizontally to read the axes.')}</p><div class="gas-plot neq-plot"></div><p class="neq-status lab-note" role="status"></p><p class="lab-note">${note}</p>`;
    }
    function bind(update) {
      const render=()=>{el.querySelectorAll('input[type=range]').forEach(input=>put(input.id+'-value',fmt(Number(input.value))));update();};
      el.addEventListener('input',render);el.addEventListener('change',render);render();
      window.AstroAnimation.mount(el,{locale,min:0,max:3,duration:18000,read:()=>value('neq-time'),write:x=>{el.querySelector('#neq-time').value=x;render();}});
    }
    const id=el.dataset.lab;
    if(id==='two-temperature') {
      shell(t('動かして確かめる：電子とイオンが熱を交換する','Explore: electrons and ions exchange heat'),
        range('neq-beta','β = Tₑ₀ / Tᵢ₀',.01,1,.01,.1)+range('neq-density','log₁₀(n / cm⁻³)',-4,0,.1,-2)+range('neq-flow',t('流れの時間 / kyr','Flow time / kyr'),10,1000,10,300)+range('neq-time','t / tflow',0,3,.01,1),
        [['neq-te','kBTₑ / keV'],['neq-ti','kBTᵢ / keV'],['neq-decay',t('平衡近くの減衰時間 / tflow','Near-equilibrium decay time / tflow')],['neq-delta','Δ / Δ₀']],
        t('青＝電子、赤＝イオン。灰色の縦線＝流れの時間、横破線＝最終温度。下の棒はエネルギーの分配。初期kBTᵢ＝2 keV、lnΛ＝30。流れの時間は比較の時計で、運動を解いてはいない。理論式から計算した図で、論文図や観測値の再現ではない。','Blue: electrons; rust: ions. Vertical gray: one flow time; horizontal dashed: final temperature. Bars show energy partition. Initial kBTᵢ = 2 keV and lnΛ = 30. Flow time is a comparison clock, not simulated motion. Recomputed teaching model, not a published figure or observed dataset.'));
      let cacheKey='',model,curves;
      bind(()=>{
        const beta=value('neq-beta'),n=10**value('neq-density'),flow=value('neq-flow')*1000*C.year,time=value('neq-time'),key=[beta,n,flow].join(':');
        if(key!==cacheKey){model=M.twoTemperature(2,beta,n);curves=[{points:samples(x=>model.at(x*flow).te,0,3),color:colors.blue},{points:samples(x=>model.at(x*flow).ti,0,3),color:colors.rust},{points:[{x:0,y:model.mean},{x:3,y:model.mean}],color:colors.gray,dash:true}];cacheKey=key;}
        const d=model.at(time*flow),fraction=model.difference?d.delta/model.difference:0;
        put('neq-te',fmt(d.te));put('neq-ti',fmt(d.ti));put('neq-decay',fmt(model.equilibriumTime/2/flow));put('neq-delta',model.difference?fmt(fraction):t('初めから同温度','Initially equal'));
        plot(chart('neq-temperature',t('Coulomb交換による2温度の緩和','Two-temperature Coulomb relaxation'),'t / tflow','kBT / keV',[0,3],[0,2.1],curves,[{x:time,y:d.te,color:colors.blue},{x:time,y:d.ti,color:colors.rust}],[1])+`<svg viewBox="0 0 640 155" role="img" aria-label="${t('一定の全熱エネルギーの電子・イオンへの分配','Partition of constant total thermal energy')}"><text x="68" y="25">${t('全熱エネルギー＝一定','Total thermal energy is constant')}</text><rect x="68" y="45" width="${510*d.te/model.sum}" height="34" fill="${colors.blue}"/><rect x="${68+510*d.te/model.sum}" y="45" width="${510*d.ti/model.sum}" height="34" fill="${colors.rust}"/><text x="68" y="110">${t('電子','Electrons')}: ${fmt(100*d.te/model.sum)}%</text><text x="578" y="110" text-anchor="end">${t('イオン','Ions')}: ${fmt(100*d.ti/model.sum)}%</text></svg>`);
        status(t(`経過 ${fmt(time*flow/C.year/1000)} kyr。初期tₑᵢ＝${fmt(model.initialTime/C.year/1000)} kyr、最終T̄のtₑᵢ＝${fmt(model.equilibriumTime/C.year/1000)} kyr。温度の和は${fmt(model.sum)} keV/kBで一定。`,`Elapsed ${fmt(time*flow/C.year/1000)} kyr. Initial tₑᵢ = ${fmt(model.initialTime/C.year/1000)} kyr; tₑᵢ at final T̄ = ${fmt(model.equilibriumTime/C.year/1000)} kyr. The temperature sum stays ${fmt(model.sum)} keV/kB.`));
      });return;
    }
    if(id==='ambipolar-diffusion') {
      shell(t('動かして確かめる：磁場の山がならされる','Explore: a magnetic bump smooths out'),
        range('neq-density','log₁₀(nₙ / cm⁻³)',3,6,.1,4)+range('neq-ion','log₁₀(χᵢ)',-9,-5,.1,-7)+range('neq-length','L / pc',.03,.3,.01,.1)+range('neq-time','t / tff',0,3,.01,1),
        [['neq-eta','ηAD / cm² s⁻¹'],['neq-clock','tAD / tff'],['neq-drift','vD,max(0) / cₛ'],['neq-strong','tᵢₙ / tAD']],
        t('灰破線＝初期、緑＝現在のBz/B₀。矢印＝荷電粒子のドリフトの向き。矢印の長さは初期最大速度との比で、設定間の絶対速度比較ではない。中性背景は静止。ε＝0.1、B₀＝30 μG、T＝10 K。線形・一定係数の解析解で、二流体の雲崩壊の数値計算ではない。','Dashed gray: initial field; green: current Bz/B₀. Arrows show charge-drift direction and speed relative to its initial maximum, not an absolute speed comparison across settings. Neutrals stay fixed. ε = 0.1, B₀ = 30 μG, T = 10 K. Linear constant-coefficient analytic solution, not a two-fluid cloud-collapse simulation.'));
      bind(()=>{
        const d=M.ambipolar(10**value('neq-density'),10**value('neq-ion'),value('neq-length')),time=value('neq-time')*d.tff,current=d.at(time);
        put('neq-eta',fmt(d.eta));put('neq-clock',fmt(d.tAD/d.tff));put('neq-drift',fmt(d.drift0/d.cs));put('neq-strong',fmt(d.tin/d.tAD));
        const arrows=Array.from({length:9},(_,i)=>{const u=-Math.PI+2*Math.PI*i/8,x=68+(u+Math.PI)/(2*Math.PI)*510,dx=22*d.at(time,u).drift/d.drift0;if(Math.abs(dx)<.1)return'';const end=x+dx;return`<path d="M${x} 60H${end}l${-Math.sign(dx)*6} -4m${Math.sign(dx)*6} 4l${-Math.sign(dx)*6} 4" stroke="${colors.rust}" fill="none" stroke-width="2"/>`;}).join('');
        plot(chart('neq-field',t('線形の磁場摂動の拡散','Diffusion of a linear magnetic perturbation'),'x / L','Bz / B₀',[-Math.PI,Math.PI],[.88,1.12],[{points:samples(x=>d.at(0,x).field,-Math.PI,Math.PI),color:colors.gray,dash:true},{points:samples(x=>d.at(time,x).field,-Math.PI,Math.PI),color:colors.green}])+`<svg viewBox="0 0 640 170" role="img" aria-label="${t('荷電粒子は磁場の山から谷へ、中性背景は固定','Charges drift from magnetic maxima toward minima; neutrals stay fixed')}"><text x="68" y="24">${t('荷電粒子のドリフト','Charged-particle drift')}</text>${arrows}<path d="M68 115H578" stroke="#89968c" stroke-dasharray="3 4"/><text x="68" y="145">${t('中性粒子：静止した背景','Neutrals: static background')}</text></svg>`);
        const flag=d.drift0/d.cs>=.3||d.tin/d.tAD>=.1;
        status(t(`tAD＝${fmt(d.tAD/C.year/1e6)} Myr、tff＝${fmt(d.tff/C.year/1e6)} Myr。現在の振幅 / 初期振幅＝${fmt(current.amplitude/.1)}。${flag?'近似の注意：初期ドリフトが熱速度に比べて十分小さい、またはイオン慣性が小さいという条件を再確認する。':'この設定では初期ドリフトとイオン慣性の指標は小さい。背景を固定する仮定は別途必要。'}`,`tAD = ${fmt(d.tAD/C.year/1e6)} Myr; tff = ${fmt(d.tff/C.year/1e6)} Myr. Current / initial amplitude = ${fmt(current.amplitude/.1)}. ${flag?'Validity flag: recheck small initial drift and negligible ion inertia before interpreting this closure physically.':'Initial drift and ion-inertia indicators are small here. The prescribed neutral background remains a separate assumption.'}`));
      });return;
    }
    if(id==='three-body-chemistry') {
      shell(t('動かして確かめる：原子から水素分子へ','Explore: atomic hydrogen becomes molecular'),
        range('neq-temperature','T / K',600,3000,100,1000)+range('neq-density','log₁₀(nN / cm⁻³)',8,13,.1,11)+range('neq-time','t / tff',0,3,.01,1),
        [['neq-rate','k₃ / cm⁶ s⁻¹'],['neq-half','t₅₀ / tff'],['neq-molecules','nH₂ / nN = x / 2'],['neq-binding',t('結合エネルギーの尺度 / eV・原子核⁻¹','Binding-energy scale / eV per nucleus')]],
        t('青＝原子に残る原子核、緑＝分子に入った原子核。赤点＝現在時刻。模式図の第三のH（赤）は反応後も残る。温度・密度一定、一方向の反応だけ。図は論文の反応係数を入力した解析模型で、崩壊計算や原論文の図の再現ではない。','Blue: nuclei in atoms; green: nuclei in molecules; red dots: selected time. The third H (rust) survives the reaction in the sketch. Fixed temperature and density, forward reaction only. Analytic model using the published coefficient, not a collapse simulation or reproduction of the paper’s figure.'));
      bind(()=>{
        const d=M.chemistry(value('neq-temperature'),10**value('neq-density')),time=value('neq-time'),q=d.at(time*d.tff);
        put('neq-rate',fmt(d.k3));put('neq-half',fmt(d.t50/d.tff));put('neq-molecules',fmt(q.x/2));put('neq-binding',fmt(q.bindingPerNucleus));
        const atom=(x,y,color)=>`<circle cx="${x}" cy="${y}" r="14" fill="${color}"/><text x="${x}" y="${y+5}" text-anchor="middle" style="fill:white">H</text>`;
        plot(chart('neq-chemistry',t('保存する水素原子核の分配','Partition of conserved hydrogen nuclei'),'t / tff',t('原子核の割合','Fraction of nuclei'),[0,3],[0,1],[{points:samples(x=>1-d.at(x*d.tff).x,0,3),color:colors.blue},{points:samples(x=>d.at(x*d.tff).x,0,3),color:colors.green}],[{x:time,y:1-q.x,color:colors.rust},{x:time,y:q.x,color:colors.rust}],[1])+`<svg viewBox="0 0 640 175" role="img" aria-label="${t('H三つからH₂一つとH一つ。原子核は三つのまま。','Three H atoms form one H₂ and one H. Three nuclei are conserved.')}"><text x="68" y="25">H + H + H → H₂ + H</text>${atom(100,80,colors.blue)}${atom(155,80,colors.blue)}${atom(210,80,colors.rust)}<path d="M265 80H355l-9-6m9 6l-9 6" fill="none" stroke="#89968c" stroke-width="2"/><path d="M400 80H423" stroke="${colors.green}" stroke-width="5"/>${atom(400,80,colors.green)}${atom(423,80,colors.green)}${atom(510,80,colors.rust)}<text x="68" y="140">${t('原子核を数える：','Count nuclei: ')} (1−x) + 2 × (x/2) = 1</text></svg>`);
        status(t(`t₅₀＝${fmt(d.t50/C.year)} yr、tff＝${fmt(d.tff/C.year)} yr。分子に入った原子核は${fmt(100*q.x)}%。結合エネルギーの尺度を示しているが、加熱・冷却と逆反応は解いていない。`,`t₅₀ = ${fmt(d.t50/C.year)} yr; tff = ${fmt(d.tff/C.year)} yr. ${fmt(100*q.x)}% of nuclei are in molecules. The binding-energy scale is reported without solving heating, cooling, or reverse dissociation.`));
      });
    }
  }
  window.AstroNonequilibriumLabs={supports:id=>ids.has(id),mount};
})();
