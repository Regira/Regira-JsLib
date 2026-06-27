# Regira JsLib Entities — Worked BASIC Slice (`Product`)

The **complete, self-contained** worked example of one BASIC entity slice — `Product`, copied verbatim
from the reference [PIM-Manager](https://github.com/Regira) `products` slice. Every file the slice needs
is here, in build order, ready to copy-paste — no cross-file joining required. The per-entity files are
filled with real `Product` code; the shared boilerplate files are shown with `Product` naming exactly as
they appear in the app.

> **Reading order:** [instructions](entities.instructions.md) → [setup](entities.setup.md) (new app) →
> [namespaces](entities.namespaces.md) → [signatures](entities.signatures.md) → **examples (this file —
> basic slice)** / [advanced.example](entities.advanced.example.md) (complex slice) →
> [patterns](entities.patterns.md) (recipes, load on demand).

> **Legend:** `(c)` = _per-entity-customized_ — this file is tailored to each entity (here filled in for
> `Product`). Files without `(c)` are **boilerplate** — byte-identical for every entity (only the literal
> word `Product`/`Entity` differs); copy them as-is. This mirrors the
> [Entity slice anatomy](entities.setup.md#entity-slice-anatomy) `(c)` convention.

> **Fidelity note:** every block is reproduced verbatim from the reference app — templates included — so
> both markup and `<script setup>` wiring are normative. Imports use the demo alias `@/regira_modules/...`
> for library code and app-local aliases (`@/entities/...`, `@/components/...`, `../...`) for app code. In
> a plain npm install, drop the `@/` from the `regira_modules` paths (`regira_modules/...`) and resolve
> app-local imports against your own app. Resolve any `regira_modules` import you don't recognise from
> [entities.namespaces.md](entities.namespaces.md); never guess one.

## Folder layout

The full folder tree — every file with its one-line purpose — lives in
[entities.setup.md → Entity slice anatomy](entities.setup.md#entity-slice-anatomy); the build order is
the [Add an entity workflow](entities.instructions.md#entity-implementation-workflow). The numbered
sections below walk that same slice file by file, in implementation order
(model → config → service → store → search object → filter → overview → details → form → selecting →
barrel → setup), with the real `Product` code for each.

## 1. Model — `data/Entity.ts` (c)

```ts
import { EntityBase } from "@/regira_modules/vue/entities"
import { type Entity as UnitType } from "@/entities/unit-types"
import type ProductComponent from "../product-components/Entity"
import type ProductFacet from "../product-facets/Entity"
import type ProductSupplier from "../product-suppliers/Entity"

export class Product extends EntityBase {
    id: number = 0
    title: string
    description?: string

    unitTypeId?: number
    defaultQuantity?: number

    created?: Date
    lastModified?: Date

    unitType?: UnitType
    assemblies?: ProductComponent[]
    components?: ProductComponent[]
    facets?: ProductFacet[]
    suppliers?: ProductSupplier[]

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return this.title
    }
}

export const Entity = Product

export default Product
```

## 2. Config — `config/config.ts` (c)

```ts
import type { IConfig } from "@/regira_modules/vue/entities"
import Entity from "../data/Entity"

const api = "/products"

const config: IConfig = {
    id: Entity.name,
    key: "Product",
    requires: [],
    isComplex: true,

    routePrefix: "products",
    baseQueryParams: {
        includes: ["Facets", "Components"],
    },
    initialQuery: { isRoot: true },

    overviewTitle: "products",
    detailsTitle: "product",
    description: "product.description",
    icon: "bi bi-joystick",

    defaultPageSize: 10,

    api,
    detailsUrl: api,
    listUrl: api,
    get searchUrl() {
        return this.isComplex ? api + "/search" : api
    },
    saveUrl: api,
    deleteUrl: api,
}

export default config
```

## 3. Service — `data/EntityService.ts` (c)

`Product` has no attachments, so it uses the plain service. The only required override is `toEntity`.
Override `prepareItem` to drop transient children before save, and add bespoke endpoints by calling
`this.axios` with URLs built off `this.config.api` (see [entities.patterns.md](entities.patterns.md)).
For the attachments-aware variant of this file, see
[entities.advanced.example.md](entities.advanced.example.md).

```ts
import type { AxiosInstance } from "axios"
import { EntityServiceBase, type IConfig } from "@/regira_modules/vue/entities"
import Entity from "./Entity"

export class EntityService extends EntityServiceBase<Entity> {
    constructor(axios: AxiosInstance, config: IConfig) {
        super(axios, config)
    }

    protected override prepareItem(item: Entity): Entity {
        // implement related entities here
        // item.children = item.children?.filter((x) => !x._deleted) || []
        return item
    }

    override toEntity(item: object): Entity {
        return item instanceof Entity ? item : Object.assign(this.createInstance(Entity as new () => Entity), item || {})
    }
}

export default EntityService
```

## 4. Store — `data/store.ts`

```ts
import { defineStore } from "pinia"
import { get } from "@/regira_modules/vue/ioc"
import { createStore, type IEntityService } from "@/regira_modules/vue/entities"
import Entity from "./Entity"

export const useEntityStore = defineStore(Entity.name, () => {
    const service = get<IEntityService<Entity>>(Entity.name)!
    return createStore<Entity>(service, Entity.name)
})

export default useEntityStore
```

## 5. Search object — `filter/SearchObject.ts` (c)

> The class is named `EntitySearchObject` in the reference app — it is **not** renamed per entity (the
> barrel and consumers import it as the module default), so this name is reproduced verbatim.

```ts
import { SearchObjectBase } from "@/regira_modules/vue/entities"

export class EntitySearchObject extends SearchObjectBase {
    title?: string

    assemblyId?: number | Array<number>
    componentId?: number | Array<number>
    allComponentId?: number | Array<number>
    excludeComponentId?: number | Array<number>

    facetGroupId?: number | Array<number>
    excludeFacetGroupId?: number | Array<number>

    facetId?: number | Array<number>
    allFacetId?: number | Array<number>
    excludeFacetId?: number | Array<number>

    unitTypeId?: number
    supplierId?: number | Array<number>

    isRoot?: boolean
    isComponent?: boolean
    isAssembly?: boolean

    minCreated?: Date
    maxCreated?: Date
    minLastModified?: Date
    maxLastModified?: Date
}

export default EntitySearchObject
```

## 6. Filter — `filter/Filter.vue`

```vue
<template>
    <div>
        <slot name="inline" :handleToggle="handleToggle">
            <FilterInline v-model="searchObject" @filter="handleFilter" @toggle-adv="handleToggle" />
        </slot>

        <Teleport to="#modals">
            <MyModal
                :is-visible="showAdv"
                :title="props.modalTitle || 'Advanced search'"
                :show-footer="true"
                :full-width="true"
                @close="handleClose"
                @submit="handleSubmit"
            >
                <slot name="title"></slot>
                <slot name="adv" :handleUpdate="handleUpdate" :handleSubmit="handleSubmit" :handleClose="handleClose"> </slot>
            </MyModal>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useFilter, type FilterEmits } from "@/regira_modules/vue/entities"
import type SearchObject from "./SearchObject"
import FilterInline from "./FilterInline.vue"

interface Emits extends /* @vue-ignore */ FilterEmits<SearchObject> {}
const emit = defineEmits<
    Emits & {
        "update:modelValue": (value: SearchObject) => true
        filter: (value: SearchObject) => true
        "toggle-adv": () => void
        close: () => void
    }
>()

const props = defineProps<{
    modalTitle?: string
    resultCount?: number
}>()

const searchObject = defineModel<SearchObject>({ required: true })

const showAdv = ref(false)
const { handleUpdate, handleFilter } = useFilter({ searchObject, emit })

function handleToggle() {
    showAdv.value = !showAdv.value
}
function handleClose() {
    showAdv.value = false
}
function handleSubmit() {
    handleUpdate()
    handleClose()
}
</script>
```

## 7. Filter (inline) — `filter/FilterInline.vue`

```vue
<template>
    <div class="row">
        <div class="col-auto">
            <div class="input-group">
                <IconButton icon="clear" class="btn-outline-secondary" @click="handleReset" />
                <input v-model.lazy.trim="searchObject.q" class="form-control" :placeholder="$t('keywords')" @change="handleUpdate" />
                <IconButton icon="search" class="btn-outline-primary d-none d-sm-block" @click="handleUpdate" />
                <IconButton v-if="showToggleAdv" icon="filter" :class="filterIsActive ? 'btn-info' : 'btn-outline-info'" @click="handleToggle" />
            </div>
            <small v-if="filterIsActive" class="d-none d-sm-inline italic-muted">{{ $t("filtersAreApplied") }}</small>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useFilter, type FilterEmits } from "@/regira_modules/vue/entities"
import config from "../config/config"
import SearchObject from "./SearchObject"

interface Emits extends /* @vue-ignore */ FilterEmits<SearchObject> {}
const emit = defineEmits<
    Emits & {
        "update:modelValue": (value: SearchObject) => true
        filter: (value: SearchObject) => true
        "toggle-adv": () => void
    }
>()

const props = withDefaults(
    defineProps<{
        resultCount?: number
        showToggleAdv?: boolean
    }>(),
    {
        showToggleAdv: config.isComplex,
    }
)
const searchObject = defineModel<SearchObject>({
    default: () => new SearchObject(),
})

const { filterIsActive, handleReset, handleUpdate, handleToggle } = useFilter({
    searchObject,
    emit,
    Constructor: SearchObject,
})
</script>
```

## 8. Filter (advanced) — `filter/FilterAdv.vue` (c)

```vue
<template>
    <div class="adv-filter">
        <div class="row">
            <div class="col mb-2" v-if="resultCount != null">
                <span class="text-info">{{ resultCount }} results</span>
                <small v-if="filterIsActive" class="ms-2 italic-muted">({{ $t("filtersAreApplied") }})</small>
                <span v-if="isLoading" class="ms-2 text-muted"><Loading style="height: 1.5rem" /></span>
            </div>
            <div class="col mb-2 text-end">
                <IconButton icon="clear" @click="handleReset" :showText="true" />
            </div>
        </div>
        <div class="row">
            <!-- keywords -->
            <div class="col mb-2">
                <div class="input-group">
                    <div class="input-group-text">
                        <Icon name="search" />
                    </div>
                    <input v-model.lazy.trim="searchObject.q" class="form-control" :placeholder="$t('keywords')" />
                </div>
                <FormLabel :label="$t('keywords')" />
            </div>
            <!-- title -->
            <div class="col mb-2">
                <div class="input-group">
                    <div class="input-group-text">
                        <Icon name="search" />
                    </div>
                    <input v-model.lazy.trim="searchObject.title" class="form-control" :placeholder="$t('name')" />
                </div>
                <FormLabel :label="$t('name')" />
            </div>
        </div>
        <div class="row">
            <!-- isRoot, isAssembly, isComponent -->
            <div class="col mb-2">
                <div>
                    <div class="form-check form-check-inline">
                        <NullableCheckBox v-model="searchObject.isRoot" id="isRoot" class="form-check-input" />
                        <label class="form-check-label" for="isRoot">{{ $t("isRoot") }}</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <NullableCheckBox v-model="searchObject.isAssembly" id="isAssembly" class="form-check-input" />
                        <label class="form-check-label" for="isAssembly">{{ $t("product.isAssembly") }}</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <NullableCheckBox v-model="searchObject.isComponent" id="isComponent" class="form-check-input" />
                        <label class="form-check-label" for="isComponent">{{ $t("product.isComponent") }}</label>
                    </div>
                </div>
                <FormLabel :label="$t('assembly')" />
            </div>
            <!-- UnitType -->
            <div class="col mb-2">
                <UnitTypeInputSelector
                    v-model="unitType"
                    v-model:id-value="searchObject.unitTypeId"
                    :placeholder="$t('unitType')"
                    @select="handleFilter"
                />
                <FormLabel :label="$t('unitType')" />
            </div>
        </div>
        <div class="row">
            <!-- Component -->
            <div class="col mb-2">
                <InputSelector
                    v-model="component"
                    v-model:idValue="searchObject.componentId as number"
                    :canEdit="false"
                    :filterDefaults="{ isComponent: true }"
                    :placeholder="$t('product.component')"
                    @select="handleFilter"
                >
                    <template #prepend>
                        <span class="input-group-text">
                            <Icon name="component" />
                        </span>
                    </template>
                </InputSelector>
                <FormLabel :label="$t('product.component')" />
            </div>
            <!-- Assembly -->
            <div class="col mb-2">
                <InputSelector
                    v-model="assembly"
                    v-model:idValue="searchObject.assemblyId as number"
                    :canEdit="false"
                    :filterDefaults="{ isAssembly: true }"
                    :placeholder="$t('product.assembly')"
                    @select="handleFilter"
                >
                    <template #prepend>
                        <span class="input-group-text">
                            <Icon name="assembly" />
                        </span>
                    </template>
                </InputSelector>
                <FormLabel :label="$t('product.assembly')" />
            </div>
        </div>
        <div class="row">
            <!-- Facet Group -->
            <div class="col mb-2">
                <FacetGroupInputSelector
                    v-model="facetGroup"
                    v-model:idValue="searchObject.facetGroupId as number"
                    :canEdit="false"
                    :placeholder="$t('product.facetGroup')"
                    @select="handleFilter"
                >
                    <template #prepend>
                        <span class="input-group-text bg-success bg-opacity-25">
                            <Icon :name="facetGroupConfig.key" />
                        </span>
                    </template>
                </FacetGroupInputSelector>
                <FormLabel :label="$t('product.facetGroup')" />
            </div>
            <!-- Exclude Facet Group -->
            <div class="col mb-2">
                <FacetGroupInputSelector
                    v-model="excludeFacetGroup"
                    v-model:idValue="searchObject.excludeFacetGroupId as number"
                    :canEdit="false"
                    :placeholder="$t('product.facetGroup')"
                    @select="handleFilter"
                >
                    <template #prepend>
                        <span class="input-group-text bg-danger bg-opacity-25">
                            <Icon :name="facetGroupConfig.key" />
                        </span>
                    </template>
                </FacetGroupInputSelector>
                <FormLabel :label="$t('product.excludedFacetGroup')" />
            </div>
        </div>
        <div class="row">
            <!-- All Components -->
            <div class="col">
                <div class="row">
                    <div class="col-auto mb-2" v-for="c in allComponents" :key="c.id">
                        <div class="input-group mt-1">
                            <span class="input-group-text bg-success bg-opacity-50">
                                <Icon name="check" />
                            </span>
                            <div class="form-control">{{ c.$title }}</div>
                            <button class="btn btn-outline-secondary" @click="handleRemoveComponent(c)">
                                <Icon name="close" />
                            </button>
                        </div>
                    </div>
                    <div class="col-auto">
                        <InputSelector
                            @select="handleAddComponent"
                            :canEdit="false"
                            :filter-defaults="{ isComponent: true }"
                            :placeholder="$t('product.addComponent')"
                        >
                            <template #prepend>
                                <span class="input-group-text bg-success bg-opacity-25">
                                    <Icon name="component" />
                                </span>
                            </template>
                        </InputSelector>
                    </div>
                </div>
                <FormLabel :label="$t('product.allComponents')" />
            </div>
            <!-- Exclude Components -->
            <div class="col">
                <div class="row">
                    <div class="col-auto mb-2" v-for="c in excludeComponents" :key="c.id">
                        <div class="input-group mt-1">
                            <span class="input-group-text bg-danger bg-opacity-50">
                                <Icon name="ban" />
                            </span>
                            <div class="form-control">{{ c.$title }}</div>
                            <button class="btn btn-outline-secondary" @click="handleRemoveExcludedComponent(c)">
                                <Icon name="close" />
                            </button>
                        </div>
                    </div>
                    <div class="col-auto">
                        <InputSelector
                            @select="handleAddExcludedComponent"
                            :canEdit="false"
                            :filter-defaults="{ isComponent: true }"
                            :placeholder="$t('product.addComponent')"
                        >
                            <template #prepend>
                                <span class="input-group-text bg-danger bg-opacity-25">
                                    <Icon name="component" />
                                </span>
                            </template>
                        </InputSelector>
                    </div>
                </div>
                <FormLabel :label="$t('product.excludedComponents')" />
            </div>
        </div>
        <div class="row">
            <!-- All Facets -->
            <div class="col">
                <div class="row">
                    <div class="col-auto mb-2" v-for="f in allFacets" :key="f.id">
                        <div class="input-group mt-1">
                            <span class="input-group-text bg-success bg-opacity-50">
                                <Icon name="check" />
                            </span>
                            <div class="form-control">{{ f.$title }}</div>
                            <button class="btn btn-outline-secondary" @click="handleRemoveFacet(f)">
                                <Icon name="close" />
                            </button>
                        </div>
                    </div>
                    <div class="col-auto">
                        <FacetInputSelector @select="handleAddFacet" :canEdit="false" :placeholder="$t('product.addFacet')">
                            <template #prepend>
                                <span class="input-group-text bg-success bg-opacity-25">
                                    <Icon :name="facetConfig.key" />
                                </span>
                            </template>
                        </FacetInputSelector>
                    </div>
                </div>
                <FormLabel :label="$t('product.allFacets')" />
            </div>
            <!-- Exclude Facets -->
            <div class="col">
                <div class="row">
                    <div class="col-auto mb-2" v-for="f in excludeFacets" :key="f.id">
                        <div class="input-group mt-1">
                            <span class="input-group-text bg-danger bg-opacity-50">
                                <Icon name="ban" />
                            </span>
                            <div class="form-control">{{ f.$title }}</div>
                            <button class="btn btn-outline-secondary" @click="handleRemoveExcludedFacet(f)">
                                <Icon name="close" />
                            </button>
                        </div>
                    </div>
                    <div class="col-auto">
                        <FacetInputSelector @select="handleAddExcludedFacet" :canEdit="false" :placeholder="$t('product.addFacet')">
                            <template #prepend>
                                <span class="input-group-text bg-danger bg-opacity-25">
                                    <Icon :name="facetConfig.key" />
                                </span>
                            </template>
                        </FacetInputSelector>
                    </div>
                </div>
                <FormLabel :label="$t('product.excludedFacets')" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from "vue"
import { useFilter, type FilterEmits } from "@/regira_modules/vue/entities"
import { config as unitTypeConfig, type Entity as UnitType, InputSelector as UnitTypeInputSelector } from "@/entities/unit-types"
import { config as facetConfig, type Entity as Facet, InputSelector as FacetInputSelector, useEntityStore as useFacetStore } from "@/entities/facets"
import { config as facetGroupConfig, type Entity as FacetGroup, InputSelector as FacetGroupInputSelector } from "@/entities/facet-groups"
import SearchObject from "./SearchObject"
import InputSelector from "../selecting/InputSelector.vue"
import Product from "../data/Entity"
import useEntityStore from "../data/store"

interface Emits extends /* @vue-ignore */ FilterEmits {}
const emit = defineEmits<
    Emits & {
        "update:modelValue": (value: SearchObject) => true
        filter: (value: SearchObject) => true
    }
>()

const props = defineProps<{
    resultCount?: number
    isLoading?: boolean
}>()

const searchObject = defineModel<SearchObject>({ required: true })

const unitType = ref<UnitType>()
const component = ref<Product>()
const assembly = ref<Product>()
const facetGroup = ref<FacetGroup>()
const excludeFacetGroup = ref<FacetGroup>()
const allComponents = ref<Array<Product>>()
const excludeComponents = ref<Array<Product>>()
const allFacets = ref<Array<Facet>>()
const excludeFacets = ref<Array<Facet>>()

const {
    filterIsActive,
    handleReset: handleProductReset,
    handleFilter,
} = useFilter({
    searchObject,
    emit,
    Constructor: SearchObject,
})

function handleReset() {
    handleProductReset()
    unitType.value = undefined
    component.value = undefined
    assembly.value = undefined
    facetGroup.value = undefined
    excludeFacetGroup.value = undefined
    allComponents.value = undefined
    excludeComponents.value = undefined
    allFacets.value = undefined
    excludeFacets.value = undefined
}

watch(allComponents, () => {
    searchObject.value = {
        ...searchObject.value,
        allComponentId: allComponents.value?.map((c) => c.id),
    }
    emit("filter", searchObject.value)
})
watch(excludeComponents, () => {
    searchObject.value = {
        ...searchObject.value,
        excludeComponentId: excludeComponents.value?.map((c) => c.id),
    }
    emit("filter", searchObject.value)
})
watch(allFacets, () => {
    searchObject.value = {
        ...searchObject.value,
        allFacetId: allFacets.value?.map((f) => f.id),
    }
    emit("filter", searchObject.value)
})
watch(excludeFacets, () => {
    searchObject.value = {
        ...searchObject.value,
        excludeFacetId: excludeFacets.value?.map((f) => f.id),
    }
    emit("filter", searchObject.value)
})

function handleAddComponent(product?: Product) {
    if (product && !allComponents.value?.some((c) => c.id === product.id)) {
        allComponents.value = [...(allComponents.value ?? []), product]
    }
}
function handleRemoveComponent(product: Product) {
    allComponents.value = allComponents.value?.filter((c) => c.id !== product.id)
}
function handleAddExcludedComponent(product?: Product) {
    if (product && !excludeComponents.value?.some((c) => c.id === product.id)) {
        excludeComponents.value = [...(excludeComponents.value ?? []), product]
    }
}
function handleRemoveExcludedComponent(product: Product) {
    excludeComponents.value = excludeComponents.value?.filter((c) => c.id !== product.id)
}
function handleAddFacet(facet?: Facet) {
    if (facet && !allFacets.value?.some((f) => f.id === facet.id)) {
        allFacets.value = [...(allFacets.value ?? []), facet]
    }
}
function handleRemoveFacet(facet: Facet) {
    allFacets.value = allFacets.value?.filter((f) => f.id !== facet.id)
}
function handleAddExcludedFacet(facet?: Facet) {
    if (facet && !excludeFacets.value?.some((f) => f.id === facet.id)) {
        excludeFacets.value = [...(excludeFacets.value ?? []), facet]
    }
}
function handleRemoveExcludedFacet(facet: Facet) {
    excludeFacets.value = excludeFacets.value?.filter((f) => f.id !== facet.id)
}

const { service } = useEntityStore()
const { service: facetService } = useFacetStore()
watchEffect(async () => {
    if (searchObject.value.allComponentId != null && allComponents.value == null) {
        allComponents.value = await service.list({ ids: searchObject.value.allComponentId as number[] })
    }
})
watchEffect(async () => {
    if (searchObject.value.excludeComponentId != null && excludeComponents.value == null) {
        excludeComponents.value = await service.list({ ids: searchObject.value.excludeComponentId as number[] })
    }
})
watchEffect(async () => {
    const hasFacetId =
        searchObject.value.allFacetId != null &&
        (!Array.isArray(searchObject.value.allFacetId) || (searchObject.value.allFacetId as Array<number>)?.length)

    if (hasFacetId && allFacets.value == null) {
        allFacets.value = await facetService.list({ ids: searchObject.value.allFacetId as number[] })
    }
})
watchEffect(async () => {
    const hasExcludeFacetId =
        searchObject.value.excludeFacetId != null &&
        (!Array.isArray(searchObject.value.excludeFacetId) || (searchObject.value.excludeFacetId as Array<number>)?.length)
    if (hasExcludeFacetId && excludeFacets.value == null) {
        console.debug("Loading excluded facets", searchObject.value.excludeFacetId)
        excludeFacets.value = await facetService.list({ ids: searchObject.value.excludeFacetId as number[] })
    }
})
</script>
```

## 9. List — `overview/List.vue` (c)

```vue
<template>
    <div class="entity-list">
        <div class="row pb-2 border-bottom border-bottom-1">
            <div class="col-auto">
                <Icon v-if="config.isComplex" name="edit" class="m-1" />
                <FormModalButton v-else disabled class="border-0" />
            </div>
            <div class="col fw-bold">{{ $t("name") }}</div>
            <div class="d-none d-lg-block col-lg col-xl-3 fw-bold">
                {{ $t("product.facets") }}
            </div>
            <div class="d-none d-xl-block col-xl-3 fw-bold">
                {{ $t("product.components") }}
            </div>
            <div class="col-2 d-none d-md-block fw-bold">{{ $t("unitType") }}</div>
            <div class="col-auto fw-bold">
                <Icon name="delete" class="text-muted m-1" />
            </div>
        </div>
        <template v-for="(item, i) in items" :key="item.$id">
            <ListItem
                v-model="items[i]!"
                :readonly="readonly"
                :class="{ 'bg-light': i % 2 == 0 }"
                @request-save="$emit('request-save', $event)"
                @request-remove="$emit('request-remove', $event)"
                @save="$emit('save', $event)"
                @remove="$emit('remove', $event)"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { OverviewEmits } from "@/regira_modules/vue/entities"
import config from "../config/config"
import type Entity from "../data/Entity"
import useEntityStore from "../data/store"
import ListItem from "./ListItem.vue"
import FormModalButton from "../details/FormModalButton.vue"

interface Emits extends /* @vue-ignore */ OverviewEmits<Entity> {}
const emit = defineEmits<Emits>()

const props = defineProps<{
    modelValue?: Array<Entity>
    readonly?: boolean
}>()

const { fromPool } = useEntityStore()

const items = computed<Array<Entity>>({
    get: () => fromPool(props.modelValue || []),
    set: (value) => emit("update:modelValue", value),
})
</script>
```

## 10. List item — `overview/ListItem.vue` (c)

```vue
<template>
    <div class="border-bottom border-bottom-1 py-2">
        <div class="row">
            <div class="col-auto">
                <template v-if="config.isComplex">
                    <!-- Complex entity: Link to input page -->
                    <router-link :to="{ name: config.key + 'Details', params: { id: item.$id } }" class="btn btn-link p-1">
                        <Icon :name="config.key" />
                    </router-link>
                </template>
                <template v-else>
                    <!-- Simple enitty: Open form modal -->
                    <FormModalButton v-model="item" @save="$emit('save', $event)" />
                </template>
            </div>
            <div class="col text-truncate">
                {{ item.$title }}
            </div>
            <div class="d-none d-lg-block col-lg col-xl-3 text-truncate">
                <span v-for="(itemFacet, i) in item.facets" :key="itemFacet.id" class="me-1">
                    {{ getFacet(itemFacet.facet)?.$title }}<span v-if="i < (item.facets ?? []).length - 1">,</span>
                </span>
            </div>
            <div class="d-none d-xl-block col-xl-3 text-truncate">
                <span v-for="(itemComponent, i) in item.components" :key="itemComponent.id" class="me-1">
                    {{ getProduct(itemComponent.component)?.$title }}<span v-if="i < (item.components ?? []).length - 1">,</span>
                </span>
            </div>
            <div class="col-2 d-none d-md-block text-truncate">
                <UnitTypeButton :model-value="item.unitType" />{{ getUnitType(item.unitType)?.$title }}
            </div>
            <div class="col-auto">
                <ConfirmButton icon="delete" class="m-0 p-1" :modal-type="ModalType.danger" @confirm="$emit('request-remove', item)">{{
                    $t("deleteItem", { title: item?.$title })
                }}</ConfirmButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ModalType, ConfirmButton } from "@/regira_modules/vue/ui"
import { formatCurrency } from "@/regira_modules/vue/formatters"
import { type SaveResult } from "@/regira_modules/vue/entities"
import { useEntityStore as useUnitTypeStore, FormModalButton as UnitTypeButton } from "@/entities/unit-types"
import { useEntityStore as useFacetStore, FormModalButton as FacetButton } from "@/entities/facets"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"
import FormModalButton from "../details/FormModalButton.vue"

const emit = defineEmits<{
    (e: "save", args: SaveResult<Entity>): void
    (e: "remove", item: Entity): void
    (e: "request-save", item: Entity): void
    (e: "request-remove", item: Entity): void
}>()
const props = defineProps<{
    readonly?: boolean
}>()

const item = defineModel<Entity>({ required: true })

const { fromPool: getProduct } = useEntityStore()
const { fromPool: getUnitType } = useUnitTypeStore()
const { fromPool: getFacet } = useFacetStore()
</script>
```

## 11. Overview — `overview/Overview.vue`

```vue
<template>
    <section class="overview">
        <div class="row justify-content-between gx-0 gx-sm-1">
            <div class="col col-lg-auto order-1">
                <!-- Filter -->
                <Filter v-model="searchObject" @filter="updateOverviewRoute(true)" @change="updateOverviewRoute(true)" :result-count="itemsCount">
                    <template #adv="{ handleClose }">
                        <slot
                            name="filterAdv"
                            :result-count="itemsCount"
                            :search="updateOverviewRoute"
                            :search-object="searchObject"
                            :paging-info="pagingInfo"
                            :handle-close="handleClose"
                        >
                            <component
                                :is="FilterAdv"
                                v-model="searchObject"
                                :result-count="itemsCount"
                                :is-loading="isLoading"
                                @filter="updateOverviewRoute(true)"
                                @change="updateOverviewRoute(true)"
                                @close="handleClose"
                            />
                        </slot>
                    </template>
                </Filter>
            </div>
            <div class="col-12 col-lg order-3 order-lg-2">
                <Feedback v-bind="{ feedback }" :hideCloseButton="true" />
            </div>
            <div class="col-auto order-2 order-lg-3 ps-2">
                <RouterLink :to="{ name: config.key + 'Details', params: { id: 'new' } }" class="btn btn-info">
                    <Icon name="new" /><span class="d-none d-sm-inline ms-1">{{ $t("new") }}</span>
                </RouterLink>
            </div>
        </div>

        <!-- Paging - ResultSummary -->
        <div class="row">
            <div class="col order-2">
                <template v-if="pagingInfo != null">
                    <Paging
                        class="mt-2"
                        v-show="!isLoading && itemsCount != null && itemsCount > pagingInfo.pageSize!"
                        v-model="pagingInfo"
                        :count="itemsCount || 0"
                        @change="updateOverviewRoute(false)"
                    />
                </template>
            </div>
            <div class="col-12 col-sm-auto order-1 order-sm-3">
                <ResultSummary v-if="items?.length" :visibleCount="items.length" :totalCount="itemsCount" />
            </div>
        </div>

        <!-- List - Loading -->
        <LoadingContainer :is-loading="isLoading">
            <component
                :is="List"
                v-if="items && items.length > 0"
                v-model="items"
                @request-save="handleRequestSave"
                @request-remove="handleRequestRemove"
                @save="handleSave"
                @remove="handleRemove"
                @request-reload="updateOverviewRoute(false)"
            />
            <p v-if="items && items.length <= 0" class="italic-muted">
                {{ $t("noResults") }}
            </p>
        </LoadingContainer>

        <!-- Paging -->
        <template v-if="pagingInfo != null">
            <Paging
                class="mt-2"
                v-show="!isLoading && itemsCount != null && itemsCount > pagingInfo.pageSize!"
                v-model="pagingInfo"
                :count="itemsCount || 0"
                @change="updateOverviewRoute(false)"
            />
        </template>

        <Debug
            :modelValue="{
                pagingInfo,
                items: items?.map((item) => ({
                    ...item,
                    unitType: `${item.unitType?.title}`,
                    components: item.components?.map(
                        ({ id, component, quantity }) => `${component?.title} #${id} (${quantity} ${component?.unitType?.code})`
                    ),
                    facets: item.facets?.map(({ id, facet }) => `${facet?.title} #${id}`),
                })),
            }"
        />
    </section>
