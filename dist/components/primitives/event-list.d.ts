import type { EventRow } from "../../types.js";
interface EventListProps {
    events: EventRow[];
    total: number;
    hasMore: boolean;
    eventNames: {
        name: string;
        count: number;
    }[];
    filter: string | null;
    onFilter: (name: string | null) => void;
    onLoadMore: () => void;
    loading?: boolean;
    className?: string;
}
export declare function EventList({ events, total, hasMore, eventNames, filter, onFilter, onLoadMore, loading, className, }: EventListProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=event-list.d.ts.map