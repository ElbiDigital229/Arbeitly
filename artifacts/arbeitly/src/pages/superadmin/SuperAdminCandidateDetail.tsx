import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCustomers } from "@/context/CustomersContext";
import { useEmployees } from "@/context/EmployeesContext";
import { useAuditLog } from "@/context/AuditLogContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  User,
  Briefcase,
  UserCheck,
  Link as LinkIcon,
  MessageSquare,
  Zap,
  ExternalLink,
  Plus,
  ClipboardList,
} from "lucide-react";
import { format } from "date-fns";

type AppStatus = "to-apply" | "applied" | "interview" | "accepted" | "rejected";

type BoardApp = {
  id: string;
  job: string;
  company: string;
  url?: string;
  notes?: string;
  status: AppStatus;
  source: "self" | "platform";
  date: string;
  salary?: string;
  references?: string;
  contactPerson?: string;
  nextAction?: string;
  jobDescription?: string;
};

const statusColors: Record<AppStatus, string> = {
  "to-apply": "bg-muted text-muted-foreground",
  applied: "bg-blue-500/10 text-blue-400",
  interview: "bg-yellow-500/10 text-yellow-400",
  accepted: "bg-green-500/10 text-green-400",
  rejected: "bg-destructive/10 text-destructive",
};

const statusLabels: Record<AppStatus, string> = {
  "to-apply": "To Apply",
  applied: "Applied",
  interview: "Interview",
  accepted: "Accepted",
  rejected: "Rejected",
};

const onboardingLabels: Record<string, string> = {
  firstName: "First Name",
  lastName: "Last Name",
  applicationEmail: "Application Email",
  phone: "Phone",
  linkedin: "LinkedIn",
  dob: "Date of Birth",
  placeOfBirth: "Place of Birth",
  address: "Address",
  currentJobTitle: "Job Title",
  currentEmployer: "Employer",
  currentField: "Field",
  yearsExperience: "Years of Experience",
  currentSalary: "Current Salary",
  workedInGermany: "Worked in Germany",
  noticePeriod: "Notice Period",
  highestStudy: "Education Level",
  degreeTitle: "Degree",
  university: "University",
  universityLocation: "University Location",
  topSkills: "Top Skills",
  certifications: "Certifications",
  careerGoal: "Career Goal",
  targetRoles: "Target Roles",
  targetIndustries: "Target Industries",
  employmentType: "Employment Type",
  preferredLocation: "Preferred Location",
  openToRelocation: "Open to Relocation",
  preferredSalary: "Preferred Salary",
  targetCompanies: "Target Companies",
  openToCareerChange: "Open to Career Change",
  germanLevel: "German Level",
  drivingLicense: "Driving License",
  transitionMotivation: "Transition Motivation",
  trainingNeeds: "Training Needs",
  howHeard: "How They Heard",
  additionalInfo: "Additional Info",
};

const SuperAdminCandidateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customers } = useCustomers();
  const { employees, updateEmployee } = useEmployees();
  const { getForCandidate } = useAuditLog();

  const candidate = customers.find((c) => c.id === id);

  // Load applications from localStorage
  const apps: BoardApp[] = (() => {
    try {
      const stored = id ? localStorage.getItem(`arbeitly_apps_${id}`) : null;
      if (stored) {
        return (JSON.parse(stored) as BoardApp[]).map((a) => ({
          ...a,
          status: (a.status === ("offer" as AppStatus) ? "accepted" : a.status) as AppStatus,
        }));
      }
      return [];
    } catch {
      return [];
    }
  })();

  // Find currently assigned employee
  const assignedEmployee = employees.find((e) =>
    e.assignedCandidateIds.includes(id ?? ""),
  );
  const [assignedTo, setAssignedTo] = useState<string>(
    assignedEmployee?.id ?? "none",
  );

  // Keep in sync if employees change externally
  useEffect(() => {
    const found = employees.find((e) => e.assignedCandidateIds.includes(id ?? ""));
    setAssignedTo(found?.id ?? "none");
  }, [employees, id]);

  const handleAssign = (employeeId: string) => {
    setAssignedTo(employeeId);
    // Remove candidate from all employees first
    employees.forEach((emp) => {
      if (emp.assignedCandidateIds.includes(id ?? "")) {
        updateEmployee(emp.id, {
          assignedCandidateIds: emp.assignedCandidateIds.filter((cid) => cid !== id),
        });
      }
    });
    // Assign to new employee
    if (employeeId !== "none") {
      const target = employees.find((e) => e.id === employeeId);
      if (target) {
        updateEmployee(target.id, {
          assignedCandidateIds: [...target.assignedCandidateIds.filter((cid) => cid !== id), id!],
        });
      }
    }
  };

  // ── Prompt bump ──
  const assignedEmp = employees.find((e) => e.id === assignedTo && assignedTo !== "none");
  const currentAssignment = assignedEmp?.assignments?.find((a) => a.candidateId === id);
  const [bumpDialog, setBumpDialog] = useState(false);
  const [customLimit, setCustomLimit] = useState("");

  const handleBump = (delta: number) => {
    if (!assignedEmp || !currentAssignment) return;
    const newLimit = (currentAssignment.applicationQuota ?? 200) + delta;
    updateEmployee(assignedEmp.id, {
      assignments: assignedEmp.assignments.map((a) =>
        a.candidateId === id ? { ...a, applicationQuota: newLimit } : a
      ),
    });
  };

  const handleSetCustom = () => {
    const val = parseInt(customLimit, 10);
    if (!val || val < 1 || !assignedEmp || !currentAssignment) return;
    updateEmployee(assignedEmp.id, {
      assignments: assignedEmp.assignments.map((a) =>
        a.candidateId === id ? { ...a, applicationQuota: val } : a
      ),
    });
    setBumpDialog(false);
    setCustomLimit("");
  };

  if (!candidate) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/superadmin/customers")}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Candidates
        </Button>
        <p className="text-muted-foreground text-sm">Candidate not found.</p>
      </div>
    );
  }

  // Audit log
  const auditEntries = id ? getForCandidate(id) : [];

  const auditActionLabels: Record<string, string> = {
    candidate_signed_up: "Signed up",
    candidate_assigned: "Assigned to employee",
    candidate_reassigned: "Reassigned",
    prompt_limit_bumped: "Quota bumped",
    application_added: "Application added",
    application_status_changed: "Status changed",
    application_deleted: "Application deleted",
    cv_version_created: "CV version created",
    cv_variant_created: "CV variant created",
    cv_enhanced: "CV enhanced",
    cl_version_created: "Cover letter created",
    cl_variant_created: "Cover letter variant",
    cl_enhanced: "Cover letter enhanced",
    faq_item_added: "FAQ item added",
    faq_item_edited: "FAQ item edited",
    faq_item_deleted: "FAQ item deleted",
    faq_item_approved: "FAQ approved",
    faq_item_unverified: "FAQ unverified",
    faq_candidate_override: "FAQ override",
    job_added_to_queue: "Job added to queue",
    job_skipped: "Job skipped",
    employee_account_created: "Employee account created",
    candidate_viewed_as_employee: "Viewed by employee",
    csv_imported: "CSV imported",
    csv_exported: "CSV exported",
  };

  // Stats
  const byStatus = (s: AppStatus) => apps.filter((a) => a.status === s).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="mt-0.5 shrink-0"
          onClick={() => navigate("/superadmin/customers")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-2xl font-bold text-foreground">
              {candidate.fullName}
            </h1>
            <Badge variant={candidate.status === "active" ? "default" : "secondary"} className="capitalize">
              {candidate.status}
            </Badge>
            <Badge variant="outline">{candidate.planName}</Badge>
            {candidate.planType === "free" && (
              <Badge variant="secondary" className="text-[10px]">Free Plan</Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-0.5">{candidate.email}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Signed Up</p>
            <p className="font-semibold text-sm mt-0.5">
              {format(new Date(candidate.signedUpAt), "dd MMM yyyy")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Apps</p>
            <p className="font-semibold text-sm mt-0.5">{apps.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Interviews</p>
            <p className="font-semibold text-sm mt-0.5">{byStatus("interview")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Accepted</p>
            <p className="font-semibold text-sm mt-0.5 text-green-400">{byStatus("accepted")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Assign to Employee */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-sm flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-primary" />
            Assign to Employee
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Select value={assignedTo} onValueChange={handleAssign}>
              <SelectTrigger className="w-72">
                <SelectValue placeholder="Select employee…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— Unassigned —</SelectItem>
                {employees
                  .filter((e) => e.status === "active")
                  .map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.fullName}
                      <span className="ml-1.5 text-muted-foreground text-xs">({emp.email})</span>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {assignedTo !== "none" && (
              <p className="text-xs text-muted-foreground">
                Currently assigned to{" "}
                <span className="font-medium text-foreground">
                  {employees.find((e) => e.id === assignedTo)?.fullName}
                </span>
              </p>
            )}
          </div>
          {employees.filter((e) => e.status === "active").length === 0 && (
            <p className="text-xs text-muted-foreground mt-2 italic">
              No active employees yet. Create employees first.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Prompt Usage */}
      {assignedEmp && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                AI Prompt Usage
              </CardTitle>
              <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs" asChild>
                <a href={`/employee/portal/candidates/${id}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" /> View as Employee
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {currentAssignment ? (
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Usage</p>
                  <div className="flex items-center gap-2">
                    <div className="w-40 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${Math.min(100, ((currentAssignment.applicationsUsed ?? 0) / (currentAssignment.applicationQuota ?? 200)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {currentAssignment.applicationsUsed ?? 0} / {currentAssignment.applicationQuota ?? 200}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({Math.max(0, (currentAssignment.applicationQuota ?? 200) - (currentAssignment.applicationsUsed ?? 0))} left)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 gap-1 text-xs" onClick={() => handleBump(5)}>
                    <Plus className="h-3 w-3" /> 5
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 gap-1 text-xs" onClick={() => handleBump(10)}>
                    <Plus className="h-3 w-3" /> 10
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => { setCustomLimit(String(currentAssignment.applicationQuota ?? 200)); setBumpDialog(true); }}>
                    Set limit
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No assignment record found. Assign a candidate to this employee to track application quota.</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">Assigned to: <span className="font-medium text-foreground">{assignedEmp.fullName}</span></p>
          </CardContent>
        </Card>
      )}

      {/* Profile */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-sm flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            {candidate.planType === "free" ? "Marketing Questions" : "Onboarding Profile"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {candidate.planType === "free" ? (
            candidate.onboarding?.currentField ||
            candidate.onboarding?.preferredLocation ||
            candidate.onboarding?.howHeard ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                {candidate.onboarding.currentField && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Industry</p>
                    <p className="text-sm text-card-foreground mt-0.5">
                      {candidate.onboarding.currentField}
                    </p>
                  </div>
                )}
                {candidate.onboarding.preferredLocation && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Target Country</p>
                    <p className="text-sm text-card-foreground mt-0.5">
                      {candidate.onboarding.preferredLocation}
                    </p>
                  </div>
                )}
                {candidate.onboarding.howHeard && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">How They Heard</p>
                    <p className="text-sm text-card-foreground mt-0.5">
                      {candidate.onboarding.howHeard}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Marketing questions not yet answered.
              </p>
            )
          ) : candidate.onboarding && Object.keys(candidate.onboarding).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-3">
              {(Object.entries(candidate.onboarding) as [string, string][])
                .filter(([, v]) => v)
                .map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs font-medium text-muted-foreground">
                      {onboardingLabels[key] ?? key}
                    </p>
                    <p className="text-sm text-card-foreground mt-0.5 break-words">{value}</p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Onboarding not yet completed.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Applications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-sm flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            Applications Tracked
            <span className="ml-1 text-xs font-normal text-muted-foreground">({apps.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {apps.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              This candidate hasn't tracked any applications yet.
            </p>
          ) : (
            <div className="space-y-2">
              {apps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/20 text-sm"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-card-foreground">{app.job}</span>
                      <span className="text-muted-foreground">@ {app.company}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          statusColors[app.status]
                        }`}
                      >
                        {statusLabels[app.status]}
                      </span>
                      {app.source === "platform" && (
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-medium border border-primary/30 text-primary">
                          Platform
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                      <span>{app.date}</span>
                      {app.salary && <span>💰 {app.salary}</span>}
                      {app.contactPerson && <span>👤 {app.contactPerson}</span>}
                      {app.references && <span>📋 {app.references}</span>}
                      {app.url && (
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <LinkIcon className="h-3 w-3" /> Job post
                        </a>
                      )}
                    </div>
                    {app.nextAction && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground/80 mt-1">
                        <MessageSquare className="h-3 w-3 shrink-0" />
                        Next: {app.nextAction}
                      </p>
                    )}
                    {app.jobDescription && (
                      <p className="text-xs text-muted-foreground/70 mt-1.5 line-clamp-2">
                        {app.jobDescription}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-sm flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary" />
            Activity Log
            <span className="ml-1 text-xs font-normal text-muted-foreground">({auditEntries.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {auditEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No activity recorded yet for this candidate.</p>
          ) : (
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {auditEntries.slice(0, 50).map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 text-xs py-1.5 border-b border-border/50 last:border-0">
                  <span className="text-muted-foreground shrink-0 w-32 tabular-nums">
                    {new Date(entry.timestamp).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="font-medium text-foreground shrink-0">
                    {auditActionLabels[entry.action] ?? entry.action}
                  </span>
                  {entry.detail && (
                    <span className="text-muted-foreground truncate">{entry.detail}</span>
                  )}
                  <span className="ml-auto text-muted-foreground/60 shrink-0 text-[10px]">
                    {entry.userName}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Set Custom Limit Dialog */}
      <Dialog open={bumpDialog} onOpenChange={setBumpDialog}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="font-display">Set Prompt Limit</DialogTitle>
          </DialogHeader>
          <div>
            <Label>New limit</Label>
            <Input
              className="mt-1.5"
              type="number"
              min={1}
              value={customLimit}
              onChange={(e) => setCustomLimit(e.target.value)}
              placeholder="e.g. 30"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBumpDialog(false)}>Cancel</Button>
            <Button onClick={handleSetCustom} disabled={!customLimit || parseInt(customLimit) < 1}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuperAdminCandidateDetail;
