"use client";

import { memo, useCallback, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export type SidebarNavItemData = {
  href: string;
  label: string;
  /** Icon element already rendered on the server, so no icon code ships to the browser. */
  icon: ReactNode;
};

export type SidebarNavGroupData = {
  title: string;
  items: SidebarNavItemData[];
};

const isItemActive = (pathname: string, href: string, homePath: string) => {
  if (href === "#" || !href) return false;
  if (href === homePath) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
};

/**
 * Closes the mobile sheet after a link is clicked. Shared by the nav items and
 * the (server-rendered) sidebar header link.
 */
export function useCloseSidebarOnNavigate() {
  const { isMobile, setOpenMobile } = useSidebar();
  return useCallback(() => {
    if (isMobile) setOpenMobile(false);
  }, [isMobile, setOpenMobile]);
}

/**
 * Memoized menu entry. On navigation only the entries whose `isActive` value
 * actually changes (the old and the new active link) re-render; before, every
 * entry of every group re-rendered on each route change.
 */
const SidebarNavItem = memo(function SidebarNavItem({
  href,
  label,
  icon,
  isActive,
  onNavigate,
}: SidebarNavItemData & { isActive: boolean; onNavigate: () => void }) {
  return (
    <SidebarMenuItem className="py-0.5">
      <SidebarMenuButton isActive={isActive} tooltip={label} className="h-10 text-sm">
        <Link href={href} onClick={onNavigate} className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});

export default function DashboardSidebarNav({
  groups,
  homePath,
}: {
  groups: SidebarNavGroupData[];
  homePath: string;
}) {
  const pathname = usePathname();
  const handleNavigate = useCloseSidebarOnNavigate();

  return groups.map((group) => (
    <SidebarGroup key={group.title}>
      <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item) => (
            <SidebarNavItem
              key={item.href}
              {...item}
              isActive={isItemActive(pathname, item.href, homePath)}
              onNavigate={handleNavigate}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
}

/** Client leaf used by the server-rendered sidebar header. */
export function SidebarHomeLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const handleNavigate = useCloseSidebarOnNavigate();
  return (
    <Link href="/" onClick={handleNavigate} className={className}>
      {children}
    </Link>
  );
}
