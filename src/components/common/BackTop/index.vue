<script setup lang='ts'>
import { useWindowScroll } from '@/features/useWindowScroll';
import { watch } from 'vue';
defineProps<{ top: number }>()

const { y } = useWindowScroll()
const backTop = () => {
    window.scrollTo({ behavior: 'smooth', top: 0 })
}
</script>

<template>
    <button id="back-top" class="btn" :style="{
        display: `${y > top ? 'block' : 'none'}`
    }" @click="backTop">⬆</button>
</template>

<style lang='scss' scoped>
#back-top {
    background-color: #fff;
}
</style>