import { createApp } from 'vue';

import App from './app.vue';
import { setupReport } from './utils/report.js';
import './styles/global.scss';

const app = createApp(App);

/* 首帧前的 <html> 主题落定在 index.html 的内联脚本里,这里只挂应用 */
setupReport();
app.mount('#app');
