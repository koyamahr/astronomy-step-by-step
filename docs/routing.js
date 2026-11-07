/* Shared by the browser and the dependency-free static build. */
(() => {
  'use strict';
  const base = new URL('.', document.currentScript.src).pathname;
  const path = (route, language) => `${base}${language}${route === '/' ? '/' : `${route}/`}`;
  function resolve(location, fallback = 'ja') {
    const relative = location.pathname.startsWith(base) ? location.pathname.slice(base.length) : '';
    const match = relative.match(/^(ja|en)(?:\/(.*))?$/);
    const requested = new URLSearchParams(location.search).get('lang');
    const language = ['ja', 'en'].includes(requested) ? requested : match?.[1] || fallback;
    const route = location.hash.startsWith('#/') ? location.hash.slice(1) : match ? `/${(match[2] || '').replace(/\/$/, '')}` : '/';
    return { language, route };
  }
  const rewrite = (html, language) => html.replace(/(href|src)="\.\/([^"]*)"/g, (_, attribute, asset) => `${attribute}="${base}${asset}"`).replace(/href="#(\/[^"\s]*)"/g, (_, route) => `href="${path(route, language)}"`);
  window.AstroRouting = { base, path, resolve, rewrite };
})();
