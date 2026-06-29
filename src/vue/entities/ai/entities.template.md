# Regira JsLib Entities — New Entity Slice Template (scaffold)

A **blank fill-in-the-blanks scaffold** for one entity slice. Copy the folder set, then fill the `(c)`
placeholders below (the files marked `// TODO`). The placeholder entity is **`Foo`** (resource `"/foos"`,
route prefix `foos`) — rename it to your entity throughout.

This is the _skeleton_. For the same files **filled in with real code**, see
[entities.examples.md](entities.examples.md) (a simple `UnitType` slice and a standard `Product` slice).
The **app shell** that hosts these slices (project structure, `main.ts`, router, navigation) is in
[entities.setup.md](entities.setup.md) — this file is only the per-entity slice.

> **Reading order:** [instructions](entities.instructions.md) → [setup](entities.setup.md) (new app) →
> [namespaces](entities.namespaces.md) → [signatures](entities.signatures.md) →
> [examples](entities.examples.md) / [advanced.example](entities.advanced.example.md) → **template (this
> file — scaffold a new entity)** → [patterns](entities.patterns.md) (recipes).
>
> **Never guess** a `regira_modules` import — verify it in [entities.namespaces.md](entities.namespaces.md).

## How to use

1. Create `src/entities/<name>/` with the folder set in the tree below.
2. Write the `(c)` files (§ below) — those are the only ones tailored to your entity.
3. Copy the **boilerplate** files verbatim from [entities.examples.md](entities.examples.md) Part 1
   (`UnitType`) — they are byte-identical for every entity (only the literal entity name differs). The
   short ones are also shown inline below; the longer/identical ones are listed in
   [§Boilerplate — copy verbatim](#boilerplate--copy-verbatim) so this scaffold stays a single source of
   truth and doesn't drift from the worked example.
4. Register the slice's `plugin` in `src/entities/index.ts` — see
   [entities.setup.md → Add entities](entities.setup.md#add-entities).

## File tree

`(c)` = **you customize this per entity** (placeholder shown below). The rest is boilerplate (copy as-is).

```
src/entities/foos/               # one entity slice — copy this folder set for every entity
    config/
        config.ts (c)            # IConfig — api URLs, key, paging, titles, icon
    data/
        Entity.ts (c)            # model class — extends EntityBase (fields + $id/$title)
        EntityService.ts         # extends EntityServiceBase<Entity> { toEntity } (+ prepareItem for children)
        store.ts                 # Pinia store — createStore(get(Entity.name)!, Entity.name)
    filter/
        SearchObject.ts (c)      # extends SearchObjectBase — your filter fields
        Filter.vue               # filter shell (inline bar + advanced modal)
        FilterInline.vue         # inline keyword bar
        FilterAdv.vue (c)        # advanced search form — your filter inputs
    overview/
        Overview.vue             # useSearchView + useRouteOverview (the list page)
        List.vue (c)             # results table — your columns
        ListItem.vue (c)         # one result row — your columns
    details/
        Details.vue              # useDetails — loads :id, hosts Fiche/Form
        Form.vue (c)             # useForm — your create/edit form
        FormModalButton.vue      # opens the Form in a modal (simple-entity new/edit)
    selecting/
        SelectorList.vue (c)     # selectable results list — your columns
        Autocomplete.vue         # } the relation-picker set: lets OTHER entities pick this one.
        InputSelector.vue        # } Byte-identical for every entity — never customized.
        Selector.vue             # } Copy verbatim (see §Boilerplate below).
        SelectorDropdown.vue     # }
        SelectorModalButton.vue  # }
        SelectorSearch.vue       # }
    index.ts                     # barrel — re-export config, Entity, service, views, plugin
    setup.ts                     # createRoutes() + addServices() + addIcons() + install plugin
```

> Build order is the [Entity Implementation Workflow](entities.instructions.md#entity-implementation-workflow):
> model → config → service → store → search object → filter → overview → details → form → selecting →
> barrel → setup.

---

# Customize these — `(c)` files

## `data/Entity.ts` (c)

```ts
import { EntityBase } from "@/regira_modules/vue/entities"

export class Foo extends EntityBase {
    id: number = 0
    title: string
    // TODO: your fields, e.g.
    // code?: string
    // barId?: number
    // bar?: Bar                          // a related entity (navigation property)

    created?: Date
    lastModified?: Date

    override get $id(): string | number {
        return this.id || "new" // "new" (or null) marks an unsaved instance → save() inserts
    }
    override get $title(): string | undefined {
        return this.title // TODO: the human label (selectors, breadcrumbs, nav)
    }
}

export const Entity = Foo
export default Foo
```

## `config/config.ts` (c)

```ts
import type { IConfig } from "@/regira_modules/vue/entities"
import Entity from "../data/Entity"

const api = "/foos" // TODO: API resource path (relative to the axios baseURL)

const config: IConfig = {
    id: Entity.name,
    key: "Foo", // TODO: route-name prefix + icon key (conventionally = Entity.name)
    isComplex: false, // TODO: true → tabbed form + /search endpoint + Details-page "new"

    routePrefix: "foos", // TODO: URL path segment
    baseQueryParams: { includes: [] }, // TODO: server-side eager-loads, e.g. { includes: ["Bar"] }
    initialQuery: {},

    overviewTitle: "foos", // TODO: i18n keys
    detailsTitle: "foo",
    description: "foo.description",
    icon: "bi bi-question-circle", // TODO: a Bootstrap-Icons class

    defaultPageSize: 10, // 0 = fetch all (typical for a small lookup)

    api,
    detailsUrl: api,
    listUrl: api,
    searchUrl: api + "/search",
    saveUrl: api, // resource base — update/remove append /{$id} themselves
    deleteUrl: api,
}

export default config
```

## `filter/SearchObject.ts` (c)

> Keep the class name **`EntitySearchObject`** — it is **not** renamed per entity (the barrel and consumers
> import it as the module default).

```ts
import { SearchObjectBase } from "@/regira_modules/vue/entities"

export class EntitySearchObject extends SearchObjectBase {
    // `q` (free-text) is inherited from SearchObjectBase. Add your filters:
    title?: string // TODO: your filter fields
    // barId?: number | Array<number>     // arrays serialize as repeated query keys

    minCreated?: Date
    maxCreated?: Date
    isArchived?: boolean // set true to include archived rows (hidden by default)
}

export default EntitySearchObject
```

## `filter/FilterAdv.vue` (c)

```vue
<template>
    <div class="adv-filter">
        <!-- keywords (free-text q) -->
        <input v-model.lazy.trim="searchObject.q" class="form-control mb-2" :placeholder="$t('keywords')" />

        <!-- TODO: your filter inputs, e.g. -->
        <input v-model.lazy.trim="searchObject.title" class="form-control mb-2" :placeholder="$t('name')" />

        <IconButton icon="clear" :showText="true" @click="handleReset" />
    </div>
</template>

<script setup lang="ts">
// Icon / IconButton are globally-registered (vue/ui) — or import them.
import { useFilter, type FilterEmits } from "@/regira_modules/vue/entities"
import SearchObject from "./SearchObject"

interface Emits extends /* @vue-ignore */ FilterEmits<SearchObject> {}
const emit = defineEmits<Emits & { "update:modelValue": (v: SearchObject) => true; filter: (v: SearchObject) => true; close: () => void }>()
defineProps<{ resultCount?: number }>()

const searchObject = defineModel<SearchObject>({ required: true })
const { filterIsActive, handleReset } = useFilter({ searchObject, emit, Constructor: SearchObject })
</script>
```

## `overview/List.vue` (c)

```vue
<template>
    <div class="entity-list">
        <div class="row fw-bold border-bottom pb-2">
            <!-- TODO: column headers -->
            <div class="col">{{ $t("name") }}</div>
        </div>
        <ListItem
            v-for="(item, i) in items"
            :key="item.$id"
            v-model="items[i]!"
            :readonly="readonly"
            @request-save="$emit('request-save', $event)"
            @request-remove="$emit('request-remove', $event)"
            @save="$emit('save', $event)"
            @remove="$emit('remove', $event)"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { OverviewEmits } from "@/regira_modules/vue/entities"
import type Entity from "../data/Entity"
import useEntityStore from "../data/store"
import ListItem from "./ListItem.vue"

interface Emits extends /* @vue-ignore */ OverviewEmits<Entity> {}
const emit = defineEmits<Emits>()
const props = defineProps<{ modelValue?: Array<Entity>; readonly?: boolean }>()

const { fromPool } = useEntityStore() // resolve rows through the shared pool (reactive cache)
const items = computed<Array<Entity>>({
    get: () => fromPool(props.modelValue || []),
    set: (value) => emit("update:modelValue", value),
})
</script>
```

## `overview/ListItem.vue` (c)

```vue
<template>
    <div class="row border-bottom py-2">
        <div class="col-auto">
            <!-- simple entity: edit in a modal. (complex: a <router-link> to the Details page) -->
            <FormModalButton v-model="item" @save="$emit('save', $event)" />
        </div>

        <!-- TODO: columns -->
        <div class="col text-truncate">{{ item.$title }}</div>

        <div class="col-auto">
            <ConfirmButton icon="delete" :modal-type="ModalType.danger" @confirm="$emit('request-remove', item)">
                {{ $t("deleteItem", { title: item?.$title }) }}
            </ConfirmButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ModalType, ConfirmButton } from "@/regira_modules/vue/ui"
import type { SaveResult } from "@/regira_modules/vue/entities"
import Entity from "../data/Entity"
import FormModalButton from "../details/FormModalButton.vue"

const emit = defineEmits<{
    (e: "update:modelValue", value: Entity): void
    (e: "save", value: SaveResult<Entity>): void
    (e: "remove", value: Entity): void
    (e: "request-save", value: Entity): void
    (e: "request-remove", value: Entity): void
}>()
defineProps<{ readonly?: boolean }>()

const item = defineModel<Entity>({ required: true })
</script>
```

## `details/Form.vue` (c)

```vue
<template>
    <form @submit.prevent="handleSubmit">
        <FormButtonsRow
            :item="item"
            :readonly="readonly"
            :feedback="feedback"
            :show-delete="item?.id > 0"
            @cancel="handleCancel"
            @remove="handleRemove"
            @restore="handleRestore"
        />

        <FormSection :title="$t(config.detailsTitle || '')" :readonly="readonly">
            <!-- TODO: your fields, e.g. -->
            <div class="mb-2">
                <input v-model="item.title" :readonly="readonly" class="form-control" />
                <FormLabel :label="$t('name')" />
            </div>
            <!-- relation pickers go here, e.g. <BarInputSelector v-model="item.bar" v-model:idValue="item.barId" /> -->
            <!-- child collections go here, e.g. <ChildOverview v-model="item" /> (see entities.advanced.example.md) -->
        </FormSection>
    </form>
</template>

<script setup lang="ts">
// FormSection / FormLabel / Icon are globally-registered (vue/ui); FormButtonsRow is imported from vue/ui.
import type { RouteRecordRaw } from "vue-router"
import { FormButtonsRow } from "@/regira_modules/vue/ui"
import { useForm, type FormEmits, formDefaults } from "@/regira_modules/vue/entities"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"

interface Emits extends /* @vue-ignore */ FormEmits<Entity> {}
const emit = defineEmits<Emits>()
const props = withDefaults(
    defineProps<{ modelValue: Entity; readonly?: boolean; overviewUrl?: string | RouteRecordRaw; isPopup?: boolean; initialTab?: string }>(),
    { ...formDefaults }
)

const { service: entityService } = useEntityStore()
const { item, feedback, handleCancel, handleSubmit, handleRemove, handleRestore } = useForm<Entity>({ entityService, props, emit })
// the form's handleRemove() takes NO argument (it removes item.value) — unlike the overview's handleRemove(item)
</script>
```

## `selecting/SelectorList.vue` (c)

```vue
<template>
    <div class="entity-list">
        <div class="row fw-bold border-bottom pb-2">
            <div class="col-auto"></div>
            <!-- TODO: column headers -->
            <div class="col">{{ $t("name") }}</div>
        </div>
        <div v-for="(item, i) in items" :key="item.$id" class="row border-bottom py-2" :class="{ 'is-selected': isSelected(item) }">
            <div class="col-auto">
                <IconButton :icon="isSelected(item) ? 'selected' : 'select'" @click="handleSelect(item)" />
            </div>
            <!-- TODO: columns -->
            <div class="col text-truncate">{{ item.$title }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { IconButton } from "@/regira_modules/vue/ui"
import type { OverviewEmits } from "@/regira_modules/vue/entities"
import type Entity from "../data/Entity"
import useEntityStore from "../data/store"

interface Emits extends /* @vue-ignore */ OverviewEmits<Entity> {}
const emit = defineEmits<Emits & { (e: "update:modelValue", value: Array<Entity>): void; (e: "select", selected?: Entity): void }>()
const props = defineProps<{ modelValue?: Array<Entity>; selected?: Entity }>()

const isSelected = computed(() => (item: Entity) => item.$id == props.selected?.$id)
const { fromPool } = useEntityStore()
const items = computed<Array<Entity>>({ get: () => fromPool(props.modelValue || []), set: (value) => emit("update:modelValue", value) })

function handleSelect(item?: Entity) {
    emit("select", item?.$id !== props.selected?.$id ? item : undefined)
}
</script>
```

---

# Copy as-is — short boilerplate (identical for every entity)

## `data/EntityService.ts`

```ts
import type { AxiosInstance } from "axios"
import { EntityServiceBase, type IConfig } from "@/regira_modules/vue/entities"
import Entity from "./Entity"

export class EntityService extends EntityServiceBase<Entity> {
    constructor(axios: AxiosInstance, config: IConfig) {
        super(axios, config)
    }

    // Add this override only if the entity owns child collections — the `_deleted` pattern: drop rows the
    // user removed (marked `_deleted` by useOwnedCollection) so the server deletes them. One per collection:
    // protected override prepareItem(item: Entity): Entity {
    //     item.children = item.children?.filter((x) => !x._deleted) || []
    //     return item
    // }

    override toEntity(item: object): Entity {
        return item instanceof Entity ? item : Object.assign(this.createInstance(Entity as new () => Entity), item || {})
    }
}

export default EntityService
```

## `data/store.ts`

```ts
import { defineStore } from "pinia"
import { get } from "@/regira_modules/vue/ioc"
import { createStore, type IEntityService } from "@/regira_modules/vue/entities"
import Entity from "./Entity"

export const useEntityStore = defineStore(Entity.name, () => {
    const service = get<IEntityService<Entity>>(Entity.name)!
    return createStore<Entity>(service, Entity.name) // pooled, reactive shared cache
})

export default useEntityStore
```

## `details/Details.vue`

```vue
<template>
    <section>
        <LoadingContainer :is-loading="isLoading">
            <RouterView v-slot="{ Component }">
                <Feedback :feedback="feedback" />
                <component
                    :is="Component"
                    v-if="item != null"
                    v-model="item"
                    :overviewUrl="overviewUrl"
                    @change-state="isLoading = $event == FormStates.pending"
                    @remove="handleRemove"
                />
            </RouterView>
        </LoadingContainer>
    </section>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from "vue-router"
import { LoadingContainer, Feedback } from "@/regira_modules/vue/ui"
import { useDetails } from "@/regira_modules/vue/entities/details"
import { FormStates } from "@/regira_modules/vue/entities/form"
import config from "../config/config"
import useEntityStore from "../data/store"

const { service } = useEntityStore()
const { item, isLoading, overviewUrl, feedback } = useDetails(service) // item is null until onMounted load

const router = useRouter()
function handleRemove() {
    router.push(overviewUrl || { name: config.key + "Overview" })
}
</script>
```

## `index.ts`

```ts
export { default as config } from "./config/config"
export { default as Entity } from "./data/Entity"
export { default as EntityService } from "./data/EntityService"
export { default as useEntityStore } from "./data/store"

export { default as Filter } from "./filter/Filter.vue"
export { default as FilterInline } from "./filter/FilterInline.vue"
export { default as FilterAdv } from "./filter/FilterAdv.vue"

export { default as Autocomplete } from "./selecting/Autocomplete.vue"
export { default as InputSelector } from "./selecting/InputSelector.vue"
export { default as Selector } from "./selecting/Selector.vue"
export { default as SelectorDropdown } from "./selecting/SelectorDropdown.vue"
export { default as SelectorList } from "./selecting/SelectorList.vue"
export { default as SelectorModalButton } from "./selecting/SelectorModalButton.vue"
export { default as SelectorSearch } from "./selecting/SelectorSearch.vue"
export { default as FormModalButton } from "./details/FormModalButton.vue"

export { default as Overview } from "./overview/Overview.vue"
export { default as List } from "./overview/List.vue"
export { default as Details } from "./details/Details.vue"
export { default as Form } from "./details/Form.vue"

export { default as plugin } from "./setup"
```

## `setup.ts`

```ts
import type { AxiosInstance } from "axios"
import type { App } from "vue"
import type { RouteRecordRaw } from "vue-router"
import type { IServiceProvider } from "@/regira_modules/vue/ioc"
import type { IIconProvider } from "@/regira_modules/vue/ui/icons"
import { DetailsSummary } from "@/regira_modules/vue/entities"
import config from "./config/config"
import { Entity } from "./data/Entity"
import Overview from "./overview/Overview.vue"
import Details from "./details/Details.vue"
import Form from "./details/Form.vue"
import EntityService from "./data/EntityService"

export function createRoutes(): Array<RouteRecordRaw> {
    const key = config.key
    return [
        { path: `/${config.routePrefix}`, name: `${key}Overview`, component: Overview },
        {
            path: `/${config.routePrefix}/:id`,
            name: `${key}Details`,
            component: Details,
            children: [
                { path: "details", name: `${key}Fiche`, component: DetailsSummary },
                { path: "edit", name: `${key}Form`, component: Form },
            ],
            redirect: () => ({ name: `${key}Form` }),
        },
    ] as Array<RouteRecordRaw>
}

export function addServices(serviceProvider: IServiceProvider) {
    serviceProvider.add(Entity.name, (sp) => new EntityService(sp.get<AxiosInstance>("axios")!, config))
}
export function addIcons(icons: IIconProvider) {
    icons.add(config.key, config.icon!)
}

export default {
    install(app: App<Element>, { routes }: { routes: Array<RouteRecordRaw> }) {
        routes.push(...createRoutes())
        addServices(app.config.globalProperties.$services)
        addIcons(app.config.globalProperties.$icons)
        app.config.globalProperties.$configs[Entity.name] = config
    },
}
```

---

## Boilerplate — copy verbatim

These files carry no entity-specific markup — they are byte-identical for every entity. Copy them verbatim
from the simple `UnitType` slice in [entities.examples.md](entities.examples.md) Part 1 (the section numbers
below) rather than hand-stubbing them here, so there is one source of truth:

| File                                | What it is                                                                                                                             | Copy from                                               |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `overview/Overview.vue`             | the list page — `useSearchView` + `useRouteOverview` wiring, paging, the new-item button (modal for simple, Details route for complex) | [entities.examples.md](entities.examples.md) Part 1 §11 |
| `filter/Filter.vue`                 | the filter shell (hosts the inline bar + the advanced-search modal)                                                                    | [entities.examples.md](entities.examples.md) Part 1 §6  |
| `filter/FilterInline.vue`           | the inline keyword bar                                                                                                                 | [entities.examples.md](entities.examples.md) Part 1 §7  |
| `details/FormModalButton.vue`       | opens the Form in a modal (`useModal`) — the new/edit affordance for simple entities                                                   | [entities.examples.md](entities.examples.md) Part 1 §14 |
| `selecting/Autocomplete.vue`        | type-ahead search input                                                                                                                | [entities.examples.md](entities.examples.md) Part 1 §15 |
| `selecting/InputSelector.vue`       | single-item picker                                                                                                                     | [entities.examples.md](entities.examples.md) Part 1 §16 |
| `selecting/Selector.vue`            | multi-item picker (chips)                                                                                                              | [entities.examples.md](entities.examples.md) Part 1 §17 |
| `selecting/SelectorDropdown.vue`    | simple `<select>` from the cache                                                                                                       | [entities.examples.md](entities.examples.md) Part 1 §18 |
| `selecting/SelectorModalButton.vue` | opens the search/select modal                                                                                                          | [entities.examples.md](entities.examples.md) Part 1 §20 |
| `selecting/SelectorSearch.vue`      | search UI inside the selector modal                                                                                                    | [entities.examples.md](entities.examples.md) Part 1 §21 |

> The `selecting/` set is the **relation picker** for this entity — it lets _other_ entities pick it (in
> their forms). You only ever customize `SelectorList.vue` (its columns, above); the other six are copied
> unchanged.

## See also

- [entities.examples.md](entities.examples.md) — the same files **filled in** (simple `UnitType`, standard `Product`)
- [entities.advanced.example.md](entities.advanced.example.md) — the complex case: attachments, many-to-many link, owned child collections
- [entities.instructions.md](entities.instructions.md#entity-implementation-workflow) — the build-order workflow
- [entities.setup.md](entities.setup.md#entity-slice-anatomy) — the slice anatomy + the app shell that hosts it
- [entities.signatures.md](entities.signatures.md) · [entities.namespaces.md](entities.namespaces.md) — exact signatures & imports
