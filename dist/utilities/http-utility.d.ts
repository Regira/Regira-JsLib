export declare const isLocalHost: () => boolean;
export declare const isHttps: (url: string | URL) => boolean;
export declare const getHttpsUrl: (url: string) => string;
export declare const forceHttps: (currentUrl: string) => void;
export declare function tryCreateValidURL(input: string): string;
export declare const toAbsoluteUrl: (relative: string, baseUrl?: string) => string;
export declare const toQueryString: (obj: Record<string, unknown>, includeNulls?: boolean) => string;
export declare const getQueryStringParams: (url?: string) => {
    [k: string]: string;
};
declare const _default: {
    isLocalHost: () => boolean;
    getHttpsUrl: (url: string) => string;
    forceHttps: (currentUrl: string) => void;
    toQueryString: (obj: Record<string, unknown>, includeNulls?: boolean) => string;
    getQueryStringParams: (url?: string) => {
        [k: string]: string;
    };
};
export default _default;
