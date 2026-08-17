/* theme toggle + cover art + album rendering + shuffle */
(function () {
  /* ---------- theme ---------- */
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  if (saved === "dark" || saved === "light") root.dataset.theme = saved;
  else root.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  window.toggleTheme = function () {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  };

  /* ---------- procedural cover art ---------- */
  function coverSVG(art, hue) {
    var c1 = "hsl(" + hue + " 85% 62%)";
    var c2 = "hsl(" + ((hue + 50) % 360) + " 85% 60%)";
    var s = "";
    if (art === "arm") {
      s = '<path d="M20 84 L40 50 L62 38 L80 20" fill="none" stroke="' + c1 + '" stroke-width="5" stroke-linecap="round"/>' +
          '<circle cx="40" cy="50" r="6" fill="' + c2 + '"/><circle cx="62" cy="38" r="6" fill="' + c2 + '"/>' +
          '<circle cx="80" cy="20" r="4" fill="' + c1 + '"/><rect x="12" y="82" width="26" height="6" rx="3" fill="' + c2 + '"/>';
    } else if (art === "wave") {
      for (var i = 0; i < 5; i++)
        s += '<path d="M6 ' + (30 + i * 12) + ' Q 30 ' + (10 + i * 12) + ' 52 ' + (30 + i * 12) + ' T 98 ' + (30 + i * 12) + '" fill="none" stroke="' + (i % 2 ? c2 : c1) + '" stroke-width="2.5" opacity="' + (1 - i * 0.14) + '"/>';
    } else if (art === "grid") {
      for (var g = 12; g <= 88; g += 19)
        s += '<line x1="' + g + '" y1="10" x2="' + g + '" y2="90" stroke="' + c1 + '" stroke-width="1.4" opacity=".6"/>' +
             '<line x1="10" y1="' + g + '" x2="90" y2="' + g + '" stroke="' + c2 + '" stroke-width="1.4" opacity=".45"/>';
      s += '<circle cx="50" cy="50" r="13" fill="none" stroke="' + c1 + '" stroke-width="3"/>';
    } else if (art === "rings") {
      for (var r = 10; r <= 42; r += 8)
        s += '<circle cx="50" cy="50" r="' + r + '" fill="none" stroke="' + (r % 16 === 2 ? c2 : c1) + '" stroke-width="2.4" opacity="' + (1 - r / 60) + '"/>';
      s += '<circle cx="50" cy="50" r="4" fill="' + c2 + '"/>';
    } else { /* circuit */
      s = '<path d="M14 20 H48 V48 H84 M48 48 V82 M30 82 H70 M84 30 V70" fill="none" stroke="' + c1 + '" stroke-width="3.5" stroke-linecap="round"/>' +
          '<circle cx="14" cy="20" r="4.5" fill="' + c2 + '"/><circle cx="84" cy="30" r="4.5" fill="' + c2 + '"/>' +
          '<circle cx="84" cy="70" r="4.5" fill="' + c1 + '"/><circle cx="30" cy="82" r="4.5" fill="' + c1 + '"/>';
    }
    return '<svg viewBox="0 0 100 100" aria-hidden="true">' + s + "</svg>";
  }

  function coverEl(album, large) {
    var d = document.createElement("div");
    d.className = "cover" + (large ? " cover-lg" : "");
    d.style.background =
      "radial-gradient(circle at 30% 25%, hsl(" + album.hue + " 60% 22% / .9), #100d0b 70%)";
    d.innerHTML =
      '<span class="sleeve-top">zdisco records</span>' +
      coverSVG(album.art, album.hue) +
      '<span class="sleeve-bot">' + album.title + "</span>";
    return d;
  }

  /* ---------- render album cards into [data-albums] ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-albums]").forEach(function (mount) {
      var limit = parseInt(mount.dataset.albums, 10) || window.ALBUMS.length;
      window.ALBUMS.slice(0, limit).forEach(function (a) {
        var card = document.createElement("a");
        card.className = "album-card fade";
        card.href = "album.html?id=" + a.id;
        card.appendChild(coverEl(a));
        var m = document.createElement("div");
        m.className = "meta";
        m.innerHTML = '<span class="kind">' + a.kind + " · " + a.year + "</span>" +
          "<h3>" + a.title + "</h3>" +
          '<span class="tracks">' + a.tracks.length + " tracks</span>";
        card.appendChild(m);
        mount.appendChild(card);
      });
    });

    /* ---------- album detail page ---------- */
    var detail = document.querySelector("[data-album-detail]");
    if (detail) {
      var id = new URLSearchParams(location.search).get("id");
      var a = window.ALBUMS.find(function (x) { return x.id === id; }) || window.ALBUMS[0];
      var hiTrack = parseInt(new URLSearchParams(location.search).get("t"), 10);
      document.title = a.title + " — Jinyao Zhou";
      detail.querySelector(".cover-mount").appendChild(coverEl(a, true));
      detail.querySelector("[data-kind]").textContent = a.kind;
      detail.querySelector("h1").textContent = a.title;
      detail.querySelector(".desc").textContent = a.desc;
      detail.querySelector(".stats").textContent = a.year + " · " + a.tracks.length + " TRACKS";
      var list = detail.querySelector(".tracks-mount");
      a.tracks.forEach(function (t, i) {
        var row = document.createElement("div");
        row.className = "track" + (hiTrack === i + 1 ? " hi" : "");
        row.innerHTML = '<span class="no">' + String(i + 1).padStart(2, "0") + "</span>" +
          "<span>" + t.n + (t.note ? '<span class="note">' + t.note + "</span>" : "") + "</span>" +
          '<span class="dur">' + t.min + " MIN</span>";
        list.appendChild(row);
      });
      if (hiTrack) setTimeout(function () {
        var el = list.querySelector(".hi"); if (el) el.scrollIntoView({ block: "center" });
      }, 60);
    }

    /* ---------- entrance animation ---------- */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    document.querySelectorAll(".fade").forEach(function (el) { io.observe(el); });
  });

  /* ---------- shuffle: jump to a random track ---------- */
  window.shuffle = function () {
    var a = window.ALBUMS[Math.floor(Math.random() * window.ALBUMS.length)];
    var t = Math.floor(Math.random() * a.tracks.length) + 1;
    location.href = "album.html?id=" + a.id + "&t=" + t;
  };
})();
