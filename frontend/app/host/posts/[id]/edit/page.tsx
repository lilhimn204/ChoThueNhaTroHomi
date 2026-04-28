import { HostRoomForm } from "@/components/host/host-room-form";

export default async function HostEditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <HostRoomForm mode="edit" roomId={Number(id)} />;
}
