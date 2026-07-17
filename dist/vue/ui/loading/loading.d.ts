import { type AllowedComponentProps, type InjectionKey, type VNodeProps } from "vue";
export type LoadingContainerProps = {
    isLoading: boolean;
};
export type LoadingContainerSlots = {
    loading?(): any;
    default?(): any;
};
export type LoadingButtonProps = {
    isLoading: boolean;
    disabled?: boolean;
};
export type LoadingButtonSlots = {
    loading?(): any;
    default?(): any;
};
/** any component implementing the loading indicator (no required props; reads `loadingImg` via inject) */
export type LoadingComponent = new (...args: any[]) => {
    $props: AllowedComponentProps & VNodeProps;
};
export type LoadingContainerComponent = new (...args: any[]) => {
    $props: LoadingContainerProps & AllowedComponentProps & VNodeProps;
};
export type LoadingButtonComponent = new (...args: any[]) => {
    $props: LoadingButtonProps & AllowedComponentProps & VNodeProps;
};
export declare const LOADING_COMPONENT_KEY: InjectionKey<LoadingComponent>;
/** resolves the app-wide loading indicator (the `loadingPlugin` swap-in, `Loading` otherwise); call in setup */
export declare function injectLoading(): LoadingComponent;
