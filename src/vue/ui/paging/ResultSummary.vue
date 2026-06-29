<template>
    <span class="result-summary text-muted small">{{ visibleCount ?? 0 }} / {{ totalCount ?? 0 }}</span>
</template>

<script setup lang="ts">
defineProps<{ visibleCount?: number; totalCount?: number }>()
</script>
