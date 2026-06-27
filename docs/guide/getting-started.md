# Getting started

`regira_modules` is the Regira front-end library: TypeScript and Vue 3 building blocks
(entities/CRUD, http, ioc, auth, ui, formatters, …) that pair with the Regira back-end packages.

## Install

The library is consumed straight from GitHub (the build output `dist/` is committed, so no
build step runs on install).

```json
// package.json
{
  "dependencies": {
    "regira_modules": "github:Regira/Regira-JsLib"
  }
}
```

Bare subpath imports resolve via the package `exports` map:

```ts
import { EntityServiceBase } from "regira_modules/vue/entities"
import { initAxios } from "regira_modules/vue/http"
```

### Peer dependencies

Pin known-good versions of the peers and install:

```bash
npm install vue@^3.5 vue-router@^5 pinia@^3 axios@^1.16 date-fns@^4 lodash@^4.17.21
npm install
```

> The toolchain needs **Vite 7+** (`vite@^7`, `@vitejs/plugin-vue@^6`, `vue-tsc@^3`) because
> `vue-router@5` requires it. Older `create-vue` defaults (Vite 6 / router 4 / pinia 2) will hit
> peer-resolution errors.

### Optional dev alias

A short alias keeps imports tidy in a consuming app (order matters):

```ts
// vite.config.ts
resolve: {
  alias: [
    { find: "@/regira_modules", replacement: fileURLToPath(new URL("./node_modules/regira_modules/dist", import.meta.url)) },
    { find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) },
  ],
}
```

```json
// tsconfig.app.json
"compilerOptions": {
  "paths": {
    "@/regira_modules/*": ["./node_modules/regira_modules/dist/*"],
    "@/*": ["./src/*"]
  }
}
```

## Where to go next

- **[The module stack](/guide/module-stack)** — what each module does and whether you need it.
- **[Entities reference](/reference/vue-entities/)** — the CRUD client, the most-used module.

## AI agents (MCP) {#ai-agents-mcp}

The hosted Regira MCP server serves these same modules (front-end ids look like
`regira_modules.vue.entities`) alongside the back-end packages. Connect it once and a coding agent
can discover and read the guides on demand:

```json
{ "mcpServers": { "regira": { "url": "https://mcp.regira.com/mcp", "transport": "http" } } }
```

Then use `list_packages` (filter `vue` or `frontend`), `get_package`, and `get_example`.
