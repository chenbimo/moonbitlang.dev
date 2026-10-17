import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
    root: fileURLToPath(new URL('.', import.meta.url)),
    // 产物以相对路径引用资源:audit 机检「index.html 不得以 / 引用本站资源」,
    // 且单页可以 file:// 打开、挪到任何子路径都不坏(约定见 AGENTS.md「路径与引用」)。
    base: './',
    resolve: {
        alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
    },
    plugins: [vue()],
});
