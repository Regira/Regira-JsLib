import type { App } from "vue";
import { type IconButtonComponent, type IconComponent } from "./icons";
type Options = {
    icons?: Record<string, string>;
    clearFirst?: boolean;
    source?: "bs" | "fa";
    /** the components registered app-wide when registerComponentsGlobally is on (compile-checked); library-internal
     * call sites keep the library Icon — swap glyphs there via `icons`/`source`, or restyle via the `rg-icon` hook */
    Icon?: IconComponent;
    IconButton?: IconButtonComponent;
};
export type IIconProvider = {
    add: (key: string, icon: string) => void;
    source: "bs" | "fa";
    map: Map<string, string>;
};
declare const _default: {
    install(app: App<Element>, { icons, clearFirst, source, Icon: IconOverride, IconButton: IconButtonOverride }?: Options): void;
};
export default _default;
