# Regira UI (front-end)

`regira_modules/vue/ui` — the UI toolkit the [entity views](../entities/README.md) render with:
components, composables, and plugins for paging, loading, feedback, modal, tabs, icons, autocomplete,
form inputs, and responsive layout.

## Areas

| Area         | Components                                                                                                                                                            | Programmatic                                                |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| paging       | `Paging`, `ResultSummary`                                                                                                                                             | `usePaging`, `pagingDefaults`, `ButtonType`, `pagingPlugin` |
| loading      | `Loading`, `LoadingContainer`, `LoadingButton`                                                                                                                        | `loadingPlugin`                                             |
| feedback     | `Feedback`, `Pending`, `Success`, `ErrorSummary`                                                                                                                      | `useFeedback`, `FeedbackStatus`, `feedbackPlugin`           |
| modal        | `DefaultModal`                                                                                                                                                        | `ModalType`, `modalPlugin`, `injectModal`                   |
| tabs         | `TabContainer`, `TabNavigation`                                                                                                                                       | `Tab` / `ITab`                                              |
| icons        | `BsIcon`, `FaIcon`, `IconButton`                                                                                                                                      | `iconPlugin`, `loadIcons`                                   |
| screen       | —                                                                                                                                                                     | `useScreen`, `screenPlugin`                                 |
| autocomplete | `Autocomplete`                                                                                                                                                        | `useAutocomplete`                                           |
| buttons      | `ConfirmButton`                                                                                                                                                       | —                                                           |
| input        | `Anchor`, `DateInput`, `DescriptionInput`, `FormButtonsRow`, `FormLabel`, `FormSection`, `NullableCheckBox`, `NullableLabel`, `FileDropZone`, `CopyToClipboardButton` | —                                                           |
| gis          | `GMap`, `GMapLink`, `GMapButton` (Google Maps)                                                                                                                        | —                                                           |

## Plugins & imports

Components are **imported locally** from `regira_modules/vue/ui` (or a sub-path) by default — no
component is registered globally. The whole kit works **à la carte**: any component or composable drops
into any Vue 3 app on its own, with no entity scaffold, no plugin stack, and no other module required —
lean and headless builds included. Import the library styles once in `main.ts`:

```ts
import "regira_modules/style.css" // modal backdrop, autocomplete dropdown, …
```

Install the plugins for the areas you use; each configures app-wide state only:

- `feedbackPlugin` → `$feedback` · `screenPlugin` → `$screen`
- `iconPlugin` → glyph source (`bs`/`fa`) + friendly icon keys, `$icons`
- `loadingPlugin` → the image `Loading`/`LoadingContainer` render (a built-in spinner when there is none) ·
  `pagingPlugin` → `Paging` page size

To opt back into app-wide registration, set `configureGlobals({ registerComponentsGlobally: true })`
(from `regira_modules/vue/ioc`) **before** installing the plugins. With the flag on, `iconPlugin`
registers `Icon`/`IconButton`, `loadingPlugin` registers `Loading`/`LoadingButton`/`LoadingContainer`,
`pagingPlugin` registers `Paging`, and `modalPlugin` registers `MyModal` — so those tags resolve
without local imports. Each of these plugins takes matching component options (e.g.
`loadingPlugin { Loading? }`, `pagingPlugin { Paging? }`, compile-checked against the props contract)
that swap what gets registered — and `loadingPlugin { Loading }`, like `modalPlugin { Modal }`, also
swaps the indicator inside library components via `injectLoading()`.

`Icon` works without `iconPlugin` (defaults to Bootstrap glyphs) and `DefaultModal` needs no plugin; the
glyph **font CSS** (`bootstrap-icons`/Font Awesome) must be imported separately. `Icon` takes a registered
friendly key or a raw icon class. Most-used in entity UIs: `Paging`, `LoadingContainer`, `Feedback`,
`TabContainer` + `Tab.create`, `Icon`, and `useScreen`.

## Customizing the look

The default styling is deliberately plain Bootstrap 5 — restyling is encouraged and expected. Five
layers, cheapest first:

1. **Theme tokens** — override the `--rg-*` CSS variables (+ Bootstrap component-level vars) in the
   app's `theme.scss`, loaded after `regira_modules/style.css`.
2. **CSS hooks** — every component carries stable `rg-*` root/part classes and `is-*` state classes.
3. **Slots** — typed via each component's exported `XxxSlots`.
4. **Replace the skin** — a new SFC declaring the exported contract (`XxxProps`/`XxxEmits`/`XxxSlots`)
   with behavior from the exported `useXxx` composable; the modal swaps app-wide via
   `app.use(modalPlugin, { Modal })` — every library-internal modal resolves it through `injectModal()`.
5. **Eject** — `node node_modules/regira_modules/_template/scaffold.mjs --ui <Component>` copies the
   reference skin into the app, imports rewritten to public API.

## Notes

- The barrel `regira_modules/vue/ui` re-exports everything; `feedback`, `icons`, and `modal` also have
  dedicated sub-paths for extra exports (e.g. `FeedbackError`/`FeedbackIn`, the modal `style.scss`).
- Modal is a component (`DefaultModal` + `:is-visible` — one-way, flip your own state on
  `@close`/`@cancel`/`@submit`), not an `openModal()` composable; for entity edit-in-modal use
  `useModal` from the entities module.
