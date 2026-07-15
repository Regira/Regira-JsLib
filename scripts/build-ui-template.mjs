#!/usr/bin/env node
// Generates _template/ui/** — ejectable copies of the UI-kit reference skins — from the REAL
// component source in src/ (unlike entity-slice/app-shell, which are generated from the ai docs).
//
// Each ejected file gets its relative imports rewritten to public `regira_modules/...` specifiers,
// so the copy stays wired to library behavior (composables, contract types) across upgrades.
// A relative import without a public mapping FAILS the build: an ejectable skin may only depend
// on public API — this doubles as architecture enforcement for the headless split.
//
//   node scripts/build-ui-template.mjs        (also runs as part of `npm run build`)

import { readFileSync, writeFileSync, mkdirSync, rmSync } from "fs"
import { resolve, dirname, join, posix } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")
const srcRoot = resolve(root, "src")
const outRoot = resolve(root, "_template", "ui")

// ------------------------------------------------------------------ manifest
// name  → scaffold.mjs --ui <name>
// dir   → source folder (relative to src/)
// files → copied verbatim-with-rewrites; imports between files of the same set stay relative
// styles→ co-located scss copied along (side-effect import rewritten to the new file name)
// note  → wiring hint printed by scaffold.mjs after ejecting
const MANIFEST = [
    {
        name: "DefaultModal",
        dir: "vue/ui/modal",
        files: ["DefaultModal.vue"],
        styles: { "style.scss": "DefaultModal.scss" },
        note: 'register your copy app-wide: app.use(modalPlugin, { Modal }) — it swaps every modal, including the ones inside library components',
    },
    {
        name: "Paging",
        dir: "vue/ui/paging",
        files: ["Paging.vue", "PagingButton.vue", "PagingAnchor.vue"],
        note: "import your copy instead of regira_modules/vue/ui Paging (behavior stays in the exported usePaging)",
    },
    {
        name: "Autocomplete",
        dir: "vue/ui/autocomplete",
        files: ["Autocomplete.vue"],
        styles: { "style.scss": "Autocomplete.scss" },
        note: "import your copy instead of the library Autocomplete; requires the v-click-outside directive (directives plugin, part of the shell)",
    },
    {
        name: "Feedback",
        dir: "vue/ui/feedback",
        files: ["Feedback.vue"],
        note: "import your copy instead of the library Feedback (status/message state stays in useFeedback)",
    },
    {
        name: "ConfirmButton",
        dir: "vue/ui/buttons",
        files: ["ConfirmButton.vue"],
        note: "import your copy instead of the library ConfirmButton",
    },
    {
        name: "FormButtonsRow",
        dir: "vue/ui/input",
        files: ["FormButtonsRow.vue"],
        note: "import your copy instead of the library FormButtonsRow",
    },
    {
        name: "FileDropZone",
        dir: "vue/ui/input",
        files: ["FileDropZone.vue"],
        note: "import your copy instead of the library FileDropZone",
    },
    {
        name: "Tabs",
        dir: "vue/ui/tabs",
        files: ["TabContainer.vue", "TabNavigation.vue"],
        note: "import your TabContainer copy instead of the library one (hash-route nav ships in its props: use-route-nav)",
    },
    {
        name: "LoginForm",
        dir: "vue/auth",
        files: ["LoginForm.vue"],
        note: "slot your copy into LoginModal's default slot (behavior stays in useLoginForm)",
    },
    {
        name: "ChangePasswordForm",
        dir: "vue/auth",
        files: ["ChangePasswordForm.vue"],
        note: "import your copy instead of the library ChangePasswordForm (behavior stays in useChangePasswordForm)",
    },
    {
        name: "ResetPasswordForm",
        dir: "vue/auth",
        files: ["ResetPasswordForm.vue"],
        note: "import your copy instead of the library ResetPasswordForm (behavior stays in useResetPasswordForm)",
    },
    {
        name: "InputSelectorInline",
        dir: "vue/entities/form",
        files: ["InputSelectorInline.vue"],
        note: "import your copy instead of regira_modules/vue/entities InputSelectorInline",
    },
]

