import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function GlobalLoading() {
  return (
    <div className="container-shell py-10">
      <LoadingSkeleton className="h-8 w-64 rounded-xl" />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <LoadingSkeleton className="h-64 rounded-[32px]" />
        <LoadingSkeleton className="h-64 rounded-[32px]" />
      </div>
      <LoadingSkeleton className="mt-6 h-48 rounded-[32px]" />
    </div>
  );
}
