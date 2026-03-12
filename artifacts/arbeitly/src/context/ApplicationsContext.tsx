import { createContext, useContext, useState, type ReactNode } from "react";
import { type Application, type ApplicationStatus, initialApplications } from "@/data/applications";

type ApplicationsContextValue = {
  applications: Application[];
  addApplication: (app: Omit<Application, "id" | "date">) => void;
  updateStatus: (id: string, status: ApplicationStatus) => void;
  moveCard: (id: string, toStatus: ApplicationStatus, afterId?: string) => void;
};

const ApplicationsContext = createContext<ApplicationsContextValue | null>(null);

export const ApplicationsProvider = ({ children }: { children: ReactNode }) => {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [nextId, setNextId] = useState(initialApplications.length + 1);

  const addApplication = (app: Omit<Application, "id" | "date">) => {
    const id = String(nextId);
    const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    setApplications((prev) => [{ ...app, id, date }, ...prev]);
    setNextId((n) => n + 1);
  };

  const updateStatus = (id: string, status: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const moveCard = (id: string, toStatus: ApplicationStatus, afterId?: string) => {
    setApplications((prev) => {
      const card = prev.find((a) => a.id === id);
      if (!card) return prev;
      const rest = prev.filter((a) => a.id !== id);
      const updated = { ...card, status: toStatus };
      if (!afterId) return [...rest, updated];
      const idx = rest.findIndex((a) => a.id === afterId);
      if (idx === -1) return [...rest, updated];
      const result = [...rest];
      result.splice(idx, 0, updated);
      return result;
    });
  };

  return (
    <ApplicationsContext.Provider value={{ applications, addApplication, updateStatus, moveCard }}>
      {children}
    </ApplicationsContext.Provider>
  );
};

export const useApplications = () => {
  const ctx = useContext(ApplicationsContext);
  if (!ctx) throw new Error("useApplications must be used within ApplicationsProvider");
  return ctx;
};
