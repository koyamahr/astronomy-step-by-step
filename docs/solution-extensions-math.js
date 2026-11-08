/* Dimensionless Kerr/TS2 diagnostics and pre-caustic homogeneous dust collapse. */
(() => {
  'use strict';
  const finite=(...xs)=>xs.every(Number.isFinite);
  function isco(spin, direction=1) {
    if(!finite(spin)||spin<0||spin>1||![1,-1].includes(direction))throw new RangeError('Invalid spin or direction');
    const z1=1+Math.cbrt(1-spin*spin)*(Math.cbrt(1+spin)+Math.cbrt(1-spin));
    const z2=Math.sqrt(3*spin*spin+z1*z1);
    return 3+z2-direction*Math.sqrt(Math.max(0,(3-z1)*(3+z1+2*z2)));
  }
  function kerr(spin=.8,theta=Math.PI/2,R=3) {
    if(!finite(spin,theta,R)||spin<0||spin>1||theta<0||theta>Math.PI)throw new RangeError('Invalid Kerr input');
    const horizon=1+Math.sqrt(1-spin*spin),ergo=1+Math.sqrt(1-spin*spin*Math.cos(theta)**2);
    if(R<=horizon)throw new RangeError('Use the exterior R > R+');
    const s=Math.sin(theta)**2,S=R*R+spin*spin*Math.cos(theta)**2,D=R*R-2*R+spin*spin;
    const gtt=-(1-2*R/S),gtphi=-2*spin*R*s/S,gphiphi=(R*R+spin*spin+2*spin*spin*R*s/S)*s;
    const omega=2*spin*R/((R*R+spin*spin)**2-spin*spin*D*s);
    const half=s>1e-12?Math.sqrt(D*s)/gphiphi:null;
    return{horizon,ergo,gtt,gtphi,gphiphi,grr:S/D,omega,omegaMin:half===null?null:omega-half,omegaMax:half===null?null:omega+half,staticRate:gtt<0?Math.sqrt(-gtt):null,prograde:isco(spin),retrograde:isco(spin,-1)};
  }
  const complex=(re,im=0)=>({re,im});
  const add=(a,b)=>complex(a.re+b.re,a.im+b.im),sub=(a,b)=>complex(a.re-b.re,a.im-b.im);
  const mul=(a,b)=>complex(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
  const scale=(a,b)=>complex(a.re*b,a.im*b);
  function div(a,b){const n=b.re*b.re+b.im*b.im;if(n<1e-28)throw new RangeError('Singular Ernst denominator');return complex((a.re*b.re+a.im*b.im)/n,(a.im*b.re-a.re*b.im)/n);}
  function ernst(x,y,q=.5,delta=2) {
    if(!finite(x,y,q)||x<=1||Math.abs(y)>1||Math.abs(q)>=1||![1,2].includes(delta))throw new RangeError('Invalid Ernst input');
    const p=Math.sqrt(1-q*q);
    if(delta===1)return div(complex(p*x-1,-q*y),complex(p*x+1,-q*y));
    const A=complex(p*p*(x**4-1)+q*q*(y**4-1),-2*p*q*x*y*(x*x-y*y));
    const B=complex(2*p*x*(x*x-1),2*q*y*(y*y-1));
    return div(sub(A,B),add(A,B));
  }
  function ts2Metric(x,y,q=.5) {
    ernst(x,y,q); // shared domain checks, excluding singular denominators
    const p=Math.sqrt(1-q*q),mu=p*p*(x*x-1)**2+q*q*(1-y*y)**2,sigma=2*p*q*(x*x-y*y);
    const nu=4*x*(p*x*x+2*x+p),tau=-4*q/p*(1-y*y)*(p*x+1);
    const numerator=mu*mu-(x*x-1)*(1-y*y)*sigma*sigma;
    const denominator=mu*mu+mu*nu-(1-y*y)*((x*x-1)*sigma*sigma-sigma*tau);
    return{f:numerator/denominator,exp2gamma:numerator/(p**4*(x*x-y*y)**4)};
  }
  function quadrupole(q,delta=2){if(!finite(q)||Math.abs(q)>=1||![1,2].includes(delta))throw new RangeError('Invalid multipole input');return-(q*q+(1-1/delta**2)*(1-q*q)/3);}
  function ring(q){
    if(!finite(q)||Math.abs(q)>=1)throw new RangeError('Invalid spin');
    if(q===0)return null;
    const p=Math.sqrt(1-q*q),f=x=>p*p*x**4+2*p*x*(x*x-1)-1;
    let lo=1,hi=2;while(f(hi)<0)hi*=2;
    for(let i=0;i<70;i++){const m=(lo+hi)/2;if(f(m)>0)hi=m;else lo=m;}
    const x=(lo+hi)/2;return{x,rhoOverM:p*Math.sqrt(x*x-1)/2,residual:f(x)};
  }
  // Re(E) * prolate Laplacian(E) = prolate gradient(E)^2, away from singularities.
  function ernstResidual(x,y,q,delta=2,h=2e-4){
    const e=ernst(x,y,q,delta),xp=ernst(x+h,y,q,delta),xm=ernst(x-h,y,q,delta),yp=ernst(x,y+h,q,delta),ym=ernst(x,y-h,q,delta);
    const dx=scale(sub(xp,xm),1/(2*h)),dy=scale(sub(yp,ym),1/(2*h));
    const dxx=scale(sub(add(xp,xm),scale(e,2)),1/(h*h)),dyy=scale(sub(add(yp,ym),scale(e,2)),1/(h*h));
    const lhs=scale(add(add(scale(dxx,x*x-1),scale(dx,2*x)),add(scale(dyy,1-y*y),scale(dy,-2*y))),e.re);
    const rhs=add(scale(mul(dx,dx),x*x-1),scale(mul(dy,dy),1-y*y));
    return Math.hypot(lhs.re-rhs.re,lhs.im-rhs.im)/(1+Math.hypot(rhs.re,rhs.im));
  }
  function spheroid(q){
    if(!finite(q)||q<=0)throw new RangeError('Positive axis ratio required');
    let Az,I;
    if(Math.abs(q-1)<1e-4){const d=q-1;Az=2/3-8*d/15+12*d*d/35;I=2*(1-d/3+2*d*d/15);}
    else if(q<1){const e=Math.sqrt(1-q*q);Az=2/(e*e)*(1-q*Math.acos(q)/e);I=2*Math.acos(q)/e;}
    else {const e=Math.sqrt(1-1/(q*q));Az=(1-e*e)/(e**3)*(Math.log1p(e)-Math.log1p(-e)-2*e);I=2*Math.acosh(q)/Math.sqrt(q*q-1);}
    return{equatorial:(2-Az)/2,polar:Az,potentialIntegral:I};
  }
  function collapse(q0=.7,step=.002){
    if(!finite(q0,step)||q0<.4||q0>2.5||step<=0||step>.02)throw new RangeError('Invalid collapse initial data');
    let state=[1,q0,0,0],time=0;const points=[];
    const rhs=y=>{if(y[0]<=0||y[1]<=0)throw new RangeError('Caustic reached');const d=q0/(y[0]*y[0]*y[1]),A=spheroid(y[1]/y[0]);return[y[2],y[3],-d*A.equatorial*y[0],-d*A.polar*y[1]];};
    const combine=(y,k,h)=>y.map((v,i)=>v+h*k[i]);
    const record=()=>{const[a,c,va,vc]=state,density=q0/(a*a*c);const energy=(2*va*va+vc*vc)/10-q0*spheroid(c/a).potentialIntegral/(5*a);points.push({time,a,c,va,vc,density,energy});};
    record();
    while(time<3&&points.length<30000){
      const[a,c,va,vc]=state,d=q0/(a*a*c);
      if(Math.min(a,c/q0)<.03||Math.min(a,c)/Math.max(a,c)<.03)break;
      let h=Math.min(step,.01*Math.min(a,c)/Math.max(Math.abs(va),Math.abs(vc),1e-6),.015/Math.sqrt(d),3-time),next;
      for(let trial=0;trial<20;trial++){
        try{const k1=rhs(state),k2=rhs(combine(state,k1,h/2)),k3=rhs(combine(state,k2,h/2)),k4=rhs(combine(state,k3,h));next=state.map((v,i)=>v+h*(k1[i]+2*k2[i]+2*k3[i]+k4[i])/6);if(next[0]>0&&next[1]>0)break;}catch(e){if(!(e instanceof RangeError))throw e;}
        next=null;h/=2;
      }
      if(!next||h<1e-12)throw new Error('Collapse integration failed before cutoff');
      state=next;time+=h;record();
    }
    if(points.length>=30000)throw new Error('Collapse step limit');
    return{q0,points,cutoff:.03,timeUnit:'1/sqrt(2πGρ0)',energyError:Math.max(...points.map(p=>Math.abs((p.energy-points[0].energy)/points[0].energy)))};
  }
  window.AstroSolutionMath={isco,kerr,ernst,ts2Metric,quadrupole,ring,ernstResidual,spheroid,collapse};
})();
