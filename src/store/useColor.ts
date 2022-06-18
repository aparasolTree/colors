import { defineStore } from 'pinia'

interface ColorGroup {
    color: string,
    pos: number,
    id: number
}

export const useColor = defineStore('color', {
    state: () => ({
        group: [
            {
                color: '#0093E9',
                pos: 0,
                id: 0
            },
            {
                color: '#80D0C7',
                pos: 100,
                id: 1
            }
        ] as ColorGroup[],
        deg: 0,
        count: 2,
        total: 4,
        modifyIndex: -1
    }),
    actions: {
        addColor() {
            if (this.count >= this.total) return

            this.group = this.group.map((c, i) => {
                return {
                    color: c.color,
                    pos: (c.pos - 20) < 0 ? 0 : c.pos - 20,
                    id: c.id
                }
            })
            this.group.push({
                color: '#ffffff',
                pos: 100,
                id: this.group.length - 1
            })
            this.count++
            this.modifyIndex = this.group.length - 1
        },
        removeColor() {
            this.group.splice(this.modifyIndex, 1)
            this.count--
            this.modifyIndex = this.group.length - 1
        },
        setColorIndex(i: number) {
            this.modifyIndex = i
        },
        modifyColor(val: string) {
            if (this.modifyIndex >= 0) {
                this.group[this.modifyIndex].color = val
            }
        },
        setPodition(pos: number) {
            if (this.modifyIndex >= 0) {
                const current = this.group[this.modifyIndex]
                current.pos = pos
            }
        },
        sort() {
            this.group.sort((a, b) => a.pos - b.pos)
        },
        setAngle(deg: number) {
            if (deg >= 0 && deg <= 360) {
                this.deg = Number(deg.toFixed())
            }
        }
    },
})

