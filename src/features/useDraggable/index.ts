import { computed, Ref, ref, unref } from "vue";
import { defalutWindow } from "@/shared/configurable";
import { isClient } from "@/shared/is";
import { MaybeRef } from "@/shared/type";
import { useEventListener } from "../useEventListener";
import { clamp } from "@/components/ColorPicker/util";

export type PointerType = 'touch' | 'mouse' | 'pen'
export interface Position {
    x: number
    y: number
}

export interface UseDraggableOptions {
    exact?: boolean
    prevent?: MaybeRef<boolean>
    stop?: MaybeRef<boolean>
    draggingElement?: MaybeRef<HTMLElement | SVGElement | Window | Document | null | undefined>
    pointerTypes?: PointerType[]
    initialValue?: MaybeRef<Position>
    onStart?: (position: Position, event: PointerEvent) => void | false
    onMove?: (position: Position, event: PointerEvent) => void
    onEnd?: (position: Position, event: PointerEvent) => void
}

export function useDraggable(
    target: MaybeRef<HTMLElement | SVGElement | null | undefined>,
    options: UseDraggableOptions = {}
) {
    const draggingElement = options.draggingElement ?? defalutWindow
    const position: Ref<Position> = ref(options.initialValue ?? { x: 0, y: 0 })
    const isDragging = ref<boolean>(false)

    const filterEvent = (event: PointerEvent) => {
        if (options.pointerTypes) {
            return options.pointerTypes.includes(event.pointerType as PointerType)
        }
        return true
    }

    const handleEvent = (event: PointerEvent) => {
        if (unref(options.stop)) {
            event.stopPropagation()
        }
        if (unref(options.prevent)) {
            event.preventDefault()
        }
    }

    const start = (event: PointerEvent) => {
        if (!filterEvent(event)) return
        if (unref(options.exact) && event.target !== unref(target)) return

        const rect = unref(target)!.getBoundingClientRect()
        const pos = {
            x: clamp((event.clientX - rect.left) / rect.width, 1, 0),
            y: clamp((event.clientY - rect.top) / rect.height, 1, 0)
        }

        if (options.onStart?.(pos, event) === false) return
        isDragging.value = true
        handleEvent(event)
    }

    const move = (event: PointerEvent) => {
        if (!filterEvent(event))
            return
        if (!isDragging.value)
            return

        const rect = unref(target)!.getBoundingClientRect()
        position.value = {
            x: clamp(+((event.clientX - rect.left) / rect.width).toFixed(2), 1, 0),
            y: clamp(+((event.clientY - rect.top) / rect.height).toFixed(2), 1, 0)
        }
        options.onMove?.(position.value, event)
        handleEvent(event)
    }

    const end = (event: PointerEvent) => {
        if (!filterEvent(event)) return
        if (!isDragging.value) return
        isDragging.value = false
        options.onEnd?.(position.value, event)
        handleEvent(event)
    }

    if (isClient) {
        useEventListener(target, 'pointerdown', start, true)
        useEventListener(draggingElement, 'pointermove', move, true)
        useEventListener(draggingElement, 'pointerup', end, true)
    }

    return {
        position,
        isDragging,
        style: computed(() => `left: ${position.value.x}%; top: ${position.value.y}%`)
    }
}