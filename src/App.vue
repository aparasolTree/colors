<script setup lang="ts">
import GradientWrapper from '@/components/GradientWrapper/index.vue'
import BackTop from '@/components/common/BackTop/index.vue'
import MakeColor from '@/components/MakeColor/index.vue'
</script>

<template>
    <header class="gradient-web-header">
        GradientColor
    </header>
    <GradientWrapper></GradientWrapper>
    <div class="flxed">
        <MakeColor />
        <BackTop :top="300" />
    </div>
</template>

<style lang="scss">
:root {
    --bg-color: #f1f5f8;
    --text-color-white: #f1f5f8;
    --text-color-dark: #333;
    --panel-bg-color: #fff;
}

* {
    padding: 0;
    margin: 0;
    font-size: 12px;
    box-sizing: border-box;
    border: none;
    outline: none;
    text-decoration: none;
}

body {
    background-color: var(--bg-color);
}

.gradient-web-header {
    height: 40px;
    color: transparent;
    background-clip: text;
    -moz-background-clip: text;
    -webkit-background-clip: text;
    background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
    font-size: 20px;
    padding: 0 50px;
    line-height: 40px;
    background-color: #fff;
    box-shadow: 0 3px 6px rgba($color: #333, $alpha: .2);
}

.flxed {
    position: fixed;
    bottom: 20px;
    right: 20px;
}

.btn {
    border-radius: 50%;
    margin: 10px 0;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;
    box-shadow: 3px 3px 12px rgba($color: #333, $alpha: .2);
}
</style>
