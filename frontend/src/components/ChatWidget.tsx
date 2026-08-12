import {
  Loader2,
  MessageCircle,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";

import { DavidAvatarSafe, FallbackAvatar } from "@/components/DavidAvatar";
import { useChat } from "@/hooks/useChat";
import { useTheme } from "@/hooks/useTheme";
import { classNames } from "@/utils/format";

interface ChatWidgetProps {
  jobId?: number;
}

const SUGGESTED_QUESTIONS = [
  "Latest jobs available?",
  "How to apply online?",
  "Jobs for 12th pass?",
  "What is age relaxation?",
];

export function ChatWidget({ jobId }: ChatWidgetProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage, clearMessages } = useChat({ jobId });
  const { theme } = useTheme();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isDark = theme === "dark";
  const isTricolor = theme === "tricolor";

  // David is "talking" while the assistant is loading a response
  const isTalking = isLoading;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage(text);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  /* ── Theme tokens ────────────────────────────────────────────────── */
  const panelBg = isDark
    ? "bg-[#0d0e1a] border border-indigo-900/40"
    : isTricolor
    ? "bg-white border border-orange-200"
    : "bg-white border border-slate-200";

  const headerBg = isDark
    ? "bg-gradient-to-r from-[#1a1040] to-[#0d0e1a]"
    : isTricolor
    ? "bg-gradient-to-r from-orange-600 to-green-700"
    : "bg-gradient-to-r from-violet-700 to-indigo-700";

  const bubbleBg = isDark ? "bg-[#0f1020]" : "bg-slate-50";

  const assistantMsgBg = isDark
    ? "bg-indigo-950/60 text-slate-100 border border-indigo-900/30"
    : isTricolor
    ? "bg-orange-50 text-gray-800 border border-orange-100"
    : "bg-violet-50 text-slate-800 border border-violet-100";

  const userMsgBg = isDark
    ? "bg-violet-700/70 text-white"
    : isTricolor
    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
    : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white";

  const inputBg = isDark
    ? "bg-slate-800/80 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-indigo-500"
    : isTricolor
    ? "bg-white border-orange-200 text-gray-800 placeholder-gray-400 focus:border-orange-400"
    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-400";

  const fabBg = isDark
    ? "bg-gradient-to-br from-violet-600 to-indigo-800"
    : isTricolor
    ? "bg-gradient-to-br from-orange-500 to-green-600"
    : "bg-gradient-to-br from-violet-600 to-indigo-600";

  const sendBtnBg = isDark
    ? "bg-indigo-600 hover:bg-indigo-500"
    : isTricolor
    ? "bg-orange-500 hover:bg-orange-600"
    : "bg-violet-600 hover:bg-violet-700";

  return (
    <>
      {/* ── Talking animation keyframes ──────────────────────────────── */}
      <style>{`
        @keyframes david-talk {
          from { transform: scale(1) rotate(-1deg); }
          to   { transform: scale(1.06) rotate(1deg); }
        }
        @keyframes david-pulse-ring {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes chat-fab-ring {
          0%   { transform: scale(1);   opacity: 0.4; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes msg-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Chat Panel ──────────────────────────────────────────────── */}
      {open && (
        <div
          className={classNames(
            "fixed bottom-24 right-4 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl shadow-2xl sm:right-6 sm:w-[400px]",
            panelBg,
          )}
          style={{ height: "540px", maxHeight: "82vh" }}
          role="dialog"
          aria-label="David AI Assistant"
        >
          {/* ── Header ──────────────────────────────────────────────── */}
          <div className={classNames("flex items-center justify-between rounded-t-2xl px-4 py-3", headerBg)}>
            <div className="flex items-center gap-3">
              {/* David avatar in header — small 36px */}
              <div style={{ position: "relative" }}>
                <DavidAvatarSafe isTalking={isTalking} size={36} />
                {isTalking && (
                  <span style={{
                    position: "absolute", inset: 0, borderRadius: "50%",
                    background: "rgba(124,58,237,0.5)",
                    animation: "david-pulse-ring 0.8s ease-out infinite",
                  }} />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">David</p>
                <p className="text-[11px] text-white/60 leading-tight">
                  {isTalking ? "Thinking…" : "DeshKiSeva AI Assistant"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearMessages}
                  className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition"
                  aria-label="Clear chat"
                  title="Clear chat"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── Messages ────────────────────────────────────────────── */}
          <div className={classNames("flex-1 overflow-y-auto p-4", bubbleBg)}>
            {messages.length === 0 ? (
              /* Empty state — big David avatar */
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <div style={{ position: "relative" }}>
                  <DavidAvatarSafe isTalking={false} size={72} />
                </div>
                <div>
                  <p className={classNames("text-sm font-semibold", isDark ? "text-slate-200" : "text-slate-700")}>
                    Hi! I'm David 👋
                  </p>
                  <p className={classNames("mt-1 text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                    Ask me anything about govt jobs, eligibility, or how to apply
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => void sendMessage(q)}
                      className={classNames(
                        "rounded-full px-3 py-1.5 text-xs font-medium transition hover:scale-105 active:scale-95",
                        isDark
                          ? "bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800/60 border border-indigo-800/40"
                          : isTricolor
                          ? "bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200"
                          : "bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200",
                      )}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={classNames("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                    style={{ animation: "msg-in 0.25s ease-out" }}
                  >
                    {/* David avatar next to assistant messages */}
                    {msg.role === "assistant" && (
                      <div className="mr-2 mt-1 shrink-0">
                        <DavidAvatarSafe isTalking={false} size={26} />
                      </div>
                    )}
                    <div
                      className={classNames(
                        "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm",
                        msg.role === "user"
                          ? classNames("rounded-br-sm", userMsgBg)
                          : classNames("rounded-bl-sm", assistantMsgBg),
                      )}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-headings:my-1">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Talking indicator */}
                {isLoading && (
                  <div className="flex justify-start" style={{ animation: "msg-in 0.2s ease-out" }}>
                    <div className="mr-2 mt-1 shrink-0" style={{ position: "relative" }}>
                      <DavidAvatarSafe isTalking={true} size={26} />
                    </div>
                    <div className={classNames(
                      "flex items-center gap-2 rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm",
                      assistantMsgBg,
                    )}>
                      <span className="flex gap-1 items-center">
                        {[0, 0.15, 0.3].map((delay) => (
                          <span
                            key={delay}
                            style={{
                              width: 6, height: 6, borderRadius: "50%",
                              background: isDark ? "#818cf8" : "#7c3aed",
                              display: "inline-block",
                              animation: `bounce 0.7s ${delay}s ease-in-out infinite alternate`,
                            }}
                          />
                        ))}
                      </span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* ── Input ───────────────────────────────────────────────── */}
          <div className={classNames(
            "flex items-end gap-2 rounded-b-2xl border-t p-3",
            isDark ? "border-indigo-900/30 bg-[#0d0e1a]"
              : isTricolor ? "border-orange-100 bg-white"
              : "border-slate-100 bg-white",
          )}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask David anything…"
              rows={1}
              className={classNames(
                "flex-1 resize-none rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-violet-400/20",
                inputBg,
              )}
              style={{ maxHeight: "96px", overflowY: "auto" }}
              aria-label="Chat input"
            />
            <button
              type="button"
              onClick={() => void handleSend()}
              disabled={!input.trim() || isLoading}
              className={classNames(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white transition disabled:opacity-40",
                sendBtnBg,
              )}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Action Button — David face ──────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={classNames(
          "fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all hover:scale-110 active:scale-95 sm:right-6",
          open ? "bg-slate-700" : fabBg,
        )}
        aria-label={open ? "Close David assistant" : "Open David AI assistant"}
        style={{ overflow: "visible" }}
      >
        {open ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <>
            {/* David avatar as the FAB icon */}
            <DavidAvatarSafe isTalking={false} size={56} />
            {/* Pulse ring */}
            <span style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "rgba(124,58,237,0.35)",
              animation: "chat-fab-ring 2s ease-out infinite",
            }} />
          </>
        )}
      </button>

      {/* Bounce keyframe for typing dots */}
      <style>{`
        @keyframes bounce {
          from { transform: translateY(0); }
          to   { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}
