import React, { useState } from "react";
import { CheckCircle, Circle, CheckSquare, Square } from "lucide-react";

export default function QuestionCard({ question, onAnswer }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSingleSelect = (optionId) => {
    onAnswer(question.id, optionId);
  };

  const handleMultiSelect = (optionId, checked) => {
    onAnswer(question.id, optionId, checked);
  };

  if (question.type === "mcq_single") {
    return (
      <div className="p-6 rounded-xl bg-white border border-[#b0cece] shadow-sm">
        <h2 className="font-semibold text-[#0c2543] mb-4 text-lg">{question.statement}</h2>
        <div className="space-y-3">
          {question.options.map((opt) => (
            <div
              key={opt.id}
              className="flex items-center p-3 rounded-lg border border-[#b0cece] hover:border-[#0e6994] transition cursor-pointer"
              onClick={() => handleSingleSelect(opt.id)}
            >
              <div className="flex items-center justify-center mr-3">
                <Circle className="w-5 h-5 text-[#b0cece]" />
                <CheckCircle className="w-5 h-5 text-[#0e6994] absolute opacity-0" />
              </div>
              <span className="text-[#0c2543]">{opt.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === "mcq_multi") {
    return (
      <div className="p-6 rounded-xl bg-white border border-[#b0cece] shadow-sm">
        <h2 className="font-semibold text-[#0c2543] mb-4 text-lg">{question.statement}</h2>
        <div className="space-y-3">
          {question.options.map((opt) => (
            <label key={opt.id} className="flex items-center p-3 rounded-lg border border-[#b0cece] hover:border-[#0e6994] transition cursor-pointer">
              <div className="flex items-center justify-center mr-3">
                <Square className="w-5 h-5 text-[#b0cece]" />
                <CheckSquare className="w-5 h-5 text-[#0e6994] absolute opacity-0" />
              </div>
              <input
                type="checkbox"
                className="hidden"
                value={opt.id}
                onChange={(e) => handleMultiSelect(opt.id, e.target.checked)}
              />
              <span className="text-[#0c2543]">{opt.text}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-white border border-[#b0cece]">
      <p className="text-[#0c2543]">Unsupported question type</p>
    </div>
  );
}