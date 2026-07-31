/* ============================================================
   script.js — A Little World for Aarohi
   Page-based navigation, smooth & fast
   ============================================================ */
'use strict';

const $   = (sel, ctx = document) => ctx.querySelector(sel);
const $$  = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max + 1));

/* ── State ── */
let currentPage   = 0;
let totalPages    = 0;
let maxUnlocked   = 0;
let isTransitioning = false;
let wrongAttempts = 0;
let letterOpen    = false;
let ringOpen      = false;
let countdownTick = null;

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  spawnGlobalStars();
  spawnGlobalPetals();
  initLoadingScreen();
});

/* ============================================================
   GLOBAL BACKGROUND PARTICLES (very few, GPU-cheap)
   ============================================================ */
function spawnGlobalStars () {
  const ct = $('#globalStars');
  if (!ct) return;
  for (let i = 0; i < 70; i++) {
    const s = document.createElement('div');
    s.className = 'star-dot';
    const size = rand(0.8, 2.8);
    Object.assign(s.style, {
      width: size + 'px', height: size + 'px',
      left: rand(0, 100) + '%', top: rand(0, 100) + '%',
      '--dur':   rand(2, 6) + 's',
      '--delay': rand(0, 5) + 's',
    });
    ct.appendChild(s);
  }
}

function spawnGlobalPetals () {
  const ct = $('#globalPetals');
  if (!ct) return;
  for (let i = 0; i < 10; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const size = rand(7, 16);
    Object.assign(p.style, {
      '--size':  size + 'px',
      '--left':  rand(0, 100) + '%',
      '--dur':   rand(10, 18) + 's',
      '--delay': rand(0, 16) + 's',
    });
    ct.appendChild(p);
  }
}

function spawnFireflies (ct, count) {
  if (!ct) return;
  for (let i = 0; i < count; i++) {
    const f = document.createElement('div');
    f.className = 'firefly';
    const size = rand(3, 6);
    Object.assign(f.style, {
      '--size':  size + 'px',
      '--dur':   rand(6, 12) + 's',
      '--delay': rand(0, 8) + 's',
      '--mx1':   rand(-80, 80) + 'px',
      '--my1':   rand(-80, 80) + 'px',
      '--mx2':   rand(-60, 60) + 'px',
      '--my2':   rand(-60, 60) + 'px',
      '--mx3':   rand(-70, 70) + 'px',
      '--my3':   rand(-70, 70) + 'px',
      left: rand(5, 95) + '%',
      top:  rand(5, 95) + '%',
    });
    ct.appendChild(f);
  }
}

/* ============================================================
   GLOBAL SHOOTING STARS
   ============================================================ */
function initShootingStars () {
  function fire() {
    var angle = rand(-35, -8);
    var rad   = angle * Math.PI / 180;
    var len   = rand(120, 260);
    var dur   = rand(0.55, 0.9);
    var el    = document.createElement('div');
    el.className = 'global-shooting-star';
    el.style.left      = rand(5, 80) + 'vw';
    el.style.top       = rand(5, 45) + 'vh';
    el.style.width     = len + 'px';
    el.style.transform = 'rotate(' + angle + 'deg)';
    el.style.setProperty('--dur',  dur + 's');
    el.style.setProperty('--dist', (Math.cos(rad) * len) + 'px');
    document.body.appendChild(el);
    setTimeout(function() { el.remove(); }, dur * 1000 + 200);
  }
  function scheduleNext() {
    setTimeout(function() { fire(); scheduleNext(); }, rand(20000, 32000));
  }
  setTimeout(function() { fire(); scheduleNext(); }, rand(8000, 14000));
}

/* ============================================================
   LOADING SCREEN
   ============================================================ */
function initLoadingScreen () {
  const screen = $('#loadingScreen');
  setTimeout(() => {
    screen.classList.add('fade-out');
    setTimeout(() => {
      screen.style.display = 'none';
      showPasswordPage();
    }, 1000);
  }, 3000);
}

/* ============================================================
   PASSWORD PAGE
   ============================================================ */
function showPasswordPage () {
  const page  = $('#passwordPage');
  const input = $('#passwordInput');
  const btn   = $('#passwordBtn');
  const hint  = $('#pwHint');
  const card  = $('#pwCard');

  page.classList.remove('page-hidden');

  const tryPassword = () => {
    const val = input.value.trim().toUpperCase();
    if (val === 'KUPOSHIT') {
      onPasswordCorrect(card, page);
    } else {
      wrongAttempts++;
      card.classList.remove('shake');
      void card.offsetWidth;
      card.classList.add('shake');
      input.style.borderColor = '#ff4466';
      setTimeout(() => { input.style.borderColor = ''; }, 600);
      input.value = '';
      if (wrongAttempts >= 4) {
        hint.textContent = 'Hint: It starts with KUPO 😭';
        hint.classList.add('visible');
      }
    }
  };

  btn.addEventListener('click', tryPassword);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') tryPassword(); });
}

function onPasswordCorrect (card, page) {
  card.classList.add('success');
  burstSparkles();
  setTimeout(() => {
    page.classList.add('fade-out');
    setTimeout(() => {
      page.style.display = 'none';
      launchMainWebsite();
    }, 1000);
  }, 1200);
}

function burstSparkles () {
  const burst = $('#sparkleBurst');
  burst.innerHTML = '';
  const colors = ['#d4a853', '#f48fb1', '#fff', '#f0c96e', '#ff80ab'];
  for (let i = 0; i < 50; i++) {
    const p = document.createElement('div');
    p.className = 'spark-particle';
    const angle = rand(0, 360);
    const dist  = rand(50, 200);
    Object.assign(p.style, {
      background: colors[randInt(0, colors.length - 1)],
      width:  rand(3, 8) + 'px',
      height: rand(3, 8) + 'px',
      '--tx':  (Math.cos(angle * Math.PI / 180) * dist) + 'px',
      '--ty':  (Math.sin(angle * Math.PI / 180) * dist) + 'px',
      '--dur': rand(0.6, 1.2) + 's',
    });
    burst.appendChild(p);
  }
}

/* ============================================================
   MAIN WEBSITE — PAGE SYSTEM
   ============================================================ */
function launchMainWebsite () {
  const site = $('#mainWebsite');
  site.classList.remove('page-hidden');

  /* Collect all pages */
  const pages = $$('.page', site);
  totalPages  = pages.length;

  /* Build navigation dots */
  buildNav(pages);

  /* Spawn fireflies for special pages */
  spawnFireflies($('#heroFireflies'), 10);
  spawnFireflies($('#finalFireflies'), 8);
  spawnFireflies($('#epilogueFireflies'), 10);

  /* Init features */
  initDaysCounter();
  initTypingAnimation();
  initGarden();
  initLetter();
  initRingBox();
  initCountdown();
  initCursorGlow();
  initKeyboardNav();
  initTouchNav();
  initPuzzle();
  initPlaces();
  initShootingStars();

  /* Activate first page */
  goToPage(0, false);
}

