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
    details(id: string | number): Promise<T | null>;
    list(so?: ISearchObject & IPagingInfo): Promise<Array<T>>;
    search(so?: ISearchObject & IPagingInfo): Promise<SearchResult<T>>;
    searchUnion(searchObjects: Array<ISearchObject>, extra?: IPagingInfo | ISortByInfo): Promise<SearchResult<T>>;
    save(item: T): Promise<SaveResult<T>>;
    remove(item: T): Promise<void>;
    update(item: T): Promise<T | null>;
    insert(item: T): Promise<T | null>;
    protected fetchItems<TResult extends {
        items: Array<T>;
    }>(api: string, so?: ISearchObject & IPagingInfo): Promise<TResult>;
    protected processItem(item: T | null): T | null;
    protected prepareItem(item: T): T;
    protected createInstance<T>(type: {
        new (): T;
    }): T;
    newEntity(values?: Record<string, any>): Promise<T>;
    abstract toEntity(item: Object): T;
}
export default EntityServiceBase;
