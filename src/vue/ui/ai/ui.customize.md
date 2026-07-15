# Regira JsLib UI — Customization Guide

The built-ins are **deliberately plain Bootstrap 5 — restyling is encouraged and expected.** This guide
is the canonical path to a branded app: five layers, cheapest first. Climb only as high as the design
brief requires; at every layer the functionality is preserved by construction (behavior lives in the
`use*` composables, the exported contract types make replacements compile-checked by `vue-tsc`).

**Rule zero: prefer the provided components.** Reach for a built-in — restyle, wrap, or eject it if the
look doesn't fit — before writing a new component. Write a new component only when no built-in covers
the functionality.

## The five layers

| #   | Layer                   | You change                         | Mechanism                                                                                           |
| --- | ----------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| 0   | **Theme tokens**        | colors, radius, spacing — app-wide | override Bootstrap component vars + `--rg-*` tokens in `src/assets/theme.scss`                      |
| 1   | **CSS restyle**         | one component's look, CSS only     | stable `rg-*` / `is-*` class hooks                                                                  |
| 2   | **Recompose**           | a part of a component              | named/scoped slots (typed via `XxxSlots`)                                                           |
| 3   | **Replace the skin**    | the entire markup                  | new SFC against `XxxProps`/`XxxEmits`/`XxxSlots` + `useXxx`; modal swaps app-wide via `modalPlugin` |
| 4   | **Eject the reference** | start from the shipped markup      | `node node_modules/regira_modules/_template/scaffold.mjs --ui <Component>`                          |

## L0 — Theme tokens

Import order in `main.ts` matters — the app theme comes **after** Bootstrap and the library css:

```ts
import "bootstrap/dist/css/bootstrap.min.css"
import "regira_modules/style.css"
import "@/assets/theme.scss" // the app's theme — always give the app one, even if it starts small
```

Library tokens (shipped in `regira_modules/style.css`, all overridable):

| Token                      | Default                      | Used by                                             |
| -------------------------- | ---------------------------- | --------------------------------------------------- |
| `--rg-accent`              | `var(--bs-primary, #0d6efd)` | free accent slot for app css                        |
| `--rg-accent-bg`           | `rgba(0, 0, 255, 0.1)`       | `.rg-accent-bg` — the normal-type modal header tint |
| `--rg-deleted-bg`          | `rgba(220, 53, 69, 0.25)`    | `.is-deleted` (pending-delete chips/rows)           |
| `--rg-backdrop`            | `rgba(0, 0, 0, 0.5)`         | modal mask                                          |
| `--rg-modal-z`             | `9998`                       | modal mask z-index                                  |
| `--rg-dropdown-z`          | `99999`                      | autocomplete results z-index                        |
| `--rg-dropdown-max-height` | `13rem`                      | autocomplete results                                |
| `--rg-dragging-opacity`    | `0.6`                        | `.is-dragging`                                      |

**The Bootstrap nuance an agent must not get wrong:** apps import _precompiled_ Bootstrap 5.3, whose
component styles read **component-level** vars baked at compile time (`.btn-primary { --bs-btn-bg: #0d6efd }`).
Overriding `:root { --bs-primary: … }` alone recolors almost nothing. Re-theme at the component-var level:

```scss
// src/assets/theme.scss — worked accent swap
:root {
    --rg-accent: #7c3aed;
    --rg-accent-bg: rgba(124, 58, 237, 0.12);
    --bs-link-color-rgb: 124, 58, 237;
    --bs-border-radius: 0.75rem;
}
.btn-primary {
    --bs-btn-bg: var(--rg-accent);
    --bs-btn-border-color: var(--rg-accent);
    --bs-btn-hover-bg: #6d28d9;
    --bs-btn-hover-border-color: #6d28d9;
}
.pagination {
    --bs-pagination-active-bg: var(--rg-accent);
    --bs-pagination-active-border-color: var(--rg-accent);
    --bs-pagination-color: var(--rg-accent);
}
```

