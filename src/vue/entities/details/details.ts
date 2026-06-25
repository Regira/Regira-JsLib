import { ref, computed, watch, onMounted, type Ref, type ComputedRef } from "vue"
import { useRouter, type RouteRecordRaw } from "vue-router"
import { useFeedback, type FeedbackOut } from "../../ui/feedback"
import type { IEntity } from "../abstractions/IEntity"
import type { IEntityService } from "../abstractions/IEntityService"

export type DetailsOut<T extends IEntity> = {
    item: Ref<T | null>
    routeId: ComputedRef<string>
    isNew: ComputedRef<boolean>

    overviewUrl?: RouteRecordRaw | string
    isForm: ComputedRef<boolean>
    isFiche: ComputedRef<boolean>
    hasFiche: ComputedRef<boolean>

    isLoading: Ref<boolean>
    feedback: FeedbackOut

    load(): Promise<void>
}

export function useDetails<T extends IEntity>(entityService: IEntityService<T>, feedback = useFeedback()): DetailsOut<T> {
    const router = useRouter()
    const routeId = computed(() => router.currentRoute.value.params.id as string)
    const isNew = computed(() => routeId.value === "new")
    const item = ref<T | null>(null) as Ref<T | null>
    const isLoading = ref(false)

    function getOverviewUrl() {
        function isOverviewUrl(url?: string) {
            if (!url) {
                return false
            }

            // remove queryString
            const queryStartLocation = url.indexOf("?")
            if (queryStartLocation > -1) {
                url = url.substring(0, queryStartLocation)
            }
            return router.options.routes.some((r) => r.path == url && r.name?.toString().includes("Overview"))
        }
        function getDefaultOverviewRoute() {
            const currentRoute = router.currentRoute.value
            return router.options.routes.find((r) => r.name == currentRoute.name?.toString().replace(/Form|Fiche/, "Overview"))
        }

        const prevUrl = router.options.history.state.back?.toString()
        const isPrevUrlOverview = isOverviewUrl(prevUrl)

        return isPrevUrlOverview ? prevUrl : getDefaultOverviewRoute()
    }

    const overviewUrl = getOverviewUrl()
    const isForm = computed(() => !!router.currentRoute.value.name?.toString().includes("Form"))
    const isFiche = computed(() => !!router.currentRoute.value.name?.toString().includes("Fiche"))
    const hasFiche = computed(() =>
        router.options.routes
            .flatMap((r) => [r, ...(r.children || [])])
            .some((r) => r.name == router.currentRoute.value.name?.toString().replace("Form", "Fiche"))
    )

    async function setItem() {
        if (isNew.value) {
            item.value = await entityService.newEntity({})
            return
        }
        isLoading.value = true
        try {
            item.value = await entityService.details(routeId.value)
        } catch (ex: any) {
            console.error(`Fetching details failed for #${routeId.value}`, { id: routeId.value, ex })
            feedback.fail(
                `Fetching item #${routeId.value} failed`,
                ex.response.status == 403 ? "Not allowed" : ex.response.status == 404 ? "Not found" : ex.response.data
            )
        } finally {
            isLoading.value = false
        }
    }

    watch(router.currentRoute, async (newRoute, oldRoute) => {
        // only when staying on the same page
        if (newRoute.name === oldRoute.name && oldRoute.params.id != "new" && newRoute.params.id !== oldRoute.params.id) {
            await setItem()
        }
    })

    onMounted(setItem)

    return {
        item,
        routeId,
        isNew,

        overviewUrl,
        isForm,
        isFiche,
        hasFiche,

        isLoading,
        feedback,

        load: setItem,
    }
}

export default useDetails
