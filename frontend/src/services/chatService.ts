import { apiClient, extractErrorMessage } from "@/services/apiClient";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  reply: string;
}

export const chatService = {
  async send(messages: ChatMessage[], jobId?: number): Promise<string> {
    try {
      const { data } = await apiClient.post<ChatResponse>("/chat", {
        messages,
        job_id: jobId ?? null,
      });
      return data.reply;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Failed to get a response. Please try again."));
    }
  },
};