Theming belongs in `theme.scss` — never fork or patch the library css.

## L1 — CSS restyle via class hooks

Every built-in carries stable semantic classes alongside the Bootstrap ones. Write plain css against
them in `theme.scss` — no `::v-deep`, no `!important` needed.

- **Root hooks** (`rg-*`): `rg-modal`, `rg-paging`, `rg-autocomplete` (the input), `rg-feedback`,
  `rg-pending`, `rg-success`, `rg-error-summary`, `rg-confirm-button`, `rg-icon`, `rg-icon-button`,
  `rg-loading`, `rg-loading-button`, `rg-loading-container`, `rg-form-label`, `rg-date-input`,
  `rg-nullable-checkbox`, `rg-nullable-label`, `rg-anchor`, `rg-copy-button`, `rg-file-drop-zone`,
  `rg-tab-nav`, `rg-login-form`, `rg-logout-form`, `rg-change-password-form`, `rg-reset-password-form`,
  `rg-lang-selector`.
- **Pre-existing semantic roots** (kept as-is): `entity-overview`, `entity-form`, `input-selector-inline`,
  `details-summary`, `result-summary`, `form-buttons`, `form-section`, `description-input`,
  `tab-container`, `autocomplete-items` / `autocomplete-item`.
- **Part hooks** where inner parts are styling targets: `rg-modal__header` / `rg-modal__body` /
  `rg-modal__footer`, `rg-paging__page`, `rg-feedback__pending` / `rg-feedback__success` /
  `rg-feedback__error` / `rg-feedback__close-button`.
- **State classes** (`is-*`): `is-deleted`, `is-dragging`, `is-selected` (app convention), `.active`
  on the current page.
- Adding a class to a component's **root** needs no prop — Vue class fallthrough:
  `<Paging class="my-pager" …>`. `Autocomplete` additionally takes `resultClass` / `itemsClass` /
  `itemClass` for its detached dropdown parts.

## L2 — Recompose with slots

Slots are typed (`XxxSlots`, visible via `get_type`) — the main seams:

- `DefaultModal`: `title`, `header-close-button{handleClose}`, default, `buttons`,
  `footer-close-button{handleCancel}`, `footer-submit-button{handleClose}`
- `Paging`: `firstPage{page}`, default `{page, route, handleChange}`, `lastPage{page}`
- `Autocomplete`: scoped default `{item, q}` — **the** result-item rendering seam
- `Feedback`: `close-button`, `pending`, `success`, `error`
- `ResultSummary`: default `{visibleCount, totalCount}`
- `ConfirmButton`: `button-content`, `modal`, default (confirm body)
- `LoginModal` / `ForgotPasswordModal`: default `{username}` — replace the whole form
- `EntityOverview`: `toolbar`, `head`, `row{item, remove, reload}`, `paging{page, pageCount, count, setPage}`
- `InputSelectorInline`: `chip{row}`, `selector{add, exclude}`
- `FormSection`: `header{collapsed, showSummary}`, `title`, default, `summary`, `always`

