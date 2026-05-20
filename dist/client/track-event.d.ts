/**
 * Track a custom event client-side via sendBeacon.
 * Fire-and-forget — never throws.
 *
 * The `prefix` argument must match the `prefix` passed to <PageTracker />
 * (and the consumer's middleware call), so the event can be joined to the
 * page-view session in the funnel query. Defaults to "bp" for backward
 * compatibility with the first consumer (passklar).
 */
export declare function trackEvent(name: string, properties?: Record<string, unknown>, basePath?: string, prefix?: string): void;
//# sourceMappingURL=track-event.d.ts.map