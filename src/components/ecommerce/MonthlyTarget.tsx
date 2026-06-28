
"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface JobApplication {
  name: string;
  value: number;
}

interface ApplicationsByJob {
  centerLabel: string;
  centerValue: number;
  data: JobApplication[];
}

interface Props {
  applicationsByJob: ApplicationsByJob | null;
}

const COLORS = ["#465FFF", "#8B9FFF", "#B8C4FF", "#D4DCFF", "#6D28D9", "#06B6D4", "#F59E0B"];

export default function ApplicationsByJobChart({ applicationsByJob }: Props) {
  const {
    centerLabel = "Total",
    centerValue = 0,
    data = [],
  } = applicationsByJob ?? {};

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeData = data.filter((d) => d.value > 0);
  const series = activeData.length > 0 ? activeData.map((d) => d.value) : [1];
  const labels = activeData.length > 0 ? activeData.map((d) => d.name) : ["No Data"];

  const hoveredItem = hoveredIndex !== null ? data[hoveredIndex] : null;
  const displayLabel = hoveredItem?.name ?? centerLabel;
  const displayValue = hoveredItem != null ? String(hoveredItem.value) : String(centerValue);

  const getColors = () => {
    if (activeData.length === 0) return ["#E4E7EC"];
    if (hoveredIndex === null) return COLORS.slice(0, activeData.length);
    const hoveredActiveName = data[hoveredIndex]?.name;
    return activeData.map((d, i) => {
      const baseColor = COLORS[i % COLORS.length];
      return d.name === hoveredActiveName ? baseColor : baseColor + "33";
    });
  };

  const buildOptions = (): ApexOptions => ({
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
      animations: { enabled: false },
      events: {
        dataPointMouseEnter: (_e, _chart, config) => {
          const activeName = activeData[config.dataPointIndex]?.name;
          const fullIndex = data.findIndex((d) => d.name === activeName);
          setHoveredIndex(fullIndex);
        },
        dataPointMouseLeave: () => setHoveredIndex(null),
        dataPointSelection: () => {},
      },
    },
    colors: getColors(),
    labels,
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 4, colors: ["#ffffff"] },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: displayLabel,       
              fontSize: "13px",
              fontWeight: "400",
              color: "#98A2B3",
              formatter: () => displayValue, 
            },
            value: {
              show: true,
              fontSize: "36px",
              fontWeight: "700",
              color: "#1D2939",
              offsetY: 8,

            },
            name: {
              show: true,
              fontSize: "12px",
              fontWeight: "400",
              color: "#98A2B3",
              offsetY: -12,

            },
          },
        },
      },
    },
    tooltip: { enabled: false },
    states: {
      active: { filter: { type: "none" } },
      hover: { filter: { type: "none" } },
    },
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
          Applications by Job
        </h3>
      </div>

      <div className="flex items-center gap-6">

        {/* ✅ key forces full re-render when hover changes so center label updates */}
        <div className="shrink-0 w-[220px]">
          <ReactApexChart
            key={`donut-${hoveredIndex}`}
            options={buildOptions()}
            series={series}
            type="donut"
            height={220}
          />
        </div>

        {/* Legend — right side vertical */}
        <div className="flex flex-col gap-2.5 flex-1 min-w-0">
          {data.map((item, i) => {
            const activeIndex = activeData.findIndex((d) => d.name === item.name);
            const color = item.value > 0 ? COLORS[activeIndex % COLORS.length] : "#E4E7EC";
            const pct = centerValue > 0 ? Math.round((item.value / centerValue) * 100) : 0;
            const isHovered = hoveredIndex === i;
            const isDimmed = hoveredIndex !== null && !isHovered;

            return (
              <div
                key={item.name}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg cursor-default transition-all ${
                  isDimmed ? "opacity-40" : "opacity-100"
                } ${isHovered ? "bg-gray-50 dark:bg-white/5" : ""}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-150 ${
                      isHovered ? "scale-125" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                  <span
                    className={`text-xs truncate transition-colors ${
                      isHovered
                        ? "font-semibold text-gray-800 dark:text-white/90"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ">
                  <span className="text-xs text-gray-400">{pct}%</span>
                  <span
                    className={`text-xs font-semibold min-w-[20px] text-right ${
                      isHovered
                        ? "text-gray-800 dark:text-white/90"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}