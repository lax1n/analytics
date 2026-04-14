"use client";
import { useState, useEffect, useCallback } from "react";
/**
 * Internal hook for fetching analytics API data.
 */
export function useAnalyticsFetch(endpoint, params, basePath = "/api/analytics") {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const url = params
        ? `${basePath}/${endpoint}?${params.toString()}`
        : `${basePath}/${endpoint}`;
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(url);
            if (!res.ok) {
                setError(`HTTP ${res.status}`);
                return;
            }
            setData(await res.json());
        }
        catch (e) {
            setError(e instanceof Error ? e.message : "Fetch failed");
        }
        finally {
            setLoading(false);
        }
    }, [url]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    return { data, loading, error, refetch: fetchData };
}
//# sourceMappingURL=use-analytics-fetch.js.map