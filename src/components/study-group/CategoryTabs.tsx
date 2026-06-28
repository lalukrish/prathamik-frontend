// study-groups/_components/CategoryTabs.tsx
"use client";

const CATEGORIES = ["UPSC", "SSC", "IBPS", "RRB", "NEET", "JEE", "PSC", "OTHER"];

interface Props {
  active: string;
  onChange: (cat: string) => void;
}

export default function CategoryTabs({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`rounded-full px-4 py-1.5 text-xs font-bold tracking-wide transition-colors ${
            active === cat
              ? "bg-orange-500 text-white shadow-sm"
              : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}