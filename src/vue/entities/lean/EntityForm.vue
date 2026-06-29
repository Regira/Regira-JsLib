<template>
    <form v-if="item" class="entity-form" @submit.prevent="submit">
        <slot :item="item!" />
        <div class="mt-3">
            <button type="submit" class="btn btn-primary" :disabled="saving">Save</button>
            <button type="button" class="btn btn-link" @click="emit('cancel')">Cancel</button>
        </div>
    </form>
</template>

<script setup lang="ts" generic="T extends IEntity">
import { ref, onMounted, type Ref } from "vue"
import type { IEntity, IEntityService } from "../abstractions"

const props = defineProps<{ service: IEntityService<T>; id: string | number }>()
const emit = defineEmits<{ saved: [item: T]; cancel: [] }>()
defineSlots<{ default(props: { item: T }): any }>()

const item = ref() as Ref<T | undefined>
const saving = ref(false)

onMounted(async () => {
    item.value = props.id === "new" ? await props.service.newEntity() : ((await props.service.details(props.id)) ?? undefined)
})

async function submit(): Promise<void> {
    if (!item.value) return
    saving.value = true
    try {
        const { saved } = await props.service.save(item.value)
        emit("saved", saved)
    } finally {
        saving.value = false
    }
}
</script>
