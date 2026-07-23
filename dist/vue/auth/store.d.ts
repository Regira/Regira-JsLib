import { type Ref, type ComputedRef } from "vue";
import { type Store } from "pinia";
import type { IAuthData } from "./AuthData";
import type { LoginInput } from "./useLoginForm";
export interface IDefineAuthStore {
    enabled: Ref<boolean>;
    clientApp?: Ref<string | undefined>;
    authData: Ref<IAuthData>;
    authRequired: Ref<boolean>;
    isAuthenticated: ComputedRef<boolean>;
    isRequired: ComputedRef<boolean>;
    hasPermission: ComputedRef<(permission: string) => boolean>;
    displayName: ComputedRef<string | undefined>;
    hasClaim: ComputedRef<(type: string, value?: string) => boolean>;
    getClaimValue: ComputedRef<(type: string) => string | Array<string> | undefined>;
    setClientApp(clientApp?: string): void;
    login({ username, password }: LoginInput): Promise<boolean>;
    validateToken(): Promise<boolean>;
    refresh(o: Record<string, unknown>): Promise<boolean>;
    logout(): void;
}
export interface IAuthStore extends Store {
    enabled: boolean;
    clientApp?: string | undefined;
    authData: IAuthData;
    authRequired: boolean;
    isAuthenticated: boolean;
    isRequired: boolean;
    hasPermission: (permission: string) => boolean;
    displayName: string | undefined;
    hasClaim: (type: string, value?: string) => boolean;
    getClaimValue: (type: string) => string | Array<string> | undefined;
    setClientApp(clientApp?: string): void;
    login({ username, password }: LoginInput): Promise<boolean>;
    validateToken(): Promise<boolean>;
    refresh(o: Record<string, unknown>): Promise<boolean>;
    logout(): void;
}
export declare function createStore(): IDefineAuthStore;
export declare namespace createStore {
    var storeName: string;
}
export declare const useAuthStore: import("pinia").StoreDefinition<string, Pick<IDefineAuthStore, "authRequired" | "enabled" | "clientApp" | "authData">, Pick<IDefineAuthStore, "isAuthenticated" | "displayName" | "isRequired" | "hasPermission" | "hasClaim" | "getClaimValue">, Pick<IDefineAuthStore, "login" | "refresh" | "setClientApp" | "validateToken" | "logout">>;
export default useAuthStore;
