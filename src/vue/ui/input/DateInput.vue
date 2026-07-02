<template>
    <input
        type="date"
        class="form-control"
        :value="dateValue"
        @change="handleChange"
        :lang="culture"
        :class="{ 'is-invalid': dateValue && !isValidDate }"
    />
</template>

<script setup lang="ts">
import { computed } from "vue"
import { dateInputString } from "../../formatters"
import { isValid } from "date-fns"

const emit = defineEmits<{
    (e: "update:modelValue", modelValue?: string | Date): void
}>()
const props = defineProps<{
    modelValue?: string | Date
    culture?: string
}>()

const isValidDate = computed(() => isValid(new Date(props.modelValue || "")))
const dateValue = computed(() => (isValidDate.value ? dateInputString(new Date(props.modelValue!)) : props.modelValue))
const handleChange = (e: any) => {
    const date = new Date(e.target.value)
    if (!e.target.value || isValid(date)) {
        emit("update:modelValue", date || e.target.value)
    }
}
</script>
