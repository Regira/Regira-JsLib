# Regira.Entities (back-end) — action plan from front-end build evaluations

## Context

Three end-to-end apps were built on Regira by AI agents using **only** the Regira MCP server and the
shipped instruction files as reference — a Fleet Interventions API+SPA, a Shopping List API+SPA, and a
Webshop API+SPA. Each produced a retrospective. This document consolidates the **back-end
(.NET / `Regira.Entities`) and MCP-server** findings from all three, de-duplicated and prioritized, as a
hand-off for the back-end codebase.

The **front-end (`regira_modules`) counterparts have already been implemented** (see *Already handled*
below); this is the remaining work that lives outside the front-end repo.

> These items come from agent retrospectives, not from inspecting the current back-end source. Validate
> each against the current code and guides before acting — some may already be done. *Evidence* names the
> evaluation(s) that raised it (Fleet / Shopping / Webshop). Priority: **P1** high · **P2** medium · **P3** nice-to-have.

## Top quick wins

1. **Source-encoding note + sample `.editorconfig`** — the only *undocumented* real bug anyone hit (C1).
2. **`AddRange`/seeder helper + a cross-linked seeding recipe** — the single most-repeated gotcha (A1, C5).
3. **`recommend_packages`: disambiguate back-end vs front-end** — it routed a back-end task to FE packages (D1).
4. **Promote four silent footguns to bold/numbered steps** — EF-provider↔TFM, explicit `SaveChanges`,
   `.Abstractions` namespace, `UseHttpsRedirection` vs dev SPA (C2).

## A. Framework code (`Regira.Entities`)

| #  | Item | Evidence | Recommended action | Priority |
|----|------|----------|--------------------|----------|
| A1 | No `AddRange`; seeding ergonomics | all | Add `AddRange(IEnumerable<T>)` (track-only, single `SaveChanges`) and/or a documented `ISeeder`/`EntitySeeder`. Removes the "no AddRange; ids populate at `SaveChanges`; tracker clears after" surprise. | P1 |
| A2 | Dev SPA integration friction | Shopping | Ship an opt-in `app.UseRegiraDevCors()` (allow the Vite origin in Development) or a template flag, so the most common SPA wiring step is one call. | P2 |
| A3 | Free-tier budget invisible until it throws | Fleet | Emit one startup log line: `N simple / M complex registered → tier = free/paid`, so the budget is visible before the limit. | P2 |
| A4 | `IEntityService<TEntity>` resolves only for some overloads | Shopping | Make the bare `IEntityService<TEntity>` resolvable universally, or treat `IEntityService<TEntity,TKey>` as the documented safe resolve for seeding/work outside controllers. | P2 |

## B. Tooling / analyzers

| #  | Item | Evidence | Recommended action | Priority |
|----|------|----------|--------------------|----------|
| B1 | `.For<>()` ↔ controller generic-count mismatch caught only at startup | Shopping | Roslyn analyzer for the "N args → N+2 generics" rule (`.For<TEntity,TKey,TSearch>` ↔ `EntityControllerBase<…>`), flagged at compile time. | P2 |
| B2 | Entity type-name equals a namespace segment | Shopping | Analyzer/lint warning when an entity type name collides with a namespace segment (e.g. `ShoppingList`). | P3 |
| B3 | Assembling the app shell from scattered sections is the slowest step | all | A `create-regira-app` scaffolder or a runnable multi-entity starter (2 entities + a relationship + seeding + `Program.cs` + DI). | P2 |

## C. Documentation / instructions (back-end guides → MCP)

