import { describe, test, expect } from "vitest"
import { createApp, defineComponent, h, nextTick, reactive, ref } from "vue"
import InputSelectorInline from "../../../src/vue/entities/form/InputSelectorInline.vue"

function mount(rowsRef, extraProps = {}) {
    const host = document.createElement("div")
    document.body.appendChild(host)
    let slotScope = null
    const app = createApp(
        defineComponent({
            setup() {
                return () =>
                    h(
                        InputSelectorInline,
                        {
                            modelValue: rowsRef.value,
                            "onUpdate:modelValue": (v) => (rowsRef.value = v),
                            excludeKey: (row) => row.facetId,
                            ...extraProps,
                        },
                        {
                            chip: ({ row }) => h("span", { class: "chip-label" }, row.title),
                            selector: (scope) => {
                                slotScope = scope
                                return h("span", { class: "selector-slot" })
                            },
                        }
                    )
            },
        })
    )
    app.mount(host)
    return { app, host, getSlotScope: () => slotScope }
}

describe("InputSelectorInline", () => {
    test("removal marks _deleted (undoable) — it never splices the row", async () => {
        const rows = ref(reactive([{ facetId: 1, title: "Red" }, { facetId: 2, title: "Blue" }]))
        const { host } = mount(rows)

        const buttons = host.querySelectorAll("button")
        buttons[0].click()
        await nextTick()

        expect(rows.value.length).toBe(2) // still present
        expect(rows.value[0]._deleted).toBe(true)
        expect(host.querySelector(".is-deleted")).toBeTruthy()

        buttons[0].click() // toggle = restore
        await nextTick()
        expect(rows.value[0]._deleted).toBe(false)
        expect(host.querySelector(".is-deleted")).toBeFalsy()
    })

    test("exclude covers every row (marked ones included) and add() appends via the slot", async () => {
        const rows = ref(reactive([{ facetId: 1, title: "Red", _deleted: true }]))
        const { getSlotScope } = mount(rows)

        expect(getSlotScope().exclude).toEqual([1]) // marked row still excluded from the picker

        getSlotScope().add({ facetId: 3, title: "Green" })
        await nextTick()
        expect(rows.value.length).toBe(2)
        expect(rows.value[1].facetId).toBe(3)
        expect(getSlotScope().exclude).toEqual([1, 3])
    })
})
