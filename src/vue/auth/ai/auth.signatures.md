# Regira JsLib Auth — API Signatures Reference

Verbatim TypeScript signatures for `regira_modules/vue/auth`. Do not guess — look up here first.

```ts
import {
    plugin,
    useAuth,
    useAuthStore,
    createStore,
    routeGuard,
    AuthService,
    CookieTokenManager,
    MemoryTokenManager,
    LocalStorageTokenManager,
    useLoginForm,
    useForgotPasswordForm,
    LoginForm,
    LoginModal,
    LogoutForm,
    ForgotPasswordModal,
    type IGlobalAuth,
    type ITokenManager,
    type IAuthStore,
    type IDefineAuthStore,
} from "regira_modules/vue/auth"
```

## Auth data

```ts
export interface IAuthData {
    isAuthenticated: boolean
    expires: number
    userId?: string
    name?: string
    email?: string
    displayName?: string
    culture?: string
    role?: string
    get(claimType: string): string | Array<string> | undefined
    hasClaim(claimType: string, claimValue?: string): boolean
    hasPermission(value: string): boolean
}
// NOTE: the `AuthData` *class* is internal — it is NOT re-exported from "regira_modules/vue/auth"
// (no deep-import subpath either). Only the `IAuthData` type is reachable; code against the type.
export class AuthData implements IAuthData {
    constructor(token?: string, options?: { isAuthenticated: boolean })
    /* + IAuthData members */
}
```

## Auth service

```ts
export type IAuthenticateInput = { token: string; isAuthenticated: boolean }
export type IChangePasswordInput = { newPassword: string; currentPassword: string }
export type IForgotPasswordInput = { username: string; siteUrl: string; siteName?: string }
export type IResetPasswordInput = { token: string; password: string }

export interface IAuthService {
    options: IAuthOptions
    authenticate({ token, isAuthenticated }: IAuthenticateInput): IAuthData
    login(username: string, password: string, clientApp?: string): Promise<IAuthData>
    refresh(o?: Record<string, any>): Promise<IAuthData>
    validateToken(): Promise<IAuthData>
    logout(): void
    changePassword(input: IChangePasswordInput): Promise<void>
    forgotPassword(input: IForgotPasswordInput): Promise<void>
    resetPassword(input: IResetPasswordInput): Promise<void>
}
export const emptyAuthData: () => IAuthData // internal — NOT re-exported from the barrel
export class AuthService implements IAuthService {
    constructor(axios: AxiosInstance, tokenManager: ITokenManager, options?: IAuthOptions)
    /* + IAuthService members */
}
```

## Auth root & options

```ts
export type IAuthOptions = { clientApp?: string; loginUrl?: string }
export interface IGlobalAuth {
    enabled: boolean
    clientApp?: string
    tokenManager: ITokenManager
    service: IAuthService
    authData: IAuthData
    isAuthenticated: boolean
    isRequired: boolean
}
export function createAuth(options: IAuthOptions & { enabled: boolean; tokenManager: ITokenManager; axios: AxiosInstance }): IAuth
export const useAuth: () => IAuth
```

## Token managers

```ts
export interface ITokenManager {
    get token(): string | undefined
    set token(value: string | undefined)
}
export class CookieTokenManager implements ITokenManager {
    constructor(prefix?: string)
    get fullKey(): string
}
export class MemoryTokenManager implements ITokenManager {
    constructor(_token: string | undefined)
}
export class LocalStorageTokenManager implements ITokenManager {
    constructor(prefix?: string)
    get fullKey(): string
}
// key = prefix + "auth:token"
```

## Interceptors

```ts
// NOTE: both interceptors are internal — they are installed automatically by the auth `plugin`
// and are NOT re-exported from "regira_modules/vue/auth". Shown for reference only.
export function addBearerHeader(axios: AxiosInstance, tokenManager: ITokenManager): AxiosInstance
export function autoLogoutOnFailedRequest(
    axios: AxiosInstance,
    store: Store & { isAuthenticated: boolean; authData: IAuthData; validateToken(): Promise<boolean> }
): void
```

## Store

```ts
export interface IAuthStore extends Store {
    enabled: boolean
    clientApp?: string
    authData: IAuthData
    authRequired: boolean
    isAuthenticated: boolean
    isRequired: boolean
    hasPermission: (permission: string) => boolean
    displayName: string | undefined
    hasClaim: (type: string, value?: string) => boolean
    getClaimValue: (type: string) => string | Array<string> | undefined
    setClientApp(clientApp?: string): void
    login({ username, password }: LoginInput): Promise<boolean>
    validateToken(): Promise<boolean>
    refresh(o: Record<string, any>): Promise<boolean>
    logout(): void
}
export function createStore(): IDefineAuthStore // createStore.storeName
export const useAuthStore // Pinia StoreDefinition (IAuthStore)
```

## Plugin

```ts
type Input<TStore extends IAuthStore, TTokenManager extends ITokenManager> = IAuthOptions & {
    tokenManager: TTokenManager
    authStore?: TStore
    axios: AxiosInstance
    enableRouteGuard?: boolean // default true
    enabled?: boolean // default true
    onAuthenticationChange?(auth: IAuthData): void
}
export const plugin: {
    install<TStore extends IAuthStore = IAuthStore, TTokenManager extends ITokenManager = ITokenManager>(
        app: App,
        options: Input<TStore, TTokenManager>
    ): Promise<void>
}
```

## Route guard

```ts
export const routeGuard: (args: { router: Router; store: Store & { isAuthenticated: boolean; hasPermission(value: string): boolean } }) => void
// reads route meta: allowAnonymous, policy(store) => boolean, permissions: string[]
```

## Login UI

```ts
export type LoginInput = { username: string; password: string }

export function useLoginForm(
    props: { username?: string },
    emit: ILoginEmits
): {
    username: Ref<string>
    password: Ref<string>
    failed: Ref<boolean>
    signingIn: Ref<boolean>
    isLockedOut: Ref<boolean>
    handleSubmit: () => Promise<void>
    handleForgotPassword: () => void
}
// ILoginEmits: "forgotPassword" | "signingIn" | "success" | "fail", each (username?: string)

export function useForgotPasswordForm(
    props: { username?: string },
    emit: IForgotPasswordEmits,
    options: { siteUrl: string; siteName?: string }
): {
    username: Ref<string>
    isLoading: Ref<boolean>
    isFormValid: ComputedRef<boolean>
    isSuccess: Ref<boolean | undefined>
    handleSubmit: () => Promise<void>
}
// IForgotPasswordEmits: "success" | "fail" | "login"

// Components (default exports): LoginForm, LoginModal, LogoutForm, ForgotPasswordModal
// LoginForm/LoginModal props: { username?: string; signingIn?: boolean } / { username?; title? }
//   emits: success | forgotPassword | signingIn | fail   (each username?: string)
```

## See also

- [auth.instructions.md](auth.instructions.md) · [auth.examples.md](auth.examples.md)
