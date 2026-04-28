import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function AdminLoading() {
  return (
    <div
      className="mx-auto grid min-w-0 gap-5 py-6 lg:py-8 xl:grid-cols-[260px_minmax(0,1fr)]"
      style={{ width: "min(1600px, calc(100% - 2rem))" }}
    >
      <LoadingSkeleton className="h-[420px] rounded-[28px]" />
      <div className="min-w-0 space-y-4">
        <LoadingSkeleton className="h-32 rounded-[28px]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <LoadingSkeleton className="h-32 rounded-[28px]" />
          <LoadingSkeleton className="h-32 rounded-[28px]" />
          <LoadingSkeleton className="h-32 rounded-[28px]" />
          <LoadingSkeleton className="h-32 rounded-[28px]" />
        </div>
        <LoadingSkeleton className="h-72 rounded-[32px]" />
      </div>
    </div>
  );
}
