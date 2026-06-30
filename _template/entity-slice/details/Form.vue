<template>
    <form @submit.prevent="handleSubmit">
        <FormButtonsRow
            :item="item"
            :readonly="readonly"
            :feedback="feedback"
            :show-delete="item?.id > 0"
            @cancel="handleCancel"
            @remove="handleRemove"
            @restore="handleRestore"
        />

        <FormSection :title="$t(config.detailsTitle || '')" :readonly="readonly">
            <!-- TODO: your fields, e.g. -->
            <div class="mb-2">
                <input v-model="item.title" :readonly="readonly" class="form-control" />
                <FormLabel :label="$t('name')" />
            </div>
            <!-- relation pickers go here, e.g. <BarInputSelector v-model="item.bar" v-model:idValue="item.barId" /> -->
            <!-- child collections go here, e.g. <ChildOverview v-model="item" /> (see entities.advanced.example.md) -->
        </FormSection>
    </form>
</template>

<script setup lang="ts">
// FormSection / FormLabel / Icon are globally-registered (vue/ui); FormButtonsRow is imported from vue/ui.
import type { RouteRecordRaw } from "vue-router"
import { FormButtonsRow } from "regira_modules/vue/ui"
import { useForm, type FormEmits, formDefaults } from "regira_modules/vue/entities"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"

interface Emits extends /* @vue-ignore */ FormEmits<Entity> {}
const emit = defineEmits<Emits>()
const props = withDefaults(
    defineProps<{ modelValue: Entity; readonly?: boolean; overviewUrl?: string | RouteRecordRaw; isPopup?: boolean; initialTab?: string }>(),
    { ...formDefaults }
)

const { service: entityService } = useEntityStore()
const { item, feedback, handleCancel, handleSubmit, handleRemove, handleRestore } = useForm<Entity>({ entityService, props, emit })
// the form's handleRemove() takes NO argument (it removes item.value) — unlike the overview's handleRemove(item)
</script>
