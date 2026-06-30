import type { App } from "vue"
import useScreen, { SCREEN_SIZES, getWindowSize } from "./screen"

function debounce<A extends unknown[]>(fn: (...args: A) => void, wait: number): (...args: A) => void {
    let timer: ReturnType<typeof setTimeout> | undefined
    return (...args: A) => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => fn(...args), wait)
    }
}

export default {
    install: (app: App<Element>, { sizes }: { sizes?: Record<string, number> } = {}) => {
        if (sizes) {
            for (const key in sizes) {
                if (key in SCREEN_SIZES) {
                    SCREEN_SIZES[key]! = sizes[key]!
                }
            }
        }
        const { screen } = useScreen()

        const debouncedUpdateSize = debounce(() => screen.updateSize(getWindowSize()), 250)
        window.addEventListener("resize", debouncedUpdateSize)
        window.addEventListener("orientationchange", debouncedUpdateSize)

        app.config.globalProperties.$screen = screen
        app.provide("screen", screen)
    },
}
