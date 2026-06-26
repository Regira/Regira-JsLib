# Regira Entities (front-end)

The browser-side CRUD client for the **Regira.Entities** API — a Vue 3 + Pinia + vue-router library
published as `regira_modules/vue/entities`. You describe an entity once (model, service, config, views)
and get a list/search overview, a details page, a create/edit form, and a filter, all wired through a
shared HTTP client and a reactive entity cache.

## Core concepts

| Piece | What it is |
|-------|------------|
| **Entity** | A model class extending `EntityBase` with `$id` (uniform identifier) and `$title` (uniform label for display). |
| **Service** | `EntityServiceBase<T>` — issues the HTTP calls; you implement `toEntity`. |
| **Config** | An `IConfig` object: endpoint URLs, paging, route prefix, titles, icon. |
| **Store** | A Pinia store wrapping the service in a pooled, reactive cache (`createStore`). |
| **Views** | Overview / Details / Form / Filter, each driven by a composable. |

## Architecture

```
Vue view → composable (useSearchView / useForm / useDetails / useFilter)
         → Pinia store (createStore) → PoolService (entity cache)
         → IEntityService (resolved from IoC by Entity.name)
         → shared axios + IConfig.*Url → Regira.Entities Web API
```

A single axios instance (`initAxios`) is shared across all services; the auth plugin adds the bearer
token via an interceptor, so every entity request is authenticated. **Auth is optional** — see
[running without authentication](ai/entities.setup.md#8-running-without-authentication). Services are
registered in a small IoC container keyed by `Entity.name` and resolved with `get()`.

## Quick start

Starting a new app? [ai/entities.setup.md](ai/entities.setup.md) is the project template —
`main.ts`, `App.vue`, router, plugin install order, **running with or without authentication**, the
required-vs-optional plugin set, and the npm install (the `@/regira_modules` alias is optional). To type
the client from the API's OpenAPI, see
[entities.patterns.md](ai/entities.patterns.md#type-the-client-from-the-apis-openapi).

A complete entity slice lives under `src/entities/<name>/` with the standard folder set
(`config/ data/ details/ filter/ overview/ selecting/` + `index.ts` + `setup.ts`). See the full worked
code in [ai/entities.examples.md](ai/entities.examples.md), or the step list in
[checklist.md](docs/checklist.md). The app shell (project structure, `components/`, `infrastructure/`,
`config.json` + `app-config.ts`, and Bootstrap 5 styling) is in
[ai/entities.setup.md](ai/entities.setup.md#2-project-structure). For a complete working example, see the
public sample app [Regira-PIM-Admin](https://github.com/Regira/Regira-PIM-Admin); the same scaffold is
inlined for agents in [ai/entities.template.md](ai/entities.template.md).

## API contract

The client mirrors the back-end Web endpoints and expects item-wrapped envelopes
(`{ item }`, `{ items, count }`), with `GET` for reads, `POST`/`PUT` for save, `DELETE` for remove. The
full table is in [services.md](docs/services.md#http-contract).

## Documentation

For AI agents, the same material is served by the Regira MCP server (package
`regira_modules.vue.entities`) and authored under [`ai/`](ai): `entities.setup.md`,
`entities.instructions.md`, `entities.signatures.md`, `entities.namespaces.md`, `entities.patterns.md`,
`entities.examples.md`, `entities.template.md`.

## Overview

1. [Abstractions](docs/abstractions.md) — `IEntity`/`EntityBase`, search/paging/sort, `IConfig`
2. [Services](docs/services.md) — `EntityServiceBase`, `JSONService`, the HTTP contract
3. [Config](docs/config.md) — `IConfig` fields, URL derivation, descriptors
4. [Views](docs/views.md) — overview, details, form, filter composables
5. [Built-in features](docs/built-in-features.md) — pooling, preloading, navigation, trees, utilities
6. [Checklist](docs/checklist.md) — add a new entity, step by step
