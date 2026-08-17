/* ============================================================
   Discography data — ported verbatim from src/data/discography.ts
   of the Lovable draft. Each track is a readable lesson with
   full content, reading time, and optional soundtrack.
   ============================================================ */
window.ALBUMS = [
  {
    id: "robot-kinematics",
    title: "Robot Kinematics",
    type: "album",
    cover: "assets/album-kinematics.jpg",
    year: "2025",
    description: "A deep dive into forward and inverse kinematics, DH parameters, and manipulator workspace analysis. This album covers the mathematical foundations that make robot arms move with precision.",
    tracks: [
      { id: "rk-1", title: "Forward Kinematics & DH Convention", readingTime: "8 min", content: "Forward kinematics maps joint parameters to end-effector position using Denavit-Hartenberg convention. Each joint contributes a transformation matrix, and their product gives the final pose.\n\nThe DH convention provides a systematic way to assign coordinate frames to each link of a manipulator. Four parameters define each transformation: link length (a), link twist (α), link offset (d), and joint angle (θ).\n\nFor a revolute joint, θ is the variable; for prismatic, d varies. The homogeneous transformation between consecutive frames follows a standard form, making it elegant to compute the full chain." },
      { id: "rk-2", title: "Inverse Kinematics Solutions", readingTime: "12 min", content: "Inverse kinematics is the problem of finding joint angles that achieve a desired end-effector pose. Unlike FK, IK often has multiple solutions or none at all.\n\nAnalytical methods work for robots with specific geometries (e.g., spherical wrist). Numerical methods like Newton-Raphson or Jacobian pseudoinverse handle general cases but may converge to local minima.\n\nRedundant manipulators (more DOF than task space) have infinite solutions, requiring optimization criteria like minimum energy or obstacle avoidance." },
      { id: "rk-3", title: "Workspace Analysis", readingTime: "6 min", content: "The workspace of a manipulator is the set of all points reachable by the end-effector. Dexterous workspace is the subset where any orientation is achievable.\n\nWorkspace shape depends on joint limits, link lengths, and kinematic structure. Singularities occur at workspace boundaries where the Jacobian loses rank." },
      { id: "rk-4", title: "Jacobian & Velocity Kinematics", readingTime: "10 min", content: "The Jacobian matrix relates joint velocities to end-effector velocities. It's fundamental for velocity control, force analysis, and singularity detection.\n\nNear singularities, the Jacobian becomes ill-conditioned, causing large joint velocities for small Cartesian motions. Damped least squares (DLS) methods provide numerically stable solutions." }
    ]
  },
  {
    id: "robot-perception",
    title: "Robot Perception",
    type: "album",
    cover: "assets/album-perception.jpg",
    year: "2025",
    description: "Exploring how robots see and understand the world through computer vision, deep learning, and sensor fusion. From raw pixels to semantic understanding.",
    tracks: [
      { id: "rp-1", title: "Camera Models & Calibration", readingTime: "7 min", content: "The pinhole camera model projects 3D points to 2D image coordinates through intrinsic and extrinsic parameters. Calibration estimates these parameters using checkerboard patterns or other known geometries.\n\nLens distortion—both radial and tangential—must be corrected for accurate measurements. Zhang's method provides a flexible calibration approach using multiple views of a planar pattern." },
      { id: "rp-2", title: "Feature Detection & Matching", readingTime: "9 min", content: "Features are distinctive image regions useful for matching across views. SIFT, SURF, and ORB extract keypoints with descriptors invariant to scale, rotation, and illumination changes.\n\nMatching strategies include brute-force and FLANN-based approaches. RANSAC filters outliers to find consistent geometric transformations between matched feature sets." },
      { id: "rp-3", title: "Deep Learning for Object Detection", readingTime: "15 min", content: "Modern object detection uses CNN architectures like YOLO, SSD, and Faster R-CNN. These networks jointly predict bounding boxes and class probabilities in a single forward pass.\n\nTransformer-based detectors (DETR) treat detection as a set prediction problem, eliminating hand-designed components like anchor boxes and NMS." },
      { id: "rp-4", title: "Stereo Vision & Depth Estimation", readingTime: "11 min", content: "Stereo vision computes depth from disparity between left and right camera images. Epipolar geometry constrains the search for correspondences to a single line.\n\nSemi-global matching (SGM) and deep learning methods (PSMNet, RAFT-Stereo) produce dense disparity maps suitable for 3D reconstruction and navigation." }
    ]
  },
  {
    id: "motion-planning",
    title: "Motion Planning",
    type: "album",
    cover: "assets/album-motion.jpg",
    year: "2024",
    description: "Algorithms that help robots navigate from A to B while avoiding obstacles. From classical graph search to modern sampling-based planners.",
    tracks: [
      { id: "mp-1", title: "Configuration Space", readingTime: "6 min", content: "Configuration space (C-space) represents all possible robot configurations. Obstacles in workspace map to forbidden regions in C-space. Planning happens in C-space where the robot is a point.\n\nFor a 2D robot with 3 DOF (x, y, θ), C-space is 3-dimensional. Computing C-space obstacles exactly is expensive; sampling-based methods avoid explicit computation." },
      { id: "mp-2", title: "RRT & RRT*", readingTime: "10 min", content: "Rapidly-exploring Random Trees (RRT) grow a tree from the start configuration by randomly sampling and extending toward new points. RRT is probabilistically complete but not optimal.\n\nRRT* adds a rewiring step that asymptotically converges to the optimal path. Informed RRT* focuses sampling in an ellipsoidal region to accelerate convergence." },
      { id: "mp-3", title: "A* and Graph Search", readingTime: "8 min", content: "A* finds shortest paths on graphs using a heuristic to guide search. With an admissible heuristic, A* is optimal and complete.\n\nVariants include weighted A* (faster, suboptimal), D* Lite (dynamic replanning), and ARA* (anytime with improving bounds). Grid-based representations discretize C-space for graph search." }
    ]
  },
  {
    id: "control-systems",
    title: "Control Systems",
    type: "ep",
    cover: "assets/album-control.jpg",
    year: "2024",
    description: "Short series on feedback control: PID tuning, state-space methods, and modern optimal control for robotics applications.",
    tracks: [
      { id: "cs-1", title: "PID Control Fundamentals", readingTime: "7 min", content: "PID control combines proportional, integral, and derivative terms to minimize tracking error. Proper tuning balances responsiveness, stability, and steady-state accuracy.\n\nZiegler-Nichols provides initial tuning, but modern methods like relay feedback auto-tuning and optimization-based approaches yield better performance for robotic systems." },
      { id: "cs-2", title: "State-Space Control", readingTime: "12 min", content: "State-space representation models systems as first-order differential equations: ẋ = Ax + Bu, y = Cx + Du. This framework handles MIMO systems naturally.\n\nPole placement and LQR design full-state feedback controllers. Observers (Luenberger, Kalman filter) estimate unmeasured states from available outputs." }
    ]
  },
  {
    id: "slam-mapping",
    title: "SLAM & Mapping",
    type: "mixtape",
    cover: "assets/album-slam.jpg",
    year: "2024",
    description: "Experimental notes on Simultaneous Localization and Mapping—from EKF-SLAM to modern visual-inertial odometry and neural implicit maps.",
    tracks: [
      { id: "sm-1", title: "EKF-SLAM Basics", readingTime: "9 min", content: "EKF-SLAM estimates robot pose and landmark positions jointly using an Extended Kalman Filter. The state vector grows with each new landmark, making it O(n²) in computation.\n\nSparsification and submapping techniques address scalability. Feature-based SLAM extracts and tracks landmarks; direct methods use raw sensor data." },
      { id: "sm-2", title: "Visual-Inertial Odometry", readingTime: "11 min", content: "VIO fuses camera and IMU data for robust ego-motion estimation. Tightly-coupled approaches jointly optimize visual and inertial residuals.\n\nSystems like VINS-Mono and OKVIS achieve real-time performance on embedded platforms. Keyframe-based marginalization keeps the optimization window bounded." },
      { id: "sm-3", title: "Neural Implicit Maps", readingTime: "8 min", content: "Neural radiance fields (NeRF) and signed distance functions (SDF) represent 3D scenes as continuous neural networks. iMAP and NICE-SLAM use these for real-time mapping.\n\nAdvantages include memory efficiency and novel view synthesis. Challenges remain in dynamic scenes and large-scale environments." }
    ]
  }
];

window.PHOTOS = [
  { id: "p1", src: "assets/photo-1.jpg", title: "Neon Frequencies", description: "Urban nightscape captured in long exposure", date: "2025.01" },
  { id: "p2", src: "assets/photo-2.jpg", title: "Light Geometry", description: "Abstract light painting experiment", date: "2025.02" },
  { id: "p3", src: "assets/photo-3.jpg", title: "Mechanical Soul", description: "Close-up of robotic mechanisms", date: "2024.11" },
  { id: "p4", src: "assets/photo-4.jpg", title: "Blue Hour", description: "Mountain landscape at twilight", date: "2024.09" }
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
