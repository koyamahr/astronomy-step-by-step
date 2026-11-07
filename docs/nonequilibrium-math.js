/* Supplied coefficients and closed teaching models; CGS is explicit for AD/chemistry. */
(() => {
  'use strict';
  const C={...window.AstroDynamics.C,me:9.1093837139e-31};
  const positive=(...xs)=>{if(xs.some(x=>!Number.isFinite(x)||x<=0))throw new RangeError('Expected finite positive inputs');};
  function exchangeTime(te,ti,n,lnLambda=30) { // kT in keV, n_i in cm^-3; result in seconds
    positive(te,ti,n,lnLambda);
    const e2=C.e*C.e/(4*Math.PI*C.epsilon0),kev=1000*C.e;
    return 3*C.me*C.mp/(8*Math.sqrt(2*Math.PI)*n*1e6*e2*e2*lnLambda)*(kev*te/C.me+kev*ti/C.mp)**1.5;
  }
  function twoTemperature(ti0=2,beta=.1,n=.01,step=.02) {
    positive(ti0,beta,n,step);
    if(beta>1||step>.1)throw new RangeError('Require 0 < beta <= 1 and step <= 0.1');
    const sum=ti0*(1+beta),difference=ti0*(1-beta),mean=sum/2;
    const temperatures=y=>{const delta=difference*Math.exp(-y);return{te:(sum-delta)/2,ti:(sum+delta)/2,delta};};
    const tau=y=>{const d=temperatures(y);return exchangeTime(d.te,d.ti,n);};
    const grid=[{y:0,t:0}];
    for(let y=0;y<32-1e-10;) {
      const h=Math.min(step,32-y),dt=h*(tau(y)+4*tau(y+h/2)+tau(y+h))/12;
      grid.push({y:y+h,t:grid.at(-1).t+dt});y+=h;
    }
    function at(time) {
      if(!Number.isFinite(time)||time<0)throw new RangeError('Expected nonnegative time');
      if(difference===0)return{te:mean,ti:mean,delta:0};
      if(time>=grid.at(-1).t)return temperatures(32);
      let lo=0,hi=grid.length-1;
      while(hi-lo>1){const mid=(hi+lo)>>1;if(grid[mid].t<=time)lo=mid;else hi=mid;}
      const a=grid[lo],b=grid[hi];
      // Invert the cumulative integral with safeguarded bisection inside this cell.
      let left=a.y,right=b.y;
      for(let i=0;i<38;i++) {
        const y=(left+right)/2,h=y-a.y,dt=h*(tau(a.y)+4*tau(a.y+h/2)+tau(y))/12;
        if(a.t+dt<time)left=y;else right=y;
      }
      return temperatures(time===0?0:(left+right)/2);
    }
    return{at,mean,sum,difference,equilibriumTime:exchangeTime(mean,mean,n),initialTime:tau(0)};
  }
  function ambipolar(n=1e4,chi=1e-7,Lpc=.1,Bmicro=30) {
    positive(n,chi,Lpc,Bmicro);
    const gamma=3.5e13,rhon=2.33*C.mp*1e3*n,rhoi=29*C.mp*1e3*chi*n;
    const B=Bmicro*1e-6,L=Lpc*C.pc*100,eta=B*B/(4*Math.PI*gamma*rhoi*rhon);
    const tAD=L*L/eta,tff=Math.sqrt(3*Math.PI/(32*C.G*1e3*rhon));
    const tin=1/(gamma*rhon),tni=1/(gamma*rhoi),cs=Math.sqrt(C.k*10/(2.33*C.mp))*100,epsilon=.1;
    function at(time,phase=0) {
      if(!Number.isFinite(time)||time<0||!Number.isFinite(phase))throw new RangeError('Invalid time or phase');
      const decay=Math.exp(-time/tAD),amplitude=epsilon*decay;
      return{field:1+amplitude*Math.cos(phase),drift:eta/L*amplitude*Math.sin(phase),amplitude,
        energy:epsilon**2*B**2/(16*Math.PI)*decay**2,
        heating:eta*epsilon**2*B**2/(8*Math.PI*L**2)*decay**2};
    }
    return{gamma,rhon,rhoi,B,L,eta,tAD,tff,tin,tni,cs,drift0:epsilon*eta/L,at};
  }
  function threeBodyRate(T) {positive(T);return 6e-32*T**(-.25)+2e-31*T**(-.5);}
  function chemistry(T=1000,n=1e11) {
    positive(T,n);
    const k3=threeBodyRate(T),t50=3/(4*k3*n*n),tff=Math.sqrt(3*Math.PI/(32*C.G*C.mp*n*1e6));
    function at(time) {
      if(!Number.isFinite(time)||time<0)throw new RangeError('Expected nonnegative time');
      const x=-Math.expm1(-.5*Math.log1p(4*k3*n*n*time));
      return{x,nH:n*(1-x),nH2:n*x/2,rate:k3*(n*(1-x))**3,bindingPerNucleus:4.48*x/2};
    }
    return{k3,t50,tff,at};
  }
  window.AstroNonequilibrium={C,exchangeTime,twoTemperature,ambipolar,threeBodyRate,chemistry};
})();
