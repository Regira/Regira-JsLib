# Abstractions

The contracts and value objects every entity slice builds on. Exact signatures:
[../ai/entities.signatures.md](../ai/entities.signatures.md).

## Entity contract

```ts
interface IEntity {
    get $id(): number | string
    get $title(): string | undefined
}
abstract class EntityBase implements IEntity {
    /* abstract $id, $title */
}
```

Every model extends `EntityBase` and implements:

- **`$id`** — the primary key. Return the literal `"new"` (or `null`) for an unsaved instance; the
  service treats that as an insert. The common idiom is `return this.id || "new"`.
- **`$title`** — a human label used by selectors, breadcrumbs, and navigation.

`EntityBase` also exposes an `entityType` getter (`= this.constructor.name`) used internally as a cache key.

## Search objects

```ts
interface ISearchObject extends Record<string, any> {
    q?: string
}
abstract class SearchObjectBase implements ISearchObject {
    q?: string
}
class DefaultSearchObject extends SearchObjectBase {}
```

`q` is the free-text search term. Add your own filter fields by extending `SearchObjectBase`. Every
property becomes a query parameter (arrays → repeated keys); keys starting with `$` are stripped before
the request, so use them for client-only values.

## Paging & sorting

```ts
const DEFAULT_PAGESIZE = 10
interface IPagingInfo {
    pageSize?: number
    page?: number
}
class PagingInfo implements IPagingInfo {
    /* page = 1, pageSize = DEFAULT_PAGESIZE */
}
interface ISortByInfo {
    sortBy: string | Array<string>
}
class SortByInfo implements ISortByInfo {}
```

Paging is applied automatically by the service: `pageSize` defaults to `config.defaultPageSize`, and
`page` is omitted from the URL when ≤ 1. Pass `pageSize: 0` to fetch all rows (capped by the server's `MaxPageSize`).

## Result envelopes

The service returns these shapes (the client mirror of the API's wrapped responses):

```ts
type SearchResult<T> = { items: Array<T>; count: number; duration?: number }
type SaveResult<T> = { saved: T; isNew: boolean; affected?: number; duration?: number }
```

Plus `DetailsResult`, `ListResult`, `SavedResult`, `DeleteResult` — see signatures. **Bind save results
to `saved`** (not `item`); `SaveResult` and the raw server `SavedResult` differ.

## Config

`IConfig` is the per-entity configuration object — covered in [config.md](config.md).

## Overview

1. [Abstractions](abstractions.md)
2. [Services](services.md)
3. [Config](config.md)
4. [Views](views.md)
5. [Built-in features](built-in-features.md)
6. [Attachments](attachments.md)
7. [Checklist](checklist.md)
