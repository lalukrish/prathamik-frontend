"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { AuthMode } from "@/components/authentication/Authmodal";

const NAV_LINKS: [string, string][] = [
  ["#tests", "Tests"],
  ["#features", "Features"],
  ["#why-us", "Why Us"],
  ["#toppers", "Leaderboard"],
  ["#faq", "FAQ"],
  ["#about", "About"],
];

export default function Navbar({
  onAuthOpen,
}: {
  onAuthOpen: (mode: AuthMode) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3.5">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image src="/images/logo/logo_1.png" alt="TestStudio" width={150} height={40} priority />
        </Link>

        {/* Desktop search */}
        <form
          onSubmit={handleSearch}
          className="hidden flex-1 max-w-sm items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 transition-colors focus-within:border-blue-400 focus-within:bg-white md:flex"
        >
          <span className="text-slate-400">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search exams, tests, topics..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </form>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-6 text-sm font-medium text-slate-500 lg:flex">
          {NAV_LINKS.map(([href, label]) => (
            <a key={label} href={href} className="whitespace-nowrap transition-colors hover:text-slate-900">
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile search toggle */}
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 md:hidden"
          >
            🔍
          </button>

          <button
            onClick={() => onAuthOpen("signin")}
            className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 sm:block"
          >
            Login
          </button>
          <button
            onClick={() => onAuthOpen("signup")}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:opacity-90"
          >
            Start Free
          </button>
          <button className="ml-1 lg:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            <span className="text-xl">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <form onSubmit={handleSearch} className="border-t border-slate-100 bg-white px-5 py-3 md:hidden">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2">
            <span className="text-slate-400">🔍</span>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search exams, tests, topics..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </form>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-5 py-4 lg:hidden">
          {NAV_LINKS.map(([href, label]) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              {label}
            </a>
          ))}
          <button
            onClick={() => {
              onAuthOpen("signin");
              setMenuOpen(false);
            }}
            className="mt-1 block py-2.5 text-left text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
}