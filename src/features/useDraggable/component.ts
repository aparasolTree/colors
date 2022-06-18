import { defineComponent, h, reactive, ref } from "vue";
import { useDraggable, UseDraggableOptions } from ".";

export const UseDraggable = defineComponent<UseDraggableOptions>({
    name: 'UseDraggable',
    props: ['onStart', 'onEnd', 'onMove'] as unknown as undefined,
    setup(props, { slots }) {
        const target = ref<HTMLDivElement>()
        const data = reactive(useDraggable(target, { ...props }))
        return () => h('div', { ref: target }, slots.default?.(data))
    }
})