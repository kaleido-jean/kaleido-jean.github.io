/* ============================================================
   Discography data — real projects from the resume.
   type: "album"/"ep" = projects (home: Albums & EPs)
         "mixtape"    = casual notes & essays (home: Mixtapes)
   Each track: { id, title, content, soundtrack? } — reading time
   is computed from the content's word count at render time.
   content paragraphs are separated by "\n\n".
   ============================================================ */
window.ALBUMS = [
  {
    id: "human-elevator",
    title: "HUMAN: Elevator Odyssey",
    type: "album",
    year: "2026",
    description: "MRSD capstone on a Unitree G1 humanoid: navigation and loco-manipulation in multi-story human spaces, with riding the elevator as the core cross-floor skill. My lane: classical arm control, hand-eye calibration, and close-range perception.",
    tracks: [
      { id: "he-1", title: "Visual Servoing & Button Pressing", content: "Pressing an elevator button with a humanoid is a full-stack problem in miniature: find a target that occupies a handful of pixels, keep tracking it while the robot walks and sways, and close the loop between a 6-DoF pose estimate and an arm command.\n\nMy piece of it is the classical control of the G1's arms — getting a stock manipulator to hold a pose accurately enough that a fingertip lands on a button, which turns out to demand far more care than the spec sheet suggests. Gravity compensation and careful gain work matter more than any single clever idea.\n\nThe broader stack composes visual servoing of the base, arm motion, and press verification into one repeatable skill." },
      { id: "he-2", title: "Hand-Eye Calibration with RealSense D435i", content: "Every downstream skill inherits the quality of your calibration. If the camera-to-hand transform is a centimeter off, every 'perfect' detection still misses the button.\n\nI own the hand-eye calibration on our G1: RealSense D435i on a moving, walking robot, where mounting tolerances and cable strain drift the extrinsics over weeks of testing. The discipline is treating calibration as a maintained artifact — re-verified before every major test session — rather than a one-time setup step.\n\nLesson carried over from production validation: the number you measured last month is a hypothesis, not a fact." },
      { id: "he-3", title: "Reading Doors and Floors", content: "An elevator is a state machine you can only observe from outside. Two perception problems gate every ride: is the door open, and which floor are we on?\n\nFor door state I work with the Livox Mid-360 LiDAR — a flat closed surface and an open passage look completely different in a point cloud, which makes depth a more reliable door sensor than RGB in bad lighting.\n\nFloor detection layers complementary signals, because any single channel fails somewhere: displays differ per elevator, and network access inside a metal box is exactly as bad as you'd expect." },
      { id: "he-4", title: "Composing Skills into Missions", content: "The end goal is a natural-language command — 'go to the reception on the second floor' — turning into a building-wide mission: hallway traversal, elevator rides, and recovery when a step fails.\n\nEach skill is a self-contained module with explicit success, failure, and retry semantics, so the mission layer can reason about them like tracks on an album: sequence them, retry them, skip them.\n\nModularity is not an aesthetic preference here. It's what makes a two-semester team project debuggable when six subsystems have to work in the same five-second window in front of an elevator." }
    ]
  },
  {
    id: "battery-abuse",
    title: "Battery Abuse & Validation",
    type: "album",
    year: "2022–25",
    description: "Three and a half years at Tesla Shanghai — two as a battery abuse engineer, one and a half as a technical project manager. Pushing packs to their worst case: thermal, electrical, mechanical.",
    tracks: [
      { id: "ba-1", title: "Structural Battery, Blade LFP", content: "I supported the development of Tesla's first Model Y structural battery built on blade LFP cells — a design where the pack stops being a component and becomes the car's floor.\n\nStructural batteries collapse the boundary between battery engineering and vehicle engineering: a crash requirement is now a cell requirement, and a cell swelling behavior is now a body-in-white concern.\n\nWorking at that boundary taught me to distrust clean interfaces. The interesting failures always live in the seams between two teams' assumptions." },
      { id: "ba-2", title: "Prismatic Module Abuse", content: "I led abuse validation for Tesla's first in-house prismatic module program — the full menu: thermal, electrical, and mechanical abuse.\n\nAbuse testing is adversarial engineering. The job is not to confirm the design works; it's to find the conditions under which it doesn't, and to make those conditions boring and well-documented before production makes them expensive.\n\nThis is the mindset I now point at robots: a safety argument is only as good as the worst case you actually exercised." },
      { id: "ba-3", title: "TPM Across Ten Teams", content: "As a technical project manager I supported dozens of cost-down and sustaining projects, coordinating CAE, reliability, electronics, integration, manufacturing, process, quality, service, compliance, and supply chain.\n\nTPM work is applied systems engineering: the technical problem is rarely the bottleneck — the interface between two teams' schedules is.\n\nWhat survived from those years: write things down, quantify the disagreement, and never let an open risk hide inside a status meeting." },
      { id: "ba-4", title: "What Production Teaches About Safety", content: "Lab validation and production validation are different sports. In the lab you control the variables; in production the variables come to you — supplier drift, process excursions, the one fixture that was rebuilt slightly differently.\n\nThree years of watching safety arguments meet reality left me with the question that still drives my robotics work: how do you know a system holds up in its worst case — and how do you notice when your own argument is wrong?\n\nThat question transfers cleanly from battery packs to robot policies. The materials change; the epistemology doesn't." }
    ]
  },
  {
    id: "deep-learning",
    title: "Deep Learning",
    type: "album",
    year: "2025",
    description: "The 11-785 run at CMU: building and training the classics — CNNs, RNNs, and transformers — with enough ablation discipline to know why they work.",
    tracks: [
      { id: "dl-1", title: "Face Classification & Verification", content: "Face recognition as coursework sounds solved until you have to make the margin between 'same person' and 'different person' survive a held-out distribution.\n\nI worked through CNN backbones — ResNet, ConvNeXt — and margin-based losses like ArcFace, with CutMix and heavy augmentation to keep the embedding space honest.\n\nThe useful skill was not any single architecture: it was learning to read training curves like telemetry and ablate one variable at a time." },
      { id: "dl-2", title: "Speech Recognition: pBLSTM & CTC", content: "Before attention, sequence compression: pyramidal bidirectional LSTMs halve the time resolution per layer, which is what makes long utterances tractable.\n\nCTC loss handles the alignment problem — you never know exactly which frame maps to which character, so you marginalize over all valid alignments.\n\nRNN training is a patience discipline: gradient clipping, scheduling, and the humility to accept that some divergences are just bad seeds." },
      { id: "dl-3", title: "Speech Recognition: Transformer", content: "The transformer encoder-decoder rebuild of the same task made the contrast explicit: attention buys you parallelism and long-range context, and charges you in data hunger and scheduler sensitivity.\n\nGetting a from-scratch transformer to converge on speech is mostly warm-up schedules, normalization placement, and regularization tuning.\n\nHaving built both generations of architecture on the same dataset is the kind of comparison a paper reading can't give you." },
      { id: "dl-4", title: "The Ablation Grind", content: "Across both projects the real curriculum was ablations: learning rate, normalization, schedulers, augmentation — one axis at a time, logged and compared.\n\nUnderfitting and overfitting are diagnoses, not vibes. The fix follows from which one you're actually in, and the only way to know is a controlled comparison.\n\nThis is validation engineering applied to models instead of hardware — same discipline, different substrate." }
    ]
  },
  {
    id: "adverse-fruit",
    title: "Fruit Segmentation in the Dark",
    type: "ep",
    year: "2025",
    description: "Fruit identification and segmentation under adverse illumination — a two-move pipeline: illumination-invariant features plus low-light enhancement.",
    tracks: [
      { id: "af-1", title: "YOLA: Illumination-Invariant Features", content: "Orchard lighting doesn't cooperate: harsh sun, deep shade, backlight — often in the same image. A detector trained on nice lighting quietly degrades.\n\nWe applied YOLA, an illumination-invariant feature extractor, in training with a YOLO architecture — attacking the problem at the feature level rather than hoping augmentation covers it.\n\nAs team leader I cared about the evaluation as much as the model: if your test set doesn't contain the ugly lighting, your accuracy number is fiction." },
      { id: "af-2", title: "SGZ: Seeing Before Inferring", content: "For genuinely dark inputs we added SGZ, an image-enhancement module, to pre-process low-light frames before inference.\n\nEnhancement-then-detect is a classic pipeline trade: you buy visibility at the risk of amplifying noise into false positives. Where the crossover sits is an empirical question, not a doctrinal one.\n\nSmall project, honest lesson: fix the input distribution before demanding more of the model." }
    ]
  },
  {
    id: "mech-era",
    title: "Mechanical Era",
    type: "ep",
    year: "2019–21",
    description: "The undergrad years at UM-SJTU Joint Institute — when robots were linkages, motors, and machined parts. Three builds that taught me hardware has opinions.",
    tracks: [
      { id: "me-1", title: "Bolt-Tightening Tower Climber", content: "Capstone: a robot that climbs the vertical steel angle of a power transmission tower and tightens its bolts, so a human doesn't have to.\n\nWe designed a worm-like climbing mechanism and achieved gait control with a Raspberry Pi, electromagnets, and stepper motors. As team leader I carried it from concept through the design expo — it took the Gold Award.\n\nClimbing steel teaches respect for grip force budgets: gravity files bugs faster than any reviewer." },
      { id: "me-2", title: "Transformable Wheel Robot", content: "A wheel that becomes a legged wheel: we used the toggle positions of a rocker-slider linkage plus a self-locking mechanism so the transformation needs no extra actuator.\n\nThe elegance target was mechanical, not computational — encode the mode switch into the linkage's own geometry.\n\nThis is the project that made me love mechanisms: the best ones compute with steel." },
      { id: "me-3", title: "RoboMaster Standard Robot", content: "University championship team: I modified the chassis and designed a bottom-up projectile feeding path between a fixed magazine and a rotatable barrel.\n\nI also led the 'double-barrel' technical solution — designing and validating shooting precision before and after the barrel switches around the roll axis. The team took a First Prize that season.\n\nCompetition robotics is production engineering at student scale: if it only works in the workshop, it doesn't work." }
    ]
  },
  {
    id: "field-notes",
    title: "Field Notes",
    type: "mixtape",
    year: "2026",
    description: "Loose essays and notes — whatever doesn't fit an album. New tracks appear whenever something is worth writing down.",
    tracks: [
      { id: "fn-1", title: "Why a Discography?", content: "Albums force curation. A pile of projects is a junk drawer; an album has a tracklist, a year, and a reason to exist.\n\nSo this site organizes work the way musicians organize output: albums for the big projects, EPs for the compact ones, and this mixtape for everything unpolished.\n\nIf you're reading liner notes this deep — the sand patterns on every cover are Chladni figures, simulated live from the plate equation. Different album, different resonance." }
    ]
  }
];

