# Views

Each view is a thin Vue component that delegates to a composable. Exact signatures:
[../ai/entities.signatures.md](../ai/entities.signatures.md). Full view code:
[../ai/entities.examples.md](../ai/entities.examples.md).

## Route structure

`setup.ts` builds two routes per entity:

- **Overview** — `/{routePrefix}`, name `${key}Overview`.
- **Details** — `/{routePrefix}/:id`, name `${key}Details`, with nested children **Fiche**
  (`DetailsSummary`, read-only) and **Form** (`${key}Form`, edit); it redirects to the Form by default.
  Creating uses `:id = "new"`.

## Overview — `useSearchView` + `useRouteOverview`

`useSearchView({ service, searchObject, defaultPageSize })` returns the list state and handlers:
`searchObject`, `pagingInfo`, `items`, `itemsCount`, `isLoading`, `feedback`, `searchHandler`,
`applySave`, `applyRemove`, `handleSave`, `handleRemove`. `useRouteOverview({ searchObject, pagingInfo,
handler, defaultPageSize })` keeps those in sync with the URL query and re-searches on navigation,
returning `updateOverviewRoute`. (`useOverviewCore` is the shared base.)

**`useSearchView` vs `useListView`** — match the back-end controller: use `useSearchView` for **complex**
controllers that expose `GET /search` → `{ items, count }`, and `useListView` for **simple/lookup**
controllers that only expose `GET /?q=` → `{ items }` (no counted search). See
[../ai/entities.instructions.md](../ai/entities.instructions.md#overview-uselistview-vs-usesearchview).

> **Guard the lazy refs.** `items` / `itemsCount` are `undefined` until the first fetch, so bind
> `v-for="x in items ?? []"` and `:count="itemsCount ?? 0"`. See the
> [overview gotcha](../ai/entities.instructions.md#gotchas).

## Details — `useDetails`

`useDetails(service)` loads the item for the route `:id` and returns `item`, `isLoading`, `overviewUrl`,
`load`, and `feedback`. The Details component renders a nested `<RouterView>` for the Fiche/Form child,
passing `item`. `item` is `null` until the `onMounted` load resolves — gate the child with
`<RouterView v-if="item" …>`.

## Form — `useForm` (and `useModalForm`)

`useForm({ entityService, props, emit })` returns `item` plus `handleSubmit`, `handleCancel`,
`handleRemove`, `handleRestore`, and `feedback`. Note the form's `handleRemove()` takes **no arguments**
(it removes the bound `item.value`) — unlike the overview's `handleRemove(item)`. Define props with `withDefaults(defineProps<FormProps &
…>(), { ...formDefaults })` and emits via `FormEmits<T>`; `FormStates` enumerates pending/saved/removed/
error. `useModalForm` (alias `useModal`) is the in-modal variant for editing without leaving the page.

For child/owned collections inside a form, use `useOwnedCollection`, `useOwnedModal`, `useListInput`, and
`useListItemInput` — see [../ai/entities.patterns.md](../ai/entities.patterns.md#owned-child-collections).

## Filter — `useFilter`

`useFilter({ searchObject, emit })` manages a search-object model (`defineModel<SearchObject>`) and
returns `handleUpdate`, `handleFilter`, `handleReset`, `handleToggle`, and `filterIsActive`. Emit
`filter` to trigger a search; the overview calls `updateOverviewRoute(true)` in response.

## Selector

`Selector.vue` (from the barrel's `components`) is a reusable entity picker for choosing related
entities in forms.

## Overview

1. [Abstractions](abstractions.md)
2. [Services](services.md)
3. [Config](config.md)
4. [Views](views.md)
5. [Built-in features](built-in-features.md)
6. [Attachments](attachments.md)
7. [Checklist](checklist.md)
