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
  isNotNull,
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

    // Also query breakdowns
    const [stageResults, bySourceRows, byDeviceRows, byKeywordRows] =
      await Promise.all([
        Promise.all(stageQueries),
        // By source
        db
          .select({
            source: sql<string>`COALESCE(${pageViews.utmSource}, 'direct')`.as(
              "source"
            ),
            visitors: countDistinct(pageViews.sessionId),
          })
          .from(pageViews)
          .where(pvDateFilter)
          .groupBy(sql`source`)
          .orderBy(sql`${countDistinct(pageViews.sessionId)} DESC`)
          .limit(10),
        // By device
        db
          .select({
            device: sql<string>`COALESCE(${pageViews.deviceType}, 'unknown')`.as(
              "device"
            ),
            visitors: countDistinct(pageViews.sessionId),
          })
          .from(pageViews)
          .where(pvDateFilter)
          .groupBy(sql`device`)
          .orderBy(sql`${countDistinct(pageViews.sessionId)} DESC`),
        // By keyword
        db
          .select({
            keyword: pageViews.utmTerm,
            visitors: countDistinct(pageViews.sessionId),
          })
          .from(pageViews)
          .where(and(pvDateFilter, isNotNull(pageViews.utmTerm)))
          .groupBy(pageViews.utmTerm)
          .orderBy(sql`${countDistinct(pageViews.sessionId)} DESC`)
          .limit(10),
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

      const [convertedBySource, convertedByDevice, convertedByKeyword] =
        await Promise.all([
          // Join events to pageViews via sessionId to get source
          db
            .select({
              source: sql<string>`COALESCE(${pageViews.utmSource}, 'direct')`.as("source"),
              converted: countDistinct(analyticsEvents.sessionId),
            })
            .from(analyticsEvents)
            .innerJoin(
              pageViews,
              eq(analyticsEvents.sessionId, pageViews.sessionId)
            )
            .where(
              and(evDateFilter, eq(analyticsEvents.eventName, eventName))
            )
            .groupBy(sql`source`)
            .limit(10),
          db
            .select({
              device: sql<string>`COALESCE(${pageViews.deviceType}, 'unknown')`.as("device"),
              converted: countDistinct(analyticsEvents.sessionId),
            })
            .from(analyticsEvents)
            .innerJoin(
              pageViews,
              eq(analyticsEvents.sessionId, pageViews.sessionId)
            )
            .where(
              and(evDateFilter, eq(analyticsEvents.eventName, eventName))
            )
            .groupBy(sql`device`),
          db
            .select({
              keyword: pageViews.utmTerm,
              converted: countDistinct(analyticsEvents.sessionId),
            })
            .from(analyticsEvents)
            .innerJoin(
              pageViews,
              eq(analyticsEvents.sessionId, pageViews.sessionId)
            )
            .where(
              and(
                evDateFilter,
                eq(analyticsEvents.eventName, eventName),
                isNotNull(pageViews.utmTerm)
              )
            )
            .groupBy(pageViews.utmTerm)
            .limit(10),
        ]);

      for (const row of convertedBySource) {
        lastStageCountBySource.set(row.source, row.converted);
      }
      for (const row of convertedByDevice) {
        lastStageCountByDevice.set(row.device, row.converted);
      }
      for (const row of convertedByKeyword) {
        if (row.keyword) lastStageCountByKeyword.set(row.keyword, row.converted);
      }
    }

    // Build breakdown arrays
    const bySource = bySourceRows.map(
      (row: { source: string; visitors: number }) => ({
        source: row.source,
        visitors: row.visitors,
        converted: lastStageCountBySource.get(row.source) ?? 0,
      })
    );

    const byDevice = byDeviceRows
      .filter((d: { device: string }) => d.device !== "unknown")
      .map((row: { device: string; visitors: number }) => ({
        device: row.device,
        visitors: row.visitors,
        converted: lastStageCountByDevice.get(row.device) ?? 0,
      }));

    const byKeyword = byKeywordRows.map(
      (row: { keyword: string | null; visitors: number }) => ({
        keyword: row.keyword ?? "",
        visitors: row.visitors,
        converted: lastStageCountByKeyword.get(row.keyword ?? "") ?? 0,
      })
    );

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
