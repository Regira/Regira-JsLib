import type { Ref } from "vue";
import type { IEntity, IEntityService, IPagingInfo, SearchResult } from "../abstractions";
import type { IPoolCache } from "./PoolCache";
export interface IPoolService<T extends IEntity> extends IEntityService<T> {
    get(input: T): Ref<T> | undefined;
    getMany(input: Array<T>): Array<Ref<T>>;
}
export declare class PoolService<T extends IEntity> implements IPoolService<T> {
    private service;
    private cache;
    private type;
    constructor(service: IEntityService<T>, cache: IPoolCache, type: string);
    details(id: string | number): Promise<T | undefined>;
    list(so?: object | undefined): Promise<Array<T>>;
    search(so?: object | undefined): Promise<SearchResult<T>>;
    searchUnion(searchObjects: Array<object>, pagingInfo?: IPagingInfo): Promise<SearchResult<T>>;
    save(item: T): Promise<{
        saved: T;
        isNew: boolean;
    }>;
    remove(item: T): Promise<void>;
    get(item: T): Ref<T> | undefined;
    getMany(items: Array<T>): Array<Ref<T>>;
    set(item: T): Ref<T>;
    setMany(items: Array<T>): Array<Ref<T>>;
    toEntity(item: object): T;
    newEntity(values?: Record<string, any> | undefined): Promise<T>;
}
export default PoolService;
