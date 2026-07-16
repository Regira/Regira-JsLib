# Regira JsLib Entities — Attachments Slice Template (scaffold)

The **shared** `entity-attachments` slice: a file/picture editor that stages **offline** (add via drop or
browse, rename, remove) and commits everything on the **parent entity's save**. Scaffold it once per app,
then bind it in a tab on every entity that owns files.

```bash
node node_modules/regira_modules/_template/scaffold.mjs --attachments   # → src/entities/entity-attachments/
```

It builds on shipped primitives — `FileDropZone` (`vue/ui`), `useAxios().upload`/`getFile` (`vue/http`,
field name defaults to `"file"`, baseURL-aware), and `file-utility` — so **do not** reach for
`FileHelper.send` (bare axios, no baseURL, field `"files"`). Full explanation + host wiring:
[entities.patterns.md → Attachments (files)](entities.patterns.md#attachments-files--offline-add--rename--remove-confirm-on-save).

> **Shared slice — no per-entity tokens.** Unlike an entity slice, this is copied verbatim (one folder per
> app). You do not customize its files; you customize which entities *use* it (the 3-line host wiring below).

## `attachments/Entity.ts`

```ts
import { EntityBase } from "regira_modules/vue/entities"

// The file itself; `_file` is the raw Blob, staged in memory until the parent is saved.
export class Attachment extends EntityBase {
    id = 0
    fileName?: string
    contentType?: string
    length?: number
    _file?: Blob & { name?: string }

    override get $id() {
        return this.id || "new"
    }
    override get $title() {
        return this.fileName
    }

    static create(v?: object) {
        return Object.assign(new Attachment(), v || {})
    }
}

export const Entity = Attachment
export default Attachment
```

## `data/Entity.ts`

```ts
import { EntityBase } from "regira_modules/vue/entities"
import Attachment from "../attachments/Entity"

// The owned join row on the parent (`parent.attachments`).
export class EntityAttachment extends EntityBase {
    id = 0
    objectId?: number
    attachmentId?: number
    uri?: string
    newFileName?: string // edited name for an existing file — applied on flush
    attachment?: Attachment
    _deleted = false // marked-delete (undoable) — filtered out in the host service's prepareItem

    override get $id() {
        return this.id || "new"
    }
    override get $title() {
        return this.fileName
    }
    get fileName() {
        return this.attachment?.fileName
    }
    set fileName(v) {
        ;(this.attachment ??= new Attachment()).fileName = v
    }

    static create(v?: object): EntityAttachment {
        const a = (v as EntityAttachment)?.attachment
        if (a && !(a instanceof Attachment)) (v as EntityAttachment).attachment = Attachment.create(a)
        const item = Object.assign(new EntityAttachment(), v || {})
        if (item.id > 0 && item.fileName && !item.newFileName) item.newFileName = item.fileName
        return item
    }
}

export const Entity = EntityAttachment
export default EntityAttachment
```

## `data/functions.ts`

```ts
import { ref, watch } from "vue"
import { browse, fileToBlob, saveAs } from "regira_modules/utilities/file-utility"
import { enqueue } from "regira_modules/utilities/promise-utility"
import { useAxios } from "regira_modules/vue/http"
import Entity from "./Entity"
import Attachment from "../attachments/Entity"

// Stage a picked/dropped file: keep the Blob in memory + an object URL for instant preview/download.
export function createEntity(file: Blob & { name?: string }): Entity {
    const item = new Entity()
    item.attachment = Object.assign(new Attachment(), { _file: file, fileName: file.name, contentType: file.type, length: file.size })
    item.uri = URL.createObjectURL(file)
    return item
}

export function useEntityAttachments({ props, emit }: { props: { modelValue?: Array<Entity> }; emit: (e: "update:modelValue", v: Array<Entity>) => void }) {
    // Map incoming JSON rows to instances ONCE and own the array; emitting it up shares the refs, so in-place
    // edits (rename, _deleted) persist without re-mapping. Re-map only when the host swaps in a new record.
    const items = ref<Array<Entity>>((props.modelValue ?? []).map((x) => Entity.create(x)))
    watch(
        () => props.modelValue,
        (v) => {
            if (v && v !== items.value) items.value = v.map((x) => Entity.create(x))
        }
    )
    const sync = () => emit("update:modelValue", items.value)

    function handleBrowse(files: Array<Blob>) {
        const minId = Math.min(0, ...items.value.map((x) => x.id))
        files.forEach((f, i) => {
            const e = createEntity(f)
            e.id = minId - 1 - i // negative temp ids, like any new owned row
            items.value.push(e)
        })
        sync()
    }
    async function triggerBrowse(opts: { multiple?: boolean; accept?: string } = {}) {
        handleBrowse(await browse(opts))
    }

    return { items, sync, triggerBrowse, handleBrowse }
}

// Insert needs the parent's id before it can POST files → save the record first, then upload.
export async function insertWithAttachments<T extends { id: number; attachments?: Array<Entity> }>(api: string, item: T, insert: () => Promise<T | null>): Promise<T | null> {
    const attachments = item.attachments
    if (!attachments?.length) return await insert()
    delete item.attachments
    const saved = await insert()
    if (saved == null) return null // insert failed — nothing to attach files to
    saved.attachments = attachments
    await saveAll(api, saved)
    attachments.forEach((x) => delete x.attachment?._file) // free the blobs
    return saved
}
export async function updateWithAttachments<T extends { id: number; attachments?: Array<Entity> }>(api: string, item: T, update: () => Promise<T | null>): Promise<T | null> {
    await saveAll(api, item)
    item.attachments?.forEach((x) => delete x.attachment?._file) // free the blobs, like insert
    return await update()
}
async function saveAll(api: string, item: { id: number; attachments?: Array<Entity> }) {
    const pending = (item.attachments ?? []).filter((x) => x.attachment?._file != null && !x._deleted)
    await enqueue(
        pending.map((x) => async () => {
            // re-wrap under the edited name so the uploaded file carries it
            if (x.fileName && x.fileName !== x.attachment!._file!.name) x.attachment!._file = await fileToBlob(x.attachment!._file as File, x.fileName)
            const {
                data: { item: saved },
            } = await useAxios().upload(`${api}/${item.id}/files`, [x.attachment!._file!]) // field name "file"; baseURL-relative
            Object.assign(x, { id: saved.id, objectId: saved.objectId, attachmentId: saved.attachmentId })
        })
    )
}
export async function download(item: Entity) {
    await saveAs(item.attachment?._file ?? (await useAxios().getFile(item.uri!)), item.fileName)
}
```

## `overview/Overview.vue`

```vue
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
```

## `overview/ListItem.vue`

```vue
<template>
    <div class="input-group">
        <a :href="item.uri" class="btn btn-outline-info" @click.prevent="handleDownload"><Icon name="download" /></a>
        <!-- an existing file edits newFileName; a staged file edits fileName directly -->
        <input v-if="item.id > 0" v-model.lazy="item.newFileName" :placeholder="item.fileName" :readonly="readonly" maxlength="256" class="form-control" @change="emit('change')" />
        <input v-else v-model.lazy="item.fileName" :readonly="readonly" maxlength="256" class="form-control" @change="emit('change')" />
        <span class="input-group-text">{{ formatFileSize(item.attachment?.length ?? 0) }}</span>
        <button v-if="!readonly" type="button" class="btn btn-outline-danger" @click="toggleRemove"><Icon name="delete" /></button>
    </div>
</template>

<script setup lang="ts">
import { formatFileSize } from "regira_modules/utilities/file-utility"
import { Icon } from "regira_modules/vue/ui"
import type Entity from "../data/Entity"
import { download } from "../data/functions"

const emit = defineEmits<{ (e: "change"): void }>()
defineProps<{ readonly?: boolean }>()
const item = defineModel<Entity>({ required: true })

function toggleRemove() {
    item.value._deleted = !item.value._deleted // undoable
    emit("change")
}
async function handleDownload() {
    await download(item.value)
}
</script>
```

## `index.ts`

```ts
export { default as Entity } from "./data/Entity"
export * from "./data/functions"
export { default as Overview } from "./overview/Overview.vue"
export { default as ListItem } from "./overview/ListItem.vue"
export { default as Attachment } from "./attachments/Entity"
```

## Wire it into an owning entity

Three lines in the owner's slice + a tab. The owner's service is constructed with an
`AxiosWithFilesInstance` (see [entities.advanced.example.md](entities.advanced.example.md) §13):

```ts
// data/Entity.ts — the join field (import the model aliased)
import { type Entity as EntityAttachment } from "../../entity-attachments"
attachments?: Array<EntityAttachment>
```

```ts
// data/EntityService.ts — flush files on save; drop marked rows (deleted by omission)
import { insertWithAttachments, updateWithAttachments } from "../../entity-attachments/data/functions"
override async insert(item: Owner): Promise<Owner | null> {
    return await insertWithAttachments(this.config.api, item, () => super.insert(item))
}
override async update(item: Owner): Promise<Owner | null> {
    return await updateWithAttachments(this.config.api, item, () => super.update(item))
}
protected override prepareItem(item: Owner): Owner {
    item.attachments = item.attachments?.filter((x) => !x._deleted)
    return super.prepareItem(item)
}
```

```vue
<!-- details/Form.vue — attachments get their own tab -->
<template #files><EntityAttachments v-model="item.attachments" :readonly="readonly" /></template>
<!-- import { Overview as EntityAttachments } from "../../entity-attachments" -->
```

> **Back-end:** register the owner's attachments (`WithAttachments` + `HasAttachments<>`); expose the
> download **anonymously** if `<img src>` tags render thumbnails (a guarded download 401s — the tag sends no
> `Authorization` header). See `Regira.Entities` → _Public (anonymous) attachment downloads_.
