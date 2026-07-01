
// "use client";
// import React, { useEffect, useRef, useState, useCallback } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useSidebar } from "../context/SidebarContext";
// import {
//   BoxCubeIcon,
//   CalenderIcon,
//   ChevronDownIcon,
//   GridIcon,
//   PieChartIcon,
//   PlugInIcon,
//   TableIcon,
//   UserCircleIcon,
// } from "../icons/index";
// import { BookSearch, BriefcaseBusiness, SettingsIcon, UserSearch } from "lucide-react";

// type NavItem = {
//   name: string;
//   icon: React.ReactNode;
//   path?: string;
//   subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
// };

// const superAdminNavItems: NavItem[] = [
//   { icon: <GridIcon />, name: "Dashboard", path: "/dashboard" },
//   { icon: <UserCircleIcon />, name: "Mock Test", path: "/mock-test" },
//   { icon: <TableIcon />, name: "Settings", path: "/profile" },
// ];

// const adminNavItems: NavItem[] = [
//   { icon: <GridIcon />, name: "Dashboard", path: "/dashboard" },
//   { icon: <UserCircleIcon />, name: "Mock Test", path: "/mock-test" },
//   { icon: <UserCircleIcon />, name: "Tests", path: "/tests" },
//   { icon: <UserCircleIcon />, name: "Study Community", path: "/study-group" },
//   { icon: <UserSearch />, name: "Candidates", path: "/candidates" },
//   { icon: <UserSearch />, name: "Transaction", path: "/transactions" },
//   { icon: <SettingsIcon />, name: "Settings", path: "/profile" },
// ];

// const recruiterNavItems: NavItem[] = [
//   { icon: <GridIcon />, name: "Dashboard", path: "/" },
//   { icon: <UserCircleIcon />, name: "Mock Test", path: "/mock-test" },
//   { icon: <CalenderIcon />, name: "Jobs", path: "/jobs" },
//   { icon: <UserCircleIcon />, name: "Candidates", path: "/candidates" },
//   { icon: <UserCircleIcon />, name: "Settings", path: "/profile" },
// ];

// const hrManagerNavItems: NavItem[] = [
//   { icon: <GridIcon />, name: "Dashboard", path: "/" },
//   { icon: <UserCircleIcon />, name: "Mock Test", path: "/mock-test" },
//   { icon: <CalenderIcon />, name: "Jobs", path: "/jobs" },
//   { icon: <UserCircleIcon />, name: "Candidates", path: "/candidates" },
//   { icon: <BookSearch />, name: "Question Bank", path: "/question-bank" },
//   { icon: <UserCircleIcon />, name: "Settings", path: "/profile" },
// ];

// // secondary / "+N More" group — collapsed by default, Razorpay-style
// const moreNavItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Charts",
//     subItems: [
//       { name: "Line Chart", path: "/line-chart", pro: false },
//       { name: "Bar Chart", path: "/bar-chart", pro: false },
//     ],
//   },
//   {
//     icon: <BoxCubeIcon />,
//     name: "UI Elements",
//     subItems: [
//       { name: "Alerts", path: "/alerts", pro: false },
//       { name: "Avatar", path: "/avatars", pro: false },
//       { name: "Badge", path: "/badge", pro: false },
//       { name: "Buttons", path: "/buttons", pro: false },
//       { name: "Images", path: "/images", pro: false },
//       { name: "Videos", path: "/videos", pro: false },
//     ],
//   },
//   {
//     icon: <PlugInIcon />,
//     name: "Authentication",
//     subItems: [
//       { name: "Sign In", path: "/signin", pro: false },
//       { name: "Sign Up", path: "/signup", pro: false },
//     ],
//   },
// ];

// const getNavItemsByRole = (role: string = ""): NavItem[] => {
//   switch (role.toLowerCase()) {
//     case "super_admin": return superAdminNavItems;
//     case "admin": return adminNavItems;
//     case "recruiter": return recruiterNavItems;
//     case "hr_manager": return hrManagerNavItems;
//     default: return adminNavItems;
//   }
// };

// const AppSidebar: React.FC = () => {
//   const pathname = usePathname();
//   const { isMobileOpen, toggleMobileSidebar } = useSidebar();

//   const [navItems, setNavItems] = useState<NavItem[]>([]);
//   const [mounted, setMounted] = useState(false);
//   const [showMore, setShowMore] = useState(false);

