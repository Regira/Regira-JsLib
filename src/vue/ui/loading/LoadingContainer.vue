<template>
    <div class="rg-loading-container position-relative" :style="{ height: isLoading ? `${getHeight()}px` : undefined }" ref="containerEl">
        <slot name="loading">
            <Loading
                v-if="isLoading"
                class="position-absolute top-0 start-50 translate-middle-x"
                style="width: 20rem; max-width: 100%"
                ref="loadingEl"
            />
        </slot>
        <div :style="{ opacity: isLoading ? '0.4' : '' }">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import Loading from "./Loading.vue"

defineProps<{ isLoading: boolean }>()

const containerEl = ref<InstanceType<typeof HTMLDivElement> | null>(null)
const loadingEl = ref<InstanceType<typeof Loading> | null>(null)

function getHeight() {
    // height returns 0, so assert that img is a square and return width
    return loadingEl.value?.imgEl?.width
}

defineExpose({
    containerEl,
    loadingImgEl: loadingEl.value?.imgEl,
})
</script>
