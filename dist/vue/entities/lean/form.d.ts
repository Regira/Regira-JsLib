import { type Ref } from "vue";
import type { IEntity, IEntityService } from "../abstractions";
export type LeanFormProps<T extends IEntity> = {
    service: IEntityService<T>;
    /** "new" loads a fresh entity; anything else loads details */
    id: string | number;
};
export type LeanFormEmits<T extends IEntity> = {
    (e: "saved", item: T): void;
    (e: "cancel"): void;
};
export type LeanFormSlots<T extends IEntity> = {
    default?(props: {
        item: T;
    }): any;
};
export type LeanFormOut<T extends IEntity> = {
    item: Ref<T | undefined>;
    saving: Ref<boolean>;
    submit(): Promise<void>;
};
/** load/save behavior of the lean form; loads on mount, guards against double-submits */
export declare function useLeanForm<T extends IEntity>(props: LeanFormProps<T>, { emit }: {
    emit: LeanFormEmits<T>;
}): LeanFormOut<T>;