/* ── Build dot nav ─────────────────────────────────────────── */
function buildNav (pages) {
  const dotsWrap = $('#navDots');
  const nav      = $('#pageNav');
  const prevBtn  = $('#navPrev');
  const nextBtn  = $('#navNext');

  pages.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    if (i > 0) dot.classList.add('nav-dot--locked');
    dot.setAttribute('aria-label', 'Page ' + (i + 1));
    dot.addEventListener('click', () => { if (i <= maxUnlocked) goToPage(i); });
    dotsWrap.appendChild(dot);
  });

  prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
  nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

  /* Show nav */
  setTimeout(() => nav.classList.add('visible'), 600);
}

/* ── Page activation callbacks ─────────────────────────────── */
const _pageOnce = {}; // { pageId: fn } — called once on first activation
function onPageActivateOnce (pageId, fn) { _pageOnce[pageId] = fn; }

/* ── Navigate to page ──────────────────────────────────────── */
function goToPage (idx, animate = true) {
  if (idx < 0 || idx >= totalPages) return;
  if (isTransitioning && animate) return;

  isTransitioning = true;
  const pages     = $$('.page');
  const dots      = $$('.nav-dot');
  const prevBtn   = $('#navPrev');
  const nextBtn   = $('#navNext');

  /* Deactivate old */
  pages.forEach(p => p.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));

  currentPage = idx;

  /* Unlock next dot progressively */
  if (idx > maxUnlocked) {
    maxUnlocked = idx;
    if (dots[idx]) dots[idx].classList.remove('nav-dot--locked');
  }

  /* Activate new */
  pages[idx].classList.add('active');
  if (dots[idx]) dots[idx].classList.add('active');

  /* Scroll inner to top on forward navigation */
  const inner = pages[idx].querySelector('.page-inner.scrollable');
  if (inner) inner.scrollTop = 0;

  /* Update arrows */
  if (prevBtn) prevBtn.disabled = idx === 0;
  if (nextBtn) nextBtn.disabled = idx === totalPages - 1;

  /* Fire one-time page activation callbacks */
  const pageId = pages[idx].id;
  if (_pageOnce[pageId]) {
    const cb = _pageOnce[pageId];
    delete _pageOnce[pageId];
    setTimeout(cb, 80);
  }

  /* Unlock after transition */
  setTimeout(() => { isTransitioning = false; }, 600);
}

/* ── Keyboard navigation ───────────────────────────────────── */
function initKeyboardNav () {
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToPage(currentPage + 1);
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goToPage(currentPage - 1);
  });
}

/* ── Touch / swipe navigation ──────────────────────────────── */
function initTouchNav () {
  let startX = 0, startY = 0;

  document.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;

    /* Only trigger if horizontal swipe dominates */
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;

    /* Don't swipe pages when flower popup is open */
    const popup = $('#flowerPopup');
    if (popup && !popup.classList.contains('hidden')) return;

    /* Don't swipe pages when a carousel drag just finished */
    if (window._carouselSwallowed) { window._carouselSwallowed = false; return; }

    /* Don't swipe while a scrollable area is mid-scroll */
    const active = $$('.page.active .page-inner.scrollable')[0];
    if (active) {
      const atTop    = active.scrollTop <= 0;
      const atBottom = active.scrollTop + active.clientHeight >= active.scrollHeight - 2;
      if (!atTop && dx > 0) return;    /* swiping right but not at top — ignore */
      if (!atBottom && dx < 0) return; /* swiping left but not at bottom — ignore */
    }

    if (dx < 0) goToPage(currentPage + 1); /* swipe left → next */
    else        goToPage(currentPage - 1); /* swipe right → prev */
  }, { passive: true });
}

/* ============================================================
   HERO BUTTON
   ============================================================ */
function initTypingAnimation () {
  /* Hero begin button */
  const beginBtn = $('#heroBegin');
  if (beginBtn) beginBtn.addEventListener('click', () => goToPage(1));

  const target = $('#typingText');
  if (!target) return;

  const phrases = [
    'Every beautiful story starts somewhere...',
    'Ours started with a BGMI match. 🎮',
    'Now look where we are. 🌸',
  ];

  let pi = 0, ci = 0, deleting = false;

  const type = () => {
    const phrase = phrases[pi];
    if (!deleting) {
      target.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(type, 2200); return; }
      setTimeout(type, 65 + rand(-15, 15));
    } else {
      target.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(type, 400); return; }
      setTimeout(type, 35);
    }
  };
  setTimeout(type, 2000);
}

/* ============================================================
   DAYS COUNTER
   ============================================================ */
function initDaysCounter () {
  const el = $('#dayCount');
  if (!el) return;
  const start  = new Date(2026, 4, 28, 0, 0, 0);
  const target = Math.max(0, Math.floor((new Date() - start) / 86400000));
  let cur = 0;
  const step  = Math.max(1, Math.floor(target / 50));
  const timer = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur;
    if (cur >= target) clearInterval(timer);
  }, 25);
}

/* ============================================================
   SECRET GARDEN
   ============================================================ */
