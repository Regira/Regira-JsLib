# Regira Events (front-end)

`regira_modules/events` — a lightweight event mixin: an `Event` value object and an `EventHandler` whose
`injectInto(target)` adds a `trigger` / `on` / `once` / `off` API to any object. Regira managers (e.g. the
[identity manager](../../identity)) inject it to broadcast state changes.

## What it provides

| Export | Purpose |
|--------|---------|
| `EventHandler.injectInto(target)` | Add `listeners`/`on`/`once`/`off`/`trigger` to an object or prototype. |
| `on(key, …, callback)` | Subscribe; space-separate keys, `""` is a wildcard; returns the target (chainable). |
| `once(key, …, callback)` | Subscribe once; auto-removes after the first matching fire. |
| `off(key, listener?)` | Unsubscribe one callback, or all for `key` when `listener` is omitted. |
| `trigger(event, arg?)` | Fire by `Event` or string; async, runs listeners sequentially, returns `Promise<unknown[]>`. |
| `Event` | Value object: `new Event(type, src?, data?)` — `data` keys are copied onto the event. |

## Reference

Usage, gotchas and exact signatures live in the AI guides:
[ai/events.instructions.md](../ai/events.instructions.md),
[ai/events.signatures.md](../ai/events.signatures.md), with copy-paste snippets in
[ai/events.examples.md](../ai/events.examples.md) — also served by the Regira MCP server as
`regira_modules.events`.
