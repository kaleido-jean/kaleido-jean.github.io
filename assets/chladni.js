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

  /* random 4-param combo: m, n integers, |a| = |b| = 1 for the classic
     symmetric Chladni figures (what makes the simulator's patterns regular) */
  function randParams(rng) {
    var m = 1 + Math.floor(rng() * 7);          /* 1..7 */
    var n = 1 + Math.floor(rng() * 7);
    if (m === n) n = (n % 7) + 1;               /* m=n degenerates to a blank plate */
    return { m: m, n: n, a: 1, b: rng() < 0.5 ? -1 : 1 };
  }

  /* one physics step: Newton projection onto the nodal set f = 0.
     p -= f·∇f/|∇f|²  snaps particles onto the curve — this is what makes
     the lines razor-sharp; a tiny jitter keeps the sand look alive. */
  function physics(px, py, count, m, n, a, b, jitter) {
    var PI = Math.PI, CLAMP = 0.012;
    for (var i = 0; i < count; i++) {
      var x = px[i], y = py[i];
      var snx = Math.sin(PI * n * x), smy = Math.sin(PI * m * y);
      var smx = Math.sin(PI * m * x), sny = Math.sin(PI * n * y);
      var f = a * snx * smy + b * smx * sny;
      var gx = a * PI * n * Math.cos(PI * n * x) * smy + b * PI * m * Math.cos(PI * m * x) * sny;
      var gy = a * PI * m * snx * Math.cos(PI * m * y) + b * PI * n * smx * Math.cos(PI * n * y);
      var g2 = gx * gx + gy * gy + 1e-6;
      var k = f / g2;
      var dx = -k * gx, dy = -k * gy;
      if (dx > CLAMP) dx = CLAMP; else if (dx < -CLAMP) dx = -CLAMP;
      if (dy > CLAMP) dy = CLAMP; else if (dy < -CLAMP) dy = -CLAMP;
      x += dx + (Math.random() - 0.5) * jitter;
      y += dy + (Math.random() - 0.5) * jitter;
      if (x < 0) x = -x; else if (x >= 1) x = 2 - x - 1e-4;
      if (y < 0) y = -y; else if (y >= 1) y = 2 - y - 1e-4;
      px[i] = x; py[i] = y;
    }
  }

  var SIZE = 360;          /* sim + canvas resolution (square) */
  var COUNT = 9000;        /* fine sand: many small grains, not few big ones */
  var MORPH_EVERY = 12000; /* ms between new parameter combos — long, so low vibration can settle */
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
    var lit = 58 + Math.floor(rng() * 16);
    var cur = randParams(rng);
    var nxt = randParams(rng);
    var lastSwitch = performance.now() - rng() * MORPH_EVERY;  /* stagger the clocks */

    /* particles: Float32 x,y in [0,1) */
    var px = new Float32Array(COUNT), py = new Float32Array(COUNT);
    for (var i = 0; i < COUNT; i++) { px[i] = rng(); py[i] = rng(); }

    /* warm-up: settle the sand before the first paint (math only, no drawing) */
    for (var it = 0; it < 80; it++) physics(px, py, COUNT, cur.m, cur.n, cur.a, cur.b, 0.004);

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
    /* switch to a fresh integer mode every MORPH_EVERY ms — no fractional
       blending (mid-blend patterns aren't eigenmodes and look messy);
       the sand visibly crawls from the old figure to the new one instead */
    if (now - s.lastSwitch > MORPH_EVERY) {
      s.cur = s.nxt; s.nxt = randParams(s.rng);
      s.lastSwitch = now;
    }

    var ctx = s.ctx, px = s.px, py = s.py;
    physics(px, py, COUNT, s.cur.m, s.cur.n, s.cur.a, s.cur.b, 0.0035);

    /* fade previous frame — leaves faint sand trails */
    ctx.fillStyle = "rgba(13,11,9,0.28)";
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
