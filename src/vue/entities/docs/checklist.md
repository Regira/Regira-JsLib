# Checklist — add an entity

Step-by-step companion to the worked example ([../ai/entities.examples.md](../ai/entities.examples.md)).
Create `src/entities/<name>/` with the standard folder set (keep it identical for every entity):
`config/ data/ details/ filter/ overview/ selecting/` + `index.ts` + `setup.ts`. The relation picker in
`selecting/Selector.vue` is covered in
[../ai/entities.patterns.md](../ai/entities.patterns.md#entity-selector-relation-picker--selecting).

## Full entity (with list UI)

1. **Model** — `data/Entity.ts`: `class X extends EntityBase` with fields, `override get $id()`
   (`return this.id || "new"`) and `override get $title()`. Export the class, `export const Entity = X`,
   and a default.
2. **Config** — `config/config.ts`: a `const config: IConfig` with `key`, `routePrefix`, `api`, the
   `*Url` fields, `defaultPageSize`, `icon`, titles, and any `baseQueryParams`.
3. **Service** — `data/EntityService.ts`: `class EntityService extends EntityServiceBase<Entity>`; ctor
   `super(axios, config)`; implement `toEntity`. Override `prepareItem` / add endpoints if needed.
4. **Store** — `data/store.ts`:
   `defineStore(Entity.name, () => createStore<Entity>(get<IEntityService<Entity>>(Entity.name)!, Entity.name))`.
5. **Search object** — `filter/SearchObject.ts`: `class EntitySearchObject extends SearchObjectBase`
   with filter fields.
6. **Views** — `overview/Overview.vue` (`useSearchView` + `useRouteOverview`), `details/Details.vue`
   (`useDetails`), `details/Form.vue` (`useForm`), `filter/Filter.vue` (`useFilter`). Keep them thin.
7. **Plugin** — `setup.ts`: `createRoutes()` (Overview + Details with Fiche/Form children),
   `addServices(sp)`, `addIcons(icons)`, and a default `install(app, { routes })` that pushes routes,
   registers services/icons, and sets `app.config.globalProperties.$configs[Entity.name] = config`.
8. **Barrel** — `index.ts`: re-export `config`, `Entity`, and the plugin.
9. **Register** — add the plugin to the `plugins` array in `src/entities/index.ts` (order matters where
   one entity's selector is used by another).

## Lookup entity (no list UI)

Omit step 6's views and `createRoutes()`. The `install` only calls `addServices`, `addIcons`, and sets
`$configs[Entity.name]`. `SearchObject` can be empty (`extends SearchObjectBase {}`). For small static
lists, extend `JSONService` instead of `EntityServiceBase`.

## App-level setup (once per app)

- **Plugins & bootstrap** — `main.ts` / `App.vue`, install order, and the required-vs-optional plugin
  set: [../ai/entities.setup.md](../ai/entities.setup.md).
- **App-shell scaffold** — the concrete tooling, router split, `components/`, `infrastructure/`, and
  views that surround the slices — see the public sample app
  [Regira-PIM-Admin](https://github.com/Regira/Regira-PIM-Admin); the same shell is inlined in
  [../ai/entities.setup.md](../ai/entities.setup.md#app-shell--components-infrastructure--styling).
- **No authentication** — omit `authPlugin`, advance `AppStatus` to `Ready` yourself, drop the auth UI:
  [../ai/entities.setup.md](../ai/entities.setup.md#running-without-authentication).
- **Types from OpenAPI** — generate DTO types and feed them into the models:
  [../ai/entities.patterns.md](../ai/entities.patterns.md#type-the-client-from-the-apis-openapi).

## Verify

- Service resolves: `get<IEntityService<Entity>>(Entity.name)` is non-null after startup.
- Overview lists and pages; archived rows hidden unless `searchObject.isArchived` is set.
- Save round-trips: new item (`$id === "new"`) inserts; existing updates; bind results to `saved`.
- Routes resolve: `${key}Overview`, `${key}Details` → `${key}Form`/`${key}Fiche`.
- Smoke-test at runtime: after `npm run build`, run the app against the live API and load one view per
  entity — a green build alone does not exercise the wiring.

## Overview

1. [Abstractions](abstractions.md)
2. [Services](services.md)
3. [Config](config.md)
4. [Views](views.md)
5. [Built-in features](built-in-features.md)
6. [Attachments](attachments.md)
7. [Checklist](checklist.md)
