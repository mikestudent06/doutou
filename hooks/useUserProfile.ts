import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import toast from "react-hot-toast";

export const useUserProfile = () => {
  const queryClient = useQueryClient();

  // Get user stats
  const { data: userStats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: userService.getUserStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (data) => {
      // Update user data in auth query
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: userService.changePassword,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to change password");
    },
  });

  // Upload avatar mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: userService.uploadAvatar,
    onSuccess: (data) => {
      // Refresh user data to show new avatar
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to upload avatar");
    },
  });

  // Remove avatar mutation
  const removeAvatarMutation = useMutation({
    mutationFn: userService.removeAvatar,
    onSuccess: (data) => {
      // Refresh user data to remove avatar
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove avatar");
    },
  });

  return {
    // Data
    userStats,
    isStatsLoading,

    // Actions
    updateProfile: updateProfileMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    uploadAvatar: uploadAvatarMutation.mutate,
    removeAvatar: removeAvatarMutation.mutate,

    // Loading states
    isUpdatingProfile: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    isRemovingAvatar: removeAvatarMutation.isPending,
  };
};
