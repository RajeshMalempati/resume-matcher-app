import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const extractKeywords = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3);
};

const MatchResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.resumeText || !state?.jobDesc) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0F172A] text-white">
        <div className="bg-red-200 text-red-900 px-6 py-4 rounded shadow">
          Missing data. Please go back and try again.
        </div>
      </div>
    );
  }

  const resumeKeywords = extractKeywords(state.resumeText);
  const jdKeywords = extractKeywords(state.jobDesc);

  const jdSet = new Set(jdKeywords);
  const resumeSet = new Set(resumeKeywords);

  const matched = [...jdSet].filter((word) => resumeSet.has(word));
  const missing = [...jdSet].filter((word) => !resumeSet.has(word));
  const matchScore = Math.round((matched.length / jdSet.size) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B] text-white px-6 py-12">
      <div className="max-w-4xl mx-auto bg-[#1E293B] shadow-xl rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">📊 Match Results</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
          >
            🔁 Try Again
          </button>
        </div>

        <p className="text-lg mb-6">
          <span className="text-green-400 font-bold">✅ Match Score:</span>{" "}
          <span className="text-2xl font-extrabold">{matchScore}%</span>
        </p>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-green-300 mb-3">
            ✅ Matched Keywords:
          </h2>
          <div className="flex flex-wrap gap-2">
            {matched.map((word, i) => (
              <span
                key={i}
                className="bg-green-800 text-green-200 px-3 py-1 rounded-full text-sm"
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-red-300 mb-3">
            ❌ Missing Keywords from Resume:
          </h2>
          <div className="flex flex-wrap gap-2">
            {missing.map((word, i) => (
              <span
                key={i}
                className="bg-red-800 text-red-200 px-3 py-1 rounded-full text-sm"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchResults;
