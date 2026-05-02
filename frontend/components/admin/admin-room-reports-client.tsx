"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";

import { AdminTable } from "@/components/admin/admin-table";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  roomReportReasonLabel,
  roomReportStatusMeta,
} from "@/constants/status";
import { exportCsv } from "@/lib/export-csv";
import { formatDate } from "@/lib/format";
import { getErrorMessage } from "@/services/api-client";
import {
  searchAdminRoomReports,
  updateAdminRoomReportStatus,
} from "@/services/room-report-service";
import type {
  PageResponse,
  RoomReport,
  RoomReportReason,
  RoomReportStatus,
} from "@/types";

const PAGE_SIZE = 8;

const statusOptions: Array<{ value: RoomReportStatus; label: string }> = [
  { value: "NEW", label: roomReportStatusMeta.NEW.label },
  { value: "REVIEWING", label: roomReportStatusMeta.REVIEWING.label },
  { value: "RESOLVED", label: roomReportStatusMeta.RESOLVED.label },
  { value: "DISMISSED", label: roomReportStatusMeta.DISMISSED.label },
];

const reasonOptions: Array<{ value: RoomReportReason; label: string }> = [
  { value: "WRONG_INFO", label: roomReportReasonLabel.WRONG_INFO },
  { value: "DUPLICATE", label: roomReportReasonLabel.DUPLICATE },
  { value: "SCAM", label: roomReportReasonLabel.SCAM },
  { value: "UNAVAILABLE", label: roomReportReasonLabel.UNAVAILABLE },
  { value: "INAPPROPRIATE", label: roomReportReasonLabel.INAPPROPRIATE },
  { value: "OTHER", label: roomReportReasonLabel.OTHER },
];

