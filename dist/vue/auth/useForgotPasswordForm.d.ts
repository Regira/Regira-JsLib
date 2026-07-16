export interface ForgotPasswordFormEmits {
    (e: "success", username?: string): void;
    (e: "fail", ex?: any): void;
    (e: "login", username?: string): void;
}
export interface ForgotPasswordFormProps {
    username?: string;
}
export type ForgotPasswordModalProps = {
    username?: string;
    isVisible?: boolean;
};
export type ForgotPasswordModalSlots = {
    /** the forgot-password form; scoped with the initial username */
    default?(props: {
        username?: string;
    }): any;
};
export declare function useForgotPasswordForm(props: ForgotPasswordFormProps, emit: ForgotPasswordFormEmits, options: {
    siteUrl: string;
    siteName?: string;
}): {
    username: import("vue").Ref<string, string>;
    isLoading: import("vue").Ref<boolean, boolean>;
    isFormValid: import("vue").ComputedRef<boolean>;
    isSuccess: import("vue").Ref<boolean | undefined, boolean | undefined>;
    handleSubmit: () => Promise<void>;
};
