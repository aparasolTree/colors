import { isClient } from "./is"

export interface ConfigurableWindow {
    window?: Window
}

export interface ConfigurableNavigator {
    navigator?: Navigator
}

export const defalutWindow = isClient ? window : undefined
export const defalutNavigator = isClient ? navigator : undefined
export const noop = () => { }