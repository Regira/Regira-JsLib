# Regira JsLib Entities — Advanced Worked Example (`Vehicle`)

ONE complete **complex** slice — `Vehicle`, copied verbatim from the reference
[RegiraFleet](https://github.com/Regira) `vehicles` slice. This is the advanced counterpart of the basic
[`Product`](entities.examples.md) slice: it shows every per-entity file plus the patterns a simple slice
omits. Where the basic example is fully self-contained, this file is self-contained for everything
**Vehicle-specific** and for the **advanced features**; for the handful of byte-identical picker/shell
boilerplate files it points back to the Product slice rather than reprinting them.

> **Reading order** (use everywhere): `instructions` → `setup` (new app) → `namespaces` → `signatures` →
> `examples` (basic slice) / **`advanced.example`** (this file) → `patterns` (recipes, load on demand).
> Read [entities.examples.md](entities.examples.md) first if you have not built a slice before — this file
> assumes the boilerplate it establishes.

## What this adds over the basic example

The `Product` slice covers the minimal per-entity set (config, model, plain service, search object, form,
list, selectors, setup). `Vehicle` layers on four things a simple slice does not have:

| Delta | Where, in this file | Mechanism |
|---|---|---|
| **Attachments** (upload/download) | §4 service (`getAttachments`/`addAttachment`, `insert`/`update` overrides), §5 form `files` tab | `EntityService` round-trips files via the app-local `entity-attachments` helpers; service constructed with an `AxiosWithFilesInstance` (§13) |
| **Many-to-many link model** | §3 `VehicleInterventionType`, §5 form (`itemInterventionTypes` computed) | a join entity with `_deleted` + `create()`; the form flattens links to a selector and rebuilds them on write-back |
| **Owned child collection** | §6 `vehicle-interventions/Overview.vue` (embedded `interventions` tab) | a child list resolved from the IoC container and (re)loaded on save |
| **Hierarchical tree** | _not in the Vehicle slice_ — see redirect below | `useTree` / `useDragDrop` — recipe in [entities.patterns.md — Hierarchical (tree) entities](entities.patterns.md) |

> **Fidelity note (CONTRACT §6).** Every code block below is reproduced **verbatim** from the reference
> app — templates included — so both markup and `<script setup>` wiring are normative. Two scope caveats:
>
> - The Vehicle child collection (§6) is a **hand-rolled** read-mostly list (resolve service from IoC →
>   load on mount/after-save). It is the owned-collection pattern as the reference app ships it; it does
>   **not** use the `useOwnedCollection` composable. For the inline-editable `useOwnedCollection` /
>   `useOwnedModal` variant, see the recipe at
>   [entities.patterns.md — Owned (child) collections](entities.patterns.md#owned-child-collections).
> - The Vehicle slice has **no tree**. `useTree` is listed above as a delta the basic example also lacks;
>   its worked recipe lives in [entities.patterns.md — Hierarchical (tree) entities](entities.patterns.md#hierarchical-tree-entities)
>   (which links the `treelist` module). It is **not** fabricated into the Vehicle slice here.
>
> Imports use the demo alias `@/regira_modules/...` for library code and app-local aliases
> (`@/entities/...`, `@/components/...`, `../...`) for app code. In a plain npm install, drop the `@/` from
> the `regira_modules` paths (`regira_modules/...`) and resolve app-local imports against your own app.
> Resolve any `regira_modules` import you don't recognise from
> [entities.namespaces.md](entities.namespaces.md); never guess one.

## 1. Config — `config/config.ts`

```ts
import type { IConfig } from "@/regira_modules/vue/entities"
import Entity from "../data/Entity"

const api = "/vehicles"

const config: IConfig = {
    id: Entity.name,
    key: "Vehicle",

    routePrefix: "vehicles",
    baseQueryParams: {
        includes: ["Brand", "VehicleType"],
    },

    overviewTitle: "vehicles",
    detailsTitle: "vehicle",
    description: "vehiclesDescription",
    icon: "bi bi-car-front",

    defaultPageSize: 10,

    api,
    detailsUrl: api,
    listUrl: api,
    searchUrl: api + "/search",
    saveUrl: api,
    deleteUrl: api,
}

export default config
```

## 2. Model — `data/Entity.ts`

```ts
import { EntityBase } from "@/regira_modules/vue/entities"
import type { Entity as Brand } from "../../brands"
import type { Entity as VehicleType } from "../../vehicle-types"
import type { EntityLabel } from "@/entities/entity-labels"
import type { Entity as EntityAttachment } from "../../entity-attachments"
import type { VehicleInterventionType } from "./VehicleInterventionType"

export class Vehicle extends EntityBase {
    id: number = 0
    code: string
    model: string

    brandId?: number
    vehicleTypeId?: number

    notes?: string

    created: Date
    lastModified?: Date

    brand?: Brand
    vehicleType?: VehicleType
    labels?: Array<EntityLabel>
    interventionTypes?: Array<VehicleInterventionType>
    attachments?: Array<EntityAttachment>

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return `${this.code || ""} ${this.vehicleType?.title || ""}`.trim()
    }
}

export const Entity = Vehicle

export default Vehicle
```

## 3. Intervention-type link — `data/VehicleInterventionType.ts`

The join model for the many-to-many `Vehicle`↔`InterventionType` relation. `_deleted` lets the form mark a
link for removal without dropping it from the array before save; `create()` builds an instance from a plain
payload. The form (§5) maps this collection to/from a flat list of `InterventionType`.

```ts
import type InterventionType from "@/entities/intervention-types/data/Entity";
import { EntityBase } from "@/regira_modules/vue/entities";

export class VehicleInterventionType extends EntityBase {
    id: number = 0
    interventionTypeId: number
    vehicleId: number

    interventionType: InterventionType
    
    _deleted: boolean = false

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return this.interventionType?.title ?? "New intervention type"
    }

    static create(values?: object): VehicleInterventionType {
        return Object.assign(new VehicleInterventionType(), values || {})
    }
}
```

## 4. Service (with attachments) — `data/EntityService.ts`

The "with attachments" variant of the boilerplate service: it overrides `insert`/`update` to round-trip files via
`insertWithAttachments`/`updateWithAttachments`, exposes `getAttachments`/`addAttachment` endpoints built off
`this.config.api`, and `prepareItem` drops soft-deleted children before save. The constructor takes an
`AxiosWithFilesInstance` (not a plain `AxiosInstance`) — see `setup.ts` (§13).

> **API check (CONTRACT §6).** `AxiosWithFilesInstance` and `createQueryString` are verified
> `regira_modules/vue/http` exports — see [entities.signatures.md §10](entities.signatures.md#10-wiring-ioc--http)
> (`AxiosWithFilesInstance` adds `getFile`/`upload`; `createQueryString(o): URLSearchParams`). The
> `insertWithAttachments` / `updateWithAttachments` / `createEntity` / `save` helpers are **app-local**
> (imported from `../../entity-attachments`, your own attachments slice), not library APIs — do not look
> for them in the `regira_modules` reference.

```ts
import { type AxiosWithFilesInstance, createQueryString } from "@/regira_modules/vue/http"
import { EntityServiceBase, type ListResult, type IConfig } from "@/regira_modules/vue/entities"
import { Entity as EntityAttachment, insertWithAttachments, updateWithAttachments, createEntity, save as saveAttachments } from "../../entity-attachments"
import Entity from "./Entity"

export class EntityService extends EntityServiceBase<Entity> {
    constructor(axios: AxiosWithFilesInstance, config: IConfig) {
        super(axios, config)
        console.debug("VehicleService", this, { config })
    }

    async getAttachments(so?: object): Promise<Array<EntityAttachment>> {
        const url = `${this.config.api}/attachments`
        const queryString = createQueryString(so || {})
        const {
            data: { items },
        } = await this.axios.get<ListResult<EntityAttachment>>(`${url}?${queryString}`)

        return items.map((x) => EntityAttachment.create(x))
    }
    async addAttachment(itemId: number, file: Blob): Promise<EntityAttachment> {
        const url = `${this.config.api}/${itemId}/files`
        const attachment = createEntity(file)
        await saveAttachments(url, [attachment])
        return attachment
    }

    override async insert(item: Entity): Promise<Entity | null> {
        return await insertWithAttachments(this.config.api, item, async () => await super.insert(item))
    }
    override async update(item: Entity): Promise<Entity | null> {
        return await updateWithAttachments(this.config.api, item, async () => await super.update(item))
    }

    protected override prepareItem(item: Entity): Entity {
        item.labels = item.labels?.filter((x) => !x._deleted)
        item.interventionTypes = item.interventionTypes?.filter((x) => !x._deleted)
        item.attachments = item.attachments?.filter((x) => !x._deleted)
        return super.prepareItem(item)
    }

    override toEntity(item: object): Entity {
        return item instanceof Entity ? item : Object.assign(this.createInstance(Entity as new () => Entity), item || {})
    }
}

export default EntityService
```

> **Store — `data/store.ts`** is identical to the Product slice — see
> [entities.examples.md](entities.examples.md) (`createStore(service, Entity.name)`). The only difference
> is which `EntityService` the IoC resolves, which is handled by `setup.ts` (§13).

## 5. Form — `details/Form.vue`

Three tabs: the main `form` (code, type, brand, model, labels, allowed intervention types), a `files` tab
backed by the shared `EntityAttachments` overview, and an `interventions` child collection (§6, disabled
until the vehicle is saved). The `itemInterventionTypes` computed flattens the `VehicleInterventionType`
link rows (§3) into a list of plain `InterventionType` for the selector, and rebuilds the links — preserving
existing ids and toggling `_deleted` — on write-back.

```vue
<template>
    <form @submit.prevent="handleSubmit" :modelValue="item">
        <div class="row form-buttons">
            <div class="col col-md-auto order-1">
                <FormButtonsRow :item="item" :readonly="readonly" :feedback="feedback" :show-delete="item?.id > 0"
                    @cancel="handleCancel" @remove="handleRemove" @restore="handleRestore" />
            </div>
            <div class="col-auto order-2 order-md-3">
                <RouterLink v-if="isPopup" :to="{ name: `${Entity.name}Details`, params: { id: item.$id } }"
                    class="btn btn-default py-1" target="_blank" :title="$t('popOut')">
                    <Icon name="popOut" />
                </RouterLink>
                <RouterLink v-else-if="overviewUrl" :to="overviewUrl" class="btn btn-info py-1">
                    <Icon name="list" /> <span class="d-none d-md-inline ms-1">{{ $t("overview") }}</span>
                </RouterLink>
            </div>
            <div class="col-md order-3 order-md-2">
                <Feedback :feedback="feedback" />
            </div>
        </div>

        <div class="row">
            <div class="col">
                <TabContainer :tabs="tabs" :active="initialTab" :use-route-nav="!isPopup">
                    <template #form>
                        <FormSection :title="$t(config.detailsTitle ?? config.routePrefix)">
                            <div class="row">
                                <div class="col-md mb-2">
                                    <div class="input-group">
                                        <div class="input-group-text">
                                            <Icon name="code" />
                                        </div>
                                        <input v-model="item.code" required :readonly="readonly"
                                            :placeholder="$t('vehicleCodePlaceholder')" class="form-control" />
                                    </div>
                                    <FormLabel :label="$t('code')" />
                                </div>
                                <div class="col-md mb-2">
                                    <VehicleTypeSelector v-model="item.vehicleType"
                                        v-model:idValue="item.vehicleTypeId as number" :readonly="readonly"
                                        :placeholder="$t('selectType')" />
                                    <FormLabel :label="$t('type')" />
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md mb-2">
                                    <BrandSelector v-model="item.brand" v-model:idValue="item.brandId as number"
                                        :readonly="readonly" :placeholder="$t('selectBrand')" />
                                    <FormLabel :label="$t('brand')" />
                                </div>
                                <div class="col-md mb-2">
                                    <div class="input-group">
                                        <div class="input-group-text">
                                            <Icon name="title" />
                                        </div>
                                        <input v-model="item.model" :readonly="readonly" class="form-control"
                                            :placeholder="$t('modelPlaceholder')" />
                                    </div>
                                    <FormLabel :label="$t('model')" />
                                </div>
                            </div>
                        </FormSection>

                        <Labels v-model="item.labels" :show-summary="item.id > 0" />

                        <FormSection :title="$t('interventionType')">
                            <div class="row">
                                <div class="col mb-2">
                                    <InterventionTypeSelector v-model="itemInterventionTypes"
                                        :filter-defaults="{ exclude: itemInterventionTypes?.map((x) => x.id) }"
                                        :readonly="readonly" :placeholder="$t('selectType')" />
                                    <FormLabel :label="$t('allowedInterventionTypes')" />
                                </div>
                            </div>
                        </FormSection>
                    </template>

                    <template #files>
                        <EntityAttachments v-model="item.attachments" :readonly="readonly" />
                    </template>

                    <template #interventions>
                        <Interventions :owner="item" :readonly="readonly" />
                    </template>
                </TabContainer>
            </div>
        </div>

        <Debug :modelValue="{
            ...item,
            brand: item.brand ? `${item.brand.title} #${item.brand.id}` : undefined,
            vehicleType: item.vehicleType ? `${item.vehicleType.title} #${item.vehicleType.id}` : undefined,
        }" />
    </form>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { RouteRecordRaw } from "vue-router"
import { Feedback, TabContainer, Tab } from "@/regira_modules/vue/ui"
import { useForm, type FormEmits, formDefaults } from "@/regira_modules/vue/entities"
import { useLang } from "@/regira_modules/vue/lang"
import { FormButtonsRow } from "@/components/input"
import config from "../config/config"
import { Overview as Labels } from "../../entity-labels"
import { Overview as EntityAttachments } from "../../entity-attachments"
import { InputSelector as BrandSelector } from "../../brands"
import { InputSelector as VehicleTypeSelector } from "../../vehicle-types"
import { Entity as Intervention } from "../../interventions"
import { Selector as InterventionTypeSelector } from "../../intervention-types"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"
import Interventions from "../vehicle-interventions/Overview.vue"
import { VehicleInterventionType } from "../data/VehicleInterventionType"
import InterventionType from "@/entities/intervention-types/data/Entity"

interface Emits extends /* @vue-ignore */ FormEmits<Entity> { }
const emit = defineEmits<Emits>()
const props = withDefaults(
    defineProps<{
        modelValue: Entity
        initialTab?: string
        readonly?: boolean
        overviewUrl?: string | RouteRecordRaw
        isPopup?: boolean
    }>(),
    { ...formDefaults }
)

const { service: entityService } = useEntityStore()

const { item, feedback, handleCancel, handleSubmit, handleRemove, handleRestore } = useForm<Entity>({ entityService, props, emit })

const itemInterventionTypes = computed({
    get: () => item.value?.interventionTypes?.map((x) => InterventionType.create({ ...x.interventionType, _deleted: x._deleted })) || [],
    set: (values: any[]) => {
        item.value = entityService.toEntity({
            ...item.value,
            interventionTypes: values.map((x) => VehicleInterventionType.create({
                ...(item.value?.interventionTypes?.find((it) => it.interventionTypeId === x.id)
                    || { interventionType: x, interventionTypeId: x.id, vehicleId: item.value?.id }),
                _deleted: x._deleted
            })),
        })
    },
})

// Tabs
const { translate } = useLang()
const tabs = computed(() =>
    [
        Tab.create("form", { icon: "form", title: translate("form"), isDefault: true }),
        Tab.create("files", { icon: "attachment", title: translate("files") }),
        Tab.create("interventions", { icon: Intervention.name, title: translate("interventions"), isDisabled: !item.value?.id }),
    ].filter((x) => x)
)
</script>
```

## 6. Interventions overview (owned child collection) — `vehicle-interventions/Overview.vue`

A read-mostly list of the owning vehicle's interventions, embedded as the form's `interventions` tab. It
resolves the `interventions` service from the IoC container, loads on mount (and after a save via the
`InterventionButton`), and renders related `operator`/`interventionType` through the shared computed pools.

> This is the owned-collection pattern as the reference app ships it (manual IoC resolve + load). For the
> inline-editable `useOwnedCollection` / `useOwnedModal` variant, see
> [entities.patterns.md — Owned (child) collections](entities.patterns.md#owned-child-collections).

```vue
<template>
    <FormSection>
        <template #title>
            <div class="d-flex justify-content-between">
                <h3 class="p-2 mb-2">{{ $t("interventions") }}</h3>
                <InterventionButton v-if="!readonly" :item-defaults="{ vehicle: owner, vehicleId: owner?.id }" class="btn btn-info py-1 my-1" @save="load"><Icon name="new" /></InterventionButton>
            </div>
        </template>
        <LoadingContainer :is-loading="isLoading">
            <div class="row pb-2 border-bottom border-bottom-1">
                <div class="col-auto fw-bold"><Icon name="edit" class="m-1" /></div>
                <div class="col-3 col-md-2 col-xl-1 fw-bold">{{ $t("date") }}</div>
                <div class="col fw-bold">{{ $t("type") }}</div>
                <div class="col d-none d-lg-block fw-bold">{{ $t("supplier") }}</div>
                <div class="col d-none d-md-block fw-bold">{{ $t("invoice") }}</div>
            </div>
            <div v-for="item in items" :key="item.id" class="row border-bottom border-bottom-1 py-2">
                <div class="col-auto">
                    <InterventionButton :modelValue="item" :readonly="readonly" class="p-1" />
                </div>
                <div class="col-3 col-md-2 col-xl-1">
                    <div class="italic-muted">{{ formatDate(item.interventionDate, $culture) }}</div>
                </div>
                <div class="col text-truncate">
                    <InterventionTypeButton :modelValue="item.interventionType" class="p-1" />
                    {{ getInterventionType(item.interventionType)?.$title }}
                </div>
                <div class="col d-none d-lg-block text-truncate">
                    <OperatorButton :modelValue="item.operator" :readonly="readonly" class="p-1" />
                    {{ getOperator(item.operator).$title }}
                </div>
                <div class="col text-truncate d-none d-md-block">{{ item.invoice?.invoiceNumber }}</div>
            </div>
        </LoadingContainer>
    </FormSection>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { get } from "@/regira_modules/vue/ioc"
import { createFromComputedPool } from "@/regira_modules/vue/vue-helper"
import { formatDate } from "@/regira_modules/vue/formatters"
import type Vehicle from "../data/Entity"
import { Entity, type EntityService, FormModalButton as InterventionButton } from "../../interventions"
import { FormModalButton as OperatorButton, useEntityStore as useOperatorStore } from "../../intervention-operators"
import { FormModalButton as InterventionTypeButton, useEntityStore as useInterventionTypeStore } from "../../intervention-types"

const props = defineProps<{
    owner: Vehicle
    readonly?: boolean
}>()

const service = get<EntityService>(Entity.name)!
const items = ref<Array<Entity>>()
const isLoading = ref(false)

const getOperator = createFromComputedPool(useOperatorStore()) as any
const getInterventionType = createFromComputedPool(useInterventionTypeStore()) as any

async function load() {
    try {
        isLoading.value = true
        items.value = await service.list({ vehicleId: props.owner.id })
    } finally {
        isLoading.value = false
    }
}

onMounted(load)
</script>
```

## 7. Filter (advanced) — `filter/FilterAdv.vue`

```vue
<template>
    <div class="adv-filter" style="min-height: 50vh">
        <div class="row">
            <div class="col mb-2" v-if="resultCount != null">
                <span class="text-info">{{ resultCount }} results</span>
                <small v-if="filterIsActive" class="ms-2 italic-muted">({{ $t("filtersAreApplied") }})</small>
            </div>
            <div class="col mb-2 text-end">
                <IconButton icon="clear" @click="handleReset" :showText="true" />
            </div>
        </div>

        <!-- keywords -->
        <div class="row">
            <div class="col mb-2">
                <div class="input-group">
                    <div class="input-group-text"><Icon name="search" /></div>
                    <input v-model.lazy.trim="searchObject.q" class="form-control" :placeholder="$t('keywords')" />
                </div>
            </div>
        </div>

        <div class="row">
            <!-- code -->
            <div class="col mb-2">
                <div class="input-group">
                    <div class="input-group-text"><Icon name="code" /></div>
                    <input v-model.lazy.trim="searchObject.code" class="form-control" placeholder="code" />
                </div>
            </div>
            <!-- VehicleType -->
            <div class="col-md mb-2">
                <VehicleTypeSelector v-model="vehicleType" v-model:idValue="searchObject.vehicleTypeId as number" placeholder="vehicle type" @select="handleUpdate">
                    <template #prepend>
                        <div class="input-group-text"><Icon :name="VehicleType.name" /></div>
                    </template>
                </VehicleTypeSelector>
            </div>
        </div>

        <div class="row">
            <!-- Brand -->
            <div class="col-md mb-2">
                <BrandSelector v-model="brand" v-model:idValue="searchObject.brandId as number" placeholder="brand" @select="handleUpdate">
                    <template #prepend>
                        <div class="input-group-text"><Icon :name="Brand.name" /></div>
                    </template>
                </BrandSelector>
            </div>
            <!-- model -->
            <div class="col mb-2">
                <div class="input-group">
                    <div class="input-group-text"><Icon name="title" /></div>
                    <input v-model.lazy.trim="searchObject.model" class="form-control" placeholder="model" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useVModelField } from "@/regira_modules/vue/vue-helper"
import { useFilter, type FilterEmits } from "@/regira_modules/vue/entities"
import { useAuthStore } from "@/regira_modules/vue/auth"
import { Entity as Brand, InputSelector as BrandSelector } from "../../brands"
import { Entity as VehicleType, InputSelector as VehicleTypeSelector } from "../../vehicle-types"
import SearchObject from "./SearchObject"

interface Emits extends /* @vue-ignore */ FilterEmits {}

const emit = defineEmits<Emits>()
const props = defineProps<{
    modelValue: SearchObject
    resultCount?: number | null
}>()

const searchObject = useVModelField<SearchObject>(props, emit)

const brand = ref<Brand>()
const vehicleType = ref<VehicleType>()

const { filterIsActive, handleReset, handleUpdate } = useFilter({ searchObject, emit, Constructor: SearchObject })

const { hasPermission } = useAuthStore()
const showOperatorFilter = computed(() => hasPermission("ReadAllActivities"))
</script>
```

## 8. Search object — `filter/SearchObject.ts`

```ts
import { SearchObjectBase } from "@/regira_modules/vue/entities"

export class EntitySearchObject extends SearchObjectBase {
    code?: string
    title?: string
    model?: string

    brandId?: number | Array<number>
    vehicleTypeId?: number | Array<number>

    minDate?: Date
    maxDate?: Date
    isBillable?: boolean
    isBilled?: boolean
}

export default EntitySearchObject
```

## 9. List — `overview/List.vue`

```vue
<template>
    <div class="entity-list">
        <div class="row pb-2 border-bottom border-bottom-1">
            <div class="col-auto fw-bold"><Icon name="edit" class="m-1" /></div>
            <div class="col-2 col-lg-1 fw-bold">{{ $t("code") }}</div>
            <div class="col fw-bold">{{ $t("type") }}</div>
            <div class="col d-none d-md-block fw-bold">{{ $t("brand") }}</div>
            <div class="col d-none d-lg-block fw-bold">{{ $t("model") }}</div>
        </div>
        <template v-for="(item, i) in items" :key="item.$id">
            <ListItem
                v-model="items[i]"
                :readonly="readonly"
                :class="{ 'bg-light': i % 2 == 0 }"
                @request-save="$emit('request-save', $event)"
                @request-remove="$emit('request-remove', $event)"
                @save="$emit('save', $event)"
                @remove="$emit('remove', $event)"
                @request-load="$emit('request-reload')"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { OverviewEmits, SaveResult } from "@/regira_modules/vue/entities"
import useEntityStore from "../data/store"
import type Entity from "../data/Entity"
import ListItem from "./ListItem.vue"

interface Emits extends /* @vue-ignore */ OverviewEmits<Entity> {
    (e: "save", args: SaveResult<Entity>): void | Promise<void>
    (e: "request-reload"): void
}
const emit = defineEmits<Emits>()
const props = defineProps<{
    modelValue?: Array<Entity>
    readonly: boolean
}>()

const { fromPool } = useEntityStore()

const items = computed<Array<Entity>>({
    get: () => fromPool(props.modelValue || []),
    set: (value) => emit("update:modelValue", value),
})
</script>
```

## 10. List item — `overview/ListItem.vue`

```vue
<template>
    <div class="row border-bottom border-bottom-1 py-2">
        <div class="col-auto">
            <!-- <FormModalButton v-model="item" class="p-1" /> -->
            <router-link :to="{ name: Entity.name + 'Details', params: { id: item.$id } }" class="btn btn-link p-1">
                <Icon :name="Entity.name" />
            </router-link>
        </div>
        <div class="col-2 col-lg-1 text-nowrap">
            <div>
                {{ item.code }}
            </div>
        </div>
        <div class="col text-truncate">
            <div v-if="item.vehicleType != null">
                <VehicleTypeButton :modelValue="item.vehicleType!" :readonly="readonly" class="p-1" />
                {{ getVehicleType(item.vehicleType)?.title }}
            </div>
        </div>
        <div class="col d-none d-md-block text-truncate">
            <div v-if="item.brand != null">
                <BrandButton :modelValue="item.brand!" :readonly="readonly" class="p-1" />
                {{ getBrand(item.brand)?.title }}
            </div>
        </div>
        <div class="col d-none d-lg-block text-truncate">
            <div>{{ item.model }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useVModelField, createFromComputedPool } from "@/regira_modules/vue/vue-helper"
import type { SaveResult } from "@/regira_modules/vue/entities"
import Entity from "../data/Entity"
import { FormModalButton as BrandButton, useEntityStore as useBrandStore } from "../../brands"
import { FormModalButton as VehicleTypeButton, useEntityStore as useVehicleTypeStore } from "../../vehicle-types"

const emit = defineEmits<{
    (e: "update:modelValue", args: Entity): void
    (e: "save", args: SaveResult<Entity>): void
    (e: "remove", args: Entity): void
    (e: "request-load", args: Entity): void
    (e: "request-save", args: Entity): void
    (e: "request-remove", args: Entity): void
}>()
const props = defineProps<{
    modelValue: Entity
    readonly?: boolean
}>()

const item = useVModelField<Entity>(props, emit)
const getBrand = createFromComputedPool(useBrandStore()) as any
const getVehicleType = createFromComputedPool(useVehicleTypeStore()) as any
</script>
```

## 11. Selector list — `selecting/SelectorList.vue`

```vue
<template>
    <div class="entity-list">
        <div class="row pb-2 border-bottom border-bottom-1">
            <div class="col-auto fw-bold"><Icon name="select" class="m-1" /></div>
            <div class="col-1 fw-bold">Code</div>
            <div class="col fw-bold">Model</div>
        </div>

        <template v-for="(item, i) in items" :key="item.$id">
            <div class="row border-bottom border-bottom-1 py-2" :class="{ 'is-selected': isSelected(item) }">
                <div class="col-auto">
                    <IconButton :icon="isSelected(item) ? 'selected' : 'select'" class="btn-default py-0 px-1" @click="handleSelect(item)" />
                </div>
                <div class="col text-truncate">
                    <FormModalButton v-model="items[i]" class="p-1" />
                    {{ item.code }}
                </div>
                <div class="col text-nowrap">
                    <BrandButton :modelValue="item.brand!" class="p-1" />
                    {{ getBrand(item.brand)?.title }}
                </div>
                <div class="col text-truncate">
                    {{ item.model }}
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { createFromComputedPool } from "@/regira_modules/vue/vue-helper"
import type { OverviewEmits } from "@/regira_modules/vue/entities"
import { FormModalButton as BrandButton, useEntityStore as useBrandStore } from "../../brands"
import type Entity from "../data/Entity"
import useEntityStore from "../data/store"
import FormModalButton from "../details/FormModalButton.vue"

interface Emits extends /* @vue-ignore */ OverviewEmits<Entity> {
    (e: "select", selected: Entity | null): void
}
const emit = defineEmits<Emits>()
const props = defineProps<{
    modelValue?: Array<Entity> | null
    selected?: Entity | null
}>()

const isSelected = computed(() => (item: Entity) => item.$id == props.selected?.$id)
const { fromPool } = useEntityStore()
const items = computed<Array<Entity>>({
    get: () => fromPool(props.modelValue || []),
    set: (value) => emit("update:modelValue", value),
})
const getBrand = createFromComputedPool(useBrandStore()) as any

function handleSelect(item: Entity) {
    emit("select", item?.$id !== props.selected?.$id ? item : null)
}
</script>
```

## 12. Barrel — `index.ts`

```ts
export { default as config } from "./config/config"
export { default as Entity } from "./data/Entity"
export { default as EntityService } from "./data/EntityService"
export { default as useEntityStore } from "./data/store"

export { default as Filter } from "./filter/Filter.vue"
export { default as FilterInline } from "./filter/FilterInline.vue"
export { default as FilterAdv } from "./filter/FilterAdv.vue"

export { default as Autocomplete } from "./selecting/Autocomplete.vue"
export { default as FormModalButton } from "./details/FormModalButton.vue"
export { default as InputSelector } from "./selecting/InputSelector.vue"
export { default as Selector } from "./selecting/Selector.vue"
export { default as SelectorDropDown } from "./selecting/SelectorDropDown.vue"
export { default as SelectorList } from "./selecting/SelectorList.vue"
export { default as SelectorSearch } from "./selecting/SelectorSearch.vue"

export { default as Overview } from "./overview/Overview.vue"
export { default as Details } from "./details/Details.vue"
export { default as Form } from "./details/Form.vue"

export { default as plugin } from "./setup"
```

## 13. Plugin — `setup.ts`

The vehicle service needs file uploads, so `addServices` resolves `axios` as an `AxiosWithFilesInstance`
and the route key is taken from `Entity.name`.

```ts
import type { App } from "vue"
import type { RouteRecordRaw } from "vue-router"
import type { AxiosWithFilesInstance } from "@/regira_modules/vue/http/axios"
import type { IServiceProvider } from "@/regira_modules/vue/ioc"
import type { IIconProvider } from "@/regira_modules/vue/ui/icons"
import { DetailsSummary } from "@/regira_modules/vue/entities"
import config from "./config/config"
import { Entity } from "./data/Entity"
import { EntityService } from "./data/EntityService"
import Overview from "./overview/Overview.vue"
import Details from "./details/Details.vue"
import Form from "./details/Form.vue"

export function createRoutes(): Array<RouteRecordRaw> {
    const key = Entity.name
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
    serviceProvider.add(Entity.name, (sp) => new EntityService(sp.get<AxiosWithFilesInstance>("axios")!, config))
}

export function addIcons(icons: IIconProvider) {
    icons.add(Entity.name, config.icon!)
}

export default {
    install(app: App<Element>, { routes }: { routes: Array<RouteRecordRaw> }) {
        routes.push(...createRoutes())

        addServices(app.config.globalProperties.$services)
        addIcons(app.config.globalProperties.$icons)

        app.config.globalProperties.$configs[Entity.name] = config

        console.debug("install", Entity.name)
    },
}
```

## Boilerplate shared with the basic slice (not reprinted)

These files are **byte-identical** to the `Product` slice — the picker components and the details/filter
shells that carry no Vehicle-specific markup. Copy them from the basic example and only change the slice
folder they live in:

| File | Source |
|---|---|
| `details/Details.vue` (the `<router-view>` host shell) | identical to the Product slice — see [entities.examples.md](entities.examples.md) |
| `details/FormModalButton.vue` | identical to the Product slice — see [entities.examples.md](entities.examples.md) |
| `filter/Filter.vue` · `filter/FilterInline.vue` | identical to the Product slice — see [entities.examples.md](entities.examples.md) |
| `overview/Overview.vue` | identical to the Product slice — see [entities.examples.md](entities.examples.md) |
| `selecting/Autocomplete.vue` · `InputSelector.vue` · `Selector.vue` · `SelectorDropdown.vue` · `SelectorSearch.vue` · `SelectorModalButton.vue` | identical to the Product slice — see [entities.examples.md](entities.examples.md) |
| `data/store.ts` | identical to the Product slice — see [entities.examples.md](entities.examples.md) (the resolved `EntityService` differs, wired in §13) |

> Only the **Vehicle-specific** picker (`selecting/SelectorList.vue`, §11) and overview list
> (`overview/List.vue`, §9 / `overview/ListItem.vue`, §10) differ from Product — those are reprinted in
> full above because their columns are entity-specific.

## App-level aggregator

The slice is collected, with every other entity plugin, in `src/entities/index.ts` and installed in a
single `app.use(...)`. That file is **not** part of the slice — it lives with the app shell.

> **→ See:** [entities.setup.md](entities.setup.md#bootstrap--maints) — the app aggregator and bootstrap.

## See also

- [entities.examples.md](entities.examples.md) — the **basic** `Product` slice + all shared boilerplate (read this first)
- [entities.setup.md](entities.setup.md) — app scaffolding, the [Entity slice anatomy](entities.setup.md#entity-slice-anatomy), router, bootstrap, app shell
- [entities.patterns.md](entities.patterns.md) — per-feature recipes: [owned (child) collections](entities.patterns.md#owned-child-collections), [hierarchical (tree) entities](entities.patterns.md#hierarchical-tree-entities) (links the `treelist` module), [navigation from the config map](entities.patterns.md#navigation-from-the-config-map), custom endpoints, soft-delete, paging, JSON services
- [entities.signatures.md](entities.signatures.md) · [entities.namespaces.md](entities.namespaces.md) — exact signatures and import specifiers
