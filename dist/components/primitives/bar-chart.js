import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function BarChart({ data, height = 160, formatValue = (v) => String(v), className, }) {
    const max = Math.max(...data.map((d) => d.value), 1);
    return (_jsxs("div", { className: className, children: [_jsx("div", { "data-analytics-barchart": true, style: { height: `${height}px` }, title: data.map((d) => `${d.label}: ${formatValue(d.value)}`).join("\n"), children: data.map((d, i) => (_jsx("div", { "data-analytics-barchart-bar": true, style: { height: `${Math.max((d.value / max) * 100, d.value > 0 ? 2 : 0)}%` }, title: `${d.label}: ${formatValue(d.value)}` }, i))) }), data.length <= 15 && (_jsxs("div", { style: {
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.625rem",
                    color: "var(--analytics-text-muted)",
                    marginTop: "0.25rem",
                }, children: [_jsx("span", { children: data[0]?.label }), data.length > 1 && _jsx("span", { children: data[data.length - 1]?.label })] }))] }));
}
//# sourceMappingURL=bar-chart.js.map