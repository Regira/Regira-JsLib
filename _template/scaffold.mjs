#!/usr/bin/env node
// Scaffold a Regira app — one entity slice, the one-time app shell, or an ejected UI skin.
//
//   node node_modules/regira_modules/_template/scaffold.mjs <Entity> [options]   # an entity slice
//   node node_modules/regira_modules/_template/scaffold.mjs --shell [options]    # the app shell (once per app)
//   node node_modules/regira_modules/_template/scaffold.mjs --ui <Component>     # eject a UI-kit reference skin
//   node node_modules/regira_modules/_template/scaffold.mjs --ui list            # list the ejectable components
//
//   <Entity>            PascalCase class name, e.g. Product
//   --plural <name>     route prefix / API path (default: derived — Category → categories, Box → boxes)
//   --singular <name>   singular i18n key (default: lowercased Entity)
//   --dir <path>        target base folder for a slice (default: src/entities) or an ejected skin (default: src/components/ui)
//   --owns <Child>      also scaffold an editable owned-collection sub-slice (a `_deleted`-marked scalar-row
//                       table via useOwnedCollection) under the entity, for a back-end `e.Related(...)` child.
//                       Repeatable. PascalCase, e.g. --owns OrderLine --owns OrderNote
//   --shell             scaffold the app shell (toolchain, main.ts, App.vue, config, router, dashboard/navbar, layout, views) into the app root
//   --ui <Component>    copy a UI-kit component's reference skin into the app for free restyling; the copy
//                       imports only public regira_modules/... API, so behavior keeps flowing from the library
//   --no-auth           strip the auth wiring (slice: reload hooks; shell: auth plugins/UI + the auth-only files)
//   --force             (--shell / --ui) overwrite files that already exist
//
// Examples:
//   node .../scaffold.mjs Category --plural categories
//   node .../scaffold.mjs Order --owns OrderLine
//   node .../scaffold.mjs --shell --no-auth
//   node .../scaffold.mjs --ui DefaultModal

import { readdirSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "fs"
import { resolve, dirname, join, relative } from "path"
import { fileURLToPath } from "url"

const argv = process.argv.slice(2)
const opt = (flag, fallback) => {
    const i = argv.indexOf(flag)
    return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback
}
const noAuth = argv.includes("--no-auth")
const force = argv.includes("--force")
const here = dirname(fileURLToPath(import.meta.url))

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
    console.error("Usage: scaffold.mjs <Entity> [--plural x] [--singular y] [--owns Child] [--dir src/entities]  |  scaffold.mjs --shell [--no-auth]")
    process.exit(1)
}
const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1)
const pluralize = (s) => (/(?:s|x|z|ch|sh)$/i.test(s) ? s + "es" : /[^aeiou]y$/i.test(s) ? s.slice(0, -1) + "ies" : s + "s")
const plural = lowerFirst(opt("--plural", pluralize(name.toLowerCase())))
const singular = lowerFirst(opt("--singular", name.toLowerCase()))
// i18n keys are camelCase (derived from the PascalCase name), unlike the all-lowercase route/folder/api
// identifiers above: ShoppingList → route "shoppinglists" but i18n keys "shoppingLists" / "shoppingList".
// A lowercase i18n key silently renders raw (only a console warning), so keep the word boundaries.
const camelPlural = lowerFirst(pluralize(name))
const camelSingular = lowerFirst(name)
const baseDir = opt("--dir", "src/entities")

const srcRoot = resolve(here, "entity-slice")
const destRoot = resolve(process.cwd(), baseDir, plural)
if (existsSync(destRoot)) {
    console.error(`✗ ${destRoot} already exists — aborting.`)
    process.exit(1)
}

// Replace the camelCase i18n-key placeholders before the lowercase route placeholders (longest-match first).
const subst = (s) =>
    s
        .replace(/__Entity__/g, name)
        .replace(/__entitiesKey__/g, camelPlural)
        .replace(/__entityKey__/g, camelSingular)
        .replace(/__entities__/g, plural)
        .replace(/__entity__/g, singular)
// the auth-coupled lines in Overview.vue / Details.vue: the useAuthStore import + store, the
// $onAction reload hook, and the "no-auth app: delete these two lines" marker comment
const authLine = /useAuthStore|authStore\.\$onAction|no-auth app:/
// Details.vue destructures `load` from useDetails only to feed that hook, so drop it too.
const dropLoad = (line) => (line.includes("useDetails(") ? line.replace(/\bload\s*,\s*/, "").replace(/,\s*load\b/, "") : line)
const stripAuth = (s) => s.split("\n").filter((line) => !authLine.test(line)).map(dropLoad).join("\n")

function copyDir(from, to) {
    mkdirSync(to, { recursive: true })
    for (const entry of readdirSync(from, { withFileTypes: true })) {
        const src = join(from, entry.name)
        const dst = join(to, entry.name)
        if (entry.isDirectory()) copyDir(src, dst)
        else {
            let content = subst(readFileSync(src, "utf8"))
            if (noAuth) content = stripAuth(content)
            writeFileSync(dst, content)
        }
    }
}

copyDir(srcRoot, destRoot)
console.log(`✓ Scaffolded ${name} → ${join(baseDir, plural)}${noAuth ? " (auth hooks stripped)" : ""}`)
// The files you actually edit — everything else is vue-tsc-verified boilerplate you leave untouched.
const customize = ["data/Entity.ts", "config/config.ts", "filter/SearchObject.ts", "filter/FilterAdv.vue", "overview/List.vue", "overview/ListItem.vue", "details/Form.vue", "selecting/SelectorList.vue"]
console.log(`  Customize these ${customize.length} (c) files (a lookup drops the overview trio List/ListItem/FilterAdv):`)
for (const f of customize) console.log(`    · ${join(baseDir, plural, f)}`)
console.log(`  Then register its plugin in ${join(baseDir, "index.ts")} (see the entities setup guide → Add entities).`)

// ------------------------------------------------------------- owned sub-slices
// Each `--owns <Child>` scaffolds an editable owned-collection table under the parent slice.
const owns = argv.filter((a, i) => argv[i - 1] === "--owns" && a && !a.startsWith("--"))
const ownedSrcRoot = resolve(here, "owned-slice")
for (const child of owns) scaffoldOwned(child)

function scaffoldOwned(childName) {
    if (!/^[A-Z]/.test(childName)) {
        console.error(`✗ --owns ${childName}: expected a PascalCase child name, e.g. --owns OrderLine`)
        return
    }
    if (!existsSync(ownedSrcRoot)) {
        console.error(`✗ ${ownedSrcRoot} not found — regira_modules is missing the owned-slice template.`)
        return
    }
    const childFolder = lowerFirst(pluralize(childName.toLowerCase())) // OrderLine → orderlines (folder / route / import path — lowercase)
    const childField = lowerFirst(pluralize(childName)) // OrderLine → orderLines (DTO field — must match the back-end's camelCase JSON)
    const ChildrenPascal = pluralize(childName) // OrderLine → OrderLines (e.Related nav name)
    const childDest = resolve(destRoot, childFolder)
    if (existsSync(childDest)) {
        console.error(`✗ ${childDest} already exists — skipping owned ${childName}.`)
        return
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
    const AUTH_ONLY = new Set(["src/infrastructure/user-plugin.ts", "src/shims.d.ts"])
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
