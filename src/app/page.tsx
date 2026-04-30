"use client";

import "regenerator-runtime/runtime";
import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";

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
      <div className="flex flex-col items-start gap-8 max-w-2xl">
        <h1 className="text-lg font-bold tracking-tight text-gray-900">
          Leobot
        </h1>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="top-mode" 
            checked={isTopMode}
            onCheckedChange={setIsTopMode}
            className="data-[state=checked]:bg-green-500"
          />
          <Label 
            htmlFor="top-mode"
            className={`text-sm font-semibold transition-colors ${
              isTopMode ? "text-green-700" : "text-gray-400"
            }`}
          >
            Top Mode {isTopMode ? "Active" : "Inactive"}
          </Label>
        </div>

        {isTopMode && ( transcript || listening ) && (
          <div className="w-full animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-3">
              {listening ? "● Listening..." : "Paused"}
            </p>
            <div className="p-0 text-xl leading-relaxed text-gray-800 font-medium">
              {transcript || <span className="text-gray-200">...</span>}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
