<template>
    <button class="cord" type="button" :aria-label="$Prop.label" :title="$Prop.label" @pointerdown="$Method.startDrag" @click="$Method.onClick">
        <span class="cord-anchor"></span>
        <span :class="['cord-wrap', { 'cord-paused': $Data.dragging }]">
            <span class="cord-line" :style="{ height: `calc(28px + ${$Data.pull}px)` }"></span>
            <span class="cord-handle" :style="{ top: `calc(28px + ${$Data.pull}px)` }"></span>
        </span>
    </button>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive } from 'vue';

const $Prop = defineProps({ label: { type: String, default: '' } });
const $Emit = defineEmits(['toggle']);

const $Const = { threshold: 20, maxPull: 64 };

// 短按/键盘也给一次「拉一下再弹回」的手感
const $Data = reactive({ dragging: false, startY: 0, pull: 0, suppressClick: false, snapTimerId: null });

const $Method = {
    startDrag(e) {
        $Data.dragging = true;
        $Data.startY = e.clientY;
        $Data.pull = 0;
        $Data.suppressClick = false;
        try {
            e.target.setPointerCapture(e.pointerId);
        } catch (err) {
            /* 合成事件或旧环境忽略 */
        }
    },
    moveDrag(e) {
        if (!$Data.dragging) {
            return;
        }
        $Data.pull = Math.max(0, Math.min($Const.maxPull, e.clientY - $Data.startY));
    },
    endDrag() {
        if (!$Data.dragging) {
            return;
        }
        $Data.dragging = false;
        if ($Data.pull >= $Const.threshold) {
            $Emit('toggle');
            $Data.suppressClick = true; // 这次切换已由拖拽完成,吞掉随后的 click
        }
        $Data.pull = 0;
    },
    onClick() {
        if ($Data.suppressClick) {
            $Data.suppressClick = false;
            return;
        }
        $Emit('toggle');
        // 短按/键盘也给一次「拉一下再弹回」的手感
        clearTimeout($Data.snapTimerId);
        $Data.pull = $Const.threshold;
        $Data.snapTimerId = setTimeout(() => ($Data.pull = 0), 30);
    }
};

function onPointerMove(e) {
    $Method.moveDrag(e);
}
function onPointerUp(e) {
    $Method.endDrag(e);
}
onMounted(() => {
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerUp);
});
onBeforeUnmount(() => {
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    document.removeEventListener('pointercancel', onPointerUp);
    clearTimeout($Data.snapTimerId);
});
</script>

<style scoped lang="scss">
/* 拉线开关:一截灯绳,下拉切换主题;几何与过渡与原版逐条一致 */
.cord {
    position: relative;
    width: 26px;
    height: 62px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: grab;
    touch-action: none; /* 触屏下也要连续收到 pointermove */

    &:active {
        cursor: grabbing;
    }
    &:focus-visible {
        outline: 2px solid var(--link);
        outline-offset: 3px;
        border-radius: 6px;
    }
}

/* 顶端的固定点:一颗小铆钉 */
.cord-anchor {
    position: absolute;
    left: 50%;
    top: -3px;
    width: 8px;
    height: 8px;
    margin-left: -4px;
    border-radius: 50%;
    background:
        radial-gradient(circle at 34% 30%, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0) 55%),
        var(--border-strong);
    box-shadow: 0 0.5px 1px rgba(0, 0, 0, 0.25);
}

/* 绳与链:从铆钉处垂下,平时自发轻摆 */
.cord-wrap {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    transform-origin: 50% -3px;
    animation: cord-sway 6.4s ease-in-out infinite alternate;
}
.cord-wrap.cord-paused {
    animation-play-state: paused;
}
/* 拖动过程关掉过渡,做到跟手 */
.cord-wrap.cord-paused .cord-line,
.cord-wrap.cord-paused .cord-handle {
    transition: none;
}

/* 绳:3px 宽,交叉纹理像编织;长度随拉距伸缩 */
.cord-line {
    position: absolute;
    left: 50%;
    top: 0;
    width: 3px;
    margin-left: -1.5px;
    border-radius: 1.5px;
    background-color: var(--cord-color);
    background-image:
        repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.5) 0 1.5px, rgba(255, 255, 255, 0) 1.5px 4px),
        repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.07) 0 1.5px, rgba(0, 0, 0, 0) 1.5px 4px);
    transition: height 380ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 拉手:白色塑料水滴头,绳从顶端穿入 */
.cord-handle {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 13px;
    height: 22px;
    background: linear-gradient(100deg, var(--handle-hi) 0%, var(--handle-mid) 38%, var(--handle-lo) 100%);
    border-radius: 6px 6px 7px 7px / 4px 4px 11px 11px;
    box-shadow:
        inset 0 2px 3px -1px rgba(0, 0, 0, 0.12),
        0 2px 4px rgba(0, 0, 0, 0.16);
    transition: top 380ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes cord-sway {
    from {
        transform: rotate(-1.6deg);
    }
    to {
        transform: rotate(1.6deg);
    }
}
@media (prefers-reduced-motion: reduce) {
    .cord-wrap {
        animation: none;
    }
    .cord-line,
    .cord-handle {
        transition: none;
    }
}
</style>
