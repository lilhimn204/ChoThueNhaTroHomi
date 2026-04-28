import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function HostLoading() {
  return (
    <div className="container-shell grid gap-6 py-8 lg:grid-cols-[300px_1fr]">
      <LoadingSkeleton className="h-[520px] rounded-[30px]" />
      <div className="space-y-4">
        <LoadingSkeleton className="h-44 rounded-[32px]" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <LoadingSkeleton className="h-40 rounded-[28px]" />
          <LoadingSkeleton className="h-40 rounded-[28px]" />
          <LoadingSkeleton className="h-40 rounded-[28px]" />
          <LoadingSkeleton className="h-40 rounded-[28px]" />
        </div>
        <LoadingSkeleton className="h-80 rounded-[32px]" />
      </div>
    </div>
  );
}
