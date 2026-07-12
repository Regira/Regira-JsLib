declare const __VLS_export: <T extends {
    _deleted?: boolean;
}>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<({
        /** stable key per row; falls back to the index */
        rowKey?: (row: T) => string | number | undefined;
        /** related-entity id per row — feeds the `exclude` list handed to the #selector slot */
        excludeKey?: (row: T) => number | undefined;
    } & {
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
    slots: {
        chip?: (props: {
            row: T;
        }) => any;
    } & {
        selector?: (props: {
            add: (row: T) => void;
            exclude: number[];
        }) => any;
    };
    emit: {
        (e: "remove", row: T): void;
        (e: "add", row: T): void;
    } & ((event: "update:modelValue", value: T[] | undefined) => void);
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
