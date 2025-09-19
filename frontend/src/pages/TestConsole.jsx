import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";

export default function TestConsole() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  // Mock data
  const [questions] = useState([
    { id: "q1", type: "mcq_single", statement: "2 + 2 = ?", options: [{id:"a",text:"3"},{id:"b",text:"4"}] },
    { id: "q2", type: "mcq_multi", statement: "Prime numbers?", options: [{id:"a",text:"2"},{id:"b",text:"4"},{id:"c",text:"5"}] }
  ]);

  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);

  const handleAnswer = (qid, ans, checked) => {
    setAnswers((prev) => {
      if (checked !== undefined) {
        const arr = new Set(prev[qid] || []);
        if (checked) arr.add(ans); else arr.delete(ans);
        return { ...prev, [qid]: Array.from(arr) };
      }
      return { ...prev, [qid]: ans };
    });
  };

  const submitTest = () => {
    console.log("Submitted answers:", answers);
    navigate(`/test/${attemptId}/results`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Test Console</h1>
        <Timer duration={300} onTimeUp={submitTest} />
      </div>
      <QuestionCard question={questions[index]} onAnswer={handleAnswer} />
      <div className="mt-4 flex justify-between">
        <button disabled={index===0} onClick={()=>setIndex(i=>i-1)} className="px-3 py-1 bg-gray-300 rounded">Prev</button>
        {index === questions.length-1 ? (
          <button onClick={submitTest} className="px-3 py-1 bg-green-600 text-white rounded">Submit</button>
        ) : (
          <button onClick={()=>setIndex(i=>i+1)} className="px-3 py-1 bg-blue-600 text-white rounded">Next</button>
        )}
      </div>
    </div>
  );
}
