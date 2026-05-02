import type { ReactNode } from "react";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { exploreNavigation } from "@/constants/site";
import { cn } from "@/lib/utils";

export function ExploreArticle({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="container-shell py-8 sm:py-12">
      <Link
        href="/"
        className="motion-soft inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-700)] hover:-translate-x-0.5 hover:text-[var(--color-brand-800)]"
      >
        <ArrowLeft className="size-4" />
        Về trang chủ
      </Link>

      <article className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.74fr)_minmax(280px,0.26fr)]">
        <div className="motion-panel rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent sm:rounded-[36px] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--color-text-muted)] sm:text-lg">
            {description}
          </p>
          <div className="mt-8 space-y-6 text-[var(--color-text-strong)]">{children}</div>
        </div>

        <aside className="motion-panel h-fit rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] sm:rounded-[30px] lg:sticky lg:top-24">
          <p className="text-sm font-semibold text-[var(--color-text-strong)]">
            Khám phá thêm
          </p>
          <div className="mt-4 grid gap-2">
            {exploreNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="motion-soft rounded-2xl px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-strong)]"
              >
                <span className="block font-semibold">{item.label}</span>
                {item.description ? (
                  <span className="mt-1 block text-xs leading-5 text-[var(--color-text-muted)]">
                    {item.description}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </aside>
      </article>
    </main>
  );
}

export function ExploreSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[24px] bg-[var(--color-surface-soft)] p-5 sm:p-6">
      <h2 className="text-xl font-semibold text-[var(--color-text-strong)] sm:text-2xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)] sm:text-base sm:leading-8">
          {description}
        </p>
      ) : null}
      <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-text-muted)] sm:text-base sm:leading-8">
        {children}
      </div>
    </section>
  );
}

export function ExploreInfoGrid({
  items,
}: {
  items: Array<{
    title: string;
    description: string;
    icon: ReactNode;
    tone?: "brand" | "warning" | "success" | "muted";
  }>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.title}
          className="motion-panel rounded-[22px] bg-[var(--color-surface)] p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
        >
          <div
            className={cn(
              "flex size-11 items-center justify-center rounded-2xl shadow-sm",
              item.tone === "warning"
                ? "bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)]"
                : item.tone === "success"
                  ? "bg-[var(--badge-success-bg)] text-[var(--badge-success-text)]"
                  : item.tone === "muted"
                    ? "bg-[var(--badge-muted-bg)] text-[var(--badge-muted-text)]"
                    : "bg-[var(--badge-brand-bg)] text-[var(--badge-brand-text)]",
            )}
          >
            {item.icon}
          </div>
          <h3 className="mt-3 text-base font-semibold text-[var(--color-text-strong)]">
            {item.title}
          </h3>
          <p className="mt-1 text-sm leading-7 text-[var(--color-text-muted)]">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}

export function ExploreStepList({
  items,
}: {
  items: Array<{ title: string; description: string }>;
}) {
  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <div
          key={item.title}
          className="grid gap-3 rounded-[20px] bg-[var(--color-surface)] p-4 sm:grid-cols-[3rem_minmax(0,1fr)]"
        >
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--badge-brand-bg)] font-semibold text-[var(--badge-brand-text)]">
            {index + 1}
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--color-text-strong)]">
              {item.title}
            </h3>
            <p className="mt-1 text-sm leading-7 text-[var(--color-text-muted)]">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ExploreChecklist({
  items,
}: {
  items: Array<{ title: string; description: string }>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <label
          key={item.title}
          className="motion-panel flex items-start gap-3 rounded-[20px] bg-[var(--color-surface)] p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
        >
          <input
            type="checkbox"
            className="mt-1 size-4 shrink-0 accent-[var(--color-brand-700)]"
          />
          <span>
            <span className="block text-sm font-semibold text-[var(--color-text-strong)]">
              {item.title}
            </span>
            <span className="mt-1 block text-sm leading-6 text-[var(--color-text-muted)]">
              {item.description}
            </span>
          </span>
        </label>
      ))}
    </div>
  );
}

export function PopularAreaCard({
  name,
  description,
  strengths,
  audience,
  href,
}: {
  name: string;
  description: string;
  strengths: string[];
  audience: string;
  href: string;
}) {
  return (
    <article className="motion-panel flex h-full flex-col rounded-[24px] bg-[var(--color-surface)] p-5 shadow-sm hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-[var(--color-text-strong)]">{name}</h3>
          <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
            {description}
          </p>
        </div>
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--badge-brand-bg)] text-[var(--badge-brand-text)]">
          <CheckCircle2 className="size-5" />
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {strengths.map((strength) => (
          <div
            key={strength}
            className="rounded-2xl bg-[var(--color-surface-soft)] px-3 py-2 text-sm text-[var(--color-text-muted)]"
          >
            {strength}
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">
        <span className="font-semibold text-[var(--color-text-strong)]">Phù hợp:</span>{" "}
        {audience}
      </p>

      <Link href={href} className="mt-5 block">
        <Button
          className="w-full"
          variant="outline"
          trailingIcon={<ArrowRight className="size-4" />}
        >
          Xem phòng
        </Button>
      </Link>
    </article>
  );
}
