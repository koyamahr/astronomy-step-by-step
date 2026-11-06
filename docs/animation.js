/* Explicit, finite playback for teaching panels. No autoplay or hidden loops. */
(() => {
  'use strict';
  const disposers = new Set();
  function mount(el, { locale, min, max, read, write, duration = 14000 }) {
    const t = (ja, en) => locale === 'ja' ? ja : en;
    const controls = document.createElement('div');
    controls.className = 'animation-controls';
    controls.innerHTML = `<button type="button" class="animation-play" aria-pressed="false">${t('再生', 'Play')}</button><button type="button" class="animation-reset">${t('最初から', 'Reset')}</button><span class="animation-state" role="status">${t('停止中', 'Paused')}</span>`;
    el.querySelector('h3').after(controls);
    const play = controls.querySelector('.animation-play'), reset = controls.querySelector('.animation-reset'), status = controls.querySelector('.animation-state');
    let running = false, frame = 0, previous = 0, position = 0, lastPaint = 0;
    const lives = [...el.querySelectorAll('[role="status"]')].filter(node => !controls.contains(node));
    function stop() {
      running = false; cancelAnimationFrame(frame); frame = 0;
      play.textContent = t('再生', 'Play'); play.setAttribute('aria-pressed', 'false');
      status.textContent = t('停止中', 'Paused');
      lives.forEach(node => node.setAttribute('aria-live', 'polite'));
    }
    function tick(now) {
      if (!running) return;
      if (!el.isConnected || document.hidden) { stop(); return; }
      if (previous) position = Math.min(max, position + Math.min(now - previous, 100) * (max - min) / duration);
      previous = now;
      if (now - lastPaint >= 50 || position >= max) { write(position); lastPaint = now; }
      if (position >= max) { stop(); status.textContent = t('再生終了', 'Finished'); return; }
      frame = requestAnimationFrame(tick);
    }
    function toggle() {
      if (running) { stop(); return; }
      position = Math.max(min, Math.min(max, read()));
      if (position >= max - 1e-8) { position = min; write(position); }
      running = true; previous = 0; lastPaint = 0;
      play.textContent = t('一時停止', 'Pause'); play.setAttribute('aria-pressed', 'true');
      status.textContent = t('再生中', 'Playing');
      lives.forEach(node => node.setAttribute('aria-live', 'off'));
      frame = requestAnimationFrame(tick);
    }
    const restart = () => { stop(); write(min); };
    const visibility = () => { if (document.hidden) stop(); };
    play.addEventListener('click', toggle); reset.addEventListener('click', restart);
    el.addEventListener('input', stop); el.addEventListener('change', stop);
    document.addEventListener('visibilitychange', visibility);
    const observer = new IntersectionObserver(entries => { if (!entries[0].isIntersecting) stop(); });
    observer.observe(el);
    function dispose() {
      stop(); observer.disconnect(); document.removeEventListener('visibilitychange', visibility);
      el.removeEventListener('input', stop); el.removeEventListener('change', stop);
      play.removeEventListener('click', toggle); reset.removeEventListener('click', restart);
      disposers.delete(dispose);
    }
    disposers.add(dispose);
    return dispose;
  }
  window.AstroAnimation = { mount, disposeAll: () => { [...disposers].forEach(dispose => dispose()); } };
})();
