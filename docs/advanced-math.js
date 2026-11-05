/* Numerical models shared by the reader panels and physical checks. */
(() => {
  'use strict';
  function rk4(rhs, x, y, h) {
    const stage = (slope, scale) => y.map((v, i) => v + scale * slope[i]);
    const a = rhs(x, y), b = rhs(x + h / 2, stage(a, h / 2));
    const c = rhs(x + h / 2, stage(b, h / 2)), d = rhs(x + h, stage(c, h));
    return y.map((v, i) => v + h * (a[i] + 2 * b[i] + 2 * c[i] + d[i]) / 6);
  }
  function laneEmden(n, h = 0.002) {
    if (!(n > 0 && n < 5 && h > 0 && h <= 0.02)) throw new RangeError('Require 0 < n < 5 and 0 < h <= 0.02.');
    let x = 1e-4;
    let y = [1 - x * x / 6 + n * x ** 4 / 120, -x / 3 + n * x ** 3 / 30];
    const points = [{ x: 0, theta: 1, slope: 0, density: 1, mass: 0 }];
    const rhs = (r, [theta, slope]) => [slope, -2 * slope / r - Math.max(theta, 0) ** n];
    for (let i = 0; i < 100000 && x < 50; i++) {
      points.push({ x, theta: y[0], slope: y[1], density: y[0] ** n, mass: -x * x * y[1] });
      const next = rk4(rhs, x, y, h);
      if (next[0] <= 0) {
        const f = y[0] / (y[0] - next[0]);
        const radius = x + h * f, slope = y[1] + f * (next[1] - y[1]);
        const mass = -radius * radius * slope;
        points.push({ x: radius, theta: 0, slope, density: 0, mass });
        return { n, radius, mass, concentration: radius ** 3 / (3 * mass), points };
      }
      if (!next.every(Number.isFinite)) throw new Error('Lane–Emden integration failed.');
      x += h; y = next;
    }
    throw new Error('No finite surface found within the integration domain.');
  }
  function sedov(h = 0.0005, xmin = 0.05) {
    if (!(h > 0 && h <= 0.002 && xmin >= 0.02 && xmin < 1)) throw new RangeError('Invalid Sedov integration range.');
    const gamma = 5 / 3;
    let x = 1, y = [0.75, Math.log(4), Math.log(0.75)];
    const rhs = (r, [v, logG, logZ]) => {
      const w = v - r, c = Math.exp(logZ - logG);
      const vp = (1.5 * v * w + 2 * gamma * c * v / r - 3 * c) / (w * w - gamma * c);
      const gp = -(vp + 2 * v / r) / w;
      return [vp, gp, gamma * gp + 3 / w];
    };
    const sample = () => ({ x, v: y[0], g: Math.exp(y[1]), z: Math.exp(y[2]) });
    const points = [sample()];
    while (x > xmin + 1e-12) {
      const step = -Math.min(h, x - xmin);
      y = rk4(rhs, x, y, step); x += step;
      if (!y.every(Number.isFinite)) throw new Error('Sedov integration failed.');
      points.push(sample());
    }
    points.reverse();
    let integral = 0, sweptMass = 0;
    const energy = p => (0.5 * p.g * p.v ** 2 + p.z / (gamma - 1)) * p.x ** 2;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i], dx = b.x - a.x;
      integral += dx * (energy(a) + energy(b)) / 2;
      sweptMass += dx * (a.g * a.x ** 2 + b.g * b.x ** 2) / 2;
    }
    // Finite central pressure contributes O(xmin^3); approximate only this small core.
    const central = points[0];
    integral += central.z / (gamma - 1) * xmin ** 3 / 3;
    return { gamma, points, integral, beta: (25 / (16 * Math.PI * integral)) ** 0.2, massRatio: 3 * sweptMass, xmin };
  }
  function interfaceMode(ratio, k, g = 1, shear = 0) {
    if (!(ratio > 0 && k > 0 && g >= 0 && Number.isFinite(shear))) throw new RangeError('Invalid interface parameters.');
    const atwood = (ratio - 1) / (ratio + 1);
    const omegaSquared = -atwood * g * k - ratio / (ratio + 1) ** 2 * (k * shear) ** 2;
    return { atwood, omegaSquared, growth: Math.sqrt(Math.max(0, -omegaSquared)), frequency: Math.sqrt(Math.max(0, omegaSquared)), drift: .5 * shear * atwood };
  }
  const szConstants = { h: 6.62607015e-34, k: 1.380649e-23, c: 299792458, me: 9.1093837139e-31, sigmaT: 6.6524587051e-29, eV: 1.602176634e-19, mpc: 3.085677581491367e22, tcmb: 2.7255 };
  function szSpectrum(frequencyGHz, y, tau = 0, velocityKmS = 0) {
    if (!(frequencyGHz > 0 && frequencyGHz <= 10000 && y >= 0 && tau >= 0 && Number.isFinite(velocityKmS))) throw new RangeError('Invalid SZ parameters.');
    const { h, k, c, tcmb } = szConstants;
    const x = h * frequencyGHz * 1e9 / (k * tcmb);
    const q = Math.exp(-x), denominator = -Math.expm1(-x);
    const temperatureShape = x / Math.tanh(x / 2) - 4;
    const conversion = x ** 4 * q / denominator ** 2;
    const thermalTemperature = y * temperatureShape;
    const kineticTemperature = -tau * velocityKmS * 1000 / c;
    const i0 = 2 * (k * tcmb) ** 3 / (h * h * c * c) / 1e-20; // MJy/sr
    return { x, temperatureShape, thermalMuK: tcmb * thermalTemperature * 1e6, kineticMuK: tcmb * kineticTemperature * 1e6, thermalIntensity: i0 * conversion * thermalTemperature, kineticIntensity: i0 * conversion * kineticTemperature, backgroundIntensity: i0 * x ** 3 * q / denominator };
  }
  function szModel(temperatureKeV, densityCm3, lengthMpc, velocityKmS = 0) {
    if (!(temperatureKeV > 0 && densityCm3 > 0 && lengthMpc > 0 && Number.isFinite(velocityKmS))) throw new RangeError('Invalid cluster parameters.');
    const { me, c, sigmaT, eV, mpc, tcmb } = szConstants;
    const theta = temperatureKeV * 1000 * eV / (me * c * c);
    const tau = densityCm3 * 1e6 * sigmaT * lengthMpc * mpc;
    const y = tau * theta;
    return { theta, tau, y, rayleighJeansMuK: -2 * y * tcmb * 1e6, kineticMuK: -tcmb * tau * velocityKmS * 1000 / c * 1e6 };
  }
  window.AstroAdvancedMath = { laneEmden, sedov, interfaceMode, szSpectrum, szModel };
})();
