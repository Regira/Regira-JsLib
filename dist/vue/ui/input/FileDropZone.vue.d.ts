import type { FileDropZoneSlots } from "./fileDropZone";
type __VLS_Slots = FileDropZoneSlots;
declare const __VLS_base: import("vue").DefineComponent<{}, {
    isDropping: import("vue").Ref<boolean | undefined, boolean | undefined>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "drop-files": (files: Blob[]) => any;
}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{
    "onDrop-files"?: ((files: Blob[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
