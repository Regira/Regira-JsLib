import { type IconButtonProps, type IconButtonSlots } from "./icons";
type __VLS_Slots = IconButtonSlots;
declare const __VLS_base: import("vue").DefineComponent<IconButtonProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<IconButtonProps> & Readonly<{}>, {
    type: "button" | "submit" | "reset";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
