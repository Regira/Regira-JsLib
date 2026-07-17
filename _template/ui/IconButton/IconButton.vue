<template>
    <button :type="type" class="rg-icon-button btn">
        <Icon :name="icon" :size="size" />
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
import { Icon } from "regira_modules/vue/ui"
import { iconButtonDefaults, type IconButtonProps, type IconButtonSlots } from "regira_modules/vue/ui"

withDefaults(defineProps<IconButtonProps>(), { ...iconButtonDefaults })
defineSlots<IconButtonSlots>()
</script>
