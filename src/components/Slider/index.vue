<script setup lang='ts'>
import { ref } from 'vue';
import { clamp } from '../ColorPicker/util';

defineProps<{ offset: number }>()
const emits = defineEmits(['change-value'])

const container = ref<HTMLDivElement>()
const handleDown = (event: PointerEvent) => {
    handleChange(event)
    window.addEventListener('pointermove', handleChange)
    window.addEventListener('pointerup', handlePointerUp)
}

const handlePointerUp = () => {
    window.removeEventListener('pointermove', handleChange)
    window.removeEventListener('pointerup', handlePointerUp)
}

const handleChange = (event: PointerEvent) => {
    if (!container.value) return
    const ContainerWidth = container.value.offsetWidth
    const xOffset = container.value.getBoundingClientRect().left + window.scrollX
    emits('change-value', clamp((event.pageX - xOffset) / ContainerWidth, 1, 0))
}
</script>

<template>
    <div class="ele-track" @pointerdown="handleDown" ref="container">
        <div class="ele-slider" :style="{ left: `${(offset * 100).toFixed(0)}%` }">
            <slot :value="offset" />
        </div>
    </div>
</template>

<style lang='scss' scoped>
.ele-track {
    position: relative;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 2px;
    height: 4px;
    background-color: #ccc;
    cursor: pointer;
    z-index: 20;

    .ele-slider {
        position: absolute;
        top: 50%;
        transform: translateY(-50%) translateX(-50%);
        border-radius: 50%;
        width: 8px;
        height: 8px;
        background-color: #fff;
        box-shadow: 0 0 0 6px rgba($color: #000000, $alpha: .1);
        cursor: pointer;
    }

}
</style>