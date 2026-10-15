// moonbitlang.dev — 门户数据与渲染。零依赖；文案双语，数据一源（main.js）。
const i18n = {
  zh: {
    tagline: 'MoonBit 生态的小而锋利的工具集。',
    section: '模块',
    count: (n) => `共 ${n} 个`,
    state: { released: '已发布', dev: '开发中', deprecated: '已废弃' },
    corner: { dev: '开发中', deprecated: '已废弃' },
    links: { repo: 'GitHub', docs: '文档' },
    footer: '使用 MoonBit 构建 · 由 Cloudflare Pages 托管。',
  },
  en: {
    tagline: 'Small tools for the MoonBit ecosystem, written in MoonBit.',
    section: 'Modules',
    count: (n) => `${n} modules`,
    state: { released: 'Released', dev: 'In development', deprecated: 'Deprecated' },
    corner: { dev: 'Dev', deprecated: 'Deprecated' },
    links: { repo: 'GitHub', docs: 'Docs' },
    footer: 'Built with MoonBit. Hosted on Cloudflare Pages.',
  },
};

// 状态三档：released / dev / deprecated；角标颜色随状态。
// 版本号只出现在已发布模块的角标里；未发布模块的细节写进描述。
const modules = [
  {
    name: 'bm2', state: 'released', version: 'v0.6.0',
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
  },
  {
    name: 'dateku', state: 'dev',
    description: {
      zh: '方向未定，当前为符合工作区规范的最小骨架，不含业务能力。',
      en: 'Direction undecided; minimal workspace-conformant skeleton with no business features.',
    },
    repo: 'https://github.com/chenbimo/dateku',
  },
  {
    name: 'fndash', state: 'dev',
    description: {
      zh: '方向未定。',
      en: 'Direction undecided.',
    },
    repo: 'https://github.com/chenbimo/fndash',
  },
];

const STATE_CLASS = { released: 'st-released', dev: 'st-dev', deprecated: 'st-deprecated' };
const LANG_KEY = 'site-lang';

function pickLang() {
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'zh' || q === 'en') return q;
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === 'zh' || saved === 'en') return saved;
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

function linkItem(href, label) {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = label;
  return a;
}
function sep(text) {
  const s = document.createElement('span');
  s.className = 'dot';
  s.textContent = text;
  return s;
}

function render(lang) {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  localStorage.setItem(LANG_KEY, lang);
  const t = i18n[lang];

  document.getElementById('tagline').textContent = t.tagline;
  document.getElementById('section-label').textContent = t.section;
  document.getElementById('section-count').textContent = t.count(modules.length);
  document.getElementById('footer-copy').textContent = t.footer;
  document.querySelectorAll('.lang a').forEach((a) => {
    a.classList.toggle('active', a.dataset.lang === lang);
  });

  const grid = document.getElementById('modules');
  grid.textContent = '';
  for (const m of modules) {
    const card = document.createElement('article');
    card.className = 'card';

    const badge = document.createElement('span');
    badge.className = 'badge ' + STATE_CLASS[m.state];
    const label = document.createElement('i');
    // 已发布只显示版本号；开发中/已废弃在角标里显示状态短词。
    label.textContent = m.version ? m.version : t.corner[m.state];
    badge.append(label);
    card.append(badge);

    const name = document.createElement('h3');
    name.textContent = m.name;
    card.append(name);

    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = m.description[lang];
    card.append(desc);

    const links = document.createElement('div');
    links.className = 'links';
    links.append(linkItem(m.repo, t.links.repo));
    if (m.docs) {
      links.append(sep('·'), linkItem(m.docs, t.links.docs));
    }
    card.append(links);

    grid.append(card);
  }

  history.replaceState(null, '', lang === 'en' ? '?lang=en' : location.pathname);
}

document.querySelectorAll('.lang a').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    render(a.dataset.lang);
  });
});

render(pickLang());
