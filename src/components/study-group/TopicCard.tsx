// study-groups/_components/TopicCard.tsx
"use client";

import VoteButtons from "./VoteButtons";

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

interface Props {
  topic: Topic;
  onVote: (topicId: string, importance: string) => void;
  onRemove: (topicId: string) => void;
}

export default function TopicCard({ topic, onVote, onRemove }: Props) {
  const date = new Date(topic.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      {/* Author + date */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-500">
            {topic.author.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-semibold text-slate-600">{topic.author.name}</span>
        </div>
        <span className="text-[11px] text-slate-400">{date}</span>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-sm font-bold text-slate-800">{topic.title}</h3>

      {/* Content (HTML from lexical) */}
      <div
        className="prose prose-sm mb-4 max-w-none text-slate-600 line-clamp-4
          prose-headings:text-slate-700 prose-headings:font-semibold"
        dangerouslySetInnerHTML={{ __html: topic.content }}
      />

      {/* Votes */}
      <VoteButtons
        topicId={topic.id}
        votes={topic.votes}
        userVote={topic.userVote}
        onVote={onVote}
        onRemove={onRemove}
      />
    </div>
  );
}