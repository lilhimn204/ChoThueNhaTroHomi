"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";

import { AdminTable } from "@/components/admin/admin-table";
import { RoomImageManager } from "@/components/forms/room-image-manager";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";

import { roomStatusMeta } from "@/constants/status";
import { exportCsv } from "@/lib/export-csv";
import { formatCompactCurrency, formatDate } from "@/lib/format";
import { ApiError, getErrorMessage } from "@/services/api-client";
import { getAmenities, getDistricts } from "@/services/lookup-service";
import {
  createRoom,
  deleteRoom,
  searchAdminRooms,
  updateRoomStatus,
} from "@/services/room-service";
import type { RoomImageInput } from "@/services/room-service";
import type { AdminRoomListItem, Amenity, District, PageResponse, RoomStatus } from "@/types";

const PAGE_SIZE = 8;

const initialForm = {
  title: "",
  description: "",
  address: "",
  districtId: "",
  price: "",
  area: "",
  contactName: "",
  contactPhone: "",
  status: "AVAILABLE" as RoomStatus,
  thumbnail: "",
  images: [] as RoomImageInput[],
  featured: false,
  amenityIds: [] as string[],
};

function normalizePayloadImages(images: RoomImageInput[], title: string) {
  const hasThumbnail = images.some((image) => image.isThumbnail);

  return images
    .filter((image) => image.imageUrl.trim())
    .map((image, index) => ({
      imageUrl: image.imageUrl.trim(),
      altText: image.altText.trim() || title.trim() || `Ảnh phòng ${index + 1}`,
      sortOrder: index + 1,
      isThumbnail: hasThumbnail ? image.isThumbnail : index === 0,
    }));
}

