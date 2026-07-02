# Regira Front-end Consumer Bootstrap (Vue 3 SPA)

Authoritative downstream entry for building a **browser front-end** (Vue 3 single-page app / admin UI /
CRUD client) against a **Regira.Entities** API. Use this when the target is a SPA.

> **Building the .NET back-end instead?** That is a different flow — call `get_bootstrap_guide` (the
> default consumer bootstrap). This front-end family is **npm / TypeScript**, published from the
> `Regira-JsLib` repo, with package ids like `regira_modules.vue.entities`. There is **no NuGet feed and
> no license key** on the front-end.

## Pick the build tier first

Decide the tier **before reading any further guides** — it determines which docs you need at all.
**Default: a scalable, production-ready app on the full reference scaffold** — treat every build request as
production-bound unless the user says otherwise. Drop to a lighter tier only when the user explicitly asks
for a storefront, embed, demo, or custom/headless UX — and declare the choice (tier definitions:
`entities.instructions` → _How much to build_).

| Tier                        | Build when…                                                | Read (everything else is skippable)                                                                                  |
| --------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Full scaffold** (default) | admin / back-office CRUD; no explicit lighter ask          | the full reading order below                                                                                         |
| **Lean** (generic views)    | focused admin or embed with standard lists — explicit ask  | `entities.instructions` → _How much to build_ + `entities.setup` → _Install_ / _Lean tier_                           |
| **Headless** (data layer)   | bespoke UX that only needs typed API access — explicit ask | `entities.setup` → _Install_ / _Headless quick-start_ + `entities.namespaces`; skip the plugin/composable/shell docs |

**Full scaffold** = the complete plugin stack, the per-entity slice
(`config`/`data`/`filter`/`overview`/`details`/`selecting`/`setup`), the app shell (dashboard + navbar),
the preloader, and the `app-config.ts` runtime config. Use the **full** features of `regira_modules`, not a
hand-rolled subset — the scaffold type-checks green out of the box and ships the server-searchable relation
pickers, pooling, and preloader a hand-rolled tier would only have to rebuild. Scaffold each entity by
copying the shipped slice template rather than re-writing ~23 files:

```bash
node node_modules/regira_modules/_template/scaffold.mjs --shell    # → app shell once: main.ts, App.vue, router, dashboard/navbar, layout, views (--no-auth variant)
node node_modules/regira_modules/_template/scaffold.mjs Product     # → src/entities/products/  (--no-auth for a no-auth app)
```

The app shell — the config-driven **dashboard + navbar** (`entity-navigation/` + `layout/`) — is
**auth-independent**: it builds from `$configs` + `config.json → navigation`, not the auth store, so build it
even for a no-auth app. Hand-rolling a navbar instead of `useNavigation()` forfeits that config-driven shell
and is a deviation to declare, not a default; only `users/` + `user-plugin` are auth-coupled.

## MCP server

The Regira MCP server (`https://mcp.regira.com/mcp`) has full knowledge of every front-end module,
including ones not yet installed locally. Use it to discover and read guides on demand:

| Tool                                                       | Purpose                                                        |
| ---------------------------------------------------------- | -------------------------------------------------------------- |
| `list_packages` (filter `vue` / `frontend`)                | Browse the front-end module catalog.                           |
| `recommend_packages` / `search_packages`                   | First-pass / keyword package discovery.                        |
| `get_package_toc`                                          | List a package's documentation sections.                       |
| `get_section_toc`                                          | List a section's headings before loading content.              |
| `get_package` (`section=`, `heading=`, `maxChars`, `page`) | Read the actual guidance, scoped.                              |
| `get_example` (`section=`)                                 | Pull only matching examples.                                   |
| `list_types` / `get_type`                                  | Inspect the public API surface from the committed `.d.ts` map. |

Context economy: orient with `get_package_card` first; read only your tier's primary guides in full; for
everything else prefer `get_section_toc` + heading-scoped `get_package` and `get_example(pattern=…)` over
whole-section reads.

## Pre-flight checklist

- [ ] **Probe the install before reading further.** `regira_modules` installs from GitHub
      (`"regira_modules": "github:Regira/Regira-JsLib"`) — sandboxed/CI environments may block or require
      approval for non-registry installs, so run the `npm install` first and surface any blocker before
      spending context on guides. No NuGet, no license key, no service budget on the front-end.
- [ ] Peers + toolchain installed from the **known-good dependency set** (`entities.setup` → Install) in
      one `npm install` — the majors move as a set (`vue-router 5` → `vite 8` → `typescript 6` /
      `vue-tsc 3`); do not resolve them one `ERESOLVE` at a time.
- [ ] **Authentication is optional.** Do not assume the auth plugin is required; follow the _Running
      without authentication_ recipe in `entities.setup` to run without a login.
- [ ] **Type the client from the API's OpenAPI.** When the API exposes OpenAPI, generate TypeScript types
      from it and feed them into the hand-written entity models (you still hand-write the model classes).
