import { TreeList } from "../../../treelist";
import type { IConfig } from "../abstractions";
import type { INavItem, INavCore } from "./abstractions/types";
import NavItem from "./NavItem";
export declare function createNavGroup(input: {
    id: string;
    title: string;
    icon: string;
}): INavCore;
export declare function createNavItem(input: IConfig, parentId?: string): INavItem;
type IGroupedEntities = [string, Array<string>];
export type IImportDashboardInput = {
    groups: Array<{
        id: string;
        title: string;
        icon: string;
    }>;
    entities: Array<IGroupedEntities>;
    configs: Array<IConfig>;
    hasAccess: (config: IConfig) => boolean;
};
export declare function importDashboard(input: IImportDashboardInput): Array<INavCore>;
export type IImportNavbarInput = {
    groups?: Array<{
        id: string;
        title: string;
        icon: string;
    }>;
    entities: Array<string | IGroupedEntities>;
    configs: Array<IConfig>;
    hasAccess: (config: IConfig) => boolean;
};
export declare function importNavbar(input: IImportNavbarInput): Array<INavCore>;
export declare function buildNavigationTree(items: Array<INavCore>): TreeList<INavCore>;
export declare function isNavItem(item: INavCore): item is NavItem;
export {};
