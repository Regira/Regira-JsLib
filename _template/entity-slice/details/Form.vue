<template>
    <form @submit.prevent="handleSubmit">
        <!-- useForm drives `feedback` (Saving… → Saved / 400 field-map); render it here or the save shows nothing. -->
        <Feedback :feedback="feedback" />

        <FormButtonsRow
            :item="item"
            :readonly="readonly"
            :feedback="feedback"
            :show-delete="item?.id > 0"
            @cancel="handleCancel"
            @remove="handleRemove"
            @restore="handleRestore"
        />

        <!-- Heavier form? Wrap sections in <TabContainer :tabs="tabs" :active="initialTab" :use-route-nav="!isPopup">
             with one <template #key> per Tab.create(...) — see entities.advanced.example.md §5. -->
        <FormSection :title="$t(config.detailsTitle || '')" :readonly="readonly">
            <!-- TODO: your fields, e.g. -->
            <div class="mb-2">
                <input v-model="item.title" :readonly="readonly" class="form-control" />
                <FormLabel :label="$t('name')" />
            </div>
            <!-- single relation (FK) → the related entity's InputSelector, e.g. <BarInputSelector v-model="item.bar" v-model:idValue="item.barId" /> -->
            <!-- many-to-many / owned rows → InputSelectorInline (regira_modules/vue/entities): chips that mark
                 _deleted (undoable until save) with the related entity's FormModalButton inside, adds via its
                 InputSelector + exclude; filter _deleted rows in EntityService.prepareItem. The multi-Selector
                 hard-removes — don't use it here. See entities.patterns.md → owned-m2m recipe. -->
            <!-- child collections go here, e.g. <ChildOverview v-model="item" /> (see entities.advanced.example.md) -->
        </FormSection>

        <!-- Dev aid: <Debug> (import { Debug } from "regira_modules/vue/debug") dumps the live payload, self-gated on $isDebug ($setDebug / ?debug=1). -->
        <!-- <Debug :modelValue="{ item }" /> -->
    </form>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from "vue-router"
import { Feedback, FormButtonsRow, FormSection, FormLabel } from "regira_modules/vue/ui"
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
