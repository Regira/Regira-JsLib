import type { IConfig } from "regira_modules/vue/entities"
import Entity from "../data/Entity"

const api = "/__entities__" // TODO: API resource path (relative to the axios baseURL)

const config: IConfig = {
    id: Entity.name,
    key: "__Entity__", // TODO: route-name prefix + icon key (conventionally = Entity.name)
    isComplex: false, // TODO: true → tabbed form + Details-page "new" for create/edit (both tiers page via /search)

    routePrefix: "__entities__", // TODO: URL path segment
    baseQueryParams: { includes: [] }, // TODO: e.g. { includes: ["Bar"] } — List/Search return no nested data unless the client sends ?includes=; mirror the API's [Flags] enum
    initialQuery: {},

    overviewTitle: "__entities__", // i18n keys — add matching entries to public/data/translations.json, or the nav renders the raw key
    detailsTitle: "__entity__",
    description: "__entity__.description",
    icon: "bi bi-question-circle", // TODO: a Bootstrap-Icons class

    defaultPageSize: 10, // initial overview page size (raise it to show more per page, up to the server's MaxPageSize)

    api, // every *Url below defaults to `api` when omitted; keep only the ones you override
    searchUrl: api + "/search", // counted search endpoint — the overview pages through it (every controller exposes /search)
    saveUrl: api, // resource base — update/remove append /{$id} themselves
}

export default config
