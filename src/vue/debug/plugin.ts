import { ref, type App } from "vue"

type IOptions = {
    isDebug: boolean
}

export default {
    install(app: App<Element>, options?: IOptions) {
        const isDebug = ref<boolean>(!!options?.isDebug)
        const enableDebug = ref(true)

        Object.defineProperty(app.config.globalProperties, "$isDebug", {
            get() {
                const router = app.config.globalProperties.$router
                const queryDebug = router.currentRoute.value.query?.debug
                return enableDebug.value && (typeof queryDebug !== "undefined" ? queryDebug === "1" : isDebug.value)
            },
            enumerable: true,
            configurable: true,
        })
        app.config.globalProperties.$setDebug = (value = true) => (enableDebug.value = value)
    },
}
