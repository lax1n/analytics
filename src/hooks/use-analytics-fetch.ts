"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Internal hook for fetching analytics API data.
 */
export function useAnalyticsFetch<T>(
  endpoint: string,
  params?: URLSearchParams | null,
  basePath: string = "/api/analytics"
): { data: T | null; loading: boolean; error: string | null; refetch: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fetch failed");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
