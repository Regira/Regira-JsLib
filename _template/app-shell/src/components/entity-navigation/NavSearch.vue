<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { IconButton } from "regira_modules/vue/ui"
import { useNavigation } from "./functions"
const router = useRouter()
const q = ref("")
const { searchItemConfig } = useNavigation()
function handleSearch() {
    const cfg = searchItemConfig.value
    if (!cfg) return
    router.push({ name: `${cfg.key}Overview`, query: { q: q.value } })
    q.value = ""
}
</script>
<template>
    <form v-if="searchItemConfig" class="d-flex" @submit.prevent="handleSearch">
        <input v-model.trim="q" type="search" class="form-control me-2" :placeholder="`Search ${searchItemConfig.overviewTitle}`" />
        <IconButton icon="search" class="btn-outline-primary" type="submit" />
    </form>
</template>
