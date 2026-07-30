#!/usr/bin/env node
// Scaffold a Regira app — one entity slice, the one-time app shell, or an ejected UI skin.
//
//   node node_modules/regira_modules/_template/scaffold.mjs <Entity> [options]   # an entity slice
//   node node_modules/regira_modules/_template/scaffold.mjs --shell [options]    # the app shell (once per app)
//   node node_modules/regira_modules/_template/scaffold.mjs --ui <Component>     # eject a UI-kit reference skin
//   node node_modules/regira_modules/_template/scaffold.mjs --ui list            # list the ejectable components
//   node node_modules/regira_modules/_template/scaffold.mjs --attachments        # the shared offline file/attachments slice (once per app)
//
//   <Entity>            PascalCase class name, e.g. Product
//   --plural <name>     slice folder + client route prefix (default: kebab-cased plural — Category →
//                       categories, Box → boxes, InterventionType → intervention-types)
//   --api <path>        API resource path, relative to the axios baseURL (default: /<plural>). Must equal the
//                       server's [Route(...)] exactly; pass it when the two differ, e.g. a
//                       party-relationship-types slice served under --api relationship-types. The leading
//                       slash is optional — omit it under Git Bash, which rewrites /foo into a file path.
//   --singular <name>   singular i18n key (default: kebab-cased Entity)
//   --rel <Entity>      generate an overview column for a to-one relation: the related entity's
//                       FormModalButton + a label resolved through its pool (never the raw nested DTO, which
//                       has no $title, nor item.rel.title, which goes stale). Repeatable. The related slice
//                       must already be scaffolded — the column imports from its barrel, and its folder is
//                       looked up from the scaffolded slices (so a related slice with its own --plural, e.g.
//                       Person --plural people, still resolves). A differently-named FK
//                       takes an optional trailing `--as <field>`: `--rel Employee --as assignedToEmployee`
//                       binds assignedToEmployee(Id) instead of the default employee(Id), still the Employee slice.
//   --dir <path>        target base folder for a slice (default: src/entities) or an ejected skin (default: src/components/ui)
//   --owns <Child>      also scaffold an editable owned-collection sub-slice (a `_deleted`-marked scalar-row
//                       table via useOwnedCollection) under the entity, for a back-end `e.Related(...)` child.
//                       Repeatable. PascalCase, e.g. --owns OrderLine --owns OrderNote. Works on an existing
//                       slice too: only the sub-slice files are generated then.
//   --as <fieldName>    the JSON key for the --owns OR --rel directly before it — must match the back-end
//                       navigation's camelCase key. After --owns: the owned-collection field (default camelCase
//                       plural of the child, OrderLine → orderLines). After --rel: the to-one navigation property
//                       (default camelCase of the class, Employee → employee; its FK is that + Id). Place it right after its --owns/--rel:
//                       --owns Row --as orderRows  /  --rel Employee --as assignedToEmployee
//   --shell             scaffold the app shell (toolchain, main.ts, App.vue, config, router, dashboard/navbar, layout, views) into the app root
//   --ui <Component>    copy a UI-kit component's reference skin into the app for free restyling; the copy
//                       imports only public regira_modules/... API, so behavior keeps flowing from the library
//   --attachments       scaffold the shared entity-attachments slice (offline add/rename/remove + drop zone,
//                       committed on the parent's save); then wire it into each file-owning entity (3 lines + a tab)
//   --no-auth           strip the auth wiring (slice: reload hooks; shell: auth plugins/UI, the auth-only files + config.json keys)
//   --force             overwrite files that already exist (--shell / --ui / --attachments only — never an
//                       entity slice; slices hold hand-edited (c) files and need the explicit flag below)
//   --overwrite-slice   overwrite an existing entity slice (or owned sub-slice), customized (c) files
//                       included — destructive, deliberate opt-in
//
// Examples:
//   node .../scaffold.mjs Category --plural categories
//   node .../scaffold.mjs PartyRelationshipType --api relationship-types
//   node .../scaffold.mjs Intervention --rel Vehicle --rel Supplier
//   node .../scaffold.mjs Task --rel Employee --as assignedToEmployee   # FK assignedToEmployeeId → Employee slice
//   node .../scaffold.mjs Order --owns OrderLine
//   node .../scaffold.mjs Order --owns OrderLine --as lines   # back-end nav `Lines` → JSON key "lines"
//   node .../scaffold.mjs --shell --no-auth
//   node .../scaffold.mjs --ui DefaultModal

import { readdirSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "fs"
import { resolve, dirname, join, relative } from "path"
import { fileURLToPath } from "url"

const argv = process.argv.slice(2)
const opt = (flag, fallback) => {
    const i = argv.indexOf(flag)
    return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback
}
const noAuth = argv.includes("--no-auth")
const force = argv.includes("--force")
const overwriteSlice = argv.includes("--overwrite-slice")
const here = dirname(fileURLToPath(import.meta.url))

// ----------------------------------------------------------------- help / usage
// Checked before every scaffolding path: --help is informational only, never writes files.
if (argv.includes("--help") || argv.includes("-h")) {
    printUsage()
    process.exit(0)
}

// ------------------------------------------------------------------ app shell
if (argv.includes("--shell")) {
    scaffoldShell()
    process.exit(0)
}

// ------------------------------------------------------------ ejected UI skin
if (argv.includes("--ui")) {
    scaffoldUi(opt("--ui"))
    process.exit(0)
}

// -------------------------------------------------- shared attachments slice
if (argv.includes("--attachments")) {
    scaffoldAttachments()
    process.exit(0)
}

function scaffoldUi(component) {
    const uiRoot = resolve(here, "ui")
    if (!existsSync(uiRoot)) {
        console.error(`✗ ${uiRoot} not found — regira_modules is missing the generated ui template.`)
        process.exit(1)
    }
    const manifest = JSON.parse(readFileSync(join(uiRoot, "manifest.json"), "utf8"))
    if (!component || component === "list") {
        console.log("Ejectable UI components (scaffold.mjs --ui <Component>):")
        for (const entry of manifest) console.log(`  · ${entry.name}  (${entry.files.join(", ")})`)
        return
    }
    const entry = manifest.find((e) => e.name.toLowerCase() === component.toLowerCase())
    if (!entry) {
        console.error(`✗ Unknown UI component "${component}" — run --ui list to see what's available.`)
        process.exit(1)
    }
    const targetDir = resolve(process.cwd(), opt("--dir", "src/components/ui"))
    mkdirSync(targetDir, { recursive: true })
    const written = []
    const skipped = []
    for (const file of entry.files) {
        const dest = join(targetDir, file)
        if (existsSync(dest) && !force) {
            skipped.push(file)
            continue
        }
        writeFileSync(dest, readFileSync(join(uiRoot, entry.name, file), "utf8"))
        written.push(file)
    }
    console.log(`✓ Ejected ${entry.name} → ${relative(process.cwd(), targetDir)} (${written.join(", ") || "nothing new"})`)
    if (skipped.length) console.log(`  Skipped existing: ${skipped.join(", ")} (pass --force to overwrite)`)
    console.log(`  Wiring: ${entry.note}`)
    console.log("  The copy is yours — restyle freely; keep the documented contract (props/emits/slots, rg-*/is-* hooks, responsive).")
}

// --------------------------------------------------------------- entity slice
const name = argv.find((a) => !a.startsWith("--"))
if (!name) {
    console.error("Usage: scaffold.mjs <Entity> [options] | --shell | --ui <Component> | --attachments   (run --help for all flags)")
    process.exit(1)
}
// The name becomes a class, so it must be PascalCase — the same rule --rel and --owns enforce.
if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) {
    // Capitalize each word rather than stripping separators: the message is phrased as a runnable command,
    // so a flattened "Shoppinglist" would be copied verbatim and produce the wrong class name.
    const suggestion = name
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("")
    console.error(`✗ <Entity> must be PascalCase (a class name) — received "${name}". Try: scaffold.mjs ${suggestion}`)
    process.exit(1)
}
// A model class shadows a same-named DOM global inside every module that imports the slice barrel. It
// type-checks and usually works (module scope wins), but the failures it does cause are baffling: `(e: Event)`
// in a handler silently resolves to the entity, and `new Location()` reaches the DOM constructor and throws
// "Illegal constructor". The back-end guides already warn about the equivalent entity↔namespace collision.
const DOM_GLOBALS = ["Event", "Location", "Text", "Image", "Range", "Selection", "Notification", "Request", "Response", "Screen", "History", "Node", "Element", "Comment", "Document", "Option", "Attr"]
if (DOM_GLOBALS.includes(name)) {
    console.log(`! "${name}" is also a DOM global. The model class shadows window.${name} inside every module that imports this slice — a handler typed (e: ${name}) resolves to your entity, and new ${name}() can reach the DOM constructor and throw "Illegal constructor".`)
    console.log(`  Prefer a suffixed class name (${name}Item, ${name}Record) and keep the resource, route and i18n keys as they are — renaming later needs --overwrite-slice, which REPLACES the 8 (c) files you authored by then.`)
}
const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1)
const pluralize = (s) => (/(?:s|x|z|ch|sh)$/i.test(s) ? s + "es" : /[^aeiou]y$/i.test(s) ? s.slice(0, -1) + "ies" : s + "s")
// Route/folder identifiers are kebab-case, matching the conventional controller route: InterventionType →
// "intervention-types", which is what [Route("intervention-types")] serves. Flattening to one lowercase word
// would emit "/interventiontypes" and every request 404s.
const kebab = (s) =>
    s
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .toLowerCase()
const plural = lowerFirst(opt("--plural", kebab(pluralize(name))))
const singular = lowerFirst(opt("--singular", kebab(name)))
// The API resource path defaults to the folder name, but the two are separable: the server may expose a
// resource under a different name than the slice is filed under (--api /relationship-types).
const api = opt("--api", `/${plural}`).replace(/^\/*/, "/")
// A POSIX shell on Windows (Git Bash/MSYS) rewrites a leading-slash argument into a filesystem path, so
// `--api /products` silently arrives as `/C:/Program Files/Git/products`. Catch it rather than emit it.
if (/^\/[A-Za-z]:\//.test(api)) {
    console.error(`✗ --api received "${api}" — a POSIX shell on Windows expanded the leading slash. Pass it without one: --api ${api.split("/").pop()}`)
    process.exit(1)
}
// i18n keys are camelCase (derived from the PascalCase name), unlike the kebab-case route/folder/api
// identifiers above: ShoppingList → route "shopping-lists" but i18n keys "shoppingLists" / "shoppingList".
// A lowercase i18n key silently renders raw (only a console warning), so keep the word boundaries.
const camelPlural = lowerFirst(pluralize(name))
const camelSingular = lowerFirst(name)
const baseDir = opt("--dir", "src/entities")

const srcRoot = resolve(here, "entity-slice")
const destRoot = resolve(process.cwd(), baseDir, plural)

// --owns and --rel each accept an optional trailing `--as <field>` that renames the JSON key. Parsed in one
// ordered pass so placement is unambiguous: an `--as` binds to the --owns/--rel whose value token sits
// immediately before it (a misplaced --as is a hard error, like every other bad flag value, never a silent
// default). --owns → the owned-collection field; --rel → the to-one navigation property (its FK is that +Id).
// A --rel value must look like a class name, or the next flag is consumed as one (`--rel --no-auth` would
// otherwise scaffold a relation named "--no-auth"); an --as value must be a camelCase JSON key.
const owns = []
const rels = []
let pending = null // the last --owns/--rel still able to take an `--as`; { set, kind, valueIndex }
for (let i = 0; i < argv.length; i++) {
    const flag = argv[i]
    const value = argv[i + 1]
    const hasValue = !!value && !value.startsWith("--")
    if (flag === "--owns") {
        if (!hasValue) {
            console.error("✗ --owns requires a PascalCase child class name (e.g. --owns OrderLine).")
            process.exit(1)
        }
        const entry = { child: value, field: undefined }
        owns.push(entry)
        pending = { set: (f) => (entry.field = f), kind: "--owns", valueIndex: i + 1 }
    } else if (flag === "--rel") {
        if (!hasValue || !/^[A-Z][A-Za-z0-9]*$/.test(value)) {
            console.error("✗ --rel requires a PascalCase related class name (e.g. --rel Vehicle).")
            process.exit(1)
        }
        const entry = { name: value, field: undefined }
        rels.push(entry)
        pending = { set: (f) => (entry.field = f), kind: "--rel", valueIndex: i + 1 }
    } else if (flag === "--as") {
        if (!pending || pending.valueIndex !== i - 1) {
            console.error("✗ --as must come directly after the --owns or --rel it renames (e.g. --owns OrderLine --as lines, --rel Employee --as assignedToEmployee).")
            process.exit(1)
        }
        if (!hasValue) {
            console.error("✗ --as requires a field name — the back-end navigation's camelCase JSON key (e.g. --as orderLines, --as assignedToEmployee).")
            process.exit(1)
        }
        if (!/^[a-z][A-Za-z0-9]*$/.test(value)) {
            console.error(`✗ --as value "${value}" must be a camelCase JSON key (lower-case first letter), e.g. assignedToEmployee.`)
            process.exit(1)
        }
        if (pending.kind === "--rel" && /Id$/.test(value)) {
            const nav = value.replace(/Id$/, "")
            console.error(`✗ --as after --rel takes the navigation property (${nav}), not its FK (${value}) — the scaffold derives the ${value} FK itself. Drop the trailing "Id".`)
            process.exit(1)
        }
        pending.set(value)
        pending = null // consumed — a second --as here would be misplaced
    }
}

// The owned-collection JSON key — the back-end navigation's camelCase key, defaulting to the camelCase plural
// of the child class. Derived once: the generated prepareItem filter and the sub-slice scaffolder below must
// agree on it, or the filter would clear a field the DTO does not have.
const ownedField = ({ child, field }) => field ?? lowerFirst(pluralize(child))

// The import alias mirrors the target folder: `--dir src/modules` must emit "@/modules/...", not the
// default "@/entities/...", or the generated slice cannot resolve its imports.
const aliasRoot = baseDir.replace(/\\/g, "/").replace(/^\.?\/?src\//, "").replace(/\/+$/, "")
// A --rel's slice folder is looked UP, not re-derived: the related slice may have been scaffolded with its own
// --plural (`Person --plural people` lives in "people"), and re-deriving it emits imports from a folder that
// does not exist. Every generated config.ts carries `key: "<PascalCase class>"`, so the folder holding that
// class is discoverable by scanning <baseDir>/*/config/config.ts. The derived plural stays the fallback for a
// relation that has not been scaffolded yet (the run warns about it below).
const baseDirAbs = resolve(process.cwd(), baseDir)
function findSliceFolder(className) {
    let entries
    try {
        entries = readdirSync(baseDirAbs, { withFileTypes: true })
    } catch {
        return undefined // no base dir yet — nothing to resolve against
    }
    for (const entry of entries) {
        if (!entry.isDirectory()) continue
        const cfg = join(baseDirAbs, entry.name, "config", "config.ts")
        if (!existsSync(cfg)) continue
        try {
            if (new RegExp(`\\bkey:\\s*["']${className}["']`).test(readFileSync(cfg, "utf8"))) return entry.name
        } catch {
            // an unreadable slice config is not fatal — keep scanning, then fall back to the derived plural
        }
    }
    return undefined
}
const relations = rels.map((r) => {
    const folder = findSliceFolder(r.name) ?? lowerFirst(kebab(pluralize(r.name)))
    return {
        name: r.name,
        field: r.field ?? lowerFirst(r.name), // FK binding — `--as` overrides it for a differently-named to-one
        folder,
        key: r.field ?? lowerFirst(r.name), // header i18n key — distinct per role when `--as` renames it
        alias: `@/${aliasRoot}/${folder}`,
    }
})
// The per-ENTITY blocks (imports, store consts, model imports) de-dupe by class name, so two --rel to the
// SAME entity (--rel Employee --as assignedTo --rel Employee --as reportedBy) never emit a duplicate identifier.
const relEntities = [...new Map(relations.map((r) => [r.name, r])).values()]
// Generated content is inserted after a stable line in the template rather than at a placeholder, so the
// doc sources these templates are built from stay readable as worked examples.
const insertAfter = (text, anchor, addition) => {
    if (!addition) return text
    const i = text.indexOf(anchor)
    if (i < 0) return text
    // after the whole line, not the match — anchors are often followed by a trailing comment
    const eol = text.indexOf("\n", i + anchor.length)
    const at = eol < 0 ? text.length : eol
    return text.slice(0, at) + "\n" + addition + text.slice(at)
}
// Relation columns are revealed progressively, widest breakpoint last: every column carrying a .btn costs
// ~4.5rem it cannot shrink below, so revealing them all at md is what overflows a narrow viewport.
const relationBreakpoint = (i) => ["d-none d-md-block", "d-none d-lg-block", "d-none d-xl-block"][Math.min(i, 2)]
const relationBlocks = {
    // overview/ListItem.vue
    cells: relations
        // both the button and the label take the pooled instance — a raw nested DTO has no $title, and an
        // edit made through the button's own modal must relabel this cell without a reload
        .map((r, i) => `        <div class="col ${relationBreakpoint(i)} text-truncate">\n            <${r.name}Button :model-value="get${r.name}(item.${r.field})" /> {{ get${r.name}(item.${r.field})?.$title }}\n        </div>`)
        .join("\n"),
    imports: relEntities
        .map((r) => `import { FormModalButton as ${r.name}Button, useEntityStore as use${r.name}Store } from "${r.alias}"`)
        .join("\n"),
    stores: relEntities.map((r) => `const { fromPool: get${r.name} } = use${r.name}Store()`).join("\n"),
    // overview/List.vue — headers mirror the cells 1:1
    headers: relations.map((r, i) => `            <div class="col ${relationBreakpoint(i)}">{{ $t("${r.key}") }}</div>`).join("\n"),
    // data/Entity.ts — the FK and the nested relation, so the generated column type-checks as scaffolded.
    // Barrels export the model as `Entity`, hence the alias.
    // `import type { … }`, not the inline `import { type … }`: under verbatimModuleSyntax the inline modifier
    // keeps the import STATEMENT at runtime, and --rel is exactly what produces mutually-referencing slices —
    // whose barrels then cycle through store.ts reading Entity.name at module-evaluation time. The erased
    // form costs nothing and cannot cycle. (The failure is dev-server-only; vue-tsc and the build stay green.)
    modelImports: relEntities.map((r) => `import type { Entity as ${r.name} } from "${r.alias}"`).join("\n"),
    fields: relations
        .map((r) => `    ${r.field}Id?: number\n    ${r.field}?: ${r.name} // populated only when the API eager-loads it — e.Includes(...), not a client includes flag`)
        .join("\n"),
}
function applyRelations(relPath, text) {
    if (!relations.length) return text
    // config/config.ts is deliberately NOT rewritten: `baseQueryParams` ships empty from the template, which
    // is right for a --rel run too. A to-one relation shown on every list row belongs in the API's
    // unconditional e.Includes(...) (the back-end guidance), a SIMPLE registration binds no ?includes= at all
    // so anything written here would be inert, and ["All"] on a complex entity drags every gated collection
    // onto every row. Blank fails visibly — an empty label, and the console hint names the fix — rather than
    // silently over-fetching. Keeping one shape for both paths is what stops the tool contradicting itself.
    switch (relPath.replace(/\\/g, "/")) {
        case "overview/ListItem.vue":
            text = insertAfter(text, `<div class="col text-truncate">{{ item.$title }}</div>`, relationBlocks.cells)
            text = insertAfter(text, `import FormModalButton from "../details/FormModalButton.vue"`, relationBlocks.imports)
            return insertAfter(text, `const item = defineModel<Entity>({ required: true })`, relationBlocks.stores)
        case "overview/List.vue":
            return insertAfter(text, `<div class="col">{{ $t("name") }}</div>`, relationBlocks.headers)
        case "data/Entity.ts":
            text = insertAfter(text, `import { EntityBase } from "regira_modules/vue/entities"`, relationBlocks.modelImports)
            return insertAfter(text, `title = ""`, relationBlocks.fields)
        default:
            return text
    }
}

// data/EntityService.ts ships a TODO marker for the owned-collection filter — its source is the entities
// template doc, where it has to read as a worked example. `--owns` knows the real lines, so write them here;
// with nothing owned the marker is dead weight in a file the user is told to leave alone, so drop it.
const OWNED_FILTER_TODO = /^[^\S\r\n]*\/\/ TODO \(owned collections only\):.*\r?\n/m
function applyOwnedCollections(relPath, text) {
    if (relPath.replace(/\\/g, "/") !== "data/EntityService.ts") return text
    const marker = text.match(OWNED_FILTER_TODO)
    if (!marker) {
        console.error(
            '✗ data/EntityService.ts no longer carries the "// TODO (owned collections only):" line this scaffolder rewrites — regenerate _template/entity-slice from the ai docs, or update the anchor in scaffold.mjs.'
        )
        process.exit(1)
    }
    const indent = marker[0].match(/^[^\S\r\n]*/)[0]
    // One filter line per owned collection, in the order the flags were given. No `|| []`: the back-end
    // contract is null = untouched, [] = delete every row, so coalescing an unloaded collection to [] tells
    // the server to delete all of its rows. `?.filter(...)` keeps undefined and still yields [] when the user
    // removed the last row.
    return text.replace(
        OWNED_FILTER_TODO,
        owns.map((o) => `${indent}item.${ownedField(o)} = item.${ownedField(o)}?.filter((x) => !x._deleted)\n`).join("")
    )
}

const sliceExists = existsSync(destRoot)
if (sliceExists && !overwriteSlice && !owns.length) {
    console.error(`✗ ${destRoot} already exists — pass --owns <Child> to add an owned sub-slice to it, or --overwrite-slice to regenerate it (customized (c) files included; --force deliberately does NOT apply to slices).`)
    process.exit(1)
}

// Replace the camelCase i18n-key placeholders before the kebab-case route placeholders (longest-match first).
const subst = (s) =>
    s
        .replace(/__Entity__/g, name)
        .replace(/__entitiesKey__/g, camelPlural)
        .replace(/__entityKey__/g, camelSingular)
        .replace(/__api__/g, api)
        .replace(/__entities__/g, plural)
        .replace(/__entity__/g, singular)
// the auth-coupled lines in Overview.vue / Details.vue: the useAuthStore import + store, the
// $onAction reload hook, and the "no-auth app: delete these two lines" marker comment
const authLine = /useAuthStore|authStore\.\$onAction|no-auth app:/
// Details.vue destructures `load` from useDetails only to feed that hook, so drop it too.
const dropLoad = (line) => (line.includes("useDetails(") ? line.replace(/\bload\s*,\s*/, "").replace(/,\s*load\b/, "") : line)
const stripAuth = (s) => s.split("\n").filter((line) => !authLine.test(line)).map(dropLoad).join("\n")

function copyDir(from, to, rootFrom = from) {
    mkdirSync(to, { recursive: true })
    for (const entry of readdirSync(from, { withFileTypes: true })) {
        const src = join(from, entry.name)
        const dst = join(to, entry.name)
        if (entry.isDirectory()) copyDir(src, dst, rootFrom)
        else {
            let content = subst(readFileSync(src, "utf8"))
            if (noAuth) content = stripAuth(content)
            content = applyRelations(relative(rootFrom, src), content)
            content = applyOwnedCollections(relative(rootFrom, src), content)
            writeFileSync(dst, content)
        }
    }
}

// whether THIS run (re)generated the parent slice's own files — the owned-collection wiring hints below
// differ, since an existing slice keeps the EntityService it already has
const sliceGenerated = !sliceExists || overwriteSlice
if (sliceGenerated) {
    if (sliceExists) {
        console.log(`! ${destRoot} exists — --overwrite-slice: replacing it, customized (c) files included.`)
        // a clean replace, not an overlay — files from an older template generation must not linger
        rmSync(destRoot, { recursive: true, force: true })
    }
    copyDir(srcRoot, destRoot)
    console.log(`✓ Scaffolded ${name} → ${join(baseDir, plural)}${noAuth ? " (auth hooks stripped)" : ""}`)
    // The files you actually edit — everything else is vue-tsc-verified boilerplate you leave untouched.
    const customize = ["data/Entity.ts", "config/config.ts", "filter/SearchObject.ts", "filter/FilterAdv.vue", "overview/List.vue", "overview/ListItem.vue", "details/Form.vue", "selecting/SelectorList.vue"]
    console.log(`  Customize these ${customize.length} (c) files (a lookup drops the overview trio List/ListItem/FilterAdv):`)
    for (const f of customize) console.log(`    · ${join(baseDir, plural, f)}`)
    console.log(`  Then register its plugin in ${join(baseDir, "index.ts")} (see the entities setup guide → Add entities).`)
    console.log(`  Confirm api "${api}" equals the server route — [Route("${api.slice(1)}")] on ${name}Controller. A mismatch 404s every call; re-run with --api <path> to change it.`)
    for (const r of relations) {
        const relDir = join(baseDir, r.folder)
        console.log(
            existsSync(resolve(process.cwd(), relDir))
                ? `  Relation column for ${r.name}: reads item.${r.field} — the API must eager-load it, unconditionally via e.Includes((q, _) => q.Include(x => x.${r.name})) for a to-one shown on every row; add the "${r.key}" translation key.`
                : `  ! Relation column for ${r.name} imports from ${relDir}, which does not exist yet — scaffold that slice or vue-tsc will fail.`
        )
    }
    if (relations.length) {
        console.log(
            `  baseQueryParams is left {} — a relation column blank at runtime means the API is not eager-loading it. Only add includes for a gated COLLECTION, and only member names of the API's NAMED [Flags] enum (an unnamed EntityIncludes accepts just Default/All, and a name it doesn't declare 400s: "The value '<Rel>' is not valid").`
        )
    }
} else {
    console.log(`· ${join(baseDir, plural)} exists — leaving the slice as-is, adding owned sub-slice(s) only.`)
}

// ------------------------------------------------------------- owned sub-slices
// Each `--owns <Child>` scaffolds an editable owned-collection table under the parent slice.
const ownedSrcRoot = resolve(here, "owned-slice")
for (const { child, field } of owns) scaffoldOwned(child, field)

function scaffoldOwned(childName, fieldName) {
    if (!/^[A-Z]/.test(childName)) {
        console.error(`✗ --owns ${childName}: expected a PascalCase child name, e.g. --owns OrderLine`)
        return
    }
    if (!existsSync(ownedSrcRoot)) {
        console.error(`✗ ${ownedSrcRoot} not found — regira_modules is missing the owned-slice template.`)
        return
    }
    const childFolder = kebab(pluralize(childName)) // OrderLine → order-lines (folder / import path — kebab-case, like every other derived path)
    // The DTO field must match the back-end navigation's camelCase JSON key — that follows the C# property
    // name, not the child class name. Default: camelCase plural of the class; pass --as when they differ.
    const childField = fieldName ?? lowerFirst(pluralize(childName)) // OrderLine → orderLines
    const ChildrenPascal = childField.charAt(0).toUpperCase() + childField.slice(1) // the e.Related nav property (JSON key ⇔ PascalCase property)
    const childDest = resolve(destRoot, childFolder)
    if (existsSync(childDest)) {
        if (!overwriteSlice) {
            console.error(`✗ ${childDest} already exists — skipping owned ${childName} (pass --overwrite-slice to overwrite).`)
            return
        }
        rmSync(childDest, { recursive: true, force: true }) // clean replace, like the parent slice
    }
    // __children__ → the camelCase field (the JSON key), NOT the folder; __parent__ → camelCase parent singular
    // (so a `ShoppingList` child FK is `shoppingListId`, matching the server). Folder/import paths use childFolder.
    // __childrenSlug__ → the same field kebab-cased, for markup identifiers (CSS classes): every class name in
    // the templates is kebab-case, so a camelCase one (.shoppingListItems-editor) sticks out as a typo.
    const childSubst = (s) =>
        s
            .replace(/__Children__/g, ChildrenPascal)
            .replace(/__Child__/g, childName)
            .replace(/__childrenSlug__/g, kebab(childField))
            .replace(/__children__/g, childField)
            .replace(/__Parent__/g, name)
            .replace(/__parent__/g, camelSingular)
    // Printed BEFORE the folder exists: once it does, correcting the key needs --overwrite-slice, so a hint
    // that only appears in the wiring list below is a hint you can no longer act on cheaply.
    if (fieldName == null) {
        console.log(`! Owned ${childName}: defaulting its JSON key to "${childField}" — it must match the back-end navigation's camelCase key, which follows the C# property name, not the class name.`)
        console.log(`  If they differ, stop here and re-run with --owns ${childName} --as <fieldName> — correcting it later needs --overwrite-slice, which REPLACES the 8 (c) files you authored by then.`)
    }
    mkdirSync(childDest, { recursive: true })
    for (const entry of readdirSync(ownedSrcRoot, { withFileTypes: true })) {
        if (entry.isDirectory()) continue // owned-slice is flat
        writeFileSync(resolve(childDest, entry.name), childSubst(readFileSync(join(ownedSrcRoot, entry.name), "utf8")))
    }
    const p = (f) => join(baseDir, plural, f)
    const filterLine = `item.${childField} = item.${childField}?.filter((x) => !x._deleted)`
    console.log(`✓ Owned collection ${childName} → ${join(baseDir, plural, childFolder)} (editable table)`)
    console.log(`  Wire it into the ${name} slice (the editor is generated; these ${sliceGenerated ? "two" : "three"} lines connect it):`)
    console.log(`    1. ${p("data/Entity.ts")}         field   ${childField}?: Array<${childName}>   // import type { Entity as ${childName} } from "../${childFolder}"`)
    console.log(`    2. ${p("details/Form.vue")}       render  <${childName}Overview v-model="item.${childField}" />   // import { ${childName}Overview } from "../${childFolder}"`)
    console.log(
        sliceGenerated
            ? `    ✓ ${p("data/EntityService.ts")}  prepareItem   ${filterLine}   // already written by this run — it type-checks as soon as step 1 declares the field`
            : `    3. ${p("data/EntityService.ts")}  prepareItem   ${filterLine}   // add it yourself: the existing service was left untouched`
    )
    console.log(`    back-end: e.Related(x => x.${ChildrenPascal}) on ${name} (owned child — no For<>()/controller/budget slot).`)
}

// -------------------------------------------------------------- app-shell impl
function scaffoldShell() {
    const shellRoot = resolve(here, "app-shell")
    if (!existsSync(shellRoot)) {
        console.error(`✗ ${shellRoot} not found — regira_modules is missing the generated app-shell template.`)
        process.exit(1)
    }
    // auth-only files: omitted entirely on --no-auth
    const AUTH_ONLY = new Set([
        "src/infrastructure/user-plugin.ts",
        "src/shims.d.ts",
        "src/views/AccountView.vue",
        "src/views/ResetPasswordView.vue",
        "src/components/users/ForgotPasswordForm.vue",
    ])
    // ...and the one file whose auth-only bits are DATA, out of reach of applyShellVariant's comment markers
    const AUTH_CONFIG_FILE = "public/config.json"
    const written = []
    const skipped = []

    const walk = (dir) => {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
            const abs = join(dir, entry.name)
            if (entry.isDirectory()) {
                walk(abs)
                continue
            }
            const rel = relative(shellRoot, abs).replace(/\\/g, "/")
            if (noAuth && AUTH_ONLY.has(rel)) continue
            const dest = resolve(process.cwd(), rel)
            if (existsSync(dest) && !force) {
                skipped.push(rel)
                continue
            }
            mkdirSync(dirname(dest), { recursive: true })
            let content = applyShellVariant(readFileSync(abs, "utf8"), noAuth)
            if (noAuth && rel === AUTH_CONFIG_FILE) content = stripAuthConfigKeys(content, rel)
            writeFileSync(dest, content)
            written.push(rel)
        }
    }
    walk(shellRoot)

    console.log(`✓ Scaffolded the app shell — ${written.length} file(s)${noAuth ? " (no-auth)" : ""}`)
    if (skipped.length) {
        console.log(`  Skipped ${skipped.length} existing file(s); pass --force to overwrite:`)
        for (const f of skipped) console.log(`    · ${f}`)
    }
    console.log("  Next: ensure package.json has the known-good dependency set (entities.setup.md → Install),")
    console.log("  then scaffold entities and register them in src/entities/index.ts.")
    console.log("  The layout/navigation components are default implementations, not a prescribed design — restyle them,")
    console.log("  or replace any of them with your own as long as the functionality stays available")
    console.log("  (entities.shell.template.md → Default implementations, not requirements).")
}