function initGarden () {
  var flowers  = $$('.flower');
  var popup    = $('#flowerPopup');
  var msgEl    = $('#flowerMsg');
  var titleEl  = $('#flowerTitle');
  var iconEl   = $('#flowerIcon');
  var closeBtn = $('#flowerClose');
  if (!popup) return;

  /* Spawn floating petals */
  var gardenPetals = $('#gardenPetals');
  if (gardenPetals) {
    for (var gi = 0; gi < 20; gi++) {
      var gp = document.createElement('div');
      gp.className = 'petal';
      Object.assign(gp.style, {
        '--size':  rand(5, 13) + 'px',
        '--left':  rand(0, 100) + '%',
        '--dur':   rand(9, 18) + 's',
        '--delay': rand(0, 18) + 's',
        opacity:   '0.5',
      });
      gardenPetals.appendChild(gp);
    }
  }

  var openModal = function(flower) {
    var msg   = flower.dataset.msg || flower.dataset.message || '';
    var title = flower.dataset.title || '';
    var icon  = flower.dataset.icon  || '🌸';
    if (msgEl)   msgEl.textContent   = msg;
    if (titleEl) titleEl.textContent = title;
    if (iconEl)  iconEl.textContent  = icon;
    popup.classList.remove('hidden');
  };

  var close = function() { popup.classList.add('hidden'); };

  flowers.forEach(function(flower) {
    flower.addEventListener('click', function() {
      flower.classList.add('bloomed');
      spawnBloomBurst(flower);
      openModal(flower);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  popup.addEventListener('click', function(e) { if (e.target === popup) close(); });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !popup.classList.contains('hidden')) close();
  });
}

function spawnBloomBurst (flower) {
  var bloom = flower.querySelector('.flower-bloom');
  if (!bloom) return;
  var rect   = bloom.getBoundingClientRect();
  var cx     = rect.left + rect.width / 2;
  var cy     = rect.top  + rect.height / 2;
  var colors = ['#f48fb1', '#ffd6e7', '#fff', '#d4a853', '#ffe4f5'];
  for (var bi = 0; bi < 14; bi++) {
    (function() {
      var bp    = document.createElement('div');
      var bAng  = rand(0, 360);
      var bDist = rand(28, 80);
      var bSize = rand(3, 7);
      Object.assign(bp.style, {
        position: 'fixed', left: cx + 'px', top: cy + 'px',
        width: bSize + 'px', height: bSize + 'px',
        borderRadius: '50%',
        background:    colors[randInt(0, colors.length - 1)],
        pointerEvents: 'none', zIndex: '9999',
        '--tx': (Math.cos(bAng * Math.PI / 180) * bDist) + 'px',
        '--ty': (Math.sin(bAng * Math.PI / 180) * bDist) + 'px',
        '--dur': rand(0.5, 0.9) + 's',
        animation: 'sparkOut var(--dur) ease-out forwards',
      });
      document.body.appendChild(bp);
      setTimeout(function() { bp.remove(); }, 1000);
    })();
  }
}

/* ============================================================
   LETTER
   ============================================================ */
function initLetter () {
  const btn      = $('#openLetterBtn');
  const envelope = $('#envelope');
  if (!btn || !envelope) return;

  btn.addEventListener('click', () => {
    letterOpen = !letterOpen;
    envelope.classList.toggle('open', letterOpen);
    btn.textContent = letterOpen ? 'Close ✕' : 'Open the Letter 💌';
    btn.style.opacity = letterOpen ? '0.6' : '1';
  });
}

/* ============================================================
   RING BOX
   ============================================================ */
function initRingBox () {
  var btn       = $('#openBoxBtn');
  var box       = $('#ringBox');
  var caption   = $('#ringCaption');
  var msgWrap   = $('#ringMessageWrap');
  var msgScroll = $('#ringMessageScroll');
  if (!btn || !box) return;

  btn.addEventListener('click', function() {
    if (ringOpen) return;
    ringOpen = true;
    box.classList.add('open');
    btn.style.transition    = 'opacity 0.5s ease';
    btn.style.opacity       = '0.3';
    btn.style.pointerEvents = 'none';

    /* Sparkles */
    var section = box.closest('.page');
    if (section) {
      var colors = ['#d4a853', '#f0c96e', '#fff', '#f48fb1'];
      for (var si = 0; si < 18; si++) {
        (function(idx) {
          setTimeout(function() {
            var s = document.createElement('div');
            s.className = 'star-dot';
            var size = rand(3, 7);
            Object.assign(s.style, {
              width: size + 'px', height: size + 'px',
              position: 'absolute',
              left: rand(20, 80) + '%', top: rand(20, 80) + '%',
              background: colors[randInt(0, colors.length - 1)],
              borderRadius: '50%',
              '--dur':   rand(1.5, 3.5) + 's',
              '--delay': '0s',
              pointerEvents: 'none',
            });
            section.appendChild(s);
            setTimeout(function() { s.remove(); }, 4000);
          }, idx * 75);
        })(si);
      }
    }

    /* Butterflies */
    setTimeout(function() { spawnButterflies(box); }, 900);

    /* Caption */
    setTimeout(function() {
      if (caption) {
        caption.classList.remove('hidden');
        caption.style.opacity    = '0';
        caption.style.transition = 'opacity 0.8s ease';
        requestAnimationFrame(function() { requestAnimationFrame(function() {
          caption.style.opacity = '1';
          caption.classList.add('visible');
        }); });
      }
    }, 1800);

    /* Ring message typewriter */
    setTimeout(function() {
      if (msgWrap && msgScroll) {
        msgWrap.classList.remove('hidden');
        msgWrap.style.opacity    = '0';
        msgWrap.style.transition = 'opacity 0.6s ease';
        requestAnimationFrame(function() { requestAnimationFrame(function() {
          msgWrap.style.opacity = '1';
        }); });
        startRingTypewriter(msgScroll);
      }
    }, 4800);
  });
}

function spawnButterflies (box) {
  var rect    = box.getBoundingClientRect();
  var originX = rect.left + rect.width / 2;
  var originY = rect.top  + rect.height / 4;
  var vw = window.innerWidth;
  var vh = window.innerHeight;
  /* viewport-relative targets so butterflies reach actual screen corners */
  var targets = [
    [-vw * 0.38, -vh * 0.42], [ vw * 0.38, -vh * 0.42],
    [-vw * 0.46, -vh * 0.18], [ vw * 0.46, -vh * 0.18],
    [-vw * 0.28, -vh * 0.55], [ vw * 0.28, -vh * 0.55],
    [         0, -vh * 0.62],
    [-vw * 0.44,  vh * 0.32], [ vw * 0.44,  vh * 0.32],
    [-vw * 0.14, -vh * 0.52], [ vw * 0.14, -vh * 0.52],
  ];
  targets.forEach(function(pos, i) {
    var tx = pos[0], ty = pos[1];
    var sz     = rand(20, 32);
    var delay  = i * 80;
    var flyDur = rand(1800, 2800);

    /* wrapper handles position via transition — no animation on wrapper */
    var b = document.createElement('div');
    b.className = 'butterfly-particle';
    b.style.left      = originX + 'px';
    b.style.top       = originY + 'px';
    b.style.opacity   = '0';
    b.style.transform = 'translate(-50%,-50%) scale(0)';

    /* inner span handles wing-flap animation, isolated from position */
    var inner = document.createElement('span');
    inner.className   = 'bf-inner';
    inner.textContent = '🦋';
    inner.style.fontSize  = sz + 'px';
    inner.style.animation = 'butterflyWing ' + rand(250, 360) + 'ms ease-in-out ' + delay + 'ms infinite alternate';
    b.appendChild(inner);
    document.body.appendChild(b);

    (function(bEl, bTx, bTy, bFly, bDelay) {
      setTimeout(function() {
        bEl.style.transition = 'transform ' + bFly + 'ms cubic-bezier(0.15,0.85,0.25,1), opacity 350ms ease';
        requestAnimationFrame(function() { requestAnimationFrame(function() {
          bEl.style.transform = 'translate(calc(-50% + ' + bTx + 'px), calc(-50% + ' + bTy + 'px)) scale(1)';
          bEl.style.opacity   = '1';
        }); });
      }, bDelay + 20);
      setTimeout(function() {
        bEl.style.transition = 'opacity 1s ease';
        bEl.style.opacity    = '0';
        setTimeout(function() { bEl.remove(); }, 1100);
      }, bDelay + bFly * 0.70);
    })(b, tx, ty, flyDur, delay);
  });
}

function startRingTypewriter (el) {
  var lines = [
    'Yes...',
    '',
    'This is a proposal. 💍♡',
    '',
    '...',
    '',
    '...',
    '',
    '🥲 You actually believed that?!',
    '',
    'Come on...',
    '',
    'Did you really think your Kuposhit would let one of the biggest moments of his life happen through a website?',
    '',
    'That would be cheating.',
    '',
    'Some moments deserve more than pixels...',
    '',
    'They deserve reality.',
    '',
    'So for now...',
    '',
    'Please accept this Limited Edition Virtual Ring 💍',
    '',
    'Contents of the box:',
    '',
    '💍 1 Virtual Ring',
    '🤍 A lot of good intentions',
    '😂 A little bit of Kuposhit energy',
    '💸 My entire budget',
    '✨ Unlimited appreciation for you',
    '',
    'Possible side effects:',
    '',
    '• Random smiling.',
    '• Wanting to bully the sender.',
    '• Calling him Kuposhit even more. 😭',
    '• Becoming emotionally attached to a ₹0 ring. 💍',
    '',
    'Please don\'t ask for the bill.',
    '',
    'There isn\'t one. 😌',
    '',
    'The good news is...',
    '',
    'You can never lose this ring.',
    '',
    'The bad news is...',
    '',
    'You also can\'t flex it in front of your friends. 😔',
    '',
    'If life is kind enough...',
    '',
    'Maybe one day, after I\'ve worked hard and life has taken us there...',
    '',
    'I\'d love to replace this little virtual ring with a real one.',
    '',
    'Until then...',
    '',
    'This little one will have to do. 🤍'
  ];

  el.textContent = '';
  var tn     = document.createTextNode('');
  var cursor = document.createElement('span');
  cursor.className = 'ring-msg-cursor';
  el.appendChild(tn);
  el.appendChild(cursor);

  var lineIdx    = 0;
  var text       = '';
  var TYPE_SPEED = 4;
  var LINE_PAUSE = 30;
  var DOT_PAUSE  = 150;

  function nextLine() {
    if (lineIdx >= lines.length) { cursor.remove(); return; }
    var line = lines[lineIdx++];
    if (line === '') {
      text += '\n';
      tn.textContent = text;
      setTimeout(nextLine, LINE_PAUSE * 0.55);
      return;
    }
    if (line === '...') {
      text += '...\n';
      tn.textContent = text;
      setTimeout(nextLine, DOT_PAUSE);
      return;
    }
    var ci = 0;
    function typeChar() {
      if (ci < line.length) {
        text += line[ci++];
        tn.textContent = text;
        setTimeout(typeChar, TYPE_SPEED + rand(-8, 8));
      } else {
        text += '\n';
        tn.textContent = text;
        setTimeout(nextLine, LINE_PAUSE);
      }
    }
    typeChar();
  }

  setTimeout(nextLine, 500);
}

/* ============================================================
   COUNTDOWN
   ============================================================ */
function initCountdown () {
  const target  = new Date(2027, 4, 28, 0, 0, 0);
  const cdDays  = $('#cdDays'), cdHours  = $('#cdHours');
  const cdMins  = $('#cdMinutes'), cdSecs = $('#cdSeconds');
  const grid    = $('#countdownGrid'), zero = $('#cdZeroMsg');
  if (!cdDays) return;

  const pad = n => String(n).padStart(2, '0');
  const set = (el, val) => { if (el && el.textContent !== String(val)) el.textContent = val; };

  const tick = () => {
    const diff = target - new Date();
    if (diff <= 0) {
      clearInterval(countdownTick);
      grid && grid.classList.add('hidden');
      zero && zero.classList.remove('hidden');
      return;
    }
    const s = Math.floor(diff / 1000);
    set(cdDays,  Math.floor(s / 86400));
    set(cdHours, pad(Math.floor((s % 86400) / 3600)));
    set(cdMins,  pad(Math.floor((s % 3600) / 60)));
    set(cdSecs,  pad(s % 60));
  };

  tick();
  countdownTick = setInterval(tick, 1000);
}

/* ============================================================
   PUZZLE
   ============================================================ */
function initPuzzle () {
  if (!$('#page-puzzle')) return;
  onPageActivateOnce('page-puzzle', setupPuzzle);
}

function setupPuzzle () {
  const img = new Image();
  img.onload = () => buildPuzzle(img);
  img.onerror = () => console.warn('puzzle image failed to load');
  img.src = '/puzzle-art.png';
}

function buildPuzzle (img) {
  const container = $('#puzzleContainer');
  const board     = $('#puzzleBoard');
  if (!container || !board) return;

  /* ── Sizes ────────────────────────────────────────────────── */
  const COLS = 4, ROWS = 4, TOTAL = 16;
  const BOARD = Math.min(340, window.innerWidth * 0.82, window.innerHeight * 0.40);
  const CELL  = BOARD / COLS;
  const TAB   = CELL * 0.19;
  const CVS   = CELL + 2 * TAB;   // canvas size per piece

  container.style.cssText = `position:relative;margin:0 auto;overflow:visible;width:${BOARD}px`;
  board.style.cssText     = `position:relative;width:${BOARD}px;height:${BOARD}px;
    background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:4px;`;

  /* ── Ghost slots ──────────────────────────────────────────── */
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const slot = document.createElement('div');
      slot.className = 'puzzle-slot';
      slot.style.cssText = `left:${c*CELL}px;top:${r*CELL}px;width:${CELL}px;height:${CELL}px;`;
      board.appendChild(slot);
    }
  }

  /* ── Connector map ────────────────────────────────────────── */
  // h_edge[r][c] => bottom connector of piece(r,c): +1 = tab down, -1 = blank
  // v_edge[r][c] => right connector of piece(r,c):  +1 = tab right, -1 = blank
  const h_edge = Array.from({length: ROWS-1}, () =>
    Array.from({length: COLS}, () => Math.random() > 0.5 ? 1 : -1));
  const v_edge = Array.from({length: ROWS}, () =>
    Array.from({length: COLS-1}, () => Math.random() > 0.5 ? 1 : -1));

  /* ── Build pieces ─────────────────────────────────────────── */
  let placed = 0;
  const pieces = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const topC    = r === 0        ? 0 : -h_edge[r-1][c];
      const bottomC = r === ROWS - 1 ? 0 :  h_edge[r][c];
      const leftC   = c === 0        ? 0 : -v_edge[r][c-1];
      const rightC  = c === COLS - 1 ? 0 :  v_edge[r][c];

      const cvs = document.createElement('canvas');
      cvs.width = cvs.height = Math.ceil(CVS);
      cvs.dataset.r = r; cvs.dataset.c = c; cvs.dataset.placed = '0';
      cvs.style.cssText = `position:absolute;width:${CVS}px;height:${CVS}px;cursor:grab;
        filter:drop-shadow(0 4px 14px rgba(0,0,0,0.65));touch-action:none;`;

      drawPieceCanvas(cvs.getContext('2d'), img, r, c, CELL, TAB, CVS,
                      topC, rightC, bottomC, leftC);

      cvs._tx = c * CELL - TAB;   // target left in container coords
      cvs._ty = r * CELL - TAB;   // target top  in container coords
      cvs._rot = 0;

      container.appendChild(cvs);
      pieces.push(cvs);
    }
  }

  /* ── Scatter pieces below the board ──────────────────────── */
  const GAP = 6;
  const TRAY_COLS = Math.max(2, Math.floor(BOARD / (CVS + GAP)));
  const shuffled  = [...pieces].sort(() => Math.random() - 0.5);

  shuffled.forEach((p, i) => {
    const tr = Math.floor(i / TRAY_COLS);
    const tc = i % TRAY_COLS;
    const availW = BOARD - TRAY_COLS * CVS;
    const padX   = availW / (TRAY_COLS + 1);
    const tx = padX + tc * (CVS + padX) + rand(-5, 5);
    const ty = BOARD + 12 + tr * (CVS + GAP) + rand(-4, 4);
    const rot = rand(-14, 14);
    p.style.left = tx + 'px';
    p.style.top  = ty + 'px';
    p.style.transform = `rotate(${rot}deg)`;
    p._rot = rot;
  });

  const TRAY_ROWS = Math.ceil(TOTAL / TRAY_COLS);
  container.style.height = (BOARD + 12 + TRAY_ROWS * (CVS + GAP) + 20) + 'px';

  /* ── Drag and drop ────────────────────────────────────────── */
  pieces.forEach(p => {
    makeDraggable(p, container, CELL, TAB, () => {
      placed++;
      const fill = $('#puzzleProgressFill');
      if (fill) fill.style.width = (placed / TOTAL * 100) + '%';
      const cnt  = $('#piecesCount');
      if (cnt) cnt.textContent = placed;
      if (placed === TOTAL) {
        setTimeout(() => triggerPuzzleCompletion(pieces, board, BOARD, CVS), 350);
      }
    });
  });
}

