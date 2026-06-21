# Regira JsLib IoC — API Signatures Reference

Verbatim TypeScript signatures for `regira_modules/vue/ioc`. Do not guess — look up here first.

```ts
import { ServiceProvider, get, plugin as servicesPlugin, type IServiceProvider } from "regira_modules/vue/ioc"
// default export = the shared ServiceProvider singleton
```

## Container

```ts
export interface IServiceProvider {
    get<T = any>(key: any): T | null
    add<T = any>(key: any, factory: (sp: IServiceProvider) => T): IServiceProvider
}

export class ServiceProvider implements IServiceProvider {
    services: Map<any, (sp: IServiceProvider) => any>
    constructor()
    get<T = any>(key: any): T | null                                        // returns factory(this) or null
    add<T = any>(key: any, factory: (sp: IServiceProvider) => T): IServiceProvider   // chainable
}

// resolves from the default singleton
export function get<T>(key: any): T | null

// default export
declare const defaultServiceProvider: IServiceProvider
export default defaultServiceProvider
```

## Vue plugin

```ts
export const plugin: {
    install(app: App<Element>, { configure }?: { configure?(services: IServiceProvider): IServiceProvider }): void
}
// install sets app.config.globalProperties.$services and provide("services", …), then runs configure(sp)
```

`$services` is augmented onto `ComponentCustomProperties` (available as `this.$services`).

## See also

- [ioc.instructions.md](ioc.instructions.md)
