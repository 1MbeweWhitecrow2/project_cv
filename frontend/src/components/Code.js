// src/components/Code.js
import React from "react";

const Code = () => {
  return (
    <section className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-20 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        GitHub Repositories
      </h1>
      <div className="flex flex-col items-center space-y-4">
        <a
          href="https://github.com/1MbeweWhitecrow2/project_cv" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline text-lg hover:text-blue-800"
        >
          Main Application Repository
        </a>
        <a
          href="https://github.com/1MbeweWhitecrow2/project_cv_additional_files" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline text-lg hover:text-blue-800"
        >
          Additional Files Repository
        </a>
      </div>
    </section>
  );
};

export default Code;
