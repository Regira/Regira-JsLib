<template>
    <div class="description-input">
        <textarea v-model="model" :readonly="readonly" class="form-control" rows="3"></textarea>
        <FormLabel v-if="label" :label="label" />
    </div>
</template>

<script setup lang="ts">
import FormLabel from "./FormLabel.vue"

defineProps<{ label?: string; readonly?: boolean }>()
const model = defineModel<string>()
</script>
