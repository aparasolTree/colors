<script setup lang="ts">
import { computed, ref } from 'vue';
import { useColor } from '@/store/useColor';
import { clamp } from '@/components/ColorPicker/util';
import { sort } from '@/shared/index';
import ColorPicker, { ColorChangeArgs } from '../ColorPicker';
import Slider from '@/components/Slider/index.vue';
import { useClipnoard } from '@/features/useClipboard';

const Color = useColor();
const LinearGradient = computed(
    () =>
        `linear-gradient(${Color.deg}deg, ${sort(Color.group)
            .map((c) => `${c.color} ${c.pos}%`)
            .join(',')})`
);
const addColor = () => {
    Color.addColor();
    setColorValue();
};
const setColor = (index: number) => {
    Color.setColorIndex(index);
    setColorValue();
};
const handleChange = (color: ColorChangeArgs) => Color.modifyColor('#' + color.hex);

const colorValue = ref('#ff0000');
const setColorValue = () => (colorValue.value = Color.group[Color.modifyIndex].color);

const isShow = ref(false);
const toggle = () => (isShow.value = false);

const isEdit = ref(false);
const colorPosition = computed(() => (isEdit.value ? 'editc-olor-position' : ''));
const isAnimate = ref(false);
const handleEdit = () => {
    isAnimate.value = true;
    isEdit.value ? (isEdit.value = false) : (isEdit.value = true);
    setTimeout(() => (isAnimate.value = false), 300);
};

const handleRemove = () => Color.removeColor();

function handleMouseUp(event: Event) {
    (event.target as HTMLDivElement).style.zIndex = '1';
    window.removeEventListener('mousemove', handleDrage);
    window.removeEventListener('mouseup', handleMouseUp);
    Color.sort();
}

const handleMouseDown = (index: number, event: Event) => {
    (event.target as HTMLDivElement).style.zIndex = '3';
    setColor(index);
    window.addEventListener('mousemove', handleDrage);
    window.addEventListener('mouseup', handleMouseUp);
};
const container = ref<HTMLDivElement>();
function handleDrage(event: MouseEvent | TouchEvent) {
    event.stopPropagation();
    if (!container.value) return;
    if (!isEdit) return;

    let hueContainerWidth = container.value.offsetWidth;

    let xOffset = container.value.getBoundingClientRect().left + window.scrollX;
    let pageX =
        (event as MouseEvent).pageX ||
        ((event as TouchEvent).touches ? (event as TouchEvent).touches[0].pageX : 0);
    let left = pageX - xOffset;
    let pos = clamp(Math.round((left / hueContainerWidth) * 100), 100, 0);
    Color.setPodition(pos);
}

const { copied, copy } = useClipnoard({ source: LinearGradient });
</script>

<template>
    <button title="Make color" class="make-panel btn" @click="isShow = true">M</button>
    <div class="make-color__panel_wrapper" @click.self="toggle" v-show="isShow">
        <div class="make-color__panel">
            <div style="display: flex; flex-direction: column">
                <div
                    class="color-show__panel"
                    :style="{
                        backgroundImage: LinearGradient,
                    }"
                >
                    <div class="copy-css" @click="() => copy()" title="Copy Css">
                        {{ copied ? 'Copied' : 'Copy CSS' }}
                    </div>
                </div>
                <div class="action">
                    <div class="color-add" @click="addColor" title="Add Color">A</div>
                    <div class="color-item-show" :class="colorPosition" ref="container">
                        <div
                            v-for="({ color, pos, id }, index) in Color.group"
                            :key="id"
                            class="color-item"
                            :style="{
                                backgroundColor: color,
                                left: isEdit ? `${pos}%` : `${index * 10}%`,
                                transition: isAnimate ? 'all 0.3s ease-in-out' : '',
                            }"
                            :name="color"
                            @mousedown="handleMouseDown(index, $event)"
                            @touchmove="handleDrage"
                            @touchstart="handleDrage"
                        ></div>
                    </div>
                    <div class="color-edit" title="Edit Color" v-if="!isEdit" @click="handleEdit">
                        E
                    </div>
                    <div class="color-edit" title="Cancel" v-else @click="handleEdit">C</div>
                    <div class="color-remove" title="Remove Color" @click="handleRemove">R</div>
                </div>
                <Slider
                    class="show-number"
                    :offset="Color.deg / 360"
                    @change-value="(deg: number) => Color.setAngle(deg * 360)"
                    v-slot="{ value }"
                >
                    <div class="number-display">{{ (value * 360).toFixed(0) }}</div>
                </Slider>
            </div>
            <div style="margin-left: 20px">
                <ColorPicker :value="colorValue" @color-change="handleChange" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.make-panel {
    background-color: #fff;
}

.make-color__panel_wrapper {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(3px);

    .make-color__panel {
        background-color: #fff;
        box-shadow: 0 6px 12px rgba($color: #333, $alpha: 0.3);
        border-radius: 10px;
        padding: 30px;
        display: flex;

        > div {
            display: flex;
        }
    }

    .color-show__panel {
        width: 260px;
        height: 260px;
        border-radius: 10px;
        position: relative;

        &:hover .copy-css {
            display: block;
        }

        .copy-css {
            display: none;
            position: absolute;
            right: 10px;
            top: 10px;
            color: #fff;
            cursor: pointer;
            text-shadow: 0 3px 3px rgba($color: #000000, $alpha: 0.3);
        }
    }
}

.color-add,
.color-edit,
.color-remove {
    border: 2px solid #ccc;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px;
    cursor: pointer;
}
.action {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
}
.color-item-show {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex: 1;
    margin: 0 10px;
    position: relative;
    &.editc-olor-position::after {
        content: '';
        position: absolute;
        height: 3px;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
        background: #ccc;
    }
    .color-item {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #ccc;
        transform: translateX(-6px);
        cursor: pointer;
        position: absolute;
        z-index: 2;
        user-select: none;

        &:hover::after,
        &:hover::before {
            display: block;
        }

        &::after,
        &::before {
            display: none;
            position: absolute;
        }

        &::before {
            content: attr(name);
            top: -40px;
            right: -10px;
            padding: 5px;
            border-radius: 5px;
            background-color: #fff;
            box-shadow: 0 3px 6px rgba($color: #333, $alpha: 0.3);
        }

        &::after {
            content: '';
            border: 6px solid transparent;
            border-top-color: #fff;
            top: -15px;
            right: -2px;
        }
    }
}

.show-number {
    margin: 10px 10px 0;
}

.show-number:hover .number-display {
    display: block;
}

.number-display {
    display: none;
    position: absolute;
    top: -26px;
    right: -9px;
    padding: 1px 16px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 3px 6px rgba($color: #000000, $alpha: 0.1);

    &::before {
        content: '';
        display: block;
        position: absolute;
        right: 8px;
        bottom: -9px;
        border: 5px solid transparent;
        border-top-color: #fff;
    }
}
</style>
