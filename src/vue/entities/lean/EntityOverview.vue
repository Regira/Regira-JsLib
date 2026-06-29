<template>
    <div class="entity-overview">
        <slot name="toolbar" :reload="reload" :set-page="setPage" />
        <table class="table">
            <thead>
                <slot name="head" />
            </thead>
            <tbody>
                <tr v-for="item in items" :key="item.$id">
                    <slot name="row" :item="item" :remove="remove" :reload="reload">
                        <td>{{ item.$title }}</td>
                    </slot>
                </tr>
            </tbody>
        </table>

        <div class="entity-paging d-flex align-items-center gap-2">
            <slot name="paging" :page="page" :page-count="pageCount" :count="count" :set-page="setPage">
                <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="page <= 1" @click="setPage(page - 1)">Previous</button>
                <span class="text-muted small">Page {{ page }} / {{ pageCount }} · {{ count }}</span>
                <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="page >= pageCount" @click="setPage(page + 1)">Next</button>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T extends IEntity">
import { ref, computed, onMounted, type Ref } from "vue"
import { DEFAULT_PAGESIZE } from "../abstractions"
import type { IEntity, IEntityService } from "../abstractions"

const props = withDefaults(defineProps<{ service: IEntityService<T>; query?: Record<string, any>; pageSize?: number }>(), {
    pageSize: DEFAULT_PAGESIZE,
})
defineSlots<{
    toolbar(props: { reload: () => Promise<void>; setPage: (p: number) => Promise<void> }): any
    head(): any
    row(props: { item: T; remove: (item: T) => Promise<void>; reload: () => Promise<void> }): any
    paging(props: { page: number; pageCount: number; count: number; setPage: (p: number) => Promise<void> }): any
}>()

const items = ref([]) as Ref<Array<T>>
const count = ref(0)
const page = ref(1)
const pageCount = computed(() => Math.max(1, Math.ceil(count.value / props.pageSize)))

async function reload(): Promise<void> {
    const result = await props.service.search({ ...props.query, page: page.value, pageSize: props.pageSize })
    items.value = result.items
    count.value = result.count
}
async function setPage(p: number): Promise<void> {
    page.value = Math.min(Math.max(1, p), pageCount.value)
    await reload()
}
async function remove(item: T): Promise<void> {
    await props.service.remove(item)
    await reload()
}

onMounted(reload)
defineExpose({ reload, setPage })
</script>
