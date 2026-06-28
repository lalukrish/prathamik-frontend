// study-groups/_components/VoteButtons.tsx
"use client";

interface VoteCounts {
  IMPORTANT: number;
  MEDIUM_IMPORTANT: number;
  LESS_IMPORTANT: number;
}

interface Props {
  topicId: string;
  votes: VoteCounts;
  userVote: string | null;
  onVote: (topicId: string, importance: string) => void;
  onRemove: (topicId: string) => void;
}

const voteOptions = [
  {
    key: "IMPORTANT",
    emoji: "🔥",
    label: "Important",
    active: "bg-rose-500 text-white",
    inactive: "bg-rose-50 text-rose-500 hover:bg-rose-100",
  },
  {
    key: "MEDIUM_IMPORTANT",
    emoji: "📌",
    label: "Medium",
    active: "bg-amber-500 text-white",
    inactive: "bg-amber-50 text-amber-500 hover:bg-amber-100",
  },
  {
    key: "LESS_IMPORTANT",
    emoji: "📎",
    label: "Less",
    active: "bg-slate-500 text-white",
    inactive: "bg-slate-100 text-slate-500 hover:bg-slate-200",
  },
];

export default function VoteButtons({ topicId, votes, userVote, onVote, onRemove }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {voteOptions.map((opt) => {
        const isActive = userVote === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => isActive ? onRemove(topicId) : onVote(topicId, opt.key)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              isActive ? opt.active : opt.inactive
            }`}
          >
            <span>{opt.emoji}</span>
            <span>{opt.label}</span>
            <span className="font-bold">{votes[opt.key as keyof VoteCounts]}</span>
          </button>
        );
      })}
    </div>
  );
}