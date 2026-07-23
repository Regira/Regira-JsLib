import { type Ref, type ComputedRef } from "vue";
import { type RouteRecordRaw } from "vue-router";
import { type FeedbackOut } from "../../ui/feedback";
import type { IEntity } from "../abstractions/IEntity";
import type { IEntityService } from "../abstractions/IEntityService";
export type DetailsOut<T extends IEntity> = {
    item: Ref<T | undefined>;
    routeId: ComputedRef<string>;
    isNew: ComputedRef<boolean>;
    overviewUrl?: RouteRecordRaw | string;
    isForm: ComputedRef<boolean>;
    isFiche: ComputedRef<boolean>;
    hasFiche: ComputedRef<boolean>;
    isLoading: Ref<boolean>;
    feedback: FeedbackOut;
    load(): Promise<void>;
};
export declare function useDetails<T extends IEntity>(entityService: IEntityService<T>, feedback?: FeedbackOut): DetailsOut<T>;
export default useDetails;
