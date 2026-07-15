<template>
    <button type="button" class="rg-loading-button btn" :disabled="disabled || isLoading">
        <template v-if="isLoading">
            <slot name="loading">
                <LoadingImg style="width: 1rem" />
            </slot>
        </template>
        <template v-else>
            <slot></slot>
        </template>
    </button>
</template>

<script setup lang="ts">
import LoadingImg from "./Loading.vue"
defineProps<{
    isLoading: boolean
    disabled?: boolean
}>()
</script>
