import { type Ref } from "vue";
import type { IEntity, SaveResult } from "../abstractions";
type Input<T> = {
    props: {
        modelValue?: T;
        itemDefaults?: Ref<Record<string, unknown>> | Record<string, unknown>;
    };
    emit: {
        (e: "update:modelValue", args?: T): void;
        (e: "save", args: SaveResult<T>): void;
        (e: "cancel"): void;
    };
};
export declare function useOwnedModal<T extends IEntity & {
    id: number;
}>(Entity: {
    new (): T;
}, { props, emit }: Input<T>): {
    item: Ref<T, T>;
    isOpen: Ref<boolean, boolean>;
    handleOpen: () => void;
    handleCancel: () => void;
    handleSubmit: () => void;
};
export default useOwnedModal;
