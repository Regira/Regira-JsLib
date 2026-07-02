import type { App } from "vue";
declare const _default: {
    install(app: App<Element>, { DefaultModal }?: {
        DefaultModal: {
            new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<{
                title?: string;
                isVisible: boolean;
                showHeader?: boolean;
                showFooter?: boolean;
                fullWidth?: boolean;
                size?: "sm" | "md" | "lg" | "xl";
                type?: import("./modal").ModalType;
            }> & Readonly<{
                onCancel?: (() => any) | undefined;
                onClose?: (() => any) | undefined;
                onSubmit?: (() => any) | undefined;
            }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
                cancel: () => any;
                close: () => any;
                submit: () => any;
            }, import("vue").PublicProps, {
                type: import("./modal").ModalType;
                showHeader: boolean;
                showFooter: boolean;
            }, false, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
                P: {};
                B: {};
                D: {};
                C: {};
                M: {};
                Defaults: {};
            }, Readonly<{
                title?: string;
                isVisible: boolean;
                showHeader?: boolean;
                showFooter?: boolean;
                fullWidth?: boolean;
                size?: "sm" | "md" | "lg" | "xl";
                type?: import("./modal").ModalType;
            }> & Readonly<{
                onCancel?: (() => any) | undefined;
                onClose?: (() => any) | undefined;
                onSubmit?: (() => any) | undefined;
            }>, {}, {}, {}, {}, {
                type: import("./modal").ModalType;
                showHeader: boolean;
                showFooter: boolean;
            }>;
            __isFragment?: never;
            __isTeleport?: never;
            __isSuspense?: never;
        } & import("vue").ComponentOptionsBase<Readonly<{
            title?: string;
            isVisible: boolean;
            showHeader?: boolean;
            showFooter?: boolean;
            fullWidth?: boolean;
            size?: "sm" | "md" | "lg" | "xl";
            type?: import("./modal").ModalType;
        }> & Readonly<{
            onCancel?: (() => any) | undefined;
            onClose?: (() => any) | undefined;
            onSubmit?: (() => any) | undefined;
        }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
            cancel: () => any;
            close: () => any;
            submit: () => any;
        }, string, {
            type: import("./modal").ModalType;
            showHeader: boolean;
            showFooter: boolean;
        }, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
            $slots: {
                title?: (props: {}) => any;
            } & {
                'header-close-button'?: (props: {
                    handleClose: () => void;
                }) => any;
            } & {
                default?: (props: {}) => any;
            } & {
                buttons?: (props: {}) => any;
            } & {
                'footer-close-button'?: (props: {
                    handleCancel: () => void;
                }) => any;
            } & {
                'footer-submit-button'?: (props: {
                    handleClose: () => void;
                }) => any;
            };
        });
    }): void;
};
export default _default;
