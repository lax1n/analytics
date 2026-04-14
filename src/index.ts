// Config
export { defineAnalytics, getConfig } from "./config.js";

// Schema
export { pageViews, analyticsEvents } from "./schema.js";
export type {
  PageView,
  NewPageView,
  AnalyticsEvent,
  NewAnalyticsEvent,
} from "./schema.js";

// Types
export type {
  AnalyticsConfig,
  TrafficData,
  FunnelData,
  RevenueData,
  EventFeedData,
  EventRow,
  FunnelStage,
} from "./types.js";

// Handlers
export { createTrackHandler } from "./handlers/track.js";
export { createEventsHandler } from "./handlers/events.js";
export { createAnalyticsHandler } from "./handlers/admin/analytics.js";
export { createFunnelHandler } from "./handlers/admin/funnel.js";
export { createEventFeedHandler } from "./handlers/admin/events.js";

// Client utilities
export { trackEvent } from "./client/track-event.js";

// Server utilities
export { trackEventServer } from "./server/track-event.js";

// Components
export { PageTracker } from "./components/tracker.js";

// Middleware
export { withAnalyticsMiddleware } from "./middleware/gclid.js";

// Lib
export { parseDateRange } from "./lib/date-range.js";
export { rateLimit } from "./lib/rate-limit.js";
