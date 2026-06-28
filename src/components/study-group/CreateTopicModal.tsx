// study-groups/_components/CreateTopicModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createTopic } from "@/shared/study-group";

// reuse your existing lexical editor
import JobEditor from "@/components/mock-test/question-description";

interface Props {
  category: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateTopicModal({ category, onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createTopic({ category, title, content });
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to create topic.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
              {category}
            </p>
            <h2 className="text-base font-bold text-slate-800">Add Study Topic</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Title</label>
            <input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(""); }}
              placeholder="e.g. Mauryan Empire — key facts"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Content</label>
            <JobEditor value={content} onChange={setContent} />
          </div>

          {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Topic"}
          </button>
        </div>
      </div>
    </div>
  );
}