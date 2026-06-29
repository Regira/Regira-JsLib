import type { IEntity, IEntityService } from "../abstractions";
declare const __VLS_export: <T extends IEntity>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<{
        service: IEntityService<T>;
        query?: Record<string, any>;
        pageSize?: number;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import("vue").ShallowUnwrapRef<{
        reload: () => Promise<void>;
        setPage: (p: number) => Promise<void>;
    }>) => void;
    attrs: any;
    slots: {
        toolbar(props: {
            reload: () => Promise<void>;
            setPage: (p: number) => Promise<void>;
        }): any;
        head(): any;
        row(props: {
            item: T;
            remove: (item: T) => Promise<void>;
            reload: () => Promise<void>;
        }): any;
        paging(props: {
            page: number;
            pageCount: number;
            count: number;
            setPage: (p: number) => Promise<void>;
        }): any;
    };
    emit: {};
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
