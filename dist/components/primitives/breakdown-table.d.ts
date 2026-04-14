interface Column {
    key: string;
    label: string;
    align?: "left" | "right";
}
interface BreakdownTableProps {
    title?: string;
    columns: Column[];
    rows: Record<string, unknown>[];
    className?: string;
}
export declare function BreakdownTable({ title, columns, rows, className, }: BreakdownTableProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=breakdown-table.d.ts.map