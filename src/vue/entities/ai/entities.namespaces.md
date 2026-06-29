# Regira JsLib Entities — Import Reference

Where every type comes from. JavaScript has import specifiers, not namespaces.

> **AI rule:** You MUST use the exact import specifiers below. Do **not** guess a path or invent a
> deep import — verify here, then check the signature in [entities.signatures.md](entities.signatures.md).

## The one import you usually need

The barrel **`regira_modules/vue/entities`** re-exports the entire entities surface (abstractions, config,
overview, details, form, filter, lean views, describers, navigation, pooling, preloading, tree, utilities). Prefer it:

```ts
import {
    EntityBase,
    EntityServiceBase,
    JSONService,
    SearchObjectBase,
    PagingInfo,
    type IEntity,
    type IEntityService,
    type IConfig,
    type SearchResult,
    type SaveResult,
    useSearchView,
    useRouteOverview,
    useDetails,
    useForm,
    useFilter,
    createStore,
    DetailsSummary,
} from "regira_modules/vue/entities"
```

> **Alias convention:** the demo apps vendor the package and alias it, so their imports read
> `@/regira_modules/vue/entities`. In a clean npm install the specifier is `regira_modules/vue/entities`.
> Both resolve to the same module — see the repo [README](../../../../README.md) for the alias setup.

The two non-entities modules the entities layer depends on for wiring:

```ts
import { ServiceProvider, get, type IServiceProvider } from "regira_modules/vue/ioc"
import { initAxios, useAxios, createQueryString } from "regira_modules/vue/http"
```

---

## Types by concern (barrel: `regira_modules/vue/entities`)

| Concern                | Exports                                                                                                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entity contract        | `IEntity`, `EntityBase`                                                                                                                                                 |
| Service                | `IEntityService`, `EntityServiceBase`, `JSONService`                                                                                                                    |
| Result envelopes       | `DetailsResult`, `ListResult`, `SearchResult`, `SavedResult`, `SaveResult`, `DeleteResult`                                                                              |
| Search / paging / sort | `ISearchObject`, `SearchObjectBase`, `DefaultSearchObject`, `IPagingInfo`, `PagingInfo`, `DEFAULT_PAGESIZE`, `ISortByInfo`, `SortByInfo`                                |
| Config / descriptor    | `IConfig`, `NavTypes`, `EntityDescriptor`, `IEntityDescriptor`                                                                                                          |
| Overview               | `useSearchView`, `useListView`, `useOverviewCore`, `useRouteOverview`, `OverviewProps`, `OverviewEmits`, `DEFAULT_DEBOUNCE`                                             |
| Details                | `useDetails`, `DetailsSummary`                                                                                                                                          |
| Form                   | `useForm`, `useModalForm`/`useModal`, `FormProps`, `FormEmits`, `FormStates`, `formDefaults`, `useOwnedCollection`, `useOwnedModal`, `useListInput`, `useListItemInput` |
| Filter                 | `useFilter`, `FilterIn`, `FilterEmits`, `FilterOut`                                                                                                                     |
| Lean views             | `EntityOverview`, `EntityForm` (generic list/edit driven by `IEntityService`)                                                                                           |
| Pooling                | `createStore`, `usePooling`, `defaultPoolCache`, `PoolCache`, `PoolService`, `IPoolHandler`, `IPoolService`, `IPoolCache`                                               |
| Navigation             | `NavItem`, `NavGroup`, `INavItem`, `INavCore`, `createNavItem`, `createNavGroup`, `buildNavigationTree`, `importDashboard`, `importNavbar`, `isNavItem`                 |
| Tree                   | `useTree`, `useDragDrop`                                                                                                                                                |
| Preloading             | `usePreloader`, `preloaderPlugin`                                                                                                                                       |
| Utilities              | `cleanQueryParams`, `parseQueryParams`                                                                                                                                  |

`Selector.vue` (entity picker) is exported from the barrel's `components`.

## Granular subpaths (also published)

Use these only when you want to import a single feature area (e.g. for tree-shaking). All are also
re-exported by the barrel above.

