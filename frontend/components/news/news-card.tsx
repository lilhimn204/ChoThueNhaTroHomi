import Link from "next/link";
import { ArrowRight, CalendarDays, UserRound } from "lucide-react";

import { NewsImage } from "@/components/news/news-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { NewsArticle } from "@/types";

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="motion-panel group flex h-full flex-col overflow-hidden rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)]">
      <Link href={`/news/${article.slug}`} className="block">
        <NewsImage
          src={article.thumbnailUrl}
          title={article.title}
          className="aspect-[16/10] shadow-sm"
        />
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex flex-wrap items-center gap-2">
          {article.featured ? <Badge tone="warning">Nổi bật</Badge> : null}
          <Badge tone="brand">{article.category}</Badge>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)]">
            <CalendarDays className="size-3.5" />
            {formatDate(article.publishedAt ?? article.createdAt)}
          </span>
        </div>

        <Link href={`/news/${article.slug}`} className="mt-3 block">
          <h2 className="line-clamp-2 text-xl font-semibold leading-tight text-[var(--color-text-strong)] transition-colors group-hover:text-[var(--color-brand-700)]">
            {article.title}
          </h2>
        </Link>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--color-text-muted)]">
          {article.summary}
        </p>

        <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
          <UserRound className="size-3.5" />
          {article.authorName}
        </div>

        <Link href={`/news/${article.slug}`} className="mt-5 block">
          <Button
            className="w-full"
            variant="outline"
            trailingIcon={<ArrowRight className="size-4" />}
          >
            Xem chi tiết
          </Button>
        </Link>
      </div>
    </article>
  );
}
