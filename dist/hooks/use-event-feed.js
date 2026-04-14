"use client";
import { useState, useCallback } from "react";
import { useAnalyticsFetch } from "./use-analytics-fetch.js";
export function useEventFeed(basePath = "/api/analytics") {
    const [filter, setFilter] = useState(null);
    const [allEvents, setAllEvents] = useState([]);
    const [offset, setOffset] = useState(0);
    const params = new URLSearchParams({ limit: "50", offset: String(offset) });
    if (filter)
        params.set("event_name", filter);
    const { data, loading, error, refetch } = useAnalyticsFetch("admin/events", params, basePath);
    // When data loads, merge events
    if (data && offset === 0 && allEvents !== data.events) {
        setAllEvents(data.events);
    }
    const changeFilter = useCallback((name) => {
        setFilter(name);
        setOffset(0);
        setAllEvents([]);
    }, []);
    const loadMore = useCallback(() => {
        if (data?.hasMore) {
            setOffset((prev) => prev + 50);
            // Append to existing events
            if (data) {
                setAllEvents((prev) => [...prev, ...data.events]);
            }
        }
    }, [data]);
    return {
        events: allEvents.length > 0 ? allEvents : data?.events ?? [],
        total: data?.total ?? 0,
        hasMore: data?.hasMore ?? false,
        eventNames: data?.eventNames ?? [],
        loading,
        error,
        filter,
        setFilter: changeFilter,
        loadMore,
        refetch,
    };
}
//# sourceMappingURL=use-event-feed.js.map