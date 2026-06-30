import type { IConfig } from "regira_modules/vue/entities"
import Entity from "../data/Entity"

const api = "/__entities__" // TODO: API resource path (relative to the axios baseURL)

const config: IConfig = {
    id: Entity.name,
    key: "__Entity__", // TODO: route-name prefix + icon key (conventionally = Entity.name)
    isComplex: false, // TODO: true → tabbed form + /search endpoint + Details-page "new"

    routePrefix: "__entities__", // TODO: URL path segment
    baseQueryParams: { includes: [] }, // TODO: server-side eager-loads, e.g. { includes: ["Bar"] }
    initialQuery: {},

    overviewTitle: "__entities__", // TODO: i18n keys
    detailsTitle: "__entity__",
    description: "__entity__.description",
    icon: "bi bi-question-circle", // TODO: a Bootstrap-Icons class

    defaultPageSize: 10, // 0 = fetch all (typical for a small lookup)

    api, // every *Url below defaults to `api` when omitted; keep only the ones you override
    searchUrl: api, // simple entity → list endpoint (no /search). Complex? set `api + "/search"`
    saveUrl: api, // resource base — update/remove append /{$id} themselves
}

export default config
