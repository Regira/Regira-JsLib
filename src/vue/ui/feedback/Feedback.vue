<template>
    <div v-if="isPending || isSuccess || isFailed" class="mb-1 position-relative border h-100">
        <slot name="close-button" v-if="!hideCloseButton">
            <IconButton icon="close" class="btn btn-sm position-absolute end-0 p-1" :class="{ 'text-light': isFailed }" @click="handleClose" />
        </slot>
        <slot name="pending" v-if="isPending">
            <Pending :msg="message" class="px-2 py-1 border h-100" />
        </slot>
        <slot name="success" v-if="isSuccess">
            <Success :msg="message" class="px-2 py-1 border h-100" />
        </slot>
        <slot name="error" v-if="isFailed">
            <ErrorSummary :msg="message" :error="error" :enable-popup="enableErrorPopup" class="px-2 border h-100" />
        </slot>
    </div>
</template>

<script setup lang="ts">
import IconButton from "../icons/IconButton.vue"
import Pending from "./Pending.vue"
import Success from "./Success.vue"
import ErrorSummary from "./ErrorSummary.vue"
import { FeedbackStatus, type FeedbackEmits, type FeedbackOut } from "./feedback"

import { computed } from "vue"

interface Emits extends FeedbackEmits {}
const emit = defineEmits<Emits>()
const props = withDefaults(
    defineProps<{
        hideCloseButton?: boolean
        feedback: FeedbackOut
        enableErrorPopup?: boolean
    }>(),
    {
        hideCloseButton: false,
        enableErrorPopup: false,
    }
)

const { status, message, error, reset } = props.feedback

const isPending = computed(() => status.value === FeedbackStatus.pending)
const isSuccess = computed(() => status.value === FeedbackStatus.success)
const isFailed = computed(() => status.value === FeedbackStatus.failed)

const handleClose = (e: Event) => {
    e.stopPropagation() // prevent triggering buttons underneath
    emit("close", { status: status.value, error: error.value })

    reset()
}
</script>
