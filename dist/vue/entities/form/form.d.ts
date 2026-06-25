import { type Ref } from "vue";
import { type FeedbackOut } from "../../ui/feedback";
import type { IEntity } from "../abstractions/IEntity";
import type { IEntityService, SaveResult } from "../abstractions/IEntityService";
export declare enum FormStates {
    pending = "Pending",
    saved = "Saved",
    removed = "Removed",
    error = "Error"
}
export interface FormEmits<T extends IEntity> {
    (e: "update:modelValue", item?: T): void;
    (e: "save", result: SaveResult<T>): void;
    (e: "remove", item: T): void;
    (e: "restore", item: T): void;
    (e: "cancel", arg: {
        canceled: T;
        original?: T;
    }): void;
    (e: "changeState", state: FormStates): void;
}
export interface FormProps<T extends IEntity> {
    modelValue: T;
    readonly?: boolean;
    isPopup?: boolean;
}
export declare const formDefaults: {
    readonly: boolean;
    isPopup: boolean;
};
export interface FormIn<T extends IEntity> {
    entityService: IEntityService<T>;
    props: {
        modelValue: T;
        readonly?: boolean;
        isPopup?: boolean;
    };
    emit: FormEmits<T>;
    feedback?: FeedbackOut;
}
export interface FormOut<T extends IEntity> {
    item: Ref<T>;
    original?: Ref<T>;
    feedback: FeedbackOut;
    handleCancel(): void;
    handleSubmit(): Promise<void>;
    handleRemove(): Promise<void>;
    handleRestore(): Promise<void>;
}
export declare function useForm<T extends IEntity>({ entityService, props, emit, feedback }: FormIn<T>): FormOut<T>;
