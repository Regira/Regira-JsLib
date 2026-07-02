import { globalOptions } from "../../ioc"
import { PAGING_DEFAULTS } from "./defaults"
import Paging from "./Paging.vue"
import type { App } from "vue"

export default {
    install(app: App<Element>, { defaultPageSize = 10 } = {}) {
        PAGING_DEFAULTS.PAGESIZE = defaultPageSize

        if (globalOptions.registerComponentsGlobally) {
            app.component("Paging", Paging)
        }
    },
}
