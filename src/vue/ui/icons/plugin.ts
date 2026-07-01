import type { App } from "vue"
import bsIcons from "./bootstrap-icons"
import faIcons from "./fontawesome-icons"
import { iconMap, load, clear, type IconsConfig } from "./icons"

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
    },
}
