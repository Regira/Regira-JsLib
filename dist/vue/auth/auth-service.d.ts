import type { AxiosInstance } from "axios";
import type { ITokenManager } from "./token-manager";
import { type IAuthData } from "./AuthData";
import type { IAuthOptions } from "./auth";
export type IAuthenticateInput = {
    token: string;
    isAuthenticated: boolean;
};
export type IChangePasswordInput = {
    newPassword: string;
    currentPassword: string;
};
export type IForgotPasswordInput = {
    username: string;
    siteUrl: string;
    siteName?: string;
};
export type IResetPasswordInput = {
    token: string;
    password: string;
};
export interface IAuthService {
    /**
     * Owns `clientApp` (the JWT audience) as plain state — the store and `$auth` read through to it rather
     * than copying it. Change it through the auth store's `setClientApp()`: that is the path that notifies
     * Vue. Mutating a field here directly is seen by later reads but re-renders nothing.
     */
    readonly options: IAuthOptions;
    authenticate({ token, isAuthenticated }: IAuthenticateInput): IAuthData;
    login(username: string, password: string): Promise<IAuthData>;
    refresh(o?: Record<string, unknown>): Promise<IAuthData>;
    validateToken(): Promise<IAuthData>;
    logout(): void;
    changePassword(input: IChangePasswordInput): Promise<void>;
    forgotPassword(input: IForgotPasswordInput): Promise<void>;
    resetPassword(input: IResetPasswordInput): Promise<void>;
}
export declare const emptyAuthData: () => IAuthData;
export declare class AuthService implements IAuthService {
    private axios;
    private tokenManager;
    options: IAuthOptions;
    constructor(axios: AxiosInstance, tokenManager: ITokenManager, options?: IAuthOptions);
    authenticate({ token, isAuthenticated }: IAuthenticateInput): IAuthData;
    login(username: string, password: string): Promise<IAuthData>;
    refresh(queryParams?: Record<string, unknown>): Promise<IAuthData>;
    validateToken(): Promise<IAuthData>;
    logout(): void;
    changePassword(input: IChangePasswordInput): Promise<void>;
    forgotPassword(input: IForgotPasswordInput): Promise<void>;
    resetPassword(input: IResetPasswordInput): Promise<void>;
}
export default AuthService;
