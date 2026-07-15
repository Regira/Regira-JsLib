export type LoginInput = {
    username: string;
    password: string;
};
export interface LoginFormEmits {
    (e: "forgotPassword", username?: string): void;
    (e: "signingIn", username?: string): void;
    (e: "success", username?: string): void;
    (e: "fail", username?: string): void;
}
export interface LoginFormProps {
    username?: string;
}
export type LoginModalProps = {
    username?: string;
    title?: string;
    /** visibility is a real prop (defaults on); prefer gating the whole component with v-if —
     * it unmounts mask + dialog in one go and cannot strand a leave-transition */
    isVisible?: boolean;
};
export type LoginModalSlots = {
    /** replace the whole login form; scoped with the initial username */
    default?(props: {
        username?: string;
    }): any;
};
export declare function useLoginForm(props: LoginFormProps, emit: LoginFormEmits): {
    username: import("vue").Ref<string, string>;
    password: import("vue").Ref<string, string>;
    failed: import("vue").Ref<boolean, boolean>;
    signingIn: import("vue").Ref<boolean, boolean>;
    isLockedOut: import("vue").Ref<boolean, boolean>;
    handleSubmit: () => Promise<void>;
    handleForgotPassword: () => void;
};
