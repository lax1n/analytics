import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function BreakdownTable({ title, columns, rows, className, }) {
    if (rows.length === 0)
        return null;
    const gridCols = columns
        .map((c, i) => (i === 0 ? "1fr" : "70px"))
        .join(" ");
    return (_jsxs("div", { className: className, children: [title && _jsx("div", { "data-analytics-section-title": true, children: title }), _jsxs("div", { "data-analytics-table": true, children: [_jsx("div", { "data-analytics-table-header": true, style: { gridTemplateColumns: gridCols }, children: columns.map((col) => (_jsx("span", { style: { textAlign: col.align ?? (col.key === columns[0].key ? "left" : "right") }, children: col.label }, col.key))) }), rows.map((row, i) => (_jsx("div", { "data-analytics-table-row": true, style: { gridTemplateColumns: gridCols }, children: columns.map((col) => (_jsx("span", { style: {
                                textAlign: col.align ?? (col.key === columns[0].key ? "left" : "right"),
                                overflow: col.key === columns[0].key ? "hidden" : undefined,
                                textOverflow: col.key === columns[0].key ? "ellipsis" : undefined,
                                whiteSpace: col.key === columns[0].key ? "nowrap" : undefined,
                                color: col.key !== columns[0].key
                                    ? "var(--analytics-text-muted)"
                                    : undefined,
                            }, children: String(row[col.key] ?? "—") }, col.key))) }, i)))] })] }));
}
//# sourceMappingURL=breakdown-table.js.map