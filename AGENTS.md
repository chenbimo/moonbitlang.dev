# site 仓库约定(Moonkit — moonbitlang.dev 官方门户)

站点名 **Moonkit**;域名 `moonbitlang.dev` 只是部署载体,不对外当站名用(`<title>`、`<h1>` 用 Moonkit,URL 与 docs 子域仍指向域名)。

Vue 3 + Vite 单页:`src/` 源码、`bun install && bun run build` 产物在 `dist/`(相对路径引用,`base: './'`)。前端规范出口 `yicode-tech/.finch/skills/befly-web`(代码分组、命名、开关组件纪律),技术栈取 Vue 但不引 TDesign/router/pinia——单页无表单,保持朴素。
部署:CF Pages 项目 `moonbit-site` + 自定义域 `moonbitlang.dev`,构建命令 `bun install --frozen-lockfile && bun run build`,根目录 `.`、输出 `dist`,监听路径 `*`(站点即内容,任何一次 push 都应触发重部署);构建环境变量 `SKIP_DEPENDENCY_INSTALL=1`。
目录与仓库不同名是工作区例外:目录 `site`,远端 `git@github.com:chenbimo/moonbitlang.dev.git`,提交前缀 `site`。工作区规范见 `../scripts/NEW-PROJECT.md`。

## 中英双语:字典方案

- 顶栏Segmented 切换 `中文 | EN`:当前语言加重,另一语言为可点链接。
- 字典 `src/configs/config.js` 的 `$Lang`:覆盖全部 UI 文案(站名副语、页脚、切换标签)。
- 卡片字段双语:描述 `{zh, en}`;数字与版本号保持半角。
- 语言决策顺序:URL 参数 `?lang=zh|en` → `localStorage['site-lang']` → `navigator.language`(`zh` 开头选中文,否则英文);选定后写回 `localStorage`(`src/configs/config.js` 的 `$Lang.pick()` 只读不落盘,落盘在切换动作里)。
- 切换是响应式更新(`$Data.dict` 整体换字典),`<html lang>` 设 `zh-CN` / `en`;语言落在 URL(`?lang=en` 可分享)。

## 卡片数据:src/configs/config.js 唯一数据源

`$ModuleList` 数组列出全部五个模块(`scripts` 是工具链,不上卡片)。audit 机检依赖本文件:每个模块的 `<name>.moonbitlang.dev` 文本必须存在;结构可以改,链接与模块名不能丢。

状态只有三档:已发布 / 开发中 / 已废弃;角标是卡片右上角一条 45° 斜置缎带(两端由卡片圆角裁口),底色随状态(柔和绿 / 柔和蓝 / 柔和红,中调低饱和,不亮也不深);已发布模块的角标只显示版本号,开发中与已废弃显示状态短词。

推荐由数据里的 `featured: true` 标记:带标记的进页首「推荐 / Featured」段,其余进「模块 / Modules」段,两段各带计数。

| 模块 | 状态 | 版本 | 推荐 | docs 链接 |
| --- | --- | --- | --- | --- |
| `bm2` | 已发布 / Released | `v0.6.0` | 是 | `https://bm2.moonbitlang.dev` |
| `clitable` | 已发布 / Released | `v0.2.0` | — | `https://clitable.moonbitlang.dev` |
| `clicolor` | 开发中 / In development | — | — | `https://clicolor.moonbitlang.dev` |
| `dateku` | 开发中 / In development | — | — | `https://dateku.moonbitlang.dev` |
| `fndash` | 开发中 / In development | — | — | `https://fndash.moonbitlang.dev` |

描述要从各模块 `moon.mod` / README 摘事实:`clicolor` 的描述取自其 README(终端颜色与超链接转义序列库);`dateku` 与 `fndash` 的描述保留「方向未定」的诚实说明。

## 目录结构

| 路径 | 内容 |
| --- | --- |
| `src/configs/config.js` | `$Config` / `$Lang`(字典) / `$ModuleList`(卡片数据),唯一数据源 |
| `src/app.vue` | 页面骨架:品牌区、语言切换、分段与网格、页脚(页脚小标内联 SVG) |
| `src/components/moduleCard.vue` | 模块卡片(缎带角标、两行描述、链接行) |
| `src/components/themeCord.vue` | 拉线主题开关(拖拽阈值切换、短按回弹、document 级指针收尾) |
| `src/utils/theme.js` | `$Theme`:当前值/应用/切换;首帧落定在 `index.html` 内联脚本 |
| `src/utils/report.js` | 在线上报(见下节) |
| `src/styles/global.scss` | 主题令牌(`:root` CSS 变量)与全局骨架 |
| `index.html` | vite 入口;内联主题预落定;favicon 与 apple-touch 引用 |
| `public/` | `logo.svg`、`favicon.svg`、`icons/`(构建时原样复制) |

## 路径与引用

