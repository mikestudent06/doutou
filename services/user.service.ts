import { api } from "@/lib/axios";
import type { User } from "@/types/auth.types";
import type {
  UpdateProfileData,
  ChangePasswordData,
  UserStats,
  AvatarUploadResponse,
} from "@/types/user.types";

export const userService = {
  async updateProfile(
    data: UpdateProfileData
  ): Promise<{ user: User; message: string }> {
    const response = await api.patch("/users/profile", data);
    return response.data;
  },

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await api.post("/users/change-password", data);
    return response.data;
  },

  async getUserStats(): Promise<UserStats> {
    const response = await api.get("/users/stats");
    return response.data;
  },

  async uploadAvatar(file: File): Promise<AvatarUploadResponse> {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post("/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async removeAvatar(): Promise<{ message: string }> {
    const response = await api.delete("/users/avatar");
    return response.data;
  },

  async deleteAccount(): Promise<{ message: string }> {
    const response = await api.delete("/users/account");
    return response.data;
  },
};
