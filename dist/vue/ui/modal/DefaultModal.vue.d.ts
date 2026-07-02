import "./style.scss";
import { ModalType } from "./modal";
type __VLS_Props = {
    title?: string;
    isVisible: boolean;
    showHeader?: boolean;
    showFooter?: boolean;
    fullWidth?: boolean;
    size?: "sm" | "md" | "lg" | "xl";
    type?: ModalType;
};
declare var __VLS_7: {}, __VLS_19: {
    handleClose: () => void;
}, __VLS_28: {}, __VLS_30: {}, __VLS_32: {
    handleCancel: () => void;
}, __VLS_42: {
    handleClose: () => void;
};
type __VLS_Slots = {} & {
    title?: (props: typeof __VLS_7) => any;
} & {
    'header-close-button'?: (props: typeof __VLS_19) => any;
} & {
    default?: (props: typeof __VLS_28) => any;
} & {
    buttons?: (props: typeof __VLS_30) => any;
} & {
    'footer-close-button'?: (props: typeof __VLS_32) => any;
} & {
    'footer-submit-button'?: (props: typeof __VLS_42) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    cancel: () => any;
    close: () => any;
    submit: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
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
