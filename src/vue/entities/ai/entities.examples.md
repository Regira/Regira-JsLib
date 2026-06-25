# Regira JsLib Entities — Worked Example

A complete entity slice for a `Product` entity, plus a minimal lookup entity. The script blocks follow
the exact idioms used by the demo apps; bind them as shown.

> **Fidelity note:** templates are sketched (presentational markup elided with `…`) — only the
> `<script setup>` wiring is normative. Imports use the demo alias `@/regira_modules/...`; in a plain
> npm install drop the `@/` (`regira_modules/...`). Resolve any import you don't see here from
> [entities.namespaces.md](entities.namespaces.md); never guess one.

## Folder layout

```
src/entities/products/
  config/config.ts
  data/Entity.ts
  data/EntityService.ts
  data/store.ts
  filter/SearchObject.ts
  filter/Filter.vue
  overview/Overview.vue
  details/Details.vue
  details/Form.vue
  selecting/Selector.vue     # relation picker (see entities.patterns.md)
  setup.ts
  index.ts
```

## 1. Model — `data/Entity.ts`

```ts
import { EntityBase } from "@/regira_modules/vue/entities"

export class Product extends EntityBase {
    id?: number
    title?: string
    description?: string
    price?: number
    created?: Date          // hydrated from the server string automatically
    lastModified?: Date

    override get $id(): string | number {
        return this.id || "new"     // "new" sentinel → save() inserts
    }
    override get $title(): string | undefined {
        return this.title
    }
}

export const Entity = Product
export default Product
```

## 2. Config — `config/config.ts`

```ts
import type { IConfig } from "@/regira_modules/vue/entities"
import Entity from "../data/Entity"

const api = "/products"

const config: IConfig = {
    key: "Product",                 // route-name prefix: ProductOverview / ProductDetails / ProductForm / ProductFiche
    routePrefix: "products",        // URL: /products
    isComplex: true,
    baseQueryParams: { includes: ["Facets"] },   // merged into every list/search request
    overviewTitle: "products",
    detailsTitle: "product",
    icon: "bi bi-box-seam",
    defaultPageSize: 10,
    api,
    detailsUrl: api,
    listUrl: api,
    searchUrl: api + "/search",     // a dedicated search endpoint; use `api` when there is none
    saveUrl: api,                   // resource BASE: insert = POST {saveUrl}, update = PUT {saveUrl}/{$id}
    deleteUrl: api,                 // resource BASE: delete = DELETE {deleteUrl}/{$id}
}
// All *Url fields are resource BASES (they default off `api`). Do NOT point saveUrl at a literal
// endpoint like `/products/save` — `update` appends `/{$id}`, so that 404s on edit while insert passes.

export default config
```

## 3. Service — `data/EntityService.ts`

```ts
import type { AxiosInstance } from "axios"
import { EntityServiceBase, type IConfig } from "@/regira_modules/vue/entities"
import Entity from "./Entity"

export class EntityService extends EntityServiceBase<Entity> {
    constructor(axios: AxiosInstance, config: IConfig) {
        super(axios, config)
    }

    // The only required override: turn a plain server object into an Entity instance.
    override toEntity(item: object): Entity {
        return item instanceof Entity ? item : Object.assign(this.createInstance(Entity as new () => Entity), item || {})
    }
}

export default EntityService
```

Add bespoke endpoints by calling `this.axios` with URLs built off `this.config.api`; override
`prepareItem` to drop transient children before save (see [entities.patterns.md](entities.patterns.md)).

## 4. Search object — `filter/SearchObject.ts`

```ts
import { SearchObjectBase } from "@/regira_modules/vue/entities"

export class EntitySearchObject extends SearchObjectBase {   // SearchObjectBase provides `q`
    title?: string
    minPrice?: number
    maxPrice?: number
    isArchived?: boolean
}

export default EntitySearchObject
```

## 5. Store — `data/store.ts`

```ts
import { defineStore } from "pinia"
import { createStore, type IEntityService } from "@/regira_modules/vue/entities"
import { get } from "@/regira_modules/vue/ioc"
import Entity from "./Entity"

export const useEntityStore = defineStore(Entity.name, () => {
    const service = get<IEntityService<Entity>>(Entity.name)!   // raw service from IoC
    return createStore<Entity>(service, Entity.name)            // pooled service + cache
})

export default useEntityStore
```

## 6. Overview — `overview/Overview.vue`

