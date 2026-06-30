import { defineStore } from "pinia"
import { get } from "regira_modules/vue/ioc"
import { createStore, type IEntityService } from "regira_modules/vue/entities"
import Entity from "./Entity"

export const useEntityStore = defineStore(Entity.name, () => {
    const service = get<IEntityService<Entity>>(Entity.name)!
    return createStore<Entity>(service, Entity.name) // pooled, reactive shared cache
})

export default useEntityStore