</template>

<script setup lang="ts">
import { useSearchView, useRouteOverview, type OverviewEmits } from "@/regira_modules/vue/entities"
import { Paging, LoadingContainer, Feedback } from "@/regira_modules/vue/ui"
import { useAuthStore } from "@/regira_modules/vue/auth"
import ResultSummary from "@/components/ResultSummary.vue"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"
import SearchObject from "../filter/SearchObject"
import Filter from "../filter/Filter.vue"
import FilterAdv from "../filter/FilterAdv.vue"
import List from "./List.vue"

interface Emits extends /* @vue-ignore */ OverviewEmits<Entity> {}
defineEmits<
    Emits & {
        "update:modelValue": (value: SearchObject) => true
        filter: (value: SearchObject) => true
    }
>()

const { service } = useEntityStore()

const { searchObject, pagingInfo, items, itemsCount, isLoading, feedback, applySave, applyRemove, handleSave, handleRemove, searchHandler } =
    useSearchView<Entity, SearchObject>({
        service,
        searchObject: new SearchObject(),
        defaultPageSize: config.defaultPageSize,
    })
const { updateOverviewRoute } = useRouteOverview({
    searchObject,
    pagingInfo,
    handler: searchHandler,
    defaultPageSize: config.defaultPageSize,
})

