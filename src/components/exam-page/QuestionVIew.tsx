// "use client";

// import { Question, Option } from "../types";

// interface QuestionViewProps {
//   question: Question;
//   questionNumber: number;
//   totalQuestions: number;
//   selectedOptionId?: string;
//   onSelectOption: (optionId: string) => void;
// }

// const OPTION_LABELS = ["A", "B", "C", "D", "E"];

// export default function QuestionView({
//   question,
//   questionNumber,
//   totalQuestions,
//   selectedOptionId,
//   onSelectOption,
// }: QuestionViewProps) {
//   return (
//     <div className="flex flex-col gap-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
//           Question {questionNumber} of {totalQuestions}
//         </span>
//         {question.subject && (
//           <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-500">
//             {question.subject}
//           </span>
//         )}
//       </div>

//       {/* Question text */}
//       <div className="rounded-xl bg-slate-50 p-5">
//         <p className="text-[15px] leading-relaxed text-slate-800">
//           <span className="mr-2 font-semibold text-slate-400">Q{questionNumber}.</span>
//           {question.question}
//         </p>
//       </div>

//       {/* Options */}
//       <div className="flex flex-col gap-2.5">
//         {question.options.map((option: Option, index: number) => {
//           const isSelected = selectedOptionId === option.id;
//           return (
//             <button
//               key={option.id}
//               onClick={() => onSelectOption(option.id)}
//               className={`group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-150 ${
//                 isSelected
//                   ? "border-indigo-400 bg-indigo-50 shadow-sm"
//                   : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
//               }`}
//             >
//               <span
//                 className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
//                   isSelected
//                     ? "bg-indigo-500 text-white"
//                     : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
//                 }`}
//               >
//                 {OPTION_LABELS[index]}
//               </span>
//               <span
//                 className={`pt-0.5 text-sm leading-relaxed ${
//                   isSelected ? "font-medium text-indigo-800" : "text-slate-700"
//                 }`}
//               >
//                 {option.text}
//               </span>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

"use client";

export interface Option {
  id: string;
  text: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  question: string;
  subject?: Subject;
  subjectId?: string;
  type: string;
  marks: number;
  negativeMarks: number;
  difficulty: string;
  sortOrder: number;
  options: Option[];
}
interface QuestionViewProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
}

const OPTION_LABELS = ["A", "B", "C", "D", "E"];

export default function QuestionView({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  onSelectOption,
}: QuestionViewProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          Question {questionNumber} of {totalQuestions}
        </span>
        {question.subject?.name && (
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-500">
            {question.subject.name}
          </span>
        )}
      </div>

      {/* Question text */}
      <div className="rounded-xl bg-slate-50 p-5">
        <p className="text-[15px] leading-relaxed text-slate-800">
          <span className="mr-2 font-semibold text-slate-400">Q{questionNumber}.</span>
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {question.options.map((option: Option, index: number) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              className={`group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-150 ${
                isSelected
                  ? "border-indigo-400 bg-indigo-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  isSelected
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                }`}
              >
                {OPTION_LABELS[index]}
              </span>
              <span
                className={`pt-0.5 text-sm leading-relaxed ${
                  isSelected ? "font-medium text-indigo-800" : "text-slate-700"
                }`}
              >
                {option.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}