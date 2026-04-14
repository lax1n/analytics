"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useFunnel } from "../../hooks/use-funnel.js";
import { DateRangePicker } from "../primitives/date-range-picker.js";
import { HorizontalBar } from "../primitives/horizontal-bar.js";
import { BreakdownTable } from "../primitives/breakdown-table.js";
export function FunnelWidget({ basePath = "/api/analytics", className, }) {
    const { data, loading, dateRange } = useFunnel(basePath);
    return (_jsxs("div", { "data-analytics": true, "data-analytics-widget": true, "data-analytics-card": true, className: className, children: [_jsxs("div", { "data-analytics-widget-header": true, children: [_jsx("span", { "data-analytics-widget-title": true, children: "Funnel" }), _jsx(DateRangePicker, { range: dateRange.range, from: dateRange.from, to: dateRange.to, onPreset: dateRange.setPreset, onFromChange: dateRange.setFrom, onToChange: dateRange.setTo, onCustom: () => dateRange.setCustomRange(dateRange.from, dateRange.to) })] }), loading ? (_jsx("div", { "data-analytics-loading": true, children: "Loading..." })) : !data || data.stages.length === 0 ? (_jsx("div", { "data-analytics-empty": true, children: "No data for this period" })) : (_jsxs(_Fragment, { children: [_jsx("div", { style: { display: "flex", flexDirection: "column", gap: "0.375rem" }, children: data.stages.map((s) => {
                            const max = data.stages[0]?.count || 1;
                            const pct = max > 0 ? Math.round((s.count / max) * 1000) / 10 : 0;
                            return (_jsx(HorizontalBar, { label: s.label, value: s.count, max: max, suffix: `(${pct}%)`, labelWidth: "8rem" }, s.key));
                        }) }), data.conversionRates.length > 0 && (_jsx("div", { "data-analytics-grid": "3", children: data.conversionRates.map((cr) => (_jsxs("div", { style: { textAlign: "center" }, children: [_jsx("div", { style: {
                                        fontSize: "0.75rem",
                                        color: "var(--analytics-text-muted)",
                                    }, children: cr.label }), _jsxs("div", { style: { fontSize: "1.25rem", fontWeight: 700 }, children: [cr.rate, "%"] })] }, cr.label))) })), data.bySource.length > 0 && (_jsx(BreakdownTable, { title: "By source", columns: [
                            { key: "source", label: "Source" },
                            { key: "visitors", label: "Visitors", align: "right" },
                            { key: "converted", label: "Converted", align: "right" },
                            { key: "rate", label: "Rate", align: "right" },
                        ], rows: data.bySource.map((s) => ({
                            ...s,
                            rate: s.visitors > 0
                                ? `${Math.round((s.converted / s.visitors) * 1000) / 10}%`
                                : "0%",
                        })) })), data.byKeyword.length > 0 && (_jsx(BreakdownTable, { title: "By keyword", columns: [
                            { key: "keyword", label: "Keyword" },
                            { key: "visitors", label: "Visitors", align: "right" },
                            { key: "converted", label: "Converted", align: "right" },
                            { key: "rate", label: "Rate", align: "right" },
                        ], rows: data.byKeyword.map((k) => ({
                            ...k,
                            rate: k.visitors > 0
                                ? `${Math.round((k.converted / k.visitors) * 1000) / 10}%`
                                : "0%",
                        })) })), data.byDevice.length > 0 && (_jsx(BreakdownTable, { title: "By device", columns: [
                            { key: "device", label: "Device" },
                            { key: "visitors", label: "Visitors", align: "right" },
                            { key: "converted", label: "Converted", align: "right" },
                            { key: "rate", label: "Rate", align: "right" },
                        ], rows: data.byDevice.map((d) => ({
                            ...d,
                            rate: d.visitors > 0
                                ? `${Math.round((d.converted / d.visitors) * 1000) / 10}%`
                                : "0%",
                        })) }))] }))] }));
}
//# sourceMappingURL=funnel.js.map