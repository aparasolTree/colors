import { ConfigurableNavigator, defalutNavigator } from "@/shared/configurable";
import { MaybeRef } from "@/shared/type";
import { ref, Ref, unref } from "vue";
import { useEventListener, WindowEventName } from "../useEventListener";
import { useTimeout } from "../useTimeout";

export interface UseClipboardOptions<Source> extends ConfigurableNavigator {
    source?: Source
    copiedDuring?: number
}

export interface ClipboardReturn<Optional> {
    isSupported: boolean
    text: Ref<string>
    copied: Ref<boolean>
    copy: Optional extends true ? (text?: string) => Promise<void> : (text: string) => Promise<void>
}

export function useClipnoard(options?: UseClipboardOptions<undefined>): ClipboardReturn<false>
export function useClipnoard(options?: UseClipboardOptions<MaybeRef<string>>): ClipboardReturn<true>
export function useClipnoard(options: UseClipboardOptions<MaybeRef<string> | undefined> = {}): ClipboardReturn<boolean> {
    const {
        navigator = defalutNavigator,
        source,
        copiedDuring = 1500
    } = options

    const isSupported = Boolean(navigator && 'clipboard' in navigator)
    const text = ref('')
    const copied = ref(false)

    const timeout = useTimeout(() => copied.value = false, copiedDuring)

    async function copy(value = unref(source)) {
        if (isSupported && value != null) {
            await navigator?.clipboard.writeText(value)
            text.value = value
            copied.value = true
            timeout.start()
        }
    }

    return {
        isSupported,
        text,
        copied,
        copy
    }
}