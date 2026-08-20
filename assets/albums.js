/* ============================================================
   Discography data — cleared on purpose (2026-08): the previous
   entries were AI-generated drafts, and they don't belong under
   my name. Real ones are being written, album by album.
   type: "album"/"ep" = projects (home: Albums & EPs)
         "mixtape"    = casual notes & essays (home: Mixtapes)
   Each track: { id, title, content, soundtrack? } — reading time
   is computed from the content's word count at render time.
   content paragraphs are separated by "\n\n".
   ============================================================ */
window.ALBUMS = [];

/* Shown wherever the discography would render while ALBUMS is empty */
window.ALBUMS_EMPTY_MSG =
  "The earlier entries here were AI-generated slop, and I'd rather not waste " +
  "your time on that. Real liner notes, written by me, are on the way.";

/* B-Sides gallery — kind: "photo" | "artwork".
   A single piece:   { src: "assets/x.jpg", ... }
   A collection:     { images: ["assets/a.jpg", "assets/b.jpg", ...], ... }
   Collections show a count badge and open as a pageable lightbox. */
/* Career/status timeline — About shows all, home shows the first three */
window.UPDATES = [
  { ev: "🛗 Spring Validation Demo: elevator skill on the Unitree G1", where: "Carnegie Mellon University, Pittsburgh", when: "May’26" },
  { ev: "🤖 Started the HUMAN capstone, sponsored by FieldAI", where: "Carnegie Mellon University, Pittsburgh", when: "Jan’26" },
  { ev: "🎓 Admitted to the Robotics Master's Program (MRSD)", where: "Carnegie Mellon University, Pittsburgh", when: "Aug’25" },
  { ev: "⚡ Transferred to Battery Safety Engineer", where: "Tesla, Shanghai", when: "Oct’23" },
  { ev: "🔧 Converted to full-time as Technical Project Manager, Battery Engineering", where: "Tesla, Shanghai", when: "Aug’22" },
  { ev: "🎓 B.S. in Mechanical Engineering", where: "Shanghai Jiao Tong University, Shanghai", when: "Aug’22" },
  { ev: "🌱 Joined Tesla as a Battery Engineering intern", where: "Tesla, Shanghai", when: "Jan’22" }
];

window.PHOTOS = [
  /* Add entries as work lands:
     single:     { id, src: "assets/x.jpg", kind: "photo"|"artwork", title, description, date }
     collection: { id, images: ["assets/a.jpg", ...], kind, title, description, date } */
];

/* 60% chance of a track, 40% an album — same as getRandomItem() in source.
   Returns null while the discography is empty. */
window.getRandomItem = function () {
  var albums = window.ALBUMS;
  if (!albums.length) return null;
  var album = albums[Math.floor(Math.random() * albums.length)];
  if (Math.random() > 0.4 && album.tracks.length) {
    var track = album.tracks[Math.floor(Math.random() * album.tracks.length)];
    return { type: "track", albumId: album.id, trackId: track.id };
  }
  return { type: "album", albumId: album.id };
};
