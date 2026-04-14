"use client";

import { useEventFeed } from "../../hooks/use-event-feed.js";
import { EventList } from "../primitives/event-list.js";

interface EventFeedWidgetProps {
  basePath?: string;
  className?: string;
}

export function EventFeedWidget({
  basePath = "/api/analytics",
  className,
}: EventFeedWidgetProps) {
  const {
    events,
    total,
    hasMore,
    eventNames,
    loading,
    filter,
    setFilter,
    loadMore,
  } = useEventFeed(basePath);

  return (
    <div data-analytics data-analytics-widget data-analytics-card className={className}>
      <div data-analytics-widget-header>
        <span data-analytics-widget-title>Events</span>
        <span style={{ fontSize: "0.75rem", color: "var(--analytics-text-muted)" }}>
          {total} total
        </span>
      </div>

      <EventList
        events={events}
        total={total}
        hasMore={hasMore}
        eventNames={eventNames}
        filter={filter}
        onFilter={setFilter}
        onLoadMore={loadMore}
        loading={loading}
      />
    </div>
  );
}
