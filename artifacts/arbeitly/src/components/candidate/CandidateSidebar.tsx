import {
  Columns3,
  Briefcase,
  FileText,
  Upload,
  BarChart3,
  Settings,
  LogOut,
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

const navItems = [
  { title: "Board", url: "/candidate/portal", icon: Columns3 },
  { title: "Applications", url: "/candidate/applications", icon: Briefcase },
  { title: "Documents", url: "/candidate/documents", icon: FileText },
  { title: "Upload CV", url: "/candidate/upload", icon: Upload },
  { title: "Analytics", url: "/candidate/analytics", icon: BarChart3 },
];

export function CandidateSidebar() {
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
              Candidate
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider">Job Search</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
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
            <SidebarMenuButton asChild isActive={isActive("/candidate/settings")}>
              <NavLink to="/candidate/settings" end>
                <Settings className="h-4 w-4" />
                {!collapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/candidate/login">
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
