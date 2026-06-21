# Regira JsLib — Project Setup

How to stand up a new `regira_modules` Vue 3 app (Vite + Pinia + vue-router) — the starter `main.ts`,
`App.vue`, router, and plugin wiring. Kept to the basics; add only what you need. Verify any API in
[entities.signatures.md](entities.signatures.md) and the per-module guides.

## 1. Install & alias

Add the dependency and alias `@/regira_modules` to the package's `dist/`:

```jsonc
// package.json
"dependencies": { "regira_modules": "github:Regira/Regira-JsLib" }
```

```ts
// vite.config.ts → resolve.alias (order matters)
alias: [
  { find: "@/regira_modules", replacement: fileURLToPath(new URL("./node_modules/regira_modules/dist", import.meta.url)) },
  { find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) },
]
```

```jsonc
// tsconfig.app.json → compilerOptions.paths
"@/regira_modules/*": ["./node_modules/regira_modules/dist/*"],
"@/*": ["./src/*"]
```

Peer deps: `vue`, `vue-router`, `pinia`, `axios`, `date-fns`, `lodash`.

## 2. Folder structure

```
public/
  config.json            # runtime config (api, culture, clientApp, loginUrl)
  data/translations.json # i18n messages
src/
  entities/              # one folder per entity (see entities.examples.md) + index.ts aggregator
  router.ts
  App.vue
  main.ts
```

## 3. Runtime config — `public/config.json`

```json
{ "api": "https://localhost:5001", "culture": "en-US", "clientApp": "my-app", "loginUrl": "https://accounts.example.com/login" }
```

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

## 7. Add entities

Create `src/entities/<name>/` slices and an `src/entities/index.ts` aggregator that installs them and
collects routes — full code in [entities.examples.md](entities.examples.md) and the
[checklist](../docs/checklist.md).

## See also

- [entities.instructions.md](entities.instructions.md) · [entities.examples.md](entities.examples.md)
- Module guides: [http](../../http/ai/http.instructions.md) · [ioc](../../ioc/ai/ioc.instructions.md) ·
  [auth](../../auth/ai/auth.instructions.md) · [ui](../../ui/ai/ui.instructions.md) ·
  [app](../../app/ai/app.instructions.md) · [lang](../../lang/ai/lang.instructions.md)
