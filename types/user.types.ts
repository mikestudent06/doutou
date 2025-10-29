export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UserStats {
  accountAge: number;
  lastLogin: Date | null;
  isVerified: boolean;
}

export interface AvatarUploadResponse {
  avatarUrl: string;
  message: string;
}
