/* ============================================================
   Chladni covers — album art generated from the cymatics
   plate equation, rendered as a live particle simulation
   (inspired by pettaboy.github.io/cymaticssimulator_chladni).

   f(x,y) = a·sin(πnx)·sin(πmy) + b·sin(πmx)·sin(πny)

   Each album seeds its own (m, n, a, b) from its id, so covers
   are stable across visits; every few seconds the parameters
   morph to a new random combination and the "sand" re-settles.
   Usage: <canvas class="chladni" data-seed="album-id"></canvas>
   ============================================================ */
(function () {
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- seeded RNG (mulberry32 over a string hash) ---- */
  function hash(str) {
    var h = 1779033703;
    for (var i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return h >>> 0;
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* Every album gets a FIXED pair of modes and alternates between them —
     hand-picked so no two albums share a figure. |a| = |b| = 1 keeps the
     classic symmetric Chladni look. Unknown seeds fall back to a seeded pair. */
  var MODES = {
    "robot-kinematics": [{ m: 1, n: 3, a: 1, b: 1 },  { m: 2, n: 5, a: 1, b: 1 }],
    "robot-perception": [{ m: 2, n: 3, a: 1, b: 1 },  { m: 1, n: 5, a: 1, b: -1 }],
    "motion-planning":  [{ m: 3, n: 4, a: 1, b: 1 },  { m: 2, n: 4, a: 1, b: -1 }],
    "control-systems":  [{ m: 1, n: 2, a: 1, b: -1 }, { m: 3, n: 5, a: 1, b: -1 }],
    "slam-mapping":     [{ m: 2, n: 6, a: 1, b: 1 },  { m: 4, n: 5, a: 1, b: -1 }]
  };
  function randParams(rng) {
    var m = 1 + Math.floor(rng() * 7);
    var n = 1 + Math.floor(rng() * 7);
    if (m === n) n = (n % 7) + 1;
    return { m: m, n: n, a: 1, b: rng() < 0.5 ? -1 : 1 };
  }

  /* one physics step — the simulator's own rule: a random walk whose step
     is proportional to vibration × |f|. Grains shaken hard where the plate
     vibrates, barely at all near nodal lines: the equilibrium is a diffuse
     sand band (bright core, soft halo, stray dust in the cells) rather
     than a hard geometric curve. */
  function physics(px, py, count, m, n, a, b, step) {
    var PI = Math.PI;
    for (var i = 0; i < count; i++) {
      var x = px[i], y = py[i];
      var f = a * Math.sin(PI * n * x) * Math.sin(PI * m * y)
            + b * Math.sin(PI * m * x) * Math.sin(PI * n * y);
      var v = Math.abs(f) * step;
      x += (Math.random() - 0.5) * v;
      y += (Math.random() - 0.5) * v;
      if (x < 0) x = -x; else if (x >= 1) x = 2 - x - 1e-4;
      if (y < 0) y = -y; else if (y >= 1) y = 2 - y - 1e-4;
      px[i] = x; py[i] = y;
    }
  }

  var SIZE = 360;           /* sim + canvas resolution (square) */

  /* the simulator's two global sliders */
  var VIBRATION = 0.20;     /* vibration strength, 0..1 — width/liveliness of the sand lines */
  var PARTICLES = 1.0;      /* number of particles, 0..1 of MAX_COUNT */

  var MAX_COUNT = 30000;
  var COUNT = Math.round(MAX_COUNT * PARTICLES);
  var STEP = VIBRATION * 0.09;            /* walk amplitude derived from vibration strength */
  var MORPH_EVERY = 12000;  /* ms between new parameter combos */
  var sims = [];

  function makeSim(canvas) {
    var seedStr = canvas.dataset.seed || "zdisco";
    var rng = mulberry32(hash(seedStr));

    canvas.width = SIZE; canvas.height = SIZE;
    var ctx = canvas.getContext("2d", { alpha: false });

    /* per-album color from the seed — always inside the site's coffee palette:
       hue 22-46 (caramel..copper), moderate saturation, latte-to-cream lightness */
    var hue = 22 + Math.floor(rng() * 24);
    var sat = 34 + Math.floor(rng() * 30);
    var lit = 66 + Math.floor(rng() * 16);
    var pair = MODES[seedStr] || [randParams(rng), randParams(rng)];
    var cur = pair[0], nxt = pair[1];
    var lastSwitch = performance.now() - rng() * MORPH_EVERY;  /* stagger the clocks */

    /* particles: Float32 x,y in [0,1) */
    var px = new Float32Array(COUNT), py = new Float32Array(COUNT);
    for (var i = 0; i < COUNT; i++) { px[i] = rng(); py[i] = rng(); }

    /* warm-up: settle the sand before the first paint (math only, no drawing) */
    for (var it = 0; it < 400; it++) physics(px, py, COUNT, cur.m, cur.n, cur.a, cur.b, STEP);

    /* paint the plate */
    ctx.fillStyle = "#0d0b09";
    ctx.fillRect(0, 0, SIZE, SIZE);

    return {
      canvas: canvas, ctx: ctx, hue: hue, sat: sat, lit: lit, rng: rng,
      cur: cur, nxt: nxt, lastSwitch: lastSwitch,
      px: px, py: py, visible: false
    };
  }

  function step(s, now) {
    /* alternate between the album's two fixed modes every MORPH_EVERY ms;
       the sand visibly crawls from one figure to the other */
    if (now - s.lastSwitch > MORPH_EVERY) {
      var t = s.cur; s.cur = s.nxt; s.nxt = t;
      s.lastSwitch = now;
    }

    var ctx = s.ctx, px = s.px, py = s.py;
    physics(px, py, COUNT, s.cur.m, s.cur.n, s.cur.a, s.cur.b, STEP);

    /* full clear each frame — grains render as individual specks, no trails */
    ctx.fillStyle = "#0d0b09";
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = "hsl(" + s.hue + " " + s.sat + "% " + s.lit + "%)";
    for (var i = 0; i < COUNT; i++) {
      ctx.fillRect((px[i] * SIZE) | 0, (py[i] * SIZE) | 0, 1, 1);
    }
  }

  function init() {
    var canvases = document.querySelectorAll("canvas.chladni");
    if (!canvases.length) return;
    canvases.forEach(function (c) { sims.push(makeSim(c)); });

    /* only simulate covers that are on screen */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var s = sims.find(function (x) { return x.canvas === e.target; });
        if (s) s.visible = e.isIntersecting;
      });
    }, { threshold: 0.05 });
    sims.forEach(function (s) { io.observe(s.canvas); });

    if (reduced) {
      /* no animation: run the sim to convergence once, offscreen */
      sims.forEach(function (s) {
        for (var it = 0; it < 240; it++) step(s, it * 16);
      });
      return;
    }
    function loop(now) {
      sims.forEach(function (s) { if (s.visible) step(s, now); });
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
