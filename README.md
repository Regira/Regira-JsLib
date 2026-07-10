# Regira Modules

`regira_modules` — the Regira front-end library: TypeScript and Vue 3 building blocks (entities/CRUD,
http, ioc, auth, ui, formatters, …) that pair with the Regira back-end packages.

## Documentation

**Start here (AI agents):** the [front-end consumer bootstrap](src/bootstrap/ai/frontend.bootstrap.md)
(`get_package id="regira_modules" section="frontend.bootstrap"`) is the routing entry for building a Vue 3
SPA against a Regira.Entities API; it points into the per-module guides below.

**Vue modules**

| Module | Developer docs | AI guides |
|--------|----------------|-----------|
| Entities (Vue CRUD client) | [src/vue/entities](src/vue/entities/README.md) | [src/vue/entities/ai](src/vue/entities/ai) |
| HTTP (shared axios + helpers) | [src/vue/http](src/vue/http/README.md) | [src/vue/http/ai](src/vue/http/ai) |
| IoC (service container) | [src/vue/ioc](src/vue/ioc/README.md) | [src/vue/ioc/ai](src/vue/ioc/ai) |
| Auth (JWT bearer auth) | [src/vue/auth](src/vue/auth/README.md) | [src/vue/auth/ai](src/vue/auth/ai) |
| UI (components & plugins) | [src/vue/ui](src/vue/ui/README.md) | [src/vue/ui/ai](src/vue/ui/ai) |
| App (lifecycle & culture) | [src/vue/app](src/vue/app/README.md) | [src/vue/app/ai](src/vue/app/ai) |
| Lang (i18n) | [src/vue/lang](src/vue/lang/README.md) | [src/vue/lang/ai](src/vue/lang/ai) |
| Formatters | [src/vue/formatters](src/vue/formatters/README.md) | [src/vue/formatters/ai](src/vue/formatters/ai) |
| Directives | [src/vue/directives](src/vue/directives/README.md) | [src/vue/directives/ai](src/vue/directives/ai) |
| Online (connectivity) | [src/vue/online](src/vue/online/README.md) | [src/vue/online/ai](src/vue/online/ai) |
| Debug | [src/vue/debug](src/vue/debug/README.md) | [src/vue/debug/ai](src/vue/debug/ai) |
| Vue Helper (composition helpers) | [src/vue/vue-helper](src/vue/vue-helper/README.md) | [src/vue/vue-helper/ai](src/vue/vue-helper/ai) |

**Core (framework-agnostic)**

| Module | Developer docs | AI guides |
|--------|----------------|-----------|
| Utilities | [src/utilities](src/utilities/README.md) | [src/utilities/ai](src/utilities/ai) |
| Extensions | [src/extensions](src/extensions/README.md) | [src/extensions/ai](src/extensions/ai) |
| TreeList | [src/treelist](src/treelist/README.md) | [src/treelist/ai](src/treelist/ai) |
| Events | [src/events](src/events/README.md) | [src/events/ai](src/events/ai) |
| IO (file/image helpers) | [src/io](src/io/README.md) | [src/io/ai](src/io/ai) |

**For AI agents — the Regira MCP server.** The hosted server at `https://mcp.regira.com/mcp` serves the
front-end modules alongside the back-end packages. Connect it once and the agent can discover and read
the guides on demand (front-end ids look like `regira_modules.vue.entities`):

```json
{ "mcpServers": { "regira": { "url": "https://mcp.regira.com/mcp", "transport": "http" } } }
```

Front-end consumers should start at the **front-end consumer bootstrap** —
`get_package id="regira_modules" section="frontend.bootstrap"` — then follow its reading order. From
there, use `list_packages` (filter `vue` or `frontend`), `get_package`, and `get_example`. Each documented
module ships an `ai/module.json` (catalog metadata) plus `ai/*.md` guides; the knowledge builder reads
them and the committed `dist/**/*.d.ts` for an exact API map.

> Consuming the library (git install + Vite/TypeScript alias) is covered under **git import** below.

## Updating

```bash
npx npm-check-updates
npx npm-check-updates -u

npm install

npm audit fix
```

## publish

*Increase (major/minor/patch) version*
```bash
npm version patch --no-git-tag-version
npm version minor --no-git-tag-version
npm version major --no-git-tag-version
```

```bash
npm run build
```

## git import

https://github.com/Regira/Regira-JsLib

*package.json*
```json
  "dependencies": {
    "regira_modules": "github:Regira/Regira-JsLib"
  }
```

*vite.config.ts*
```ts
  resolve: {
    alias: [
      // order is important!
      { find: "@/regira_modules", replacement: fileURLToPath(new URL("./node_modules/regira_modules/dist", import.meta.url)) },
      { find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) },
    ]
  }
```

*tsconfig.app.json*
```json
  "compilerOptions": {
    "paths": {
      "@/regira_modules/*": ["./node_modules/regira_modules/dist/*"],
      "@/*": ["./src/*"]
    },
  }
```

## symlinks (legacy)

```bash
mklink /J "regira_modules" "C:\Projects\Regira\Regira-JsLib\src"
```

*vite.config.ts*
```ts
  // ...
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    preserveSymlinks: true
  },
  // ...
  server: {
    fs: {
      allow: [
        "C:/Projects/Regira" // add to enable symlink...
      ]
    }
  }
```
