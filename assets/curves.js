/* ============================================================
   DancingCurves — vanilla port of the draft's framer-motion
   component: three fixed SVGs at 15% opacity whose path `d`
   morphs between keyframes; container drift lives in CSS.
   ============================================================ */
(function () {
  var mount = document.getElementById("curves");
  if (!mount) return;
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* keyframes lifted verbatim from DancingCurves.tsx */
  var CURVES = [
    {
      cls: "c1", viewBox: "0 0 900 600", width: 2, dash: null, color: "primary",
      dur: 16,
      keys: [
        "M0 300 Q 200 100, 400 300 T 800 300",
        "M0 250 Q 250 450, 450 250 T 800 350",
        "M0 350 Q 150 150, 350 350 T 800 250",
        "M0 300 Q 200 100, 400 300 T 800 300"
      ]
    },
    {
      cls: "c2", viewBox: "0 0 700 500", width: 1.5, dash: null, color: "primary",
      dur: 14,
      keys: [
        "M0 250 C 150 100, 300 400, 450 200 S 650 350, 700 250",
        "M0 200 C 100 350, 350 50, 500 300 S 600 150, 700 300",
        "M0 300 C 200 150, 250 350, 400 150 S 700 400, 700 200",
        "M0 250 C 150 100, 300 400, 450 200 S 650 350, 700 250"
      ]
    },
    {
      cls: "c3", viewBox: "0 0 800 400", width: 1, dash: "8 12", color: "primary",
      dur: 18,
      keys: [
        "M0 200 Q 200 50, 400 200 Q 600 350, 800 200",
        "M0 150 Q 250 350, 450 150 Q 550 50, 800 250",
        "M0 250 Q 150 100, 350 250 Q 650 300, 800 150",
        "M0 200 Q 200 50, 400 200 Q 600 350, 800 200"
      ]
    }
  ];

  var NS = "http://www.w3.org/2000/svg";
  var anims = [];

  CURVES.forEach(function (c) {
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", c.viewBox);
    svg.setAttribute("fill", "none");
    svg.setAttribute("class", c.cls);
    var path = document.createElementNS(NS, "path");
    path.setAttribute("d", c.keys[0]);
    path.setAttribute("stroke", "hsl(var(--primary))");
    path.setAttribute("stroke-width", c.width);
    path.setAttribute("stroke-linecap", "round");
    if (c.dash) path.setAttribute("stroke-dasharray", c.dash);
    svg.appendChild(path);
    mount.appendChild(svg);

    /* pre-parse keyframes into [commands…, numbers[]] pairs */
    var parsed = c.keys.map(function (d) { return d.match(/-?\d+\.?\d*/g).map(Number); });
    var tmpl = c.keys[0].replace(/-?\d+\.?\d*/g, "%");
    anims.push({ path: path, parsed: parsed, tmpl: tmpl, dur: c.dur * 1000 });
  });

  function ease(u) { return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }

  var start = performance.now();
  function frame(now) {
    var el = now - start;
    anims.forEach(function (a) {
      var segs = a.parsed.length - 1;                    /* 3 transitions */
      var u = (el % a.dur) / a.dur * segs;
      var k = Math.floor(u), fr = ease(u - k);
      var A = a.parsed[k], B = a.parsed[k + 1];
      var vals = A.map(function (v, i) { return v + (B[i] - v) * fr; });
      var i = 0;
      a.path.setAttribute("d", a.tmpl.replace(/%/g, function () { return vals[i++].toFixed(1); }));
    });
    if (!reduced) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
