import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const origin = 'https://koyamahr.github.io';
const site = `${origin}/astronomy-step-by-step/`;
const template = readFileSync(resolve(root, 'docs/index.html'), 'utf8');
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const context = {
  window: { ASTRO_PRERENDER: true }, URL, URLSearchParams,
  location: new URL(site),
  document: { title: '', currentScript: { src: `${site}routing.js` }, querySelector: () => null }
};
const contentFiles = ['illustrations', 'content', 'series', 'advanced-content', 'advanced-math', 'advanced-gas-math', 'advanced-gas-content', 'press-schechter', 'advanced-dynamics-math', 'collapse-math', 'advanced-dynamics-content', 'nonequilibrium-math', 'nonequilibrium-content', 'numbers', 'books', 'routing', 'app'];
for (const file of contentFiles) runInNewContext(readFileSync(resolve(root, `docs/${file}.js`), 'utf8'), context, { filename: `${file}.js` });
const { routes, render } = context.window.AstroPage;
const { path, rewrite } = context.window.AstroRouting;

function pageHTML(route, language) {
  const page = render(route, language);
  const canonical = `${origin}${path(route, language)}`;
  let html = template.replace('<html lang="ja">', `<html lang="${language}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escape(page.description)}">`)
    .replace(/(<main\b[^>]*>)[\s\S]*?<\/main>/, (_, start) => `${start}${page.html}</main>`)
    .replace('<footer id="footer"></footer>', `<footer id="footer"><span>${language === 'en' ? 'Theoretical Astrophysics, Step by Step' : '理論天文学の道具箱'}</span><span><a href="${path('/books', language)}">${language === 'en' ? 'Textbooks & review volumes' : '教科書・総説集ガイド'}</a> · <a href="${path('/about', language)}">${language === 'en' ? 'Teaching principles' : '教材の方針'}</a></span></footer>`);
  if (language === 'en') {
    html = html.replace(/(<span id="brand-name">)[\s\S]*?<\/span>/, '$1Theoretical Astrophysics, Step by Step<small>FOUNDATIONS & ADVANCED</small></span>');
    for (const [id, label] of Object.entries({ chapters: 'Foundations', advanced: 'Advanced', numbers: 'Numbers', books: 'Books', about: 'About' })) html = html.replace(new RegExp(`(id="nav-${id}"[^>]*>)[^<]*`), `$1${label}`);
  }
  // Language navigation works before JavaScript loads, too.
  html = html.replace(/<button data-lang="(ja|en)" lang="\1" aria-pressed="(?:true|false)">([^<]*)<\/button>/g,
    (_, lang, label) => `<a data-lang="${lang}" lang="${lang}" href="${path(route, lang)}" role="button" aria-pressed="${lang === language}">${label}</a>`);
  const metadata = [
    `<link rel="canonical" href="${canonical}">`,
    ...['ja', 'en'].map(lang => `<link rel="alternate" hreflang="${lang}" href="${origin}${path(route, lang)}">`),
    ...Object.entries({ 'og:title': page.title, 'og:description': page.description, 'og:url': canonical, 'og:type': 'website' }).map(([property, content]) => `<meta property="${property}" content="${escape(content)}">`)
  ].join('\n  ');
  return rewrite(html.replace('</head>', `  ${metadata}\n</head>`), language);
}

rmSync(output, { recursive: true, force: true });
cpSync(resolve(root, 'docs'), output, { recursive: true });
for (const route of routes) for (const language of ['ja', 'en']) {
  const destination = resolve(output, language, `.${route}`, 'index.html');
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, pageHTML(route, language));
}
// The existing root URL remains a usable entry point and upgrades old hash links.
writeFileSync(resolve(output, 'index.html'), pageHTML('/', 'ja'));
writeFileSync(resolve(output, '.nojekyll'), '');
const entries = routes.flatMap(route => ['ja', 'en'].map(language => `<url><loc>${origin}${path(route, language)}</loc>${['ja', 'en'].map(lang => `<xhtml:link rel="alternate" hreflang="${lang}" href="${origin}${path(route, lang)}"/>`).join('')}</url>`));
writeFileSync(resolve(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`);
console.log(`Built ${routes.length * 2} bilingual static pages and sitemap in dist/.`);
