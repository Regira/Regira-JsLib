<template>
    <div class="form-buttons btn-group">
        <button v-if="!readonly" type="submit" class="btn btn-primary">Save</button>
        <button type="button" class="btn btn-link" @click="emit('cancel')">Cancel</button>
        <button v-if="showDelete && !isArchived" type="button" class="btn btn-outline-danger" @click="emit('remove')">Delete</button>
        <button v-if="isArchived" type="button" class="btn btn-outline-secondary" @click="emit('restore')">Restore</button>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

// `item` only needs `isArchived` to gate the restore button; the index signature keeps it from being a
// TypeScript "weak type" so any entity (archivable or not) can be bound without TS2559.
const props = defineProps<{ item?: { isArchived?: boolean; [key: string]: unknown }; readonly?: boolean; feedback?: unknown; showDelete?: boolean }>()
const emit = defineEmits<{ cancel: []; remove: []; restore: [] }>()

const isArchived = computed(() => props.item?.isArchived === true)
</script>
