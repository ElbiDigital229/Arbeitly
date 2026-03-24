import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Search, UserRoundCog, Plus, Pencil, Trash2, ChevronDown, Users, ClipboardList } from "lucide-react";
import { useEmployees, type Employee } from "@/context/EmployeesContext";
import { useCustomers } from "@/context/CustomersContext";
import { useAuditLog } from "@/context/AuditLogContext";
import { format } from "date-fns";

type EmployeeForm = {
  fullName: string;
  email: string;
  password: string;
  status: "active" | "inactive";
};

const emptyForm: EmployeeForm = { fullName: "", email: "", password: "", status: "active" };

const SuperAdminEmployees = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const { customers } = useCustomers();
  const { getForEmployee } = useAuditLog();

  const auditActionLabels: Record<string, string> = {
    candidate_signed_up: "Signed up",
    candidate_assigned: "Assigned candidate",
    candidate_reassigned: "Reassigned candidate",
    prompt_limit_bumped: "Quota bumped",
    application_added: "App added",
    application_status_changed: "Status changed",
    application_deleted: "App deleted",
    cv_version_created: "CV version created",
    cv_variant_created: "CV variant",
    cv_enhanced: "CV enhanced",
    cl_version_created: "Cover letter created",
    cl_variant_created: "CL variant",
    cl_enhanced: "CL enhanced",
    faq_item_added: "FAQ added",
    faq_item_edited: "FAQ edited",
    faq_item_deleted: "FAQ deleted",
    faq_item_approved: "FAQ approved",
    faq_item_unverified: "FAQ unverified",
    faq_candidate_override: "FAQ override",
    job_added_to_queue: "Job queued",
    job_skipped: "Job skipped",
    employee_account_created: "Account created",
    candidate_viewed_as_employee: "Viewed candidate",
    csv_imported: "CSV imported",
    csv_exported: "CSV exported",
  };
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [dialog, setDialog] = useState<{ open: boolean; editing: Employee | null }>({
    open: false, editing: null,
  });
  const [form, setForm] = useState<EmployeeForm>(emptyForm);

  const filtered = employees.filter(
    (e) =>
      e.fullName.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()),
  );

  const openAdd = () => {
    setForm(emptyForm);
    setDialog({ open: true, editing: null });
  };

  const openEdit = (emp: Employee) => {
    setForm({ fullName: emp.fullName, email: emp.email, password: emp.password, status: emp.status });
    setDialog({ open: true, editing: emp });
  };

  const handleSave = () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) return;
    if (dialog.editing) {
      updateEmployee(dialog.editing.id, {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        status: form.status,
      });
    } else {
      addEmployee({ fullName: form.fullName.trim(), email: form.email.trim(), password: form.password, status: form.status });
    }
    setDialog({ open: false, editing: null });
  };

  const toggleAssign = (emp: Employee, candidateId: string) => {
    const already = emp.assignedCandidateIds.includes(candidateId);
    updateEmployee(emp.id, {
      assignedCandidateIds: already
        ? emp.assignedCandidateIds.filter((id) => id !== candidateId)
        : [...emp.assignedCandidateIds, candidateId],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground">Manage team members and their assigned candidates</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserRoundCog className="h-4 w-4" />
            {employees.length} total
          </div>
          <Button className="rounded-full gap-1" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Employee
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">Employee List</CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              {employees.length === 0
                ? "No employees yet. Add your first team member."
                : "No employees match your search."}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((emp) => (
                <Collapsible
                  key={emp.id}
                  open={expandedId === emp.id}
                  onOpenChange={(open) => setExpandedId(open ? emp.id : null)}
                >
                  <div className="rounded-lg border border-border hover:border-border/80 transition-colors overflow-hidden">
                    {/* Row */}
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="flex-1 min-w-0 grid grid-cols-4 gap-3 items-center text-sm">
                        <div>
                          <p className="font-medium text-card-foreground truncate">{emp.fullName}</p>
                          <p className="text-xs text-muted-foreground truncate">{emp.email}</p>
                        </div>
                        <div className="hidden md:block text-xs text-muted-foreground">
                          {format(new Date(emp.createdAt), "dd MMM yyyy")}
                        </div>
                        <div>
                          <Badge
                            variant={emp.status === "active" ? "default" : "secondary"}
                            className="capitalize text-xs"
                          >
                            {emp.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          {emp.assignedCandidateIds.length} candidate{emp.assignedCandidateIds.length !== 1 ? "s" : ""}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs" onClick={() => openEdit(emp)}>
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteEmployee(emp.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <CollapsibleTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-8 gap-1 text-xs">
                            <ChevronDown
                              className={`h-3.5 w-3.5 transition-transform ${expandedId === emp.id ? "rotate-180" : ""}`}
                            />
                            Assign
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>

                    {/* Candidate assignment panel */}
                    <CollapsibleContent>
                      <div className="border-t border-border px-4 py-4 bg-muted/20 space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                            Assign Candidates
                          </p>
                          {customers.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">No candidates registered yet.</p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {customers.map((c) => {
                                const assigned = emp.assignedCandidateIds.includes(c.id);
                                return (
                                  <label
                                    key={c.id}
                                    className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                                      assigned
                                        ? "border-primary/40 bg-primary/5"
                                        : "border-border hover:border-border/80"
                                    }`}
                                  >
                                    <Checkbox
                                      checked={assigned}
                                      onCheckedChange={() => toggleAssign(emp, c.id)}
                                    />
                                    <div className="min-w-0">
                                      <p className="text-xs font-medium text-card-foreground truncate">{c.fullName}</p>
                                      <p className="text-[10px] text-muted-foreground truncate">{c.email}</p>
                                    </div>
                                    <Badge variant="secondary" className="text-[10px] shrink-0 ml-auto">
                                      {c.planName}
                                    </Badge>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Prompt stats per assigned candidate */}
                        {(emp.assignments ?? []).filter((a) => emp.assignedCandidateIds.includes(a.candidateId)).length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
                              Application Quota
                            </p>
                            <div className="space-y-1.5">
                              {(emp.assignments ?? [])
                                .filter((a) => emp.assignedCandidateIds.includes(a.candidateId))
                                .map((a) => {
                                  const cand = customers.find((c) => c.id === a.candidateId);
                                  if (!cand) return null;
                                  const pct = Math.min(100, ((a.applicationsUsed ?? 0) / (a.applicationQuota ?? 200)) * 100);
                                  return (
                                    <div key={a.candidateId} className="flex items-center gap-3">
                                      <p className="text-xs text-card-foreground w-32 truncate">{cand.fullName}</p>
                                      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                                        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                                      </div>
                                      <p className="text-[10px] text-muted-foreground w-16 text-right">
                                        {a.applicationsUsed ?? 0}/{a.applicationQuota ?? 200}
                                      </p>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}

                        {/* Activity log for this employee */}
                        {(() => {
                          const empLogs = getForEmployee(emp.id).slice(0, 30);
                          return (
                            <div>
                              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <ClipboardList className="h-3.5 w-3.5" />
                                Activity Log
                              </p>
                              {empLogs.length === 0 ? (
                                <p className="text-xs text-muted-foreground italic">No activity recorded yet.</p>
                              ) : (
                                <div className="space-y-1 max-h-48 overflow-y-auto">
                                  {empLogs.map((entry) => (
                                    <div key={entry.id} className="flex items-center gap-2 text-[11px] py-1 border-b border-border/40 last:border-0">
                                      <span className="text-muted-foreground shrink-0 w-28 tabular-nums">
                                        {new Date(entry.timestamp).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                                      </span>
                                      <span className="font-medium text-foreground shrink-0">
                                        {auditActionLabels[entry.action] ?? entry.action}
                                      </span>
                                      {entry.targetName && (
                                        <span className="text-muted-foreground truncate">→ {entry.targetName}</span>
                                      )}
                                      {entry.detail && !entry.targetName && (
                                        <span className="text-muted-foreground truncate">{entry.detail}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={dialog.open} onOpenChange={(o) => !o && setDialog({ open: false, editing: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {dialog.editing ? "Edit Employee" : "Add Employee"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label>Full Name</Label>
              <Input
                className="mt-1.5"
                placeholder="e.g. Sarah Klein"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                className="mt-1.5"
                type="email"
                placeholder="sarah@arbeitly.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                className="mt-1.5"
                type="text"
                placeholder="Set a password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "active" | "inactive" })}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog({ open: false, editing: null })}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={!form.fullName.trim() || !form.email.trim() || !form.password.trim()}
            >
              {dialog.editing ? "Save Changes" : "Add Employee"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuperAdminEmployees;
