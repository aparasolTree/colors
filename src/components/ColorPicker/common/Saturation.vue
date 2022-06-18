<script setup lang="ts">
import { Position } from '@/features/useDraggable';
import { UseDraggable } from '@/features/useDraggable/component';
import { computed } from 'vue';
import { useColor } from '../use/useColor';
import { clamp } from '../util';

const props = defineProps<{ value: string }>();
const emits = defineEmits(['change']);

const { color } = useColor(props.value);
const bgColor = computed(() => `hsl(${color.value!.hsv.h}, 100%, 50%)`);

const x = computed(() => color.value!.hsv.s);
const y = computed(() => (color.value!.hsv.v - 1) * -1);

const handleMove = (position: Position) => {
    let saturation = position.x * 100;
    let bright = (-position.y + 1) * 100;

    emits('change', {
        h: color.value!.hsv.h,
        s: saturation,
        v: bright,
        a: color.value!.hsv.a,
    });
};
</script>

<template>
    <UseDraggable
        class="color-picker-saturation"
        :style="{ background: bgColor }"
        :onMove="handleMove"
        :onStart="handleMove"
    >
        <div class="color-picker--white"></div>
        <div class="color-picker--black"></div>
        <div class="color-picker-pointer" :style="{ left: `${x * 100}%`, top: `${y * 100}%` }">
            <div class="color-picker-circle"></div>
        </div>
    </UseDraggable>
</template>

<style lang="scss">
.color-picker-saturation,
.color-picker--white,
.color-picker--black {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.color-picker--white {
    background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
    pointer-events: none;
}

.color-picker--black {
    background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
    pointer-events: none;
}

.color-picker-pointer {
    cursor: pointer;
    position: absolute;
    user-select: none;
}

.color-picker-circle {
    cursor: head;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    box-shadow: 0 0 1.5px #333, inset 0 0 1px rgba(0, 0, 0, 0.3);
    border: 2px solid #ddd;
    transform: translate(-10px, -10px);
}
</style>
