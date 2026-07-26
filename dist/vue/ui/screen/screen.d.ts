import { type Ref } from "vue";
export interface IScreenSize extends Array<number> {
}
export interface IScreen {
    get size(): number[];
    get isExtraSmall(): boolean;
    get isSmall(): boolean;
    get isMedium(): boolean;
    get isLarge(): boolean;
    get isExtraLarge(): boolean;
    get isExtraExtraLarge(): boolean;
    get layout(): string;
    updateSize(newSize: IScreenSize): void;
    isSize(size: string): boolean;
}
type ScreenOut = {
    size: Ref<number[]>;
    screen: IScreen;
};
/**
 * The viewport as [width, height]. Guarded, so the module works outside a DOM (SSR, a Node script importing
 * the UI barrel) instead of throwing on `window`: without one it reports [0, 0], the smallest breakpoint —
 * the same mobile-first assumption the CSS starts from. The real size lands on the client, where the first
 * `useScreen()` reads it and the resize listener keeps it current.
 */
export declare function getWindowSize(): IScreenSize;
export declare const SCREEN_SIZES: Record<string, number>;
export declare function useScreen(): ScreenOut;
export default useScreen;
