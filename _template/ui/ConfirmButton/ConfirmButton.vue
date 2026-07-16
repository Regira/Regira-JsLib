<template>
    <button type="button" class="rg-confirm-button btn" :name="icon" @click="handleOpen">
        <slot name="button-content">
            <Icon v-if="icon != null" :name="icon" />
            <span v-if="buttonLabel" class="ms-1">{{ buttonLabel }}</span>
        </slot>
        <Teleport to="#modals">
            <slot name="modal">
                <component
                    :is="Modal"
                    :is-visible="showModal"
                    :type="modalType"
                    :title="modalTitle"
                    @submit="handleConfirm"
                    @cancel="handleCancel"
                    @close="handleClose"
                >
                    <slot></slot>
                </component>
            </slot>
        </Teleport>
    </button>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Icon } from "regira_modules/vue/ui"
import { injectModal } from "regira_modules/vue/ui"
import { confirmButtonDefaults, type ConfirmButtonProps, type ConfirmButtonEmits, type ConfirmButtonSlots } from "regira_modules/vue/ui"

const emit = defineEmits<ConfirmButtonEmits>()
withDefaults(defineProps<ConfirmButtonProps>(), { ...confirmButtonDefaults })
defineSlots<ConfirmButtonSlots>()

const Modal = injectModal()

const showModal = ref(false)
function handleConfirm() {
    emit("confirm")
    handleClose()
}
function handleOpen() {
    emit("open")
    showModal.value = true
}
function handleCancel() {
    emit("cancel")
    handleClose()
}
function handleClose() {
    emit("close")
    showModal.value = false
}
</script>
