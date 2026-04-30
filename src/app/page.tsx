"use client";

import { useState } from "react";

export default function Home() {
  const [isTopMode, setIsTopMode] = useState(false);

  return (
    <main className="min-h-screen bg-white text-black font-sans p-8">
      <div className="flex flex-col items-start gap-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Leobot
        </h1>
        
        <button
          onClick={() => setIsTopMode(!isTopMode)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 border-2 ${
            isTopMode 
              ? "border-green-500 bg-green-50 text-green-700" 
              : "border-gray-200 bg-gray-50 text-gray-400 hover:bg-gray-100"
          }`}
        >
          Top Mode: {isTopMode ? "ACTIVE" : "INACTIVE"}
        </button>
      </div>
    </main>
  );
}
