"use client";

import "regenerator-runtime/runtime";
import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function Home() {
  const [isTopMode, setIsTopMode] = useState(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (isTopMode) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
      resetTranscript();
    }
  }, [isTopMode, resetTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <main className="min-h-screen bg-white text-black font-sans p-8">
        <p>Browser does not support speech recognition.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black font-sans p-8">
      <div className="flex flex-col items-start gap-6 max-w-2xl">
        <h1 className="text-lg font-bold tracking-tight text-gray-900">
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

        {isTopMode && (
          <div className="mt-8 w-full animate-in fade-in slide-in-from-top-4 duration-500">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
              {listening ? "● Listening..." : "Paused"}
            </p>
            <div className="min-h-[100px] p-4 rounded-xl bg-gray-50 border border-gray-100 text-lg leading-relaxed text-gray-700">
              {transcript || <span className="text-gray-300 italic">Start speaking...</span>}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
