# Regira Debug (front-end)

`regira_modules/vue/debug` — a `<Debug>` display component for dumping values on screen, plus a Vue
plugin that adds `$isDebug` / `$setDebug` globals to control when that output shows.

## What it provides

| Export                    | Purpose                                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `plugin` (default)        | Vue plugin; registers `Debug` globally and installs the `$isDebug`/`$setDebug` properties. Options: `{ isDebug }`. |
| `Debug`                   | Component that renders `title` + `modelValue` (as pretty JSON) only when `$isDebug` is true.                       |
| `$isDebug`                | Global getter — `enableDebug && (?debug=1` query param, else the `isDebug` option`)`.                              |
| `$setDebug(value = true)` | Global master switch; `false` hides all debug output.                                                              |

## How it fits

```
app.use(plugin, { isDebug })
   ├─ registers <Debug> globally
   ├─ $isDebug  ← reads ?debug query (via $router) and the isDebug option
   └─ $setDebug ← master enable/disable switch
```

Requires vue-router (the `$isDebug` getter reads the current route) and a resolvable `Icon` component.

## Reference

Exact signatures and usage guidance live in the AI guides:
[ai/debug.signatures.md](ai/debug.signatures.md), [ai/debug.instructions.md](ai/debug.instructions.md),
and copy-paste snippets in [ai/debug.examples.md](ai/debug.examples.md)
— also served by the Regira MCP server as `regira_modules.vue.debug`.
