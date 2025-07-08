// src/pages/Home.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

const Home = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const extractText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();

    if (file.name.endsWith(".pdf")) {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = "";

      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const content = await page.getTextContent();
        const strings = content.items.map((item) => item.str);
        text += strings.join(" ") + " ";
      }

      return text;
    } else if (file.name.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    }

    return "";
  };

  const handleMatch = async () => {
    if (!resumeFile || !jobDesc.trim()) {
      alert("Please upload resume and paste job description.");
      return;
    }

    try {
      const resumeText = await extractText(resumeFile);
      navigate("/match", {
        state: {
          resumeText,
          jobDesc,
        },
      });
    } catch (err) {
      alert("Error reading resume file.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center px-4 text-white">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          🚀 Unlock Your Dream Job with JobFitIQ
        </h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-300">
          Upload your resume and paste a job description to see how well they match. Our AI pinpoints skill gaps and helps tailor your application.
        </p>
      </div>

      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">🔍 JobFitIQ</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-300">
            Upload Resume (PDF/DOCX)
          </label>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-300">
            Paste Job Description
          </label>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2 h-32"
          />
        </div>

        <button
          onClick={handleMatch}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition transform hover:scale-105"
        >
          🚀 Match Now
        </button>
      </div>
    </div>
  );
};

export default Home;
