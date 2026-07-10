<template>
    <div class="form-buttons d-flex flex-wrap gap-2">
        <IconButton v-if="!readonly" type="submit" icon="save" class="btn-primary" :disabled="busy">
            <span class="d-none d-md-inline ms-1">{{ labels?.save ?? "Save" }}</span>
        </IconButton>
        <IconButton type="button" icon="cancel" class="btn-secondary" @click="emit('cancel')">
            <span class="d-none d-md-inline ms-1">{{ labels?.cancel ?? "Cancel" }}</span>
        </IconButton>
        <ConfirmButton
            v-if="showDelete && !isArchived"
            :modal-title="modalTitle ?? 'Delete?'"
            :modal-type="ModalType.danger"
            class="btn-danger"
            :disabled="readonly || busy"
            @confirm="emit('remove')"
        >
            <template #button-content>
                <Icon name="delete" />
                <span class="d-none d-md-inline ms-1">{{ labels?.delete ?? "Delete" }}</span>
            </template>
            <slot name="delete">Delete {{ title }}?</slot>
        </ConfirmButton>
        <IconButton v-if="isArchived" type="button" icon="restore" class="btn-warning" :disabled="busy" @click="emit('restore')">
            <span class="d-none d-md-inline ms-1">{{ labels?.restore ?? "Restore" }}</span>
        </IconButton>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import Icon from "../icons/Icon.vue"
import IconButton from "../icons/IconButton.vue"
import ConfirmButton from "../buttons/ConfirmButton.vue"
import { ModalType } from "../modal"
import { FeedbackStatus, type FeedbackOut } from "../feedback"

// `item` only needs `isArchived` (gate Restore) and `$title` (delete prompt). Typed `unknown` so any
// entity binds — class instances (EntityBase) have no index signature, and an all-optional object type
// would be a TypeScript "weak type" — both reject `:item="item"` under strict mode.
const props = defineProps<{
    item?: unknown
    readonly?: boolean
    feedback?: FeedbackOut
    showDelete?: boolean
    /** button-label overrides (i18n); defaults are English */
    labels?: { save?: string; cancel?: string; delete?: string; restore?: string }
    /** delete-confirm modal title; pair with the `delete` slot for a translated body */
    modalTitle?: string
}>()
const emit = defineEmits<{ cancel: []; remove: []; restore: [] }>()

// truthy, not === true: soft-delete flags may arrive as 0/1 instead of booleans
const isArchived = computed(() => !!(props.item as { isArchived?: number | boolean } | undefined)?.isArchived)
const title = computed(() => (props.item as { $title?: string } | undefined)?.$title ?? "")
// disable submit while a save/delete is in flight (or just succeeded, before it auto-clears) to block double-submits
const busy = computed(() => {
    const s = props.feedback?.status.value
    return s != null && s !== FeedbackStatus.none && s !== FeedbackStatus.failed
})
</script>
