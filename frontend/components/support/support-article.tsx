import type { ReactNode } from "react";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function SupportArticle({
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

      <article className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(280px,0.22fr)]">
        <div className="motion-panel rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent sm:rounded-[36px] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--color-text-muted)] sm:text-lg">
            {description}
          </p>
          <div className="mt-8 space-y-6 text-[var(--color-text-strong)]">{children}</div>
        </div>

        <aside className="motion-panel h-fit rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] sm:rounded-[30px]">
          <p className="text-sm font-semibold text-[var(--color-text-strong)]">Hỗ trợ nhanh</p>
          <div className="mt-4 grid gap-2">
            {[
              ["Hướng dẫn tìm phòng", "/support/huong-dan-tim-phong"],
              ["Câu hỏi thường gặp", "/support/faq"],
              ["Báo cáo tin sai", "/support/bao-cao-tin-sai"],
              ["Liên hệ Homi", "/support/lien-he"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="motion-soft rounded-2xl px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-strong)]"
              >
                {label}
              </Link>
            ))}
          </div>
        </aside>
      </article>
    </main>
  );
}

export function ArticleSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[24px] bg-[var(--color-surface-soft)] p-5 sm:p-6">
      <h2 className="text-xl font-semibold text-[var(--color-text-strong)] sm:text-2xl">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-[var(--color-text-muted)] sm:text-base sm:leading-8">
        {children}
      </div>
    </section>
  );
}
