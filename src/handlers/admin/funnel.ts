import { NextRequest, NextResponse } from "next/server";
import { getConfig } from "../../config.js";
import { pageViews, analyticsEvents } from "../../schema.js";
import { rateLimit as defaultRateLimit } from "../../lib/rate-limit.js";
import { parseDateRange } from "../../lib/date-range.js";
import {
  sql,
  gte,
  lte,
  and,
  eq,
  countDistinct,
} from "drizzle-orm";
import type { FunnelStage } from "../../types.js";

export function createFunnelHandler() {
  async function GET(request: NextRequest) {
    const config = getConfig();
    const db = config.getDb() as any;
    const limiter = config.rateLimit ?? defaultRateLimit;

    if (!(await config.requireAdmin(request))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    if (!limiter(`admin-funnel:${ip}`, 10, 60_000)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    if (!config.funnel?.stages?.length) {
      return NextResponse.json(
        { error: "Funnel not configured" },
        { status: 404 }
      );
    }

    const range = request.nextUrl.searchParams.get("range") ?? "7d";
    const { since, until } = parseDateRange(request.nextUrl.searchParams);

    const pvDateFilter = until
      ? and(
          gte(pageViews.createdAt, since),
          lte(pageViews.createdAt, until)
        )
      : gte(pageViews.createdAt, since);

    const evDateFilter = until
      ? and(
          gte(analyticsEvents.createdAt, since),
          lte(analyticsEvents.createdAt, until)
        )
      : gte(analyticsEvents.createdAt, since);

    // Query each funnel stage
    const stageQueries = config.funnel.stages.map((stage: FunnelStage) => {
      if (stage.query === "sessions") {
        return db
          .select({ count: countDistinct(pageViews.sessionId) })
          .from(pageViews)
          .where(pvDateFilter);
      } else if ("event" in stage.query) {
        return db
          .select({ count: countDistinct(analyticsEvents.sessionId) })
          .from(analyticsEvents)
          .where(
            and(evDateFilter, eq(analyticsEvents.eventName, stage.query.event))
          );
      } else {
        // path match using LIKE
        return db
          .select({ count: countDistinct(pageViews.sessionId) })
          .from(pageViews)
          .where(
            and(
              pvDateFilter,
              sql`${pageViews.path} LIKE ${stage.query.path}`
            )
          );
      }
    });

    // Breakdowns use first-touch attribution per session: a session's source,
    // device, and keyword are taken from its earliest page view in the window.
    // Without this, internal navigations (which have utm_source=NULL → "direct")
    // double-count ad-driven sessions in the "direct" bucket.
    const [stageResults, bySourceRows, byDeviceRows, byKeywordRows] =
      await Promise.all([
        Promise.all(stageQueries),
        // By source — first-touch
        db.execute(sql`
          SELECT source, COUNT(DISTINCT sid) AS visitors
          FROM (
            SELECT DISTINCT ON (session_id)
              session_id AS sid,
              COALESCE(utm_source, 'direct') AS source
            FROM ${pageViews}
            WHERE ${pvDateFilter}
            ORDER BY session_id, created_at ASC
          ) ft
          GROUP BY source
          ORDER BY visitors DESC
          LIMIT 10
        `),
        // By device — first-touch
        db.execute(sql`
          SELECT device, COUNT(DISTINCT sid) AS visitors
          FROM (
            SELECT DISTINCT ON (session_id)
              session_id AS sid,
              COALESCE(device_type, 'unknown') AS device
            FROM ${pageViews}
            WHERE ${pvDateFilter}
            ORDER BY session_id, created_at ASC
          ) ft
          GROUP BY device
          ORDER BY visitors DESC
        `),
        // By keyword — first-touch (only sessions that landed with a utm_term)
        db.execute(sql`
          SELECT keyword, COUNT(DISTINCT sid) AS visitors
          FROM (
            SELECT DISTINCT ON (session_id)
              session_id AS sid,
              utm_term AS keyword
            FROM ${pageViews}
            WHERE ${pvDateFilter}
            ORDER BY session_id, created_at ASC
          ) ft
          WHERE keyword IS NOT NULL
          GROUP BY keyword
          ORDER BY visitors DESC
          LIMIT 10
        `),
      ]);

    // Build stages array
    const stages = config.funnel.stages.map(
      (stage: FunnelStage, i: number) => ({
        key: stage.key,
        label: stage.label,
        count: stageResults[i]?.[0]?.count ?? 0,
      })
    );

    // Get last stage count for conversion calculation
    const lastStage = config.funnel.stages[config.funnel.stages.length - 1];
    let lastStageCountBySource: Map<string, number> = new Map();
    let lastStageCountByDevice: Map<string, number> = new Map();
    let lastStageCountByKeyword: Map<string, number> = new Map();

    // If last stage is an event, get breakdowns for it
    if (lastStage && typeof lastStage.query === "object" && "event" in lastStage.query) {
      const eventName = lastStage.query.event;

      // Conversion breakdowns also use first-touch attribution: a session's
      // source/device/keyword come from its earliest page view in the window,
      // not from every page view it had. Otherwise a converted session that
      // landed via google then internally navigated (utm_source=NULL) would
      // count under both "google" and "direct".
      const [convertedBySource, convertedByDevice, convertedByKeyword] =
        await Promise.all([
          db.execute(sql`
            SELECT ft.source, COUNT(DISTINCT ae.session_id) AS converted
            FROM ${analyticsEvents} ae
            JOIN (
              SELECT DISTINCT ON (session_id)
                session_id AS sid,
                COALESCE(utm_source, 'direct') AS source
              FROM ${pageViews}
              WHERE ${pvDateFilter}
              ORDER BY session_id, created_at ASC
            ) ft ON ft.sid = ae.session_id
            WHERE ae.event_name = ${eventName} AND ${evDateFilter}
            GROUP BY ft.source
            LIMIT 10
          `),
          db.execute(sql`
            SELECT ft.device, COUNT(DISTINCT ae.session_id) AS converted
            FROM ${analyticsEvents} ae
            JOIN (
              SELECT DISTINCT ON (session_id)
                session_id AS sid,
                COALESCE(device_type, 'unknown') AS device
              FROM ${pageViews}
              WHERE ${pvDateFilter}
              ORDER BY session_id, created_at ASC
            ) ft ON ft.sid = ae.session_id
            WHERE ae.event_name = ${eventName} AND ${evDateFilter}
            GROUP BY ft.device
          `),
          db.execute(sql`
            SELECT ft.keyword, COUNT(DISTINCT ae.session_id) AS converted
            FROM ${analyticsEvents} ae
            JOIN (
              SELECT DISTINCT ON (session_id)
                session_id AS sid,
                utm_term AS keyword
              FROM ${pageViews}
              WHERE ${pvDateFilter}
              ORDER BY session_id, created_at ASC
            ) ft ON ft.sid = ae.session_id
            WHERE ae.event_name = ${eventName} AND ${evDateFilter}
              AND ft.keyword IS NOT NULL
            GROUP BY ft.keyword
            LIMIT 10
          `),
        ]);

      const sourceRows = (convertedBySource as any).rows ?? convertedBySource;
      const deviceRows = (convertedByDevice as any).rows ?? convertedByDevice;
      const keywordRows = (convertedByKeyword as any).rows ?? convertedByKeyword;
      for (const row of sourceRows as Array<{ source: string; converted: string | number }>) {
        lastStageCountBySource.set(row.source, Number(row.converted));
      }
      for (const row of deviceRows as Array<{ device: string; converted: string | number }>) {
        lastStageCountByDevice.set(row.device, Number(row.converted));
      }
      for (const row of keywordRows as Array<{ keyword: string | null; converted: string | number }>) {
        if (row.keyword) lastStageCountByKeyword.set(row.keyword, Number(row.converted));
      }
    }

    // db.execute returns { rows: [...] } on pg drivers, plain array on others.
    // Counts come back as strings from raw SQL (COUNT()) — coerce to number.
    const bySourceList = ((bySourceRows as any).rows ?? bySourceRows) as Array<{
      source: string;
      visitors: string | number;
    }>;
    const byDeviceList = ((byDeviceRows as any).rows ?? byDeviceRows) as Array<{
      device: string;
      visitors: string | number;
    }>;
    const byKeywordList = ((byKeywordRows as any).rows ?? byKeywordRows) as Array<{
      keyword: string | null;
      visitors: string | number;
    }>;

    const bySource = bySourceList.map((row) => ({
      source: row.source,
      visitors: Number(row.visitors),
      converted: lastStageCountBySource.get(row.source) ?? 0,
    }));

    const byDevice = byDeviceList
      .filter((d) => d.device !== "unknown")
      .map((row) => ({
        device: row.device,
        visitors: Number(row.visitors),
        converted: lastStageCountByDevice.get(row.device) ?? 0,
      }));

    const byKeyword = byKeywordList.map((row) => ({
      keyword: row.keyword ?? "",
      visitors: Number(row.visitors),
      converted: lastStageCountByKeyword.get(row.keyword ?? "") ?? 0,
    }));

    // Conversion rates between consecutive stages
    const conversionRates = [];
    for (let i = 1; i < stages.length; i++) {
      const from = stages[i - 1];
      const to = stages[i];
      const rate =
        from.count > 0
          ? Math.round((to.count / from.count) * 1000) / 10
          : 0;
      conversionRates.push({
        label: `${from.label} → ${to.label}`,
        from: from.key,
        to: to.key,
        rate,
      });
    }
    // Overall conversion (first → last)
    if (stages.length >= 2) {
      const first = stages[0];
      const last = stages[stages.length - 1];
      const rate =
        first.count > 0
          ? Math.round((last.count / first.count) * 1000) / 10
          : 0;
      conversionRates.push({
        label: `${first.label} → ${last.label}`,
        from: first.key,
        to: last.key,
        rate,
      });
    }

    return NextResponse.json({
      range,
      stages,
      bySource,
      byDevice,
      byKeyword,
      conversionRates,
    });
  }

  return { GET };
}
