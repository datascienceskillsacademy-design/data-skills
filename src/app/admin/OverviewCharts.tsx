"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { cn } from "@/lib/cn";

/* Palette validated with the six-checks script (light surface #ffffff):
   worst CVD ΔE 131.9, both series ≥ 3:1. */
const SERIES = {
  enrollments: { label: "Enrollments", color: "#6354f0" },
  students: { label: "New students", color: "#d96b04" },
} as const;

const INK = {
  muted: "#7e739c",
  grid: "#eceaf7",
  baseline: "#d2cce5",
};

export interface TrendPoint {
  month: string;
  enrollments: number;
  students: number;
}

function TrendTooltip({
  active,
  payload,
  label,
}: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs shadow-lg">
      <p className="font-semibold text-neutral-900">{label}</p>
      <div className="mt-1.5 space-y-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-neutral-500">{entry.name}</span>
            <span className="ml-auto pl-4 font-semibold tabular-nums text-neutral-900">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EnrollmentTrendChart({ data }: { data: TrendPoint[] }) {
  const [view, setView] = useState<"chart" | "table">("chart");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Legend — identity never rides color alone; text stays in ink tokens */}
        <div className="flex items-center gap-5">
          {Object.values(SERIES).map((s) => (
            <span
              key={s.label}
              className="flex items-center gap-2 text-xs font-medium text-neutral-600"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              {s.label}
            </span>
          ))}
        </div>

        <div className="flex rounded-lg border border-neutral-200 p-0.5 text-xs font-medium">
          {(["chart", "table"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "rounded-md px-2.5 py-1 capitalize transition",
                view === v
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "chart" ? (
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={INK.grid} strokeWidth={1} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{ stroke: INK.baseline, strokeWidth: 1 }}
                tick={{ fill: INK.muted, fontSize: 11 }}
                dy={8}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: INK.muted, fontSize: 11 }}
              />
              <Tooltip
                content={TrendTooltip}
                cursor={{ stroke: INK.baseline, strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="enrollments"
                name={SERIES.enrollments.label}
                stroke={SERIES.enrollments.color}
                strokeWidth={2}
                strokeLinecap="round"
                isAnimationActive={false}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, stroke: "#ffffff" }}
              />
              <Line
                type="monotone"
                dataKey="students"
                name={SERIES.students.label}
                stroke={SERIES.students.color}
                strokeWidth={2}
                strokeLinecap="round"
                isAnimationActive={false}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, stroke: "#ffffff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs text-neutral-500">
                <th className="py-2 pr-4 font-medium">Month</th>
                <th className="py-2 pr-4 font-medium">Enrollments</th>
                <th className="py-2 font-medium">New students</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.month} className="border-b border-neutral-50">
                  <td className="py-2 pr-4 font-medium text-neutral-700">{row.month}</td>
                  <td className="py-2 pr-4 tabular-nums text-neutral-700">{row.enrollments}</td>
                  <td className="py-2 tabular-nums text-neutral-700">{row.students}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/** 12-point sparkline for stat tiles — de-emphasis hue, current period accented. */
export function Sparkline({ points }: { points: number[] }) {
  const data = points.map((v, i) => ({ i, v }));
  const last = points.length - 1;

  return (
    <div className="pointer-events-none h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 6, right: 6, bottom: 2, left: 6 }}>
          <Line
            type="monotone"
            dataKey="v"
            stroke="#c5cbff"
            strokeWidth={2}
            strokeLinecap="round"
            isAnimationActive={false}
            dot={(props: {
              key?: React.Key | null;
              cx?: number;
              cy?: number;
              index?: number;
            }) => {
              const { key, cx, cy, index } = props;
              if (index !== last || cx == null || cy == null)
                return <g key={key} />;
              return (
                <circle
                  key={key}
                  cx={cx}
                  cy={cy}
                  r={3.5}
                  fill="#4f3ddb"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
