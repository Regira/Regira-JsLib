# Regira Auth (front-end)

`regira_modules/vue/auth` — JWT bearer authentication layered onto the shared
[axios instance](../http/README.md): login/token management, a Pinia auth store, a
permission-aware route guard, and login UI.

## What it provides

| Export | Purpose |
|--------|---------|
| `plugin` (auth) | Wires everything at startup: bearer interceptor, token validation, route guard, 401 auto-logout. |
| `LocalStorageTokenManager` / `CookieTokenManager` / `MemoryTokenManager` | Pluggable token storage (`ITokenManager`). |
| `useAuthStore` | Reactive auth state: `isAuthenticated`, `displayName`, `hasPermission`, `login`, `logout`, … |
| `AuthService` | The HTTP calls: login, refresh, validate, change/forgot/reset password. |
| `routeGuard` | `beforeEach` guard reading `meta.allowAnonymous` / `permissions` / `policy`. |
| `useAuth` / `$auth` | The global auth object (service, token manager, current `authData`). |
| `LoginForm` / `LoginModal` / `LogoutForm` / `ForgotPasswordModal`, `useLoginForm`, `useForgotPasswordForm` | Login UI. |

## How it fits

```
initAxios → shared axios ──┐
                           ├─ authPlugin: addBearerHeader(axios, tokenManager)   (every request authed)
tokenManager ──────────────┘            + validateToken on load
                                        + routeGuard(router, store)
                                        + autoLogoutOnFailedRequest (401 → re-validate)
useAuthStore  ←─ components read isAuthenticated / displayName / hasPermission
```

Install **after** the router and `initAxios`, passing that same axios instance. Auth endpoints are
relative to the axios `baseURL` (`auth`, `auth/validate`, `auth/refresh`, `auth/password*`). `logout()`
is client-side (clears the token); unauthenticated navigation is allowed (the app shows a login popup),
so provide a login view and a `forbidden` route.

## Reference

Exact signatures, the endpoint table, and worked wiring are in the AI guides:
[ai/auth.instructions.md](ai/auth.instructions.md), [ai/auth.signatures.md](ai/auth.signatures.md),
[ai/auth.examples.md](ai/auth.examples.md) — also served by the Regira MCP server as
`regira_modules.vue.auth`.
