(() => {
  'use strict';
  const { chapters, sources } = window.AstroContent;
  const storage = {
    get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Reading still works without storage. */ } }
  };
  const requestedLang = new URLSearchParams(location.search).get('lang');
  let locale = ['ja', 'en'].includes(requestedLang) ? requestedLang : storage.get('astro.language', 'ja');
  if (!['ja', 'en'].includes(locale)) locale = 'ja';
  const savedProgress = storage.get('astro.completed', []);
  const completed = new Set(Array.isArray(savedProgress) ? savedProgress.filter(id => chapters.some(c => c.id === id)) : []);
  const t = (ja, en) => locale === 'ja' ? ja : en;
  const tr = pair => pair[locale === 'ja' ? 0 : 1];
  const pad = n => String(n).padStart(2, '0');
  const main = document.querySelector('#main');
  const chapterUrl = id => `#/chapter/${id}`;
  const parts = [
    ['観測と道具 — 宇宙を測る', 'OBSERVATIONS & TOOLS — Measuring the universe'],
    ['原子と放射 — 光の仕組み', 'ATOMS & RADIATION — Understanding light'],
    ['星とその限界 — ミクロからマクロへ', 'STARS & THEIR LIMITS — From micro to macro'],
    ['宇宙論への入口 — 宇宙の広がりを読む', 'COSMOLOGY — Reading the expanding universe']
  ];

  function cosmicFigure() {
    return `<figure class="cosmos" aria-label="${t('星を支える外向きの圧力と、内向きの重力を描いた概念図。縮尺は任意。', 'A conceptual diagram of outward pressure and inward gravity supporting a star; not to scale.')}">
      <svg viewBox="0 0 460 480" role="img" aria-hidden="true">
        <defs><radialGradient id="star-glow"><stop offset="0" stop-color="#f7d8a3"/><stop offset=".7" stop-color="#dfa36b"/><stop offset="1" stop-color="#cd7a4e"/></radialGradient><marker id="arrow-mint" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#b7d0c2"/></marker><marker id="arrow-sand" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#e8b185"/></marker></defs>
        <g fill="#a5bdc3"><circle cx="82" cy="99" r="1.4"/><circle cx="321" cy="81" r="1.7"/><circle cx="372" cy="164" r="1"/><circle cx="67" cy="308" r="1.2"/><circle cx="352" cy="381" r="1.5"/><circle cx="156" cy="391" r="1"/><circle cx="272" cy="119" r="1"/><circle cx="90" cy="209" r="1"/><path d="M365 93v10m-5-5h10M107 363v8m-4-4h8" stroke="#a5bdc3" stroke-width="1"/></g>
        <g fill="none" stroke="#76949e" stroke-width=".65" opacity=".48"><circle cx="230" cy="247" r="161" stroke-dasharray="3 6"/><circle cx="230" cy="247" r="115"/><ellipse cx="230" cy="247" rx="193" ry="64" transform="rotate(-32 230 247)"/><ellipse cx="230" cy="247" rx="73" ry="155" transform="rotate(-32 230 247)"/></g>
        <circle cx="230" cy="247" r="74" fill="url(#star-glow)"/>
        <g fill="none" stroke="#f7dbb8" opacity=".45"><ellipse cx="230" cy="247" rx="73" ry="26" transform="rotate(-32 230 247)"/><ellipse cx="230" cy="247" rx="35" ry="74" transform="rotate(-32 230 247)"/></g>
        <g stroke="#b7d0c2" stroke-width="2" marker-end="url(#arrow-mint)"><path d="M230 162v-40M230 331v40M145 247h-40M315 247h40"/></g>
        <g stroke="#e8b185" stroke-width="2" marker-end="url(#arrow-sand)"><path d="M151 168l25 25M309 168l-25 25M151 326l25-25M309 326l-25-25"/></g>
        <g fill="#d8e5df" font-family="Georgia,serif" font-size="13"><text x="250" y="135">${t('外向きの圧力', 'outward pressure')}</text><text x="302" y="314">${t('内向きの重力', 'inward gravity')}</text></g>
        <text x="230" y="252" text-anchor="middle" font-family="Georgia,serif" font-size="22" font-style="italic" fill="#62351f">${t('星のつり合い', 'stellar balance')}</text>
      </svg><figcaption class="figure-tag">FIG. 01 — ${t('星を支える二つのはたらき', 'THE BALANCE THAT HOLDS A STAR')}</figcaption></figure>`;
  }

  function chapterRows(query = '') {
    const term = query.trim().toLocaleLowerCase();
    const filtered = chapters.filter(c => [...c.title, ...c.desc].join(' ').toLocaleLowerCase().includes(term));
    if (!filtered.length) return `<p class="empty">${t('該当する章がありません。別の言葉で検索してください。', 'No chapters found. Try a different word.')}</p>`;
    return parts.map((part, index) => {
      const items = filtered.filter(c => c.part === index);
      if (!items.length) return '';
      return `<div class="part-label">${tr(part)}</div>${items.map(c => {
        const num = chapters.indexOf(c);
        return `<a class="chapter-row" href="${chapterUrl(c.id)}"><span class="number">${pad(num)}</span><div><h3>${tr(c.title)}</h3><p>${tr(c.desc)}</p></div><span class="meta">${t('目安 ', 'About ')}${c.minutes}${t('分', ' min')}</span><span class="${completed.has(c.id) ? 'check' : ''}" aria-label="${completed.has(c.id) ? t('読了', 'Completed') : t('章を開く', 'Open chapter')}">${completed.has(c.id) ? '✓' : '↗'}</span></a>`;
      }).join('')}`;
    }).join('');
  }

  function contentsBlock() {
    return `<section id="contents"><div class="section-heading"><div><div class="eyebrow">THE LEARNING PATH</div><h2>${t('小さな式から、大きな宇宙へ。', 'Small equations. A vast universe.')}</h2><p>${t('順番に読んでも、気になる問いから始めても。', 'Read in order, or start with the question that draws you in.')}</p></div><span class="section-index">${chapters.length}</span></div><div class="chapter-tools"><label class="search"><span class="visually-hidden">${t('章を検索', 'Search chapters')}</span><input type="search" id="chapter-search" placeholder="${t('章を探す：光、電子、重力…', 'Find a chapter: light, electrons, gravity…')}" autocomplete="off"></label><span class="progress-caption">${completed.size} / ${chapters.length} ${t('章 読了', 'chapters complete')}</span></div><div class="chapter-list" id="chapter-results">${chapterRows()}</div></section>`;
  }

  function home(onlyContents = false) {
    document.title = t('高校生が知りたい天文学 | 式でたどる宇宙', 'Astronomy, step by step | A bilingual guide');
    if (onlyContents) return `<div class="wrap" style="padding-top:48px">${contentsBlock()}${pathNote()}</div>`;
    return `<div class="wrap"><section class="hero"><div><div class="eyebrow">AN OPEN NOTEBOOK OF ASTROPHYSICS</div><h1>${t('暗記する宇宙から、<br><em>式でわかる宇宙へ。</em>', 'Don’t just memorize<br>the universe.<br><em>Work it out.</em>')}</h1><p class="intro">${t('太陽はなぜ輝く？ 光はどう星を押す？<br>高校数学の式変形を道しるべに、原子の世界から<br>星の限界まで、一歩ずつたどる天文学。', 'Why does the Sun shine? How can light push a star?<br>Follow the algebra from atoms to the limits of stars,<br>one understandable step at a time.')}</p><div class="actions"><a class="button" href="${chapterUrl('tools')}">${t('最初の一歩を読む', 'Start exploring')} <span aria-hidden="true">↗</span></a><a class="text-link" href="#/chapters">${t('すべての章を見る', 'Browse all chapters')}</a></div><div class="hero-note"><span>${t('高校数学から', 'Starts with school algebra')}</span><span>${t('微分方程式なし', 'No differential equations')}</span><span>日本語 / English</span></div></div>${cosmicFigure()}</section>
      <div class="principles"><div><b>01</b><div><strong>${t('直感をつかむ', 'Build intuition')}</strong><p>${t('身近な問いから始める。', 'Start with a concrete question.')}</p></div></div><div><b>02</b><div><strong>${t('一行ずつ、式をつなぐ', 'Follow every algebraic step')}</strong><p>${t('途中の変形を飛ばさない。', 'See the steps between formulas.')}</p></div></div><div><b>03</b><div><strong>${t('近似の意味までわかる', 'Understand the assumptions')}</strong><p>${t('どこまで言えるかを確かめる。', 'Know what a model can explain.')}</p></div></div></div>
      <section><div class="section-heading"><div><div class="eyebrow">TWO LIMITS, TWO STORIES</div><h2>${t('星の「限界」を、式で読む。', 'Two limits. Two physical stories.')}</h2><p>${t('この教材が目指す、二つの到達点。', 'Two destinations for your journey through the physics.')}</p></div></div><div class="feature-grid"><a class="feature" href="${chapterUrl('chandra')}"><span class="tag">QUANTUM PHYSICS × RELATIVITY</span><h3>${t('白色矮星は、どこまで重くなれる？', 'How massive can a white dwarf be?')}</h3><p>${t('電子の圧力と重力。半径が式から消えるとき、限界質量が現れる。', 'Balance electron pressure against gravity. When radius cancels, a limiting mass emerges.')}</p><div class="feature-math">M<sub>Ch</sub> ≈ 1.4 M<sub>☉</sub></div><div class="feature-foot"><span>${t('チャンドラセカール質量', 'The Chandrasekhar mass')}</span><span class="arrow">↗</span></div></a><a class="feature" href="${chapterUrl('eddington')}"><span class="tag">ELECTROMAGNETISM × GRAVITY</span><h3>${t('光は、星を吹き飛ばせる？', 'Can light push a star apart?')}</h3><p>${t('電子を押す光の力を数えて、重力とつり合う明るさを求める。', 'Count the momentum light transfers to electrons, then find where it balances gravity.')}</p><div class="feature-math">L<sub>Edd</sub> = 4πGMc / κ</div><div class="feature-foot"><span>${t('エディントン限界', 'The Eddington limit')}</span><span class="arrow">↗</span></div></a></div></section>
      ${contentsBlock()}${pathNote()}</div>`;
  }

  function pathNote() {
    return `<aside class="path-note"><div class="orb" aria-hidden="true">✳</div><div><h3>${t('数式は、宇宙を見るためのもう一つの望遠鏡。', 'An equation is another kind of telescope.')}</h3><p>${t('公式そのものの導出が難しいところは、出発点として明示します。わかる部分をつなぎ、次の学びへ。', 'When a law needs more advanced mathematics, we name it as an input. Connect what you can follow, then take the next step.')}</p></div></aside>`;
  }

  function lesson(c) {
    const i = chapters.indexOf(c);
    document.title = `${tr(c.title)} | ${t('高校生が知りたい天文学', 'Astronomy, step by step')}`;
    return `<div class="lesson-layout"><aside class="sidebar"><a class="back" href="#/chapters">← ${t('すべての章', 'All chapters')}</a><div class="side-title">${t('学びの道すじ', 'THE LEARNING PATH')}</div><nav class="side-links" aria-label="${t('章の目次', 'Chapter navigation')}">${chapters.map((other, n) => `<a href="${chapterUrl(other.id)}" ${other.id === c.id ? 'aria-current="page"' : ''}><span>${pad(n)}</span>${tr(other.title)}</a>`).join('')}</nav></aside><article class="lesson"><header class="lesson-head"><div class="eyebrow">CHAPTER ${pad(i)} / ${tr(parts[c.part]).split(' — ')[0]}</div><h1>${tr(c.title)}</h1><p class="dek">${tr(c.desc)}</p><div class="lesson-meta"><span>${t('読む目安：', 'Reading time: ')}${c.minutes}${t('分', ' min')}</span><span>${t('使う道具：', 'Tools: ')}${tr(c.prereq)}</span></div></header><div class="goal"><strong>${t('この章でできるようになること', 'WHAT YOU WILL LEARN')}</strong>${tr(c.goal)}</div>
      ${window.AstroContent.renderBody(c.id, locale)}
      <aside class="quiz"><div class="eyebrow">CHECK YOUR UNDERSTANDING</div><h2>${t('自分の言葉で、確かめよう。', 'Pause and work it out.')}</h2><p>${tr(c.question)}</p><details><summary>${t('答えと考え方を見る', 'Show the answer and reasoning')}</summary><p>${tr(c.answer)}</p></details></aside>
      <div class="sources"><strong>${t('参考資料・出発点にした法則', 'REFERENCES & PHYSICAL INPUTS')}</strong><p>${t('以下は原理や数値を確認できる資料です。大学レベルの数式を含むものもあります。本文の説明と式変形は、この教材向けに構成しています。', 'These sources support the laws and numerical values; some use university-level mathematics. The explanations and algebra here are written for this guide.')}</p><ul>${c.refs.map(id => `<li><a href="${sources[id][1]}" target="_blank" rel="noopener noreferrer">${sources[id][0]} ↗</a></li>`).join('')}</ul></div>
      <div class="lesson-bottom"><button class="complete-button" id="complete-chapter" data-id="${c.id}" aria-pressed="${completed.has(c.id)}">${completeLabel(c.id)}</button><div class="prev-next">${i > 0 ? `<a href="${chapterUrl(chapters[i - 1].id)}"><small>← ${t('前の章', 'Previous')}</small>${tr(chapters[i - 1].title)}</a>` : ''}${i < chapters.length - 1 ? `<a href="${chapterUrl(chapters[i + 1].id)}"><small>${t('次の章', 'Next')} →</small>${tr(chapters[i + 1].title)}</a>` : `<a href="#/chapters"><small>${t('目次へ', 'Back to contents')} →</small>${t('学びの道すじを振り返る', 'Revisit the learning path')}</a>`}</div></div></article></div>`;
  }

  function completeLabel(id) {
    return completed.has(id) ? t('✓ 読了済み — もう一度押すと解除', '✓ Completed — click again to undo') : t('この章を読了にする', 'Mark this chapter complete');
  }

  function about() {
    document.title = t('この教材について | 高校生が知りたい天文学', 'About this guide | Astronomy, step by step');
    return `<article class="about"><div class="eyebrow">ABOUT THIS OPEN NOTEBOOK</div><h1>${t('式をつなぐ。宇宙が見える。', 'Connect the equations. See the universe.')}</h1><p>${t('「高校生が知りたい天文学」は、日本語と英語で読める宇宙物理学の入門教材です。高校数学の式変形を中心に、距離と光の観測から、原子、放射、星の構造、白色矮星やブラックホールへ進みます。', 'Astronomy, step by step is a Japanese–English introduction to astrophysics. It uses school algebra to connect observations of light and distance with atoms, radiation, stellar structure, white dwarfs, and black holes.')}</p>
      <h2>${t('この教材の約束', 'Our teaching principles')}</h2><ul><li>${t('直感、仮定、式変形、数値例、確認問題をつなぎます。', 'Connect intuition, assumptions, algebra, numerical examples, and questions.')}</li><li>${t('微分方程式は解きません。未定乗数法だけは、任意で開く発展欄に微分を使う計算を置きます。', 'No differential equations. An optional entropy-maximization extension uses derivatives.')}</li><li>${t('量子力学・一般相対論のすべてを高校数学だけで導いたようには扱いません。借りた法則と、自分で追える変形を区別します。', 'Do not pretend to derive all of quantum mechanics or general relativity using algebra alone. Distinguish supplied physical laws from steps you can follow.')}</li><li>${t('数値は目的に応じて丸め、モデルの仮定と適用範囲を添えます。', 'Round numerical values appropriately and state the assumptions and scope of models.')}</li></ul>
      <h2>${t('二つの言語で、同じ章を', 'The same chapters in two languages')}</h2><p>${t('日本語／ENのボタンは、現在の章を保って本文と操作ラベルを切り替えます。言語と読了の記録は、お使いのブラウザだけに保存します。ログインや外部への送信はありません。保存が無効でも本文は読めます。', 'The language buttons translate the current chapter and controls without changing chapters. Language and completion records stay in your browser. No account or data transmission is needed; reading still works if local storage is disabled.')}</p>
      <h2>${t('もっと確かめたいとき', 'Check the physics for yourself')}</h2><p>${t('各章の末尾に参考資料があります。式の記号は章内で定義し、SI単位を基本にしています。疑問が出たら、まず単位、固定した量、≈や∝の意味を確認してください。', 'Each chapter ends with references. Symbols are defined in context and SI units are the default. When a result seems puzzling, first check the units, what is held fixed, and the meaning of ≈ or ∝.')}</p>
      <p><a class="button" href="#/chapters">${t('目次から読み始める', 'Explore the chapters')} ↗</a></p></article>`;
  }

  function render({ preserveScroll = false } = {}) {
    const scrollY = window.scrollY;
    document.documentElement.lang = locale;
    document.querySelector('#brand-name').innerHTML = `${t('高校生が知りたい天文学', 'Astronomy, step by step')}<small>${t('ASTRONOMY, STEP BY STEP', 'AN OPEN NOTEBOOK OF ASTROPHYSICS')}</small>`;
    document.querySelector('#nav-chapters').textContent = t('目次', 'Chapters');
    document.querySelector('#nav-about').textContent = t('この教材について', 'About');
    document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === locale)));
    const route = location.hash.replace(/^#/, '') || '/';
    let c;
    if (route === '/') main.innerHTML = home();
    else if (route === '/chapters') main.innerHTML = home(true);
    else if (route === '/about') main.innerHTML = about();
    else if (route.startsWith('/chapter/') && (c = chapters.find(item => route === `/chapter/${item.id}`))) main.innerHTML = lesson(c);
    else {
      document.title = t('章が見つかりません | 天文学', 'Chapter not found | Astronomy');
      main.innerHTML = `<div class="about"><h1>${t('章が見つかりませんでした。', 'Chapter not found.')}</h1><p><a href="#/chapters">${t('目次へ戻る', 'Back to chapters')} →</a></p></div>`;
    }
    document.querySelector('#footer').innerHTML = `<span>${t('高校生が知りたい天文学', 'Astronomy, step by step')}<br>${t('光と物質を、式でつなぐオープンノート。', 'An open notebook connecting light and matter.')}</span><span>${t('高校数学から / 日本語・English', 'School algebra / Japanese & English')}<br><a href="#/about">${t('教材の方針と参考資料について', 'Teaching principles & references')} ↗</a></span>`;
    mountLabs();
    if (preserveScroll) window.scrollTo({ top: scrollY, behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function mountLabs() {
    document.querySelectorAll('[data-lab]').forEach(el => {
      if (el.dataset.lab === 'blackbody') mountBlackbody(el);
      if (el.dataset.lab === 'eddington') mountEddington(el);
      if (el.dataset.lab === 'compression') mountCompression(el);
      if (el.dataset.lab === 'expansion') mountExpansion(el);
    });
  }

  function mountBlackbody(el) {
    el.className = 'lab';
    el.innerHTML = `<h3>${t('動かして確かめる：温度と黒体スペクトル', 'Explore: temperature and the blackbody spectrum')}</h3><label for="bb-temperature">${t('温度', 'Temperature')}: <output id="bb-temperature-value" for="bb-temperature"></output> K</label><input id="bb-temperature" type="range" min="2000" max="12000" value="5772" step="1"><svg viewBox="0 0 600 250" role="img" aria-labelledby="bb-chart-title"><title id="bb-chart-title">${t('波長ごとの黒体放射の形。各温度のピークを1に規格化。', 'Blackbody wavelength spectrum normalized to one at its own peak.')}</title><path d="M50 20V212H580" fill="none" stroke="#aebdb3"/><path d="M50 32H580M50 122H580" fill="none" stroke="#e1e7de" stroke-dasharray="3 4"/><text x="28" y="36">1</text><text x="28" y="216">0</text><text x="50" y="234">100</text><text x="306" y="234">1300</text><text x="550" y="234">2500</text><text x="220" y="16">Bλ / Bλ,peak</text><path id="bb-curve" fill="none" stroke="#bb592f" stroke-width="2.5"/><line id="bb-peak" y1="32" y2="212" stroke="#6d9380" stroke-dasharray="4 4"/></svg><div class="readout"><div class="stat"><small>${t('Bλのピーク波長', 'Peak wavelength of Bλ')}</small><strong id="bb-peak-value"></strong></div><div class="stat"><small>${t('同じ面積での全放射（太陽温度比）', 'Total power per area (relative to 5,772 K)')}</small><strong id="bb-power-value"></strong></div></div><p class="lab-note">${t('横軸：波長[nm]。縦軸は各温度のピークで規格化して形を比較。全パワーの変化は右の数値に示します。Bλ＝(c/λ²)Bν(c/λ)で変数を変えています。', 'Horizontal axis: wavelength [nm]. Each curve is normalized to its own peak; the power readout shows the change in total emission. The variable conversion is Bλ = (c/λ²)Bν(c/λ).')}</p>`;
    const slider = el.querySelector('input');
    const update = () => {
      const temp = Number(slider.value);
      const peak = 2.897771955e6 / temp;
      const shape = nm => 1 / (Math.pow(nm * 1e-9, 5) * Math.expm1(0.01438776877 / (nm * 1e-9 * temp)));
      const norm = shape(peak);
      const d = Array.from({ length: 321 }, (_, i) => {
        const nm = 100 + i * 2400 / 320;
        return `${i ? 'L' : 'M'}${(50 + i * 530 / 320).toFixed(2)} ${(212 - 180 * shape(nm) / norm).toFixed(2)}`;
      }).join(' ');
      el.querySelector('#bb-curve').setAttribute('d', d);
      const x = 50 + (peak - 100) / 2400 * 530;
      const marker = el.querySelector('#bb-peak');
      marker.setAttribute('x1', x.toFixed(2)); marker.setAttribute('x2', x.toFixed(2));
      el.querySelector('#bb-temperature-value').textContent = temp.toLocaleString(locale);
      el.querySelector('#bb-peak-value').textContent = `${Math.round(peak)} nm`;
      el.querySelector('#bb-power-value').textContent = `${(temp / 5772) ** 4 < 0.1 ? ((temp / 5772) ** 4).toFixed(3) : ((temp / 5772) ** 4).toFixed(2)} ×`;
    };
    slider.addEventListener('input', update); update();
  }

  function mountEddington(el) {
    el.className = 'lab';
    el.innerHTML = `<h3>${t('動かして確かめる：重力と光の力', 'Explore: gravity versus the force of light')}</h3><label for="edd-mass">${t('中心天体の質量', 'Central mass')}: <output id="edd-mass-value" for="edd-mass"></output> M☉</label><input id="edd-mass" type="range" min="1" max="100" step="1" value="10"><label for="edd-lum">log₁₀(L / L☉): <output id="edd-lum-value" for="edd-lum"></output></label><input id="edd-lum" type="range" min="3" max="7" step="0.01" value="5"><label for="edd-composition">${t('完全電離ガスの組成', 'Fully ionized gas composition')}</label><select id="edd-composition"><option value="0.03977">${t('純水素：κ≈0.040 m²/kg', 'Pure hydrogen: κ ≈ 0.040 m²/kg')}</option><option value="0.034">${t('水素・ヘリウム：κ≈0.034 m²/kg', 'Hydrogen–helium: κ ≈ 0.034 m²/kg')}</option><option value="0.020">${t('純ヘリウム：κ≈0.020 m²/kg', 'Pure helium: κ ≈ 0.020 m²/kg')}</option></select><div class="readout"><div class="stat"><small>L_Edd / L☉</small><strong id="edd-limit"></strong></div><div class="stat"><small>Γ = L / L_Edd = a_rad / a_grav</small><strong id="edd-ratio"></strong></div></div><div class="bar-chart" aria-hidden="true"><span>${t('重力', 'Gravity')}</span><div class="bar-track"><div class="bar gravity" style="width:50%"></div></div><span>${t('光の力', 'Radiation')}</span><div class="bar-track"><div class="bar" id="edd-bar"></div></div></div><p id="edd-state" class="lab-note" role="status"></p><p class="lab-note">${t('各設定で加速度の比を比較します。棒の上端は比2で打ち切り。球対称・一定κのモデルで、星の進化を計算しているわけではありません。', 'Compares acceleration ratios at each setting. The bar is capped at a ratio of 2. This is a spherical, constant-opacity model, not a stellar evolution calculation.')}</p>`;
    const update = () => {
      const mass = Number(el.querySelector('#edd-mass').value);
      const logLum = Number(el.querySelector('#edd-lum').value);
      const opacity = Number(el.querySelector('select').value);
      const limit = 4 * Math.PI * 6.67430e-11 * 1.98847e30 * mass * 299792458 / opacity / 3.828e26;
      const ratio = 10 ** logLum / limit;
      el.querySelector('#edd-mass-value').textContent = mass;
      el.querySelector('#edd-lum-value').textContent = logLum.toFixed(2);
      el.querySelector('#edd-limit').textContent = limit.toExponential(2);
      el.querySelector('#edd-ratio').textContent = ratio.toFixed(3);
      el.querySelector('#edd-bar').style.width = `${Math.min(ratio, 2) * 50}%`;
      el.querySelector('#edd-state').textContent = ratio > 1 ? t('Γ > 1：このモデルでは放射による外向きの加速度が重力を上回ります。', 'Γ > 1: in this model the outward radiative acceleration exceeds gravity.') : t('Γ ≤ 1：このモデルでは重力が放射による加速度以上です。気体圧などは別に考える必要があります。', 'Γ ≤ 1: in this model gravity equals or exceeds radiative acceleration. Gas pressure and other effects still need separate consideration.');
    };
    el.querySelectorAll('input,select').forEach(input => input.addEventListener('input', update)); update();
  }

  function mountCompression(el) {
    el.className = 'lab';
    el.innerHTML = `<h3>${t('動かして確かめる：星を圧縮したら？', 'Explore: what if the star is compressed?')}</h3><label for="compression-radius">R / R₀ = <output id="compression-value" for="compression-radius"></output></label><input id="compression-radius" type="range" min="0.25" max="1" value="1" step="0.01"><div class="readout"><div class="stat"><small>${t('非相対論：P_NR / P_G の変化倍率', 'Nonrelativistic: change in P_NR / P_G')}</small><strong id="compression-nr"></strong></div><div class="stat"><small>${t('超相対論：P_UR / P_G の変化倍率', 'Ultrarelativistic: change in P_UR / P_G')}</small><strong id="compression-ur"></strong></div></div><p class="lab-note" id="compression-note"></p><p class="lab-note">${t('質量・組成を固定し、二つの極限の比例則を比較します。基準半径R₀での比を1に規格化。実際の白色矮星の半径や平衡状態を予測する計算ではありません。', 'Compares the two limiting scaling laws at fixed mass and composition, normalizing each pressure ratio to one at R₀. It does not predict a real white dwarf’s radius or equilibrium state.')}</p>`;
    const slider = el.querySelector('input');
    const update = () => {
      const radius = Number(slider.value);
      el.querySelector('#compression-value').textContent = radius.toFixed(2);
      el.querySelector('#compression-nr').textContent = `${(1 / radius).toFixed(2)} ×`;
      el.querySelector('#compression-ur').textContent = '1.00 ×';
      el.querySelector('#compression-note').textContent = t(`重力の圧力尺度は${(radius ** -4).toFixed(1)}倍。超相対論的な縮退圧も同じ倍率で増えるので、その比は変わりません。`, `The gravitational pressure scale grows by ${(radius ** -4).toFixed(1)}. Ultrarelativistic degeneracy pressure grows by the same factor, so their ratio stays fixed.`);
    };
    slider.addEventListener('input', update); update();
  }

  function mountExpansion(el) {
    el.className = 'lab';
    el.innerHTML = `<h3>${t('動かして確かめる：どの銀河から見てもv＝HD', 'Explore: v = HD from any galaxy')}</h3>
      <label for="exp-scale">${t('距離の倍率', 'Distance scale factor')} a = <output id="exp-scale-value" for="exp-scale"></output></label>
      <input id="exp-scale" type="range" min="0.5" max="2" step="0.01" value="1">
      <label for="exp-rate">H = <output id="exp-rate-value" for="exp-rate"></output> km s⁻¹ Mpc⁻¹</label>
      <input id="exp-rate" type="range" min="50" max="90" step="1" value="70">
      <label for="exp-observer">${t('観測者を置く点', 'Observer location')}</label>
      <select id="exp-observer"><option value="0">A</option><option value="1">B</option><option value="2" selected>C</option><option value="3">D</option><option value="4">E</option></select>
      <svg viewBox="0 0 600 330" role="img" aria-labelledby="exp-chart-title"><title id="exp-chart-title">${t('上：一様に間隔が変わる5点。下：観測者からの距離と後退速度の比例関係。', 'Top: five points with uniformly scaled gaps. Bottom: recession rate versus distance from the chosen observer.')}</title>
        <text x="25" y="25">${t('隣り合う点の間隔：10a Mpc', 'Adjacent separation: 10a Mpc')}</text><line x1="35" y1="65" x2="565" y2="65" stroke="#c5d1c5"/><g id="exp-galaxies"></g>
        <path d="M65 115V280H565" stroke="#9faea4" fill="none"/><text x="72" y="113">${t('後退速度 [km/s]', 'Recession rate [km/s]')}</text><text x="272" y="317">${t('距離 D [Mpc]', 'Distance D [Mpc]')}</text><text x="47" y="284">0</text><text x="35" y="131">7200</text><text x="62" y="298">0</text><text x="550" y="298">80</text>
        <path id="exp-law" stroke="#aabeb0" stroke-dasharray="5 4" fill="none"/><g id="exp-points"></g>
      </svg><p id="exp-reading" class="lab-note" role="status"></p>
      <p class="lab-note">${t('点は宇宙膨張に乗る銀河群の代表点です。色のついた点が観測者。横軸はその点からの距離、縦軸はHD。左右の点が同じ距離にあると、グラフでは重なります。', 'Points represent galaxy groups following the cosmic flow. The coloured point is the observer. The graph uses distance from that point and HD; equal-distance points on opposite sides overlap.')}</p>
      <p class="lab-note">${t('aとHを独立に変え、異なる配置を比較するモデルです。スライダーの動き自体は時間発展の計算ではありません。銀河内部の大きさや固有運動は扱いません。', 'The controls independently vary a and H to compare configurations. Moving a slider is not a calculation of cosmic time evolution. Internal galaxy sizes and peculiar motions are omitted.')}</p>`;
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const update = () => {
      const scale = Number(el.querySelector('#exp-scale').value);
      const rate = Number(el.querySelector('#exp-rate').value);
      const observer = Number(el.querySelector('#exp-observer').value);
      el.querySelector('#exp-scale-value').textContent = scale.toFixed(2);
      el.querySelector('#exp-rate-value').textContent = rate;
      el.querySelector('#exp-galaxies').innerHTML = letters.map((letter, i) => {
        const x = 300 + (i - 2) * 60 * scale;
        return `<circle cx="${x}" cy="65" r="${i === observer ? 8 : 6}" fill="${i === observer ? '#bb592f' : '#345c70'}"/><text x="${x}" y="90" text-anchor="middle">${letter}</text>`;
      }).join('');
      const points = letters.map((letter, i) => ({ letter, distance: Math.abs(i - observer) * 10 * scale, i })).filter(point => point.i !== observer);
      el.querySelector('#exp-law').setAttribute('d', `M65 280L565 ${280 - rate * 80 / 7200 * 150}`);
      el.querySelector('#exp-points').innerHTML = points.map(point => {
        const x = 65 + point.distance / 80 * 500;
        const y = 280 - rate * point.distance / 7200 * 150;
        return `<circle cx="${x}" cy="${y}" r="5" fill="#bb592f"/>`;
      }).join('');
      const distances = points.map(point => `${point.letter}: ${point.distance.toFixed(1)} Mpc → ${Math.round(rate * point.distance)} km/s`).join('; ');
      el.querySelector('#exp-reading').textContent = `${t('観測者', 'Observer')} ${letters[observer]}. ${distances}`;
    };
    el.querySelectorAll('input,select').forEach(input => input.addEventListener('input', update));
    update();
  }

  document.addEventListener('click', event => {
    if (event.target.closest('.skip')) {
      event.preventDefault();
      main.focus({ preventScroll: true });
      main.scrollIntoView({ behavior: 'instant' });
      return;
    }
    const langButton = event.target.closest('[data-lang]');
    if (langButton) {
      if (locale === langButton.dataset.lang) return;
      locale = langButton.dataset.lang;
      storage.set('astro.language', locale);
      const url = new URL(location.href); url.searchParams.set('lang', locale);
      history.replaceState(null, '', url);
      const searchValue = document.querySelector('#chapter-search')?.value;
      const openDetails = [...main.querySelectorAll('details')].map(d => d.open);
      const labValues = [...main.querySelectorAll('.lab input,.lab select')].map(i => i.value);
      render({ preserveScroll: true });
      main.querySelectorAll('details').forEach((d, i) => { d.open = openDetails[i] || false; });
      main.querySelectorAll('.lab input,.lab select').forEach((input, i) => {
        if (labValues[i] !== undefined) { input.value = labValues[i]; input.dispatchEvent(new Event('input')); }
      });
      if (searchValue !== undefined) { document.querySelector('#chapter-search').value = searchValue; document.querySelector('#chapter-results').innerHTML = chapterRows(searchValue); }
      document.querySelector(`[data-lang="${locale}"]`).focus({ preventScroll: true });
    }
    const complete = event.target.closest('#complete-chapter');
    if (complete) {
      const id = complete.dataset.id;
      if (completed.has(id)) completed.delete(id); else completed.add(id);
      storage.set('astro.completed', [...completed]);
      complete.textContent = completeLabel(id);
      complete.setAttribute('aria-pressed', String(completed.has(id)));
    }
  });
  document.addEventListener('input', event => {
    if (event.target.id === 'chapter-search') document.querySelector('#chapter-results').innerHTML = chapterRows(event.target.value);
  });
  window.addEventListener('hashchange', () => { render(); main.focus({ preventScroll: true }); });
  render();
})();
