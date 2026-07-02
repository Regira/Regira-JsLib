<script setup lang="ts">
import { Icon } from "regira_modules/vue/ui"
import type { INavItem } from "regira_modules/vue/entities"
import { useNavigation } from "./functions"
const { dashboardTree } = useNavigation()
const to = (v: INavItem) => ({ name: v.routeName, query: v.initialQuery || {} })
</script>
<template>
    <div v-if="dashboardTree">
        <template v-for="group in dashboardTree.roots" :key="group.value.id">
            <section v-if="group.children.length" class="mb-4">
                <h3 class="mb-3"><Icon :name="group.value.icon ?? ''" class="me-1" /> {{ $t(group.value.title) }}</h3>
                <div class="row">
                    <div v-for="node in group.children" :key="node.value.id" class="col-6 col-md-3 col-lg-2 mb-3 text-center">
                        <router-link :to="to(node.value as INavItem)" class="btn btn-link d-block">
                            <Icon :name="node.value.icon ?? ''" size="xl" />
                            <div>{{ $t(node.value.title) }}</div>
                        </router-link>
                    </div>
                </div>
            </section>
        </template>
    </div>
</template>
