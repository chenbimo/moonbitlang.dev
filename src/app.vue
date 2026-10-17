<template>
    <main>
        <!-- 品牌区:Logo 与标题同行,tagline 折行后左对齐到 Logo -->
        <header class="site">
            <div class="brand">
                <img class="mark" src="/logo.svg" alt="" width="40" height="40" />
                <h1>{{ $Const.config.appTitle }}</h1>
                <p class="tagline">{{ $Data.dict.tagline }}</p>
            </div>

            <div class="controls">
                <ThemeCord :label="$Data.dict.theme" @toggle="() => $Theme.toggle()" />

                <!-- 分段式语言切换:当前语言加重,另一语言为可点链接 -->
                <nav class="lang" aria-label="Language">
                    <a
                        v-for="lang in $Const.langOptions"
                        :key="lang.code"
                        :class="{ active: $Data.lang === lang.code }"
                        :href="`./?lang=${lang.code}`"
                        @click.prevent="$Method.switchLang(lang.code)"
                    >
                        {{ lang.text }}
                    </a>
                </nav>
            </div>
        </header>

        <!-- 推荐段在前,其余模块在后;两段各带计数 -->
        <section v-for="group in $Computed.groups" :key="group.label" class="section">
            <div class="section-head">
                <h2>{{ group.label }}</h2>
                <span class="count">{{ group.count }}</span>
            </div>
            <div class="grid">
                <ModuleCard
                    v-for="module in group.list"
                    :key="module.name"
                    :module="module"
                    :description="module.description[$Data.lang]"
                    :corner="$Data.dict.corner"
                    :repo-label="$Data.dict.links.repo"
                    :docs-label="$Data.dict.links.docs"
                />
            </div>
        </section>

        <footer class="site-foot">
            <p class="copy">
                <!-- 页脚小标:只留耳与月面的轮廓,单色 --faint,无内耳;几何是 logo.svg 的同源副本,改几何必须一并重出 -->
                <svg class="mark-sm" viewBox="0 0 64 64" aria-hidden="true">
                    <g transform="translate(-8.348 -16.165) scale(1.2609)">
                        <path d="M26 38.5 Q34.62 26.53 21.2 20.4 Q12.58 32.37 26 38.5 Z" fill="currentColor" />
                        <path d="M37.2 38.5 C34.6 33 34.4 26.5 37.8 20.8 C41.6 20.6 47.4 21.6 50.8 24.2 C53.6 26.2 53.8 29 51.2 29.8 C49.4 30.3 47.6 29.4 46.4 27.8 C44.6 29.6 43.9 33.2 43.9 38.5 Z" fill="currentColor" />
                        <path d="M9 56 A23 23 0 0 1 55 56 Z" fill="currentColor" />
                    </g>
                </svg>
                <span>{{ $Data.dict.footer }}</span>
            </p>
            <p class="foot-links">
                <a href="https://github.com/chenbimo" target="_blank" rel="noreferrer">GitHub</a><span class="dot">·</span><a href="https://mooncakes.io" target="_blank" rel="noreferrer">Mooncakes</a>
            </p>
        </footer>
    </main>
</template>

<script setup>
import { computed, reactive } from "vue";

import ModuleCard from "@/components/moduleCard.vue";
import ThemeCord from "@/components/themeCord.vue";
import { $Config, $Lang, $ModuleList } from "@/configs/config.js";
import { $Theme } from "@/utils/theme.js";

const $Const = { config: $Config, langOptions: [ { code: "zh", text: "中文" }, { code: "en", text: "EN" } ] };

const $Data = reactive({ lang: $Lang.pick(), dict: $Lang.dict[$Lang.pick()] });

const $Computed = reactive({
    // 推荐段(featured)在前,其余模块在后,两段各带计数;段为空就不出
    groups: computed(() => {
        const t = $Data.dict;
        const groups = [];
        const featured = $ModuleList.filter((module) => module.featured);
        const rest = $ModuleList.filter((module) => !module.featured);
        if (featured.length > 0) {
            groups.push({ label: t.featured, count: t.count(featured.length), list: featured });
        }
        if (rest.length > 0) {
            groups.push({ label: t.section, count: t.count(rest.length), list: rest });
        }
        return groups;
    })
});

const $Method = {
    switchLang(lang) {
        $Data.lang = lang;
        $Data.dict = $Lang.dict[lang];
        $Lang.save(lang);
        document.documentElement.lang = $Data.dict.htmlTag;
        // 语言落在 URL 上:直达链接 (?lang=en) 可分享,刷新记住选择
        history.replaceState(null, "", lang === "en" ? "?lang=en" : location.pathname);
    }
};
</script>
