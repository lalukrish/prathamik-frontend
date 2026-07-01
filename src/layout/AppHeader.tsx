

// // "use client";
// // import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
// // import NotificationDropdown from "@/components/header/NotificationDropdown";
// // import UserDropdown from "@/components/header/UserDropdown";
// // import { useSidebar } from "@/context/SidebarContext";
// // import Link from "next/link";
// // import React, { useState, useEffect, useCallback, useRef } from "react";
// // import {
// //   Search, X, User, Briefcase, ChevronRight,
// //   Loader2, Phone, ExternalLink,
// //   Mail, Menu,
// // } from "lucide-react";
// // import { useRouter } from "next/navigation";
// // import api from "@/lib/axios";

// // // ── types ─────────────────────────────────────────────────────
// // interface Application {
// //   id: string;
// //   job: {
// //     id: string;
// //     title: string;
// //   };
// // }

// // interface Candidate {
// //   id: string;
// //   name: string;
// //   email?: string;
// //   phone?: string;
// //   currentRole?: string;
// //   applications: Application[];
// // }

// // // ── helpers ───────────────────────────────────────────────────
// // function Avatar({ name }: { name: string }) {
// //   const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
// //   return (
// //     <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
// //       {initials}
// //     </div>
// //   );
// // }

// // // ── SearchDropdown ────────────────────────────────────────────
// // function SearchDropdown({ onClose }: { onClose: () => void }) {
// //   const router = useRouter();
// //   const inputRef = useRef<HTMLInputElement>(null);
// //   const containerRef = useRef<HTMLDivElement>(null);
// //   const debounceRef = useRef<NodeJS.Timeout | null>(null);

// //   const [query, setQuery] = useState("");
// //   const [candidates, setCandidates] = useState<Candidate[]>([]);
// //   const [searching, setSearching] = useState(false);
// //   const [selected, setSelected] = useState<Candidate | null>(null);
// //   useEffect(() => { inputRef.current?.focus(); }, []);

// //   useEffect(() => {
// //     const handler = (e: MouseEvent) => {
// //       if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
// //         onClose();
// //       }
// //     };
// //     document.addEventListener("mousedown", handler);
// //     return () => document.removeEventListener("mousedown", handler);
// //   }, [onClose]);

// //   useEffect(() => {
// //     const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
// //     document.addEventListener("keydown", handler);
// //     return () => document.removeEventListener("keydown", handler);
// //   }, [onClose]);

// //   useEffect(() => {
// //     if (debounceRef.current) clearTimeout(debounceRef.current);
// //     if (query.length < 3) { setCandidates([]); setSelected(null); return; }

// //     debounceRef.current = setTimeout(async () => {
// //       setSearching(true);
// //       try {
// //         const token = localStorage.getItem("token");
// //         const res = await api.get(`/candidate/search/candidate?query=${encodeURIComponent(query)}`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         const data: Candidate[] = res.data?.data ?? res.data ?? [];
// //         setCandidates(data);
// //         setSelected(data[0] ?? null);
// //       } catch {
// //         setCandidates([]);
// //         setSelected(null);
// //       } finally {
// //         setSearching(false);
// //       }
// //     }, 350);

// //     return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
// //   }, [query]);

// //   const navigate = (href: string) => { router.push(href); onClose(); };
// //   const showPanel = query.length >= 3;

// //   return (
// //     <div ref={containerRef} className="relative w-full">
// //       {/* input — light pill, sits on the dark header */}
// //       <div className="flex items-center gap-2 h-10 rounded-lg border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900 ring-2 ring-blue-500/20">
// //         {searching
// //           ? <Loader2 size={15} className="shrink-0 animate-spin text-blue-500" />
// //           : <Search size={15} className="shrink-0 text-gray-400" />
// //         }
// //         <input
// //           ref={inputRef}
// //           value={query}
// //           onChange={(e) => setQuery(e.target.value)}
// //           placeholder="Search candidates, jobs, settings and more…"
// //           className="flex-1 bg-transparent text-[13px] text-gray-800 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
// //         />
// //         {query ? (
// //           <button
// //             onClick={() => { setQuery(""); setCandidates([]); setSelected(null); }}
// //             className="text-gray-400 hover:text-gray-600 transition-colors"
// //           >
// //             <X size={14} />
// //           </button>
// //         ) : (
// //           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
// //             <X size={14} />
// //           </button>
// //         )}
// //       </div>

