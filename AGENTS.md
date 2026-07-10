# AGENTS.md

Universal instructions for AI agents in **regira_modules** (Regira front-end library: TypeScript +
Vue 3). Single source of truth for all agents (Claude, Copilot, Codex, …); `CLAUDE.md` and
`.github/copilot-instructions.md` just point here.

## 1. Keep documentation in sync (first priority)

Docs are layered and describe the same modules at different altitudes — keep them consistent.
Edits are **bidirectional**: change one layer, update its counterparts in the same turn.

| You change… | Also update… |
|-------------|--------------|
| `src/<m>/README.md` | that module's `ai/*.md` (matching sections) |
| `src/<m>/ai/*.md` | `src/<m>/README.md`; `ai/module.json` if scope/description changed |
| `src/<m>/docs/*.md` | the module's `ai/*.md` and `README.md` |
| Root `README.md` index | the module set on disk (and vice-versa) |
| A public signature/behavior in `src/**` | every doc layer that documents it — `…signatures.md` must match `dist/**/*.d.ts` |

If a counterpart edit is out of scope, say so explicitly rather than leaving layers inconsistent.

**Write docs in final state, not as a diff.** Don't narrate a history of changes — no changelogs,
"previously…/now…", "fixed", "updated", or migration notes. Update each document as if it had just
been authored cleanly, with no record of prior errors or revisions.

## 2. Layout

- **Core:** `src/{utilities,extensions,treelist,events,io}`. **Vue:** `src/vue/{entities,http,ioc,auth,ui,app,lang,formatters,directives,online,debug}` + `src/vue/vue-helper.ts` (code; its docs live in `src/vue/vue-helper/`).
- Each module: `README.md` (developer docs) + `ai/` = `<m>.instructions.md`, `<m>.signatures.md`, `<m>.examples.md`, `module.json`. Entities adds `namespaces.md`, `patterns.md`, `setup.md`, `template.md`, `shell.template.md`, `advanced.example.md`, a `docs/` folder, and `vue-entities-agent.md` at the module root.
- Root `README.md` indexes all modules; each is published via a `package.json` `exports` subpath (`regira_modules/<m>`).
- `dist/**/*.d.ts` (committed) = authoritative public API.
- **Meta package:** `src/bootstrap/ai/` (`frontend.bootstrap.md` + `module.json`, id `regira_modules`) holds the *front-end consumer bootstrap* — the SPA routing entry the MCP serves as `get_package id="regira_modules" section="frontend.bootstrap"`. Documentation-only: no `src` code, no `package.json` `exports` subpath. Distinct from this `AGENTS.md`/`CLAUDE.md`, which guide agents *working in* this repo.

## 3. Commands

`npm run dev` · `npm run build` (writes `dist/` + `.d.ts`) · `npm run types` · `npm test` (Vitest) ·
`npm run format` (Prettier).

## 4. Conventions

- **Never guess** a signature, import path, or option — verify against `dist/**/*.d.ts` and the module's
  `ai/*.signatures.md`/`namespaces.md`. If unconfirmed, ask; don't invent.
- After changing a public type, rebuild and reconcile `ai/*.signatures.md` with the new `.d.ts`.
- Match local style; import across modules via their `exports` subpath, not deep relative paths;
  run `npm run format` before finishing.
- **Dormant — don't use:** `src/entities/*` (commented-out; use `regira_modules/vue/entities`),
  `src/identity/*` (legacy), and `src/firebase/*` (legacy, undocumented — still exported from the root
  barrel and the `./firebase` subpath, but not part of the documented module set).

## 5. Adding/renaming/removing a module

Update together: `src/<path>/README.md` + `ai/` set (incl. `module.json`), the root `README.md` index,
and `package.json` `exports`.

The `src/bootstrap/ai/` meta package (front-end consumer bootstrap) is the exception: update its `ai/` set
+ the root `README.md` index only — it has **no `package.json` `exports` entry** (not a runtime subpath).

## 6. MCP

`https://mcp.regira.com/mcp` serves these modules; its knowledge builder reads each `ai/*.md` + the
committed `.d.ts`. Stale `ai/*.md`/`module.json` degrades what every agent sees — hence §1.
