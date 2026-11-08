// Server Component.
// Before: the whole sidebar was a Client Component, so the route tables and
// lucide icons for *all three* roles (admin, student, instructor) were shipped
// to the browser, and the static header/footer were hydrated for nothing.
// Now the role is resolved on the server, only that role's menu is sent (with
// icons pre-rendered as HTML), and only the active-link logic runs on the client.
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ISidebarGroup, NavbarProps } from "@/lib/type";
import { GraduationCap } from "lucide-react";
import { adminRoutes, instructorRoutes, studentRoutes } from "../routes";
import DashboardSidebarNav, {
  SidebarHomeLink,
  type SidebarNavGroupData,
} from "./DashboardSidebarNav";

const routesForRole = (role?: string): ISidebarGroup[] => {
  if (role === "ADMIN" || role === "SUPER_ADMIN") return adminRoutes;
  if (role === "STUDENT") return studentRoutes;
  if (role === "INSTRUCTOR") return instructorRoutes;
  return [];
};

const homePathForRole = (role?: string) =>
  role === "STUDENT"
    ? "/student-dashboard"
    : role === "INSTRUCTOR"
      ? "/instructor-dashboard"
      : "/admin-dashboard";

export default function DashboardSidebar({ user }: NavbarProps) {
  const role = user?.data?.role;

  const groups: SidebarNavGroupData[] = routesForRole(role).map((group) => ({
    title: group.title,
    items: group.items.map(({ href, label, icon: Icon }) => ({
      href,
      label,
      icon: <Icon className="size-4" />,
    })),
  }));

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border ">
      {/* Sidebar Header */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <SidebarHomeLink className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-sidebar-accent">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap size={24} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-bold text-sidebar-foreground">
              Apex University
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {role ? `${role} Dashboard` : "Dashboard"}
            </p>
          </div>
        </SidebarHomeLink>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="min-h-0 overflow-y-auto">
        <DashboardSidebarNav groups={groups} homePath={homePathForRole(role)} />
      </SidebarContent>

      {/* Sidebar Footer (static user info, rendered on the server) */}
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="rounded-xl bg-sidebar-accent p-3">
          <p className="truncate text-sm font-semibold text-sidebar-foreground">
            {user?.data?.name || "User"}
          </p>

          <p className="mt-1 truncate text-xs text-muted-foreground">
            {user?.data?.email || ""}
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
