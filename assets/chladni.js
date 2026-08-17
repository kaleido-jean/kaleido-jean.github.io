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

  /* random 4-param combo: m, n integers (like the simulator), a, b amplitudes */
  function randParams(rng) {
    var m = 1 + Math.floor(rng() * 8);          /* 1..8 */
    var n = 1 + Math.floor(rng() * 8);
    if (m === n) n = (n % 8) + 1;               /* degenerate m=n gives blank plate */
    var a = 0.4 + rng() * 0.6;                  /* 0.4..1 */
    var b = (0.4 + rng() * 0.6) * (rng() < 0.5 ? -1 : 1);
    return { m: m, n: n, a: a, b: b };
  }

  var SIZE = 280;          /* sim + canvas resolution (square) */
  var COUNT = 3200;        /* particles per cover */
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
    var morphT = 1;                    /* 0..1 progress of cur→nxt blend */
    var lastSwitch = -(rng() * MORPH_EVERY);   /* stagger the morph clocks */

    /* particles: Float32 x,y in [0,1) */
    var px = new Float32Array(COUNT), py = new Float32Array(COUNT);
    for (var i = 0; i < COUNT; i++) { px[i] = rng(); py[i] = rng(); }

    /* warm-up: settle the sand before the first paint (math only, no drawing)
       — uses a higher step so the pattern is already formed when the cover appears */
    var PI = Math.PI;
    for (var it = 0; it < 250; it++) {
      for (var j = 0; j < COUNT; j++) {
        var wx = px[j], wy = py[j];
        var wf = cur.a * Math.sin(PI * cur.n * wx) * Math.sin(PI * cur.m * wy)
               + cur.b * Math.sin(PI * cur.m * wx) * Math.sin(PI * cur.n * wy);
        var wv = Math.abs(wf) * 0.05;
        wx += (Math.random() - 0.5) * wv;
        wy += (Math.random() - 0.5) * wv;
        if (wx < 0) wx = -wx; else if (wx >= 1) wx = 2 - wx - 1e-4;
        if (wy < 0) wy = -wy; else if (wy >= 1) wy = 2 - wy - 1e-4;
        px[j] = wx; py[j] = wy;
      }
    }

    /* paint the plate */
    ctx.fillStyle = "#0d0b09";
    ctx.fillRect(0, 0, SIZE, SIZE);

    return {
      canvas: canvas, ctx: ctx, hue: hue, sat: sat, lit: lit, rng: rng,
      cur: cur, nxt: nxt, morphT: morphT, lastSwitch: lastSwitch,
      px: px, py: py, visible: false, settled: 0
    };
  }

  function ease(u) { return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }

  function step(s, now) {
    /* parameter morphing: blend cur→nxt, then pick a fresh combo */
    if (now - s.lastSwitch > MORPH_EVERY && s.morphT >= 1) {
      s.cur = s.nxt; s.nxt = randParams(s.rng);
      s.morphT = 0; s.lastSwitch = now;
    }
    if (s.morphT < 1) s.morphT = Math.min(1, s.morphT + 0.012);
    var k = ease(s.morphT);
    var m = s.cur.m + (s.nxt.m - s.cur.m) * k;   /* fractional m,n mid-morph is fine */
    var n = s.cur.n + (s.nxt.n - s.cur.n) * k;
    var a = s.cur.a + (s.nxt.a - s.cur.a) * k;
    var b = s.cur.b + (s.nxt.b - s.cur.b) * k;

    var ctx = s.ctx, px = s.px, py = s.py;

    /* fade previous frame — leaves sand trails like the plate */
    ctx.fillStyle = "rgba(13,11,9,0.22)";
    ctx.fillRect(0, 0, SIZE, SIZE);

    var PI = Math.PI, STEP = 0.018;   /* vibration strength — kept low for crisp nodal lines */
    ctx.fillStyle = "hsl(" + s.hue + " " + s.sat + "% " + s.lit + "%)";
    for (var i = 0; i < COUNT; i++) {
      var x = px[i], y = py[i];
      var f = a * Math.sin(PI * n * x) * Math.sin(PI * m * y)
            + b * Math.sin(PI * m * x) * Math.sin(PI * n * y);
      var v = Math.abs(f);                       /* vibration strength at this point */
      /* random walk scaled by vibration — particles settle on nodal lines (v≈0) */
      x += (Math.random() - 0.5) * STEP * v;
      y += (Math.random() - 0.5) * STEP * v;
      /* keep on the plate */
      if (x < 0) x = -x; else if (x >= 1) x = 2 - x - 1e-4;
      if (y < 0) y = -y; else if (y >= 1) y = 2 - y - 1e-4;
      px[i] = x; py[i] = y;
      ctx.fillRect((x * SIZE) | 0, (y * SIZE) | 0, 1.5, 1.5);
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
