/**
 * Formats a date with a token MASK — not a culture. `formatDate`/`formatShortDate` are the culture-taking
 * pair; passing a locale tag here silently token-substitutes it (`"en-GB"` → `"e<ms>-GB"`, the `n` being
 * the date's milliseconds).
 * @param date the date to format — null/invalid yields `""`
 * @param mask tokens: `d`/`dd`, `M`/`MM`, `yy`/`yyyy`, `h`/`hh` (24-hour, aliases `H`/`HH`), `m`/`mm`,
 * `n`…`nnnn` (milliseconds). Every other character is emitted verbatim.
 */
export declare const formatDateTime: (date?: Date, mask?: string) => string;
export declare const dateInputString: (date?: Date) => string;
export declare const formatTime: (date?: Date) => string;
export declare const formatDate: (date?: Date | string, culture?: string) => string;
export declare const formatShortDate: (date?: Date | string, culture?: string) => string;
export declare function formatNumber(value?: number, culture?: string, minDigits?: number, maxDigits?: number): string;
export declare function formatNumberCompact(value?: number, culture?: string): string;
export declare function formatCurrency(value?: number, culture?: string, currency?: string): string;
export declare function formatCurrencyCompact(value?: number, culture?: string, currency?: string): string;
export declare function formatPercentage(value?: number, culture?: string): string;
export declare const formatBankaccount: (input: string) => string;
export declare const getInitials: (input: string) => string;
export declare const formatTextPreserveNewLines: (input: string) => string;
export declare const formatStructuredReference: (input: string) => string;
export declare function shortenString(str: string | undefined, maxLength: number): string | undefined;
