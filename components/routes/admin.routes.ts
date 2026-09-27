import { ISidebarGroup } from "@/lib/type";
import { LayoutDashboard } from "lucide-react";

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
        label: "Approval",
        href: `${prefix}/approval`,
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
