import { SearchObjectBase, ArchivedFilter } from "regira_modules/vue/entities"

export class EntitySearchObject extends SearchObjectBase {
    // `q` (free-text) is inherited from SearchObjectBase. Add your filters:
    title?: string // TODO: your filter fields — placeholder; rename/remove it here AND in FilterAdv.vue
    // barId?: number | Array<number>     // arrays serialize as repeated query keys

    minCreated?: Date
    maxCreated?: Date
    archived?: ArchivedFilter // `only` = recycle bin, `included` = live + archived; leave unset to hide archived rows
}

export default EntitySearchObject
