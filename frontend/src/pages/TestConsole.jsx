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
    <div className="min-h-screen bg-[#b0cece] p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#0c2543]">Test Console</h1>
          <Timer duration={300} onTimeUp={submitTest} />
        </div>
        
        <div className="mb-4">
          <div className="w-full bg-[#b0cece] rounded-full h-2.5">
            <div 
              className="bg-[#0e6994] h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${((index + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-[#0e6994]">
              Question {index + 1} of {questions.length}
            </span>
          </div>
        </div>
        
        <QuestionCard question={questions[index]} onAnswer={handleAnswer} />
        
        <div className="mt-6 flex justify-between">
          <button 
            disabled={index===0} 
            onClick={()=>setIndex(i=>i-1)} 
            className="px-4 py-2 bg-[#b0cece] text-[#0c2543] rounded-lg hover:bg-[#0e6994] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {index === questions.length-1 ? (
            <button 
              onClick={submitTest} 
              className="px-4 py-2 bg-[#6c9d87] text-white rounded-lg hover:bg-[#0c2543] transition"
            >
              Submit Test
            </button>
          ) : (
            <button 
              onClick={()=>setIndex(i=>i+1)} 
              className="px-4 py-2 bg-[#0e6994] text-white rounded-lg hover:bg-[#0c2543] transition"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
}