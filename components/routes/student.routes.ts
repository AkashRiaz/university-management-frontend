import { ISidebarGroup } from "@/lib/type";
import { ClipboardList, CreditCard, FileText, LayoutDashboard, UserRound } from "lucide-react";

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
        label: "Course Registration",
        href: `${prefix}/course-registration`,
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        label: "Registration Status",
        href: `${prefix}/registration-status`,
        icon: FileText,
      },
      {
        label: "Payment History",
        href: `${prefix}/payment-history`,
        icon: CreditCard,
      },
      {
        label: "My Profile",
        href: `${prefix}/profile`,
        icon: UserRound,
      },
    ],
  },
];
