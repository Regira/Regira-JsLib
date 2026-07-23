import { type AxiosInstance, type AxiosResponse, AxiosError } from "axios"
import { type IEntity, isNewEntity } from "./IEntity"
import type { IConfig } from "./IConfig"
import { createQueryString } from "../../http/query"
import { cleanQueryParams } from "../utilities/query"
import { DEFAULT_PAGESIZE, type IPagingInfo } from "./PagingInfo"
import type { ISortByInfo } from "./SortByInfo"
import type { IEntityService } from "./IEntityService"
import type { DetailsResult, ListResult, SearchResult, SaveResult, SavedResult, DeleteResult } from "./IEntityService"
import type { ISearchObject } from "./ISearchObject"

type HasDefaultPageSize = { defaultPageSize: number }

export abstract class EntityServiceBase<T extends IEntity> implements IEntityService<T>, HasDefaultPageSize {
    defaultPageSize = DEFAULT_PAGESIZE
    constructor(
        protected axios: AxiosInstance,
        protected config: IConfig
    ) {
        if (axios == null) {
            throw new Error(
                `EntityServiceBase ("${config?.key ?? "unknown entity"}") was constructed without an axios instance. ` +
                    `Register the shared axios in the IoC container so services can resolve it: ` +
                    `app.use(servicesPlugin, { configure: (sp) => sp.add("axios", () => initAxios({ api })) }).`
            )
        }
        // Resolve the per-operation URLs off config.api when not set explicitly.
        // A dedicated search endpoint (config.searchUrl = api + "/search") is set per entity when one exists.
        config.detailsUrl ??= config.api
        config.listUrl ??= config.api
        config.searchUrl ??= config.api
        config.saveUrl ??= config.api
        config.deleteUrl ??= config.api
        this.defaultPageSize = config.defaultPageSize ?? DEFAULT_PAGESIZE
    }

    /** Returns the URL or throws a clear error instead of issuing a request to `undefined`. */
    private requireUrl(url: string | undefined, field: string): string {
        if (url == null || url === "") {
            throw new Error(
                `EntityServiceBase ("${this.config.key ?? "unknown entity"}"): config.${field} could not be resolved ` +
                    `(config.api is also unset). Set config.api so the request URL can be built.`
            )
        }
        return url
    }

    /** Returns the item's `$id` or throws instead of building a `/undefined` URL. */
    private requireId(item: T, op: string): string | number {
        const id = item.$id
        if (id == null || id === "") {
            throw new Error(
                `EntityServiceBase ("${this.config.key ?? "unknown entity"}"): cannot ${op} — $id is ${String(id)}. ` +
                    `$id/$title are prototype getters; spreading a model ({ ...item }) drops them. ` +
                    `Mutate the instance in place (item.prop = …) instead of spreading before ${op}.`
            )
        }
        return id
    }

    public async details(id: string | number): Promise<T | undefined> {
        const response = await this.axios.get<DetailsResult<T>>(`${this.requireUrl(this.config.detailsUrl, "detailsUrl")}/${id}`)
        if (response?.status == 200) {
            const {
                data: { item },
            } = response
            return this.processItem(item)
        }
        throw response
    }
    public async list(so?: ISearchObject & IPagingInfo): Promise<Array<T>> {
        const { items } = await this.fetchItems<ListResult<T>>(this.requireUrl(this.config.listUrl, "listUrl"), so)

        return items.map((item) => this.processItem(item)!)
    }
    public async search(so?: ISearchObject & IPagingInfo): Promise<SearchResult<T>> {
        const { items, count } = await this.fetchItems<SearchResult<T>>(this.requireUrl(this.config.searchUrl, "searchUrl"), so)

        return {
            items: items.map((item) => this.processItem(item)!),
            count,
        }
    }
    public async searchUnion(searchObjects: Array<ISearchObject>, extra?: IPagingInfo | ISortByInfo): Promise<SearchResult<T>> {
        const queryParams = {
            ...(this.config.baseQueryParams || {}),
            ...(extra || {}),
        }
        const queryString = createQueryString(cleanQueryParams(queryParams, this.defaultPageSize))
        const url = `${this.requireUrl(this.config.searchUrl, "searchUrl")}?${queryString}`
        const {
            data: result,
            //  status,
        } = await this.axios.post<SearchResult<T>>(url, searchObjects).then((response: AxiosResponse<SearchResult<T>>) => response)
        return result
    }

