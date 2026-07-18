export interface ResetPasswordFormEmits {
    (e: "success"): void;
    (e: "fail", ex?: any): void;
    (e: "login"): void;
}
export interface ResetPasswordFormProps {
    /** reset token from the recovery link (e-mail) */
    token: string;
    /** account name for the (hidden) username field, so password managers can link the new password */
    username?: string;
}
export declare function useResetPasswordForm(props: ResetPasswordFormProps, emit: ResetPasswordFormEmits): {
    password: import("vue").Ref<string, string>;
    confirmPassword: import("vue").Ref<string, string>;
    isLoading: import("vue").Ref<boolean, boolean>;
    isSuccess: import("vue").Ref<boolean | undefined, boolean | undefined>;
    passwordsMatch: import("vue").ComputedRef<boolean>;
    isFormValid: import("vue").ComputedRef<boolean>;
    handleSubmit: () => Promise<void>;
};
