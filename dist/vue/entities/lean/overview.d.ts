import { type Ref, type ComputedRef } from "vue";
import type { IEntity, IEntityService } from "../abstractions";
export type LeanOverviewProps<T extends IEntity> = {
    service: IEntityService<T>;
    query?: Record<string, any>;
    pageSize?: number;
};
export declare const leanOverviewDefaults: {
    pageSize: number;
};
export type LeanOverviewSlots<T extends IEntity> = {
    toolbar?(props: {
        reload: () => Promise<void>;
        setPage: (p: number) => Promise<void>;
    }): any;
    head?(): any;
    row?(props: {
        item: T;
        remove: (item: T) => Promise<void>;
        reload: () => Promise<void>;
    }): any;
    paging?(props: {
        page: number;
        pageCount: number;
        count: number;
        setPage: (p: number) => Promise<void>;
    }): any;
};
export type LeanOverviewOut<T extends IEntity> = {
    items: Ref<Array<T>>;
    count: Ref<number>;
    page: Ref<number>;
    pageCount: ComputedRef<number>;
    reload(): Promise<void>;
    setPage(page: number): Promise<void>;
    remove(item: T): Promise<void>;
};
/** search/paging/remove behavior of the lean overview; reloads on mount */
export declare function useLeanOverview<T extends IEntity>(props: LeanOverviewProps<T>): LeanOverviewOut<T>;
