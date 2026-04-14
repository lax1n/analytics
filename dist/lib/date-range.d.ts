/**
 * Parse date range from API query params.
 * Supports preset ranges (24h, 7d, 30d) and custom from/to dates.
 */
export declare function parseDateRange(params: URLSearchParams): {
    since: Date;
    until: Date | null;
};
//# sourceMappingURL=date-range.d.ts.map