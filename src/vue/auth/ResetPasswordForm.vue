<template>
    <form class="rg-reset-password-form" @submit.prevent="handleSubmit">
        <div v-if="isSuccess === false" class="mb-3">
            <div class="bg-danger border rounded text-light p-2">Unfortunately, resetting the password failed.</div>
        </div>
        <div v-if="isSuccess" class="mb-3">
            <div class="bg-success border rounded text-light p-2">
                Password reset.
                <button type="button" class="btn btn-link p-0 align-baseline" @click="emit('login')">Sign in</button>
            </div>
        </div>
        <div class="row mb-3">
            <label class="col-sm-3 col-form-label">New password</label>
            <div class="col-sm-9">
                <input type="password" class="form-control" autocomplete="new-password" v-model="password" :disabled="isLoading" />
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
                <button type="submit" class="btn btn-primary" :disabled="isLoading || !isFormValid">Reset password</button>
            </div>
        </div>
    </form>
</template>

<script setup lang="ts">
import { useResetPasswordForm, type ResetPasswordFormProps, type ResetPasswordFormEmits } from "./useResetPasswordForm"

const emit = defineEmits<ResetPasswordFormEmits>()
const props = defineProps<ResetPasswordFormProps>()

const { password, confirmPassword, isLoading, isSuccess, passwordsMatch, isFormValid, handleSubmit } = useResetPasswordForm(props, emit)
</script>
