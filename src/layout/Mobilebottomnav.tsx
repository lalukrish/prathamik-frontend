"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GridIcon, UserCircleIcon } from "../icons/index";
import { UserSearch, BriefcaseBusiness } from "lucide-react";

type BottomNavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const adminBottomNav: BottomNavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/dashboard" },
  { icon: <UserCircleIcon />, name: "Tests", path: "/tests" },
  { icon: <UserSearch />, name: "Candidates", path: "/candidates" },
  { icon: <UserSearch />, name: "Txns", path: "/transactions" },
  { icon: <UserCircleIcon />, name: "Settings", path: "/profile" },
];

const recruiterBottomNav: BottomNavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/" },
  { icon: <BriefcaseBusiness />, name: "Jobs", path: "/jobs" },
  { icon: <UserCircleIcon />, name: "Candidates", path: "/candidates" },
  { icon: <UserCircleIcon />, name: "Settings", path: "/profile" },
];

const hrManagerBottomNav: BottomNavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/" },
  { icon: <BriefcaseBusiness />, name: "Jobs", path: "/jobs" },
  { icon: <UserCircleIcon />, name: "Candidates", path: "/candidates" },
  { icon: <UserCircleIcon />, name: "Settings", path: "/profile" },
];

const superAdminBottomNav: BottomNavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/dashboard" },
  { icon: <UserCircleIcon />, name: "Mock Test", path: "/mock-test" },
  { icon: <UserCircleIcon />, name: "Settings", path: "/profile" },
];

const getBottomNavByRole = (role: string = ""): BottomNavItem[] => {
  switch (role.toLowerCase()) {
    case "super_admin": return superAdminBottomNav;
    case "admin": return adminBottomNav;
    case "recruiter": return recruiterBottomNav;
    case "hr_manager": return hrManagerBottomNav;
    default: return adminBottomNav;
  }
};

const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const [items, setItems] = useState<BottomNavItem[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") ?? "{}");
      setItems(getBottomNavByRole(stored?.role ?? ""));
    } catch {
      setItems(adminBottomNav);
    }
  }, []);

  if (items.length === 0) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {items.map((item) => {
        const active = item.path === pathname;
        return (
          <Link
            key={item.path}
            href={item.path}
            className="flex flex-1 flex-col items-center justify-center gap-1"
          >
            <span
              className={`flex h-6 w-6 items-center justify-center [&>svg]:h-[20px] [&>svg]:w-[20px] ${
                active ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {item.icon}
            </span>
            <span
              className={`text-[10.5px] leading-none ${
                active ? "font-semibold text-blue-600 dark:text-blue-400" : "font-medium text-gray-400 dark:text-gray-500"
              }`}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;