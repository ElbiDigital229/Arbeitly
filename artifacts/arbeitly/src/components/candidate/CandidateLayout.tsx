import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CandidateSidebar } from "@/components/candidate/CandidateSidebar";
import { Bell, Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const fullBleedRoutes = ["/candidate/portal"];

const pageTitles: Record<string, string> = {
  "/candidate/portal": "Board",
  "/candidate/applications": "Applications",
  "/candidate/documents": "Documents",
  "/candidate/upload": "Upload CV",
  "/candidate/analytics": "Analytics",
  "/candidate/settings": "Settings",
};

const CandidatePortalLayout = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Portal";
  const isFullBleed = fullBleedRoutes.includes(location.pathname);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <CandidateSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center justify-between border-b border-border bg-card px-3 shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm font-semibold text-foreground font-display">{title}</span>
            </div>

            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search..." className="h-8 pl-8 text-xs bg-secondary border-none" />
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bell className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Avatar className="h-7 w-7 ml-1">
                <AvatarFallback className="text-[10px] bg-primary text-primary-foreground font-bold">
                  AS
                </AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className={`flex-1 overflow-auto bg-background ${isFullBleed ? "" : "p-6"}`}>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CandidatePortalLayout;
