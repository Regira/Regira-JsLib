import type { FeedbackError } from "./feedback";
type __VLS_Props = {
    msg: string;
    error: FeedbackError | undefined;
    enablePopup?: boolean;
};
declare var __VLS_1: {}, __VLS_13: {};
type __VLS_Slots = {} & {
    message?: (props: typeof __VLS_1) => any;
} & {
    summary?: (props: typeof __VLS_13) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    error: FeedbackError | undefined;
    msg: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