/* B-Sides gallery — kind: "photo" | "artwork".
   A single piece:   { src: "assets/x.jpg", ... }
   A collection:     { images: ["assets/a.jpg", "assets/b.jpg", ...], ... }
   Collections show a count badge and open as a pageable lightbox. */
/* Career/status timeline — About shows all, home shows the first three */
window.UPDATES = [
  { ev: "🛗 Spring Validation Demo: elevator skill on the Unitree G1", where: "CMU, Pittsburgh", when: "May 2026" },
  { ev: "🤖 Started the HUMAN capstone, sponsored by FieldAI", where: "CMU, Pittsburgh", when: "Jan 2026" },
  { ev: "🎓 Admitted to the Robotics Master's Program (MRSD)", where: "Carnegie Mellon University, Pittsburgh", when: "Aug 2025" },
  { ev: "⚡ Transferred to Battery Safety Engineer", where: "Tesla, Shanghai", when: "Oct 2023" },
  { ev: "🔧 Converted to full-time as Technical Project Manager, Battery Engineering", where: "Tesla, Shanghai", when: "Aug 2022" },
  { ev: "🎓 B.S. in Mechanical Engineering", where: "Shanghai Jiao Tong University, Shanghai", when: "Aug 2022" },
  { ev: "🌱 Joined Tesla as a Battery Engineering intern", where: "Tesla, Shanghai", when: "Jan 2022" }
];

window.PHOTOS = [
  /* Add entries as work lands:
     single:     { id, src: "assets/x.jpg", kind: "photo"|"artwork", title, description, date }
     collection: { id, images: ["assets/a.jpg", ...], kind, title, description, date } */
];

/* 60% chance of a track, 40% an album — same as getRandomItem() in source */
window.getRandomItem = function () {
  var albums = window.ALBUMS;
  var album = albums[Math.floor(Math.random() * albums.length)];
  if (Math.random() > 0.4) {
    var track = album.tracks[Math.floor(Math.random() * album.tracks.length)];
    return { type: "track", albumId: album.id, trackId: track.id };
  }
  return { type: "album", albumId: album.id };
};
