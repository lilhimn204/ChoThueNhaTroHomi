import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function ProfileLoading() {
  return (
    <div className="container-shell grid gap-8 py-12 xl:grid-cols-[0.72fr_1.28fr]">
      <LoadingSkeleton className="h-80 rounded-[32px]" />
      <LoadingSkeleton className="h-[32rem] rounded-[32px]" />
    </div>
  );
}
