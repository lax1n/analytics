/**
 * Internal hook for fetching analytics API data.
 */
export declare function useAnalyticsFetch<T>(endpoint: string, params?: URLSearchParams | null, basePath?: string): {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
};
//# sourceMappingURL=use-analytics-fetch.d.ts.map