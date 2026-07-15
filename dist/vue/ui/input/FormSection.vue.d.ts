import type { FormSectionProps, FormSectionSlots } from "./inputs";
type __VLS_Slots = FormSectionSlots;
declare const __VLS_base: import("vue").DefineComponent<FormSectionProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    collapse: () => any;
    expand: () => any;
}, string, import("vue").PublicProps, Readonly<FormSectionProps> & Readonly<{
    onCollapse?: (() => any) | undefined;
    onExpand?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
