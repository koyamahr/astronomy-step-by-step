import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
for (const name of ['app.js', 'content.js', 'series.js', 'advanced-content.js', 'advanced-math.js', 'advanced-labs.js', 'advanced-gas-math.js', 'advanced-gas-content.js', 'advanced-gas-labs.js', 'numbers.js', 'books.js', 'illustrations.js', 'animation.js', 'press-schechter.js', 'advanced-dynamics-math.js', 'advanced-dynamics-content.js', 'advanced-dynamics-labs.js', 'collapse-math.js', 'collapse-lab.js', 'nonequilibrium-math.js', 'nonequilibrium-content.js', 'nonequilibrium-labs.js', 'schwarzschild.js', 'solutions.js']) {
  execFileSync(process.execPath, ['--check', resolve(root, 'docs', name)]);
}
const context = { window: {} };
runInNewContext(readFileSync(resolve(root, 'docs/illustrations.js'), 'utf8'), context);
runInNewContext(readFileSync(resolve(root, 'docs/content.js'), 'utf8'), context);
runInNewContext(readFileSync(resolve(root, 'docs/series.js'), 'utf8'), context);
runInNewContext(readFileSync(resolve(root, 'docs/advanced-content.js'), 'utf8'), context);
runInNewContext(readFileSync(resolve(root, 'docs/advanced-math.js'), 'utf8'), context);
runInNewContext(readFileSync(resolve(root, 'docs/numbers.js'), 'utf8'), context);
runInNewContext(readFileSync(resolve(root, 'docs/advanced-gas-math.js'), 'utf8'), context);
runInNewContext(readFileSync(resolve(root, 'docs/advanced-gas-content.js'), 'utf8'), context);
runInNewContext(readFileSync(resolve(root, 'docs/press-schechter.js'), 'utf8'), context);
runInNewContext(readFileSync(resolve(root, 'docs/advanced-dynamics-math.js'), 'utf8'), context);
runInNewContext(readFileSync(resolve(root, 'docs/collapse-math.js'), 'utf8'), context);
runInNewContext(readFileSync(resolve(root, 'docs/advanced-dynamics-content.js'), 'utf8'), context);
runInNewContext(readFileSync(resolve(root, 'docs/nonequilibrium-math.js'), 'utf8'), context);
runInNewContext(readFileSync(resolve(root, 'docs/nonequilibrium-content.js'), 'utf8'), context);
runInNewContext(readFileSync(resolve(root, 'docs/schwarzschild.js'), 'utf8'), context);
runInNewContext(readFileSync(resolve(root, 'docs/solutions.js'), 'utf8'), context);
runInNewContext(readFileSync(resolve(root, 'docs/books.js'), 'utf8'), context);
const { chapters, sources, renderBody } = context.window.AstroContent;
assert.equal(chapters.length, 16, 'Expected the complete 16-chapter curriculum.');
assert.equal(new Set(chapters.map(c => c.id)).size, chapters.length, 'Duplicate chapter route.');

function checkMarkup(html, name) {
  const stack = [];
  for (const tag of html.matchAll(/<(\/?)([a-z][a-z\d-]*)\b[^>]*>/gi)) {
    const [, closing, raw] = tag;
    const element = raw.toLowerCase();
    if (['br', 'hr', 'input', 'img', 'link', 'meta'].includes(element)) continue;
    if (stack.includes('svg') && /\/>$/.test(tag[0])) continue;
    if (closing) assert.equal(stack.pop(), element, `${name}: unbalanced ${element}`);
    else stack.push(element);
  }
  assert.equal(stack.length, 0, `${name}: unclosed tags`);
  assert(!/undefined|NaN/.test(html), `${name}: missing content or invalid number`);
}

for (const book of context.window.AstroBooks.books) {
  assert(/^978\d{10}$/.test(book.isbn), `${book.id}: expected a print ISBN-13`);
  assert.equal([...book.isbn].reduce((sum, digit, i) => sum + Number(digit) * (i % 2 ? 3 : 1), 0) % 10, 0, `${book.id}: invalid ISBN checksum`);
  if (book.coverId) assert(/^\/books\/OL\d+M$/.test(book.openLibraryEdition), `${book.id}: cover needs an edition record`);
}
for (const lang of ['ja', 'en']) {
  const html = context.window.AstroBooks.renderBody(lang);
  checkMarkup(html, `books/${lang}`);
  if (lang === 'en') assert(!/[\u3040-\u30ff\u3400-\u9fff]/.test(html), 'Books: untranslated Japanese');
}

