/* Models for spherical gas, ionization, and thin-disk stability. SI unless noted. */
(() => {
  'use strict';
  const C = { G: 6.67430e-11, k: 1.380649e-23, mp: 1.67262192595e-27, solar: 1.988409870698051e30, au: 149597870700, pc: 3.085677581491367e16, year: 31557600, solarRadius: 6.957e8 };
  const positive = (...xs) => xs.every(x => Number.isFinite(x) && x > 0);
  function sphericalMach(x, branch = 'wind') {
    if (!(positive(x) && x >= .02 && x <= 1000 && ['wind', 'bondi'].includes(branch))) throw new RangeError('Invalid transonic branch or radius.');
    if (Math.abs(x - 1) < 1e-10) return 1;
    // y = Mach^2; solve exp(z) - z - 1 = D for z = log(y).
    const D = Math.max(0, 4 * (Math.log(x) + 1 / x - 1));
    const subsonic = branch === 'wind' ? x < 1 : x > 1;
    let lo = subsonic ? -D - 2 : 0, hi = subsonic ? 0 : Math.log(D + 2) + 2;
    for (let i = 0; i < 90; i++) {
      const z = (lo + hi) / 2, residual = Math.expm1(z) - z - D;
      if (subsonic ? residual > 0 : residual < 0) lo = z; else hi = z;
    }
    return Math.exp((lo + hi) / 4);
  }
  function bondiModel(massSolar, densityKgM3, soundKmS) {
    if (!positive(massSolar, densityKgM3, soundKmS)) throw new RangeError('Invalid Bondi inputs.');
    const sound = soundKmS * 1000, gm = C.G * massSolar * C.solar, lambda = Math.exp(1.5) / 4;
    return { radius: gm / sound ** 2, sonicRadius: gm / (2 * sound ** 2), lambda, rate: 4 * Math.PI * lambda * gm ** 2 * densityKgM3 / sound ** 3 };
  }
  function parkerModel(temperatureK, mu = .6) {
    if (!positive(temperatureK, mu)) throw new RangeError('Invalid wind inputs.');
    const sound = Math.sqrt(C.k * temperatureK / (mu * C.mp));
    return { sound, sonicRadius: C.G * C.solar / (2 * sound ** 2) };
  }
  function isothermalSphere(xmax = 12, step = .005) {
    if (!(positive(xmax, step) && xmax >= .05 && xmax <= 20 && step <= .02)) throw new RangeError('Invalid isothermal-sphere range.');
    const h0 = Math.min(step, xmax), x2 = h0 ** 2;
    let x = h0, y = [x2 / 6 - x2 ** 2 / 120 + x2 ** 3 / 1890, h0 ** 3 / 3 - h0 ** 5 / 30 + h0 ** 7 / 315];
    const sample = () => ({ x, psi: y[0], mass: y[1], density: Math.exp(-y[0]), contrast: Math.exp(y[0]), pressureMass: y[1] * Math.exp(-y[0] / 2) / Math.sqrt(4 * Math.PI) });
    const points = [{ x: 0, psi: 0, mass: 0, density: 1, contrast: 1, pressureMass: 0 }, sample()];
    const rhs = (r, [psi, m]) => [m / r ** 2, r ** 2 * Math.exp(-psi)];
    while (x < xmax - 1e-12) {
      const h = Math.min(step, xmax - x), stage = (a, factor) => y.map((v, i) => v + factor * a[i]);
      const a = rhs(x, y), b = rhs(x + h / 2, stage(a, h / 2)), c = rhs(x + h / 2, stage(b, h / 2)), d = rhs(x + h, stage(c, h));
      y = y.map((v, i) => v + h * (a[i] + 2 * b[i] + 2 * c[i] + d[i]) / 6); x += h;
      if (!y.every(Number.isFinite)) throw new Error('Isothermal-sphere integration failed.');
      points.push(sample());
    }
    return { points, edge: points[points.length - 1], peak: points.reduce((a, b) => a.pressureMass > b.pressureMass ? a : b) };
  }
  function jeansModel(soundKmS, densityKgM3, q = 1) {
    if (!(positive(soundKmS, densityKgM3) && Number.isFinite(q) && q >= 0)) throw new RangeError('Invalid Jeans inputs.');
    const sound = soundKmS * 1000, gravityFrequency = Math.sqrt(4 * Math.PI * C.G * densityKgM3);
    const wavelength = 2 * Math.PI * sound / gravityFrequency;
    return { wavelength, mass: 4 * Math.PI / 3 * densityKgM3 * (wavelength / 2) ** 3, gravityTime: 1 / gravityFrequency, omegaSquared: q * q - 1, growth: Math.sqrt(Math.max(0, 1 - q * q)) };
  }
  function stromgrenModel(photonsPerSecond, densityCm3, tau = 1, alphaCm3S = 2.6e-13) {
    if (!(positive(photonsPerSecond, densityCm3, alphaCm3S) && Number.isFinite(tau) && tau >= 0)) throw new RangeError('Invalid ionization inputs.');
    const density = densityCm3 * 1e6, alpha = alphaCm3S * 1e-6;
    const radius = Math.cbrt(3 * photonsPerSecond / (4 * Math.PI * alpha * density ** 2));
    const volumeFraction = -Math.expm1(-tau), recombinationTime = 1 / (alpha * density);
    return { radius, recombinationTime, time: tau * recombinationTime, volumeFraction, radiusFraction: Math.cbrt(volumeFraction) };
  }
  function alphaDisk(alpha, aspect, radiusAu, sigmaKgM2 = 1000) {
    if (!(positive(alpha, aspect, radiusAu, sigmaKgM2) && alpha <= 1 && aspect < .3)) throw new RangeError('Invalid thin-disk inputs.');
    const radius = radiusAu * C.au, omega = Math.sqrt(C.G * C.solar / radius ** 3), height = aspect * radius, sound = height * omega;
    const viscosity = alpha * sound * height;
    return { radius, omega, height, sound, viscosity, viscousTime: radius ** 2 / viscosity, rate: 3 * Math.PI * viscosity * sigmaKgM2 };
  }
  function toomreMode(Q, x) {
    if (!(positive(Q) && Number.isFinite(x) && x >= 0)) throw new RangeError('Invalid Toomre inputs.');
    const omegaSquared = 1 + x * x - 2 * x / Q;
    return { omegaSquared, growth: Math.sqrt(Math.max(0, -omegaSquared)), fastestX: 1 / Q, maximumGrowth: Q < 1 ? Math.sqrt(1 / Q ** 2 - 1) : 0, band: Q < 1 ? [(1 - Math.sqrt(1 - Q ** 2)) / Q, (1 + Math.sqrt(1 - Q ** 2)) / Q] : null };
  }
  function mriMode(q, b) {
    if (!(Number.isFinite(q) && q >= 0 && q < 2 && Number.isFinite(b) && b >= 0)) throw new RangeError('Require 0 <= shear q < 2, b >= 0.');
    const epicycleSquared = 2 * (2 - q), a = epicycleSquared + 2 * b * b;
    // Rationalized quadratic root avoids cancellation for weak tension.
    const growthSquared = 2 * b * b * (2 * q - b * b) / (a + Math.sqrt(epicycleSquared ** 2 + 16 * b * b));
    return { epicycleSquared, growthSquared, growth: Math.sqrt(Math.max(0, growthSquared)), maximumGrowth: q / 2, fastestB: Math.sqrt(q * (4 - q) / 4), cutoffB: Math.sqrt(2 * q) };
  }
  Object.assign(window.AstroAdvancedMath, { gasConstants: C, sphericalMach, bondiModel, parkerModel, isothermalSphere, jeansModel, stromgrenModel, alphaDisk, toomreMode, mriMode });
})();
