# Regira JsLib Entities — AI Agent Instructions

> The browser-side CRUD client for the **Regira.Entities** API — a Vue 3 + Pinia + vue-router library
> (`regira_modules/vue/entities`). Describe an entity once (model, service, config, views) and get a
> list/search overview, a details page, a create/edit form, and a filter, all wired through a shared HTTP
> client and a reactive entity cache.

This is the always-loaded spine. It situates the entities client among the other front-end modules,
gives the entity-building workflow, and points to the satellite files for exact imports, signatures, and
full code.

> **Reading order:** this file → [entities.setup.md](entities.setup.md) (new app) →
> [entities.namespaces.md](entities.namespaces.md) (exact imports) →
> [entities.signatures.md](entities.signatures.md) (exact signatures) →
> [entities.examples.md](entities.examples.md) (a **simple** `UnitType` slice, then a **standard** `Product`
> slice) / [entities.advanced.example.md](entities.advanced.example.md) (a **complex** `Vehicle` slice). Load
> [entities.patterns.md](entities.patterns.md) for individual recipes.
>
> **Never guess** an import path, signature, or option name. Verify in namespaces/signatures. If a detail
> is missing there, stop and ask — do not invent it.

---

## Modules

A front-end app is **assembled** from several `regira_modules` packages. `vue/entities` is the CRUD
engine; the others provide the runtime it plugs into. This is the front-end counterpart of the back-end
package set — each module has its own guide (load it when you work in that area).

