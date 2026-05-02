import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function GlobalLoading() {
  return (
    <div className="container-shell animate-content-rise py-8 sm:py-10">
      <LoadingSkeleton className="h-8 w-64 rounded-xl" />
      <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-2">
        <LoadingSkeleton className="h-56 rounded-[24px] sm:h-64 sm:rounded-[32px]" />
        <LoadingSkeleton className="h-56 rounded-[24px] sm:h-64 sm:rounded-[32px]" />
      </div>
      <LoadingSkeleton className="mt-5 h-40 rounded-[24px] sm:mt-6 sm:h-48 sm:rounded-[32px]" />
    </div>
  );
}
