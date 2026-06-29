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

const props = defineProps<{ item?: { isArchived?: boolean }; readonly?: boolean; feedback?: unknown; showDelete?: boolean }>()
const emit = defineEmits<{ cancel: []; remove: []; restore: [] }>()

const isArchived = computed(() => props.item?.isArchived === true)
</script>
