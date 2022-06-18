import { MaybeRef } from "@/shared/type"
import tinycolor, { ColorInput, Instance } from "tinycolor2"
import { Ref, ref, unref } from "vue"

interface ChangeColorReturn {
    hsl: tinycolor.ColorFormats.HSLA;
    hex: string;
    rgba: tinycolor.ColorFormats.RGBA;
    hsv: tinycolor.ColorFormats.HSVA;
}
export type UseColorOptions = ColorInput & { a?: number }
const changeColor = (data: UseColorOptions): ChangeColorReturn => {
    let color = tinycolor(data)
    let alpha = data && data.a

    if (color && alpha != null) {
        color.setAlpha(alpha)
    }

    return {
        hsl: color.toHsl(),
        hex: color.toHex(),
        rgba: color.toRgb(),
        hsv: color.toHsv(),
    }
}

let color: Ref<ChangeColorReturn | undefined> = ref()
export function useColor(value: MaybeRef<string>) {
    const raw = unref(value)
    if (!color.value) {
        color.value = changeColor(raw)
    }

    const colorChange = (data: any) => {
        color.value = changeColor(data)
    }
    const isValidHex = (hex: string) => tinycolor(hex).isValid()
    return {
        color,
        colorChange,
        isValidHex
    }
}