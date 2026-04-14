"use client";

import { useRevenue } from "../../hooks/use-revenue.js";
import { MetricCard } from "../primitives/metric-card.js";
import { BarChart } from "../primitives/bar-chart.js";

interface RevenueWidgetProps {
  basePath?: string;
  className?: string;
  /** Format currency value. Default: adds "kr" suffix */
  formatCurrency?: (amount: number) => string;
}

export function RevenueWidget({
  basePath = "/api/analytics",
  className,
  formatCurrency = (v) => `${v.toLocaleString()} kr`,
}: RevenueWidgetProps) {
  const { data, loading } = useRevenue(basePath);

  return (
    <div data-analytics data-analytics-widget data-analytics-card className={className}>
      <div data-analytics-widget-header>
        <span data-analytics-widget-title>Revenue</span>
      </div>

      {loading ? (
        <div data-analytics-loading>Loading...</div>
      ) : !data ? (
        <div data-analytics-empty>Revenue not configured</div>
      ) : (
        <>
          <div data-analytics-grid="4">
            <MetricCard
              label="Today"
              value={formatCurrency(data.today.revenue)}
              subtitle={`${data.today.count} sales`}
            />
            <MetricCard
              label="This week"
              value={formatCurrency(data.thisWeek.revenue)}
              subtitle={`${data.thisWeek.count} sales`}
            />
            <MetricCard
              label="This month"
              value={formatCurrency(data.thisMonth.revenue)}
              subtitle={`${data.thisMonth.count} sales`}
            />
            <MetricCard
              label="All time"
              value={formatCurrency(data.allTime.revenue)}
              subtitle={`${data.allTime.count} sales`}
            />
          </div>

          {data.dailyRevenue.length > 0 && (
            <div>
              <div data-analytics-section-title>Daily revenue (30d)</div>
              <BarChart
                data={data.dailyRevenue.map((d) => ({
                  label: d.date.slice(5),
                  value: d.revenue,
                }))}
                height={120}
                formatValue={formatCurrency}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
