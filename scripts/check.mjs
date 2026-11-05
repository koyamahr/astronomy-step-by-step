import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
for (const name of ['app.js', 'content.js', 'series.js', 'advanced-content.js', 'advanced-math.js', 'advanced-labs.js']) {
  execFileSync(process.execPath, ['--check', resolve(root, 'docs', name)]);
}
const context = { window: {} };
runInNewContext(readFileSync(resolve(root, 'docs/content.js'), 'utf8'), context);
runInNewContext(readFileSync(resolve(root, 'docs/series.js'), 'utf8'), context);
runInNewContext(readFileSync(resolve(root, 'docs/advanced-content.js'), 'utf8'), context);
runInNewContext(readFileSync(resolve(root, 'docs/advanced-math.js'), 'utf8'), context);
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
assert.equal(topicIds.size, 25, 'Expected the expanded 25-topic advanced syllabus');
const advanced = context.window.AstroAdvanced;
assert.equal(advanced.chapters.length, 7, 'Expected seven worked advanced chapters');
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
const index = readFileSync(resolve(root, 'docs/index.html'), 'utf8');
for (const asset of index.matchAll(/(?:src|href)="\.\/([^"#]+)"/g)) {
  assert(existsSync(resolve(root, 'docs', asset[1].split('?')[0])), `Missing local asset ${asset[1]}`);
}
console.log(`OK: ${chapters.length} foundation + ${advanced.chapters.length} advanced chapters × 2 languages; ${topicIds.size} syllabus topics; HTML, references, assets, syntax, stellar/blast/interface checks, SZ limits, photon conservation, and energy gain.`);
