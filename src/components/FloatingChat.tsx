"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getConversations, getMessages, sendMessage, markMessagesAsRead } from "@/app/actions/chatActions";
import { formatDistanceToNow } from "date-fns";

export function FloatingChat() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);           // fully hidden → restore pill
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Drag state ──────────────────────────────────────────────────────────────
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const hasDragged = useRef(false);
  const clickTargetIsHandle = useRef(false);
  const startPointer = useRef({ x: 0, y: 0 });
  const startPos = useRef({ right: 24, bottom: 24 });   // px from edges
  const [pos, setPos] = useState({ right: 24, bottom: 24 });

  // ── Fetch logic ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (session && isOpen && !activeConversation) fetchConversations();
  }, [session, isOpen, activeConversation]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try { setConversations(await getConversations()); } catch (err) { console.error(err); }
  };

  const fetchMessages = async () => {
    if (!activeConversation) return;
    try {
      const data = await getMessages(activeConversation.user.id);
      setMessages(data);
      await markMessagesAsRead(activeConversation.user.id);
      window.dispatchEvent(new CustomEvent("messages-read"));
    } catch (err) { console.error(err); }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !activeConversation) return;
    const tempMsg = { id: Date.now().toString(), content: content.trim(), senderId: (session?.user as any).id, timestamp: new Date() };
    setMessages((prev) => [...prev, tempMsg]);
    setContent("");
    try { await sendMessage(activeConversation.user.id, tempMsg.content); fetchMessages(); } catch (err) { console.error(err); }
  };

  // ── Drag handlers (pointer events work for both mouse & touch) ───────────────
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag on the button wrapper, not inside the chat panel
    if ((e.target as HTMLElement).closest("form,input,button:not([data-drag-handle])")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current = true;
    hasDragged.current = false;
    clickTargetIsHandle.current = !!(e.target as HTMLElement).closest("[data-drag-handle]");
    startPointer.current = { x: e.clientX, y: e.clientY };
    startPos.current = { ...pos };
  }, [pos]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - startPointer.current.x;
    const dy = e.clientY - startPointer.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasDragged.current = true;
    }
    const newRight = Math.max(8, Math.min(window.innerWidth - 72, startPos.current.right - dx));
    const newBottom = Math.max(8, Math.min(window.innerHeight - 72, startPos.current.bottom + dy));
    setPos({ right: newRight, bottom: newBottom });
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (!hasDragged.current && clickTargetIsHandle.current) {
      setIsOpen((prev) => !prev);
    }
  }, []);

  if (!session) return null;

  // ── Restore pill (hidden state) ──────────────────────────────────────────────
  if (hidden) {
    return (
      <button
        onClick={() => setHidden(false)}
        style={{ right: pos.right, bottom: pos.bottom }}
        className="fixed z-[60] flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-xs font-bold rounded-full shadow-2xl hover:bg-green-700 active:scale-95 transition-all"
        aria-label="Restore chat"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Chat
      </button>
    );
  }

  // ── Bottom offset: above the mobile nav bar on small screens ────────────────
  // The mobile nav is h-16 (64px). We add 8px extra gap → 72px.
  // On lg+ screens the mobile nav is hidden so we use the normal 24px.
  const mobileBottomOffset = pos.bottom === 24 ? undefined : pos.bottom;
  const bubbleStyle: React.CSSProperties = {
    right: pos.right,
    bottom: mobileBottomOffset ?? undefined,
  };

  return (
    <div
      ref={wrapperRef}
      className={`fixed z-[60] flex flex-col items-end ${
        // Default position: above mobile nav on small screens, normal on lg+
        pos.bottom === 24 ? "bottom-[88px] lg:bottom-6 right-6" : ""
        }`}
      style={pos.bottom !== 24 ? bubbleStyle : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* ── Chat panel ─────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 h-[500px] bg-card rounded-[32px] shadow-2xl border border-card-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-4 bg-green-600 text-white flex items-center justify-between shadow-lg">
            {activeConversation ? (
              <div className="flex items-center">
                <button onClick={() => setActiveConversation(null)} className="mr-2 hover:bg-white/20 p-1 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h4 className="font-bold text-sm leading-none">{activeConversation.user.name}</h4>
                  <p className="text-[10px] text-green-100 mt-1 uppercase tracking-widest font-black">Online</p>
                </div>
              </div>
            ) : (
              <h4 className="font-bold text-sm">Direct Messages</h4>
            )}

            <div className="flex items-center gap-1">
              {/* Hide button — collapses widget to restore pill */}
              <button
                onClick={() => { setIsOpen(false); setHidden(true); }}
                title="Hide chat"
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {/* Close (minimise to bubble) */}
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-background/50 custom-scrollbar">
            {activeConversation ? (
              <div className="p-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderId === (session?.user as any).id ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-xs shadow-sm ${msg.senderId === (session?.user as any).id
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-card text-foreground border border-card-border rounded-bl-none"
                      }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
                {conversations.length === 0 ? (
                  <div className="p-10 text-center opacity-40">
                    <p className="text-sm font-medium text-gray-500">No conversations yet</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.user.id}
                      onClick={() => setActiveConversation(conv)}
                      className="w-full p-4 flex items-center hover:bg-muted/10 transition-colors text-left group"
                    >
                      <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400 font-black text-sm mr-3 shadow-sm group-hover:scale-110 transition-transform">
                        {conv.user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-bold text-foreground truncate">{conv.user.name}</p>
                          <span className="text-[9px] text-muted uppercase font-bold">{formatDistanceToNow(new Date(conv.timestamp))}</span>
                        </div>
                        <p className="text-xs text-muted truncate mt-0.5">{conv.lastMessage}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {activeConversation && (
            <div className="p-4 border-t border-card-border bg-card">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type message..."
                  className="flex-1 px-4 py-2 text-xs rounded-xl border-card-border focus:border-green-500 focus:ring-green-500 bg-background text-foreground transition-all outline-none"
                />
                <button type="submit" className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-md active:scale-95">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ── Toggle bubble ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {/* Hide pill button (visible when bubble is showing but panel is closed) */}
        {!isOpen && (
          <button
            onClick={() => setHidden(true)}
            title="Hide chat bubble"
            className="p-1.5 rounded-full bg-white dark:bg-slate-800 shadow text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-gray-200 dark:border-slate-700"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <button
          data-drag-handle="true"
          className={`p-4 rounded-full shadow-2xl transition-all active:scale-90 flex items-center justify-center touch-none select-none ${isOpen ? "bg-white dark:bg-slate-800 text-gray-600 rotate-90" : "bg-green-600 text-white hover:bg-green-700"
            }`}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
