<template>
    <FormSection :title="$t('files')">
        <ListItem
            v-for="(row, i) in items"
            :key="row.$id"
            v-model="items[i]!"
            :class="{ 'is-deleted': row._deleted }"
            class="mb-2"
            :readonly="readonly"
            @change="sync"
        />
        <FileDropZone v-if="!readonly" @drop-files="handleBrowse" @click="triggerBrowse()">
            <template #default="{ isDropping }">
                <div class="text-center text-info p-4 my-2 border rounded" :class="{ 'border-info bg-light': isDropping }">
                    {{ $t("addNewFile(s)") }}
                </div>
            </template>
        </FileDropZone>
        <Debug :modelValue="items" />
    </FormSection>
</template>

<script setup lang="ts">
import { FileDropZone, FormSection } from "regira_modules/vue/ui"
import { Debug } from "regira_modules/vue/debug"
import { useEntityAttachments } from "../data/functions"
import type Entity from "../data/Entity"
import ListItem from "./ListItem.vue"

const emit = defineEmits<{ (e: "update:modelValue", v: Array<Entity>): void }>()
const props = withDefaults(defineProps<{ modelValue?: Array<Entity>; readonly?: boolean }>(), { modelValue: () => [] })

const { items, sync, triggerBrowse, handleBrowse } = useEntityAttachments({ props, emit })
</script>
