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
