# Full template — the app shell

The concrete scaffold that **surrounds** your entity slices: tooling, routing, the `components/` +
`infrastructure/` shell, the navigation wiring, and the views. It mirrors the public sample app
[Regira-PIM-Admin](https://github.com/Regira/Regira-PIM-Admin) and slots the entity slices from
[entities.examples.md](entities.examples.md) into `src/entities/`.

Read this together with:

- [entities.setup.md](entities.setup.md) — the **canonical** `main.ts`, `App.vue`, `app-config.ts`, the
  `$configs` shim, plugin install order, and running with/without auth. The full template uses those files
  verbatim; this page adds the surrounding shell.
- [entities.examples.md](entities.examples.md) — one complete entity slice (`Product`).
- [checklist.md](../docs/checklist.md) — the per-entity step list.

> **Pragmatic, not a symlink.** Copy these files into your repo and evolve them — don't symlink or vendor
> the sample app. They are a starting skeleton, not a dependency; the live reference is the public sample
> [Regira-PIM-Admin](https://github.com/Regira/Regira-PIM-Admin). The app showcased here is
> `ShoppingManager` (`clientApp: "shopping-manager"`) with a `Product` slice plus a `Category` lookup, so
> it lines up with the worked example.

## 1. File tree (concrete)

The abstract version is [entities.setup.md §2](entities.setup.md#2-project-structure); this is the same
shape, filled in.

```
index.html                       # Bootstrap CSS/Icons CDN links + #app / #modals / #loginModal mounts
vite.config.ts                   # @ → ./src alias
tsconfig.app.json                # paths: { "@/*": ["./src/*"] }  (no baseUrl — §Tooling)
env.d.ts                         # /// <reference types="vite/client" />
public/
  config.json                    # runtime config + navigation map — §3
  data/translations.json         # i18n (key-first)
src/
  shims.d.ts                     # $configs + app-specific globals ($isAdmin) — entities.setup.md §6
  app-config.ts                  # createConfig / useConfig — entities.setup.md §3
  main.ts                        # bootstrap — entities.setup.md §5 (+ §Bootstrap below)
  App.vue                        # root shell — §6
  assets/{base.scss,main.scss,images/}
  router/
    index.ts                     # re-export routerFactory
    router.ts                    # routerFactory(entityRoutes)
    routes.ts                    # static routes (home, account/auth, error pages)
  views/                         # HomeView, NotFound, Forbidden, Unauthorized, AccountView, …
  components/
    entity-navigation/           # Dashboard / NavBar / NavSearch built from $configs — §7
      index.ts  functions.ts     #   useNavigation() (importDashboard / importNavbar / buildNavigationTree)
    input/        index.ts       # shared form inputs (DescriptionInput, FormButtonsRow)
    layout/                      # TheHeader, TheFooter, Main, AppModal, LangSelector, Offline
    users/                       # account + auth UI (omit when auth is disabled)
  infrastructure/
    permissions.ts               # permission constants — §8
    user-plugin.ts               # $isAdmin + persists chosen language — §8
  entities/
    index.ts                     # aggregates every entity plugin + collects routes — §5
    products/                    # full slice (entities.examples.md)
    categories/                  # lookup slice (no list UI)
```

## 2. Tooling

Start from the Vite `vue-ts` template (`npm create vue@latest`), then:

```jsonc
// package.json — peers the library needs (let your package manager resolve the ranges)
"dependencies": {
  "regira_modules": "github:Regira/Regira-JsLib",
  "vue": "^3.5", "vue-router": "^5", "pinia": "^3",
  "axios": "^1", "date-fns": "^4", "lodash": "^4",
  "bootstrap": "^5.3", "bootstrap-icons": "^1.13"
}
```

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

```html
<!-- index.html — Bootstrap + icons via CDN (or import the npm CSS in main.ts instead) -->
<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" rel="stylesheet" />
</head>
<body>
  <div id="app"></div>
  <div id="modals" class="fixed-top"></div>      <!-- modalPlugin host -->
  <div id="loginModal" class="fixed-top"></div>  <!-- LoginModal teleport target -->
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
[entities.setup.md §6](entities.setup.md#typing-app-globals--srcshimsdts). The full template adds the
`user-plugin` globals to the same file:

```ts
// src/shims.d.ts (in addition to the $configs declaration in entities.setup.md §6)
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $isAdmin: boolean   // provided by infrastructure/user-plugin.ts — §8
  }
}
```

## 3. Runtime config — `public/config.json`

`app-config.ts` (env-keyed loader, [entities.setup.md §3](entities.setup.md#typed-config-loader--srcapp-configts))
reads this. Beyond `api`/`title`/`clientApp`, the shell-specific part is the **`navigation`** map that
`useNavigation()` (§7) turns into the dashboard and navbar:

```jsonc
{
  "clientApp": "shopping-manager",
  "loginUrl": "https://accounts.example.com/auth/?clientApp={clientApp}",
  "api": { "development": "https://localhost:7001", "production": "/api" },
  "includeCredentials": false,
  "title": { "en": "ShoppingManager", "nl": "ShoppingManager" },
  "navigation": {
    "groups": [
      { "id": "Catalog",   "title": "catalog",   "icon": "catalog" },
      { "id": "Inventory", "title": "inventory", "icon": "inventory" }
    ],
    "dashboard": [
      ["Catalog",   ["Product", "Category"]],
      ["Inventory", ["Supplier"]]
    ],
    "navbar": ["Product", ["Catalog", ["Category"]]]
  }
}
```

- `groups` — menu sections (each `id` is referenced by `dashboard`/`navbar`).
- `dashboard` — `Array<[groupId, entityKeys]>` for the home grid (`importDashboard`).
- `navbar` — `Array<entityKey | [groupId, entityKeys]>` for the top bar; a tuple becomes a submenu
  (`importNavbar`).

Entity keys are the `IConfig.key` each slice sets. The shapes are confirmed in
[entities.patterns.md §Navigation from the config map](entities.patterns.md#navigation-from-the-config-map).

## 4. Routing — `src/router/`

Split the static (app-owned) routes from the entity routes the slices push at startup.

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
  { path: "/:pathMatch(.*)*", name: "catchAll", redirect: (from) => ({ name: "notFound", query: { url: from.fullPath } }), meta: { allowAnonymous: true } },
]

export default routes
```

> `meta: { allowAnonymous: true }` opts a route out of the auth guard. Anything **without** it is treated
> as protected (the auth store reports it "required"), which is what gates the `LoginModal` in §6.

## 5. Entity aggregator — `src/entities/index.ts`

Collects every slice's plugin, resets `$configs`, and lets each `setup.ts` push its routes into the
shared array (same file as [entities.examples.md §11](entities.examples.md#11-aggregator--bootstrap)):

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

## 6. Bootstrap — `main.ts` & `App.vue`

`main.ts` is the [entities.setup.md §5](entities.setup.md#5-bootstrap--srcmaints) file — fetch config,
`initAxios`, then install plugins in order (`servicesPlugin` → UI → `entityPlugins` → `routerFactory` →
`authPlugin`). The full shell adds three things on top of that canonical file, right after the UI plugins:

```ts
// 1. register the common form inputs globally so every Form.vue can use them without importing
import DescriptionInput from "@/components/input/DescriptionInput.vue"
app.component("DescriptionInput", DescriptionInput)
// (the library's FormSection / DateInput / NullableCheckBox / FormLabel are registered the same way)

// 2. seed icons from a JSON map (group icons referenced by config.json → navigation.groups[].icon)
const appIcons = await fetch(`${appConfig.baseUrl}/data/app-icons.json`).then((r) => r.json())
app.use(iconPlugin, { icons: appIcons, source: "bs", clearFirst: false })

// 3. app-wide glue (after authPlugin, since it reads the auth store)
import { plugin as userPlugin } from "@/infrastructure/user-plugin"
app.use(userPlugin)
```

`App.vue` — the **full chrome** version (the minimal one is
[entities.setup.md §6](entities.setup.md#6-root-component--srcappvue)). Header / Main / Footer around
`<RouterView>` (inside `Main`), the feedback bar, the loading gate, and the teleported login modal:

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

## 7. App-shell components — `src/components/`

| Folder | Holds |
|--------|-------|
| `entity-navigation/` | `Dashboard`, `NavBar`, `NavSearch` + `useNavigation()` |
| `layout/` | `TheHeader`, `TheFooter`, `Main`, `AppModal`, `LangSelector`, `Offline` |
| `input/` | shared form inputs (`DescriptionInput`, `FormButtonsRow`) |
| `users/` | account + auth UI — **omit when auth is disabled** |

The one piece worth showing in full is **`useNavigation()`** — it reads `config.json → navigation` and the
collected `$configs`, then builds the dashboard/navbar trees with the library importers:

```ts
// src/components/entity-navigation/functions.ts
import { computed, getCurrentInstance } from "vue"
import { type IConfig, importDashboard, importNavbar, buildNavigationTree } from "@/regira_modules/vue/entities"
import { useConfig } from "@/app-config"

export function useNavigation() {
  const app = getCurrentInstance()!
  const { navigation: { groups, dashboard, navbar, search } } = useConfig()

  const configs = Object.values(app.appContext.config.globalProperties.$configs) as Array<IConfig>
  const hasAccess = (_config: IConfig) => true   // gate by permissions here if needed

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
`children`). `Dashboard.vue` / `NavBar.vue` are thin wrappers that `v-for` over `tree.roots`. Give each
folder an `index.ts` barrel and keep the components presentational — data lives in the slices.

```ts
// src/components/input/index.ts
export { default as DescriptionInput } from "./DescriptionInput.vue"
export { default as FormButtonsRow } from "./FormButtonsRow.vue"
```

## 8. Infrastructure — `src/infrastructure/`

App-wide glue only. A permission enum and a small plugin that exposes `$isAdmin` and persists the chosen
language:

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
> ([entities.setup.md §8](entities.setup.md#8-running-without-authentication)).

## 9. Views — `src/views/`

Page-level components the static routes point at. The home page hosts the dashboard built in §7; the error
pages are presentational.

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
    <p>Page <router-link :to="url ?? '/'">{{ url }}</router-link> was not found.</p>
  </section>
</template>
```

`Forbidden.vue` / `Unauthorized.vue` follow the same shape (a heading + the offending `url`). `AccountView`
is a `<RouterView />` wrapper for the `account/*` children in §4.

## See also

- [Regira-PIM-Admin](https://github.com/Regira/Regira-PIM-Admin) — the public sample app this template is
  modeled on
- [entities.setup.md](entities.setup.md) — canonical `main.ts` / `App.vue` / `app-config.ts`, plugin order,
  with/without auth
- [entities.examples.md](entities.examples.md) — a complete entity slice
- [entities.patterns.md](entities.patterns.md#navigation-from-the-config-map) — navigation importers,
  selectors, trees
- [checklist.md](../docs/checklist.md) — add an entity, step by step
