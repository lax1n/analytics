import { pgTable, uuid, text, integer, timestamp, jsonb, index, } from "drizzle-orm/pg-core";
export const pageViews = pgTable("page_views", {
    id: uuid("id").defaultRandom().primaryKey(),
    path: text("path").notNull(),
    referrer: text("referrer"),
    userAgent: text("user_agent"),
    country: text("country"),
    sessionId: text("session_id"),
    deviceType: text("device_type"),
    screenWidth: integer("screen_width"),
    screenHeight: integer("screen_height"),
    language: text("language"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmTerm: text("utm_term"),
    utmContent: text("utm_content"),
    gclid: text("gclid"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
    index("page_views_created_at_idx").on(table.createdAt),
    index("page_views_path_idx").on(table.path),
    index("page_views_session_id_idx").on(table.sessionId),
]);
export const analyticsEvents = pgTable("analytics_events", {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: text("session_id"),
    eventName: text("event_name").notNull(),
    properties: jsonb("properties").$type(),
    path: text("path"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
    index("analytics_events_created_at_idx").on(table.createdAt),
    index("analytics_events_event_name_idx").on(table.eventName),
    index("analytics_events_session_id_idx").on(table.sessionId),
]);
//# sourceMappingURL=schema.js.map