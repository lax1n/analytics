"use client";
import { useAnalyticsFetch } from "./use-analytics-fetch.js";
export function useRevenue(basePath = "/api/analytics") {
    const { data, loading, error, refetch } = useAnalyticsFetch("admin/revenue", null, basePath);
    return { data, loading, error, refetch };
}
//# sourceMappingURL=use-revenue.js.map