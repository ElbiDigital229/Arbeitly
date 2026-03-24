import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SuperAdminSidebar } from "@/components/superadmin/SuperAdminSidebar";

const SuperAdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("arbeitly_superadmin_auth") !== "true") {
      navigate("/superadmin/login");
    }
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SuperAdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border bg-card px-4">
            <SidebarTrigger className="mr-4" />
            <h2 className="font-display text-sm font-semibold text-foreground">Super Admin Panel</h2>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SuperAdminLayout;