```vue
<script setup lang="ts">
import { useSearchView, useRouteOverview } from "@/regira_modules/vue/entities"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"
import SearchObject from "../filter/SearchObject"

const { service } = useEntityStore()

const { searchObject, pagingInfo, items, itemsCount, isLoading, feedback,
        applySave, applyRemove, handleSave, handleRemove, searchHandler } =
    useSearchView<Entity, SearchObject>({
        service,
        searchObject: new SearchObject(),
        defaultPageSize: config.defaultPageSize,
    })

// keep the URL query in sync with searchObject + pagingInfo, and search on route change
const { updateOverviewRoute } = useRouteOverview({
    searchObject,
    pagingInfo,
    handler: searchHandler,
    defaultPageSize: config.defaultPageSize,
})
</script>

<template>
  <!-- IMPORTANT: `items` and `itemsCount` are `undefined` until the first search runs — GUARD them,
       or the template throws a cryptic null error that typechecking does not catch.
       Filter   v-model="searchObject" @filter="updateOverviewRoute(true)"
       list     v-for="item in items ?? []"   (empty state: v-if="(items?.length ?? 0) === 0")
       Paging   v-model="pagingInfo" :count="itemsCount ?? 0" @change="updateOverviewRoute()"
       create   link → { name: `${config.key}Details`, params: { id: 'new' } } -->
  …
</template>
```

## 7. Details — `details/Details.vue`

```vue
<script setup lang="ts">
import { RouterView } from "vue-router"
import { useDetails } from "@/regira_modules/vue/entities"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"

const { service } = useEntityStore()
const { item, isLoading, overviewUrl, load, feedback } = useDetails(service)   // loads by route :id
</script>

<template>
  <!-- `item` is null until loaded (onMounted) — guard so Fiche/Form never receive null -->
  <RouterView v-if="item" v-model="item" :overview-url="overviewUrl" />
</template>
```

## 8. Form — `details/Form.vue`

```vue
<script setup lang="ts">
import type { RouteRecordRaw } from "vue-router"
import { useForm, type FormEmits, formDefaults } from "@/regira_modules/vue/entities"
import useEntityStore from "../data/store"
import Entity from "../data/Entity"

interface Emits extends /* @vue-ignore */ FormEmits<Entity> {}
const emit = defineEmits<Emits>()

const props = withDefaults(
    defineProps<{
        modelValue: Entity
        readonly?: boolean
        overviewUrl?: string | RouteRecordRaw
        isPopup?: boolean
    }>(),
    { ...formDefaults }
)

const { service: entityService } = useEntityStore()
const { item, feedback, handleCancel, handleSubmit, handleRemove, handleRestore } =
    useForm<Entity>({ entityService, props, emit })
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="item.title" />
    <input v-model.number="item.price" type="number" />
    <!-- buttons → handleSubmit / handleCancel / handleRemove / handleRestore -->
    …
  </form>
</template>
```

## 9. Filter — `filter/Filter.vue`

```vue
<script setup lang="ts">
import { useFilter, type FilterEmits } from "@/regira_modules/vue/entities"
import type SearchObject from "./SearchObject"

interface Emits extends /* @vue-ignore */ FilterEmits<SearchObject> {}
const emit = defineEmits<Emits>()

const searchObject = defineModel<SearchObject>({ required: true })
const { handleUpdate, handleFilter, handleReset, filterIsActive } = useFilter({ searchObject, emit })
</script>

<template>
  <!-- inputs bound to searchObject.* ; submit → handleFilter() ; clear → handleReset() -->
  …
</template>
```

## 10. Plugin — `setup.ts`

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

> A **lookup** entity (no list UI) omits `createRoutes()` and the views — its `install` only registers
> the service, icon, and config. Its `SearchObject` can be `class EntitySearchObject extends SearchObjectBase {}`.

## 11. Aggregator + bootstrap

`src/entities/index.ts` collects every entity plugin:

```ts
import type { App } from "vue"
import type { RouteRecordRaw } from "vue-router"
import { plugin as productPlugin } from "./products"
// import { plugin as ... } from "./..."

export const plugins = [productPlugin /*, … (order matters) */]

export default {
    install(app: App<Element>, { routes }: { routes: Array<RouteRecordRaw> }) {
        app.config.globalProperties.$configs = {}
        plugins.forEach((plugin) => app.use(plugin as any, { routes }))
    },
}
```

`src/main.ts` — startup order (see [entities.instructions.md](entities.instructions.md#app-startup-wiring-order)):

```ts
import { initAxios } from "@/regira_modules/vue/http"
import { plugin as servicesPlugin } from "@/regira_modules/vue/ioc"
import { PoolCache, defaultPoolCache } from "@/regira_modules/vue/entities"
import entityPlugins from "@/entities"
import { routerFactory } from "@/router/router"

const appConfig = await fetch("/config.json").then((r) => r.json())
const axios = initAxios({ api: appConfig.api, includeCredentials: appConfig.includeCredentials })

const entityRoutes: Array<any> = []
app.use(servicesPlugin, {
    configure: (sp) => sp.add("axios", () => axios).add(PoolCache.name, () => defaultPoolCache),
})
app.use(entityPlugins, { routes: entityRoutes })   // each setup.ts pushes its routes + registers its service
app.use(routerFactory([...entityRoutes]))
// app.use(authPlugin, { axios, tokenManager, clientApp: appConfig.clientApp, loginUrl: appConfig.loginUrl })
```

## See also

- [entities.patterns.md](entities.patterns.md) — child collections, trees, JSON services, paging, soft-delete
- [entities.signatures.md](entities.signatures.md) · [entities.namespaces.md](entities.namespaces.md)
