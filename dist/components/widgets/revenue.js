"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRevenue } from "../../hooks/use-revenue.js";
import { MetricCard } from "../primitives/metric-card.js";
import { BarChart } from "../primitives/bar-chart.js";
export function RevenueWidget({ basePath = "/api/analytics", className, formatCurrency = (v) => `${v.toLocaleString()} kr`, }) {
    const { data, loading } = useRevenue(basePath);
    return (_jsxs("div", { "data-analytics": true, "data-analytics-widget": true, "data-analytics-card": true, className: className, children: [_jsx("div", { "data-analytics-widget-header": true, children: _jsx("span", { "data-analytics-widget-title": true, children: "Revenue" }) }), loading ? (_jsx("div", { "data-analytics-loading": true, children: "Loading..." })) : !data ? (_jsx("div", { "data-analytics-empty": true, children: "Revenue not configured" })) : (_jsxs(_Fragment, { children: [_jsxs("div", { "data-analytics-grid": "4", children: [_jsx(MetricCard, { label: "Today", value: formatCurrency(data.today.revenue), subtitle: `${data.today.count} sales` }), _jsx(MetricCard, { label: "This week", value: formatCurrency(data.thisWeek.revenue), subtitle: `${data.thisWeek.count} sales` }), _jsx(MetricCard, { label: "This month", value: formatCurrency(data.thisMonth.revenue), subtitle: `${data.thisMonth.count} sales` }), _jsx(MetricCard, { label: "All time", value: formatCurrency(data.allTime.revenue), subtitle: `${data.allTime.count} sales` })] }), data.dailyRevenue.length > 0 && (_jsxs("div", { children: [_jsx("div", { "data-analytics-section-title": true, children: "Daily revenue (30d)" }), _jsx(BarChart, { data: data.dailyRevenue.map((d) => ({
                                    label: d.date.slice(5),
                                    value: d.revenue,
                                })), height: 120, formatValue: formatCurrency })] }))] }))] }));
}
//# sourceMappingURL=revenue.js.map