// ---------------------------------------------------- attachments slice impl
function scaffoldAttachments() {
    const attRoot = resolve(here, "entity-attachments")
    if (!existsSync(attRoot)) {
        console.error(`✗ ${attRoot} not found — regira_modules is missing the entity-attachments template.`)
        process.exit(1)
    }
    const baseDir = opt("--dir", "src/entities")
    const dest = resolve(process.cwd(), baseDir, "entity-attachments")
    if (existsSync(dest) && !force) {
        console.error(`✗ ${dest} already exists — pass --force to overwrite, or wire the existing slice.`)
        process.exit(1)
    }
    // shared slice: no per-entity tokens, no auth variants — a plain verbatim copy
    const copyPlain = (from, to) => {
        mkdirSync(to, { recursive: true })
        for (const entry of readdirSync(from, { withFileTypes: true })) {
            const s = join(from, entry.name)
            const d = join(to, entry.name)
            if (entry.isDirectory()) copyPlain(s, d)
            else writeFileSync(d, readFileSync(s, "utf8"))
        }
    }
    copyPlain(attRoot, dest)
    console.log(`✓ Scaffolded the attachments slice → ${join(baseDir, "entity-attachments")}`)
    console.log("  Wire it into each entity that owns files (3 lines + a tab + the service registration):")
    console.log(`    1. data/Entity.ts         field    attachments?: Array<EntityAttachment>   // import type { Entity as EntityAttachment } from "../../entity-attachments"`)
    console.log(`    2. data/EntityService.ts  override insert/update via insertWithAttachments/updateWithAttachments; prepareItem drops _deleted attachments`)
    console.log(`    3. details/Form.vue       tab      <template #files><EntityAttachments v-model="item.attachments" /></template>   // import { Overview as EntityAttachments } from "../../entity-attachments"`)
    console.log(`    4. setup.ts               register new EntityService(useAxios(), config)   // import { useAxios } from "regira_modules/vue/http" — the file-owning service requires an AxiosWithFilesInstance; the default sp.get<AxiosInstance>("axios") registration will not compile`)
    console.log(`    5. public/data/translations.json  the shell template ships "files" and "addNewFile(s)" (literal key, parentheses included) in English — add the other languages from config.json → langs; apps scaffolded before these keys existed must add both`)
    console.log(`    back-end: register the owner's files (WithAttachments + HasAttachments<>); the service ctor takes an AxiosWithFilesInstance.`)
}

