import { useCallback, useRef, useState } from "react";
import { generateRealtimeChatGPTResponse, type AIAction } from "@/services/chatAiEngine";
import { chatService, type ChatMessage } from "@/services/chatService";

export interface ExtendedChatMessage extends ChatMessage {
  actions?: AIAction[];
}

export interface UseChatOptions {
  jobId?: number;
}

export interface UseChatReturn {
  messages: ExtendedChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export function useChat({ jobId }: UseChatOptions = {}): UseChatReturn {
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMsg: ExtendedChatMessage = { role: "user", content: content.trim() };
      const next = [...messages, userMsg];
      setMessages(next);
      setIsLoading(true);
      setError(null);
      abortRef.current = false;

      try {
        // Step 1: Try backend ChatGPT API if connected
        try {
          const apiReply = await chatService.send(next, jobId);
          if (!abortRef.current) {
            setMessages([...next, { role: "assistant", content: apiReply }]);
            setIsLoading(false);
            return;
          }
        } catch {
          // Step 2: Smart Realtime ChatGPT Local AI Engine Fallback
          const aiResponse = generateRealtimeChatGPTResponse(content);

          // Simulated streaming delay for natural ChatGPT feel (180ms)
          setTimeout(() => {
            if (!abortRef.current) {
              setMessages([
                ...next,
                {
                  role: "assistant",
                  content: aiResponse.markdown,
                  actions: aiResponse.actions,
                },
              ]);
              setIsLoading(false);
            }
          }, 180);
        }
      } catch (err) {
        if (!abortRef.current) {
          const msg = err instanceof Error ? err.message : "Something went wrong";
          setError(msg);
          setMessages([
            ...next,
            { role: "assistant", content: `⚠️ ${msg}` },
          ]);
          setIsLoading(false);
        }
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
