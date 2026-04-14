"use client";

import { useAnalyticsFetch } from "./use-analytics-fetch.js";
import { useDateRange } from "./use-date-range.js";
import type { FunnelData } from "../types.js";

export function useFunnel(basePath: string = "/api/analytics") {
  const dateRange = useDateRange();
  const { data, loading, error, refetch } = useAnalyticsFetch<FunnelData>(
    "admin/funnel",
    dateRange.params,
    basePath
  );

  return { data, loading, error, refetch, dateRange };
}
