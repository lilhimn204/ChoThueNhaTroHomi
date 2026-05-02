import { CmsArticlePreviewClient } from "@/components/cms/cms-article-preview-client";

export default async function CmsArticlePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CmsArticlePreviewClient articleId={Number(id)} />;
}
