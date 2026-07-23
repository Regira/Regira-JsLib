# Regira JsLib — App Shell Template (scaffold)

The **one-time app shell** that hosts your entity slices: bootstrap (`main.ts`, `App.vue`), runtime config,
router, the config-driven **dashboard + navbar**, layout chrome, error views, and infrastructure. It ships as
a **copy-on-disk template** in the package — scaffold it once per app, then scaffold entity slices into it
with [entities.template.md](entities.template.md).

> **Indicative, not prescriptive.** The generated shell is a working baseline — freely **restructure the
> layout and redesign/restyle the dashboard, navbar, header/footer, and views**. Load-bearing is the _wiring_
> (plugin install order in `main.ts`, the config-driven `useNavigation`, the router / `app-config` contract)
> **and a few behaviours that live in the shell components, not their CSS**. Restyle the markup, but keep the
> behaviour — or reuse the component:
>
> - **Navbar dropdowns are a self-contained Vue toggle** (`NavBar.vue`: an `openId` ref + `v-click-outside`),
>   not Bootstrap's JS — the shell imports Bootstrap **CSS only** (see [Bootstrap](#bootstrap) below). If you
>   re-author them with `data-bs-toggle="dropdown"` you must also `import "bootstrap/dist/js/bootstrap.bundle.min.js"`;
>   the CSS alone never opens a dropdown. Simplest: keep `NavBar.vue` and restyle around it.
> - **Dashboard entries are route links/tiles** — keep `text-decoration-none` and the tile/card class, or the
>   nav collapses to bare underlined `<a>`s.
> - **Modals teleport into `#modals`** — keep that host `<div>` in `index.html`, or every popup silently fails
>   to mount. `--shell` won't overwrite an existing `index.html` without `--force`, so verify the host is
>   present after scaffolding.

## How to use

```bash
# from your app root, with regira_modules installed + the toolchain from entities.setup.md → Install:
node node_modules/regira_modules/_template/scaffold.mjs --shell            # auth-on app shell
node node_modules/regira_modules/_template/scaffold.mjs --shell --no-auth  # no-auth app shell
```

`--shell` writes the root toolchain (`index.html`, `vite.config.ts`, `tsconfig*`, `env.d.ts`) + `src/**` +
`public/config.json` + `public/data/translations.json` into the current app, **skipping any file that
already exists** (pass `--force` to overwrite — e.g. to replace the `npm create vue` files). Only
`package.json` is yours to author — copy the known-good dependency set from
[entities.setup.md → Install](entities.setup.md#install). Then scaffold entities and register them in
`src/entities/index.ts`.

> **`--no-auth`** strips the auth wiring (lines tagged `@auth:only` / blocks between `@auth:block-start` and
> `@auth:block-end`) and omits the auth-only files (`infrastructure/user-plugin.ts`, `shims.d.ts`,
> `views/AccountView.vue`). The default
> build strips the inverse `@noauth:*` markers. Both variants build green. See
> [entities.setup.md → Running without authentication](entities.setup.md#running-without-authentication).

Every library import uses the **plain npm specifier** (`regira_modules/…`); app-local imports use the `@ → src`
alias. Verify any API in [entities.signatures.md](entities.signatures.md) / [entities.namespaces.md](entities.namespaces.md).

---

# Toolchain

The root-level build tooling — a known-good Vite + `vue-tsc` setup that builds green with the generated
shell and slices. Styles come from the npm `bootstrap` / `bootstrap-icons` packages (imported in
`main.ts`), so no CDN links are needed.

## `index.html`

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
    </head>
    <body>
        <div id="app"></div>
        <div id="modals" class="fixed-top"></div>
        <div id="loginModal" class="fixed-top"></div>
        <!-- @auth:only -->
        <script type="module" src="/src/main.ts"></script>
    </body>
</html>
```

## `vite.config.ts`

```ts
import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
    plugins: [vue()],
    resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
    define: { __APP_VERSION__: JSON.stringify(process.env.npm_package_version) },
    server: { port: Number(process.env.PORT) || 5173 }, // honor a harness/preview-assigned PORT (Vite ignores it by default)
    // calling the API through a dev proxy instead of its origin? add server.proxy — see entities.setup.md → The URL contract
})
```

## `env.d.ts`

```ts
/// <reference types="vite/client" />