// //       {/* dropdown panel */}
// //       {showPanel && (
// //         <div className="absolute left-0 top-[calc(100%+8px)] z-[99999] w-[580px] max-w-[90vw] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
// //           <div className="flex" style={{ minHeight: 200, maxHeight: 360 }}>
// //             {/* left — candidates */}
// //             <div className="w-[230px] shrink-0 overflow-y-auto border-r border-gray-100 dark:border-gray-800">
// //               {candidates.length === 0 && !searching && (
// //                 <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
// //                   <User size={22} className="text-gray-200 dark:text-gray-700" />
// //                   <p className="text-[12px] text-gray-400">No candidates found</p>
// //                 </div>
// //               )}

// //               {candidates.map((c) => {
// //                 const isActive = selected?.id === c.id;
// //                 return (
// //                   <button
// //                     key={c.id}
// //                     onClick={() => setSelected(c)}
// //                     className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
// //                       isActive
// //                         ? "bg-blue-50 dark:bg-blue-950"
// //                         : "hover:bg-gray-50 dark:hover:bg-gray-800"
// //                     }`}
// //                   >
// //                     <Avatar name={c.name} />
// //                     <div className="min-w-0 flex-1 space-y-1">
// //                       <p className={`truncate text-[13px] font-medium ${isActive ? "text-blue-700 dark:text-blue-300" : "text-gray-800 dark:text-white"}`}>
// //                         {c.name}
// //                       </p>
// //                       {c.currentRole && (
// //                         <p className="text-[11px] text-gray-400 flex items-center gap-1">{c.currentRole}</p>
// //                       )}
// //                       {c.email && (
// //                         <p className="text-[11px] text-gray-400 flex items-center gap-1">
// //                           <Mail size={9} /> {c.email}
// //                         </p>
// //                       )}
// //                       {c.phone && (
// //                         <p className="text-[11px] text-gray-400 flex items-center gap-1">
// //                           <Phone size={9} /> {c.phone}
// //                         </p>
// //                       )}
// //                     </div>
// //                     <span className="shrink-0 text-[10px] text-gray-400">{c.applications.length}</span>
// //                     <ChevronRight size={12} className={`shrink-0 ${isActive ? "text-blue-400" : "text-gray-300"}`} />
// //                   </button>
// //                 );
// //               })}
// //             </div>

// //             {/* right — applications */}
// //             <div className="flex-1 overflow-y-auto">
// //               {!selected ? (
// //                 <div className="flex h-full flex-col items-center justify-center gap-2 py-10 text-center">
// //                   <Briefcase size={22} className="text-gray-200 dark:text-gray-700" />
// //                   <p className="text-[12px] text-gray-400">Select a candidate<br />to see applications</p>
// //                 </div>
// //               ) : (
// //                 <>
// //                   <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2.5 dark:border-gray-800">
// //                     <h3 className="text-[12px] font-semibold text-gray-700 dark:text-gray-300">Applications</h3>
// //                   </div>

// //                   {selected.applications.length === 0 ? (
// //                     <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
// //                       <Briefcase size={20} className="text-gray-200 dark:text-gray-700" />
// //                       <p className="text-[12px] text-gray-400">No applications found</p>
// //                     </div>
// //                   ) : (
// //                     selected.applications.map((app) => (
// //                       <button
// //                         key={app.id}
// //                         onClick={() => navigate(`/applicants/applicant-profile/${app.id}`)}
// //                         className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
// //                       >
// //                         <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
// //                           <Briefcase size={12} className="text-gray-400" />
// //                         </div>
// //                         <div className="min-w-0 flex-1">
// //                           <p className="truncate text-[12px] font-medium text-gray-800 dark:text-white">{app.job.title}</p>
// //                           <p className="text-[11px] text-gray-400">{app.job.id.slice(0, 8)}…</p>
// //                         </div>
// //                         <ExternalLink size={11} className="shrink-0 text-gray-300" />
// //                       </button>
// //                     ))
// //                   )}
// //                 </>
// //               )}
// //             </div>
// //           </div>

