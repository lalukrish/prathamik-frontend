// transactions/_components/TransactionStats.tsx
"use client";

interface Props {
  total: number;
  success: number;
  pending: number;
  failed: number;
}

export default function TransactionStats({ total, success, pending, failed }: Props) {
  const stats = [
    { label: "Total Transactions", value: total, color: "text-slate-700", bg: "bg-slate-50" },
    { label: "Successful", value: success, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending", value: pending, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Failed", value: failed, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className={`rounded-2xl p-4 ${s.bg}`}>
          <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
          <p className="mt-0.5 text-xs text-slate-500">{s.label}</p>
        </div>
      ))}
    </div>
  );
}