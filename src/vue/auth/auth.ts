import type { AxiosInstance } from "axios"
import type { ITokenManager } from "./token-manager"
import { AuthService, type IAuthService } from "./auth-service"
import type { IAuthData } from "./AuthData"

interface IAuth {
    enabled: boolean
    clientApp?: string
    tokenManager: ITokenManager
    service: IAuthService
}

export interface IGlobalAuth {
    enabled: boolean
    clientApp?: string
    tokenManager: ITokenManager
    service: IAuthService
    authData: IAuthData
    isAuthenticated: boolean
    isRequired: boolean
}
export type IAuthOptions = {
    clientApp?: string
    loginUrl?: string
}

interface Input extends IAuthOptions {
    enabled: boolean
    tokenManager: ITokenManager
    axios: AxiosInstance
}

let auth: IAuth
export function createAuth(options: Input): IAuth {
    const { enabled, tokenManager, axios, clientApp, loginUrl } = options
    auth = {
        enabled,
        clientApp,
        tokenManager,
        service: new AuthService(axios, tokenManager, { clientApp, loginUrl }),
    }

    return auth
}

export const useAuth = () => auth

export type GlobalAuth = IGlobalAuth | { enabled: false; authData?: IAuthData }
let globalAuth: GlobalAuth
/** called by the auth plugin — the same object it exposes as `$auth` */
export function setGlobalAuth(value: GlobalAuth) {
    globalAuth = value
}
/**
 * The `$auth` object, script-side: wraps the store the auth plugin was configured with (which may be a
 * custom `authStore`, not this module's default pinia store). Available after the auth plugin installed —
 * same lifecycle caveat as `useAuth()`. Its `authData` getters read the reactive store, so computeds track.
 */
export const useGlobalAuth = () => globalAuth

/** display label for the signed-in user — not every JWT carries a displayName claim */
export const getAccountName = (auth: GlobalAuth = useGlobalAuth()) =>
    auth?.authData?.displayName ?? auth?.authData?.name ?? auth?.authData?.email
