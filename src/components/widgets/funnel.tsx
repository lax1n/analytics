"use client";

import { useFunnel } from "../../hooks/use-funnel.js";
import { DateRangePicker } from "../primitives/date-range-picker.js";
import { HorizontalBar } from "../primitives/horizontal-bar.js";
import { BreakdownTable } from "../primitives/breakdown-table.js";

interface FunnelWidgetProps {
  basePath?: string;
  className?: string;
}

export function FunnelWidget({
  basePath = "/api/analytics",
  className,
}: FunnelWidgetProps) {
  const { data, loading, dateRange } = useFunnel(basePath);

  return (
    <div data-analytics data-analytics-widget data-analytics-card className={className}>
      <div data-analytics-widget-header>
        <span data-analytics-widget-title>Funnel</span>
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
      ) : !data || data.stages.length === 0 ? (
        <div data-analytics-empty>No data for this period</div>
      ) : (
        <>
          {/* Funnel bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {data.stages.map((s) => {
              const max = data.stages[0]?.count || 1;
              const pct =
                max > 0 ? Math.round((s.count / max) * 1000) / 10 : 0;
              return (
                <HorizontalBar
                  key={s.key}
                  label={s.label}
                  value={s.count}
                  max={max}
                  suffix={`(${pct}%)`}
                  labelWidth="8rem"
                />
              );
            })}
          </div>

          {/* Conversion rates */}
          {data.conversionRates.length > 0 && (
            <div data-analytics-grid="3">
              {data.conversionRates.map((cr) => (
                <div
                  key={cr.label}
                  style={{ textAlign: "center" }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--analytics-text-muted)",
                    }}
                  >
                    {cr.label}
                  </div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                    {cr.rate}%
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Breakdowns */}
          {data.bySource.length > 0 && (
            <BreakdownTable
              title="By source"
              columns={[
                { key: "source", label: "Source" },
                { key: "visitors", label: "Visitors", align: "right" },
                { key: "converted", label: "Converted", align: "right" },
                { key: "rate", label: "Rate", align: "right" },
              ]}
              rows={data.bySource.map((s) => ({
                ...s,
                rate:
                  s.visitors > 0
                    ? `${Math.round((s.converted / s.visitors) * 1000) / 10}%`
                    : "0%",
              }))}
            />
          )}

          {data.byKeyword.length > 0 && (
            <BreakdownTable
              title="By keyword"
              columns={[
                { key: "keyword", label: "Keyword" },
                { key: "visitors", label: "Visitors", align: "right" },
                { key: "converted", label: "Converted", align: "right" },
                { key: "rate", label: "Rate", align: "right" },
              ]}
              rows={data.byKeyword.map((k) => ({
                ...k,
                rate:
                  k.visitors > 0
                    ? `${Math.round((k.converted / k.visitors) * 1000) / 10}%`
                    : "0%",
              }))}
            />
          )}

          {data.byDevice.length > 0 && (
            <BreakdownTable
              title="By device"
              columns={[
                { key: "device", label: "Device" },
                { key: "visitors", label: "Visitors", align: "right" },
                { key: "converted", label: "Converted", align: "right" },
                { key: "rate", label: "Rate", align: "right" },
              ]}
              rows={data.byDevice.map((d) => ({
                ...d,
                rate:
                  d.visitors > 0
                    ? `${Math.round((d.converted / d.visitors) * 1000) / 10}%`
                    : "0%",
              }))}
            />
          )}
        </>
      )}
    </div>
  );
}
