"use client";

import "regenerator-runtime/runtime";
import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isTopMode, setIsTopMode] = useState(false);
  const [isCopilotConnected, setIsCopilotConnected] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) {
    return (
      <main className="min-h-screen bg-white p-8">
        <h1 className="text-lg font-bold tracking-tight text-gray-900">
          Leobot
        </h1>
      </main>
    );
  }

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
        
        <div className="flex flex-row items-center gap-8">
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

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!isCopilotConnected) {
                  // Simulate connect
                  setIsCopilotConnected(true);
                }
              }}
              className={`text-sm font-semibold border-2 transition-all ${
                isCopilotConnected 
                  ? "border-green-500 text-green-700 bg-green-50" 
                  : "border-gray-200 text-gray-400 hover:bg-gray-50"
              }`}
            >
              Copilot: {isCopilotConnected ? "ACTIVE" : "CONNECT"}
            </Button>
            {isCopilotConnected && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCopilotConnected(false)}
                className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
              >
                Delete
              </Button>
            )}
          </div>
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
