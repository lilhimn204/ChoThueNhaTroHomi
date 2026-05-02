import { CmsArticleFormClient } from "@/components/cms/cms-article-form-client";

export default async function CmsEditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CmsArticleFormClient mode="edit" articleId={Number(id)} />;
}
