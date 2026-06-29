# Regira UI (front-end)

`regira_modules/vue/ui` — the UI toolkit the [entity views](../entities/README.md) render with:
components, composables, and plugins for paging, loading, feedback, modal, tabs, icons, autocomplete,
form inputs, and responsive layout.

## Areas

| Area         | Components                                                                                                                                                            | Programmatic                                      |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| paging       | `Paging`, `ResultSummary`                                                                                                                                             | `pagingDefaults`, `ButtonType`, `pagingPlugin`    |
| loading      | `Loading`, `LoadingContainer`, `LoadingButton`                                                                                                                        | `loadingPlugin`                                   |
| feedback     | `Feedback`, `Pending`, `Success`, `ErrorSummary`                                                                                                                      | `useFeedback`, `FeedbackStatus`, `feedbackPlugin` |
| modal        | `DefaultModal`                                                                                                                                                        | `ModalType`, `modalPlugin`                        |
| tabs         | `TabContainer`                                                                                                                                                        | `Tab` / `ITab`                                    |
| icons        | `BsIcon`, `FaIcon`, `IconButton`                                                                                                                                      | `iconPlugin`, `loadIcons`                         |
| screen       | —                                                                                                                                                                     | `useScreen`, `screenPlugin`                       |
| autocomplete | `Autocomplete`                                                                                                                                                        | `useAutocomplete`                                 |
| buttons      | `ConfirmButton`                                                                                                                                                       | —                                                 |
| input        | `Anchor`, `DateInput`, `DescriptionInput`, `FormButtonsRow`, `FormLabel`, `FormSection`, `NullableCheckBox`, `NullableLabel`, `FileDropZone`, `CopyToClipboardButton` | —                                                 |
| gis          | `GMap`, `GmapLink`, `ModalButton` (Google Maps)                                                                                                                       | —                                                 |

## Plugins & globals

Install the plugins for the areas you use. Each registers its globals app-wide, so reference them directly
in any template:

- `feedbackPlugin` → `$feedback` · `screenPlugin` → `$screen`
- `iconPlugin` → `Icon` (= `BsIcon`/`FaIcon`), `IconButton`, `$icons`
- `loadingPlugin` → `Loading`, `LoadingButton`, `LoadingContainer` · `pagingPlugin` → `Paging`
- `modalPlugin` → `MyModal`

The global `Icon` takes a registered friendly key or a raw icon class; the glyph font CSS
(`bootstrap-icons`/Font Awesome) must be imported separately. Most-used in entity UIs: `Paging`,
`LoadingContainer`, `Feedback`, `TabContainer` + `Tab.create`, `Icon`, and `useScreen`.

## Notes

- The barrel `regira_modules/vue/ui` re-exports everything; `feedback`, `icons`, and `modal` also have
  dedicated sub-paths for extra exports (e.g. `Pending`/`Success`, `IIconProvider`, the modal `style.scss`).
- Modal is a component (`DefaultModal` + `v-model:is-visible`), not an `openModal()` composable; for
  entity edit-in-modal use `useModalForm` from the entities module.

## Reference

Exact signatures, component props, and worked examples are in the AI guides:
[ai/ui.instructions.md](ai/ui.instructions.md), [ai/ui.signatures.md](ai/ui.signatures.md),
[ai/ui.examples.md](ai/ui.examples.md) — also served by the Regira MCP server as `regira_modules.vue.ui`
(use `list_types` / `get_type` for any component prop not in the guides).
