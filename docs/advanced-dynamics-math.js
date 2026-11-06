/* Dimensionless models and explicit SI conversions for the final advanced topics. */
(() => {
  'use strict';
  const C = { ...window.AstroAdvancedMath.gasConstants, sigma: 5.670374419e-8, luminosity: 3.828e26, c: 299792458, e: 1.602176634e-19, epsilon0: 8.8541878188e-12 };
  const positive = (...xs) => xs.every(x => Number.isFinite(x) && x > 0);
  function integral(fn, lo = 0, hi = 1, tolerance = 1e-10) {
    const simpson = (a, b, fa, fm, fb) => (b-a) * (fa + 4*fm + fb) / 6;
    const recur = (a, b, fa, fm, fb, old, tol, depth) => {
      const m = (a+b)/2, fl = fn((a+m)/2), fr = fn((m+b)/2);
      const l = simpson(a,m,fa,fl,fm), r = simpson(m,b,fm,fr,fb), delta = l+r-old;
      if (!depth || Math.abs(delta) < 15*tol) return l+r+delta/15;
      return recur(a,m,fa,fl,fm,l,tol/2,depth-1)+recur(m,b,fm,fr,fb,r,tol/2,depth-1);
    };
    const fa = fn(lo), fm = fn((lo+hi)/2), fb = fn(hi);
    return recur(lo,hi,fa,fm,fb,simpson(lo,hi,fa,fm,fb),tolerance,22);
  }
  function ellipsoid(a, b, c) {
    if (!positive(a,b,c) || Math.min(a,b,c)/Math.max(a,b,c) < .02) throw new RangeError('Invalid ellipsoid axes.');
    const axes = [a,b,c], scale = Math.max(...axes), volume = a*b*c;
    // u = scale^2 (t^-2 - 1) regularizes the infinite upper limit.
    const d = t => axes.map(x => 1 + ((x/scale)**2-1)*t*t);
    const A = axes.map((_,i) => volume/scale**3 * integral(t => {const ds=d(t);return 2*t*t/(ds[i]*Math.sqrt(ds[0]*ds[1]*ds[2]));}));
    const potentialIntegral = 2/scale * integral(t => {const ds=d(t);return 1/Math.sqrt(ds[0]*ds[1]*ds[2]);});
    return { axes, A, volume, potentialIntegral, binding: .3*potentialIntegral, poissonSum: A.reduce((s,x)=>s+x,0) };
  }
  function rotatingFigure(b, c) {
    const field = ellipsoid(1,b,c), [A1,A2,A3] = field.A;
    const omegaSquared = 2*(A1-A3*c*c);
    const energyRatio = omegaSquared*(1+b*b)/(4*(A1+A2*b*b+A3*c*c));
    return { ...field, b, c, omegaSquared, energyRatio, residual: (A1-omegaSquared/2)-(A2-omegaSquared/2)*b*b };
  }
  function maclaurin(e) {
    if (!(Number.isFinite(e) && e >= 0 && e <= .98)) throw new RangeError('Invalid eccentricity.');
    return rotatingFigure(1,Math.sqrt(1-e*e));
  }
  function jacobi(b) {
    if (!(Number.isFinite(b) && b >= .35 && b <= .999)) throw new RangeError('Require 0.35 <= b/a <= 0.999.');
    const residual = c => {const [a1,a2,a3]=ellipsoid(1,b,c).A;return (a2-a1)/(1/(b*b)-1)-a3*c*c;};
    let lo = .03, hi = Math.min(b,.65), flo = residual(lo);
    if (flo*residual(hi) >= 0) throw new Error('Jacobi branch is not bracketed.');
    for(let i=0;i<44;i++){const mid=(lo+hi)/2,fm=residual(mid);if(flo*fm>0){lo=mid;flo=fm;}else hi=mid;}
    return rotatingFigure(b,(lo+hi)/2);
  }
  function zeldovich(q, growth, amplitude = 1) {
    if (!(Number.isFinite(q) && Number.isFinite(growth) && growth >= 0 && positive(amplitude) && growth*amplitude < 1)) throw new RangeError('Stay before shell crossing.');
    const jacobian = 1-growth*amplitude*Math.cos(q);
    return { x: q-growth*amplitude*Math.sin(q), jacobian, density: 1/jacobian, displacement: -growth*amplitude*Math.sin(q) };
  }
  function hayashi(massSolar, tau, opacityTemperaturePower = 7.7) {
    if (!(positive(massSolar) && Number.isFinite(tau) && tau >= 0 && Number.isFinite(opacityTemperaturePower) && opacityTemperaturePower >= 5)) throw new RangeError('Invalid contraction inputs.');
    const denominator = 6.5+2*opacityTemperaturePower, epsilon = .5/denominator, massExponent = 3.5/denominator;
    const mass=massSolar*C.solar, radius0=3*C.solarRadius, temperature0=4000*massSolar**massExponent;
    const luminosity0=4*Math.PI*radius0**2*C.sigma*temperature0**4, power=2+4*epsilon;
    const time0=3*C.G*mass*mass/(7*(power+1)*radius0*luminosity0), r=(1+tau)**(-1/(power+1));
    return { epsilon, massExponent, power, radiusRatio:r, temperature:temperature0*r**epsilon, temperature0, radius:radius0*r, luminosity:luminosity0*r**power, luminosity0, time0, time:tau*time0, energy:-3/7*C.G*mass*mass/(radius0*r) };
  }
  function relaxation(N, radiusPc, massSolar = .5) {
    if (!(positive(N,radiusPc,massSolar) && N>=100)) throw new RangeError('Invalid cluster.');
    const radius=radiusPc*C.pc, mass=N*massSolar*C.solar, coulombLog=Math.log(.4*N), dynamicalTime=Math.sqrt(radius**3/(C.G*mass));
    return { coulombLog, dynamicalTime, halfMassTime:.138*N/coulombLog*dynamicalTime, ratio:.138*N/coulombLog, speed:Math.sqrt(C.G*mass/radius) };
  }
  function ornsteinUhlenbeck(time, gamma = 1, diffusion = .5, mean0 = 2, variance0 = .0625) {
    if (!(Number.isFinite(time) && time>=0 && Number.isFinite(gamma) && gamma>=0 && positive(diffusion,variance0) && Number.isFinite(mean0))) throw new RangeError('Invalid drift-diffusion inputs.');
    const decay=Math.exp(-gamma*time), variance=variance0*decay**2+(gamma===0?2*diffusion*time:diffusion/gamma*(-Math.expm1(-2*gamma*time)));
    const mean=mean0*decay;
    return { mean, variance, density:x=>Math.exp(-((x-mean)**2)/(2*variance))/Math.sqrt(2*Math.PI*variance) };
  }
  function gravothermal(xmax = 60, step = .01) {
    const solution=window.AstroAdvancedMath.isothermalSphere(xmax,step);
    const points=solution.points.filter(p=>p.x>0).map(p=>{const u=p.x**3*p.density/p.mass,v=p.mass/p.x;return {...p,u,v,eta:v,lambda:(1.5-u)/v};});
    return { points, canonical:points.reduce((a,b)=>a.eta>b.eta?a:b), microcanonical:points.reduce((a,b)=>a.lambda>b.lambda?a:b), edge:points[points.length-1] };
  }
  function viscousDisk(radius, time = 0, gamma = 1) {
    if (!(positive(radius) && Number.isFinite(time) && time>=0 && Number.isFinite(gamma) && gamma>=0 && gamma<=1.5)) throw new RangeError('Invalid similarity disk.');
    const T=1+time, beta=2-gamma, exponent=(2.5-gamma)/beta, z=radius**beta/T;
    const surface=beta/(2*Math.PI)*radius**(-gamma)*T**(-exponent)*Math.exp(-z);
    return { T, beta, exponent, surface, massPerLn:beta*radius**beta*T**(-exponent)*Math.exp(-z), mass:T**(-1/(2*beta)), rate:T**(-exponent)/(2*beta), characteristicRadius:T**(1/beta), reversalRadius:(T/(2*beta))**(1/beta), velocity:3*radius**(gamma-1)*(beta*z-.5) };
  }
  function collapseRhs(x,v,alpha) {
    if (!(positive(x,alpha) && Number.isFinite(v))) throw new RangeError('Invalid similarity point.');
    const w=x-v, denominator=w*w-1;
    if(Math.abs(denominator)<1e-10) throw new RangeError('Sonic point requires a regular critical branch.');
    return { dv:(alpha*w-2/x)*w/denominator, dAlpha:alpha*(alpha-2*w/x)*w/denominator, mass:x*x*alpha*w };
  }
  function collapseScales(branch, soundKmS, timeKyr) {
    if (!['shu','lph'].includes(branch) || !positive(soundKmS,timeKyr)) throw new RangeError('Invalid collapse inputs.');
    const m0=branch==='shu'?.975:46.9, outerA=branch==='shu'?2:8.86, outerV=branch==='shu'?0:-3.28;
    const sound=soundKmS*1000,time=timeKyr*1000*C.year,rate=m0*sound**3/C.G;
    return { m0,outerA,outerV,rate,mass:rate*time,scale:sound*time,innerAlpha:x=>Math.sqrt(m0/2)*x**(-1.5),innerV:x=>-Math.sqrt(2*m0/x) };
  }
  function goldreichJulian(period, logFieldGauss, thetaDeg = 0) {
    if (!(positive(period) && Number.isFinite(logFieldGauss) && Number.isFinite(thetaDeg) && thetaDeg>=0 && thetaDeg<=90)) throw new RangeError('Invalid pulsar inputs.');
    const fieldGauss=10**logFieldGauss, omega=2*Math.PI/period, theta=thetaDeg*Math.PI/180;
    const Bz=fieldGauss*1e-4/2*(3*Math.cos(theta)**2-1), charge=-2*C.epsilon0*omega*Bz;
    const lightCylinder=C.c/omega,radius=12000;
    return { fieldGauss, omega, Bz, charge, numberCm3:Math.abs(charge)/C.e/1e6, lightCylinder, capRadius:radius*Math.sqrt(radius/lightCylinder), nullAngle:Math.acos(1/Math.sqrt(3))*180/Math.PI };
  }
  window.AstroDynamics = { C, integral, ellipsoid, maclaurin, jacobi, zeldovich, hayashi, relaxation, ornsteinUhlenbeck, gravothermal, viscousDisk, collapseRhs, collapseScales, goldreichJulian };
})();
