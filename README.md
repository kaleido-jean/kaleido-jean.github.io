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

- `index.html` — 学术式简介 hero（奶油色）+ Updates + Discography/Photography 预览
- `discography.html` — 全部专辑
- `album.html?id=<slug>` — 专辑详情（tracklist 从 albums.js 渲染；`&t=N` 高亮第 N 首）
- `photography.html` / `about.html`
- `assets/site.js` — 主题切换（跟随系统 + localStorage）、程序化封面（SVG，无需图片）、Shuffle（随机跳一首 track）

## 与原稿的已知差异

- 标题 hero → 学术简介（按需求替换）
- 专辑封面由 AI 图改为程序化 SVG（自包含、加载快、新专辑零成本）
- 专辑详情从独立路由改为 `album.html?id=` 查询参数（静态站无路由）
- Updates / 专辑内容从占位文案换成了真实经历——**日期和细节请自行核对**（尤其 Tesla 结束时间和 SVD 月份是我推断的）
