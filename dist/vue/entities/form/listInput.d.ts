import { type Ref } from "vue";
import type { IEntity, SaveResult } from "./../abstractions";
type ListInputIn<T> = {
    props: {
        modelValue?: Array<T>;
    };
    emit: any;
};
export declare function useListInput<T extends IEntity & {
    id: number;
}>({ props, emit }: ListInputIn<T>): {
    items: import("vue").WritableComputedRef<T[], T[]>;
    newItem: Ref<T, T>;
    handleSort: (e: any) => void;
    handleSave: ({ saved, isNew }: SaveResult<T>) => void;
};
export declare function useListItemInput<T extends IEntity & {
    id: number;
    _deleted: boolean;
}>({ props, emit, }: {
    props: Readonly<Record<string, unknown>>;
    emit: any;
}): {
    item: import("vue").WritableComputedRef<T, T>;
    handleSave: () => void;
    handleRemove: (item: T) => void;
};
export default useListInput;
