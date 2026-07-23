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
export const debounceToPromise = <T>(func: (...args: unknown[]) => T, wait = 250) => {
    let timeout: ReturnType<typeof setTimeout> | undefined = undefined
    let funcsToResolve: Array<(value: T) => void> = []
    return async function (...args: unknown[]) {
        // https://davidwalsh.name/javascript-debounce-function
        if (timeout !== undefined) clearTimeout(timeout)
        return new Promise<T>((resolve) => {
            funcsToResolve.push(resolve)
            timeout = setTimeout(() => {
                timeout = undefined
                const result = func(...args)
                while (funcsToResolve.length) {
                    funcsToResolve.shift()!(result)
                }
            }, wait)
        })
    }
}
/**
 * Executes a collection of async functions in order
 * @param {Array<Function>} array of (async) functions
 */
export const enqueue = async (arr: Array<() => unknown>) => {
    let hasErrors = false
    const results = await arr.reduce(async (r: Promise<unknown[]>, p: () => unknown) => {
        const currentResult = await r
        const newResult = await Promise.resolve(p()).catch((err) => {
            hasErrors = true
            return err
        })
        currentResult.push(newResult)
        return currentResult
    }, Promise.resolve([]))
    if (hasErrors) {
        return Promise.reject(results)
    }
    return results
}

export const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms))

// utility object
export default {
    debounceToPromise,
    enqueue,
    delay,
}
