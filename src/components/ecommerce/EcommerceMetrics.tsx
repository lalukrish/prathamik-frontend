// "use client";

// import React from "react";
// import Badge from "../ui/badge/Badge";
// import { BoxIconLine, GroupIcon } from "@/icons";

// interface DashboardData {
//   summary: {
//     totalAdmin: number;
//     totalHr: number;
//     totalRecruiter: number;
//     totalJobs: number;
//     activeJobs: number;
//     totalApplications: number;
//   };
// }

// interface EcommerceMetricsProps {
//   data: DashboardData;
// }

// export const EcommerceMetrics = ({ data }: EcommerceMetricsProps) => {
//   const { summary } = data;

//   return (
//     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">


//         <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
//         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
//           <GroupIcon className="text-gray-800 dark:text-white/90" />
//         </div>

//         <div className="mt-5">
//           <span className="text-sm text-gray-500 dark:text-gray-400">
//             HR Managers
//           </span>
//           <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
//             {summary.totalHr}
//           </h4>
//         </div>
//       </div>
//       {/* Recruiters */}
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
//         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
//           <GroupIcon className="text-gray-800 dark:text-white/90" />
//         </div>

//         <div className="mt-5">
//           <span className="text-sm text-gray-500 dark:text-gray-400">
//             Recruiters
//           </span>
//           <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
//             {summary.totalRecruiter}
//           </h4>
//         </div>
//       </div>

//       {/* Jobs */}
//       {/* <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
//         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
//           <BoxIconLine className="text-gray-800 dark:text-white/90" />
//         </div>

//         <div className="mt-5">
//           <span className="text-sm text-gray-500 dark:text-gray-400">
//             Total Jobs
//           </span>
//           <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
//             {summary.totalJobs}
//           </h4>
//         </div>
//       </div> */}

//       {/* Active Jobs */}
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
//        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
//           <BoxIconLine className="text-gray-800 dark:text-white/90" />
//         </div>
//         <div className="mt-5">
//           <span className="text-sm text-gray-500 dark:text-gray-400">
//             Active Jobs
//           </span>
//           <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
//             {summary.activeJobs}
//           </h4>
//         </div>
//       </div>

//       {/* Applications */}
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
//        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
//           <BoxIconLine className="text-gray-800 dark:text-white/90" />
//         </div>
//         <div className="mt-5">
//           <span className="text-sm text-gray-500 dark:text-gray-400">
//             Applications
//           </span>
//           <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
//             {summary.totalApplications}
//           </h4>
//         </div>
//       </div>
//     </div>
//   );
// };

"use client";

import React from "react";
import { BoxIconLine, GroupIcon, TaskIcon } from "@/icons";
// import { DashboardRole } from "@/app/(admin)/page";
import { CheckCircleIcon, UserCircleIcon, X } from "lucide-react";

type SummaryData = Record<string, number>;

type DashboardRole = "admin" | "recruiter" | "super_admin";
interface MetricItem {
  title: string;
  key: string;
  icon: React.ReactNode;
}

interface EcommerceMetricsProps {
  data: { summary: SummaryData };
  role ?: DashboardRole;
}

const metricsConfig: Record<DashboardRole, MetricItem[]> = {
  admin: [
    {
      title: "Total Admins",
      key: "totalAdmin",
      icon: <UserCircleIcon className="text-gray-800 dark:text-white/90" />,
    },
    {
      title: "HR Managers",
      key: "totalHr",
      icon: <GroupIcon className="text-gray-800 dark:text-white/90" />,
    },
    {
      title: "Recruiters",
      key: "totalRecruiter",
      icon: <GroupIcon className="text-gray-800 dark:text-white/90" />,
    },
    {
      title: "Total Jobs",
      key: "totalJobs",
      icon: <BoxIconLine className="text-gray-800 dark:text-white/90" />,
    },
    {
      title: "Active Jobs",
      key: "activeJobs",
      icon: <TaskIcon className="text-gray-800 dark:text-white/90" />,
    },
    {
      title: "Total Applications",
      key: "totalApplications",
      icon: <BoxIconLine className="text-gray-800 dark:text-white/90" />,
    },
    {
      title: "Shortlisted",
      key: "shortlisted",
      icon: <CheckCircleIcon className="text-gray-800 dark:text-white/90" />,
    },
    {
      title: "Selected",
      key: "selected",
      icon: <CheckCircleIcon className="text-gray-800 dark:text-white/90" />,
    },
    {
      title: "Rejected",
      key: "rejected",
      icon: <X className="text-gray-800 dark:text-white/90" />,
    },
    {
      title: "Interviews",
      key: "interviews",
      icon: <GroupIcon className="text-gray-800 dark:text-white/90" />,
    },
  ],

  recruiter: [
    {
      title: "Assigned Jobs",
      key: "assignedJobs",
      icon: <BoxIconLine className="text-gray-800 dark:text-white/90" />,
    },
    {
      title: "Reviewed Candidates",
      key: "reviewedCandidates",
      icon: <GroupIcon className="text-gray-800 dark:text-white/90" />,
    },
    {
      title: "Pending Reviews",
      key: "pendingReviews",
      icon: <TaskIcon className="text-gray-800 dark:text-white/90" />,
    },
    {
      title: "Shortlisted",
      key: "shortlisted",
      icon: <CheckCircleIcon className="text-gray-800 dark:text-white/90" />,
    },
    {
      title: "Interviews",
      key: "interviews",
      icon: <GroupIcon className="text-gray-800 dark:text-white/90" />,
    },
  ],

  super_admin: [
    {
      title: "Total Users",
      key: "totalUsers",
      icon: <GroupIcon className="text-gray-800 dark:text-white/90" />,
    },
    {
      title: "Total Jobs",
      key: "totalJobs",
      icon: <BoxIconLine className="text-gray-800 dark:text-white/90" />,
    },
    {
      title: "Active Jobs",
      key: "activeJobs",
      icon: <TaskIcon className="text-gray-800 dark:text-white/90" />,
    },
    {
      title: "Total Candidates",
      key: "totalCandidates",
      icon: <UserCircleIcon className="text-gray-800 dark:text-white/90" />,
    },
    {
      title: "Total Applications",
      key: "totalApplications",
      icon: <BoxIconLine className="text-gray-800 dark:text-white/90" />,
    },
    {
      title: "Shortlisted",
      key: "shortlisted",
      icon: <CheckCircleIcon className="text-gray-800 dark:text-white/90" />,
    },
    {
      title: "Selected",
      key: "selected",
      icon: <CheckCircleIcon className="text-gray-800 dark:text-white/90" />,
    },
    {
      title: "Interviews",
      key: "interviews",
      icon: <GroupIcon className="text-gray-800 dark:text-white/90" />,
    },
  ],
};

export const EcommerceMetrics = ({ data, role= "admin", }: EcommerceMetricsProps) => {
  const { summary } = data ?? {};

  if (!summary) return null;

  const metrics = metricsConfig[role] ?? [];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {metrics.map((item) => (
        <div
          key={item.title}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
            {item.icon}
          </div>

          <div className="mt-5">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {item.title}
            </span>

            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {summary[item.key] ?? 0}
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
};