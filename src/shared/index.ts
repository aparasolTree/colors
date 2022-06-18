import { getCurrentInstance, getCurrentScope, onMounted, onScopeDispose } from "vue";


export function tryOnScopeDispose(fn: () => any) {
    if (getCurrentScope()) {
        onScopeDispose(fn)
        return true
    }
    return false
}

export function tryOnMounted(fn: () => any) {
    if (getCurrentInstance()) {
        onMounted(fn)
        return true
    }
    return false
}

export function sort(arr: any[]) {
    const _arr = arr.slice()
    for (let i = 0; i < _arr.length; i++) {
        let item = _arr[i]
        for (let j = i + 1; j < _arr.length; j++) {
            if (item.pos > _arr[j].pos) {
                let tmp = item
                _arr[i] = _arr[j]
                _arr[j] = tmp
            }
        }
    }
    return _arr
}