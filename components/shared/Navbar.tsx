"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logout } from "@/app/(authGroup)/_actions/authActions";

import {
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  User,
  X,
} from "lucide-react";
import { NavbarProps } from "@/lib/type";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

// import { IUser } from "@/lib/type";

// University Navigation Links
const navItems = [
  {
    label: "About Us",
    href: "/about",
  },
  {
    label: "Academics",
    href: "/academics",
  },
  {
    label: "Admissions",
    href: "/admissions",
  },
  {
    label: "Research",
    href: "/research",
  },
  {
    label: "Campus Life",
    href: "/campus-life",
  },
];

type UserMenuAction = "dashboard" | "profile" | "logout";

type UserMenuItem = {
  label: string;
  icon: typeof LayoutDashboard;
  action: UserMenuAction;
};
// Generate menu items based on university user roles (STUDENT, FACULTY, ADMIN)
const getUserMenuItems = (role?: string): UserMenuItem[] => {
  const items: UserMenuItem[] = [
    {
      label: "Portal Dashboard",
      icon: LayoutDashboard,
      action: "dashboard",
    },
  ];

  if (role === "STUDENT" || role === "INSTRUCTOR") {
    items.push({
      label: "My Profile",
      icon: User,
      action: "profile",
    });
  }

  return items;
};

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const userMenuItems = getUserMenuItems(user?.data?.role);

  // Active Link Detection
  const activeNavHref = [...navItems]
    .sort(
      (firstItem, secondItem) => secondItem.href.length - firstItem.href.length,
    )
    .find((item) => {
      if (item.href === "/") {
        return pathname === "/";
      }
      return pathname === item.href || pathname.startsWith(`${item.href}/`);
    })?.href;

  const isActiveMenu = (href: string) => href === activeNavHref;

  // Search Handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileSearchOpen(false);
    }
  };

  // User Actions Handler
  const handleUserMenuAction = async (action: UserMenuAction) => {
    if (action === "logout") {
      await logout();

      toast.success("User Logged Out Successfully!");

      router.push("/login");
      router.refresh();
      return;
    }

    if (action === "dashboard") {
      const role = user?.data?.role;

      if (role === "STUDENT") {
        router.push("/student-dashboard");
      } else if (role === "INSTRUCTOR") {
        router.push("/instructor-dashboard");
      } else if (role === "ADMIN") {
        router.push("/admin-dashboard");
      } else if (role === "SUPER_ADMIN") {
        router.push("/admin-dashboard");
      } else {
        router.push("/dashboard");
      }
      return;
    }

    if (action === "profile") {
      const role = user?.data?.role;

      if (role === "STUDENT") {
        router.push("/student-dashboard/profile");
      } else if (role === "INSTRUCTOR") {
        router.push("/instructor-dashboard/profile");
      }

      return;
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur-md supports-backdrop-filter:bg-background/70">
      <nav aria-label="Main Navigation">
        <div className="page-container flex h-20 items-center justify-between gap-3">
          {/* Mobile Menu Button & University Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Nav Sheet */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Open navigation menu"
                      className="shrink-0"
                    >
                      <Menu className="h-6 w-6" />
                    </Button>
                  }
                />

                <SheetContent
                  side="left"
                  className="w-[300px] p-0 sm:w-[340px]"
                >
                  <SheetHeader className="border-b px-5 py-5 text-left">
                    <SheetTitle>
                      <Link href="/" aria-label="Apex University home">
                        <Logo />
                      </Link>
                    </SheetTitle>

                    <SheetDescription className="sr-only">
                      University Main Navigation Drawer
                    </SheetDescription>
                  </SheetHeader>

                  <div className="flex h-[calc(100vh-85px)] flex-col justify-between">
                    <div className="space-y-1 overflow-y-auto px-4 py-5">
                      {/* Search Bar inside Mobile Sheet */}
                      <form onSubmit={handleSearchSubmit} className="mb-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search courses, news..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 rounded-xl text-sm"
                          />
                        </div>
                      </form>

                      {navItems.map((item) => {
                        const isActive = isActiveMenu(item.href);

                        return (
                          <SheetClose key={item.href}>
                            <Link
                              href={item.href}
                              aria-current={isActive ? "page" : undefined}
                              className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                isActive
                                  ? "bg-primary/10 text-primary font-semibold"
                                  : "text-foreground/80 hover:bg-muted hover:text-foreground"
                              }`}
                            >
                              {item.label}
                            </Link>
                          </SheetClose>
                        );
                      })}
                    </div>

                    {/* Mobile Bottom User Status */}
                    {!user?.success ? (
                      <div className="space-y-2 border-t bg-muted/40 p-4">
                        <SheetClose>
                          <Button
                            render={<Link href="/login" />}
                            nativeButton={false}
                            className="w-full rounded-xl font-semibold"
                          >
                            Portal Login
                          </Button>
                        </SheetClose>
                        <SheetClose>
                          <Button
                            render={<Link href="/verify-student" />}
                            nativeButton={false}
                            variant="outline"
                            className="w-full rounded-xl font-semibold"
                          >
                            Verify Student
                          </Button>
                        </SheetClose>
                        <SheetClose>
                          <Button
                            render={<Link href="/verify-instructor" />}
                            nativeButton={false}
                            variant="outline"
                            className="w-full rounded-xl font-semibold"
                          >
                            Verify Instructor
                          </Button>
                        </SheetClose>

                        <SheetClose>
                          <Button
                            render={<Link href="/admissions" />}
                            nativeButton={false}
                            variant="outline"
                            className="w-full rounded-xl font-semibold"
                          >
                            Apply Now
                          </Button>
                        </SheetClose>
                      </div>
                    ) : (
                      <div className="border-t bg-muted/40 p-4">
                        <div className="mb-3 rounded-xl border bg-card p-3 shadow-sm">
                          <p className="truncate font-semibold text-foreground">
                            {user?.data?.name || "User"}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user?.data?.email || ""}
                          </p>
                          <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                            {user?.data?.role || "PORTAL USER"}
                          </span>
                        </div>

                        <div className="space-y-1">
                          {userMenuItems.map((item) => {
                            const Icon = item.icon;

                            return (
                              <SheetClose key={item.action}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUserMenuAction(item.action)
                                  }
                                  className="flex w-full items-center rounded-xl px-4 py-2.5 text-left text-sm font-medium text-foreground/80 transition hover:bg-card hover:text-primary"
                                >
                                  <Icon className="mr-3 h-4 w-4" />
                                  {item.label}
                                </button>
                              </SheetClose>
                            );
                          })}

                          <SheetClose>
                            <button
                              type="button"
                              onClick={() => handleUserMenuAction("logout")}
                              className="flex w-full items-center rounded-xl px-4 py-2.5 text-left text-sm font-medium text-destructive transition hover:bg-destructive/10"
                            >
                              <LogOut className="mr-3 h-4 w-4" />
                              Logout
                            </button>
                          </SheetClose>
                        </div>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* University Logo & Title */}
            <Link
              href="/"
              aria-label="Apex University home"
              className="text-foreground transition-opacity hover:opacity-90"
            >
              <Logo wordmarkClassName="hidden sm:block" />
            </Link>
          </div>

          {/* Center: Main Nav Links (Desktop) */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => {
              const isActive = isActiveMenu(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-foreground/75 hover:bg-muted hover:text-primary"
                  }`}
                >
                  {item.label}

                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-[21px] h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: search, theme, portal login */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search toggle (opens the full-width search bar below) */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Toggle Search"
              aria-expanded={isMobileSearchOpen}
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="size-10 rounded-full"
            >
              {isMobileSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>

            {/* Light / Dark / System theme */}
            <ThemeToggle />

            {/* Portal Login / User Menu */}
            {!user?.success ? (
              <div className="flex items-center gap-2">
                <Button
                  render={<Link href="/login" />}
                  nativeButton={false}
                  size="sm"
                  className="rounded-full px-5 font-semibold shadow-sm transition-all hover:shadow"
                >
                  Portal Login
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={(props, state) => (
                      <button
                        {...props}
                        type="button"
                        aria-label="Open verification menu"
                        className={`flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 transition hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                          state.open ? "ring-2 ring-primary" : ""
                        }`}
                      >
                        <User className="h-5 w-5 text-primary" />
                      </button>
                    )}
                  />
                  <DropdownMenuContent
                    align="end"
                    sideOffset={10}
                    className="w-52 rounded-xl p-2"
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>
                        Account verification
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      render={<Link href="/verify-student" />}
                      className="cursor-pointer rounded-lg"
                    >
                      <GraduationCap className="mr-2.5 h-4 w-4" />
                      Verify Student
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      render={<Link href="/verify-instructor" />}
                      className="cursor-pointer rounded-lg"
                    >
                      <User className="mr-2.5 h-4 w-4" />
                      Verify Instructor
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={(props, state) => (
                    <button
                      {...props}
                      type="button"
                      aria-label="Open user menu"
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 transition hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        state.open ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <User className="h-5 w-5 text-primary" />
                    </button>
                  )}
                ></DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  className="w-64 rounded-xl p-2"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="p-2">
                      <div className="space-y-1">
                        <p className="truncate font-semibold text-foreground">
                          {user?.data?.name || "User"}
                        </p>

                        <p className="truncate text-xs font-normal text-muted-foreground">
                          {user?.data?.email || ""}
                        </p>

                        <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                          {user?.data?.role || "STUDENT"}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  {userMenuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <DropdownMenuItem
                        key={item.action}
                        onClick={() => handleUserMenuAction(item.action)}
                        className="cursor-pointer rounded-lg px-3 py-2 font-medium"
                      >
                        <Icon className="mr-2.5 h-4 w-4 text-muted-foreground" />
                        {item.label}
                      </DropdownMenuItem>
                    );
                  })}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="cursor-pointer rounded-lg px-3 py-2 font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
                    onClick={() => handleUserMenuAction("logout")}
                  >
                    <LogOut className="mr-2.5 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Medium Screens Expandable Search Box */}
        {isMobileSearchOpen && (
          <div className="border-t bg-muted/40 p-3 animate-in fade-in-0 slide-in-from-top-1">
            <form onSubmit={handleSearchSubmit} className="mx-auto max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search programs, admissions, faculty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl pl-9 pr-4 text-sm"
                  autoFocus
                />
              </div>
            </form>
          </div>
        )}
      </nav>
    </header>
  );
}
