// study-groups/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getTopicsByCategory, voteOnTopic, removeVote } from "@/shared/study-group";
import CategoryTabs from "@/components/study-group/CategoryTabs";
import TopicCard from "@/components/study-group/TopicCard";
import CreateTopicModal from "@/components/study-group/CreateTopicModal";

interface Topic {
  id: string;
  title: string;
  content: string;
  category: string;
  author: { id: string; name: string };
  createdAt: string;
  votes: {
    IMPORTANT: number;
    MEDIUM_IMPORTANT: number;
    LESS_IMPORTANT: number;
  };
  userVote: string | null;
}

export default function StudyGroupsPage() {
  const [category, setCategory] = useState("UPSC");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchTopics = async (cat: string) => {
    setLoading(true);
    try {
      const res = await getTopicsByCategory(cat);
      setTopics(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics(category);
  }, [category]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
  };

  const handleVote = async (topicId: string, importance: string) => {
    try {
      const res = await voteOnTopic(topicId, importance);
      setTopics((prev) =>
        prev.map((t) =>
          t.id === topicId
            ? { ...t, votes: res.data.data, userVote: importance }
            : t,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveVote = async (topicId: string) => {
    try {
      const res = await removeVote(topicId);
      setTopics((prev) =>
        prev.map((t) =>
          t.id === topicId
            ? { ...t, votes: res.data.data, userVote: null }
            : t,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
            Community
          </p>
          <h1 className="mt-1 text-2xl font-light tracking-tight text-slate-900">
            Study Groups
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Share important topics · 2 posts per day
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-orange-600"
        >
          <Plus size={15} />
          Add Topic
        </button>
      </div>

      {/* Category tabs */}
      <CategoryTabs active={category} onChange={handleCategoryChange} />

      {/* Topics */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-orange-400" />
        </div>
      ) : topics.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
          <p className="text-3xl">📚</p>
          <p className="mt-2 text-sm font-semibold text-slate-400">
            No topics yet for {category}
          </p>
          <p className="mt-1 text-xs text-slate-400">Be the first to add one!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onVote={handleVote}
              onRemove={handleRemoveVote}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      {showModal && (
        <CreateTopicModal
          category={category}
          onClose={() => setShowModal(false)}
          onCreated={() => fetchTopics(category)}
        />
      )}
    </div>
  );
}