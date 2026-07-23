type AuthService = {
    login(email: string, password: string): Promise<unknown>;
    refresh(refreshToken: string): Promise<unknown>;
};
type IdentityState = {
    isAuthenticated: boolean;
    refreshToken?: string;
    expiresAt?: Date;
    expiresIn?: number;
    [key: string]: unknown;
};
/**
 * Handles login/logoff and saves state of current identity
 * automatically refreshes token when autoRefresh is enabled
 */
declare class IdentityManager {
    private _service;
    private _autoRefreshTimer?;
    private _autoRefresh;
    state: IdentityState;
    constructor({ authenticationService, autoRefresh }: {
        authenticationService: AuthService;
        autoRefresh?: boolean;
    });
    get autoRefresh(): boolean;
    set autoRefresh(value: boolean);
    login(email: string, password: string): Promise<unknown[]>;
    refresh(): Promise<unknown[]>;
    logoff(): Promise<unknown[]>;
    _setState(response?: unknown): void;
    _checkAutoRefresh(): void;
}
export default IdentityManager;