//   const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
//   const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
//   const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

//   const isActive = useCallback((path: string) => path === pathname, [pathname]);

//   useEffect(() => {
//     try {
//       const stored = JSON.parse(localStorage.getItem("user") ?? "{}");
//       const role = stored?.role ?? "";
//       setNavItems(getNavItemsByRole(role));
//     } catch {
//       setNavItems(adminNavItems);
//     }
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     let matched = false;
//     moreNavItems.forEach((nav, index) => {
//       nav.subItems?.forEach((sub) => {
//         if (isActive(sub.path)) {
//           setOpenSubmenu(index);
//           setShowMore(true);
//           matched = true;
//         }
//       });
//     });
//     if (!matched) setOpenSubmenu(null);
//   }, [pathname, isActive]);

//   useEffect(() => {
//     if (openSubmenu !== null) {
//       const key = `more-${openSubmenu}`;
//       if (subMenuRefs.current[key]) {
//         setSubMenuHeight((prev) => ({ ...prev, [key]: subMenuRefs.current[key]?.scrollHeight || 0 }));
//       }
//     }
//   }, [openSubmenu]);

//   const handleSubmenuToggle = (index: number) => {
//     setOpenSubmenu((prev) => (prev === index ? null : index));
//   };

//   // primary item row — pill highlight on active, like Razorpay's "Home"
//   const renderPrimaryItem = (nav: NavItem) =>
//     nav.path && (
//       <Link
//         href={nav.path}
//         onClick={() => isMobileOpen && toggleMobileSidebar()}
//         className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] transition-colors ${
//           isActive(nav.path)
//             ? "bg-gray-100 font-semibold text-gray-900 dark:bg-gray-800 dark:text-white"
//             : "font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
//         }`}
//       >
//         <span className="shrink-0 [&>svg]:h-[18px] [&>svg]:w-[18px]">{nav.icon}</span>
//         <span>{nav.name}</span>
//       </Link>
//     );

//   // secondary item row — smaller, muted, under "PAYMENT PRODUCTS"-style label
//   const renderSecondaryItem = (nav: NavItem, index: number) => (
//     <div key={nav.name}>
//       {nav.subItems ? (
//         <>
//           <button
//             onClick={() => handleSubmenuToggle(index)}
//             className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13.5px] transition-colors ${
//               openSubmenu === index
//                 ? "text-gray-900 dark:text-white"
//                 : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
//             }`}
//           >
//             <span className="shrink-0 [&>svg]:h-[16px] [&>svg]:w-[16px]">{nav.icon}</span>
//             <span>{nav.name}</span>
//             <ChevronDownIcon
//               className={`ml-auto h-4 w-4 transition-transform duration-200 ${openSubmenu === index ? "rotate-180" : ""}`}
//             />
//           </button>
//           <div
//             ref={(el) => { subMenuRefs.current[`more-${index}`] = el; }}
//             className="overflow-hidden transition-all duration-300"
//             style={{ height: openSubmenu === index ? `${subMenuHeight[`more-${index}`]}px` : "0px" }}
//           >
//             <ul className="ml-8 mt-1 space-y-1 border-l border-gray-100 pl-3 dark:border-gray-800">
//               {nav.subItems.map((sub) => (
//                 <li key={sub.name}>
//                   <Link
//                     href={sub.path}
//                     className={`block rounded-md px-2 py-1.5 text-[13px] ${
//                       isActive(sub.path)
//                         ? "font-medium text-gray-900 dark:text-white"
//                         : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
//                     }`}
//                   >
//                     {sub.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </>
//       ) : (
//         nav.path && (
//           <Link
//             href={nav.path}
//             className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition-colors ${
//               isActive(nav.path)
//                 ? "font-medium text-gray-900 dark:text-white"
//                 : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
//             }`}
//           >
//             <span className="shrink-0 [&>svg]:h-[16px] [&>svg]:w-[16px]">{nav.icon}</span>
//             <span>{nav.name}</span>
//           </Link>
//         )
//       )}
//     </div>
//   );

//   if (!mounted) {
//     return (
//       <aside className="fixed left-0 top-16 hidden h-[calc(100vh-64px)] w-[260px] flex-col border-r border-gray-100 bg-white px-3 py-5 dark:border-gray-800 dark:bg-gray-900 lg:flex">
//         <div className="flex flex-col gap-3">
//           {[...Array(5)].map((_, i) => (
//             <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
//           ))}
//         </div>
//       </aside>
//     );
//   }

