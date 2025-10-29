import {
  LayoutDashboard,
  CheckSquare,
  Tags,
  User,
  LogOut,
} from "lucide-react";
import type { NavItem, UserMenuAction } from "@/types/layout.types";

export const dashboardNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: Tags,
  },
];

export const getUserMenuActions = (logout: () => void): UserMenuAction[] => [
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    label: "Logout",
    onClick: logout,
    icon: LogOut,
    variant: "destructive",
  },
];
