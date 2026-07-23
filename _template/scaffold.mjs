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
//                       must already be scaffolded — the column imports from its barrel.
//   --dir <path>        target base folder for a slice (default: src/entities) or an ejected skin (default: src/components/ui)
//   --owns <Child>      also scaffold an editable owned-collection sub-slice (a `_deleted`-marked scalar-row
//                       table via useOwnedCollection) under the entity, for a back-end `e.Related(...)` child.
//                       Repeatable. PascalCase, e.g. --owns OrderLine --owns OrderNote. Works on an existing
//                       slice too: only the sub-slice files are generated then.
//   --as <fieldName>    the parent field / JSON key for the --owns right before it (default: camelCase plural
//                       of the child class, OrderLine → orderLines). Must match the back-end navigation's
//                       camelCase JSON key. Place it directly after its --owns: --owns Row --as orderRows
//   --shell             scaffold the app shell (toolchain, main.ts, App.vue, config, router, dashboard/navbar, layout, views) into the app root
//   --ui <Component>    copy a UI-kit component's reference skin into the app for free restyling; the copy
//                       imports only public regira_modules/... API, so behavior keeps flowing from the library
//   --attachments       scaffold the shared entity-attachments slice (offline add/rename/remove + drop zone,
//                       committed on the parent's save); then wire it into each file-owning entity (3 lines + a tab)
//   --no-auth           strip the auth wiring (slice: reload hooks; shell: auth plugins/UI + the auth-only files)
//   --force             overwrite files that already exist (--shell / --ui / --attachments only — never an
//                       entity slice; slices hold hand-edited (c) files and need the explicit flag below)
//   --overwrite-slice   overwrite an existing entity slice (or owned sub-slice), customized (c) files
//                       included — destructive, deliberate opt-in
//
// Examples:
//   node .../scaffold.mjs Category --plural categories
//   node .../scaffold.mjs PartyRelationshipType --api relationship-types
//   node .../scaffold.mjs Intervention --rel Vehicle --rel Supplier
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

// --owns/--as pairs, in argv order (--as names the parent field of the --owns right before it).
// Check the flag BEFORE the value: a missing value must be reported, not silently skipped — a dropped
// --as means the default field name and a back-end that silently ignores the unknown JSON key on save.
const owns = []
for (let i = 0; i < argv.length; i++) {
    if (argv[i] !== "--owns" && argv[i] !== "--as") continue
    const value = argv[i + 1]
    const hasValue = !!value && !value.startsWith("--")
    if (argv[i] === "--owns") {
        if (!hasValue) {
            console.error("✗ --owns requires a PascalCase child class name (e.g. --owns OrderLine).")
            process.exit(1)
        }
        owns.push({ child: value, field: undefined })
    } else if (!owns.length) {
        console.error(`! --as ${hasValue ? value : ""} ignored — place it directly after the --owns it applies to.`)
    } else if (!hasValue) {
        console.error("✗ --as requires a field name (the back-end navigation's camelCase JSON key, e.g. --as orderLines).")
        process.exit(1)
    } else {
        owns[owns.length - 1].field = value
    }
}

