import "./style.scss";
import { type AutocompleteProps, type AutocompleteEmits, type AutocompleteSlots } from "./autocomplete";
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<AutocompleteProps<T, (string | number) | T> & {
        onSelect?: ((args: T | undefined) => any) | undefined;
        "onUpdate:modelValue"?: ((args: T | undefined) => any) | undefined;
        "onUpdate:idValue"?: ((args: (string | number) | T | undefined) => any) | undefined;
        onQInput?: ((args: string) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import("vue").ShallowUnwrapRef<{
        inputEl: import("vue").Ref<(HTMLElement & {
            value: string;
        }) | undefined, (HTMLElement & {
            value: string;
        }) | undefined>;
        q: import("vue").Ref<string, string>;
        selectedItem: import("vue").Ref<T | undefined, T | undefined>;
        search: (term?: string) => void;
        reset: () => void;
        resetQ(): void;
    }>) => void;
    attrs: any;
    slots: AutocompleteSlots<T>;
    emit: AutocompleteEmits<T, (string | number) | T>;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
