#!/usr/bin/env node
// Scaffold a new entity slice from _template/entity-slice into your app.
//
//   node node_modules/regira_modules/_template/scaffold.mjs <Entity> [options]
//
//   <Entity>            PascalCase class name, e.g. Product
//   --plural <name>     route prefix / API path (default: lowercased Entity + "s"), e.g. products
//   --singular <name>   singular i18n key (default: lowercased Entity)
//   --dir <path>        target base folder (default: src/entities)
//   --no-auth           strip the auth-store reload hooks (no-auth app — see entities.setup.md → Running without authentication)
//
// Example:  node node_modules/regira_modules/_template/scaffold.mjs Category --plural categories

import { readdirSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "fs"
import { resolve, dirname, join } from "path"
import { fileURLToPath } from "url"

const argv = process.argv.slice(2)
const name = argv.find((a) => !a.startsWith("--"))
if (!name) {
    console.error("Usage: scaffold.mjs <Entity> [--plural x] [--singular y] [--dir src/entities]")
    process.exit(1)
}
const opt = (flag, fallback) => {
    const i = argv.indexOf(flag)
    return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback
}
const plural = opt("--plural", name.toLowerCase() + "s")
const singular = opt("--singular", name.toLowerCase())
const baseDir = opt("--dir", "src/entities")
const noAuth = argv.includes("--no-auth")

const srcRoot = resolve(dirname(fileURLToPath(import.meta.url)), "entity-slice")
const destRoot = resolve(process.cwd(), baseDir, plural)
if (existsSync(destRoot)) {
    console.error(`✗ ${destRoot} already exists — aborting.`)
    process.exit(1)
}

const subst = (s) =>
    s
        .replace(/__Entity__/g, name)
        .replace(/__entities__/g, plural)
        .replace(/__entity__/g, singular)

// the auth-coupled lines in Overview.vue / Details.vue: the useAuthStore import + store, the
// $onAction reload hook, and the "no-auth app: delete these two lines" marker comment
const authLine = /useAuthStore|authStore\.\$onAction|no-auth app:/
// Details.vue destructures `load` from useDetails only to feed that hook, so drop it too — otherwise
// the stripped file leaves an unused binding. (Overview's `searchHandler` stays: useRouteOverview uses it.)
const dropLoad = (line) => (line.includes("useDetails(") ? line.replace(/\bload\s*,\s*/, "").replace(/,\s*load\b/, "") : line)
const stripAuth = (s) =>
    s
        .split("\n")
        .filter((line) => !authLine.test(line))
        .map(dropLoad)
        .join("\n")

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
