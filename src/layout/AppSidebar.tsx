"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
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
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <UserCircleIcon />,
    name: "Mock Test",
    path: "/mock-test",
  },

  {
    icon: <TableIcon />,
    name: "Settings",
    path: "/profile",
  },
];

const adminNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
  },
   {
    icon: <UserCircleIcon />,
    name: "Mock Test",
    path: "/mock-test",
  },
  {
    icon: <UserCircleIcon />,
    name: "Tests",
    path: "/tests",
  },
  {
    icon: <UserCircleIcon />,
    name: "Study Community",
    path: "/study-group",
  },
  // {
  //   icon: <BriefcaseBusiness />,
  //   name: "Jobs",
  //   path: "/jobs",
  // },

  {
    icon: <UserSearch />,
    name: "Candidates",
    path: "/candidates",
  },
  {
    icon: <UserSearch />,
    name: "Transaction",
    path: "/transactions",
  },
  // {
  //   icon: <BookSearch />,
  //   name: "Question Bank",
  //   path: "/question-bank",
  // },
  // {
  //   icon: <UserCircleIcon />,
  //   name: "Users",
  //   subItems: [
  //     { name: "HR Managers", path: "/hrmanager", pro: false },
  //     { name: "Recruiter", path: "/recruiter", pro: false },
  //   ],
  // },
  {
    icon: <SettingsIcon />,
    name: "Settings",
    path: "/profile",
  },
];

const recruiterNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
   {
    icon: <UserCircleIcon />,
    name: "Mock Test",
    path: "/mock-test",
  },
  {
    icon: <CalenderIcon />,
    name: "Jobs",
    path: "/jobs",
  },
  {
    icon: <UserCircleIcon />,
    name: "Candidates",
    path: "/candidates",
  },
  {
    icon: <UserCircleIcon />,
    name: "Settings",
    path: "/profile",
  },
];

const hrManagerNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
   {
    icon: <UserCircleIcon />,
    name: "Mock Test",
    path: "/mock-test",
  },
  {
    icon: <CalenderIcon />,
    name: "Jobs",
    path: "/jobs",
  },
  {
    icon: <UserCircleIcon />,
    name: "Candidates",
    path: "/candidates",
  },

  {
    icon: <UserCircleIcon />,
    name: "Mock Test",
    path: "/mock-test",
  },
  {
    icon: <BookSearch />,
    name: "Question Bank",
    path: "/question-bank",
  },
  {
    icon: <UserCircleIcon />,
    name: "Settings",
    path: "/profile",
  },
];



const othersItems: NavItem[] = [
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
  {
    icon: <UserCircleIcon />,
    name: "Settings",
    path: "/profile",
  },
];

const getNavItemsByRole = (role: string = ""): NavItem[] => {
  switch (role.toLowerCase()) {
    case "super_admin":
      return superAdminNavItems;

    case "admin":
      return adminNavItems;

    case "recruiter":
      return recruiterNavItems;

    case "hr_manager":
      return hrManagerNavItems;

    default:
      return adminNavItems;
  }
};



const AppSidebar: React.FC = () => {
  const pathname = usePathname();

  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();

  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [mounted, setMounted] = useState(false);

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

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"


  ) => (

    <ul className="flex flex-col gap-4">

      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={` ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`${isActive(nav.path)
                    ? "menu-item-icon-active text-black/80!"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={ `${isActive(nav.path) ?` menu-item-text text-[16px]! text-black/80!` : `menu-item-text text-[16px]! text-white/80! hover:text-black/80!`}`} >{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );


  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  // ✅ Place this BEFORE the return statement
  if (!mounted) {
    return (
      <aside
        className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-blue-900 dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[250px]" : isHovered ? "w-[250px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="py-8 flex justify-start px-2">
          <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
            {isExpanded || isHovered || isMobileOpen ? "Hire A!" : "H"}
          </h1>
        </div>
        {/* Skeleton nav items */}
        <div className="flex flex-col gap-4 mt-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-full bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-gray-950 dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[250px]"
          : isHovered
            ? "w-[250px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      <div
        className={`py-8 flex  ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo_1.png"
                alt="Logo"
                width={150}
                height={40}
              />
              {/* <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              /> */}
              {/* <h1 className="text-[40px] font-normal text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-600">Prathamik</h1> */}
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>

      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">

        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  ""
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            {/* <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div> */}
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;
