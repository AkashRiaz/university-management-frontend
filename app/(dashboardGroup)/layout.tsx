import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardMainContent from "@/components/dashboard/DashboardMainContent";
import { getMe } from "@/service/getMe";

export const dynamic = "force-dynamic";

const DashboardGroupLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await getMe();

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-background">
      {/* <Navbar user={user} /> */}

      <TooltipProvider>
        <SidebarProvider className="min-h-0 flex-1">
          <DashboardSidebar user={user} />

          <SidebarInset className="min-h-0 min-w-0 flex-1 overflow-hidden">
            <div className="flex h-14 shrink-0 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur-md md:hidden">
              <SidebarTrigger className="-ml-1" />

              <div className="min-w-0 flex-1">
                <p className="font-heading text-sm font-semibold">Dashboard</p>

                <p className="text-xs text-muted-foreground">
                  Open navigation menu
                </p>
              </div>

              <ThemeToggle className="size-9" />
            </div>

            <DashboardMainContent>{children}</DashboardMainContent>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
};

export default DashboardGroupLayout;
