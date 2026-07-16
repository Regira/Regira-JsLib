<template>
    <div class="row border-bottom py-2">
        <div class="col-auto">
            <!-- Row-edit affordance follows config.isComplex: a real entity (page) links to its Details route;
                 a very basic entity (modal) opens FormModalButton. Forward @remove either way so a delete from
                 inside the modal refreshes the pooled overview — without it the deleted row lingers until reload. -->
            <RouterLink v-if="config.isComplex" :to="{ name: config.key + 'Details', params: { id: item.$id } }" class="btn btn-link p-1">
                <Icon name="edit" />
            </RouterLink>
            <FormModalButton v-else v-model="item" @save="$emit('save', $event)" @remove="$emit('remove', $event)" />
        </div>

        <!-- TODO: your columns — mirror List.vue's headers 1:1, keep the row inside the viewport (flexible
             `col text-truncate`, drop secondary columns with d-none d-md-block/d-lg-block, few col-auto cells).
             A displayed relation defaults to the related entity's FormModalButton (opens its form) + a pooled
             label — import { FormModalButton as BarButton } from "@/entities/bars", const { fromPool: getBar }
             = useBarStore(), then:
                 <div class="col d-none d-md-block text-truncate"><BarButton :modelValue="item.bar" /> {{ getBar(item.bar)?.$title }}</div>
             (item.bar?.$title is undefined — nested DTOs aren't hydrated; item.bar?.title is a static
             snapshot). Plain text is the exception. See entities.patterns.md → Resolving relations with fromPool. -->
        <div class="col text-truncate">{{ item.$title }}</div>

        <div class="col-auto">
            <ConfirmButton icon="delete" :modal-type="ModalType.danger" @confirm="$emit('request-remove', item)">
                {{ $t("deleteItem", { title: item?.$title }) }}
            </ConfirmButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router"
import { ModalType, ConfirmButton, Icon } from "regira_modules/vue/ui"
import type { SaveResult } from "regira_modules/vue/entities"
import config from "../config/config"
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
