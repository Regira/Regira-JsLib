type __VLS_Props = {
    username?: string;
    title?: string;
    isVisible?: boolean;
};
declare var __VLS_8: {
    username: string | undefined;
};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_8) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    success: (username?: string | undefined) => any;
    forgotPassword: (username?: string | undefined) => any;
    signingIn: (username?: string | undefined) => any;
    fail: (username?: string | undefined) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSuccess?: ((username?: string | undefined) => any) | undefined;
    onForgotPassword?: ((username?: string | undefined) => any) | undefined;
    onSigningIn?: ((username?: string | undefined) => any) | undefined;
    onFail?: ((username?: string | undefined) => any) | undefined;
}>, {
    title: string;
    isVisible: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
