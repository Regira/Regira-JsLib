# The module stack

`regira_modules` is organised as small, independently importable modules. Most apps wire the Vue
platform plugins together once at startup and then build features on top of the **entities** CRUD
client. The core modules are framework-agnostic and usable on their own.

## Vue modules

| Module | Import | Role |
|--------|--------|------|
| [Entities (CRUD)](/reference/vue-entities/) | `regira_modules/vue/entities` | Vue 3 CRUD client mirroring the back-end Entities API: services, stores, overview/details/form composables. |
| [HTTP](/reference/vue-http/) | `regira_modules/vue/http` | Shared axios instance + request helpers. |
| [IoC](/reference/vue-ioc/) | `regira_modules/vue/ioc` | Service container / dependency registration. |
| [Auth](/reference/vue-auth/) | `regira_modules/vue/auth` | JWT bearer authentication. |
| [UI](/reference/vue-ui/) | `regira_modules/vue/ui` | Components & plugins (icons, screen, loading, modal, feedback). |
| [App](/reference/vue-app/) | `regira_modules/vue/app` | App lifecycle, status & culture. |
| [Lang](/reference/vue-lang/) | `regira_modules/vue/lang` | i18n / translations. |
| [Formatters](/reference/vue-formatters/) | `regira_modules/vue/formatters` | Display formatters. |
| [Directives](/reference/vue-directives/) | `regira_modules/vue/directives` | Custom Vue directives (registered as plugins). |
| [Online](/reference/vue-online/) | `regira_modules/vue/online` | Connectivity state. |
| [Debug](/reference/vue-debug/) | `regira_modules/vue/debug` | Debug helpers. |

## Core (framework-agnostic)

| Module | Import | Role |
|--------|--------|------|
| [Utilities](/reference/utilities/) | `regira_modules/utilities` | Array / string / file / promise helpers. |
| [Extensions](/reference/extensions/) | `regira_modules/extensions` | Prototype-style extensions (e.g. date-extensions). |
| [TreeList](/reference/treelist/) | `regira_modules/treelist` | Tree data structure & traversal. |
| [Events](/reference/events/) | `regira_modules/events` | Lightweight event bus. |
| [IO](/reference/io/) | `regira_modules/io` | File / image helpers. |

> Each reference page is generated from that module's own `README.md` and `docs/` in the
> repository, so it always reflects the source.
