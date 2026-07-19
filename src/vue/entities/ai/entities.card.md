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
- **The provided components, composables and patterns _are_ the product — they are how you ship a scalable,
  production-ready app with little code.** Reach for a built-in and restyle/wrap it; hand-rolling one is a
  deviation to declare: feedback (`useFeedback` + `<Feedback>`), tabs (`TabContainer` + `Tab.create`),
  modals (`DefaultModal` / `FormModalButton`), paging (`Paging`), loading (`LoadingContainer`), relation
  pickers (`Autocomplete` / `InputSelector`), owned/join chips (`InputSelectorInline` + `_deleted`),
  file attachments (`entity-attachments` + `FileDropZone`), debug (`<Debug>`), breakpoints (`useScreen`).
- **The entity's own create/edit form is a PAGE, not a modal.** Scaffold `isComplex: true` (the default):
  the overview's row-edit and "new" actions navigate to the **Details page**. Reserve the modal form
  (`isComplex: false`, `FormModalButton`) for a **very basic** entity — a handful of scalar fields, no
  relations, no tabs. A modal per real entity does not scale (no deep-link, no tabs, cramped on mobile).
- **A displayed *related* entity defaults to its `FormModalButton`** — every chip, badge, or list cell that
  shows a related row opens that row's form in a modal (quick-edit), whatever that entity's own `isComplex`;
  a bare text label is the exception. This is distinct from the rule above: it edits a *neighbour*, not the
  page's own record.
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
  inside the parent form with **`InputSelectorInline`**: chips mark *persisted* removals `_deleted`
  (visible, tinted, undoable until save), a `prepareItem` override drops them so `Related()` deletes by
  omission — never flush per-row `DELETE`s. A row *added this session* is removed outright — nothing to
  undo. The multi-`Selector` **hard-removes** and cannot deliver this UX. New rows
  mint negative temp ids, so children can be added before the parent's first save. The chip slot shows the
  related row's `FormModalButton` + pooled label (see the card's related-entity rule), not bare text.
- **Relation picks go through the entity `InputSelector`** (server-side search + pooled cache — scales
  past one page). It already composes **create + autocomplete + browse**: a `FormModalButton` (create on
  the spot), an `Autocomplete` (type a known name) and a `SelectorModalButton` (browse modal with the full
  `FilterAdv` and paging) — never build a search box, picker grid or browse modal next to it. When adding
  to a collection, pass `:filter-defaults="{ exclude: currentIds }"` so already-added rows leave the
  picker. A checkbox group is only for serviceless enum sets.
- **Day-one signatures — verify, never extrapolate** (`.d.ts` / `entities.signatures`): `new
  PagingInfo(pageSize?, page?)` — positional args, not an options object; `service.search(so?)` — paging
  travels *inside* the search object; `Tab.create("form", { title: translate("form"), icon })` — tab
  titles render untranslated.
- **Login can switch the language.** The scaffolded `main.ts` applies the JWT culture claim
  (`setLangCode(auth.culture.split("-")[0])`), so an app translated in one language silently degrades to
  raw keys after login when the user's culture differs. Provide translations for every `langs` entry and
  wire `LangSelector` in the header.
- **Counted paging comes from `/search`:** `useSearchView` + `useRouteOverview` → `{ items, count }` —
  on simple and complex entities alike; `list()` has no count. `pageSize: 0` returns all rows capped by
  the server's `MaxPageSize`. In `IConfig`, set **only** `searchUrl` (`api + "/search"`) — every other
  `*Url` defaults off `api`, and `saveUrl` must stay the resource base or updates 404 while inserts pass.
- **Forms show state through feedback.** `useForm` drives it, but only a rendered
  `<Feedback :feedback="feedback" />` shows it; any save you call yourself gets its own `useFeedback()`.
  A form with 2+ related collections splits into `TabContainer` tabs; overview rows use flexible
  `col text-truncate` + breakpoint-hidden columns, so the row fits without scrolling sideways.
- **Pooling is the point of the store.** Views use the store's pooled `service` (saves propagate to every
  view). A nested DTO from `?includes=` is a plain object — no `$id`/`$title` — so route every displayed
  relation through the owning slice's `fromPool(item.relation)`, which both rehydrates it and returns the
  one shared instance, so editing that entity anywhere relabels it here. `Object.assign(new Category(),
  dto)` also rehydrates but yields a **detached copy that goes stale** — use it only when a snapshot is
  what you want. Custom endpoints live on the raw `get<EntityService>(Entity.name)`, not the pooled store.
- **A displayed relation is a component, not text**: the related entity's `FormModalButton` beside its
  pooled `$title`. `scaffold.mjs <Entity> --rel <Related>` generates the column wired correctly.
- **`InputSelector` has two v-models** — `v-model` (the entity it displays) and `v-model:idValue` (the FK
  it saves). Bind only `idValue` and a populated form renders the control blank; it resolves the id on
  mount and emits `update:modelValue` into nothing. Dev builds warn.
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
- **Building a common domain feature? Check the blueprints** — `get_package("regira_modules.vue.entities", section: "blueprints")`
  has the SPA counterparts of the back-end blueprints: labels editor, tenant switcher, family tree view,
  polymorphic (TPH) entity.
