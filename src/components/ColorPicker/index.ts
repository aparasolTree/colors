import ColorPicker from './index.vue'
export interface ColorChangeArgs {
    rgba: {
        r: number
        g: number
        b: number
    },
    hsl: {
        h: number
        s: number
        l: number
    }
    hex: string
}

export default ColorPicker