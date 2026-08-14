import { Send, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import { DavidAvatarSafe } from "@/components/DavidAvatar";
import { useChat } from "@/hooks/useChat";
import { useTheme } from "@/hooks/useTheme";
import { classNames } from "@/utils/format";

interface ChatWidgetProps {
  jobId?: number;
}

const SUGGESTED_QUESTIONS = [
  "Latest govt jobs available?",
  "Jobs for 12th pass students?",
  "How to apply for SSC CGL?",
  "Age relaxation for OBC/SC/ST?",
  "Railway jobs 2026 openings?",
  "Help me with my resume",
];

/** Small "GPT-4o" badge shown in the chat header */
function GptBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: 99,
        padding: "1px 7px",
        fontSize: 10,
        fontWeight: 600,
        color: "rgba(255,255,255,0.85)",
        letterSpacing: "0.02em",
        backdropFilter: "blur(4px)",
      }}
    >
      {/* OpenAI sparkle-style dot */}
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10a37f", display: "inline-block" }} />
      GPT-4o
    </span>
  );
}

export function ChatWidget({ jobId }: ChatWidgetProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage, clearMessages } = useChat({ jobId });
  const { theme } = useTheme();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isDark = theme === "dark";
  const isTricolor = theme === "tricolor";
  const isTalking = isLoading;

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  // Auto-resize textarea
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }, [input]);

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

  /* ── Theme tokens ─────────────────────────────────────────────── */
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

  const sendBtnBg = isDark
    ? "bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900"
    : isTricolor
      ? "bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300"
      : "bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300";

  const fabBg = isDark
    ? "bg-gradient-to-br from-violet-600 to-indigo-800"
    : isTricolor
      ? "bg-gradient-to-br from-orange-500 to-green-600"
      : "bg-gradient-to-br from-violet-600 to-indigo-600";

  const chipStyle = isDark
    ? "bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800/60 border border-indigo-800/40"
    : isTricolor
      ? "bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200"
      : "bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200";

  const footerBg = isDark
    ? "border-indigo-900/30 bg-[#0d0e1a]"
    : isTricolor
      ? "border-orange-100 bg-white"
      : "border-slate-100 bg-white";

  return (
    <>
      {/* ── Animation keyframes ──────────────────────────────────── */}
      <style>{`
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
        @keyframes dot-bounce {
          from { transform: translateY(0);    opacity: 0.5; }
          to   { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>

      {/* ── Chat Panel ──────────────────────────────────────────── */}
      {open && (
        <div
          className={classNames(
            "fixed bottom-24 right-4 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl shadow-2xl sm:right-6 sm:w-[400px]",
            panelBg,
          )}
          style={{ height: "560px", maxHeight: "84vh" }}
          role="dialog"
          aria-label="David AI Assistant"
        >
          {/* ── Header ────────────────────────────────────────────── */}
          <div
            className={classNames(
              "flex items-center justify-between rounded-t-2xl px-4 py-3",
              headerBg,
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Avatar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <DavidAvatarSafe isTalking={isTalking} size={36} />
                {isTalking && (
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      background: "rgba(124,58,237,0.5)",
                      animation: "david-pulse-ring 0.8s ease-out infinite",
                    }}
                  />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white leading-tight">David</p>
                  <GptBadge />
                </div>
                <p className="text-[11px] text-white/60 leading-tight truncate">
                  {isTalking ? "Thinking…" : "DeshKiSeva AI · Powered by ChatGPT"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearMessages}
                  className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition"
                  aria-label="Clear chat"
                  title="Clear conversation"
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

          {/* ── Messages ──────────────────────────────────────────── */}
          <div className={classNames("flex-1 overflow-y-auto p-4", bubbleBg)}>
            {messages.length === 0 ? (
              /* Empty state */
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center px-2">
                <DavidAvatarSafe isTalking={false} size={72} />
                <div>
                  <p
                    className={classNames(
                      "text-sm font-semibold",
                      isDark ? "text-slate-200" : "text-slate-700",
                    )}
                  >
                    Hi! I'm David 👋
                  </p>
                  <p
                    className={classNames(
                      "mt-1 text-xs",
                      isDark ? "text-slate-500" : "text-slate-400",
                    )}
                  >
                    Powered by ChatGPT — ask anything about govt jobs, eligibility, or how to apply
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
                        chipStyle,
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
                    className={classNames(
                      "flex",
                      msg.role === "user" ? "justify-end" : "justify-start",
                    )}
                    style={{ animation: "msg-in 0.25s ease-out" }}
                  >
                    {msg.role === "assistant" && (
                      <div className="mr-2 mt-1 shrink-0">
                        <DavidAvatarSafe isTalking={false} size={26} />
                      </div>
                    )}
                    <div
                      className={classNames(
                        "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm",
                        msg.role === "user"
                          ? classNames("rounded-br-sm", userMsgBg)
                          : classNames("rounded-bl-sm", assistantMsgBg),
                      )}
                    >
                      {msg.role === "assistant" ? (
                        <div>
                          <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-headings:my-1">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                          {msg.actions && msg.actions.length > 0 && (
                            <div className="mt-3 pt-2.5 border-t border-violet-200/50 dark:border-indigo-800/40 flex flex-wrap gap-1.5">
                              {msg.actions.map((act) => (
                                <Link
                                  key={act.url + act.label}
                                  to={act.url}
                                  onClick={() => setOpen(false)}
                                  className="inline-flex items-center gap-1 rounded-xl bg-violet-600 text-white px-2.5 py-1 text-xs font-bold shadow-sm hover:bg-violet-500 transition active:scale-95"
                                >
                                  {act.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                  <div
                    className="flex justify-start"
                    style={{ animation: "msg-in 0.2s ease-out" }}
                  >
                    <div className="mr-2 mt-1 shrink-0" style={{ position: "relative" }}>
                      <DavidAvatarSafe isTalking size={26} />
                    </div>
                    <div
                      className={classNames(
                        "flex items-center gap-1 rounded-2xl rounded-bl-sm px-4 py-3",
                        assistantMsgBg,
                      )}
                    >
                      {[0, 0.18, 0.36].map((delay) => (
                        <span
                          key={delay}
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: isDark ? "#818cf8" : "#7c3aed",
                            display: "inline-block",
                            animation: `dot-bounce 0.65s ${delay}s ease-in-out infinite alternate`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* ── Input footer ──────────────────────────────────────── */}
          <div
            className={classNames(
              "flex flex-col gap-1.5 rounded-b-2xl border-t px-3 py-2.5",
              footerBg,
            )}
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask David anything… (Enter to send)"
                rows={1}
                maxLength={2000}
                className={classNames(
                  "flex-1 resize-none rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-violet-400/20",
                  inputBg,
                )}
                style={{ minHeight: 40, maxHeight: 96, overflowY: "auto" }}
                aria-label="Chat input"
              />
              <button
                type="button"
                onClick={() => void handleSend()}
                disabled={!input.trim() || isLoading}
                className={classNames(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition disabled:opacity-40 disabled:cursor-not-allowed",
                  sendBtnBg,
                )}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            {/* Hint row */}
            <div className="flex items-center justify-between px-0.5">
              <span
                className={classNames(
                  "text-[10px]",
                  isDark ? "text-slate-600" : "text-slate-400",
                )}
              >
                Shift+Enter for new line
              </span>
              <span
                className={classNames(
                  "text-[10px] tabular-nums",
                  input.length > 1800
                    ? "text-red-400"
                    : isDark
                      ? "text-slate-600"
                      : "text-slate-400",
                )}
              >
                {input.length}/2000
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── FAB ────────────────────────────────────────────────── */}
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
            <DavidAvatarSafe isTalking={false} size={56} />
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "rgba(124,58,237,0.35)",
                animation: "chat-fab-ring 2s ease-out infinite",
              }}
            />
          </>
        )}
      </button>
    </>
  );
}
