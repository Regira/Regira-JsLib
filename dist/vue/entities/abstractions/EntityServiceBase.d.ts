import { type AxiosInstance } from "axios";
import { type IEntity } from "./IEntity";
import type { IConfig } from "./IConfig";
import { type IPagingInfo } from "./PagingInfo";
import type { ISortByInfo } from "./SortByInfo";
import type { IEntityService } from "./IEntityService";
import type { SearchResult, SaveResult } from "./IEntityService";
import type { ISearchObject } from "./ISearchObject";
type HasDefaultPageSize = {
    defaultPageSize: number;
};
export declare abstract class EntityServiceBase<T extends IEntity> implements IEntityService<T>, HasDefaultPageSize {
    protected axios: AxiosInstance;
    protected config: IConfig;
    defaultPageSize: number;
    constructor(axios: AxiosInstance, config: IConfig);
    /** Returns the URL or throws a clear error instead of issuing a request to `undefined`. */
    private requireUrl;
    /** Returns the item's `$id` or throws instead of building a `/undefined` URL. */
    private requireId;
    /**
     * `GET /{id}`. The server 404s on an archived row, so pass `{ archived: ArchivedFilter.included }`
     * to resolve one (the only way to open it in a form and restore it).
     */
    details(id: string | number, so?: ISearchObject): Promise<T | undefined>;
    /**
     * `GET {listUrl}` — uncounted rows. Paging and sorting ride **this argument**, flat, not the
     * `SearchObject` class: `list({ ...so, pageSize: 0, sortBy: ["TitleDesc"] })`. `ISearchObject` extends
     * `Record<string, any>`, so any other key reaches the query string too (arrays as repeated keys).
     */
    list(so?: ISearchObject & IPagingInfo & Partial<ISortByInfo>): Promise<Array<T>>;
    /**
     * `GET {searchUrl}` — rows **plus `count`**, on simple and complex entities alike. Paging and sorting
     * ride this argument, flat: `search({ ...so, pageSize: 25, page: 2, sortBy: ["Created"] })`.
     */
    search(so?: ISearchObject & IPagingInfo & Partial<ISortByInfo>): Promise<SearchResult<T>>;
    searchUnion(searchObjects: Array<ISearchObject>, extra?: IPagingInfo | ISortByInfo): Promise<SearchResult<T>>;
    save(item: T): Promise<SaveResult<T>>;
    remove(item: T): Promise<void>;
    update(item: T): Promise<T | undefined>;
    insert(item: T): Promise<T | undefined>;
    protected fetchItems<TResult extends {
        items: Array<T>;
    }>(api: string, so?: ISearchObject & IPagingInfo & Partial<ISortByInfo>): Promise<TResult>;
    protected processItem(item: T | undefined): T | undefined;
    protected prepareItem(item: T): T;
    protected createInstance<T>(type: {
        new (): T;
    }): T;
    newEntity(values?: Record<string, any>): Promise<T>;
    abstract toEntity(item: Object): T;
}
export default EntityServiceBase;