// trigger searchHandler when logging in or refreshing token
const authStore = useAuthStore()
authStore.$onAction(({ name, after }) => ["login", "refresh"].includes(name) && after(() => authStore.isAuthenticated && searchHandler(false)))

async function handleRequestSave(item: Entity) {
    const result = await applySave(item)
    if (result != null) {
        handleSave(result)
    }
}
async function handleRequestRemove(item: Entity) {
    await applyRemove(item)
    handleRemove(item)
}
</script>
```

> The `Debug` block above references `item.unitType` / `item.components` / `item.facets` — these are the
> `Product`-specific relations from `data/Entity.ts`. When copying this boilerplate `Overview.vue` to
> another entity, adjust that `Debug` projection to your own relations (or drop it).

## 12. Details — `details/Details.vue`

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
import { useAuthStore } from "@/regira_modules/vue/auth"
import { LoadingContainer, Feedback } from "@/regira_modules/vue/ui"
import { useDetails } from "@/regira_modules/vue/entities/details"
import { FormStates } from "@/regira_modules/vue/entities/form"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"

const { service } = useEntityStore()

const { item, isLoading, overviewUrl, load, feedback } = useDetails(service)

// trigger load when logging in (only load when item has not been loaded before)
const authStore = useAuthStore()
authStore.$onAction(({ name, after }) => name == "login" && after(() => item.value == null && authStore.isAuthenticated && load()))

const router = useRouter()
function handleRemove() {
    router.push(overviewUrl || { name: config.key + "Overview" })
}
</script>
```

