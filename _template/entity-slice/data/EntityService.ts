import type { AxiosInstance } from "axios"
import { EntityServiceBase, type IConfig } from "regira_modules/vue/entities"
import Entity from "./Entity"

export class EntityService extends EntityServiceBase<Entity> {
    constructor(axios: AxiosInstance, config: IConfig) {
        super(axios, config)
    }

    // Add this override only if the entity owns child collections — the `_deleted` pattern: drop rows the
    // user removed (marked `_deleted` by useOwnedCollection) so the server deletes them. One per collection:
    // protected override prepareItem(item: Entity): Entity {
    //     item.children = item.children?.filter((x) => !x._deleted) || []
    //     return item
    // }

    override toEntity(item: object): Entity {
        return item instanceof Entity ? item : Object.assign(this.createInstance(Entity as new () => Entity), item || {})
    }
}

export default EntityService