// -------------------------------------------------- public-specifier mappings
// key: import path resolved relative to src/ (posix, no extension normalization)
// spec: the public subpath; named: the barrel export replacing a .vue default import;
// defaultAs: the barrel export replacing a ts module's default import
const MODULE_MAP = {
    "vue/ui/icons/Icon.vue": { spec: "regira_modules/vue/ui", named: "Icon" },
    "vue/ui/icons/IconButton.vue": { spec: "regira_modules/vue/ui", named: "IconButton" },
    "vue/ui/buttons/ConfirmButton.vue": { spec: "regira_modules/vue/ui", named: "ConfirmButton" },
    "vue/ui/feedback/Pending.vue": { spec: "regira_modules/vue/ui", named: "Pending" },
    "vue/ui/feedback/Success.vue": { spec: "regira_modules/vue/ui", named: "Success" },
    "vue/ui/feedback/ErrorSummary.vue": { spec: "regira_modules/vue/ui", named: "ErrorSummary" },
    "vue/ui/modal": { spec: "regira_modules/vue/ui" },
    "vue/ui/modal/modal": { spec: "regira_modules/vue/ui" },
    "vue/ui/paging/paging": { spec: "regira_modules/vue/ui", defaultAs: "usePaging" },
    "vue/ui/autocomplete/autocomplete": { spec: "regira_modules/vue/ui" },
    "vue/ui/feedback": { spec: "regira_modules/vue/ui" },
    "vue/ui/feedback/feedback": { spec: "regira_modules/vue/ui" },
    "vue/ui/tabs/tabs": { spec: "regira_modules/vue/ui" },
    "vue/ui/tabs/Tab": { spec: "regira_modules/vue/ui" },
    "vue/ui/buttons/confirm": { spec: "regira_modules/vue/ui" },
    "vue/ui/input/formButtonsRow": { spec: "regira_modules/vue/ui" },
    "vue/ui/input/fileDropZone": { spec: "regira_modules/vue/ui" },
    "vue/vue-helper": { spec: "regira_modules/vue/vue-helper" },
    "vue/entities/abstractions/PagingInfo": { spec: "regira_modules/vue/entities" },
    "vue/entities/form/inputSelectorInline": { spec: "regira_modules/vue/entities" },
    "vue/auth/useLoginForm": { spec: "regira_modules/vue/auth" },
    "vue/auth/useChangePasswordForm": { spec: "regira_modules/vue/auth" },
    "vue/auth/useResetPasswordForm": { spec: "regira_modules/vue/auth" },
}

// side-effect imports:  import "./style.scss"
const SIDE_EFFECT_RE = /import\s*(["'])([^"']+)\1/g
// clause imports:  import [type] <default>[, { ... }] | { ... } from "..."   (braces may span lines)
const CLAUSE_RE = /import\s+(type\s+)?([\w$]+\s*,\s*\{[\s\S]*?\}|\{[\s\S]*?\}|[\w$]+)\s*from\s*(["'])([^"']+)\3/g

function rewriteImports(content, set, srcFile) {
    const fileDir = posix.dirname(srcFile) // e.g. "vue/ui/paging"
    const setFiles = new Set(set.files)
    const styles = set.styles || {}
    const errors = []

    const resolveSpec = (spec) => posix.normalize(posix.join(fileDir, spec))

    // 1) side-effect imports (styles)
    content = content.replace(SIDE_EFFECT_RE, (full, q, spec, offset, whole) => {
        // skip clause imports — those contain "from" right before the string; handled below
        const before = whole.slice(Math.max(0, offset), offset + full.length)
        if (/from\s*["']/.test(before)) return full
        if (!spec.startsWith(".")) return full
        const base = posix.basename(spec)
        if (styles[base]) return `import ${q}./${styles[base]}${q}`
        errors.push(`${srcFile}: unmapped side-effect import "${spec}"`)
        return full
    })

    // 2) clause imports
    content = content.replace(CLAUSE_RE, (full, typeKw, clause, q, spec) => {
        if (!spec.startsWith(".")) return full // bare specifier (vue, vue-router, ...) — keep
        const target = resolveSpec(spec)
        const baseName = posix.basename(target)
        if (setFiles.has(baseName)) return full // import between files of the same ejected set — keep relative

        const map = MODULE_MAP[target]
        if (!map) {
            errors.push(`${srcFile}: no public mapping for "${spec}" (resolved: ${target})`)
            return full
        }

        // split the clause into default identifier and brace group
        const m = clause.match(/^([\w$]+)?\s*,?\s*(\{[\s\S]*\})?$/)
        const defaultName = m?.[1]
        const braces = m?.[2]
        let inner = braces ? braces.slice(1, -1).trim().replace(/,\s*$/, "") : ""

        if (defaultName) {
            const publicName = map.named ?? map.defaultAs
            if (!publicName) {
                errors.push(`${srcFile}: default import "${defaultName}" from "${spec}" has no public named export mapping`)
                return full
            }
            const imported = publicName === defaultName ? publicName : `${publicName} as ${defaultName}`
            inner = inner ? `${imported}, ${inner}` : imported
        }
        return `import ${typeKw || ""}{ ${inner} } from ${q}${map.spec}${q}`
    })

    if (errors.length) {
        throw new Error("Eject build failed — ejectable skins may only depend on public API:\n  " + errors.join("\n  "))
    }
    return content
}

// ------------------------------------------------------------------ generate
rmSync(outRoot, { recursive: true, force: true })
const index = []
for (const set of MANIFEST) {
    const outDir = join(outRoot, set.name)
    mkdirSync(outDir, { recursive: true })
    const written = []
    for (const file of set.files) {
        const srcFile = posix.join(set.dir, file)
        const content = readFileSync(resolve(srcRoot, srcFile), "utf8")
        writeFileSync(join(outDir, file), rewriteImports(content, set, srcFile))
        written.push(file)
    }
    for (const [from, to] of Object.entries(set.styles || {})) {
        writeFileSync(join(outDir, to), readFileSync(resolve(srcRoot, set.dir, from), "utf8"))
        written.push(to)
    }
    index.push({ name: set.name, files: written, note: set.note })
    console.log(`Ejectable ${set.name} → _template/ui/${set.name} (${written.join(", ")})`)
}
writeFileSync(join(outRoot, "manifest.json"), JSON.stringify(index, null, 4) + "\n")
console.log(`✓ _template/ui generated — ${index.length} ejectable component(s)`)
