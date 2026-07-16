import { type ConfirmButtonProps, type ConfirmButtonSlots } from "./confirm";
type __VLS_Slots = ConfirmButtonSlots;
declare const __VLS_base: import("vue").DefineComponent<ConfirmButtonProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    cancel: () => any;
    close: () => any;
    confirm: () => any;
    open: () => any;
}, string, import("vue").PublicProps, Readonly<ConfirmButtonProps> & Readonly<{
    onCancel?: (() => any) | undefined;
    onClose?: (() => any) | undefined;
    onConfirm?: (() => any) | undefined;
    onOpen?: (() => any) | undefined;
}>, {
    icon: string;
    modalTitle: string;
    modalType: import("../modal").ModalType;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
