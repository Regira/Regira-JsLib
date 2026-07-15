<template>
    <form class="rg-change-password-form" @submit.prevent="handleSubmit">
        <div v-if="isSuccess === false" class="mb-3">
            <div class="bg-danger border rounded text-light p-2">Unfortunately, changing the password failed.</div>
        </div>
        <div v-if="isSuccess" class="mb-3">
            <div class="bg-success border rounded text-light p-2">Password changed.</div>
        </div>
        <div class="row mb-3">
            <label class="col-sm-3 col-form-label">Current password</label>
            <div class="col-sm-9">
                <input type="password" class="form-control" autocomplete="current-password" v-model="currentPassword" :disabled="isLoading" />
            </div>
        </div>
        <div class="row mb-3">
            <label class="col-sm-3 col-form-label">New password</label>
            <div class="col-sm-9">
                <input type="password" class="form-control" autocomplete="new-password" v-model="newPassword" :disabled="isLoading" />
            </div>
        </div>
        <div class="row mb-3">
            <label class="col-sm-3 col-form-label">Confirm password</label>
            <div class="col-sm-9">
                <input
                    type="password"
                    class="form-control"
                    :class="{ 'is-invalid': confirmPassword && !passwordsMatch }"
                    autocomplete="new-password"
                    v-model="confirmPassword"
                    :disabled="isLoading"
                />
                <div class="invalid-feedback">Passwords don't match.</div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-9 offset-sm-3">
                <button type="submit" class="btn btn-primary" :disabled="isLoading || !isFormValid">Change password</button>
            </div>
        </div>
    </form>
</template>

<script setup lang="ts">
import { useChangePasswordForm, type ChangePasswordFormEmits } from "regira_modules/vue/auth"

const emit = defineEmits<ChangePasswordFormEmits>()

const { currentPassword, newPassword, confirmPassword, isLoading, isSuccess, passwordsMatch, isFormValid, handleSubmit } = useChangePasswordForm(emit)
</script>
