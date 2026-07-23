import { type WritableComputedRef, type ComputedRef } from "vue";
import type { IEntity, IPoolHandler } from "./entities";
export declare function useVModelField<T>(props: Readonly<Record<string, unknown>>, emit: any, name?: string, defaultValue?: T): WritableComputedRef<T>;
export declare function createFromComputedPool<T extends IEntity>(store: IPoolHandler<T>): ComputedRef<(x: Array<T> | T | undefined) => Array<T> | T | undefined>;
export declare function useEventListener(target: HTMLElement | Document | Window, event: string, callback: (e: Event) => void, allChildren?: boolean): void;
