<script setup lang="ts">
import { computed } from "vue" // @auth:only
import { Feedback, LoadingContainer } from "regira_modules/vue/ui"
import { LoginModal, LoginForm, useAuthStore } from "regira_modules/vue/auth" // @auth:only
import { AppStatus } from "regira_modules/vue/app"
import TheHeader from "@/components/layout/TheHeader.vue"
import TheFooter from "@/components/layout/TheFooter.vue"
import Main from "@/components/layout/Main.vue"

// @auth:block-start
const authStore = useAuthStore()
// isRequired is route-driven (auth enabled + no allowAnonymous meta), so on any protected route — home
// included — an unauthenticated visitor gets the sign-in modal immediately, before any 401.
const showLogin = computed(() => authStore.isRequired && !authStore.isAuthenticated)
// @auth:block-end
</script>

<template>
    <div class="page">
        <header class="container-fluid bg-light"><TheHeader /></header>
        <section class="container-fluid position-relative overflow-hidden">
            <Feedback :feedback="$feedback" :enable-error-popup="true" />
        </section>
        <main class="container-fluid">
            <!-- @auth:block-start -->
            <LoadingContainer :is-loading="$appStatus !== AppStatus.Ready && (!$auth.enabled || $auth.isAuthenticated)">
            <!-- @auth:block-end -->
            <!-- @noauth:block-start -->
            <LoadingContainer :is-loading="$appStatus !== AppStatus.Ready">
            <!-- @noauth:block-end -->
                <Main />
            </LoadingContainer>
        </main>
        <footer class="container-fluid bg-light"><TheFooter /></footer>

        <!-- @auth:block-start -->
        <Teleport to="#loginModal">
            <!-- v-if (not :is-visible): unmounting removes mask + dialog atomically — no stranded overlay -->
            <LoginModal v-if="showLogin" :title="$t('signIn')"><LoginForm /></LoginModal>
        </Teleport>
        <!-- @auth:block-end -->
    </div>
</template>
