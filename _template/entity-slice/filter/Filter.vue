<template>
    <div>
        <slot name="inline" :handleToggle="handleToggle">
            <FilterInline v-model="searchObject" @filter="handleFilter" @toggle-adv="handleToggle" />
        </slot>

        <Teleport to="#modals">
            <DefaultModal
                :is-visible="showAdv"
                :title="props.modalTitle || 'Advanced search'"
                :show-footer="true"
                :full-width="true"
                @close="handleClose"
                @submit="handleSubmit"
            >
                <slot name="title"></slot>
                <slot name="adv" :handleUpdate="handleUpdate" :handleSubmit="handleSubmit" :handleClose="handleClose"> </slot>

                <Debug :modelValue="searchObject" />
            </DefaultModal>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { DefaultModal } from "regira_modules/vue/ui"
import { Debug } from "regira_modules/vue/debug"
import { useFilter, type FilterEmits } from "regira_modules/vue/entities"
import type SearchObject from "./SearchObject"
import FilterInline from "./FilterInline.vue"

interface Emits extends /* @vue-ignore */ FilterEmits<SearchObject> {}
const emit = defineEmits<
    Emits & {
        "update:modelValue": (value: SearchObject) => true
        filter: (value: SearchObject) => true
        "toggle-adv": () => void
        close: () => void
    }
>()

const props = defineProps<{
    modalTitle?: string
    resultCount?: number
}>()

const searchObject = defineModel<SearchObject>({ required: true })

const showAdv = ref(false)
const { handleUpdate, handleFilter } = useFilter({ searchObject, emit })

function handleToggle() {
    showAdv.value = !showAdv.value
}
function handleClose() {
    showAdv.value = false
}
function handleSubmit() {
    handleUpdate()
    handleClose()
}
</script>
