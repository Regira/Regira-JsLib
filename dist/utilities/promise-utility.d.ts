/**
 * Debounces a function and returns a promise when invoked, all promises resolve to the final (invoked) value
 *
 * @param {Function} func
 *  The function to debounce
 * @param {number} wait
 *  Maximum delay in Milliseconds before invoking
 *
 * @returns {Promise} Returns the result of the invoked function, wrapped in a Promise
 */
export declare const debounceToPromise: <T>(func: (...args: unknown[]) => T, wait?: number) => (...args: unknown[]) => Promise<T>;
/**
 * Executes a collection of (async) functions in order.
 * By default every function runs even if earlier ones reject, and the returned promise
 * rejects with the array of all errors. Pass `throwOnFirstError` to stop at the first
 * rejection and reject with that single error instead.
 * @param arr array of (async) functions
 * @param throwOnFirstError stop and reject on the first error (default false)
 */
export declare const enqueue: (arr: Array<() => unknown>, throwOnFirstError?: boolean) => Promise<unknown[]>;
export declare const delay: (ms?: number) => Promise<unknown>;
declare const _default: {
    debounceToPromise: <T>(func: (...args: unknown[]) => T, wait?: number) => (...args: unknown[]) => Promise<T>;
    enqueue: (arr: Array<() => unknown>, throwOnFirstError?: boolean) => Promise<unknown[]>;
    delay: (ms?: number) => Promise<unknown>;
};
export default _default;
