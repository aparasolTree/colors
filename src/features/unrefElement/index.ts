import { ComponentPublicInstance, unref } from "vue";
import { MaybeRef } from "../../shared/type";

export type VueInstance = ComponentPublicInstance
export type MaybeElement = HTMLElement | SVGElement | VueInstance | undefined | null
export type MaybeElementRef<T extends MaybeElement = MaybeElement> = MaybeRef<T>

export type UnRegElementReturn<T extends MaybeElement = MaybeElement> = T extends VueInstance ? Exclude<MaybeElement, VueInstance> : T | undefined

export function unrefElement<T extends MaybeElement>(elRef?: MaybeElementRef<T>): UnRegElementReturn {
    const plain = unref(elRef)
    return (plain as VueInstance)?.$el ?? plain
}