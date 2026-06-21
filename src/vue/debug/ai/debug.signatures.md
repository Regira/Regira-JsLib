# Regira JsLib Debug — API Signatures Reference

Verbatim TypeScript signatures for `regira_modules/vue/debug`. Do not guess — look up here first.

```ts
import plugin, { Debug } from "regira_modules/vue/debug"
```

## Module exports

```ts
export { default as Debug } from "./Display.vue"
export { default, default as plugin } from "./plugin"

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $isDebug: boolean
        $setDebug: (value?: boolean) => boolean
    }
}
```

## Plugin

```ts
type IOptions = {
    isDebug: boolean
}
declare const _default: {
    install(app: App<Element>, options?: IOptions): void
}
export default _default
```

## Debug component

```ts
type __VLS_Props = {
    title?: string
    modelValue?: unknown
}
declare const _default: DefineComponent<__VLS_Props, /* … */>
export default _default
```

## See also

- [debug.instructions.md](debug.instructions.md)
