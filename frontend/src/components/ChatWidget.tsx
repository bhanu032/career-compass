import {
  Bot,
  Loader2,
  MessageCircle,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";

import { useChat } from "@/hooks/useChat";
import { useTheme } from "@/hooks/useTheme";
import { classNames } from "@/utils/format";

interface ChatWidgetProps {
  /** Optionally pre-load job context (pass from job detail page) */
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

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
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

  /* ── Theme-aware styles ─────────────────────────────────────────────── */
  const panelBg = isDark
    ? "bg-[#0d0e1a] border border-indigo-900/40"
    : isTricolor
    ? "bg-white border border-orange-200"
    : "bg-white border border-slate-200";

  const headerBg = isDark
    ? "bg-gradient-to-r from-violet-900/80 to-indigo-900/80"
    : isTricolor
    ? "bg-gradient-to-r from-orange-500 to-green-700"
    : "bg-gradient-to-r from-violet-600 to-indigo-600";

  const bubbleBg = isDark ? "bg-[#111827]" : "bg-slate-50";

  const assistantMsgBg = isDark
    ? "bg-indigo-900/30 text-slate-100"
    : isTricolor
    ? "bg-orange-50 text-gray-800"
    : "bg-violet-50 text-slate-800";

  const userMsgBg = isDark
    ? "bg-violet-700/70 text-white"
    : isTricolor
    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
    : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white";

  const inputBg = isDark
    ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-indigo-500"
    : isTricolor
    ? "bg-white border-orange-200 text-gray-800 placeholder-gray-400 focus:border-orange-400"
    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-400";

  const fabBg = isDark
    ? "bg-gradient-to-br from-violet-600 to-indigo-700 shadow-violet-900/50"
    : isTricolor
    ? "bg-gradient-to-br from-orange-500 to-green-600 shadow-orange-200"
    : "bg-gradient-to-br from-violet-600 to-indigo-600 shadow-violet-200";

  return (
    <>
      {/* ── Chat Panel ──────────────────────────────────────────────────── */}
      {open && (
        <div
          className={classNames(
            "fixed bottom-24 right-4 z-50 flex w-[340px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl shadow-2xl sm:right-6 sm:w-[380px]",
            panelBg,
          )}
          style={{ height: "520px", maxHeight: "80vh" }}
          role="dialog"
          aria-label="AI Assistant"
        >
          {/* Header */}
          <div className={classNames("flex items-center justify-between rounded-t-2xl px-4 py-3", headerBg)}>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">DeshKiSeva Assistant</p>
                <p className="text-xs text-white/70">Ask about jobs, eligibility &amp; more</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearMessages}
                  className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                  aria-label="Clear chat"
                  title="Clear chat"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={classNames("flex-1 overflow-y-auto p-4", bubbleBg)}>
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <div className={classNames("flex h-14 w-14 items-center justify-center rounded-2xl", isDark ? "bg-indigo-900/50" : "bg-violet-100")}>
                  <Bot className={classNames("h-7 w-7", isDark ? "text-indigo-300" : "text-violet-600")} />
                </div>
                <div>
                  <p className={classNames("text-sm font-medium", isDark ? "text-slate-200" : "text-slate-700")}>
                    How can I help you today?
                  </p>
                  <p className={classNames("mt-1 text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
                    Ask about jobs, eligibility, how to apply &amp; more
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => void sendMessage(q)}
                      className={classNames(
                        "rounded-full px-3 py-1.5 text-xs font-medium transition hover:scale-105",
                        isDark
                          ? "bg-indigo-900/60 text-indigo-300 hover:bg-indigo-800/60"
                          : isTricolor
                          ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                          : "bg-violet-50 text-violet-700 hover:bg-violet-100",
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
                  >
                    {msg.role === "assistant" && (
                      <div className={classNames("mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white", isDark ? "bg-indigo-600" : isTricolor ? "bg-orange-500" : "bg-violet-600")}>
                        <Bot className="h-3 w-3" />
                      </div>
                    )}
                    <div
                      className={classNames(
                        "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm",
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
                {isLoading && (
                  <div className="flex justify-start">
                    <div className={classNames("mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white", isDark ? "bg-indigo-600" : "bg-violet-600")}>
                      <Bot className="h-3 w-3" />
                    </div>
                    <div className={classNames("flex items-center gap-2 rounded-2xl rounded-bl-sm px-3.5 py-2.5", assistantMsgBg)}>
                      <Loader2 className="h-3.5 w-3.5 animate-spin opacity-70" />
                      <span className="text-xs opacity-70">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className={classNames("flex items-end gap-2 rounded-b-2xl border-t p-3", isDark ? "border-slate-800 bg-[#0d0e1a]" : isTricolor ? "border-orange-100 bg-white" : "border-slate-100 bg-white")}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              rows={1}
              className={classNames(
                "flex-1 resize-none rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-violet-400/30",
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
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition",
                isDark
                  ? "bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40"
                  : isTricolor
                  ? "bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-40"
                  : "bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40",
              )}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Action Button ───────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={classNames(
          "fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition hover:scale-110 active:scale-95 sm:right-6",
          fabBg,
        )}
        aria-label={open ? "Close assistant" : "Open AI assistant"}
      >
        {open ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6 text-white" />
            {/* Pulse ring */}
            <span className="absolute inset-0 animate-ping rounded-full bg-white/20" />
          </>
        )}
      </button>
    </>
  );
}
