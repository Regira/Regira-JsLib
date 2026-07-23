import type { IPagingInfo } from "../abstractions/PagingInfo";
export declare function cleanQueryParams(queryParams: Record<string, unknown>, _defaultPageSize?: number): Record<string, unknown>;
export declare function parseQueryParams(queryParams: Record<string, unknown>): {
    searchObject: Record<string, unknown>;
    pagingInfo: IPagingInfo;
};
