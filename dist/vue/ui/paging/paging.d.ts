import type { IPagingInfo } from "../../entities/abstractions/PagingInfo";
import { type AllowedComponentProps, type ComputedRef, type Ref, type VNodeProps } from "vue";
export declare enum ButtonType {
    anchor = "Anchor",
    button = "Button"
}
export type PagingEmits = {
    (e: "update:modelValue", args: any): void;
    (e: "change", args: any): void;
};
export type PagingProps = {
    modelValue: IPagingInfo;
    count: number;
    maxPages?: number;
    buttonType?: ButtonType;
};
export type PagingSlots = {
    firstPage?(props: {
        page: number;
    }): any;
    default?(props: {
        page: number;
        route: string;
        handleChange: (page: number) => void;
    }): any;
    lastPage?(props: {
        page: number;
    }): any;
};
export declare const pagingDefaults: {
    maxPages: number;
    buttonType: ButtonType;
};
/** any component implementing the paging contract (props checked at the registration site) */
export type PagingComponent = new (...args: any[]) => {
    $props: PagingProps & AllowedComponentProps & VNodeProps;
};
export type ResultSummaryProps = {
    visibleCount?: number;
    totalCount?: number;
};
export type ResultSummarySlots = {
    default?(props: {
        visibleCount?: number;
        totalCount?: number;
    }): any;
};
export type PagingIn = {
    pagingInfo: Ref<IPagingInfo>;
    count: Ref<number>;
    maxPages: number;
    emit: PagingEmits;
};
export type PagingOut = {
    pagedRoute(p: number): string;
    page: ComputedRef<number>;
    totalPages: ComputedRef<number>;
    totalVisiblePages: ComputedRef<number>;
    firstPage: ComputedRef<number>;
    lastPage: ComputedRef<number>;
    pages: ComputedRef<Array<number>>;
    handleChangePage(newPage: number): void;
};
export default function usePaging({ pagingInfo, count, maxPages, emit }: PagingIn): PagingOut;
