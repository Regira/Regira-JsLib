import type { AxiosInstance } from "axios";
import type { ITokenManager } from "./token-manager";
import { type IAuthService } from "./auth-service";
import type { IAuthData } from "./AuthData";
export interface IAuth {
    enabled: boolean;
    clientApp?: string;
    tokenManager: ITokenManager;
    service: IAuthService;
}
export interface IGlobalAuth {
    enabled: boolean;
    clientApp?: string;
    tokenManager: ITokenManager;
    service: IAuthService;
    authData: IAuthData;
    isAuthenticated: boolean;
    isRequired: boolean;
}
export type IAuthOptions = {
    clientApp?: string;
    loginUrl?: string;
};
interface Input extends IAuthOptions {
    enabled: boolean;
    tokenManager: ITokenManager;
    axios: AxiosInstance;
}
export declare function createAuth(options: Input): IAuth;
export declare const useAuth: () => IAuth;
export type GlobalAuth = IGlobalAuth | {
    enabled: false;
    authData?: IAuthData;
};
/** called by the auth plugin — the same object it exposes as `$auth` */
export declare function setGlobalAuth(value: GlobalAuth): void;
/**
 * The `$auth` object, script-side: wraps the store the auth plugin was configured with (which may be a
 * custom `authStore`, not this module's default pinia store). Available after the auth plugin installed —
 * same lifecycle caveat as `useAuth()`. Its `authData` getters read the reactive store, so computeds track.
 */
export declare const useGlobalAuth: () => GlobalAuth;
/** display label for the signed-in user — not every JWT carries a displayName claim */
export declare const getAccountName: (auth?: GlobalAuth) => string | undefined;
export {};
