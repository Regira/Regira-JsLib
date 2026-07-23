import { type Ref } from "vue";
import { type IEntity } from "../abstractions";
export interface IPoolCache {
    persistentTypes: Array<string>;
    set<T extends IEntity>(item: T): Ref<T>;
    get<T extends IEntity>(type: string, key: number | string): Ref<T> | undefined;
    remove<T extends IEntity>(item: T): boolean;
    hasType(type: string): boolean;
    getAll<T extends IEntity>(type: string): Array<Ref<T>>;
    getEntityMap(type: string): Map<number | string, any>;
}
type ValueItem = IEntity & {
    constructor: {
        name: string;
    };
};
type ICacheOptions = {
    interval?: number;
    expires?: number;
    maxItems?: number;
};
export declare class PoolCache implements IPoolCache {
    _cache: Map<string, Map<string | number, Ref<ValueItem, ValueItem>>>;
    _expires: number;
    _maxItems: number;
    persistentTypes: Array<string>;
    constructor({ interval, expires, maxItems }?: ICacheOptions);
    set<T extends ValueItem>(item: T): Ref<T>;
    get<T extends ValueItem>(type: string, key: number | string): Ref<T> | undefined;
    remove<T extends ValueItem>(item: T): boolean;
    hasType(type: string): boolean;
    getAll<T extends IEntity>(type?: string): Array<Ref<T>>;
    findReferences<T extends ValueItem>(input: T): Array<Ref<ValueItem>>;
    getEntityMap(type: string): Map<number | string, Ref<ValueItem>>;
    cleanup(): void;
}
export default PoolCache;
