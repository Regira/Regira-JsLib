# Regira Directives (front-end)

`regira_modules/vue/directives` — three small Vue custom directives. Each is exported as a directive
object (and ships a Vue plugin as its file `default`), so you can register them individually or via
`app.use`.

## What it provides

| Export | Purpose |
|--------|---------|
| `focus` | Autofocus directive (`v-focus`): calls `el.focus()` ~250 ms after mount. |
| `clickOutside` | `v-click-outside`: runs the bound handler when a click lands outside the element. |
| `grow` | `v-grow`: auto-grows a `<textarea>`'s `minHeight` as newlines are added (up to `maxGrow`, default 7). |

## Reference

Exact signatures and usage notes live in the AI guides:
[ai/directives.signatures.md](../ai/directives.signatures.md),
[ai/directives.instructions.md](../ai/directives.instructions.md), with copy-paste snippets in
[ai/directives.examples.md](../ai/directives.examples.md) — also served by the Regira MCP
server as `regira_modules.vue.directives`.
