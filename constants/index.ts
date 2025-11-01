import ai from "@/assets/icons/ai.png";
import analysis from "@/assets/icons/analysis.png";
import arrowDown from "@/assets/icons/arrow-down.png";
import arrowRight from "@/assets/icons/arrow-right.png";
import bag from "@/assets/icons/bag.png";
import bonjour from "@/assets/icons/bonjour.png";
import calendar from "@/assets/icons/calendar.png";
import chat from "@/assets/icons/chat.png";
import check from "@/assets/icons/check.png";
import clock from "@/assets/icons/clock.png";
import dollar from "@/assets/icons/dollar.png";
import envelope from "@/assets/icons/envelope.png";
import home from "@/assets/icons/home.png";
import list from "@/assets/icons/list.png";
import liste from "@/assets/icons/liste.png";
import location from "@/assets/icons/location.png";
import logout from "@/assets/icons/logout.png";
import minus from "@/assets/icons/minus.png";
import overview from "@/assets/icons/overview.png";
import pencil from "@/assets/icons/pencil.png";
import person from "@/assets/icons/person.png";
import phone from "@/assets/icons/phone.png";
import plus from "@/assets/icons/plus.png";
import pomodoro from "@/assets/icons/pomodoro.png";
import search from "@/assets/icons/search.png";
import star from "@/assets/icons/star.png";
import trash from "@/assets/icons/trash.png";
import user from "@/assets/icons/user.png";
import logo from "@/assets/images/logo.png";
import type { Category } from "@/types/category.types";
import arrowBack from "../assets/icons/arrow-back.png";

export const images = {
  // images
  logo,

  // icons
  calendar,
  arrowBack,
  arrowDown,
  arrowRight,
  bag,
  check,
  clock,
  dollar,
  envelope,
  home,
  location,
  logout,
  minus,
  pencil,
  person,
  phone,
  plus,
  search,
  star,
  trash,
  user,
  liste,
  bonjour,
  chat,
  analysis,
  ai,
  overview,
  list,
  pomodoro,
};

export const APP_CONFIG = {
  name: process.env.EXPO_PUBLIC_APP_NAME || "Task Manager",
  version: process.env.EXPO_PUBLIC_APP_VERSION || "1.0.0",
  apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
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

export const app_features = [
  {
    id: 1,
    title: "Création rapide de tâches",
    description: "Ajoutez tâches, sous-tâches et catégories en un clin d’œil.",
    icon: images.liste,
  },
  {
    id: 2,
    title: "Rappels intégrés",
    description: "Ne manquez plus rien grâce aux notifications.",
    icon: images.bonjour,
  },
  {
    id: 3,
    title: "Toud AI",
    description: "Assistant pour organiser et accélérer vos tâches.",
    icon: images.chat,
  },
  {
    id: 4,
    title: "Vue d’ensemble",
    description: "Vue d’ensemble de vos tâches, sous-tâches et catégories.",
    icon: images.analysis,
  },
];

export const categories: Category[] = [
  {
    id: "1",
    name: "Travail",
  },
  {
    id: "2",
    name: "Personnel",
  },
  {
    id: "3",
    name: "Études",
  },
  {
    id: "4",
    name: "Anniversaires",
  },
  {
    id: "5",
    name: "Voyages",
  },
  {
    id: "6",
    name: "Autres",
  },
];
