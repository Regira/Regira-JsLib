import type { AxiosInstance } from "axios";
import type { IConfig } from "./IConfig";
import { type IEntity } from "./IEntity";
import EntityServiceBase from "./EntityServiceBase";
import type { SearchResult } from "./IEntityService";
import type { ISearchObject } from "./ISearchObject";
import type { IPagingInfo } from "./PagingInfo";
export declare abstract class JSONService<T extends IEntity> extends EntityServiceBase<T> {
    protected key: string;
    constructor(axios: AxiosInstance, config: IConfig, key: string);
    get cachedItems(): Array<T>;
    set cachedItems(value: Array<T>);
    fetchJSONItems(): Promise<Array<T>>;
    details(id: string | number): Promise<T | undefined>;
    list(so?: ISearchObject & IPagingInfo): Promise<T[]>;
    search(so?: ISearchObject & IPagingInfo): Promise<SearchResult<T>>;
    save(item: T): Promise<{
        saved: T;
        isNew: boolean;
    }>;
    remove(item: T): Promise<void>;
    processSearchObject(so?: ISearchObject): ISearchObject;
}
export default JSONService;
