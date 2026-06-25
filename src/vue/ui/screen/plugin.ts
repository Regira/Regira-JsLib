import debounce from "lodash/debounce"
import type { App } from "vue"
import useScreen, { SCREEN_SIZES, getWindowSize } from "./screen"

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