// //           <div className="flex items-center border-t border-gray-100 px-3 py-1.5 dark:border-gray-800">
// //             <span className="text-[11px] text-gray-400">
// //               {candidates.length} candidate{candidates.length !== 1 ? "s" : ""}
// //             </span>
// //             <span className="ml-auto text-[11px] text-gray-400 flex items-center gap-1">
// //               <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-0.5 font-mono text-[10px] dark:border-gray-700 dark:bg-gray-800">esc</kbd>
// //               to close
// //             </span>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // ── top nav links (desktop, inline next to logo — Razorpay style) ──
// // const TOP_NAV = [
// //   { name: "Dashboard", path: "/dashboard" },
// //   { name: "Candidates", path: "/candidates" },
// //   { name: "Jobs", path: "/jobs" },
// // ];

// // // ── AppHeader ─────────────────────────────────────────────────
// // const AppHeader: React.FC = () => {
// //   const [searchOpen, setSearchOpen] = useState(false);
// //   const { toggleMobileSidebar } = useSidebar();

// //   const openSearch = useCallback(() => setSearchOpen(true), []);
// //   const closeSearch = useCallback(() => setSearchOpen(false), []);

// //   useEffect(() => {
// //     const handler = (e: KeyboardEvent) => {
// //       if ((e.metaKey || e.ctrlKey) && e.key === "k") {
// //         e.preventDefault();
// //         openSearch();
// //       }
// //     };
// //     document.addEventListener("keydown", handler);
// //     return () => document.removeEventListener("keydown", handler);
// //   }, [openSearch]);

// //   return (
// //     <header className="sticky top-0 z-30 flex h-12 w-full items-center bg-gray-950 px-4 lg:px-6">
// //       <div className="flex w-full items-center gap-4 lg:gap-8">
// //         {/* mobile menu trigger (kept for tablets — bottom nav covers phones) */}
// //         <button
// //           onClick={toggleMobileSidebar}
// //           className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-300 hover:bg-white/10 lg:hidden"
// //           aria-label="Toggle menu"
// //         >
// //           <Menu size={20} />
// //         </button>

// //         {/* logo */}
// //         <Link href="/" className="flex shrink-0 items-center gap-2">
// //           <span className="text-[20px] font-bold text-white">Prathamik</span>
// //         </Link>

// //         {/* inline top nav — desktop only */}
// //         {/* <nav className="hidden items-center gap-1 lg:flex">
// //           {TOP_NAV.map((item) => (
// //             <Link
// //               key={item.path}
// //               href={item.path}
// //               className="rounded-md px-3 py-2 text-[14px] font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
// //             >
// //               {item.name}
// //             </Link>
// //           ))}
// //         </nav> */}

// //         {/* search — desktop, centered-ish like Razorpay's */}
// //         <div className="ml-auto hidden flex-1 max-w-md lg:block">
// //           {searchOpen ? (
// //             <SearchDropdown onClose={closeSearch} />
// //           ) : (
// //             <button
// //               onClick={openSearch}
// //               className="flex h-8 w-full items-center gap-3 rounded-lg bg-white/10 pl-4 pr-3 text-[13px] text-gray-300 transition hover:bg-white/15"
// //             >
// //               <Search size={15} className="shrink-0" />
// //               <span className="flex-1 text-left">Search candidates, jobs, settings…</span>
// //               <span className="hidden items-center gap-1 sm:flex">
// //                 <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[11px] font-mono text-gray-300">⌘</kbd>
// //                 <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[11px] font-mono text-gray-300">K</kbd>
// //               </span>
// //             </button>
// //           )}
// //         </div>

// //         {/* mobile search icon only */}
// //         <button
// //           onClick={openSearch}
// //           className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-gray-300 hover:bg-white/10 lg:hidden"
// //           aria-label="Search"
// //         >
// //           <Search size={18} />
// //         </button>

// //         {/* right icon cluster */}
// //         <div className="flex shrink-0 items-center gap-1.5 lg:gap-2">
// //           <div className="hidden sm:block">
// //             <ThemeToggleButton />
// //           </div>
// //           <NotificationDropdown />
// //           <div className="ml-1">
// //             <UserDropdown />
// //           </div>
// //         </div>
// //       </div>

