"use client";
import { useAnalyticsFetch } from "./use-analytics-fetch.js";
import { useDateRange } from "./use-date-range.js";
export function useTrafficStats(basePath = "/api/analytics") {
    const dateRange = useDateRange();
    const { data, loading, error, refetch } = useAnalyticsFetch("admin/analytics", dateRange.params, basePath);
    return { data, loading, error, refetch, dateRange };
}
//# sourceMappingURL=use-traffic-stats.js.map