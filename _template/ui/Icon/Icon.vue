<template>
    <component :is="iconComponent" class="rg-icon" :name="name" :size="size" />
</template>

<script setup lang="ts">
import { computed, inject } from "vue"
import { BsIcon } from "regira_modules/vue/ui"
import { FaIcon } from "regira_modules/vue/ui"
import { iconDefaults, type IconsConfig, type IconProps } from "regira_modules/vue/ui"

withDefaults(defineProps<IconProps>(), { ...iconDefaults })

// renders the glyph set selected by iconPlugin ({ source }); defaults to Bootstrap icons
const config = inject<IconsConfig | null>("icons.config", null)
const iconComponent = computed(() => (config?.source === "fa" ? FaIcon : BsIcon))
</script>