/* ── Draw one piece on its canvas ─────────────────────────────── */
function drawPieceCanvas (ctx, img, r, c, cell, tab, cvs,
                           topC, rightC, bottomC, leftC) {
  ctx.clearRect(0, 0, cvs, cvs);
  ctx.save();
  buildPiecePath(ctx, tab, tab, cell, cell, topC, rightC, bottomC, leftC, tab);
  ctx.clip();

  // Scale image to board then draw the right slice
  const IW = img.naturalWidth, IH = img.naturalHeight;
  const scale = 4 * cell; // board pixel dimension in img coords = IW (same thing)
  const sx = (c * cell / (4 * cell)) * IW - (tab / cell) * (IW / 4);
  const sy = (r * cell / (4 * cell)) * IH - (tab / cell) * (IH / 4);
  const sw = (cvs / (4 * cell)) * IW;
  const sh = (cvs / (4 * cell)) * IH;

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cvs, cvs);
  ctx.restore();

  // Subtle edge outline
  ctx.save();
  buildPiecePath(ctx, tab, tab, cell, cell, topC, rightC, bottomC, leftC, tab);
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.restore();
}

/* ── Jigsaw path ─────────────────────────────────────────────── */
function buildPiecePath (ctx, ox, oy, cw, ch, topC, rightC, bottomC, leftC, tab) {
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  addPuzzleEdge(ctx, ox,      oy,      ox+cw,  oy,      topC,    0,  -1, tab); // top
  addPuzzleEdge(ctx, ox+cw,   oy,      ox+cw,  oy+ch,   rightC,  1,   0, tab); // right
  addPuzzleEdge(ctx, ox+cw,   oy+ch,   ox,     oy+ch,   bottomC, 0,   1, tab); // bottom
  addPuzzleEdge(ctx, ox,      oy+ch,   ox,     oy,      leftC,  -1,   0, tab); // left
  ctx.closePath();
}

