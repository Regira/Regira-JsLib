<template>
    <input type="checkbox" class="rg-nullable-checkbox" ref="input" @click="handleChange" :true-value="true" :checked="cbValue" :style="style" />
</template>

<script lang="ts">
export default {
    name: "NullableCheckBox",
}
</script>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue"
import type { NullableCheckBoxProps, NullableCheckBoxEmits } from "./inputs"

type ValueType = boolean | undefined

const emit = defineEmits<NullableCheckBoxEmits>()
const props = defineProps<NullableCheckBoxProps>()

const input = ref<HTMLInputElement>(null!)
const getValue = (v: ValueType | string | number): ValueType => {
    if (v == null) {
        return undefined
    }
    if (typeof v === "string") {
        return v === "true" ? true : v === "false" ? false : undefined
    }
    return new Boolean(v).valueOf()
}

const _value = ref<ValueType>(getValue(props.modelValue))
const cbValue = computed<ValueType>({
    get() {
        return _value.value
    },
    set(value) {
        _value.value = value
        emit("update:modelValue", value)
        emit("change", { target: input.value })
    },
})
const style = computed(() => ({ opacity: cbValue.value == null ? 0.5 : 1 }))

function handleChange() {
    cbValue.value = (cbValue.value == null ? true : cbValue.value ? false : undefined) as ValueType
}

// input.value -> (HTMLInputElement)
watchEffect(() => input.value && (input.value.indeterminate = cbValue.value === undefined))
</script>
