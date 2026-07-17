import type { PagingComponent } from "./paging";
import type { App } from "vue";
type Options = {
    defaultPageSize?: number;
    /** the component registered app-wide as `Paging` when registerComponentsGlobally is on (compile-checked) */
    Paging?: PagingComponent;
};
declare const _default: {
    install(app: App<Element>, { defaultPageSize, Paging: PagingOverride }?: Options): void;
};
export default _default;
