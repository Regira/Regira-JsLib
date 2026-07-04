<template>
    <div class="form-buttons d-flex flex-wrap gap-2">
        <IconButton v-if="!readonly" type="submit" icon="save" class="btn-primary">
            <span class="d-none d-md-inline ms-1">Save</span>
        </IconButton>
        <IconButton type="button" icon="cancel" class="btn-secondary" @click="emit('cancel')">
            <span class="d-none d-md-inline ms-1">Cancel</span>
        </IconButton>
        <ConfirmButton
            v-if="showDelete && !isArchived"
            modal-title="Delete?"
            :modal-type="ModalType.danger"
            class="btn-danger"
            :disabled="readonly"
            @confirm="emit('remove')"
        >
            <template #button-content>
                <Icon name="delete" />
                <span class="d-none d-md-inline ms-1">Delete</span>
            </template>
            <slot name="delete">Delete {{ title }}?</slot>
        </ConfirmButton>
        <IconButton v-if="isArchived" type="button" icon="restore" class="btn-warning" @click="emit('restore')">
            <span class="d-none d-md-inline ms-1">Restore</span>
        </IconButton>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import Icon from "../icons/Icon.vue"
import IconButton from "../icons/IconButton.vue"
import ConfirmButton from "../buttons/ConfirmButton.vue"
import { ModalType } from "../modal"

// `item` only needs `isArchived` (gate Restore) and `$title` (delete prompt). Typed `unknown` so any
// entity binds — class instances (EntityBase) have no index signature, and an all-optional object type
// would be a TypeScript "weak type" — both reject `:item="item"` under strict mode.
const props = defineProps<{ item?: unknown; readonly?: boolean; feedback?: unknown; showDelete?: boolean }>()
const emit = defineEmits<{ cancel: []; remove: []; restore: [] }>()

const isArchived = computed(() => (props.item as { isArchived?: boolean } | undefined)?.isArchived === true)
const title = computed(() => (props.item as { $title?: string } | undefined)?.$title ?? "")
</script>