- 产物对内引用**必须相对路径**:`vite.config.js` 的 `base: './'` 是唯一开关,`index.html` 由它注入 `./assets/*`。audit 机检「index.html 不得以 `/` 引用本站资源」。
- 引用外域(GitHub、docs 子域名、上报 API)用完整 URL,不受此条影响。
- 理由:产物可在本地 `file://` 预览(dev server 除外,module script 受 file 协议限制),整体挪到任何子路径也不坏。

## 组件纪律(与 befly-web 一致的本地应用版)

- 模板/组件状态分组 `$Const` → `$From`/`$Other` → `$Data` → `$Computed` → `$Method`;`$Computed` 用 `reactive({ x: computed(...) })` 包裹,模板直接 `$Computed.x`(自动解包,不写 `.value`)。
- 默认不写 `watch`;主题/语言/上送的副作用在显式方法里完成。
- 组件根类名 `.comp-xxx`(moduleCard/themeCord 内部样式均在各自 scoped scss)。

## 自定义交互:拉线开关

拖过阈值(20px)切主题,松手回弹;短按/键盘也能切。实现要点都在 `themeCord.vue`:拖动期间给绳与拉手关掉过渡(跟手),`pointermove/up` 收在 document 级(指针可能拖出按钮),切换动作派发 `@toggle` 给 app 由 `$Theme` 统一执行。

## 在线上报

- 接入 yicode 统一统计:契约 `yicode-tech/opensource/shared/specs/report-spec.md`;`src/utils/report.js` 是消费端精简版(只发在线,不报错误),取值沿革从内联版平移:`productCode=webMoonkit`、`productType=browser`、`clientId` 与 befly-shared 同算法同键名(localStorage `befly-client-id`)。
- 启动一条 + 30 分钟心跳里跨天补一条;失败即弃,不打扰访客。
- 上报域名(接口前缀 `https://api.yicode.tech`)与站点版本属站点事实,改地址只动 `src/utils/report.js` 顶部常量。

## 品牌标识(logo)

几何以 `public/logo.svg` 为准——头部就是 `<img class="mark" src="/logo.svg">`,不再内联复制几何;下列文件都是它的同源副本,改几何时必须一并重出。

品牌三色(固定色,不随站点主题变):月面主色 `#b92381`,两耳与强调点 `#8e1a64`,内耳与月面斑点 `#d06cab`;小图标底板用淡粉 `#fbeaf4`。

| 文件 | 用途 |
| --- | --- |
| `public/logo.svg` | 品牌形(准):透明底三色 |
| `app.vue` 页脚 `.mark-sm`(内联) | 页脚小标:只留耳与月面的轮廓,单色 `--faint`,无内耳 |
| `public/logo-mono.svg` / `logo-inverse.svg` | 单色版(深墨 / 反白),无内耳,给单色场景 |
| `public/favicon.svg` | 标签图标:同几何 + 淡粉底板 |
| `public/icons/favicon-16/-32/-48/-256.png`、`apple-touch-icon-180.png` | 老浏览器与 iOS 兜底:带底板;细节按尺寸分级(16 无内耳无斑、32 有内耳两斑、48 起全细节),256 透明 |

形状:拱形半月 + 两只两端收尖的耳(右耳顶部向右折出一小瓣、瓣下缘回勾成折痕,与耳身共用一条闭合路径)+ 内耳就是这条轮廓的遮罩等距内缩 1.7(描边接角用圆角,所以折痕内侧是柔和的圆弧而不是硬尖;处处与外轮廓平行;单色版与页脚小标不带内耳)+ 斑点全部裁进月缘、只露一部分 + 一颗强调色小坑。

## 验收

- `bash /mnt/c/codes/moonbit/scripts/devkit.sh audit site`:全部就绪(五模块子域链接、相对路径、包机检)。
- `bun run build` 秒级完成;`git ls-files` 不含 `dist/`、`node_modules/`。
- 浏览器实测:中英切换全站文本切换;`?lang=en` 直达英文;刷新记住选择;`<html lang>` 正确;卡片数 = 5;各模块状态徽文如上表;深浅色与拉线交互正常;控制台无报错。
- push 后 `https://moonbitlang.dev/` 返回 200 且内容为新版。

## 红线

- 零语言不虚构:任何卡片不得出现模块没有的能力描述。
- 不引组件库与状态管理(保持 Vue 生态内朴素),不动 `scripts/devkit/**`、`scripts/devkit.conf`、`.githooks`、`.github`。
- 组件分组纪律(befly-web)与上表文件归属不冻结,但改动要遵守:数据一个出处、模板不出现魔法字面量、上传协议不与 site 外的任何文件重复实现第二份完整版。
- 不执行 git commit / git push / git add,提交时机由主会话口令决定。
- 除本仓库文件外不写任何路径(工作区公共 `scripts/devkit.sh` 例外:它经主会话口令授权修改)。
