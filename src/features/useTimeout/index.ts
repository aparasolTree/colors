import { tryOnScopeDispose } from "@/shared";
import { isClient } from "@/shared/is";
import { MaybeRef } from "@/shared/type";
import { ref, unref } from "vue";

export interface UseTimeoutOptions {
    immediate?: boolean
}

export function useTimeout(
    callback: (...args: unknown[]) => any,
    interval: MaybeRef<number>,
    options: UseTimeoutOptions = {}
) {
    const { immediate = true } = options
    const isPending = ref(false)

    let timer: number | null = null
    function clear() {
        if (timer) {
            clearTimeout(timer)
            timer = null
        }
    }

    function stop() {
        isPending.value = false
        clear()
    }

    function start(...args: unknown[]) {
        clear()
        isPending.value = true
        timer = setTimeout(() => {
            isPending.value = false
            timer = null
            callback(...args)
        }, unref(interval)) as unknown as number
    }

    if (immediate) {
        isPending.value = true
        if (isClient) {
            start()
        }
    }

    tryOnScopeDispose(stop)

    return {
        isPending,
        start,
        stop
    }
}