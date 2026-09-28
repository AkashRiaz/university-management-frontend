import { ISidebarGroup } from "@/lib/type";
import { LayoutDashboard, User, Users } from "lucide-react";

const prefix = "/admin-dashboard";

export const adminRoutes: ISidebarGroup[] = [
  {
    title: "Admin Management",
    items: [
      {
        label: "Overview",
        href: `${prefix}`,
        icon: LayoutDashboard,
      },
      {
        label: "Students",
        href: `${prefix}/students`,
        icon: Users,
      },
      {
        label: "Instructors",
        href: `${prefix}/instructors`,
        icon: User,
      },
    ],
  },
  {
    title: "App Settings",
    items: [
      {
        label: "Approval",
        href: `${prefix}`,
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "App Settings",
    items: [
      {
        label: "Approval",
        href: `${prefix}`,
        icon: LayoutDashboard,
      },
      {
        label: "Approval",
        href: `${prefix}`,
        icon: LayoutDashboard,
      },
    ],
  },
];
