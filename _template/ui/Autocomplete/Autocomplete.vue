<template>
    <input
        class="rg-autocomplete"
        autocomplete="__away"
        type="text"
        v-bind="$attrs"
        v-model="q"
        @input="handleInput"
        @focus="handleFocus"
        @dblclick="handleDblClick"
        @blur="handleBlur"
        @change="handleChange"
        @keydown.down="moveSelection(1)"
        @keydown.up="moveSelection(-1)"
        @keydown.enter.prevent="handleSelect(selectedItem!, selectedIndex)"
        ref="inputEl"
    />
    <div class="autocomplete-items bg-white border" :class="resultClass" :style="resultStyle" v-click-outside="handleClickOutside">
        <div class="list-group" :class="itemsClass">
            <div class="loading list-group-item" v-show="isLoading">Loading...</div>
            <div
                v-for="(item, i) in items"
                :key="i"
                @click="handleSelect(item, i)"
                class="autocomplete-item list-group-item list-group-item-action"
                :class="[itemClass, { 'bg-light': i == selectedIndex }]"
            >
                <slot :item="item" :q="q">
                    <div>
                        <template v-for="(part, pi) in highlightParts(item)" :key="pi">
                            <strong v-if="part.match">{{ part.text }}</strong>
                            <template v-else>{{ part.text }}</template>
                        </template>
                    </div>
                </slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
// use normal <script> to declare options
export default {
    inheritAttrs: false,
}
</script>

<script setup lang="ts" generic="T">
import "./Autocomplete.scss"
import { useAutocomplete, autocompleteDefaults, type AutocompleteProps, type AutocompleteEmits, type AutocompleteSlots } from "regira_modules/vue/ui"

const emit = defineEmits<AutocompleteEmits<T>>()
const props = withDefaults(defineProps<AutocompleteProps<T>>(), { ...autocompleteDefaults })
defineSlots<AutocompleteSlots<T>>()

defineOptions({
    inheritAttrs: false,
})

const {
    q,
    selectedItem,
    selectedIndex,
    items,
    isFocus,
    inputEl,
    resultStyle,
    isLoading,
    displayItemFormatter,
    closeGently,
    moveSelection,
    handleInput,
    handleChange,
    handleSelect,
    handleSearch,
    reset,
} = useAutocomplete<T>(props, { emit })

// default result rendering: display string with the matched term in bold (no innerHTML)
function highlightParts(item: T): Array<{ text: string; match: boolean }> {
    const text = displayItemFormatter(item) ?? ""
    const term = q.value?.trim()
    if (!term) {
        return [{ text, match: false }]
    }
    const index = text.toLowerCase().indexOf(term.toLowerCase())
    if (index < 0) {
        return [{ text, match: false }]
    }
    return [
        { text: text.slice(0, index), match: false },
        { text: text.slice(index, index + term.length), match: true },
        { text: text.slice(index + term.length), match: false },
    ].filter((part) => part.text)
}

function handleFocus() {
    isFocus.value = true
    const id = (props.idSelector && props.idSelector(selectedItem.value)) || "new"
    if (id == "new" || selectedItem.value == null) {
        handleSearch()
    }
}
function handleBlur() {
    isFocus.value = false
    // don't close when blurring (can't use result's scrollbars anymore)
    //closeGently()
}
function handleDblClick() {
    if (props.enableDblClick) {
        handleSearch("")
    }
}
function handleClickOutside(e: PointerEvent) {
    // prevent closing results when focussing inputEl
    if (e.target != inputEl.value) {
        closeGently()
    }
}

defineExpose({
    inputEl,
    q,
    selectedItem,
    search: handleSearch,
    reset,
    resetQ() {
        if (!isFocus.value) {
            q.value = ""
        }
        //inputEl.value!.value = ""
    },
})
</script>
