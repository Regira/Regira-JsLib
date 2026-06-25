# Regira JsLib — Project Setup

How to stand up a new `regira_modules` Vue 3 app (Vite + Pinia + vue-router) — the starter `main.ts`,
`App.vue`, router, and plugin wiring. Kept to the basics; add only what you need. Verify any API in
[entities.signatures.md](entities.signatures.md) and the per-module guides.

## 1. Install

Install from npm — the published package ships a built `dist/` with an `exports` map, so the **plain
package specifier resolves with no alias or tsconfig path**:

```jsonc
// package.json
"dependencies": { "regira_modules": "github:Regira/Regira-JsLib" }
```

```ts
import { EntityBase, EntityServiceBase } from "regira_modules/vue/entities"
```

Peer deps: `vue`, `vue-router`, `pinia`, `axios`, `date-fns`, `lodash`.

> **Known-good versions (regira_modules 3.x).** Targets **Vue 3**; install **vue-router 5**, and build
> with **Vite 7** + **@vitejs/plugin-vue 6** — the jump to vue-router 5 / Vite 7 is easy to miss and a
> mismatched major can fail to install. The package currently declares an **impossible `lodash ^4.18.1`
> peer** (the latest lodash is 4.17.21 — an upstream typo), so with npm install using `--legacy-peer-deps`
> (or use pnpm/yarn) until it's fixed.

> **The snippets below use the demo's `@/regira_modules` alias.** In a plain npm install, drop the `@/`
> prefix on the library specifier (write `regira_modules/vue/http`, not `@/regira_modules/vue/http`); the
> `@/...` app alias for your own `src/` files still applies. See [entities.namespaces.md](entities.namespaces.md).

> **Alias (optional — demo vendoring only).** The sample apps vendor `dist/` and alias it, so their
> imports read `@/regira_modules/vue/entities`. You only need this if you vendor `dist/` yourself. To do
> so, add it in **both** places (order matters — the more specific alias first):
> ```ts
> // vite.config.ts → resolve.alias
> { find: "@/regira_modules", replacement: fileURLToPath(new URL("./node_modules/regira_modules/dist", import.meta.url)) },
> { find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) },
> ```
> ```jsonc
> // tsconfig.app.json → compilerOptions.paths
> "@/regira_modules/*": ["./node_modules/regira_modules/dist/*"],
> "@/*": ["./src/*"]
> ```

> **tsconfig & build note.** On TypeScript 6+ use `paths` **without `baseUrl`** — `vue-tsc -b` (what
> `npm run build` runs) errors on `baseUrl` (TS5101) even though `vue-tsc --noEmit` tolerates it, so
> always verify with `npm run build`, not only a `--noEmit` typecheck. If your tsconfig enables
> `erasableSyntaxOnly` (the current Vite `vue-ts` template default), define enum-like values as `const`
> objects + a value type instead of `enum`.

## 2. Project structure

The full template (mirrors the sample apps). Keep the **entity folder set identical for every entity**
— even a simple lookup keeps the same shape, just with thinner files.

```
public/
  config.json                 # runtime config (env-keyed api, title, navigation, flags) — §3
  data/translations.json      # i18n messages (key-first)
src/
  app-config.ts               # loads + types public/config.json (createConfig / useConfig) — §3
  main.ts                     # bootstrap (§5)
  App.vue                     # root shell (§6)
  router/
    router.ts                 # routerFactory(entityRoutes)
    routes.ts                 # static routes (home, error pages, auth pages)
  views/                      # page-level views (Home, NotFound, Forbidden, account, …)
  components/                 # shared UI shell — §10
    entity-navigation/        #   Dashboard / NavBar / NavSearch (built from $configs)
    input/                    #   shared form inputs (DescriptionInput, FormButtonsRow, …)
    layout/                   #   Header / Footer / Main / Modal / LangSelector
    users/                    #   account + auth UI (omit when auth is disabled)
  infrastructure/             # small app-wide plugins/helpers — §10 (keep it basic)
  entities/
    index.ts                  # aggregates every entity plugin + collects routes
    <name>/                   # one slice per entity — ALWAYS the same folder set:
      config/                 #   config.ts (IConfig)
      data/                   #   Entity.ts, EntityService.ts, store.ts
      details/                #   Details.vue, Form.vue
      filter/                 #   Filter.vue, SearchObject.ts
      overview/               #   Overview.vue (list/search)
      selecting/              #   Selector.vue — relation picker for THIS entity (entities.patterns.md)
      index.ts                #   barrel (config, Entity, service, Selector, plugin)
      setup.ts                #   install plugin: addServices + addIcons + $configs (+ routes)
```

> A lookup entity with no list UI keeps the same folders; its `setup.ts` registers only the
> service/icon/config and its views stay minimal.

