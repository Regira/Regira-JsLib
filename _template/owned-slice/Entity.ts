import { EntityBase } from "regira_modules/vue/entities"

// An owned child row of __Parent__ (back-end `e.Related(x => x.__Children__)`). Rows are edited inside the
// parent form and persisted with the parent's single `save()`; removal is a `_deleted` mark, never a splice.
export class __Child__ extends EntityBase {
    id: number = 0 // real for existing rows; useOwnedCollection mints a negative temp id for new rows
    __parent__Id?: number // FK back to the parent (set server-side / on add)
    _deleted?: boolean // marked-for-removal — the parent's EntityService.prepareItem drops these before save

    // TODO: replace these two placeholder scalars with your real fields — rename here AND in Overview.vue in the same pass
    description = ""
    quantity = 0

    override get $id(): string | number {
        return this.id || "new"
    }
    // The row label shown in list/selector skins. TODO: point this at your real title-like field
    // after renaming the placeholder scalars above (same pass as $id / Overview.vue).
    override get $title(): string | undefined {
        return this.description
    }
}

export const Entity = __Child__
export default __Child__
