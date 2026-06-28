'use client'

interface Props {
  cancelReason: string;
  onReasonChange: (val: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function CancelInterviewModal({ cancelReason, onReasonChange, onClose, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-800">Cancel Interview</h2>
        <p className="text-sm text-gray-500 mt-2">
          Are you sure you want to cancel this interview? Please provide a reason.
        </p>
        <textarea
          value={cancelReason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder="Enter cancellation reason..."
          className="w-full mt-4 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
          rows={4}
        />
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            Close
          </button>
          <button
            disabled={!cancelReason.trim()}
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm disabled:opacity-50 hover:bg-red-700 transition"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
}