function addPuzzleEdge (ctx, x0, y0, x1, y1, connector, nx, ny, tab) {
  if (connector === 0) { ctx.lineTo(x1, y1); return; }

  const len = Math.sqrt((x1-x0)**2 + (y1-y0)**2);
  const ux  = (x1-x0) / len, uy = (y1-y0) / len;
  const bx  = nx * connector * tab;
  const by  = ny * connector * tab;

  const p1x = x0 + ux * len * 0.35, p1y = y0 + uy * len * 0.35;
  const p2x = x0 + ux * len * 0.65, p2y = y0 + uy * len * 0.65;
  const pkx = (x0+x1)/2 + bx,       pky = (y0+y1)/2 + by;

  ctx.lineTo(p1x, p1y);
  ctx.bezierCurveTo(p1x + bx*0.75, p1y + by*0.75,
                    pkx - ux*len*0.1, pky - uy*len*0.1,
                    pkx, pky);
  ctx.bezierCurveTo(pkx + ux*len*0.1, pky + uy*len*0.1,
                    p2x + bx*0.75, p2y + by*0.75,
                    p2x, p2y);
  ctx.lineTo(x1, y1);
}

/* ── Drag & drop ─────────────────────────────────────────────── */
function makeDraggable (piece, container, cell, tab, onSnap) {
  let dragging = false, startMX, startMY, startL, startT;
  const SNAP_THRESH = cell * 0.55;

  const pickUp = (cx, cy) => {
    if (piece.dataset.placed === '1') return;
    dragging = true;
    startMX = cx; startMY = cy;
    startL  = parseFloat(piece.style.left) || 0;
    startT  = parseFloat(piece.style.top)  || 0;
    piece.style.zIndex    = '900';
    piece.style.cursor    = 'grabbing';
    piece.style.transition = 'none';
    piece.style.transform = 'rotate(0deg) scale(1.06)';
    piece.style.filter    = 'drop-shadow(0 10px 28px rgba(0,0,0,0.9))';
  };

  const drag = (cx, cy) => {
    if (!dragging) return;
    piece.style.left = (startL + cx - startMX) + 'px';
    piece.style.top  = (startT + cy - startMY) + 'px';
  };

  const drop = () => {
    if (!dragging) return;
    dragging = false;
    piece.style.cursor = 'grab';
    piece.style.zIndex = '10';

    const pl = parseFloat(piece.style.left) + tab;
    const pt = parseFloat(piece.style.top)  + tab;
    const tl = piece._tx + tab;
    const tt = piece._ty + tab;

    if (Math.hypot(pl - tl, pt - tt) < SNAP_THRESH) {
      // Snap into place
      piece.style.transition = 'left .32s cubic-bezier(.34,1.56,.64,1),top .32s cubic-bezier(.34,1.56,.64,1),transform .3s,filter .3s';
      piece.style.left      = piece._tx + 'px';
      piece.style.top       = piece._ty + 'px';
      piece.style.transform = 'rotate(0deg) scale(1)';
      piece.style.filter    = 'drop-shadow(0 2px 5px rgba(0,0,0,0.35))';
      piece.dataset.placed  = '1';
      piece.style.zIndex    = '5';
      piece.style.cursor    = 'default';
      piece.style.pointerEvents = 'none';
      piecePlacedFlash(piece, container);
      onSnap();
    } else {
      piece.style.transition = 'transform .2s';
      piece.style.transform  = `rotate(${piece._rot}deg) scale(1)`;
      piece.style.filter     = 'drop-shadow(0 4px 14px rgba(0,0,0,0.65))';
    }
  };

  piece.addEventListener('mousedown',  e => { e.preventDefault(); pickUp(e.clientX, e.clientY); });
  piece.addEventListener('touchstart', e => { e.preventDefault(); pickUp(e.touches[0].clientX, e.touches[0].clientY); }, {passive:false});
  document.addEventListener('mousemove',  e => drag(e.clientX, e.clientY));
  document.addEventListener('touchmove',  e => { if(dragging) { e.preventDefault(); drag(e.touches[0].clientX, e.touches[0].clientY); } }, {passive:false});
  document.addEventListener('mouseup',  drop);
  document.addEventListener('touchend', drop);
}

function piecePlacedFlash (piece, container) {
  const f = document.createElement('div');
  f.style.cssText = `position:absolute;left:${piece.style.left};top:${piece.style.top};
    width:${piece.offsetWidth}px;height:${piece.offsetHeight}px;
    background:rgba(255,255,255,0.35);border-radius:3px;pointer-events:none;z-index:999;
    animation:snapFlash .45s ease-out forwards;`;
  container.appendChild(f);
  setTimeout(() => f.remove(), 500);
}

