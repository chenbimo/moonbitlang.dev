// Moonkit — MoonBit 生态门户。零依赖；文案双语，数据一源（main.js）。
const i18n = {
  zh: {
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
};

// 状态三档：released / dev / deprecated；角标颜色随状态。
// 版本号只出现在已发布模块的角标里；未发布模块的细节写进描述。
const modules = [
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
  document.getElementById('footer-copy').textContent = t.footer;
  const cordEl = document.getElementById('cord');
  cordEl.title = t.theme;
  cordEl.setAttribute('aria-label', t.theme);
  document.querySelectorAll('.lang a').forEach((a) => {
    a.classList.toggle('active', a.dataset.lang === lang);
  });

  // 推荐段在前,其余模块在后;两段各带计数
  const sections = document.getElementById('sections');
  sections.textContent = '';
  const featured = modules.filter((m) => m.featured);
  const rest = modules.filter((m) => !m.featured);
  if (featured.length > 0) sections.append(buildSection(t.featured, featured, lang));
  if (rest.length > 0) sections.append(buildSection(t.section, rest, lang));

  history.replaceState(null, '', lang === 'en' ? '?lang=en' : location.pathname);
}

function buildSection(labelText, list, lang) {
  const t = i18n[lang];
  const section = document.createElement('section');
  section.className = 'section';

  const head = document.createElement('div');
  head.className = 'section-head';
  const label = document.createElement('h2');
  label.textContent = labelText;
  const count = document.createElement('span');
  count.className = 'count';
  count.textContent = t.count(list.length);
  head.append(label, count);
  section.append(head);

  const grid = document.createElement('div');
  grid.className = 'grid';
  for (const m of list) grid.append(buildCard(m, lang));
  section.append(grid);

  return section;
}

function buildCard(m, lang) {
  const t = i18n[lang];
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

  return card;
}

document.querySelectorAll('.lang a').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    render(a.dataset.lang);
  });
});

// ── 拉线开关:拖过阈值切主题,松手回弹;短按/键盘也能切 ────────
const THEME_KEY = 'site-theme';
const CORD_THRESHOLD = 20;  // 拉过这么多就认作一次切换
const CORD_MAX = 64;

const cord = document.getElementById('cord');
let dragging = false;
let startY = 0;
let pull = 0;
let suppressClick = false;

function currentTheme() {
  const set = document.documentElement.dataset.theme;
  if (set === 'dark' || set === 'light') return set;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.classList.add('theming');
  setTimeout(() => document.documentElement.classList.remove('theming'), 260);
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* 隐私模式等场景忽略 */ }
}

function toggleTheme() {
  applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
}

function setPull(v, animate) {
  // animate=false 时关掉过渡(拖动跟手);true 时由 CSS 的弹簧曲线回位
  cord.classList.toggle('pulling', !animate);
  cord.style.setProperty('--pull', v + 'px');
}

cord.addEventListener('pointerdown', (e) => {
  dragging = true;
  startY = e.clientY;
  pull = 0;
  suppressClick = false;
  try { cord.setPointerCapture(e.pointerId); } catch (err) { /* 合成事件或旧环境忽略 */ }
  setPull(0, false);
});
cord.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  pull = Math.max(0, Math.min(CORD_MAX, e.clientY - startY));
  setPull(pull, false);
});
function endPull() {
  if (!dragging) return;
  dragging = false;
  if (pull >= CORD_THRESHOLD) {
    toggleTheme();
    suppressClick = true; // 这次切换已由拖拽完成,吞掉随后的 click
  }
  setPull(0, true);
  pull = 0;
}
cord.addEventListener('pointerup', endPull);
cord.addEventListener('pointercancel', endPull);
cord.addEventListener('click', () => {
  if (suppressClick) { suppressClick = false; return; }
  toggleTheme();
  // 短按/键盘也给一次「拉一下再弹回」的手感
  cord.classList.add('pulling');
  cord.style.setProperty('--pull', '14px');
  setTimeout(() => {
    cord.classList.remove('pulling');
    cord.style.setProperty('--pull', '0px');
  }, 30);
});

render(pickLang());

// ── 在线上报：接入 yicode 统一统计。契约在 befly-shared/specs/report-spec.md；
// 实现参考 befly-shared/utils/reportClient.js + reportSetup.js —— 门户零依赖，
// 这里按同一协议写一份消费端精简版，只发在线（不报错误，无运行时面可报），改协议先改那边。
const REPORT_URL = 'https://api.yicode.tech/api/core/tongJi/reportOnline';
const REPORT_BEAT_MS = 30 * 60 * 1000;

function reportClientId() {
  // 与 befly-shared/utils/clientId.js 同键名同算法：密码学随机 10 位 hex，localStorage 持久化。
  try {
    const stored = localStorage.getItem('befly-client-id');
    if (stored) return stored;
    const id = (crypto.randomUUID ? crypto.randomUUID().replaceAll('-', '') : String(Date.now())).slice(0, 10);
    localStorage.setItem('befly-client-id', id);
    return id;
  } catch (e) { /* localStorage 不可用（隐私模式）：每次访问独立标识，仍可计数 */ }
  return (crypto.randomUUID ? crypto.randomUUID().replaceAll('-', '') : String(Date.now())).slice(0, 10);
}

function reportEnv() {
  // 精简 UA 识别：主四大浏览器取名+版本，平台键取小写系统名（映射表同 befly-shared 的口径）。
  const ua = navigator.userAgent;
  const pick = (re) => (re.exec(ua) || [])[1] || '';
  const browserName = (() => {
    if (/Edg\//.test(ua)) return 'Edge';
    if (/OPR\//.test(ua)) return 'Opera';
    if (/Firefox\//.test(ua)) return 'Firefox';
    if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) return 'Chrome';
    if (/Safari\//.test(ua) && /Version\//.test(ua)) return 'Safari';
    return 'Other';
  })();
  const clientVersion = (browserName + ' ' + pick(/(?:Edg|OPR|Firefox|Chrome|Version)\/([\d.]+)/)).trim();
  const os = (() => {
    if (/Windows/.test(ua)) return 'windows';
    if (/Mac OS/.test(ua)) return 'macos';
    if (/Android/.test(ua)) return 'android';
    if (/iPhone|iPad|iOS/.test(ua)) return 'ios';
    if (/Linux/.test(ua)) return 'linux';
    return 'unknown';
  })();
  return { clientVersion: clientVersion, systemName: os || 'unknown' };
}

function localDate(ts) {
  const d = new Date(ts);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

let reportDate = '';

function sendOnline() {
  // 启动一条 + 跨天补一条：同一天重复上报也没关系，服务端按（日期×成员）upsert 幂等。
  const date = localDate(Date.now());
  if (date === reportDate) return;
  reportDate = date;
  const env = reportEnv();
  fetch(REPORT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      productCode: 'webMoonkit',
      productName: 'Moonkit',
      productVersion: '1.0.0',
      productType: 'browser',
      clientId: reportClientId(),
      clientVersion: env.clientVersion,
      systemName: env.systemName,
    }),
  }).catch(() => { /* 遥测失败即放弃，不打扰访客 */ });
}

sendOnline();
setInterval(sendOnline, REPORT_BEAT_MS);
