import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
for (const name of ['app.js', 'content.js', 'series.js']) {
  execFileSync(process.execPath, ['--check', resolve(root, 'docs', name)]);
}
const context = { window: {} };
runInNewContext(readFileSync(resolve(root, 'docs/content.js'), 'utf8'), context);
runInNewContext(readFileSync(resolve(root, 'docs/series.js'), 'utf8'), context);
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
assert.equal(topicIds.size, 14, 'Expected the agreed 14-topic advanced syllabus');
const index = readFileSync(resolve(root, 'docs/index.html'), 'utf8');
for (const asset of index.matchAll(/(?:src|href)="\.\/([^"#]+)"/g)) {
  assert(existsSync(resolve(root, 'docs', asset[1].split('?')[0])), `Missing local asset ${asset[1]}`);
}
console.log(`OK: ${chapters.length} lessons and ${topicIds.size} planned advanced topics × 2 languages; metadata, lesson HTML, references, local assets, and JavaScript syntax.`);
