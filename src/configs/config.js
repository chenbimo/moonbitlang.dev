// Moonkit — MoonBit 生态门户。双语字典与模块卡片数据都只有这一处真相。
// 卡片数据被 devkit audit 机检(每个模块的子域链接必须出现),改结构可以,链接与模块名不能丢。

export const $Config = {
    appTitle: 'Moonkit',
    metaDesc: 'Moonkit：MoonBit 生态的小而锋利的工具集。',
};

// 语言决策顺序:URL 参数 ?lang=zh|en → localStorage.site-lang → navigator.language。
// 选定后写回 localStorage;URL 处于 ?lang=en 直达英文。机制与旧版 main.js 一致。
export const $Lang = {
    key: 'site-lang',
    /**
     * 解析当前语言。
     * @returns {'zh' | 'en'}
     */
    pick() {
        const q = new URLSearchParams(location.search).get('lang');
        if (q === 'zh' || q === 'en') {
            return q;
        }
        try {
            const saved = localStorage.getItem($Lang.key);
            if (saved === 'zh' || saved === 'en') {
                return saved;
            }
        } catch (e) {
            /* localStorage 不可用:退到 navigator */
        }
        return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
    },
   
   /** 落盘记忆。 */
    save(lang) {
        try {
            localStorage.setItem($Lang.key, lang);
        } catch (e) {
            /* 隐私模式忽略 */
        }
    },
    /** 全部 UI 文案,覆盖站名副语、页脚、切换标签;卡片字段双语在 $ModuleList 里。 */
    dict: {
        zh: {
            htmlTag: 'zh-CN',
            linkTitle: '英文',
            tagline: 'MoonBit 生态的小而锋利的工具集',
            section: '模块',
            featured: '推荐',
            count: (n) => `共 ${n} 个`,
            state: { released: '已发布', dev: '开发中', deprecated: '已废弃' },
            corner: { dev: '开发中', deprecated: '已废弃' },
            theme: '下拉切换主题',
            links: { repo: 'GitHub', docs: '文档' },
            footer: '使用 MoonBit 构建 · 由 Cloudflare Pages 托管。',
        },
        en: {
            htmlTag: 'en',
            linkTitle: '中文',
            tagline: 'Small tools for the MoonBit ecosystem, written in MoonBit.',
            section: 'Modules',
            featured: 'Featured',
            count: (n) => `${n} modules`,
            state: { released: 'Released', dev: 'In development', deprecated: 'Deprecated' },
            corner: { dev: 'Dev', deprecated: 'Deprecated' },
            theme: 'Pull to switch theme',
            links: { repo: 'GitHub', docs: 'Docs' },
            footer: 'Built with MoonBit. Hosted on Cloudflare Pages.',
        },
    },
};

// 状态三档:released / dev / deprecated;角标底色随状态(class 即语义)。
// 版本号只出现在已发布模块的角标里;未发布模块的细节写进描述。
export const $ModuleList = [
    {
        name: 'bm2', state: 'released', version: 'v0.6.0', featured: true,
        description: {
            zh: 'Bun 与 Node.js 的进程管理器：两个静态二进制，不带运行时；监督、日志轮转、通知与自升级由一个守护进程完成。',
            en: 'A lightweight process manager for Bun and Node.js applications, written in MoonBit. Two static binaries, no runtime.',
        },
        repo: 'https://github.com/chenbimo/bm2',
        docs: 'https://bm2.moonbitlang.dev',
    },
    {
        name: 'clitable', state: 'released', version: 'v0.2.0',
        description: {
            zh: '用 MoonBit 写的终端表格渲染库：列定义说明「这一列怎么显示」，行数据说明「显示什么」，wasm-gc / js / native 三端可跑。',
            en: 'A terminal table rendering library written in MoonBit: columns say how to show, rows say what to show. Runs on wasm-gc, js and native.',
        },
        repo: 'https://github.com/chenbimo/clitable',
        docs: 'https://clitable.moonbitlang.dev',
    },
    {
        name: 'clicolor', state: 'dev',
        description: {
            zh: '终端颜色与超链接转义序列库：不可变的 Style 值，链式组装前景、背景与修饰，坏色值安全降级。',
            en: 'ANSI color and hyperlink escape-sequence library: immutable Style values assembled by chaining, with bad colors degrading safely.',
        },
        repo: 'https://github.com/chenbimo/clicolor',
        docs: 'https://clicolor.moonbitlang.dev',
    },
    {
        name: 'dateku', state: 'dev',
        description: {
            zh: '方向未定，当前为符合工作区规范的最小骨架，不含业务能力。',
            en: 'Direction undecided; minimal workspace-conformant skeleton with no business features.',
        },
        repo: 'https://github.com/chenbimo/dateku',
        docs: 'https://dateku.moonbitlang.dev',
    },
    {
        name: 'fndash', state: 'dev',
        description: {
            zh: '方向未定。',
            en: 'Direction undecided.',
        },
        repo: 'https://github.com/chenbimo/fndash',
        docs: 'https://fndash.moonbitlang.dev',
    },
];
