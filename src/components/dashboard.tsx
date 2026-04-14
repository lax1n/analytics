"use client";

import { TrafficWidget } from "./widgets/traffic.js";
import { FunnelWidget } from "./widgets/funnel.js";
import { EventFeedWidget } from "./widgets/event-feed.js";
import { RevenueWidget } from "./widgets/revenue.js";

interface AnalyticsDashboardProps {
  basePath?: string;
  className?: string;
  /** Show revenue widget. Default: true */
  showRevenue?: boolean;
  /** Show funnel widget. Default: true */
  showFunnel?: boolean;
  /** Show event feed widget. Default: true */
  showEvents?: boolean;
  /** Format currency value for revenue widget */
  formatCurrency?: (amount: number) => string;
}

export function AnalyticsDashboard({
  basePath = "/api/analytics",
  className,
  showRevenue = true,
  showFunnel = true,
  showEvents = true,
  formatCurrency,
}: AnalyticsDashboardProps) {
  return (
    <div data-analytics data-analytics-dashboard className={className}>
      {showRevenue && (
        <RevenueWidget basePath={basePath} formatCurrency={formatCurrency} />
      )}
      <TrafficWidget basePath={basePath} />
      {showFunnel && <FunnelWidget basePath={basePath} />}
      {showEvents && <EventFeedWidget basePath={basePath} />}
    </div>
  );
}
