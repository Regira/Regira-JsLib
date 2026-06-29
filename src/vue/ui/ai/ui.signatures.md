# Regira JsLib UI — API Signatures Reference

Verbatim TypeScript signatures for `regira_modules/vue/ui`. Do not guess — look up here first. For any
component prop not listed, use the MCP source map (`get_type` on `regira_modules.vue.ui`).

## Plugins

```ts
import { feedbackPlugin, iconPlugin, loadingPlugin, modalPlugin, pagingPlugin, screenPlugin } from "regira_modules/vue/ui"

feedbackPlugin.install(app, { autoHideDelay?: number })
iconPlugin.install(app, { icons?: Record<string, string>; clearFirst?: boolean; source?: "bs" | "fa" })
loadingPlugin.install(app, { img: string })
modalPlugin.install(app, { DefaultModal? })
pagingPlugin.install(app, { defaultPageSize?: number })
screenPlugin.install(app)
```

## Feedback

```ts
import { useFeedback, FeedbackStatus, Feedback, type FeedbackOut } from "regira_modules/vue/ui"
import { type FeedbackError, type FeedbackIn } from "regira_modules/vue/ui/feedback"

export enum FeedbackStatus {
    none = "",
    pending = "Pending",
    success = "Success",
    failed = "Failed",
}
export type FeedbackIn = { autoHideDelay?: number }
export type FeedbackError = string | Record<string, string>
export interface FeedbackOut {
    status: Ref<FeedbackStatus>
    message: Ref<string>
    error: Ref<FeedbackError | null>
    pending(msg: string): void
    success(msg: string): void
    fail(msg: string, ex?: FeedbackError): void
    reset(): void
}
export function useFeedback({ autoHideDelay }?: FeedbackIn): FeedbackOut
// Feedback component props: { feedback: FeedbackOut; hideCloseButton?: boolean; enableErrorPopup?: boolean }
```

## Paging

```ts
import { Paging, ButtonType, pagingDefaults } from "regira_modules/vue/ui"
export enum ButtonType {
    anchor = "Anchor",
    button = "Button",
}
export const pagingDefaults: { maxPages: number; buttonType: ButtonType }
// Paging component:
//   props: { modelValue: IPagingInfo; count: number; maxPages?: number; buttonType?: ButtonType }
//   emits: "update:modelValue" | "change"
```

```ts
import { ResultSummary } from "regira_modules/vue/ui"
// ResultSummary props: { visibleCount?: number; totalCount?: number }   // renders "visible / total"
```

## Loading

```ts
import { Loading, LoadingContainer } from "regira_modules/vue/ui"
// LoadingContainer props: { isLoading: boolean } (+ default slot)
```

## Modal

```ts
import { DefaultModal, ModalType } from "regira_modules/vue/ui/modal" // + "regira_modules/vue/ui/modal/style.scss"
export enum ModalType {
    normal = "Normal",
    success = "Success",
    warning = "Warning",
    danger = "Danger",
}
// DefaultModal:
//   props: { isVisible: boolean; title?: string; showHeader?: boolean; showFooter?: boolean; fullWidth?: boolean; type?: ModalType }
//   emits: "cancel" | "close" | "submit"
//   slots: title, header-close-button, default, buttons, footer-close-button, footer-submit-button
```

## Tabs

```ts
import { TabContainer, Tab, type ITab } from "regira_modules/vue/ui"
export interface ITab {
    key: string
    icon?: string
    title: string
    isDefault: boolean
    isDisabled: boolean
    isVisible: boolean | (() => boolean)
}
export class Tab implements ITab {
    constructor(title: string, key?: string, isDefault?: boolean, isDisabled?: boolean, isVisible?: boolean)
    static create(title: string, values?: object): Tab & object
}
// TabContainer props: { tabs: Array<ITab | string | null>; useRouteNav?: boolean; active?: string } ; emits: "select"
```

## Icons

```ts
import { BsIcon, FaIcon, IconButton, loadIcons, iconPlugin } from "regira_modules/vue/ui"
import { type IIconProvider, type IconProps, type IconSize } from "regira_modules/vue/ui/icons"
export type IconSize = "sm" | "md" | "lg" | "xl"
export type IconProps = { name: string; size?: IconSize }
export type IIconProvider = { add: (key: string, icon: string) => void; source: "bs" | "fa"; map: Map<string, string> }
export function load(icons: Record<string, string> | Array<Array<string>>): void // exported as loadIcons
// BsIcon / FaIcon props: IconProps ; IconButton props: { icon: string; size?: IconSize; type?: "button" | "submit" | "reset" }
```

## Screen

```ts
import { useScreen, screenPlugin } from "regira_modules/vue/ui" // SCREEN_SIZES / IScreen are not re-exported from the barrel
export const SCREEN_SIZES: Record<string, number>
export interface IScreen {
    get size(): number[]
    get isExtraSmall(): boolean
    get isSmall(): boolean
    get isMedium(): boolean
    get isLarge(): boolean
    get isExtraLarge(): boolean
    get isExtraExtraLarge(): boolean
    get layout(): string
    updateSize(newSize: IScreenSize): void
    isSize(size: string): boolean
}
export function useScreen(): { size: Ref<number[]>; screen: IScreen }
```

## Autocomplete

```ts
import { useAutocomplete, autocompleteProps, autocompleteEmits, Autocomplete } from "regira_modules/vue/ui"
// Props<T>: { idValue?, modelValue?, data?, maxResults?, debounceTime?, enableDblClick?, autoSelect?, allowFreeInput?,
//             resultClass?, itemsClass?, itemClass?,
//             search?(term?): Promise<Array<T>>, idSelector?(item?): TKey|undefined,
//             displayItemFormatter?(item?): string, resultItemFormatter?(item?, q?): string }
// Emits<T>: "update:modelValue" | "update:idValue" | "select" | "qInput"
export function useAutocomplete<T = any, TKey = number | string | T>(props, { emit }): AutocompleteOut<T, TKey>
```

## Buttons & input components

```ts
import {
    ConfirmButton,
    DateInput,
    DescriptionInput,
    FormButtonsRow,
    NullableCheckBox,
    FileDropZone,
    Anchor,
    FormLabel,
    FormSection,
    NullableLabel,
    CopyToClipboardButton,
} from "regira_modules/vue/ui"
// ConfirmButton props: { icon?: string; buttonLabel?: string; modalTitle?: string; modalType?: ModalType }
// DateInput props: { modelValue?: string | Date; culture?: string }   (v-model)
// DescriptionInput props: { label?: string; readonly?: boolean }   (v-model: string)
// FormButtonsRow props: { item?: { isArchived?: boolean }; readonly?: boolean; feedback?: unknown; showDelete?: boolean } ; emits: cancel | remove | restore
```

Other input/gis components (`Anchor`, `FormLabel`, `FormSection`, `NullableCheckBox`, `NullableLabel`,
`FileDropZone`, `CopyToClipboardButton`, `GMap`, `GMapLink`, `GMapButton`) — inspect exact props with
`get_type` on `regira_modules.vue.ui`.

## See also

- [ui.instructions.md](ui.instructions.md) · [ui.examples.md](ui.examples.md)
