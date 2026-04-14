"use client";

import { useState } from "react";
import type { EventRow } from "../../types.js";

interface EventListProps {
  events: EventRow[];
  total: number;
  hasMore: boolean;
  eventNames: { name: string; count: number }[];
  filter: string | null;
  onFilter: (name: string | null) => void;
  onLoadMore: () => void;
  loading?: boolean;
  className?: string;
}

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getEventIndicator(name: string): string {
  if (name.includes("error") || name.includes("denied")) return "!";
  if (
    name.includes("success") ||
    name.includes("completed") ||
    name.includes("recovery")
  )
    return "✓";
  return "●";
}

function getIndicatorColor(name: string): string {
  if (name.includes("error") || name.includes("denied"))
    return "var(--analytics-warning, #f59e0b)";
  if (
    name.includes("success") ||
    name.includes("completed") ||
    name.includes("recovery")
  )
    return "var(--analytics-success, #22c55e)";
  return "var(--analytics-primary, #3b82f6)";
}

export function EventList({
  events,
  total,
  hasMore,
  eventNames,
  filter,
  onFilter,
  onLoadMore,
  loading,
  className,
}: EventListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className={className}>
      {/* Filter chips */}
      {eventNames.length > 0 && (
        <div data-analytics-filter>
          <button
            data-active={filter === null ? "true" : undefined}
            onClick={() => onFilter(null)}
          >
            All ({total})
          </button>
          {eventNames.map((en) => (
            <button
              key={en.name}
              data-active={filter === en.name ? "true" : undefined}
              onClick={() => onFilter(en.name)}
            >
              {en.name} ({en.count})
            </button>
          ))}
        </div>
      )}

      {/* Event list */}
      {loading ? (
        <div data-analytics-loading>Loading...</div>
      ) : events.length === 0 ? (
        <div data-analytics-empty>No events yet</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {events.map((event) => (
            <div key={event.id} data-analytics-event>
              <button
                data-analytics-event-header
                onClick={() =>
                  setExpandedId(expandedId === event.id ? null : event.id)
                }
              >
                <span
                  style={{
                    color: getIndicatorColor(event.eventName),
                    flexShrink: 0,
                    width: "1rem",
                    textAlign: "center",
                  }}
                >
                  {getEventIndicator(event.eventName)}
                </span>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontWeight: 500,
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {event.eventName}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--analytics-text-muted)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "120px",
                  }}
                >
                  {event.path}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--analytics-text-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatTimeAgo(event.createdAt)}
                </span>
                <span style={{ fontSize: "0.75rem", flexShrink: 0 }}>
                  {expandedId === event.id ? "▼" : "▶"}
                </span>
              </button>
              {expandedId === event.id && (
                <div data-analytics-event-details>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.25rem",
                    }}
                  >
                    <div>
                      <span style={{ color: "var(--analytics-text-muted)" }}>
                        Time:{" "}
                      </span>
                      {new Date(event.createdAt).toLocaleString()}
                    </div>
                    <div>
                      <span style={{ color: "var(--analytics-text-muted)" }}>
                        Session:{" "}
                      </span>
                      <span style={{ fontFamily: "monospace" }}>
                        {event.sessionId?.slice(0, 12) ?? "–"}
                      </span>
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <span style={{ color: "var(--analytics-text-muted)" }}>
                        Path:{" "}
                      </span>
                      {event.path ?? "–"}
                    </div>
                  </div>
                  {event.properties &&
                    Object.keys(event.properties).length > 0 && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <span style={{ color: "var(--analytics-text-muted)" }}>
                          Properties:
                        </span>
                        {Object.entries(event.properties).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              style={{
                                display: "flex",
                                gap: "0.5rem",
                                paddingLeft: "0.5rem",
                                fontFamily: "monospace",
                              }}
                            >
                              <span
                                style={{
                                  color: "var(--analytics-text-muted)",
                                }}
                              >
                                {key}:
                              </span>
                              <span>{String(value)}</span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && !loading && (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "0.5rem" }}>
          <button
            data-analytics-picker
            onClick={onLoadMore}
            style={{
              fontSize: "0.75rem",
              cursor: "pointer",
              background: "none",
              border: "1px solid var(--analytics-border)",
              borderRadius: "var(--analytics-radius)",
              padding: "0.25rem 0.75rem",
              color: "var(--analytics-text-muted)",
            }}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
