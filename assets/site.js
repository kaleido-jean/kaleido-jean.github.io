/* theme (.dark class, like next-themes) + shuffle + shared rendering */
(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  var dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  root.classList.toggle("dark", dark);

  window.toggleTheme = function () {
    var isDark = root.classList.toggle("dark");
    try { localStorage.setItem("theme", isDark ? "dark" : "light"); } catch (e) {}
  };

  /* global shuffle — 60% lands on a track, 40% on an album */
  window.shuffle = function () {
    var item = window.getRandomItem();
    location.href = item.type === "track"
      ? "track.html?album=" + item.albumId + "&track=" + item.trackId
      : "album.html?id=" + item.albumId;
  };

  /* honest reading time: word count / 200 wpm, at least 1 min */
  function readMin(t) {
    return Math.max(1, Math.round(t.split(/\s+/).length / 200)) + " min";
  }

  function albumCard(a, i) {
    var el = document.createElement("a");
    el.className = "album-card fade-in d" + Math.min(i + 1, 4);
    el.href = "album.html?id=" + a.id;
    var label = { album: "Album", ep: "EP", mixtape: "Mixtape" }[a.type];
    el.innerHTML =
      '<div class="box"><div class="art"><canvas class="chladni" data-seed="' + a.id + '" aria-label="Generated cover art for ' + a.title + '"></canvas></div>' +
      '<div class="meta"><div class="metadata">' + label + " · " + a.year + "</div>" +
      "<h3>" + a.title + "</h3>" +
      '<p class="tracks">' + a.tracks.length + " tracks</p></div></div>";
    return el;
  }

  function photoImages(p) { return p.images || [p.src]; }

  function photoCell(p, i) {
    var imgs = photoImages(p);
    var el = document.createElement("button");
    el.type = "button";
    el.className = "photo fade-in d" + Math.min(i + 1, 4);
    el.setAttribute("aria-label", p.title + (imgs.length > 1 ? ", collection of " + imgs.length : ""));
    el.innerHTML = '<img loading="lazy" src="' + imgs[0] + '" alt="">' +
      (imgs.length > 1
        ? '<span class="stack-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="7" width="14" height="14" rx="2"/><path d="M3 17V5a2 2 0 0 1 2-2h12"/></svg>' + imgs.length + "</span>"
        : "") +
      '<div class="cap"><p class="t">' + p.title + '</p><p class="metadata">' +
      (p.kind === "artwork" ? "Artwork" : "Photo") +
      (imgs.length > 1 ? " · Series of " + imgs.length : "") + " · " + p.date + "</p></div>";
    el.addEventListener("click", function () { openLightbox(p, 0); });
    return el;
  }

  /* ---------- lightbox: single images and pageable collections ---------- */
  var lb = null, lbEntry = null, lbIdx = 0;
  function ensureLightbox() {
    if (lb) return lb;
    lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML =
      '<button class="lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-nav lb-prev" aria-label="Previous">&#8592;</button>' +
      '<figure><img alt=""><figcaption>' +
      '<p class="t"></p><p class="metadata"></p><p class="d"></p>' +
      "</figcaption></figure>" +
      '<button class="lb-nav lb-next" aria-label="Next">&#8594;</button>';
    document.body.appendChild(lb);
    lb.querySelector(".lb-close").addEventListener("click", closeLightbox);
    lb.querySelector(".lb-prev").addEventListener("click", function () { stepLightbox(-1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { stepLightbox(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") stepLightbox(-1);
      else if (e.key === "ArrowRight") stepLightbox(1);
    });
    return lb;
  }
  function renderLightbox() {
    var imgs = photoImages(lbEntry);
    lb.querySelector("img").src = imgs[lbIdx];
    lb.querySelector(".t").textContent = lbEntry.title;
    lb.querySelector(".metadata").textContent =
      (lbEntry.kind === "artwork" ? "Artwork" : "Photo") + " · " + lbEntry.date +
      (imgs.length > 1 ? " · " + (lbIdx + 1) + " / " + imgs.length : "");
    lb.querySelector(".d").textContent = lbEntry.description || "";
    var multi = imgs.length > 1;
    lb.querySelector(".lb-prev").style.visibility = multi ? "visible" : "hidden";
    lb.querySelector(".lb-next").style.visibility = multi ? "visible" : "hidden";
  }
  function openLightbox(entry, idx) {
    ensureLightbox();
    lbEntry = entry; lbIdx = idx || 0;
    renderLightbox();
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    lb.querySelector(".lb-close").focus();
  }
  function closeLightbox() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }
  function stepLightbox(dir) {
    var n = photoImages(lbEntry).length;
    lbIdx = (lbIdx + dir + n) % n;
    renderLightbox();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-albums]").forEach(function (mount) {
      var limit = parseInt(mount.dataset.albums, 10) || window.ALBUMS.length;
      /* optional data-types="album,ep" filters by release type */
      var types = mount.dataset.types ? mount.dataset.types.split(",") : null;
      window.ALBUMS
        .filter(function (a) { return !types || types.indexOf(a.type) !== -1; })
        .slice(0, limit)
        .forEach(function (a, i) { mount.appendChild(albumCard(a, i)); });
    });
    document.querySelectorAll("[data-photos]").forEach(function (mount) {
      window.PHOTOS.forEach(function (p, i) { mount.appendChild(photoCell(p, i)); });
    });

    /* ---------- album detail ---------- */
    var albumMount = document.querySelector("[data-album-page]");
    if (albumMount) {
      var qs = new URLSearchParams(location.search);
      var a = window.ALBUMS.find(function (x) { return x.id === qs.get("id"); }) || window.ALBUMS[0];
      document.title = a.title + " — Jinyao Zhou";
      var label = { album: "Album", ep: "EP", mixtape: "Mixtape" }[a.type];
      albumMount.querySelector(".art").innerHTML =
        '<canvas class="chladni" data-seed="' + a.id + '" aria-label="Generated cover art for ' + a.title + '"></canvas>';
      albumMount.querySelector("[data-kind]").textContent = label;
      albumMount.querySelector("h1").textContent = a.title;
      albumMount.querySelector(".desc").textContent = a.description;
      albumMount.querySelector("[data-stats]").textContent = a.year + " · " + a.tracks.length + " tracks";
      albumMount.querySelector("[data-play]").onclick = function () {
        location.href = "track.html?album=" + a.id + "&track=" + a.tracks[0].id;
      };
      albumMount.querySelector("[data-shuffle-album]").onclick = function () {
        var t = a.tracks[Math.floor(Math.random() * a.tracks.length)];
        location.href = "track.html?album=" + a.id + "&track=" + t.id;
      };
      var list = albumMount.querySelector("[data-tracks]");
      a.tracks.forEach(function (t, i) {
        var row = document.createElement("a");
        row.className = "track-item";
        row.href = "track.html?album=" + a.id + "&track=" + t.id;
        row.innerHTML =
          '<span class="metadata no">' + String(i + 1).padStart(2, "0") + "</span>" +
          '<span class="t">' + t.title + "</span>" +
          '<span class="dur"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span class="metadata">' + readMin(t.content) + "</span></span>" +
          '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 6 6 6-6 6"/></svg>';
        list.appendChild(row);
      });
    }

    /* ---------- track (lesson) page ---------- */
    var trackMount = document.querySelector("[data-track-page]");
    if (trackMount) {
      var q = new URLSearchParams(location.search);
      var alb = window.ALBUMS.find(function (x) { return x.id === q.get("album"); }) || window.ALBUMS[0];
      var idx = Math.max(0, alb.tracks.findIndex(function (t) { return t.id === q.get("track"); }));
      var tr = alb.tracks[idx];
      document.title = tr.title + " — Jinyao Zhou";

      trackMount.querySelector("[data-back]").href = "album.html?id=" + alb.id;
      trackMount.querySelector("[data-back] .albname").textContent = alb.title;
      trackMount.querySelector(".thumb").innerHTML =
        '<canvas class="chladni" data-seed="' + alb.id + '" aria-label="Generated cover art for ' + alb.title + '"></canvas>';
      trackMount.querySelector("[data-trackno]").textContent = "Track " + String(idx + 1).padStart(2, "0");
      trackMount.querySelector("h1").textContent = tr.title;
      trackMount.querySelector("[data-albtitle]").textContent = alb.title;
      trackMount.querySelector("[data-time]").textContent = readMin(tr.content);

      var st = trackMount.querySelector("[data-soundtrack]");
      if (tr.soundtrack) st.querySelector(".name").textContent = tr.soundtrack;
      else st.remove();

      var art = trackMount.querySelector("article.lesson");
      tr.content.split("\n\n").forEach(function (para) {
        var p = document.createElement("p");
        p.textContent = para;
        art.appendChild(p);
      });

      var nav = trackMount.querySelector(".track-nav");
      var prev = alb.tracks[idx - 1], next = alb.tracks[idx + 1];
      nav.innerHTML =
        (prev ? '<a href="track.html?album=' + alb.id + "&track=" + prev.id + '">← ' + prev.title + "</a>" : "<span></span>") +
        (next ? '<a href="track.html?album=' + alb.id + "&track=" + next.id + '">' + next.title + " →</a>" : "<span></span>");
    }
  });
})();
