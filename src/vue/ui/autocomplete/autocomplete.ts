import { ref, computed, watch, onMounted, onUnmounted, type Ref, type StyleValue } from "vue"
import { useEventListener } from "../../vue-helper"
import { debounceToPromise } from "../../../utilities/promise-utility"
import { getAbsScrollPosition } from "../../../utilities/html-utility"

type IDefaultKey = number | string
type IOffset = { top: number; left: number }
type IResultStyle = StyleValue & { visibility: string; top?: string; left?: string; transform?: string; width: string }

export interface AutocompleteEmits<T = any, TKey = IDefaultKey | T> {
    (e: "update:modelValue", args: T | undefined): void
    (e: "update:idValue", args: TKey | undefined): void
    (e: "select", args: T | undefined): void
    (e: "qInput", args: string): void
}
export interface AutocompleteProps<T = any, TKey = IDefaultKey | T> {
    idValue?: TKey
    modelValue?: T
    data?: Array<T>
    maxResults?: number
    debounceTime?: number
    enableDblClick?: boolean
    autoSelect?: boolean
    allowFreeInput?: boolean

    resultClass?: string
    itemsClass?: string
    itemClass?: string

    search?(term?: string): Promise<Array<T>>
    idSelector?(item?: T): TKey | undefined
    /** converts an item to its display string (input value + default result rendering) */
    displayItemFormatter?(item?: T): string
}
export type AutocompleteSlots<T = any> = {
    /** result-item rendering seam; the fallback renders the display string with the matched term in bold */
    default?(props: { item: T; q: string }): any
}
export const autocompleteDefaults = {
    data: () => [],
    maxResults: 10,
    debounceTime: 250,
    autoSelect: false,
}
export type AutocompleteOut<T = any, TKey = IDefaultKey | T> = {
    q: Ref<string>
    selectedItem: Ref<T | undefined>
    selectedIndex: Ref<number>
    selectedId: Ref<TKey | undefined>
    items: Ref<Array<T> | undefined>
    isOpen: Ref<boolean>
    isFocus: Ref<boolean>
    isLoading: Ref<boolean>
    inputEl: Ref<(HTMLElement & { value: string }) | undefined>
    resultOffset: Ref<IOffset>
    resultStyle: Ref<IResultStyle>
    displayItemFormatter(item?: T): string
    handleInput(): void
    handleChange(): void
    handleSelect(item: T, index: number): void
    handleSearch(term?: string): void
    openResults(): void
    closeResults(): void
    closeGently(e?: PointerEvent): void
    moveSelection(step: number): void
    checkMatch(): void
    clearSelection(): void
    reset(): void
}