## 13. Form — `details/Form.vue` (c)

```vue
<template>
    <form @submit.prevent="handleSubmit" :modelValue="item">
        <div class="row form-buttons">
            <div class="col col-md-auto order-1">
                <FormButtonsRow
                    :item="item"
                    :readonly="readonly"
                    :feedback="feedback"
                    :show-delete="item?.id > 0"
                    @cancel="handleCancel"
                    @remove="handleRemove"
                    @restore="handleRestore"
                />
            </div>
            <div class="col-auto order-2 order-md-3">
                <RouterLink
                    v-if="isPopup"
                    :to="{ name: `${config.key}Details`, params: { id: item.$id } }"
                    class="btn btn-default py-1"
                    target="_blank"
                    :title="$t('popOut')"
                >
                    <Icon name="popOut" />
                </RouterLink>
                <RouterLink v-else-if="overviewUrl" :to="overviewUrl" class="btn btn-info py-1">
                    <Icon name="list" />
                    <span class="d-none d-md-inline ms-1">{{ $t("overview") }}</span>
                </RouterLink>
            </div>
            <div class="col-md order-3 order-md-2">
                <Feedback :feedback="feedback" />
            </div>
        </div>

        <TabContainer :tabs="tabs" :active="initialTab" :use-route-nav="!isPopup">
            <template #form>
                <div class="row">
                    <div class="col-lg mb-2">
                        <FormSection :title="$t(config.detailsTitle || '')" :readonly="readonly">
                            <div class="row">
                                <div class="col-lg mb-2">
                                    <div class="input-group">
                                        <div class="input-group-text">
                                            <Icon name="title" />
                                        </div>
                                        <input v-model="item.title" maxlength="128" :readonly="readonly" class="form-control" />
                                    </div>
                                    <FormLabel :label="$t('name')" />
                                </div>
                            </div>
                            <div class="row">
                                <div class="col mb-2">
                                    <UnitTypeInputSelector v-model="item.unitType" v-model:idValue="item.unitTypeId" :readonly="readonly" />
                                    <FormLabel :label="$t('unitType')" />
                                </div>
                                <div class="col mb-2">
                                    <input
                                        type="number"
                                        v-model.number="item.defaultQuantity"
                                        :readonly="readonly"
                                        class="form-control"
                                        min="0"
                                        step="any"
                                    />
                                    <FormLabel :label="$t('product.defaultQuantity')" />
                                </div>
                            </div>
                            <div class="row">
                                <div class="col mb-2">
                                    <DescriptionInput v-model="item.description" :label="$t('description')" :readonly="readonly" />
                                </div>
                            </div>
                        </FormSection>

                        <FormSection :title="$t('product.suppliers')" class="d-none d-lg-block">
                            <SupplierInputSelectorOverview v-model="item" />
                        </FormSection>
                    </div>
                    <div class="col mb-2 d-none d-lg-block">
                        <FormSection :title="$t('product.facets')">
                            <InputSelectorInline v-model="item" />
                        </FormSection>

                        <FormSection :title="$t('product.components')">
                            <ComponentOverview v-model="item" />
                        </FormSection>
                    </div>
                </div>
            </template>

            <template #components>
                <FormSection :title="$t('product.components')">
                    <ComponentOverview v-model="item" />
                </FormSection>
            </template>

            <template #assemblies>
                <AssemblyOverview :product="item" />
            </template>

            <template #suppliers>
                <FormSection :title="$t('product.suppliers')">
                    <SupplierInputSelectorOverview v-model="item" />
                </FormSection>
            </template>

            <template #tree>
                <TreeOverview :item="item" />
            </template>
        </TabContainer>

        <Debug
            :modelValue="{
                screen: { size: screen.size },
                item: {
                    ...item,
                    unitType: item.unitType?.title,
                    components: item.components?.map(
                        ({ id, component, quantity }) => `${component?.title} (${quantity} ${component?.unitType?.title}) #${id}`
                    ),
                    facets: item.facets?.map(({ id, facet }) => `${facet?.title} #${id}`),
                    suppliers: item.suppliers?.map(({ id, supplier }) => `${supplier?.name} #${id}`),
                },
            }"
        />
    </form>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { RouteRecordRaw } from "vue-router"
