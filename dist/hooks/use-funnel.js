"use client";
import { useAnalyticsFetch } from "./use-analytics-fetch.js";
import { useDateRange } from "./use-date-range.js";
export function useFunnel(basePath = "/api/analytics") {
    const dateRange = useDateRange();
    const { data, loading, error, refetch } = useAnalyticsFetch("admin/funnel", dateRange.params, basePath);
    return { data, loading, error, refetch, dateRange };
}
//# sourceMappingURL=use-funnel.js.map