import { type FeedbackOut } from "../feedback";
type __VLS_Props = {
    item?: unknown;
    readonly?: boolean;
    feedback?: FeedbackOut;
    showDelete?: boolean;
    /** button-label overrides (i18n); defaults are English */
    labels?: {
        save?: string;
        cancel?: string;
        delete?: string;
        restore?: string;
    };
    /** delete-confirm modal title; pair with the `delete` slot for a translated body */
    modalTitle?: string;
};
declare var __VLS_29: {};
type __VLS_Slots = {} & {
    delete?: (props: typeof __VLS_29) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    cancel: () => any;
    remove: () => any;
    restore: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onCancel?: (() => any) | undefined;
    onRemove?: (() => any) | undefined;
    onRestore?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
