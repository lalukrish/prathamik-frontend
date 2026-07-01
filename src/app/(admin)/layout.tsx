// "use client";

// import AuthProvider from "@/context/authProvider";
// import { useSidebar } from "@/context/SidebarContext";
// import AppHeader from "@/layout/AppHeader";
// import AppSidebar from "@/layout/AppSidebar";
// import Backdrop from "@/layout/Backdrop";
// import ReduxProvider from "@/redux/provider";
// import React from "react";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { isExpanded, isHovered, isMobileOpen } = useSidebar();

//   // Dynamic class for main content margin based on sidebar state
//   const mainContentMargin = isMobileOpen
//     ? "ml-0"
//     : isExpanded || isHovered
//       ? "lg:ml-[0px]"
//       : "lg:ml-[90px]";

//   return (
//     <div className="min-h-screen xl:flex">
//       {/* Sidebar and Backdrop */}
//       <AppSidebar />
//       <Backdrop />
//       {/* Main Content Area */}
//       <div
//         className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
//       >
//         {/* Header */}
//         <AppHeader />
//         {/* Page Content */}
//         <ReduxProvider>
//           <AuthProvider>
//             <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
//           </AuthProvider>
//         </ReduxProvider>
//       </div>
//     </div>
//   );
// }


"use client";

import AuthProvider from "@/context/authProvider";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import MobileBottomNav from "@/layout/Mobilebottomnav";
import Backdrop from "@/layout/Backdrop";
import ReduxProvider from "@/redux/provider";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // dark page background — this is what shows through the rounded corners
    <div className="min-h-screen bg-gray-950">
      <AppHeader />
      <Backdrop />
      <AppSidebar />

      {/* content panel — rounded top-left corner sits right under the dark header */}
      <div className="lg:ml-[260px]">
        <div className="min-h-[calc(100vh-40px)] rounded-r-[10px] bg-gray-50 dark:bg-gray-900 pb-20 lg:pb-0">
          <ReduxProvider>
            <AuthProvider>
              <div className="mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6">
                {children}
              </div>
            </AuthProvider>
          </ReduxProvider>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}