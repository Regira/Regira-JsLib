import "./style.scss";
import { ModalType, type ModalProps, type ModalSlots } from "./modal";
type __VLS_Slots = ModalSlots;
declare const __VLS_base: import("vue").DefineComponent<ModalProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    cancel: () => any;
    close: () => any;
    submit: () => any;
}, string, import("vue").PublicProps, Readonly<ModalProps> & Readonly<{
    onCancel?: (() => any) | undefined;
    onClose?: (() => any) | undefined;
    onSubmit?: (() => any) | undefined;
}>, {
    type: ModalType;
    showHeader: boolean;
    showFooter: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
