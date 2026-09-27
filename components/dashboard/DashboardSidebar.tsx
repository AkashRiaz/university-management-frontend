"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { ISidebarGroup, NavbarProps } from "@/lib/type";
import { Wrench } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminRoutes, instructorRoutes, studentRoutes } from "../routes";

export default function DashboardSidebar({ user }: NavbarProps) {
  const pathname = usePathname();

  const { isMobile, setOpenMobile } = useSidebar();

  let navItems: ISidebarGroup[] = [];

  if (user?.data?.role === "ADMIN") {
    navItems = adminRoutes;
  } else if (user?.data?.role === "SUPER_ADMIN") {
    navItems = adminRoutes;
  } else if (user?.data?.role === "STUDENT") {
    navItems = studentRoutes;
  } else if (user?.data?.role === "INSTRUCTOR") {
    navItems = instructorRoutes;
  }

  const dashboardHomePath =
    user?.data?.role === "STUDENT"
      ? "/student-dashboard"
      : user?.data?.role === "INSTRUCTOR"
        ? "/instructor-dashboard"
        : "/admin-dashboard";

  const isItemActive = (href: string) => {
    if (href === "#" || !href) return false;

    if (href === dashboardHomePath) {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleNavigation = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-sidebar-border "
    >
      {/* Sidebar Header */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link
          href="/"
          onClick={handleNavigation}
          className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-sidebar-accent"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wrench className="size-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-bold text-sidebar-foreground">
              My University
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {user?.data?.role ? `${user.data.role} Dashboard` : "Dashboard"}
            </p>
          </div>
        </Link>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="min-h-0 overflow-y-auto">
        {navItems.map((group) => (
          <SidebarGroup key={group.title}>
            {/* Group Title */}
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item, index) => {
                  const isActive = isItemActive(item.href);

                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={index} className="py-0.5">
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.label}
                        className="h-10 text-sm"
                      >
                        <Link
                          href={item.href}
                          onClick={handleNavigation}
                          className="flex items-center gap-3"
                        >
                          <Icon className="size-4" />

                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Sidebar Footer */}
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
