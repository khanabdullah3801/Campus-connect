"use client";

import { useState, useRef, useEffect } from "react";
import { sendMessage, markMessagesAsRead } from "@/app/actions/chatActions";

export function ChatRoom({ otherUser, currentUserId, initialMessages }: any) {
  const [messages, setMessages] = useState(initialMessages);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // Mark as read when messages change (new message received)
    markMessagesAsRead(otherUser.id);
  }, [messages, otherUser.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const tempId = Date.now().toString();
    const newMsg = {
      id: tempId,
      content: content.trim(),
      senderId: currentUserId,
      timestamp: new Date(),
    };

    setMessages([...messages, newMsg]);
    setContent("");

    try {
      await sendMessage(otherUser.id, newMsg.content);
    } catch (error) {
      console.error(error);
      alert("Failed to send message");
      // Remove the temp message if it failed
      setMessages((prev: any) => prev.filter((m: any) => m.id !== tempId));
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto bg-white dark:bg-slate-900 shadow-xl border-x border-gray-100 dark:border-slate-800 overflow-hidden relative">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold mr-4 shadow-sm">
          {otherUser.name.charAt(0)}
        </div>
        <div>
          <h2 className="font-bold text-gray-900 dark:text-white leading-tight">{otherUser.name}</h2>
          <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">{otherUser.department || "GIKI Student"}</p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30 dark:bg-slate-950/30">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 select-none">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm font-medium">Start a conversation with {otherUser.name.split(' ')[0]}</p>
          </div>
        ) : (
          messages.map((msg: any) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.senderId === currentUserId
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 border border-gray-100 dark:border-slate-700 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form onSubmit={handleSend} className="flex gap-4">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-5 py-3.5 rounded-xl border-gray-200 dark:border-slate-700 focus:border-green-500 focus:ring-green-500 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white transition-all font-medium placeholder:text-gray-400 dark:placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-green-200 transition-all active:scale-95"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
