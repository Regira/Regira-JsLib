# regira_modules.vue.entities — index card (front-end)

> The must-know bullets before building a Vue 3 SPA on the Regira entities client. Drill into
> `entities.instructions` (the spine), `entities.setup` (project + app shell), `entities.namespaces` /
> `entities.signatures` (never guess an import or signature), and the examples/patterns sections for
> detail. **Read economically:** this card + a heading-scoped `get_package` (its `section` + `heading`
> params; find headings with `get_section_toc`) usually suffices — pull a whole section only when a
> heading isn't enough.
> Back-end counterpart: `get_package_card("Regira.Entities")`.

- **Default = the full reference scaffold, whatever the app type.** `scaffold.mjs --shell` once
  (`--no-auth` variant exists), `scaffold.mjs <Entity>` per entity; you edit only the eight `(c)` files.
  Pick a lighter tier only on an explicit user ask.
- **Use the built-ins — hand-rolling one is a deviation to declare:** feedback (`useFeedback` +
  `<Feedback>`), tabs (`TabContainer` + `Tab.create`), modals (`DefaultModal` / `FormModalButton`),
  paging (`Paging`), loading (`LoadingContainer`), relation pickers (`Autocomplete` / `InputSelector`),
  owned/join chips (`InputSelectorInline` + `_deleted`), debug (`<Debug>`), breakpoints (`useScreen`).
- **A displayed related entity defaults to its `FormModalButton`** — every chip, badge, or list cell that
  shows a related row should open that row's form in a modal; a bare text label is the exception.
- **Restyle freely — and space what you add.** The default styling is deliberately plain and tight;
  improving it is expected. Group fields in `FormSection` and give every component deliberate spacing
  (`mb-2`/`mb-3`, margins) — a dropped-in component with none reads as unfinished. Preserve the wiring
  (composables, events, `_deleted` marking, modal teleport); overriding Bootstrap's `!important` utilities
  (a scaffold's tight `py-1`, etc.) needs `!important` back. Improve the look via CSS after the library css,
  by wrapping components, or by swapping the app-wide modal via `modalPlugin`.
- **Model/view lockstep.** The scaffolded `(c)` views bind a placeholder `title` — when you change
  `data/Entity.ts` or `filter/SearchObject.ts`, update `Form.vue` / `FilterAdv.vue` / `List(Item).vue`
  in the same pass, or `vue-tsc` breaks on the stale bindings.
- **A slice is:** model (`EntityBase`, override `$id`/`$title`) + `IConfig` + service
  (`EntityServiceBase<T>`, implement only `toEntity`) + pooled Pinia store (`createStore`) + thin views
  driven by `useSearchView` / `useDetails` / `useForm` / `useFilter`.
- **Cross-slice model imports must alias `Entity`.** A slice barrel re-exports its model as the default
  `Entity`, not under the class name — importing `{ MyNamedEntity }` is the `TS2305 "has no exported member"`
  trap (the most common first error in a multi-entity app). Always
  `import { type Entity as MyNamedEntity } from "@/entities/my-named-entities"`.
- **Editable child/join collections are owned, not independent.** Back-end `e.Related()` ⇒ edit the rows
  inside the parent form with **`InputSelectorInline`**: chips mark removals `_deleted` (visible, tinted,
  undoable until save), a `prepareItem` override drops them so `Related()` deletes by omission — never
  flush per-row `DELETE`s. The multi-`Selector` **hard-removes** and cannot deliver this UX. New rows mint
  negative temp ids, so children can be added before the parent's first save.
- **Relation picks go through the entity `InputSelector`** (server-side search + pooled cache — scales
  past one page). When adding to a collection, pass `:filter-defaults="{ exclude: currentIds }"` so
  already-added rows leave the picker. A checkbox group is only for serviceless enum sets.
- **Counted paging comes from `/search`:** `useSearchView` + `useRouteOverview` → `{ items, count }` —
  on simple and complex entities alike; `list()` has no count. `pageSize: 0` returns all rows capped by
  the server's `MaxPageSize`. In `IConfig`, set **only** `searchUrl` (`api + "/search"`) — every other
  `*Url` defaults off `api`, and `saveUrl` must stay the resource base or updates 404 while inserts pass.
- **Forms show state through feedback.** `useForm` drives it, but only a rendered
  `<Feedback :feedback="feedback" />` shows it; any save you call yourself gets its own `useFeedback()`.
  A form with 2+ related collections splits into `TabContainer` tabs; overview rows use flexible
  `col text-truncate` + breakpoint-hidden columns — never horizontal scroll.
- **Pooling is the point of the store.** Views use the store's pooled `service` (saves propagate to every
  view); render relation labels via `fromPool(item.relation)?.$title` — a raw nested DTO has no `$`
  getters. Custom endpoints live on the raw `get<EntityService>(Entity.name)`, not the pooled store.
- **The URL contract has four owners** — `config.json → api` (axios base), `IConfig.api` (relative
  resource), the Vite dev proxy, the server route prefix. Align them once or every call 404s; and
  `config.json → clientApp` must equal the API's JWT audience or every call 401s.
- **List rows get relations via `baseQueryParams: { includes: [...] }`** (complex entities); a detail
  form's children come from the back-end's Details eager-load, not from `includes`.
- **Never spread a model** — `{ ...item }` drops the `$id` prototype getter and `PUT`s to `/undefined`;
  mutate the instance. Overview refs are lazy: guard with `items ?? []`.
- **Verify at runtime, not just `npm run build`.** Drive each slice once against the live API: save the
  same record **twice** (the classic m2m re-sync 500), toggle a flag, apply + reopen a filter, delete a
  referenced row. `vue-tsc` proves none of this.
- **`<Debug :modelValue="…" />` while developing** — self-gates on `$isDebug` (`?debug=1`), inert in
  production; curate the payload (resolved relations, paging state).
