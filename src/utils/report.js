// 在线上报：接入 yicode 统一统计。契约在 befly-shared/specs/report-spec.md；
// 实现参考 befly-shared/utils/reportClient.js + reportSetup.js —— 这里按同一协议
// 写一份消费端精简版，只发在线（不报错误：纯静态单页无运行时面），改协议先改那边。

const REPORT_URL = 'https://api.yicode.tech/api/core/tongJi/reportOnline';
const REPORT_BEAT_MS = 30 * 60 * 1000;

function clientId() {
    // 与 befly-shared/utils/clientId.js 同键名同算法：密码学随机 10 位 hex，localStorage 持久化。
    try {
        const stored = String(localStorage.getItem('befly-client-id') || '').trim();
        if (stored) {
            return stored;
        }
    } catch (e) {
        /* localStorage 不可用（隐私模式）：每次访问独立标识，仍可计数 */
    }
    const id = (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().replaceAll('-', '') : String(Date.now())).slice(0, 10);
    try {
        localStorage.setItem('befly-client-id', id);
    } catch (e) {
        /* 可忽略 */
    }
    return id;
}

function env() {
    // 精简 UA 识别：主四大浏览器取名+版本，平台键取小写系统名（映射表同 befly-shared 的口径）。
    const ua = navigator.userAgent;
    const version = String((/(?:Edg|OPR|Firefox|Chrome|Version)\/([\d.]+)/.exec(ua) || [])[1] || '');
    const browserName = (() => {
        if (/Edg\//.test(ua)) {
            return 'Edge';
        }
        if (/OPR\//.test(ua)) {
            return 'Opera';
        }
        if (/Firefox\//.test(ua)) {
            return 'Firefox';
        }
        if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) {
            return 'Chrome';
        }
        if (/Safari\//.test(ua) && /Version\//.test(ua)) {
            return 'Safari';
        }
        return 'Other';
    })();
    const systemName = (() => {
        if (/Windows/.test(ua)) {
            return 'windows';
        }
        if (/Mac OS/.test(ua)) {
            return 'macos';
        }
        if (/Android/.test(ua)) {
            return 'android';
        }
        if (/iPhone|iPad|iOS/.test(ua)) {
            return 'ios';
        }
        if (/Linux/.test(ua)) {
            return 'linux';
        }
        return 'unknown';
    })();

    return { clientVersion: `${browserName} ${version}`.trim(), systemName: systemName };
}

function localDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

let reportedDate = '';

function sendOnline() {
    // 启动一条 + 跨天补一条：同一天重复上报也没关系，服务端按（日期×成员）upsert 幂等。
    const date = localDate(Date.now());
    if (date === reportedDate) {
        return;
    }
    reportedDate = date;
    fetch(REPORT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
            productCode: 'webMoonkit',
            productName: 'Moonkit',
            productVersion: '1.0.0',
            productType: 'browser',
            clientId: clientId(),
            clientVersion: env().clientVersion,
            systemName: env().systemName
        })
    }).catch(() => {
        /* 遥测失败即放弃，不打扰访客 */
    });
}

/** 业务入口：装载在线上报（启动一条 + 30 分钟心跳里的跨天补报）。 */
export function setupReport() {
    sendOnline();
    globalThis.setInterval?.(sendOnline, REPORT_BEAT_MS);
}