import { useLang } from "@/regira_modules/vue/lang"
import { Feedback, TabContainer, Tab, useScreen } from "@/regira_modules/vue/ui"
import { FormButtonsRow } from "@/components/input"
import { useForm, type FormEmits, formDefaults } from "@/regira_modules/vue/entities"
import { SelectorDropdown as UnitTypeInputSelector } from "@/entities/unit-types"
import AssemblyOverview from "@/entities/products/product-assemblies/Overview.vue"
import ComponentOverview from "@/entities/products/product-components/Overview.vue"
import { InputSelectorInline } from "@/entities/products/product-facets/"
import { InputSelectorOverview as SupplierInputSelectorOverview } from "@/entities/products/product-suppliers/"
import TreeOverview from "../tree/Overview.vue"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"

interface Emits extends /* @vue-ignore */ FormEmits<Entity> {}
const emit = defineEmits<Emits>()

const props = withDefaults(
    defineProps<{
        modelValue: Entity
        readonly?: boolean
        overviewUrl?: string | RouteRecordRaw
        isPopup?: boolean
        initialTab?: string
    }>(),
    { ...formDefaults }
)

const { screen } = useScreen()

const { service: entityService } = useEntityStore()

const { item, feedback, handleCancel, handleSubmit, handleRemove, handleRestore } = useForm<Entity>({
    entityService,
    props,
    emit,
})

