<script setup lang='ts'>
import { computed, ref } from 'vue';

const emits = defineEmits(['change'])
const props = defineProps<{
    lable: string
    value?: string | number
    max?: number
    min?: number
    arrowOffset?: number
}>()

const input = ref<HTMLInputElement>()
const upadte = (event: Event) => {
    handleChange((event.target as HTMLInputElement).value)
}
const handleChange = (val: string) => {
    let data: Record<string, string> = {}
    data[props.lable] = val
    if (data.hex === undefined) {
        emits('change', data)
    } else if (val.length > 5) {
        emits('change', data)
    }
}

const val = computed({
    get() {
        return props.value + ''
    },
    set(v: string | number | undefined) {
        if (!(props.max === undefined) && v && +v > props.max) {
            input.value!.value = props.max + ''
        } else {
            return v
        }
    }
})

</script>

<template>
    <div class="color-picker-editable-input">
        <input type="text" :id="lable" v-model="val" class="color-editable-input" @input="upadte" ref="input" />
        <label :for="lable" class="color-editable-label">{{ lable.toUpperCase() }}</label>
    </div>
</template>

<style lang='scss' scoped>
.color-picker-editable-input {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 10px 5px;
}

.color-editable-input {
    width: 100%;
    padding: 3px 0;
    border-radius: 4px;
    border: 0;
    outline: 0;
    text-align: center;
    background-color: #f1f5f8;
}

.color-editable-label {
    margin-top: 10px;
}
</style>