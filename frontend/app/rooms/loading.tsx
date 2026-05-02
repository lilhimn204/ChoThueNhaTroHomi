import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { RoomsGridSkeleton } from "@/components/rooms/rooms-page-client";

export default function RoomsLoading() {
  return (
    <div className="container-shell animate-content-rise py-8">
      <LoadingSkeleton className="h-28 rounded-[30px]" />
      <div className="mt-6 grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <LoadingSkeleton className="hidden h-[32rem] rounded-[30px] xl:block" />
        <div className="space-y-6">
          <LoadingSkeleton className="h-20 rounded-[28px]" />
          <LoadingSkeleton className="h-24 rounded-[28px]" />
          <RoomsGridSkeleton />
        </div>
      </div>
    </div>
  );
}
