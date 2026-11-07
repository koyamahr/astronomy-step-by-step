import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const site = 'https://koyamahr.github.io/astronomy-step-by-step/';
const sitemap = readFileSync(resolve(output, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.equal(urls.length, 110);
assert.equal(new Set(urls).size, urls.length);
for (const url of urls) {
  const relative = url.slice(site.length);
  const language = relative.split('/')[0];
  const html = readFileSync(resolve(output, relative, 'index.html'), 'utf8');
  assert(html.includes(`<html lang="${language}">`), url);
  assert(html.includes(`<link rel="canonical" href="${url}">`), url);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1];
  assert(title?.length > 4 && description?.length > 20, `Missing page metadata: ${url}`);
  if (language === 'en') assert(!/[\u3040-\u30ff\u3400-\u9fff]/.test(description), `Untranslated description: ${url}`);
  const body = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert(body?.includes('<h1>') && body.length > 1000, `Missing static text: ${url}`);
  assert(!html.includes('href="#/'), `Hash-only link: ${url}`);
  assert(!/\b(?:undefined|NaN)\b/.test(body), `Missing content: ${url}`);
  for (const lang of ['ja', 'en']) assert(html.includes(`hreflang="${lang}" href="${site}${relative.replace(/^(ja|en)\//, `${lang}/`)}"`), `Language alternate: ${url}`);
  for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (raw.startsWith('#') || /^(?:data|mailto):/.test(raw)) continue;
    const link = new URL(raw.replaceAll('&amp;', '&'), url);
    if (!link.href.startsWith(site)) continue;
    const asset = decodeURIComponent(link.pathname.slice(new URL(site).pathname.length));
    assert(existsSync(resolve(output, asset, ...(asset.endsWith('/') || !asset ? ['index.html'] : []))), `Broken local asset/link ${raw} in ${url}`);
  }
}

// Old shared URLs, static paths, language overrides, and ordinary fragment anchors.
for (const base of [site, 'http://127.0.0.1:4173/']) {
  const context = { window: {}, URL, URLSearchParams, document: { currentScript: { src: `${base}routing.js` } } };
  runInNewContext(readFileSync(resolve(root, 'docs/routing.js'), 'utf8'), context);
  const routing = context.window.AstroRouting;
  for (const [suffix, language, route] of [
    ['?lang=en#/chapter/chandra', 'en', '/chapter/chandra'],
    ['en/advanced/lane-emden/', 'en', '/advanced/lane-emden'],
    ['ja/chapter/chandra/?lang=en', 'en', '/chapter/chandra'],
    ['en/books/#book-galactic-dynamics', 'en', '/books'],
    ['en/', 'en', '/']
  ]) assert.equal(JSON.stringify(routing.resolve(new URL(suffix, base))), JSON.stringify({ language, route }));
}
console.log(`OK: ${urls.length} pages have static text, valid links, localized metadata, canonical URLs and reciprocal language alternates; legacy routing passes.`);
