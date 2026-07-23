import { redirect as htmlRedirect } from "./html-utility"
import { trim } from "./string-utility"

export const isLocalHost = () => {
    return location.hostname === "localhost" || location.hostname === "127.0.0.1"
}

export const isHttps = (url: string | URL) => {
    const currentUrl = typeof url === "string" ? new URL(url) : url
    return currentUrl.protocol === "https:"
}

export const getHttpsUrl = (url: string) => {
    const currentUrl = new URL(url)
    if (!isHttps(currentUrl)) {
        return "https:" + url.substring(currentUrl.protocol.length)
    }
    return url
}

export const forceHttps = (currentUrl: string) => {
    const httpsUrl = getHttpsUrl(currentUrl)
    if (httpsUrl !== currentUrl && !isLocalHost()) {
        htmlRedirect(httpsUrl)
    }
}

export function tryCreateValidURL(input: string): string {
    if (!input) {
        return input
    }

    let url = input.trim()

    if (!url.match(/^(http:\/\/|https:\/\/)/)) {
        url = "https://" + url
    }

    return url
}

export const toAbsoluteUrl = (relative: string, baseUrl?: string) => {
    // https://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript#answer-14780463
    if (!baseUrl) {
        baseUrl = window.location.origin
    }
    const stack = baseUrl.split("/")
    const parts = trim(relative, "/").split("/")
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] !== ".") {
            if (parts[i] === "..") {
                stack.pop()
            } else {
                stack.push(parts[i])
            }
        }
    }
    return stack.join("/")
}

export const toQueryString = (obj: Record<string, unknown>, includeNulls = false) => {
    const getUriComponent = (key: string, value: unknown) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    const serialize = (obj: Record<string, unknown>, prefix?: string): string[] => {
        return Object.entries(obj)
            .filter((e) => includeNulls || e[1] != null)
            .flatMap(([key, value]) => {
                const fullKey = prefix ? `${prefix}[${key}]` : key
                return Array.isArray(value)
                    ? value.map((v) => getUriComponent(fullKey, v)) // array
                    : typeof value === "object" && value !== null
                      ? serialize(value as Record<string, unknown>, fullKey) // object
                      : [getUriComponent(fullKey, value)] // normal key-value
            })
    }
    return serialize(obj).join("&")
}

export const getQueryStringParams = (url: string = window.location.href) => {
    const urlObj = new URL(url)
    const queryParams = new URLSearchParams(urlObj.search)
    return Object.fromEntries(queryParams.entries())
}

// utility
export default {
    isLocalHost,
    getHttpsUrl,
    forceHttps,
    toQueryString,
    getQueryStringParams,
}
