import type { App } from "vue"
import { globalOptions } from "../../ioc"
import bsIcons from "./bootstrap-icons"
import faIcons from "./fontawesome-icons"
import { iconMap, load, clear, type IconsConfig } from "./icons"
import Icon from "./Icon.vue"
import IconButton from "./IconButton.vue"

type Options = {
    icons?: Record<string, string>
    clearFirst?: boolean
    source?: "bs" | "fa"
}
export type IIconProvider = {
    add: (key: string, icon: string) => void
    source: "bs" | "fa"
    map: Map<string, string>
}

export default {
    install(app: App<Element>, { icons = {}, clearFirst = false, source = "bs" }: Options = {}) {
        load(source == "bs" ? bsIcons : faIcons)

        app.provide<IconsConfig>("icons.config", { source, icons: iconMap })

        if (clearFirst) {
            clear()
        }
        if (icons != null) {
            load(icons)
        }

        app.config.globalProperties.$icons = {
            add: (key: string, icon: string) => load({ [key]: icon }),
            source,
            map: iconMap,
        } as IIconProvider

        if (globalOptions.registerComponentsGlobally) {
            // Icon.vue resolves Bs/Fa from the injected config, so it honors `source`.
            app.component("Icon", Icon)
            app.component("IconButton", IconButton)
        }
    },
}
