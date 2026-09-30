import { ISidebarGroup } from "@/lib/type";
import {
  BookOpen,
  Building,
  Building2Icon,
  Calendar,
  CalendarRange,
  LayoutDashboard,
  User,
  Users,
} from "lucide-react";

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
      {
        label: "Departments",
        href: `${prefix}/departments`,
        icon: Building,
      },
      {
        label: "Programs",
        href: `${prefix}/programs`,
        icon: BookOpen,
      },
      {
        label: "Faculties",
        href: `${prefix}/faculties`,
        icon: Building2Icon,
      },
      {
        label: "Academic Years",
        href: `${prefix}/academic-years`,
        icon: Calendar,
      },
      {
        label: "Semesters",
        href: `${prefix}/semesters`,
        icon: CalendarRange,
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
