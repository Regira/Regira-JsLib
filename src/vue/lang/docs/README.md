# Regira Lang (i18n) (front-end)

`regira_modules/vue/lang` — keyed translation dictionaries, `{param}` interpolation, the `useLang`
composable that holds the active language as reactive state, and a Vue plugin that wires `$t` / `$tm`
global properties. Entity labels and any user-facing strings are translated through this layer.

## What it provides

| Export | Purpose |
|--------|---------|
| `plugin` | `app.use(plugin, { defaultLang, messages })` — set language + load messages, install `$t`/`$tm`. |
| `useLang()` | Shared (singleton) i18n state: `langCode`, `messages`, `translate`, `setLangCode`, `loadMessages`, … |
| `translate(key, values, langCode, formatArgs?)` | Look up a key in a dictionary for a language (falls back to 2-letter prefix). |
| `translateMessage(message, langCode, formatArgs?)` | Translate an inline per-language message (or plain string). |
| `formatText(input, formatArgs)` | Fill `{param}` placeholders, or pass a function to transform the string. |
| `ITranslationMessages` / `ITranslationMessage` | The dictionary and per-language message types. |
| `IFormatInput` | Interpolation args: a value map or a `(input) => string` function. |

## How it fits

```
app.use(plugin, { defaultLang, messages })   →  drives the singleton useLang() state
   ├─ $t(key, args?)   in templates          (gated on async messages loading)
   ├─ $tm(message, args?)                     (inline per-language values, e.g. entity fields)
   └─ useLang().translate / setLangCode       (read/switch language anywhere)
```

`defaultLang` sets both the active and fallback language; `translate` retries the fallback and the
2-letter language prefix (`en-US` → `en`) automatically.

## Reference

Exact signatures and agent guidance live in the AI guides:
[ai/lang.signatures.md](../ai/lang.signatures.md), [ai/lang.instructions.md](../ai/lang.instructions.md),
and [ai/lang.examples.md](../ai/lang.examples.md) for copy-paste basics
— also served by the Regira MCP server as `regira_modules.vue.lang`.
