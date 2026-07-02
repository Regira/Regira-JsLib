#!/usr/bin/env node
// Scaffold a Regira app — one entity slice, or the one-time app shell.
//
//   node node_modules/regira_modules/_template/scaffold.mjs <Entity> [options]   # an entity slice
//   node node_modules/regira_modules/_template/scaffold.mjs --shell [options]    # the app shell (once per app)
//
//   <Entity>            PascalCase class name, e.g. Product
//   --plural <name>     route prefix / API path (default: lowercased Entity + "s")
//   --singular <name>   singular i18n key (default: lowercased Entity)
//   --dir <path>        target base folder for a slice (default: src/entities)
//   --shell             scaffold the app shell (main.ts, App.vue, config, router, dashboard/navbar, layout, views) into the app root
//   --no-auth           strip the auth wiring (slice: reload hooks; shell: auth plugins/UI + the auth-only files)
//   --force             (--shell) overwrite files that already exist
//
// Examples:
//   node .../scaffold.mjs Category --plural categories
//   node .../scaffold.mjs --shell --no-auth

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

// --------------------------------------------------------------- entity slice
const name = argv.find((a) => !a.startsWith("--"))
if (!name) {
    console.error("Usage: scaffold.mjs <Entity> [--plural x] [--singular y] [--dir src/entities]  |  scaffold.mjs --shell [--no-auth]")
    process.exit(1)
}
const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1)
const plural = lowerFirst(opt("--plural", name.toLowerCase() + "s"))
const singular = lowerFirst(opt("--singular", name.toLowerCase()))
const baseDir = opt("--dir", "src/entities")

const srcRoot = resolve(here, "entity-slice")
const destRoot = resolve(process.cwd(), baseDir, plural)
if (existsSync(destRoot)) {
    console.error(`✗ ${destRoot} already exists — aborting.`)
    process.exit(1)
}

const subst = (s) => s.replace(/__Entity__/g, name).replace(/__entities__/g, plural).replace(/__entity__/g, singular)
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
console.log(`  Next: register its plugin in ${join(baseDir, "index.ts")} (see the entities setup guide → Add entities).`)

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
    console.log("  Next: set up the toolchain (vite.config/tsconfig/index.html) per entities.setup.md → Install,")
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
