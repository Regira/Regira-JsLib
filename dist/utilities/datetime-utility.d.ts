export declare const isValidDate: (date: unknown) => boolean;
export declare const daysDiff: (date1: Date | number | string, date2: Date | number | string) => number;
export declare const timer: {
    last: number;
    log(dateToCompare?: Date | number | string): number;
};
export interface CountdownValues {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}
export declare const countDown: (startDate: Date | number | string, interval?: number) => CountdownValues;
/**
 * Stringifies the date without timezone 'correction' in JSON format
 * @param {Date|number} date
 *  the date as Date or time in milliseconds
 * @returns the serialized date
 */
export declare const stringifyDate: (date: Date | number) => string | undefined;
declare const _default: {
    isValidDate: (date: unknown) => boolean;
    timer: {
        last: number;
        log(dateToCompare?: Date | number | string): number;
    };
    countDown: (startDate: Date | number | string, interval?: number) => CountdownValues;
    stringifyDate: (date: Date | number) => string | undefined;
};
export default _default;
