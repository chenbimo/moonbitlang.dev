<template>
    <article class="card">
        <!-- 角标:右上角一条 45° 斜置缎带,两端由卡片圆角裁掉;已发布只显示版本号,其余显示状态短词 -->
        <span :class="[$Const.stateClass[$Prop.module.state], 'badge']">
            <i>{{ $Prop.module.version || $Prop.corner[$Prop.module.state] }}</i>
        </span>

        <h3>{{ $Prop.module.name }}</h3>
        <p class="desc">{{ $Prop.description }}</p>

        <div class="links">
            <a :href="$Prop.module.repo" target="_blank" rel="noreferrer">{{ $Prop.repoLabel }}</a>
            <template v-if="$Prop.module.docs">
                <span class="dot">·</span>
                <a :href="$Prop.module.docs" target="_blank" rel="noreferrer">{{ $Prop.docsLabel }}</a>
            </template>
        </div>
    </article>
</template>

<script setup>
const $Prop = defineProps({
    module: { type: Object, required: true },
    description: { type: String, default: '' },
    corner: { type: Object, default: () => ({}) },
    repoLabel: { type: String, default: 'GitHub' },
    docsLabel: { type: String, default: '' }
});

const $Const = { stateClass: { released: 'st-released', dev: 'st-dev', deprecated: 'st-deprecated' } };
const $Method = {};
</script>

<style scoped lang="scss">
.card {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 18px 12px;
    transition:
        border-color 0.15s ease,
        transform 0.15s ease,
        box-shadow 0.15s ease;

    &:hover {
        border-color: var(--border-strong);
        transform: translateY(-1px);
        box-shadow: 0 3px 14px rgba(0, 0, 0, 0.05);
    }
    h3 {
        margin: 0;
        padding-right: 64px;
        font-size: 16.5px;
        font-weight: 650;
        letter-spacing: -0.012em;
    }
}

.badge {
    position: absolute;
    top: 26px;
    right: -42px;
    pointer-events: none;

    i {
        display: block;
        width: 142px;
        padding: 5px 0;
        transform: rotate(45deg);
        transform-origin: center;
        text-align: center;
        font-style: normal;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.07em;
        white-space: nowrap;
        color: var(--badge-fg);
        background: var(--fill-released);
    }
    &.st-dev i {
        background: var(--fill-dev);
    }
    &.st-deprecated i {
        background: var(--fill-deprecated);
        font-size: 10px;
    }
}

/* 描述最多两行,超出省略;两行高度撑住卡片,链接始终贴底 */
.desc {
    flex: 1 1 auto;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    margin: 7px 44px 10px 0;
    font-size: 13.5px;
    line-height: 1.55;
    color: var(--fg);
    opacity: 0.92;
}

.links {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;

    a {
        color: var(--link);
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
}
.dot {
    color: var(--faint);
}
</style>