/* ── Completion sequence ─────────────────────────────────────── */
function triggerPuzzleCompletion (pieces, board, BOARD, CVS) {
  // 1. Brief glow flash on all pieces
  pieces.forEach(p => {
    p.style.transition = 'filter .5s';
    p.style.filter = 'drop-shadow(0 0 18px rgba(255,255,255,0.92))';
  });

  setTimeout(() => {
    // 2. Fade progress bar out
    const progWrap = $('#puzzleProgressWrap');
    if (progWrap) { progWrap.style.transition = 'opacity .5s'; progWrap.style.opacity = '0'; }

    // 3. Fade piece drop-shadows away (pieces stay; borders dissolve)
    pieces.forEach(p => {
      p.style.transition = 'filter 1.5s ease';
      p.style.filter = 'none';
    });

    // 4. Ensure board has explicit pixel dimensions for the overlay
    board.style.width  = BOARD + 'px';
    board.style.height = BOARD + 'px';
    board.style.overflow = 'hidden';

    // 5. Fade in the seamless merged image on top of the pieces
    const mergeImg = $('#puzzleMergeImg');
    if (mergeImg) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        mergeImg.style.opacity = '1';
      }));
    }

    // 6. After merge image is visible, start sky canvas + zoom
    setTimeout(() => {
      startSkyAnimation(BOARD);

      const scene = $('#puzzleScene');
      if (scene) {
        scene.style.transform = 'scale(1.09)';
      }

      // 7. Fade out puzzle scene, reveal message centred (ring-style)
        setTimeout(() => {
          /* Shrink + fade puzzle board out */
          const scene    = $('#puzzleScene');
          const progWrap = $('#puzzleProgressWrap');
          const pageTitle = document.querySelector('#page-puzzle .page-title');
          const puzzleSub = document.querySelector('#page-puzzle .puzzle-sub');
          [scene, progWrap, pageTitle, puzzleSub].forEach(el => {
            if (!el) return;
            el.style.transition = 'opacity 1s ease, transform 1s ease';
            el.style.opacity    = '0';
            el.style.transform  = (el === scene ? 'scale(0.9) ' : '') + 'translateY(-10px)';
          });

          setTimeout(() => {
            /* Hide them from layout so footer centres naturally */
            [scene, progWrap, pageTitle, puzzleSub].forEach(el => {
              if (el) el.style.display = 'none';
            });

            var footer = $('#puzzleDoneFooter');
            var twWrap = $('#pzTypewriterWrap');
            if (footer) {
              footer.classList.remove('hidden');
              footer.style.opacity    = '0';
              footer.style.transition = 'opacity 0.9s ease';
              requestAnimationFrame(() => requestAnimationFrame(() => { footer.style.opacity = '1'; }));
            }
            if (twWrap) startPuzzleTypewriter(twWrap);

            // 8. Continue button — appears after typewriter (~message length * SPEED ms)
            setTimeout(() => {
              var btn = $('#puzzleContinueBtn');
              if (!btn) return;
              btn.classList.remove('hidden');
              btn.style.opacity    = '0';
              btn.style.transition = 'opacity 1.2s ease';
              requestAnimationFrame(() => requestAnimationFrame(() => { btn.style.opacity = '1'; }));
              btn.onclick = () => {
                var pages   = $$('.page');
                var ringIdx = pages.findIndex(p => p.id === 'page-ring');
                if (ringIdx !== -1) goToPage(ringIdx);
              };
            }, 6000);
          }, 1100);
        }, 2200);
    }, 950);
  }, 600);
}

/* ── Sky animation canvas ──────────────────────────────────────── */
function startSkyAnimation (BOARD) {
  const canvas = $('#skyCanvas');
  if (!canvas) return;

  canvas.width  = BOARD;
  canvas.height = BOARD;
  // CSS class (.puzzle-sky-canvas) already positions + transitions the canvas
  requestAnimationFrame(() => requestAnimationFrame(() => { canvas.style.opacity = '1'; }));

  const ctx = canvas.getContext('2d');
  const SKY = BOARD * 0.62;   // sky occupies top 62%

  /* Stars */
  const stars = Array.from({length:65}, () => ({
    x:     rand(0, BOARD),
    y:     rand(0, SKY * 0.9),
    r:     rand(0.3, 1.6),
    phase: rand(0, Math.PI*2),
    spd:   rand(0.35, 1.3),
  }));

  /* Shooting stars */
  const shots = [];
  let nextShot = rand(1800, 4000);

  /* Fireflies – near the silhouette bottom zone */
  const flies = Array.from({length:6}, () => ({
    x:  rand(BOARD*0.22, BOARD*0.78),
    y:  rand(BOARD*0.65, BOARD*0.88),
    r:  rand(1.4, 2.8),
    phase: rand(0, Math.PI*2),
    spd: rand(0.25, 0.55),
    dx: rand(-0.25, 0.25),
    dy: rand(-0.18, 0.18),
  }));

  /* Petals */
  const petals = Array.from({length:14}, () => ({
    x:   rand(-20, BOARD+20),
    y:   rand(-50, BOARD),
    vy:  rand(22, 52),
    vx:  rand(-14, 14),
    rot: rand(0, Math.PI*2),
    rs:  rand(-1.2, 1.2),
    sz:  rand(2.5, 5),
    a:   rand(0.4, 0.85),
  }));

  let last = performance.now();

  (function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t  = now / 1000;
    ctx.clearRect(0, 0, BOARD, BOARD);

    /* ── Stars ── */
    stars.forEach(s => {
      const bright = (Math.sin(t * s.spd + s.phase) * 0.5 + 0.5);
      const alpha  = 0.08 + bright * 0.72;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`; ctx.fill();
      if (bright > 0.88) {
        // sparkle cross
        const sz = s.r * (bright - 0.88) * 30;
        ctx.strokeStyle = `rgba(255,255,255,${(bright-0.88)*5})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(s.x-sz,s.y); ctx.lineTo(s.x+sz,s.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(s.x,s.y-sz); ctx.lineTo(s.x,s.y+sz); ctx.stroke();
      }
    });

    /* ── Shooting stars ── */
    nextShot -= dt * 1000;
    if (nextShot <= 0) {
      const ang = rand(-35, -8) * Math.PI / 180;
      shots.push({
        x: rand(BOARD*0.05, BOARD*0.85),
        y: rand(SKY*0.05, SKY*0.5),
        vx: Math.cos(ang) * rand(160, 260),
        vy: Math.sin(ang) * rand(160, 260),
        life: 0, max: rand(0.5, 0.9),
        len: rand(70, 140),
      });
      nextShot = rand(3500, 7000);
    }
    for (let i = shots.length - 1; i >= 0; i--) {
      const s = shots[i];
      s.life += dt; s.x += s.vx * dt; s.y += s.vy * dt;
      if (s.life > s.max || s.y > SKY) { shots.splice(i,1); continue; }
      const prog = s.life / s.max;
      const alpha = prog < 0.3 ? prog/0.3 : prog > 0.7 ? (1-prog)/0.3 : 1;
      const tail  = ctx.createLinearGradient(s.x, s.y, s.x - s.vx*0.28, s.y - s.vy*0.28);
      tail.addColorStop(0, `rgba(255,255,255,${alpha*0.9})`);
      tail.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath(); ctx.strokeStyle = tail; ctx.lineWidth = 1.8;
      ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx*0.28, s.y - s.vy*0.28); ctx.stroke();
      ctx.beginPath(); ctx.arc(s.x, s.y, 1.8, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`; ctx.fill();
    }

    /* ── Fireflies ── */
    flies.forEach(f => {
      f.x += f.dx; f.y += f.dy;
      if (f.x < BOARD*0.1 || f.x > BOARD*0.9) f.dx *= -1;
      if (f.y < BOARD*0.6 || f.y > BOARD*0.93) f.dy *= -1;
      const flicker = Math.sin(t * 2.8 + f.phase) * 0.5 + 0.5;
      const grd = ctx.createRadialGradient(f.x,f.y,0, f.x,f.y, f.r*5);
      grd.addColorStop(0, `rgba(180,255,120,${0.45 + flicker*0.55})`);
      grd.addColorStop(1, 'rgba(180,255,120,0)');
      ctx.beginPath(); ctx.arc(f.x,f.y,f.r*5,0,Math.PI*2);
      ctx.fillStyle = grd; ctx.fill();
      ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(220,255,180,${0.7+flicker*0.3})`; ctx.fill();
    });

    /* ── Cherry petals ── */
    petals.forEach(p => {
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.rs * dt;
      if (p.y > BOARD + 30) { p.x = rand(-20,BOARD+20); p.y = -20; p.vy = rand(22,52); p.vx = rand(-14,14); }
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
      ctx.beginPath(); ctx.ellipse(0,0,p.sz,p.sz*0.55,0,0,Math.PI*2);
      ctx.fillStyle = `rgba(255,210,228,${p.a})`; ctx.fill(); ctx.restore();
    });

    requestAnimationFrame(frame);
  })(performance.now());
}

