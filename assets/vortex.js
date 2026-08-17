/* ============================================================
   SpiralVortex — vanilla Canvas-2D port of the draft's
   react-three-fiber component (SpiralVortex.tsx).
   Same math: 10 glowing spiral curves × 400 points, warm
   orange-gold palette, additive blending, drifting camera rig.
   ============================================================ */
(function () {
  var canvas = document.getElementById("vortex");
  if (!canvas) return;
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var CURVES = 10, PTS = 400, FOV = 60 * Math.PI / 180;
  var ctx = canvas.getContext("2d");
  var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  var W, H;

  function resize() {
    var r = canvas.parentElement.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  addEventListener("resize", resize);

  /* per-curve colors — hueBase 25→50, matching the source */
  var colors = [];
  for (var i = 0; i < CURVES; i++) {
    colors.push({
      h: 25 + (i / CURVES) * 25,
      s: 85 + (i / CURVES) * 15,
      l: 45 + (i / CURVES) * 20,
      a: 0.3 + (i / CURVES) * 0.4
    });
  }

  var start = performance.now();

  function frame(now) {
    var T = (now - start) / 1000;

    /* group rotation (SpiralScene) */
    var rz = T * 0.03;
    var rx = Math.sin(T * 0.07) * 0.2 + 0.2;
    var ry = Math.cos(T * 0.09) * 0.15;
    var cz = Math.cos(rz), sz = Math.sin(rz);
    var cx = Math.cos(rx), sx = Math.sin(rx);
    var cy = Math.cos(ry), sy = Math.sin(ry);

    /* camera rig */
    var cycle = T * 0.06;
    var radius = 8 + Math.sin(T * 0.1) * 3;
    var camX = Math.sin(cycle) * radius * 0.6;
    var camY = Math.sin(cycle * 1.3) * 3 + Math.cos(T * 0.08) * 2;
    var camZ = Math.cos(cycle) * radius * 0.7 + 2;
    var lookX = Math.sin(T * 0.04) * 0.5, lookY = Math.cos(T * 0.05) * 0.3;

    /* lookAt basis */
    var fx = lookX - camX, fy = lookY - camY, fz = -camZ;
    var fl = Math.hypot(fx, fy, fz); fx /= fl; fy /= fl; fz /= fl;
    var rxv = fz * 0 - fy * 1 !== 0 || true ? { x: -fz * 0 + 0, y: 0, z: 0 } : null; // placeholder
    /* right = normalize(cross(forward, up)) with up=(0,1,0) */
    var rX = -fz, rY = 0, rZ = fx;
    var rl = Math.hypot(rX, rY, rZ) || 1; rX /= rl; rY /= rl; rZ /= rl;
    /* trueUp = cross(right, forward) */
    var uX = rY * fz - rZ * fy, uY = rZ * fx - rX * fz, uZ = rX * fy - rY * fx;

    var f = (H / 2) / Math.tan(FOV / 2);
    var dark = document.documentElement.classList.contains("dark");

    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = dark ? "lighter" : "source-over";
    ctx.lineWidth = 1;

    for (var c = 0; c < CURVES; c++) {
      var phase = (c / CURVES) * Math.PI * 2;
      var t = T * 0.35 + c * 0.25;
      var col = colors[c];
      ctx.strokeStyle = dark
        ? "hsla(" + col.h + "," + col.s + "%," + col.l + "%," + col.a * 0.9 + ")"
        : "hsla(" + col.h + ",30%,35%," + col.a * 0.5 + ")";
      ctx.beginPath();
      var started = false;

      for (var p = 0; p < PTS; p += 2) {  /* stride 2: half the math, visually identical */
        var frac = p / PTS;
        var angle = frac * Math.PI * 3 + phase + t * 0.4;
        var baseR = frac * 5 * (1 + 0.25 * Math.sin(t * 0.5 + frac * 2));
        var x = Math.cos(angle) * baseR * (1 + 0.1 * Math.sin(frac * 3 + t));
        var y = Math.sin(angle) * baseR * (1 + 0.1 * Math.cos(frac * 2.5 + t * 0.8));
        var z = (frac - 0.5) * 5 + Math.sin(frac * 2 + t * 0.3) * 1;

        /* group rotation: Rz then Rx then Ry (three.js XYZ euler ≈ close enough visually) */
        var x1 = x * cz - y * sz, y1 = x * sz + y * cz, z1 = z;
        var y2 = y1 * cx - z1 * sx, z2 = y1 * sx + z1 * cx;
        var x3 = x1 * cy + z2 * sy, z3 = -x1 * sy + z2 * cy;

        /* to camera space */
        var wx = x3 - camX, wy = y2 - camY, wz = z3 - camZ;
        var vx = wx * rX + wy * rY + wz * rZ;
        var vy = wx * uX + wy * uY + wz * uZ;
        var vz = wx * fx + wy * fy + wz * fz;
        if (vz < 0.5) { started = false; continue; }  /* behind camera */

        var sxp = W / 2 + (vx * f) / vz;
        var syp = H / 2 - (vy * f) / vz;
        if (!started) { ctx.moveTo(sxp, syp); started = true; }
        else ctx.lineTo(sxp, syp);
      }
      ctx.stroke();
    }

    if (!reduced) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
