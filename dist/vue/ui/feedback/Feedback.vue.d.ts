import { FeedbackStatus, type FeedbackProps, type FeedbackSlots } from "./feedback";
type __VLS_Slots = FeedbackSlots;
declare const __VLS_base: import("vue").DefineComponent<FeedbackProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    close: (arg: {
        status: FeedbackStatus;
        error?: import("./feedback").FeedbackError;
    }) => any;
}, string, import("vue").PublicProps, Readonly<FeedbackProps> & Readonly<{
    onClose?: ((arg: {
        status: FeedbackStatus;
        error?: import("./feedback").FeedbackError;
    }) => any) | undefined;
}>, {
    hideCloseButton: boolean;
    enableErrorPopup: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
