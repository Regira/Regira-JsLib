# Regira JsLib UI — AI Agent Instructions

The front-end UI toolkit (`regira_modules/vue/ui`): the Vue components, composables, and plugins the
[entity views](../../entities/ai/entities.instructions.md) render with — paging, loading, feedback,
modal, tabs, icons, autocomplete, form inputs, and a reactive screen helper.

> **Never guess** a prop, emit, or signature — verify in [ui.signatures.md](ui.signatures.md) (programmatic
> API + key component props) or via the MCP source map (`list_types`/`get_type` on `regira_modules.vue.ui`).
> Worked usage: [ui.examples.md](ui.examples.md).

## Import

Everything is re-exported from the barrel; three areas also have dedicated sub-paths for their extra
exports:

```ts
import { Paging, LoadingContainer, useFeedback, TabContainer, Tab, BsIcon, useScreen } from "regira_modules/vue/ui"
import { Pending, Success, ErrorSummary, type FeedbackError } from "regira_modules/vue/ui/feedback"
import { type IIconProvider, type IconProps } from "regira_modules/vue/ui/icons"
import { DefaultModal } from "regira_modules/vue/ui/modal" // + "regira_modules/vue/ui/modal/style.scss"
```

## Plugins (install once at startup)

Each plugin installs its globals once at startup. The components it registers are then global app-wide —
reference them directly in any template (a local `app.component(...)` for the same name is redundant).

| Plugin           | Globals it registers                                                   | Options                                          |
| ---------------- | ---------------------------------------------------------------------- | ------------------------------------------------ |
| `feedbackPlugin` | `$feedback` (`FeedbackOut`) — app-wide toasts                          | `{ autoHideDelay? }`                             |
| `iconPlugin`     | `Icon` (= `BsIcon`/`FaIcon`), `IconButton`; `$icons` (`IIconProvider`) | `{ icons?, clearFirst?, source?: "bs" \| "fa" }` |
| `loadingPlugin`  | `Loading`, `LoadingButton`, `LoadingContainer`                         | `{ img }`                                        |
| `modalPlugin`    | `MyModal` (defaults to `DefaultModal`)                                 | `{ DefaultModal? }` (override)                   |
| `pagingPlugin`   | `Paging`                                                               | `{ defaultPageSize? }`                           |
| `screenPlugin`   | `$screen` (`IScreen`) — reactive breakpoints                           | —                                                |

`$feedback`, `$icons`, `$screen` are typed on Vue's `ComponentCustomProperties`.

## Areas

| Area         | Key components                                                                                                                                                        | Programmatic                                                     |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| paging       | `Paging`, `ResultSummary`                                                                                                                                             | `pagingDefaults`, `ButtonType`, `pagingPlugin`                   |
| loading      | `Loading`, `LoadingContainer`, `LoadingButton`                                                                                                                        | `loadingPlugin`                                                  |
| feedback     | `Feedback`, `Pending`, `Success`, `ErrorSummary`                                                                                                                      | `useFeedback`, `FeedbackStatus`, `feedbackPlugin`, `FeedbackOut` |
| modal        | `DefaultModal`                                                                                                                                                        | `ModalType`, `modalPlugin`                                       |
| tabs         | `TabContainer`                                                                                                                                                        | `Tab` / `ITab`                                                   |
| icons        | `BsIcon`, `FaIcon`, `IconButton`                                                                                                                                      | `iconPlugin`, `loadIcons`, `IIconProvider`                       |
| screen       | —                                                                                                                                                                     | `useScreen`, `SCREEN_SIZES`, `screenPlugin`                      |
| autocomplete | `Autocomplete`                                                                                                                                                        | `useAutocomplete`, `autocompleteProps`, `autocompleteEmits`      |
| buttons      | `ConfirmButton`                                                                                                                                                       | —                                                                |
| input        | `Anchor`, `DateInput`, `DescriptionInput`, `FormButtonsRow`, `FormLabel`, `FormSection`, `NullableCheckBox`, `NullableLabel`, `FileDropZone`, `CopyToClipboardButton` | —                                                                |
| gis          | `GMap`, `GMapLink`, `GMapButton` (Google Maps)                                                                                                                        | —                                                                |

## What the entity views use

- **`Paging`** — `v-model="pagingInfo"` (`IPagingInfo`) + `:count="itemsCount"`; emits `change`. Pair with
  the overview composables (see entities).
- **`LoadingContainer`** — wraps content; `:is-loading="isLoading"`.
- **`Feedback`** — `:feedback="feedback"` (the `FeedbackOut` returned by the overview/form composables);
  or use the global `$feedback` / `useFeedback()` for app-wide messages.
- **`TabContainer`** + `Tab.create(...)` — multi-tab forms.
- **`Icon`** (= `BsIcon`/`FaIcon`) — give it a registered friendly key (`config.icon` per entity) or a raw
  icon class; seed friendly keys via `iconPlugin`.
- **`useScreen()`** — responsive layout (`screen.isLarge`, …) to switch form layouts.

## Composables

- `useFeedback({ autoHideDelay? })` → `FeedbackOut` (`status`, `message`, `error`, `pending/success/fail/reset`).
- `useScreen()` → `{ size, screen }` where `screen` exposes `isSmall`…`isExtraExtraLarge`, `layout`, `isSize`.
- `useAutocomplete(props, { emit })` → search/select state for building a custom autocomplete (the
  `Autocomplete` component already wraps it).

> `usePaging` is internal to `Paging.vue` and not exported — use the `Paging` component.

## Gotchas

- **Icon name resolution.** The global `Icon` renders a registered friendly key (`new`, `search`, …) via
  the seeded map, and renders a raw class (`bi bi-grid`, `fa-solid fa-user`) directly when given one;
  `source` (`"bs"`/`"fa"`) selects which glyph set `iconPlugin` seeds. The glyph **font CSS** is separate —
  import it (`bootstrap-icons`/Font Awesome) or every glyph stays blank.
- **Modal is a component, not a composable.** There is no `openModal()` here — use `DefaultModal` with
  `:is-visible` (one-way; it has no `update:isVisible` emit) plus `@close`/`@cancel` to flip your own state
  (and import its `style.scss`). For entity edit-in-modal, use `useModal` from
  the [entities](../../entities/ai/entities.signatures.md) module.
- **`Feedback` needs a `FeedbackOut`** — pass the one from a composable (`useFeedback()` or an
  overview/form composable), not a string.
- **Sub-path exports.** `Pending`/`Success`/`ErrorSummary`, `IIconProvider`/`IconProps`, and the modal
  `style.scss` come from the `/feedback`, `/icons`, `/modal` sub-paths, not the main barrel.

## See also

- [ui.signatures.md](ui.signatures.md) · [ui.examples.md](ui.examples.md)
- [Entities](../../entities/ai/entities.instructions.md) — the main consumer of these components
