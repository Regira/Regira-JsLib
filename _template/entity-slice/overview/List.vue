<template>
    <div class="entity-list">
        <div class="row fw-bold border-bottom pb-2">
            <!-- TODO: your column headers — must mirror ListItem.vue 1:1. Keep the row inside the viewport:
                 the list must never scroll horizontally. Use flexible `col` (+ text-truncate on the cell) for
                 text, drop secondary columns on small screens with d-none d-md-block / d-lg-block, and reserve
                 fixed-width col-auto for a couple of narrow cells only (they don't shrink). e.g.:
                     <div class="col d-none d-md-block fw-bold">{{ $t("code") }}</div>
                     <div class="col-auto d-none d-lg-block fw-bold" style="width: 9rem">{{ $t("created") }}</div>
                 See entities.patterns.md → Overview list layout (no horizontal scroll). -->
            <div class="col">{{ $t("name") }}</div>
        </div>
        <ListItem
            v-for="(item, i) in items"
            :key="item.$id"
            v-model="items[i]!"
            :readonly="readonly"
            @request-save="$emit('request-save', $event)"
            @request-remove="$emit('request-remove', $event)"
            @save="$emit('save', $event)"
            @remove="$emit('remove', $event)"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { OverviewEmits } from "regira_modules/vue/entities"
import type Entity from "../data/Entity"
import useEntityStore from "../data/store"
import ListItem from "./ListItem.vue"

interface Emits extends /* @vue-ignore */ OverviewEmits<Entity> {}
const emit = defineEmits<Emits>()
const props = defineProps<{ modelValue?: Array<Entity>; readonly?: boolean }>()

const { fromPool } = useEntityStore() // resolve rows through the shared pool (reactive cache)
const items = computed<Array<Entity>>({
    get: () => fromPool(props.modelValue || []),
    set: (value) => emit("update:modelValue", value),
})
</script>
