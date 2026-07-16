<template>
    <div class="input-selector-inline row align-items-center">
        <template v-for="(row, i) in model ?? []" :key="rowKey?.(row) ?? i">
            <div class="col-auto mb-2 pe-0">
                <div class="form-control p-0 d-inline-flex align-items-center" :class="{ 'is-deleted': row._deleted }">
                    <slot name="chip" v-bind="{ row }" />
                    <IconButton
                        icon="delete"
                        class="btn-outline-danger border-0"
                        :title="row._deleted ? 'restore' : 'remove'"
                        @click="toggleRemove(row)"
                    />
                </div>
            </div>
        </template>
        <div class="col-auto mb-2">
            <slot name="selector" v-bind="{ add, exclude }" />
        </div>
    </div>
</template>

<script setup lang="ts" generic="T extends { _deleted?: boolean }">
import { computed } from "vue"
import { IconButton } from "regira_modules/vue/ui"
import type { InputSelectorInlineProps, InputSelectorInlineEmits, InputSelectorInlineSlots } from "regira_modules/vue/entities"

// Inline chip editor for an owned/join collection edited inside the parent's form.
// Removal MARKS the row (`_deleted`, undoable until save) — it never splices; pair with an
// `EntityService.prepareItem` override that filters marked rows so the server deletes by omission.
const model = defineModel<Array<T>>()
const props = defineProps<InputSelectorInlineProps<T>>()
const emit = defineEmits<InputSelectorInlineEmits<T>>()
defineSlots<InputSelectorInlineSlots<T>>()

// every current row, marked ones included — a marked row is restored by toggling, not re-picking
const exclude = computed(() => (model.value ?? []).map((x) => props.excludeKey?.(x)).filter((x): x is number => x != null))

function toggleRemove(row: T) {
    row._deleted = !row._deleted
    emit("remove", row)
}
function add(row: T) {
    model.value = [...(model.value ?? []), row]
    emit("add", row)
}
</script>