//   return (
//     <aside className="fixed left-0 top-16 hidden h-[calc(100vh-64px)] w-[260px] flex-col overflow-y-auto border-r border-gray-100 bg-white px-3 py-5 no-scrollbar dark:border-gray-800 dark:bg-gray-900 lg:flex">
//       {/* primary nav — top-level, like Razorpay's Home / Transactions / Settlements */}
//       <ul className="flex flex-col gap-1.5">
//         {navItems.map((nav) => (
//           <li key={nav.name}>{renderPrimaryItem(nav)}</li>
//         ))}
//       </ul>

//       <div className="my-5 border-t border-gray-100 dark:border-gray-800" />

//       {/* secondary group label — like Razorpay's "PAYMENT PRODUCTS" */}
//       <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
//         More
//       </p>
//       <div className="mt-3 flex flex-col gap-0.5">
//         {(showMore ? moreNavItems : moreNavItems.slice(0, 3)).map((nav, i) => renderSecondaryItem(nav, i))}
//       </div>

//       {moreNavItems.length > 3 && (
//         <button
//           onClick={() => setShowMore((s) => !s)}
//           className="mt-2 flex items-center gap-1 px-3 text-[13px] font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
//         >
//           {showMore ? "Show less" : `+${moreNavItems.length - 3} More`}
//           <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${showMore ? "rotate-180" : ""}`} />
//         </button>
//       )}

//       <div className="mt-auto pt-5">
//         <Link
//           href="/profile"
//           className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
//         >
//           <SettingsIcon />
//           <span>Account &amp; Settings</span>
//         </Link>
//       </div>
//     </aside>
//   );
// };

// export default AppSidebar;

"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons/index";
import { BookSearch, BriefcaseBusiness, SettingsIcon, UserSearch } from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const superAdminNavItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/dashboard" },
  { icon: <UserCircleIcon />, name: "Mock Test", path: "/mock-test" },
  { icon: <TableIcon />, name: "Settings", path: "/profile" },
];

const adminNavItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/dashboard" },
  { icon: <UserCircleIcon />, name: "Mock Test", path: "/mock-test" },
  { icon: <UserCircleIcon />, name: "Tests", path: "/tests" },
  { icon: <UserCircleIcon />, name: "Study Community", path: "/study-group" },
  { icon: <UserSearch />, name: "Candidates", path: "/candidates" },
  { icon: <UserSearch />, name: "Transaction", path: "/transactions" },
  { icon: <SettingsIcon />, name: "Settings", path: "/profile" },
];

const recruiterNavItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/" },
  { icon: <UserCircleIcon />, name: "Mock Test", path: "/mock-test" },
  { icon: <CalenderIcon />, name: "Jobs", path: "/jobs" },
  { icon: <UserCircleIcon />, name: "Candidates", path: "/candidates" },
  { icon: <UserCircleIcon />, name: "Settings", path: "/profile" },
];

const hrManagerNavItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/" },
  { icon: <UserCircleIcon />, name: "Mock Test", path: "/mock-test" },
  { icon: <CalenderIcon />, name: "Jobs", path: "/jobs" },
  { icon: <UserCircleIcon />, name: "Candidates", path: "/candidates" },
  { icon: <BookSearch />, name: "Question Bank", path: "/question-bank" },
  { icon: <UserCircleIcon />, name: "Settings", path: "/profile" },
];

// secondary / "+N More" group — collapsed by default, Razorpay-style
const moreNavItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const getNavItemsByRole = (role: string = ""): NavItem[] => {
  switch (role.toLowerCase()) {
    case "super_admin": return superAdminNavItems;
    case "admin": return adminNavItems;
    case "recruiter": return recruiterNavItems;
    case "hr_manager": return hrManagerNavItems;
    default: return adminNavItems;
  }
};

