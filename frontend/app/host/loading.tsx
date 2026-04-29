import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function HostLoading() {
  return (
    <div className="container-shell grid gap-5 py-5 sm:py-8 lg:grid-cols-[300px_1fr] lg:gap-6">
      <LoadingSkeleton className="h-56 rounded-[24px] sm:h-[520px] sm:rounded-[30px]" />
      <div className="space-y-4">
        <LoadingSkeleton className="h-40 rounded-[24px] sm:h-44 sm:rounded-[32px]" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <LoadingSkeleton className="h-40 rounded-[28px]" />
          <LoadingSkeleton className="h-40 rounded-[28px]" />
          <LoadingSkeleton className="h-40 rounded-[28px]" />
          <LoadingSkeleton className="h-40 rounded-[28px]" />
        </div>
        <LoadingSkeleton className="h-72 rounded-[24px] sm:h-80 sm:rounded-[32px]" />
      </div>
    </div>
  );
}
