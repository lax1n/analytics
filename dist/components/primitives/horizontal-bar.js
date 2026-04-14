import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function HorizontalBar({ label, value, max, suffix, className, labelWidth, }) {
    const pct = max > 0 ? (value / max) * 100 : 0;
    return (_jsxs("div", { "data-analytics-bar": true, className: className, children: [_jsx("span", { "data-analytics-bar-label": true, style: labelWidth ? { width: labelWidth } : undefined, children: label }), _jsx("div", { "data-analytics-bar-track": true, children: _jsx("div", { "data-analytics-bar-fill": true, style: { width: `${Math.max(pct > 0 ? 2 : 0, pct)}%` } }) }), _jsxs("span", { "data-analytics-bar-value": true, children: [value, suffix && (_jsx("span", { style: { color: "var(--analytics-text-muted)", marginLeft: "0.25rem" }, children: suffix }))] })] }));
}
//# sourceMappingURL=horizontal-bar.js.map