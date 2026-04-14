"use client";

import { useAnalyticsFetch } from "./use-analytics-fetch.js";
import type { RevenueData } from "../types.js";

export function useRevenue(basePath: string = "/api/analytics") {
  const { data, loading, error, refetch } = useAnalyticsFetch<RevenueData>(
    "admin/revenue",
    null,
    basePath
  );

  return { data, loading, error, refetch };
}
