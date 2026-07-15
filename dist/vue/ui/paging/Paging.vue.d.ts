import { ButtonType, type PagingProps, type PagingSlots } from "./paging";
type __VLS_Slots = PagingSlots;
declare const __VLS_base: import("vue").DefineComponent<PagingProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: (args: any) => any;
    "update:modelValue": (args: any) => any;
}, string, import("vue").PublicProps, Readonly<PagingProps> & Readonly<{
    onChange?: ((args: any) => any) | undefined;
    "onUpdate:modelValue"?: ((args: any) => any) | undefined;
}>, {
    maxPages: number;
    buttonType: ButtonType;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
