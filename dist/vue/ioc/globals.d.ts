export type GlobalOptions = {
    /** When true, plugins re-register their components app-wide via app.component(). */
    registerComponentsGlobally: boolean;
};
export declare const globalOptions: GlobalOptions;
export declare function configureGlobals(options: Partial<GlobalOptions>): void;
