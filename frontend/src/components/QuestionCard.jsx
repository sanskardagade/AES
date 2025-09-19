import React from "react";

export default function QuestionCard({ question, onAnswer }) {
  if (question.type === "mcq_single") {
    return (
      <div className="p-4 rounded shadow bg-white">
        <h2 className="font-semibold mb-2">{question.statement}</h2>
        {question.options.map((opt) => (
          <label key={opt.id} className="block">
            <input
              type="radio"
              name={question.id}
              value={opt.id}
              onChange={() => onAnswer(question.id, opt.id)}
            />{" "}
            {opt.text}
          </label>
        ))}
      </div>
    );
  }
  if (question.type === "mcq_multi") {
    return (
      <div className="p-4 rounded shadow bg-white">
        <h2 className="font-semibold mb-2">{question.statement}</h2>
        {question.options.map((opt) => (
          <label key={opt.id} className="block">
            <input
              type="checkbox"
              value={opt.id}
              onChange={(e) =>
                onAnswer(question.id, opt.id, e.target.checked)
              }
            />{" "}
            {opt.text}
          </label>
        ))}
      </div>
    );
  }
  return <p>Unsupported question type</p>;
}
