import { EntityBase } from "regira_modules/vue/entities"

export class __Entity__ extends EntityBase {
    id: number = 0
    title: string
    // TODO: your fields, e.g.
    // code?: string
    // barId?: number
    // bar?: Bar                          // a related entity (navigation property)

    created?: Date
    lastModified?: Date

    override get $id(): string | number {
        return this.id || "new" // "new" (or null) marks an unsaved instance → save() inserts
    }
    override get $title(): string | undefined {
        return this.title // TODO: the human label (selectors, breadcrumbs, nav)
    }
}

export const Entity = __Entity__
export default __Entity__
