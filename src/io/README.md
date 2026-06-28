# Regira IO (front-end)

`regira_modules/io` — browser file and image helpers. `FileHelper` normalises a `File`, `Blob`, URL, or
base64 string into a `Blob` and covers browse / download / upload / JSON; `ImageHelper` extends it with
canvas-based image transforms. Both wrap the lower-level [`regira_modules/utilities`](../utilities)
file/image utilities and are DOM-dependent (browser only).

## What it provides

| Export        | Purpose                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FileHelper`  | Class: convert any input to a `Blob`, plus `browse`, `getBase64Url`/`createUrl`, `readJson`/`writeJson`, `send` (multipart), `saveAs` (download). |
| `ImageHelper` | Extends `FileHelper`: `getImage`, `resize`, `rotate`, `flip*`, `convertType`, `getLightness`, `white2transparent`.                                |

Both are named exports; the package root also default-exports `{ FileHelper, ImageHelper }`. Instantiate
per use (`new FileHelper()`, `new ImageHelper()`).

## Reference

Exact signatures, usage notes, and gotchas (the `createUrl` data-URL surprise, `send` not using the
shared axios instance) live in the AI guides: [ai/io.signatures.md](ai/io.signatures.md) and
[ai/io.instructions.md](ai/io.instructions.md), with copy-ready snippets in
[ai/io.examples.md](ai/io.examples.md) — also served by the Regira MCP server as
`regira_modules.io`.
