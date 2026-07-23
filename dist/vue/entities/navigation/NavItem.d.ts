import type { INavItem } from "./abstractions/types";
export declare class NavItem implements INavItem {
    id: string;
    name: string;
    icon: string;
    routeName: string;
    title: string;
    description?: string;
    initialQuery?: Record<string, unknown>;
    parentId?: string;
}
export default NavItem;
