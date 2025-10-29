import { api } from "@/lib/axios";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
  VerifyOtpData,
  ForgotPasswordData,
  ResetPasswordData,
} from "@/types/auth.types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  async register(
    credentials: RegisterCredentials
  ): Promise<{ message: string }> {
    const response = await api.post("/auth/register", credentials);
    return response.data;
  },

  async verifyOtp(data: VerifyOtpData): Promise<AuthResponse> {
    const response = await api.post("/auth/verify-otp", data);
    return response.data;
  },

  async resendOtp(email: string): Promise<{ message: string }> {
    const response = await api.post("/auth/resend-otp", { email });
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    const response = await api.post("/auth/forgot-password", data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get("/users/profile");
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};