export function AdminRoomReportsClient() {
  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
    reason: "",
  });
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<PageResponse<RoomReport> | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [editor, setEditor] = useState({
    status: "NEW" as RoomReportStatus,
    adminNote: "",
  });

  useEffect(() => {
    const controller = new AbortController();

    void searchAdminRoomReports(
      {
        keyword: filters.keyword.trim(),
        status: filters.status as RoomReportStatus | "",
        reason: filters.reason as RoomReportReason | "",
        page: page - 1,
        size: PAGE_SIZE,
      },
      controller.signal,
    )
      .then((nextResponse) => {
        setResponse(nextResponse);

        const firstReport = nextResponse.content[0];

        if (firstReport) {
          setSelectedReportId(firstReport.id);
          setEditor({
            status: firstReport.status,
            adminNote: firstReport.adminNote ?? "",
          });
        } else {
          setSelectedReportId(null);
          setEditor({
            status: "NEW",
            adminNote: "",
          });
        }
        setErrorMessage("");
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return;
        }

        setErrorMessage(getErrorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [filters, page]);

  const selectedReport = useMemo(
    () => response?.content.find((item) => item.id === selectedReportId) ?? null,
    [response, selectedReportId],
  );

  const chooseReport = (report: RoomReport) => {
    setSelectedReportId(report.id);
    setEditor({
      status: report.status,
      adminNote: report.adminNote ?? "",
    });
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedReportId) {
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updatedReport = await updateAdminRoomReportStatus(selectedReportId, {
        status: editor.status,
        adminNote: editor.adminNote.trim(),
      });

      setSuccessMessage("Da cap nhat trang thai bao cao.");
      setResponse((current) =>
        current
          ? {
              ...current,
              content: current.content.map((item) =>
                item.id === updatedReport.id ? updatedReport : item,
              ),
            }
          : current,
      );
      setEditor({
        status: updatedReport.status,
        adminNote: updatedReport.adminNote ?? "",
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="motion-panel animate-content-rise rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">
              Quan ly bao cao
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-strong)] sm:text-4xl">
              Bao cao tin dang
            </h1>
          </div>
          <Button
            className="w-full sm:w-auto"
            variant="outline"
            disabled={exporting || loading}
            onClick={async () => {
              setExporting(true);
              try {
                const all = await searchAdminRoomReports({
                  keyword: filters.keyword.trim(),
                  status: filters.status as RoomReportStatus | "",
                  reason: filters.reason as RoomReportReason | "",
                  page: 0,
                  size: 9999,
                });
                exportCsv({
                  filename: "homi-admin-room-reports",
                  headers: [
                    "Phong",
                    "Nguoi bao cao",
                    "Email",
                    "Ly do",
                    "Trang thai",
                    "Ghi chu admin",
                    "Ngay gui",
                  ],
                  rows: all.content.map((report) => [
                    report.roomTitle,
                    report.reporterName,
                    report.reporterEmail,
                    roomReportReasonLabel[report.reason],
                    roomReportStatusMeta[report.status].label,
                    report.adminNote ?? "",
                    formatDate(report.createdAt),
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
            {exporting ? "Dang xuat..." : "Xuat CSV"}
          </Button>
        </div>
      </div>

      {successMessage ? (
        <Alert tone="success" title="Thao tac thanh cong" description={successMessage} />
      ) : null}

      {errorMessage ? (
        <Alert tone="warning" title="Khong the tiep tuc" description={errorMessage} />
      ) : null}

      <div className="grid min-w-0 gap-5 sm:gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <section className="space-y-4">
          <div className="motion-panel motion-stagger grid gap-4 rounded-[22px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[28px] sm:p-5 lg:grid-cols-3">
            <Input
              label="Tim bao cao"
              placeholder="Ten phong, email, noi dung..."
              value={filters.keyword}
              onChange={(event) => {
                setLoading(true);
                setErrorMessage("");
                setFilters((current) => ({ ...current, keyword: event.target.value }));
                setPage(1);
              }}
            />
            <Select
              label="Trang thai"
              options={[{ label: "Tat ca", value: "" }, ...statusOptions]}
              value={filters.status}
              onChange={(event) => {
                setLoading(true);
                setErrorMessage("");
                setFilters((current) => ({ ...current, status: event.target.value }));
                setPage(1);
              }}
            />
            <Select
              label="Ly do"
              options={[{ label: "Tat ca", value: "" }, ...reasonOptions]}
              value={filters.reason}
              onChange={(event) => {
                setLoading(true);
                setErrorMessage("");
                setFilters((current) => ({ ...current, reason: event.target.value }));
                setPage(1);
              }}
            />
          </div>

          {loading && !response ? (
            <LoadingSkeleton className="h-[30rem] rounded-[28px]" />
          ) : response?.content.length ? (
            <>
              <AdminTable
                headers={["Phong", "Nguoi bao cao", "Ly do", "Trang thai", "Ngay gui", "Tac vu"]}
                rows={response.content.map((report) => [
                  <Link
                    key={`${report.id}-room`}
                    href={`/rooms/${report.roomSlug}`}
                    className="motion-soft rounded-xl font-semibold text-[var(--color-brand-700)] hover:text-[var(--color-brand-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
                  >
                    {report.roomTitle}
                  </Link>,
                  report.reporterName,
                  roomReportReasonLabel[report.reason],
                  <Badge
                    key={`${report.id}-status`}
                    tone={roomReportStatusMeta[report.status].tone}
                  >
                    {roomReportStatusMeta[report.status].label}
                  </Badge>,
                  formatDate(report.createdAt),
                  <Button
                    key={`${report.id}-action`}
                    variant="outline"
                    size="sm"
                    onClick={() => chooseReport(report)}
                  >
                    Xu ly
                  </Button>,
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
              title="Khong co bao cao phu hop"
              description="Thu bo bot dieu kien loc hoac kiem tra lai sau khi co nguoi dung gui bao cao moi."
            />
          )}
        </section>

        <aside className="motion-panel rounded-[24px] border border-[var(--color-border-card)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[32px] sm:p-6">
          <h2 className="text-xl font-semibold text-[var(--color-text-strong)] sm:text-2xl">
            Xu ly bao cao
          </h2>

          {selectedReport ? (
            <>
              <div className="motion-panel mt-4 space-y-3 rounded-[22px] bg-[var(--color-surface-soft)] p-4 hover:-translate-y-0.5 hover:shadow-sm sm:rounded-[28px] sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={roomReportStatusMeta[selectedReport.status].tone}>
                    {roomReportStatusMeta[selectedReport.status].label}
                  </Badge>
                  <Badge tone="muted">
                    {roomReportReasonLabel[selectedReport.reason]}
                  </Badge>
                </div>
                <p className="text-lg font-semibold text-[var(--color-text-strong)]">
                  {selectedReport.roomTitle}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {selectedReport.reporterName} - {selectedReport.reporterEmail}
                </p>
                <p className="text-sm leading-7 text-[var(--color-text-strong)]">
                  {selectedReport.details || "Khong co noi dung bo sung."}
                </p>
                {selectedReport.handledByName ? (
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                    Xu ly boi {selectedReport.handledByName}
                  </p>
                ) : null}
              </div>

              <form className="motion-stagger mt-6 space-y-4" onSubmit={handleUpdate}>
                <Select
                  label="Trang thai moi"
                  options={statusOptions}
                  value={editor.status}
                  onChange={(event) =>
                    setEditor((current) => ({
                      ...current,
                      status: event.target.value as RoomReportStatus,
                    }))
                  }
                />
                <Textarea
                  label="Ghi chu admin"
                  value={editor.adminNote}
                  onChange={(event) =>
                    setEditor((current) => ({ ...current, adminNote: event.target.value }))
                  }
                  placeholder="Da lien he chu tro, da an tin, hoac bo qua vi khong du bang chung..."
                  maxLength={500}
                />
                <Button className="w-full" type="submit" disabled={submitting}>
                  {submitting ? "Dang luu..." : "Luu cap nhat"}
                </Button>
              </form>
            </>
          ) : (
            <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">
              Chon mot bao cao tu bang ben trai de cap nhat trang thai va ghi chu xu ly.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
