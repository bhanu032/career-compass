import { apiClient } from "@/services/apiClient";
import type { ApiMessage, TokenPair, User } from "@/types";

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  state?: string;
  qualification?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<TokenPair> {
    const { data } = await apiClient.post<TokenPair>("/login", { email, password });
    return data;
  },

  async register(payload: RegisterPayload): Promise<TokenPair> {
    const { data } = await apiClient.post<TokenPair>("/register", payload);
    return data;
  },

  async forgotPassword(email: string): Promise<ApiMessage> {
    const { data } = await apiClient.post<ApiMessage>("/forgot-password", { email });
    return data;
  },

  async resetPassword(token: string, newPassword: string): Promise<ApiMessage> {
    const { data } = await apiClient.post<ApiMessage>("/reset-password", {
      token,
      new_password: newPassword,
    });
    return data;
  },

  async profile(): Promise<User> {
    const { data } = await apiClient.get<User>("/profile");
    return data;
  },

  async updateProfile(payload: Partial<Pick<User, "full_name" | "phone" | "state" | "qualification">>): Promise<User> {
    const { data } = await apiClient.put<User>("/profile", payload);
    return data;
  },
};