// --rel <Entity>: a to-one relation displayed in the overview. Generates the documented form — the related
// entity's FormModalButton beside a label resolved through its store's pool — rather than describing it.
// A raw nested DTO has no $title at all, and item.rel.title is a snapshot that goes stale the moment the
// related entity is edited anywhere else; both are the mistakes this exists to pre-empt.
// The value must look like a class name, or the next flag gets consumed as one: `--rel --no-auth` would
// otherwise scaffold a relation named "--no-auth" importing from an "--no-auths" slice.
const rels = argv.flatMap((a, i) => (a === "--rel" ? [argv[i + 1]] : []))
if (rels.some((rel) => !/^[A-Z][A-Za-z0-9]*$/.test(rel ?? ""))) {
    console.error("✗ --rel requires a PascalCase related class name (e.g. --rel Vehicle).")
    process.exit(1)
}
// The import alias mirrors the target folder: `--dir src/modules` must emit "@/modules/...", not the
// default "@/entities/...", or the generated slice cannot resolve its imports.
const aliasRoot = baseDir.replace(/\\/g, "/").replace(/^\.?\/?src\//, "").replace(/\/+$/, "")
const relations = rels.map((rel) => ({
    name: rel,
    field: lowerFirst(rel),
    folder: lowerFirst(kebab(pluralize(rel))),
    key: lowerFirst(rel),
    alias: `@/${aliasRoot}/${lowerFirst(kebab(pluralize(rel)))}`,
}))
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
const relationBlocks = {
    // overview/ListItem.vue
    cells: relations
        // both the button and the label take the pooled instance — a raw nested DTO has no $title, and an
        // edit made through the button's own modal must relabel this cell without a reload
        .map((r) => `        <div class="col d-none d-md-block text-truncate">\n            <${r.name}Button :model-value="get${r.name}(item.${r.field})" /> {{ get${r.name}(item.${r.field})?.$title }}\n        </div>`)
        .join("\n"),
    imports: relations
        .map((r) => `import { FormModalButton as ${r.name}Button, useEntityStore as use${r.name}Store } from "${r.alias}"`)
        .join("\n"),
    stores: relations.map((r) => `const { fromPool: get${r.name} } = use${r.name}Store()`).join("\n"),
    // overview/List.vue — headers mirror the cells 1:1
    headers: relations.map((r) => `            <div class="col d-none d-md-block">{{ $t("${r.key}") }}</div>`).join("\n"),
    // data/Entity.ts — the FK and the nested relation, so the generated column type-checks as scaffolded.
    // Barrels export the model as `Entity`, hence the alias.
    modelImports: relations.map((r) => `import { type Entity as ${r.name} } from "${r.alias}"`).join("\n"),
    fields: relations
        .map((r) => `    ${r.field}Id?: number\n    ${r.field}?: ${r.name} // populated only when the request asks for it: baseQueryParams.includes`)
        .join("\n"),
}
function applyRelations(relPath, text) {
    if (!relations.length) return text
    switch (relPath.replace(/\\/g, "/")) {
        case "config/config.ts":
            // Without the includes the API returns no nested relation and every generated column renders blank.
            // "All" is the safe universal default: the generic EntityIncludes enum accepts only Default/All, so
            // emitting a relation name here would 400 at runtime ("The value '<Rel>' is not valid").
            return text.replace(
                /\{ includes: \[\] \}[^\r\n]*/,
                '{ includes: ["All"] }, // "All" loads every nested relation; an entity that exposes a named [Flags] includes enum can replace it with specific member names, e.g. ["Bar"]'
            )
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
            writeFileSync(dst, content)
        }
    }
}

