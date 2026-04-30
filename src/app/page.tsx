"use client";

import "regenerator-runtime/runtime";
import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isTopMode, setIsTopMode] = useState(false);
  const [deviceFlow, setDeviceFlow] = useState<{
    device_code: string;
    user_code: string;
    verification_uri: string;
    interval: number;
  } | null>(null);

  const utils = api.useUtils();
  const { data: authStatus } = api.auth.getGitHubStatus.useQuery(undefined, {
    enabled: mounted,
  });

  const startFlow = api.auth.startDeviceFlow.useMutation({
    onSuccess: (data) => setDeviceFlow(data),
  });

  const pollToken = api.auth.pollToken.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setDeviceFlow(null);
        utils.auth.getGitHubStatus.invalidate();
      }
    },
  });

  const deleteToken = api.auth.deleteGitHubToken.useMutation({
    onSuccess: () => utils.auth.getGitHubStatus.invalidate(),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Polling logic
  useEffect(() => {
    if (!deviceFlow) return;

    const intervalId = setInterval(() => {
      pollToken.mutate({ device_code: deviceFlow.device_code });
    }, deviceFlow.interval * 1000);

    return () => clearInterval(intervalId);
  }, [deviceFlow, pollToken]);

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

  const isCopilotConnected = !!authStatus?.isConnected;

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
              onClick={() => !isCopilotConnected && startFlow.mutate()}
              disabled={isCopilotConnected || startFlow.isPending}
              className={`text-sm font-semibold border-2 transition-all ${
                isCopilotConnected 
                  ? "border-green-500 text-green-700 bg-green-50 cursor-default" 
                  : "border-gray-200 text-gray-400 hover:bg-gray-50"
              }`}
            >
              Copilot: {isCopilotConnected ? "ACTIVE" : startFlow.isPending ? "CONNECTING..." : "CONNECT"}
            </Button>
            {isCopilotConnected && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteToken.mutate()}
                className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
              >
                Delete
              </Button>
            )}
          </div>
        </div>

        {deviceFlow && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg animate-in fade-in slide-in-from-top-2">
            <p className="text-sm font-medium mb-2">Login to GitHub:</p>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-gray-500">1. Go to <a href={deviceFlow.verification_uri} target="_blank" rel="noreferrer" className="text-blue-500 underline font-bold">{deviceFlow.verification_uri}</a></p>
              <p className="text-xs text-gray-500">2. Enter code: <span className="bg-white border px-2 py-1 rounded font-mono text-lg font-bold text-black">{deviceFlow.user_code}</span></p>
              <p className="text-[10px] text-gray-400 mt-2 animate-pulse italic">Waiting for authorization...</p>
            </div>
          </div>
        )}

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
