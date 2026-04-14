import type { EventRow } from "../types.js";
export declare function useEventFeed(basePath?: string): {
    events: EventRow[];
    total: number;
    hasMore: boolean;
    eventNames: {
        name: string;
        count: number;
    }[];
    loading: boolean;
    error: string | null;
    filter: string | null;
    setFilter: (name: string | null) => void;
    loadMore: () => void;
    refetch: () => void;
};
//# sourceMappingURL=use-event-feed.d.ts.map