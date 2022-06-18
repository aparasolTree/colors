<script setup lang="ts">
import { useClipnoard } from '@/features/useClipboard';
import { computed, ref } from 'vue';

interface Gradient {
    color: string;
    pos: string;
}

interface GradientColorProp {
    name: string;
    gradient: Gradient[];
    deg: string;
    method: string;
    index: number;
}

const props = defineProps<GradientColorProp>();

const gradientColor = computed(
    () =>
        `${props.method}-gradient(${props.deg}, ${props.gradient.map(
            (v) => `${v.color} ${v.pos}`
        )})`
);
const gradientDesc = computed(() =>
    props.gradient.length == 2
        ? `${props.gradient[0].color} → ${props.gradient[1].color}`
        : 'Many colors'
);

const { copied, copy } = useClipnoard({ source: gradientColor });
</script>

<template>
    <section class="gradient-color-panel">
        <header class="gradient-color-panel-header">
            <span class="gradient-color-name">
                {{ index.toString().padStart(3, '0') }} {{ name }}
            </span>
        </header>
        <main class="gradient-color-wrapper">
            <div
                class="gradient-color"
                :style="{
                    backgroundImage: gradientColor,
                }"
                :data-css-code="gradientColor"
            ></div>
        </main>
        <footer class="gradient-color-footer">
            <span class="gradient-color-desc">
                {{ gradientDesc }}
            </span>
            <button class="copy-gradient-color-code" @click="() => copy()">Copy CSS</button>
        </footer>
        <div class="mask" :style="{ opacity: copied ? '1' : '0' }" ref="copyElement">😄</div>
    </section>
</template>

<style lang="scss" scoped>
.gradient-color-panel {
    position: relative;
    display: inline-block;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 6px 0px 12px rgba($color: #333, $alpha: 0.2);
    background-color: var(--panel-bg-color);
}

.gradient-color-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .gradient-color-name {
        font-size: 14px;
    }
}

.gradient-color-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;

    .gradient-color {
        margin: 50px 0;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        box-shadow: 3px 3px 6px rgba($color: #333, $alpha: 0.3);
    }
}

.gradient-color-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .copy-gradient-color-code {
        background-color: transparent;
        font-size: 12px;
        cursor: pointer;

        &:hover::after {
            transform-origin: center left;
            transform: scaleX(1);
        }

        &::after {
            content: '';
            display: block;
            height: 1.5px;
            transform-origin: center right;
            transform: scaleX(0);
            background-color: #333;
            transition: transform 0.3s ease-in-out;
        }
    }
}

.mask {
    opacity: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);
    transition: opacity 0.3s ease-in-out;
}
</style>
