import { type LoadingContainerProps, type LoadingContainerSlots } from "./loading";
type __VLS_Slots = LoadingContainerSlots;
declare const __VLS_base: import("vue").DefineComponent<LoadingContainerProps, {
    containerEl: import("vue").Ref<HTMLDivElement | null, HTMLDivElement | null>;
    loadingImgEl: import("vue").ComputedRef<HTMLImageElement | null | undefined>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<LoadingContainerProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
