<template>
    <DefaultModal :is-visible="isVisible" :title="title" :showFooter="false">
        <slot v-bind="{ username }">
            <LoginForm
                @success="$emit('success', $event)"
                @forgot-password="$emit('forgotPassword', $event)"
                @signing-in="$emit('signingIn', $event)"
                @fail="$emit('fail', $event)"
            />
        </slot>
    </DefaultModal>
</template>

<script setup lang="ts">
import { type IEmits } from "./useLoginForm"
import DefaultModal from "../ui/modal/DefaultModal.vue"
import LoginForm from "./LoginForm.vue"

interface ILoginEmits extends IEmits {}
const emit = defineEmits<ILoginEmits>()

const props = withDefaults(
    defineProps<{
        username?: string
        title?: string
        // visibility is a real prop (defaults on); prefer gating the whole component with v-if —
        // it unmounts mask + dialog in one go and cannot strand a leave-transition
        isVisible?: boolean
    }>(),
    {
        title: "Sign in",
        isVisible: true,
    }
)
</script>