/* ============================================================
   PLACES — carousel
   ============================================================ */
function initPlaces () {
  onPageActivateOnce('page-places', setupPlaces);
}

function setupPlaces () {
  const ohBtn        = $('#placesOhBtn');
  const initial      = $('#placesInitial');
  const typingSeq    = $('#placesTypingSeq');
  const line1        = $('#placesLine1');
  const line2        = $('#placesLine2');
  const showBtn      = $('#placesShowBtn');
  const carouselWrap = $('#placesCarouselWrap');
  const petalsEl     = $('#placesPetals');
  if (!ohBtn) return;

  spawnPlacesPetals(petalsEl);

  ohBtn.addEventListener('click', () => {
    initial.style.transition = 'opacity 0.38s ease, transform 0.38s var(--ease-out)';
    initial.style.opacity    = '0';
    initial.style.transform  = 'scale(0.82) translateY(12px)';
    setTimeout(() => {
      initial.style.display = 'none';
      typingSeq.classList.remove('hidden');
      placesTypeWriter(line1, 'Yesss. \u{1F62D}', 72, () => {
        setTimeout(() => {
          line2.classList.remove('hidden');
          placesTypeWriter(line2, 'Wanna know which places?', 62, () => {
            setTimeout(() => {
              showBtn.classList.remove('hidden');
              showBtn.style.opacity    = '0';
              showBtn.style.transition = 'opacity 0.7s ease';
              requestAnimationFrame(() => requestAnimationFrame(() => {
                showBtn.style.opacity = '1';
              }));
            }, 420);
          });
        }, 1000);
      });
    }, 400);
  });

  showBtn.addEventListener('click', () => {
    typingSeq.style.transition = 'opacity 0.35s ease';
    typingSeq.style.opacity    = '0';
    setTimeout(() => {
      typingSeq.style.display   = 'none';
      carouselWrap.classList.remove('hidden');
      carouselWrap.style.opacity    = '0';
      carouselWrap.style.transition = 'opacity 0.5s ease';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        carouselWrap.style.opacity = '1';
      }));
      setTimeout(() => initPlacesCarousel(), 80);
    }, 360);
  });
}