for (const chapter of chapters) {
  for (const field of ['title', 'desc', 'goal', 'prereq', 'question', 'answer']) {
    assert.equal(chapter[field].length, 2, `${chapter.id}.${field}: both languages required`);
    assert(chapter[field].every(value => typeof value === 'string' && value.length > 0));
  }
  for (const ref of chapter.refs) assert(sources[ref], `${chapter.id}: missing reference ${ref}`);
  for (const lang of ['ja', 'en']) {
    const body = renderBody(chapter.id, lang);
    assert(body.length > 500, `${chapter.id}/${lang}: missing lesson text`);
    assert((body.match(/<section>/g) || []).length >= 3, `${chapter.id}/${lang}: incomplete lesson`);
    checkMarkup(body, `${chapter.id}/${lang}`);
    for (const link of body.matchAll(/href="#\/chapter\/([a-z-]+)"/g)) {
      assert(chapters.some(c => c.id === link[1]), `${chapter.id}: broken chapter link ${link[1]}`);
    }
    if (lang === 'en') assert(!/[\u3040-\u30ff\u3400-\u9fff]/.test(body), `${chapter.id}: untranslated Japanese in English body`);
  }
}
for (const [, url] of Object.values(sources)) assert(url.startsWith('https://'));
const illustrations = context.window.AstroIllustrations;
assert.equal(illustrations.figures.length, 10);
assert.equal(new Set(illustrations.figures.map(f => f.id)).size, 10);
for (const figure of illustrations.figures) {
  assert(chapters.some(c => c.id === figure.chapter), 'Illustration chapter must exist');
  for (const field of ['title', 'alt', 'caption']) {
    assert.equal(figure[field].length, 2);
    assert(figure[field].every(value => typeof value === 'string' && value.trim()));
    assert(!/[\u3040-\u30ff\u3400-\u9fff]/.test(figure[field][1]), 'English illustration metadata must be translated');
  }
  for (const lang of ['ja', 'en']) {
    const svg = readFileSync(resolve(root, `docs/illustrations/${figure.id}-${lang}.svg`), 'utf8');
    assert(svg.includes('viewBox="0 0 1200 700"'));
    assert(!/<script\b|<foreignObject\b|(?:href|src)="https?:/i.test(svg), 'Illustrations must be self-contained');
    if (lang === 'en') assert(!/[\u3040-\u30ff\u3400-\u9fff]/.test(svg), 'English SVG labels must be translated');
    const body = renderBody(figure.chapter, lang);
    assert.equal((body.match(new RegExp(`data-illustration="${figure.id}"`, 'g')) || []).length, 1);
    assert(body.includes(`${figure.id}-${lang}.svg`));
    assert(!body.includes(`${figure.id}-${lang === 'ja' ? 'en' : 'ja'}.svg`));
    checkMarkup(illustrations.render(figure.id, lang), `${figure.id}/${lang}`);
  }
}
assert.throws(() => illustrations.render('missing', 'ja'));
const series = context.window.AstroSeries;
const topicIds = new Set();
const bilingual = (value, label) => {
  assert.equal(value.length, 2, `${label}: both languages required`);
  assert(value.every(item => typeof item === 'string' && item.trim()), `${label}: empty translation`);
  assert(!/[\u3040-\u30ff\u3400-\u9fff]/.test(value[1]), `${label}: untranslated English`);
};
bilingual(series.name, 'Series title');
for (const [id, volume] of Object.entries(series.volumes)) {
  bilingual(volume.title, `${id} title`);
  bilingual(volume.subtitle, `${id} subtitle`);
}
for (const group of series.groups) {
  bilingual(group.title, 'Advanced group title');
  bilingual(group.intro, 'Advanced group introduction');
  assert(chapters.some(c => c.id === group.bridge), 'Broken link to foundations');
  for (const topic of group.topics) {
    assert(!topicIds.has(topic.id), `Duplicate advanced topic ${topic.id}`);
    topicIds.add(topic.id);
    for (const key of ['title', 'question', 'method']) bilingual(topic[key], `${topic.id} ${key}`);
    assert(topic.reference[0] && topic.reference[1].startsWith('https://'), `${topic.id}: missing reference`);
  }
}
assert.equal(topicIds.size, 32, 'Expected the expanded 32-topic advanced syllabus');
const advanced = context.window.AstroAdvanced;
assert.equal(advanced.chapters.length, 32, 'Expected all thirty-two worked advanced chapters');
assert.equal(new Set(advanced.chapters.map(c => c.id)).size, advanced.chapters.length);
for (const c of advanced.chapters) {
  assert(topicIds.has(c.id), `${c.id}: missing syllabus entry`);
  assert(chapters.some(item => item.id === c.bridge), `${c.id}: broken foundation bridge`);
  for (const key of ['title', 'desc', 'goal', 'prereq', 'question', 'answer']) bilingual(c[key], `${c.id}.${key}`);
  for (const ref of c.refs) assert(advanced.sources[ref], `${c.id}: missing reference`);
  for (const locale of ['ja', 'en']) {
    const body = advanced.renderBody(c.id, locale);
    assert(body.length > 2000, `${c.id}/${locale}: incomplete worked chapter`);
    assert((body.match(/<section>/g) || []).length >= 4);
    assert(body.includes('data-lab='), `${c.id}: missing experiment`);
    checkMarkup(body, `${c.id}/${locale}`);
    for (const link of body.matchAll(/href="#\/advanced\/([a-z-]+)"/g)) assert(advanced.chapters.some(item => item.id === link[1]), `${c.id}: broken advanced link ${link[1]}`);
    if (locale === 'en') assert(!/[\u3040-\u30ff\u3400-\u9fff]/.test(body), `${c.id}: untranslated English body`);
  }
}
for (const [, url] of Object.values(advanced.sources)) assert(url.startsWith('https://'));
// Check against independent analytic/standard results, not snapshots of the code.
const { laneEmden, sedov, interfaceMode } = context.window.AstroAdvancedMath;
const close = (actual, expected, tolerance, label) => assert(Math.abs(actual - expected) < tolerance, `${label}: ${actual} versus ${expected}`);
for (const n of [1, 1.5, 3]) {
  const result = laneEmden(n);
  assert(result.points.every(p => p.theta >= 0 && p.density >= 0 && p.mass >= 0));
  assert(result.points.every((p, i, a) => !i || p.mass >= a[i - 1].mass - 1e-5));
  const fine = laneEmden(n, .001);
  close(result.radius, fine.radius, 2e-6, `Lane–Emden n=${n} radius convergence`);
  close(result.mass, fine.mass, 2e-6, `Lane–Emden n=${n} mass convergence`);
  if (n === 1) {
    close(result.radius, Math.PI, 1e-6, 'n=1 surface');
    close(result.mass, Math.PI, 1e-6, 'n=1 dimensionless mass');
    for (const p of result.points) if (p.x > 0) close(p.theta, Math.sin(p.x) / p.x, 1e-6, 'n=1 profile');
  }
  if (n === 1.5) close(result.mass, 2.71405512, 1e-6, 'n=1.5 mass');
  if (n === 3) {
    close(result.radius, 6.89684862, 1e-6, 'n=3 radius');
    close(result.mass, 2.01823595, 1e-6, 'n=3 mass');
    const muE = 2, atomicMass = 1.66053906892e-27, G = 6.67430e-11;
    const K = 1.054571817e-34 * 299792458 / 4 * (3 * Math.PI ** 2) ** (1/3) / (muE * atomicMass) ** (4/3);
    const mass = 4 * Math.PI * result.mass * (K / (Math.PI * G)) ** 1.5 / 1.98847e30;
    close(mass, 1.456, .002, 'ideal Chandrasekhar mass in solar units');
  }
}
const rt = interfaceMode(3, 1, 1, 0), stable = interfaceMode(1 / 3, 1, 1, 0);
close(rt.atwood, .5, 1e-14, 'Atwood number');
close(rt.growth, Math.SQRT1_2, 1e-14, 'RT analytic growth');
close(interfaceMode(3, 4, 1, 0).growth, 2 * rt.growth, 1e-14, 'RT wavenumber scaling');
close(stable.growth, 0, 1e-14, 'stable density ordering');
close(stable.frequency, Math.SQRT1_2, 1e-14, 'stable gravity-wave frequency');
close(interfaceMode(1, 1, 0, 2).growth, 1, 1e-14, 'equal-density KH analytic growth');
close(interfaceMode(1, 2, 0, 2).growth, 2, 1e-14, 'KH wavenumber scaling');
close(interfaceMode(1, 1, 0, 0).growth, 0, 1e-14, 'no shear, no growth');
const combined = interfaceMode(.25, 1, 1, 1);
close(combined.growth, 0, 1e-14, 'gravity stabilizes this long wave');
assert(interfaceMode(.25, 10, 1, 1).growth > 0, 'shear destabilizes short waves');
const blast = sedov(), fineBlast = sedov(.00025);
close(blast.beta, 1.15167, 1e-5, 'Sedov energy normalization');
close(blast.massRatio, 1, 1e-5, 'Sedov swept-up mass conservation');
close(blast.beta, fineBlast.beta, 1e-6, 'Sedov beta convergence');
assert(blast.points.every(p => [p.v, p.g, p.z].every(Number.isFinite) && p.g > 0 && p.z > 0));
close(blast.points.at(-1).g, 4, 1e-12, 'shock density jump');
close(blast.points.at(-1).v, .75, 1e-12, 'shock velocity jump');
close(blast.points.at(-1).z, .75, 1e-12, 'shock pressure jump');
const { szModel, szSpectrum } = context.window.AstroAdvancedMath;
const cluster = szModel(8, .001, 1, 300);
close(cluster.tau, .00205273427, 1e-10, 'SZ cm^-3 and Mpc conversion');
close(cluster.y, 3.2136806e-5, 1e-11, 'SZ thermal energy units');
close(szModel(16, .0005, 1).y, cluster.y, 1e-15, 'SZ equal-pressure degeneracy');
close(szModel(8, .002, 1).y, 2 * cluster.y, 1e-15, 'SZ density scaling');
close(szSpectrum(.001, cluster.y).temperatureShape, -2, 1e-9, 'SZ Rayleigh–Jeans limit');
assert(szSpectrum(150, cluster.y).thermalIntensity < 0 && szSpectrum(350, cluster.y).thermalIntensity > 0, 'SZ sign reversal');
let lowNull = 200, highNull = 230;
for (let i = 0; i < 50; i++) {
  const mid = (lowNull + highNull) / 2;
  if (szSpectrum(mid, 1).temperatureShape > 0) highNull = mid; else lowNull = mid;
}
const nullFrequency = (lowNull + highNull) / 2;
close(nullFrequency, 217.5074, .0001, 'nonrelativistic SZ null in GHz');
close(szSpectrum(nullFrequency, cluster.y).thermalMuK, 0, 1e-9, 'zero thermal signal at null');
close(szSpectrum(150, cluster.y, cluster.tau, 300).kineticMuK, -5.5986004, 1e-6, 'kinetic SZ receding sign and units');
close(szSpectrum(350, cluster.y, cluster.tau, 300).kineticMuK, cluster.kineticMuK, 1e-12, 'kinetic SZ thermodynamic temperature independent of frequency');
assert(szSpectrum(nullFrequency, cluster.y, cluster.tau, 300).kineticIntensity < 0, 'kinetic signal remains at thermal null');
close(szSpectrum(150, 0).thermalIntensity, 0, 1e-15, 'zero y gives zero distortion');
// Integrate independently: scattering conserves photon number and increases energy by 4y.
let photons = 0, originalPhotons = 0, energy = 0, originalEnergy = 0;
const count = 10000, minX = 1e-5, dx = (50 - minX) / count;
for (let i = 0; i <= count; i++) {
  const x = minX + i * dx, nu = x * 1.380649e-23 * 2.7255 / 6.62607015e-34 / 1e9;
  const data = szSpectrum(nu, 1e-4), weight = i === 0 || i === count ? 1 : i % 2 ? 4 : 2;
  photons += weight * data.thermalIntensity / x; originalPhotons += weight * data.backgroundIntensity / x;
  energy += weight * data.thermalIntensity; originalEnergy += weight * data.backgroundIntensity;
}
close(photons / originalPhotons, 0, 1e-11, 'SZ photon-number conservation');
close(energy / originalEnergy, 4e-4, 1e-10, 'SZ mean energy gain');
const { ringExchange } = context.window.AstroAdvancedMath;
const zeroExchange = ringExchange(0);
close(zeroExchange.innerRadius, 1, 1e-14, 'initial inner ring radius');
close(zeroExchange.outerRadius, 4, 1e-14, 'initial outer ring radius');
close(zeroExchange.releasedEnergy, 0, 1e-14, 'zero exchange releases no energy');
let lastRingEnergy = 0;
for (let i = 0; i <= 300; i++) {
  const transfer = i / 1000, data = ringExchange(transfer);
  close(data.totalJ, 3, 1e-14, 'ring angular-momentum conservation');
  close(data.energy + data.releasedEnergy, -.625, 1e-14, 'ring total energy budget');
  assert(data.innerRadius <= 1 && data.outerRadius >= 4, 'inner contraction and outer expansion');
  assert(data.releasedEnergy >= lastRingEnergy, 'outward transfer releases energy');
  lastRingEnergy = data.releasedEnergy;
}
const rings = ringExchange(.2);
close(rings.innerRadius, .64, 1e-14, 'inner radius after 0.2 J0 transfer');
close(rings.outerRadius, 4.84, 1e-14, 'outer radius after 0.2 J0 transfer');
close(rings.releasedEnergy, .259555785123967, 1e-13, 'released orbital energy');
const ringStep = 1e-6;
close((ringExchange(.2 + ringStep).releasedEnergy - ringExchange(.2 - ringStep).releasedEnergy) / (2 * ringStep), rings.innerOmega - rings.outerOmega, 1e-8, 'orbital energy derivative equals angular-velocity difference');
assert.throws(() => ringExchange(.31), 'reject unmodelled ring exchanges');
// New cloud, spherical-flow, ionization and disk models: analytic limits and budgets.
const gas = context.window.AstroAdvancedMath, gc = gas.gasConstants;
const sphere = gas.isothermalSphere(12, .005), coarseSphere = gas.isothermalSphere(12, .01);
close(sphere.peak.x, 6.451, .005, 'Bonnor–Ebert critical dimensionless radius');
close(sphere.peak.pressureMass, 1.182, .001, 'Bonnor–Ebert pressure-normalized limiting mass');
close(sphere.peak.contrast, 14.04, .03, 'Bonnor–Ebert critical density contrast');
close(sphere.edge.psi, coarseSphere.edge.psi, 1e-7, 'isothermal-sphere half-step convergence');
close(sphere.peak.pressureMass, coarseSphere.peak.pressureMass, 1e-7, 'limiting mass half-step convergence');
const centralSphere = sphere.points[1];
close(centralSphere.psi / centralSphere.x ** 2, 1 / 6, 1e-6, 'regular isothermal central curvature');
assert(sphere.points.every(p => p.density > 0), 'finite isothermal sphere stays positive');
for (const branch of ['wind', 'bondi']) {
  for (const x of [.02, .2, .5, .9, 1, 1.1, 2, 10, 100, 1000]) {
    const mach = gas.sphericalMach(x, branch);
    close(mach ** 2 - Math.log(mach ** 2), 4 * Math.log(x) + 4 / x - 3, 1e-11, `${branch}: critical integral residual at ${x}`);
    if (x !== 1) assert.equal(mach < 1, branch === 'wind' ? x < 1 : x > 1, 'correct transonic branch');
    if (branch === 'bondi') {
      const relativeDensity = Math.exp(1.5) / (x * x * mach);
      close(mach ** 2 / 2 + Math.log(relativeDensity) - 2 / x, 0, 1e-11, 'Bondi Bernoulli conservation');
    }
  }
  close((gas.sphericalMach(1.0001, branch) - gas.sphericalMach(.9999, branch)) / .0002, branch === 'wind' ? 1 : -1, 1e-7, 'regular sonic slope');
}
const bondi = gas.bondiModel(1, 1e-18, 1), bondiScaled = gas.bondiModel(2, 1e-18, 2);
close(bondi.lambda, 1.120422267584516, 1e-14, 'isothermal Bondi rate coefficient');
close(bondiScaled.radius / bondi.radius, .5, 1e-14, 'Bondi radius scaling');
close(bondiScaled.rate / bondi.rate, .5, 1e-14, 'Bondi rate scaling');
const wind = gas.parkerModel(1e6), hotWind = gas.parkerModel(4e6);
close(wind.sound / 1000, 117.291657, .001, 'one-million-K isothermal sound speed');
close(wind.sonicRadius / gc.solarRadius, 6.933, .02, 'solar wind sonic radius');
close(hotWind.sound / wind.sound, 2, 1e-14, 'wind temperature scaling');
close(hotWind.sonicRadius / wind.sonicRadius, .25, 1e-14, 'wind critical-radius scaling');
const jeans = gas.jeansModel(.2, 1e-17), denseJeans = gas.jeansModel(.2, 4e-17);
for (const key of ['wavelength', 'mass', 'gravityTime']) close(denseJeans[key] / jeans[key], .5, 1e-14, `Jeans density scaling: ${key}`);
close(gas.jeansModel(.2, 1e-17, 1).growth, 0, 1e-15, 'Jeans marginal wavelength');
close(gas.jeansModel(.2, 1e-17, .5).growth, Math.sqrt(.75), 1e-14, 'Jeans analytic growing mode');
const hii = gas.stromgrenModel(1e49, 100), hiiScaled = gas.stromgrenModel(8e49, 200);
close(hii.radius / gc.pc, 3.15, .01, 'Strömgren reference radius');
close(hii.recombinationTime / gc.year, 1218.77, .1, 'recombination time in Julian years');
close(2.6e-19 * 1e16 * 4 * Math.PI / 3 * hii.radius ** 3 / 1e49, 1, 1e-14, 'equilibrium ionization photon balance in SI');
close(hiiScaled.radius / hii.radius, Math.cbrt(2), 1e-14, 'Strömgren luminosity/density scaling');
close(hiiScaled.recombinationTime / hii.recombinationTime, .5, 1e-14, 'recombination density scaling');
for (const tau of [0, .001, 1, 5, 100]) {
  const front = gas.stromgrenModel(1e49, 100, tau);
  close(front.radiusFraction ** 3, front.volumeFraction, 1e-14, 'front radius/volume consistency');
  close(front.volumeFraction + Math.exp(-tau), 1, 1e-14, 'recombinations plus new ionizations conserve photons');
}
const disk = gas.alphaDisk(.01, .05, 10), strongDisk = gas.alphaDisk(.03, .05, 10);
close(disk.height / disk.radius, .05, 1e-14, 'disk Gaussian scale height');
close(disk.viscousTime * disk.viscosity / disk.radius ** 2, 1, 1e-14, 'disk diffusion timescale');
close(strongDisk.rate / disk.rate, 3, 1e-14, 'fixed surface-density alpha rate scaling');
close(strongDisk.viscousTime / disk.viscousTime, 1 / 3, 1e-14, 'alpha timescale scaling');
for (const q of [0, 1, 1.5, 1.8]) {
  for (const b of [0, .001, .5, 1, 2]) {
    const mode = gas.mriMode(q, b), z = mode.growthSquared;
    close(z * z + (mode.epicycleSquared + 2 * b * b) * z + b * b * (b * b - 2 * q), 0, 1e-12, 'MRI characteristic determinant');
    assert(mode.growth <= q / 2 + 1e-14, 'MRI growth bounded by half the shear rate');
  }
  close(gas.mriMode(q, gas.mriMode(q, 0).fastestB).growth, q / 2, 1e-14, 'MRI analytic maximum');
}
close(gas.mriMode(1.5, Math.sqrt(15 / 16)).growth, .75, 1e-14, 'Keplerian MRI fastest mode');
close(gas.mriMode(1.5, 2 * Math.sqrt(15 / 16)).growth, 0, 1e-15, 'stronger field stabilizes fixed wavenumber');
const toomre = gas.toomreMode(.8, 1.25);
close(toomre.band[0], .5, 1e-14, 'Toomre lower unstable endpoint');
close(toomre.band[1], 2, 1e-14, 'Toomre upper unstable endpoint');
close(toomre.maximumGrowth, .75, 1e-14, 'Toomre maximum growth at Q=0.8');
for (const x of toomre.band) close(gas.toomreMode(.8, x).omegaSquared, 0, 1e-14, 'Toomre band edge is neutral');
for (const x of [0, .5, 1, 2, 4]) {
  close(gas.toomreMode(1, x).omegaSquared, (x - 1) ** 2, 1e-14, 'marginal Toomre dispersion');
  assert(gas.toomreMode(1.5, x).omegaSquared > 0, 'Q>1 gas disk axisymmetrically stable');
}
const ps = context.window.AstroPressSchechter;
close(ps.threshold, 1.6864701998411453, 1e-14, 'EdS linear collapse threshold');
const turnaround = ps.sphericalCollapse(Math.PI);
close(turnaround.time, .5, 1e-14, 'turnaround at half the formal collapse time');
close(turnaround.radius, 1, 1e-14, 'turnaround radius normalization');
close(turnaround.nonlinear + 1, 9 * Math.PI ** 2 / 16, 1e-13, 'nonlinear turnaround density relative to background');
close(ps.sphericalCollapse(.0001).nonlinear / ps.sphericalCollapse(.0001).linear, 1, 1e-8, 'early linear and nonlinear contrasts agree');
for (const theta of [.001, .5, Math.PI, 5, 2 * Math.PI]) {
  const collapse = ps.sphericalCollapse(theta);
  close(collapse.linear / ps.threshold, collapse.time ** (2 / 3), 1e-14, 'EdS linear extrapolation follows time to the two-thirds power');
}
assert.equal(ps.sphericalCollapse(2 * Math.PI).nonlinear, Infinity, 'formal collapse singularity is not delta_c');
// Independent normal-tail reference values (2 * normal survival probability).
for (const [nu, reference] of [[0, 1], [1, .31731050786291415], [2, .04550026389635842], [3, .002699796063260189], [8, 1.2441921148543658e-15], [20, 5.507248237212663e-89]]) {
  close(ps.collapsedFraction(nu) / reference, 1, 2e-9, `Gaussian tail at nu=${nu}`);
  close(ps.collapsedFraction(nu, 4096) / ps.collapsedFraction(nu), 1, 2e-9, 'tail quadrature step convergence');
}
const integrate = (fn, a, b, n = 4000) => {
  const h = (b - a) / n;
  let sum = fn(a) + fn(b);
  for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * fn(a + i * h);
  return h * sum / 3;
};
for (const index of [-2.5, -2, .5]) {
  close(integrate(logM => ps.massShape(Math.exp(logM), index, .5).massPerLn, -240, 80, 64000), 1, 1e-8, 'PS total mass normalization over logarithmic mass');
  for (const ratio of [.1, 1, 20]) {
    const data = ps.massShape(ratio, index, .5), eps = 1e-4;
    const tail = logM => ps.collapsedFraction(ps.massShape(Math.exp(logM), index, .5).nu);
    close(-(tail(Math.log(ratio) + eps) - tail(Math.log(ratio) - eps)) / (2 * eps), data.massPerLn, 2e-9, 'cumulative/differential mass consistency');
    close(data.numberPerDex * ratio, data.massPerDex, 1e-14, 'mass and number measures differ by halo mass');
    const rescaled = ps.massShape(data.characteristicMass * ratio, index, .5);
    close(rescaled.massPerLn, ps.massShape(ratio, index, 1).massPerLn, 1e-14, 'PS self-similar mass distribution');
  }
}
const earlyPS = ps.massShape(1, -2, .5);
close(earlyPS.characteristicMass, 1 / 64, 1e-14, 'n=-2 characteristic mass follows D to the sixth');
close(earlyPS.nu, 2, 1e-14, 'halving growth doubles peak height at fixed mass');
close(ps.collapsedFraction(earlyPS.nu), .04550026389635842, 1e-10, 'chapter question rare mass fraction');
close(integrate(logM => ps.massShape(Math.exp(logM), -2, 1).massPerLn, Math.log(.1), Math.log(10)), ps.collapsedFraction(ps.massShape(.1).nu) - ps.collapsedFraction(ps.massShape(10).nu), 1e-10, 'integrated mass bin equals difference of cumulative fractions');
assert.throws(() => ps.massShape(1, -3));
assert.throws(() => ps.massShape(1, 1));
assert.throws(() => ps.collapsedFraction(-1));
const dynamics=context.window.AstroDynamics, dc=dynamics.C;
// Ellipsoid quadratures: Poisson, scale invariance, spherical energy, and tabulated figures.
const uniformSphere=dynamics.ellipsoid(2,2,2);
for(const a of uniformSphere.A) close(a,2/3,1e-9,'spherical interior gravity coefficient');
close(uniformSphere.binding,.3,1e-9,'uniform sphere binding energy 3GM²/(5R)');
const triaxial=dynamics.ellipsoid(1,.7,.3), enlarged=dynamics.ellipsoid(3,2.1,.9);
close(triaxial.poissonSum,2,1e-8,'ellipsoid Poisson sum without renormalization');
for(let i=0;i<3;i++)close(triaxial.A[i],enlarged.A[i],1e-9,'ellipsoid axis-ratio scaling');
close(triaxial.binding/enlarged.binding,3,1e-8,'gravitational binding inverse-length scaling');
close(dynamics.maclaurin(.001).omegaSquared/(.001**2),8/15,1e-6,'Maclaurin small-eccentricity expansion');
close(dynamics.maclaurin(.81267).energyRatio,.13753,2e-5,'Maclaurin secular threshold energy');
close(dynamics.maclaurin(.95289).energyRatio,.2738,1e-4,'Maclaurin dynamical threshold energy');
for(const [b,e13,omegaHat] of [[.8,.85585,.42827],[.6,.90102,.41069]]) {
  const figure=dynamics.jacobi(b);
  close(Math.sqrt(1-figure.c**2),e13,1e-5,'Fitzpatrick Table 2.2 Jacobi axis ratio');
  close(Math.sqrt(figure.omegaSquared/2),omegaHat,1e-5,'Table 2.2 rotation with Ω/sqrt(2πGρ) normalization');
  close(figure.residual,0,1e-9,'equal effective potential on three Jacobi axes');
}
// Lagrangian map: its numerical derivative, mass conservation and pre-crossing bounds.
for(const D of [0,.5,.95]) {
  let mass=0,previous;
  for(let i=0;i<=20000;i++) {
    const q=-Math.PI+2*Math.PI*i/20000,d=dynamics.zeldovich(q,D);
    assert(d.jacobian>0&&d.density>0,'single-stream density stays positive');
    if(previous)mass+=(d.x-previous.x)*(d.density+previous.density)/2;
    previous=d;
  }
  close(mass,2*Math.PI,1e-5,'Eulerian integral of Zel’dovich density conserves period mass');
  const q=.7,h=1e-5,derivative=(dynamics.zeldovich(q+h,D).x-dynamics.zeldovich(q-h,D).x)/(2*h);
  close(derivative,dynamics.zeldovich(q,D).jacobian,1e-9,'map derivative equals volume Jacobian');
}
close(dynamics.zeldovich(0,.8).density,5,1e-14,'pancake chapter peak density');
assert.throws(()=>dynamics.zeldovich(0,1),'do not extend a single stream through shell crossing');
// Hayashi: atmospheric powers and a contraction energy budget, rather than fitted tracks.
close(dynamics.hayashi(1,0).epsilon,1/43.8,1e-14,'H-minus atmosphere radius exponent');
for(const tau of [0,2,20]) {
  const star=dynamics.hayashi(.5,tau);
  close(4*Math.PI*star.radius**2*dc.sigma*star.temperature**4/star.luminosity,1,1e-13,'surface luminosity and temperature consistency');
}
const ht=2,hh=1e-4,star=dynamics.hayashi(.5,ht);
close((dynamics.hayashi(.5,ht+hh).energy-dynamics.hayashi(.5,ht-hh).energy)/(2*hh*star.time0)/(-star.luminosity),1,1e-8,'contraction luminosity is minus energy derivative');
const smallCluster=dynamics.relaxation(1e4,3),largeCluster=dynamics.relaxation(1e5,3);
close(largeCluster.dynamicalTime/smallCluster.dynamicalTime,1/Math.sqrt(10),1e-13,'dynamical time at fixed stellar mass');
close(largeCluster.halfMassTime/smallCluster.halfMassTime,Math.sqrt(10)*Math.log(4000)/Math.log(40000),1e-13,'relaxation N/logN including changing cluster mass');
close(dynamics.relaxation(1e4,6).halfMassTime/smallCluster.halfMassTime,Math.sqrt(8),1e-13,'relaxation radius scaling');
// Drift-diffusion: moments, normalization, analytic PDE residual and zero-drift limit.
for(const gamma of [0,1,2]) {
  const ou=dynamics.ornsteinUhlenbeck(1.3,gamma);
  close(integrate(ou.density,-30,30,8000),1,1e-12,'OU probability on the full line');
  close(integrate(x=>x*ou.density(x),-30,30,8000),ou.mean,1e-12,'OU mean from density integral');
  close(integrate(x=>(x-ou.mean)**2*ou.density(x),-30,30,8000),ou.variance,1e-12,'OU variance from density integral');
}
close(dynamics.ornsteinUhlenbeck(5,0).variance,5.0625,1e-14,'free diffusion variance grows as 2Dt');
close(dynamics.ornsteinUhlenbeck(40,2).variance,.25,1e-14,'OU stationary variance D/gamma');
for(const x of [-1,.3,2]) {
  const dt=1e-4,dx=1e-3,gamma=.8,ou=dynamics.ornsteinUhlenbeck(1.1,gamma),density=ou.density;
  const timeDerivative=(dynamics.ornsteinUhlenbeck(1.1+dt,gamma).density(x)-dynamics.ornsteinUhlenbeck(1.1-dt,gamma).density(x))/(2*dt);
  const first=(density(x+dx)-density(x-dx))/(2*dx),second=(density(x+dx)-2*density(x)+density(x-dx))/(dx*dx);
  close(timeDerivative,gamma*density(x)+gamma*x*first+.5*second,3e-6,'OU solves stated Fokker–Planck convention');
}
const thermo=dynamics.gravothermal(60,.01),fineThermo=dynamics.gravothermal(60,.005);
close(thermo.canonical.x,8.99,.02,'first fixed-temperature turning point');
close(thermo.canonical.contrast,32.1,.1,'canonical critical density contrast');
close(thermo.canonical.eta,2.51755,1e-5,'canonical inverse-temperature maximum');
close(thermo.microcanonical.contrast,709,2,'microcanonical critical density contrast');
close(thermo.microcanonical.lambda,.33457,1e-5,'Antonov limiting energy');
close(thermo.microcanonical.lambda,fineThermo.microcanonical.lambda,1e-7,'thermodynamic energy half-step convergence');
// Similarity disk: finite-difference PDE, integrated mass/J and inner accretion budget.
for(const gamma of [0,1,1.5]) {
  const disk0=dynamics.viscousDisk(1,0,gamma),disk3=dynamics.viscousDisk(1,3,gamma);
  const mass=integrate(logR=>dynamics.viscousDisk(Math.exp(logR),3,gamma).massPerLn,-60,30,12000);
  close(mass,disk3.mass,1e-9,'viscous disk mass integral');
  const angular=time=>integrate(logR=>dynamics.viscousDisk(Math.exp(logR),time,gamma).massPerLn*Math.exp(logR/2),-60,30,12000);
  close(angular(3)/angular(0),1,1e-9,'viscous disk angular momentum conserved while mass accretes');
  const h=1e-4;
  close(-(dynamics.viscousDisk(1,3+h,gamma).mass-dynamics.viscousDisk(1,3-h,gamma).mass)/(2*h),disk3.rate,1e-9,'disk mass loss equals central accretion');
  for(const r of [.3,1,3]) {
    const dx=1e-4*r,dt=1e-4,surface=(x,t)=>dynamics.viscousDisk(x,t,gamma).surface;
    const gradient=x=>Math.sqrt(x)*(((x+dx)**(gamma+.5)*surface(x+dx,2)-(x-dx)**(gamma+.5)*surface(x-dx,2))/(2*dx));
    const rhs=(gradient(r+dx)-gradient(r-dx))/(2*dx)/(disk0.beta**2*r),lhs=(surface(r,2+dt)-surface(r,2-dt))/(2*dt);
    close(lhs-rhs,0,Math.max(1e-8,Math.abs(lhs)*1e-4),'viscous similarity solves diffusion PDE with stated ts');
  }
}
const diskFour=dynamics.viscousDisk(1,3,1);
close(diskFour.mass,.5,1e-14,'gamma=1 disk question mass');
close(diskFour.characteristicRadius,4,1e-14,'gamma=1 disk question radius');
close(diskFour.rate/dynamics.viscousDisk(1,0,1).rate,.125,1e-14,'gamma=1 disk question accretion rate');
const sis=dynamics.collapseRhs(2,0,.5);
close(sis.dv,0,1e-14,'static singular isothermal sphere velocity');
close(sis.dAlpha,-.5,1e-14,'static singular isothermal sphere density derivative');
for(const branch of ['shu','lph']) {
  const collapse=dynamics.collapseScales(branch,.2,30),hot=dynamics.collapseScales(branch,.4,30),x=1e-5;
  close(hot.rate/collapse.rate,8,1e-13,'isothermal collapse sound-speed cubic rate');
  close(hot.scale/collapse.scale,2,1e-13,'isothermal similarity length scaling');
  close(x*x*collapse.innerAlpha(x)*(-collapse.innerV(x)),collapse.m0,1e-12,'free-fall asymptote carries specified central mass flux');
  const rhs=dynamics.collapseRhs(x,collapse.innerV(x),collapse.innerAlpha(x));
  close(rhs.dv/(.5*Math.sqrt(2*collapse.m0)*x**(-1.5)),1,1e-3,'inner free-fall velocity approaches similarity ODE');
}
assert.throws(()=>dynamics.collapseRhs(1,0,2),'critical points need a regular branch');
const collapseModel=context.window.AstroCollapse;
// Shu (1977), Table 2: x, alpha, -v, m. Tolerances include printed rounding.
const shuTable=[
  [.05,71.5,5.44,.981],[.10,27.8,3.47,.993],[.15,16.4,2.58,1.01],
  [.20,11.5,2.05,1.03],[.25,8.76,1.68,1.05],[.30,7.09,1.40,1.08],
  [.35,5.95,1.18,1.12],[.40,5.14,1.01,1.16],[.45,4.52,.861,1.20],
  [.50,4.04,.735,1.25],[.55,3.66,.625,1.30],[.60,3.35,.528,1.36],
  [.65,3.08,.442,1.42],[.70,2.86,.363,1.49],[.75,2.67,.291,1.56],
  [.80,2.50,.225,1.64],[.85,2.35,.163,1.72],[.90,2.22,.106,1.81],
  [.95,2.10,.051,1.90],[1,2,0,2]
];
for(const [x,alpha,speed,mass] of shuTable){
  const p=collapseModel.at(collapseModel.profile('shu'),x);
  close(p.alpha,alpha,alpha>=10?.1:.011,'Shu Table 2 density at printed precision');
  close(-p.v,speed,speed>=1?.006:.001,'Shu Table 2 infall speed at printed precision');
  close(p.mass,mass,.006,'Shu Table 2 enclosed mass');
}
for(const branch of ['shu','lph']) {
  const p=collapseModel.profile(branch),fine=collapseModel.profile(branch,.002),limit=collapseModel.profile(branch,.004,5e-7);
  close(p.m0,branch==='shu'?.975:46.9,branch==='shu'?.0005:.1,'central mass coefficient agrees with rounded literature data');
  close(fine.m0/p.m0,1,1e-7,'collapse half-step convergence');
  close(limit.m0/p.m0,1,1e-7,'Shu A-to-2 extrapolation convergence');
  for(let i=1;i<p.points.length-1;i++) {
    const a=p.points[i-1],q=p.points[i],b=p.points[i+1];
    assert(q.alpha>0&&q.v<=0&&q.mass>a.mass,'positive density, inward motion and increasing enclosed mass');
    // Unequal-spacing three-point derivative; no division through the sonic point.
    if(q.x>.8&&q.x<1.2)continue;
    const h1=q.x-a.x,h2=b.x-q.x;
    const derivative=(fa,fq,fb)=>(h1*h1*(fb-fq)+h2*h2*(fq-fa))/(h1*h2*(h1+h2));
    const rhs=dynamics.collapseRhs(q.x,q.v,q.alpha);
    close(derivative(a.mass,q.mass,b.mass)/(q.x*q.x*q.alpha),1,.001,'integrated collapse mass conservation');
    close(derivative(Math.log(a.alpha),Math.log(q.alpha),Math.log(b.alpha))/(rhs.dAlpha/q.alpha),1,.001,'integrated collapse continuity ODE');
    if(Math.abs(rhs.dv)>1e-10)close(derivative(a.v,q.v,b.v)/rhs.dv,1,.001,'integrated collapse momentum ODE');
  }
  for(const x of [.001,.1,.5,.9,2,100]){
    const q=collapseModel.at(p,x),f=collapseModel.at(fine,x);
    close(q.alpha/f.alpha,1,1e-7,'profile density step convergence');
    close(q.v,f.v,1e-6,'profile velocity step convergence');
  }
  const inner=collapseModel.at(p,1e-4);
  close(inner.alpha/(Math.sqrt(p.m0/2)*1e6),1,.002,'integrated inner density tends to free fall');
  close(-inner.v/Math.sqrt(2*p.m0/1e-4),1,.002,'integrated inner speed tends to free fall');
  const s=collapseModel.scales(branch,.2,30),hot=collapseModel.scales(branch,.4,30);
  close(hot.rate/s.rate,8,1e-12,'integrated-profile cubic accretion scaling');
  close(hot.mass/s.mass,8,1e-12,'integrated-profile central mass scaling');
  for(const r of [2000,5000,15000]){
    close(collapseModel.shell(branch,r,.2,10).radiusAu/r,1,1e-10,'mass shell starts at the labelled radius');
    const later=collapseModel.shell(branch,r,.2,60);
    if(!later.accreted)close(collapseModel.physical(collapseModel.scales(branch,.2,60),later.radiusAu).enclosedMass/later.enclosedMass,1,1e-8,'animated shell preserves enclosed total mass');
    assert(later.radiusAu<=r*(1+1e-10),'labelled shells do not move outward');
  }
  const r=branch==='shu'?2000:10000,time=branch==='shu'?70:30,dt=.01;
  const shell=collapseModel.shell(branch,r,.2,time),before=collapseModel.shell(branch,r,.2,time-dt),after=collapseModel.shell(branch,r,.2,time+dt);
  const drdt=(after.radiusAu-before.radiusAu)/(2*dt)*dc.au/(1000*dc.year);
  close(drdt/collapseModel.physical(collapseModel.scales(branch,.2,time),shell.radiusAu).velocity,1,.01,'animated shell velocity agrees with gas velocity');
}
for(const time of [10,30,100]) {
  const s=collapseModel.scales('shu',.2,time),r=20000,point=collapseModel.physical(s,r);
  assert.equal(point.velocity,0,'Shu exterior is exactly at rest and is omitted from log speed');
  close(point.density/(s.sound*s.sound/(2*Math.PI*dc.G*(r*dc.au)**2)),1,1e-12,'Shu exterior density is static in physical coordinates');
  close(collapseModel.shell('shu',r,.2,time).radiusAu,r,1e-8,'exterior Shu shell stays at rest before wave arrival');
}
assert(collapseModel.shell('shu',2000,.2,100).accreted,'shell crossing the central mass is accreted');
assert.throws(()=>collapseModel.at(collapseModel.profile('shu'),0),'log-radius profile requires positive radius');
const cylinderModel=context.window.AstroAdvancedMath.isothermalCylinder;
for(const T of [5,10,30])for(const nc of [1e3,1e4,1e6])for(const f of [.05,.5,.95]) {
  const d=cylinderModel(T,nc,f),r=d.radius;
  close(d.lineMass(d.a)/d.criticalLineMass,.5,1e-13,'Ostriker half-line-mass radius, equation 61');
  close(d.lineMass(1e6*d.a)/d.criticalLineMass,1,2e-12,'finite limiting cylinder line mass, equation 60');
  close(d.density(r)/d.centralDensity,(1-f)**2,1e-13,'pressure-truncated cylinder density contrast');
  close(d.externalPressure/context.window.AstroAdvancedMath.gasConstants.k/1e6,nc*T*(1-f)**2,1e-8,'cylinder boundary pressure in K cm^-3');
  close(d.lineMassAtEdge/d.lineMass(r),1,1e-13,'selected edge agrees with enclosed line mass');
  const virial=2*d.soundSquared*d.lineMassAtEdge-dc.G*d.lineMassAtEdge**2;
  close(virial/(2*Math.PI*r*r*d.externalPressure),1,1e-12,'cylindrical virial balance includes external pressure');
  const dense=cylinderModel(T,4*nc,f),hot=cylinderModel(4*T,nc,f);
  close(dense.criticalLineMass/d.criticalLineMass,1,1e-13,'critical line mass independent of central density');
  close(dense.a/d.a,.5,1e-13,'cylinder width scales as rho_c^-1/2');
  close(hot.criticalLineMass/d.criticalLineMass,4,1e-13,'critical line mass scales as temperature');
}
const cylinder=cylinderModel(10,1e4);
close(cylinder.criticalLineMass*dc.pc/dc.solar,16.5,.05,'10 K molecular cylinder critical line mass in solar masses per pc');
assert.equal(cylinder.gravity(0),0,'regular cylinder gravity vanishes on axis');
for(const q of [.01,.1,1,10,100]) {
  const d=cylinder,r=q*d.a,h=r*1e-4;
  const integrated=2*Math.PI*r*r*d.centralDensity*dynamics.integral(u=>u*d.density(r*u)/d.centralDensity,0,1,1e-12);
  close(integrated/d.lineMass(r),1,1e-8,'cylinder enclosed line mass matches independent density integration');
  const logDerivative=(Math.log(d.density(r+h))-Math.log(d.density(r-h)))/(2*h);
  close((-d.soundSquared*logDerivative)/d.gravity(r),1,1e-6,'cylinder pressure gradient balances gravity');
  close(d.gravity(r)/(2*dc.G*d.lineMass(r)/r),1,1e-13,'cylindrical Gauss law');
  const poisson=((r+h)*d.gravity(r+h)-(r-h)*d.gravity(r-h))/(2*h*r);
  close(poisson/(4*Math.PI*dc.G*d.density(r)),1,1e-6,'cylindrical gravitational field satisfies Poisson equation');
}
for(const q of [0,.5,1,5]) {
  const d=cylinder;
  // z = a tan(theta) makes the independent line-of-sight integral finite.
  const integrated=2*d.centralDensity*d.a*dynamics.integral(theta=>{
    const c=Math.cos(theta),s=Math.sin(theta);return c*c/(s*s+(1+q*q)*c*c)**2;
  },0,Math.PI/2);
  close(integrated/d.column(q*d.a),1,1e-8,'untruncated cylinder projected column matches line-of-sight integral');
}
close(cylinder.column(cylinder.columnFwhm/2)/cylinder.column(0),.5,1e-13,'untruncated projected FWHM');
close(cylinder.density(1000*cylinder.a)/cylinder.density(2000*cylinder.a),16,.0001,'cylinder density has r^-4 envelope');
close(cylinder.column(1000*cylinder.a)/cylinder.column(2000*cylinder.a),8,.0001,'projected column has b^-3 envelope');
for(const bad of [[0,1e4,.5],[10,0,.5],[10,1e4,0],[10,1e4,1],[NaN,1e4,.5]])assert.throws(()=>cylinderModel(...bad),'invalid cylinder parameters are rejected');
const pulsar=dynamics.goldreichJulian(1,12),slowPulsar=dynamics.goldreichJulian(2,12);
close(pulsar.numberCm3/1e10,6.94,.01,'GJ polar number scale in cm^-3');
close(pulsar.lightCylinder/1000,47713.4515924,1e-6,'light cylinder in km');
close(slowPulsar.numberCm3/pulsar.numberCm3,.5,1e-13,'GJ inverse-period scaling');
close(slowPulsar.capRadius/pulsar.capRadius,1/Math.sqrt(2),1e-13,'dipolar polar-cap period scaling');
close(dynamics.goldreichJulian(1,12,pulsar.nullAngle).charge/pulsar.charge,0,1e-13,'aligned dipole null surface');
assert(pulsar.charge<0&&dynamics.goldreichJulian(1,12,90).charge>0,'GJ sign follows local Omega dot B');
close((1e12/(dc.c*100*context.window.AstroNumbers.eGaussian))/pulsar.numberCm3,1,1e-8,'SI and Gaussian GJ charge conventions agree');
const numbers = context.window.AstroNumbers;
bilingual(numbers.title, 'Supplement title');
bilingual(numbers.desc, 'Supplement description');
assert.equal(numbers.entries.length, 12, 'Expected all twelve numerical reference cards');
for (const entry of numbers.entries) {
  bilingual(entry.name, `${entry.symbol} name`);
  bilingual(entry.kind, `${entry.symbol} status`);
}
for (const lang of ['ja', 'en']) {
  const body = numbers.renderBody(lang);
  checkMarkup(body, `numbers/${lang}`);
  assert.equal((body.match(/<section>/g) || []).length, 7);
  assert(body.includes('hubble-units') && body.includes('number-converter'));
  if (lang === 'en') assert(!/[\u3040-\u30ff\u3400-\u9fff]/.test(body), 'Untranslated supplement body');
}
for (const [,url] of numbers.refs) assert(url.startsWith('https://'));
const numeric = numbers.constants;
close(numbers.convert('pc', 1).cm / 1e18, 3.085677581491367, 1e-14, 'parsec definition in centimetres');
close(numbers.convert('pc', 1).ly, 3.261563777, 1e-8, 'parsec to Julian light-years');
close(numbers.convert('solar', 1).kg / 1e30, 1.9884098707, 1e-10, 'nominal solar GM divided by measured G');
close(numbers.hbar * 2 * Math.PI / numeric.h, 1, 1e-14, 'h and hbar');
close(numeric.me * numeric.c ** 2 / numeric.e / 1e6, .51099895069, 1e-10, 'electron rest energy in MeV');
close(numeric.G * 100 ** 3 / 1000 / 6.67430e-8, 1, 1e-14, 'G SI to CGS dimensions');
close(numbers.eGaussian ** 2 / (numbers.hbar * 1e7 * numeric.c * 100) / numeric.alpha, 1, 1e-14, 'dimensionless alpha in Gaussian conventions');
close(numbers.eGaussian / 1e-10, 4.80320471, 1e-8, 'Gaussian elementary charge');
close(numbers.convert('energy', 1).erg / 1e-12, 1.602176634, 1e-14, 'eV to erg');
close(numbers.convert('energy', 1).kelvin, 11604.51812155, 1e-6, 'equivalent temperature E/kB');
for (const field of [0, 1e-6, 1, 1e12]) {
  const converted = numbers.convert('field', field);
  close(converted.tesla, field * 1e-4, Math.max(1e-20, field * 1e-15), 'gauss to tesla');
  if (field) close(converted.siEnergyDensity / (converted.cgsEnergyDensity * .1), 1, 1e-8, 'SI and Gaussian magnetic energy density');
}
const hubble70 = numbers.hubble(70);
close(hubble70.perSecond / 1e-18, 2.2685455026, 1e-9, 'H0 inverse-second conversion');
close(hubble70.timeGyr, 13.96846, 1e-5, 'Hubble time in Gyr');
close(numbers.hubble(70).timeSeconds / numbers.hubble(140).timeSeconds, 2, 1e-14, 'inverse Hubble scaling');
assert.throws(() => numbers.hubble(0));
assert.throws(() => numbers.convert('pc', -1));
assert.throws(() => numbers.convert('pc', NaN));

// Nonequilibrium: conservation, independent rate scalings, and evolution residuals.
const NE=context.window.AstroNonequilibrium,NC=NE.C;
const relative=(a,b,tol,label)=>close(a/b,1,tol,label);
const plasma=NE.twoTemperature(2,.1,.001),finePlasma=NE.twoTemperature(2,.1,.001,.01);
let previousEntropy=-Infinity;
for(const seconds of [0,1e8,1e10,1e11,1e12,1e13,1e15]) {
  const q=plasma.at(seconds),fine=finePlasma.at(seconds);
  close(q.te+q.ti,2.2,1e-14,'Two-temperature energy conservation');
  assert(q.te>=.2-1e-14&&q.ti>=q.te&&q.ti<=2,'Positive non-overshooting temperature relaxation');
  const entropy=Math.log(q.te)+Math.log(q.ti);
  assert(entropy>=previousEntropy-1e-13,'Total ideal-gas entropy increases during exchange');previousEntropy=entropy;
  close(q.te,fine.te,3e-8,'Coulomb integration half-step convergence');
}
for(const beta of [.01,.2,.99,1]) {
  const equilibrium=NE.twoTemperature(2,beta,.001);
  const q=equilibrium.at(1e18);
  close(q.te,q.ti,1e-12,'Late-time mutual equilibrium');
}
assert.equal(NE.twoTemperature(2,1,.001).at(123).te,2,'Equal temperatures remain fixed');
relative(NE.exchangeTime(1,1,.002),NE.exchangeTime(1,1,.001)/2,1e-14,'Coulomb density inverse scaling');
// Independent cgs evaluation: e in statcoulomb, mass in g, energy in erg.
const meCGS=9.1093837139e-28,mpCGS=1.67262192595e-24,eCGS=4.80320471e-10;
const tauCGS=3*meCGS*mpCGS/(8*Math.sqrt(2*Math.PI)*.001*eCGS**4*30)*(1.602176634e-9/meCGS+1.602176634e-9/mpCGS)**1.5;
relative(NE.exchangeTime(1,1,.001),tauCGS,2e-8,'Coulomb SI/Gaussian exchange time');
for(const seconds of [1e10,1e11,1e12]) {
  const h=1e7,q=plasma.at(seconds),derivative=(plasma.at(seconds+h).te-plasma.at(seconds-h).te)/(2*h);
  relative(derivative,(q.ti-q.te)/NE.exchangeTime(q.te,q.ti,.001),3e-5,'Temperature-exchange ODE residual');
  const dense=NE.twoTemperature(2,.1,.002).at(seconds/2);
  close(dense.te,q.te,2e-10,'Full trajectory inverse-density clock');
}
const ad=NE.ambipolar(),mu0=1/(NC.epsilon0*NC.c**2);
const etaSI=(ad.B*1e-4)**2/(mu0*(ad.gamma*.001)*(ad.rhoi*1000)*(ad.rhon*1000));
relative(ad.eta*1e-4,etaSI,1e-9,'Ambipolar SI/Gaussian diffusivity (measured SI mu0)');
relative(NE.ambipolar(1e4,1e-7,.1,60).eta,4*ad.eta,1e-14,'Ambipolar B squared scaling');
relative(NE.ambipolar(2e4).eta,ad.eta/4,1e-14,'Ambipolar density squared scaling');
relative(NE.ambipolar(1e4,2e-7).eta,ad.eta/2,1e-14,'Ambipolar ion-fraction scaling');
relative(NE.ambipolar(1e4,1e-7,.2).tAD,4*ad.tAD,1e-14,'Ambipolar length squared clock');
relative(ad.at(ad.tAD).amplitude,.1/Math.E,1e-14,'Fourier-mode amplitude decay');
for(const phase of [.4,1,2]) {
  const time=.7*ad.tAD,h=.001,dt=.0001*ad.tAD;
  const ddt=(ad.at(time+dt,phase).field-ad.at(time-dt,phase).field)/(2*dt);
  const dxx=(ad.at(time,phase+h).field-2*ad.at(time,phase).field+ad.at(time,phase-h).field)/(h*h*ad.L**2);
  relative(ddt,ad.eta*dxx,2e-6,'Ambipolar Fourier diffusion PDE residual');
}
const heat=ad.at(ad.tAD),dh=.0001*ad.tAD;
relative(-(ad.at(ad.tAD+dh).energy-ad.at(ad.tAD-dh).energy)/(2*dh),heat.heating,1e-7,'Perturbation energy loss equals drag heating');
const averageDrag=Array.from({length:512},(_,i)=>ad.gamma*ad.rhoi*ad.rhon*ad.at(ad.tAD,2*Math.PI*i/512).drift**2).reduce((a,b)=>a+b,0)/512;
relative(averageDrag,heat.heating,1e-14,'Independently averaged drift-heating budget');
const chem=NE.chemistry();
close(chem.k3/1e-32,1.699423178,1e-8,'Forrey fit at 1000 K');
assert.equal(chem.at(0).x,0,'Initially atomic chemistry');
close(chem.at(chem.t50).x,.5,1e-14,'Exact half-conversion time');
let lastFraction=0;
for(const time of [1e-8,1,1e8,chem.t50,1e12,1e20]) {
  const q=chem.at(time);
  relative(q.nH+2*q.nH2,1e11,1e-14,'Hydrogen-nucleus conservation');
  assert(q.x>=lastFraction&&q.x<=1,'Bounded monotonic molecular fraction');lastFraction=q.x;
  close(q.bindingPerNucleus,4.48*q.x/2,1e-14,'Binding-energy count per nucleus');
}
for(const time of [.1,.5,2].map(x=>x*chem.t50)) {
  const h=1e-4*chem.t50,q=chem.at(time),dx=(chem.at(time+h).x-chem.at(time-h).x)/(2*h);
  relative(dx,2*chem.k3*1e22*(1-q.x)**3,2e-7,'Three-body chemistry ODE residual');
}
const denserChem=NE.chemistry(1000,1e12);
relative(denserChem.t50/denserChem.tff,chem.t50/chem.tff*10**(-1.5),1e-14,'Chemical/gravity clock density scaling');
relative(NE.chemistry(1000,2e11).t50,chem.t50/4,1e-14,'Three-body half-time inverse density squared');
assert(chem.at(1e-8).x>0,'Tiny-time molecular fraction avoids cancellation');
for(const bad of [0,-1,NaN,Infinity]) {
  assert.throws(()=>NE.exchangeTime(1,1,bad));assert.throws(()=>NE.ambipolar(bad));assert.throws(()=>NE.chemistry(bad));
}
assert.throws(()=>plasma.at(-1));assert.throws(()=>ad.at(-1));assert.throws(()=>chem.at(-1));
assert.throws(()=>NE.twoTemperature(2,1.1));


// Library entries distinguish availability and refer to real chapters.
const library=context.window.AstroSolutions;
assert.equal(library.entries.length,17);
assert.equal(library.entries.filter(e=>e.status==='ready').length,14);
assert.equal(new Set(library.entries.map(e=>e.id)).size,17);
for(const entry of library.entries) {
  for(const key of ['title','kind','assumptions','boundary','parameters','limits'])bilingual(entry[key],entry.id+'.'+key);
  assert(library.domains[entry.domain]);assert(entry.reference[1].startsWith('https://'));
  if(entry.status==='ready')assert(advanced.chapters.some(c=>entry.route==='#/advanced/'+c.id));
  else assert.equal(entry.route,undefined,'Planned entries must not link to missing lessons');
}
assert.equal(library.matching('Bondi').some(e=>e.id==='bondi'),true);
assert.equal(library.matching('Ｂｏｎｄｉ').some(e=>e.id==='bondi'),true,'Normalize full-width search');
assert.equal(library.matching('', 'relativity', 'ready').length,1);
assert.equal(library.matching('', 'relativity', 'planned').length,2);
assert.equal(library.matching('missing-solution-query').length,0);
for(const language of ['ja','en']) {
  const html=library.renderBody(language);checkMarkup(html,'solution library '+language);
  assert.equal((html.match(/class="solution-card"/g)||[]).length,17);
  if(language==='en')assert(!/[\u3040-\u30ff\u3400-\u9fff]/.test(html),'Fully translated solution catalogue');
}
// Schwarzschild checks use standard radii and independently differentiated potentials.
const GR=context.window.AstroSchwarzschild;
const gr=GR.model(10,6,100),doubleMass=GR.model(20,6,100);
relative(gr.rate,Math.sqrt(2/3),1e-14,'Static clock at R=6');
relative(gr.redshift,Math.sqrt(3/2)-1,1e-14,'Static gravitational redshift at R=6');
relative(doubleMass.rg,2*gr.rg,1e-14,'Schwarzschild physical radius mass scaling');
relative(doubleMass.proper,2*gr.proper,1e-14,'Gravitational time unit mass scaling');
relative(doubleMass.rate,gr.rate,1e-14,'Clock fraction at fixed dimensionless radius');
close(GR.model(1).horizon/1000,2.95325,.0001,'Solar-mass horizon in km');
assert.equal(GR.potential(2,16),0,'Effective potential at horizon');
close(GR.potential(1e8,16),1,3e-8,'Asymptotic unit rest energy');
assert.equal(GR.circles(11.99).length,0);
const marginal=GR.circles(12);assert.equal(marginal.length,1);assert.equal(marginal[0].radius,6);
relative(marginal[0].energy,Math.sqrt(8/9),1e-14,'ISCO conserved energy');
const fixedJ=GR.circles(16);assert.equal(fixedJ[0].radius,4);assert.equal(fixedJ[1].radius,12);
for(const j of [12,12.25,16,25,1e5])for(const orbit of GR.circles(j)) {
  const R=orbit.radius,h=R*1e-4;
  const slope=(GR.potential(R+h,j)-GR.potential(R-h,j))/(2*h);
  const second=(GR.potential(R+h,j)-2*GR.potential(R,j)+GR.potential(R-h,j))/(h*h);
  close(slope/(1+j/R**2),0,5e-8,'Circular-orbit extremum relative to angular-energy scale');
  const expected=2*(R-6)/(R**3*(R-3));
  close(second,expected,Math.max(1e-8,Math.abs(expected)*2e-6),'Circular-orbit radial stability');
  if(orbit.stability==='stable')assert(R>6&&second>0);
  if(orbit.stability==='unstable')assert(R>3&&R<6&&second<0);
}
const lightPotential=R=>GR.potential(R,1,true),hLight=1e-4;
close((lightPotential(3+hLight)-lightPotential(3-hLight))/(2*hLight),0,1e-9,'Photon circular extremum');
assert(lightPotential(3)>lightPotential(2.9)&&lightPotential(3)>lightPotential(3.1),'Photon sphere is unstable');
relative(1/Math.sqrt(lightPotential(3)),3*Math.sqrt(3),1e-14,'Photon capture impact parameter');
const weakR=1e6;
relative((1-GR.model(1,weakR).rate)*weakR,1,1e-6,'Weak-field clock limit');
for(const invalid of [0,-1,NaN,Infinity])assert.throws(()=>GR.model(invalid));
assert.throws(()=>GR.model(1,2));assert.throws(()=>GR.model(1,1.9));assert.throws(()=>GR.model(1,6,-1));
assert.throws(()=>GR.circles(-1));
const index = readFileSync(resolve(root, 'docs/index.html'), 'utf8');
for (const asset of index.matchAll(/(?:src|href)="\.\/([^"#]+)"/g)) {
  assert(existsSync(resolve(root, 'docs', asset[1].split('?')[0])), `Missing local asset ${asset[1]}`);
}
console.log(`OK: ${chapters.length} foundation + ${advanced.chapters.length} advanced chapters, numerical supplement, and 10 illustrations × 2 languages; ${topicIds.size} syllabus topics; markup, references, assets, physics models, constants, and SI/CGS conversions.`);
