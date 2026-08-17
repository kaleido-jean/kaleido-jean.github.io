# kaleido-jean.github.io

个人主页。设计复刻自我的 Lovable 草稿（GenZ Discography），顶部换成了学术主页式的个人简介。纯静态，无构建步骤。

## 部署（一次性）

```bash
cd ~/kaleido_ws/kaleido-jean.github.io
git init && git add -A && git commit -m "Initial homepage"
gh repo create kaleido-jean/kaleido-jean.github.io --public --source=. --push
```

推完约一分钟后生效：https://kaleido-jean.github.io
（如未生效：仓库 Settings → Pages → Source 选 `main` 分支根目录。）

## 日常维护

| 要改什么 | 改哪里 |
|---|---|
| 简介文字 / 链接 | `index.html` 的 `.hero` 区块 |
| **Scholar / LinkedIn / CV 链接** | `index.html` 里三个 `href="#"` 的 chip —— **目前是 TODO 占位** |
| 邮箱 | 现在用的 gmail，想换 andrew 邮箱改 `index.html` 的 mailto |
| 专辑 / 曲目 | `assets/albums.js` —— 一个对象一张专辑，改这一个文件即可。`type` 字段决定分区：`album`/`ep` = 项目（首页 Albums & EPs），`mixtape` = 随笔（首页 Mixtapes） |
| 首页动态 | `index.html` 的 Latest Updates + `about.html` 的 Updates 时间线（两处） |
| B-Sides（照片+艺术作品） | 图放进 `assets/`，在 `assets/albums.js` 的 `PHOTOS` 数组加条目，`kind: "photo"` 或 `"artwork"`——首页预览和 bsides.html 画廊自动同步 |
| 头像 | `assets/profile.jpg`（已压到 540×720） |

## 结构

- `index.html` — 学术式简介 hero + Updates + Discography/Photography 预览
- `discography.html` — 全部专辑 · `album.html?id=<slug>` — 专辑详情 · `track.html?album=<slug>&track=<id>` — 课文页
- `bsides.html`（B-Sides：照片+艺术作品画廊）/ `about.html`
- `assets/site.js` 渲染与主题 · `assets/chladni.js` Chladni 封面生成 · `assets/albums.js` 全部内容数据

## 与原稿（github.com/kaleido-jean/genz-discography）的对应关系

对照源码逐项复刻：设计 token（index.css 的 HSL 变量原样搬运）、字体（Barlow Condensed / Inter / JetBrains Mono）、照片（源仓库 assets 拷贝）、五张专辑与全部 track 课文（discography.ts 原样搬进 albums.js）、Track 课文页（track.html：正文 + 阅读时长 + soundtrack + 上下篇）、Shuffle 60/40 逻辑、pulse-glow / album-card-glow / fade-in 动画、整站双主题（.dark class）。

后续按要求的改动：背景动效（SpiralVortex 星云 + DancingCurves 曲线）已移除；**专辑封面改为 Chladni 声波图案实时生成**（assets/chladni.js，灵感来自 pettaboy.github.io/cymaticssimulator_chladni）——公式 `f = a·sin(πnx)sin(πmy) + b·sin(πmx)sin(πny)`，每张专辑用专辑 id 做种子随机出 (m, n, a, b) 和色相，3200 个沙粒往波节线聚集，每 7 秒参数漂移一次、沙粒当场重排；同一专辑在卡片/详情页/课文页缩略图的图案一致；`prefers-reduced-motion` 时渲染收敛后的静态图。

其他差异：hero 标题区换成学术简介（用户要求）；路由用 `album.html?id=` / `track.html?album=&track=` 查询参数（静态站无 SPA 路由）。

**加新 track**：编辑 `assets/albums.js`，在对应专辑的 tracks 里加 `{ id, title, readingTime, content, soundtrack? }`，content 用 `\n\n` 分段——其余全自动。
