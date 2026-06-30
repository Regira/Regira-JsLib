#!/usr/bin/env node
// Scaffold a new entity slice from _template/entity-slice into your app.
//
//   node node_modules/regira_modules/_template/scaffold.mjs <Entity> [options]
//
//   <Entity>            PascalCase class name, e.g. Product
//   --plural <name>     route prefix / API path (default: lowercased Entity + "s"), e.g. products
//   --singular <name>   singular i18n key (default: lowercased Entity)
//   --dir <path>        target base folder (default: src/entities)
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

const srcRoot = resolve(dirname(fileURLToPath(import.meta.url)), "entity-slice")
const destRoot = resolve(process.cwd(), baseDir, plural)
if (existsSync(destRoot)) {
    console.error(`✗ ${destRoot} already exists — aborting.`)
    process.exit(1)
}

const subst = (s) =>
    s.replace(/__Entity__/g, name).replace(/__entities__/g, plural).replace(/__entity__/g, singular)

function copyDir(from, to) {
    mkdirSync(to, { recursive: true })
    for (const entry of readdirSync(from, { withFileTypes: true })) {
        const src = join(from, entry.name)
        const dst = join(to, entry.name)
        if (entry.isDirectory()) copyDir(src, dst)
        else writeFileSync(dst, subst(readFileSync(src, "utf8")))
    }
}

copyDir(srcRoot, destRoot)
console.log(`✓ Scaffolded ${name} → ${join(baseDir, plural)}`)
console.log(`  Next: register its plugin in ${join(baseDir, "index.ts")} (see the entities setup guide → Add entities).`)