## 3. Runtime config — `public/config.json`

```json
{ "api": "https://localhost:5001", "culture": "en-US", "clientApp": "my-app", "loginUrl": "https://accounts.example.com/login" }
```

If you use the language plugin (`$t`), also add `public/data/translations.json`. Its shape is
**key-first** — `Record<key, Record<langCode, string> | string>` — *not* language-first (a wrong guess
makes every `$t()` render the raw key):

```json
{
  "signIn": { "en": "Sign in", "nl": "Aanmelden" },
  "save":   { "en": "Save",    "nl": "Bewaren" },
  "appName": "ShoppingManager"
}
```

See [lang.signatures.md](../../lang/ai/lang.signatures.md) (`ITranslationMessages`).

### Typed config loader — `src/app-config.ts`

For anything beyond a toy app, load `config.json` through a small `app-config.ts` so values can be
**environment-keyed** (per Vite `MODE`) and read anywhere via `useConfig()`:

```jsonc
// public/config.json — `api` may be a flat string or an object keyed by Vite MODE
{
  "clientApp": "shopping-manager",
  "api": { "development": "https://localhost:7001", "production": "/api" },
  "includeCredentials": false,
  "title": { "en": "ShoppingManager" }
}
```

```ts
// src/app-config.ts
const { BASE_URL, MODE } = import.meta.env
const appConfig: Record<string, any> = { baseUrl: BASE_URL.replace(/\/$/, ""), env: MODE }

// pick the env-specific value when a key is keyed by MODE, else the value as-is
const pick = (cfg: any, key: string) => cfg[key]?.[appConfig.env] ?? cfg[key]

export function createConfig(raw: Record<string, any>) {
  for (const key of Object.keys(raw)) appConfig[key] = pick(raw, key)
  return appConfig
}
export function useConfig() { return appConfig }
export default appConfig
```

`main.ts` then does `fetch(\`${appConfig.baseUrl}/config.json\`)` → `createConfig(raw)` →
`initAxios({ api, includeCredentials })` before installing plugins. The minimal flat `config.json` in §5
still works; `app-config.ts` just adds env-selection and a typed accessor.

## 4. Router — `src/router.ts`

```ts
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"

const staticRoutes: Array<RouteRecordRaw> = [
  { path: "/", name: "home", component: () => import("@/views/Home.vue"), meta: { allowAnonymous: true } },
  { path: "/forbidden", name: "forbidden", component: () => import("@/views/Forbidden.vue"), meta: { allowAnonymous: true } },
]

export function routerFactory(entityRoutes: Array<RouteRecordRaw>) {
  return createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes: [...staticRoutes, ...entityRoutes] })
}
```

## 5. Bootstrap — `src/main.ts`

Fetch config first, create the shared axios, then install plugins in this order:

```ts
import { createApp } from "vue"
import { createPinia } from "pinia"
import type { RouteRecordRaw } from "vue-router"
import { initAxios } from "@/regira_modules/vue/http"
import { plugin as servicesPlugin, type IServiceProvider } from "@/regira_modules/vue/ioc"
import { plugin as appPlugin, AppStatus, whenAppReady } from "@/regira_modules/vue/app"
import { plugin as langPlugin, useLang } from "@/regira_modules/vue/lang"
import { iconPlugin, screenPlugin, loadingPlugin, modalPlugin, feedbackPlugin } from "@/regira_modules/vue/ui"
import { focus, grow, clickOutside } from "@/regira_modules/vue/directives"
import { plugin as authPlugin, LocalStorageTokenManager } from "@/regira_modules/vue/auth"
import { preloaderPlugin, defaultPoolCache, PoolCache } from "@/regira_modules/vue/entities"
import dateExtensions from "@/regira_modules/extensions/date-extensions"
import entityPlugins from "@/entities"
import { routerFactory } from "@/router"
import App from "@/App.vue"
import loadingImg from "@/assets/loading.gif"

dateExtensions.use()   // serialize dates to JSON without timezone shift

fetch("/config.json").then((r) => r.json()).then(async (config) => {
  const axios = initAxios({ api: config.api, includeCredentials: config.includeCredentials })
  const translations = await fetch("/data/translations.json").then((r) => r.json())

  const app = createApp(App)
  app.use(createPinia())
  app.use(appPlugin, { culture: config.culture })

  // IoC: register the shared axios + the entity pool cache
  app.use(servicesPlugin, {
    configure: (sp: IServiceProvider) => sp.add("axios", () => axios).add(PoolCache.name, () => defaultPoolCache),
  })

  // UI plugins
  app.use(iconPlugin, { source: "bs" })
  app.use(screenPlugin)
  app.use(loadingPlugin, { img: loadingImg })
  app.use(modalPlugin)
  app.use(feedbackPlugin, { autoHideDelay: 2500 })
  app.use(langPlugin, { defaultLang: "en", messages: translations })
  const { setLangCode } = useLang()

  // directives
  app.use(focus); app.use(grow); app.use(clickOutside)

  // entities collect their routes, then build the router
  const entityRoutes: Array<RouteRecordRaw> = []
  app.use(entityPlugins, { routes: entityRoutes })
  app.use(routerFactory([...entityRoutes]))
  app.use(preloaderPlugin)

  // auth last (needs the router on the app)
  app.use(authPlugin, {
    axios,
    tokenManager: new LocalStorageTokenManager(),
    clientApp: config.clientApp,
    loginUrl: config.loginUrl,
    onAuthenticationChange: (auth) => {
      app.config.globalProperties.$setAppStatus(auth.isAuthenticated ? AppStatus.Ready : AppStatus.Init)
      if (auth.isAuthenticated && auth.culture) setLangCode(auth.culture.split("-")[0])
    },
  })

  app.config.globalProperties.$setAppStatus(AppStatus.Mounting)
  app.mount("#app")
  await whenAppReady()
})
```

