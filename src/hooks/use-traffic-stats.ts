"use client";

import { useAnalyticsFetch } from "./use-analytics-fetch.js";
import { useDateRange } from "./use-date-range.js";
import type { TrafficData } from "../types.js";

export function useTrafficStats(basePath: string = "/api/analytics") {
  const dateRange = useDateRange();
  const { data, loading, error, refetch } = useAnalyticsFetch<TrafficData>(
    "admin/analytics",
    dateRange.params,
    basePath
  );

  return { data, loading, error, refetch, dateRange };
}
