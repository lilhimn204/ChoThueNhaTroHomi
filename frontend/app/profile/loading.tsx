import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function ProfileLoading() {
  return (
    <div className="container-shell animate-content-rise grid gap-5 py-8 sm:gap-8 sm:py-12 xl:grid-cols-[0.72fr_1.28fr]">
      <LoadingSkeleton className="h-64 rounded-[24px] sm:h-80 sm:rounded-[32px]" />
      <LoadingSkeleton className="h-[28rem] rounded-[24px] sm:h-[32rem] sm:rounded-[32px]" />
    </div>
  );
}
