"use client";

import { useTrafficStats } from "../../hooks/use-traffic-stats.js";
import { DateRangePicker } from "../primitives/date-range-picker.js";
import { MetricCard } from "../primitives/metric-card.js";
import { HorizontalBar } from "../primitives/horizontal-bar.js";

interface TrafficWidgetProps {
  basePath?: string;
  className?: string;
}

export function TrafficWidget({
  basePath = "/api/analytics",
  className,
}: TrafficWidgetProps) {
  const { data, loading, dateRange } = useTrafficStats(basePath);

  return (
    <div data-analytics data-analytics-widget data-analytics-card className={className}>
      <div data-analytics-widget-header>
        <span data-analytics-widget-title>Traffic</span>
        <DateRangePicker
          range={dateRange.range}
          from={dateRange.from}
          to={dateRange.to}
          onPreset={dateRange.setPreset}
          onFromChange={dateRange.setFrom}
          onToChange={dateRange.setTo}
          onCustom={() => dateRange.setCustomRange(dateRange.from, dateRange.to)}
        />
      </div>

      {loading ? (
        <div data-analytics-loading>Loading...</div>
      ) : !data ? (
        <div data-analytics-empty>No data</div>
      ) : (
        <>
          {/* Totals */}
          <div data-analytics-grid="2">
            <MetricCard label="Page views" value={data.totals.views} />
            <MetricCard label="Unique visitors" value={data.totals.uniqueSessions} />
          </div>

          {/* Views per day */}
          {data.viewsByDay.length > 0 && (
            <div>
              <div data-analytics-section-title>Views per day</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {data.viewsByDay.map((d) => (
                  <HorizontalBar
                    key={d.date}
                    label={d.date.slice(5)}
                    value={d.views}
                    max={Math.max(...data.viewsByDay.map((x) => x.views))}
                    suffix={`/ ${d.sessions}`}
                    labelWidth="3rem"
                  />
                ))}
              </div>
              <div
                style={{
                  fontSize: "0.625rem",
                  color: "var(--analytics-text-muted)",
                  marginTop: "0.25rem",
                }}
              >
                views / unique
              </div>
            </div>
          )}

          {/* Device + Countries */}
          <div data-analytics-grid="2">
            {data.devices.length > 0 && (
              <div>
                <div data-analytics-section-title>Devices</div>
                {data.devices.map((d) => (
                  <div key={d.deviceType} data-analytics-list-item>
                    <span data-analytics-list-label>{d.deviceType}</span>
                    <span data-analytics-list-value>{d.views}</span>
                  </div>
                ))}
              </div>
            )}
            {data.countries.length > 0 && (
              <div>
                <div data-analytics-section-title>Countries</div>
                {data.countries.map((c) => (
                  <div key={c.country} data-analytics-list-item>
                    <span data-analytics-list-label>{c.country}</span>
                    <span data-analytics-list-value>{c.views}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top pages */}
          {data.topPages.length > 0 && (
            <div>
              <div data-analytics-section-title>Top pages</div>
              {data.topPages.map((p) => (
                <div key={p.path} data-analytics-list-item>
                  <span
                    data-analytics-list-label
                    style={{ fontFamily: "monospace", fontSize: "0.75rem" }}
                  >
                    {p.path}
                  </span>
                  <span data-analytics-list-value>{p.views}</span>
                </div>
              ))}
            </div>
          )}

          {/* Referrers */}
          {data.referrers.length > 0 && (
            <div>
              <div data-analytics-section-title>Referrers</div>
              {data.referrers.map((r) => (
                <div key={r.referrer} data-analytics-list-item>
                  <span data-analytics-list-label style={{ fontSize: "0.75rem" }}>
                    {r.referrer}
                  </span>
                  <span data-analytics-list-value>{r.views}</span>
                </div>
              ))}
            </div>
          )}

          {/* Campaigns */}
          {data.campaigns.length > 0 && (
            <div>
              <div data-analytics-section-title>Campaigns</div>
              {data.campaigns.map((c, i) => (
                <div key={i} data-analytics-list-item>
                  <span data-analytics-list-label style={{ fontSize: "0.75rem" }}>
                    {c.source}/{c.medium}
                    {c.campaign ? ` (${c.campaign})` : ""}
                  </span>
                  <span data-analytics-list-value>{c.views}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
