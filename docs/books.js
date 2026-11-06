/* A bilingual reading guide; topic connections are this site's suggested routes. */
(() => {
  'use strict';
  const title = ['教科書・総説集ガイド', 'Textbooks & review volumes'];
  const desc = ['この教材の先へ。知りたい現象から、標準書の必要なところへ進む。', 'Beyond this guide: follow a physical question into the relevant parts of a standard reference.'];
  const books = [
    {
      id: 'galactic-dynamics', kind: 'textbook', title: 'Galactic Dynamics',
      authors: 'James Binney & Scott Tremaine', publisher: 'Princeton University Press',
      edition: ['第2版', 'Second edition'], subject: ['銀河・星団の力学', 'Galaxies & stellar systems'],
      url: 'https://press.princeton.edu/books/paperback/9780691130279/galactic-dynamics',
      learn: ['恒星の軌道、重力ポテンシャル、平衡と安定性、重力遭遇を、銀河や星団の構造と結びつける標準書。', 'Connect stellar orbits, gravitational potentials, equilibrium, stability and encounters to the structure of galaxies and star clusters.'],
      prep: ['力学、ベクトル解析、常微分方程式、分布関数と確率。', 'Mechanics, vector calculus, ordinary differential equations, distribution functions and probability.'],
      route: ['まずビリアル定理から重力平衡へ。星団に興味があれば、2体緩和と分布関数の進化を調べる。', 'Start with virial balance and gravitational equilibrium; for star clusters, follow encounters into relaxation and distribution-function evolution.'],
      related: ['chapter/virial', 'advanced/ellipsoids', 'advanced/tensor-virial', 'advanced/relaxation', 'advanced/fokker-planck']
    },
    {
      id: 'radiative-processes', kind: 'textbook', title: 'Radiative Processes in Astrophysics',
      authors: 'George B. Rybicki & Alan P. Lightman', publisher: 'Wiley',
      edition: ['Rybicki–Lightmanの原著', 'Original Rybicki–Lightman text'], subject: ['放射と光の輸送', 'Radiation & transfer'],
      url: 'https://www.wiley.com/en-us/radiative-processes-in-astrophysics-p-9783527414499',
      learn: ['放射輸送からシンクロトロン放射、Compton散乱、原子の放射過程へ。光を作る仕組みと、観測するスペクトルをつなぐ。', 'Follow radiative transfer into synchrotron emission, Compton scattering and atomic radiation, connecting emission mechanisms to observed spectra.'],
      prep: ['電磁気学、特殊相対論、統計力学、量子力学の基礎、微積分。', 'Electromagnetism, special relativity, basic statistical and quantum mechanics, and calculus.'],
      route: ['入門編の黒体放射とトムソン散乱を足場に、発展編のシンクロトロン放射とSZ効果で必要になる式へ進む。', 'Use blackbody radiation and Thomson scattering as a starting point, then investigate the formulas behind synchrotron emission and the SZ effect.'],
      related: ['chapter/scattering', 'chapter/thermal', 'chapter/planck', 'advanced/synchrotron', 'advanced/sunyaev-zeldovich']
    },
    {
      id: 'radiation-hydrodynamics', kind: 'textbook', title: 'Foundations of Radiation Hydrodynamics',
      authors: 'Dimitri Mihalas & Barbara Weibel-Mihalas', publisher: 'Dover Publications',
      edition: ['原著1984年・Dover再刊／発展的な専門書', 'Originally published in 1984; Dover reprint / advanced reference'], subject: ['放射と流体の保存則', 'Radiation & fluid conservation laws'],
      url: 'https://store.doverpublications.com/products/9780486135885',
      learn: ['流体の質量・運動量・エネルギーの保存則と、放射輸送を同じ枠組みで扱う。光がガスを押し、エネルギーを運ぶとき、流体の式がどう変わるかを学ぶ。', 'Bring fluid mass, momentum and energy conservation together with radiative transfer. Explore how the fluid equations change when radiation exerts forces and transports energy.'],
      prep: ['流体力学、熱力学、放射輸送、偏微分方程式、相対論の基礎。', 'Fluid mechanics, thermodynamics, radiative transfer, partial differential equations and introductory relativity.'],
      route: ['まず通常の流体の保存則を確認し、放射のエネルギー流束と放射圧を加える過程へ進む。平均自由行程・拡散・エディントン限界を足場に、必要な節を参照する発展的な一冊。', 'Review ordinary fluid conservation, then add radiation energy flux and pressure. Use mean free paths, diffusion and the Eddington limit as starting points for consulting this advanced reference.'],
      related: ['chapter/thermal', 'chapter/planck', 'chapter/structure', 'chapter/eddington', 'advanced/sedov']
    },
    {
      id: 'stellar-structure', kind: 'textbook', title: 'Stellar Structure and Evolution',
      authors: 'Rudolf Kippenhahn, Alfred Weigert & Achim Weiss', publisher: 'Springer',
      edition: ['第2版（2012）', 'Second edition (2012)'], subject: ['恒星の構造と進化', 'Stellar structure & evolution'],
      url: 'https://link.springer.com/book/10.1007/978-3-642-30304-3',
      learn: ['静水圧平衡、エネルギー生成、放射輸送と対流を組み合わせ、星の内部構造とH–R図上の進化を学ぶ。恒星を一つの塊で見積もる段階から、内部を解く段階への橋渡しになる。', 'Combine hydrostatic balance, energy generation, radiative transport and convection to study stellar interiors and evolution on the H–R diagram, moving from global estimates to structure calculations.'],
      prep: ['熱力学、微積分と常微分方程式、放射と理想気体の基礎。', 'Thermodynamics, calculus and ordinary differential equations, and basic radiation and ideal-gas physics.'],
      route: ['入門編のビリアル定理と質量–光度関係から、恒星構造の方程式へ。Lane–Emdenと林トラックを読んだ後に、対流・前主系列・主系列のつながりを調べる。', 'Move from virial balance and mass–luminosity scaling to the stellar structure equations. After Lane–Emden and Hayashi tracks, explore convection and the connection between pre-main-sequence and main-sequence evolution.'],
      related: ['chapter/virial', 'chapter/structure', 'chapter/sun', 'advanced/lane-emden', 'advanced/hayashi']
    },
    {
      id: 'physical-cosmology', kind: 'textbook', title: 'Principles of Physical Cosmology',
      authors: 'P. J. E. Peebles', publisher: 'Princeton University Press',
      edition: ['宇宙論の基礎を広く学ぶ', 'A broad foundation in physical cosmology'], subject: ['膨張宇宙と観測', 'Expansion & cosmological observations'],
      url: 'https://press.princeton.edu/books/paperback/9780691209814/principles-of-physical-cosmology',
      learn: ['宇宙膨張、時空の幾何、宇宙論的な観測の意味、銀河や大規模構造の起源を、一つの物理として学ぶ。', 'Study cosmic expansion, spacetime geometry, cosmological observations and the origin of galaxies and large-scale structure in a unified physical framework.'],
      prep: ['微積分、力学、熱・統計力学、相対論の基礎。', 'Calculus, mechanics, thermodynamics and statistical mechanics, and introductory relativity.'],
      route: ['まず赤方偏移・距離・膨張率の区別を固める。構造形成に集中したいときは、次のPeeblesの専門書へつなぐ。', 'First distinguish redshift, distance and expansion rate. For a focused study of structure formation, continue with the next Peebles volume.'],
      related: ['chapter/expansion', 'chapter/relativity', 'chapter/elements', 'advanced/press-schechter']
    },
    {
      id: 'large-scale-structure', kind: 'textbook', title: 'The Large-Scale Structure of the Universe',
      authors: 'P. J. E. Peebles', publisher: 'Princeton University Press',
      edition: ['構造形成を深める古典', 'A classic focused on structure formation'], subject: ['密度ゆらぎと構造形成', 'Fluctuations & structure formation'],
      url: 'https://press.princeton.edu/books/paperback/9780691209838/the-large-scale-structure-of-the-universe',
      learn: ['膨張する宇宙で密度ゆらぎが育つ力学と、その空間分布を記述する統計を学ぶ。宇宙論全体を扱う前の本とは、読む目的を分ける。', 'Explore the gravitational growth and spatial statistics of fluctuations in an expanding universe, as a focused companion to the broader cosmology text.'],
      prep: ['流体力学、微分方程式、Fourier解析、確率・統計。', 'Fluid mechanics, differential equations, Fourier analysis, probability and statistics.'],
      route: ['Jeans解析と宇宙膨張の関係を確認してから、線形成長、Zel’dovich近似、ハローの統計へ。古典的理論と最新の観測値は区別して読む。', 'Connect Jeans analysis to expansion, then study linear growth, Zel’dovich dynamics and halo statistics. Distinguish classical theory from current observational parameters.'],
      related: ['chapter/expansion', 'advanced/jeans', 'advanced/zeldovich', 'advanced/press-schechter']
    },
    {
      id: 'compact-objects', kind: 'textbook', title: 'Black Holes, White Dwarfs, and Neutron Stars',
      subtitle: 'The Physics of Compact Objects', authors: 'Stuart L. Shapiro & Saul A. Teukolsky', publisher: 'Wiley',
      edition: ['コンパクト天体の物理', 'The physics of compact objects'], subject: ['白色矮星・中性子星・ブラックホール', 'White dwarfs, neutron stars & black holes'],
      url: 'https://onlinelibrary.wiley.com/doi/book/10.1002/9783527617661',
      learn: ['縮退した星の構造、相対論的な重力平衡、ブラックホールと降着をつなぐ。チャンドラセカール質量から先へ進むための標準書。', 'Connect degenerate stellar structure, relativistic gravitational equilibrium, black holes and accretion, continuing beyond the Chandrasekhar mass.'],
      prep: ['微積分、恒星構造、統計力学、特殊・一般相対論。', 'Calculus, stellar structure, statistical mechanics, and special and general relativity.'],
      route: ['白色矮星とLane–Emdenから入り、相対論的な平衡へ進む。物性の詳しい章は、扱う天体に必要な部分から参照する。', 'Start with white dwarfs and Lane–Emden structure, then move to relativistic equilibrium. Consult detailed material physics as needed for the object under study.'],
      related: ['chapter/chandra', 'chapter/relativity', 'advanced/lane-emden', 'advanced/bondi', 'advanced/goldreich-julian']
    },
    {
      id: 'hydrodynamic-stability', kind: 'textbook', title: 'Hydrodynamic and Hydromagnetic Stability',
      authors: 'S. Chandrasekhar', publisher: 'Dover Publications',
      edition: ['流体・磁気流体の安定性の古典', 'A classic on fluid and magnetic stability'], subject: ['流体の平衡と不安定性', 'Fluid equilibrium & instability'],
      url: 'https://store.doverpublications.com/products/9780486640716',
      learn: ['平衡からの小さなずれを線形化し、境界条件と固有値から安定性を判断する方法を学ぶ。回転や磁場が入ると何が変わるかも調べる。', 'Learn how linearized disturbances, boundary conditions and eigenvalues determine stability, including the effects of rotation and magnetic fields.'],
      prep: ['流体力学、偏微分方程式、線形代数、固有値問題。', 'Fluid mechanics, partial differential equations, linear algebra and eigenvalue problems.'],
      route: ['RT・KHの単純な境界問題を足場に、仮定と境界条件を追って読む。降着円盤のMRIへの応用は、本サイトのMRI章とそこで挙げた論文を併読する。', 'Start from the simple RT and KH interface problems and track assumptions and boundary conditions. For accretion-disk MRI, also use this site’s MRI chapter and its cited papers.'],
      related: ['advanced/rayleigh-taylor', 'advanced/kelvin-helmholtz', 'advanced/mri']
    },
    {
      id: 'protostars-planets-iii', kind: 'reviews', title: 'Protostars and Planets III',
      authors: 'Eugene H. Levy & Jonathan I. Lunine', publisher: 'University of Arizona Press',
      edition: ['PP III · 1993年の総説集', 'PP III · 1993 review volume'], subject: ['星形成・原始惑星系円盤', 'Star formation & protoplanetary disks'],
      url: 'https://uapress.arizona.edu/book/protostars-and-planets-iii',
      openUrl: 'https://open.uapress.arizona.edu/projects/protostars-and-planets-iii',
      learn: ['雲の崩壊から原始星、若い星の円盤、惑星系の形成へ。各分野の専門家による総説を、共通する天体形成の問題として読める。', 'Follow cloud collapse into protostars, young stellar disks and planetary systems through specialist reviews of connected formation problems.'],
      prep: ['星形成・降着円盤の基礎。必要な数学や前提は総説ごとに異なる。', 'Basic star formation and accretion disks; mathematical prerequisites vary between reviews.'],
      route: ['まず雲の崩壊・円盤の形成と進化に関する総説を選ぶ。1993年の到達点をまとめた本なので、現在の観測や研究の状況は後続のPPシリーズや新しい論文と併読する。', 'Begin with a review on collapse or disk formation and evolution. The volume captures the field in 1993; use later PP volumes and recent papers for current observations and research.'],
      related: ['advanced/bonnor-ebert', 'advanced/hayashi', 'advanced/isothermal-collapse', 'advanced/angular-momentum', 'advanced/alpha-disk', 'advanced/toomre-q']
    }
  ];
  function renderBody(locale) {
    const t = (ja, en) => locale === 'ja' ? ja : en;
    const tr = pair => pair[locale === 'ja' ? 0 : 1];
    const textbooks = books.filter(book => book.kind === 'textbook');
    const reviews = books.filter(book => book.kind === 'reviews');
    const chapterLink = route => {
      const [volume, id] = route.split('/');
      const chapter = (volume === 'chapter' ? window.AstroContent : window.AstroAdvanced).chapters.find(c => c.id === id);
      return `<a href="#/${route}">${tr(chapter.title)}</a>`;
    };
    const card = (book, index) => `<article class="book-card" id="${book.id}"><header><div class="book-subject"><span>${String(index + 1).padStart(2, '0')}</span>${tr(book.subject)}</div><h3 lang="en">${book.title}</h3>${book.subtitle ? `<p class="book-subtitle" lang="en">${book.subtitle}</p>` : ''}<p class="book-authors">${book.authors}${book.kind === 'reviews' ? t(' 編', ' (editors)') : ''}</p><p class="book-edition">${book.publisher} · ${tr(book.edition)}</p></header><p>${tr(book.learn)}</p><dl><dt>${t('予備知識', 'Preparation')}</dt><dd>${tr(book.prep)}</dd><dt>${t('このサイトからの読み方', 'Our suggested route')}</dt><dd>${tr(book.route)}</dd></dl><div class="book-connections"><h4>${t('つながる章', 'Connect to these chapters')}</h4><div>${book.related.map(chapterLink).join('')}</div></div><div class="book-links"><a href="${book.url}" target="_blank" rel="noopener noreferrer">${t('出版社の書籍情報', 'Publisher’s book information')} ↗</a>${book.openUrl ? `<a class="book-open" href="${book.openUrl}" target="_blank" rel="noopener noreferrer">${t('出版社の無料公開版', 'Publisher’s open-access edition')} ↗</a>` : ''}</div></article>`;
    return `<div class="wrap reading-guide"><header class="reading-head"><div class="eyebrow">READING GUIDE</div><h1>${tr(title)}</h1><p class="dek">${tr(desc)}</p><p>${t('ここに挙げる本は、主に大学上級から大学院で使う標準書です。まずこの教材で現象と式の見通しをつかみ、知りたいテーマの節や問題へ進んでみてください。読み方と対応章は、本サイトからの学習案内です。', 'These references are mainly for advanced undergraduate and graduate study. Use this site to build physical intuition, then explore the sections and problems relevant to your question. Reading routes and chapter connections are this site’s suggestions.')}</p><nav class="reading-jumps" aria-label="${t('教科書案内の目次', 'Reading guide contents')}"><a href="#/books" data-reading-target="textbooks">${t('標準教科書', 'Standard textbooks')}</a><a href="#/books" data-reading-target="reviews">${t('総説集・プロシーディングス', 'Reviews & proceedings')}</a></nav></header><section id="textbooks" tabindex="-1" aria-labelledby="textbooks-heading"><div class="section-heading"><div><div class="eyebrow">TEXTBOOKS</div><h2 id="textbooks-heading">${t('現象を、体系から学び直す', 'Study the underlying framework')}</h2></div><span class="section-index">${String(textbooks.length).padStart(2, '0')}</span></div><div class="book-grid">${textbooks.map((b,i) => card(b,i)).join('')}</div></section><section id="reviews" tabindex="-1" aria-labelledby="reviews-heading"><div class="section-heading"><div><div class="eyebrow">REVIEWS & PROCEEDINGS</div><h2 id="reviews-heading">${t('専門家の総説で、分野をつなぐ', 'Connect fields through specialist reviews')}</h2><p>${t('複数の著者による総説集は、テーマごとに選んで読む。', 'Choose individual contributions in multi-author review volumes.')}</p></div></div><div class="book-grid review-grid">${reviews.map((b,i) => card(b,i+textbooks.length)).join('')}</div></section><aside class="callout reading-note">${t('古典の強みは、近似と導出を深く学べること。宇宙論の数値や観測結果、研究の到達点は刊行時期によって異なるため、各章末の論文・講義資料と行き来して読むと役立ちます。', 'Classics offer detailed derivations and approximations. Cosmological parameters, observations and the state of research reflect their publication era; use the papers and lecture notes cited in each chapter alongside them.')}</aside><p><a class="button" href="#/advanced">${t('発展編でテーマを選ぶ', 'Choose an advanced topic')} →</a></p></div>`;
  }
  window.AstroBooks = { title, desc, books, renderBody };
})();
