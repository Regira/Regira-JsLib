import arrayUtility from "./array-utility";
import colorUtility from "./color-utility";
import datetimeUtility from "./datetime-utility";
import fileUtility from "./file-utility";
import htmlUtility from "./html-utility";
import httpUtility from "./http-utility";
import imageUtility from "./image-utility";
import numberUtility from "./number-utility";
import objectUtility from "./object-utility";
import promiseUtility from "./promise-utility";
import stringUtility from "./string-utility";
import clipboardUtility from "./clipboard-utility";
export { arrayUtility, colorUtility, datetimeUtility, fileUtility, htmlUtility, httpUtility, imageUtility, numberUtility, objectUtility, promiseUtility, stringUtility, clipboardUtility, };
export { isEmail, isIP, isPhone } from "./string-utility";
declare const _default: {
    arrayUtility: {
        isArray: (items: unknown) => items is unknown[];
        isIterable: (items: unknown) => boolean;
        toArray: <T>(items: T[] | Iterable<T> | Record<string, T> | null | undefined) => T[];
        newArray: (length: number) => undefined[];
        orderBy: <T>(items: Iterable<T>, selector?: (x: T) => unknown) => T[];
        orderByDesc: <T>(items: Iterable<T>, selector?: (x: T) => unknown) => T[];
        naturalSort: <T>(items: Iterable<T>, selector?: (x: T) => string | number) => T[];
        shuffle: <T>(items: Iterable<T>) => T[];
        innerJoin: <T, U = T, R = T>(items1: Iterable<T>, items2: Iterable<U>, selector1?: (x: T) => unknown, selector2?: (x: U) => unknown, resultSelector?: (x: T, y: U) => R) => R[];
        groupBy: <T, K = unknown>(items: Iterable<T>, keySelector: (x: T, i?: number, arr?: T[]) => K) => [K, T[]][];
        groupJoin: <T, U, R = [T, U[]]>(parentItems: Iterable<T>, childItems: Iterable<U>, parentKeySelector?: (x: T, i?: number, arr?: T[]) => unknown, childSelector?: (x: U, i?: number, arr?: U[]) => unknown, resultSelector?: (parent: T, children: U[]) => R) => R[];
        count: <T>(items: Iterable<T>, predicate?: (x: T) => boolean) => number;
        first: <T>(items: Iterable<T>, predicate?: (x: T) => boolean) => T | undefined;
        last: <T>(items: Iterable<T>, predicate?: (x: T) => boolean) => T | undefined;
        distinctBy: <T>(items: Iterable<T>, selector: (x: T) => unknown) => T[];
        distinct: <T>(items: Iterable<T>) => T[];
        union: <T>(arr1: Iterable<T>, arr2: Iterable<T>) => T[];
        take: <T>(items: Iterable<T>, n: number) => T[];
        skip: <T>(items: Iterable<T>, n: number) => T[];
        page: <T>(items: Iterable<T>, pageSize: number, pageIndex?: number) => T[];
        countPages: (items: Iterable<unknown>, pageSize: number) => number;
        min: <T>(items: Iterable<T>, selector?: (x: T) => unknown) => (string | number | bigint | boolean) | undefined;
        max: <T>(items: Iterable<T>, selector?: (x: T) => unknown) => (string | number | bigint | boolean) | undefined;
        sum: <T>(items: Iterable<T>, selector?: (x: T) => number) => number;
        average: <T>(items: Iterable<T>, selector?: (x: T) => number) => number;
        toMap: <T, K, V = T>(items: Iterable<T>, keySelector: (x: T) => K, valueSelector?: (item: T, i?: number, map?: Map<K, V>) => V) => Map<K, V>;
        sameContent: <T>(items1: Iterable<T> | null | undefined, items2: Iterable<T> | null | undefined, includeOrder?: boolean) => boolean;
        query: <T>(items: Iterable<T>, filter: Partial<T>) => T[];
        getEnumerator: <T>(arr: T[]) => {
            selectedIndex: number;
            readonly length: number;
            readonly current: T | undefined;
            first(): void;
            previous(): boolean;
            next(): boolean;
            last(): void;
        };
        move: <T>(arr: T[], item: T, pos: number) => void;
        reFill: <T>(arr: T[], values: T[]) => void;
    };
    colorUtility: {
        rgbToHex: (r: number, g: number, b: number) => string;
        hexToRgb: (hex: string, opacity?: number) => {
            r: number;
            g: number;
            b: number;
            a: number;
        } | undefined;
        hexToRgbString: (hex: string, opacity?: number) => string | undefined;
        hexToRgbArray: (hex: string, opacity?: number) => number[];
        getRgbString: (input: number[] | string, opacity?: number) => string | undefined;
        invertRgb: (r: number, g: number, b: number) => {
            ri: number;
            gi: number;
            bi: number;
        };
        invertHex: (hex: string) => string;
        grayscale: (hex: string, type?: string) => string;
    };
    datetimeUtility: {
        isValidDate: (date: unknown) => boolean;
        timer: {
            last: number;
            log(dateToCompare?: Date | number | string): number;
        };
        countDown: (startDate: Date | number | string, interval?: number) => import("./datetime-utility").CountdownValues;
        stringifyDate: (date: Date | number) => string | undefined;
    };
    fileUtility: {
        isFile: (item: unknown) => item is Blob;
        createUrl: (blob: Blob) => string;
        revokeUrl: (url: string) => void;
        getFilename: (uri: string) => string | undefined;
        getExtension: (filename: string) => string;
        getFilenameWithoutExtension: (uri: string | undefined) => string | undefined;
        toFormData: (files: Blob[], data: Record<string, unknown>, { filesParameterName }?: {
            filesParameterName?: string;
        }) => FormData;
        fileToBlob: (file: File, filename?: string, type?: string) => Promise<Blob & {
            name: string;
        }>;
        base64ToBlob: (base64: string, filename: string, type?: string) => Blob & {
            name: string;
        };
        urlToBlob: (url: string, filename?: string) => Promise<Blob & {
            name: string;
        }>;
        blobToBase64: (blob: Blob) => Promise<string>;
        readAllText: (blob: Blob) => Promise<string>;
        writeAllText: (content: string, filename?: string, type?: string) => Blob & {
            name: string;
        };
        saveAs: (blob: Blob & {
            name?: string;
        }, filename?: string) => void;
        formatFileSize: (bytes: number, si?: boolean, dp?: number) => string;
    };
    htmlUtility: {
        redirect: (url: string, delayInSeconds?: number) => void;
        setMetaTag: (name: string, content: string) => void;
        setCanonicalTag: (url: string) => void;
    };
    httpUtility: {
        isLocalHost: () => boolean;
        getHttpsUrl: (url: string) => string;
        forceHttps: (currentUrl: string) => void;
        toQueryString: (obj: Record<string, unknown>, includeNulls?: boolean) => string;
        getQueryStringParams: (url?: string) => {
            [k: string]: string;
        };
    };
    imageUtility: {
        contentTypes: {
            jpg: string;
            png: string;
            gif: string;
        };
        getImageContentType: (img: HTMLImageElement) => Promise<string | undefined>;
        parseContentType: (type: string | undefined) => string;
        urlToImage: (url: string) => Promise<HTMLImageElement>;
        blobToImage: (blob: Blob) => Promise<HTMLImageElement>;
        imageToBlob: (img: HTMLImageElement, filename?: string, _type?: string) => Promise<Blob & {
            name: string;
        }>;
        canvasToImage: (canvas: HTMLCanvasElement, type?: string, quality?: number) => Promise<HTMLImageElement>;
        imageToCanvas: (img: HTMLImageElement, width?: number, height?: number) => HTMLCanvasElement;
        canvasToBlob: (canvas: HTMLCanvasElement, type?: string, quality?: number) => Promise<unknown>;
        base64ToImage: (data: string) => Promise<HTMLImageElement>;
        imageToBase64: (img: HTMLImageElement, type?: string, quality?: number) => string;
        resizeByScale: (img: HTMLImageElement, scale: number, { quality, type }?: {
            quality?: number;
            type?: string;
        }) => Promise<HTMLImageElement>;
        resize: (img: HTMLImageElement, maxSize: number | [number, number], { quality, type }?: {
            quality?: number;
            type?: string;
        }) => Promise<HTMLImageElement>;
        rotate: (img: HTMLImageElement, direction?: number, type?: string) => Promise<HTMLImageElement>;
        flipFlop: (img: HTMLImageElement, flip: boolean, flop: boolean, type?: string) => Promise<HTMLImageElement>;
        convertType: (img: HTMLImageElement, targetType: string) => Promise<HTMLImageElement>;
        getLightness: (img: HTMLImageElement) => number;
        white2transparent: (img: HTMLImageElement, tolerance: number) => Promise<HTMLImageElement>;
    };
    numberUtility: {
        naturalCompare: <T>(as: T, bs: T, f: (x: T) => string | number) => number;
        getRandom: (min?: number, max?: number) => number;
    };
    objectUtility: {
        isPlainObject: (obj: unknown) => obj is Record<string, unknown>;
        flattenObject: (obj: Record<string, unknown>) => Record<string, unknown>;
        crawlObject: (obj: Record<string, unknown>, key: string) => unknown;
        mixin: <T extends Record<string, unknown>>(target: T, ...rest: Record<string, unknown>[]) => T;
        filterObject: (obj: Record<string, unknown>, filter: Record<string, unknown>) => boolean;
    };
    promiseUtility: {
        debounceToPromise: <T>(func: (...args: unknown[]) => T, wait?: number) => (...args: unknown[]) => Promise<T>;
        enqueue: (arr: Array<() => unknown>, throwOnFirstError?: boolean) => Promise<unknown[]>;
        delay: (ms?: number) => Promise<unknown>;
    };
    stringUtility: {
        equals: (s1: string, s2: string, ignoreCase?: boolean) => boolean;
        contains: (s: string, searchString: string, ignoreCase?: boolean) => boolean;
        startsWith: (s: string, searchString: string, ignoreCase?: boolean) => boolean;
        endsWith: (s: string, searchString: string, ignoreCase?: boolean) => boolean;
        trimLeft: (s: string, chars?: string) => string;
        trimRight: (s: string, chars?: string) => string;
        trim: (s: string, chars?: string) => string;
        replaceAll: (s: string, find: string, replace: string) => string;
        randomize: typeof import("./string-utility").randomize;
        newGuid: typeof import("./string-utility").newGuid;
        isEmail: typeof import("./string-utility").isEmail;
        isIP: typeof import("./string-utility").isIP;
        isUrl: typeof import("./string-utility").isUrl;
        isPhone: typeof import("./string-utility").isPhone;
        isDate: typeof import("./string-utility").isDate;
        isPhysicalFolder: typeof import("./string-utility").isPhysicalFolder;
        isPhysicalPath: typeof import("./string-utility").isPhysicalPath;
        formatBelgianPhone: typeof import("./string-utility").formatBelgianPhone;
        htmlEncode: typeof import("./string-utility").htmlEncode;
        htmlDecode: typeof import("./string-utility").htmlDecode;
        normalizeDiacritics: typeof import("./string-utility").normalizeDiacritics;
        capitalize: (s: string) => string;
        toKebabCase: (s: string) => string;
        toSnakeCase: (s: string) => string;
        toTrainCase: (s: string) => string;
        toCamelCase: (s: string) => string;
        toPascalCase: (s: string) => string;
        slugify: (s: string) => string;
    };
    clipboardUtility: typeof clipboardUtility;
};
export default _default;
