<template>
    <button :type="type" class="rg-icon-button btn">
        <Icon :name="icon" :size="size" />
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
import Icon from "./Icon.vue"
import type { IconSize } from "./icons"

withDefaults(
    defineProps<{
        icon: string
        size?: IconSize
        type?: "button" | "submit" | "reset"
    }>(),
    {
        type: "button",
    }
)
</script>
