# Regira Extensions (front-end)

`regira_modules/extensions` — opt-in prototype extensions for `Array`, `Date`, and `Promise`. Nothing is
patched on import; each is enabled explicitly via a `use()` method, so the app decides when (and whether)
to touch globals. The array and promise helpers wrap [`regira_modules/utilities`](../utilities).

## What it provides

| Export                                                                        | Purpose                                                                                                                                                  |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default` (`useArrayExtensions`, `useDateExtensions`, `usePromiseExtensions`) | Convenience enablers for the three prototype extensions.                                                                                                 |
| `arrayExtensions`                                                             | `use(overwrite?)` / `injectInto(target, overwrite?)` — adds `array-utility` helpers (`orderBy`, `groupBy`, `distinct`, `sum`, …) onto `Array.prototype`. |
| `dateExtensions`                                                              | `use()` — overrides `Date.prototype.toJSON` with `stringifyDate` (local time, no UTC correction).                                                        |
| `promiseExtensions`                                                           | `use()` — adds static `Promise.debounce(func, wait?)` and `Promise.enqueue(arr)`.                                                                        |

## How it fits

```
extensions.useArrayExtensions()   →  Array.prototype gains orderBy/groupBy/sum/… (via array-utility)
extensions.useDateExtensions()    →  Date.prototype.toJSON serializes local wall-clock (via datetime-utility)
extensions.usePromiseExtensions() →  Promise.debounce / Promise.enqueue (via promise-utility)
```

Call the enablers once at startup, before code relies on the new prototype members. Array injection skips
members that already exist unless `overwrite` is `true`.

## Reference

Exact signatures and usage notes live in the AI guides:
[ai/extensions.signatures.md](ai/extensions.signatures.md),
[ai/extensions.instructions.md](ai/extensions.instructions.md), with copy-paste snippets in
[ai/extensions.examples.md](ai/extensions.examples.md) — also served by the Regira MCP server
as `regira_modules.extensions`.
