import { watch } from "vue"
import { tryOnScopeDispose } from "@/shared"
import { defalutWindow, noop } from "@/shared/configurable"
import { isString } from "@/shared/is"
import { Fn, MaybeRef } from "@/shared/type"
import { MaybeElementRef, unrefElement } from "@/features/unrefElement"

interface InferEventTarget<Events> {
    addEventListener(event: Events, handler?: any, options?: any): any
    removeEventListener(event: Events, handler?: any, options?: any): any
}

interface GeneralEventListener<E = Event> {
    (event: E): void
}

export type WindowEventName = keyof WindowEventMap
export type DocumentEventName = keyof DocumentEventMap

const isClient = typeof window !== 'undefined'


export function useEventListener<E extends keyof WindowEventMap>(event: E, listener: (this: Window, event: WindowEventMap[E]) => any, options?: boolean | AddEventListenerOptions): Fn
export function useEventListener<E extends WindowEventName>(target: Window, event: E, listener: (this: Window, event: WindowEventMap[E]) => any, options?: boolean | AddEventListenerOptions): Fn
export function useEventListener<E extends DocumentEventName>(target: Document, event: E, listener: (this: Document, event: DocumentEventMap[E]) => any, options?: boolean | AddEventListenerOptions): Fn
export function useEventListener<Names extends string, EventType = Event>(target: InferEventTarget<Names>, event: Names, listener: GeneralEventListener<EventType>, options?: boolean | AddEventListenerOptions): Fn
export function useEventListener<EventType = Event>(target: MaybeRef<EventTarget | null | undefined>, event: string, listener: GeneralEventListener<EventType>, options?: boolean | AddEventListenerOptions): Fn
export function useEventListener(...args: any[]) {
    let target: MaybeRef<EventTarget> | undefined
    let event: string
    let handler: any
    let options: any

    if (isString(args[0])) {
        [event, handler, options] = args
        target = defalutWindow
    } else {
        [target, event, handler, options] = args
    }

    if (!target) return noop

    let cleanup = noop
    const stopWatch = watch(
        () => unrefElement(target as unknown as MaybeElementRef),
        (el) => {
            cleanup()
            if (!el) return
            el.addEventListener(event, handler, options)
            cleanup = () => {
                el.removeEventListener(event, handler, options)
                cleanup = noop
            }
        }, { immediate: true, flush: 'post' }
    )

    const stop = () => {
        stopWatch()
        cleanup()
    }

    tryOnScopeDispose(stop)

    return stop
}