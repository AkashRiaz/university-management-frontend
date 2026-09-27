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
  console.log("user in navbar", user);

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
      }else if (role === "SUPER_ADMIN") {
        router.push("/admin-dashboard");
      } else {
        router.push("/dashboard");
      }
      return;
    }

    if (action === "profile") {
      router.push("/profile");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <nav aria-label="Main Navigation">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
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
                      <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                          <GraduationCap size={24} />
                        </div>

                        <div>
                          <p className="text-lg font-extrabold tracking-tight text-primary">
                            Apex University
                          </p>
                          <p className="text-xs font-medium text-muted-foreground">
                            Excellence in Education
                          </p>
                        </div>
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
                                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
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
                      <div className="space-y-2 border-t p-4 bg-slate-50 dark:bg-slate-900">
                        <SheetClose>
                          <Button
                            render={<Link href="/login" />}
                            className="w-full rounded-xl font-semibold"
                          >
                            Portal Login
                          </Button>
                        </SheetClose>

                        <SheetClose>
                          <Button
                            render={<Link href="/admissions" />}
                            variant="outline"
                            className="w-full rounded-xl font-semibold"
                          >
                            Apply Now
                          </Button>
                        </SheetClose>
                      </div>
                    ) : (
                      <div className="border-t bg-slate-50 p-4 dark:bg-slate-900">
                        <div className="mb-3 rounded-xl border bg-white p-3 shadow-sm dark:bg-slate-800">
                          <p className="truncate font-semibold text-slate-900 dark:text-white">
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
                                  className="flex w-full items-center rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-white hover:text-primary dark:text-slate-200 dark:hover:bg-slate-800"
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
                              className="flex w-full items-center rounded-xl px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
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
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
                <GraduationCap size={26} />
              </div>

              <div className="hidden sm:block">
                <span className="block text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Apex University
                </span>
                <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  Est. 1924
                </p>
              </div>
            </Link>
          </div>

          {/* Center: Main Nav Links (Desktop) */}
          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = isActiveMenu(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-slate-700 hover:bg-slate-100 hover:text-primary dark:text-slate-300 dark:hover:bg-slate-800"
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

          {/* Right: Search Input & Portal Login Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Search Input */}
            <form onSubmit={handleSearchSubmit} className="hidden xl:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search site..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-44 rounded-full pl-9 pr-4 text-xs transition-all focus:w-60 focus:ring-1"
                />
              </div>
            </form>

            {/* Tablet / Small Screen Search Toggle Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Toggle Search"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="rounded-full xl:hidden"
            >
              {isMobileSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>

            {/* Portal Login / User Menu */}
            {!user?.success ? (
              <Button
                render={<Link href="/login" />}
                size="sm"
                className="rounded-full px-5 font-semibold shadow-sm transition-all hover:shadow"
              >
                Portal Login
              </Button>
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
                        <p className="truncate font-semibold text-slate-900 dark:text-white">
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
                    className="cursor-pointer rounded-lg px-3 py-2 font-medium text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/30"
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
          <div className="border-t p-3 xl:hidden bg-slate-50 dark:bg-slate-900">
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
