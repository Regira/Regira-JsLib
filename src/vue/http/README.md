# Regira HTTP (front-end)

`regira_modules/vue/http` — the app's single axios instance plus file and query-string helpers. The
[entities client](../entities/README.md) and the auth plugin are both built on this instance.

## What it provides

| Export | Purpose |
|--------|---------|
| `initAxios({ api, includeCredentials })` | Create the shared instance once at startup (`baseURL`, credentials, file helpers, blob-error interceptor). |
| `useAxios()` | Get that singleton anywhere (throws if not yet initialized). |
| `getFile(url, …)` | Download a `Blob`; resolves filename/type from response headers. |
| `upload(url, files, options?)` | `multipart/form-data` upload (field name defaults to `file`). |
| `createQueryString(obj)` | Build `URLSearchParams`; arrays become repeated keys. |
| `AxiosWithFilesInstance` | The augmented axios type (plain axios + `getFile`/`upload`). |

## How it fits

```
initAxios({ api, includeCredentials })  →  one AxiosWithFilesInstance
   ├─ registered in IoC as "axios"      (regira_modules/vue/ioc)
   ├─ bearer interceptor added by       (regira_modules/vue/auth)
   └─ injected into every EntityService (regira_modules/vue/entities)
```

Create exactly one instance and reuse it so credentials and auth apply uniformly. Entity `IConfig.*Url`
values are relative paths resolved against the `baseURL` set here.

## Reference

Exact signatures and worked examples (download, upload, query strings, startup) live in the AI guides:
[ai/http.signatures.md](ai/http.signatures.md), [ai/http.examples.md](ai/http.examples.md),
[ai/http.instructions.md](ai/http.instructions.md) — also served by the Regira MCP server as
`regira_modules.vue.http`.