declare const __APP_VERSION__: string
```

## `tsconfig.json`

```json
{
    "files": [],
    "references": [{ "path": "./tsconfig.node.json" }, { "path": "./tsconfig.app.json" }]
}
```

## `tsconfig.app.json`

```json
{
    "compilerOptions": {
        "composite": true,
        "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",

        "target": "ESNext",
        "module": "ESNext",
        "moduleResolution": "Bundler",
        "lib": ["ESNext", "DOM", "DOM.Iterable"],
        "types": ["vite/client"],

        "jsx": "preserve",
        "jsxImportSource": "vue",

        "strict": true,
        "noUnusedLocals": false,
        "noUnusedParameters": false,
        "noFallthroughCasesInSwitch": true,

        "verbatimModuleSyntax": true,
        "isolatedModules": true,
        "skipLibCheck": true,
        "esModuleInterop": true,
        "resolveJsonModule": true,
        "useDefineForClassFields": true,
        "noEmit": true,

        "paths": { "@/*": ["./src/*"] }
    },
    "include": ["env.d.ts", "src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

## `tsconfig.node.json`

```json
{
    "compilerOptions": {
        "composite": true,
        "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",

        "target": "ESNext",
        "module": "ESNext",
        "moduleResolution": "Bundler",
        "lib": ["ESNext"],
        "types": ["node"],

        "strict": true,
        "verbatimModuleSyntax": true,
        "isolatedModules": true,
        "skipLibCheck": true,
        "noEmit": true
    },
    "include": ["vite.config.ts"]
}
```

---

# Bootstrap

## `src/main.ts`

```ts
import { createApp } from "vue"
import { createPinia } from "pinia"
import type { RouteRecordRaw } from "vue-router"
import { initAxios } from "regira_modules/vue/http"
import { plugin as servicesPlugin, type IServiceProvider } from "regira_modules/vue/ioc"
import { plugin as appPlugin, AppStatus, whenAppReady } from "regira_modules/vue/app"
import { plugin as langPlugin } from "regira_modules/vue/lang"
import { useLang } from "regira_modules/vue/lang" // used for document.title + (auth) setLangCode
import { iconPlugin, screenPlugin, loadingPlugin, feedbackPlugin } from "regira_modules/vue/ui"
import { focus, grow, clickOutside } from "regira_modules/vue/directives"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "regira_modules/style.css"
import "@/assets/theme.scss" // the app theme — MUST come after bootstrap + regira styles so its overrides win
import { plugin as authPlugin, LocalStorageTokenManager } from "regira_modules/vue/auth" // @auth:only
import { plugin as userPlugin } from "@/infrastructure/user-plugin" // @auth:only
import { preloaderPlugin, defaultPoolCache, PoolCache } from "regira_modules/vue/entities"
import { plugin as debugPlugin } from "regira_modules/vue/debug"
import dateExtensions from "regira_modules/extensions/date-extensions"
import entityPlugins from "@/entities"
import { routerFactory } from "@/router"
import appConfig, { createConfig } from "@/app-config"
import App from "@/App.vue"

const loadingImg = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" // 1×1 — swap for your spinner

dateExtensions.use() // serialize Dates to JSON without a timezone shift

fetch(`${appConfig.baseUrl}/config.json`)
    .then((r) => r.json())
    .then(async (raw) => {
        const config = createConfig(raw)
        const axios = initAxios({ api: config.api, includeCredentials: config.includeCredentials })
        const translations = await fetch(`${appConfig.baseUrl}/data/translations.json`).then((r) => r.json())

        const app = createApp(App)
        app.use(createPinia())
        app.use(appPlugin, { culture: config.culture })
        app.use(servicesPlugin, {
            configure: (sp: IServiceProvider) => sp.add("axios", () => axios).add(PoolCache.name, () => defaultPoolCache),
        })

        app.use(iconPlugin, { source: "bs" })
        app.use(screenPlugin)
        app.use(loadingPlugin, { img: loadingImg })
        app.use(feedbackPlugin, { autoHideDelay: 2500 })
        app.use(langPlugin, { defaultLang: "en", messages: translations })

        document.title = useLang().translateMessage(config.title) || document.title // browser-tab title from config.title (culture-keyed); re-set on culture change if you localize it

        app.use(focus)
        app.use(grow)
        app.use(clickOutside)

        const entityRoutes: Array<RouteRecordRaw> = []
        app.use(entityPlugins, { routes: entityRoutes })
        app.use(routerFactory([...entityRoutes]))
        app.use(preloaderPlugin)
        app.use(debugPlugin, { isDebug: config.isDebug })

        // @auth:block-start
        const { setLangCode } = useLang()
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
        app.use(userPlugin)
        // @auth:block-end

        app.config.globalProperties.$setAppStatus(AppStatus.Mounting)
        app.mount("#app")
        app.config.globalProperties.$setAppStatus(AppStatus.Ready) // @noauth:only — no auth → advance to Ready manually
        await whenAppReady()
    })
```

## `src/assets/theme.scss`

The app's theme lives here — never in forked library css. Override Bootstrap's **component-level** vars
(precompiled Bootstrap 5.3 bakes colors into per-component vars — `:root { --bs-primary }` alone recolors
almost nothing) plus the library's `--rg-*` tokens and `rg-*`/`is-*` class hooks. See the ui module's
customize guide for the full ladder.

```scss
// App theme — loaded after bootstrap.min.css + regira_modules/style.css, so everything here wins.
:root {
    // library tokens (see ui.customize.md for the full list)
    // --rg-accent: #0d6efd;
    // --rg-accent-bg: rgba(13, 110, 253, 0.1);   // modal-header tint
    // --rg-deleted-bg: rgba(220, 53, 69, 0.25);  // pending-delete rows/chips
    // global bootstrap knobs
    // --bs-border-radius: 0.5rem;
    // --bs-link-color-rgb: 13, 110, 253;
}

// Accent swap — precompiled Bootstrap reads component-level vars:
// .btn-primary {
//     --bs-btn-bg: var(--rg-accent);
//     --bs-btn-border-color: var(--rg-accent);
// }
// .pagination {
//     --bs-pagination-active-bg: var(--rg-accent);
//     --bs-pagination-active-border-color: var(--rg-accent);
// }

// App-level conventions the entity slices use:
.striped > *:nth-child(even) {
    background-color: var(--bs-secondary-bg, #e9ecef);
}

// Overview lists should not need to scroll horizontally: Bootstrap's .row carries negative gutter margins
// that bleed past a parent without matching padding, and a flex child's default min-width:auto refuses to
// shrink below its content — so a long title pushes the row wider than the viewport instead of truncating.
// Both are neutralised below. `auto`, not `hidden`: when a row genuinely cannot fit (an unbreakable token, a
// very narrow viewport) the list scrolls within itself, rather than clipping content out of reach or dragging
// the whole page sideways.
.entity-list {
    overflow-x: auto;

    > .row {
        margin-left: 0;
        margin-right: 0;
    }

    // text-truncate only clips once the cell is allowed to be narrower than its text
    [class^="col"],
    [class*=" col"] {
        min-width: 0;
    }
}

// The app-owned wrapper around FormButtonsRow. Deliberately NOT `.form-buttons` — that class is the
// library component's own root, and a rule on it would apply to both the wrapper and the component
// inside it (doubled padding, a second border, a nested sticky context).
// Raising `top` to clear a fixed navbar also applies inside modals, where there is no navbar —
// reset it with `.modal & { top: 0 }` if you do.
.form-toolbar {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: var(--bs-body-bg, #fff);
}
```

## `src/App.vue`

```vue
<script setup lang="ts">
import { computed } from "vue" // @auth:only
import { Feedback, LoadingContainer } from "regira_modules/vue/ui"
import { LoginModal, LoginForm, useAuthStore } from "regira_modules/vue/auth" // @auth:only
import { AppStatus } from "regira_modules/vue/app"
import TheHeader from "@/components/layout/TheHeader.vue"
import TheFooter from "@/components/layout/TheFooter.vue"
import Main from "@/components/layout/Main.vue"

// @auth:block-start
const authStore = useAuthStore()
// isRequired is route-driven (auth enabled + no allowAnonymous meta), so on any protected route — home
// included — an unauthenticated visitor gets the sign-in modal immediately, before any 401.
const showLogin = computed(() => authStore.isRequired && !authStore.isAuthenticated)
// @auth:block-end
</script>

<template>
    <div class="page">
        <header class="container-fluid bg-light"><TheHeader /></header>
        <section class="container-fluid position-relative overflow-hidden">
            <Feedback :feedback="$feedback" :enable-error-popup="true" />
        </section>
        <main class="container-fluid">
            <!-- @auth:block-start -->
            <LoadingContainer :is-loading="$appStatus !== AppStatus.Ready && (!$auth.enabled || $auth.isAuthenticated)">
            <!-- @auth:block-end -->
            <!-- @noauth:block-start -->
            <LoadingContainer :is-loading="$appStatus !== AppStatus.Ready">
            <!-- @noauth:block-end -->
                <Main />
            </LoadingContainer>
        </main>
        <footer class="container-fluid bg-light"><TheFooter /></footer>

        <!-- @auth:block-start -->
        <Teleport to="#loginModal">
            <!-- v-if (not :is-visible): unmounting removes mask + dialog atomically — no stranded overlay -->
            <LoginModal v-if="showLogin" :title="$t('signIn')"><LoginForm /></LoginModal>
        </Teleport>
        <!-- @auth:block-end -->
    </div>
</template>
```

---

# Runtime config

## `public/config.json`

```json
{
    "clientApp": "my-app",
    "loginUrl": "https://accounts.example.com/auth/?clientApp={clientApp}",
    "api": { "development": "https://localhost:7001", "production": "/api" },
    "includeCredentials": false,
    "isDebug": false,
    "title": { "en": "My App" },
    "navigation": {
        "groups": [{ "id": "Main", "title": "main", "icon": "bi bi-grid" }],
        "dashboard": [["Main", []]],
        "navbar": [],
        "search": ""
    }
}
```

## `public/data/translations.json`

```json
{
    "account": { "en": "Account" },
    "addNewFile(s)": { "en": "Add new file(s)" },
    "changePassword": { "en": "Change password" },
    "deleteItem": { "en": "Delete" },
    "files": { "en": "Files" },
    "filtersAreApplied": { "en": "Filters are applied" },
    "keywords": { "en": "Keywords" },
    "main": { "en": "Main" },
    "name": { "en": "Name" },
    "new": { "en": "New" },
    "noResults": { "en": "No results" },
    "overview": { "en": "Overview" },
    "popOut": { "en": "Open in new tab" },
    "signIn": { "en": "Sign in" },
    "signOut": { "en": "Sign out" }
}
```

## `src/app-config.ts`

```ts
const { BASE_URL, MODE } = import.meta.env
const appConfig: Record<string, any> = { baseUrl: BASE_URL.replace(/\/$/, ""), env: MODE }

// pick the env-specific value when a key is keyed by Vite MODE, else the value as-is
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

---

# Router

## `src/router/index.ts`

```ts
export { default, default as routerFactory } from "./router"
```

## `src/router/router.ts`

```ts
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

## `src/router/routes.ts`

```ts
import type { RouteRecordRaw } from "vue-router"
import HomeView from "@/views/HomeView.vue"
import AccountView from "@/views/AccountView.vue" // @auth:only
import NotFound from "@/views/NotFound.vue"
import Forbidden from "@/views/Forbidden.vue"
import Unauthorized from "@/views/Unauthorized.vue"

// login is driven by the App.vue modal (auth-on); routes without allowAnonymous are treated as protected
// — home included: an anonymous visitor gets the sign-in modal, not a dashboard they can't act on // @auth:only
const routes: Array<RouteRecordRaw> = [
    { path: "/", name: "home", component: HomeView }, // @auth:only
    { path: "/", name: "home", component: HomeView, meta: { allowAnonymous: true } }, // @noauth:only
    { path: "/account", name: "account", component: AccountView }, // @auth:only
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

---

# Entity aggregator

## `src/entities/index.ts`

```ts
import type { App } from "vue"
import type { RouteRecordRaw } from "vue-router"

// register each entity slice's plugin here as you scaffold them (node scaffold.mjs <Entity>):
//   import { plugin as productPlugin } from "./products"
//   export const plugins = [productPlugin]
export const plugins: any[] = []

export default {
    install(app: App<Element>, { routes }: { routes: Array<RouteRecordRaw> }) {
        plugins.forEach((plugin) => app.use(plugin as any, { routes }))
    },
}
```

---

# App shell — entity-navigation

## `src/components/entity-navigation/functions.ts`

```ts
import { computed, getCurrentInstance } from "vue"
import { type IConfig, importDashboard, importNavbar, buildNavigationTree } from "regira_modules/vue/entities"
import { useConfig } from "@/app-config"

// reads config.json → navigation + the collected $configs, builds the dashboard/navbar trees
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

## `src/components/entity-navigation/index.ts`

```ts
export * from "./functions"
export { default as Dashboard } from "./Dashboard.vue"
export { default as NavBar } from "./NavBar.vue"
export { default as NavSearch } from "./NavSearch.vue"
```

## `src/components/entity-navigation/Dashboard.vue`

```vue
<script setup lang="ts">
import type { RouteLocationRaw, LocationQueryRaw } from "vue-router"
import { Icon } from "regira_modules/vue/ui"
import type { INavItem } from "regira_modules/vue/entities"
import { useNavigation } from "./functions"
const { dashboardTree } = useNavigation()
const to = (v: INavItem): RouteLocationRaw => ({ name: v.routeName, query: (v.initialQuery ?? {}) as LocationQueryRaw })
</script>
<template>
    <div v-if="dashboardTree">
        <template v-for="group in dashboardTree.roots" :key="group.value.id">
            <section v-if="group.children.length" class="mb-4">
                <h3 class="mb-3"><Icon :name="group.value.icon ?? ''" class="me-1" /> {{ $t(group.value.title) }}</h3>
                <div class="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-3">
                    <div v-for="node in group.children" :key="node.value.id" class="col">
                        <router-link :to="to(node.value as INavItem)" class="dashboard-card card h-100 text-center text-decoration-none py-3">
                            <Icon :name="node.value.icon ?? ''" size="xl" />
                            <div class="mt-2 small">{{ $t(node.value.title) }}</div>
                        </router-link>
                    </div>
                </div>
            </section>
        </template>
    </div>
</template>

<style scoped>
.dashboard-card {
    color: inherit;
    transition:
        box-shadow 0.15s ease,
        transform 0.15s ease;
}
.dashboard-card:hover {
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}
</style>
```

## `src/components/entity-navigation/NavBar.vue`

```vue
<script setup lang="ts">
import { ref } from "vue"
import type { RouteLocationRaw, LocationQueryRaw } from "vue-router"
import { Icon } from "regira_modules/vue/ui"
import { isNavItem, type INavItem } from "regira_modules/vue/entities"
import { useNavigation } from "./functions"
const { navbarTree } = useNavigation()
const openId = ref<string>()
const to = (v: INavItem): RouteLocationRaw => ({ name: v.routeName, query: (v.initialQuery ?? {}) as LocationQueryRaw })
</script>
<template>
    <ul v-if="navbarTree" class="navbar-nav me-auto">
        <li
            v-for="node in navbarTree.roots"
            :key="node.value.id"
            class="nav-item"
            :class="{ dropdown: !isNavItem(node.value) }"
            v-click-outside="
                () => {
                    if (openId === node.value.id) openId = undefined
                }
            "
        >
            <router-link v-if="isNavItem(node.value)" class="nav-link" :to="to(node.value as INavItem)">
                <Icon :name="node.value.icon ?? ''" /><span class="d-sm-none d-lg-inline ms-1">{{ $t(node.value.title) }}</span>
            </router-link>
            <template v-else>
                <a class="nav-link dropdown-toggle" href="#" @click.prevent="openId = openId === node.value.id ? undefined : node.value.id">
                    <Icon :name="node.value.icon ?? ''" /><span class="d-sm-none d-lg-inline ms-1">{{ $t(node.value.title) }}</span>
                </a>
                <ul class="dropdown-menu" :class="{ show: openId === node.value.id }">
                    <li v-for="child in node.children" :key="child.value.id">
                        <router-link class="dropdown-item" :to="to(child.value as INavItem)">{{ $t(child.value.title) }}</router-link>
                    </li>
                </ul>
            </template>
        </li>
    </ul>
</template>
```

## `src/components/entity-navigation/NavSearch.vue`

```vue
<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { IconButton } from "regira_modules/vue/ui"
import { useNavigation } from "./functions"
const router = useRouter()
const q = ref("")
const { searchItemConfig } = useNavigation()
function handleSearch() {
    const cfg = searchItemConfig.value
    if (!cfg) return
    router.push({ name: `${cfg.key}Overview`, query: { q: q.value } })
    q.value = ""
}
</script>
<template>
    <form v-if="searchItemConfig" class="d-flex" @submit.prevent="handleSearch">
        <input v-model.trim="q" type="search" class="form-control me-2" :placeholder="`Search ${searchItemConfig.overviewTitle}`" />
        <IconButton icon="search" class="btn-outline-primary" type="submit" />
    </form>
</template>
```

---

# App shell — layout

## `src/components/layout/Main.vue`

```vue
<script setup lang="ts">
import { RouterView } from "vue-router"
</script>
<template><RouterView /></template>
```

## `src/components/layout/TheHeader.vue`

```vue
<script setup lang="ts">
import { computed, ref } from "vue"
import { useAuthStore, getAccountName } from "regira_modules/vue/auth" // @auth:only
import { useConfig } from "@/app-config"
import { NavBar, NavSearch } from "@/components/entity-navigation"

const { title } = useConfig()
const open = ref(false)
const closeMenu = () => (open.value = false)
const authStore = useAuthStore() // @auth:only
const logout = () => authStore.logout() // @auth:only
// resolved from $auth (the store the auth plugin was configured with); not every JWT carries a displayName claim // @auth:only
const accountLabel = computed(() => getAccountName()) // @auth:only
</script>
<template>
    <nav class="navbar navbar-expand-sm" v-click-outside="closeMenu">
        <div class="container-fluid">
            <router-link class="navbar-brand" :to="{ name: 'home' }">{{ $tm(title) }}</router-link>
            <button class="navbar-toggler" type="button" @click.stop="open = !open"><span class="navbar-toggler-icon"></span></button>
            <div class="collapse navbar-collapse" :class="{ show: open }">
                <NavBar @select="closeMenu" />
                <div class="d-flex ms-auto align-items-center gap-2">
                    <NavSearch @search="closeMenu" />
                    <!-- @auth:block-start -->
                    <router-link v-if="$auth.enabled && $auth.isAuthenticated" class="nav-link" :to="{ name: 'account' }" @click="closeMenu">
                        <!-- the $t fallback guards a token with no name claims at all — never an empty (invisible) link -->
                        {{ accountLabel ?? $t("account") }}
                    </router-link>
                    <button v-if="$auth.enabled && $auth.isAuthenticated" class="btn btn-outline-secondary btn-sm" @click="logout">
                        {{ $t("signOut") }}
                    </button>
                    <!-- @auth:block-end -->
                </div>
            </div>
        </div>
    </nav>
</template>
```

## `src/components/layout/TheFooter.vue`

```vue
<script setup lang="ts">
const year = new Date().getFullYear()
</script>
<template>
    <div class="d-flex justify-content-between w-100 py-2 text-muted">
        <span>&copy; {{ year }} Regira</span>
    </div>
</template>
```

---

# Views

## `src/views/HomeView.vue`

```vue
<script setup lang="ts">
import { useConfig } from "@/app-config"
import { Dashboard } from "@/components/entity-navigation"
const { title } = useConfig()
</script>
<template>
    <section>
        <h1 class="text-center my-4">{{ $tm(title) }}</h1>
        <Dashboard />
    </section>
</template>
```

## `src/views/AccountView.vue`

Auth-only (omitted on `--no-auth`): the signed-in user's account page, reached from the header's
displayName link. Hosts `ChangePasswordForm` from the auth module.

```vue
<script setup lang="ts">
import { computed } from "vue"
import { ChangePasswordForm, getAccountName } from "regira_modules/vue/auth"
import { FormSection } from "regira_modules/vue/ui"

// resolved from $auth — the store the auth plugin was configured with, NOT necessarily the module's
// default useAuthStore(); not every JWT carries a displayName claim, hence the $t fallback below
const accountName = computed(() => getAccountName())
</script>
<template>
    <section>
        <h1 class="my-4">{{ accountName ?? $t("account") }}</h1>
        <div class="row mb-3">
            <div class="col-md-8 col-lg-6">
                <FormSection :title="$t('changePassword')">
                    <!-- username feeds the hidden password-manager field -->
                    <ChangePasswordForm :username="accountName" />
                </FormSection>
            </div>
        </div>
    </section>
</template>
```

## `src/views/NotFound.vue`

```vue
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

## `src/views/Forbidden.vue`

```vue
<script setup lang="ts">
defineProps<{ url?: string }>()
</script>
<template>
    <section>
        <h1>403 — forbidden</h1>
        <p class="text-danger">
            You are not authorized to view <router-link v-if="url" :to="url">{{ url }}</router-link
            >.
        </p>
    </section>
</template>
```

## `src/views/Unauthorized.vue`

```vue
<script setup lang="ts">
defineProps<{ url?: string }>()
</script>
<template>
    <section>
        <h1>401 — unauthorized</h1>
        <p>
            Please sign in to view <router-link :to="url ?? '/'">{{ url }}</router-link
            >.
        </p>
    </section>
</template>
```

---

# Infrastructure

## `src/infrastructure/permissions.ts`

```ts
// erasableSyntaxOnly-safe const map (not an enum)
export const Permissions = { CAN_READ: "can_read", CAN_WRITE: "can_write", ADMIN: "admin" } as const
export type Permission = (typeof Permissions)[keyof typeof Permissions]
export default Permissions
```

## `src/infrastructure/user-plugin.ts`

```ts
import { type App, watch } from "vue"
import { useAuthStore } from "regira_modules/vue/auth"
import { useLang } from "regira_modules/vue/lang"
import Permissions from "@/infrastructure/permissions"

// $isAdmin from the auth store + persists the chosen language (auth-only — omitted on --no-auth)
export const plugin = {
    install(app: App) {
        const authStore = useAuthStore()
        Object.defineProperty(app.config.globalProperties, "$isAdmin", {
            get: () => authStore.authData.hasPermission(Permissions.ADMIN),
            enumerable: true,
            configurable: true,
        })

        const { langCode, setLangCode } = useLang()
        const last = localStorage.getItem("lang")
        if (!authStore.isAuthenticated && last && last !== langCode.value) setLangCode(last.substring(0, 2))
        watch(langCode, (code) => localStorage.setItem("lang", code))
    },
}

export default plugin
```

## `src/shims.d.ts`

```ts
declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $isAdmin: boolean // provided by infrastructure/user-plugin.ts (auth-only)
    }
}
export {}
```
