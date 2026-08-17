/* ============================================================
   Album data — edit this file to add/change albums & tracks.
   art: "arm" | "wave" | "grid" | "rings" | "circuit"  (cover style)
   hue: 0-360 — the cover's neon tint
   ============================================================ */
window.ALBUMS = [
  {
    id: "human-elevator",
    kind: "ALBUM", year: "2026",
    title: "HUMAN: Elevator Odyssey",
    art: "arm", hue: 265,
    desc: "MRSD capstone on a Unitree G1 humanoid: multi-story navigation with elevator riding as the core cross-floor skill. Each track is one subsystem we built and validated on real hardware.",
    tracks: [
      { n: "Track Anything — VLM + tracker + depth PCA", note: "6-DoF button pose from tens of pixels", min: 9 },
      { n: "Gravity Feedforward & Integral PID", note: "0.1 rad stock error → 0.001 rad", min: 7 },
      { n: "Door State Detection", note: "two door styles, no retraining", min: 5 },
      { n: "IMU Floor Detection", note: "100% across 50+ rides on 4/5 elevators", min: 6 },
      { n: "Behavior-Tree Missions", note: "chaining skills into a building-wide run", min: 8 }
    ]
  },
  {
    id: "deep-learning",
    kind: "ALBUM", year: "2025",
    title: "Deep Learning",
    art: "wave", hue: 205,
    desc: "The 11-785 run at CMU: building the classics from scratch — attention included.",
    tracks: [
      { n: "Face Classification & Verification", min: 8 },
      { n: "Speech Recognition — RNN / CTC", min: 10 },
      { n: "Speech Recognition — Transformer", min: 10 },
      { n: "MyTorch — autograd from scratch", min: 12 }
    ]
  },
  {
    id: "mobile-manipulation",
    kind: "EP", year: "2025",
    title: "Mobile Manipulation",
    art: "grid", hue: 160,
    desc: "Hello Robot Stretch: perception-to-grasp pipelines for a mobile base in human spaces.",
    tracks: [
      { n: "Visual Servoing on a Mobile Base", min: 7 },
      { n: "Grasp Planning in Clutter", min: 8 }
    ]
  },
  {
    id: "deep-rl",
    kind: "MIXTAPE", year: "2026",
    title: "Deep Reinforcement Learning",
    art: "rings", hue: 25,
    desc: "Policy gradients to actor-critic, from coursework to Hugging Face DRL — the trial-and-error mixtape.",
    tracks: [
      { n: "Policy Gradients", min: 8 },
      { n: "Q-Learning & DQN", min: 8 },
      { n: "Actor-Critic Methods", min: 9 }
    ]
  },
  {
    id: "battery-safety",
    kind: "ALBUM", year: "PRE-CMU",
    title: "Battery Abuse & Validation",
    art: "circuit", hue: 340,
    desc: "Three years of production safety engineering at Tesla: pushing cells and packs to their worst case — thermally, electrically, mechanically — and learning why safety arguments fail in mass production.",
    tracks: [
      { n: "Thermal Abuse Testing", min: 9 },
      { n: "Electrical Abuse & Fault Injection", min: 9 },
      { n: "Mechanical Abuse & Crush", min: 8 },
      { n: "Validation Discipline at Production Scale", note: "the track I still play every day", min: 11 }
    ]
  }
];
