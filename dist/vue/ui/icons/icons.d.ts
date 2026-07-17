import type { AllowedComponentProps, VNodeProps } from "vue";
export type IconsConfig = {
    source: string;
    icons: Map<string, string>;
};
type IconSet = Record<string, string> | Array<Array<string>>;
export type IconSize = "sm" | "md" | "lg" | "xl";
export type IconProps = {
    name: string;
    size?: IconSize;
};
export declare const iconDefaults: {
    size: IconSize;
};
export type IconButtonProps = {
    icon: string;
    size?: IconSize;
    type?: "button" | "submit" | "reset";
};
export declare const iconButtonDefaults: {
    type: "button";
};
export type IconButtonSlots = {
    default?(): any;
};
/** any component implementing the icon contract (props checked at the registration site) */
export type IconComponent = new (...args: any[]) => {
    $props: IconProps & AllowedComponentProps & VNodeProps;
};
export type IconButtonComponent = new (...args: any[]) => {
    $props: IconButtonProps & AllowedComponentProps & VNodeProps;
};
export declare const iconMap: Map<string, string>;
export declare function load(icons: IconSet): void;
export declare function clear(): void;
export default iconMap;
