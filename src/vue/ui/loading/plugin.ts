import type { App } from "vue"
import { globalOptions } from "../../ioc"
import Loading from "./Loading.vue"
import LoadingButton from "./LoadingButton.vue"
import LoadingContainer from "./LoadingContainer.vue"

export type LoadingInput = { img: string }

export default {
    install(app: App<Element>, options: LoadingInput) {
        app.provide("loadingImg", options.img)

        if (globalOptions.registerComponentsGlobally) {
            app.component("Loading", Loading)
            app.component("LoadingButton", LoadingButton)
            app.component("LoadingContainer", LoadingContainer)
        }
    },
}
