<template>
    <component :is="Modal" :is-visible="isVisible" title="Forgot password" :showFooter="false">
        <slot v-bind="{ username }"></slot>
    </component>
</template>

<script setup lang="ts">
import { injectModal } from "regira_modules/vue/ui"
import type { ForgotPasswordModalProps, ForgotPasswordModalSlots } from "regira_modules/vue/auth"

withDefaults(defineProps<ForgotPasswordModalProps>(), { isVisible: true })
defineSlots<ForgotPasswordModalSlots>()

const Modal = injectModal()
</script>
