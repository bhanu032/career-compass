import { useCallback, useRef, useState } from "react";
import { generateRealtimeChatGPTResponse, type AIAction } from "@/services/chatAiEngine";
import { callRealtimeOpenAIChatGPT } from "@/services/openAiClient";
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
  apiKey: string;
  saveApiKey: (key: string) => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export function useChat({ jobId }: UseChatOptions = {}): UseChatReturn {
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem("openai_api_key") || "");
  const abortRef = useRef(false);

  const saveApiKey = useCallback((key: string) => {
    const trimmed = key.trim();
    setApiKey(trimmed);
    if (trimmed) {
      localStorage.setItem("openai_api_key", trimmed);
    } else {
      localStorage.removeItem("openai_api_key");
    }
  }, []);

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
        // Step 1: Real-Time Direct OpenAI ChatGPT API Call (if key present in state or env)
        const activeKey = apiKey || import.meta.env.VITE_OPENAI_API_KEY || "";
        if (activeKey) {
          try {
            const chatGptReply = await callRealtimeOpenAIChatGPT(next, activeKey);
            if (!abortRef.current) {
              setMessages([...next, { role: "assistant", content: chatGptReply }]);
              setIsLoading(false);
              return;
            }
          } catch (openAiErr) {
            console.warn("OpenAI API call error, trying backend fallback:", openAiErr);
          }
        }

        // Step 2: Try Backend FastAPI ChatGPT Endpoint
        try {
          const apiReply = await chatService.send(next, jobId);
          if (!abortRef.current) {
            setMessages([...next, { role: "assistant", content: apiReply }]);
            setIsLoading(false);
            return;
          }
        } catch {
          // Step 3: Smart Realtime Local ChatGPT AI Engine Fallback
          const aiResponse = generateRealtimeChatGPTResponse(content);

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
    [messages, isLoading, jobId, apiKey],
  );

  const clearMessages = useCallback(() => {
    abortRef.current = true;
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, error, apiKey, saveApiKey, sendMessage, clearMessages };
}
