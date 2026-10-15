# site 仓库约定(moonbitlang.dev 官方门户)

纯静态单页:`index.html` + `style.css` + `main.js`,零构建、零依赖。
部署:CF Pages 项目 `moonbit-site` + 自定义域 `moonbitlang.dev`,推送即自动重建(监听路径 `*`)。
目录与仓库不同名是工作区唯一例外:目录 `site`,远端 `git@github.com:chenbimo/moonbitlang.dev.git`,提交前缀 `site`。工作区规范见 `../scripts/NEW-PROJECT.md`。

## 中英双语:单页字典方案(规范已定,不要改成双目录)

- 顶栏右上角切换 `中文 | EN`:当前语言加重显示(或加下划线),另一语言为可点链接。
- 字典:`main.js` 内 `i18n = { zh: {…}, en: {…} }`,覆盖全部 UI 文案(站名副语、页脚、切换标签)。
- 卡片字段双语:`status: {zh, en}`、`description: {zh, en}`;数字与版本号保持半角。
- 语言决策顺序:URL 参数 `?lang=zh|en` → `localStorage.site-lang` → `navigator.language`(`zh` 开头选中文,否则英文);选定后写回 `localStorage`。
- 切换时整页重渲染(渲染函数接收语言参数),`<html lang>` 同步设为 `zh-CN` / `en`;不要逐节点改文本。

## 卡片数据:main.js 唯一数据源

`main.js` 的 `modules` 数组列出全部五个模块(`scripts` 是工具链,不上卡片)。audit 机检依赖本文件:每个模块的 `<name>.moonbitlang.dev` 文本必须存在;结构可以改,链接与模块名不能丢。

状态只有三档:已发布 / 开发中 / 已废弃;角标是卡片右上角一条 45° 斜置缎带(两端由卡片圆角裁口),底色随状态(柔和绿 / 柔和蓝 / 柔和红,中调低饱和,不亮也不深);已发布模块的角标只显示版本号,开发中与已废弃显示状态短词。

| 模块 | 状态 | 版本 | docs 链接 |
| --- | --- | --- | --- |
| `bm2` | 已发布 / Released | `v0.6.0` | `https://bm2.moonbitlang.dev` |
| `clitable` | 已发布 / Released | `v0.2.0` | `https://clitable.moonbitlang.dev` |
| `clicolor` | 开发中 / In development | — | 无 |
| `dateku` | 开发中 / In development | — | 无 |
| `fndash` | 开发中 / In development | — | 无 |

描述要从各模块 `moon.mod` / README 摘事实:`clicolor` 的描述取自其 README(终端颜色与超链接转义序列库);`dateku` 与 `fndash` 的描述保留「方向未定」的诚实说明。

## 路径与引用

- 静态资源与站内跳转一律**相对路径**:`./style.css`、`./main.js`,不得以 `/` 开头引用本站资源或本站页面。
- 引用外域(GitHub、docs 子域名)用完整 URL,不受此条影响。
- 理由:单文件可以在本地 `file://` 直接打开预览,整体挪到任何子路径也不坏;`audit` 机检此条。
- 范围仅限门户仓库:VitePress 文档站的 `'/'` base 是其部署形态的刻意选择,不适用本条。

## 验收

- `bash /mnt/c/codes/moonbit/scripts/devkit.sh audit site`:全部就绪(manifest 一致;main.js 含五个模块子域链接)。
- 浏览器实测:中英切换全站文本切换;`?lang=en` 直达英文;刷新记住选择;`<html lang>` 正确;卡片数 = 5;各模块状态徽文如上表;深浅色都正常;控制台无报错。
- push 后 `https://moonbitlang.dev/` 返回 200 且内容为新版。

## 红线

- 零语言不虚构:任何卡片不得出现模块没有的能力描述。
- 不加依赖、不加构建、不动 `scripts/devkit/**`、`scripts/devkit.conf`、`.githooks`、`.github`。
- 不执行 git commit / git push / git add,提交时机由主会话口令决定。
- 除本仓库文件外不写任何路径。
