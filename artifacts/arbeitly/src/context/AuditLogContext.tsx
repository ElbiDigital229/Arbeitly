import { createContext, useContext, type ReactNode } from "react";

export type AuditUserType = "candidate" | "employee" | "superadmin";

export type AuditAction =
  | "candidate_signed_up"
  | "candidate_assigned"
  | "candidate_reassigned"
  | "prompt_limit_bumped"
  | "application_added"
  | "application_status_changed"
  | "application_deleted"
  | "cv_version_created"
  | "cv_variant_created"
  | "cv_enhanced"
  | "cl_version_created"
  | "cl_variant_created"
  | "cl_enhanced"
  | "faq_item_added"
  | "faq_item_edited"
  | "faq_item_deleted"
  | "faq_item_approved"
  | "faq_item_unverified"
  | "faq_candidate_override"
  | "job_added_to_queue"
  | "job_skipped"
  | "employee_account_created"
  | "candidate_viewed_as_employee"
  | "csv_imported"
  | "csv_exported";

export type AuditLogEntry = {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userType: AuditUserType;
  action: AuditAction;
  targetId?: string;
  targetName?: string;
  detail?: string;
};

const STORAGE_KEY = "arbeitly_audit_log";

type AuditLogContextType = {
  log: (entry: Omit<AuditLogEntry, "id" | "timestamp">) => void;
  getAll: () => AuditLogEntry[];
  getForCandidate: (candidateId: string) => AuditLogEntry[];
  getForEmployee: (employeeId: string) => AuditLogEntry[];
};

const AuditLogContext = createContext<AuditLogContextType | null>(null);

export function AuditLogProvider({ children }: { children: ReactNode }) {
  const log = (entry: Omit<AuditLogEntry, "id" | "timestamp">) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    try {
      const existing: AuditLogEntry[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newEntry, ...existing]));
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newEntry]));
    }
  };

  const getAll = (): AuditLogEntry[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  };

  const getForCandidate = (candidateId: string): AuditLogEntry[] =>
    getAll().filter((e) => e.targetId === candidateId);

  const getForEmployee = (employeeId: string): AuditLogEntry[] =>
    getAll().filter((e) => e.userId === employeeId || e.targetId === employeeId);

  return (
    <AuditLogContext.Provider value={{ log, getAll, getForCandidate, getForEmployee }}>
      {children}
    </AuditLogContext.Provider>
  );
}

export function useAuditLog() {
  const ctx = useContext(AuditLogContext);
  if (!ctx) throw new Error("useAuditLog must be used within AuditLogProvider");
  return ctx;
}
