import { type App, type InjectionKey } from "vue";
import type { ModalComponent } from "./modal";
export declare const MODAL_COMPONENT_KEY: InjectionKey<ModalComponent>;
/** resolves the app-wide modal (the `modalPlugin` swap-in, `DefaultModal` otherwise); call in setup */
export declare function injectModal(): ModalComponent;
declare const _default: {
    install(app: App<Element>, options?: {
        Modal?: ModalComponent;
    }): void;
};
export default _default;
