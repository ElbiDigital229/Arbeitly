import {
  FileText,
  Briefcase,
  LogOut,
  User,
  ClipboardList,
  MessageSquare,
  ScrollText,
  ReceiptText,
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
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import logo from "@/assets/logo.png";
import { useCustomers } from "@/context/CustomersContext";
import { useEffect, useState } from "react";

export function CandidateSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentCustomer } = useCustomers();
  const isActive = (path: string) => location.pathname === path;
  const isPaid = currentCustomer?.planType === "paid";

  // Unread apps badge
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    if (!currentCustomer) return;
    try {
      const apps: { seenByCandidate?: boolean; addedById?: string }[] =
        JSON.parse(localStorage.getItem(`arbeitly_apps_${currentCustomer.id}`) || "[]");
      const lastOpened = currentCustomer.lastOpenedApplications
        ? new Date(currentCustomer.lastOpenedApplications).getTime()
        : 0;
      const unseen = apps.filter(
        (a) => a.addedById !== currentCustomer.id && a.seenByCandidate === false
      ).length;
      setUnreadCount(unseen);
    } catch { setUnreadCount(0); }
  }, [currentCustomer, location.pathname]);

  // FAQ pending badge (paid only)
  const [pendingFaq, setPendingFaq] = useState(0);
  useEffect(() => {
    if (!currentCustomer || !isPaid) return;
    try {
      const items: { status?: string }[] =
        JSON.parse(localStorage.getItem(`arbeitly_faq_${currentCustomer.id}`) || "[]");
      setPendingFaq(items.filter((f) => f.status === "pending").length);
    } catch { setPendingFaq(0); }
  }, [currentCustomer, isPaid, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/candidate/login");
  };

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
        {/* Main nav — always visible */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider">My Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Applications — first */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/candidate/applications")}>
                  <NavLink to="/candidate/applications" end>
                    <div className="relative">
                      <Briefcase className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground leading-none">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </div>
                    {!collapsed && (
                      <div className="flex items-center justify-between flex-1">
                        <span>Applications</span>
                        {unreadCount > 0 && (
                          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* CV */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/candidate/cv")}>
                  <NavLink to="/candidate/cv" end>
                    <ScrollText className="h-4 w-4" />
                    {!collapsed && <span>CV</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Files */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/candidate/files")}>
                  <NavLink to="/candidate/files" end>
                    <FileText className="h-4 w-4" />
                    {!collapsed && <span>Files</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* FAQ — paid only */}
              {isPaid && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/candidate/faq")}>
                    <NavLink to="/candidate/faq" end>
                      <div className="relative">
                        <MessageSquare className="h-4 w-4" />
                        {pendingFaq > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-yellow-400 text-[9px] font-bold text-black leading-none">
                            {pendingFaq > 9 ? "9+" : pendingFaq}
                          </span>
                        )}
                      </div>
                      {!collapsed && (
                        <div className="flex items-center justify-between flex-1">
                          <span>FAQ</span>
                          {pendingFaq > 0 && (
                            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-yellow-400 px-1 text-[9px] font-bold text-black">
                              {pendingFaq}
                            </span>
                          )}
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Onboarding — paid only */}
              {isPaid && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/candidate/onboarding")}>
                    <NavLink to="/candidate/onboarding" end>
                      <ClipboardList className="h-4 w-4" />
                      {!collapsed && <span>Onboarding</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider">Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/candidate/profile" || location.pathname === "/candidate/settings"}>
                  <NavLink to="/candidate/profile" end>
                    <User className="h-4 w-4" />
                    {!collapsed && <span>Profile & Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Billing — paid only */}
              {isPaid && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/candidate/billing")}>
                    <NavLink to="/candidate/billing" end>
                      <ReceiptText className="h-4 w-4" />
                      {!collapsed && <span>Billing</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Log out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