// //       {/* full-width search panel under header on mobile when open */}
// //       {searchOpen && (
// //         <div className="absolute left-0 top-16 z-40 w-full bg-white/40 px-4 py-3 lg:hidden">
// //           <SearchDropdown onClose={closeSearch} />
// //         </div>
// //       )}
// //     </header>
// //   );
// // };

// // export default AppHeader;

// "use client";
// import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
// import NotificationDropdown from "@/components/header/NotificationDropdown";
// import UserDropdown from "@/components/header/UserDropdown";
// import { useSidebar } from "@/context/SidebarContext";
// import Link from "next/link";
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import {
//   Search, X, User, Briefcase, ChevronRight,
//   Loader2, Phone, ExternalLink,
//   Mail, Menu,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import api from "@/lib/axios";

// // ── types ─────────────────────────────────────────────────────
// interface Application {
//   id: string;
//   job: {
//     id: string;
//     title: string;
//   };
// }

// interface Candidate {
//   id: string;
//   name: string;
//   email?: string;
//   phone?: string;
//   currentRole?: string;
//   applications: Application[];
// }

// // ── helpers ───────────────────────────────────────────────────
// function Avatar({ name }: { name: string }) {
//   const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
//   return (
//     <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
//       {initials}
//     </div>
//   );
// }

// // ── SearchDropdown ────────────────────────────────────────────
// function SearchDropdown({ onClose }: { onClose: () => void }) {
//   const router = useRouter();
//   const inputRef = useRef<HTMLInputElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const debounceRef = useRef<NodeJS.Timeout | null>(null);

//   const [query, setQuery] = useState("");
//   const [candidates, setCandidates] = useState<Candidate[]>([]);
//   const [searching, setSearching] = useState(false);
//   const [selected, setSelected] = useState<Candidate | null>(null);
//   useEffect(() => { inputRef.current?.focus(); }, []);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
//         onClose();
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, [onClose]);

//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
//     document.addEventListener("keydown", handler);
//     return () => document.removeEventListener("keydown", handler);
//   }, [onClose]);

//   useEffect(() => {
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     if (query.length < 3) { setCandidates([]); setSelected(null); return; }

//     debounceRef.current = setTimeout(async () => {
//       setSearching(true);
//       try {
//         const token = localStorage.getItem("token");
//         const res = await api.get(`/mock-tests/search?query=${encodeURIComponent(query)}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data: Candidate[] = res.data?.data ?? res.data ?? [];
//         setCandidates(data);
//         setSelected(data[0] ?? null);
//       } catch {
//         setCandidates([]);
//         setSelected(null);
//       } finally {
//         setSearching(false);
//       }
//     }, 350);

//     return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
//   }, [query]);

//   const navigate = (href: string) => { router.push(href); onClose(); };
//   const showPanel = query.length >= 3;

//   return (
//     <div ref={containerRef} className="relative w-full">
//       {/* input — light pill, sits on the dark header */}
//       <div className="flex items-center gap-2 h-10 rounded-lg border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900 ring-2 ring-blue-500/20">
//         {searching
//           ? <Loader2 size={15} className="shrink-0 animate-spin text-blue-500" />
//           : <Search size={15} className="shrink-0 text-gray-400" />
//         }
//         <input
//           ref={inputRef}
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search candidates, jobs, settings and more…"
//           className="flex-1 bg-transparent text-[13px] text-gray-800 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
//         />
//         {query ? (
//           <button
//             onClick={() => { setQuery(""); setCandidates([]); setSelected(null); }}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X size={14} />
//           </button>
//         ) : (
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
//             <X size={14} />
//           </button>
//         )}
//       </div>

//       {/* dropdown panel */}
//       {showPanel && (
//         <div className="absolute left-0 top-[calc(100%+8px)] z-[99999] w-[580px] max-w-[90vw] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
//           <div className="flex" style={{ minHeight: 200, maxHeight: 360 }}>
//             {/* left — candidates */}
//             <div className="w-[230px] shrink-0 overflow-y-auto border-r border-gray-100 dark:border-gray-800">
//               {candidates.length === 0 && !searching && (
//                 <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
//                   <User size={22} className="text-gray-200 dark:text-gray-700" />
//                   <p className="text-[12px] text-gray-400">No candidates found</p>
//                 </div>
//               )}

