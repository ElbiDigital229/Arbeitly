import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, UserRoundCog, ClipboardList } from "lucide-react";
import { useAuditLog, type AuditUserType, type AuditAction } from "@/context/AuditLogContext";
import { useCustomers } from "@/context/CustomersContext";
import { useEmployees } from "@/context/EmployeesContext";

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
};

const actionLabels: Record<AuditAction, string> = {
  candidate_signed_up: "Signed up",
  candidate_assigned: "Assigned to employee",
  candidate_reassigned: "Reassigned",
  prompt_limit_bumped: "Prompt limit changed",
  application_added: "Application added",
  application_status_changed: "Application status changed",
  application_deleted: "Application deleted",
  cv_version_created: "CV version created",
  cv_variant_created: "CV variant created",
  cv_enhanced: "CV enhanced by AI",
  cl_version_created: "Cover letter version created",
  cl_variant_created: "Cover letter variant created",
  cl_enhanced: "Cover letter enhanced",
  faq_item_added: "FAQ item added",
  faq_item_edited: "FAQ item edited",
  faq_item_deleted: "FAQ item deleted",
  faq_item_approved: "FAQ item approved",
  faq_item_unverified: "FAQ item unverified",
  faq_candidate_override: "FAQ answer overridden by candidate",
  job_added_to_queue: "Job added to queue",
  job_skipped: "Job skipped",
  employee_account_created: "Employee account created",
  candidate_viewed_as_employee: "Candidate viewed as employee",
  csv_imported: "Applications imported via CSV",
  csv_exported: "Applications exported",
};

const userTypeColors: Record<AuditUserType, string> = {
  candidate: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  employee: "text-primary bg-primary/10 border-primary/20",
  superadmin: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

const userTypeDotColors: Record<AuditUserType, string> = {
  candidate: "bg-blue-400",
  employee: "bg-primary",
  superadmin: "bg-purple-400",
};

type UserEntry = { id: string; name: string; type: "candidate" | "employee"; email?: string };

const SuperAdminAuditLog = () => {
  const { getAll } = useAuditLog();
  const { customers } = useCustomers();
  const { employees } = useEmployees();

  const allEntries = getAll();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Build unified user list from candidates + employees
  const users: UserEntry[] = [
    ...customers.map((c) => ({ id: c.id, name: c.fullName, type: "candidate" as const, email: c.email })),
    ...employees.map((e) => ({ id: e.id, name: e.fullName, type: "employee" as const, email: e.email })),
  ];

  // Count entries per user (by userId or targetId)
  const countFor = (userId: string) =>
    allEntries.filter((e) => e.userId === userId || e.targetId === userId).length;

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    (u.email ?? "").toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => countFor(b.id) - countFor(a.id));

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const selectedEntries = useMemo(() => {
    if (!selectedUserId) return [];
    return allEntries
      .filter((e) => e.userId === selectedUserId || e.targetId === selectedUserId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [allEntries, selectedUserId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Audit Log</h1>
        <p className="text-muted-foreground">Select a user to view their full activity history</p>
      </div>

      <div className="grid grid-cols-[300px_1fr] gap-4 items-start">
        {/* ── User list panel ── */}
        <Card className="overflow-hidden">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9 h-8 text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="divide-y divide-border max-h-[calc(100vh-280px)] overflow-y-auto">
            {filteredUsers.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-8">No users found</p>
            )}
            {filteredUsers.map((u) => {
              const count = countFor(u.id);
              const isSelected = selectedUserId === u.id;
              const Icon = u.type === "candidate" ? User : UserRoundCog;
              return (
                <button
                  key={u.id}
                  onClick={() => setSelectedUserId(u.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-secondary/50 ${isSelected ? "bg-primary/5 border-l-2 border-primary" : "border-l-2 border-transparent"}`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${userTypeColors[u.type]}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-card-foreground truncate">{u.name}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{u.type}</p>
                  </div>
                  {count > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-medium text-muted-foreground px-1">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* ── Activity feed panel ── */}
        <Card>
          {!selectedUser ? (
            <CardContent className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
              <ClipboardList className="h-10 w-10 opacity-20" />
              <p className="text-sm">Select a user to view their activity</p>
            </CardContent>
          ) : (
            <>
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full border ${userTypeColors[selectedUser.type]}`}>
                  {selectedUser.type === "candidate" ? <User className="h-4 w-4" /> : <UserRoundCog className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{selectedUser.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{selectedUser.type} · {selectedEntries.length} activit{selectedEntries.length !== 1 ? "ies" : "y"}</p>
                </div>
              </div>
              <CardContent className="p-0">
                {selectedEntries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground">
                    <ClipboardList className="h-8 w-8 opacity-20" />
                    <p className="text-sm">No activity recorded yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50 max-h-[calc(100vh-280px)] overflow-y-auto">
                    {selectedEntries.map((entry) => (
                      <div key={entry.id} className="flex items-start gap-3 px-5 py-3 hover:bg-secondary/20 transition-colors">
                        <div className="mt-1.5 flex items-center">
                          <div className={`h-2 w-2 rounded-full shrink-0 ${userTypeDotColors[entry.userType]}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium text-card-foreground">{entry.userName}</span>
                            <span className="text-xs text-muted-foreground">·</span>
                            <span className="text-xs text-foreground/80">{actionLabels[entry.action] ?? entry.action}</span>
                          </div>
                          {entry.detail && (
                            <p className="text-xs text-muted-foreground mt-0.5">{entry.detail}</p>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground/60 shrink-0 whitespace-nowrap pt-0.5">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminAuditLog;