const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") ?? "{}");
      const role = stored?.role ?? "";
      setNavItems(getNavItemsByRole(role));
    } catch {
      setNavItems(adminNavItems);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    let matched = false;
    moreNavItems.forEach((nav, index) => {
      nav.subItems?.forEach((sub) => {
        if (isActive(sub.path)) {
          setOpenSubmenu(index);
          setShowMore(true);
          matched = true;
        }
      });
    });
    if (!matched) setOpenSubmenu(null);
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `more-${openSubmenu}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({ ...prev, [key]: subMenuRefs.current[key]?.scrollHeight || 0 }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) => (prev === index ? null : index));
  };

  // primary item row — pill highlight on active, like Razorpay's "Home"
  const renderPrimaryItem = (nav: NavItem) =>
    nav.path && (
      <Link
        href={nav.path}
        onClick={() => isMobileOpen && toggleMobileSidebar()}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] transition-colors ${
          isActive(nav.path)
            ? "bg-gray-100 font-semibold text-gray-900 dark:bg-gray-800 dark:text-white"
            : "font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
        }`}
      >
        <span className="shrink-0 [&>svg]:h-[18px] [&>svg]:w-[18px]">{nav.icon}</span>
        <span>{nav.name}</span>
      </Link>
    );

  // secondary item row — smaller, muted, under "PAYMENT PRODUCTS"-style label
  const renderSecondaryItem = (nav: NavItem, index: number) => (
    <div key={nav.name}>
      {nav.subItems ? (
        <>
          <button
            onClick={() => handleSubmenuToggle(index)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13.5px] transition-colors ${
              openSubmenu === index
                ? "text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <span className="shrink-0 [&>svg]:h-[16px] [&>svg]:w-[16px]">{nav.icon}</span>
            <span>{nav.name}</span>
            <ChevronDownIcon
              className={`ml-auto h-4 w-4 transition-transform duration-200 ${openSubmenu === index ? "rotate-180" : ""}`}
            />
          </button>
          <div
            ref={(el) => { subMenuRefs.current[`more-${index}`] = el; }}
            className="overflow-hidden transition-all duration-300"
            style={{ height: openSubmenu === index ? `${subMenuHeight[`more-${index}`]}px` : "0px" }}
          >
            <ul className="ml-8 mt-1 space-y-1 border-l border-gray-100 pl-3 dark:border-gray-800">
              {nav.subItems.map((sub) => (
                <li key={sub.name}>
                  <Link
                    href={sub.path}
                    className={`block rounded-md px-2 py-1.5 text-[13px] ${
                      isActive(sub.path)
                        ? "font-medium text-gray-900 dark:text-white"
                        : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        nav.path && (
          <Link
            href={nav.path}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition-colors ${
              isActive(nav.path)
                ? "font-medium text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <span className="shrink-0 [&>svg]:h-[16px] [&>svg]:w-[16px]">{nav.icon}</span>
            <span>{nav.name}</span>
          </Link>
        )
      )}
    </div>
  );

  if (!mounted) {
    return (
      <aside className="fixed left-0 top-16 hidden h-[calc(100vh-64px)] w-[260px] flex-col rounded-t-[28px] bg-white px-3 py-5 dark:bg-gray-900 lg:flex">
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-12 hidden h-[calc(100vh-40px)] w-[260px] flex-col overflow-y-auto rounded-l-[10px] bg-white px-3 py-5 no-scrollbar dark:bg-gray-900 lg:flex">
      {/* primary nav — top-level, like Razorpay's Home / Transactions / Settlements */}
      <ul className="flex flex-col gap-1.5">
        {navItems.map((nav) => (
          <li key={nav.name}>{renderPrimaryItem(nav)}</li>
        ))}
      </ul>

      <div className="my-5 border-t border-gray-100 dark:border-gray-800" />

      {/* secondary group label — like Razorpay's "PAYMENT PRODUCTS" */}
      <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        More
      </p>
      <div className="mt-3 flex flex-col gap-0.5">
        {(showMore ? moreNavItems : moreNavItems.slice(0, 3)).map((nav, i) => renderSecondaryItem(nav, i))}
      </div>

      {moreNavItems.length > 3 && (
        <button
          onClick={() => setShowMore((s) => !s)}
          className="mt-2 flex items-center gap-1 px-3 text-[13px] font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {showMore ? "Show less" : `+${moreNavItems.length - 3} More`}
          <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${showMore ? "rotate-180" : ""}`} />
        </button>
      )}

      <div className="mt-auto pt-5">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <SettingsIcon />
          <span>Account &amp; Settings</span>
        </Link>
      </div>
    </aside>
  );
};

export default AppSidebar;