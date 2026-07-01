import { PAGING_DEFAULTS } from "./defaults"
import type { App } from "vue"

export default {
    install(_: App<Element>, { defaultPageSize = 10 } = {}) {
        PAGING_DEFAULTS.PAGESIZE = defaultPageSize
    },
}