function initPlacesCarousel () {
  const viewport = $('#pcarViewport');
  const track    = $('#pcarTrack');
  const dotsWrap = $('#pcarDots');
  if (!viewport || !track) return;

  const items = $$('.pcar-item', track);
  const N     = items.length;
  let current = 0;
  let isDrag      = false;
  let pendingDrag = false;   /* touchstart registered, direction not yet known */
  let startX  = 0;
  let startY  = 0;
  let lastX   = 0;
  let velX    = 0;

  dotsWrap.innerHTML = '';
  items.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'pcar-dot' + (i === 0 ? ' active' : '');
    dotsWrap.appendChild(dot);
  });

  /* ── Inject particle containers into each card ── */
  items.forEach(item => {
    const card = item.querySelector('.pcar-card');
    if (card && !card.querySelector('.pcar-particles')) {
      const pt = document.createElement('div');
      pt.className = 'pcar-particles';
      card.appendChild(pt);
    }
  });

  /* type, count, extra per card index */
  const PCAR_CFG = [
    { type: 'sparkle',  count: 12 }, /* 0 – Mountains              */
    { type: 'confetti', count: 22 }, /* 1 – Disneyland              */
    { type: 'snow',     count: 26 }, /* 2 – Lapland                 */
    { type: 'petal',    count: 20 }, /* 3 – Kyoto                   */
    { type: 'star',     count: 22 }, /* 4 – Somewhere Under Stars   */
    { type: 'gold',     count: 18 }, /* 5 – Wedding Mandap          */
  ];
  const CONFETTI_COLS = ['#f48fb1','#d4a853','#a0d4f5','#b8f5a0','#f5c6a0','#c6a0f5','#ffb3c6'];

  function particleSize(type) {
    if (type === 'snow')     return [rand(3,7),    rand(3,7)];
    if (type === 'petal')    return [rand(8,14),   rand(6,10)];
    if (type === 'gold')     return [rand(9,15),   rand(7,11)];
    if (type === 'confetti') return [rand(5,9),    rand(4,7)];
    if (type === 'star')     return [rand(2,5),    rand(2,5)];
    /* sparkle */            return [rand(28,62),  rand(28,62)];
  }

  function spawnCardParticles(item, idx) {
    const pt = item.querySelector('.pcar-particles');
    if (!pt) return;
    pt.innerHTML = '';
    const cfg  = PCAR_CFG[idx]; if (!cfg) return;
    const card = item.querySelector('.pcar-card');
    const ch   = (card ? card.offsetHeight : 280) + 'px';

    for (var j = 0; j < cfg.count; j++) {
      var el   = document.createElement('div');
      el.className = 'pcar-particle pcar-p-' + cfg.type;
      var sz   = particleSize(cfg.type);
      var left = rand(3, 96);
      var sx   = (Math.random() - 0.5) * (cfg.type === 'petal' || cfg.type === 'gold' ? 90 : 44);
      var rot  = rand(80, 460);
      var dur  = cfg.type === 'star' ? rand(1.4, 3.2) : rand(3.2, 7.5);
      var del  = rand(0, cfg.type === 'star' ? 3.8 : 5.2);

      var css  = 'left:' + left + '%;'
               + 'width:' + sz[0] + 'px;height:' + sz[1] + 'px;'
               + 'animation-duration:' + dur + 's;'
               + 'animation-delay:-' + del + 's;'
               + '--sx:' + sx + 'px;--rot:' + rot + 'deg;--ch:' + ch + ';';

      if (cfg.type === 'confetti') {
        css += 'background:' + CONFETTI_COLS[j % CONFETTI_COLS.length] + ';opacity:0.82;';
      }
      if (cfg.type === 'star') {
        css += 'top:' + rand(8,80) + '%;left:' + rand(4,92) + '%;';
      }
      if (cfg.type === 'sparkle') {
        var sy = -rand(22, 58);
        css += 'top:' + rand(28,84) + '%;left:' + rand(4,88) + '%;--sy:' + sy + 'px;';
      }
      el.style.cssText = css;
      pt.appendChild(el);
    }
  }

  function clearCardParticles(item) {
    var pt = item.querySelector('.pcar-particles');
    if (pt) pt.innerHTML = '';
  }

  const getOffset = (idx, extra) => {
    extra = extra || 0;
    const vw = viewport.offsetWidth;
    const cw = items[0].offsetWidth;
    return (vw - cw) / 2 - idx * cw + extra;
  };

  const updateStates = () => {
    items.forEach((item, i) => {
      const dist      = Math.abs(i - current);
      const wasActive = item.classList.contains('active');
      item.classList.remove('active', 'adjacent');
      if (dist === 0) {
        item.classList.add('active');
        if (!wasActive) spawnCardParticles(item, i);
      } else {
        if (dist === 1) item.classList.add('adjacent');
        if (wasActive)  clearCardParticles(item);
      }
    });
    $$('.pcar-dot', dotsWrap).forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  };

  const snapTo = (idx, animate) => {
    if (animate === undefined) animate = true;
    current = Math.max(0, Math.min(N - 1, idx));
    track.style.transition = animate
      ? 'transform 0.44s cubic-bezier(0.25,0.46,0.45,0.94)'
      : 'none';
    track.style.transform = 'translateX(' + getOffset(current) + 'px)';
    updateStates();
  };

  const setLiveX = (x) => {
    track.style.transition = 'none';
    track.style.transform  = 'translateX(' + x + 'px)';
  };

  const onDragStart = (x, y) => {
    pendingDrag = true; isDrag = false;
    startX = x; startY = y || 0; lastX = x; velX = 0;
  };

  const onDragMove = (x) => {
    if (!isDrag) return;
    velX  = x - lastX; lastX = x;
    let offset = getOffset(current) + (x - startX);
    const maxOff = getOffset(0);
    const minOff = getOffset(N - 1);
    if (offset > maxOff) offset = maxOff + (offset - maxOff) * 0.22;
    if (offset < minOff) offset = minOff + (offset - minOff) * 0.22;
    setLiveX(offset);
  };

  const onDragEnd = () => {
    if (!isDrag) return;
    isDrag = false;
    viewport.classList.remove('dragging');
    const delta = lastX - startX;
    const thr   = items[0].offsetWidth * 0.2;
    let next    = current;
    if ((delta < -thr || velX < -6) && current < N - 1) next = current + 1;
    if ((delta >  thr || velX >  6) && current > 0)     next = current - 1;
    snapTo(next);
  };

  viewport.addEventListener('mousedown', (e) => {
    e.preventDefault(); onDragStart(e.clientX, e.clientY);
  });
  document.addEventListener('mousemove', (e) => { if (isDrag) onDragMove(e.clientX); });
  document.addEventListener('mouseup',   ()  => { if (isDrag) onDragEnd(); });
  viewport.addEventListener('dragstart', (e) => e.preventDefault());

  viewport.addEventListener('touchstart', (e) => {
    onDragStart(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (!pendingDrag && !isDrag) return;
    const cx = e.touches[0].clientX;
    const cy = e.touches[0].clientY;
    if (pendingDrag && !isDrag) {
      const adx = Math.abs(cx - startX);
      const ady = Math.abs(cy - startY);
      if (adx < 5 && ady < 5) return;           /* haven't moved enough yet */
      if (ady >= adx) { pendingDrag = false; return; } /* vertical — let card scroll */
      /* confirmed horizontal — lock into carousel drag */
      isDrag = true; pendingDrag = false;
      viewport.classList.add('dragging');
    }
    if (!isDrag) return;
    e.preventDefault();
    onDragMove(cx);
  }, { passive: false });

  viewport.addEventListener('touchend', () => {
    pendingDrag = false;
    if (isDrag) { onDragEnd(); window._carouselSwallowed = true; }
  });

  snapTo(0, false);
}

function placesTypeWriter (el, text, speed, onDone) {
  el.textContent = '';
  var i = 0;
  var tick = function() {
    if (i < text.length) { el.textContent += text[i++]; setTimeout(tick, speed); }
    else if (onDone) onDone();
  };
  tick();
}

function spawnPlacesPetals (ct) {
  if (!ct) return;
  for (var i = 0; i < 18; i++) {
    var p = document.createElement('div');
    p.className = 'places-petal';
    var size = rand(8, 20);
    Object.assign(p.style, {
      '--size':  size + 'px',
      '--left':  rand(0, 100) + '%',
      '--dur':   rand(11, 24) + 's',
      '--delay': rand(0, 20) + 's',
    });
    ct.appendChild(p);
  }
}

/* ============================================================
   PUZZLE TYPEWRITER
   ============================================================ */
function startPuzzleTypewriter (el) {
  var message = (
    'You know why I chose this picture? 🌌\n\n' +
    'Because when I imagined one perfect moment...\n' +
    'I didn\u2019t imagine a fancy place... Or an expensive trip...\n\n' +
    'I imagined a quiet night... A sky full of stars... And you sitting right beside me.\n\n' +
    'They say if you make a wish on a shooting star... It might come true.\n' +
    'I don\u2019t know if that\u2019s really how it works.\n\n' +
    'But if we\u2019re ever lucky enough to sit under a sky full of stars...\n' +
    'And a shooting star passes by...\n\n' +
    'Don\u2019t ask me what I wished for.\n\n' +
    'You\u2019ll already be sitting right beside me. 🤍✨\n\n' +
    'And honestly...\n\n' +
    'I think that would be the moment I\u2019d stop making wishes.\n' +
    'Because the one I wanted would already be there. 🌌\n\n' +
    'Maybe this picture isn\u2019t a memory today...\n' +
    'Maybe it\u2019s just a dream waiting for the right day. 🤍'
  );
  el.textContent = '';
  var tn     = document.createTextNode('');
  var cursor = document.createElement('span');
  cursor.className = 'pz-tw-cursor';
  el.appendChild(tn);
  el.appendChild(cursor);
  var i = 0;
  var SPEED = 8; /* ~3s for full message */
  function type() {
    if (i < message.length) {
      tn.textContent += message[i++];
      setTimeout(type, SPEED);
    } else {
      setTimeout(function() { cursor.remove(); }, 800);
    }
  }
  setTimeout(type, 400);
}

/* ============================================================
   CURSOR GLOW
   ============================================================ */
function initCursorGlow () {
  const glow = $('#cursorGlow');
  if (!glow) return;
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  const loop = () => {
    cx += (mx - cx) * 0.07;
    cy += (my - cy) * 0.07;
    glow.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  };
  loop();
}
