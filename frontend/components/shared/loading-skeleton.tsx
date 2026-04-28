export function LoadingSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-3xl bg-[linear-gradient(90deg,var(--skeleton-from),var(--skeleton-via),var(--skeleton-to))] bg-[length:200%_100%] shadow-sm ring-1 ring-[var(--color-border-soft)]/60 ${className ?? ""}`}
    />
  );
}
