"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<{ role: string; content: string }[]>([]);

  const chatMutation = api.agent.chat.useMutation({
    onSuccess: (data) => {
      setChatLog((prev) => [...prev, { role: "assistant", content: data.reply }]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChatLog((prev) => [...prev, { role: "user", content: message }]);
    chatMutation.mutate({ message });
    setMessage("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Leobot <span className="text-[hsl(280,100%,70%)]">Chat</span>
        </h1>
        
        <div className="w-full max-w-2xl bg-white/10 rounded-xl p-6 flex flex-col gap-4">
          <div className="h-96 overflow-y-auto flex flex-col gap-2 p-2">
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-purple-600 self-end"
                    : "bg-white/20 self-start"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="bg-white/20 self-start p-3 rounded-lg animate-pulse">
                Thinking...
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Talk to your manager..."
              className="flex-1 bg-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={chatMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-bold disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
