/**
 * Track a custom event client-side via sendBeacon.
 * Fire-and-forget — never throws.
 *
 * The `prefix` argument must match the `prefix` passed to <PageTracker />
 * (and the consumer's middleware call), so the event can be joined to the
 * page-view session in the funnel query. Defaults to "bp" for backward
 * compatibility with the first consumer (passklar).
 */
export function trackEvent(
  name: string,
  properties?: Record<string, unknown>,
  basePath: string = "/api/analytics",
  prefix: string = "bp"
): void {
  try {
    const sessionId = typeof window !== "undefined"
      ? sessionStorage.getItem(`${prefix}-sid`)
      : null;
    const path = typeof window !== "undefined"
      ? window.location.pathname
      : undefined;

    const payload = {
      eventName: name,
      sessionId,
      path,
      properties,
    };

    const blob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });
    navigator.sendBeacon(`${basePath}/events`, blob);
  } catch {
    // silently fail — tracking should never break the app
  }
}
