# CLAUDE.md — @bestillpass/analytics

## Project Overview

Reusable analytics package for Next.js + Drizzle projects. Provides page view tracking, custom event tracking, admin dashboard, and Google Ads attribution — all as a drop-in library installed from GitHub.

**Package name:** `@bestillpass/analytics`
**Repo:** `github:lax1n/analytics` (private)
**Install:** `npm install github:lax1n/analytics`

This is a **library**, not a deployed app. It has no server, no database, no hosting. It's consumed by other projects.

**Consumers:**
- **passklar** (`../passklar`, bestillpass.no) — first consumer, actively using it
- **oops** (`../oops`, nafskademelding.no) — future migration, will replace ~400 lines of inline tracking

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Language | TypeScript (strict) | Library code, no path aliases |
| Build | tsc → dist/ | Pre-built, dist/ committed to git |
| Peer deps | drizzle-orm ^0.45.0, next >=14, react >=18 | Consumer installs these |
| Charts | Custom HTML/CSS | Zero charting dependencies, pure div-based bars |
| Styling | CSS custom properties | `--analytics-*` tokens, no Tailwind in package |
| Icons | Text characters | No lucide-react or icon library dependency |

## Commands

```bash
npm run build          # tsc + copy theme.css → dist/
npm run typecheck      # tsc --noEmit
```

## Project Structure

```
src/
  config.ts              # defineAnalytics() + getConfig() — module-level singleton
  schema.ts              # Drizzle tables: pageViews, analyticsEvents
  types.ts               # Shared TypeScript types (config, API responses)
  index.ts               # Barrel export (everything re-exported from here)

  handlers/              # Next.js API route handler factories
    track.ts             # createTrackHandler() → { POST } — page view ingestion
    events.ts            # createEventsHandler() → { POST } — custom event ingestion
    admin/
      analytics.ts       # createAnalyticsHandler() → { GET } — traffic stats
      funnel.ts          # createFunnelHandler() → { GET } — config-driven funnel
      events.ts          # createEventFeedHandler() → { GET } — paginated event feed

  hooks/                 # React hooks ("use client", headless data layer)
    use-analytics-fetch.ts  # Internal shared fetcher
    use-date-range.ts       # Date range state (presets + custom)
    use-traffic-stats.ts    # Traffic data
    use-funnel.ts           # Funnel data
    use-event-feed.ts       # Event feed with pagination + filter
    use-revenue.ts          # Revenue KPIs
    index.ts                # Barrel export

  components/            # React components ("use client")
    tracker.tsx           # <PageTracker /> — drop-in page view tracker
    dashboard.tsx         # <AnalyticsDashboard /> — full admin UI (Level 1)
    primitives/           # Unstyled building blocks (Level 3)
      metric-card.tsx     # Label + large value display
      horizontal-bar.tsx  # Horizontal bar (label, track, value)
      bar-chart.tsx       # Vertical bar chart (pure CSS)
      breakdown-table.tsx # Grid table with configurable columns
      event-list.tsx      # Expandable event list with filter chips
      date-range-picker.tsx  # Preset buttons + custom date inputs
    widgets/              # Self-contained composed views (Level 2)
      traffic.tsx         # TrafficWidget — metric cards + charts + breakdowns
      funnel.tsx          # FunnelWidget — funnel bars + conversion rates + tables
      event-feed.tsx      # EventFeedWidget — filter + paginated list
      revenue.tsx         # RevenueWidget — KPI cards + daily bar chart
    index.ts              # Barrel export

  client/
    track-event.ts        # trackEvent() — client-side via navigator.sendBeacon
  server/
    track-event.ts        # trackEventServer() — server-side direct DB insert
  middleware/
    gclid.ts              # withAnalyticsMiddleware() — Safari ITP gclid cookie capture
  lib/
    rate-limit.ts         # In-memory rate limiter (37 lines, periodic cleanup)
    date-range.ts         # parseDateRange() — 24h/7d/30d presets + custom from/to
  theme.css               # Default CSS variable theme (optional import)

dist/                     # Pre-built JS + type declarations (committed to git)
```

## Architecture

### 3-Layer UI Design

Consumers pick their integration depth:

| Level | Import | What you get |
|-------|--------|-------------|
| **1 — Full auto** | `<AnalyticsDashboard />` + `theme.css` | Complete admin panel, one import |
| **2 — Widgets** | `<TrafficWidget />`, `<FunnelWidget />`, etc. | Self-contained sections in your layout |
| **3 — Primitives** | `<MetricCard />`, `<HorizontalBar />` + hooks | Building blocks with full layout control |
| **4 — Headless** | `useTrafficStats()`, `useFunnel()` etc. | Pure data, bring your own UI |

### Config Singleton Pattern

Consumers call `defineAnalytics()` once. Handlers call `getConfig()` internally.

