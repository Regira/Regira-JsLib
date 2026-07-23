import type { App, DirectiveBinding } from "vue";
export declare const clickOutside: {
    beforeMount: (el: HTMLElement & {
        clickOutsideEvent?: (event: PointerEvent) => void;
    }, binding: DirectiveBinding) => void;
    unmounted: (el: HTMLElement & {
        clickOutsideEvent(): void;
    }) => void;
};
declare const _default: {
    install(app: App<Element>): void;
};
export default _default;