// Tabs
const { translate } = useLang()
const tabs = computed(() =>
    [
        Tab.create("form", { icon: "form", title: translate("form"), isDefault: true }),
        !screen.isLarge ? Tab.create("components", { icon: "component", title: translate("product.components") }) : null,
        Tab.create("tree", { icon: "tree", title: translate("tree"), isDisabled: !item.value.components?.length }),
        Tab.create("assemblies", { icon: "assembly", title: translate("assemblies") }),
        !screen.isLarge ? Tab.create("suppliers", { icon: "supplier", title: translate("product.suppliers") }) : null,
    ].filter((tab) => tab)
)
</script>
```

## 14. Form modal button — `details/FormModalButton.vue`

```vue
<template>
    <button type="button" class="btn btn-default" @click="open">
        <slot>
            <Icon :name="config.key" />
        </slot>
        <Teleport to="#modals">
            <MyModal
                :is-visible="isOpen"
                :title="modalTitle || $t(config.detailsTitle || '')"
                :showFooter="false"
                :full-width="fullWidth"
                @close="close"
                @cancel="handleCancel"
                @submit="handleSave"
            >
                <Form
                    v-model="item"
                    :initial-tab="initialTab"
                    :readonly="readonly"
                    :is-popup="true"
                    @cancel="handleCancel"
                    @save="handleSave"
                    @remove="handleRemove"
                />
            </MyModal>
        </Teleport>
    </button>
</template>

<script setup lang="ts">
import { computed, type Ref } from "vue"
import { FormStates, useModal, type FormModalEmits, type SaveResult } from "@/regira_modules/vue/entities"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"
import Form from "./Form.vue"

interface Emits extends /* @vue-ignore */ FormModalEmits<Entity> {}
const emit = defineEmits<
    Emits & {
        "update:modelValue": (item?: Entity) => true
        save: (result: SaveResult<Entity>) => true
        remove: (item: Entity) => true
        restore: (item: Entity) => true
        cancel: (arg: { canceled: Entity; original?: Entity }) => true
        changeState: (state: FormStates) => true
        open: (item: Entity, update: (newItem: Entity) => void) => true
        close: (item?: Entity) => true
    }
>()

const props = withDefaults(
    defineProps<{
        readonly?: boolean
        itemDefaults?: Ref<Record<string, any>> | Record<string, any>
        initialTab?: string
        label?: string
        closeOnSave?: boolean
        fullWidth?: boolean
    }>(),
    {
        fullWidth: config.isComplex,
    }
)

const modelRef = defineModel<Entity>()
const { service: entityService } = useEntityStore()

const modalTitle = computed(() => props.label || (modelRef.value != null && entityService.toEntity(modelRef.value).$title))
const { item, isOpen, close, open, handleSave, handleRemove, handleCancel } = useModal<Entity>({
    entityService,
    model: modelRef,
    itemDefaults: props.itemDefaults,
    closeOnSave: props.closeOnSave,
    closeOnCancel: false,
    closeOnDelete: true,
    emit,
})
</script>
```

## 15. Autocomplete — `selecting/Autocomplete.vue`

Modify this file when the text to display is not just `$title`.

```vue
<template>
    <Autocomplete
        v-model="item"
        :search="search"
        :max-results="maxResults"
        :id-selector="idSelector"
        :display-item-formatter="displayItemFormatter"
        :placeholder="placeholder"
        ref="autoEl"
    >
        <template #default="{ item }">
            <div class="row">
                <div class="col">{{ item.$title }}</div>
            </div>
        </template>
    </Autocomplete>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { Autocomplete } from "@/regira_modules/vue/ui"
import { get } from "@/regira_modules/vue/ioc"
import type { IEntityService } from "@/regira_modules/vue/entities"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"

const emit = defineEmits<{
    (e: "update:modelValue", args?: Entity): void
    (e: "update:idValue", args?: number): void
    (e: "select", args?: Entity): void
}>()
const props = withDefaults(
    defineProps<{
        modelValue?: Entity
        maxResults?: number
        filterDefaults?: Record<string, any>
        placeholder?: string
    }>(),
    { maxResults: 10 }
)

const { fromPool } = useEntityStore()
const item = computed({
    get: () => fromPool(props.modelValue) as Entity,
    set: (value) => {
        emit("update:modelValue", value)
        emit("update:idValue", value?.id)
        emit("select", value)
    },
})

// expose refs
const autoEl = ref<any>(null)
watch(item, () => {
    if (item.value == null) {
        autoEl.value?.resetQ()
    }
})

const entityService = get<IEntityService<Entity>>(Entity.name)!
const search = (q: string) =>
    entityService.list({
        ...props.filterDefaults,
        title: (q?.split(" ") || []).map((x) => `*${x}*`).join(" "),
        pageSize: props.maxResults,
    })
const idSelector = (item?: Entity) => item?.$id?.toString()
const displayItemFormatter = (item?: Entity) => item?.$title as string
</script>
```

## 16. Input selector — `selecting/InputSelector.vue`

```vue
<template>
    <div class="input-selector input-group text-nowrap">
        <slot name="prepend">
            <FormModalButton
                v-if="canEdit"
                v-model="item"
                :item-defaults="itemDefaults"
                :readonly="readonly"
                :close-on-save="closeOnSave"
                class="btn btn-outline-secondary"
                @save="({ saved }) => handleSelect(saved)"
            >
                <Icon :name="config.key" v-if="item?.id" />
                <Icon v-else name="new" />
            </FormModalButton>
        </slot>
        <slot>
            <Autocomplete
                class="form-control"
                v-model="item"
                :filter-defaults="filterDefaults"
                :readonly="readonly"
                :placeholder="placeholder"
                @select="handleSelect"
                ref="autoEl"
            />
        </slot>
        <slot name="append">
            <template v-if="!readonly">
                <button v-if="!readonly" type="button" v-show="item != null" class="btn btn-outline-secondary" @click="handleSelect(undefined)">
                    <Icon name="clear" />
                </button>
                <SelectorModalButton
                    v-model="item"
                    :filter-defaults="filterDefaults"
                    :disabled="readonly"
                    @select="handleSelect"
                    class="btn btn-outline-info"
                />
            </template>
        </slot>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, type Ref } from "vue"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"
import FormModalButton from "../details/FormModalButton.vue"
import Autocomplete from "./Autocomplete.vue"
import SelectorModalButton from "./SelectorModalButton.vue"

const emit = defineEmits<{
    (e: "update:modelValue", args?: Entity): void
    (e: "update:idValue", args?: number | string): void
    (e: "select", args?: Entity): void
}>()
const props = withDefaults(
    defineProps<{
        modelValue?: Entity
        idValue?: number | string
        readonly?: boolean
        canEdit?: boolean
        itemDefaults?: Ref<Record<string, any>> | Record<string, any>
        filterDefaults?: Record<string, any>
        closeOnSave?: boolean
        placeholder?: string
    }>(),
    {
        canEdit: true,
    }
)

