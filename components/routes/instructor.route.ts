import { ISidebarGroup } from "@/lib/type";
import { BookOpen, CalendarCheck, LayoutDashboard, UserRound } from "lucide-react";

const prefix = "/instructor-dashboard";

export const instructorRoutes: ISidebarGroup[] = [
  {
    title: "Instructor Dashboard",
    items: [
      {
        label: "Overview",
        href: `${prefix}`,
        icon: LayoutDashboard,
      },
      {
        label: "My Sections",
        href: `${prefix}/sections`,
        icon: BookOpen,
      },
    ],
  },
  {
    title: "Teaching",
    items: [
      {
        label: "Attendance",
        href: `${prefix}/attendance`,
        icon: CalendarCheck,
      },
      {
        label: "My Profile",
        href: `${prefix}/profile`,
        icon: UserRound,
      },
    ],
  },
];
