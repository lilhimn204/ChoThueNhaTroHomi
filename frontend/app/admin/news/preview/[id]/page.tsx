import { AdminNewsPreviewClient } from "@/components/admin/admin-news-preview-client";

export default async function AdminNewsPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminNewsPreviewClient articleId={Number(id)} />;
}
