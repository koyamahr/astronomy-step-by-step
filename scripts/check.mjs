import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
for (const name of ['app.js', 'content.js', 'series.js', 'advanced-content.js', 'advanced-math.js', 'advanced-labs.js', 'advanced-gas-math.js', 'advanced-gas-content.js', 'advanced-gas-labs.js', 'numbers.js', 'books.js', 'illustrations.js', 'animation.js', 'press-schechter.js', 'advanced-dynamics-math.js', 'advanced-dynamics-content.js', 'advanced-dynamics-labs.js']) {
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
runInNewContext(readFileSync(resolve(root, 'docs/advanced-dynamics-content.js'), 'utf8'), context);
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
assert.equal(topicIds.size, 27, 'Expected the expanded 27-topic advanced syllabus');
const advanced = context.window.AstroAdvanced;
assert.equal(advanced.chapters.length, 27, 'Expected all twenty-seven worked advanced chapters');
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
const index = readFileSync(resolve(root, 'docs/index.html'), 'utf8');
for (const asset of index.matchAll(/(?:src|href)="\.\/([^"#]+)"/g)) {
  assert(existsSync(resolve(root, 'docs', asset[1].split('?')[0])), `Missing local asset ${asset[1]}`);
}
console.log(`OK: ${chapters.length} foundation + ${advanced.chapters.length} advanced chapters, numerical supplement, and 10 illustrations × 2 languages; ${topicIds.size} syllabus topics; markup, references, assets, physics models, constants, and SI/CGS conversions.`);