//               {candidates.map((c) => {
//                 const isActive = selected?.id === c.id;
//                 return (
//                   <button
//                     key={c.id}
//                     onClick={() => setSelected(c)}
//                     className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
//                       isActive
//                         ? "bg-blue-50 dark:bg-blue-950"
//                         : "hover:bg-gray-50 dark:hover:bg-gray-800"
//                     }`}
//                   >
//                     <Avatar name={c.name} />
//                     <div className="min-w-0 flex-1 space-y-1">
//                       <p className={`truncate text-[13px] font-medium ${isActive ? "text-blue-700 dark:text-blue-300" : "text-gray-800 dark:text-white"}`}>
//                         {c.name}
//                       </p>
//                       {c.currentRole && (
//                         <p className="text-[11px] text-gray-400 flex items-center gap-1">{c.currentRole}</p>
//                       )}
//                       {c.email && (
//                         <p className="text-[11px] text-gray-400 flex items-center gap-1">
//                           <Mail size={9} /> {c.email}
//                         </p>
//                       )}
//                       {c.phone && (
//                         <p className="text-[11px] text-gray-400 flex items-center gap-1">
//                           <Phone size={9} /> {c.phone}
//                         </p>
//                       )}
//                     </div>
//                     <span className="shrink-0 text-[10px] text-gray-400">{c.applications.length}</span>
//                     <ChevronRight size={12} className={`shrink-0 ${isActive ? "text-blue-400" : "text-gray-300"}`} />
//                   </button>
//                 );
//               })}
//             </div>

//             {/* right — applications */}
//             <div className="flex-1 overflow-y-auto">
//               {!selected ? (
//                 <div className="flex h-full flex-col items-center justify-center gap-2 py-10 text-center">
//                   <Briefcase size={22} className="text-gray-200 dark:text-gray-700" />
//                   <p className="text-[12px] text-gray-400">Select a candidate<br />to see applications</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2.5 dark:border-gray-800">
//                     <h3 className="text-[12px] font-semibold text-gray-700 dark:text-gray-300">Applications</h3>
//                   </div>

//                   {selected.applications.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
//                       <Briefcase size={20} className="text-gray-200 dark:text-gray-700" />
//                       <p className="text-[12px] text-gray-400">No applications found</p>
//                     </div>
//                   ) : (
//                     selected.applications.map((app) => (
//                       <button
//                         key={app.id}
//                         onClick={() => navigate(`/applicants/applicant-profile/${app.id}`)}
//                         className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                       >
//                         <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
//                           <Briefcase size={12} className="text-gray-400" />
//                         </div>
//                         <div className="min-w-0 flex-1">
//                           <p className="truncate text-[12px] font-medium text-gray-800 dark:text-white">{app.job.title}</p>
//                           <p className="text-[11px] text-gray-400">{app.job.id.slice(0, 8)}…</p>
//                         </div>
//                         <ExternalLink size={11} className="shrink-0 text-gray-300" />
//                       </button>
//                     ))
//                   )}
//                 </>
//               )}
//             </div>
//           </div>

//           <div className="flex items-center border-t border-gray-100 px-3 py-1.5 dark:border-gray-800">
//             <span className="text-[11px] text-gray-400">
//               {candidates.length} candidate{candidates.length !== 1 ? "s" : ""}
//             </span>
//             <span className="ml-auto text-[11px] text-gray-400 flex items-center gap-1">
//               <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-0.5 font-mono text-[10px] dark:border-gray-700 dark:bg-gray-800">esc</kbd>
//               to close
//             </span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── AppHeader ─────────────────────────────────────────────────
// const AppHeader: React.FC = () => {
//   const [searchOpen, setSearchOpen] = useState(false);
//   const { toggleMobileSidebar } = useSidebar();

//   const openSearch = useCallback(() => setSearchOpen(true), []);
//   const closeSearch = useCallback(() => setSearchOpen(false), []);

//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => {
//       if ((e.metaKey || e.ctrlKey) && e.key === "k") {
//         e.preventDefault();
//         openSearch();
//       }
//     };
//     document.addEventListener("keydown", handler);
//     return () => document.removeEventListener("keydown", handler);
//   }, [openSearch]);

