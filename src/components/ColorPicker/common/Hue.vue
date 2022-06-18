<script setup lang='ts'>
import { ref } from 'vue';
import { useColor } from '../use/useColor';
import { clamp } from '../util';
import Slider from '@/components/Slider/index.vue';

const props = defineProps<{ value: string }>()
const emits = defineEmits(['change'])

const { color } = useColor(props.value)

const handleMove = (value: number) => {
    let h = clamp(Math.round(value * 360), 360, 0)
    if (color.value!.hsv.h !== h) {
        emits('change', {
            h,
            s: color.value!.hsl.s,
            l: color.value!.hsl.l,
            a: color.value!.hsl.a,
        })
    }
}
</script>

<template>
    <div class="color-picker-hue">
        <Slider class="color-hue-container" role="slider" aria-valuemax="360" aria-valuemin="0"
            :offset="color!.hsl.h / 360" @change-value="handleMove">
        </Slider>
    </div>
</template>

<style lang='scss' scoped>
.color-picker-hue {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
}

.color-hue-container {
    cursor: pointer;
    position: relative;
    height: 100%;
    background-color: orange;
    background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
    border-radius: 3px;
}
</style>