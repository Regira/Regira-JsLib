# Regira JsLib Entities — Feature Patterns

Recipes for individual features. Each is one focused snippet + notes. Verify signatures in
[entities.signatures.md](entities.signatures.md); see a full slice in [entities.examples.md](entities.examples.md).

## Soft delete / archived rows

`list`/`search` send `isArchived=false` by default, so archived rows are hidden. To include them, set
it on the search object:

```ts
class EntitySearchObject extends SearchObjectBase {
    isArchived?: boolean
}
// ... searchObject.isArchived = true   // include archived; leave undefined to hide
```

In a form, `useForm` exposes `handleRestore` alongside `handleRemove` for un-archiving.

## State toggle (activate / deactivate)

A visible status flag like `isActive` differs from archiving: the row stays in lists, just marked. Give it
its own search-object field for filtering, and flip it through a **dedicated endpoint** so the update
touches that one field server-side and leaves the entity's other fields intact. The method reuses the
injected `axios` + `config.api`, like any [custom endpoint](#custom-endpoints-on-a-service):

```ts
export class EntityService extends EntityServiceBase<Entity> {
    override toEntity(item: object): Entity {
        /* … */
    }

    async setActive(id: number, isActive: boolean): Promise<void> {
        await this.axios.post(`${this.config.api}/${id}/${isActive ? "activate" : "deactivate"}`)
    }
}
```

Call it through the **raw** IoC service (the pooled store exposes only the `IEntityService` surface), then
reload the row:

```ts
const svc = get<EntityService>(Entity.name)!
await svc.setActive(item.id, !item.isActive)
```

This is a custom save, so wrap it in feedback (`pending` → `success`/`fail`) like any call outside `useForm` —
see [Feedback for custom saves](#feedback-for-custom-saves-outside-useform).

`isArchived` / `handleRestore` ([Soft delete](#soft-delete--archived-rows)) stay reserved for true removal.

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
class OrderLine extends EntityBase {
    id = 0
    _deleted = false /* … */
}
```

`useListItemInput` / `useOwnedCollection` already drive `_deleted` for owned rows.

**Show the pending state.** A `_deleted` row stays in the list until save, so render it visibly tinted /
struck-through — otherwise the delete looks like a no-op and invites splicing the row out (which skips the
server-side delete). Toggle the flag so it doubles as undo:

```vue
<tr :class="{ 'table-danger text-decoration-line-through': row._deleted }">
    <!-- … --><IconButton icon="delete" @click="row._deleted = !row._deleted" />
</tr>
```

## Paging

Paging is automatic: `pageSize` defaults to `config.defaultPageSize` (`DEFAULT_PAGESIZE` = 10) and
`page` is omitted from the URL when ≤ 1. `pageSize: 0` returns **all rows, capped by the server's
`MaxPageSize`** (100 under `UseDefaults()`); for a pager-less "show all" set `defaultPageSize` to a large
number up to that cap, and for datasets larger than `MaxPageSize` use the `Autocomplete` selector
(server-side search) instead of a truncated page. The overview composables expose `pagingInfo` (a
`Ref<IPagingInfo>`) and `itemsCount`; bind a `Paging` control to them and call the route handler on change:

```ts
const { pagingInfo, itemsCount, searchHandler } = useSearchView({ service, searchObject, defaultPageSize: config.defaultPageSize })
const { updateOverviewRoute } = useRouteOverview({ searchObject, pagingInfo, handler: searchHandler, defaultPageSize: config.defaultPageSize })
// Paging @change → updateOverviewRoute()
```

## Overview list layout (no horizontal scroll)

`overview/List.vue` (headers) and `overview/ListItem.vue` (rows) render one Bootstrap `.row` per line. A
fixed-width `col-auto` column does **not** shrink, so stacking several of them (plus a few flexible `col`s)
pushes the row past narrow viewports and the whole page scrolls sideways. Keep it responsive so the row always
fits:

- **Flex + clip text columns** — `class="col text-truncate"`, not a fixed width.
- **Drop secondary columns on smaller breakpoints** — `d-none d-md-block` / `d-none d-lg-block`, so mobile
  shows only the 1–2 essential columns.
- **Reserve `col-auto` (with a `width`) for genuinely fixed cells** — an icon/edit button, a short status —
  and keep them few.
- **Headers and cells must use the same breakpoint classes**, or columns stop lining up.

```vue
<!-- List.vue header cell + ListItem.vue body cell — identical column classes, mirrored 1:1. A foreign
     relation's label goes through the sibling store's fromPool (const { fromPool: getBrand } =
     useBrandStore()) so it stays reactive to edits — see "Resolving relations with fromPool" below. -->
<div class="col text-truncate">{{ item.$title }}</div>
<div class="col d-none d-md-block text-truncate">{{ getBrand(item.brand)?.$title }}</div>
<div class="col d-none d-lg-block text-truncate">{{ item.model }}</div>
<div class="col-auto" style="width: 8rem">{{ item.status }}</div>
```

The `Vehicle` slice in [entities.advanced.example.md](entities.advanced.example.md) §9–10 is the worked
example (a multi-column list that stays inside the viewport).

## Union search (OR across filters)

`searchUnion` POSTs an **array** of search objects and returns the union as one `{ items, count }`:

```ts
const { items, count } = await service.searchUnion(
    [{ q: "blue" }, { q: "red" }],
    { sortBy: "title" } // optional IPagingInfo | ISortByInfo
)
```

## Custom endpoints on a service

Add methods that reuse the injected axios and `config.api`:

```ts
export class EntityService extends EntityServiceBase<Entity> {
    override toEntity(item: object): Entity {
        /* … */
    }

    async getFamily(ids: Array<number>): Promise<Array<Entity>> {
        const { data } = await this.axios.get(`${this.config.api}/family`, { params: { ids } })
        return data.items.map((x: object) => this.toEntity(x))
    }
}
```

**Calling a custom method from a view.** The store's `service` is a **pooled** `PoolService` exposing
only the `IEntityService` surface — your custom method is _not_ on it. Resolve the raw service from IoC
(it is registered under `Entity.name`):

```ts
import { get } from "regira_modules/vue/ioc"

const svc = get<EntityService>(Entity.name)!
const family = await svc.getFamily([1, 2, 3])
```

Use the pooled store `service` for ordinary CRUD (so views share the reactive cache); reach for the raw
`get<EntityService>(Entity.name)` only to call bespoke endpoints like this.

## Feedback for custom saves (outside useForm)

`useForm` / `useSearchView` / `useDetails` each drive a `FeedbackOut` (pending → success/fail), but a view
shows it only where it **renders** `<Feedback :feedback="feedback" />` — the scaffolded `Form.vue` / `Details.vue`
do (a form that renders none saves silently). `FormButtonsRow` takes the same `feedback` only to disable its
Save/Delete/Restore buttons while an operation is in flight. The global `$feedback` (`feedbackPlugin`, shown once in `App.vue`) is a **separate**
instance for app-level notices — route cross-cutting messages there via `inject("feedback")`, not the form's.

Anything you save **yourself** — an inline row toggle, a quantity edit, a custom action button, a storefront
checkout that calls `service.save()` / `remove()` directly — gets none of the composable's feedback. Give it its
own so the user sees the result; a bare `await service.save()` reads as a no-op (and swallows the error path):

```ts
import { useFeedback } from "regira_modules/vue/ui" // useFeedback, Feedback, FeedbackStatus all live here
const feedback = useFeedback()

async function toggleActive(row: Row) {
    feedback.pending("Saving…")
    try {
        row.isActive = !row.isActive
        await service.save(row)
        feedback.success("Saved")
    } catch (ex: any) {
        feedback.fail("Save failed", ex.response?.data?.errors ?? ex.response?.data?.message ?? ex.message)
    }
}
```

Render it with `<Feedback :feedback="feedback" />` (styling + the 400 field-map in
[Form validation & error handling](#form-validation--error-handling)), or reuse the surrounding form's
`feedback` (`useForm` returns it) instead of minting a second one.

## Entity selector (relation picker) — `selecting/`

**Which one:** single FK on a form → `InputSelector`; free-text filter field → `Autocomplete`; multi-value / M2M (entity-backed) → `Selector` (bind an array); multi-value over a **fixed option set (enum, no service)** → a checkbox group rather than a native `<select multiple>` ([below](#multi-value-over-a-fixed-option-set-enum)).

> **Entity-backed = has a service/store — even a short, fully-loaded set** (a dozen intervention types, an
> article's categories). Prefer the `Selector` here: it searches server-side and shares the pooled cache, so it
> scales past one page where a checkbox/radio group loaded from `service.list()` / `service.search()` won't. A
> checkbox group is the natural fit for a **serviceless** union/enum (no id, no service) — see
> [Multi-value over a fixed option set (enum)](#multi-value-over-a-fixed-option-set-enum).

Each entity ships a thin **`selecting/Selector.vue`** so other entities' forms can pick it (e.g. choosing
an Article's categories, or a list's shopper). It `v-model`s the related entity and resolves it through
the **pooled** store, so the picked value shares the reactive cache:

```vue
<!-- src/entities/categories/selecting/Selector.vue -->
<script setup lang="ts">
import { computed } from "vue"
import type Category from "../data/Entity"
import useEntityStore from "../data/store"

const model = defineModel<Category | undefined>()
const { service, fromPool } = useEntityStore() // pooled service + shared cache
const selected = computed<Category | undefined>({
    get: () => fromPool(model.value) as Category | undefined,
    set: (v) => (model.value = v),
})
// back the picker UI with `service.search({ q })`; render the barrel's <Selector> (entity picker)
// or your own autocomplete that emits the chosen Category into `selected`.
</script>

<template>
    <!-- e.g. an autocomplete bound to `selected`, options from service.search({ q }) -->
    …
</template>
```

Re-export it from the slice `index.ts` (`export { default as Selector } from "./selecting/Selector.vue"`)
so forms do `import { Selector as CategorySelector } from "@/entities/categories"`. For a multi-select
(an Article's many categories) bind an **array** of related entities and add/remove picks; the shipped
`Selector` rebuilds that array, and the server's `e.Related(...)` re-syncs the join from its contents.

> **The picker only emits — you add.** `@select` (and the `v-model` set) fire with the chosen row; the bound
> array does not change until _you_ push into it. A selector that "adds nothing on pick" is a missing handler,
> not a broken component:
>
> ```ts
> function handleSelect(picked: Category) {
>     if (!items.value.some((c) => c.$id === picked.$id)) items.value.push(picked)
> }
> const handleRemove = (row: Category) => (items.value = items.value.filter((c) => c.$id !== row.$id))
> ```
>
> Rebuilding the array is right for a **plain entity/id set**. When you instead **render join/owned rows** (a join
> entity carrying extra fields, or an inline child editor) and want a visible pending-delete with undo, keep the
> row and toggle `_deleted` — [Transient client-only fields](#transient-client-only-fields) /
> [Owned collections](#owned-child-collections) — filtered out in `EntityService.prepareItem`.

Type optional relations `Category | undefined`, not `| null` — selector/autocomplete `v-model`s are
`T | undefined` (JSON `null` still deserializes fine).

### Editing a many-to-many join with the related entity's selector

The entity carries **join rows** (`{ categoryId, category? }`), but a multi-select binds related
entities (`Category[]`). Bridge them locally in the form: seed a picked-entities array from the join
rows, and rebuild the rows when the selection changes:

```ts
// Form.vue — item.articleCategories: Array<{ categoryId: number; category?: Category }>
const selectedCategories = ref<Category[]>([])
watch(
    item,
    (v) => {
        selectedCategories.value = v?.articleCategories?.map((j) => j.category ?? Object.assign(new Category(), { id: j.categoryId })) ?? []
    },
    { immediate: true }
)
watch(selectedCategories, (cats) => {
    item.value.articleCategories = cats.map((c) => item.value.articleCategories?.find((j) => j.categoryId === c.id) ?? { categoryId: c.id as number })
})
```

Bind `selectedCategories` to the related entity's multi-select; the join collection follows. Existing
join rows are reused (so their ids survive), removed picks drop their row, and the server-side
`e.Related(...)` applies the add/remove on save.

> **Key on the plain `id`, never `$id`.** A nested `category` from an included relation is un-hydrated JSON —
> its `$id`/`$title` getters are `undefined`. Reading `$id` here writes `categoryId: undefined`, which the
> server rejects on the **second** save (`Related()` re-syncs the join rows). The `.id` field is always present.

### Multi-value over a fixed option set (enum)

A `Status`-style field has no entity/service behind it, so the entity `Selector` doesn't apply — and a native
`<select multiple>` is the wrong reach. Model the values as an erasableSyntaxOnly-safe union and bind a
checkbox group to an array (Regira APIs accept enum members **by name**):

```vue
<script setup lang="ts">
type Status = "Planned" | "Scheduled" | "InProgress" | "Completed"
const STATUSES: Status[] = ["Planned", "Scheduled", "InProgress", "Completed"]
const model = defineModel<Status[]>({ default: () => [] })
const toggle = (s: Status) => (model.value = model.value.includes(s) ? model.value.filter((x) => x !== s) : [...model.value, s])
</script>

<template>
    <div v-for="s in STATUSES" :key="s" class="form-check">
        <input class="form-check-input" type="checkbox" :id="s" :checked="model.includes(s)" @change="toggle(s)" />
        <label class="form-check-label" :for="s">{{ s }}</label>
    </div>
</template>
```

For a chip UI instead of checkboxes, feed the same static array to an `Autocomplete` (options from the array,
not `service.search`) and bind the picked list — same model, richer control.

## Owned (child) collections

For master-detail forms, drive a child collection with `useOwnedCollection` (inline rows) or
`useOwnedModal` (edit each child in a modal). Children must be `IEntity & { id: number }`:

```ts
const { items, newItem, handleSort, handleSave } = useOwnedCollection<OrderLine>({ props, emit })
// items is a writable computed bound to the parent's collection; mark removed rows with _deleted
```

`useListInput` / `useListItemInput` are the lower-level building blocks for editable lists.

**Owned vs first-class child — and the "add before the parent is saved" consequence.** An **owned** collection
(`useOwnedCollection`, embedded in the parent DTO, persisted via `e.Related(...)` on save) can be edited on a
brand-new parent: its rows mint negative temp ids and insert together with the parent, so a form adds children
before the first save. A child promoted to a **first-class entity** (its own service/store/routes — e.g. to
toggle one row with a single `PATCH`) instead needs the parent's real id for its FK, so its editor only works
after the parent exists. Pick owned for "edit the whole graph in one form" (no save-first gate); pick
first-class for "operate on one row independently" (accept the save-first step, or persist the parent silently
on open).

## Form validation & error handling

`useForm` returns the `feedback: FeedbackOut` it drives (`status`/`message`/`error` refs +
`pending`/`success`/`fail`/`reset`). `handleSubmit` already calls `pending("Saving…")` → `success("Saved")`,
or on failure `fail(...)` **and re-throws** — so wrap the call. The failure mapping is fixed:

| HTTP status | `feedback.message` | `feedback.error`                                                 |
| ----------- | ------------------ | ---------------------------------------------------------------- |
| `400`       | `"Saving failed"`  | the server's **`response.data.errors`** `{ field: message }` map |
| `404`       | `"Item not found"` | a string (`response.data.message` ‖ `error.message`)             |
| other       | `"Server error"`   | a string                                                         |

So only a `400` puts a per-field map on `feedback.error`. Combine **client-side** guards (validate before
saving) with that **server-side** map; render the summary with `<Feedback>` and the field map per input:

```vue
<!-- details/Form.vue -->
<script setup lang="ts">
import { ref } from "vue"
import { useForm, formDefaults, type FormEmits } from "regira_modules/vue/entities"
import { Feedback, FeedbackStatus } from "regira_modules/vue/ui"
import type Article from "../data/Entity"
import useEntityStore from "../data/store"

interface Emits extends /* @vue-ignore */ FormEmits<Article> {}
const emit = defineEmits<Emits>()
const props = withDefaults(defineProps<{ modelValue: Article; readonly?: boolean }>(), { ...formDefaults })

const { service: entityService } = useEntityStore()
const { item, feedback, handleSubmit } = useForm<Article>({ entityService, props, emit })

// client-side: validate before hitting the server
const errors = ref<Record<string, string>>({})
function validate(): boolean {
    errors.value = {}
    if (!item.value.title?.trim()) errors.value.title = "Title is required"
    if (item.value.price < 0) errors.value.price = "Price cannot be negative"
    return Object.keys(errors.value).length === 0
}
async function submit() {
    if (!validate()) {
        feedback.fail("Please fix the highlighted fields", errors.value)
        return
    }
    try {
        await handleSubmit()
    } catch {
        /* feedback already set by useForm; swallow the re-throw */
    }
}

// client errors first, then the server's 400 field map (a Record) on feedback.error
const fieldError = (name: string) => errors.value[name] ?? (typeof feedback.error.value === "object" ? feedback.error.value?.[name] : undefined)
</script>

<template>
    <form @submit.prevent="submit" novalidate>
        <Feedback :feedback="feedback" />
        <div class="mb-2">
            <label class="form-label">Title</label>
            <input v-model="item.title" class="form-control" :class="{ 'is-invalid': fieldError('title') }" />
            <div class="invalid-feedback">{{ fieldError("title") }}</div>
        </div>
        <div class="mb-2">
            <label class="form-label">Price</label>
            <input v-model.number="item.price" type="number" step="0.01" class="form-control" :class="{ 'is-invalid': fieldError('price') }" />
            <div class="invalid-feedback">{{ fieldError("price") }}</div>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="feedback.status.value === FeedbackStatus.pending">Save</button>
    </form>
</template>
```

> For the per-field map to populate, the API must answer a `400` with body `{ errors: { Field: "message" } }`
> — Regira's `EntityControllerBase` produces exactly that from an `EntityInputException`'s `InputErrors`. On
> `404`/`500`, `feedback.error` is a plain string, so lean on the `<Feedback>` summary (`feedback.message`)
> instead. `FeedbackStatus` (`"" | "Pending" | "Success" | "Failed"`) comes from `regira_modules/vue/ui`;
> gating the button on `FeedbackStatus.pending` prevents double-submits.

## Tabbed forms

Split a heavy form into tabs with `TabContainer` (global from `vue/ui`); the scaffolded `Form.vue` already
exposes `initialTab` / `isPopup` for it. Pass `Tab.create(key, { icon, title, isDefault?, isDisabled? })` entries
and one `<template #key>` per tab; `:use-route-nav="!isPopup"` mirrors the active tab in the URL hash
(deep-linkable, back-button aware), and returning `null` from the list drops a tab responsively:

```vue
<TabContainer :tabs="tabs" :active="initialTab" :use-route-nav="!isPopup">
    <template #form><FormSection>…</FormSection></template>
    <template #lines><LineOverview v-model="item" /></template>
    <template #files><AttachmentOverview v-model="item" /></template>
</TabContainer>
```

```ts
const { translate } = useLang()
const { screen } = useScreen()
const tabs = computed(() =>
    [
        Tab.create("form", { icon: "form", title: translate("form"), isDefault: true }),
        Tab.create("lines", { icon: "list", title: translate("lines"), isDisabled: !item.value.id }), // gate until saved
        !screen.isLarge ? Tab.create("files", { icon: "attachment", title: translate("files") }) : null,
    ].filter((t) => t)
)
```

Worked example: the `Vehicle` slice in [entities.advanced.example.md](entities.advanced.example.md) §5.

## Hierarchical (tree) entities

`useTree` builds a client-side `TreeList` from a **flat** array. `init(values, data, findParents)`:
`data` = all rows, `values` = the subset to highlight, and `findParents` (`IFindParents<T>` from
`regira_modules/treelist`) returns each row's parent reference(s):

```ts
const { tree, nodes, ancestors, offspring, family, init } = useTree<Category>()
init(allCategories, allCategories, findParents) // findParents: IFindParents<Category> — see treelist guide
// render `nodes`: each TreeNode<T> exposes .value, .parent, .getOffspring(), .getAncestors()
```

Pair with `useDragDrop` for move/reparent and `buildNavigationTree` for nav menus; see the
[treelist module](../../../treelist/ai/treelist.instructions.md) for `TreeList` / `IFindParents`.

> **If the API already returns the hierarchy** (parent/children via `includes`, or a `parentId` on each
> row), you usually don't need `useTree` — render the nested `children` (or group by `parentId`) directly
> from the fetched data. Reach for `useTree` only when you have a flat list and must derive the tree client-side.

## Static / lookup data — `JSONService`

For small reference lists, extend `JSONService<T>` instead of `EntityServiceBase<T>`. It fetches the
list **once** and serves all reads/filters/paging from a shared in-memory cache (keyed by the third
ctor arg):

```ts
export class CountryService extends JSONService<Country> {
    constructor(axios: AxiosInstance, config: IConfig) {
        super(axios, config, Country.name)
    }
    override toEntity(item: object): Country {
        return Object.assign(this.createInstance(Country), item)
    }
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

The payoff is **live shared state**, not just fewer fetches: every consumer holds the _same_ `Ref<T>`, and a
save through the pooled `service` writes the result back into that ref in place (`cache.set`). So editing an
entity anywhere — a `FormModalButton` bound to the store's `service`, a details form, a bulk action —
re-renders every overview row, detail pane, and relation label that pooled it, with no manual refetch or
event wiring.

### Resolving relations with `fromPool`

`fromPool(input)` is the store accessor views use to turn an entity — or a **nested included relation** —
into its pooled counterpart. Pass a single object or an array; each input runs through `toEntity` and comes
back as the **canonical cached instance** for that `$id` (cached on first sight). It therefore does two jobs
at once:

1. **Rehydrates** a plain relation DTO into a real model instance, so the `EntityBase` getters (`$id`,
   `$title`, …) work — a nested relation arrives as plain JSON and lacks them otherwise.
2. **Deduplicates** to the one shared `Ref<T>`, so an edit to that entity anywhere reflects here.

Unsaved inputs pass straight through, unpooled (the `isNewEntity($id)` guard — `null`/`undefined`/`"new"`/
`""`/≤ 0). It needs an **object carrying `id`**, not a bare foreign-key number: `fromPool(item.unitType)`,
never `fromPool(item.unitTypeId)`. The canonical shape for a view's own rows is
`computed(() => fromPool(props.modelValue))`.

To render a **foreign relation's** label, alias a sibling entity's store `fromPool` and read the getter off
the result:

```ts
const { fromPool: getUnitType } = useUnitTypeStore()
// template: {{ getUnitType(item.unitType)?.$title }}
```

This is the supported way to show a related entity's `$title`, and it supersedes binding the raw DTO field
(`item.unitType?.title`): the returned instance is the shared, reactive one. The label resolves in full only
when that entity is already pooled — loaded by its own overview, or warmed by a preloader (`usePreloader`) —
**or** the nested DTO carries the display fields; otherwise the getter is `undefined`.

`fromCache(id?)` is the read-only counterpart: with an id it returns the cached `Ref<T>` (or `null`); with no
argument, every cached `Ref<T>` of the type (`Array<Ref<T>>`). It never fetches — it reports only what
pooling has already seen.

## Auth reload hooks (login-driven refresh)

In an auth-enabled app, data requested before the user logs in fails or comes back empty, so the
scaffolded `overview/Overview.vue` and `details/Details.vue` re-run their load on login. Slices
scaffolded with `--no-auth` have these hooks stripped — and because `load` is destructured from
`useDetails` **only** to feed the Details hook, `--no-auth` also drops `load` from that destructure
(Overview's `searchHandler` stays: `useRouteOverview` uses it regardless). Re-add both the hook and its
binding when the app enables the auth plugin later:

```ts
// overview/Overview.vue — re-search on login / token refresh.
// `searchHandler` is already in the useSearchView destructure (useRouteOverview needs it) — nothing to re-add there.
import { useAuthStore } from "regira_modules/vue/auth"

const authStore = useAuthStore()
authStore.$onAction(({ name, after }) => ["login", "refresh"].includes(name) && after(() => authStore.isAuthenticated && searchHandler(false)))
```

```ts
// details/Details.vue — load on login, only when nothing was loaded yet.
// Add `load` back to the existing useDetails destructure: const { item, …, load, feedback } = useDetails(service)
import { useAuthStore } from "regira_modules/vue/auth"

const authStore = useAuthStore()
authStore.$onAction(({ name, after }) => name == "login" && after(() => item.value == null && authStore.isAuthenticated && load()))
```

The same primitive drives any other login-sensitive work — see
[auth.examples.md → Re-run work on login / refresh](../../auth/ai/auth.examples.md).

## Navigation from the config map

Each `setup.ts` stores its `IConfig` in `app.config.globalProperties.$configs[Entity.name]`. Build menus
from that map:

```ts
const configs = Object.values(app.config.globalProperties.$configs) as Array<IConfig>

// importDashboard: groups + entities grouped under a group id ([groupId, entityKeys])
const dashboard = importDashboard({
    groups: [{ id: "Catalog", title: "catalog", icon: "catalog" }],
    entities: [["Catalog", ["Article", "Category"]]], // Array<[groupId, Array<entityKey>]>
    configs,
    hasAccess: () => true, // (config: IConfig) => boolean
})
// importNavbar: each entry is an entityKey, or [groupId, entityKeys] for a submenu
const navbar = importNavbar({
    groups: [{ id: "Catalog", title: "catalog", icon: "catalog" }],
    entities: ["Article", ["Catalog", ["Category"]]], // Array<string | [groupId, Array<entityKey>]>
    configs,
    hasAccess: () => true,
})
const tree = buildNavigationTree([...dashboard, ...navbar]) // → TreeList<INavCore> to render the menu
```

> Prefer the lower-level primitives when the importer inputs feel heavy: `createNavGroup({ id, title, icon })`
> and `createNavItem(config, parentId?)` build `INavCore` items directly, then `buildNavigationTree(items)`.

## Custom query params (and the `$` rule)

Anything you put on the search object is sent as a query param (arrays → repeated keys). Keys starting
with **`$`** are stripped by `cleanQueryParams` — use the `$` prefix for client-only/meta values you do
_not_ want on the wire.

## Type the client from the API's OpenAPI

When the back-end already exposes OpenAPI (every Regira `*.Web` API does, at `/openapi/v1.json`),
generate the **DTO/payload types** from it and feed them into your models. You still hand-write the model
classes — the client needs real classes with `$id` / `$title` getters and `toEntity` — but their nested
/related fields and your form payloads then stay in lock-step with the server contract.

```bash
# run once, or wire it as a "predev" / "prebuild" npm script.
# openapi-typescript@7 peers typescript@^5 — run it isolated via npx (don't add it as a dep) so it can't clash with your TS 6 toolchain.
npx -p openapi-typescript@7 -p typescript@5 openapi-typescript http://localhost:5001/openapi/v1.json -o src/api/schema.d.ts
```

```ts
// src/api/types.ts — friendly aliases over the generated schema
import type { components } from "./schema"
export type ArticleDto = components["schemas"]["ArticleDto"]
export type CategoryDto = components["schemas"]["CategoryDto"]
```

```ts
// data/Article.ts — the class the entities layer needs, typed from the DTO
import { EntityBase } from "regira_modules/vue/entities"
import type { CategoryDto } from "@/api/types"

export class Article extends EntityBase {
    id = 0
    title = ""
    categories?: CategoryDto[] // nested shapes come from OpenAPI, in sync with the server
    override get $id() {
        return this.id || "new"
    }
    override get $title() {
        return this.title
    }
}
```

> **Flag-enums serialize as numbers.** `includes` / `sortBy` come through `openapi-typescript` as
> `number`, but Regira APIs accept them **by name** in the query string — pass the enum member name(s),
> e.g. `includes: ["Categories"]`, not the numeric value. The valid names are the enum members in the
> OpenAPI schema (what the back-end `EntityIncludes` defines); verify them against your API rather than
> guessing (an unknown include name returns `400`) — when unsure, `includes: ["All"]` is the safe
> catch-all that eager-loads every relation. Keep a small `const` map on the client for these
> instead of the generated numeric type. (Run the generator via `npx openapi-typescript` to avoid TS
> peer-dep conflicts; see the tsconfig note in [entities.setup.md](entities.setup.md#install).)

## Debug panel (dev-only)

`debugPlugin` (installed in `main.ts` with `{ isDebug }`) exposes `$isDebug` / `$setDebug`, and with
`configureGlobals({ registerComponentsGlobally: true })` a global `<Debug>` component. Drop it into any form or
details view to dump the live payload — it self-gates on `$isDebug` (no `v-if` needed) and stays out of production:

```vue
<Debug title="product" :modelValue="{ item, unitType: item.unitType?.title }" />
```

`$isDebug` turns on via `$setDebug(true)` or `?debug=1` and is reactive, so panels appear/disappear live. Curate
the `modelValue` to what you're debugging (resolved relations, paging state), not the raw model. The app shell's
`AppDebug` bar (screen / route / culture, `$setDebug(false)` to close) is the same mechanism.

## See also

- [entities.examples.md](entities.examples.md) · [entities.signatures.md](entities.signatures.md) ·
  [entities.instructions.md](entities.instructions.md)
