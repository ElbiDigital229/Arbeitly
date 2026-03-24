import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type NotificationType = "info" | "success" | "warning" | "error";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  targetUserId: string; // which user this belongs to
  link?: string; // optional navigation link
};

type NotificationsContextType = {
  notifications: Notification[];
  unreadCount: (userId: string) => number;
  getForUser: (userId: string) => Notification[];
  addNotification: (n: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: (userId: string) => void;
  deleteNotification: (id: string) => void;
};

const STORAGE_KEY = "arbeitly_notifications";
const NotificationsContext = createContext<NotificationsContextType | null>(null);

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: "notif_001",
    type: "info",
    title: "New applications added",
    message: "Jonas Weber added 2 new applications to your queue.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    targetUserId: "seed_cust_001",
    link: "/candidate/applications",
  },
  {
    id: "notif_002",
    type: "success",
    title: "Interview invitation",
    message: "Your application at BMW Group has moved to Interview stage.",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: false,
    targetUserId: "seed_cust_001",
    link: "/candidate/applications",
  },
  {
    id: "notif_003",
    type: "info",
    title: "FAQ item pending approval",
    message: "Jonas Weber added a new interview Q&A for your review.",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
    targetUserId: "seed_cust_001",
    link: "/candidate/faq",
  },
  {
    id: "notif_004",
    type: "info",
    title: "New application added",
    message: "Jonas Weber added Senior Financial Analyst at Deutsche Bank.",
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    read: false,
    targetUserId: "seed_cust_002",
    link: "/candidate/applications",
  },
];

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : SEED_NOTIFICATIONS;
    } catch { return SEED_NOTIFICATIONS; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const getForUser = (userId: string) =>
    notifications
      .filter((n) => n.targetUserId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const unreadCount = (userId: string) =>
    notifications.filter((n) => n.targetUserId === userId && !n.read).length;

  const addNotification = (n: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newN: Notification = {
      ...n,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newN, ...prev]);
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = (userId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.targetUserId === userId ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, getForUser, addNotification, markRead, markAllRead, deleteNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}