| Subpath                                    | Holds                                                                                                                                        |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `regira_modules/vue/entities/abstractions` | `IEntity`, `EntityBase`, `IEntityService`, `EntityServiceBase`, `JSONService`, result types, `IConfig`, `NavTypes`, search/paging/sort types |
| `regira_modules/vue/entities/config`       | `EntityDescriptor`, `IEntityDescriptor`                                                                                                      |
| `regira_modules/vue/entities/overview`     | overview composables + types                                                                                                                 |
| `regira_modules/vue/entities/details`      | `useDetails`, `DetailsSummary`                                                                                                               |
| `regira_modules/vue/entities/form`         | `useForm`, modal/owned/list-input composables + types                                                                                        |
| `regira_modules/vue/entities/filter`       | `useFilter` + types                                                                                                                          |
| `regira_modules/vue/entities/describers`   | `useEntityDescribers`                                                                                                                        |
| `regira_modules/vue/entities/navigation`   | nav classes, builders, importers                                                                                                             |
| `regira_modules/vue/entities/pooling`      | pooling cache + handlers                                                                                                                     |
| `regira_modules/vue/entities/preloading`   | `usePreloader`, `preloaderPlugin`                                                                                                            |
| `regira_modules/vue/entities/tree`         | `useTree`, `useDragDrop`                                                                                                                     |
| `regira_modules/vue/entities/utilities`    | `cleanQueryParams`, `parseQueryParams`                                                                                                       |

> The package also exposes `regira_modules/vue/entities/abstractions/IEntity` for importing the
> contract alone (used by `package.json` `exports`).

## Wiring modules

| Specifier                       | Exports                                                                                                   | Used for                                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `regira_modules/vue/ioc`        | `ServiceProvider`, `get`, `IServiceProvider`, `plugin`                                                    | register/resolve services                                                                  |
| `regira_modules/vue/http`       | `initAxios`, `useAxios`, `AxiosWithFilesInstance`, `createQueryString`                                    | the shared axios instance + query strings                                                  |
| `regira_modules/vue/auth`       | `plugin`, `LocalStorageTokenManager`/`CookieTokenManager`/`MemoryTokenManager`, `useAuthStore`, `useAuth` | bearer-token auth on the shared axios                                                      |
| `regira_modules/vue/vue-helper` | `useVModelField`, `createFromComputedPool`, `useEventListener`                                            | v-model field binding + pool-backed computed helpers (used by the advanced example's form) |

> **Deep specifiers in the advanced example.** The verbatim Vehicle slice
> ([entities.advanced.example.md](entities.advanced.example.md)) reaches two granular paths:
> `regira_modules/vue/http/axios` for the `AxiosWithFilesInstance` **type** (also re-exported by the
> `vue/http` barrel above) and `regira_modules/vue/ui/icons` for `IIconProvider`. Prefer the barrel where
> a symbol is re-exported; these deep paths are only needed for the few symbols that aren't.

> **Date serialization (not under `vue/`):** `import dateExtensions from "regira_modules/extensions/date-extensions"`
> then call `dateExtensions.use()` once at startup to serialize `Date`s to JSON without a timezone shift.
> It lives under `extensions/`, not `vue/` — a common wrong guess.

---

## By use case (copy-paste)

```ts
// Define an entity
import { EntityBase } from "regira_modules/vue/entities"

// Define a service
import { EntityServiceBase, type IConfig } from "regira_modules/vue/entities"
import type { AxiosInstance } from "axios"

// Static/lookup data service (client-side cache)
import { JSONService } from "regira_modules/vue/entities"

// Define a search object
import { SearchObjectBase } from "regira_modules/vue/entities"

// Register + resolve the service
import { get, type IServiceProvider } from "regira_modules/vue/ioc"
import type { IEntityService } from "regira_modules/vue/entities"

// Pinia store wrapping the pooled service
import { createStore } from "regira_modules/vue/entities"

// Overview (list + search + URL sync)
import { useSearchView, useRouteOverview } from "regira_modules/vue/entities"

// Details + Form + Filter
import { useDetails } from "regira_modules/vue/entities"
import { useForm, type FormEmits, formDefaults, FormStates } from "regira_modules/vue/entities"
import { useFilter } from "regira_modules/vue/entities"

// Navigation from the collected configs
import { importDashboard, importNavbar, buildNavigationTree } from "regira_modules/vue/entities"

// App startup
import { initAxios } from "regira_modules/vue/http"
import { plugin as servicesPlugin } from "regira_modules/vue/ioc"
```

## See also

- [entities.signatures.md](entities.signatures.md) — exact signatures for everything above
- [entities.instructions.md](entities.instructions.md) — the workflow
