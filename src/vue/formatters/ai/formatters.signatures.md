# Regira JsLib Formatters — API Signatures Reference

Verbatim TypeScript signatures for `regira_modules/vue/formatters`. Do not guess — look up here first.

```ts
import {
  formatDateTime, dateInputString, formatTime, formatDate, formatShortDate,
  formatNumber, formatNumberCompact, formatCurrency, formatCurrencyCompact, formatPercentage,
  formatBankaccount, getInitials, formatTextPreserveNewLines, formatStructuredReference, shortenString,
} from "regira_modules/vue/formatters"
```

## Dates & times

```ts
export declare const formatDateTime: (date?: Date, mask?: string) => string;   // default mask "dd-MM-yyyy"
export declare const dateInputString: (date?: Date) => string;                 // "yyyy-MM-dd"
export declare const formatTime: (date?: Date) => string;                      // wraps formatDateTime(date, "HH:mm")
export declare const formatDate: (date?: Date | string, culture?: string) => string;
export declare const formatShortDate: (date?: Date | string, culture?: string) => string;
```

## Numbers, currency, percentage

```ts
export declare function formatNumber(value?: number, culture?: string, minDigits?: number, maxDigits?: number): string;   // minDigits = 2, maxDigits = minDigits
export declare function formatNumberCompact(value?: number, culture?: string): string;
export declare function formatCurrency(value?: number, culture?: string, currency?: string): string;                      // currency = "EUR"
export declare function formatCurrencyCompact(value?: number, culture?: string, currency?: string): string;              // currency = "EUR"
export declare function formatPercentage(value?: number, culture?: string): string;                                      // value > 1 divided by 100
```

## String helpers

```ts
export declare const formatBankaccount: (input: string) => string;             // 16-char "BE…" → grouped; else ""
export declare const getInitials: (input: string) => string;
export declare const formatTextPreserveNewLines: (input: string) => string;    // "\n" → "<br/>"
export declare const formatStructuredReference: (input: string) => string;     // digits grouped 3/4/5
export declare function shortenString(str: string | undefined, maxLength: number): string | undefined;
```

## See also

- [formatters.instructions.md](formatters.instructions.md)