| Module                         | Import                                                                                           | Role                                                                                                                                                                                                                                                                                                                                   | Required?                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **vue/entities**               | `regira_modules/vue/entities`                                                                    | **This module.** The CRUD engine: `EntityBase`, `EntityServiceBase`/`JSONService`, `IConfig`, `createStore` (pooling), the overview/details/form/filter composables, navigation, preloading, tree.                                                                                                                                     | ✓ core                                                                                    |
| **vue/app**                    | [`regira_modules/vue/app`](../../app/ai/app.instructions.md)                                     | App lifecycle + culture: `AppStatus` (Init→Mounting→Ready), `$setAppStatus`, `$culture`/`$setCulture`, `whenAppReady()`, the loading gate. The app's heartbeat.                                                                                                                                                                        | ✓ core                                                                                    |
| **vue/ioc**                    | [`regira_modules/vue/ioc`](../../ioc/ai/ioc.instructions.md)                                     | Service container: register the shared `axios` + `PoolCache` here; every entity service is resolved from it by `Entity.name` via `get()`.                                                                                                                                                                                              | ✓ core                                                                                    |
| **vue/http**                   | [`regira_modules/vue/http`](../../http/ai/http.instructions.md)                                  | The single shared axios: `initAxios({ api, includeCredentials })` (sets `baseURL`, credentials, file upload/download helpers).                                                                                                                                                                                                         | ✓ core                                                                                    |
| **vue/ui**                     | [`regira_modules/vue/ui`](../../ui/ai/ui.instructions.md)                                        | Component + feedback kit (Bootstrap 5): `feedbackPlugin`, `loadingPlugin`/`LoadingContainer`, `iconPlugin`, `screenPlugin`, `DefaultModal`, inputs (`DateInput`, `NullableCheckBox`…), `Autocomplete`, paging, tabs — components are imported locally by default (opt-in app-wide registration via `configureGlobals` from `vue/ioc`). | ✓ core¹                                                                                   |
| **vue/auth**                   | [`regira_modules/vue/auth`](../../auth/ai/auth.instructions.md)                                  | Login + bearer token layered on the shared axios: `authPlugin`, `LocalStorageTokenManager`, `useAuthStore`, login UI, route guard.                                                                                                                                                                                                     | ○ optional (see [Running without auth](entities.setup.md#running-without-authentication)) |
| **vue/lang**                   | [`regira_modules/vue/lang`](../../lang/ai/lang.instructions.md)                                  | i18n: `langPlugin`, `useLang`, `$t`/`$tm`, key-first translations.                                                                                                                                                                                                                                                                     | ○ optional                                                                                |
| **vue/directives**             | [`regira_modules/vue/directives`](../../directives/ai/directives.instructions.md)                | Global directives installed as plugins: `focus`, `grow` (textarea autosize), `clickOutside`.                                                                                                                                                                                                                                           | ○ optional                                                                                |
| **vue/online**                 | [`regira_modules/vue/online`](../../online/ai/online.instructions.md)                            | Connectivity: `isOnlinePlugin` + `$isOnline`, drives an offline banner.                                                                                                                                                                                                                                                                | ○ optional                                                                                |
| **vue/formatters**             | [`regira_modules/vue/formatters`](../../formatters/ai/formatters.instructions.md)                | Date/number formatting (`formatDateTime`, …) — used for display and config cache-busting.                                                                                                                                                                                                                                              | ○ optional                                                                                |
| **vue/debug**                  | [`regira_modules/vue/debug`](../../debug/ai/debug.instructions.md)                               | Dev-only `debugPlugin` + `$isDebug`/`$setDebug`.                                                                                                                                                                                                                                                                                       | ○ optional                                                                                |
| **extensions/date-extensions** | [`regira_modules/extensions/date-extensions`](../../../extensions/ai/extensions.instructions.md) | `dateSerializer.use()` once at startup — serialize `Date`s to JSON without a timezone shift. Lives under `extensions/`, **not** `vue/`.                                                                                                                                                                                                | ○ recommended                                                                             |
| **utilities**                  | [`regira_modules/utilities`](../../../utilities/ai/utilities.instructions.md)                    | Pure helpers (`string-utility`, `array-utility`, `file-utility`, …).                                                                                                                                                                                                                                                                   | ○ as needed                                                                               |

> **Not in the common stack:** `regira_modules/treelist` (`TreeList` / `IFindParents`) is a direct
> dependency only when you build an explicit client-side hierarchy with `useTree` — a load-on-demand
> recipe in [entities.patterns.md → Hierarchical (tree) entities](entities.patterns.md#hierarchical-tree-entities),
> not part of the app you assemble here. (The dashboard/navbar builders return a `TreeList` too, but you
> import those from `vue/entities`, not `treelist` directly.)

¹ _`vue/ui` is "core" because the standard app shell (`App.vue`) uses `Feedback` + `LoadingContainer` and
the views render icons. A pure headless data layer can skip it — see
[Choosing a service base](#choosing-a-service-base) and the data-layer-only note in
[entities.setup.md](entities.setup.md)._

The **plugin install order** that wires these together is fixed (verified across the reference apps) —
see [App startup](#app-startup-wiring-order) and the canonical `main.ts` in
[entities.setup.md → Bootstrap](entities.setup.md#bootstrap--maints).

---

## Scope & licensing

This is a **client library**. There is no license key and no service-registration budget on the
front-end (those are back-end concepts). You wire entities purely in app code.

## Quick Agent Playbook

| Task                                                                                                                                    | Go to                                                                                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Stand up a new app** (full SPA: deps, full plugin stack, `main.ts`, `App.vue`, router, preloader, app shell, `app-config.ts`)         | → [entities.setup.md](entities.setup.md)                                                                                                         |
| **Scaffold the app shell** (`scaffold.mjs --shell` → bootstrap, config, router, dashboard + navbar, layout, views; `--no-auth` variant) | → [entities.shell.template.md](entities.shell.template.md) · [setup §App shell](entities.setup.md#app-shell--components-infrastructure--styling) |
| **Add an entity**                                                                                                                       | → [§Entity Implementation Workflow](#entity-implementation-workflow)                                                                             |
| **Scaffold a new entity** (`scaffold.mjs <Entity>` copies the full slice; then fill the `(c)` files)                                    | → [entities.template.md](entities.template.md)                                                                                                   |
| **See a worked slice, simplest first** (a **simple** `UnitType`, then a **standard** `Product`)                                         | → [entities.examples.md](entities.examples.md)                                                                                                   |
| **See a complex slice** (attachments, many-to-many link, owned child collection, `Vehicle`)                                             | → [entities.advanced.example.md](entities.advanced.example.md)                                                                                   |
| **Implement one feature** (child collections, trees, JSON lookups, union search, navigation, custom endpoints, OpenAPI typing)          | → [entities.patterns.md](entities.patterns.md)                                                                                                   |
| **Run without authentication**                                                                                                          | → [entities.setup.md §Running without auth](entities.setup.md#running-without-authentication)                                                    |

## References

**Imports:** [entities.namespaces.md](entities.namespaces.md) — never guess or invent an import specifier.

**Signatures:** [entities.signatures.md](entities.signatures.md) — never guess a method name, parameter,
or return type; verify here.

---

## Core Understanding

### Architecture

Every entity is a thin vertical slice: a typed model, a service that calls the API, a config object, a
pooled Pinia store, and four views (overview / details / form / filter) driven entirely by composables.
You write almost no imperative logic — you implement `toEntity()` and bind templates.

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
- The store wraps the resolved service in a **pool** (`createStore`) so views share a reactive cache: a save
  through the pooled service updates the one shared instance, so an edit anywhere propagates to every view
  automatically.

### Generic type system

| Parameter | Constraint                    | Role                                                                            |
| --------- | ----------------------------- | ------------------------------------------------------------------------------- |
| `T`       | `extends IEntity`             | the entity model (`$id` = uniform identifier, `$title` = uniform display label) |
| `SO`      | `extends ISearchObject`       | the search/filter object (has `q`)                                              |
| —         | `IConfig`                     | endpoint URLs, paging, route prefix, titles, icon                               |
| —         | `IPagingInfo` / `ISortByInfo` | paging and sort directives                                                      |

### The API contract it mirrors

`EntityServiceBase<T>` builds requests from `IConfig` and expects **item-wrapped** envelopes — the exact
shape the back-end `Regira.Entities.Web` endpoints return (the **HTTP body** column below), then **unwraps
them for you**, so the method return types are *not* these envelopes — see the note under the table.

| Method             | HTTP   | URL                                                    | HTTP body          |
| ------------------ | ------ | ------------------------------------------------------ | ------------------ |
| `details(id)`      | GET    | `{detailsUrl}/{id}`                                    | `{ item }`         |
| `list(so)`         | GET    | `{listUrl}?{query}`                                    | `{ items }`        |
| `search(so)`       | GET    | `{searchUrl}?{query}`                                  | `{ items, count }` |
| `searchUnion(sos)` | POST   | `{searchUrl}?{query}` (body = array of search objects) | `{ items, count }` |
| `insert(item)`     | POST   | `{saveUrl}`                                            | `{ item }`         |
| `update(item)`     | PUT    | `{saveUrl}/{$id}`                                      | `{ item }`         |
| `remove(item)`     | DELETE | `{deleteUrl}/{$id}`                                    | —                  |

> **The methods return *unwrapped* values, not these envelopes.** `list()` resolves to `Array<T>` (not `{ items }`), `details()` to `T | null`, `search()`/`searchUnion()` to `SearchResult<T>` (`{ items, count }`), `save()`/`insert()`/`update()` to `SaveResult<T>`/`T | null`. Destructure accordingly — `const items = await service.list()`, never `const { items } = await service.list()`. Verify in [entities.signatures.md](entities.signatures.md).

`save(item)` dispatches: **insert** when `$id` is an unsaved sentinel — `null`, `undefined`, `"new"`, `""`,
or a **non-positive number** (`0`, or the negative temp ids owned/related collections mint for new rows) via
the exported `isNewEntity($id)` predicate, otherwise **update**; it returns `SaveResult` = `{ saved, isNew }`.
A model whose `$id` returns a bare `this.id` therefore inserts correctly at `id <= 0`. The `*Url` fields default off `config.api` and are **relative** to the
axios `baseURL` (set from app config).

> **Owned/related children can be built on an unsaved parent.** New child rows carry negative temp-id
> sentinels, so a form may add them _before_ the parent is saved — `save(parent)` inserts the parent and its
> pending children together. Don't gate "add a child" on saving the parent first. (A child modelled as a
> **first-class entity** with its own service does need the parent's real id, so it saves after — see
> [entities.patterns.md → Owned (child) collections](entities.patterns.md#owned-child-collections).)

> Each `*Url` is a **resource base**, not a literal endpoint: `update` appends `/{$id}` (`PUT {saveUrl}/{$id}`)
> and `remove` appends `/{$id}` (`DELETE {deleteUrl}/{$id}`). Leave them at `config.api` (or a sub-resource);
> never set `saveUrl` to a `/save` path or **updates 404 while inserts still pass** — a silent half-working trap.

> **`includes` may not apply to the Details GET.** The `includes` flags drive eager-loading on
> `list`/`search`, but the single-item `details(id)` endpoint (`GET {detailsUrl}/{id}`) does not
> necessarily honor them — nested collections can come back **empty on a detail/edit form** even though
> `baseQueryParams.includes` is set. If a form needs child data, ensure the API eager-loads it for the
> Details endpoint (a back-end concern) or fetch the children with a dedicated call.

#### Automatic query behaviour (`list` / `search`)

`fetchItems` builds the query string by merging `config.baseQueryParams` with the search object, then:

- **`pageSize`** defaults to `config.defaultPageSize` (`DEFAULT_PAGESIZE` = 10). `pageSize: 0` returns **all
  rows, capped by the server's `MaxPageSize`** (100 under `UseDefaults()`) — send a positive `pageSize` to
  page, and for sets larger than `MaxPageSize` use the `Autocomplete` selector (server-side search).
- **`isArchived`** defaults to `false` — archived rows are hidden unless the search object sets it.
- **`page`** is omitted from the URL when ≤ 1.
- keys starting with **`$`** are stripped (treat them as private/meta).
- array values serialize as **repeated keys** (`includes=A&includes=B`).

> **`GET /search` (with `count`) is on every controller — simple and complex.** A simple entity pages just
> like a complex one: set `searchUrl: api + "/search"` and use `useSearchView`. _Complex_ adds only typed
> `?sortBy=`/`?includes=` and the batch `POST /list`/`POST /search` — not the count. Leave `searchUrl` at
> `config.api` (no `/search`) and `service.search()` falls back to `GET /` → `{ items }` with no `count`, so
> use `useListView` there. **Let dataset size drive the simple-vs-complex choice.**

#### Item hydration

- `processItem` converts the string fields **`created`** and **`lastModified`** into `Date` instances
  on every fetched/saved item. Other date fields are not auto-converted (convert them in `toEntity` —
  see [entities.patterns.md → Date hydration](entities.patterns.md#date-hydration)).
- `prepareItem` strips every property whose key starts with **`_`** before sending to the server — use
  `_`-prefixed fields for transient client-only state (e.g. `_deleted` on child rows).
- **Nested included relations are plain JSON objects** — only the root item runs through `toEntity`, so on an
  included relation the `EntityBase` getters (`$id`, `$title`, …) are `undefined`. Either bind the **plain DTO
  field** the API projects (`item.vehicle?.title`), or resolve the relation through the pool —
  `fromPool(item.vehicle)?.$title` — which rehydrates it into the shared reactive model so the getters work
  (the preferred path for display; see
  [entities.patterns.md → Resolving relations with `fromPool`](entities.patterns.md#resolving-relations-with-frompool)).
  What you must **not** do is read `item.vehicle?.$title` off the **raw** relation.

---

## Decision Guidelines

### How much to build

**Default to the full reference scaffold** — a scalable, production-ready SPA using the full `regira_modules`
package. Treat every build request as production-bound unless the user says otherwise; drop to a lighter tier
**only when the user explicitly asks** for a demo, an embed, or a headless/custom UX, and declare the choice.

| Tier                                    | You build                                                                                                              | Files you edit | Pick when                                                               |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------- |
| **Full reference scaffold** _(default)_ | the per-entity slice (`config`/`data`/`overview`/`details`/`filter`/`selecting`/`setup`) + app shell (nav/layout/auth) | ~8 of ~23      | any real app — batteries-included CRUD UX, relation pickers, navigation |
| **Lean (generic views)**                | the data layer + the library's `EntityOverview` / `EntityForm` bound via slots; skip the slice scaffold                | ~4             | an explicitly-requested focused admin, storefront, or embed             |
| **Headless data-layer**                 | `initAxios` + `EntityServiceBase<T>` subclasses + your own views; no plugin stack                                      | 1–2            | an explicitly-requested storefront / custom UI, or embedding            |

The full tier _generates_ ~23 files/entity but you edit only the **8** marked `(c)` — the other 15 are
`vue-tsc`-verified boilerplate you never touch. Compare the authored ~8, not the generated ~23, against lean's ~4.

Scaffold the full tier by copying the shipped slice template — don't hand-write the files:
`node node_modules/regira_modules/_template/scaffold.mjs <Entity>` (see [slice template](entities.template.md)).
The lean tier pairs the same data layer with `EntityOverview` / `EntityForm`
([entities.setup.md → Lean tier](entities.setup.md#lean-tier-generic-views)).

> **The full scaffold is the low-risk default; hand-rolling views is the expensive path** — and this holds
> for small and non-CRUD apps too:
>
> - **It type-checks green out of the box — and more entities don't compound that.** Each slice is generated
>   and `vue-tsc`-verified independently, so a 5-entity app is not 5× the type-check risk of one. `scaffold.mjs
>   <Entity>` emits ~23 files; you edit only the **8** marked `(c)`, and the rest is verified boilerplate. File
>   count is not effort — you are not signing up to debug generated code.
> - **The relation pickers are the payoff.** `selecting/Autocomplete.vue` is a server-searchable picker: it
>   selects one row out of thousands without loading them all (a plain dropdown can't). Hand-rolled forms
>   re-hit that problem and rebuild the picker, modal, and pager the kit already ships.
> - **The plugin stack is a one-time app-shell cost, not per-entity.** It installs once in `main.ts`, and
>   every slice composable (`useForm`/`useFilter`/`useSearchView`) needs it — so going headless to "skip
>   plugins" is a false economy the moment you want one real form. The data layer, pooling, and preloader are
>   one tested whole; opting out of one piece means re-implementing the others.
> - **A non-grid UX is still the slice.** A category-tree filter, an active/inactive toggle, or a storefront
>   card list is normal customization of `Filter.vue` / `List.vue` / `ListItem.vue`.
> - **The look is yours — the behaviour isn't.** The scaffold fixes the _wiring_, not the _design_: freely
>   restructure the markup, columns, and layout and restyle the views. But a few behaviours live in the
>   components, not their CSS — navbar dropdowns (a Vue toggle, not Bootstrap JS), dashboard route-tiles, the
>   library `FormButtonsRow`, the `_deleted` remove-marks-not-splices flow, and modal teleport into `#modals`.
>   Restyle the markup; keep the behaviour, or reuse the component. Per-file checklists:
>   [entities.template.md](entities.template.md) (slice), [entities.shell.template.md](entities.shell.template.md) (shell).
>
> Downgrade to lean or headless **only** when the user's request names it — "demo", "embed", "storefront",
> "headless", "lean", "no scaffold", "just the data layer" — and state the tier you picked.

### Choosing a service base

| Use                         | Base                   | Why                                                                                                                                                                         |
| --------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Normal server-backed entity | `EntityServiceBase<T>` | one request per operation against the API                                                                                                                                   |
| Small static / lookup list  | `JSONService<T>`       | fetches the list once, then filters/pages/saves in memory (shared cache keyed by `key`) — see [entities.patterns.md](entities.patterns.md#static--lookup-data--jsonservice) |

Set `config.isComplex = true` for entities with child collections / heavier forms (used by navigation
and routing conventions); simple lookups leave it unset.

> **Data-layer only?** For a storefront or headless view that doesn't use the CRUD scaffolding, you can
> skip the heavy plugin stack: `initAxios({ api })` once + `EntityServiceBase<T>` subclasses + your own
> views. `service.search(so)` still merges `baseQueryParams`, strips `$`-keys, serializes arrays as
> repeated keys, and defaults `pageSize`/`isArchived`. The reference apps all wire the full stack — this
> is the minimal variant, not the norm.
>
> When you construct `EntityServiceBase` directly, the `*Url` fields default from `config.api`.
> Model `id` as `id?: number` (an `id: null` would still serialize and a
> non-nullable int InputDto rejects it).

### Overview: `useListView` vs `useSearchView`

Both simple and complex controllers expose `/search`, so the choice is a fetch-shape decision, not a
question of which endpoint exists:

| Composable                           | Calls              | Expects            | Use when                                       |
| ------------------------------------ | ------------------ | ------------------ | ---------------------------------------------- |
| `useSearchView` + `useRouteOverview` | `service.search()` | `{ items, count }` | counted paging + filters (the usual list UI)   |
| `useListView`                        | `service.list()`   | `{ items }`        | a plain list is enough — no total count needed |

Both expose the same overview surface (`items`, `pagingInfo`, `itemsCount`, `isLoading`, `applySave`,
`handleSave`, `handleRemove`); only the fetch + handler names differ (`searchHandler` /
`debouncedSearchHandler` vs `listHandler` / `debouncedListHandler`).

> **→ See:** [entities.signatures.md](entities.signatures.md#5-overview-composables) — exact composable signatures.

---

## App Creation Workflow

Standing up a new app — deps, runtime config, the shared axios, the plugin install order, the app shell —
is a one-time **project-setup** task. Author `package.json` from the known-good dependency set
([entities.setup.md → Install](entities.setup.md#install)), `npm install`, then scaffold everything else in
one command: `node node_modules/regira_modules/_template/scaffold.mjs --shell` (`--no-auth` for a no-auth app).

> **→ See:** [entities.shell.template.md](entities.shell.template.md) — every generated shell file ·
> [entities.setup.md](entities.setup.md) — the full project template (`main.ts`, `App.vue`,
> router, plugin install order, required-vs-optional plugins, running with/without auth, app shell).

---

## Entity Implementation Workflow

Every entity is a self-contained vertical slice under `src/entities/<name>/` — the **same folder set for
every entity** (a lookup keeps every folder, just with thinner files).

> **→ See:** [entities.setup.md → Entity slice anatomy](entities.setup.md#entity-slice-anatomy) — every
> file with its one-line purpose and the `(c)` markers for the files you customize per entity.
>
> **→ See:** [entities.template.md](entities.template.md) — a **blank scaffold**: the file tree plus a
> placeholder skeleton for each `(c)` file to fill in (use this to start a new slice from nothing).
>
> **→ See:** [entities.examples.md](entities.examples.md) — start with the **simple** `UnitType` slice
> (every file), then the **standard** `Product` slice (what a richer entity adds).
> For the complex case (attachments / many-to-many link / owned child collection) see
> [entities.advanced.example.md](entities.advanced.example.md) (`Vehicle`); trees and the
> `useOwnedCollection` composable are recipes in [entities.patterns.md](entities.patterns.md).

### Minimal slice (happy path)

Most entities follow the same 12 steps below — one file per step. **Scaffold all of them at once** with
`node node_modules/regira_modules/_template/scaffold.mjs <Entity>`, then fill the `(c)` files in this order.
A **lookup** entity keeps the folders but drops the list UI (omit the views and `createRoutes()`; the
`install` only registers the service/icon and `$configs[Entity.name]`; `SearchObject` may be empty; consider
`JSONService` for static data):

> **The files you actually edit** are the eight marked `(c)`: `data/Entity.ts`, `config/config.ts`,
> `filter/SearchObject.ts`, `filter/FilterAdv.vue`, `overview/List.vue`, `overview/ListItem.vue`,
> `details/Form.vue`, `selecting/SelectorList.vue`. Everything else is verbatim boilerplate the scaffold writes;
> a **lookup** drops the overview trio (`List`/`ListItem`/`FilterAdv`).

1. **Model** — `data/Entity.ts` (c): `extends EntityBase` with concrete fields; `override get $id()`
   (`this.id || "new"`) and `override get $title()`. Export the class, `export const Entity = …`, and a default.
2. **Config** — `config/config.ts` (c): a `const config: IConfig` — `key`, `routePrefix`, `api`, the `*Url`
   fields, `defaultPageSize`, `icon`, titles, and `baseQueryParams` (e.g. `{ includes: [...] }`).
3. **Service** — `data/EntityService.ts`: `extends EntityServiceBase<Entity>`; ctor `super(axios, config)`;
   implement **only** `toEntity(item)` (override `prepareItem` / add bespoke endpoints if needed).
4. **Store** — `data/store.ts`: a Pinia store around `createStore<Entity>(get(Entity.name)!, Entity.name)`.
   Views use the **pooled** `service` from this store, never the raw IoC service. The pooled handler exposes
   the full `IEntityService` surface (`details` / `list` / `search` / `searchUnion` / `save` / `remove` —
   `save` dispatches insert vs update) plus the cache accessors (`get` / `getMany` / `set` / `setMany` /
   `fromPool` / `fromCache`) — exact shapes in [entities.signatures.md §7](entities.signatures.md#7-pooling-entity-cache).
5. **Search object** — `filter/SearchObject.ts` (c): `extends SearchObjectBase` with filter fields.
6. **Filter** — `filter/`: `Filter.vue` (inline bar + advanced-modal shell), `FilterInline.vue`,
   `FilterAdv.vue` (c) — all call `useFilter`.
7. **Overview** — `overview/`: `Overview.vue` (`useSearchView` + `useRouteOverview` → counted `/search`, so
   the overview pages for simple **and** complex entities; swap to `useListView` only for a lookup that needs
   no count) + `List.vue` (c) + `ListItem.vue` (c).
8. **Details & form** — `details/`: `Details.vue` (`useDetails`, loads `:id`, hosts `Fiche`/`Form`),
   `Form.vue` (c) (`useForm`), `FormModalButton.vue` (`useModalForm`).
9. **Selecting** — `selecting/`: the relation-picker set built on the store; only `SelectorList.vue` (c) is
   per-entity, the rest is verbatim boilerplate. See
   [entities.patterns.md](entities.patterns.md#entity-selector-relation-picker--selecting).
10. **Barrel** — `index.ts`: re-export the slice's public API (config, Entity, service, views, Selector, plugin).
11. **setup.ts**: `createRoutes()` (Overview + Details with `Fiche`/`Form` children), `addServices()`,
    `addIcons()`, and a default plugin whose `install(app, { routes })` pushes routes, registers
    services/icons, and sets `app.config.globalProperties.$configs[Entity.name] = config`.
12. **Register** — add the plugin to the `plugins` array in the `src/entities/index.ts` aggregator
    ([entities.setup.md → App shell](entities.setup.md#app-shell--components-infrastructure--styling)).

Keep every view thin: bind the refs the composables return.

> **Verify after wiring a slice:** the service resolves (`get<IEntityService>(Entity.name)` non-null after
> startup); the overview lists and pages (archived rows hidden unless `searchObject.isArchived` is set);
> save round-trips (new `$id === "new"` inserts, existing updates — bind to `saved`); routes resolve
> (`${key}Overview`, `${key}Details` → `${key}Form`/`${key}Fiche`). Then **drive each feature at runtime** — a
> green `npm run build` only proves it compiles. Against the live API, exercise every entity once, don't just
> load it: **open a navbar dropdown**, **save the same record twice** (a `Related()`/m2m re-sync is the classic
> 2nd-save 500), **toggle a status flag**, **apply a filter and reopen it** (multi-value restore), and **delete
> a referenced row** (FK-block feedback). Wiring/contract bugs surface only here — `vue-tsc` never exercises them.

---

## App startup (wiring order)

The plugin install order is fixed (verified identical across the reference apps). The full `main.ts` lives in
[entities.setup.md → Bootstrap](entities.setup.md#bootstrap--maints); the order is:

```
createPinia → appPlugin (vue/app) → servicesPlugin (vue/ioc; adds axios + PoolCache, creates $configs)
  → iconPlugin → screenPlugin → isOnlinePlugin → debugPlugin → loadingPlugin → feedbackPlugin
  → langPlugin → directives (focus/grow/clickOutside)
  → entityPlugins (collect routes) → routerFactory([...entityRoutes]) → preloaderPlugin → authPlugin
  → (app-local userPlugin) → mount → whenAppReady()
```

The entities-specific constraints to remember: the `$services` / `$configs` / `$icons` globals must
already exist (Pinia + `appPlugin` + `servicesPlugin` + `iconPlugin` installed) **before** any entity
plugin installs; the router must be built **after** the entity plugins have collected their routes; and
`authPlugin` installs **after** the router (it reads `$router` for its route guard).

## Route & key conventions

- Route names derive from **`config.key`**: `${key}Overview`, `${key}Details`, `${key}Fiche`, `${key}Form`.
- IoC service and `$configs` map are keyed by **`Entity.name`** (the class name). By convention
  `config.key === Entity.name`, but they are conceptually distinct.

---

## Feature recipes → entities.patterns.md

Load [entities.patterns.md](entities.patterns.md) when implementing one of these:

- **Soft delete / archived rows** — `isArchived` on the search object; `handleRestore` in the form.
- **State toggle (activate/deactivate)** — a dedicated endpoint + custom service method for a visible status flag.
- **Date hydration** — convert non-`created`/`lastModified` date fields in `toEntity`.
- **Transient client-only fields** — `_`-prefixed props (e.g. `_deleted`) stripped before save.
- **Paging** — `pagingInfo` + `itemsCount`; `pageSize: 0` returns all rows capped by the server's `MaxPageSize` (send a positive `pageSize` to page).
- **Union search** — `searchUnion` (OR across filters).
- **Custom endpoints on a service** — reach the raw `get<EntityService>(Entity.name)`, not the pooled store.
- **Entity selector (relation picker)** — the `selecting/` set for picking related entities in forms; to bind a **many-to-many join** to a multi-select, see [entities.patterns.md → Editing a many-to-many join](entities.patterns.md#editing-a-many-to-many-join-with-the-related-entitys-selector). A relation is entity-backed even when the set is small — use the `Selector`, never a checkbox list.
- **Overview list layout** — responsive columns so the list row never scrolls horizontally ([entities.patterns.md](entities.patterns.md#overview-list-layout-no-horizontal-scroll)).
- **Feedback for custom saves** — `useFeedback` + `<Feedback>` around any `service.save()`/`remove()` you call outside the standard composables ([entities.patterns.md](entities.patterns.md#feedback-for-custom-saves-outside-useform)).
- **Owned (child) collections** — `useOwnedCollection` / `useOwnedModal` / `useListInput` for master-detail.
- **Hierarchical (tree) entities** — `useTree` + `useDragDrop`.
- **Static / lookup data** — `JSONService`.
- **Pooling & the shared cache** — `createStore` / `PoolService` / `PoolCache`.
- **Navigation from the config map** — `importDashboard` / `importNavbar` / `buildNavigationTree`.
- **Custom query params (the `$` rule)** — `$`-prefixed keys are stripped before the request.
- **Type the client from the API's OpenAPI** — generate DTO types and feed them into the models.

---

## Quick reference

| I want to…                         | Use                                                        |
| ---------------------------------- | ---------------------------------------------------------- |
| Define a model                     | `extends EntityBase` (`$id`, `$title`)                     |
| Call the API                       | `extends EntityServiceBase<T>` → implement `toEntity`      |
| Static lookup list                 | `extends JSONService<T>`                                   |
| List + search + URL sync (counted) | `useSearchView` + `useRouteOverview`                       |
| Plain list (no count)              | `useListView`                                              |
| Load one item                      | `useDetails`                                               |
| Create/edit/delete form            | `useForm` (modal: `useModalForm`)                          |
| Filter UI                          | `useFilter`                                                |
| Reactive shared cache              | `createStore` (Pinia store)                                |
| Child collections                  | `useOwnedCollection` / `useOwnedModal` / `useListInput`    |
| Hierarchy                          | `useTree`                                                  |
| Navigation from configs            | `importDashboard` / `importNavbar` / `buildNavigationTree` |
| Lean overview/form (no scaffold)   | `EntityOverview` / `EntityForm`                            |

---

## Gotchas

| Symptom | Cause | Fix |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --- | ------ |
| `v-for` over `items` throws a null error on first render | Overview refs are **lazy** — `items` / `itemsCount` are `undefined` until `searchHandler`/`listHandler` runs (the type says `Array<T>`, but the initial value is `undefined`) | Guard every template use: `v-for="x in items ?? []"`, `:count="itemsCount ?? 0"`, `(items?.length ?? 0) === 0` |
| `Fiche`/`Form` receive `null` | `useDetails().item` is `null` until the `onMounted` load resolves | Gate the child: `<RouterView v-if="item" v-model="item" …>` |
| Save result binds to nothing / wrong shape | Binding to `item` instead of `saved` | `SaveResult` exposes `saved` (not `item`); `SaveResult` and the raw server `SavedResult` differ — bind to `saved` |
| New entity not treated as insert | `$id` returns a non-sentinel value for a fresh model | `save()` inserts when `$id` is `null`/`undefined`/`"new"`/`""` or `≤ 0` (`isNewEntity` — covers the negative temp ids of new related rows), so a bare `this.id` getter is fine (`this.id \|\| "new"` is the convention); new-entity routes use `:id = "new"` |
| Updates 404 while inserts pass | `saveUrl` set to a literal `/save` path | Leave `*Url` at `config.api` (a resource base); `update`/`remove` append `/{$id}` themselves |
| `update`/`remove` hit `/{id}/undefined` (400/404 that type-checks) | Spreading a model (`{ ...item }`) copies only own-enumerable props, dropping the `$id`/`$title` **prototype getters**; an `as Entity` cast hides it | Never spread a model — mutate the instance (`item.x = …; await service.update(item)`). `update`/`remove` throw a named error when `$id` is missing |
| Archived rows missing | `isArchived` defaults to `false` | Set `isArchived` on the search object to include them |
| Pager-less overview shows only 10 rows | `defaultPageSize` of `0`/unset falls back to 10 in the overview composables | Set `defaultPageSize` to a large number (up to the server's `MaxPageSize`); `pageSize: 0` at the service layer returns all rows capped by `MaxPageSize`, and larger sets use the `Autocomplete` selector |
| Nested collections empty on the overview (List/Search) | On complex entities the API loads navigations only when the request sends `?includes=` | Set `baseQueryParams: { includes: "All" }` (or the needed flags) in `config/config.ts` — List/Search send it on every request |
| Nested collection empty on a detail/edit form | `includes` may not apply to the Details GET | Ensure the API eager-loads it for Details, or fetch children with a dedicated call |
| Custom service method not found on the store `service` | The store's `service` is a **pooled** `PoolService` (only the `IEntityService` surface) | Resolve the raw service: `get<EntityService>(Entity.name)` (registered under `Entity.name`) |
| Overview total wrong / count missing | `useSearchView` bound to an endpoint that returns `{ items }` without `count` | Use `useListView` for a plain list, or read from the counted `/search` ([composables](#overview-uselistview-vs-usesearchview)) |
| Import not found / wrong path | Guessed an import specifier | Look it up in [entities.namespaces.md](entities.namespaces.md) — never guess |
| Wrong method name/params/return | Guessed a signature | Look it up in [entities.signatures.md](entities.signatures.md) |
| Overview list row scrolls horizontally on narrow screens | Several fixed-width `col-auto` columns (they don't shrink) stacked in the list row | Make columns responsive: flexible `col text-truncate`, drop secondary ones with `d-none d-md-block`/`d-lg-block`, keep few `col-auto`. See [entities.patterns.md → Overview list layout](entities.patterns.md#overview-list-layout-no-horizontal-scroll) |
| A checkbox/radio list used to pick related entities (m2m) | An entity relation modelled like a serviceless enum | Entity-backed relations (loaded from a service) use the entity `Selector` + join bridge — even a small closed set; checkboxes are only for a serviceless enum. See [entities.patterns.md → Editing a many-to-many join](entities.patterns.md#editing-a-many-to-many-join-with-the-related-entitys-selector) |
| A custom save/toggle/checkout shows no feedback | Only `useForm`/`useSearchView`/`useDetails` auto-drive feedback | Drive your own `useFeedback()` + `<Feedback>` around the direct `service.save()`/`remove()` call. See [entities.patterns.md → Feedback for custom saves](entities.patterns.md#feedback-for-custom-saves-outside-useform) |

> **Dormant code — do not use:**
>
> - `regira_modules/entities` (the `src/entities/*` folder) is fully commented-out; its `package.json`
>   `./entities` export resolves to an empty module. Use `regira_modules/vue/entities`.
> - `EntityDescriptor` (`/config`) is unused by the demos — the plain `IConfig` + IoC + `$configs`
>   wiring above is the supported path.
> - `src/identity/*` is a separate legacy stack, unrelated to `vue/auth`.

---

## See also

- [entities.setup.md](entities.setup.md) — new-project template + app shell · [entities.namespaces.md](entities.namespaces.md) — imports ·
  [entities.signatures.md](entities.signatures.md) — signatures
- [entities.template.md](entities.template.md) — blank slice scaffold · [entities.shell.template.md](entities.shell.template.md) — app-shell scaffold (`--shell`) ·
  [entities.examples.md](entities.examples.md) — simple (`UnitType`) + standard (`Product`) slices ·
  [entities.advanced.example.md](entities.advanced.example.md) — complex slice (`Vehicle`) ·
  [entities.patterns.md](entities.patterns.md) — feature recipes
- Developer docs: [../README.md](../README.md)