// public/config.json is DATA, not code: applyShellVariant is comment-marker driven and JSON has no comment
// syntax, so there is nowhere to hang a @auth:only marker and the auth-only keys would ride along into an app
// that deliberately has no auth. Nothing reads them there (main.ts touches them inside the @auth block this
// run deletes), but shipping them is confusing output. Dropped by key below.
//
// Edited as TEXT, not re-stringified: the config is hand-formatted (inline api/navigation objects inside a
// 4-space file) and JSON.stringify would reflow all of it. The edit is then re-parsed and compared against the
// object it should have produced, so anything the text surgery got wrong fails loudly instead of shipping.
function stripAuthConfigKeys(json, file) {
    const AUTH_CONFIG_KEYS = ["clientApp", "loginUrl"]
    let parsed
    try {
        parsed = JSON.parse(json)
    } catch (err) {
        console.error(`✗ ${file} is not valid JSON (${err.message}) — cannot strip its auth-only keys.`)
        process.exit(1)
    }
    const present = AUTH_CONFIG_KEYS.filter((key) => key in parsed)
    if (!present.length) return json
    const expected = { ...parsed }
    for (const key of present) delete expected[key]
    const stripped = json
        .replace(new RegExp(`^[^\\S\\r\\n]*"(?:${present.join("|")})"\\s*:.*\\r?\\n`, "gm"), "")
        .replace(/,(\s*[}\]])/g, "$1") // dropping what happened to be the LAST key leaves a dangling comma
    let after
    try {
        after = JSON.parse(stripped)
    } catch (err) {
        console.error(`✗ dropping ${present.join(" + ")} left ${file} unparseable (${err.message}) — fix the strip in scaffold.mjs.`)
        process.exit(1)
    }
    if (JSON.stringify(after) !== JSON.stringify(expected)) {
        console.error(`✗ dropping ${present.join(" + ")} from ${file} changed more than those keys — fix the strip in scaffold.mjs.`)
        process.exit(1)
    }
    return stripped
}

