/* Retro side-scroller background: an original pixel hero runs, hops fire pits and grabs gems. */
(function () {
  var cv = document.getElementById('retro-bg');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var hudGems = document.getElementById('retro-gems');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var PAL = {
    r: '#aa0000', R: '#ff5555', S: '#ffaa55', K: '#000000', B: '#5555ff', b: '#0000aa',
    Y: '#ffff55', C: '#55ffff', c: '#00aaaa', M: '#ff55ff', m: '#aa00aa', W: '#ffffff',
    O: '#ff8800', N: '#aa5500', n: '#552200', G: '#555555', g: '#00aa00'
  };
  function sprite(rows) { return rows; }

  var HERO_BASE = [
    '...rrrr...',
    '..rRRRRr..',
    '.rRRRRRRr.',
    '..SSSSSS..',
    '..SKSSKS..',
    '..SSSSSS..',
    '...SSSS...',
    '.BBBBBBBB.',
    'SBBBBBBBBS',
    'S.BBYYBB.S',
    '..bbbbbb..'
  ];
  var LEGS = [
    ['..bb..bb..', '..bb..bb..', '.KKK..KKK.'],
    ['...bbbb...', '...bbbb...', '..KKKKKK..'],
    ['.bb....bb.', 'bb......bb', 'KK......KK']
  ];
  var ARMS_UP = HERO_BASE.slice();
  ARMS_UP[8] = 'SBBBBBBBBS';
  ARMS_UP[9] = 'S.BBYYBB.S';

  var GEM = [
    '...CC...', '..CWCC..', '.CWCCCC.', 'CCCCCCCC', 'ccCCCCcc', '.ccCCcc.', '..cccc..', '...cc...'
  ];
  var GEM2 = GEM.map(function (r) {
    return r.replace(/C/g, 'M').replace(/c/g, 'm');
  });
  var FIRE = [
    [
      '....Y...', '...YO...', '..YOO.Y.', '.YOORYO.', '.OORRROO', 'ORRRRROO', 'ORRYYRRO', '.ORRRRO.'
    ], [
      '...Y....', '..YOY...', '.YOOO...', '.OORRY..', 'OORRROY.', 'ORRRRROO', 'ORYYRRRO', '.ORRRRO.'
    ]
  ];

  function draw(rows, x, y) {
    for (var j = 0; j < rows.length; j++) {
      var row = rows[j];
      for (var i = 0; i < row.length; i++) {
        var ch = row.charAt(i);
        if (ch === '.') continue;
        ctx.fillStyle = PAL[ch];
        ctx.fillRect(Math.round(x) + i, Math.round(y) + j, 1, 1);
      }
    }
  }

  var S = 3, W, H, GROUND, TILE = 16;
  var stars = [];
  function resize() {
    S = window.innerWidth < 600 ? 3 : 4;
    W = Math.ceil(window.innerWidth / S);
    H = Math.ceil(window.innerHeight / S);
    cv.width = W; cv.height = H;
    GROUND = H - TILE * 2;
    stars = [];
    for (var i = 0; i < Math.floor(W / 6); i++) {
      stars.push({ x: Math.random() * W, y: Math.random() * (GROUND - 20), t: Math.random() * 6 });
    }
  }
  resize();
  window.addEventListener('resize', resize);

  /* world */
  var scroll = 0, SPEED = 55;
  var items = [];
  var nextSpawn = 0;
  var gems = 0;
  var hero = { x: 0, y: 0, vy: 0, air: false, t: 0 };

  function spawn(x) {
    var roll = Math.random();
    if (roll < 0.38) {
      items.push({ type: 'fire', x: x, w: 8, h: 8 });
      nextSpawn = x + 90 + Math.random() * 60;
    } else if (roll < 0.7) {
      items.push({ type: 'gem', x: x, lift: 2 + Math.random() * 4, alt: Math.random() < 0.5, w: 8, h: 8 });
      nextSpawn = x + 50 + Math.random() * 60;
    } else {
      /* a floating gem that needs a hop to reach */
      items.push({ type: 'gem', x: x, lift: 22, alt: Math.random() < 0.5, w: 8, h: 8 });
      nextSpawn = x + 80 + Math.random() * 60;
    }
  }

  function heroX() { return Math.max(24, Math.min(W * 0.16, 120)); }

  function update(dt) {
    scroll += SPEED * dt;
    hero.x = heroX();
    hero.t += dt;
    var heroH = 14;
    var groundY = GROUND - heroH;
    if (!hero.air) hero.y = groundY;

    while (nextSpawn < scroll + W + 40) spawn(nextSpawn < scroll ? scroll + W + 40 : nextSpawn);

    /* decide whether to hop */
    if (!hero.air) {
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        var sx = it.x - scroll;
        var gap = sx - (hero.x + 10);
        var needHop = it.type === 'fire' ? gap < 14 && gap > 4 : (it.lift > 16 && gap < 12 && gap > 0);
        if (needHop) { hero.vy = -150; hero.air = true; break; }
      }
    }
    if (hero.air) {
      hero.vy += 420 * dt;
      hero.y += hero.vy * dt;
      if (hero.y >= groundY) { hero.y = groundY; hero.air = false; hero.vy = 0; }
    }

    /* collect gems */
    for (var k = items.length - 1; k >= 0; k--) {
      var g = items[k];
      var gx = g.x - scroll;
      if (gx < -20) { items.splice(k, 1); continue; }
      if (g.type === 'gem') {
        var gy = GROUND - 8 - g.lift;
        if (gx < hero.x + 10 && gx + 8 > hero.x && gy < hero.y + heroH && gy + 8 > hero.y) {
          items.splice(k, 1);
          gems++;
          if (hudGems) hudGems.textContent = ('00' + gems).slice(-3);
        }
      }
    }
  }

  function mountain(base, amp, freq, offset, color, par) {
    ctx.fillStyle = color;
    for (var x = 0; x < W; x++) {
      var wx = x + scroll * par;
      var h = base + amp * (Math.sin(wx * freq + offset) * 0.6 + Math.sin(wx * freq * 2.3 + offset * 1.7) * 0.4 + 1) / 2;
      ctx.fillRect(x, Math.round(GROUND - h), 1, Math.round(h));
    }
  }

  function render(time) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    for (var s = 0; s < stars.length; s++) {
      var st = stars[s];
      ctx.fillStyle = (Math.floor(time / 500 + st.t) % 3 === 0) ? '#555555' : '#ffffff';
      ctx.fillRect(Math.floor(st.x), Math.floor(st.y), 1, 1);
    }
    mountain(20, 40, 0.018, 1, '#000066', 0.12);
    mountain(8, 26, 0.03, 4, '#004444', 0.3);

    /* brick ground */
    var off = Math.floor(scroll) % TILE;
    ctx.fillStyle = '#aa5500';
    ctx.fillRect(0, GROUND, W, H - GROUND);
    ctx.fillStyle = '#552200';
    for (var row = 0; row < 2; row++) {
      var y = GROUND + row * TILE;
      ctx.fillRect(0, y, W, 1);
      ctx.fillRect(0, y + 8, W, 1);
      for (var x = -off + (row % 2 ? 8 : 0) - TILE; x < W; x += TILE) {
        ctx.fillRect(x, y, 1, 8);
        ctx.fillRect(x + 8, y + 8, 1, 8);
      }
    }
    ctx.fillStyle = '#00aa00';
    ctx.fillRect(0, GROUND - 1, W, 1);

    for (var i = 0; i < items.length; i++) {
      var it = items[i], ix = it.x - scroll;
      if (it.type === 'fire') draw(FIRE[Math.floor(time / 120) % 2], ix, GROUND - 8);
      else draw(it.alt ? GEM2 : GEM, ix, GROUND - 8 - it.lift - (Math.floor(time / 250) % 2));
    }

    var legs = hero.air ? LEGS[2] : LEGS[Math.floor(hero.t * 8) % 2];
    var body = hero.air ? ARMS_UP : HERO_BASE;
    draw(body.concat(legs), hero.x, hero.y);
  }

  if (reduce) {
    /* static frame, no animation */
    scroll = 60; nextSpawn = 0; update(0.01); render(0);
    window.addEventListener('resize', function () { render(0); });
    return;
  }

  var last = 0, running = true;
  document.addEventListener('visibilitychange', function () { running = !document.hidden; last = 0; if (running) requestAnimationFrame(loop); });
  function loop(t) {
    if (!running) return;
    var dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
    last = t;
    update(dt);
    render(t);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
