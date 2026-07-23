export interface IServiceProvider {
    get<T = any>(key: any): T | undefined;
    add<T = any>(key: any, factory: (sp: IServiceProvider) => T): IServiceProvider;
}
export declare class ServiceProvider implements IServiceProvider {
    services: Map<any, (sp: IServiceProvider) => any>;
    constructor();
    get<T = any>(key: any): T | undefined;
    add<T = any>(key: any, factory: (sp: IServiceProvider) => T): IServiceProvider;
}
declare const defaultServiceProvider: IServiceProvider;
export declare function get<T>(key: any): T | undefined;
export default defaultServiceProvider;
