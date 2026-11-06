/* Post-singularity isothermal similarity profiles, integrated from outer data.
 * Shu: the A -> 2+ extrapolation used in Shu (1977), section II and Table 2.
 * LPH: rounded outer coefficients A=8.86, V=-3.28; no sonic crossing.
 */
(() => {
  'use strict';
  const D = window.AstroDynamics, C = D.C, cache = new Map();
  const xmin = 1e-4, xmax = 1e4;
  function integrate(A, V, step, targets) {
    let z = Math.log(xmax), v = V + (2-A)/xmax + V/xmax**2;
    let logAlpha = Math.log(A)-2*z+(2-A)/(2*xmax**2);
    const rhs = (q, velocity, density) => {
      const x = Math.exp(q), a = Math.exp(density), w = x-velocity, denominator = w*w-1;
      if (!(denominator > 0)) throw new Error('Collapse integration left the supersonic similarity branch.');
      return [x*(a*w-2/x)*w/denominator, x*(a-2*w/x)*w/denominator];
    };
    return targets.map(x => {
      const end = Math.log(x);
      while (z-end > 1e-13) {
        const radius = Math.exp(z), w = radius-v;
        const h = -Math.min(step,z-end,.08*(w*w-1)/Math.max(1,radius*radius));
        if (!(h < 0) || !Number.isFinite(h)) throw new Error('Invalid collapse integration step.');
        const k1=rhs(z,v,logAlpha),k2=rhs(z+h/2,v+h*k1[0]/2,logAlpha+h*k1[1]/2);
        const k3=rhs(z+h/2,v+h*k2[0]/2,logAlpha+h*k2[1]/2),k4=rhs(z+h,v+h*k3[0],logAlpha+h*k3[1]);
        v+=h*(k1[0]+2*k2[0]+2*k3[0]+k4[0])/6;
        logAlpha+=h*(k1[1]+2*k2[1]+2*k3[1]+k4[1])/6;z+=h;
      }
      return {x,v,alpha:Math.exp(logAlpha)};
    });
  }
  function profile(branch, step = .004, epsilon = 1e-6) {
    if (!['shu','lph'].includes(branch) || !(step>0 && step<=.02 && epsilon>0 && epsilon<=.001)) throw new RangeError('Invalid collapse profile inputs.');
    const key = `${branch}:${step}:${epsilon}`;
    if (cache.has(key)) return cache.get(key);
    const targets = [...new Set([...Array.from({length:801},(_,i)=>10**(4-i/100)),1,.9999,.999,.99,.95,.9,.8,.7,.6,.5,.4,.3,.2,.1,.01])].sort((a,b)=>b-a);
    let points;
    if (branch==='shu') {
      const inner = targets.filter(x=>x<1), solutions=[1,2,3].map(i=>integrate(2+i*epsilon,0,step,inner));
      points=targets.filter(x=>x>=1).map(x=>({x,v:0,alpha:2/x**2}));
      inner.forEach((x,i)=>points.push({x,v:3*solutions[0][i].v-3*solutions[1][i].v+solutions[2][i].v,alpha:3*solutions[0][i].alpha-3*solutions[1][i].alpha+solutions[2][i].alpha}));
    } else points=integrate(8.86,-3.28,step,targets);
    points.reverse().forEach(p=>{p.mass=p.x*p.x*p.alpha*(p.x-p.v);});
    const first=points[0],m0=first.mass-(2/3)*Math.sqrt(first.mass/2)*first.x**1.5;
    const result={branch,points,m0,xmin,xmax,outerA:branch==='shu'?2:8.86,outerV:branch==='shu'?0:-3.28};
    cache.set(key,result);return result;
  }
  function at(p,x) {
    if (!(Number.isFinite(x) && x>0)) throw new RangeError('Require positive similarity radius.');
    if (p.branch==='shu' && x>=1) return {x,v:0,alpha:2/x**2,mass:2*x};
    if (x<p.xmin) return {x,v:-Math.sqrt(2*p.m0/x),alpha:Math.sqrt(p.m0/2)*x**(-1.5),mass:p.m0+(2/3)*Math.sqrt(p.m0/2)*x**1.5};
    if (x>p.xmax) {
      const v=p.outerV+(2-p.outerA)/x+p.outerV/x**2,alpha=p.outerA/x**2*Math.exp((2-p.outerA)/(2*x*x));
      return {x,v,alpha,mass:x*x*alpha*(x-v)};
    }
    let lo=0,hi=p.points.length-1;
    while(hi-lo>1){const mid=(lo+hi)>>1;if(p.points[mid].x>x)hi=mid;else lo=mid;}
    const a=p.points[lo],b=p.points[hi],f=Math.log(x/a.x)/Math.log(b.x/a.x);
    const alpha=Math.exp(Math.log(a.alpha)+f*Math.log(b.alpha/a.alpha)),v=a.v+f*(b.v-a.v);
    return {x,v,alpha,mass:x*x*alpha*(x-v)};
  }
  function scales(branch,soundKmS,timeKyr) {
    if (!(Number.isFinite(soundKmS) && soundKmS>0 && Number.isFinite(timeKyr) && timeKyr>0)) throw new RangeError('Require positive sound speed and time.');
    const p=profile(branch),sound=soundKmS*1000,time=timeKyr*1000*C.year,rate=p.m0*sound**3/C.G;
    return {profile:p,m0:p.m0,sound,time,rate,mass:rate*time,scale:sound*time};
  }
  function physical(s,radiusAu) {
    const point=at(s.profile,radiusAu*C.au/s.scale);
    return {...point,radiusAu,density:point.alpha/(4*Math.PI*C.G*s.time**2),velocity:point.v*s.sound,enclosedMass:point.mass*s.sound**3*s.time/C.G};
  }
  function shell(branch,initialRadiusAu,soundKmS,timeKyr,startKyr=10) {
    if (!(initialRadiusAu>0 && timeKyr>=startKyr && startKyr>0)) throw new RangeError('Invalid labelled mass shell.');
    const start=scales(branch,soundKmS,startKyr),s=scales(branch,soundKmS,timeKyr);
    const initial=physical(start,initialRadiusAu),target=initial.mass*startKyr/timeKyr,p=s.profile;
    if(target<=p.m0)return {radiusAu:0,accreted:true,enclosedMass:initial.enclosedMass};
    let x;
    if(branch==='shu' && target>=2)x=target/2;
    else if(target<p.points[0].mass)x=((target-p.m0)/((2/3)*Math.sqrt(p.m0/2)))**(2/3);
    else {
      let lo=p.xmin,hi=p.xmax;
      for(let i=0;i<42;i++){const mid=Math.sqrt(lo*hi);if(at(p,mid).mass>target)hi=mid;else lo=mid;}
      x=Math.sqrt(lo*hi);
    }
    return {radiusAu:x*s.scale/C.au,accreted:false,enclosedMass:initial.enclosedMass};
  }
  window.AstroCollapse={profile,at,scales,physical,shell};
})();
