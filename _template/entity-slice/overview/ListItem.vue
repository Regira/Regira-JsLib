<template>
    <div class="row border-bottom py-2">
        <div class="col-auto">
            <!-- simple entity: edit in a modal. (complex: a <router-link> to the Details page) -->
            <FormModalButton v-model="item" @save="$emit('save', $event)" />
        </div>

        <!-- TODO: your columns — mirror List.vue's headers 1:1 and keep the row inside the viewport (no
             horizontal scroll): flexible `col text-truncate` for text, drop secondary columns with
             d-none d-md-block / d-lg-block, few fixed-width col-auto cells. Render a foreign relation's label
             through the sibling store's pool helper so it re-renders when that entity is edited — alias its
             fromPool (const { fromPool: getBar } = useBarStore()) and read $title off the result; the raw
             item.bar?.title is a static snapshot and item.bar?.$title is undefined (nested DTOs aren't
             hydrated). See entities.patterns.md → Resolving relations with fromPool. e.g.:
                 <div class="col d-none d-md-block text-truncate">{{ getBar(item.bar)?.$title }}</div> -->
        <div class="col text-truncate">{{ item.$title }}</div>

        <div class="col-auto">
            <ConfirmButton icon="delete" :modal-type="ModalType.danger" @confirm="$emit('request-remove', item)">
                {{ $t("deleteItem", { title: item?.$title }) }}
            </ConfirmButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ModalType, ConfirmButton } from "regira_modules/vue/ui"
import type { SaveResult } from "regira_modules/vue/entities"
import Entity from "../data/Entity"
import FormModalButton from "../details/FormModalButton.vue"

const emit = defineEmits<{
    (e: "update:modelValue", value: Entity): void
    (e: "save", value: SaveResult<Entity>): void
    (e: "remove", value: Entity): void
    (e: "request-save", value: Entity): void
    (e: "request-remove", value: Entity): void
}>()
defineProps<{ readonly?: boolean }>()

const item = defineModel<Entity>({ required: true })
</script>
