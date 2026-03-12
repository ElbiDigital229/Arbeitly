import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Search,
  Settings,
  LogOut,
  Shield,
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

const mainItems = [
  { title: "Overview", url: "/internal", icon: LayoutDashboard },
  { title: "Candidates", url: "/internal/candidates", icon: Users },
  { title: "Jobs", url: "/internal/jobs", icon: Search },
  { title: "Applications", url: "/internal/applications", icon: Briefcase },
  { title: "Documents", url: "/internal/documents", icon: FileText },
];

const adminItems = [
  { title: "Admin Panel", url: "/admin", icon: Shield },
  { title: "Settings", url: "/internal/settings", icon: Settings },
];

export function InternalSidebar() {
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
              Arbeitly <span className="text-xs font-normal text-sidebar-foreground/50">Internal</span>
            </span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
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
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
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

      <SidebarFooter>
        <SidebarMenu>
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
