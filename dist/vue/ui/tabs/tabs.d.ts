import type { ITab } from "./Tab";
export type TabContainerProps = {
    tabs: Array<ITab | string | null>;
    /** sync the active tab with the route hash (deep-linkable, back-button friendly) */
    useRouteNav?: boolean;
    active?: string;
};
export declare const tabContainerDefaults: {
    useRouteNav: boolean;
};
export type TabsEmits = {
    (e: "select", tab: string): void;
};
export type TabNavigationProps = {
    tabs: Array<ITab>;
    activeTab: string;
};
