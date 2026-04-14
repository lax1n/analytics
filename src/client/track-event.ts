/**
 * Track a custom event client-side via sendBeacon.
 * Fire-and-forget — never throws.
 */
export function trackEvent(
  name: string,
  properties?: Record<string, unknown>,
  basePath: string = "/api/analytics"
): void {
  try {
    const sessionId = typeof window !== "undefined"
      ? sessionStorage.getItem("bp-sid")
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