// Resolve the auth/no-auth variant: keep one tag's marked lines/blocks, drop the other's.
// Markers (comment-syntax agnostic): `@auth:only` / `@noauth:only` (single line),
// `@auth:block-start`…`@auth:block-end` (and the `@noauth:` pair) for multi-line blocks.
function applyShellVariant(content, noAuthVariant) {
    const keep = noAuthVariant ? "noauth" : "auth"
    const drop = noAuthVariant ? "auth" : "noauth"
    const out = []
    let dropping = false
    for (const line of content.split("\n")) {
        if (dropping) {
            if (line.includes(`@${drop}:block-end`)) dropping = false
            continue
        }
        if (line.includes(`@${drop}:block-start`)) {
            dropping = true
            continue
        }
        if (line.includes(`@${drop}:only`)) continue
        if (line.includes(`@${keep}:block-start`) || line.includes(`@${keep}:block-end`)) continue // drop the marker fence, keep its body
        out.push(line.replace(/\s*(?:\/\/|<!--)\s*@(?:no)?auth:only\b.*$/, "")) // strip the kept line's trailing marker comment
    }
    return out.join("\n")
}

// --------------------------------------------------------------------- --help
// The complete flag reference — descriptions kept in sync with the authored header comment above (the short
// usage line printed when <Entity> is missing lists only the modes). Informational: prints and exits, never
// scaffolds. Grouped by command so each flag sits with the path it applies to.
function printUsage() {
    console.log(`Scaffold a Regira app — one entity slice, the one-time app shell, or an ejected UI skin.

Usage:
  scaffold.mjs <Entity> [options]     scaffold an entity slice
  scaffold.mjs --shell [--no-auth]    scaffold the app shell (once per app)
  scaffold.mjs --ui <Component>       eject a UI-kit reference skin  (--ui list to list them)
  scaffold.mjs --attachments          scaffold the shared file/attachments slice (once per app)

Entity slice:
  <Entity>            PascalCase class name, e.g. Product
  --plural <name>     slice folder + client route prefix (default: kebab-cased plural — Category → categories)
  --singular <name>   singular i18n key (default: kebab-cased Entity)
  --api <path>        API resource path relative to the axios baseURL (default: /<plural>). Must equal the
                      server's [Route(...)] exactly; leading slash optional (omit it under Git Bash)
  --rel <Entity>      overview column for a to-one relation (the related entity's FormModalButton + a label
                      resolved through its pool). Repeatable; the related slice must already be scaffolded.
                      A differently-named FK takes a trailing --as <field> (--rel Employee --as assignedToEmployee)
  --dir <path>        target base folder (slice default: src/entities; ejected skin default: src/components/ui)

Owned collections (a back-end e.Related(...) child):
  --owns <Child>      also scaffold an editable owned-collection sub-slice. Repeatable, PascalCase, e.g.
                      --owns OrderLine. Works on an existing slice too (only the sub-slice is generated then)
  --as <fieldName>    JSON key for the --owns OR --rel directly before it — must match the back-end navigation's
                      camelCase key. After --owns: the collection field (default camelCase plural, OrderLine →
                      orderLines). After --rel: the to-one nav property (default camelCase class, Employee → employee)

Modes & shared flags:
  --shell             scaffold the app shell (toolchain, main.ts, App.vue, config, router, dashboard, layout, views)
  --ui <Component>    copy a UI-kit component's reference skin for free restyling (--ui list lists them)
  --attachments       scaffold the shared entity-attachments slice, then wire it into each file-owning entity
  --no-auth           strip the auth wiring (slice: reload hooks; shell: auth plugins/UI, the auth-only files + config.json keys)
  --force             overwrite files that already exist (--shell / --ui / --attachments only — never a slice)
  --overwrite-slice   overwrite an existing entity slice or owned sub-slice, customized (c) files included
  -h, --help          show this reference and exit

Examples:
  scaffold.mjs Category --plural categories
  scaffold.mjs PartyRelationshipType --api relationship-types
  scaffold.mjs Intervention --rel Vehicle --rel Supplier
  scaffold.mjs Task --rel Employee --as assignedToEmployee
  scaffold.mjs Order --owns OrderLine --as lines
  scaffold.mjs --shell --no-auth
  scaffold.mjs --ui DefaultModal`)
}
