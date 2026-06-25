import type { App } from "vue"
import LoadingButton from "./LoadingButton.vue"
import LoadingContainer from "./LoadingContainer.vue"
import Loading from "./Loading.vue"

export type LoadingInput = { img: string }

export default {
    install(app: App<Element>, options: LoadingInput) {
        app.component("Loading", Loading)
        app.component("LoadingButton", LoadingButton)
        app.component("LoadingContainer", LoadingContainer)

        app.provide("loadingImg", options.img)
    },
}
