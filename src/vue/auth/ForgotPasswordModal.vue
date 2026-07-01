<template>
    <DefaultModal is-visible title="Forgot password" :showFooter="false">
        <slot v-bind="{ username }"></slot>
    </DefaultModal>
</template>

<script setup lang="ts">
import DefaultModal from "../ui/modal/DefaultModal.vue"

defineProps<{
    username?: string
}>()
</script>
