import type { App } from "vue";
import { type LoadingButtonComponent, type LoadingComponent, type LoadingContainerComponent } from "./loading";
export type LoadingInput = {
    img: string;
    /** swaps the loading indicator app-wide — including inside LoadingContainer/LoadingButton (compile-checked) */
    Loading?: LoadingComponent;
    LoadingButton?: LoadingButtonComponent;
    LoadingContainer?: LoadingContainerComponent;
};
declare const _default: {
    install(app: App<Element>, options: LoadingInput): void;
};
export default _default;