export function useAutocomplete<T = any, TKey = IDefaultKey | T>(
    props: AutocompleteProps<T, TKey>,
    { emit }: { emit: AutocompleteEmits<T, TKey> }
): AutocompleteOut<T, TKey> {
    const q = ref("")
    const selectedIndex = ref(-1)
    const items = ref(props.data) as Ref<Array<T> | undefined>
    const isOpen = ref(false)
    const isFocus = ref(false)
    const isLoading = ref(false)
    const selectedItem = computed({
        get: () => props.modelValue,
        set: (value) => {
            if (props.modelValue !== value) {
                emit("update:modelValue", value)
                emit("update:idValue", idSelector(value))
                emit("select", value)
            }
        },
    })
    const selectedId = computed<TKey | undefined>(() => idSelector(selectedItem.value))
    const inputEl = ref<(HTMLElement & { value: string }) | undefined>()
    const containerOffset = ref<IOffset>({ top: 0, left: 0 })
    const resultOffset = ref<IOffset>({ top: 0, left: 0 })
    const scrollPosition = ref<IOffset>({ top: 0, left: 0 })
    const resultStyle = computed<IResultStyle>(() => {
        const { width, height } = inputEl.value?.getBoundingClientRect() || { width: 0, height: 0 }
        return {
            visibility: isOpen.value ? "visible" : "hidden",
            top: `${height}px`,
            left: `${inputEl.value?.offsetLeft || 0}px`,
            width: `${width}px`,
        }
    })

    const idSelector = props.idSelector || ((item?: T): TKey | undefined => item as TKey)
    const displayItemFormatter = props.displayItemFormatter || ((item?: T) => (item ?? "").toString())

    async function dataItemsSearch(term = "") {
        return props.data?.filter((x) => displayItemFormatter(x).toLowerCase().startsWith(term.toLowerCase()))
    }

    async function handleSearch(term = q.value): Promise<void> {
        openResults()
        isLoading.value = true
        items.value = undefined
        try {
            const searchResult = await debouncedSearch(term)
            const pageSize = props.maxResults || searchResult.length
            items.value = searchResult.slice(0, pageSize)
            selectedIndex.value = (items.value as Array<T>)?.findIndex((x) => idSelector(x) == idSelector(selectedItem.value))
        } finally {
            isLoading.value = false
        }
    }
    function checkMatch(allowAutoSelect: boolean = false): void {
        // check (and set selection automatically) if the input value corresponds with a value in the results
        if (selectedItem.value == null && items.value) {
            const matches = (items.value as Array<T>)?.filter(
                (item) => (displayItemFormatter(item)?.toString() || "").toLowerCase() === q.value?.toLowerCase()
            )
            if (matches.length == 1) {
                setSelection(matches[0])
            } else if (allowAutoSelect && props.autoSelect) {
                setSelection(items.value[0])
            }
        }
    }
    function handleInput(): void {
        clearSelection()
        handleSearch()
    }
    function handleChange(): void {
        // checkMatch() // disabled since it is called on blur and would interfere with clicking on results
        // emit select triggered automatically in selectedItem setter
    }
    function handleSelect(item: T, index: number): void {
        closeResults()
        setSelection(item, item ? index : -1)
    }
    function setSelection(item?: T, index?: number): void {
        if (item == null && index == null) {
            clearSelection()
            if (!q.value) {
                closeResults()
            }
            return
        }
        if (item && (index == null || index < 0)) {
            index = ((items.value as Array<T>) || []).indexOf(item)
        } else if (!item && index! >= 0) {
            item = (items.value as Array<T>)[index!]
        }
        if (item != null) {
            // set q to the corresponding value for the resulting item
            selectedIndex.value = index!
            selectedItem.value = item // setter will emit update:modelValue
            q.value = displayItemFormatter(selectedItem.value) // use selectedItem after emit in case selection is cleared immediately in event handler
        }
    }
    function moveSelection(step: number): void {
        console.debug("moveSelection", { step, selectedIndex: selectedIndex.value, items: items.value })
        const newSelectedIndex = selectedIndex.value + step
        const newSelectedItem = (items.value as Array<T>)[newSelectedIndex]
        if (newSelectedIndex >= 0 && newSelectedIndex < (items.value as Array<T>).length) {
            setSelection(newSelectedItem, newSelectedIndex)
        }
    }
    function clearSelection(): void {
        selectedIndex.value = -1
        selectedItem.value = undefined
    }
    function reset(): void {
        q.value = ""
        clearSelection()
        closeResults()
    }
    function getAbsOffset(element?: HTMLElement): IOffset {
        let top = 0,
            left = 0

        do {
            top += element?.offsetTop || 0
            left += element?.offsetLeft || 0
            element = element?.offsetParent as HTMLElement
        } while (element)

        return {
            top: top,
            left: left,
        }
    }
    function openResults(): void {
        updateContainerOffset()
        isOpen.value = true
    }
    function closeResults(): void {
        isOpen.value = false
    }
    function closeGently(): void {
        if (!isOpen.value) {
            return
        }

        setTimeout(() => {
            // clear visible input if no selection was made
            checkMatch(true)
            if (selectedItem.value == null) {
                q.value = ""
            }

            closeResults()
        }, 250)
    }

    function throwError<TReturn>(err: Error): TReturn {
        throw err
    }

    // search
    const search = props.search || (props.data && dataItemsSearch) || throwError<() => void>(new Error("prop search or data is required"))
    const debouncedSearch = debounceToPromise(search as (...args: unknown[]) => Promise<T[] | undefined>, props.debounceTime) as unknown as (
        term: string
    ) => Promise<Array<T>>

    const updateContainerOffset = () => {
        containerOffset.value = getAbsOffset(inputEl.value)
        scrollPosition.value = inputEl.value ? getAbsScrollPosition(inputEl.value) : { top: 0, left: 0 }
    }
    const debouncedUpdateContainerOffset = debounceToPromise(updateContainerOffset, 50) as unknown as () => Promise<void>

    useEventListener(window, "resize", debouncedUpdateContainerOffset)
    onMounted(() => {
        q.value = displayItemFormatter(selectedItem.value)
        updateContainerOffset()
        document.addEventListener("scroll", debouncedUpdateContainerOffset, true)
    })
    onUnmounted(() => {
        document.removeEventListener("scroll", debouncedUpdateContainerOffset, true)
    })
    watch(selectedItem, (newVal, oldVal) => {
        if (newVal != oldVal && newVal != selectedItem.value) {
            setSelection(newVal)
        }
        if (newVal) {
            q.value = displayItemFormatter(selectedItem.value)
        }
    })
    watch(q, () => emit("qInput", q.value || ""))

    return {
        q,
        selectedItem,
        selectedIndex,
        selectedId,
        items,
        isOpen,
        isFocus,
        isLoading,
        inputEl,
        resultOffset,
        resultStyle,
        displayItemFormatter,
        handleInput,
        handleChange,
        handleSelect,
        handleSearch,
        openResults,
        closeResults,
        closeGently,
        moveSelection,
        checkMatch,
        clearSelection,
        reset,
    }
}
