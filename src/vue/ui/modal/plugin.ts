import { inject, type App, type InjectionKey } from "vue"
import { globalOptions } from "../../ioc"
import type { ModalComponent } from "./modal"
import FallbackModal from "./DefaultModal.vue"

export const MODAL_COMPONENT_KEY: InjectionKey<ModalComponent> = Symbol("regira.modal")

/** resolves the app-wide modal (the `modalPlugin` swap-in, `DefaultModal` otherwise); call in setup */
export function injectModal(): ModalComponent {
    return inject(MODAL_COMPONENT_KEY, FallbackModal as unknown as ModalComponent)
}

export default {
    install(app: App<Element>, { Modal }: { Modal?: ModalComponent } = {}) {
        const modal = Modal ?? (FallbackModal as unknown as ModalComponent)
        // every modal in the app resolves to this component — including the ones inside library components
        app.provide(MODAL_COMPONENT_KEY, modal)
        if (globalOptions.registerComponentsGlobally) {
            app.component("MyModal", modal)
        }
    },
}
