<template>
    <button type="button" class="btn" :name="icon" @click="handleOpen">
        <slot name="button-content">
            <Icon v-if="icon != null" :name="icon" />
            <span v-if="buttonLabel" class="ms-1">{{ buttonLabel }}</span>
        </slot>
        <Teleport to="#modals">
            <slot name="modal">
                <DefaultModal
                    :is-visible="showModal"
                    :type="modalType"
                    :title="modalTitle"
                    @submit="handleConfirm"
                    @cancel="handleCancel"
                    @close="handleClose"
                >
                    <slot></slot>
                </DefaultModal>
            </slot>
        </Teleport>
    </button>
</template>

<script setup lang="ts">
import { ref } from "vue"
import Icon from "../icons/Icon.vue"
import DefaultModal from "../modal/DefaultModal.vue"
import { ModalType } from "../modal"

const emit = defineEmits<{
    (e: "confirm"): void
    (e: "cancel"): void
    (e: "open"): void
    (e: "close"): void
}>()
withDefaults(
    defineProps<{
        icon?: string
        buttonLabel?: string
        modalTitle?: string
        modalType?: ModalType
    }>(),
    {
        icon: "warning",
        modalTitle: "Sure?",
        modalType: ModalType.warning,
    }
)

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
