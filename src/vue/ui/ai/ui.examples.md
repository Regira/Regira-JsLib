# Regira JsLib UI — Examples

Verify props/signatures in [ui.signatures.md](ui.signatures.md). Imports use the demo alias
`@/regira_modules`; drop `@/` for a plain npm install.

## Install plugins (startup)

```ts
import { iconPlugin, feedbackPlugin, loadingPlugin, modalPlugin, pagingPlugin, screenPlugin } from "@/regira_modules/vue/ui"

app.use(screenPlugin)
app.use(feedbackPlugin)
app.use(iconPlugin, { source: "bs", icons: appIcons })   // register Bootstrap icons
app.use(loadingPlugin, { img: "/loading.svg" })
app.use(modalPlugin)
app.use(pagingPlugin, { defaultPageSize: 10 })
```

## Overview building blocks

```vue
<script setup lang="ts">
import { Paging, LoadingContainer, Feedback } from "@/regira_modules/vue/ui"
import { useSearchView, useRouteOverview } from "@/regira_modules/vue/entities"
import config from "../config/config"
const { service } = useEntityStore()
const { pagingInfo, items, itemsCount, isLoading, feedback, searchHandler } =
    useSearchView({ service, searchObject: new SearchObject(), defaultPageSize: config.defaultPageSize })
const { updateOverviewRoute } = useRouteOverview({ searchObject, pagingInfo, handler: searchHandler, defaultPageSize: config.defaultPageSize })
</script>
<template>
  <Feedback :feedback="feedback" />
  <LoadingContainer :is-loading="isLoading">
    <!-- render items -->
  </LoadingContainer>
  <Paging v-model="pagingInfo" :count="itemsCount" @change="updateOverviewRoute()" />
</template>
```

## Tabs + responsive layout

```vue
<script setup lang="ts">
import { computed } from "vue"
import { TabContainer, Tab, useScreen } from "@/regira_modules/vue/ui"
const { screen } = useScreen()
const tabs = computed(() => [
    Tab.create("form", { icon: "form", title: "Form", isDefault: true }),
    !screen.isLarge ? Tab.create("more", { icon: "list", title: "More" }) : null,
].filter(Boolean))
</script>
<template>
  <TabContainer :tabs="tabs">
    <!-- tab panes -->
  </TabContainer>
</template>
```

## App-wide feedback

```ts
// via the global (after feedbackPlugin)
app.config.globalProperties.$feedback.success("Saved")

// or a local instance
import { useFeedback } from "@/regira_modules/vue/ui"
const feedback = useFeedback({ autoHideDelay: 3000 })
feedback.fail("Could not save", { title: "required" })
```

## Modal

```vue
<script setup lang="ts">
import { ref } from "vue"
import { DefaultModal, ModalType } from "@/regira_modules/vue/ui/modal"
import "@/regira_modules/vue/ui/modal/style.scss"
const isVisible = ref(false)
</script>
<template>
  <DefaultModal :is-visible="isVisible" title="Confirm" :type="ModalType.warning"
                @submit="onSubmit" @cancel="isVisible = false" @close="isVisible = false">
    Are you sure?
  </DefaultModal>
</template>
```

## Icons

```vue
<script setup lang="ts">
import { BsIcon, IconButton } from "@/regira_modules/vue/ui"
</script>
<template>
  <BsIcon name="bi bi-box-seam" size="lg" />
  <IconButton icon="bi bi-trash" @click="remove" />
</template>
```

## Autocomplete

```vue
<script setup lang="ts">
import { Autocomplete } from "@/regira_modules/vue/ui"
import { get } from "@/regira_modules/vue/ioc"
const service = get<IEntityService<Product>>("Product")!
</script>
<template>
  <Autocomplete v-model="selected"
                :search="(term) => service.list({ q: term })"
                :display-item-formatter="(p) => p?.$title ?? ''"
                @select="onSelect" />
</template>
```

## Date input

```vue
<script setup lang="ts">
import { DateInput } from "@/regira_modules/vue/ui"
</script>
<template>
  <DateInput v-model="item.publishedOn" culture="nl-BE" />
</template>
```

## See also

- [ui.instructions.md](ui.instructions.md) · [ui.signatures.md](ui.signatures.md)
