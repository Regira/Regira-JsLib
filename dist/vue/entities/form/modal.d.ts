import { type Ref } from "vue";
import { type FeedbackOut } from "../../ui";
import { type IEntity, type IEntityService, type SaveResult } from "../../entities/abstractions";
import type { FormEmits, FormProps } from "./form";
export interface FormModalEmits<T extends IEntity> extends FormEmits<T> {
    (e: "open", item: T, update: (newItem: T) => void): void;
    (e: "close", item?: T): void;
}
export interface FormModalProps<T extends IEntity> extends FormProps<T> {
    title?: string;
    fullWidth?: boolean;
    closeOnSave?: boolean;
    closeOnDelete?: boolean;
}
export declare const formModalDefaults: {
    closeOnSave: boolean;
    closeOnDelete: boolean;
};
interface FormModalIn<T extends IEntity> {
    entityService: IEntityService<T>;
    model: Ref<T | undefined>;
    itemDefaults?: Ref<Record<string, any>> | Record<string, any> | Ref<object> | ((item: T) => Promise<T>);
    closeOnSave?: boolean;
    closeOnCancel?: boolean;
    closeOnDelete?: boolean;
    emit: FormModalEmits<T>;
    feedback?: FeedbackOut;
}
interface FormModalOut<T extends IEntity> {
    item: Ref<T>;
    isOpen: Ref<boolean>;
    feedback?: FeedbackOut;
    close(): void;
    open(): void;
    handleSave({ saved, isNew }: SaveResult<T>): void;
    handleRemove(): void;
    handleCancel(e: {
        canceled: T;
        original?: T;
    }): void;
}
export declare function useModalForm<T extends IEntity>({ entityService, model, itemDefaults, closeOnSave, closeOnCancel, closeOnDelete, emit, feedback, }: FormModalIn<T>): FormModalOut<T>;
export declare const useModal: typeof useModalForm;
export {};
