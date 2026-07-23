import { ref, watch, onMounted } from "vue"
import { min } from "../../../utilities/array-utility"
import { useVModelField } from "../../vue-helper"
import type { IEntity, SaveResult } from "../abstractions"

type Input<T> = {
    props: {
        modelValue?: Array<T>
    }
    emit: any
}

export function useOwnedCollection<T extends IEntity & { id: number }>({ props, emit }: Input<T>) {
    //const items = ref([]) as Ref<Array<T>>
    const items = useVModelField<Array<T>>(props, emit)
    const createEmptyItem = () => {
        return {
            id: 0,
        } as T
    }
    const newItem = ref<T>()

    async function resetNewItem() {
        newItem.value = createEmptyItem()
    }
    // sorting
    const handleSort = (e: any) => {
        // no need to emit, draggable component handles this with computed items setter
        //emit("update:modelValue", items.value)
        emit("sort", e)
    }
    function handleSave({ saved, isNew }: SaveResult<T>) {
        if (isNew) {
            const minId = Math.min((min(items.value, (x) => x.id) as number | undefined) ?? 0, 0) - 1
            saved.id = minId
            const newItems = items.value.concat([saved])
            items.value = newItems
            resetNewItem()
        }
    }

    // don't use watchEffect -> bad emit timing?
    watch(
        () => props.modelValue,
        () => (items.value = props.modelValue || [])
    )
    onMounted(async () => {
        items.value = props.modelValue || []
        await resetNewItem()
    })

    return {
        items,
        newItem,

        resetNewItem,
        handleSort,
        handleSave,
    }
}

export default useOwnedCollection
