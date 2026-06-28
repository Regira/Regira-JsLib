# Regira Online (front-end)

`regira_modules/vue/online` — online/offline detection for the app: the `useOnlineChecker` composable
plus a Vue plugin that keeps one reactive `isOnline` ref in sync with the browser and exposes it
app-wide as `$isOnline`. Use it to gate calls to the [HTTP layer](../http/README.md) and
[entities client](../entities/README.md) when the network is down.

## What it provides

| Export                             | Purpose                                                                                                                         |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `plugin` (also the default export) | Vue plugin: creates one `isOnline` ref, wires `online`/`offline` listeners, registers `$isOnline` and `provide("isOnline", …)`. |
| `useOnlineChecker()`               | Composable returning `{ isOnline }`, a `Ref<boolean>` seeded from `navigator.onLine`.                                           |
| `$isOnline`                        | `Ref<boolean>` on `ComponentCustomProperties` — available in templates and the Options API after the plugin is installed.       |
| `IsOnline`                         | The `{ isOnline: Ref<boolean> }` return type.                                                                                   |

## Reference

Exact signatures and usage guidance live in the AI guides:
[ai/online.signatures.md](ai/online.signatures.md), [ai/online.instructions.md](ai/online.instructions.md),
[ai/online.examples.md](ai/online.examples.md)
— also served by the Regira MCP server as `regira_modules.vue.online`.
