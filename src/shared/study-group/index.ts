// shared/study-group.ts
import api from "@/lib/axios";

export const getTopicsByCategory = (category: string, page = 1, limit = 10) =>
  api.get(`/study-groups/${category}?page=${page}&limit=${limit}`);

export const createTopic = (data: {
  category: string;
  title: string;
  content: string;
}) => api.post("/study-groups", data);

export const voteOnTopic = (topicId: string, importance: string) =>
  api.post(`/study-groups/${topicId}/vote`, { importance });

export const removeVote = (topicId: string) =>
  api.delete(`/study-groups/${topicId}/vote`);