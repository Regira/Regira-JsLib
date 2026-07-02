import { EntityBase } from "regira_modules/vue/entities"

export class __Entity__ extends EntityBase {
    id: number = 0
    title = "" // initialize non-optional fields (strictPropertyInitialization); optional ones get `?`
    // TODO: your fields, e.g.
    // code?: string
    // barId?: number
    // bar?: Bar                          // a related entity (navigation property)
    // status?: Status                    // mirror a C# enum as a const object + union type, never a TS `enum`
    //                                    // (erasableSyntaxOnly rejects enums — see entities.setup.md → Tooling)

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