//   return (
//     <header className="sticky top-0 z-30 flex h-12 w-full items-center bg-gray-950 px-4 lg:px-6">
//       <div className="flex w-full items-center gap-4 lg:gap-8">
//         {/* mobile menu trigger (kept for tablets — bottom nav covers phones) */}
//         <button
//           onClick={toggleMobileSidebar}
//           className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-300 hover:bg-white/10 lg:hidden"
//           aria-label="Toggle menu"
//         >
//           <Menu size={20} />
//         </button>

//         {/* logo */}
//         <Link href="/" className="flex shrink-0 items-center gap-2">
//           <span className="text-[20px] font-bold text-white">Prathamik</span>
//         </Link>

//         {/* search — desktop, now anchored left right after the logo */}
//         <div className="hidden w-full max-w-md lg:block">
//           {searchOpen ? (
//             <SearchDropdown onClose={closeSearch} />
//           ) : (
//             <button
//               onClick={openSearch}
//               className="flex h-8 w-full items-center gap-3 rounded-lg bg-white/10 pl-4 pr-3 text-[13px] text-gray-300 transition hover:bg-white/15"
//             >
//               <Search size={15} className="shrink-0" />
//               <span className="flex-1 text-left">Search candidates, jobs, settings…</span>
//               <span className="hidden items-center gap-1 sm:flex">
//                 <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[11px] font-mono text-gray-300">⌘</kbd>
//                 <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[11px] font-mono text-gray-300">K</kbd>
//               </span>
//             </button>
//           )}
//         </div>

//         {/* everything to the right now pushes via ml-auto on the icon cluster */}
//         {/* mobile search icon only */}
//         <button
//           onClick={openSearch}
//           className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-gray-300 hover:bg-white/10 lg:hidden"
//           aria-label="Search"
//         >
//           <Search size={18} />
//         </button>

//         {/* right icon cluster */}
//         <div className="ml-auto hidden shrink-0 items-center gap-1.5 lg:flex lg:gap-2">
//           <div className="hidden sm:block">
//             <ThemeToggleButton />
//           </div>
//           <NotificationDropdown />
//           <div className="ml-1">
//             <UserDropdown />
//           </div>
//         </div>
//         {/* mobile-only icon cluster (theme/notif/user always visible) */}
//         <div className="flex shrink-0 items-center gap-1.5 lg:hidden">
//           <div className="hidden sm:block">
//             <ThemeToggleButton />
//           </div>
//           <NotificationDropdown />
//           <div className="ml-1">
//             <UserDropdown />
//           </div>
//         </div>
//       </div>

//       {/* full-width search panel under header on mobile when open */}
//       {searchOpen && (
//         <div className="absolute left-0 top-16 z-40 w-full bg-white/40 px-4 py-3 lg:hidden">
//           <SearchDropdown onClose={closeSearch} />
//         </div>
//       )}
//     </header>
//   );
// };

// export default AppHeader;
"use client";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import Link from "next/link";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search, X, FileText, Clock, Award,
  Loader2, ExternalLink, Menu, Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

// ── types ─────────────────────────────────────────────────────
interface MockTest {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  totalMarks: number;
  category: string;
  accessMode: "FREE" | "PAID";
  price?: number | null;
  _count?: { questions: number };
  createdBy?: { id: string; name: string };
}

