// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { useRouter } from "next/navigation";

// import Input from "@/components/form/input/InputField";
// import Label from "@/components/form/Label";
// import Button from "@/components/ui/button/Button";

// import { createQuestion } from "@/shared/questions";
// import { getSubjects } from "@/shared/subjects";

// interface Subject {
//   id: string;
//   name: string;
// }

// export default function AddQuestionPage() {
//   const params = useParams();
//   const router = useRouter();

//   const mockTestId = params.slug as string;

//   const [question, setQuestion] = useState("");
//   const [subjectId, setSubjectId] = useState("");
//   const [marks, setMarks] = useState("1");
//   const [negativeMarks, setNegativeMarks] = useState("0");
//   const [difficulty, setDifficulty] = useState("MEDIUM");
//   const [loading, setLoading] = useState(false);
//   const [subjects, setSubjects] = useState<Subject[]>([]);

//   const [options, setOptions] = useState([
//     { text: "", isCorrect: true },
//     { text: "", isCorrect: false },
//     { text: "", isCorrect: false },
//     { text: "", isCorrect: false },
//   ]);

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const res = await getSubjects();
//         setSubjects(res.data);
//       } catch (error) {
//         console.error("Failed to fetch subjects", error);
//       }
//     };

//     fetchSubjects();
//   }, []);

//   const handleOptionChange = (index: number, value: string) => {
//     const updated = [...options];
//     updated[index].text = value;
//     setOptions(updated);
//   };

//   const setCorrectAnswer = (index: number) => {
//     const updated = options.map((option, i) => ({
//       ...option,
//       isCorrect: i === index,
//     }));
//     setOptions(updated);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await createQuestion({
//         mockTestId,
//         subjectId,
//         question,
//         type: "MCQ",
//         marks: Number(marks),
//         negativeMarks: Number(negativeMarks),
//         difficulty,
//         options,
//       });

//       router.push(`/mock-test/${mockTestId}`);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to create question");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl p-6">
//       <h1 className="mb-6 text-2xl font-bold">Add Question</h1>

//       <form onSubmit={handleSubmit} className="space-y-5">
//         <div>
//           <Label>Question</Label>
//           <Input
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             placeholder="Enter Question"
//           />
//         </div>

//         <div>
//           <Label>Subject</Label>
//           <select
//             value={subjectId}
//             onChange={(e) => setSubjectId(e.target.value)}
//             className="w-full rounded-lg border p-3"
//           >
//             <option value="">Select Subject</option>
//             {subjects.map((subject) => (
//               <option key={subject.id} value={subject.id}>
//                 {subject.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <Label>Marks</Label>
//           <Input
//             type="number"
//             value={marks}
//             onChange={(e) => setMarks(e.target.value)}
//           />
//         </div>

//         <div>
//           <Label>Negative Marks</Label>
//           <Input
//             type="number"
//             step="0.25"
//             value={negativeMarks}
//             onChange={(e) => setNegativeMarks(e.target.value)}
//           />
//         </div>

//         <div>
//           <Label>Difficulty</Label>
//           <select
//             value={difficulty}
//             onChange={(e) => setDifficulty(e.target.value)}
//             className="w-full rounded-lg border p-3"
//           >
//             <option value="EASY">Easy</option>
//             <option value="MEDIUM">Medium</option>
//             <option value="HARD">Hard</option>
//           </select>
//         </div>

//         {options.map((option, index) => (
//           <div key={index}>
//             <Label>Option {index + 1}</Label>
//             <div className="flex items-center gap-3">
//               <Input
//                 value={option.text}
//                 onChange={(e) => handleOptionChange(index, e.target.value)}
//                 placeholder={`Option ${index + 1}`}
//               />
//               <input
//                 type="radio"
//                 checked={option.isCorrect}
//                 onChange={() => setCorrectAnswer(index)}
//               />
//             </div>
//           </div>
//         ))}

//         <Button disabled={loading} className="w-full">
//           {loading ? "Saving..." : "Save Question"}
//         </Button>
//       </form>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import JobEditor from "@/components/mock-test/question-description"; // ← your editor

import { createQuestion } from "@/shared/questions";
import { getSubjects } from "@/shared/subjects";

interface Subject {
  id: string;
  name: string;
}

export default function AddQuestionPage() {
  const params = useParams();
  const router = useRouter();

  const mockTestId = params.slug as string;

  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState(""); // ← new
  const [subjectId, setSubjectId] = useState("");
  const [marks, setMarks] = useState("1");
  const [negativeMarks, setNegativeMarks] = useState("0");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [options, setOptions] = useState([
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await getSubjects();
        setSubjects(res.data);
      } catch (error) {
        console.error("Failed to fetch subjects", error);
      }
    };
    fetchSubjects();
  }, []);

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index].text = value;
    setOptions(updated);
  };

  const setCorrectAnswer = (index: number) => {
    const updated = options.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));
    setOptions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createQuestion({
        mockTestId,
        subjectId,
        question,
        description, // ← pass to backend
        type: "MCQ",
        marks: Number(marks),
        negativeMarks: Number(negativeMarks),
        difficulty,
        options,
      });

      router.push(`/mock-test/${mockTestId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Add Question</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label>Question</Label>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter Question"
          />
        </div>

        <div>
          <Label>Subject</Label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full rounded-lg border p-3"
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Marks</Label>
          <Input
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
          />
        </div>

        <div>
          <Label>Negative Marks</Label>
          <Input
            type="number"
  step={0.25}
            value={negativeMarks}
            onChange={(e) => setNegativeMarks(e.target.value)}
          />
        </div>

        <div>
          <Label>Difficulty</Label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full rounded-lg border p-3"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        {options.map((option, index) => (
          <div key={index}>
            <Label>Option {index + 1}</Label>
            <div className="flex items-center gap-3">
              <Input
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
              <input
                type="radio"
                checked={option.isCorrect}
                onChange={() => setCorrectAnswer(index)}
              />
            </div>
          </div>
        ))}

        {/* ← Description editor */}
        <div>
          <Label>Answer Description</Label>
          <JobEditor value={description} onChange={setDescription} />
        </div>

        <Button disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Question"}
        </Button>
      </form>
    </div>
  );
}