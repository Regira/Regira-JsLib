export interface ITab {
    key: string;
    icon?: string;
    title: string;
    isDefault: boolean;
    isDisabled: boolean;
    isVisible: boolean | (() => boolean);
}
export declare class Tab implements ITab {
    key: string;
    icon?: string;
    title: string;
    isDefault: boolean;
    isDisabled: boolean;
    isVisible: boolean | (() => boolean);
    constructor(title: string, key?: string, isDefault?: boolean, isDisabled?: boolean, isVisible?: boolean);
    /**
     * `Tab.create("form", { title: translate("form"), icon })`. The first argument is the **key** — the value
     * that ends up in the route hash and must therefore stay stable — and it doubles as the title only until
     * `values.title` overrides it. It is named `key` because that is what survives: a `title` passed in
     * `values` replaces the label, never the key.
     */
    static create(key: string, values?: object): Tab & object;
}
