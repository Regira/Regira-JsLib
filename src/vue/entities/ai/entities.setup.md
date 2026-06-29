# Regira JsLib — Project setup & app shell

How to stand up a new `regira_modules` Vue 3 app (Vite + Pinia + vue-router) — install, project
structure, the **entity slice anatomy**, runtime config, the canonical `main.ts` / `App.vue`, the
required-vs-optional plugin matrix, running without auth, and the app shell (components, infrastructure,
styling) that surrounds your entity slices. This is the single app-scaffolding file; it mirrors the public
sample app [Regira-PIM-Admin](https://github.com/Regira/Regira-PIM-Admin). Kept reference-grade and
copy-pasteable; verify any API in [entities.signatures.md](entities.signatures.md) and the per-module
guides.

The worked app shown throughout is `ShoppingManager` (`clientApp: "shopping-manager"`) — a `Product` slice
plus a `Category` lookup — so it lines up with the basic example.

> **Pragmatic, not a symlink.** Copy these files into your repo and evolve them — don't symlink or vendor
> the sample app. They are a starting skeleton, not a dependency; the live reference is the public sample
> [Regira-PIM-Admin](https://github.com/Regira/Regira-PIM-Admin).

> **Reading order:** [entities.instructions.md](entities.instructions.md) → **entities.setup.md** (this
> file) → [entities.namespaces.md](entities.namespaces.md) → [entities.signatures.md](entities.signatures.md)
> → [entities.examples.md](entities.examples.md) (simple `UnitType` + standard `Product` slices) /
> [entities.advanced.example.md](entities.advanced.example.md) (complex slice) →
> [entities.patterns.md](entities.patterns.md) (recipes, load on demand).

## Install

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

Start from the Vite `vue-ts` template (`npm create vue@latest`), then add the peers the library needs
(let your package manager resolve the ranges):

```jsonc
// package.json — peers the library needs
"dependencies": {
  "regira_modules": "github:Regira/Regira-JsLib",
  "vue": "^3.5", "vue-router": "^5", "pinia": "^3",
  "axios": "^1", "date-fns": "^4", "lodash": "^4",
  "bootstrap": "^5.3", "bootstrap-icons": "^1.13"
}
```

```bash
npm i bootstrap bootstrap-icons
```

> **Versions — known-good majors (`regira_modules@3.2.1`).** Targets **Vue 3**. The library's
> `peerDependencies` give the supported runtime ranges, so let the package manager resolve them rather than
> pinning here. Pair them with the build toolchain the library is tested against, and align your app's
> majors with it — the toolchain moves as a set, so a current `vue-router` wants a current `vite`/
> `typescript`. The cascade to keep in step: `vue-router 5` → `vite 8` → `typescript 6` / `vue-tsc 3`.
>
> | Build tool                    | Major |
> | ----------------------------- | ----- |
> | `vite` · `@vitejs/plugin-vue` | 8 · 6 |
> | `typescript` · `vue-tsc`      | 6 · 3 |
> | `vitest` · `prettier`         | 4 · 3 |

> **The snippets below use the demo's `@/regira_modules` alias.** In a plain npm install, drop the `@/`
> prefix on the library specifier (write `regira_modules/vue/http`, not `@/regira_modules/vue/http`); the
> `@/...` app alias for your own `src/` files still applies. See [entities.namespaces.md](entities.namespaces.md).

> **Alias (optional — demo vendoring only).** The sample apps vendor `dist/` and alias it, so their
> imports read `@/regira_modules/vue/entities`. You only need this if you vendor `dist/` yourself. To do
> so, add it in **both** places (order matters — the more specific alias first):
>
> ```ts
> // vite.config.ts → resolve.alias
> { find: "@/regira_modules", replacement: fileURLToPath(new URL("./node_modules/regira_modules/dist", import.meta.url)) },
> { find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) },
> ```
>
> ```jsonc
> // tsconfig.app.json → compilerOptions.paths
> "@/regira_modules/*": ["./node_modules/regira_modules/dist/*"],
> "@/*": ["./src/*"]
> ```

### Tooling — `vite.config.ts`, `tsconfig`, `index.html`, `env.d.ts`

```ts
// vite.config.ts
import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
    plugins: [vue()],
    resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
    define: { __APP_VERSION__: JSON.stringify(process.env.npm_package_version) },
})
```

```jsonc
// tsconfig.app.json → compilerOptions
// On TS 6+ use `paths` WITHOUT `baseUrl` — `vue-tsc -b` (npm run build) errors on baseUrl (TS5101).
"paths": { "@/*": ["./src/*"] }
```

> **tsconfig & build note.** On TypeScript 6+ use `paths` **without `baseUrl`** — `vue-tsc -b` (what
> `npm run build` runs) errors on `baseUrl` (TS5101) even though `vue-tsc --noEmit` tolerates it, so
> always verify with `npm run build`, not only a `--noEmit` typecheck. If your tsconfig enables
> `erasableSyntaxOnly` (the current Vite `vue-ts` template default), define enum-like values as `const`
> objects + a value type instead of `enum`. `@vue/tsconfig` (0.9) ships `tsconfig.json` / `.dom.json` /
> `.lib.json` but **no `tsconfig.node.json`** — point `tsconfig.node.json` at the base
> `@vue/tsconfig/tsconfig.json` (a stale reference to the missing file errors with TS6053). Install `@types/node`
> as a devDependency so `vue-tsc -b` type-checks `vite.config.ts` (it imports `node:url`); the
> `npm create vue@latest` scaffold includes it.

```html
<!-- index.html — Bootstrap + icons via CDN (or import the npm CSS in main.ts instead) -->
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" rel="stylesheet" />
</head>
<body>
    <div id="app"></div>
    <div id="modals" class="fixed-top"></div>
    <!-- modalPlugin host -->
    <div id="loginModal" class="fixed-top"></div>
    <!-- LoginModal teleport target -->
    <script type="module" src="/src/main.ts"></script>
</body>
```

`env.d.ts` keeps the Vite client types; declare the `__APP_VERSION__` define where `app-config.ts` reads it:

```ts
// env.d.ts
/// <reference types="vite/client" />
declare const __APP_VERSION__: string
```

The `$configs` type and the rest of the app globals go in `src/shims.d.ts` — see
[Root component — App.vue → Typing app globals](#typing-app-globals--srcshimsdts).

## Lean tier (generic views)

The full per-entity slice (below) is a back-office scaffold. For a focused admin, a storefront, or an
embed, the **lean tier** pairs the per-entity data layer (model + `config` + service + `SearchObject`,
from [entities.template.md](entities.template.md)) with two generic components the library ships —
`EntityOverview` and `EntityForm` — bound to your columns and fields through slots.

Create each service once over the shared axios:

```ts
// src/services.ts
import { initAxios } from "regira_modules/vue/http"
import ProductService from "@/entities/products/data/EntityService"
import productConfig from "@/entities/products/config/config"

const axios = initAxios({ api: "/api" }) // one shared instance for the whole app
export const products = new ProductService(axios, productConfig)
```

```vue
<!-- src/views/Products.vue -->
<script setup lang="ts">
import { EntityOverview } from "regira_modules/vue/entities"
import { products } from "@/services"
</script>

<template>
    <EntityOverview :service="products">
        <template #head>
            <th>Name</th>
            <th>Description</th>
        </template>
        <template #row="{ item, remove }">
            <td>{{ item.$title }}</td>
            <td>{{ item.description }}</td>
            <td><button class="btn btn-sm btn-outline-danger" @click="remove(item)">Delete</button></td>
        </template>
    </EntityOverview>
</template>
```

`EntityOverview` pages server-side through `service.search`; set `:page-size` (default 10) and restyle the
pager through the `#paging` slot.

`EntityForm` takes the same `:service` plus an `:id` (`"new"` inserts), exposes the loaded entity through
its default slot, and emits `saved` / `cancel`. Both rely only on the service contract, so the data layer
is shared with the full tier and adopting the scaffold later is additive.

## Project structure

The full app template (mirrors the sample apps) — the **shell that surrounds your entity slices**. Each
`entities/<name>/` slice uses the same folder set (a lookup keeps the same folders, just thinner, with no
list UI); its file-by-file anatomy is [Entity slice anatomy](#entity-slice-anatomy) below.

The concrete, filled-in tree (modeled on [Regira-PIM-Admin](https://github.com/Regira/Regira-PIM-Admin)):

```
index.html                       # Bootstrap CSS/Icons CDN links + #app / #modals / #loginModal mounts
vite.config.ts                   # @ → ./src alias
tsconfig.app.json                # paths: { "@/*": ["./src/*"] }  (no baseUrl — see Install § Tooling)
env.d.ts                         # /// <reference types="vite/client" />
public/
  config.json                    # runtime config (env-keyed api, title, navigation, flags) — see Runtime config
  data/translations.json         # i18n messages (key-first) — see Runtime config
src/
  shims.d.ts                     # $configs + app-specific globals ($isAdmin) — see Root component
  app-config.ts                  # loads + types public/config.json (createConfig / useConfig) — see Runtime config
  main.ts                        # bootstrap — see Bootstrap
  App.vue                        # root shell — see Root component
  assets/{base.scss,main.scss,images/}
  router/
    index.ts                     # re-export routerFactory
    router.ts                    # routerFactory(entityRoutes)
    routes.ts                    # static routes (home, account/auth, error pages)
  views/                         # page-level views (HomeView, NotFound, Forbidden, Unauthorized, AccountView, …)
  components/                    # shared UI shell — see App shell
    entity-navigation/           #   Dashboard / NavBar / NavSearch (built from $configs) + useNavigation()
      index.ts  functions.ts
    input/        index.ts       #   app-specific inputs (common FormButtonsRow/DescriptionInput ship in vue/ui)
    layout/                      #   TheHeader / TheFooter / Main / AppModal / LangSelector / Offline
    users/                       #   account + auth UI (omit when auth is disabled)
  infrastructure/                # small app-wide plugins/helpers — see App shell (keep it basic)
    permissions.ts               #   permission constants
    user-plugin.ts               #   $isAdmin + persists chosen language
  entities/
    index.ts                     # aggregates every entity plugin + collects routes — see Add entities
    products/                    # full slice — anatomy below, code in entities.examples.md
    categories/                  # lookup slice — same folders, thinner files
    <name>/                      # one slice per entity — same folder set for all (anatomy below)
```

## Entity slice anatomy

Each entity is a self-contained vertical slice — the **same folder set for every entity** (a lookup keeps
every folder, just with thinner files). Create `src/entities/<name>/`:

```
src/entities/<name>/             # one entity slice — copy this folder set for every entity
    config/
        config.ts (c)            # IConfig object (api URLs, key, paging)
    data/
        Entity.ts (c)            # model class — extends EntityBase (fields + $id/$title)
        EntityService.ts         # extends EntityServiceBase<Entity> { toEntity } + custom endpoints
        store.ts                 # Pinia store — createStore(get(Entity.name)!, Entity.name)
    details/
        Details.vue              # useDetails — loads item by :id, hosts Fiche/Form
        Form.vue (c)             # useForm — create / edit form
        FormModalButton.vue      # opens the Form in a modal
    filter/
        Filter.vue               # useFilter — filter shell (inline + advanced modal)
        FilterAdv.vue (c)        # advanced search form
        FilterInline.vue         # inline keyword search bar
        SearchObject.ts (c)      # extends SearchObjectBase — filter / query model
    overview/
        List.vue (c)             # results table (header + rows)
        ListItem.vue (c)         # one result row
        Overview.vue             # useSearchView + useRouteOverview (useListView for simple entities)
    selecting/
        Autocomplete.vue         # type-ahead search input
        InputSelector.vue        # single-item picker
        Selector.vue             # multi-item picker (chips) — relation picker for this entity
        SelectorDropdown.vue     # simple <select> from cache
        SelectorList.vue (c)     # selectable results list
        SelectorModalButton.vue  # opens the search / select modal
        SelectorSearch.vue       # search UI inside the selector modal
    index.ts                     # barrel: re-exports (config, Entity, service, Selector, plugin)
    setup.ts                     # createRoutes() + addServices() + addIcons() + default install plugin
```

> `(c)` marks the files you customize per entity; the rest is near-identical boilerplate you copy as-is
> (a blank fill-in scaffold with a placeholder per file is [entities.template.md](entities.template.md);
> full slice code in [entities.examples.md](entities.examples.md)). The build order for these files is the
> [Entity Implementation Workflow](entities.instructions.md#entity-implementation-workflow). Everything
> **around** the slice — the `src/entities/` aggregator ([Add entities](#add-entities)), `components/` and
> `infrastructure/` ([App shell](#app-shell--components-infrastructure--styling)), the [Router](#router),
> and [Runtime config](#runtime-config--publicconfigjson) — is the project template.

## Runtime config — `public/config.json`

```json
{ "api": "https://localhost:5001", "culture": "en-US", "clientApp": "my-app", "loginUrl": "https://accounts.example.com/login" }
```

If you use the language plugin (`$t`), also add `public/data/translations.json`. Its shape is
**key-first** — `Record<key, Record<langCode, string> | string>` — _not_ language-first (a wrong guess
makes every `$t()` render the raw key):

```json
{
    "signIn": { "en": "Sign in", "nl": "Aanmelden" },
    "save": { "en": "Save", "nl": "Bewaren" },
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
    "title": { "en": "ShoppingManager" },
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
export function useConfig() {
    return appConfig
}
export default appConfig
```

`main.ts` then does `fetch(\`${appConfig.baseUrl}/config.json\`)`→`createConfig(raw)`→`initAxios({ api, includeCredentials })`before installing plugins. The minimal flat`config.json`above
still works;`app-config.ts` just adds env-selection and a typed accessor.

### Calling the API in dev — HTTPS redirect

The `BasicApi` server template calls `app.UseHttpsRedirection()`, so a request to the HTTP port
307-redirects to the HTTPS port and the browser blocks the SPA on the untrusted dev certificate. Pick one:

- **Trust the dev cert** and keep `api` on the HTTPS port: `dotnet dev-certs https --trust`.
- **Proxy through Vite** — route `/api` to the API and set `config.json` `api` to `/api`:
    ```ts
    // vite.config.ts → server.proxy
    server: { proxy: { "/api": { target: "https://localhost:7001", changeOrigin: true, secure: false } } }
    ```
- **Skip the redirect in Development** on the API: `if (!app.Environment.IsDevelopment()) app.UseHttpsRedirection();`.

### Navigation map

Beyond `api`/`title`/`clientApp`, the shell-specific part is the **`navigation`** map that
`useNavigation()` ([App shell](#app-shell--components-infrastructure--styling)) turns into the dashboard
and navbar:

```jsonc
{
    "clientApp": "shopping-manager",
    "loginUrl": "https://accounts.example.com/auth/?clientApp={clientApp}",
    "api": { "development": "https://localhost:7001", "production": "/api" },
    "includeCredentials": false,
    "title": { "en": "ShoppingManager", "nl": "ShoppingManager" },
    "navigation": {
        "groups": [
            { "id": "Catalog", "title": "catalog", "icon": "catalog" },
            { "id": "Inventory", "title": "inventory", "icon": "inventory" },
        ],
        "dashboard": [
            ["Catalog", ["Product", "Category"]],
            ["Inventory", ["Supplier"]],
        ],
        "navbar": ["Product", ["Catalog", ["Category"]]],
        "search": "Product",
    },
}
```

- `groups` — menu sections (each `id` is referenced by `dashboard`/`navbar`).
- `dashboard` — `Array<[groupId, entityKeys]>` for the home grid (`importDashboard`).
- `navbar` — `Array<entityKey | [groupId, entityKeys]>` for the top bar; a tuple becomes a submenu
  (`importNavbar`).
- `search` — the entity `key` whose Autocomplete powers the global search bar (read by
  `useNavigation().searchItemConfig`); omit it if there is no global search.

Entity keys are the `IConfig.key` each slice sets. The shapes are confirmed in
[entities.patterns.md — Navigation from the config map](entities.patterns.md#navigation-from-the-config-map).

## Router

Split the static (app-owned) routes from the entity routes the slices push at startup. The minimal form is
a single `routerFactory`; the full template splits it across `src/router/`.

**Minimal:**

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

**Full template — `src/router/`** (static routes split out, account/auth + error pages):

```ts
// src/router/index.ts
export { default, default as routerFactory } from "./router"
```

```ts
// src/router/router.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import staticRoutes from "./routes"

export default function routerFactory(entityRoutes: Array<RouteRecordRaw>) {
    return createRouter({
        history: createWebHistory(import.meta.env.BASE_URL),
        routes: [...staticRoutes, ...entityRoutes],
        linkActiveClass: "active",
    })
}
```

```ts
// src/router/routes.ts — home, account/auth, and the error pages
import type { RouteRecordRaw } from "vue-router"
import HomeView from "@/views/HomeView.vue"
import AccountView from "@/views/AccountView.vue"
import AccountHome from "@/components/users/Home.vue"
import Login from "@/views/Login.vue"
import NotFound from "@/views/NotFound.vue"
import Forbidden from "@/views/Forbidden.vue"
import Unauthorized from "@/views/Unauthorized.vue"

const routes: Array<RouteRecordRaw> = [
    { path: "/", name: "home", component: HomeView },
    {
        path: "/account",
        name: "account",
        component: AccountView,
        redirect: { name: "accountHome" },
        children: [
            { path: "", name: "accountHome", component: AccountHome },
            { path: "login", name: "login", component: Login, props: (to) => ({ username: to.query?.username }), meta: { allowAnonymous: true } },
        ],
    },
    { path: "/401", name: "unauthorized", component: Unauthorized, props: (to) => ({ url: to.query.url }), meta: { allowAnonymous: true } },
    { path: "/403", name: "forbidden", component: Forbidden, props: (to) => ({ url: to.query.url }) },
    { path: "/404", name: "notFound", component: NotFound, props: (to) => ({ url: to.query.url }), meta: { allowAnonymous: true } },
    {
        path: "/:pathMatch(.*)*",
        name: "catchAll",
        redirect: (from) => ({ name: "notFound", query: { url: from.fullPath } }),
        meta: { allowAnonymous: true },
    },
]

export default routes
```

> `meta: { allowAnonymous: true }` opts a route out of the auth guard. Anything **without** it is treated
> as protected (the auth store reports it "required"), which is what gates the `LoginModal` in
> [Root component](#root-component--appvue).

## Bootstrap — main.ts

Fetch config first, create the shared axios, then install plugins in this order. This is the **canonical**
`main.ts` — the full plugin-install order; do not duplicate it elsewhere.

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

dateExtensions.use() // serialize dates to JSON without timezone shift

fetch("/config.json")
    .then((r) => r.json())
    .then(async (config) => {
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
        app.use(focus)
        app.use(grow)
        app.use(clickOutside)

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

> **Install order matters:** the `$services` / `$configs` / `$icons` globals must exist before any entity
> plugin installs, so install Pinia, `appPlugin`, `servicesPlugin` (axios + `PoolCache`) and `iconPlugin`
> **first**; then the entity plugins **before** `routerFactory` (so their routes are collected); and the
> **router before `authPlugin`** (the auth plugin reads `$router` for its route guard).

> **Required IoC registration (the #1 wiring pitfall).** The `configure` block above is mandatory: every
> entity service resolves `axios` from the container, and `EntityServiceBase` throws a descriptive error at
> construction when it is missing. Register `PoolCache` alongside it for the shared entity cache. `configure`
> must **return** the `IServiceProvider` (the chained `.add(...).add(...)` returns it; a multi-statement body
> needs an explicit `return sp` or it fails type-check with TS2769).

### Full-shell additions

The full app shell adds three things on top of that canonical file, right after the UI plugins (and the
last one after `authPlugin`):

```ts
// 1. register frequently-used inputs globally so every Form.vue uses them without importing
import { DescriptionInput, FormSection, FormLabel } from "@/regira_modules/vue/ui"
app.component("DescriptionInput", DescriptionInput)
// (FormSection / FormLabel / DateInput / NullableCheckBox register the same way)

// 2. seed icons from a JSON map (group icons referenced by config.json → navigation.groups[].icon)
const appIcons = await fetch(`${appConfig.baseUrl}/data/app-icons.json`).then((r) => r.json())
app.use(iconPlugin, { icons: appIcons, source: "bs", clearFirst: false })

// 3. app-wide glue (after authPlugin, since it reads the auth store)
import { plugin as userPlugin } from "@/infrastructure/user-plugin"
app.use(userPlugin)
```

## Root component — App.vue

`$feedback`, `$appStatus`, `$auth`, and `$t` are globals from the plugins above. This is the **canonical**
(minimal) root shell:

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

### Variant — full-chrome App.vue

The full template wraps the same gates in Header / Main / Footer chrome and teleports the login modal to
`#loginModal`. Use this **instead of** the minimal version above (it is a variant, not a second canonical):

```vue
<script setup lang="ts">
import { computed } from "vue"
import { Feedback, LoadingContainer } from "@/regira_modules/vue/ui"
import { LoginModal, LoginForm, useAuthStore } from "@/regira_modules/vue/auth"
import { AppStatus } from "@/regira_modules/vue/app"
import TheHeader from "@/components/layout/TheHeader.vue"
import TheFooter from "@/components/layout/TheFooter.vue"
import Main from "@/components/layout/Main.vue"

const authStore = useAuthStore()
const showLogin = computed(() => authStore.isRequired && !authStore.isAuthenticated)
</script>

<template>
    <div class="page">
        <header class="container-fluid bg-light"><TheHeader /></header>

        <section class="container-fluid position-relative overflow-hidden">
            <Feedback :feedback="$feedback" :enable-error-popup="true" />
        </section>

        <main class="container-fluid">
            <LoadingContainer :is-loading="$appStatus !== AppStatus.Ready && (!$auth.enabled || $auth.isAuthenticated)">
                <Main />
            </LoadingContainer>
        </main>

        <footer class="container-fluid bg-light"><TheFooter /></footer>

        <Teleport to="#loginModal">
            <LoginModal :is-visible="showLogin" :title="$t('signIn')"><LoginForm /></LoginModal>
        </Teleport>
    </div>
</template>
```

`Main.vue` is just the router outlet — keeping it a named layout slot leaves room for a sidebar later:

```vue
<!-- src/components/layout/Main.vue -->
<script setup lang="ts">
import { RouterView } from "vue-router"
</script>
<template><RouterView /></template>
```

### Typing app globals — `src/shims.d.ts`

The library declares its own globals on `@vue/runtime-core` (`$services`, `$icons`, `$appStatus`/
`$setAppStatus`, `$feedback`, `$t`/`$tm`, `$auth`, …), so those are typed in templates and `this`
automatically. **`$configs` is the exception** — each entity `setup.ts` writes to
`app.config.globalProperties.$configs[Entity.name]`, but the library does not declare its type. Add a
one-file ambient declaration (TypeScript picks up `src/**/*.d.ts` automatically):

```ts
// src/shims.d.ts
import type { IConfig } from "regira_modules/vue/entities"

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $configs: Record<string, IConfig> // populated by each entity setup.ts
    }
}
export {}
```

The full template adds the `user-plugin` global to the same file:

```ts
// src/shims.d.ts (in addition to the $configs declaration above)
declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $isAdmin: boolean // provided by infrastructure/user-plugin.ts — see App shell
    }
}
```

## Plugins — required vs optional

The entities layer needs only a few globals; install the rest as you actually use them. Install order
still matters where dependencies exist (see [Bootstrap — main.ts](#bootstrap--maints)).

| Plugin                                       | Provides                                    | Status for the entities layer                                                                                                               |
| -------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `createPinia()`                              | Pinia stores                                | **Required** (app store, entity stores, auth store)                                                                                         |
| `appPlugin` (`vue/app`)                      | `$appStatus` / `$setAppStatus`, `$culture`  | **Required** — the startup lifecycle and loading gate                                                                                       |
| `servicesPlugin` (`vue/ioc`)                 | `$services` IoC + `get()`                   | **Required** — register the shared `axios` and `PoolCache` here; services resolve from here                                                 |
| entity plugins (`@/entities`)                | routes + service registrations + `$configs` | **Required** — your slices                                                                                                                  |
| `routerFactory` (vue-router)                 | routing                                     | **Required** for multi-view slices                                                                                                          |
| `iconPlugin` (`vue/ui`)                      | `$icons`                                    | Required if your views/nav render icons (the demos do)                                                                                      |
| `feedbackPlugin` (`vue/ui`)                  | `$feedback`                                 | Required if you use the `Feedback` component (the demo `App.vue` does)                                                                      |
| `loadingPlugin` (`vue/ui`)                   | `Loading`/`LoadingContainer` components     | Required if you use `LoadingContainer` (the demo `App.vue` does). **Must pass `{ img }`** when installed: `app.use(loadingPlugin, { img })` |
| `modalPlugin` (`vue/ui`)                     | modal host                                  | Optional — only if you use modal forms                                                                                                      |
| `langPlugin` (`vue/lang`)                    | `$t` i18n                                   | Optional — only if you render translated labels                                                                                             |
| directives (`focus`, `grow`, `clickOutside`) | template directives                         | Optional — only where used                                                                                                                  |
| `preloaderPlugin` (`vue/entities`)           | route preloading                            | Optional                                                                                                                                    |
| `authPlugin` (`vue/auth`)                    | bearer auth + `$auth`                       | **Optional** — see [Running without authentication](#running-without-authentication)                                                        |

> **Icon fonts aren't bundled.** `iconPlugin({ source: "bs" })` only emits Bootstrap-Icons class names
> (`bi bi-*`); install the `bootstrap-icons` npm package and import its CSS in `main.ts`
> (`import "bootstrap-icons/font/bootstrap-icons.css"`) or every icon renders blank. (`source: "fa"` →
> Font Awesome the same way.)

> **Library components need `iconPlugin` too.** `Feedback`, `LoadingContainer`, `Paging` and `ConfirmButton`
> resolve `Icon`/`IconButton` **globally**, which only `iconPlugin` registers — so install it whenever you
> render any of them, even if your own markup shows no icons (otherwise: `Failed to resolve component: IconButton`).

## Running without authentication

Auth is **optional**. The template in [Bootstrap](#bootstrap--maints) / [Root component](#root-component--appvue)
is the auth-on path; to run the SPA without a login (internal tools, demos, or while the back-end has auth
disabled), make three changes:

1. **`main.ts` — don't install `authPlugin`.** Remove its import, its `app.use(authPlugin, …)` block,
   and the `LocalStorageTokenManager` import. Nothing else depends on it.
2. **Advance the app to `Ready` yourself.** In the auth-on template, `onAuthenticationChange` is what
   called `$setAppStatus(AppStatus.Ready)`. With auth gone, **nothing reaches `Ready` on its own**
   (`AppStatus` starts at `Init`), so the app would hang on the loading spinner. Set it after mount:

    ```ts
    app.config.globalProperties.$setAppStatus(AppStatus.Mounting)
    app.mount("#app")
    app.config.globalProperties.$setAppStatus(AppStatus.Ready) // no auth → advance manually
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

> Skip `infrastructure/user-plugin.ts` and the `components/users/` folder entirely for a no-auth app.

## App shell — components, infrastructure & styling

Beyond entity slices, the sample apps ship a ready-made shell — a config-driven **dashboard + navbar**
(`entity-navigation/`), the **layout chrome** (`layout/`), shared **form inputs** (the common
`FormButtonsRow` / `DescriptionInput` ship in `vue/ui`), and the **auth UI** (`users/`, when auth is enabled). Copy it from
[Regira-PIM-Admin](https://github.com/Regira/Regira-PIM-Admin) and adapt rather than hand-rolling. The
components read from the collected `$configs` and the runtime config; data/logic stays in the entity slices
and composables. Each folder is detailed in [§ `src/components/`](#srccomponents) below.

### Add entities

Create `src/entities/<name>/` slices — each with the full folder set (`config/ data/ details/ filter/
overview/ selecting/` + `index.ts` + `setup.ts`, see [Entity slice anatomy](#entity-slice-anatomy)) — and
an `src/entities/index.ts` aggregator that installs them and collects routes. It resets `$configs` and
lets each `setup.ts` push its routes into the shared array:

```ts
import type { App } from "vue"
import type { RouteRecordRaw } from "vue-router"
import { plugin as productPlugin } from "./products"
import { plugin as categoryPlugin } from "./categories"

// order matters where one entity's selecting/Selector.vue is used inside another's form
export const plugins = [categoryPlugin, productPlugin]

export default {
    install(app: App<Element>, { routes }: { routes: Array<RouteRecordRaw> }) {
        app.config.globalProperties.$configs = {}
        plugins.forEach((plugin) => app.use(plugin as any, { routes }))
    },
}
```

Full slice code is in [entities.examples.md](entities.examples.md); the relation picker (`selecting/`) is
in [entities.patterns.md — Entity selector / relation picker](entities.patterns.md#entity-selector-relation-picker--selecting);
step list in the [checklist](../docs/checklist.md).

### `src/components/`

| Folder               | Holds                                                                                   | Notes                                                                                                                                                                                                                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `entity-navigation/` | `Dashboard`, `NavBar`, `NavSearch` + `useNavigation()`                                  | built from the collected `$configs` via `importDashboard` / `importNavbar` / `buildNavigationTree` (see [entities.patterns.md — Navigation from the config map](entities.patterns.md#navigation-from-the-config-map)); `public/config.json → navigation` lists which groups/entities to show |
| `input/`             | app-specific form inputs                                                                | the common `FormButtonsRow` (Save / Cancel / Delete / Restore row) and `DescriptionInput` ship in `vue/ui`; register library inputs globally in `main.ts` if you prefer not to import them per-form                                                                                          |
| `layout/`            | `TheHeader`, `TheFooter`, `Main`, `AppModal` (modal wrapper), `LangSelector`, `Offline` | the chrome around `<RouterView>`                                                                                                                                                                                                                                                             |
| `users/`             | account + auth UI (login, change password, admin list)                                  | include when auth is enabled; omit on the [no-auth path](#running-without-authentication)                                                                                                                                                                                                    |

Give each folder an `index.ts` barrel; keep the components thin and presentational — data/logic stays in
the entity slices and composables.

The one piece worth showing in full is **`useNavigation()`** — it reads `config.json → navigation` and the
collected `$configs`, then builds the dashboard/navbar trees with the library importers:

```ts
// src/components/entity-navigation/functions.ts
import { computed, getCurrentInstance } from "vue"
import { type IConfig, importDashboard, importNavbar, buildNavigationTree } from "@/regira_modules/vue/entities"
import { useConfig } from "@/app-config"

export function useNavigation() {
    const app = getCurrentInstance()!
    const {
        navigation: { groups, dashboard, navbar, search },
    } = useConfig()

    const configs = Object.values(app.appContext.config.globalProperties.$configs) as Array<IConfig>
    const hasAccess = (_config: IConfig) => true // gate by permissions here if needed

    const dashboardTree = computed(() => buildNavigationTree(importDashboard({ groups, entities: dashboard, configs, hasAccess })))
    const navbarTree = computed(() => buildNavigationTree(importNavbar({ groups, entities: navbar, configs, hasAccess })))
    const searchItemConfig = computed(() => configs.find((c) => c.key === search))

    return { dashboardTree, navbarTree, searchItemConfig }
}
```

```ts
// src/components/entity-navigation/index.ts
export * from "./functions"
export { default as Dashboard } from "./dashboard/Dashboard.vue"
export { default as NavBar } from "./navbar/NavBar.vue"
export { default as NavSearch } from "./nav-search/NavSearch.vue"
```

`buildNavigationTree` returns a `TreeList<INavCore>`; render it via its `.roots` (each node has
`children`). `Dashboard.vue` / `NavBar.vue` are thin wrappers that `v-for` over `tree.roots`.

### `src/infrastructure/` (keep it basic)

App-wide glue only — a permission enum and a small plugin that exposes `$isAdmin` from the auth store and
persists the chosen language. Skip both for a no-auth app.

```ts
// src/infrastructure/permissions.ts — erasableSyntaxOnly-safe const map (not an enum)
export const Permissions = { CAN_READ: "can_read", CAN_WRITE: "can_write", ADMIN: "admin" } as const
export type Permission = (typeof Permissions)[keyof typeof Permissions]
export default Permissions
```

```ts
// src/infrastructure/user-plugin.ts
import { type App, watch } from "vue"
import { useAuthStore } from "@/regira_modules/vue/auth"
import { useLang } from "@/regira_modules/vue/lang"
import Permissions from "@/infrastructure/permissions"

export const plugin = {
    install(app: App) {
        const authStore = useAuthStore()
        Object.defineProperty(app.config.globalProperties, "$isAdmin", {
            get: () => authStore.authData.hasPermission(Permissions.ADMIN),
            enumerable: true,
            configurable: true,
        })

        // persist the language choice across reloads
        const { langCode, setLangCode } = useLang()
        const last = localStorage.getItem("lang")
        if (!authStore.isAuthenticated && last && last !== langCode.value) setLangCode(last.substring(0, 2))
        watch(langCode, (code) => localStorage.setItem("lang", code))
    },
}

export default plugin
```

> Skip `user-plugin.ts` and the `users/` folder entirely for a **no-auth** app
> ([Running without authentication](#running-without-authentication)).

### `src/views/`

Page-level components the static routes point at. The home page hosts the dashboard built from
`useNavigation()`; the error pages are presentational.

```vue
<!-- src/views/HomeView.vue -->
<script setup lang="ts">
import appConfig from "@/app-config"
import { Dashboard } from "@/components/entity-navigation"
const { title } = appConfig
</script>
<template>
    <section>
        <h1 class="text-center">{{ $tm(title) }}</h1>
        <Dashboard />
    </section>
</template>
```

```vue
<!-- src/views/NotFound.vue -->
<script setup lang="ts">
defineProps<{ url?: string }>()
</script>
<template>
    <section>
        <h1>404 — page not found</h1>
        <p>
            Page <router-link :to="url ?? '/'">{{ url }}</router-link> was not found.
        </p>
    </section>
</template>
```

`Forbidden.vue` / `Unauthorized.vue` follow the same shape (a heading + the offending `url`). `AccountView`
is a `<RouterView />` wrapper for the `account/*` children in [Router](#router).

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

- [entities.instructions.md](entities.instructions.md) — the spine (module stack, concepts, workflow,
  troubleshooting)
- [entities.namespaces.md](entities.namespaces.md) — import-specifier reference ·
  [entities.signatures.md](entities.signatures.md) — exact TypeScript signatures
- [entities.examples.md](entities.examples.md) — simple (`UnitType`) + standard (`Product`) slices ·
  [entities.advanced.example.md](entities.advanced.example.md) — one complete complex slice (`Vehicle`)
- [entities.patterns.md](entities.patterns.md#navigation-from-the-config-map) — per-feature recipes
  (navigation importers, selectors, trees, …)
- [checklist.md](../docs/checklist.md) — add an entity, step by step
- [Regira-PIM-Admin](https://github.com/Regira/Regira-PIM-Admin) — the public sample app this template is
  modeled on
- Module guides: [http](../../http/ai/http.instructions.md) · [ioc](../../ioc/ai/ioc.instructions.md) ·
  [auth](../../auth/ai/auth.instructions.md) · [ui](../../ui/ai/ui.instructions.md) ·
  [app](../../app/ai/app.instructions.md) · [lang](../../lang/ai/lang.instructions.md)
