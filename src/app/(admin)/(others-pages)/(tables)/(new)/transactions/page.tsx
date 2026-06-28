// transactions/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getTransactionHistory, confirmDummyTransaction } from "@/shared/transaction";
import TransactionStats from "@/components/transactions/TransactionStats";
import TransactionHistory from "@/components/transactions/TransactionHistory";

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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "SUCCESS" | "PENDING" | "FAILED">("ALL");

  const fetchTransactions = async () => {
    try {
      const res = await getTransactionHistory();
      setTransactions(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleConfirm = async (id: string) => {
    setConfirmingId(id);
    try {
      await confirmDummyTransaction(id);
      await fetchTransactions();
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmingId(null);
    }
  };

  const stats = {
    total: transactions.length,
    success: transactions.filter((t) => t.status === "SUCCESS").length,
    pending: transactions.filter((t) => t.status === "PENDING").length,
    failed: transactions.filter((t) => t.status === "FAILED").length,
  };

  const filtered =
    filter === "ALL" ? transactions : transactions.filter((t) => t.status === filter);

  const filterTabs: { key: typeof filter; label: string }[] = [
    { key: "ALL", label: "All" },
    { key: "SUCCESS", label: "Success" },
    { key: "PENDING", label: "Pending" },
    { key: "FAILED", label: "Failed" },
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-orange-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-orange-500">Payments</p>
        <h1 className="mt-1 text-2xl font-light tracking-tight text-slate-900">
          Transaction History
        </h1>
      </div>

      {/* Stats */}
      <TransactionStats {...stats} />

      {/* Filter tabs */}
      <div className="flex gap-2">
        {filterTabs.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              filter === f.key
                ? "bg-orange-500 text-white"
                : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <TransactionHistory
        transactions={filtered}
        onConfirm={handleConfirm}
        confirmingId={confirmingId}
      />
    </div>
  );
}