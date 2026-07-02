# Entity slice template

`entity-slice/` is one complete **full-tier** Regira entity slice (data layer + filter + overview + details +
relation pickers + routing/DI). Copy it once per entity to scaffold a new entity instead of hand-writing ~23
files.

## Use it

```bash
# from your app root, with regira_modules installed:
node node_modules/regira_modules/_template/scaffold.mjs Product
# → creates src/entities/products/ with the names filled in
# no-auth app? also strip the auth-store reload hooks:
node node_modules/regira_modules/_template/scaffold.mjs Product --no-auth
```

Or copy by hand and replace the tokens:

```bash
cp -r node_modules/regira_modules/_template/entity-slice src/entities/products
```

| Token          | Replace with                     | Example    |
| -------------- | -------------------------------- | ---------- |
| `__Entity__`   | PascalCase class name            | `Product`  |
| `__entities__` | route prefix / API path (plural) | `products` |
| `__entity__`   | singular i18n key                | `product`  |

Then register the slice's `plugin` in `src/entities/index.ts` (see the entities setup guide → Add entities).

## What to edit

Files carrying real per-entity content are marked **(c)** in the entities template guide: `data/Entity.ts`,
`config/config.ts`, `filter/SearchObject.ts`, `filter/FilterAdv.vue`, `overview/List.vue`,
`overview/ListItem.vue`, `details/Form.vue`, `selecting/SelectorList.vue`. The rest is boilerplate — leave it
as-is. Building without authentication? Scaffold with `--no-auth` — it strips the `useAuthStore` hooks in
`overview/Overview.vue` and `details/Details.vue` (and `load` from `Details.vue`'s `useDetails` destructure,
used only by that hook); for an existing slice, delete those commented lines and drop `load` from the destructure.

> Generated from the AI docs by `scripts/build-entity-template.mjs` — do not edit `entity-slice/` by hand.
