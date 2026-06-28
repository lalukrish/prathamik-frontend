// transactions/_components/TransactionHistory.tsx
"use client";

import TransactionCard from "./TransactionCard";

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  createdAt: string;
  mockTest: {
    id: string;
    title: string;
    thumbnailUrl: string | null;
    category: string;
  };
}

interface Props {
  transactions: Transaction[];
  onConfirm: (id: string) => void;
  confirmingId: string | null;
}

export default function TransactionHistory({ transactions, onConfirm, confirmingId }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
        <p className="text-3xl">🧾</p>
        <p className="mt-2 text-sm font-semibold text-slate-400">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {transactions.map((t) => (
        <TransactionCard
          key={t.id}
          transaction={t}
          onConfirm={onConfirm}
          confirming={confirmingId === t.id}
        />
      ))}
    </div>
  );
}