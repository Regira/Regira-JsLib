# Regira JsLib Debug — AI Agent Instructions

The front-end debug helpers (`regira_modules/vue/debug`): a small `<Debug>` display component for
dumping any value on screen, plus a Vue plugin that adds the `$isDebug` / `$setDebug` global
properties controlling when that output is visible.

> **Never guess** a signature — verify in [debug.signatures.md](debug.signatures.md).

## Import

```ts
import plugin, { Debug } from "regira_modules/vue/debug"
```

The default export is the plugin (also exported as `plugin`); `Debug` is the component (the plugin
also registers it globally as `"Debug"`).

## The plugin

`app.use(plugin, { isDebug })` registers the `Debug` component globally and installs two global
properties:

```ts
app.use(plugin, { isDebug: appConfig.isDebug })   // isDebug defaults to false
```

- **`$isDebug`** (getter) — `true` when debug output should show. Its value is `enableDebug && (?debug
  query param when present, else the `isDebug` option)`: a `?debug=1` query string forces it on, any
  other value of `?debug` forces it off, and with no `?debug` param it falls back to the `isDebug`
  install option.
- **`$setDebug(value = true)`** — toggles the `enableDebug` master switch (returns the new value).
  Setting it `false` hides debug output regardless of the option or query param.

## The Debug component

```ts
<Debug :title="..." :model-value="anyValue" />
```

Renders nothing unless `$isDebug` is true. When visible it shows `Debug {{ title }}` and the
`modelValue` pretty-printed as JSON (`JSON.stringify(value ?? {}, null, 2)`), with a minimize/maximize
toggle button.

## Gotchas

- **Router required.** The `$isDebug` getter reads `app.config.globalProperties.$router.currentRoute`,
  so vue-router must be installed — without it the getter throws.
- **Query param wins over the option.** When `?debug` is present in the URL it overrides the `isDebug`
  install option (`?debug=1` on, anything else off); only when there is no `?debug` param does the
  option apply.
- **Master switch.** `$setDebug(false)` gates everything off even when `?debug=1` or `isDebug: true` —
  it ANDs with the resolved value.
- **Icon dependency.** `<Debug>` uses an `<Icon>` component for its toggle button, so an `Icon` must be
  resolvable in the app (see the ui icons module).

## See also

- [debug.examples.md](debug.examples.md)
- [debug.signatures.md](debug.signatures.md)
- [HTTP](../../http/ai/http.instructions.md) · [Entities](../../entities/ai/entities.instructions.md)
