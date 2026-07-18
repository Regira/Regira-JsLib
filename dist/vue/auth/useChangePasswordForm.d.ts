export interface ChangePasswordFormEmits {
    (e: "success"): void;
    (e: "fail", ex?: any): void;
}
export interface ChangePasswordFormProps {
    /** account name for the (hidden) username field, so password managers can link the new password */
    username?: string;
}
export declare function useChangePasswordForm(emit: ChangePasswordFormEmits): {
    currentPassword: import("vue").Ref<string, string>;
    newPassword: import("vue").Ref<string, string>;
    confirmPassword: import("vue").Ref<string, string>;
    isLoading: import("vue").Ref<boolean, boolean>;
    isSuccess: import("vue").Ref<boolean | undefined, boolean | undefined>;
    passwordsMatch: import("vue").ComputedRef<boolean>;
    isFormValid: import("vue").ComputedRef<boolean>;
    handleSubmit: () => Promise<void>;
};
