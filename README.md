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
| 专辑 / 曲目 | `assets/albums.js` —— 一个对象一张专辑，改这一个文件即可 |
| 首页动态 | `index.html` 的 Latest Updates + `about.html` 的 Updates 时间线（两处） |
| 照片 | 把图放进 `assets/photos/`，替换 `photography.html` 和 `index.html` 里的渐变占位 div（注释里有示例代码） |
| 头像 | `assets/profile.jpg`（已压到 540×720） |

## 结构

- `index.html` — 学术式简介 hero（SpiralVortex 星云背景）+ Updates + Discography/Photography 预览
- `discography.html` — 全部专辑 · `album.html?id=<slug>` — 专辑详情 · `track.html?album=<slug>&track=<id>` — 课文页
- `photography.html` / `about.html`
- `assets/site.js` 渲染与主题 · `assets/vortex.js` 首页星云 · `assets/curves.js` 全站舞动曲线 · `assets/albums.js` 全部内容数据

## 与原稿（github.com/kaleido-jean/genz-discography）的对应关系

对照源码逐项复刻：设计 token（index.css 的 HSL 变量原样搬运）、字体（Barlow Condensed / Inter / JetBrains Mono）、首页 hero 的 SpiralVortex（Three.js 版用原参数方程移植成 Canvas 2D，assets/vortex.js）、全站 DancingCurves（framer-motion 路径变形移植成 rAF 插值，assets/curves.js）、真实专辑封面与照片（源仓库 assets 直接拷贝）、五张专辑与全部 track 课文（discography.ts 原样搬进 albums.js）、Track 课文页（track.html：正文 + 阅读时长 + soundtrack + 上下篇）、Shuffle 60/40 逻辑、pulse-glow / album-card-glow / fade-in 动画、整站双主题（.dark class）。

仍有的差异：hero 标题区换成学术简介（用户要求）；路由用 `album.html?id=` / `track.html?album=&track=` 查询参数（静态站无 SPA 路由）；hero 增加联系 chips 和照片。

**加新 track**：编辑 `assets/albums.js`，在对应专辑的 tracks 里加 `{ id, title, readingTime, content, soundtrack? }`，content 用 `\n\n` 分段——其余全自动。
