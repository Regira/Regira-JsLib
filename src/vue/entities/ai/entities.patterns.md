# Regira JsLib Entities — Feature Patterns

Recipes for individual features. Each is one focused snippet + notes. Verify signatures in
[entities.signatures.md](entities.signatures.md); see a full slice in [entities.examples.md](entities.examples.md).

## Soft delete / archived rows

`list`/`search` send `isArchived=false` by default, so archived rows are hidden. To include them, set
it on the search object:

```ts
class EntitySearchObject extends SearchObjectBase { isArchived?: boolean }
// ... searchObject.isArchived = true   // include archived; leave undefined to hide
```

In a form, `useForm` exposes `handleRestore` alongside `handleRemove` for un-archiving.

## Date hydration

`EntityServiceBase.processItem` converts the server strings **`created`** and **`lastModified`** to
`Date` automatically. Type them as `Date` on the model; do not parse them yourself. Any other date
field arrives as a string — convert it in `toEntity`:

```ts
override toEntity(item: object): Entity {
    const e = item instanceof Entity ? item : Object.assign(this.createInstance(Entity as new () => Entity), item || {})
    if (typeof (e as any).publishedOn === "string") e.publishedOn = new Date((e as any).publishedOn)
    return e
}
```

## Transient client-only fields

`prepareItem` strips every property whose key starts with **`_`** before sending to the server. Use
this for UI-only state — most importantly **`_deleted`** to mark a child row for removal without
sending it:

```ts
class OrderLine extends EntityBase { id = 0; _deleted = false; /* … */ }
```

`useListItemInput` / `useOwnedCollection` already drive `_deleted` for owned rows.

## Paging

Paging is automatic: `pageSize` defaults to `config.defaultPageSize` (`DEFAULT_PAGESIZE` = 10) and
`page` is omitted from the URL when ≤ 1. Pass `pageSize: 0` to request **all** rows. The overview
composables expose `pagingInfo` (a `Ref<IPagingInfo>`) and `itemsCount`; bind a `Paging` control to
them and call the route handler on change:

```ts
const { pagingInfo, itemsCount, searchHandler } = useSearchView({ service, searchObject, defaultPageSize: config.defaultPageSize })
const { updateOverviewRoute } = useRouteOverview({ searchObject, pagingInfo, handler: searchHandler, defaultPageSize: config.defaultPageSize })
// Paging @change → updateOverviewRoute()
```

## Union search (OR across filters)

`searchUnion` POSTs an **array** of search objects and returns the union as one `{ items, count }`:

```ts
const { items, count } = await service.searchUnion(
    [{ q: "blue" }, { q: "red" }],
    { sortBy: "title" }   // optional IPagingInfo | ISortByInfo
)
```

## Custom endpoints on a service

Add methods that reuse the injected axios and `config.api`:

```ts
export class EntityService extends EntityServiceBase<Entity> {
    override toEntity(item: object): Entity { /* … */ }

    async getFamily(ids: Array<number>): Promise<Array<Entity>> {
        const { data } = await this.axios.get(`${this.config.api}/family`, { params: { ids } })
        return data.items.map((x: object) => this.toEntity(x))
    }
}
```

## Owned (child) collections

For master-detail forms, drive a child collection with `useOwnedCollection` (inline rows) or
`useOwnedModal` (edit each child in a modal). Children must be `IEntity & { id: number }`:

```ts
const { items, newItem, handleSort, handleSave } = useOwnedCollection<OrderLine>({ props, emit })
// items is a writable computed bound to the parent's collection; mark removed rows with _deleted
```

`useListInput` / `useListItemInput` are the lower-level building blocks for editable lists.

## Hierarchical (tree) entities

```ts
const { tree, nodes, ancestors, offspring, family, init } = useTree<Entity>()
init(values, data, findParents)   // build the TreeList from flat data
```

Pair with `useDragDrop` for move/reparent, and `buildNavigationTree` for nav menus.

## Static / lookup data — `JSONService`

For small reference lists, extend `JSONService<T>` instead of `EntityServiceBase<T>`. It fetches the
list **once** and serves all reads/filters/paging from a shared in-memory cache (keyed by the third
ctor arg):

```ts
export class CountryService extends JSONService<Country> {
    constructor(axios: AxiosInstance, config: IConfig) { super(axios, config, Country.name) }
    override toEntity(item: object): Country { return Object.assign(this.createInstance(Country), item) }
}
```

> The cache is process-wide and keyed by the third arg — give each JSON service a unique key, and note
> it does not auto-refresh (mutations update the cache in memory). Use it for stable lookups, not
> frequently changing data.

## Pooling & the shared cache

`createStore(service, Entity.name)` wraps a service in a `PoolService` so all views share one reactive
cache of entities (`Ref<T>`), deduplicated by id. Views should always use the **store's** `service`,
not the raw IoC service. Register `defaultPoolCache` once at startup
(`sp.add(PoolCache.name, () => defaultPoolCache)`); mark types that should never expire via
`cache.persistentTypes`.

## Navigation from the config map

Each `setup.ts` stores its `IConfig` in `app.config.globalProperties.$configs[Entity.name]`. Build menus
from that map:

```ts
const configs = Object.values(app.config.globalProperties.$configs) as Array<IConfig>
const dashboard = importDashboard({ /* groups, entities, configs, hasAccess */ })
const navbar = importNavbar({ /* … */ })
const tree = buildNavigationTree([...dashboard, ...navbar])
```

## Custom query params (and the `$` rule)

Anything you put on the search object is sent as a query param (arrays → repeated keys). Keys starting
with **`$`** are stripped by `cleanQueryParams` — use the `$` prefix for client-only/meta values you do
*not* want on the wire.

## See also

- [entities.examples.md](entities.examples.md) · [entities.signatures.md](entities.signatures.md) ·
  [entities.instructions.md](entities.instructions.md)
