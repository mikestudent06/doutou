import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { tokenManager } from "@/lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/authStore";

export const useAuth = () => {
  const { setReceivedResetPwdLink } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Single source of truth for user data
  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Only fetch if we have a token
    enabled: tokenManager.hasToken(),
  });

  // Derived auth state
  const isAuthenticated = !!user && tokenManager.hasToken();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Store access token securely in memory
      tokenManager.setToken(data.access_token);

      // Trigger user data fetch by invalidating query
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      toast.success(data.message);
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/auth/verify-otp");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });

  // Verify OTP mutation
  const verifyOtpMutation = useMutation({
    mutationFn: authService.verifyOtp,
    onSuccess: (data) => {
      // Store access token securely in memory
      tokenManager.setToken(data.access_token);

      // Trigger user data fetch by invalidating query
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      toast.success(data.message || "Email verified successfully");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "OTP verification failed");
    },
  });

  // Resend OTP mutation
  const resendOtpMutation = useMutation({
    mutationFn: authService.resendOtp,
    onSuccess: (data) => {
      toast.success(data.message || "OTP sent successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (data) => {
      toast.success(data.message || "Reset link sent to your email");
      setReceivedResetPwdLink();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to send reset email"
      );
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully");
      navigate("/auth/login");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reset password");
    },
  });

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Always clear local state
      tokenManager.clearToken();
      queryClient.clear(); // Clear all React Query cache
      localStorage.clear();
      navigate("/auth/login");
      toast.success("Logged out successfully");
    }
  };

  return {
    // State (single source of truth from React Query)
    user,
    isAuthenticated,
    isLoading,

    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    verifyOtp: verifyOtpMutation.mutate,
    resendOtp: resendOtpMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    logout,

    // Loading states
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isVerifyOtpLoading: verifyOtpMutation.isPending,
    isResendOtpLoading: resendOtpMutation.isPending,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    isResetPasswordLoading: resetPasswordMutation.isPending,

    // Error states (optional, for more granular error handling)
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    verifyOtpError: verifyOtpMutation.error,
    resendOtpError: resendOtpMutation.error,
    forgotPasswordError: forgotPasswordMutation.error,
    resetPasswordError: resetPasswordMutation.error,
  };
};
