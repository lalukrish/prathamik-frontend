

"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface MonthlySalesChartProps {
  data: {
    graphs: {
      applicationTrend: {
        month: string;
        applications: number;
      }[];
    };
  };
}

export default function MonthlySalesChart({
  data,
}: MonthlySalesChartProps) {
  const [isOpen, setIsOpen] = useState(false);

  const chartData = data?.graphs?.applicationTrend ?? [];

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: chartData.map((item) => item.month),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: true,
      },
      y: {
        formatter: (val: number) => `${val} Applications`,
      },
    },
  };

  const series = [
    {
      name: "Applications",
      data: chartData.map((item) => item.applications),
    },
  ];
  console.log(data?.graphs?.applicationTrend);
console.log(series);
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Application Trend
        </h3>

        <div className="relative inline-block">
          <button onClick={() => setIsOpen(!isOpen)}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700" />
          </button>

          <Dropdown
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            className="w-40 p-2"
          >
            <DropdownItem onItemClick={() => setIsOpen(false)}>
              View More
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={200}
      />
    </div>
  );
}