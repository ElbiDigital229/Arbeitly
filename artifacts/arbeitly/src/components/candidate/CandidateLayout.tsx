import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CandidateSidebar } from "@/components/candidate/CandidateSidebar";
import { useCustomers } from "@/context/CustomersContext";
import { useNotifications } from "@/context/NotificationsContext";
import { Bell, Search, HelpCircle, Sparkles, CheckCheck, X, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const fullBleedRoutes: string[] = ["/candidate/cv", "/candidate/files"];

const pageTitles: Record<string, string> = {
  "/candidate/portal": "Board",
  "/candidate/cv": "My CV",
  "/candidate/applications": "Applications",
  "/candidate/files": "Files",
  "/candidate/documents": "Documents",
  "/candidate/upload": "Upload CV",
  "/candidate/analytics": "Analytics",
  "/candidate/profile": "My Profile",
  "/candidate/onboarding": "My Onboarding",
  "/candidate/settings": "Settings",
  "/candidate/faq": "FAQ & Interview Prep",
};

const typeIcon = {
  info:    <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />,
  success: <CheckCircle className="h-3.5 w-3.5 text-green-400 shrink-0 mt-0.5" />,
  warning: <AlertTriangle className="h-3.5 w-3.5 text-yellow-400 shrink-0 mt-0.5" />,
  error:   <XCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />,
};

function NotificationPanel({ userId, onClose }: { userId: string; onClose: () => void }) {
  const { getForUser, markRead, markAllRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();
  const notifications = getForUser(userId);

  return (
    <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card shadow-xl z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <p className="text-sm font-semibold text-card-foreground">Notifications</p>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => markAllRead(userId)}>
            <CheckCheck className="h-3 w-3" /> Mark all read
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            <Bell className="h-7 w-7 mx-auto mb-2 opacity-30" />
            <p className="text-xs">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0 cursor-pointer hover:bg-secondary/30 transition-colors ${n.read ? "opacity-60" : ""}`}
              onClick={() => {
                markRead(n.id);
                if (n.link) { navigate(n.link); onClose(); }
              }}
            >
              {typeIcon[n.type]}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-card-foreground">{n.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">
                  {new Date(n.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 opacity-0 group-hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const CandidatePortalLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentCustomer } = useCustomers();
  const { unreadCount } = useNotifications();
  const title = pageTitles[location.pathname] || "Portal";
  const isFullBleed = fullBleedRoutes.includes(location.pathname);
  const isFreePlan = currentCustomer?.planType === "free";
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentCustomer) {
      navigate("/candidate/login");
    }
  }, [currentCustomer, navigate]);

  // Close notification panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  const initials = currentCustomer
    ? currentCustomer.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "AS";

  const myUnread = currentCustomer ? unreadCount(currentCustomer.id) : 0;

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
              {isFreePlan && (
                <Button
                  size="sm"
                  className="h-7 rounded-full text-xs gap-1 mr-1 bg-primary hover:bg-primary/90"
                  onClick={() => navigate("/upgrade")}
                >
                  <Sparkles className="h-3 w-3" />
                  Upgrade Plan
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </Button>

              {/* Notification bell */}
              <div className="relative" ref={notifRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 relative"
                  onClick={() => setNotifOpen((v) => !v)}
                >
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  {myUnread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground leading-none">
                      {myUnread > 9 ? "9+" : myUnread}
                    </span>
                  )}
                </Button>
                {notifOpen && currentCustomer && (
                  <NotificationPanel userId={currentCustomer.id} onClose={() => setNotifOpen(false)} />
                )}
              </div>

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

export default CandidatePortalLayout;
