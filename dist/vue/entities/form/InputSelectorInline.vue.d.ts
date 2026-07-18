import type { InputSelectorInlineProps, InputSelectorInlineEmits, InputSelectorInlineSlots } from "./inputSelectorInline";
declare const __VLS_export: <T extends {
    _deleted?: boolean;
    id?: number | string | null;
}>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<(InputSelectorInlineProps<T> & {
        modelValue?: Array<T>;
    }) & {
        onRemove?: ((row: T) => any) | undefined;
        onAdd?: ((row: T) => any) | undefined;
        "onUpdate:modelValue"?: ((value: T[] | undefined) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: InputSelectorInlineSlots<T>;
    emit: InputSelectorInlineEmits<T> & ((event: "update:modelValue", value: T[] | undefined) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
