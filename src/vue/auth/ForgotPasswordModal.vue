<template>
    <DefaultModal :is-visible="isVisible" title="Forgot password" :showFooter="false">
        <slot v-bind="{ username }"></slot>
    </DefaultModal>
</template>

<script setup lang="ts">
import DefaultModal from "../ui/modal/DefaultModal.vue"

withDefaults(
    defineProps<{
        username?: string
        isVisible?: boolean
    }>(),
    { isVisible: true }
)
</script>
