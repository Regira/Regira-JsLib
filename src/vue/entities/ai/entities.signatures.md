# Regira JsLib Entities — API Signatures Reference

Verbatim TypeScript signatures for the front-end CRUD client (`regira_modules/vue/entities`).

> **AI rule:** Do not guess a signature, generic parameter, or option name — look it up here first.
> Every block shows the `import` specifier above it. The barrel `regira_modules/vue/entities`
> re-exports everything below; the deeper specifiers (`/abstractions`, `/overview`, `/form`, …) are
> also published for granular imports. Demos alias the package as `@/regira_modules` — see
> [entities.namespaces.md](entities.namespaces.md).

## Table of contents

1. [Entity contracts](#1-entity-contracts)
2. [Service contracts](#2-service-contracts)
3. [Search, paging, sort](#3-search-paging-sort)
4. [Config & descriptor](#4-config--descriptor)
5. [Overview composables](#5-overview-composables)
6. [Details, form, filter composables](#6-details-form-filter-composables)
7. [Pooling (entity cache)](#7-pooling-entity-cache)
8. [Navigation](#8-navigation)
9. [Tree, preloading, utilities](#9-tree-preloading-utilities)
10. [Wiring (IoC + HTTP)](#10-wiring-ioc--http)
11. [Lean views (`EntityOverview` / `EntityForm`)](#11-lean-views-entityoverview--entityform)

---

## 1. Entity contracts

```ts
import type { IEntity } from "regira_modules/vue/entities"
export interface IEntity {
    get $id(): number | string // uniform identifier
    get $title(): string | undefined // uniform label used for display
}
```

```ts
import { EntityBase } from "regira_modules/vue/entities"
export abstract class EntityBase implements IEntity {
    constructor()
    abstract get $id(): string | number
    abstract get $title(): string | undefined
}
// EntityBase also defines a non-contract `entityType` getter on its prototype = this.constructor.name
```

---

## 2. Service contracts

```ts
import type { IEntityService } from "regira_modules/vue/entities"
export interface IEntityService<T extends IEntity = IEntity> {
    details(id: number | string): Promise<T | null>
    list(so?: object): Promise<Array<T>>
    search(so?: object): Promise<SearchResult<T>>
    searchUnion(searchObjects: Array<object>, extra?: IPagingInfo | ISortByInfo): Promise<SearchResult<T>>
    save(item: T): Promise<SaveResult<T>>
    remove(item: T): Promise<void>
    toEntity(item: object): T
    newEntity(values?: Record<string, any>): Promise<T>
}
```

Result envelope types (`import type { ... } from "regira_modules/vue/entities"`):

```ts
export type DetailsResult<T> = { item: T; duration?: number }
export type ListResult<T> = { items: Array<T>; duration?: number }
export type SearchResult<T> = { items: Array<T>; count: number; duration?: number }
export type SavedResult<T> = { item: T; isNew: boolean; duration?: number } // raw server insert/update shape
export type SaveResult<T> = { saved: T; isNew: boolean; affected?: number; duration?: number } // returned by save()
export type DeleteResult<T> = { item: T; affected?: number; duration?: number }
```

> **Note:** `SavedResult` (`{ item }`) ≠ `SaveResult` (`{ saved }`). The server returns `SavedResult`;
> `save()`/`insert()`/`update()` repackage it into `SaveResult`. Bind overview/form results to `saved`.

```ts
import { EntityServiceBase } from "regira_modules/vue/entities"
export abstract class EntityServiceBase<T extends IEntity> implements IEntityService<T>, HasDefaultPageSize {
    protected axios: AxiosInstance
    protected config: IConfig
    defaultPageSize: number
    constructor(axios: AxiosInstance, config: IConfig)
    details(id: string | number): Promise<T | null>
    list(so?: ISearchObject & IPagingInfo): Promise<Array<T>>
    search(so?: ISearchObject & IPagingInfo): Promise<SearchResult<T>>
    searchUnion(searchObjects: Array<ISearchObject>, extra?: IPagingInfo | ISortByInfo): Promise<SearchResult<T>>
    save(item: T): Promise<SaveResult<T>>
    remove(item: T): Promise<void>
    update(item: T): Promise<T | null>
    insert(item: T): Promise<T | null>
    protected fetchItems<TResult extends { items: Array<T> }>(api: string, so?: ISearchObject & IPagingInfo): Promise<TResult>
    protected processItem(item: T | null): T | null // hydrates `created`/`lastModified` strings to Date
    protected prepareItem(item: T): T // strips properties whose key starts with "_"
    protected createInstance<T>(type: { new (): T }): T
    newEntity(values?: Record<string, any>): Promise<T>
    abstract toEntity(item: Object): T // the ONLY required override
}
```

```ts
import { JSONService } from "regira_modules/vue/entities"
// In-memory variant: fetches the full list once, then runs all CRUD client-side over a shared cache keyed by `key`.
export abstract class JSONService<T extends IEntity> extends EntityServiceBase<T> {
    protected key: string
    constructor(axios: AxiosInstance, config: IConfig, key: string)
    get cachedItems(): Array<T>
    set cachedItems(value: Array<T>)
    fetchJSONItems(): Promise<Array<T>>
    details(id: string | number): Promise<T | null>
    list(so?: ISearchObject & IPagingInfo): Promise<T[]>
    search(so?: ISearchObject & IPagingInfo): Promise<SearchResult<T>>
    save(item: T): Promise<{ saved: T; isNew: boolean }>
    remove(item: T): Promise<void>
    processSearchObject(so?: ISearchObject): ISearchObject
    abstract toEntity(item: Object): T
}
```

---

## 3. Search, paging, sort

```ts
import { SearchObjectBase, DefaultSearchObject } from "regira_modules/vue/entities"
export interface ISearchObject extends Record<string, any> {
    q?: string
} // q = free-text search
export abstract class SearchObjectBase implements ISearchObject {
    q?: string
}
export class DefaultSearchObject extends SearchObjectBase {}
```

> **Paging is not on the search object.** `SearchObjectBase` carries only `q` (+ your filter fields).
> `pageSize` / `page` live on `IPagingInfo` and are merged in by the overview composables (or passed
> inline to `service.search(so)` / `service.list(so)`, whose param is `ISearchObject & IPagingInfo`) —
> do **not** add `pageSize` to your `SearchObject`.

```ts
import { PagingInfo, DEFAULT_PAGESIZE } from "regira_modules/vue/entities"
export const DEFAULT_PAGESIZE = 10
export interface IPagingInfo {
    pageSize?: number
    page?: number
}
export class PagingInfo implements IPagingInfo {
    page: number
    pageSize: number
    constructor(pageSize?: number, page?: number) // defaults: pageSize = DEFAULT_PAGESIZE, page = 1
}
```

```ts
import { SortByInfo } from "regira_modules/vue/entities"
export interface ISortByInfo {
    sortBy: string | Array<string>
}
export class SortByInfo implements ISortByInfo {
    sortBy: string | Array<string>
}
```

---

## 4. Config & descriptor

```ts
import type { IConfig } from "regira_modules/vue/entities"
import { NavTypes } from "regira_modules/vue/entities"
export interface IConfig extends Record<string, any> {
    name?: string
    key: string // drives route names: `${key}Overview`, `${key}Details`, `${key}Fiche`, `${key}Form`
    requires?: Array<string>
    isComplex?: boolean
    routePrefix: string // URL path segment
    baseQueryParams?: Record<string, any> // merged into every list/search request
    initialQuery?: Record<string, any>
    overviewTitle?: string
    detailsTitle?: string
    description?: string
    icon?: string
    defaultPageSize: number
    api: string // base path; the *Url fields default off this
    detailsUrl?: string
    listUrl?: string
    searchUrl?: string
    saveUrl?: string
    deleteUrl?: string
}
export enum NavTypes {
    dashboard = "Dashboard",
    navbar = "Navbar",
}
```

```ts
import { EntityDescriptor } from "regira_modules/vue/entities/config"
type IEntityControls = { Overview?: any; Details?: any; Form?: any; Fiche?: any }
export interface IEntityDescriptor<T extends IEntity = IEntity> extends IEntityControls {
    Entity: { name: string; new (): T }
    serviceBuilder: (sp: IServiceProvider) => IEntityService<T>
    config: IConfig
    get key(): string
}
export class EntityDescriptor<T extends IEntity = IEntity> {
    constructor(
        Entity: { name: string; new (): T },
        serviceBuilder: (sp: IServiceProvider) => IEntityService<T>,
        config: IConfig,
        { Overview, Details, Form, Fiche }: IEntityControls
    )
    get key(): string // = Entity.name
}
```

> **Note:** `EntityDescriptor` is an alternative API; the demos wire entities with a plain `IConfig`
> object + IoC registration instead. See [entities.instructions.md](entities.instructions.md).

---

## 5. Overview composables

```ts
import { useSearchView, useListView, useOverviewCore, useRouteOverview, DEFAULT_DEBOUNCE } from "regira_modules/vue/entities"
export const DEFAULT_DEBOUNCE = 250

export type OverviewCoreIn<T extends IEntity, SO extends ISearchObject = ISearchObject> = {
    service: IEntityService<T>
    searchObject: SO
    defaultPageSize?: number
}
export type OverviewCoreOut<T extends IEntity, SO extends ISearchObject = ISearchObject> = {
    searchObject: Ref<SO>
    pagingInfo: Ref<IPagingInfo>
    items: Ref<Array<T>>
    itemsCount: Ref<number | undefined>
    isLoading: Ref<boolean>
    feedback: FeedbackOut
    applySave(item: T): Promise<SaveResult<T> | null>
    applyRemove(item: T): Promise<void>
    handleSave({ saved, isNew }: SaveResult<T>): void
    handleRemove(item: T): void
    resetPage(): void
}
export interface IListViewIn<T, SO> extends OverviewCoreIn<T, SO> {
    debounceDelay?: number
}
export interface ISearchViewOut<T, SO> extends OverviewCoreOut<T, SO> {
    searchHandler(resetPaging?: boolean): Promise<void>
    debouncedSearchHandler(): Promise<void>
}
export interface IListViewOut<T, SO> extends OverviewCoreOut<T, SO> {
    listHandler(): Promise<void>
    debouncedListHandler(): Promise<void>
}

export function useSearchView<T extends IEntity, SO extends ISearchObject = ISearchObject>({
    service,
    searchObject,
    defaultPageSize,
    debounceDelay,
}: IListViewIn<T, SO>): ISearchViewOut<T, SO>
export function useListView<T extends IEntity, SO extends ISearchObject = ISearchObject>({
    service,
    searchObject,
    defaultPageSize,
    debounceDelay,
}: IListViewIn<T, SO>): IListViewOut<T, SO>
export function useOverviewCore<T extends IEntity, SO extends ISearchObject = ISearchObject>({
    service,
    searchObject,
    defaultPageSize,
}: OverviewCoreIn<T, SO>): OverviewCoreOut<T, SO>

export type RouteOverviewIn<SO extends ISearchObject = ISearchObject> = {
    pagingInfo: Ref<IPagingInfo>
    searchObject: Ref<SO>
    defaultPageSize?: number
    handler(): Promise<void>
}
export type RouteOverviewOut = {
    updateOverviewRoute(resetPaging?: boolean): void
    routeSearchHandler(): Promise<void>
    routeWatcher: WatchStopHandle
}
export function useRouteOverview({ pagingInfo, searchObject, defaultPageSize, handler }: RouteOverviewIn): RouteOverviewOut
```

`OverviewProps<T>` / `OverviewEmits<T>` (for custom overview components):

```ts
export interface OverviewProps<T> {
    modelValue: Array<T>
    config: IConfig
    title: string
    service: IEntityService<T>
}
export interface OverviewEmits<T> {
    "update:modelValue": [Array<T>]
    "update:searchObject": [SO]
    "update:pagingInfo": [IPagingInfo]
    save: [SaveResult<T>]
    remove: [T]
    "request-save": [T]
    "request-remove": [T]
}
```

---

## 6. Details, form, filter composables

```ts
import { useDetails } from "regira_modules/vue/entities"
export function useDetails<T extends IEntity>(entityService: IEntityService<T>, feedback?: FeedbackOut): DetailsOut<T>
export type DetailsOut<T> = {
    item: Ref<T | null> // null until the onMounted load resolves — guard with v-if="item"
    routeId: ComputedRef<string>
    isNew: ComputedRef<boolean>
    overviewUrl?: RouteRecordRaw | string
    isForm: ComputedRef<boolean>
    isFiche: ComputedRef<boolean>
    hasFiche: ComputedRef<boolean>
    isLoading: Ref<boolean>
    feedback: FeedbackOut
    load(): Promise<void>
}
```

```ts
import { useForm, formDefaults, FormStates } from "regira_modules/vue/entities"
export interface FormProps<T> {
    modelValue: T
    readonly?: boolean
    isPopup?: boolean
}
export interface FormEmits<T> {
    (e: "update:modelValue", item?: T): void
    (e: "save", result: SaveResult<T>): void
    (e: "remove", item: T): void
    (e: "restore", item: T): void
    (e: "cancel", arg: { canceled: T; original?: T }): void
    (e: "changeState", state: FormStates): void
}
export enum FormStates {
    pending = "Pending",
    saved = "Saved",
    removed = "Removed",
    error = "Error",
}
export const formDefaults: { readonly: boolean; isPopup: boolean }
export function useForm<T extends IEntity>({ entityService, props, emit, feedback }: FormIn<T>): FormOut<T>
export interface FormOut<T> {
    item: Ref<T>
    original?: Ref<T>
    feedback: FeedbackOut
    handleCancel(): void
    handleSubmit(): Promise<void>
    handleRemove(): Promise<void> // ⚠ takes NO args — removes item.value
    handleRestore(): Promise<void> // unarchive: sets isArchived=false then saves
}
```

> **`handleRemove` arity differs by composable.** The **form**'s `handleRemove()` takes **no arguments**
> (it removes the bound `item.value`); the **overview**'s `handleRemove(item: T)` takes the row. Don't
> pass the item to the form's `handleRemove` — it's a common type error.

```ts
import { useModalForm, useModal, formModalDefaults } from "regira_modules/vue/entities"
export interface FormModalProps<T> extends FormProps<T> {
    title?: string
    fullWidth?: boolean
    closeOnSave?: boolean
    closeOnDelete?: boolean
}
export interface FormModalEmits<T> extends FormEmits<T> {
    (e: "open", item: T, update: (newItem: T) => void): void
    (e: "close", item?: T): void
}
export const formModalDefaults: { closeOnSave: boolean; closeOnDelete: boolean }
export const useModal: typeof useModalForm
export function useModalForm<T extends IEntity>({
    entityService,
    model,
    itemDefaults,
    closeOnSave,
    closeOnCancel,
    closeOnDelete,
    emit,
    feedback,
}: FormModalIn<T>): FormModalOut<T>
```

```ts
import { useFilter } from "regira_modules/vue/entities"
export interface FilterIn<SO> {
    searchObject: Ref<SO>
    emit: FilterEmits<SO>
    Constructor?: new () => SO
}
export interface FilterEmits<SO> {
    (e: "update:modelValue", args: SO): void
    (e: "filter", args: SO): void
    (e: "toggle-adv"): void
    (e: "close"): void
}
export interface FilterOut {
    filterIsActive: ComputedRef<boolean | undefined>
    handleToggle(): void
    handleFilter(): void
    handleUpdate(): void
    handleReset(): void
}
export function useFilter<SO extends ISearchObject = DefaultSearchObject>({ searchObject, emit, Constructor }: FilterIn<SO>): FilterOut
```

**Feedback** — the overview / details / form composables each return `feedback: FeedbackOut`
(from `regira_modules/vue/ui`). Its surface (use these method names — they are not auto-completed elsewhere):

```ts
import type { FeedbackOut } from "regira_modules/vue/ui"
export interface FeedbackOut {
    status: Ref<FeedbackStatus> // "" | "Pending" | "Success" | "Failed"
    message: Ref<string>
    error: Ref<string | Record<string, string> | null>
    pending(msg: string): void
    success(msg: string): void
    fail(msg: string, ex?: string | Record<string, string>): void
    reset(): void
}
```

Owned child collections (`import { ... } from "regira_modules/vue/entities"`):

```ts
export function useOwnedCollection<T extends IEntity & { id: number }>({
    props,
    emit,
}: Input<T>): {
    items: WritableComputedRef<T[]>
    newItem: Ref<T | undefined>
    resetNewItem: () => Promise<void>
    handleSort: (e: any) => void
    handleSave: ({ saved, isNew }: SaveResult<T>) => void
}
export function useOwnedModal<T extends IEntity & { id: number }>(
    Entity: { new (): T },
    { props, emit }: Input<T>
): {
    item: Ref<T>
    isOpen: Ref<boolean>
    handleOpen: () => void
    handleCancel: () => void
    handleSubmit: () => void
}
export function useListInput<T extends IEntity & { id: number }>({
    props,
    emit,
}: ListInputIn<T>): {
    items: WritableComputedRef<T[]>
    newItem: Ref<T>
    handleSort: (e: any) => void
    handleSave: ({ saved, isNew }: SaveResult<T>) => void
}
export function useListItemInput<T extends IEntity & { id: number; _deleted: boolean }>({
    props,
    emit,
}: {
    props: Readonly<Record<string, any>>
    emit: any
}): {
    item: WritableComputedRef<T>
    handleSave: () => void
    handleRemove: (item: T) => void
}
```

---

## 7. Pooling (entity cache)

```ts
import { createStore, usePooling, defaultPoolCache, PoolCache, PoolService } from "regira_modules/vue/entities"
export function createStore<T extends IEntity>(service: IEntityService<T>, type: string): IPoolHandler<T>
export function usePooling<T extends IEntity>(service: IEntityService<T>, type: string, cache?: IPoolCache, persistent?: boolean): IPoolHandler<T>
export const defaultPoolCache: PoolCache

export interface IPoolService<T extends IEntity> extends IEntityService<T> {
    get(input: T): Ref<T> | null
    getMany(input: Array<T>): Array<Ref<T>>
}
export interface IPoolHandler<T extends IEntity> extends IPoolService<T> {
    service: IPoolService<T>
    cache: IPoolCache
    set(item: T): Ref<T>
    setMany(items: Array<T>): Array<Ref<T>>
    fromPool<P = Array<T> | T>(input: P): P
    fromCache(id?: string | number): Ref<T> | null | Array<Ref<T>>
}
export interface IPoolCache {
    persistentTypes: Array<string>
    set<T extends IEntity>(item: T): Ref<T>
    get<T extends IEntity>(type: string, key: number | string): Ref<T> | null
    remove<T extends IEntity>(item: T): boolean
    hasType(type: string): boolean
    getAll<T extends IEntity>(type: string): Array<Ref<T>>
    getEntityMap(type: string): Map<number | string, any>
}
export class PoolCache implements IPoolCache {
    constructor({ interval, expires, maxItems }?: ICacheOptions) /* + IPoolCache members */
}
export class PoolService<T extends IEntity> implements IPoolService<T> {
    constructor(service: IEntityService<T>, cache: IPoolCache, type: string) /* + IEntityService + get/getMany/set/setMany */
}
```

---

## 8. Navigation

```ts
import {
    NavItem,
    NavGroup,
    buildNavigationTree,
    createNavItem,
    createNavGroup,
    importDashboard,
    importNavbar,
    isNavItem,
} from "regira_modules/vue/entities"
export interface INavCore {
    id: string
    parentId?: string
    title: string
    description?: string
    icon?: string
}
export interface IRoutingNavItem {
    routeName: string
    initialQuery?: Record<string, any>
}
export interface INavItem extends INavCore, IRoutingNavItem {}
export class NavGroup implements INavCore {
    id: string
    title: string
    parentId?: string
    icon?: string
}
export class NavItem implements INavItem {
    id: string
    name: string
    icon: string
    routeName: string
    title: string
    description?: string
    initialQuery?: Record<string, any>
    parentId?: string
}
export function createNavItem(input: IConfig, parentId?: string): INavItem
export function createNavGroup(input: { id: string; title: string; icon: string }): INavCore
export function buildNavigationTree(items: Array<INavCore>): TreeList<INavCore>
export function importDashboard(input: IImportDashboardInput): Array<INavCore>
export function importNavbar(input: IImportNavbarInput): Array<INavCore>
export function isNavItem(item: INavCore): item is NavItem
```

---

## 9. Tree, preloading, utilities

```ts
import { useTree, useDragDrop } from "regira_modules/vue/entities"
export function useTree<T extends { $id: number | string }>(
    options?: TreeIn<T>
): {
    tree: Ref<TreeList<T> | undefined>
    nodes: ComputedRef<TreeNode<T>[]>
    ancestors: ComputedRef<TreeNode<T>[]>
    offspring: ComputedRef<TreeNode<T>[]>
    family: ComputedRef<TreeNode<T>[]>
    init: (values: Array<T>, data: Array<T>, findParents: IFindParents<T>) => void
}
export function useDragDrop<T = any>({ emit }: { emit: any }): DragDropEngine
```

```ts
import { usePreloader, preloaderPlugin } from "regira_modules/vue/entities"
export function usePreloader(): { preload: typeof preload; ready: typeof ready }
export const plugin: { install(_: App): void; preload: typeof preload; ready: typeof ready } // exported as preloaderPlugin
```

```ts
import { cleanQueryParams, parseQueryParams } from "regira_modules/vue/entities"
export function cleanQueryParams(queryParams: Record<string, unknown>, _defaultPageSize?: number): Record<string, unknown>
export function parseQueryParams(queryParams: Record<string, any>): Record<string, any> // → { searchObject, pagingInfo }
```

---

## 10. Wiring (IoC + HTTP)

The entities layer never creates its own HTTP client; it is injected. These are the registration/resolution
and HTTP entry points used at app startup (live in sibling modules).

```ts
import { ServiceProvider, get, type IServiceProvider } from "regira_modules/vue/ioc"
export interface IServiceProvider {
    get<T = any>(key: any): T | null
    add<T = any>(key: any, factory: (sp: IServiceProvider) => T): IServiceProvider
}
export class ServiceProvider implements IServiceProvider {
    /* members above; factory re-runs on every get */
}
export function get<T>(key: any): T | null // resolves from the default ServiceProvider singleton
```

```ts
import { initAxios, useAxios, type AxiosWithFilesInstance } from "regira_modules/vue/http"
import { createQueryString } from "regira_modules/vue/http"
export interface AxiosWithFilesInstance extends AxiosInstance {
    getFile(url: string, method?: string, filename?: string, type?: string): Promise<Blob>
    upload(url: string, files: Array<Blob>, options?: UploadOptions): Promise<AxiosResponse>
}
export function initAxios(config: { api: string; includeCredentials?: boolean }): AxiosWithFilesInstance
export function useAxios(): AxiosWithFilesInstance
export function createQueryString(o: object): URLSearchParams
```

---

## 11. Lean views (`EntityOverview` / `EntityForm`)

Generic, service-driven components for the lean tier (see
[entities.setup.md → Lean tier](entities.setup.md#lean-tier-generic-views)). Both are generic over
`T extends IEntity` and take a constructed `IEntityService<T>`; they rely only on the service contract, so
they run without plugins, stores, or routes.

```ts
import { EntityOverview, EntityForm } from "regira_modules/vue/entities"

// EntityOverview — list + built-in server paging + delete
//   props:   { service: IEntityService<T>; query?: Record<string, any>; pageSize?: number }   // pageSize default 10
//   slots:   toolbar({ reload, setPage }), head(), row({ item, remove, reload }), paging({ page, pageCount, count, setPage })
//   exposes: { reload(): Promise<void>; setPage(p): Promise<void> }       // search({ ...query, page, pageSize })

// EntityForm — create ("new") / edit one item
//   props: { service: IEntityService<T>; id: string | number }
//   slots: default({ item })                                              // item from newEntity() or details(id)
//   emits: "saved" (item: T) | "cancel"                                   // save() result is the `saved` field
```

---

## See also

- [entities.namespaces.md](entities.namespaces.md) — which import specifier each type comes from
- [entities.instructions.md](entities.instructions.md) — the workflow that uses these signatures
- [entities.examples.md](entities.examples.md) — a full worked entity slice
