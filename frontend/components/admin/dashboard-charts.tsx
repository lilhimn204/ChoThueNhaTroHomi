"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { getDashboardCharts } from "@/services/admin-service";
import type { DashboardCharts as DashboardChartsType } from "@/types";

const BAR_COLORS = [
  "#0ea5e9", "#06b6d4", "#14b8a6", "#10b981",
  "#22c55e", "#84cc16", "#eab308", "#f97316",
  "#ef4444", "#ec4899", "#a855f7", "#6366f1",
];

const PIE_COLORS = ["#10b981", "#f59e0b", "#6366f1", "#ef4444", "#0ea5e9", "#ec4899"];

const DONUT_COLORS = ["#0ea5e9", "#f97316", "#8b5cf6", "#ef4444", "#10b981"];

export function DashboardCharts() {
  const [charts, setCharts] = useState<DashboardChartsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    void getDashboardCharts(controller.signal)
      .then((response) => setCharts(response))
      .catch(() => {
        // Silently ignore
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="grid min-w-0 gap-5 xl:grid-cols-3">
        <LoadingSkeleton className="h-80 rounded-[28px]" />
        <LoadingSkeleton className="h-80 rounded-[28px]" />
        <LoadingSkeleton className="h-80 rounded-[28px]" />
      </div>
    );
  }

  if (!charts) return null;

  return (
    <div className="motion-stagger grid min-w-0 gap-5 xl:grid-cols-3">
      {/* Bar Chart — Rooms by District */}
      <ChartCard title="Phòng theo quận/huyện">
        {charts.roomsByDistrict.length === 0 ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={charts.roomsByDistrict} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-soft)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--color-border-soft)" }}
                interval={0}
                angle={-35}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border-soft)",
                  borderRadius: "12px",
                  fontSize: "13px",
                  color: "var(--color-text-strong)",
                }}
                formatter={(value) => [String(value), "Số phòng"]}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {charts.roomsByDistrict.map((_, index) => (
                  <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Pie Chart — Rooms by Status */}
      <ChartCard title="Trạng thái phòng">
        {charts.roomsByStatus.length === 0 ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={charts.roomsByStatus}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
                strokeWidth={2}
                stroke="var(--color-surface)"
              >
                {charts.roomsByStatus.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border-soft)",
                  borderRadius: "12px",
                  fontSize: "13px",
                  color: "var(--color-text-strong)",
                }}
                formatter={(value, name) => [String(value), String(name)]}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "12px", color: "var(--color-text-muted)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Pie Chart — Requests by Status */}
      <ChartCard title="Yêu cầu liên hệ">
        {charts.requestsByStatus.length === 0 ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={charts.requestsByStatus}
                cx="50%"
                cy="45%"
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                strokeWidth={2}
                stroke="var(--color-surface)"
              >
                {charts.requestsByStatus.map((_, index) => (
                  <Cell key={index} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border-soft)",
                  borderRadius: "12px",
                  fontSize: "13px",
                  color: "var(--color-text-strong)",
                }}
                formatter={(value, name) => [String(value), String(name)]}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "12px", color: "var(--color-text-muted)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="motion-panel group min-w-0 rounded-[24px] border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] ring-1 ring-transparent hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card-hover)] hover:ring-[var(--color-border-soft)] sm:rounded-[28px] sm:p-5">
      <h3 className="mb-4 text-base font-semibold text-[var(--color-text-strong)]">{title}</h3>
      {children}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="motion-soft flex h-64 items-center justify-center rounded-3xl border border-dashed border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] text-sm text-[var(--color-text-muted)] group-hover:border-[var(--color-border-strong)]">
      Chưa có dữ liệu
    </div>
  );
}