    async save(item: T): Promise<SaveResult<T>> {
        const isNew = isNewEntity(item.$id)
        const saved = isNew ? await this.insert(item) : await this.update(item)
        return { saved: this.processItem(saved)!, isNew }
    }
    async remove(item: T): Promise<void> {
        const url = `${this.requireUrl(this.config.deleteUrl, "deleteUrl")}/${this.requireId(item, "delete")}`
        await this.axios.delete<DeleteResult<T>>(url).then((r) => r.data)
    }

    async update(item: T) {
        const url = `${this.requireUrl(this.config.saveUrl, "saveUrl")}/${this.requireId(item, "update")}`
        const prepared = this.prepareItem(item)
        const response = (await this.axios.put<SavedResult<T>>(url, prepared)) as any
        if (response instanceof AxiosError) {
            throw response
        }
        const { item: saved } = await response.data
        return this.processItem(saved)
    }

    async insert(item: T) {
        const url = this.requireUrl(this.config.saveUrl, "saveUrl")
        const prepared = this.prepareItem(item)
        const response = await this.axios.post<SavedResult<T>>(url, prepared)
        if (response instanceof AxiosError) {
            throw response
        }
        const { item: saved } = response.data
        if ("id" in saved) {
            // quickfix to set id in original item
            Object.defineProperty(item, "id", { value: saved.id, writable: true, configurable: true, enumerable: true })
        }
        return this.processItem(saved)
    }

    protected async fetchItems<TResult extends { items: Array<T> }>(api: string, so?: ISearchObject & IPagingInfo): Promise<TResult> {
        const queryParams = {
            ...(this.config.baseQueryParams || {}),
            ...(so || {}),
        }

        if (!queryParams.pageSize && queryParams.pageSize !== 0) {
            queryParams.pageSize = this.defaultPageSize
        }
        // hide archived items by default
        if (!("isArchived" in queryParams) || (queryParams as { isArchived?: boolean }).isArchived == null) {
            queryParams["isArchived"] = false
        }

        const queryString = createQueryString(cleanQueryParams(queryParams, this.defaultPageSize))
        const fetchUrl = `${api}?${queryString}`
        const {
            data: result,
            //  status,
        } = await this.axios.get<TResult>(fetchUrl).then((response: AxiosResponse<TResult>) => response)

        return result
    }

    // abstract to force items to be instances of T
    // https://www.typescriptlang.org/docs/handbook/2/generics.html (not working for generic generics...)
    protected processItem(item: T | undefined): T | undefined {
        if (item == null) {
            return undefined
        }
        const entity = this.toEntity(item)
        if ("created" in item) {
            const itemWithCreated = entity as T & { created: string }
            if (itemWithCreated.created != null) {
                ;(entity as T & { created: Date }).created = new Date(Date.parse(itemWithCreated.created))
            }
        }
        if ("lastModified" in item) {
            const itemWithLastModified = entity as T & { lastModified: string }
            if (itemWithLastModified.lastModified != null) {
                ;(entity as T & { lastModified: Date }).lastModified = new Date(Date.parse(itemWithLastModified.lastModified))
            }
        }
        return entity
    }
    protected prepareItem(item: T): T {
        // remove all (private) properties starting with '_'
        Object.keys(item).forEach((key) => {
            if (key[0] == "_") {
                delete (item as Record<string, unknown>)[key]
            }
        })
        return item
    }
    protected createInstance<T>(type: { new (): T }): T {
        return new type()
    }

    // an empty item as an instance of T
    async newEntity(values?: Record<string, any>): Promise<T> {
        return this.toEntity(values || {})
    }
    // creates an instance of T from a plain object
    abstract toEntity(item: Object): T
}

export default EntityServiceBase