| #  | Item | Evidence | Recommended action | Priority |
|----|------|----------|--------------------|----------|
| C1 | Source-encoding mojibake (UTF-8-without-BOM → Windows-1252 fallback) | Webshop | Prominent note + sample `.editorconfig` (`charset = utf-8-bom`), or guidance to keep source ASCII / use `\uXXXX` / set `<CodePage>`. Currently undocumented. | P1 |
| C2 | Silent footguns buried in prose | all | Promote to **bold, numbered, blocking** steps: (a) pin the EF Core provider major to the TFM (builds clean, crashes on first query); (b) call `SaveChanges()` explicitly when using `IEntityService` directly; (c) the `.Abstractions` controller namespace (`using Regira.Entities.Web.Controllers;` alone is not enough); (d) `UseHttpsRedirection` vs a dev SPA (proxy to the HTTPS origin with `secure:false`, or skip the redirect in Development). | P1 |
| C3 | "Recommended" settings that are really required | Fleet | Promote to *required-when-applicable*: `ReferenceHandler.IgnoreCycles` + `JsonStringEnumConverter` (needed with related entities / enum string-unions); the `AddDbContext((sp, options) => …)` overload (needed for primer/normalizer interceptors). | P1 |
| C4 | Step 0 (simple/complex) and controller pairing are easy to mis-apply | Shopping, Fleet | Render a budget tally inline at Step 0 (e.g. "5 simple + 0 complex = free tier"); inline the controller-pairing table next to each `.For<>()` example. | P2 |
| C5 | Seeding recipe is only in a patterns page | all | Cross-link the seeding recipe from the main entity workflow (loop `Add` → one `SaveChanges`; ids populate on save; tracker clears after). | P1 |
| C6 | "Why is my nested collection empty?" | Shopping, Fleet | Document that `Includes` is load-on-demand for list/search but eager for the Details GET; state clearly whether Details honors `includes`. The #1 empty-array question. | P2 |
| C7 | Transitive advisory with no patched version (NU1903) | Fleet, Shopping | Document the "no fixed version yet" case: how to accept/suppress a transitive advisory, plus the float-up workaround (add an explicit higher `SQLitePCLRaw.bundle_e_sqlite3` to lift the transitive). | P3 |
| C8 | Builder signatures verified by trial | Webshop | A cheat-sheet table: each `.For<>()` overload → available methods + exact lambda arities (e.g. `SortBy` arity differs simple vs complex; the int-key `Related<TRelated>` shortcut). | P2 |
| C9 | Type-name vs namespace collision | Shopping | Named callout: an entity named after a namespace segment (e.g. `ShoppingList` under `ShoppingList.Api`) collides — rename (`ShoppingListEntity`). | P3 |
| C10 | Typed `Prepare` overload is easy to miss | Webshop | Highlight `Prepare(Func<TEntity, TContext, Task>)` (strongly-typed `DbContext`) with a worked example (e.g. auto-pricing order lines). | P3 |

## D. MCP server (`mcp.regira.com`)

| #  | Item | Evidence | Recommended action | Priority |
|----|------|----------|--------------------|----------|
| D1 | `recommend_packages` mis-routes / errors | all | Disambiguate back-end vs front-end from the prompt (it returned front-end `regira_modules.*` for a clearly back-end API task, and errored twice in another run). At minimum ask "API server or browser SPA?". | P1 |
| D2 | Ambiguous short ids | Webshop | `entities` resolves to the front-end `vue.entities`; surface both matches (or require the fully-qualified `Regira.Entities`), and have `get_package_toc` warn on ambiguity. | P2 |
| D3 | Long paginated guides raise discovery cost | all | Add a per-package "must-know in 10 bullets" index card (instructions ≈7 pages, examples ≈14) so an agent can act after one fetch. | P2 |

## Already handled on the front-end (`regira_modules`) — for awareness, no action

- **Lean tier shipped:** generic `EntityOverview` / `EntityForm` (service-driven) plus `FormButtonsRow` /
  `DescriptionInput` / `ResultSummary` are now library exports; the worked examples import them, so a
  copied slice compiles. This answers the "templates are too big / examples don't compile" complaint.
- **`@types/node`** documented for the SPA toolchain (`vue-tsc -b` type-checks `vite.config.ts`).
- The **`*Url` / `searchUrl` resource-base trap** and **`isComplex` branching** are front-end concerns and
  already documented there.
- Front-end vs back-end routing is disambiguated at the top of the front-end bootstrap guide.
