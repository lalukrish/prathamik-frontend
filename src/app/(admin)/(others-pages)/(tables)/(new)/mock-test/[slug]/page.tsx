"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { getQuestions } from "@/shared/questions";

export default function QuestionListPage() {
  const params = useParams();

  const mockTestId = params.slug as string;

  const [questions, setQuestions] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response =
        await getQuestions(mockTestId);

      setQuestions(response.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Questions
        </h1>

        <Link
          href={`/mock-test/${mockTestId}/add`}
          className="px-4 py-2 text-white bg-blue-600 rounded"
        >
          Add Question
        </Link>
      </div>

      <div className="space-y-4">
        {questions.map(
          (question, index) => (
            <div
              key={question.id}
              className="p-4 border rounded"
            >
              <h3 className="font-semibold">
                {index + 1}.{" "}
                {question.question}
              </h3>

              <div className="mt-3 space-y-2">
                {question.options.map(
                  (option: any) => (
                    <div
                      key={option.id}
                    >
                      {option.text}
                      {option.isCorrect && (
                        <span className="ml-2 text-green-600">
                          ✓
                        </span>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}