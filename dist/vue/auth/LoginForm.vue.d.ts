import { type LoginFormProps } from "./useLoginForm";
declare const __VLS_export: import("vue").DefineComponent<LoginFormProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    success: (username?: string | undefined) => any;
    forgotPassword: (username?: string | undefined) => any;
    signingIn: (username?: string | undefined) => any;
    fail: (username?: string | undefined) => any;
}, string, import("vue").PublicProps, Readonly<LoginFormProps> & Readonly<{
    onSuccess?: ((username?: string | undefined) => any) | undefined;
    onForgotPassword?: ((username?: string | undefined) => any) | undefined;
    onSigningIn?: ((username?: string | undefined) => any) | undefined;
    onFail?: ((username?: string | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
