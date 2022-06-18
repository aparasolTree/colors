import { ref } from "vue";
import { ConfigurableWindow, defalutWindow } from "@/shared/configurable";
import { useEventListener } from "../useEventListener";

export function useWindowScroll({ window = defalutWindow }: ConfigurableWindow = {}) {
    if (!window) {
        return {
            x: ref(0),
            y: ref(0),
        }
    }

    const x = ref(window.scrollX)
    const y = ref(window.scrollY)

    useEventListener(
        'scroll',
        () => {
            x.value = window.scrollX
            y.value = window.scrollY
        },
        {
            capture: true,
            passive: true
        }
    )

    return { x, y }
}