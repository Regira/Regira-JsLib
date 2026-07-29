import type { IEntity, SaveResult } from "../abstractions";
type Input<T> = {
    props: {
        modelValue?: Array<T>;
    };
    emit: any;
    /**
     * Mints the add-row. Pass the owning model's named constructor — `createRow: () => OrderLine.create()`
     * — and the row arrives with its class field defaults and computed getters; without it the row is a
     * bare `{ id: 0 }`, so an enum dropdown renders blank and a getter used in the template is `undefined`.
     * `id` is always overwritten with `0`, which is what marks the row unsaved.
     */
    createRow?: () => T;
};
export declare function useOwnedCollection<T extends IEntity & {
    id: number;
}>({ props, emit, createRow }: Input<T>): {
    items: import("vue").WritableComputedRef<T[], T[]>;
    newItem: import("vue").Ref<T | undefined, T | undefined>;
    resetNewItem: () => Promise<void>;
    handleSort: (e: any) => void;
    handleSave: ({ saved, isNew }: SaveResult<T>) => void;
};
export default useOwnedCollection;
