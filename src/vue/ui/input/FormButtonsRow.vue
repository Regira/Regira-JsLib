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

// `item` only needs `isArchived` to gate the restore button. Typed `unknown` so any entity binds —
// class instances (EntityBase) have no index signature, and an all-optional object type would be a
// TypeScript "weak type" — both reject `:item="item"` under strict mode.
const props = defineProps<{ item?: unknown; readonly?: boolean; feedback?: unknown; showDelete?: boolean }>()
const emit = defineEmits<{ cancel: []; remove: []; restore: [] }>()

const isArchived = computed(() => (props.item as { isArchived?: boolean } | undefined)?.isArchived === true)
</script>