```ts
// Consumer: lib/analytics.ts
import { defineAnalytics } from "@bestillpass/analytics";
defineAnalytics({ getDb: () => db, requireAdmin: ..., funnel: ..., revenue: ... });

// Consumer: app/api/analytics/track/route.ts
import "@/lib/analytics";  // side effect: registers config
import { createTrackHandler } from "@bestillpass/analytics/handlers/track";
export const { POST } = createTrackHandler();
```

### Handler Factory Pattern

All API handlers are factory functions returning `{ GET }` or `{ POST }`. Consumer re-exports from their own route files.

### Config-Driven Funnel

Stages query only `pageViews` + `analyticsEvents` (no business tables):
- `query: "sessions"` — count distinct sessions from pageViews
- `query: { event: "name" }` — count distinct sessions with that event
- `query: { path: "/pattern%" }` — count distinct sessions matching path (SQL LIKE)

### Revenue Callback

Package doesn't know about payment tables. Consumer implements `revenue.query(since, until)` against their own schema and returns `RevenueData`.

## Schema

**`pageViews`** (table: `page_views`):
id (uuid PK), path, referrer, userAgent, country, sessionId, deviceType, screenWidth, screenHeight, language, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, gclid, createdAt. Indexes: createdAt, path, sessionId.

**`analyticsEvents`** (table: `analytics_events`):
id (uuid PK), sessionId, eventName, properties (jsonb), path, createdAt. Indexes: createdAt, eventName, sessionId.

Table name is `analyticsEvents` (not `events`) to avoid collision with consumer tables.

## Subpath Exports

```
@bestillpass/analytics              — main entry (config, types, handlers, utilities)
@bestillpass/analytics/schema       — Drizzle table definitions
@bestillpass/analytics/middleware    — withAnalyticsMiddleware()
@bestillpass/analytics/handlers/*   — route handler factories
@bestillpass/analytics/hooks        — React hooks
@bestillpass/analytics/components   — all components (tracker, primitives, widgets, dashboard)
@bestillpass/analytics/theme.css    — default CSS theme
```

## Versioning & Distribution

- **Git tags:** `v0.1.0`, `v0.2.0`, etc.
- **Consumer pins to tag:** `"@bestillpass/analytics": "github:lax1n/analytics#v0.1.0"`
- **dist/ is committed** — consumers get pre-built JS, no compilation step
- **Lockfile pins to SHA** — reproducible builds
- **Local dev:** `npm link ../analytics` in the consuming project for live changes

## Critical Rules

1. **Always build before committing** — `npm run build` then commit `dist/` alongside `src/`
2. **Run `npm run typecheck`** before every commit
3. **No runtime dependencies** — only peer deps. No lodash, no recharts, no lucide, no CSS-in-JS
4. **"use client" directives** — tsc preserves them in dist/. Verify after build that client components have them
5. **Table name: `analyticsEvents`** not `events` — avoids collision with consumer tables
6. **CSS variables, not Tailwind** — components use `--analytics-*` custom properties, never Tailwind classes
7. **All components accept `className`** — consumers can override styling however they want
8. **Tracking never breaks the app** — all tracking code catches errors silently (empty catch is intentional here)
9. **drizzle-orm version parity** — consumer must use compatible major version
10. **No i18n** — labels are English. Consumers override via props or className if needed

## Consumer Setup (Quick Reference)

A consumer needs ~15 lines across 8 files to get full tracking + admin:

1. **Schema** — re-export `pageViews`, `analyticsEvents` from package in schema file
2. **Config** — `defineAnalytics()` in `lib/analytics.ts` with getDb, requireAdmin, funnel, revenue
3. **Layout** — mount `<PageTracker />` wrapped in `<Suspense>` (uses `useSearchParams`)
4. **Middleware** — call `withAnalyticsMiddleware(request, response, "prefix")`
5. **API routes** — 5-6 files, each ~4 lines (import config, import handler, re-export)
6. **Admin page** — `<AnalyticsDashboard />` + optional `theme.css` import
7. **Drizzle config** — schema file already re-exports analytics tables, run `drizzle-kit generate` + migrate
8. **Events** — call `trackEvent()` (client) and `trackEventServer()` (server) at key conversion points

## Current Consumers

### passklar (bestillpass.no)
- **Prefix:** `bp` (bp-sid, bp-gclid, bp-attribution)
- **Funnel:** visitors → checkout page → checkout_started → payment_completed
- **Revenue:** queries `payments` table (amount in øre / 100)
- **Admin auth:** ADMIN_TOKEN bearer check
- **Admin page:** `/admin`
- **Events tracked:** checkout_started, payment_completed, confirmation_viewed, push_permission_granted

### oops (nafskademelding.no) — future migration
- **Prefix:** `naf` (already uses naf-sid, naf-gclid)
- **Funnel:** visitors → report_created → step 1-5 → review → paid
- **Current code to replace:** `page-tracker.tsx`, `track-event.ts`, `track-event-server.ts`, admin components (~400 lines)
- **Note:** oops uses `events` table name — migration will need to rename to `analytics_events` or keep both

## Detailed Rules

See `.claude/rules/conventions.md` for coding conventions.
