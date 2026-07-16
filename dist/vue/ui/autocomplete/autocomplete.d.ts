import { type Ref, type StyleValue } from "vue";
type IDefaultKey = number | string;
type IOffset = {
    top: number;
    left: number;
};
type IResultStyle = StyleValue & {
    visibility: string;
    top?: string;
    left?: string;
    transform?: string;
    width: string;
};
export interface AutocompleteEmits<T = any, TKey = IDefaultKey | T> {
    (e: "update:modelValue", args: T | undefined): void;
    (e: "update:idValue", args: TKey | undefined): void;
    (e: "select", args: T | undefined): void;
    (e: "qInput", args: string): void;
}
export interface AutocompleteProps<T = any, TKey = IDefaultKey | T> {
    idValue?: TKey;
    modelValue?: T;
    data?: Array<T>;
    maxResults?: number;
    debounceTime?: number;
    enableDblClick?: boolean;
    autoSelect?: boolean;
    allowFreeInput?: boolean;
    resultClass?: string;
    itemsClass?: string;
    itemClass?: string;
    search?(term?: string): Promise<Array<T>>;
    idSelector?(item?: T): TKey | undefined;
    /** converts an item to its display string (input value + default result rendering) */
    displayItemFormatter?(item?: T): string;
}
export type AutocompleteSlots<T = any> = {
    /** result-item rendering seam; the fallback renders the display string with the matched term in bold */
    default?(props: {
        item: T;
        q: string;
    }): any;
};
export declare const autocompleteDefaults: {
    data: () => never[];
    maxResults: number;
    debounceTime: number;
    autoSelect: boolean;
};
export type AutocompleteOut<T = any, TKey = IDefaultKey | T> = {
    q: Ref<string>;
    selectedItem: Ref<T | undefined>;
    selectedIndex: Ref<number>;
    selectedId: Ref<TKey | undefined>;
    items: Ref<Array<T> | undefined>;
    isOpen: Ref<boolean>;
    isFocus: Ref<boolean>;
    isLoading: Ref<boolean>;
    inputEl: Ref<(HTMLElement & {
        value: string;
    }) | undefined>;
    resultOffset: Ref<IOffset>;
    resultStyle: Ref<IResultStyle>;
    displayItemFormatter(item?: T): string;
    handleInput(): void;
    handleChange(): void;
    handleSelect(item: T, index: number): void;
    handleSearch(term?: string): void;
    openResults(): void;
    closeResults(): void;
    closeGently(e?: PointerEvent): void;
    moveSelection(step: number): void;
    checkMatch(): void;
    clearSelection(): void;
    reset(): void;
};
export declare function useAutocomplete<T = any, TKey = IDefaultKey | T>(props: AutocompleteProps<T, TKey>, { emit }: {
    emit: AutocompleteEmits<T, TKey>;
}): AutocompleteOut<T, TKey>;
export {};
