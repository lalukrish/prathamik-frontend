// transactions/_components/TransactionCard.tsx
"use client";

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
  transaction: Transaction;
  onConfirm?: (id: string) => void;
  confirming?: boolean;
}

const statusConfig = {
  SUCCESS: { label: "Success", classes: "bg-emerald-50 text-emerald-600" },
  PENDING: { label: "Pending", classes: "bg-amber-50 text-amber-600" },
  FAILED: { label: "Failed", classes: "bg-rose-50 text-rose-600" },
  REFUNDED: { label: "Refunded", classes: "bg-slate-100 text-slate-500" },
};

export default function TransactionCard({ transaction, onConfirm, confirming }: Props) {
  const status = statusConfig[transaction.status];
  const date = new Date(transaction.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      {/* Thumbnail */}
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        {transaction.mockTest.thumbnailUrl ? (
          <img
            src={transaction.mockTest.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-slate-300">
            📄
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold text-slate-800">
          {transaction.mockTest.title}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-400">
            {transaction.mockTest.category}
          </span>
          <span className="text-slate-200">·</span>
          <span className="text-[11px] text-slate-400">{date}</span>
        </div>
      </div>

      {/* Amount + status */}
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <p className="text-sm font-extrabold text-slate-800">
          ₹{transaction.amount}
        </p>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${status.classes}`}>
          {status.label}
        </span>
      </div>

      {/* Dummy confirm button for pending */}
      {transaction.status === "PENDING" && onConfirm && (
        <button
          onClick={() => onConfirm(transaction.id)}
          disabled={confirming}
          className="ml-2 shrink-0 rounded-xl bg-orange-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {confirming ? "..." : "Pay"}
        </button>
      )}
    </div>
  );
}