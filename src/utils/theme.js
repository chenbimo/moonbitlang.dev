// 主题:头部拉线开关显式选择并记忆;未选择时跟随系统。
// index.html 里的内联脚本在首帧前已落 dataset.theme,避免闪白/闪黑——这里只负责切换。

export const $Theme = {
    key: 'site-theme',
    current() {
        const set = document.documentElement.dataset.theme;
        if (set === 'dark' || set === 'light') {
            return set;
        }
        return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },
    apply(theme) {
        document.documentElement.classList.add('theming');
        setTimeout(() => document.documentElement.classList.remove('theming'), 260);
        document.documentElement.dataset.theme = theme;
        try {
            localStorage.setItem($Theme.key, theme);
        } catch (e) {
            /* 隐私模式等场景忽略 */
        }
    },
    toggle() {
        $Theme.apply($Theme.current() === 'dark' ? 'light' : 'dark');
    }
};
