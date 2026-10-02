/* Retro arcade background: a rotating cabinet of mini games (runner, maze chomper,
   chicken invaders) that plays itself. A "GAME OVER" screen and a wipe separate games.
   All sprites are original pixel art. */
(function () {
  var cv = document.getElementById('retro-bg');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var hud = document.getElementById('retro-hud');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var PAL = {
    r: '#aa0000', R: '#ff5555', S: '#ffaa55', K: '#000000', B: '#5555ff', b: '#0000aa',
    Y: '#ffff55', C: '#55ffff', c: '#00aaaa', M: '#ff55ff', m: '#aa00aa', W: '#ffffff',
    O: '#ff8800', N: '#aa5500', n: '#552200', G: '#555555', g: '#00aa00'
  };

  function draw(rows, x, y) {
    x = Math.round(x); y = Math.round(y);
    for (var j = 0; j < rows.length; j++) {
      var row = rows[j];
      for (var i = 0; i < row.length; i++) {
        var ch = row.charAt(i);
        if (ch === '.') continue;
        ctx.fillStyle = PAL[ch];
        ctx.fillRect(x + i, y + j, 1, 1);
      }
    }
  }
  function recolor(rows, map) {
    return rows.map(function (r) {
      return r.replace(/./g, function (c) { return map[c] || c; });
    });
  }
  function rect(c, x, y, w, h) {
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }
  function pad(n, len) { var s = String(Math.floor(n)); while (s.length < len) s = '0' + s; return s; }

  var S = 4, W = 100, H = 100;

  /* ---------- shared starfield ---------- */
  var stars = [];
  function makeStars(maxY) {
    stars = [];
    for (var i = 0; i < Math.floor(W / 6); i++) {
      stars.push({ x: Math.random() * W, y: Math.random() * maxY, t: Math.random() * 6 });
    }
  }
  function drawStars(t, drift) {
    for (var s = 0; s < stars.length; s++) {
      var st = stars[s];
      if (drift) { st.y = (st.y + drift) % H; }
      ctx.fillStyle = (Math.floor(t * 2 + st.t) % 3 === 0) ? '#555555' : '#ffffff';
      ctx.fillRect(Math.floor(st.x), Math.floor(st.y), 1, 1);
    }
  }

  /* ================= GAME 1: RUNNER ================= */
  var HERO_BASE = [
    '...rrrr...', '..rRRRRr..', '.rRRRRRRr.', '..SSSSSS..', '..SKSSKS..', '..SSSSSS..',
    '...SSSS...', '.BBBBBBBB.', 'SBBBBBBBBS', 'S.BBYYBB.S', '..bbbbbb..'
  ];
  var LEGS = [
    ['..bb..bb..', '..bb..bb..', '.KKK..KKK.'],
    ['...bbbb...', '...bbbb...', '..KKKKKK..'],
    ['.bb....bb.', 'bb......bb', 'KK......KK']
  ];
  var GEM = ['...CC...', '..CWCC..', '.CWCCCC.', 'CCCCCCCC', 'ccCCCCcc', '.ccCCcc.', '..cccc..', '...cc...'];
  var GEM2 = recolor(GEM, { C: 'M', c: 'm' });
  var FIRE = [
    ['....Y...', '...YO...', '..YOO.Y.', '.YOORYO.', '.OORRROO', 'ORRRRROO', 'ORRYYRRO', '.ORRRRO.'],
    ['...Y....', '..YOY...', '.YOOO...', '.OORRY..', 'OORRROY.', 'ORRRRROO', 'ORYYRRRO', '.ORRRRO.']
  ];

  var runner = {
    label: 'GEMS', duration: 16, TILE: 16,
    reset: function () {
      this.t = 0; this.score = 0; this.scroll = 0; this.items = []; this.nextSpawn = 60;
      this.ground = H - this.TILE * 2;
      this.hero = { x: 0, y: 0, vy: 0, air: false, t: 0 };
      makeStars(this.ground - 20);
    },
    spawn: function (x) {
      var roll = Math.random();
      if (roll < 0.38) {
        this.items.push({ type: 'fire', x: x, lift: 0 });
        this.nextSpawn = x + 90 + Math.random() * 60;
      } else if (roll < 0.7) {
        this.items.push({ type: 'gem', x: x, lift: 2 + Math.random() * 4, alt: Math.random() < 0.5 });
        this.nextSpawn = x + 50 + Math.random() * 60;
      } else {
        this.items.push({ type: 'gem', x: x, lift: 22, alt: Math.random() < 0.5 });
        this.nextSpawn = x + 80 + Math.random() * 60;
      }
    },
    update: function (dt) {
      var hero = this.hero, items = this.items, GROUND = this.ground, heroH = 14;
      this.t += dt; this.scroll += 55 * dt;
      hero.x = Math.max(24, Math.min(W * 0.16, 120));
      hero.t += dt;
      var groundY = GROUND - heroH;
      if (!hero.air) hero.y = groundY;
      while (this.nextSpawn < this.scroll + W + 40) {
        this.spawn(this.nextSpawn < this.scroll ? this.scroll + W + 40 : this.nextSpawn);
      }
      var i, it;
      if (!hero.air) {
        for (i = 0; i < items.length; i++) {
          it = items[i];
          var gap = it.x - this.scroll - (hero.x + 10);
          var need = it.type === 'fire' ? gap < 14 && gap > 4 : (it.lift > 16 && gap < 12 && gap > 0);
          if (need) { hero.vy = -150; hero.air = true; break; }
        }
      }
      if (hero.air) {
        hero.vy += 420 * dt; hero.y += hero.vy * dt;
        if (hero.y >= groundY) { hero.y = groundY; hero.air = false; hero.vy = 0; }
      }
      for (var k = items.length - 1; k >= 0; k--) {
        var g = items[k], gx = g.x - this.scroll;
        if (gx < -20) { items.splice(k, 1); continue; }
        if (g.type === 'gem') {
          var gy = GROUND - 8 - g.lift;
          if (gx < hero.x + 10 && gx + 8 > hero.x && gy < hero.y + heroH && gy + 8 > hero.y) {
            items.splice(k, 1); this.score++;
          }
        }
      }
    },
    mountain: function (base, amp, freq, offset, color, par) {
      ctx.fillStyle = color;
      for (var x = 0; x < W; x++) {
        var wx = x + this.scroll * par;
        var h = base + amp * (Math.sin(wx * freq + offset) * 0.6 + Math.sin(wx * freq * 2.3 + offset * 1.7) * 0.4 + 1) / 2;
        ctx.fillRect(x, Math.round(this.ground - h), 1, Math.round(h));
      }
    },
    render: function () {
      var GROUND = this.ground, TILE = this.TILE, t = this.t;
      rect('#000', 0, 0, W, H);
      drawStars(t, 0);
      this.mountain(20, 40, 0.018, 1, '#000066', 0.12);
      this.mountain(8, 26, 0.03, 4, '#004444', 0.3);
      var off = Math.floor(this.scroll) % TILE;
      rect('#aa5500', 0, GROUND, W, H - GROUND);
      ctx.fillStyle = '#552200';
      for (var row = 0; row < 2; row++) {
        var y = GROUND + row * TILE;
        ctx.fillRect(0, y, W, 1); ctx.fillRect(0, y + 8, W, 1);
        for (var x = -off + (row % 2 ? 8 : 0) - TILE; x < W; x += TILE) {
          ctx.fillRect(x, y, 1, 8); ctx.fillRect(x + 8, y + 8, 1, 8);
        }
      }
      rect('#00aa00', 0, GROUND - 1, W, 1);
      for (var i = 0; i < this.items.length; i++) {
        var it = this.items[i], ix = it.x - this.scroll;
        if (it.type === 'fire') draw(FIRE[Math.floor(t * 8) % 2], ix, GROUND - 8);
        else draw(it.alt ? GEM2 : GEM, ix, GROUND - 8 - it.lift - (Math.floor(t * 4) % 2));
      }
      var hero = this.hero;
      var legs = hero.air ? LEGS[2] : LEGS[Math.floor(hero.t * 8) % 2];
      draw(HERO_BASE.concat(legs), hero.x, hero.y);
    }
  };

  /* ================= GAME 2: MAZE CHOMPER ================= */
  var GHOST = [
    '...RRRR...', '..RRRRRR..', '.RRRRRRRR.', '.RWWRRWWR.', '.RWKRRWKR.',
    '.RRRRRRRR.', '.RRRRRRRR.', '.RRRRRRRR.', '.RR.RR.RR.'
  ];
  var GHOST_SCARED = recolor(GHOST, { R: 'B', K: 'W' });

  var chomper = {
    label: 'SCORE', duration: 16, SPEED: 60,
    reset: function () {
      this.t = 0; this.score = 0; this.scroll = 0;
      this.cy = H - 34;
      this.pelletX = 260; this.state = 'chase'; this.stateT = 0; this.off = -30;
      this.popup = 0;
      makeStars(this.cy - 24);
    },
    update: function (dt) {
      this.t += dt; this.scroll += this.SPEED * dt; this.stateT += dt;
      this.px = Math.max(30, Math.min(W * 0.2, 130));
      this.score += this.SPEED * dt / 12 * 10;
      if (this.state === 'chase') {
        this.off = -30 + Math.sin(this.t * 3) * 3;
        if (this.scroll + this.px >= this.pelletX) {
          this.pelletX += 300 + Math.random() * 80;
          this.state = 'scared'; this.stateT = 0; this.off = 70;
        }
      } else if (this.state === 'scared') {
        this.off -= 15 * dt;
        if (this.off <= 12) { this.state = 'eaten'; this.stateT = 0; this.score += 200; this.popup = 0.8; }
      } else if (this.state === 'eaten') {
        if (this.stateT > 1.4) { this.state = 'chase'; this.stateT = 0; this.off = -30; }
      }
      if (this.popup > 0) this.popup -= dt;
    },
    render: function () {
      var t = this.t, cy = this.cy, px = this.px, i;
      rect('#000', 0, 0, W, H);
      drawStars(t, 0);
      /* corridor walls with scrolling stubs */
      var wallTop = cy - 16, wallBot = cy + 12;
      rect('#5555ff', 0, wallTop - 2, W, 2); rect('#0000aa', 0, wallTop - 4, W, 2);
      rect('#5555ff', 0, wallBot + 2, W, 2); rect('#0000aa', 0, wallBot + 4, W, 2);
      var sp = 90, so = Math.floor(this.scroll) % sp;
      for (var x = -so; x < W; x += sp) {
        rect('#5555ff', x, wallTop - 2, 2, 7);
        rect('#5555ff', x + 45, wallBot - 5, 2, 9);
      }
      /* dots ahead of pac-man (everything behind is already eaten) */
      var first = Math.ceil((this.scroll + px + 8) / 12) * 12;
      for (var wx = first; wx - this.scroll < W; wx += 12) {
        if (Math.abs(wx - this.pelletX) < 6) continue;
        rect('#ffaa55', wx - this.scroll, cy - 1, 2, 2);
      }
      var pxs = this.pelletX - this.scroll;
      if (pxs > px + 8 && Math.floor(t * 4) % 2 === 0) {
        rect('#ffaa55', pxs - 2, cy - 3, 5, 5);
      }
      /* ghost */
      var gx = px + this.off, gy = cy - 9, f = Math.floor(t * 6) % 2;
      if (this.state === 'chase') draw(GHOST.slice(0, 8).concat(f ? '.R.RR.RR.R' : '.RR.RR.RR.'), gx, gy);
      else if (this.state === 'scared') {
        var flash = this.off < 30 && Math.floor(t * 8) % 2 === 0;
        var gr = flash ? recolor(GHOST_SCARED, { B: 'W' }) : GHOST_SCARED;
        draw(gr, gx, gy);
      } else if (this.popup > 0) {
        ctx.fillStyle = '#55ffff'; ctx.font = '6px "Press Start 2P", monospace'; ctx.textAlign = 'center';
        ctx.fillText('200', Math.round(px + 12), Math.round(gy + 8));
      }
      /* pac-man */
      var mouth = (Math.sin(t * 12) + 1) / 2 * 0.75 + 0.05;
      var cx = px + 6, cyy = cy;
      ctx.fillStyle = '#ffff55';
      for (var dy = -6; dy <= 6; dy++) {
        for (var dx = -6; dx <= 6; dx++) {
          if (dx * dx + dy * dy > 38) continue;
          if (Math.abs(Math.atan2(dy, dx)) < mouth && dx > 0) continue;
          ctx.fillRect(Math.round(cx) + dx, cyy + dy, 1, 1);
        }
      }
    }
  };

  /* ================= GAME 3: CHICKEN INVADERS ================= */
  var CHICK = [
    ['....RRR....', '...WWWWW...', '..WKWWWKW..', '..WWWYWWW..', '.WWWWYWWWW.',
     'WWWWWWWWWWW', '.WWWWWWWWW.', '..WW...WW..', '..Y.....Y..'],
    ['....RRR....', '...WWWWW...', '..WKWWWKW..', '..WWWYWWW..', 'WWWWWYWWWWW',
     '.WWWWWWWWW.', '.WWWWWWWWW.', '..WW...WW..', '..Y.....Y..']
  ];
  var SHIP = [
    '.....C.....', '....CCC....', '....CWC....', '...CCCCC...', '.CCCCCCCCC.', 'CCCCCCCCCCC', 'CC..CCC..CC', 'M...MMM...M'
  ];

  var invaders = {
    label: 'SCORE', duration: 16, GAPX: 20, GAPY: 14,
    reset: function () {
      this.t = 0; this.score = 0; this.cool = 0;
      this.ship = { x: W / 2 };
      this.bullets = []; this.eggs = []; this.booms = [];
      this.newWave();
      makeStars(H);
    },
    newWave: function () {
      this.cols = Math.max(4, Math.min(12, Math.floor((W - 40) / 24)));
      this.GAPX = Math.min(30, (W - 40) / this.cols);
      this.rows = 3;
      this.alive = [];
      for (var i = 0; i < this.cols * this.rows; i++) this.alive.push(true);
      this.off = 0; this.dir = 1; this.gy = Math.max(30, H * 0.12);
    },
    pos: function (idx) {
      var c = idx % this.cols, r = Math.floor(idx / this.cols);
      var span = this.cols * this.GAPX;
      return { x: (W - span) / 2 + this.off + c * this.GAPX, y: this.gy + r * this.GAPY };
    },
    update: function (dt) {
      this.t += dt;
      var span = this.cols * this.GAPX, limit = Math.max(0, (W - span) / 2 - 8);
      this.off += this.dir * 16 * dt;
      if (Math.abs(this.off) > limit) { this.dir *= -1; this.off = Math.max(-limit, Math.min(limit, this.off)); this.gy += 6; }
      if (this.gy > H * 0.42) this.gy = Math.max(30, H * 0.12);
      var i, best = -1, bd = 1e9, p;
      for (i = 0; i < this.alive.length; i++) {
        if (!this.alive[i]) continue;
        p = this.pos(i);
        var d = Math.abs(p.x + 5 - this.ship.x);
        if (d < bd) { bd = d; best = i; }
      }
      if (best >= 0) {
        p = this.pos(best);
        var dx = p.x + 5 - this.ship.x;
        this.ship.x += Math.max(-60 * dt, Math.min(60 * dt, dx));
        this.cool -= dt;
        if (Math.abs(dx) < 3 && this.cool <= 0) {
          this.bullets.push({ x: this.ship.x, y: H - 32 });
          this.cool = 0.4;
        }
      } else if (this.booms.length === 0) {
        this.newWave();
      }
      for (var b = this.bullets.length - 1; b >= 0; b--) {
        var bu = this.bullets[b];
        bu.y -= 130 * dt;
        var hit = false;
        for (i = 0; i < this.alive.length && !hit; i++) {
          if (!this.alive[i]) continue;
          p = this.pos(i);
          if (bu.x >= p.x && bu.x <= p.x + 11 && bu.y >= p.y && bu.y <= p.y + 9) {
            this.alive[i] = false; this.score += 10; hit = true;
            this.booms.push({ x: p.x + 5, y: p.y + 4, t: 0 });
            if (Math.random() < 0.35) this.eggs.push({ x: p.x + 5, y: p.y + 9 });
          }
        }
        if (hit || bu.y < -4) this.bullets.splice(b, 1);
      }
      for (var e = this.eggs.length - 1; e >= 0; e--) {
        this.eggs[e].y += 38 * dt;
        if (this.eggs[e].y > H) this.eggs.splice(e, 1);
      }
      for (var m = this.booms.length - 1; m >= 0; m--) {
        this.booms[m].t += dt;
        if (this.booms[m].t > 0.35) this.booms.splice(m, 1);
      }
    },
    render: function () {
      var t = this.t, i;
      rect('#000', 0, 0, W, H);
      drawStars(t, 0.05);
      var f = Math.floor(t * 3) % 2;
      for (i = 0; i < this.alive.length; i++) {
        if (!this.alive[i]) continue;
        var p = this.pos(i);
        draw(CHICK[(f + i) % 2], p.x, p.y);
      }
      for (i = 0; i < this.eggs.length; i++) {
        rect('#ffffff', this.eggs[i].x - 1, this.eggs[i].y, 3, 3);
        rect('#ffffff', this.eggs[i].x, this.eggs[i].y + 3, 1, 1);
      }
      for (i = 0; i < this.bullets.length; i++) {
        rect('#ffff55', this.bullets[i].x, this.bullets[i].y, 1, 4);
      }
      for (i = 0; i < this.booms.length; i++) {
        var bm = this.booms[i], r = bm.t * 36;
        var cols = ['#ffff55', '#ff8800', '#ff5555'];
        for (var a = 0; a < 8; a++) {
          var ang = a * Math.PI / 4;
          rect(cols[a % 3], bm.x + Math.cos(ang) * r, bm.y + Math.sin(ang) * r, 2, 2);
        }
        /* a feather */
        rect('#ffffff', bm.x + r * 0.4, bm.y - r * 0.9 + bm.t * 30, 1, 2);
      }
      draw(SHIP, this.ship.x - 5, H - 30);
      if (Math.floor(t * 20) % 2) rect('#ff8800', this.ship.x, H - 22, 1, 2);
    }
  };

  /* ================= manager ================= */
  var games = [runner, chomper, invaders];
  var cur = games[Math.floor(Math.random() * games.length)];
  var state = 'play', timer = 0;
  var OVER = 2.6, WIPE = 0.45;

  function resize() {
    S = window.innerWidth < 600 ? 3 : 4;
    W = Math.ceil(window.innerWidth / S);
    H = Math.ceil(window.innerHeight / S);
    cv.width = W; cv.height = H;
    cur.reset();
  }

  function setHud() {
    if (hud) hud.textContent = cur.label + ' ' + pad(cur.score, cur.label === 'GEMS' ? 3 : 5);
  }

  function nextGame() {
    var i = games.indexOf(cur);
    cur = games[(i + 1) % games.length];
    cur.reset();
  }

  function text(str, y, size, color, shadow) {
    ctx.font = size + 'px "Press Start 2P", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    var x = Math.round(W / 2);
    ctx.fillStyle = shadow; ctx.fillText(str, x + 1, y + 1);
    ctx.fillStyle = color; ctx.fillText(str, x, y);
  }

  function overlay() {
    if (state === 'over') {
      ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0, 0, W, H);
      if (Math.floor(timer * 3) % 3 !== 2) text('GAME OVER', Math.round(H * 0.45), 10, '#ff5555', '#550000');
      text('SCORE ' + pad(cur.score, cur.label === 'GEMS' ? 3 : 5), Math.round(H * 0.45) + 14, 6, '#ffff55', '#555500');
    }
    var p = 0;
    if (state === 'wipeOut') p = Math.min(1, timer / WIPE);
    else if (state === 'wipeIn') p = 1 - Math.min(1, timer / WIPE);
    if (p > 0) {
      var bar = Math.ceil(H / 2 * p);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, bar); ctx.fillRect(0, H - bar, W, bar);
      if (p >= 0.98) { ctx.fillStyle = '#ff55ff'; ctx.fillRect(0, Math.floor(H / 2), W, 1); }
    }
  }

  function step(dt) {
    timer += dt;
    if (state === 'play') {
      cur.update(dt);
      if (timer > cur.duration) { state = 'over'; timer = 0; }
    } else if (state === 'over') {
      if (timer > OVER) { state = 'wipeOut'; timer = 0; }
    } else if (state === 'wipeOut') {
      if (timer > WIPE) { nextGame(); state = 'wipeIn'; timer = 0; }
    } else if (state === 'wipeIn') {
      cur.update(dt);
      if (timer > WIPE) { state = 'play'; timer = 0; }
    }
  }

  resize();
  window.addEventListener('resize', function () { resize(); if (reduce) { cur.render(); } });

  if (reduce) {
    cur = runner; cur.reset();
    for (var i = 0; i < 90; i++) cur.update(1 / 30);
    cur.render(); setHud();
    return;
  }

  cur.render(); setHud();

  var last = 0, running = true;
  document.addEventListener('visibilitychange', function () {
    running = !document.hidden; last = 0;
    if (running) requestAnimationFrame(loop);
  });
  function loop(now) {
    if (!running) return;
    var dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    step(dt);
    cur.render();
    overlay();
    setHud();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
