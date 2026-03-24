import {
  Shield,
  LayoutDashboard,
  CreditCard,
  Users,
  UserRoundCog,
  Wand2,
  FileText,
  PenTool,
  LogOut,
  ClipboardList,
  ReceiptText,
  Search,
  Settings,
  User,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
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

const navGroups = [
  {
    label: "Platform",
    items: [
      { title: "Overview", url: "/superadmin", icon: LayoutDashboard },
      { title: "Transactions", url: "/superadmin/transactions", icon: ReceiptText },
    ],
  },
  {
    label: "Customers",
    items: [
      { title: "Candidates", url: "/superadmin/customers", icon: Users },
      { title: "Employees", url: "/superadmin/employees", icon: UserRoundCog },
      { title: "Pricing Plans", url: "/superadmin/plans", icon: CreditCard },
    ],
  },
  {
    label: "Configuration",
    items: [
      { title: "AI Config", url: "/superadmin/ai-config", icon: Wand2 },
      { title: "Scraper & Matching", url: "/superadmin/scraper", icon: Search },
      { title: "Onboarding Config", url: "/superadmin/onboarding", icon: ClipboardList },
    ],
  },
  {
    label: "Admin",
    items: [
      { title: "System Settings", url: "/superadmin/settings", icon: Settings },
      { title: "My Profile", url: "/superadmin/profile", icon: User },
    ],
  },
];

export function SuperAdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) =>
    path === "/superadmin"
      ? location.pathname === path
      : location.pathname.startsWith(path);

  const handleLogout = () => {
    localStorage.removeItem("arbeitly_superadmin_auth");
    navigate("/superadmin/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="flex items-center gap-2 px-4 py-4">
          <img src={logo} alt="Arbeitly" className="h-7 w-7" />
          {!collapsed && (
            <span className="font-display text-lg font-bold text-sidebar-foreground">
              Arbeitly{" "}
              <span className="text-xs font-normal text-sidebar-foreground/50">Super Admin</span>
            </span>
          )}
        </div>

        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && (
              <SidebarGroupLabel className="text-[10px] uppercase tracking-wider">{group.label}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink to={item.url} end={item.url === "/superadmin"}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
