"use client";
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
function formatTimeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)
        return "now";
    if (mins < 60)
        return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24)
        return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}
function getEventIndicator(name) {
    if (name.includes("error") || name.includes("denied"))
        return "!";
    if (name.includes("success") ||
        name.includes("completed") ||
        name.includes("recovery"))
        return "✓";
    return "●";
}
function getIndicatorColor(name) {
    if (name.includes("error") || name.includes("denied"))
        return "var(--analytics-warning, #f59e0b)";
    if (name.includes("success") ||
        name.includes("completed") ||
        name.includes("recovery"))
        return "var(--analytics-success, #22c55e)";
    return "var(--analytics-primary, #3b82f6)";
}
export function EventList({ events, total, hasMore, eventNames, filter, onFilter, onLoadMore, loading, className, }) {
    const [expandedId, setExpandedId] = useState(null);
    return (_jsxs("div", { className: className, children: [eventNames.length > 0 && (_jsxs("div", { "data-analytics-filter": true, children: [_jsxs("button", { "data-active": filter === null ? "true" : undefined, onClick: () => onFilter(null), children: ["All (", total, ")"] }), eventNames.map((en) => (_jsxs("button", { "data-active": filter === en.name ? "true" : undefined, onClick: () => onFilter(en.name), children: [en.name, " (", en.count, ")"] }, en.name)))] })), loading ? (_jsx("div", { "data-analytics-loading": true, children: "Loading..." })) : events.length === 0 ? (_jsx("div", { "data-analytics-empty": true, children: "No events yet" })) : (_jsx("div", { style: { display: "flex", flexDirection: "column", gap: "0.25rem" }, children: events.map((event) => (_jsxs("div", { "data-analytics-event": true, children: [_jsxs("button", { "data-analytics-event-header": true, onClick: () => setExpandedId(expandedId === event.id ? null : event.id), children: [_jsx("span", { style: {
                                        color: getIndicatorColor(event.eventName),
                                        flexShrink: 0,
                                        width: "1rem",
                                        textAlign: "center",
                                    }, children: getEventIndicator(event.eventName) }), _jsx("span", { style: {
                                        fontFamily: "monospace",
                                        fontWeight: 500,
                                        flex: 1,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }, children: event.eventName }), _jsx("span", { style: {
                                        fontSize: "0.75rem",
                                        color: "var(--analytics-text-muted)",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        maxWidth: "120px",
                                    }, children: event.path }), _jsx("span", { style: {
                                        fontSize: "0.75rem",
                                        color: "var(--analytics-text-muted)",
                                        whiteSpace: "nowrap",
                                    }, children: formatTimeAgo(event.createdAt) }), _jsx("span", { style: { fontSize: "0.75rem", flexShrink: 0 }, children: expandedId === event.id ? "▼" : "▶" })] }), expandedId === event.id && (_jsxs("div", { "data-analytics-event-details": true, children: [_jsxs("div", { style: {
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "0.25rem",
                                    }, children: [_jsxs("div", { children: [_jsxs("span", { style: { color: "var(--analytics-text-muted)" }, children: ["Time:", " "] }), new Date(event.createdAt).toLocaleString()] }), _jsxs("div", { children: [_jsxs("span", { style: { color: "var(--analytics-text-muted)" }, children: ["Session:", " "] }), _jsx("span", { style: { fontFamily: "monospace" }, children: event.sessionId?.slice(0, 12) ?? "–" })] }), _jsxs("div", { style: { gridColumn: "span 2" }, children: [_jsxs("span", { style: { color: "var(--analytics-text-muted)" }, children: ["Path:", " "] }), event.path ?? "–"] })] }), event.properties &&
                                    Object.keys(event.properties).length > 0 && (_jsxs("div", { style: { marginTop: "0.5rem" }, children: [_jsx("span", { style: { color: "var(--analytics-text-muted)" }, children: "Properties:" }), Object.entries(event.properties).map(([key, value]) => (_jsxs("div", { style: {
                                                display: "flex",
                                                gap: "0.5rem",
                                                paddingLeft: "0.5rem",
                                                fontFamily: "monospace",
                                            }, children: [_jsxs("span", { style: {
                                                        color: "var(--analytics-text-muted)",
                                                    }, children: [key, ":"] }), _jsx("span", { children: String(value) })] }, key)))] }))] }))] }, event.id))) })), hasMore && !loading && (_jsx("div", { style: { display: "flex", justifyContent: "center", paddingTop: "0.5rem" }, children: _jsx("button", { "data-analytics-picker": true, onClick: onLoadMore, style: {
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        background: "none",
                        border: "1px solid var(--analytics-border)",
                        borderRadius: "var(--analytics-radius)",
                        padding: "0.25rem 0.75rem",
                        color: "var(--analytics-text-muted)",
                    }, children: "Load more" }) }))] }));
}
//# sourceMappingURL=event-list.js.map