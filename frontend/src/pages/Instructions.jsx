import React from "react";
import { Link, useParams } from "react-router-dom";

export default function Instructions() {
  const { attemptId } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Instructions</h1>
      <p className="mb-4">Read instructions carefully before starting.</p>
      <Link to={`/test/${attemptId}`} className="px-4 py-2 bg-green-600 text-white rounded">
        Start Test
      </Link>
    </div>
  );
}
