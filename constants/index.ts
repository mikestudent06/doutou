export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || "Task Manager",
  version: import.meta.env.VITE_APP_VERSION || "1.0.0",
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
} as const;

export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY_OTP: "/auth/verify-otp",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  DASHBOARD: {
    HOME: "/dashboard",
    TASKS: "/dashboard/tasks",
    CATEGORIES: "/dashboard/categories",
    PROFILE: "/dashboard/profile",
    SETTINGS: "/dashboard/settings",
  },
} as const;

export const TASK_PRIORITIES = {
  LOW: { label: "Low", color: "bg-gray-100 text-gray-800" },
  MEDIUM: { label: "Medium", color: "bg-blue-100 text-blue-800" },
  HIGH: { label: "High", color: "bg-orange-100 text-orange-800" },
  URGENT: { label: "Urgent", color: "bg-red-100 text-red-800" },
} as const;

export const TASK_STATUSES = {
  TODO: { label: "To Do", color: "bg-gray-100 text-gray-800" },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-100 text-blue-800" },
  DONE: { label: "Done", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800" },
} as const;
