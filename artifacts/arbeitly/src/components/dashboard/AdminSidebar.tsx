import {
  Shield,
  Wand2,
  FileText,
  PenTool,
  Settings,
  LogOut,
  LayoutDashboard,
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
  useSidebar,
} from "@/components/ui/sidebar";
import logo from "@/assets/logo.png";

const items = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "CV Prompts", url: "/admin/cv-prompts", icon: FileText },
  { title: "Cover Letter Prompts", url: "/admin/cl-prompts", icon: PenTool },
  { title: "AI Settings", url: "/admin/ai-settings", icon: Wand2 },
  { title: "System Config", url: "/admin/config", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="flex items-center gap-2 px-4 py-4">
          <img src={logo} alt="Arbeitly" className="h-7 w-7" />
          {!collapsed && (
            <span className="font-display text-lg font-bold text-sidebar-foreground">
              Arbeitly <span className="text-xs font-normal text-sidebar-foreground/50">Admin</span>
            </span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>
            <Shield className="h-3 w-3 mr-1" />
            Super Admin
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/internal">
                <LayoutDashboard className="h-4 w-4" />
                {!collapsed && <span>Back to Internal</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/login">
                <LogOut className="h-4 w-4" />
                {!collapsed && <span>Logout</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
