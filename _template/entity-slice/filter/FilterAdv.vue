<template>
    <div class="adv-filter">
        <!-- keywords (free-text q) -->
        <input v-model.lazy.trim="searchObject.q" class="form-control mb-2" :placeholder="$t('keywords')" />

        <!-- TODO: your filter inputs, e.g. -->
        <input v-model.lazy.trim="searchObject.title" class="form-control mb-2" :placeholder="$t('name')" />

        <IconButton icon="clear" :showText="true" @click="handleReset" />
    </div>
</template>

<script setup lang="ts">
// Icon / IconButton are globally-registered (vue/ui) — or import them.
import { useFilter, type FilterEmits } from "regira_modules/vue/entities"
import SearchObject from "./SearchObject"

interface Emits extends /* @vue-ignore */ FilterEmits<SearchObject> {}
const emit = defineEmits<Emits & { "update:modelValue": (v: SearchObject) => true; filter: (v: SearchObject) => true; close: () => void }>()
defineProps<{ resultCount?: number }>()

const searchObject = defineModel<SearchObject>({ required: true })
const { filterIsActive, handleReset } = useFilter({ searchObject, emit, Constructor: SearchObject })
</script>
