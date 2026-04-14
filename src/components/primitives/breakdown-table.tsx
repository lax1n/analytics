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

export function BreakdownTable({
  title,
  columns,
  rows,
  className,
}: BreakdownTableProps) {
  if (rows.length === 0) return null;

  const gridCols = columns
    .map((c, i) => (i === 0 ? "1fr" : "70px"))
    .join(" ");

  return (
    <div className={className}>
      {title && <div data-analytics-section-title>{title}</div>}
      <div data-analytics-table>
        <div data-analytics-table-header style={{ gridTemplateColumns: gridCols }}>
          {columns.map((col) => (
            <span
              key={col.key}
              style={{ textAlign: col.align ?? (col.key === columns[0].key ? "left" : "right") }}
            >
              {col.label}
            </span>
          ))}
        </div>
        {rows.map((row, i) => (
          <div
            key={i}
            data-analytics-table-row
            style={{ gridTemplateColumns: gridCols }}
          >
            {columns.map((col) => (
              <span
                key={col.key}
                style={{
                  textAlign: col.align ?? (col.key === columns[0].key ? "left" : "right"),
                  overflow: col.key === columns[0].key ? "hidden" : undefined,
                  textOverflow: col.key === columns[0].key ? "ellipsis" : undefined,
                  whiteSpace: col.key === columns[0].key ? "nowrap" : undefined,
                  color:
                    col.key !== columns[0].key
                      ? "var(--analytics-text-muted)"
                      : undefined,
                }}
              >
                {String(row[col.key] ?? "—")}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