export function AdminRoomsClient() {

  const { toast } = useToast();
  const [filters, setFilters] = useState({
    keyword: "",
    districtId: "",
    status: "",
  });
  const [formData, setFormData] = useState(initialForm);
  const [districts, setDistricts] = useState<District[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<PageResponse<AdminRoomListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionRoomId, setActionRoomId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [exporting, setExporting] = useState(false);

  const loadRooms = (pageValue = page, signal?: AbortSignal) => {
    setLoading(true);
    setErrorMessage("");

    return searchAdminRooms(
      {
        keyword: filters.keyword.trim(),
        districtId: filters.districtId,
        status: filters.status as RoomStatus | "",
        page: pageValue - 1,
        size: PAGE_SIZE,
      },
      signal,
    )
      .then((nextResponse) => {
        setResponse(nextResponse);
      })
      .catch((error) => {
        if (signal?.aborted) {
          return;
        }

        setErrorMessage(getErrorMessage(error));
      })
      .finally(() => {
        if (!signal?.aborted) {
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    const controller = new AbortController();

    void Promise.all([
      getDistricts(controller.signal).then(setDistricts),
      getAmenities(controller.signal).then(setAmenities),
    ]).catch((error) => {
      if (controller.signal.aborted) {
        return;
      }

      setErrorMessage(getErrorMessage(error));
    });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void searchAdminRooms(
      {
        keyword: filters.keyword.trim(),
        districtId: filters.districtId,
        status: filters.status as RoomStatus | "",
        page: page - 1,
        size: PAGE_SIZE,
      },
      controller.signal,
    )
      .then((nextResponse) => {
        setResponse(nextResponse);
        setErrorMessage("");
        setLoading(false);
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return;
        }

        setErrorMessage(getErrorMessage(error));
        setLoading(false);
      });

    return () => controller.abort();
  }, [filters, page]);

  const toggleAmenity = (amenityId: string) => {
    setFormData((current) => ({
      ...current,
      amenityIds: current.amenityIds.includes(amenityId)
        ? current.amenityIds.filter((item) => item !== amenityId)
        : [...current.amenityIds, amenityId],
    }));
  };

  const handleCreateRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    setFieldErrors({});

    try {
      const images = normalizePayloadImages(formData.images, formData.title);
      const thumbnail = images.find((image) => image.isThumbnail)?.imageUrl ?? images[0]?.imageUrl ?? formData.thumbnail.trim();

      await createRoom({
        title: formData.title.trim(),
        description: formData.description.trim(),
        address: formData.address.trim(),
        districtId: Number(formData.districtId),
        price: Number(formData.price),
        area: Number(formData.area),
        contactName: formData.contactName.trim(),
        contactPhone: formData.contactPhone.trim(),
        status: formData.status,
        thumbnail,
        featured: formData.featured,
        amenityIds: formData.amenityIds.map(Number),
        images,
      });

      setSuccessMessage("Đã tạo bài đăng mới và đồng bộ lên danh sách.");
      setFormData(initialForm);
      setPage(1);
      await loadRooms(1);
    } catch (error) {
      if (error instanceof ApiError) {
        setFieldErrors(
          Object.fromEntries(
            error.fieldErrors.map((fieldError) => [fieldError.field, fieldError.message]),
          ),
        );
      }

      setErrorMessage(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetStatus = async (room: AdminRoomListItem, nextStatus: RoomStatus) => {
    setActionRoomId(room.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updateRoomStatus(room.id, nextStatus);
      setSuccessMessage("Đã cập nhật trạng thái phòng.");
      await loadRooms(page);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setActionRoomId(null);
    }
  };

  const handleToggleOccupancy = async (room: AdminRoomListItem) => {
    await handleSetStatus(room, room.status === "FULL" ? "AVAILABLE" : "FULL");
  };

  const handleToggleVisibility = async (room: AdminRoomListItem) => {
    await handleSetStatus(room, room.status === "HIDDEN" ? "AVAILABLE" : "HIDDEN");
  };

  // Delete confirmation state
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleDelete = async (roomId: number) => {
    setActionRoomId(roomId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteRoom(roomId);
      toast("Đã xóa bài đăng thành công.", "success");
      const nextPage = response?.content.length === 1 && page > 1 ? page - 1 : page;

      if (nextPage !== page) {
        setPage(nextPage);
      }

      await loadRooms(nextPage);
    } catch (error) {
      toast(getErrorMessage(error), "error");
    } finally {
      setActionRoomId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="min-w-0 space-y-5">
      <div className="rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">
              Quản lý phòng
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-strong)] md:text-[2rem]">
              Quản lý bài đăng phòng trọ
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-muted)]">
              Trang này giúp admin theo dõi danh sách phòng, tạo bài đăng mới và
              cập nhật trạng thái còn phòng một cách nhanh gọn.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/admin">
              <Button variant="outline">Quay lại tổng quan</Button>
            </Link>
            <Button
              variant="outline"
              disabled={exporting || loading}
              onClick={async () => {
                setExporting(true);
                try {
                  const all = await searchAdminRooms({
                    keyword: filters.keyword.trim(),
                    districtId: filters.districtId,
                    status: filters.status as RoomStatus | "",
                    page: 0,
                    size: 9999,
                  });
                  exportCsv({
                    filename: "homi-admin-rooms",
                    headers: ["Mã tin", "Tiêu đề", "Khu vực", "Giá", "Diện tích", "Trạng thái", "Nổi bật", "Người liên hệ", "Ngày đăng", "Ngày tạo"],
                    rows: all.content.map((room) => [
                      room.listingCode,
                      room.title,
                      room.districtName,
                      formatCompactCurrency(room.price),
                      `${room.area} m²`,
                      roomStatusMeta[room.status].label,
                      room.featured ? "Có" : "Không",
                      room.contactName,
                      formatDate(room.postedAt),
                      formatDate(room.createdAt),
                    ]),
                  });
                } catch (error) {
                  setErrorMessage(getErrorMessage(error));
                } finally {
                  setExporting(false);
                }
              }}
              leadingIcon={<Download className="size-4" />}
            >
              {exporting ? "Đang xuất..." : "Xuất CSV"}
            </Button>
          </div>
        </div>
      </div>

      {successMessage ? (
        <Alert tone="success" title="Thao tác thành công" description={successMessage} />
      ) : null}

      {errorMessage ? (
        <Alert tone="warning" title="Không thể tiếp tục" description={errorMessage} />
      ) : null}

      <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="min-w-0 space-y-4">
          <div className="grid min-w-0 gap-3 rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] lg:grid-cols-3">
            <Input
              label="Tìm bài đăng / mã tin"
              placeholder="Tên phòng hoặc mã tin..."
              value={filters.keyword}
              onChange={(event) => {
                setLoading(true);
                setErrorMessage("");
                setFilters((current) => ({ ...current, keyword: event.target.value }));
                setPage(1);
              }}
            />
            <Select
              label="Khu vực"
              options={[
                { label: "Tất cả", value: "" },
                ...districts.map((district) => ({
                  label: district.name,
                  value: String(district.id),
                })),
              ]}
              value={filters.districtId}
              onChange={(event) => {
                setLoading(true);
                setErrorMessage("");
                setFilters((current) => ({ ...current, districtId: event.target.value }));
                setPage(1);
              }}
            />
            <Select
              label="Trạng thái"
              options={[
                { label: "Tất cả", value: "" },
                { label: "Còn phòng", value: "AVAILABLE" },
                { label: "Hết phòng", value: "FULL" },
                { label: "Đang ẩn", value: "HIDDEN" },
              ]}
              value={filters.status}
              onChange={(event) => {
                setLoading(true);
                setErrorMessage("");
                setFilters((current) => ({ ...current, status: event.target.value }));
                setPage(1);
              }}
            />
          </div>

          {loading && !response ? (
            <LoadingSkeleton className="h-[30rem] rounded-[28px]" />
          ) : response?.content.length ? (
            <>
              <AdminTable
                headers={["Mã tin", "Tiêu đề", "Khu vực", "Giá", "Trạng thái", "Ngày đăng", "Tác vụ"]}
                rows={response.content.map((room) => [
                  <span
                    key={`${room.id}-code`}
                    className="inline-flex whitespace-nowrap rounded-full bg-[var(--color-surface-soft)] px-2.5 py-1 font-mono text-xs font-semibold text-[var(--color-brand-800)]"
                  >
                    #{room.listingCode}
                  </span>,
                  <div key={`${room.id}-title`} className="min-w-0 max-w-[15rem] space-y-1">
                    <p
                      className="line-clamp-2 font-semibold leading-5 text-[var(--color-text-strong)]"
                      title={room.title}
                    >
                      {room.title}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-brand-700)]">
                      {room.featured ? "Phòng nổi bật" : "Bài đăng thường"}
                    </p>
                  </div>,
                  <span key={`${room.id}-district`} className="inline-block max-w-[9rem] leading-5">
                    {room.districtName}
                  </span>,
                  <span key={`${room.id}-price`} className="whitespace-nowrap font-semibold">
                    {formatCompactCurrency(room.price)}
                  </span>,
                  <Badge key={`${room.id}-badge`} tone={roomStatusMeta[room.status].tone}>
                    {roomStatusMeta[room.status].label}
                  </Badge>,
                  <span key={`${room.id}-posted`} className="whitespace-nowrap">
                    {formatDate(room.postedAt)}
                  </span>,
                  <div key={`${room.id}-actions`} className="grid min-w-[10.5rem] grid-cols-2 gap-2">
                    <Link className="block" href={`/rooms/${room.slug}`}>
                      <Button className="h-9 w-full px-3 text-xs" variant="ghost" size="sm">
                        Xem
                      </Button>
                    </Link>
                    <Button
                      className="h-9 w-full px-3 text-xs"
                      variant="outline"
                      size="sm"
                      disabled={actionRoomId === room.id}
                      onClick={() => handleToggleOccupancy(room)}
                    >
                      {room.status === "AVAILABLE" ? "Hết phòng" : "Mở lại"}
                    </Button>
                    <Button
                      className="h-9 w-full px-3 text-xs"
                      variant="outline"
                      size="sm"
                      disabled={actionRoomId === room.id}
                      onClick={() => handleToggleVisibility(room)}
                    >
                      {room.status === "HIDDEN" ? "Hiện lại" : "Ẩn"}
                    </Button>
                    <Button
                      className="h-9 w-full px-3 text-xs"
                      variant="ghost"
                      size="sm"
                      disabled={actionRoomId === room.id}
                      onClick={() => setConfirmDeleteId(room.id)}
                    >
                      Xóa
                    </Button>
                  </div>,
                ])}
              />
              <Pagination
                currentPage={page}
                totalPages={response.totalPages}
                onPageChange={(nextPage) => {
                  setLoading(true);
                  setErrorMessage("");
                  setPage(nextPage);
                }}
              />
            </>
          ) : (
            <EmptyState
              title="Không có bài đăng phù hợp"
              description="Thử đổi bộ lọc hoặc tạo bài đăng mới ở cột bên phải."
            />
          )}
        </section>

        <aside className="min-w-0 rounded-[28px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] ring-1 ring-transparent transition-all duration-300 ease-out hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] 2xl:sticky 2xl:top-24 2xl:max-h-[calc(100vh-7rem)] 2xl:overflow-y-auto">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-strong)]">
            Tạo bài đăng mới
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            Nhập các thông tin cần thiết để bài đăng hiển thị đầy đủ trên trang
            danh sách và trang chi tiết phòng.
          </p>

          <form className="mt-5 space-y-3" onSubmit={handleCreateRoom}>
            <Input
              label="Tiêu đề phòng"
              placeholder="Studio gần trường đại học..."
              value={formData.title}
              onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
              error={fieldErrors.title}
            />
            <Textarea
              label="Mô tả phòng"
              placeholder="Mô tả ngắn gọn, rõ ràng về phòng, khu vực và tiện ích."
              value={formData.description}
              onChange={(event) =>
                setFormData((current) => ({ ...current, description: event.target.value }))
              }
              error={fieldErrors.description}
            />
            <Input
              label="Địa chỉ"
              placeholder="12 Chùa Bộc, Đống Đa"
              value={formData.address}
              onChange={(event) => setFormData((current) => ({ ...current, address: event.target.value }))}
              error={fieldErrors.address}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Select
                label="Khu vực"
                options={[
                  { label: "Chọn khu vực", value: "" },
                  ...districts.map((district) => ({
                    label: district.name,
                    value: String(district.id),
                  })),
                ]}
                value={formData.districtId}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, districtId: event.target.value }))
                }
              />
              <Select
                label="Trạng thái"
                options={[
                  { label: "Còn phòng", value: "AVAILABLE" },
                  { label: "Hết phòng", value: "FULL" },
                  { label: "Đang ẩn", value: "HIDDEN" },
                ]}
                value={formData.status}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    status: event.target.value as RoomStatus,
                  }))
                }
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                    label="Giá / tháng"
                placeholder="4500000"
                value={formData.price}
                onChange={(event) => setFormData((current) => ({ ...current, price: event.target.value }))}
                error={fieldErrors.price}
              />
              <Input
                label="Diện tích (m2)"
                placeholder="25"
                value={formData.area}
                onChange={(event) => setFormData((current) => ({ ...current, area: event.target.value }))}
                error={fieldErrors.area}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Tên người liên hệ"
                placeholder="Nguyễn Văn Hùng"
                value={formData.contactName}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, contactName: event.target.value }))
                }
                error={fieldErrors.contactName}
              />
              <Input
                label="Số điện thoại liên hệ"
                placeholder="0909001001"
                value={formData.contactPhone}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, contactPhone: event.target.value }))
                }
                error={fieldErrors.contactPhone}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[var(--color-text-strong)]">
                Thư viện ảnh
              </p>
              <RoomImageManager
                images={formData.images}
                roomTitle={formData.title}
                onChange={(images) => setFormData((current) => ({ ...current, images }))}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[var(--color-text-strong)]">
                Tiện ích nổi bật
              </p>
              <div className="flex flex-wrap gap-1.5">
                {amenities.map((amenity) => {
                  const active = formData.amenityIds.includes(String(amenity.id));

                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => toggleAmenity(String(amenity.id))}
                      className={
                        active
                          ? "rounded-full bg-[var(--color-brand-700)] px-3 py-2 text-sm font-medium text-white"
                          : "rounded-full bg-[var(--color-surface-soft)] px-3 py-2 text-sm font-medium text-[var(--color-text-muted)]"
                      }
                    >
                      {amenity.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-[var(--color-text-strong)]">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, featured: event.target.checked }))
                }
              />
              Đánh dấu phòng nổi bật trên trang chủ
            </label>

            <div className="flex gap-3">
              <Button className="flex-1" type="submit" disabled={submitting}>
                Lưu bài đăng
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                type="button"
                onClick={() => setFormData(initialForm)}
              >
                Đặt lại
              </Button>
            </div>
          </form>
        </aside>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Xóa bài đăng"
        description="Bạn chắc chắn muốn xóa bài đăng này? Hành động này không thể hoàn tác."
        confirmLabel="Xóa bài đăng"
        tone="danger"
        loading={actionRoomId !== null}
        onConfirm={() => { if (confirmDeleteId) void handleDelete(confirmDeleteId); }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
