import { getConfig } from "../config.js";
import { analyticsEvents } from "../schema.js";

/**
 * Track an event server-side (inserts directly to DB).
 * Fire-and-forget — catches and logs errors silently.
 */
export async function trackEventServer(
  name: string,
  properties?: Record<string, unknown>,
  path?: string
): Promise<void> {
  try {
    const db = getConfig().getDb() as any;
    await db.insert(analyticsEvents).values({
      sessionId: null,
      eventName: name.slice(0, 100),
      path: path?.slice(0, 500) || null,
      properties: properties ?? null,
    });
  } catch (error) {
    console.error("[@bestillpass/analytics] Failed to track event:", error);
  }
}
