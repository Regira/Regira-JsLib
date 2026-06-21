# Regira JsLib Entities — AI Agent Instructions

The always-loaded guide for building CRUD features with the Regira front-end entities client
(`regira_modules/vue/entities`, a Vue 3 + Pinia + vue-router library). This client is the browser-side
counterpart of the back-end **Regira.Entities** Web API and talks to it over HTTP.

> **Reading order:** this file (workflow) → [entities.namespaces.md](entities.namespaces.md) (exact
> imports) → [entities.signatures.md](entities.signatures.md) (exact signatures) → [entities.examples.md](entities.examples.md)
> (a full slice). Use [entities.patterns.md](entities.patterns.md) for individual recipes.
>
> **Starting a new app?** See [entities.setup.md](entities.setup.md) — the project template (`main.ts`,
> `App.vue`, router, plugin install order, Vite/TS alias).
>
> **Never guess** an import path, signature, or option name. Verify in namespaces/signatures. If a
> detail is missing there, stop and ask — do not invent it.

## Scope & licensing

This is a **client library**. There is no license key and no service-registration budget on the
front-end (those are back-end concepts). You wire entities purely in app code.

## What it does

Every entity is a thin vertical slice: a typed model, a service that calls the API, a config object,
a pooled Pinia store, and four views (overview / details / form / filter) that are driven entirely by
composables. You write almost no imperative logic — you implement `toEntity()` and bind templates.

## Architecture

```
Vue view  ──uses──▶  composable (useSearchView / useForm / useDetails / useFilter)
                          │
                     Pinia store  ──createStore──▶  PoolService (entity cache)
                          │
                     IEntityService  ◀──IoC get(Entity.name)──  EntityServiceBase<T> subclass
                          │
                     shared axios (initAxios) + IConfig.*Url  ──HTTP──▶  Regira.Entities Web API
```

- One **axios** instance is created once (`initAxios`) and shared; the auth plugin layers a bearer
  interceptor on it, so every entity request is authenticated automatically.
- Each service is registered in the **IoC** container keyed by `Entity.name` and resolved with `get()`.
- The store wraps the resolved service in a **pool** (`createStore`) so views share a reactive cache.

## Generic type system

| Parameter | Constraint | Role |
|-----------|------------|------|
| `T` | `extends IEntity` | the entity model (has `$id`, `$title`) |
| `SO` | `extends ISearchObject` | the search/filter object (has `q`) |
| — | `IConfig` | endpoint URLs, paging, route prefix, titles, icon |
| — | `IPagingInfo` / `ISortByInfo` | paging and sort directives |

## The API contract it mirrors

`EntityServiceBase<T>` builds requests from `IConfig` and expects **item-wrapped** envelopes — the exact
shape the back-end `Regira.Entities.Web` endpoints return.

| Method | HTTP | URL | Response |
|--------|------|-----|----------|
| `details(id)` | GET | `{detailsUrl}/{id}` | `{ item }` |
| `list(so)` | GET | `{listUrl}?{query}` | `{ items }` |
| `search(so)` | GET | `{searchUrl}?{query}` | `{ items, count }` |
| `searchUnion(sos)` | POST | `{searchUrl}?{query}` (body = array of search objects) | `{ items, count }` |
| `insert(item)` | POST | `{saveUrl}` | `{ item }` |
| `update(item)` | PUT | `{saveUrl}/{$id}` | `{ item }` |
| `remove(item)` | DELETE | `{deleteUrl}/{$id}` | — |

`save(item)` dispatches: **insert** when `$id == null || $id === "new"`, otherwise **update**; it returns
`SaveResult` = `{ saved, isNew }`. The `*Url` fields default off `config.api` and are **relative** to the
axios `baseURL` (set from app config).

### Automatic query behaviour (`list` / `search`)

`fetchItems` builds the query string by merging `config.baseQueryParams` with the search object, then:

- **`pageSize`** defaults to `config.defaultPageSize` (`DEFAULT_PAGESIZE` = 10) unless you pass `0`.
- **`isArchived`** defaults to `false` — archived rows are hidden unless the search object sets it.
- **`page`** is omitted from the URL when ≤ 1.
- keys starting with **`$`** are stripped (treat them as private/meta).
- array values serialize as **repeated keys** (`includes=A&includes=B`).

### Item hydration

- `processItem` converts the string fields **`created`** and **`lastModified`** into `Date` instances
  on every fetched/saved item. Other date fields are not auto-converted.
- `prepareItem` strips every property whose key starts with **`_`** before sending to the server — use
  `_`-prefixed fields for transient client-only state (e.g. `_deleted` on child rows).

## Choosing a service base

| Use | Base | Why |
|-----|------|-----|
| Normal server-backed entity | `EntityServiceBase<T>` | one request per operation against the API |
| Small static / lookup list | `JSONService<T>` | fetches the list once, then filters/pages/saves in memory (shared cache keyed by `key`) |

Set `config.isComplex = true` for entities with child collections / heavier forms (used by navigation
and routing conventions); simple lookups leave it unset.

## Add an entity — workflow

Create `src/entities/<name>/` with this layout (the demos follow it identically):

