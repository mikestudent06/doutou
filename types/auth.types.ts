export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  isVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  message: string;
}

export interface VerifyOtpData {
  otp: string;
  email: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  resetToken: string;
  newPassword: string;
}
