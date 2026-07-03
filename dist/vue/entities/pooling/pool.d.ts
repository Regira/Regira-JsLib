import type { Ref } from "vue";
import { type IEntity, type IEntityService } from "../abstractions";
import { type IPoolService } from "./PoolService";
import { PoolCache, type IPoolCache } from "./PoolCache";
export interface IPoolHandler<T extends IEntity> extends IPoolService<T> {
    service: IPoolService<T>;
    cache: IPoolCache;
    set(item: T): Ref<T>;
    setMany(items: Array<T>): Array<Ref<T>>;
    fromPool<P = Array<T> | T>(input: P): P;
    fromCache(id?: string | number): Ref<T> | null | Array<Ref<T>>;
}
export declare const defaultPoolCache: PoolCache;
export declare function usePooling<T extends IEntity>(service: IEntityService<T>, type: string, cache?: IPoolCache, persistent?: boolean): IPoolHandler<T>;
export default usePooling;
