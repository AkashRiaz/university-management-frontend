import { ISidebarGroup } from "@/lib/type";
import {
  BookOpen,
  BookOpenCheck,
  Building,
  Building2Icon,
  Calendar,
  CalendarRange,
  CalendarDays,
  BadgePercent,
  DoorOpen,
  GraduationCap,
  LayoutDashboard,
  ListTree,
  ClipboardList,
  User,
  Users,
  WalletCards,
  ReceiptText,
  ClipboardCheck,
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
        label: "Courses",
        href: `${prefix}/courses`,
        icon: BookOpenCheck,
      },
      {
        label: "Program Courses",
        href: `${prefix}/program-courses`,
        icon: ListTree,
      },
      {
        label: "Rooms",
        href: `${prefix}/rooms`,
        icon: DoorOpen,
      },
      {
        label: "Sections",
        href: `${prefix}/sections`,
        icon: ClipboardList,
      },
      {
        label: "Class Schedules",
        href: `${prefix}/class-schedules`,
        icon: CalendarDays,
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
      {
        label: "Grade Scales",
        href: `${prefix}/grade-scales`,
        icon: GraduationCap,
      },
      {
        label: "Fee Structures",
        href: `${prefix}/fee-structures`,
        icon: WalletCards,
      },
      {
        label: "Invoices",
        href: `${prefix}/invoices`,
        icon: ReceiptText,
      },
      {
        label: "Registrations",
        href: `${prefix}/registrations`,
        icon: ClipboardCheck,
      },
      {
        label: "Scholarships",
        href: `${prefix}/scholarships`,
        icon: BadgePercent,
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
