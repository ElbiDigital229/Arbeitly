import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { Bell, Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEmployees } from "@/context/EmployeesContext";

const fullBleedRoutes = ["/employee/portal", "/old-portal"];

const pageTitles: Record<string, string> = {
  "/employee/portal": "Board",
  "/employee/applications": "Applications",
  "/employee/documents": "Documents",
  "/employee/upload": "Upload CV",
  "/employee/cover-letter": "Cover Letter",
  "/employee/analytics": "Analytics",
  "/employee/settings": "Settings",
  "/employee/internal": "Operations",
  "/employee/internal/candidates": "My Candidates",
  "/employee/internal/jobs": "Job Discovery",
  "/employee/admin": "Admin Overview",
  "/employee/admin/cv-prompts": "CV Prompts",
  "/employee/admin/cl-prompts": "Cover Letter Prompts",
  "/employee/admin/ai-settings": "AI Settings",
  "/old-portal": "Board",
  "/old-portal/applications": "Applications",
  "/old-portal/documents": "Documents",
  "/old-portal/upload": "Upload CV",
  "/old-portal/cover-letter": "Cover Letter",
  "/old-portal/analytics": "Analytics",
  "/old-portal/settings": "Settings",
  "/old-portal/internal": "Operations",
  "/old-portal/internal/candidates": "Candidates",
  "/old-portal/internal/jobs": "Job Discovery",
  "/old-portal/admin": "Admin Overview",
  "/old-portal/admin/cv-prompts": "CV Prompts",
  "/old-portal/admin/cl-prompts": "Cover Letter Prompts",
  "/old-portal/admin/ai-settings": "AI Settings",
};

const PortalLayout = () => {
  const location = useLocation();
  const { currentEmployee } = useEmployees();
  const title =
    pageTitles[location.pathname] ||
    (location.pathname.startsWith("/employee/portal/candidates/") ? "Candidate Detail" : "Portal");
  const isFullBleed = fullBleedRoutes.includes(location.pathname);
  const initials = currentEmployee
    ? currentEmployee.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "EM";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <PortalSidebar />
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
                  {initials}
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

export default PortalLayout;
