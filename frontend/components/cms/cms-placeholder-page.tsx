import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { CmsPageHeader } from "@/components/cms/cms-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CmsPlaceholderPageProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  nextSteps: string[];
  primaryHref?: string;
  primaryLabel?: string;
}

export function CmsPlaceholderPage({
  eyebrow,
  title,
  description,
  icon: Icon,
  nextSteps,
  primaryHref,
  primaryLabel,
}: CmsPlaceholderPageProps) {
  return (
    <div className="space-y-5">
      <CmsPageHeader eyebrow={eyebrow} title={title} description={description}>
        {primaryHref && primaryLabel ? (
          <Link href={primaryHref}>
            <Button trailingIcon={<ArrowRight className="size-4" />}>{primaryLabel}</Button>
          </Link>
        ) : null}
      </CmsPageHeader>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,0.7fr)_minmax(280px,0.3fr)]">
        <div className="motion-panel rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] lg:p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--badge-brand-bg)] text-[var(--badge-brand-text)]">
              <Icon className="size-6" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-semibold text-[var(--color-text-strong)]">
                  Khung chức năng đã sẵn sàng
                </h3>
                <Badge tone="warning">Giai đoạn 1</Badge>
              </div>
              <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
                Route và layout đã được tách riêng để các chức năng CMS có thể phát triển độc lập với khu admin hiện tại.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {nextSteps.map((step) => (
              <div
                key={step}
                className="rounded-2xl border border-[var(--color-border-card)] bg-[var(--color-surface-soft)] p-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--badge-success-text)]" />
                  <p className="text-sm leading-6 text-[var(--color-text-strong)]">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="motion-panel rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">
            Không ảnh hưởng Admin
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
            `/cms` dùng layout riêng và chỉ reuse guard đăng nhập. Các trang `/admin`, `/host`, `/news` vẫn hoạt động theo flow hiện tại.
          </p>
        </aside>
      </section>
    </div>
  );
}
