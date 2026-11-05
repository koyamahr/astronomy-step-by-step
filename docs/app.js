(() => {
  'use strict';
  const { chapters, sources } = window.AstroContent;
  const series = window.AstroSeries;
  const advancedContent = window.AstroAdvanced;
  const worked = advancedContent.chapters;
  const numbers = window.AstroNumbers;
  const storage = {
    get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Reading still works without storage. */ } }
  };
  const requestedLang = new URLSearchParams(location.search).get('lang');
  let locale = ['ja', 'en'].includes(requestedLang) ? requestedLang : storage.get('astro.language', 'ja');
  if (!['ja', 'en'].includes(locale)) locale = 'ja';
  const savedProgress = storage.get('astro.completed', []);
  const completed = new Set(Array.isArray(savedProgress) ? savedProgress.filter(id => chapters.some(c => c.id === id)) : []);
  const savedAdvanced = storage.get('astro.advanced.completed', []);
  const advancedCompleted = new Set(Array.isArray(savedAdvanced) ? savedAdvanced.filter(id => worked.some(c => c.id === id)) : []);
  const t = (ja, en) => locale === 'ja' ? ja : en;
  const tr = pair => pair[locale === 'ja' ? 0 : 1];
  const pad = n => String(n).padStart(2, '0');
  const main = document.querySelector('#main');
  const chapterUrl = id => `#/chapter/${id}`;
  const advancedUrl = id => `#/advanced/${id}`;
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
    return `<section id="contents"><div class="section-heading"><div><div class="eyebrow">FOUNDATIONS / I</div><h2>${t('小さな式から、大きな宇宙へ。', 'Small equations. A vast universe.')}</h2><p>${t('入門編：高校数学の式変形でたどる宇宙。全16章を公開中。', 'Foundations: exploring the universe through school algebra. All 16 chapters are available.')}</p></div><span class="section-index">${chapters.length}</span></div><div class="chapter-tools"><label class="search"><span class="visually-hidden">${t('章を検索', 'Search chapters')}</span><input type="search" id="chapter-search" placeholder="${t('章を探す：光、電子、重力…', 'Find a chapter: light, electrons, gravity…')}" autocomplete="off"></label><span class="progress-caption">${completed.size} / ${chapters.length} ${t('章 読了', 'chapters complete')}</span></div><div class="chapter-list" id="chapter-results">${chapterRows()}</div></section>`;
  }

  function home(onlyContents = false) {
    document.title = onlyContents ? `${tr(series.volumes.foundations.title)} | ${tr(series.name)}` : tr(series.name);
    if (onlyContents) return `<div class="wrap" style="padding-top:48px">${contentsBlock()}${pathNote()}</div>`;
    return `<div class="wrap"><section class="hero"><div><div class="eyebrow">AN OPEN NOTEBOOK OF ASTROPHYSICS</div><h1>${t('理論天文学の<br><em>道具箱。</em>', 'Theoretical<br>Astrophysics,<br><em>Step by Step.</em>')}</h1><p class="intro">${t('高校数学の式変形から、微分方程式で解く標準問題へ。<br>星と原子、宇宙の膨張、平衡とその破れをつなぐ、<br>日本語・英語の天文学シリーズ。', 'From school algebra to classical problems with differential equations.<br>A Japanese–English series connecting atoms, stars, cosmic expansion,<br>and the physics of equilibrium and change.')}</p><div class="actions"><a class="button" href="${chapterUrl('tools')}">${t('入門編を読み始める', 'Start the foundations')} <span aria-hidden="true">↗</span></a><a class="text-link" href="#/advanced">${t('発展編を読む', 'Explore the advanced volume')}</a></div><div class="hero-note"><span>${t('高校数学から', 'Starts with school algebra')}</span><span>${t('入門から発展へ', 'Foundations to advanced topics')}</span><span>日本語 / English</span></div></div>${cosmicFigure()}</section>${volumeCards()}<a class="appendix-link" href="#/appendix/numbers"><div><span class="eyebrow">${t('番外編 · 数字と単位', 'SUPPLEMENT · NUMBERS & UNITS')}</span><h2>${tr(numbers.title)}</h2><p>${tr(numbers.desc)}</p></div><span aria-hidden="true">↗</span></a>
      <div class="principles"><div><b>01</b><div><strong>${t('直感をつかむ', 'Build intuition')}</strong><p>${t('身近な問いから始める。', 'Start with a concrete question.')}</p></div></div><div><b>02</b><div><strong>${t('一行ずつ、式をつなぐ', 'Follow every algebraic step')}</strong><p>${t('途中の変形を飛ばさない。', 'See the steps between formulas.')}</p></div></div><div><b>03</b><div><strong>${t('近似の意味までわかる', 'Understand the assumptions')}</strong><p>${t('どこまで言えるかを確かめる。', 'Know what a model can explain.')}</p></div></div></div>
      <section><div class="section-heading"><div><div class="eyebrow">TWO LIMITS, TWO STORIES</div><h2>${t('星の「限界」を、式で読む。', 'Two limits. Two physical stories.')}</h2><p>${t('この教材が目指す、二つの到達点。', 'Two destinations for your journey through the physics.')}</p></div></div><div class="feature-grid"><a class="feature" href="${chapterUrl('chandra')}"><span class="tag">QUANTUM PHYSICS × RELATIVITY</span><h3>${t('白色矮星は、どこまで重くなれる？', 'How massive can a white dwarf be?')}</h3><p>${t('電子の圧力と重力。半径が式から消えるとき、限界質量が現れる。', 'Balance electron pressure against gravity. When radius cancels, a limiting mass emerges.')}</p><div class="feature-math">M<sub>Ch</sub> ≈ 1.4 M<sub>☉</sub></div><div class="feature-foot"><span>${t('チャンドラセカール質量', 'The Chandrasekhar mass')}</span><span class="arrow">↗</span></div></a><a class="feature" href="${chapterUrl('eddington')}"><span class="tag">ELECTROMAGNETISM × GRAVITY</span><h3>${t('光は、星を吹き飛ばせる？', 'Can light push a star apart?')}</h3><p>${t('電子を押す光の力を数えて、重力とつり合う明るさを求める。', 'Count the momentum light transfers to electrons, then find where it balances gravity.')}</p><div class="feature-math">L<sub>Edd</sub> = 4πGMc / κ</div><div class="feature-foot"><span>${t('エディントン限界', 'The Eddington limit')}</span><span class="arrow">↗</span></div></a></div></section>
      ${contentsBlock()}${pathNote()}</div>`;
  }

  function volumeCards() {
    return `<div class="volume-grid" aria-label="${t('二冊の構成', 'The two volumes')}"><a class="volume-card" href="#/chapters"><div class="volume-top"><span>VOLUME I</span><span class="volume-state">${t('本文16章を公開中', '16 lessons available')}</span></div><h2>${tr(series.volumes.foundations.title)}</h2><h3>${tr(series.volumes.foundations.subtitle)}</h3><p>${t('光と距離、量子と放射、星の構造と限界、宇宙の膨張。微分方程式を使わず、一行ずつつなぐ。', 'Light and distance, quantum physics and radiation, stars and their limits, and cosmic expansion—one algebraic step at a time.')}</p><span class="volume-link">${t('入門編の目次へ', 'Open the foundations')} ↗</span></a><a class="volume-card volume-advanced" href="#/advanced"><div class="volume-top"><span>VOLUME II</span><span class="volume-state">${t('本文8章を公開中', '8 worked chapters available')}</span></div><h2>${tr(series.volumes.advanced.title)}</h2><h3>${tr(series.volumes.advanced.subtitle)}</h3><p>${t('Lane–Emden、重力崩壊、星団の緩和、回転楕円体、α円盤とToomre Q。方程式で学ぶための道すじ。', 'Lane–Emden, collapse, cluster relaxation, rotating ellipsoids, alpha disks, and Toomre Q—a path toward learning through equations.')}</p><span class="volume-link">${t('本文と学習ガイドを見る', 'View chapters and learning guide')} ↗</span></a></div>`;
  }

  function advanced() {
    document.title = `${tr(series.volumes.advanced.title)} — ${t('本文と学習ガイド', 'Chapters and learning guide')} | ${tr(series.name)}`;
    const topicCount = series.groups.reduce((sum, group) => sum + group.topics.length, 0);
    return `<article class="advanced-volume wrap"><header class="advanced-head"><div class="eyebrow">VOLUME II / ADVANCED</div><h1>${tr(series.volumes.advanced.title)}</h1><p class="advanced-subtitle">${tr(series.volumes.advanced.subtitle)}</p><span class="volume-state">${t('本文8章・学習ガイド', '8 WORKED CHAPTERS & LEARNING GUIDE')}</span><p>${t('入門編で見積もった現象を、微分方程式でさらに深く調べる姉妹編です。', 'A companion volume using differential equations to explore phenomena introduced in the foundations.')}</p><div class="callout"><strong>${t('このページで読めるもの', 'WHAT IS AVAILABLE HERE')}</strong>${t(`${series.groups.length}分野・${topicCount}題材のうち、${worked.length}章の本文を公開中です。Lane–Emden、RT・KH不安定性、Sedov–Taylorと衝撃波条件、粒子加速、シンクロトロン放射、SZ効果、角運動量輸送を日英で読めます。残りは構成案です。各項目に公開状況を表示しています。`, `${worked.length} worked chapters are available among ${topicCount} topics in ${series.groups.length} areas: Lane–Emden, RT and KH instabilities, Sedov–Taylor with shock jumps, particle acceleration, synchrotron radiation, the SZ effect, and angular-momentum transport. The remaining entries are planned topics, with publication status shown for each.`)}</div></header>
      <section class="available-lessons"><div class="section-heading"><div><div class="eyebrow">READ NOW</div><h2>${t('公開中の本文', 'Available chapters')}</h2><p>${t('発展編の読了：', 'Advanced progress: ')}${advancedCompleted.size} / ${worked.length}</p></div></div>${worked.map((c, i) => `<a class="chapter-row" href="${advancedUrl(c.id)}"><span class="number">${pad(i + 1)}</span><div><h3>${tr(c.title)}</h3><p>${tr(c.desc)}</p></div><span class="meta">${c.minutes}${t('分', ' min')}</span><span>${advancedCompleted.has(c.id) ? '✓' : '↗'}</span></a>`).join('')}</section>
      <div class="advanced-method"><div><b>01</b><strong>${t('現象をつかむ', 'Understand the phenomenon')}</strong><p>${t('図、保存則、次元解析で見通す。', 'Use diagrams, conservation, and dimensions.')}</p></div><div><b>02</b><strong>${t('方程式を作る', 'Formulate the equations')}</strong><p>${t('仮定、無次元化、境界条件を追う。', 'Track assumptions, scaling, and boundaries.')}</p></div><div><b>03</b><strong>${t('解いて確かめる', 'Solve and check')}</strong><p>${t('解析解と数値解で、適用範囲を調べる。', 'Explore solutions and their limits.')}</p></div></div>
      <section class="advanced-prep"><h2>${t('準備する数学', 'Mathematical preparation')}</h2><p>${t('微分・積分、常微分方程式の初歩、ベクトルと行列。偏微分方程式は保存則との関係から読み、線形化、無次元化、相似変換を順に導入する構成です。', 'Calculus, introductory ordinary differential equations, vectors, and matrices. The planned treatment introduces partial differential equations through conservation laws, followed by linearization, nondimensionalization, and similarity transformations.')}</p><p>${t('まず入門編のビリアル定理・星の構造・宇宙膨張を読むと、物理の見通しをつかみやすくなります。', 'The foundational chapters on the virial theorem, stellar structure, and cosmic expansion provide useful physical context.')}</p></section>
      ${series.groups.map((group, i) => `<section class="syllabus-group"><div class="section-heading"><div><div class="eyebrow">AREA ${pad(i + 1)}</div><h2>${tr(group.title)}</h2><p>${tr(group.intro)}</p></div></div><p class="syllabus-bridge"><a href="${chapterUrl(group.bridge)}">${t('つながる入門章：', 'Connect to foundations: ')}${tr(chapters.find(chapter => chapter.id === group.bridge).title)} ↗</a></p>${group.topics.map((topic, j) => `<details class="syllabus-topic" ${i === 0 && j === 0 ? 'open' : ''}><summary><span>${pad(i + 1)}.${j + 1}</span>${tr(topic.title)} <small class="topic-status">${worked.some(c => c.id === topic.id) ? t('本文公開', 'Available') : t('準備中', 'Planned')}</small></summary><div class="topic-body"><strong>${t('物理の問い', 'PHYSICAL QUESTION')}</strong><p>${tr(topic.question)}</p><strong>${t('数学の道すじ', 'MATHEMATICAL APPROACH')}</strong><p>${tr(topic.method)}</p>${worked.some(c => c.id === topic.id) ? `<p><a class="button" href="${advancedUrl(topic.id)}">${t('本文を読む', 'Read the chapter')} →</a></p>` : ''}<a href="${topic.reference[1]}" target="_blank" rel="noopener noreferrer">${t('参考：', 'Reference: ')}${topic.reference[0]} ↗</a></div></details>`).join('')}</section>`).join('')}
      <aside class="path-note"><div><h3>${t('式の意味をつかんでから、解の形へ。', 'From physical meaning to the shape of a solution.')}</h3><p>${t('入門編の本文は今すぐ読み進められます。発展編の問いと照らし合わせながら、必要な道具をそろえていきましょう。', 'The foundation lessons are ready to read. Use the advanced questions to identify the tools you want to learn next.')}</p><a class="text-link" href="#/chapters">${t('入門編の目次へ', 'Open the foundations')} →</a></div></aside></article>`;
  }

  function pathNote() {
    return `<aside class="path-note"><div class="orb" aria-hidden="true">✳</div><div><h3>${t('数式は、宇宙を見るためのもう一つの望遠鏡。', 'An equation is another kind of telescope.')}</h3><p>${t('公式そのものの導出が難しいところは、出発点として明示します。わかる部分をつなぎ、次の学びへ。', 'When a law needs more advanced mathematics, we name it as an input. Connect what you can follow, then take the next step.')}</p></div></aside>`;
  }

  function lesson(c) {
    const i = chapters.indexOf(c);
    document.title = `${tr(c.title)} | ${t('理論天文学の道具箱', 'Theoretical Astrophysics, Step by Step')}`;
    return `<div class="lesson-layout"><aside class="sidebar"><a class="back" href="#/chapters">← ${t('入門編の目次', 'Foundations contents')}</a><div class="side-title">${t('学びの道すじ', 'THE LEARNING PATH')}</div><nav class="side-links" aria-label="${t('章の目次', 'Chapter navigation')}">${chapters.map((other, n) => `<a href="${chapterUrl(other.id)}" ${other.id === c.id ? 'aria-current="page"' : ''}><span>${pad(n)}</span>${tr(other.title)}</a>`).join('')}</nav></aside><article class="lesson"><header class="lesson-head"><div class="eyebrow">FOUNDATIONS · ${pad(i)} / ${tr(parts[c.part]).split(' — ')[0]}</div><h1>${tr(c.title)}</h1><p class="dek">${tr(c.desc)}</p><div class="lesson-meta"><span>${t('読む目安：', 'Reading time: ')}${c.minutes}${t('分', ' min')}</span><span>${t('使う道具：', 'Tools: ')}${tr(c.prereq)}</span></div></header><div class="goal"><strong>${t('この章でできるようになること', 'WHAT YOU WILL LEARN')}</strong>${tr(c.goal)}</div>
      ${window.AstroContent.renderBody(c.id, locale)}
      <aside class="quiz"><div class="eyebrow">CHECK YOUR UNDERSTANDING</div><h2>${t('自分の言葉で、確かめよう。', 'Pause and work it out.')}</h2><p>${tr(c.question)}</p><details><summary>${t('答えと考え方を見る', 'Show the answer and reasoning')}</summary><p>${tr(c.answer)}</p></details></aside>
      <div class="sources"><strong>${t('参考資料・出発点にした法則', 'REFERENCES & PHYSICAL INPUTS')}</strong><p>${t('以下は原理や数値を確認できる資料です。大学レベルの数式を含むものもあります。本文の説明と式変形は、この教材向けに構成しています。', 'These sources support the laws and numerical values; some use university-level mathematics. The explanations and algebra here are written for this guide.')}</p><ul>${c.refs.map(id => `<li><a href="${sources[id][1]}" target="_blank" rel="noopener noreferrer">${sources[id][0]} ↗</a></li>`).join('')}</ul></div>
      <div class="lesson-bottom"><button class="complete-button" id="complete-chapter" data-id="${c.id}" aria-pressed="${completed.has(c.id)}">${completeLabel(c.id)}</button><div class="prev-next">${i > 0 ? `<a href="${chapterUrl(chapters[i - 1].id)}"><small>← ${t('前の章', 'Previous')}</small>${tr(chapters[i - 1].title)}</a>` : ''}${i < chapters.length - 1 ? `<a href="${chapterUrl(chapters[i + 1].id)}"><small>${t('次の章', 'Next')} →</small>${tr(chapters[i + 1].title)}</a>` : `<a href="#/chapters"><small>${t('目次へ', 'Back to contents')} →</small>${t('学びの道すじを振り返る', 'Revisit the learning path')}</a>`}</div></div></article></div>`;
  }

  function advancedLesson(c) {
    const i = worked.indexOf(c);
    document.title = `${tr(c.title)} | ${tr(series.name)}`;
    return `<div class="lesson-layout"><aside class="sidebar"><a class="back" href="#/advanced">← ${t('発展編の目次', 'Advanced contents')}</a><div class="side-title">${t('公開中の章', 'AVAILABLE CHAPTERS')}</div><nav class="side-links" aria-label="${t('発展編の章', 'Advanced chapters')}">${worked.map((other, n) => `<a href="${advancedUrl(other.id)}" ${other.id === c.id ? 'aria-current="page"' : ''}><span>${pad(n + 1)}</span>${tr(other.title)}</a>`).join('')}</nav></aside><article class="lesson"><header class="lesson-head"><div class="eyebrow">ADVANCED · ${pad(i + 1)}</div><h1>${tr(c.title)}</h1><p class="dek">${tr(c.desc)}</p><div class="lesson-meta"><span>${t('読む目安：', 'Reading time: ')}${c.minutes}${t('分', ' min')}</span><span>${t('使う道具：', 'Tools: ')}${tr(c.prereq)}</span></div></header><div class="goal"><strong>${t('この章でできるようになること', 'WHAT YOU WILL LEARN')}</strong>${tr(c.goal)}</div><p class="foundation-bridge"><a href="${chapterUrl(c.bridge)}">${t('つながる入門章：', 'Connect to foundations: ')}${tr(chapters.find(item => item.id === c.bridge).title)} ↗</a></p>
      ${advancedContent.renderBody(c.id, locale)}
      <aside class="quiz"><div class="eyebrow">CHECK YOUR UNDERSTANDING</div><h2>${t('式を使って、確かめよう。', 'Pause and work it out.')}</h2><p>${tr(c.question)}</p><details><summary>${t('答えと考え方を見る', 'Show the answer and reasoning')}</summary><p>${tr(c.answer)}</p></details></aside>
      <div class="sources"><strong>${t('参考資料・出発点にした法則', 'REFERENCES & PHYSICAL INPUTS')}</strong><p>${t('本文はこの教材向けの説明・導出です。参考資料とは記号や規格化が異なる場合があります。操作パネルの解法と近似は本文に明記しています。', 'Explanations and derivations are written for this guide. References may use different notation or normalization. Panel methods and approximations are stated in the text.')}</p><ul>${c.refs.map(id => `<li><a href="${advancedContent.sources[id][1]}" target="_blank" rel="noopener noreferrer">${advancedContent.sources[id][0]} ↗</a></li>`).join('')}</ul></div>
      <div class="lesson-bottom"><button class="complete-button" id="complete-chapter" data-volume="advanced" data-id="${c.id}" aria-pressed="${advancedCompleted.has(c.id)}">${completeLabel(c.id, advancedCompleted)}</button><p class="advanced-progress">${t('発展編の読了：', 'Advanced progress: ')}${advancedCompleted.size} / ${worked.length}</p><div class="prev-next">${i > 0 ? `<a href="${advancedUrl(worked[i - 1].id)}"><small>← ${t('前の章', 'Previous')}</small>${tr(worked[i - 1].title)}</a>` : ''}${i < worked.length - 1 ? `<a href="${advancedUrl(worked[i + 1].id)}"><small>${t('次の章', 'Next')} →</small>${tr(worked[i + 1].title)}</a>` : `<a href="#/advanced"><small>${t('目次へ', 'Back to contents')} →</small>${t('次の学習テーマを選ぶ', 'Choose your next topic')}</a>`}</div></div></article></div>`;
  }

  function completeLabel(id, progress = completed) {
    return progress.has(id) ? t('✓ 読了済み — もう一度押すと解除', '✓ Completed — click again to undo') : t('この章を読了にする', 'Mark this chapter complete');
  }

  function numberAppendix() {
    document.title = `${tr(numbers.title)} | ${tr(series.name)}`;
    return `<div class="lesson-layout"><aside class="sidebar"><a class="back" href="#/">← ${t('ホームへ', 'Home')}</a><div class="side-title">${t('関連する章', 'RELATED CHAPTERS')}</div><nav class="side-links" aria-label="${t('関連する章', 'Related chapters')}">${['tools','distance','atom','scattering','expansion'].map(id => `<a href="${chapterUrl(id)}">${tr(chapters.find(c => c.id === id).title)}</a>`).join('')}</nav></aside><article class="lesson numbers-reference"><header class="lesson-head"><div class="eyebrow">${t('番外編 / NUMBERS & UNITS', 'SUPPLEMENT / NUMBERS & UNITS')}</div><h1>${tr(numbers.title)}</h1><p class="dek">${tr(numbers.desc)}</p></header>${numbers.renderBody(locale)}<div class="sources"><strong>${t('参考資料と数値の出典', 'REFERENCES & NUMERICAL SOURCES')}</strong><p>${t('基本定数の数値はCODATA 2022を使用。単位系の説明にはNRAO、定義と公称値にはIAUを参照しています。H₀＝70は換算例です。', 'Fundamental values use CODATA 2022. Unit conventions follow NRAO; definitions and nominal scales follow IAU. H₀ = 70 is illustrative.')}</p><ul>${numbers.refs.map(([label,url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a></li>`).join('')}</ul></div><div class="lesson-bottom"><a class="button" href="#/chapters">${t('入門編の目次へ', 'Foundations contents')} →</a></div></article></div>`;
  }

  function about() {
    document.title = `${t('この教材について', 'About this series')} | ${tr(series.name)}`;
    return `<article class="about"><div class="eyebrow">ABOUT THE SERIES</div><h1>${tr(series.name)}</h1><p>${t('理論天文学の道具箱は、宇宙物理を学ぶための共通言語を、日本語と英語で身につける教材シリーズです。高校数学の式変形でたどる入門編と、微分方程式を使う発展編の二冊で構成します。', 'Theoretical Astrophysics, Step by Step is a Japanese–English series for learning the shared tools of astrophysics. It pairs foundations through school algebra with an advanced volume using differential equations.')}</p>
      ${volumeCards()}
      <h2>${t('入門編：高校数学の式変形でたどる宇宙', 'Foundations: exploring the universe through school algebra')}</h2><p>${t('全16章の本文、確認問題、参考資料、四つの操作パネルを公開しています。微分方程式は解きません。エントロピー極大化の任意の発展欄では微分を使います。量子力学・一般相対論から借りる法則と、式変形で追える部分を区別します。', 'All 16 lessons, questions, references, and four interactive panels are available. No differential equations are solved. The optional entropy-maximization extension uses derivatives. Supplied laws from quantum mechanics and relativity are distinguished from the algebra developed here.')}</p>
      <h2>${t('発展編：平衡・不安定性・輸送・相似解', 'Advanced: equilibrium, instability, transport, and similarity solutions')}</h2><p>${t('本文8章と、全26題材の学習ガイドを公開しています。Lane–Emden、RT・KH、Sedov–TaylorとRankine–Hugoniot条件、粒子加速、シンクロトロン放射、SZ効果、角運動量輸送を扱います。他の18題材は構成案です。', 'Eight worked chapters are available within a 26-topic learning guide: Lane–Emden, RT and KH, Sedov–Taylor with Rankine–Hugoniot jumps, shock acceleration, synchrotron radiation, the SZ effect, and angular-momentum transport. The other 18 topics remain planned.')}</p>
      <h2>${t('番外編：宇宙物理の数字と単位', 'Supplement: numbers and units')}</h2><p>${t('pc、h・ℏ、電子の静止質量、太陽質量、H₀、微細構造定数、Gとcを参照できる番外編を用意しました。SIとCGS–Gauss系の対応を、数値と式の両方で確認できます。', 'The supplement covers pc, h and ℏ, electron rest mass, solar mass, H₀, the fine-structure constant, G, and c. Compare values and equations in SI and Gaussian CGS.')} <a href="#/appendix/numbers">${t('数字と単位を開く', 'Open numbers and units')} ↗</a></p>
      <h2>${t('この教材の約束', 'Teaching principles')}</h2><ul><li>${t('主役は天体現象です。状態方程式・不透明度・再結合係数などは意味と適用条件を示して使い、物性の微視的導出を独立の主題にはしません。', 'Astrophysical phenomena are the focus. Equations of state, opacities, and recombination coefficients are used with their meaning and validity stated; microscopic material-property derivations are not a separate theme.')}</li><li>${t('直感、仮定、式変形、確認問題をつなぎます。', 'Connect intuition, assumptions, algebra, and questions.')}</li><li>${t('近似、厳密な結果、既知の係数を区別し、適用条件を添えます。', 'Distinguish estimates, exact results, and supplied coefficients, stating their conditions.')}</li><li>${t('発展編は「現象をつかむ・方程式を作る・解いて確かめる」の三段階で組み立てます。', 'Build advanced chapters in three stages: understand the phenomenon, formulate the equations, and solve and check.')}</li></ul>
      <h2>${t('二つの言語で、同じ場所を', 'The same place in two languages')}</h2><p>${t('日本語／ENの切り替えでは現在の章や開いた構成案を保ちます。言語と各編の読了記録はブラウザだけに保存します。発展編の本文8章は入門編と別に記録し、準備中の題材は含めません。', 'Language switching keeps the current chapter and expanded syllabus entries. Language and completion records stay in your browser. The eight advanced chapters have separate progress from the foundations; planned topics do not count.')}</p>
      <p><a class="button" href="#/chapters">${t('入門編の目次へ', 'Open the foundations')} ↗</a></p></article>`;
  }

  function render({ preserveScroll = false } = {}) {
    const scrollY = window.scrollY;
    document.documentElement.lang = locale;
    document.querySelector('#brand-name').innerHTML = `${t('理論天文学の道具箱', 'Theoretical Astrophysics, Step by Step')}<small>${t('THEORETICAL ASTROPHYSICS, STEP BY STEP', 'FOUNDATIONS & ADVANCED')}</small>`;
    document.querySelector('#nav-chapters').textContent = t('入門編', 'Foundations');
    document.querySelector('#nav-advanced').textContent = t('発展編', 'Advanced');
    document.querySelector('#nav-numbers').textContent = t('番外編', 'Numbers');
    document.querySelector('#nav-about').textContent = t('この教材について', 'About');
    document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === locale)));
    const route = location.hash.replace(/^#/, '') || '/';
    let c;
    if (route === '/') main.innerHTML = home();
    else if (route === '/chapters') main.innerHTML = home(true);
    else if (route === '/advanced') main.innerHTML = advanced();
    else if (route.startsWith('/advanced/') && (c = worked.find(item => route === `/advanced/${item.id}`))) main.innerHTML = advancedLesson(c);
    else if (route === '/about') main.innerHTML = about();
    else if (route === '/appendix/numbers') main.innerHTML = numberAppendix();
    else if (route.startsWith('/chapter/') && (c = chapters.find(item => route === `/chapter/${item.id}`))) main.innerHTML = lesson(c);
    else {
      document.title = t('章が見つかりません | 天文学', 'Chapter not found | Astronomy');
      main.innerHTML = `<div class="about"><h1>${t('章が見つかりませんでした。', 'Chapter not found.')}</h1><p><a href="#/chapters">${t('目次へ戻る', 'Back to chapters')} →</a></p></div>`;
    }
    document.querySelector('#footer').innerHTML = `<span>${t('理論天文学の道具箱', 'Theoretical Astrophysics, Step by Step')}<br>${t('宇宙を理解するための共通言語。', 'A shared language for understanding the universe.')}</span><span>${t('入門編・発展編 / 日本語・English', 'Foundations & advanced / Japanese & English')}<br><a href="#/about">${t('教材の方針と参考資料について', 'Teaching principles & references')} ↗</a></span>`;
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
      if (['number-converter', 'hubble-units'].includes(el.dataset.lab)) numbers.mount(el, locale);
      if (['lane-emden', 'sedov', 'acceleration', 'synchrotron', 'rayleigh-taylor', 'kelvin-helmholtz', 'sunyaev-zeldovich', 'angular-momentum'].includes(el.dataset.lab)) window.AstroAdvancedLabs.mount(el, locale);
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
      const progress = complete.dataset.volume === 'advanced' ? advancedCompleted : completed;
      if (progress.has(id)) progress.delete(id); else progress.add(id);
      storage.set(complete.dataset.volume === 'advanced' ? 'astro.advanced.completed' : 'astro.completed', [...progress]);
      complete.textContent = completeLabel(id, progress);
      complete.setAttribute('aria-pressed', String(progress.has(id)));
      const advancedProgress = document.querySelector('.advanced-progress');
      if (advancedProgress) advancedProgress.textContent = `${t('発展編の読了：', 'Advanced progress: ')}${advancedCompleted.size} / ${worked.length}`;
    }
  });
  document.addEventListener('input', event => {
    if (event.target.id === 'chapter-search') document.querySelector('#chapter-results').innerHTML = chapterRows(event.target.value);
  });
  window.addEventListener('hashchange', () => { render(); main.focus({ preventScroll: true }); });
  render();
})();
