<template>
    <img class="rg-loading" :src="img" ref="imgEl" />
</template>

<script setup lang="ts">
import { ref, inject } from "vue"

const img = inject<string>("loadingImg")
const imgEl = ref<InstanceType<typeof HTMLImageElement> | null>(null)

defineExpose({
    imgEl,
    dimensions: () => [imgEl.value?.width, imgEl.value?.height],
    height: () => imgEl.value?.naturalHeight,
})
</script>