Wrapping is the slot-level alternative: a local component that renders the library one with your
defaults/skin, same props/emits (e.g. an i18n'd `FormButtonsRow`).

## L3 — Replace the skin (contract-first)

A replacement SFC is three lines of wiring plus free markup — behavior arrives from the composable:

```vue
<script setup lang="ts">
import { usePaging, pagingDefaults, type PagingProps, type PagingEmits, type PagingSlots } from "regira_modules/vue/ui"
import { toRefs } from "vue"
import { useVModelField } from "regira_modules/vue/vue-helper"
import type { IPagingInfo } from "regira_modules/vue/entities"

const emit = defineEmits<PagingEmits>()
const props = withDefaults(defineProps<PagingProps>(), { ...pagingDefaults })
defineSlots<PagingSlots>()

const pagingInfo = useVModelField<IPagingInfo>(props, emit)
const { count } = toRefs(props)
const { page, pages, totalPages, pagedRoute, handleChangePage } = usePaging({ pagingInfo, count, maxPages: props.maxPages!, emit })
</script>
<!-- markup is yours — keep the rg-paging root hook and stay responsive -->
```

**The modal swaps app-wide.** `DefaultModal` is the only component with library-internal call sites
(`ConfirmButton`, `ErrorSummary`, `LoginModal`, `ForgotPasswordModal`, gis `ModalButton`); they resolve
it via `injectModal()`. One line in `main.ts` reskins every modal in the app:

```ts
import MyBrandedModal from "@/components/ui/MyBrandedModal.vue"
app.use(modalPlugin, { Modal: MyBrandedModal }) // Modal is compile-checked against ModalProps
```

Everything else is swapped where it's used: consumer-owned scaffolded slices just change an import;
per-entity view components (Overview/Details/Form/Fiche) swap via the `EntityDescriptor` registry.

## L4 — Eject the reference skin

```
node node_modules/regira_modules/_template/scaffold.mjs --ui list
node node_modules/regira_modules/_template/scaffold.mjs --ui DefaultModal   [--dir src/components/ui]
```

Ejectable: `DefaultModal`, `Paging` (incl. button/anchor), `Autocomplete`, `Feedback`, `ConfirmButton`,
`FormButtonsRow`, `FileDropZone`, `Tabs` (container + nav), `LoginForm`, `ChangePasswordForm`,
`ResetPasswordForm`, `InputSelectorInline`.

The copy lands in your app with its imports rewritten to public `regira_modules/...` specifiers, so
behavior (composables, contract types) keeps flowing from the library across upgrades — only the markup
is yours. Edit it freely, then wire it per the printed note (modal: `modalPlugin { Modal }`; others:
import your copy instead of the library one).

## Replacement checklist (MUST)

Types prove a skin _accepts_ the contract; they cannot prove it _fires_ the emits or _renders_ the
slots. Every replacement/ejected skin MUST:

1. Declare the contract: `defineProps<XxxProps>` (+ `xxxDefaults`), `defineEmits<XxxEmits>`,
   `defineSlots<XxxSlots>`; match the reference's `defineExpose` surface (visible in the `.d.ts`).
2. Keep the `rg-*` root/part hooks and `is-*` state classes — they are contractual, so css written at
   L1 survives any reskin.
3. **Stay responsive** unless the user explicitly asks otherwise: Bootstrap grid (`col` + breakpoint
   variants), `d-none d-md-inline` on button labels, `d-none d-md-block` to drop columns on small
   screens, `$screen` for JS-side switches.
4. Render every slot and fire every emit of the contract, per component:
    - **Modal**: render the default slot when `isVisible`; emit `close` on Esc and the header close;
      emit `cancel`/`submit` from the footer actions; honor `showHeader`/`showFooter`/`size`/`fullWidth`/`type`.
    - **Paging**: `v-model` (`update:modelValue`) + `change` with the new `IPagingInfo`; mark the
      active page; keep both anchor (`pagedRoute`) and button modes working.
    - **Autocomplete**: keyboard selection (up/down/enter), debounced search, and the scoped default
      slot for items — all provided by `useAutocomplete`; keep them wired.
    - **Feedback**: render the pending/success/error regions per `FeedbackStatus`; keep the close
      button emitting `close` and resetting.
    - **EntityOverview**: reload on mount; expose `reload`/`setPage`.
    - **Lean/entity forms**: guard against double submits (`saving`/feedback busy state).
5. Group form fields with `FormSection` (+ `FormLabel`, `input-group` icon prefixes) rather than flat
   field lists (SHOULD).

## See also

- [ui.signatures.md](ui.signatures.md) — every contract type, verbatim
- [ui.examples.md](ui.examples.md) — worked branded-modal / ejected-pager / theme examples
- entities [patterns](../../entities/ai/entities.patterns.md) — restyling the scaffolded slices,
  responsive overview layout, tabs for big forms
