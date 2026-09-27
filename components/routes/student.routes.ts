import { ISidebarGroup } from "@/lib/type";
import { LayoutDashboard } from "lucide-react";

const prefix = "/student-dashboard";

export const studentRoutes: ISidebarGroup[] = [
  {
    title: "Student Management",
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
    title: "Management",
    items: [
      {
        label: "Overview",
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
