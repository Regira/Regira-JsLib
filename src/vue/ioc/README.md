# Regira IoC (front-end)

`regira_modules/vue/ioc` — a tiny inversion-of-control container that wires the app's services. Entity
services are registered and resolved through it.

## What it provides

| Export | Purpose |
|--------|---------|
| `ServiceProvider` | Container: `add(key, factory)` to register, `get<T>(key)` to resolve. |
| `get<T>(key)` | Resolve from the shared default provider (used outside components). |
| `plugin` | Vue plugin: exposes the provider as `$services` and runs a `configure(sp)` callback. |
| `IServiceProvider` | The container interface. |
| default export | The shared `ServiceProvider` singleton. |

## Key behaviour

Registration is **factory-based and transient** — `get(key)` re-runs the factory on every call, so a
factory that does `new …()` returns a fresh instance each time. Reactive entity caching is handled
separately by the entities pooling layer, not here.

## How it fits

```
app.use(servicesPlugin, { configure: sp =>
    sp.add("axios", () => axios)              // the shared HTTP instance (regira_modules/vue/http)
      .add(PoolCache.name, () => defaultPoolCache) })

// each entity setup.ts:
sp.add(Entity.name, sp => new EntityService(sp.get("axios")!, config))
// stores/components:
const service = get<IEntityService<Entity>>(Entity.name)!
```

## Reference

Exact signatures and wiring examples are in the AI guides: [ai/ioc.signatures.md](ai/ioc.signatures.md),
[ai/ioc.instructions.md](ai/ioc.instructions.md), [ai/ioc.examples.md](ai/ioc.examples.md) — also
served by the Regira MCP server as `regira_modules.vue.ioc`.
