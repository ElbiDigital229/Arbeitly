import {
  LayoutDashboard,
  FileText,
  Briefcase,
  BarChart3,
  Settings,
  LogOut,
  Upload,
  Users,
  Search,
  Shield,
  Wand2,
  PenTool,
  Columns3,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import logo from "@/assets/logo.png";

const customerItems = [
  { title: "Board", url: "/", icon: Columns3 },
  { title: "Applications", url: "/applications", icon: Briefcase },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "Upload CV", url: "/upload", icon: Upload },
  { title: "Cover Letter", url: "/cover-letter", icon: PenTool },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const internalItems = [
  { title: "Operations", url: "/internal", icon: LayoutDashboard },
  { title: "Candidates", url: "/internal/candidates", icon: Users },
  { title: "Job Discovery", url: "/internal/jobs", icon: Search },
];

const adminItems = [
  { title: "Admin", url: "/admin", icon: Shield },
  { title: "CV Prompts", url: "/admin/cv-prompts", icon: FileText },
  { title: "CL Prompts", url: "/admin/cl-prompts", icon: PenTool },
  { title: "AI Settings", url: "/admin/ai-settings", icon: Wand2 },
];

export function PortalSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border px-3 py-3">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Arbeitly" className="h-7" />
          {!collapsed && (
            <span className="font-display text-base font-bold text-sidebar-foreground">
              Portal
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider">Your Work</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {customerItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider">Internal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {internalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider">Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/settings")}>
              <NavLink to="/settings" end>
                <Settings className="h-4 w-4" />
                {!collapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/login">
                <LogOut className="h-4 w-4" />
                {!collapsed && <span>Log out</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