const { fromPool, list } = useEntityStore()
const item = computed<Entity | undefined>({
    get: () => fromPool(props.modelValue) as Entity,
    set: (value) => {
        emit("update:modelValue", value)
        emit("update:idValue", value?.id)
    },
})

function handleSelect(selected?: Entity) {
    if (item.value?.id != selected?.id) {
        item.value = selected // emit
        emit("select", selected)
    }
}

onMounted(async () => {
    if (props.idValue && !props.modelValue?.id) {
        const model = await list({ id: props.idValue })
        emit("update:modelValue", model[0])
    }
})
</script>
```

## 17. Selector — `selecting/Selector.vue`

```vue
<template>
    <div class="row g-1">
        <div v-for="(item, i) in items" :key="item.id" class="col-auto">
            <div class="text-nowrap p-2 border rounded-1">
                <FormModalButton v-model="items![i]" class="m-0 p-0" />
                {{ item.title }}
                <IconButton icon="delete" class="m-0 py-0 px-1" @click="handleRemove(item)" />
            </div>
        </div>
        <div class="col-auto">
            <InputSelector v-model="newItem" @select="handleSelect" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import useEntityStore from "../data/store"
import type Entity from "../data/Entity"
import FormModalButton from "../details/FormModalButton.vue"
import InputSelector from "./InputSelector.vue"

const emit = defineEmits<{
    (e: "update:modelValue", args: Array<Entity>): void
    (e: "update:idsValue", args: Array<number>): void
}>()
const props = defineProps<{
    modelValue?: Array<Entity>
    idsValue?: Array<number>
}>()

const { fromPool, list } = useEntityStore()
const items = computed<Array<Entity>>({
    get: () => fromPool(props.modelValue || []) as Array<Entity>,
    set: (value) => emit("update:modelValue", value as Array<Entity>),
})

const newItem = ref<Entity>()
function handleSelect(selected?: Entity) {
    if (selected == null) {
        return
    }

    if (items.value.every((x) => x.$id != selected?.$id)) {
        const newVal = [...items.value, selected]
        emit(
            "update:idsValue",
            newVal.map((x) => x.id!)
        )
        emit("update:modelValue", newVal)
    }
    newItem.value = undefined
}
function handleRemove(selected: Entity) {
    const newVal = items.value.filter((x) => x.$id != selected?.$id)
    emit(
        "update:idsValue",
        newVal.map((x) => x.id!)
    )
    emit("update:modelValue", newVal)
}

onMounted(async () => {
    if ((props.idsValue?.length || 0) > 0 && props.modelValue?.length != props.idsValue?.length) {
        const models = await list({ id: props.idsValue })
        emit("update:modelValue", models)
    }
})
</script>
```

## 18. Selector dropdown — `selecting/SelectorDropdown.vue`

```vue
<template>
    <select v-model="selectedId" class="form-select">
        <option :value="undefined"></option>
        <option v-for="item in items" :value="item.id" :key="item.id">
            {{ item.title }}
        </option>
    </select>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, type Ref } from "vue"
import type Entity from "../data/Entity"
import useEntityStore from "../data/store"

const selectedItem = defineModel<Entity>()
const selectedId = defineModel<number>("idValue")
watch(selectedId, () => (selectedItem.value = items.value.find((x) => x.id == selectedId.value)))

const { fromCache } = useEntityStore()
const items = computed(() => (fromCache() as Array<Ref<Entity>>)!.map((x) => x.value))
onMounted(() => {
    if (!selectedItem.value && selectedId.value) {
        selectedItem.value = items.value.find((x) => x.id == selectedId.value)
    }
})
</script>
```

## 19. Selector list — `selecting/SelectorList.vue` (c)

```vue
<template>
    <div class="entity-list">
        <div class="row pb-2 border-bottom border-bottom-1">
            <div class="col-auto fw-bold">
                <IconButton icon="select" class="btn-default py-0 px-1 border-0" disabled />
            </div>
            <div class="col fw-bold">{{ $t("name") }}</div>
            <div class="col-4 col-lg-2 d-none d-md-block fw-bold">
                {{ $t("unitType") }}
            </div>
        </div>

        <template v-for="(item, i) in items" :key="item.$id">
            <div class="row border-bottom border-bottom-1 py-2" :class="{ 'is-selected': isSelected(item) }">
                <div class="col-auto">
                    <IconButton :icon="isSelected(item) ? 'selected' : 'select'" class="btn-default py-0 px-1" @click="handleSelect(item)" />
                </div>
                <div class="col text-truncate">
                    <FormModalButton :modelValue="item" class="p-1" />
                    {{ item.$title }}
                </div>
                <div class="col-4 col-lg-2 d-none d-md-block text-truncate">
                    <UnitTypeButton :model-value="item.unitType" />{{ getUnitType(item.unitType)?.$title }}
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { type OverviewEmits } from "@/regira_modules/vue/entities"
import { useEntityStore as useUnitTypeStore, FormModalButton as UnitTypeButton } from "@/entities/unit-types"
import type Entity from "../data/Entity"
import useEntityStore from "../data/store"
import FormModalButton from "../details/FormModalButton.vue"

interface Emits extends /* @vue-ignore */ OverviewEmits<Entity> {}
const emit = defineEmits<
    Emits & {
        (e: "update:modelValue", value: Array<Entity>): void
        (e: "update:selected", value?: Entity): void
        (e: "select", selected?: Entity): void
    }
>()

const props = defineProps<{
    modelValue?: Array<Entity>
    selected?: Entity
}>()

const isSelected = computed(() => (item: Entity) => item.$id == props.selected?.$id)
const { fromPool } = useEntityStore()
const items = computed<Array<Entity>>({
    get: () => fromPool(props.modelValue || []),
    set: (value) => emit("update:modelValue", value),
})

function handleSelect(item?: Entity) {
    emit("select", item?.$id !== props.selected?.$id ? item : undefined)
}

const { fromPool: getUnitType } = useUnitTypeStore()
</script>
```

## 20. Selector modal button — `selecting/SelectorModalButton.vue`

```vue
<template>
    <button type="button" class="btn btn-default" @click="open">
        <slot><Icon name="search" /></slot>
        <Teleport to="#modals">
            <MyModal
                :is-visible="isOpen"
                :title="modalTitle || $t(config.overviewTitle || '')"
                :showFooter="true"
                :full-width="true"
                @close="close"
                @cancel="handleCancel"
                @submit="handleSubmit"
            >
                <SelectorSearch v-model="selected" :filter-defaults="filterDefaults" :item-defaults="itemDefaults" :page-size="maxResults" />
            </MyModal>
        </Teleport>
    </button>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, type Ref } from "vue"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"
import SelectorSearch from "./SelectorSearch.vue"

const emit = defineEmits<{
    (e: "update:modelValue", selected?: Entity): void
    (e: "select", selected?: Entity): void
}>()
const props = withDefaults(
    defineProps<{
        modelValue?: Entity
        filterDefaults?: Record<string, any>
        itemDefaults?: Ref<Record<string, any>> | Record<string, any>
        label?: string
        maxResults?: number
    }>(),
    { maxResults: 5 }
)

const selected = ref<Entity>()
const isOpen = ref(false)
const { service: entityService } = useEntityStore()
const modalTitle = computed(() => props.label || entityService.toEntity(props.modelValue || {}).$title)

function open() {
    selected.value = props.modelValue
    isOpen.value = true
}
function close() {
    isOpen.value = false
}
function handleCancel() {
    close()
}
function handleSubmit() {
    emit("update:modelValue", selected.value)
    emit("select", selected.value)
    close()
}