// ── SearchDropdown ────────────────────────────────────────────
function SearchDropdown({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [query, setQuery] = useState("");
  const [tests, setTests] = useState<MockTest[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 3) { setTests([]); return; }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/mock-tests/search?q=${encodeURIComponent(query)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // response shape: { success, data: { data: MockTest[], total, page, limit, totalPages } }
        const list: MockTest[] = res.data?.data?.data ?? [];
        setTests(list);
      } catch {
        setTests([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const navigate = (href: string) => { router.push(href); onClose(); };
  const showPanel = query.length >= 3;

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center gap-2 h-10 rounded-lg border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900 ring-2 ring-blue-500/20">
        {searching
          ? <Loader2 size={15} className="shrink-0 animate-spin text-blue-500" />
          : <Search size={15} className="shrink-0 text-gray-400" />
        }
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search mock tests by name or category…"
          className="flex-1 bg-transparent text-[13px] text-gray-800 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
        />
        <button
          onClick={query ? () => { setQuery(""); setTests([]); } : onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {showPanel && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-[99999] w-[420px] max-w-[90vw] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
          <div className="overflow-y-auto" style={{ minHeight: 120, maxHeight: 360 }}>
            {tests.length === 0 && !searching && (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <FileText size={22} className="text-gray-200 dark:text-gray-700" />
                <p className="text-[12px] text-gray-400">No mock tests found</p>
              </div>
            )}

            {tests.map((t) => (
              <button
                key={t.id}
                onClick={() => navigate(`/mock-tests/${t.id}`)}
                className="flex w-full items-start gap-3 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 dark:bg-blue-950">
                  <FileText size={14} className="text-blue-500" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="truncate text-[13px] font-medium text-gray-800 dark:text-white">
                    {t.title}
                  </p>
                  {t.description && (
                    <p className="truncate text-[11px] text-gray-400">{t.description}</p>
                  )}
                  <div className="flex items-center gap-3 pt-0.5">
                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Tag size={9} /> {t.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Clock size={9} /> {t.durationMinutes}m
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Award size={9} /> {t.totalMarks}
                    </span>
                    <span className={`text-[10px] font-medium ${t.accessMode === "PAID" ? "text-amber-500" : "text-green-500"}`}>
                      {t.accessMode === "PAID" ? `₹${t.price}` : "FREE"}
                    </span>
                  </div>
                </div>
                <ExternalLink size={11} className="shrink-0 text-gray-300 mt-1" />
              </button>
            ))}
          </div>

          <div className="flex items-center border-t border-gray-100 px-3 py-1.5 dark:border-gray-800">
            <span className="text-[11px] text-gray-400">
              {tests.length} result{tests.length !== 1 ? "s" : ""}
            </span>
            <span className="ml-auto text-[11px] text-gray-400 flex items-center gap-1">
              <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-0.5 font-mono text-[10px] dark:border-gray-700 dark:bg-gray-800">esc</kbd>
              to close
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── AppHeader ─────────────────────────────────────────────────
const AppHeader: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { toggleMobileSidebar } = useSidebar();

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [openSearch]);

  return (
    <header className="sticky top-0 z-30 flex h-12 w-full items-center bg-gray-950 px-4 lg:px-6">
      <div className="flex w-full items-center gap-4 lg:gap-8">
        <button
          onClick={toggleMobileSidebar}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-300 hover:bg-white/10 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="text-[20px] font-bold text-white">Prathamik</span>
        </Link>

        <div className="hidden w-full max-w-md lg:block">
          {searchOpen ? (
            <SearchDropdown onClose={closeSearch} />
          ) : (
            <button
              onClick={openSearch}
              className="flex h-8 w-full items-center gap-3 rounded-lg bg-white/10 pl-4 pr-3 text-[13px] text-gray-300 transition hover:bg-white/15"
            >
              <Search size={15} className="shrink-0" />
              <span className="flex-1 text-left">Search mock tests…</span>
              <span className="hidden items-center gap-1 sm:flex">
                <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[11px] font-mono text-gray-300">⌘</kbd>
                <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[11px] font-mono text-gray-300">K</kbd>
              </span>
            </button>
          )}
        </div>

        <button
          onClick={openSearch}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-gray-300 hover:bg-white/10 lg:hidden"
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        <div className="ml-auto hidden shrink-0 items-center gap-1.5 lg:flex lg:gap-2">
          <div className="hidden sm:block"><ThemeToggleButton /></div>
          <NotificationDropdown />
          <div className="ml-1"><UserDropdown /></div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 lg:hidden">
          <div className="hidden sm:block"><ThemeToggleButton /></div>
          <NotificationDropdown />
          <div className="ml-1"><UserDropdown /></div>
        </div>
      </div>

      {searchOpen && (
        <div className="absolute left-0 top-16 z-40 w-full bg-white/40 px-4 py-3 lg:hidden">
          <SearchDropdown onClose={closeSearch} />
        </div>
      )}
    </header>
  );
};

export default AppHeader;