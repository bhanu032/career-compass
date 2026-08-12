import { useCallback, useRef, useState } from "react";

import type { ChatMessage } from "@/services/chatService";
import { chatService } from "@/services/chatService";

export interface UseChatOptions {
  jobId?: number;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export function useChat({ jobId }: UseChatOptions = {}): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMsg: ChatMessage = { role: "user", content: content.trim() };
      const next = [...messages, userMsg];
      setMessages(next);
      setIsLoading(true);
      setError(null);
      abortRef.current = false;

      try {
        const reply = await chatService.send(next, jobId);
        if (!abortRef.current) {
          setMessages([...next, { role: "assistant", content: reply }]);
        }
      } catch (err) {
        if (!abortRef.current) {
          const msg = err instanceof Error ? err.message : "Something went wrong";
          setError(msg);
          setMessages([
            ...next,
            { role: "assistant", content: `⚠️ ${msg}` },
          ]);
        }
      } finally {
        if (!abortRef.current) setIsLoading(false);
      }
    },
    [messages, isLoading, jobId],
  );

  const clearMessages = useCallback(() => {
    abortRef.current = true;
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}