if (!sliceExists || overwriteSlice) {
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
                ? `  Relation column for ${r.name}: reads item.${r.field} (baseQueryParams.includes "${r.name}" — must match the API's [Flags] enum, or the cell stays blank); add the "${r.key}" translation key.`
                : `  ! Relation column for ${r.name} imports from ${relDir}, which does not exist yet — scaffold that slice or vue-tsc will fail.`
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
    const childFolder = lowerFirst(pluralize(childName.toLowerCase())) // OrderLine → orderlines (folder / route / import path — lowercase)
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
    const childSubst = (s) =>
        s
            .replace(/__Children__/g, ChildrenPascal)
            .replace(/__Child__/g, childName)
            .replace(/__children__/g, childField)
            .replace(/__Parent__/g, name)
            .replace(/__parent__/g, camelSingular)
    mkdirSync(childDest, { recursive: true })
    for (const entry of readdirSync(ownedSrcRoot, { withFileTypes: true })) {
        if (entry.isDirectory()) continue // owned-slice is flat
        writeFileSync(resolve(childDest, entry.name), childSubst(readFileSync(join(ownedSrcRoot, entry.name), "utf8")))
    }
    const p = (f) => join(baseDir, plural, f)
    console.log(`✓ Owned collection ${childName} → ${join(baseDir, plural, childFolder)} (editable table)`)
    console.log(`  Wire it into the ${name} slice (the editor is generated; these three lines connect it):`)
    console.log(`    1. ${p("data/Entity.ts")}         field   ${childField}?: Array<${childName}>   // import { type Entity as ${childName} } from "../${childFolder}"`)
    console.log(`       ⚠ the field name must match the back-end navigation's JSON key (camelCase), not the child class name — pass --as <fieldName> if they differ`)
    console.log(`    2. ${p("details/Form.vue")}       render  <${childName}Overview v-model="item.${childField}" />   // import { ${childName}Overview } from "../${childFolder}"`)
    console.log(`    3. ${p("data/EntityService.ts")}  prepareItem   item.${childField} = item.${childField}?.filter((x) => !x._deleted) || []`)
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
    const AUTH_ONLY = new Set(["src/infrastructure/user-plugin.ts", "src/shims.d.ts", "src/views/AccountView.vue"])
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
            writeFileSync(dest, applyShellVariant(readFileSync(abs, "utf8"), noAuth))
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
    console.log(`    1. data/Entity.ts         field    attachments?: Array<EntityAttachment>   // import { type Entity as EntityAttachment } from "../../entity-attachments"`)
    console.log(`    2. data/EntityService.ts  override insert/update via insertWithAttachments/updateWithAttachments; prepareItem drops _deleted attachments`)
    console.log(`    3. details/Form.vue       tab      <template #files><EntityAttachments v-model="item.attachments" /></template>   // import { Overview as EntityAttachments } from "../../entity-attachments"`)
    console.log(`    4. setup.ts               register new EntityService(useAxios(), config)   // import { useAxios } from "regira_modules/vue/http" — the file-owning service requires an AxiosWithFilesInstance; the default sp.get<AxiosInstance>("axios") registration will not compile`)
    console.log(`    5. public/data/translations.json  the shell template ships "files" and "addNewFile(s)" (literal key, parentheses included) in English — add the other languages from config.json → langs; apps scaffolded before these keys existed must add both`)
    console.log(`    back-end: register the owner's files (WithAttachments + HasAttachments<>); the service ctor takes an AxiosWithFilesInstance.`)
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
                      resolved through its pool). Repeatable; the related slice must already be scaffolded
  --dir <path>        target base folder (slice default: src/entities; ejected skin default: src/components/ui)

Owned collections (a back-end e.Related(...) child):
  --owns <Child>      also scaffold an editable owned-collection sub-slice. Repeatable, PascalCase, e.g.
                      --owns OrderLine. Works on an existing slice too (only the sub-slice is generated then)
  --as <fieldName>    parent field / JSON key for the --owns right before it (default: camelCase plural of the
                      child class, OrderLine → orderLines). Must match the back-end navigation's JSON key

Modes & shared flags:
  --shell             scaffold the app shell (toolchain, main.ts, App.vue, config, router, dashboard, layout, views)
  --ui <Component>    copy a UI-kit component's reference skin for free restyling (--ui list lists them)
  --attachments       scaffold the shared entity-attachments slice, then wire it into each file-owning entity
  --no-auth           strip the auth wiring (slice: reload hooks; shell: auth plugins/UI + the auth-only files)
  --force             overwrite files that already exist (--shell / --ui / --attachments only — never a slice)
  --overwrite-slice   overwrite an existing entity slice or owned sub-slice, customized (c) files included
  -h, --help          show this reference and exit

Examples:
  scaffold.mjs Category --plural categories
  scaffold.mjs PartyRelationshipType --api relationship-types
  scaffold.mjs Intervention --rel Vehicle --rel Supplier
  scaffold.mjs Order --owns OrderLine --as lines
  scaffold.mjs --shell --no-auth
  scaffold.mjs --ui DefaultModal`)
}
