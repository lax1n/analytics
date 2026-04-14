"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEventFeed } from "../../hooks/use-event-feed.js";
import { EventList } from "../primitives/event-list.js";
export function EventFeedWidget({ basePath = "/api/analytics", className, }) {
    const { events, total, hasMore, eventNames, loading, filter, setFilter, loadMore, } = useEventFeed(basePath);
    return (_jsxs("div", { "data-analytics": true, "data-analytics-widget": true, "data-analytics-card": true, className: className, children: [_jsxs("div", { "data-analytics-widget-header": true, children: [_jsx("span", { "data-analytics-widget-title": true, children: "Events" }), _jsxs("span", { style: { fontSize: "0.75rem", color: "var(--analytics-text-muted)" }, children: [total, " total"] })] }), _jsx(EventList, { events: events, total: total, hasMore: hasMore, eventNames: eventNames, filter: filter, onFilter: setFilter, onLoadMore: loadMore, loading: loading })] }));
}
//# sourceMappingURL=event-feed.js.map