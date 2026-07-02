import type { App } from "vue"
import { globalOptions } from "../../ioc"
import FallbackModal from "./DefaultModal.vue"

export default {
    install(app: App<Element>, { DefaultModal } = { DefaultModal: FallbackModal }) {
        if (globalOptions.registerComponentsGlobally) {
            app.component("MyModal", DefaultModal)
        }
    },
}
