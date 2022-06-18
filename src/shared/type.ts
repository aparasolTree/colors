import { Ref } from "vue"

export type Fn = () => {}
export type MaybeRef<T> = T | Ref<T>