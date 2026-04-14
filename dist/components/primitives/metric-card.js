import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function MetricCard({ label, value, subtitle, className, }) {
    return (_jsxs("div", { "data-analytics-metric": true, className: className, children: [_jsx("span", { "data-analytics-metric-label": true, children: label }), _jsx("span", { "data-analytics-metric-value": true, children: value }), subtitle && (_jsx("span", { style: {
                    fontSize: "0.75rem",
                    color: "var(--analytics-text-muted)",
                }, children: subtitle }))] }));
}
//# sourceMappingURL=metric-card.js.map