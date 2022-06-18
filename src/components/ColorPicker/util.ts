export const clamp = (value: number, max: number, min: number) => {
    return Math.min(max, Math.max(min, value))
}