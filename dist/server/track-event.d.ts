/**
 * Track an event server-side (inserts directly to DB).
 * Fire-and-forget — catches and logs errors silently.
 */
export declare function trackEventServer(name: string, properties?: Record<string, unknown>, path?: string): Promise<void>;
//# sourceMappingURL=track-event.d.ts.map