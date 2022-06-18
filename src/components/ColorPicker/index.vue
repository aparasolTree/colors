<script setup lang="ts">
import Stauration from './common/Saturation.vue';
import Hue from './common/Hue.vue';
import EditableInput from './common/EditableInput.vue';
import { useColor } from './use/useColor';
import { computed, ref, watch } from 'vue';

const props = withDefaults(defineProps<{ value?: string }>(), { value: '#ff0000' });
const { color, colorChange, isValidHex } = useColor(props.value);
watch(
    () => props.value,
    (value) => colorChange(value)
);

const emits = defineEmits(['color-change']);
const childChange = (data: any) => {
    colorChange(data);
    emits('color-change', {
        rgba: color.value?.rgba,
        hsl: color.value?.hsl,
        hex: color.value?.hex,
    });
};

const hsl = computed(() => {
    const { h, s, l } = color.value?.hsl!;
    return {
        h: h.toFixed(),
        s: `${(s * 100).toFixed()}%`,
        l: `${(l * 100).toFixed()}%`,
    };
});

interface InputChangeOptions {
    r: string;
    g: string;
    b: string;
    a: string;
    h: string;
    s: string;
    l: string;
    v: string;
    hex: string;
}

const inputChange = (data: InputChangeOptions) => {
    if (!data) return;
    const c = color.value!;
    if (data.hex) {
        isValidHex(data.hex) &&
            colorChange({
                hex: data.hex,
            });
    } else if (data.r || data.g || data.b || data.a) {
        colorChange({
            r: data.r || c.rgba.a,
            g: data.g || c.rgba.g,
            b: data.b || c.rgba.b,
            a: data.a || c.rgba.a,
        });
    } else if (data.h || data.s || data.l) {
        const s = data.s ? Number(data.s.replace('%', '')) / 100 : c.hsl.s;
        const l = data.l ? Number(data.l.replace('%', '')) / 100 : c.hsl.l;
        colorChange({
            h: data.h || c.hsl.h,
            s,
            l,
            source: 'hsl',
        });
    }
    emits('color-change', {
        rgba: c.rgba,
        hsl: c.hsl,
        hex: c.hex,
    });
};

const fieldsIndex = ref(0);
const toggleViews = () => {
    if (fieldsIndex.value >= 2) {
        fieldsIndex.value = 0;
        return;
    }
    fieldsIndex.value += 1;
};
</script>

<template>
    <div role="application" aria-label="Color Picker" class="color-picker">
        <div class="color-pricker-saturation-wrap">
            <Stauration :value="value" @change="childChange" />
        </div>
        <div class="color-picker-main">
            <div class="color-picker-sliders">
                <div class="color-picker-hue-wrap">
                    <Hue :value="value" @change="childChange" />
                </div>
            </div>
            <div class="color-picker-fields-wrap">
                <div class="color-picker-fields" v-show="fieldsIndex == 0">
                    <div class="color-picker-field">
                        <EditableInput lable="hex" :value="color?.hex" @change="inputChange" />
                    </div>
                </div>
                <div class="color-picker-fields" v-show="fieldsIndex == 1">
                    <div class="color-picker-field">
                        <EditableInput lable="h" :value="hsl.h" @change="inputChange" />
                    </div>
                    <div class="color-picker-field">
                        <EditableInput lable="s" :value="hsl.s" @change="inputChange" />
                    </div>
                    <div class="color-picker-field">
                        <EditableInput lable="l" :value="hsl.l" @change="inputChange" />
                    </div>
                </div>
                <div class="color-picker-fields" v-show="fieldsIndex == 2">
                    <div class="color-picker-field">
                        <EditableInput lable="r" :value="color?.rgba.r" @change="inputChange" />
                    </div>
                    <div class="color-picker-field">
                        <EditableInput lable="g" :value="color?.rgba.g" @change="inputChange" />
                    </div>
                    <div class="color-picker-field">
                        <EditableInput lable="b" :value="color?.rgba.b" @change="inputChange" />
                    </div>
                </div>
                <div class="color-picker-toggle-btn-wrap">
                    <button class="color-picker-toggle-btn" @click="toggleViews"></button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.color-picker {
    width: 225px;
    padding: 10px;
    border-radius: 10px;
    display: inline-block;
    background-color: #fff;
    box-shadow: 0 3px 6px rgba($color: #000000, $alpha: 0.2);

    .color-pricker-saturation-wrap {
        position: relative;
        padding-bottom: 80%;
        overflow: hidden;
    }

    .color-picker-hue-wrap {
        position: relative;
        padding: 3px 0;
        margin-top: 20px;
    }

    .color-picker-fields-wrap {
        margin-top: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .color-picker-fields {
        display: flex;
        flex: 1;
    }

    .color-picker-field {
        width: 100%;
    }

    .color-picker-toggle-btn {
        padding: 6px;
        border-radius: 6px;
        background-color: transparent;
        cursor: pointer;

        &:hover {
            background-color: #eee;
        }

        &::before,
        &::after {
            content: '';
            display: block;
            width: 6px;
            height: 6px;
            border-bottom: 3px solid #ccc;
            border-right: 3px solid #ccc;
        }

        &::before {
            transform: rotate(-135deg);
        }

        &::after {
            transform: rotate(45deg);
        }
    }
}
</style>
