import { proxyRequest } from "@/services/api-client";
import type { DashboardCharts, DashboardSummary } from "@/types";

export function getDashboardSummary(signal?: AbortSignal) {
  return proxyRequest<DashboardSummary>("admin/dashboard", {
    signal,
  });
}

export function getDashboardCharts(signal?: AbortSignal) {
  return proxyRequest<DashboardCharts>("admin/dashboard/charts", {
    signal,
  });
}