> **Install order matters:** `servicesPlugin` (axios + `PoolCache`) before any entity plugin; the
> **router before `authPlugin`** (the auth plugin reads `$router` for its route guard); entity plugins
> before `routerFactory` (so their routes are collected). See
> [entities.instructions.md](entities.instructions.md#app-startup-wiring-order).

## 6. Root component — `src/App.vue`

`$feedback`, `$appStatus`, `$auth`, and `$t` are globals from the plugins above:

```vue
<script setup lang="ts">
import { computed } from "vue"
import { RouterView } from "vue-router"
import { Feedback, LoadingContainer } from "@/regira_modules/vue/ui"
import { LoginModal, LoginForm, useAuthStore } from "@/regira_modules/vue/auth"
import { AppStatus } from "@/regira_modules/vue/app"

const authStore = useAuthStore()
const showLogin = computed(() => authStore.isRequired && !authStore.isAuthenticated)
</script>

<template>
  <Feedback :feedback="$feedback" :enable-error-popup="true" />
  <LoadingContainer :is-loading="$appStatus !== AppStatus.Ready && (!$auth.enabled || $auth.isAuthenticated)">
    <RouterView />
  </LoadingContainer>

  <LoginModal :is-visible="showLogin" :title="$t('signIn')">
    <LoginForm />
  </LoginModal>
</template>
```

## 7. Plugins — required vs optional

The entities layer needs only a few globals; install the rest as you actually use them. Install order
still matters where dependencies exist (see the [wiring order](entities.instructions.md#app-startup-wiring-order)).

| Plugin | Provides | Status for the entities layer |
|--------|----------|-------------------------------|
| `createPinia()` | Pinia stores | **Required** (app store, entity stores, auth store) |
| `appPlugin` (`vue/app`) | `$appStatus` / `$setAppStatus`, `$culture` | **Required** — the startup lifecycle and loading gate |
| `servicesPlugin` (`vue/ioc`) | `$services` IoC + `get()` | **Required** — register the shared `axios` and `PoolCache` here; services resolve from here |
| entity plugins (`@/entities`) | routes + service registrations + `$configs` | **Required** — your slices |
| `routerFactory` (vue-router) | routing | **Required** for multi-view slices |
| `iconPlugin` (`vue/ui`) | `$icons` | Required if your views/nav render icons (the demos do) |
| `feedbackPlugin` (`vue/ui`) | `$feedback` | Required if you use the `Feedback` component (the demo `App.vue` does) |
| `loadingPlugin` (`vue/ui`) | `Loading`/`LoadingContainer` components | Required if you use `LoadingContainer` (the demo `App.vue` does). **Must pass `{ img }`** when installed: `app.use(loadingPlugin, { img })` |
| `modalPlugin` (`vue/ui`) | modal host | Optional — only if you use modal forms |
| `langPlugin` (`vue/lang`) | `$t` i18n | Optional — only if you render translated labels |
| directives (`focus`, `grow`, `clickOutside`) | template directives | Optional — only where used |
| `preloaderPlugin` (`vue/entities`) | route preloading | Optional |
| `authPlugin` (`vue/auth`) | bearer auth + `$auth` | **Optional** — see §8 |

> **Icon fonts aren't bundled.** `iconPlugin({ source: "bs" })` only emits Bootstrap-Icons class names
> (`bi bi-*`); install the `bootstrap-icons` npm package and import its CSS in `main.ts`
> (`import "bootstrap-icons/font/bootstrap-icons.css"`) or every icon renders blank. (`source: "fa"` →
> Font Awesome the same way.)

## 8. Running without authentication

Auth is **optional**. The template in §5/§6 is the auth-on path; to run the SPA without a login
(internal tools, demos, or while the back-end has auth disabled), make three changes:

1. **`main.ts` — don't install `authPlugin`.** Remove its import, its `app.use(authPlugin, …)` block,
   and the `LocalStorageTokenManager` import. Nothing else depends on it.
2. **Advance the app to `Ready` yourself.** In the auth-on template, `onAuthenticationChange` is what
   called `$setAppStatus(AppStatus.Ready)`. With auth gone, **nothing reaches `Ready` on its own**
   (`AppStatus` starts at `Init`), so the app would hang on the loading spinner. Set it after mount:

   ```ts
   app.config.globalProperties.$setAppStatus(AppStatus.Mounting)
   app.mount("#app")
   app.config.globalProperties.$setAppStatus(AppStatus.Ready)   // no auth → advance manually
   await whenAppReady()
   ```
3. **`App.vue` — drop the auth UI.** Remove `LoginModal`, `LoginForm`, `useAuthStore`, and the `$auth`
   reference; gate the loading container on app status alone:

   ```vue
   <script setup lang="ts">
   import { RouterView } from "vue-router"
   import { Feedback, LoadingContainer } from "@/regira_modules/vue/ui"
   import { AppStatus } from "@/regira_modules/vue/app"
   </script>

   <template>
     <Feedback :feedback="$feedback" :enable-error-popup="true" />
     <LoadingContainer :is-loading="$appStatus !== AppStatus.Ready">
       <RouterView />
     </LoadingContainer>
   </template>
   ```

> **Keep the auth scaffolding dormant instead?** Install it with `app.use(authPlugin, { …, enabled: false })`.
> Then `$auth` is `{ enabled: false }` and the bearer interceptor is off — but the auth **store** still
> reports protected routes as "required", so either omit `LoginModal` (as above) or mark routes with
> `meta: { allowAnonymous: true }`. In this mode advance to `Ready` from `onAuthenticationChange` (it
> fires once at startup). For a pure no-auth app, removing the plugin (above) is simpler.

## 9. Add entities

Create `src/entities/<name>/` slices — each with the full folder set (`config/ data/ details/ filter/
overview/ selecting/` + `index.ts` + `setup.ts`, see §2) — and an `src/entities/index.ts` aggregator that
installs them and collects routes. Full code in [entities.examples.md](entities.examples.md); the relation
picker (`selecting/`) is in [entities.patterns.md](entities.patterns.md#entity-selector-relation-picker--selecting);
step list in the [checklist](../docs/checklist.md).

## 10. App shell — components, infrastructure & styling

Beyond entity slices, keep a small, consistent shell (mirrors the sample apps).

### `src/components/`

| Folder | Holds | Notes |
|--------|-------|-------|
| `entity-navigation/` | `Dashboard`, `NavBar`, `NavSearch` | built from the collected `$configs` via `importDashboard` / `importNavbar` / `buildNavigationTree` (see [entities.patterns.md](entities.patterns.md#navigation-from-the-config-map)); `public/config.json → navigation` lists which groups/entities to show |
| `input/` | shared form inputs (`DescriptionInput`, `FormButtonsRow`, …) | register the common ones globally in `main.ts` (`app.component(...)`) so every Form can use them |
| `layout/` | `TheHeader`, `TheFooter`, `Main`, a modal wrapper, `LangSelector` | the chrome around `<RouterView>` |
| `users/` | account + auth UI (login, change password, admin list) | **omit when auth is disabled** |

Give each folder an `index.ts` barrel; keep the components thin and presentational — data/logic stays in
the entity slices and composables.

### `src/infrastructure/` (keep it basic)

App-wide glue only:
- `permissions.ts` — a permissions `enum` / constants.
- a small `*-plugin.ts` — e.g. exposes `$isAdmin` from the auth store and persists the chosen language.
  Skip it for a no-auth app.

### Styling — Bootstrap 5

The `regira_modules/vue/ui` components use **Bootstrap 5** class names and emit `bi bi-*` icon classes.
Install and import the stylesheets once, at the top of `main.ts`:

```bash
npm i bootstrap bootstrap-icons
```
```ts
// main.ts — before your own SCSS
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
```

You don't need Bootstrap's JavaScript (the UI components bring their own behaviour). Put overrides in
`src/assets/*.scss` and import them after Bootstrap.

## See also

- [entities.instructions.md](entities.instructions.md) · [entities.examples.md](entities.examples.md)
- Module guides: [http](../../http/ai/http.instructions.md) · [ioc](../../ioc/ai/ioc.instructions.md) ·
  [auth](../../auth/ai/auth.instructions.md) · [ui](../../ui/ai/ui.instructions.md) ·
  [app](../../app/ai/app.instructions.md) · [lang](../../lang/ai/lang.instructions.md)
