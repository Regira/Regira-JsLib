import type { App } from "vue"

export type LoadingInput = { img: string }

export default {
    install(app: App<Element>, options: LoadingInput) {
        app.provide("loadingImg", options.img)
    },
}
