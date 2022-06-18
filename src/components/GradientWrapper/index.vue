<script setup lang='ts'>
import GradientPlanel from '../GradientPanel/index.vue'
import gradientColor from '@/assets/colors.json'
</script>

<template>
    <main class="gradient-panel-wrapper">
        <GradientPlanel v-for="(gradient, index) in gradientColor" v-bind="gradient" :index="index + 1" :key="index" />
    </main>
</template>

<style lang='scss' scoped>
.gradient-panel-wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 50px;
}


@media screen and (max-width: 1024px) {
    .gradient-panel-wrapper {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        padding: 50px;
    }
}

@media screen and (max-width: 768px) {
    .gradient-panel-wrapper {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        padding: 50px;
    }
}

@media screen and (max-width: 640px) {
    .gradient-panel-wrapper {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 20px;
        padding: 50px;
    }
}
</style>