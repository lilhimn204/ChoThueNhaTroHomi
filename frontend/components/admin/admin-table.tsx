import type { ReactNode } from "react";

export function AdminTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | ReactNode)[][];
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
      <div className="border-b border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] px-4 py-2 text-xs font-medium text-[var(--color-text-muted)] lg:hidden">
        Kéo ngang để xem đầy đủ các cột
      </div>

      <div className="overflow-x-auto overscroll-x-contain [touch-action:pan-x] [-webkit-overflow-scrolling:touch]">
        <table className="w-full min-w-[760px] divide-y divide-[var(--color-border-soft)]">
          <thead className="bg-[var(--color-surface-soft)]">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-soft)]">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="transition-colors duration-200 hover:bg-[var(--color-surface-soft)]">
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${rowIndex}-${cellIndex}`}
                    className="px-4 py-3 align-middle text-sm text-[var(--color-text-strong)]"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
