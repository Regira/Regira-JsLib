# Regira JsLib Auth — AI Agent Instructions

Front-end authentication (`regira_modules/vue/auth`): JWT bearer auth layered onto the shared
[axios instance](../../http/ai/http.instructions.md), with pluggable token storage, a Pinia auth store,
a permission-aware route guard, and login UI. Install it **after** the IoC/http and router are set up.

> **Never guess** a signature or endpoint — verify in [auth.signatures.md](auth.signatures.md). Worked
> wiring: [auth.examples.md](auth.examples.md).

## Import

```ts
import {
    plugin as authPlugin,
    useAuthStore,
    useAuth,
    LocalStorageTokenManager,
    CookieTokenManager,
    MemoryTokenManager,
    AuthService,
    LoginModal,
    LogoutForm,
    ForgotPasswordModal,
    ChangePasswordForm,
    ResetPasswordForm,
    useLoginForm,
    useForgotPasswordForm,
    useChangePasswordForm,
    useResetPasswordForm,
} from "regira_modules/vue/auth"
```

## Setup — the auth plugin

Install once at startup, passing the **same axios instance** from `initAxios` and a token manager:

```ts
app.use(authPlugin, {
    axios, // the shared instance (initAxios)
    tokenManager: new LocalStorageTokenManager(),
    clientApp: appConfig.clientApp,
    loginUrl: appConfig.loginUrl, // optional; defaults to the "auth" endpoint
    enableRouteGuard: true, // default true
    enabled: true, // default true; pass false to disable auth entirely
    onAuthenticationChange: (authData) => {},
})
```

`install` is **async** — it `await`s a token validation on load. It: builds the auth service, resolves
the auth store, exposes `$auth` globally, adds the **bearer request interceptor**, validates any saved
token, installs the route guard, and adds the **401 auto-logout response interceptor**.

## Token storage

A token manager (`ITokenManager`: `get/set token`) decides where the JWT lives. Three implementations,
all keyed by `prefix + "auth:token"`:

| Manager                             | Storage                                        |
| ----------------------------------- | ---------------------------------------------- |
| `LocalStorageTokenManager(prefix?)` | `localStorage` (persists across tabs/restarts) |
| `CookieTokenManager(prefix?)`       | a cookie (`path=/`)                            |
| `MemoryTokenManager(token?)`        | in-memory (cleared on reload)                  |

The bearer interceptor reads `tokenManager.token`; you never set headers manually.

## Auth store (`useAuthStore`)

The Pinia store is the reactive source of truth for components:

- **state/getters:** `isAuthenticated`, `isRequired`, `authData`, `displayName`, `hasPermission(p)`,
  `hasClaim(type, value?)`, `getClaimValue(type)`, `clientApp`, `enabled`.
- **actions:** `login({ username, password })`, `validateToken()`, `refresh(o)`, `logout()`, `setClientApp(c)`.

`authData` (`IAuthData`) is decoded from the JWT: `userId`, `name`, `email`, `displayName`, `culture`,
`role`, `expires`, plus `get(claim)`, `hasClaim`, `hasPermission`.

## Endpoints (`AuthService`)

URLs are **relative** to the axios `baseURL` (no leading slash):

| Method                      | HTTP | URL                            | Body                                                    |
| --------------------------- | ---- | ------------------------------ | ------------------------------------------------------- |
| `login(username, password)` | POST | `auth` (or `options.loginUrl`) | `{ username, password }` → `{ token, isAuthenticated }` |
| `refresh(queryParams?)`     | POST | `auth/refresh/?{query}`        | —                                                       |
| `validateToken()`           | POST | `auth/validate`                | — (only when a token exists; 401 clears it)             |
| `changePassword(input)`     | POST | `auth/password`                | `{ newPassword, currentPassword }`                      |
| `forgotPassword(input)`     | POST | `auth/password/recover`        | `{ username, siteUrl, siteName? }`                      |
| `resetPassword(input)`      | POST | `auth/password/reset`          | `{ token, password }`                                   |
| `logout()`                  | —    | —                              | client-side only: clears the stored token               |

`authenticate({ token, isAuthenticated })` stores the token and returns an `AuthData`; a falsy
`isAuthenticated` clears the token.

## Interceptors

- **`addBearerHeader(axios, tokenManager)`** — request interceptor; sets `Authorization: Bearer <token>`
  when a token is present.
- **`autoLogoutOnFailedRequest(axios, store)`** — response interceptor; on a **401** for a non-`auth/`
  URL it sets `authRequired` and re-validates the token (triggering the login popup). 403 is not handled.

Both are installed automatically by the plugin and are **not exported** from `regira_modules/vue/auth`
(internal); they are listed here only to document the request/response behavior.