```
config/config.ts        IConfig object
data/Entity.ts          class <Name> extends EntityBase  (+ `export const Entity = <Name>`)
data/EntityService.ts   class EntityService extends EntityServiceBase<Entity> { toEntity }
data/store.ts           Pinia store: createStore(get(Entity.name)!, Entity.name)
filter/SearchObject.ts  class extends SearchObjectBase
overview/Overview.vue   useSearchView + useRouteOverview
details/Details.vue     useDetails
details/Form.vue        useForm
filter/Filter.vue       useFilter
setup.ts                createRoutes() + addServices() + addIcons() + default install plugin
index.ts                re-exports
```

1. **Model** — `class Product extends EntityBase` with concrete fields and `override get $id()`
   (return `this.id || "new"`) and `override get $title()`. Export the class, `export const Entity = Product`,
   and a default.
2. **Config** — a `const config: IConfig` with `key`, `routePrefix`, `api`, the `*Url` fields, `defaultPageSize`,
   `icon`, titles, and `baseQueryParams` (e.g. `{ includes: [...] }`).
3. **Service** — `class EntityService extends EntityServiceBase<Entity>` whose ctor calls `super(axios, config)`
   and which implements **only** `toEntity(item)`. Override `prepareItem` / add bespoke endpoints if needed.
4. **Store** — `defineStore(Entity.name, () => createStore<Entity>(get<IEntityService<Entity>>(Entity.name)!, Entity.name))`.
   Views use the **pooled** `service` from this store, never the raw IoC service.
5. **Search object** — `class EntitySearchObject extends SearchObjectBase` adding filter fields.
6. **Views** — Overview (`useSearchView` + `useRouteOverview`), Details (`useDetails`), Form (`useForm`),
   Filter (`useFilter`). Keep them thin: bind refs the composables return.
7. **setup.ts** — `createRoutes()` (Overview + Details with `Fiche`/`Form` children), `addServices(sp)`
   (`sp.add(Entity.name, sp => new EntityService(sp.get("axios")!, config))`), `addIcons()`, and a default
   plugin whose `install(app, { routes })` pushes routes, registers services/icons, and sets
   `app.config.globalProperties.$configs[Entity.name] = config`.
8. **Register** — add the plugin to the `plugins` array in `src/entities/index.ts`.

> **→ See** [entities.examples.md](entities.examples.md) for the full code of one slice, and
> [entities.patterns.md](entities.patterns.md) for child-collections, trees, and JSON services.

## App startup (wiring order)

```
fetch /config.json → createConfig({ api, includeCredentials, culture, clientApp, loginUrl })
→ initAxios({ api, includeCredentials })
→ app.use(servicesPlugin, { configure: sp => sp.add("axios", () => axios)
                                              .add(PoolCache.name, () => defaultPoolCache) })
→ app.use(entityPlugins, { routes })          // each setup.ts registers its service + routes + $configs
→ const router = routerFactory([...routes]); app.use(router)
→ app.use(authPlugin, { axios, tokenManager, clientApp, loginUrl })
```

Order matters: `$services` / `$configs` / `$icons` globals must exist before any entity plugin installs.

## Route & key conventions

- Route names derive from **`config.key`**: `${key}Overview`, `${key}Details`, `${key}Fiche`, `${key}Form`.
- IoC service and `$configs` map are keyed by **`Entity.name`** (the class name). By convention
  `config.key === Entity.name`, but they are conceptually distinct.

## Gotchas

- **`SaveResult` vs `SavedResult`** — bind to `saved`, not `item` (see signatures).
- **`new` sentinel** — `save()` treats `$id === "new"` (or `null`) as an insert; new-entity routes use `:id = "new"`.
- **Archived rows hidden by default** — set `isArchived` on the search object to include them.
- **Pooled service** — the store's `service` is a `PoolService`; the raw service is only via `get(Entity.name)`.
- **Dormant code — do not use:**
  - `regira_modules/entities` (the `src/entities/*` folder) is fully commented-out; its `package.json`
    `./entities` export resolves to an empty module. Use `regira_modules/vue/entities`.
  - `EntityDescriptor` (`/config`) is unused by the demos — the plain `IConfig` + IoC + `$configs`
    wiring above is the supported path.
  - `src/identity/*` is a separate legacy stack, unrelated to `vue/auth`.

## Quick reference

| I want to… | Use |
|------------|-----|
| Define a model | `extends EntityBase` (`$id`, `$title`) |
| Call the API | `extends EntityServiceBase<T>` → implement `toEntity` |
| Static lookup list | `extends JSONService<T>` |
| List + search + URL sync | `useSearchView` + `useRouteOverview` |
| Load one item | `useDetails` |
| Create/edit/delete form | `useForm` (modal: `useModalForm`) |
| Filter UI | `useFilter` |
| Reactive shared cache | `createStore` (Pinia store) |
| Child collections | `useOwnedCollection` / `useOwnedModal` / `useListInput` |
| Hierarchy | `useTree` |
| Navigation from configs | `importDashboard` / `importNavbar` / `buildNavigationTree` |

## See also

- [entities.setup.md](entities.setup.md) (new-project template) · [entities.namespaces.md](entities.namespaces.md) ·
  [entities.signatures.md](entities.signatures.md) · [entities.patterns.md](entities.patterns.md) ·
  [entities.examples.md](entities.examples.md)
- Developer docs: [../docs/README.md](../docs/README.md)
