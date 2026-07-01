<template>
    <component :is="iconComponent" :name="name" :size="size" />
</template>

<script setup lang="ts">
import { computed, inject } from "vue"
import BsIcon from "./BsIcon.vue"
import FaIcon from "./FaIcon.vue"
import type { IconsConfig, IconSize } from "./icons"

withDefaults(
    defineProps<{
        name: string
        size?: IconSize
    }>(),
    {
        size: "md",
    }
)

// renders the glyph set selected by iconPlugin ({ source }); defaults to Bootstrap icons
const config = inject<IconsConfig | null>("icons.config", null)
const iconComponent = computed(() => (config?.source === "fa" ? FaIcon : BsIcon))
</script>
