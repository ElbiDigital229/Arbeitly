import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { InternalSidebar } from "@/components/dashboard/InternalSidebar";

const InternalLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <InternalSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border bg-card px-4">
            <SidebarTrigger className="mr-4" />
            <h2 className="font-display text-sm font-semibold text-foreground">Internal Dashboard</h2>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default InternalLayout;
