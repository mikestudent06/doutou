
import type { NavItem, UserMenuAction } from "@/types/layout.types";

export const dashboardNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
  },
  {
    title: "Tasks",
    href: "/dashboard/tasks",
    icon: "tasks",
  },
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: "categories",
  },
];

export const getUserMenuActions = (logout: () => void): UserMenuAction[] => [
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: "user",
  },
  {
    label: "Logout",
    onClick: logout,
    icon: "logout",
    variant: "destructive",
  },
];
