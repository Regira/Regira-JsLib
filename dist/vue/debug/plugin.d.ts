import { type App } from "vue";
import type { DebugComponent } from "./debug";
type IOptions = {
    isDebug: boolean;
    /** the component registered app-wide as `Debug` when registerComponentsGlobally is on (compile-checked) */
    Debug?: DebugComponent;
};
declare const _default: {
    install(app: App<Element>, options?: IOptions): void;
};
export default _default;
