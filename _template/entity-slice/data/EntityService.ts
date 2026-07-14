import type { AxiosInstance } from "axios"
import { EntityServiceBase, type IConfig } from "regira_modules/vue/entities"
import Entity from "./Entity"

export class EntityService extends EntityServiceBase<Entity> {
    constructor(axios: AxiosInstance, config: IConfig) {
        super(axios, config)
    }

    // Owned child collections use the `_deleted` mark (never splice): removed rows are filtered out here so
    // the server deletes them by omission. Add one filter line per owned collection; `super` strips root `_`-fields.
    protected override prepareItem(item: Entity): Entity {
        // TODO (owned collections only): item.children = item.children?.filter((x) => !x._deleted) || []
        return super.prepareItem(item)
    }

    override toEntity(item: object): Entity {
        return item instanceof Entity ? item : Object.assign(this.createInstance(Entity as new () => Entity), item || {})
    }
}

export default EntityService