## Route guard

`routeGuard({ router, store })` runs `router.beforeEach`:

- `meta.allowAnonymous` → always allowed.
- Authenticated: each matched route's `meta.policy(store)` and `meta.permissions: string[]`
  (via `store.hasPermission`) must pass, else redirect to route **`forbidden`** (`query.url` = target).
- Not authenticated: sets `authRequired` and **allows navigation** (the app shows a login popup rather
  than redirecting). Define an `allowAnonymous` route for public pages and a `forbidden` route.

## Account UI — wire the FULL surface, shown on time

**When an app has authentication, build the complete account surface, not just a login form.** The
components and composables exist for all of it — use them instead of hand-rolling:

| Concern                                 | Component                                           | Composable              |
| --------------------------------------- | --------------------------------------------------- | ----------------------- |
| Sign in                                 | `LoginForm` (inside `LoginModal`)                   | `useLoginForm`          |
| Forgot password (request recovery mail) | slot into `ForgotPasswordModal`                     | `useForgotPasswordForm` |
| Reset password (from the mail link)     | `ResetPasswordForm`                                 | `useResetPasswordForm`  |
| Change password (signed-in user)        | `ChangePasswordForm`                                | `useChangePasswordForm` |
| Sign out                                | `LogoutForm` (or `store.logout()` in a header menu) | —                       |

- **Show the login form on time.** Gate the main content and pop the login modal immediately for
  anonymous users — never render a dashboard an anonymous user can't do anything with:

    ```vue
    <LoadingContainer :isLoading="$appStatus != AppStatus.Ready && (!$auth.enabled || $auth.isAuthenticated)"><Main /></LoadingContainer>
    <LoginModal v-if="showLogin" ... />
    ```

    ```ts
    const showLogin = computed(() => authStore.isRequired && !authStore.isAuthenticated)
    ```

- **Gate `LoginModal` with `v-if="showLogin"`** (the canonical `App.vue` does): unmounting removes the
  mask and dialog atomically. Keeping it mounted and toggling visibility can strand the leave-transition,
  leaving an invisible full-screen mask that swallows every click.
- `useLoginForm(props, emit)` → `{ username, password, failed, signingIn, isLockedOut, handleSubmit, handleForgotPassword }`.
- `useForgotPasswordForm(props, emit, { siteUrl, siteName? })` → `{ username, isLoading, isFormValid, isSuccess, handleSubmit }`.
- `useChangePasswordForm(emit)` / `useResetPasswordForm({ token }, emit)` → password fields + match/validity
  state + `handleSubmit` (see [auth.signatures.md](auth.signatures.md)).
- All form components are plain-Bootstrap reference skins — restyle, wrap, or eject them
  (`scaffold.mjs --ui LoginForm|ChangePasswordForm|ResetPasswordForm`); the modals render the app-wide
  modal via `injectModal()`, so a `modalPlugin { Modal }` swap reskins them too.

## `$auth` global

When enabled the plugin sets `app.config.globalProperties.$auth` (`IGlobalAuth`: `enabled`, `clientApp`,
`tokenManager`, `service`, `authData`, `isAuthenticated`, `isRequired`); `useAuth()` returns the same
object outside components. Prefer the store in components.

## Gotchas

- **Install order:** after the router is on `app` (the plugin reads `$router`) and after `initAxios` —
  pass that same axios instance.
- **`logout()` is client-side** — it only clears the token; there is no server call.
- **No login redirect:** unauthenticated navigation is allowed (popup model), so you must provide the
  login UI and a `forbidden` route; only `permissions`/`policy` failures redirect.
- **Endpoints are relative** (`"auth"`, `"auth/validate"`) — they resolve against the axios `baseURL`.
- **`clientApp` on login:** `login()` posts only `{ username, password }` — it does **not** append `?clientApp=`.
  When the API makes `clientApp` the JWT audience (Regira's `AccountControllerBase` does), pass
  `loginUrl: "auth?clientApp=<clientApp>"` in the plugin options; the store's `clientApp` is not sent on the
  login request itself.
- **Password-reset link:** the recover email lands at `{siteUrl}/?token=<base64>` (root path). Read the token
  from **vue-router `route.query.token`** (preserves `+`), never `URLSearchParams` — it turns `+` into a space
  and corrupts the base64.

## See also

- [auth.signatures.md](auth.signatures.md) · [auth.examples.md](auth.examples.md)
- [regira_modules.vue.http](../../http/ai/http.instructions.md) · [regira_modules.vue.ioc](../../ioc/ai/ioc.instructions.md)
- [Entities](../../entities/ai/entities.instructions.md) — its requests ride this auth
