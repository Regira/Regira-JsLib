# Services

A service is the HTTP layer for one entity.

## `IEntityService<T>`

The contract every view programs against:

```ts
details(id): Promise<T | undefined>
list(so?): Promise<Array<T>>
search(so?): Promise<SearchResult<T>>
searchUnion(searchObjects, extra?): Promise<SearchResult<T>>
save(item): Promise<SaveResult<T>>
remove(item): Promise<void>
toEntity(item): T
newEntity(values?): Promise<T>
```

## `EntityServiceBase<T>`

The Axios-backed implementation. Subclass it and implement **only** `toEntity`:

```ts
export class EntityService extends EntityServiceBase<Product> {
    constructor(axios: AxiosInstance, config: IConfig) {
        super(axios, config)
    }
    override toEntity(item: object): Product {
        return item instanceof Product ? item : Object.assign(this.createInstance(Product), item || {})
    }
}
```

The constructor takes the shared `axios` instance and the entity's `IConfig`; both are supplied by the
IoC registration in `setup.ts`. Useful protected members:

- **`toEntity(item)`** _(abstract)_ — converts a plain server object into a model instance.
- **`prepareItem(item)`** — runs before save; strips **top-level** properties whose key starts with `_`
  (transient client state). The strip does not recurse, so a `_deleted` child row is still sent — override
  and filter such rows out per collection to drop soft-deleted children.
- **`processItem(item)`** — runs after fetch/save; hydrates `created` / `lastModified` strings to `Date`.
- **`createInstance(Type)`** — `new`s a model without arguments (used inside `toEntity`).
- **`newEntity(values?)`** — builds a blank/seeded instance for create forms.

Add bespoke endpoints by calling `this.axios` against `this.config.api`.

## `JSONService<T>`

For small static/lookup lists. Same constructor plus a cache key; it fetches the list once and then
serves all reads/filters/paging from an in-memory cache (shared per key). Choose it for stable
reference data, not frequently changing entities.

## HTTP contract

`EntityServiceBase` builds requests from `IConfig` and expects item-wrapped envelopes — the shape the
back-end `Regira.Entities.Web` endpoints return (the **HTTP body** column below), then unwraps them for
you, so the method return types are _not_ these envelopes (see the note under the table):

| Method             | HTTP   | URL                                           | HTTP body          |
| ------------------ | ------ | --------------------------------------------- | ------------------ |
| `details(id)`      | GET    | `{detailsUrl}/{id}`                           | `{ item }`         |
| `list(so)`         | GET    | `{listUrl}?{query}`                           | `{ items }`        |
| `search(so)`       | GET    | `{searchUrl}?{query}`                         | `{ items, count }` |
| `searchUnion(sos)` | POST   | `{searchUrl}?{query}` (body = search objects) | `{ items, count }` |
| `insert(item)`     | POST   | `{saveUrl}`                                   | `{ item }`         |
| `update(item)`     | PUT    | `{saveUrl}/{$id}`                             | `{ item }`         |
| `remove(item)`     | DELETE | `{deleteUrl}/{$id}`                           | —                  |

> **The methods return _unwrapped_ values, not these envelopes.** `list()` resolves to `Array<T>` (not
> `{ items }`), `details()` to `T | undefined`, `search()`/`searchUnion()` to `SearchResult<T>` (`{ items, count }`),
> `save()`/`insert()`/`update()` to `SaveResult<T>`/`T | undefined`. Destructure accordingly —
> `const items = await service.list()`, never `const { items } = await service.list()`.

`save(item)` inserts when `$id` is an unsaved sentinel — `null`/`undefined`/`"new"`/`""` or a non-positive
number (`0`, or a negative temp id) via the exported `isNewEntity($id)` predicate — otherwise updates, and
returns `{ saved, isNew }`.

### Automatic query parameters

For `list`/`search`, the service merges `config.baseQueryParams` with the search object, then defaults
`pageSize` to `config.defaultPageSize`, defaults `isArchived` to `false` (hiding archived rows), omits
`page` when ≤ 1, strips `$`-prefixed keys, and serializes arrays as repeated keys.

## Resolution & pooling

Services are registered in IoC (`add(Entity.name, sp => new EntityService(sp.get("axios"), config))`)
and resolved with `get<IEntityService<T>>(Entity.name)`. The Pinia store then wraps the resolved
service in a pooled one via `createStore` — views use that pooled service. See
[built-in-features.md](built-in-features.md#pooling).

## Overview

1. [Abstractions](abstractions.md)
2. [Services](services.md)
3. [Config](config.md)
4. [Views](views.md)
5. [Built-in features](built-in-features.md)
6. [Attachments](attachments.md)
7. [Checklist](checklist.md)