- [ ] The primary guides **for the chosen tier** (full tier: `entities.instructions` + `entities.setup`)
      are read in full before generating slices, services, composables, or the app shell.
- [ ] Verify the SPA with `npm run build` (`vue-tsc -b`) — not only a `--noEmit` typecheck.

## Reading order (start here)

Read in this order; consult the deep references by section on demand. Keep this list identical to the
reading-order note in `regira_modules.vue.entities` → `entities.setup`.

1. `get_package id="regira_modules.vue.entities" section="entities.instructions"` — the entity-slice
   workflow and conventions (incl. the list-vs-search / simple-vs-complex composable mapping). Read in
   full before writing a slice.
2. `section="entities.setup"` — the new-project template (Vite + Pinia + vue-router): `main.ts`,
   `App.vue`, router, plugin install order, **required-vs-optional plugins**, **running with or without
   authentication**, the npm install (no alias needed), the **full project structure** (per-entity folder
   set incl. `selecting/`, plus `components/`, `infrastructure/`, `config.json` + `app-config.ts`), and
   **Bootstrap 5** styling.
3. `section="entities.namespaces"` (exact import specifiers) + `section="entities.signatures"` (exact
   signatures) — consult while coding. **Never guess** a front-end import or signature.
4. `section="entities.examples"` (simple + standard slices) / `section="entities.advanced.example"`
   (complex slice), then `section="entities.patterns"` (child collections, trees, JSON lookups, typing
   the client from OpenAPI, custom endpoints) — load on demand.

## Front-end module family

The CRUD client `regira_modules.vue.entities` wires onto sibling modules:

| Module id                                                           | Role                                                                            |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `regira_modules.vue.entities`                                       | CRUD client: models, services, search/paging, overview/details/form composables |
| `regira_modules.vue.ioc`                                            | DI container (`$services`, `get()`)                                             |
| `regira_modules.vue.http`                                           | shared axios instance + query strings                                           |
| `regira_modules.vue.app`                                            | app lifecycle (`AppStatus`, `$setAppStatus`) + culture                          |
| `regira_modules.vue.ui`                                             | icon / loading / modal / feedback components and plugins                        |
| `regira_modules.vue.auth`                                           | bearer-token auth (**optional**)                                                |
| `regira_modules.vue.lang`                                           | i18n (`$t`)                                                                     |
| `regira_modules.vue.directives`, `.formatters`, `.online`, `.debug` | smaller helpers                                                                 |
| `regira_modules.io`                                                 | `FileHelper` / `ImageHelper` (uploads, blob/base64/url, image ops)              |

## You are the Vue 3 / TypeScript / Vite expert

These guides cover Regira's front-end modules only. General front-end concerns — dev server, proxy, CORS,
bundling, the build — are yours to own. Style with **Bootstrap 5**. When a Regira import, signature, or
option is unconfirmed, **stop and ask**; do not invent it — verify against `entities.namespaces` /
`entities.signatures` and the committed `dist/**/*.d.ts`.

## Following conventions

Follow the prescribed conventions by default; deviate deliberately, not by defaulting to a remembered
pattern, and declare any **intended deviations** and why. This applies especially to the **build tier**
(`entities.instructions` → _How much to build_) — declare which one and reuse the library data layer and
generic views (`EntityOverview` / `EntityForm`) rather than re-implementing them —
the **per-entity slice / project structure** (`entities.setup` → _Project structure_), and **Bootstrap 5**
styling (`entities.setup` → _Bootstrap — main.ts_). The scaffolded templates are **indicative of
functionality, not appearance** — restructure their markup and layout and restyle them freely; what you
preserve is the wiring (composables, services, DI, plugin order, routing), not the look.

## Code-generation workflow

1. Confirm the target is a Vue 3 SPA (otherwise use the back-end `get_bootstrap_guide`).
2. Choose the entity slices the app needs (one slice per entity).
3. Add `regira_modules` + the known-good dependency set (`entities.setup` → Install). For a new app,
   start from the Vite `vue-ts` template (`npm create vue@latest`).
4. Read `entities.instructions` and `entities.setup` in full (via MCP `get_package`).
5. Scaffold the app shell — `node node_modules/regira_modules/_template/scaffold.mjs --shell` (`--no-auth`
   for a no-auth app) writes `main.ts`, `App.vue`, router, dashboard/navbar, layout, views, `config.json` +
   `app-config.ts` (full source: `entities.shell.template`); then set up the toolchain per `entities.setup` → Install.
6. Scaffold each entity slice with `node node_modules/regira_modules/_template/scaffold.mjs <Entity>`
   (add `--no-auth` for a no-auth app), then customize the `(c)` files; consult `entities.namespaces` / `entities.signatures` for exact
   imports/signatures and `entities.patterns` for recipes.
7. Verify with `npm run build` (`vue-tsc -b`).
