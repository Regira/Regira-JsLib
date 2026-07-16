/** the collection itself binds via v-model (defineModel<Array<T>>) */
export type InputSelectorInlineProps<T> = {
    /** stable key per row; falls back to the index */
    rowKey?: (row: T) => string | number | undefined;
    /** related-entity id per row — feeds the `exclude` list handed to the #selector slot */
    excludeKey?: (row: T) => number | undefined;
};
export type InputSelectorInlineEmits<T> = {
    (e: "remove", row: T): void;
    (e: "add", row: T): void;
};
export type InputSelectorInlineSlots<T> = {
    /** renders one selected row (chip content, next to the remove/restore toggle) */
    chip?(props: {
        row: T;
    }): any;
    /** renders the picker; call `add` with the new row, `exclude` lists already-selected ids */
    selector?(props: {
        add: (row: T) => void;
        exclude: Array<number>;
    }): any;
};