watchEffect(() => (selected.value = props.modelValue))
</script>
```

## 21. Selector search — `selecting/SelectorSearch.vue`

```vue
<template>
    <section class="selector-search">
        <div class="row mt-2">
            <div class="col col-md-auto order-1">
                <!-- Filter -->
                <Filter v-model="searchObject" :result-count="itemsCount" @filter="searchHandler(true)" @change="searchHandler(true)">
                    <template #inline="{ handleToggle }">
                        <slot
                            name="inline"
                            :result-count="itemsCount"
                            :search="searchHandler"
                            :search-object="searchObject"
                            :paging-info="pagingInfo"
                            :handle-toggle="handleToggle"
                        >
                            <FilterInline
                                v-model="searchObject"
                                :result-count="itemsCount"
                                @filter="searchHandler(true)"
                                @change="searchHandler(true)"
                                @toggle-adv="handleToggle"
                            />
                        </slot>
                    </template>
                    <template #adv="{ handleClose }">
                        <slot
                            name="filterAdv"
                            :result-count="itemsCount"
                            :search="searchHandler"
                            :search-object="searchObject"
                            :paging-info="pagingInfo"
                            :handle-close="handleClose"
                        >
                            <component
                                :is="FilterAdv"
                                v-model="searchObject"
                                :result-count="itemsCount"
                                @filter="searchHandler(true)"
                                @change="searchHandler(true)"
                                @close="handleClose"
                            />
                        </slot>
                    </template>
                </Filter>
            </div>
            <div class="col-12 col-md order-3 order-md-2">
                <div class="overflow-hidden">
                    <Feedback v-bind="{ feedback }" :hideCloseButton="true" />
                    <div v-show="!feedback.status.value" class="row g-0">
                        <div class="col-auto">
                            <div v-if="selected?.id" class="form-control bg-info py-0">
                                <IconButton icon="selected" class="px-1 me-1" @click="handleSelect(undefined)" />
                                <FormModalButton v-model="selected" class="px-1" />
                                {{ selected.$title }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-auto order-2 mb-2">
                <FormModalButton :item-defaults="itemDefaults" :close-on-save="true" @save="({ saved }) => handleSelect(saved)" class="btn btn-info">
                    <Icon name="new" />
                    <span class="d-none d-sm-inline">{{ $t("new") }}</span>
                </FormModalButton>
            </div>
        </div>

        <!-- Paging - ResultSummary -->
        <div class="row">
            <div class="col order-2">
                <template v-if="pagingInfo != null">
                    <Paging
                        class="mt-2"
                        v-show="!isLoading && itemsCount != null && itemsCount > pagingInfo.pageSize!"
                        v-model="pagingInfo"
                        :button-type="ButtonType.button"
                        :count="itemsCount || 0"
                        @change="searchHandler(false)"
                    />
                </template>
            </div>
            <div class="col-12 col-sm-auto order-1 order-sm-3">
                <ResultSummary v-if="items?.length" :visibleCount="items.length" :totalCount="itemsCount" />
            </div>
        </div>

        <!-- List - Loading -->
        <LoadingContainer :is-loading="isLoading">
            <slot name="list" :items="items" :search-object="searchObject" :paging-info="pagingInfo">
                <component :is="List" v-model="items" :selected="selected" @select="handleSelect" />
            </slot>
        </LoadingContainer>

        <!-- Paging -->
        <template v-if="pagingInfo != null">
            <Paging
                class="mt-2"
                v-show="!isLoading && itemsCount != null && itemsCount > pagingInfo.pageSize!"
                v-model="pagingInfo"
                :button-type="ButtonType.button"
                :count="itemsCount || 0"
                @change="searchHandler(false)"
            />
        </template>

        <Debug :modelValue="{ items }" />
    </section>
</template>

<script setup lang="ts">
import { onMounted, type Ref } from "vue"
import { useSearchView } from "@/regira_modules/vue/entities"
import { Paging, LoadingContainer, Feedback, ButtonType } from "@/regira_modules/vue/ui"
import ResultSummary from "@/components/ResultSummary.vue"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"
import SearchObject from "../filter/SearchObject"
import FormModalButton from "../details/FormModalButton.vue"
import FilterInline from "../filter/FilterInline.vue"
import FilterAdv from "../filter/FilterAdv.vue"
import Filter from "../filter/Filter.vue"
import List from "./SelectorList.vue"

const props = defineProps<{
    filterDefaults?: Record<string, any>
    itemDefaults?: Ref<Record<string, any>> | Record<string, any>
    pageSize?: number
}>()

const selected = defineModel<Entity>()

const { service } = useEntityStore()

const {
    searchObject,
    pagingInfo,

    items,
    itemsCount,

    isLoading,
    feedback,

    searchHandler,
} = useSearchView<Entity, SearchObject>({
    service,
    searchObject: Object.assign(new SearchObject(), props.filterDefaults || {}),
    defaultPageSize: props.pageSize || config.defaultPageSize,
})

console.debug("SelectorSearch", {
    searchObject,
    pagingInfo,
    items,
    itemsCount,
})

function handleSelect(item?: Entity) {
    feedback.success(item != null ? `${item.$title} selected` : `selection removed`)
    selected.value = item
}

onMounted(searchHandler)
</script>
```

## 22. Barrel — `index.ts`

```ts
export { default as config } from "./config/config"
export { default as Entity } from "./data/Entity"
export { default as EntityService } from "./data/EntityService"
export { default as useEntityStore } from "./data/store"

export { default as Filter } from "./filter/Filter.vue"
export { default as FilterInline } from "./filter/FilterInline.vue"
export { default as FilterAdv } from "./filter/FilterAdv.vue"

export { default as Autocomplete } from "./selecting/Autocomplete.vue"
export { default as SelectorDropdown } from "./selecting/SelectorDropdown.vue"
export { default as FormModalButton } from "./details/FormModalButton.vue"
export { default as InputSelector } from "./selecting/InputSelector.vue"
export { default as Selector } from "./selecting/Selector.vue"
export { default as SelectorList } from "./selecting/SelectorList.vue"
export { default as SelectorSearch } from "./selecting/SelectorSearch.vue"
export { default as SelectorModalButton } from "./selecting/SelectorModalButton.vue"

export { default as Overview } from "./overview/Overview.vue"
export { default as List } from "./overview/List.vue"
export { default as Details } from "./details/Details.vue"
export { default as Form } from "./details/Form.vue"

export { default as plugin } from "./setup"
```

## 23. Plugin — `setup.ts`

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
        {
            path: `/${config.routePrefix}`,
            name: `${key}Overview`,
            component: Overview,
        },
        {
            path: `/${config.routePrefix}/:id`,
            name: `${key}Details`,
            component: Details,
            children: [
                {
                    path: "details",
                    name: `${key}Fiche`,
                    component: DetailsSummary,
                },
                {
                    path: "edit",
                    name: `${key}Form`,
                    component: Form,
                },
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

## App aggregator

The slice above ends at `setup.ts`. The app-level aggregator — `src/entities/index.ts`, which gathers
every slice's plugin and installs them in one `app.use(...)` (registration order drives navigation) — is
not part of an individual slice and lives in the app shell.

> **→ See:** [entities.setup.md](entities.setup.md#add-entities) — Add entities (the `src/entities/index.ts`
> aggregator).

## See also

- [entities.advanced.example.md](entities.advanced.example.md) — the complete COMPLEX slice (`Vehicle`):
  attachments service, many-to-many link model, owned child collection, and a tree. It points back here
  for the byte-identical picker boilerplate.
- [entities.setup.md](entities.setup.md#entity-slice-anatomy) — the slice folder anatomy (the `(c)` legend)
  and the app shell that hosts this slice (tooling, router, navigation, aggregator, views).
- [entities.patterns.md](entities.patterns.md) — per-feature recipes: child collections, trees, JSON
  services, paging, soft-delete, relation pickers.
- [entities.signatures.md](entities.signatures.md) — exact TypeScript signatures ·
  [entities.namespaces.md](entities.namespaces.md) — import-specifier reference.
