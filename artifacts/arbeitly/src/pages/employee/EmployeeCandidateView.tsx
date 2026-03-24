import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useCustomers } from "@/context/CustomersContext";
import { useEmployees } from "@/context/EmployeesContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, Briefcase, Link as LinkIcon, MessageSquare,
  Plus, Pencil, Trash2, Search, Building2, Mail, Phone,
  MapPin, Calendar, Globe, FileText, Upload, User,
  CheckCircle, Download, Loader2, Eye, EyeOff, PenTool,
  ClipboardPaste, X, Lock, KeyRound, Linkedin,
  Wand2, List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  RotateCcw, RotateCw, Copy, ChevronDown, ChevronRight, RefreshCw,
  ExternalLink, Star, LayoutGrid, FileUp, UserCheck, AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/context/AuditLogContext";

// ── Types ──────────────────────────────────────────────────────────────────────
type AppStatus = "to-apply" | "applied" | "interview" | "accepted" | "rejected";
type BoardApp = {
  id: string; job: string; company: string; url?: string; notes?: string;
  status: AppStatus; source: "self" | "platform";
  addedById?: string; addedByName?: string; seenByCandidate?: boolean;
  date: string; salary?: string; references?: string; contactPerson?: string;
  nextAction?: string; jobDescription?: string; cvUsed?: string;
};
type StoredFile = {
  id: string; name: string; size: string; type: string;
  uploadedBy: "employee" | "candidate"; uploadedAt: string;
};

const statusColors: Record<AppStatus, string> = {
  "to-apply": "bg-muted text-muted-foreground",
  applied: "bg-blue-500/10 text-blue-400",
  interview: "bg-yellow-500/10 text-yellow-400",
  accepted: "bg-green-500/10 text-green-400",
  rejected: "bg-destructive/10 text-destructive",
};
const statusLabels: Record<AppStatus, string> = {
  "to-apply": "To Apply", applied: "Applied", interview: "Interview",
  accepted: "Accepted", rejected: "Rejected",
};
const allStatuses: AppStatus[] = ["to-apply", "applied", "interview", "accepted", "rejected"];

const emptyAppForm = {
  job: "", company: "", url: "", status: "to-apply" as AppStatus,
  date: new Date().toISOString().split("T")[0], salary: "", references: "",
  contactPerson: "", nextAction: "", jobDescription: "", cvUsed: "",
};

const formatDate = (iso: string) => {
  try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return iso; }
};

// ── Small helpers ──────────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm text-card-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
};

const OBField = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;
  return (
    <div>
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm text-card-foreground mt-0.5">{value}</p>
    </div>
  );
};

type TabKey = "profile" | "onboarding" | "applications" | "cv" | "cover-letter" | "files" | "account" | "job-discovery" | "faq";
type FaqStatus = "pending" | "approved";
type FaqActivityEntry = {
  timestamp: string;
  userId: string;
  userName: string;
  userType: "candidate" | "employee";
  action: "created" | "answer_updated" | "approved" | "unverified" | "candidate_override";
  previousAnswer?: string;
  newAnswer?: string;
};
type FaqItem = {
  id: string;
  question: string;
  answer: string;
  status: FaqStatus;
  createdAt: string;
  createdById: string;
  createdByName: string;
  lockedByCandidate?: boolean;
  verifiedAt?: string;
  verifiedById?: string;
  verifiedByName?: string;
  activity: FaqActivityEntry[];
};

// ── Main component ─────────────────────────────────────────────────────────────
const EmployeeCandidateView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customers } = useCustomers();
  const { currentEmployee, updateEmployee } = useEmployees();
  const { toast } = useToast();
  const { log: auditLog } = useAuditLog();

  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  const candidate = customers.find((c) => c.id === id);
  const isAssigned = currentEmployee?.assignedCandidateIds.includes(id ?? "") ?? false;

  // ── Applications ──
  const storageKey = id ? `arbeitly_apps_${id}` : null;
  const loadApps = (): BoardApp[] => {
    try {
      const stored = storageKey ? localStorage.getItem(storageKey) : null;
      if (stored) return (JSON.parse(stored) as BoardApp[]).map((a) => ({ ...a, status: (a.status === ("offer" as AppStatus) ? "accepted" : a.status) as AppStatus }));
      return [];
    } catch { return []; }
  };
  const [apps, setApps] = useState<BoardApp[]>(loadApps);
  const saveApps = (u: BoardApp[]) => { setApps(u); if (storageKey) localStorage.setItem(storageKey, JSON.stringify(u)); };
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  // Employees see only platform-added apps (their own + other advisors), NOT candidate self-adds
  const visibleApps = apps.filter((a) => a.source !== "self" || a.addedById === currentEmployee?.id);
  const filtered = visibleApps.filter((a) => {
    const q = search.toLowerCase();
    return (a.job.toLowerCase().includes(q) || a.company.toLowerCase().includes(q)) && (statusFilter === "all" || a.status === statusFilter);
  });
  const [appView, setAppView] = useState<"list" | "kanban">("list");
  const [appDialog, setAppDialog] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [appForm, setAppForm] = useState(emptyAppForm);
  const openAddApp = () => { setEditingAppId(null); setAppForm(emptyAppForm); setAppDialog(true); };
  const openEditApp = (app: BoardApp) => {
    setEditingAppId(app.id);
    setAppForm({ job: app.job, company: app.company, url: app.url ?? "", status: app.status, date: app.date, salary: app.salary ?? "", references: app.references ?? "", contactPerson: app.contactPerson ?? "", nextAction: app.nextAction ?? "", jobDescription: app.jobDescription ?? "", cvUsed: app.cvUsed ?? "" });
    setAppDialog(true);
  };
  const handleSaveApp = () => {
    if (!appForm.job.trim() || !appForm.company.trim()) return;
    if (editingAppId) {
      saveApps(apps.map((a) => a.id === editingAppId && (a.addedById === currentEmployee?.id || !a.addedById) ? { ...a, ...appForm } : a));
    } else {
      saveApps([{
        id: `app_${Date.now()}`, ...appForm, source: "platform",
        addedById: currentEmployee?.id ?? "employee",
        addedByName: currentEmployee?.fullName ?? "Advisor",
        seenByCandidate: false,
      }, ...apps]);
    }
    setAppDialog(false); setEditingAppId(null); setAppForm(emptyAppForm);
  };
  const byStatus = (s: AppStatus) => apps.filter((a) => a.status === s).length;

  // ── Status change with quota reduction ──
  const handleStatusChange = (app: BoardApp, newStatus: AppStatus) => {
    saveApps(apps.map((a) => a.id === app.id ? { ...a, status: newStatus } : a));

    // When moved TO "applied" from a non-applied state, increment applicationsUsed on assignment
    if (newStatus === "applied" && app.status !== "applied" && currentEmployee && id) {
      const currentAssignment = currentEmployee.assignments?.find((a) => a.candidateId === id);
      if (currentAssignment) {
        const newUsed = (currentAssignment.applicationsUsed ?? 0) + 1;
        updateEmployee(currentEmployee.id, {
          assignments: currentEmployee.assignments.map((a) =>
            a.candidateId === id ? { ...a, applicationsUsed: newUsed } : a
          ),
        });
      }
      auditLog({
        userId: currentEmployee.id,
        userName: currentEmployee.fullName,
        userType: "employee",
        action: "application_status_changed",
        targetId: id,
        targetName: candidate?.fullName,
        detail: `Marked Applied: ${app.job} at ${app.company}`,
      });
    }
  };

  // ── Import / Export CSV ──
  const importRef = useRef<HTMLInputElement>(null);
  const CSV_COLUMNS = ["job", "company", "url", "status", "date", "salary", "contactPerson", "nextAction", "notes"] as const;
  type CsvRow = { job: string; company: string; url: string; status: string; date: string; salary: string; contactPerson: string; nextAction: string; notes: string; _error?: string };

  const [importDialog, setImportDialog] = useState(false);
  const [importRows, setImportRows] = useState<CsvRow[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const handleExportCsv = () => {
    const header = CSV_COLUMNS.join(",");
    const rows = apps.map((a) => CSV_COLUMNS.map((col) => {
      const val = (a as Record<string, unknown>)[col] ?? "";
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `applications_${candidate?.fullName?.replace(/\s+/g, "_") ?? "export"}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleDownloadTemplate = () => {
    const csv = CSV_COLUMNS.join(",") + "\n" + `"Software Engineer","Acme GmbH","https://example.com","to-apply","${new Date().toISOString().split("T")[0]}","€60,000","Jane Smith","Send CV","Great opportunity"`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "applications_template.csv"; a.click(); URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length < 2) { toast({ title: "Empty file", variant: "destructive" }); return; }
      const header = lines[0].split(",").map((h) => h.replace(/^"|"$/g, "").trim().toLowerCase());
      const jobIdx = header.indexOf("job"); const coIdx = header.indexOf("company");
      if (jobIdx === -1 || coIdx === -1) {
        toast({ title: "Invalid CSV", description: "Must have 'job' and 'company' columns", variant: "destructive" }); return;
      }
      const parseVal = (row: string[], idx: number) => idx >= 0 ? (row[idx] ?? "").replace(/^"|"$/g, "").trim() : "";
      const parsed: CsvRow[] = lines.slice(1).map((line) => {
        const cols = line.match(/("(?:[^"]|"")*"|[^,]*)/g)?.map((v) => v) ?? line.split(",");
        const job = parseVal(cols, jobIdx);
        const company = parseVal(cols, coIdx);
        const row: CsvRow = {
          job, company,
          url: parseVal(cols, header.indexOf("url")),
          status: parseVal(cols, header.indexOf("status")) || "to-apply",
          date: parseVal(cols, header.indexOf("date")) || new Date().toISOString().split("T")[0],
          salary: parseVal(cols, header.indexOf("salary")),
          contactPerson: parseVal(cols, header.indexOf("contactperson")),
          nextAction: parseVal(cols, header.indexOf("nextaction")),
          notes: parseVal(cols, header.indexOf("notes")),
        };
        if (!row.job || !row.company) row._error = "Missing job or company";
        if (row.status && !allStatuses.includes(row.status as AppStatus)) row.status = "to-apply";
        return row;
      });
      const errors = parsed.filter((r) => r._error).map((r, i) => `Row ${i + 2}: ${r._error}`);
      setImportRows(parsed); setImportErrors(errors); setImportDialog(true);
    };
    reader.readAsText(file); e.target.value = "";
  };

  const handleConfirmImport = () => {
    if (importErrors.length > 0) return;
    const newApps: BoardApp[] = importRows.map((r) => ({
      id: `app_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      job: r.job, company: r.company, url: r.url, status: r.status as AppStatus,
      date: r.date, salary: r.salary, contactPerson: r.contactPerson,
      nextAction: r.nextAction, notes: r.notes,
      source: "platform",
      addedById: currentEmployee?.id ?? "employee",
      addedByName: currentEmployee?.fullName ?? "Advisor",
      seenByCandidate: false,
    }));
    saveApps([...newApps, ...apps]);
    setImportDialog(false); setImportRows([]);
    toast({ title: `${newApps.length} application${newApps.length !== 1 ? "s" : ""} imported` });
  };

  // ── CV tree state ──
  type CvStyle = "modern" | "classic" | "minimal";
  type CvVariant = { id: string; name: string; label: string; content: string; createdAt: string; isAiEnhanced: boolean; style: CvStyle };
  type CvVersion = { id: string; letter: string; name: string; label: string; content: string; createdAt: string; isAiEnhanced: boolean; style: CvStyle; variants: CvVariant[] };
  type CvTree = { original: { content: string; createdAt: string }; versions: CvVersion[] };
  type ActiveNode = { type: "original" } | { type: "version"; versionId: string } | { type: "variant"; versionId: string; variantId: string };

  const cvTreeKey = id ? `arbeitly_cv_tree_${id}` : null;
  const cvPromptsKey = id ? `arbeitly_cv_prompts_used_${id}` : null;
  const assignment = currentEmployee?.assignments?.find((a) => a.candidateId === id);
  const CV_PROMPT_LIMIT = assignment?.applicationQuota ?? 10;

  const CV_STYLES: Record<CvStyle, { name: string; desc: string }> = {
    modern:  { name: "Modern",  desc: "Teal accents · sans-serif" },
    classic: { name: "Classic", desc: "Traditional · serif fonts" },
    minimal: { name: "Minimal", desc: "Clean · grey tones" },
  };

  const buildPdfHtml = (content: string, style: CvStyle): string => {
    const css: Record<CvStyle, string> = {
      modern: `body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#1e293b;margin:0;background:#fff}.w{max-width:780px;margin:0 auto;padding:48px 56px}h1{color:#0891b2;font-size:22px;font-weight:700;letter-spacing:1px;margin:0 0 4px}h2{color:#0891b2;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid #e0f7fa;padding-bottom:4px;margin:20px 0 10px}p,li{font-size:13.5px;line-height:1.75;margin-bottom:4px}ul,ol{padding-left:20px}strong{color:#0f172a}`,
      classic: `body{font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;margin:0;background:#fff}.w{max-width:780px;margin:0 auto;padding:48px 56px}h1{font-size:22px;text-align:center;color:#1a1a1a!important;border-bottom:2px solid #1a1a1a;padding-bottom:10px;margin-bottom:6px}h2{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#1a1a1a!important;border-bottom:1px solid #aaa!important;padding-bottom:3px;margin:20px 0 10px}p,li{font-size:13.5px;line-height:1.8;margin-bottom:4px}ul,ol{padding-left:20px}`,
      minimal: `body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#374151;margin:0;background:#fff}.w{max-width:780px;margin:0 auto;padding:56px 64px}h1{font-size:20px;font-weight:600;color:#111827!important;letter-spacing:-0.5px;margin-bottom:4px}h2{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#9ca3af!important;border-bottom:none!important;margin:24px 0 10px;padding-bottom:0}p,li{font-size:13.5px;line-height:1.75;color:#4b5563;margin-bottom:4px}ul,ol{padding-left:20px}`,
    };
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{box-sizing:border-box}${css[style]}</style></head><body><div class="w">${content}</div></body></html>`;
  };

  const buildInitialCv = () => {
    if (!candidate) return "";
    const o = candidate.onboarding ?? {};
    const h2 = (text: string) => `<h2 style="color:#00bcd4;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid #00bcd433;padding-bottom:4px;margin:20px 0 10px">${text}</h2>`;
    const name = candidate.fullName.toUpperCase();
    const contactParts = [o.phone, o.applicationEmail ?? candidate.email, o.linkedin, o.address].filter(Boolean);
    const contact = `<p style="font-size:12px;color:#94a3b8;margin:4px 0 0">${contactParts.join("  ·  ")}</p>`;
    const yearsExp = o.yearsExperience ? parseInt(o.yearsExperience) : null;
    const summary = (o.currentJobTitle || o.careerGoal) ? `${h2("Professional Summary")}<p style="font-size:13px;line-height:1.7;color:#cbd5e1">${o.currentJobTitle ? `${o.currentJobTitle}${o.currentField ? ` specialising in ${o.currentField}` : ""}${yearsExp ? ` with ${yearsExp} years of experience` : ""}.` : ""} ${o.careerGoal ?? ""} ${o.openToRelocation === "Yes" ? "Open to relocation." : ""}</p>` : "";
    const skills = o.topSkills ? `${h2("Core Skills")}<ul style="columns:2;font-size:13px;color:#cbd5e1;padding-left:16px;line-height:1.8">${o.topSkills.split(",").map(s => `<li>${s.trim()}</li>`).join("")}</ul>` : "";
    const certs = o.certifications ? `${h2("Certifications")}<p style="font-size:13px;color:#cbd5e1">${o.certifications}</p>` : "";
    const experience = o.currentJobTitle ? `${h2("Work Experience")}<div style="margin-bottom:12px"><p style="font-size:13px;font-weight:600;color:#e2e8f0;margin:0">${o.currentJobTitle}${o.currentEmployer ? ` <span style="font-weight:400;color:#94a3b8">· ${o.currentEmployer}</span>` : ""}</p><p style="font-size:11px;color:#64748b;margin:2px 0 6px">${o.currentField ?? ""}${o.currentSalary ? ` · ${o.currentSalary}` : ""}  ·  Present</p><ul style="font-size:13px;color:#cbd5e1;padding-left:16px;line-height:1.8">${(o.topSkills ?? "").split(",").slice(0, 5).filter(Boolean).map(s => `<li>Hands-on experience with ${s.trim()}</li>`).join("")}${o.noticePeriod ? `<li>Notice period: ${o.noticePeriod}</li>` : ""}</ul></div>` : "";
    const education = o.university ? `${h2("Education")}<p style="font-size:13px;font-weight:600;color:#e2e8f0;margin:0">${o.degreeTitle ?? o.highestStudy ?? "Degree"}</p><p style="font-size:12px;color:#94a3b8;margin:2px 0">${o.university}${o.universityLocation ? `, ${o.universityLocation}` : ""}</p>` : "";
    const goals = (o.targetRoles || o.preferredLocation || o.preferredSalary) ? `${h2("Career Preferences")}<ul style="font-size:13px;color:#cbd5e1;padding-left:16px;line-height:1.8">${o.targetRoles ? `<li><strong>Target roles:</strong> ${o.targetRoles}</li>` : ""}${o.targetIndustries ? `<li><strong>Industries:</strong> ${o.targetIndustries}</li>` : ""}${o.preferredLocation ? `<li><strong>Location:</strong> ${o.preferredLocation}</li>` : ""}${o.preferredSalary ? `<li><strong>Target salary:</strong> ${o.preferredSalary}</li>` : ""}${o.employmentType ? `<li><strong>Employment type:</strong> ${o.employmentType}</li>` : ""}</ul>` : "";
    const languages = (o.germanLevel || o.drivingLicense) ? `${h2("Languages & Other")}<ul style="font-size:13px;color:#cbd5e1;padding-left:16px;line-height:1.8">${o.germanLevel ? `<li>German — ${o.germanLevel}</li>` : ""}${o.drivingLicense ? `<li>Driving licence: ${o.drivingLicense}</li>` : ""}</ul>` : "";
    return `<div style="font-family:system-ui,sans-serif"><h1 style="color:#00bcd4;font-size:22px;font-weight:700;margin:0 0 2px;letter-spacing:1px">${name}</h1>${contact}${summary}${experience}${education}${skills}${certs}${goals}${languages}</div>`;
  };

  const loadCvTree = (): CvTree => {
    try {
      const stored = cvTreeKey ? localStorage.getItem(cvTreeKey) : null;
      if (stored) return JSON.parse(stored);
      // Migrate from old flat format if present
      const oldStored = id ? localStorage.getItem(`arbeitly_cv_${id}`) : null;
      const initialContent = oldStored
        ? (JSON.parse(oldStored)[0]?.content ?? buildInitialCv())
        : buildInitialCv();
      return { original: { content: initialContent, createdAt: candidate?.signedUpAt ?? new Date().toISOString() }, versions: [] };
    } catch {
      return { original: { content: buildInitialCv(), createdAt: new Date().toISOString() }, versions: [] };
    }
  };

  const [cvTree, setCvTree] = useState<CvTree>(loadCvTree);
  const [activeNode, setActiveNode] = useState<ActiveNode>({ type: "original" });
  const [cvEditorContent, setCvEditorContent] = useState<string>(() => loadCvTree().original.content);
  const cvEditorRef = useRef<HTMLDivElement>(null);
  const [expandedVersionIds, setExpandedVersionIds] = useState<Set<string>>(new Set());

  const [enhanceOpen, setEnhanceOpen] = useState(false);
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceSaveName, setEnhanceSaveName] = useState("");
  const [enhanceSaveType, setEnhanceSaveType] = useState<"version" | "variant">("version");
  const [enhanceSaveParentId, setEnhanceSaveParentId] = useState<string>("");
  const [promptsUsed, setPromptsUsed] = useState<number>(() => {
    try { return cvPromptsKey ? parseInt(localStorage.getItem(cvPromptsKey) ?? "0", 10) : 0; }
    catch { return 0; }
  });

  const [newVersionDialog, setNewVersionDialog] = useState(false);
  const [newVersionName, setNewVersionName] = useState("");
  const [newVersionStyle, setNewVersionStyle] = useState<CvStyle>("modern");
  const [newVariantDialog, setNewVariantDialog] = useState(false);
  const [newVariantName, setNewVariantName] = useState("");
  const [newVariantStyle, setNewVariantStyle] = useState<CvStyle>("modern");
  const [newVariantForVersionId, setNewVariantForVersionId] = useState<string | null>(null);
  const [enhanceSaveStyle, setEnhanceSaveStyle] = useState<CvStyle>("modern");

  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [pdfPreviewTitle, setPdfPreviewTitle] = useState("");
  const [pdfPreviewHtml, setPdfPreviewHtml] = useState("");

  const openPdfPreview = (title: string, content: string, style: CvStyle) => {
    setPdfPreviewTitle(title);
    setPdfPreviewHtml(buildPdfHtml(content, style));
    setPdfPreviewOpen(true);
  };

  const saveCvTree = (tree: CvTree) => {
    setCvTree(tree);
    if (cvTreeKey) localStorage.setItem(cvTreeKey, JSON.stringify(tree));
  };

  const getNodeContent = (tree: CvTree, node: ActiveNode): string => {
    if (node.type === "original") return tree.original.content;
    if (node.type === "version") return tree.versions.find((v) => v.id === node.versionId)?.content ?? "";
    const ver = tree.versions.find((v) => v.id === node.versionId);
    return ver?.variants.find((vr) => vr.id === node.variantId)?.content ?? "";
  };

  const getActiveLabel = (): string => {
    if (activeNode.type === "original") return "Original Upload";
    if (activeNode.type === "version") return cvTree.versions.find((v) => v.id === activeNode.versionId)?.label ?? "";
    const ver = cvTree.versions.find((v) => v.id === activeNode.versionId);
    return ver?.variants.find((vr) => vr.id === activeNode.variantId)?.label ?? "";
  };

  const switchToNode = (node: ActiveNode, tree?: CvTree) => {
    const content = getNodeContent(tree ?? cvTree, node);
    setActiveNode(node);
    setCvEditorContent(content);
    if (cvEditorRef.current) cvEditorRef.current.innerHTML = content;
  };

  const handleSaveVersion = () => {
    const newContent = cvEditorRef.current?.innerHTML ?? cvEditorContent;
    const updated = { ...cvTree };
    if (activeNode.type === "original") {
      updated.original = { ...updated.original, content: newContent };
    } else if (activeNode.type === "version") {
      updated.versions = updated.versions.map((v) => v.id === activeNode.versionId ? { ...v, content: newContent } : v);
    } else if (activeNode.type === "variant") {
      updated.versions = updated.versions.map((v) =>
        v.id === activeNode.versionId
          ? { ...v, variants: v.variants.map((vr) => vr.id === activeNode.variantId ? { ...vr, content: newContent } : vr) }
          : v
      );
    }
    saveCvTree(updated);
    toast({ title: "Saved" });
  };

  const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const handleDeleteVersion = (versionId: string) => {
    const updated = { ...cvTree, versions: cvTree.versions.filter((v) => v.id !== versionId) };
    saveCvTree(updated);
    if (activeNode.type !== "original" && (activeNode as { versionId: string }).versionId === versionId) {
      switchToNode({ type: "original" }, updated);
    }
    toast({ title: "Version deleted" });
  };

  const handleDeleteVariant = (versionId: string, variantId: string) => {
    const updated = {
      ...cvTree,
      versions: cvTree.versions.map((v) =>
        v.id === versionId ? { ...v, variants: v.variants.filter((vr) => vr.id !== variantId) } : v
      ),
    };
    saveCvTree(updated);
    if (activeNode.type === "variant" && activeNode.variantId === variantId) {
      switchToNode({ type: "version", versionId }, updated);
    }
    toast({ title: "Variant deleted" });
  };

  const handleAddVersion = () => {
    if (!newVersionName.trim()) return;
    const baseContent = cvEditorRef.current?.innerHTML ?? cvEditorContent;
    const letter = LETTERS[cvTree.versions.length % 26];
    const newVer: CvVersion = {
      id: `ver_${Date.now()}`, letter, name: newVersionName.trim(),
      label: newVersionName.trim(), style: newVersionStyle,
      content: baseContent, createdAt: new Date().toISOString(), isAiEnhanced: false, variants: [],
    };
    const updated = { ...cvTree, versions: [...cvTree.versions, newVer] };
    saveCvTree(updated);
    setExpandedVersionIds((prev) => new Set([...prev, newVer.id]));
    switchToNode({ type: "version", versionId: newVer.id }, updated);
    setNewVersionDialog(false); setNewVersionName(""); setNewVersionStyle("modern");
    toast({ title: `${newVer.label} created` });
  };

  const handleAddVariant = () => {
    if (!newVariantName.trim() || !newVariantForVersionId) return;
    const ver = cvTree.versions.find((v) => v.id === newVariantForVersionId);
    if (!ver) return;
    const baseContent = activeNode.type !== "original" && (activeNode as { versionId: string }).versionId === newVariantForVersionId
      ? (cvEditorRef.current?.innerHTML ?? cvEditorContent)
      : ver.content;
    const newVariant: CvVariant = {
      id: `var_${Date.now()}`, name: newVariantName.trim(),
      label: `${ver.name} - ${newVariantName.trim()}`, style: newVariantStyle,
      content: baseContent, createdAt: new Date().toISOString(), isAiEnhanced: false,
    };
    const updated = { ...cvTree, versions: cvTree.versions.map((v) => v.id === newVariantForVersionId ? { ...v, variants: [...v.variants, newVariant] } : v) };
    saveCvTree(updated);
    setExpandedVersionIds((prev) => new Set([...prev, newVariantForVersionId]));
    switchToNode({ type: "variant", versionId: newVariantForVersionId, variantId: newVariant.id }, updated);
    setNewVariantDialog(false); setNewVariantName(""); setNewVariantStyle("modern"); setNewVariantForVersionId(null);
    toast({ title: `${newVariant.label} created` });
  };

  const execCmd = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    cvEditorRef.current?.focus();
  };

  const openEnhanceModal = () => {
    // Smart defaults: if versions exist, default to variant under first version; otherwise version
    if (cvTree.versions.length > 0) {
      setEnhanceSaveType("variant");
      setEnhanceSaveParentId(cvTree.versions[0].id);
    } else {
      setEnhanceSaveType("version");
      setEnhanceSaveParentId("");
    }
    setEnhanceSaveName("");
    setUseCustomPrompt(false);
    setCustomPrompt("");
    setEnhanceOpen(true);
  };

  const handleEnhance = async () => {
    if (!enhanceSaveName.trim()) return;
    if (enhanceSaveType === "variant" && !enhanceSaveParentId) return;
    if (promptsUsed >= CV_PROMPT_LIMIT) {
      toast({ title: "Prompt limit reached", variant: "destructive" });
      return;
    }
    setIsEnhancing(true);
    await new Promise((r) => setTimeout(r, 2000));
    const currentContent = cvEditorRef.current?.innerHTML ?? cvEditorContent;
    const enhanced = currentContent + `\n<p style="font-style:italic;color:#00bcd4;font-size:11px;margin-top:16px">✦ Enhanced by Arbeitly AI${useCustomPrompt && customPrompt ? ` · "${customPrompt.slice(0, 40)}…"` : ""}</p>`;
    const updated = { ...cvTree };
    const name = enhanceSaveName.trim();

    if (enhanceSaveType === "version") {
      const letter = LETTERS[cvTree.versions.length % 26];
      const newVer: CvVersion = {
        id: `ver_${Date.now()}`, letter, name, label: name, style: enhanceSaveStyle,
        content: enhanced, createdAt: new Date().toISOString(), isAiEnhanced: true, variants: [],
      };
      updated.versions = [...updated.versions, newVer];
      saveCvTree(updated);
      setExpandedVersionIds((prev) => new Set([...prev, newVer.id]));
      switchToNode({ type: "version", versionId: newVer.id }, updated);
      toast({ title: `"${name}" created` });
    } else {
      const newVariant: CvVariant = {
        id: `var_${Date.now()}`, name, label: name, style: enhanceSaveStyle,
        content: enhanced, createdAt: new Date().toISOString(), isAiEnhanced: true,
      };
      updated.versions = updated.versions.map((v) =>
        v.id === enhanceSaveParentId ? { ...v, variants: [...v.variants, newVariant] } : v
      );
      saveCvTree(updated);
      setExpandedVersionIds((prev) => new Set([...prev, enhanceSaveParentId]));
      switchToNode({ type: "variant", versionId: enhanceSaveParentId, variantId: newVariant.id }, updated);
      toast({ title: `"${name}" saved under ${cvTree.versions.find((v) => v.id === enhanceSaveParentId)?.name}` });
    }

    const newCount = promptsUsed + 1;
    setPromptsUsed(newCount);
    if (cvPromptsKey) localStorage.setItem(cvPromptsKey, String(newCount));
    setIsEnhancing(false);
    setEnhanceOpen(false);
    setEnhanceSaveStyle("modern");
  };

  // ── Cover Letter state ──
  const clTreeKey = id ? `arbeitly_cl_tree_${id}` : null;
  type ClTree = { original: { content: string; createdAt: string } | null; versions: CvVersion[] };
  const loadClTree = (): ClTree => {
    try { const s = clTreeKey ? localStorage.getItem(clTreeKey) : null; return s ? JSON.parse(s) : { original: null, versions: [] }; }
    catch { return { original: null, versions: [] }; }
  };
  const [clTree, setClTree] = useState<ClTree>(loadClTree);
  const saveClTree = (t: ClTree) => { setClTree(t); if (clTreeKey) localStorage.setItem(clTreeKey, JSON.stringify(t)); };

  const [clJD, setClJD] = useState("");
  const [clUrl, setClUrl] = useState("");
  const [clTab, setClTab] = useState("paste");
  const [clTone, setClTone] = useState("Professional");
  const [clLang, setClLang] = useState("english");
  const [clText, setClText] = useState("");
  const [clGenerating, setClGenerating] = useState(false);
  const [clExtracting, setClExtracting] = useState(false);
  const [clSaveVersionDialog, setClSaveVersionDialog] = useState(false);
  const [clSaveVersionName, setClSaveVersionName] = useState("");
  const [clSaveVersionStyle, setClSaveVersionStyle] = useState<CvStyle>("modern");

  const textToHtml = (text: string) =>
    `<div>${text.split("\n\n").map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`).join("")}</div>`;

  const candidateName = candidate?.fullName ?? "the candidate";
  const handleClExtract = async () => {
    if (!clUrl.trim()) return; setClExtracting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setClJD("Senior Frontend Developer at Example Corp\n\nRequirements:\n- React & TypeScript\n- State management\n- German B2+");
    setClExtracting(false); setClTab("paste");
    toast({ title: "Extracted", description: "Job description extracted" });
  };
  const handleClGenerate = async () => {
    if (!clJD.trim()) { toast({ title: "Missing info", description: "Please provide a job description", variant: "destructive" }); return; }
    setClGenerating(true); await new Promise((r) => setTimeout(r, 2000));
    const generated = `Dear Hiring Manager,\n\nI am writing on behalf of ${candidateName} to express their strong interest in the Senior Frontend Developer position at Example Corp. With their background in ${candidate?.onboarding?.currentField ?? "technology"} and ${candidate?.onboarding?.yearsExperience ?? "several"} years of experience, they are well-positioned to contribute to your team.\n\nIn their current role at ${candidate?.onboarding?.currentEmployer ?? "their current employer"}, they have developed deep expertise in modern frontend technologies. Their proficiency aligns well with your requirements for React, TypeScript, and state management.\n\n${candidate?.onboarding?.germanLevel ? `Their German language level (${candidate.onboarding.germanLevel}) meets your requirements.` : ""}\n\nI look forward to discussing how ${candidateName.split(" ")[0]} can contribute to your team.\n\nBest regards,\n${currentEmployee?.fullName ?? "The Recruitment Team"}`;
    setClText(generated);
    // Auto-save as original if none exists
    if (!clTree.original) {
      saveClTree({ ...clTree, original: { content: textToHtml(generated), createdAt: new Date().toISOString() } });
    }
    setClGenerating(false);
    toast({ title: "Cover Letter Generated!", description: "Personalised cover letter ready" });
  };
  const handleClSaveVersion = () => {
    if (!clSaveVersionName.trim() || !clText.trim()) return;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const letter = letters[clTree.versions.length] ?? String(clTree.versions.length + 1);
    const newVersion: CvVersion = {
      id: `clv_${Date.now()}`, letter, name: clSaveVersionName.trim(),
      label: `${letter} — ${clSaveVersionName.trim()}`, content: textToHtml(clText),
      createdAt: new Date().toISOString(), isAiEnhanced: true,
      style: clSaveVersionStyle, variants: [],
    };
    saveClTree({ ...clTree, versions: [newVersion, ...clTree.versions] });
    setClSaveVersionDialog(false);
    setClSaveVersionName("");
    toast({ title: `Cover Letter saved as "${newVersion.name}"` });
  };

  // ── Files state ──
  const filesKey = id ? `arbeitly_files_${id}` : null;
  const loadFiles = (): StoredFile[] => {
    try { const s = filesKey ? localStorage.getItem(filesKey) : null; return s ? JSON.parse(s) : []; }
    catch { return []; }
  };
  const [files, setFiles] = useState<StoredFile[]>(loadFiles);
  const filesInputRef = useRef<HTMLInputElement>(null);
  const saveFiles = (u: StoredFile[]) => { setFiles(u); if (filesKey) localStorage.setItem(filesKey, JSON.stringify(u)); };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newFile: StoredFile = {
      id: `file_${Date.now()}`, name: file.name,
      size: file.size > 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`,
      type: file.name.split(".").pop()?.toUpperCase() ?? "FILE",
      uploadedBy: "employee", uploadedAt: new Date().toISOString(),
    };
    saveFiles([newFile, ...files]);
    toast({ title: "File added", description: `${file.name} added to files` });
    e.target.value = "";
  };

  // ── Job Discovery state ──
  type DiscoveredJob = {
    id: string; title: string; company: string; location: string;
    salary?: string; jobType: string; description: string; source?: string;
    postedAt: string; matchScore: number; matchReasons: string[];
    inQueue?: boolean; isDuplicate?: boolean; duplicateGroupId?: string;
    skipped?: boolean; skipReason?: string;
    generatedCv?: string; generatedCoverLetter?: string;
  };

  const SKIP_REASONS = [
    "Irrelevant role",
    "Low quality listing",
    "Duplicate / already tracked",
    "Visa / location mismatch",
    "Salary below target",
    "Other",
  ] as const;

  const buildCvForJob = (title: string, company: string, location: string): string => {
    const o = candidate?.onboarding ?? {};
    const name = candidate?.fullName ?? "Candidate";
    const contact = [o.applicationEmail ?? candidate?.email, o.phone, o.linkedin].filter(Boolean).join("  ·  ");
    const skills = (o.topSkills ?? o.currentField ?? "Communication, Analytical thinking").split(",").map((s: string) => s.trim()).filter(Boolean);
    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    return [
      `TAILORED CV — ${title.toUpperCase()} AT ${company.toUpperCase()}`,
      `Generated: ${today}`,
      "─".repeat(56), "",
      name.toUpperCase(),
      contact,
      o.address || o.preferredLocation || location,
      "", "─".repeat(56), "PROFESSIONAL SUMMARY", "─".repeat(56),
      `${o.currentJobTitle ?? "Professional"} with ${o.yearsExperience ?? "3"}+ years in ${o.currentField ?? "their field"}, applying for ${title} at ${company}.${o.germanLevel ? ` German: ${o.germanLevel}.` : ""}${o.openToRelocation === "Yes" ? " Open to relocation." : ""}`,
      "", "─".repeat(56), "KEY SKILLS", "─".repeat(56),
      ...skills.map((s: string) => `• ${s}`),
      ...(o.certifications ? [`• Certifications: ${o.certifications}`] : []),
      "", "─".repeat(56), "PROFESSIONAL EXPERIENCE", "─".repeat(56),
      `${o.currentJobTitle ?? "Role"} — ${o.currentEmployer ?? "Current Employer"}  (Present)`,
      `• ${o.currentField ?? "Field"} specialist with ${o.yearsExperience ?? "3"}+ years of experience`,
      `• Core skills: ${skills.slice(0, 3).join(", ")}`,
      ...(o.noticePeriod ? [`• Notice period: ${o.noticePeriod}`] : []),
      "", "─".repeat(56), "EDUCATION", "─".repeat(56),
      `${o.degreeTitle ?? "Degree"}${o.university ? ` — ${o.university}` : ""}${o.universityLocation ? `, ${o.universityLocation}` : ""}`,
      `Level: ${o.highestStudy ?? "University"}`,
      "", "─".repeat(56), "LANGUAGES & OTHER", "─".repeat(56),
      `• German: ${o.germanLevel ?? "B2"}`,
      ...(o.drivingLicense ? [`• Driving license: ${o.drivingLicense}`] : []),
      ...(o.preferredSalary ? [`• Salary expectation: ${o.preferredSalary}`] : []),
    ].join("\n");
  };

  const buildClForJob = (title: string, company: string, location: string): string => {
    const o = candidate?.onboarding ?? {};
    const name = candidate?.fullName ?? "Candidate";
    const email = o.applicationEmail ?? candidate?.email ?? "";
    const skills = (o.topSkills ?? o.currentField ?? "analytical thinking, communication").split(",").map((s: string) => s.trim()).filter(Boolean);
    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    return [
      name, o.address || o.preferredLocation || location, today, "",
      "Hiring Manager", company, location, "",
      `Subject: Application for ${title}`, "",
      "Dear Hiring Manager,", "",
      `I am writing to express my sincere interest in the ${title} position at ${company}. With ${o.yearsExperience ?? "several"} years of experience in ${o.currentField ?? "my field"}, I am confident I can make a meaningful contribution to your team.`,
      "",
      `Currently serving as ${o.currentJobTitle ?? "a professional"} at ${o.currentEmployer ?? "my current organisation"}, I have built strong expertise in ${skills.slice(0, 3).join(", ")}.${o.careerGoal ? ` My long-term goal is to ${o.careerGoal.toLowerCase()}, which resonates with the work being done at ${company}.` : ""}`,
      "",
      `${o.germanLevel ? `I am proficient in German (${o.germanLevel}), enabling me to contribute in a German-language environment. ` : ""}${o.openToRelocation === "Yes" ? "I am fully open to relocation." : `I am based in ${o.preferredLocation ?? location} and available with ${o.noticePeriod ?? "a standard notice period"}.`}`,
      "",
      "I would welcome the opportunity to discuss how my background aligns with your needs. Please find my CV attached.",
      "", "Thank you for your time and consideration.", "",
      "Kind regards,", name, email,
    ].join("\n");
  };

  const detectDuplicates = (jobs: DiscoveredJob[]): DiscoveredJob[] => {
    const groups = new Map<string, string[]>();
    jobs.forEach((j) => {
      const key = `${j.company.trim().toLowerCase()}|||${j.title.trim().toLowerCase()}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(j.id);
    });
    return jobs.map((j) => {
      const key = `${j.company.trim().toLowerCase()}|||${j.title.trim().toLowerCase()}`;
      const group = groups.get(key) ?? [];
      if (group.length > 1) return { ...j, isDuplicate: true, duplicateGroupId: key };
      return { ...j, isDuplicate: false, duplicateGroupId: undefined };
    });
  };

  const jobsKey = id ? `arbeitly_jobs_${id}` : null;

  const generateJobs = (): DiscoveredJob[] => {
    if (!candidate) return [];
    const o = candidate.onboarding ?? {};
    const location = o.preferredLocation ?? "Germany";
    const field = o.currentField ?? "Technology";
    const rawTarget = o.targetRoles ?? o.currentJobTitle ?? "Professional";
    const targetRoles = rawTarget.split(",").map((r) => r.trim()).filter(Boolean).slice(0, 3);
    const targetSalary = parseInt((o.preferredSalary ?? "€60,000").replace(/[^0-9]/g, "")) || 60000;
    const yoe = parseInt(o.yearsExperience ?? "3") || 3;

    const companyPools: Record<string, string[]> = {
      Technology:  ["Personio", "Celonis", "N26", "Delivery Hero", "HelloFresh", "Zalando Tech", "FlixMobility", "Contentful", "SumUp", "Adjust"],
      Finance:     ["Deutsche Bank", "Commerzbank", "DWS Group", "KPMG Germany", "Deloitte Frankfurt", "BNP Paribas", "ING Germany", "Union Investment", "DZ BANK", "Helaba"],
      Marketing:   ["Henkel AG", "Metro AG", "Vodafone Germany", "Trivago", "REWE Group", "Peek & Cloppenburg", "C&A Europe", "Uniper SE", "ALDI Nord", "Douglas"],
      default:     ["Siemens AG", "SAP SE", "Bosch GmbH", "Bayer AG", "BASF SE", "Volkswagen", "Lufthansa Group", "Allianz", "BMW Group", "Deutsche Telekom"],
    };
    const companies = companyPools[field] ?? companyPools.default;

    const descTemplates = [
      (role: string, co: string) => `${co} is looking for an experienced ${role} to join our growing team in ${location}. You will work closely with cross-functional teams to drive impactful outcomes. ${yoe}+ years of relevant experience required. Strong communication skills and proficiency in relevant tools expected.`,
      (role: string, co: string) => `Join ${co} as a ${role} and help shape the future of ${field}. You'll be responsible for strategic planning, stakeholder management, and delivering high-quality results. We offer a collaborative culture, flexible working, and a competitive package.`,
      (role: string, co: string) => `${co} seeks a motivated ${role} to complement our ${location}-based team. The ideal candidate has a solid background in ${field} and a passion for continuous learning. We value ownership, innovation, and teamwork.`,
    ];

    const jobs: DiscoveredJob[] = [];
    const shuffledCompanies = [...companies].sort(() => Math.random() - 0.5);
    let ci = 0;

    const reasonPool = [
      "Role matches target position", `Experience level aligned (${yoe}+ yrs)`, `Location match (${location})`,
      `Field match (${field})`, "Salary within target range", "Company size preference met",
      `German level (${o.germanLevel ?? "B2"}) meets requirement`, "Skills overlap detected",
    ];

    targetRoles.forEach((role, ri) => {
      const score1 = Math.min(98, 78 + Math.floor(Math.random() * 20) + (ri === 0 ? 5 : 0));
      const score2 = Math.min(95, 62 + Math.floor(Math.random() * 22));
      const score3 = Math.min(85, 50 + Math.floor(Math.random() * 24));
      const salLow = Math.round(targetSalary * 0.92 / 1000) * 1000;
      const salHigh = Math.round(targetSalary * 1.12 / 1000) * 1000;
      const salHigh2 = Math.round(targetSalary * 1.2 / 1000) * 1000;

      const co0 = shuffledCompanies[ci++ % companies.length];
      const co1 = shuffledCompanies[ci++ % companies.length];
      const co2 = shuffledCompanies[ci++ % companies.length];
      const t0 = role; const t1 = `Senior ${role}`; const t2 = `${role} (Remote)`;
      const loc2 = "Remote / Germany";
      jobs.push(
        { id: `job_${ri}_0`, title: t0, company: co0, location, salary: `€${salLow.toLocaleString()} – €${salHigh.toLocaleString()}`, jobType: "Full-time", description: descTemplates[0](t0, co0), postedAt: new Date(Date.now() - 2 * 86400000).toISOString(), matchScore: score1, matchReasons: reasonPool.slice(0, 4).sort(() => Math.random() - 0.5).slice(0, 3), generatedCv: buildCvForJob(t0, co0, location), generatedCoverLetter: buildClForJob(t0, co0, location) },
        { id: `job_${ri}_1`, title: t1, company: co1, location, salary: `€${salHigh.toLocaleString()} – €${salHigh2.toLocaleString()}`, jobType: "Full-time", description: descTemplates[1](t1, co1), postedAt: new Date(Date.now() - 5 * 86400000).toISOString(), matchScore: score2, matchReasons: reasonPool.slice(2, 6).sort(() => Math.random() - 0.5).slice(0, 3), generatedCv: buildCvForJob(t1, co1, location), generatedCoverLetter: buildClForJob(t1, co1, location) },
        { id: `job_${ri}_2`, title: t2, company: co2, location: loc2, salary: `€${salLow.toLocaleString()} – €${salHigh.toLocaleString()}`, jobType: "Remote", description: descTemplates[2](t2, co2), postedAt: new Date(Date.now() - 9 * 86400000).toISOString(), matchScore: score3, matchReasons: reasonPool.slice(1, 5).sort(() => Math.random() - 0.5).slice(0, 3), generatedCv: buildCvForJob(t2, co2, loc2), generatedCoverLetter: buildClForJob(t2, co2, loc2) },
      );
    });

    return jobs.sort((a, b) => b.matchScore - a.matchScore).slice(0, 12);
  };

  const loadJobs = (): DiscoveredJob[] => {
    try {
      const stored = jobsKey ? localStorage.getItem(jobsKey) : null;
      if (stored) return JSON.parse(stored);
      const seeded = generateJobs();
      if (jobsKey) localStorage.setItem(jobsKey, JSON.stringify(seeded));
      return seeded;
    } catch { return []; }
  };

  const [discoveredJobs, setDiscoveredJobs] = useState<DiscoveredJob[]>(loadJobs);
  const [jobsRefreshing, setJobsRefreshing] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [expandedJobTab, setExpandedJobTab] = useState<Record<string, "desc" | "cv" | "cl">>({});
  const [jobScoreFilter, setJobScoreFilter] = useState<"all" | "high" | "medium">("all");
  const [showSkipped, setShowSkipped] = useState(false);
  const [skipDialog, setSkipDialog] = useState<{ open: boolean; job: DiscoveredJob | null }>({ open: false, job: null });
  const [skipReason, setSkipReason] = useState<string>(SKIP_REASONS[0]);

  const handleSaveDocToFiles = (job: DiscoveredJob, type: "cv" | "cl") => {
    const content = type === "cv" ? job.generatedCv : job.generatedCoverLetter;
    if (!content) return;
    const label = type === "cv" ? "Tailored CV" : "Cover Letter";
    const fileName = `${label} — ${job.title} @ ${job.company}.txt`;
    if (files.some((f) => f.name === fileName)) {
      toast({ title: "Already saved", description: `${fileName} is already in files` });
      return;
    }
    const newFile: StoredFile = {
      id: `file_${type}_${job.id}_${Date.now()}`,
      name: fileName,
      size: `${Math.max(1, Math.ceil(content.length / 1024))} KB`,
      type: "TXT",
      uploadedBy: "employee",
      uploadedAt: new Date().toISOString(),
    };
    saveFiles([newFile, ...files]);
    toast({ title: "Saved to Files", description: fileName });
  };

  const saveJobs = (jobs: DiscoveredJob[]) => { setDiscoveredJobs(jobs); if (jobsKey) localStorage.setItem(jobsKey, JSON.stringify(jobs)); };

  const handleRefreshJobs = async () => {
    setJobsRefreshing(true);
    await new Promise((r) => setTimeout(r, 1800));
    const sources = ["LinkedIn", "Indeed", "StepStone", "Xing"];
    const fresh = generateJobs().slice(0, 3).map((j, i) => ({
      ...j,
      id: `job_ref_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      source: sources[i % sources.length],
    }));
    const stacked = [...fresh, ...discoveredJobs].slice(0, 20);
    saveJobs(detectDuplicates(stacked));
    setJobsRefreshing(false);
    toast({ title: "Jobs refreshed", description: `${fresh.length} new positions added` });
  };

  const handleAddToQueue = (job: DiscoveredJob) => {
    // Clear duplicate flags for the whole group when one is actioned
    const updated = discoveredJobs.map((j) => {
      if (j.id === job.id) return { ...j, inQueue: true, isDuplicate: false };
      if (job.duplicateGroupId && j.duplicateGroupId === job.duplicateGroupId) return { ...j, isDuplicate: false };
      return j;
    });
    saveJobs(updated);
    const newApp: BoardApp = {
      id: `app_${Date.now()}`, job: job.title, company: job.company,
      url: "", status: "to-apply", date: new Date().toISOString().split("T")[0],
      salary: job.salary ?? "", source: "platform",
      addedById: currentEmployee?.id ?? "employee",
      addedByName: currentEmployee?.fullName ?? "Advisor",
      seenByCandidate: false,
      notes: `Added from Job Discovery · Match score: ${job.matchScore}%`,
      nextAction: "", jobDescription: job.description, references: "", contactPerson: "",
    };
    saveApps([newApp, ...apps]);

    // Auto-save generated CV + cover letter to files
    const autoFiles: StoredFile[] = [];
    if (job.generatedCv) {
      const cvName = `Tailored CV — ${job.title} @ ${job.company}.txt`;
      if (!files.some((f) => f.name === cvName)) {
        autoFiles.push({ id: `file_cv_${job.id}`, name: cvName, size: `${Math.max(1, Math.ceil(job.generatedCv.length / 1024))} KB`, type: "TXT", uploadedBy: "employee", uploadedAt: new Date().toISOString() });
      }
    }
    if (job.generatedCoverLetter) {
      const clName = `Cover Letter — ${job.title} @ ${job.company}.txt`;
      if (!files.some((f) => f.name === clName)) {
        autoFiles.push({ id: `file_cl_${job.id}`, name: clName, size: `${Math.max(1, Math.ceil(job.generatedCoverLetter.length / 1024))} KB`, type: "TXT", uploadedBy: "employee", uploadedAt: new Date().toISOString() });
      }
    }
    if (autoFiles.length > 0) saveFiles([...autoFiles, ...files]);

    toast({ title: "Added to queue", description: `${job.title} at ${job.company} → To Apply${autoFiles.length > 0 ? " · CV & CL saved to Files" : ""}` });
  };

  const handleSkipJob = (job: DiscoveredJob, reason: string) => {
    const updated = discoveredJobs.map((j) => j.id === job.id ? { ...j, skipped: true, skipReason: reason } : j);
    saveJobs(updated);
    auditLog({
      userId: currentEmployee?.id ?? "employee",
      userName: currentEmployee?.fullName ?? "Employee",
      userType: "employee",
      action: "job_skipped",
      targetId: id,
      targetName: candidate?.fullName,
      detail: `Skipped: ${job.title} at ${job.company} · Reason: ${reason}`,
    });
    setSkipDialog({ open: false, job: null });
    setSkipReason(SKIP_REASONS[0]);
    toast({ title: "Job skipped", description: `${reason}` });
  };

  const filteredJobs = discoveredJobs.filter((j) => {
    if (!showSkipped && j.skipped) return false;
    if (jobScoreFilter === "high") return j.matchScore >= 75;
    if (jobScoreFilter === "medium") return j.matchScore >= 50 && j.matchScore < 75;
    return true;
  });
  const skippedCount = discoveredJobs.filter((j) => j.skipped).length;

  // ── Plan application limits — driven by assignment quota ──
  const planLimit = (candidate?.applicationQuota ?? assignment?.applicationQuota) ?? null;
  const appliedCount = candidate?.applicationsUsed ?? assignment?.applicationsUsed ?? apps.filter((a) => a.status === "applied" || a.status === "interview" || a.status === "accepted" || a.status === "rejected").length;
  const remaining = planLimit ? Math.max(0, planLimit - appliedCount) : null;

  // ── FAQ state ──
  const faqKey = id ? `arbeitly_faq_${id}` : null;
  const loadFaq = (): FaqItem[] => { try { const s = faqKey ? localStorage.getItem(faqKey) : null; return s ? JSON.parse(s) : []; } catch { return []; } };
  const [faqItems, setFaqItems] = useState<FaqItem[]>(loadFaq);
  const [faqDialog, setFaqDialog] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqForm, setFaqForm] = useState({ question: "", answer: "" });
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const saveFaq = (items: FaqItem[]) => { setFaqItems(items); if (faqKey) localStorage.setItem(faqKey, JSON.stringify(items)); };
  const openAddFaq = () => { setEditingFaqId(null); setFaqForm({ question: "", answer: "" }); setFaqDialog(true); };
  const openEditFaq = (f: FaqItem) => { setEditingFaqId(f.id); setFaqForm({ question: f.question, answer: f.answer }); setFaqDialog(true); };
  const handleSaveFaq = () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return;
    const empId = currentEmployee?.id ?? "employee"; const empName = currentEmployee?.fullName ?? "Employee";
    if (editingFaqId) {
      saveFaq(faqItems.map((f) => f.id === editingFaqId && !f.lockedByCandidate ? {
        ...f, answer: faqForm.answer, status: "pending" as FaqStatus,
        verifiedAt: undefined, verifiedById: undefined, verifiedByName: undefined,
        activity: [{ timestamp: new Date().toISOString(), userId: empId, userName: empName, userType: "employee" as const, action: "answer_updated" as const, previousAnswer: f.answer, newAnswer: faqForm.answer }, ...f.activity],
      } : f));
    } else {
      const newItem: FaqItem = {
        id: `faq_${Date.now()}`, question: faqForm.question.trim(), answer: faqForm.answer.trim(),
        status: "pending", createdAt: new Date().toISOString(), createdById: empId, createdByName: empName,
        activity: [{ timestamp: new Date().toISOString(), userId: empId, userName: empName, userType: "employee", action: "created" }],
      };
      saveFaq([newItem, ...faqItems]);
    }
    setFaqDialog(false);
  };
  const handleFaqApprove = (faqId: string) => {
    const empId = currentEmployee?.id ?? "employee"; const empName = currentEmployee?.fullName ?? "Employee";
    saveFaq(faqItems.map((f) => f.id === faqId ? {
      ...f, status: "approved" as FaqStatus, verifiedAt: new Date().toISOString(), verifiedById: empId, verifiedByName: empName,
      activity: [{ timestamp: new Date().toISOString(), userId: empId, userName: empName, userType: "employee" as const, action: "approved" as const }, ...f.activity],
    } : f));
  };
  const handleFaqUnverify = (faqId: string) => {
    const empId = currentEmployee?.id ?? "employee"; const empName = currentEmployee?.fullName ?? "Employee";
    saveFaq(faqItems.map((f) => f.id === faqId ? {
      ...f, status: "pending" as FaqStatus, verifiedAt: undefined, verifiedById: undefined, verifiedByName: undefined,
      activity: [{ timestamp: new Date().toISOString(), userId: empId, userName: empName, userType: "employee" as const, action: "unverified" as const }, ...f.activity],
    } : f));
  };

  // ── Credentials (read-only, set by candidate during onboarding) ──
  const [showJobPass, setShowJobPass] = useState(false);

  // ── Guard ──
  if (!candidate || !isAssigned) {
    return (
      <div className="space-y-4 p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/employee/internal/candidates")}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> My Candidates
        </Button>
        <p className="text-muted-foreground text-sm">{!candidate ? "Candidate not found." : "You don't have access to this candidate."}</p>
      </div>
    );
  }

  const ob = candidate.onboarding ?? {};

  const tabs: { key: TabKey; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "onboarding", label: "Onboarding" },
    { key: "applications", label: `Applications (${apps.length})` },
    { key: "cv", label: "CV" },
    { key: "cover-letter", label: "Cover Letter" },
    { key: "files", label: `Files${files.length ? ` (${files.length})` : ""}` },
    { key: "account", label: "Account" },
    { key: "job-discovery", label: "Job Discovery" },
    { key: "faq", label: `FAQ${faqItems.length ? ` (${faqItems.length})` : ""}` },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="sm" className="mt-0.5 shrink-0" onClick={() => navigate("/employee/internal/candidates")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> My Candidates
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-2xl font-bold text-foreground">{candidate.fullName}</h1>
            <Badge variant={candidate.status === "active" ? "default" : "secondary"} className="capitalize">{candidate.status}</Badge>
            <Badge variant="outline">{candidate.planName}</Badge>
          </div>
          {ob.currentJobTitle && (
            <p className="text-muted-foreground text-sm mt-0.5">{ob.currentJobTitle}{ob.currentEmployer ? ` · ${ob.currentEmployer}` : ""}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Signed Up</p>
          <p className="font-semibold text-sm mt-0.5">{format(new Date(candidate.signedUpAt), "dd MMM yyyy")}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Total Apps</p>
          <p className="font-semibold text-sm mt-0.5">{apps.length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Interviews</p>
          <p className="font-semibold text-sm mt-0.5 text-yellow-400">{byStatus("interview")}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Accepted</p>
          <p className="font-semibold text-sm mt-0.5 text-green-400">{byStatus("accepted")}</p>
        </CardContent></Card>
        <Card className={remaining !== null && remaining <= 2 ? "border-destructive/40" : ""}><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Plan Usage</p>
          {planLimit !== null ? (
            <div className="mt-1.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className={`font-semibold text-sm ${remaining === 0 ? "text-destructive" : remaining !== null && remaining <= 3 ? "text-yellow-400" : ""}`}>
                  {appliedCount}/{planLimit}
                </span>
                <span className="text-[10px] text-muted-foreground">{remaining} left</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className={`h-full rounded-full transition-all ${remaining === 0 ? "bg-destructive" : remaining !== null && remaining <= 3 ? "bg-yellow-400" : "bg-primary"}`}
                  style={{ width: `${Math.min(100, (appliedCount / planLimit) * 100)}%` }} />
              </div>
            </div>
          ) : (
            <p className="font-semibold text-sm mt-0.5 text-primary">Unlimited</p>
          )}
        </CardContent></Card>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0.5 border-b border-border overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${activeTab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── PROFILE ── */}
      {activeTab === "profile" && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card><CardContent className="p-5 space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Personal Details</p>
            <InfoRow icon={User} label="Full Name" value={candidate.fullName} />
            <InfoRow icon={Mail} label="Account Email" value={candidate.email} />
            <InfoRow icon={Mail} label="Application Email" value={ob.applicationEmail} />
            <InfoRow icon={Phone} label="Phone" value={ob.phone} />
            <InfoRow icon={MapPin} label="Address" value={ob.address} />
            <InfoRow icon={Linkedin} label="LinkedIn" value={ob.linkedin} />
            <InfoRow icon={Calendar} label="Date of Birth" value={ob.dob} />
          </CardContent></Card>

          <Card><CardContent className="p-5 space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account & Plan</p>
            <InfoRow icon={FileText} label="Plan" value={`${candidate.planName} — ${candidate.planPrice}`} />
            <InfoRow icon={Globe} label="Plan Type" value={candidate.planType === "paid" ? "Paid" : "Free"} />
            <InfoRow icon={CheckCircle} label="Status" value={candidate.status} />
            <InfoRow icon={Calendar} label="Account Created" value={format(new Date(candidate.signedUpAt), "dd MMM yyyy")} />
            {ob.preferredLocation && <InfoRow icon={MapPin} label="Preferred Location" value={ob.preferredLocation} />}
            {ob.preferredSalary && <InfoRow icon={Briefcase} label="Preferred Salary" value={ob.preferredSalary} />}
          </CardContent></Card>
        </div>
      )}

      {/* ── ONBOARDING ── */}
      {activeTab === "onboarding" && (
        <div className="space-y-5">
          {candidate.planType === "free" ? (
            <Card><CardContent className="p-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Marketing Questions</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5">
                <OBField label="Industry" value={ob.currentField} />
                <OBField label="Target Country" value={ob.preferredLocation} />
                <OBField label="How They Heard" value={ob.howHeard} />
              </div>
            </CardContent></Card>
          ) : Object.keys(ob).length > 0 ? (
            <>
              {[
                { title: "Personal", fields: [["First Name", ob.firstName], ["Last Name", ob.lastName], ["Application Email", ob.applicationEmail], ["Phone", ob.phone], ["LinkedIn", ob.linkedin], ["Date of Birth", ob.dob], ["Place of Birth", ob.placeOfBirth], ["Address", ob.address]] },
                { title: "Professional", fields: [["Job Title", ob.currentJobTitle], ["Employer", ob.currentEmployer], ["Field", ob.currentField], ["Years of Experience", ob.yearsExperience], ["Current Salary", ob.currentSalary], ["Worked in Germany", ob.workedInGermany], ["Notice Period", ob.noticePeriod], ["Education Level", ob.highestStudy], ["Degree", ob.degreeTitle], ["University", ob.university], ["University Location", ob.universityLocation]] },
                { title: "Career Goals", fields: [["Top Skills", ob.topSkills], ["Certifications", ob.certifications], ["Career Goal", ob.careerGoal], ["Target Roles", ob.targetRoles], ["Target Industries", ob.targetIndustries], ["Employment Type", ob.employmentType], ["Preferred Location", ob.preferredLocation], ["Open to Relocation", ob.openToRelocation], ["Preferred Salary", ob.preferredSalary], ["Target Companies", ob.targetCompanies], ["Open to Career Change", ob.openToCareerChange]] },
                { title: "Additional", fields: [["German Level", ob.germanLevel], ["Driving License", ob.drivingLicense], ["Transition Motivation", ob.transitionMotivation], ["Training Needs", ob.trainingNeeds], ["How They Heard", ob.howHeard], ["Additional Info", ob.additionalInfo]] },
              ].map((section) => {
                const filled = section.fields.filter(([, v]) => v) as [string, string][];
                if (!filled.length) return null;
                return (
                  <Card key={section.title}><CardContent className="p-6">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">{section.title}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-5">
                      {filled.map(([label, value]) => <OBField key={label} label={label} value={value} />)}
                    </div>
                  </CardContent></Card>
                );
              })}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
              <User className="h-8 w-8 opacity-30" /><p className="text-sm italic">Onboarding not yet completed.</p>
            </div>
          )}
        </div>
      )}

      {/* ── APPLICATIONS ── */}
      {activeTab === "applications" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search applications..." className="pl-9 h-9 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            {appView === "list" && (
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[155px] text-xs"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {allStatuses.map((s) => <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
            {/* View toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-border p-1">
              <Button variant={appView === "list" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setAppView("list")}>
                <List className="h-3.5 w-3.5" />
              </Button>
              <Button variant={appView === "kanban" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setAppView("kanban")}>
                <LayoutGrid className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs" onClick={handleDownloadTemplate}>
                <Download className="h-3.5 w-3.5" /> Template
              </Button>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs" onClick={() => importRef.current?.click()}>
                <FileUp className="h-3.5 w-3.5" /> Import
              </Button>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs" onClick={handleExportCsv} disabled={apps.length === 0}>
                <Download className="h-3.5 w-3.5" /> Export
              </Button>
              <input ref={importRef} type="file" accept=".csv" className="hidden" onChange={handleImportFile} />
            </div>
            <Button className="rounded-full gap-1 h-9" onClick={openAddApp}>
              <Plus className="h-4 w-4" /> Add Application
            </Button>
          </div>

          {/* ── LIST VIEW ── */}
          {appView === "list" && (
            <div className="space-y-3">
              {filtered.map((app) => (
                <div key={app.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary shrink-0">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-card-foreground text-sm">{app.job}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium shrink-0 ${statusColors[app.status]}`}>{statusLabels[app.status]}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                      <span className="font-medium">{app.company}</span>
                      <span>{formatDate(app.date)}</span>
                      {app.salary && <span>💰 {app.salary}</span>}
                      {app.contactPerson && <span>👤 {app.contactPerson}</span>}
                      {app.cvUsed && <span className="flex items-center gap-1 rounded-full bg-primary/5 border border-primary/15 px-2 py-0.5 text-primary"><FileText className="h-2.5 w-2.5" />{app.cvUsed}</span>}
                      {app.addedByName && app.source === "platform" && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] text-amber-400">
                          <UserCheck className="h-2.5 w-2.5" /> Added by {app.addedByName}
                        </span>
                      )}
                      {app.url && <a href={app.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline"><LinkIcon className="h-3 w-3" /> Job post</a>}
                    </div>
                    {app.nextAction && <p className="flex items-center gap-1 text-xs text-muted-foreground/80 mt-1.5"><MessageSquare className="h-3 w-3 shrink-0" /><span className="truncate">Next: {app.nextAction}</span></p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Select value={app.status} onValueChange={(v) => handleStatusChange(app, v as AppStatus)}>
                      <SelectTrigger className="h-7 w-[120px] text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{allStatuses.map((s) => <SelectItem key={s} value={s} className="text-xs">{statusLabels[s]}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditApp(app)}><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => saveApps(apps.filter((a) => a.id !== app.id))}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                  <Briefcase className="h-10 w-10 opacity-30" /><p className="text-sm">No applications yet.</p>
                  <Button variant="outline" className="rounded-full gap-1 text-xs" onClick={openAddApp}><Plus className="h-3.5 w-3.5" /> Add first application</Button>
                </div>
              )}
            </div>
          )}

          {/* ── KANBAN VIEW ── */}
          {appView === "kanban" && (
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ minHeight: "480px" }}>
              {allStatuses.map((col) => {
                const colApps = apps.filter((a) => {
                  const q = search.toLowerCase();
                  return a.status === col && (a.job.toLowerCase().includes(q) || a.company.toLowerCase().includes(q));
                });
                const colColors: Record<AppStatus, string> = {
                  "to-apply": "text-muted-foreground",
                  applied: "text-blue-400",
                  interview: "text-yellow-400",
                  accepted: "text-green-400",
                  rejected: "text-destructive",
                };
                return (
                  <div key={col} className="flex flex-col gap-2 min-w-[220px] w-[220px] shrink-0">
                    {/* Column header */}
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${colColors[col]}`}>{statusLabels[col]}</span>
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-medium text-muted-foreground">{colApps.length}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100" onClick={() => { setAppForm({ ...emptyAppForm, status: col }); setEditingAppId(null); setAppDialog(true); }}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Cards */}
                    <div className="flex flex-col gap-2 flex-1 rounded-xl bg-secondary/20 border border-border/50 p-2">
                      {colApps.map((app) => (
                        <div key={app.id} className="rounded-lg border border-border bg-card p-3 space-y-2 hover:border-primary/30 transition-colors group">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-card-foreground leading-tight truncate">{app.job}</p>
                              <p className="text-[11px] text-muted-foreground truncate mt-0.5">{app.company}</p>
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-1 rounded hover:bg-secondary transition-colors" onClick={() => openEditApp(app)}><Pencil className="h-3 w-3 text-muted-foreground" /></button>
                              <button className="p-1 rounded hover:bg-secondary transition-colors" onClick={() => saveApps(apps.filter((a) => a.id !== app.id))}><Trash2 className="h-3 w-3 text-destructive" /></button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {app.date && <span className="text-[10px] text-muted-foreground/70">{formatDate(app.date)}</span>}
                            {app.salary && <span className="text-[10px] text-muted-foreground/70">· {app.salary}</span>}
                          </div>
                          {app.cvUsed && (
                            <span className="flex items-center gap-1 rounded bg-primary/5 border border-primary/15 px-1.5 py-0.5 text-[10px] text-primary w-fit">
                              <FileText className="h-2.5 w-2.5" />{app.cvUsed}
                            </span>
                          )}
                          {app.nextAction && (
                            <p className="flex items-start gap-1 text-[10px] text-muted-foreground/80 leading-tight">
                              <MessageSquare className="h-2.5 w-2.5 shrink-0 mt-0.5" /><span className="line-clamp-2">{app.nextAction}</span>
                            </p>
                          )}
                          {/* Move to next status */}
                          <Select value={app.status} onValueChange={(v) => handleStatusChange(app, v as AppStatus)}>
                            <SelectTrigger className="h-6 text-[10px] w-full mt-1"><SelectValue /></SelectTrigger>
                            <SelectContent>{allStatuses.map((s) => <SelectItem key={s} value={s} className="text-xs">{statusLabels[s]}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      ))}
                      {colApps.length === 0 && (
                        <div className="flex-1 flex items-center justify-center py-6">
                          <p className="text-[11px] text-muted-foreground/40 italic">Empty</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── CV ── */}
      {activeTab === "cv" && (
        <div className="flex gap-4" style={{ height: "calc(100vh - 300px)", minHeight: "520px" }}>
          {/* Left: Editor panel */}
          <div className="flex-1 flex flex-col border border-border rounded-xl overflow-hidden min-w-0">
            {/* Top action bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card/60 shrink-0 gap-3 flex-wrap">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-medium text-card-foreground truncate">{getActiveLabel()}</span>
                {activeNode.type !== "original" && (
                  <>
                    <span className="text-muted-foreground/40 text-xs">·</span>
                    <span className="text-xs text-muted-foreground italic shrink-0">
                      {activeNode.type === "version"
                        ? (cvTree.versions.find((v) => v.id === activeNode.versionId)?.isAiEnhanced ? "AI Enhanced" : "Industry version")
                        : "Variant"}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1"
                  onClick={() => { navigator.clipboard.writeText(cvEditorRef.current?.innerText ?? ""); toast({ title: "Copied!" }); }}>
                  <Copy className="h-3.5 w-3.5" /> Copy
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleSaveVersion}>
                  Save version
                </Button>
                <Button size="sm" className="h-7 text-xs gap-1"
                  onClick={() => openEnhanceModal()}
                  disabled={promptsUsed >= CV_PROMPT_LIMIT}>
                  <Wand2 className="h-3.5 w-3.5" /> Enhance with Arbeitly
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1"
                  onClick={() => {
                    const label = getActiveLabel();
                    let style: CvStyle = "modern";
                    if (activeNode.type === "version") style = cvTree.versions.find(v => v.id === activeNode.versionId)?.style ?? "modern";
                    else if (activeNode.type === "variant") { const ver = cvTree.versions.find(v => v.id === (activeNode as {versionId:string}).versionId); style = ver?.variants.find(vr => vr.id === (activeNode as {variantId:string}).variantId)?.style ?? "modern"; }
                    openPdfPreview(label, cvEditorRef.current?.innerHTML ?? cvEditorContent, style);
                  }}>
                  <Download className="h-3.5 w-3.5" /> Export PDF
                </Button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-border bg-card/30 flex-wrap shrink-0">
              <button className="p-1.5 rounded hover:bg-secondary transition-colors" title="Undo" onClick={() => execCmd("undo")}>
                <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <button className="p-1.5 rounded hover:bg-secondary transition-colors" title="Redo" onClick={() => execCmd("redo")}>
                <RotateCw className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <div className="w-px h-4 bg-border mx-1" />
              <select
                className="text-xs bg-transparent border border-border rounded px-1.5 py-0.5 text-muted-foreground h-7 cursor-pointer"
                defaultValue="normal"
                onChange={(e) => {
                  if (e.target.value === "h1") execCmd("formatBlock", "<h1>");
                  else if (e.target.value === "h2") execCmd("formatBlock", "<h2>");
                  else execCmd("formatBlock", "<p>");
                  e.target.value = "normal";
                }}
              >
                <option value="normal">Normal</option>
                <option value="h1">H1</option>
                <option value="h2">H2</option>
              </select>
              <div className="w-px h-4 bg-border mx-1" />
              <button className="p-1 rounded hover:bg-secondary transition-colors w-7 h-7 text-xs font-bold text-muted-foreground flex items-center justify-center" title="Bold" onClick={() => execCmd("bold")}>B</button>
              <button className="p-1 rounded hover:bg-secondary transition-colors w-7 h-7 text-xs italic text-muted-foreground flex items-center justify-center" title="Italic" onClick={() => execCmd("italic")}>I</button>
              <button className="p-1 rounded hover:bg-secondary transition-colors w-7 h-7 text-xs underline text-muted-foreground flex items-center justify-center" title="Underline" onClick={() => execCmd("underline")}>U</button>
              <button className="p-1 rounded hover:bg-secondary transition-colors w-7 h-7 text-xs line-through text-muted-foreground flex items-center justify-center" title="Strikethrough" onClick={() => execCmd("strikeThrough")}>S</button>
              <div className="w-px h-4 bg-border mx-1" />
              <button className="p-1.5 rounded hover:bg-secondary transition-colors" title="Bullet list" onClick={() => execCmd("insertUnorderedList")}>
                <List className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <button className="p-1.5 rounded hover:bg-secondary transition-colors" title="Numbered list" onClick={() => execCmd("insertOrderedList")}>
                <ListOrdered className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <div className="w-px h-4 bg-border mx-1" />
              <button className="p-1.5 rounded hover:bg-secondary transition-colors" title="Align left" onClick={() => execCmd("justifyLeft")}>
                <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <button className="p-1.5 rounded hover:bg-secondary transition-colors" title="Align center" onClick={() => execCmd("justifyCenter")}>
                <AlignCenter className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <button className="p-1.5 rounded hover:bg-secondary transition-colors" title="Align right" onClick={() => execCmd("justifyRight")}>
                <AlignRight className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>

            {/* Editable content */}
            <div
              ref={cvEditorRef}
              contentEditable
              suppressContentEditableWarning
              className="flex-1 overflow-y-auto p-6 text-sm text-card-foreground focus:outline-none [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:text-primary [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:uppercase [&_h2]:tracking-wider [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-primary [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-1 [&_li]:mb-0.5"
              dangerouslySetInnerHTML={{ __html: cvEditorContent }}
              onInput={(e) => setCvEditorContent((e.target as HTMLDivElement).innerHTML)}
            />
          </div>

          {/* Right: CV structure tree */}
          <div className="w-64 flex flex-col border border-border rounded-xl overflow-hidden bg-card/30 shrink-0">
            <div className="px-4 py-3 border-b border-border shrink-0 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Structure</p>
                <p className="text-xs font-medium text-card-foreground mt-0.5">Curriculum Vitae</p>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 shrink-0 px-2" onClick={() => setNewVersionDialog(true)}>
                <Plus className="h-3 w-3" /> Version
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {/* Original */}
              <button
                onClick={() => switchToNode({ type: "original" })}
                className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  activeNode.type === "original" ? "bg-primary/10 text-primary" : "hover:bg-secondary/40 text-card-foreground"
                }`}
              >
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <span className="text-xs font-medium">Original Upload</span>
              </button>

              {/* Versions */}
              {cvTree.versions.map((ver) => (
                <div key={ver.id}>
                  <div className={`flex items-center rounded-lg transition-colors ${
                    activeNode.type === "version" && activeNode.versionId === ver.id ? "bg-primary/10" : "hover:bg-secondary/40"
                  }`}>
                    <button
                      className="p-1.5 shrink-0"
                      onClick={() => setExpandedVersionIds((prev) => { const n = new Set(prev); n.has(ver.id) ? n.delete(ver.id) : n.add(ver.id); return n; })}
                    >
                      {expandedVersionIds.has(ver.id)
                        ? <ChevronDown className="h-3 w-3 text-muted-foreground" />
                        : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                    </button>
                    <button
                      className={`flex-1 text-left flex items-center gap-2 py-2 min-w-0 ${
                        activeNode.type === "version" && activeNode.versionId === ver.id ? "text-primary" : "text-card-foreground"
                      }`}
                      onClick={() => switchToNode({ type: "version", versionId: ver.id })}
                    >
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-xs font-medium truncate">{ver.label}</span>
                      {ver.isAiEnhanced && <span className="text-[8px] bg-primary/10 text-primary px-1 py-0.5 rounded shrink-0">AI</span>}
                    </button>
                    <button
                      className="p-1.5 shrink-0 text-muted-foreground hover:text-primary transition-colors"
                      title="Add variant"
                      onClick={() => { setNewVariantForVersionId(ver.id); setNewVariantDialog(true); }}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      className="p-1.5 shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete version"
                      onClick={() => handleDeleteVersion(ver.id)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>

                  {expandedVersionIds.has(ver.id) && ver.variants.map((vr) => (
                    <div key={vr.id} className="group flex items-center">
                      <button
                        onClick={() => switchToNode({ type: "variant", versionId: ver.id, variantId: vr.id })}
                        className={`flex-1 text-left flex items-center gap-1.5 pl-8 pr-2 py-1.5 rounded-lg transition-colors ${
                          activeNode.type === "variant" && activeNode.variantId === vr.id
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-secondary/40 text-muted-foreground hover:text-card-foreground"
                        }`}
                      >
                        <div className="w-3 h-px bg-border/60 shrink-0" />
                        <FileText className="h-3 w-3 shrink-0" />
                        <span className="text-xs truncate">{vr.label}</span>
                        {vr.isAiEnhanced && <span className="text-[8px] bg-primary/10 text-primary px-1 py-0.5 rounded shrink-0">AI</span>}
                      </button>
                      <button
                        className="p-1.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                        title="Delete variant"
                        onClick={() => handleDeleteVariant(ver.id, vr.id)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ))}

              {cvTree.versions.length === 0 && (
                <p className="text-[11px] text-muted-foreground px-3 py-2 italic leading-relaxed">
                  No versions yet. Click "+ Version" to create a tailored version (e.g. SaaS Industry).
                </p>
              )}
            </div>

            <div className="p-3 border-t border-border shrink-0">
              <button
                className="w-full text-xs text-primary hover:underline flex items-center justify-center gap-1.5 py-1 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => openEnhanceModal()}
                disabled={promptsUsed >= CV_PROMPT_LIMIT}
              >
                <Wand2 className="h-3 w-3" /> Enhance with Arbeitly…
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── COVER LETTER ── */}
      {activeTab === "cover-letter" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="font-display text-base font-semibold text-foreground">1. Job Description</h2>
            <Card><CardContent className="p-6">
              <Tabs value={clTab} onValueChange={setClTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="paste" className="flex-1"><ClipboardPaste className="h-3.5 w-3.5 mr-1.5" />Paste</TabsTrigger>
                  <TabsTrigger value="url" className="flex-1"><LinkIcon className="h-3.5 w-3.5 mr-1.5" />From URL</TabsTrigger>
                </TabsList>
                <TabsContent value="paste" className="mt-4">
                  <Textarea value={clJD} onChange={(e) => setClJD(e.target.value)} placeholder="Paste the full job description here..." className="min-h-[200px] resize-none" />
                </TabsContent>
                <TabsContent value="url" className="mt-4 space-y-3">
                  <div>
                    <Label>Job Listing URL</Label>
                    <Input value={clUrl} onChange={(e) => setClUrl(e.target.value)} placeholder="https://linkedin.com/jobs/view/..." className="mt-1.5" />
                  </div>
                  <Button onClick={handleClExtract} disabled={!clUrl.trim() || clExtracting} className="w-full">
                    {clExtracting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Extracting...</> : "Extract Job Description"}
                  </Button>
                  {clJD && <p className="text-xs text-green-400 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Extracted</p>}
                </TabsContent>
              </Tabs>
            </CardContent></Card>

            <h2 className="font-display text-base font-semibold text-foreground">2. Preferences</h2>
            <Card><CardContent className="p-6 space-y-4">
              <div>
                <Label>Tone</Label>
                <Select value={clTone} onValueChange={setClTone}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{["Professional", "Enthusiastic", "Formal", "Creative"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Language</Label>
                <Select value={clLang} onValueChange={setClLang}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="english">English</SelectItem><SelectItem value="german">German</SelectItem></SelectContent>
                </Select>
              </div>
              <Button onClick={handleClGenerate} disabled={!clJD.trim() || clGenerating} className="w-full" size="lg">
                {clGenerating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</> : <><PenTool className="h-4 w-4 mr-2" />Generate Cover Letter</>}
              </Button>
            </CardContent></Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-foreground">3. Cover Letter</h2>
              {clText && (
                <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs" onClick={() => { setClSaveVersionName(""); setClSaveVersionDialog(true); }}>
                  <Download className="h-3.5 w-3.5" /> Save to Library
                </Button>
              )}
            </div>
            <Card><CardContent className="p-6">
              {clText ? (
                <div className="space-y-4">
                  <Textarea value={clText} onChange={(e) => setClText(e.target.value)} className="min-h-[380px] resize-none font-serif text-sm leading-relaxed" />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(clText); toast({ title: "Copied!" }); }}><ClipboardPaste className="h-3.5 w-3.5 mr-1.5" />Copy</Button>
                    <Button size="sm" onClick={() => {
                      const win = window.open("", "_blank");
                      if (win) { win.document.write(buildPdfHtml(textToHtml(clText), "classic")); win.document.close(); win.setTimeout(() => win.print(), 400); }
                    }}><Download className="h-3.5 w-3.5 mr-1.5" />PDF</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-3"><FileText className="h-7 w-7 text-muted-foreground" /></div>
                  <p className="font-medium text-muted-foreground text-sm">Cover letter will appear here</p>
                  <p className="text-xs text-muted-foreground mt-1">Add a job description and click generate</p>
                </div>
              )}
            </CardContent></Card>

            {/* CL Library */}
            {(clTree.original || clTree.versions.length > 0) && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Saved Cover Letters</p>
                <div className="rounded-xl border border-border overflow-hidden">
                  {clTree.original && (
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60 last:border-0">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground">Original</p>
                        <p className="text-xs text-muted-foreground">{formatDate(clTree.original.createdAt)}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openPdfPreview("Original Cover Letter", clTree.original!.content, "classic")}>
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  )}
                  {clTree.versions.map((v) => (
                    <div key={v.id} className="flex items-center gap-3 px-4 py-3 border-b border-border/60 last:border-0 bg-secondary/20">
                      <FileText className="h-4 w-4 text-primary/60 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground">{v.name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(v.createdAt)} · {CV_STYLES[v.style]?.name}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openPdfPreview(v.name, v.content, v.style)}>
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CL Save Version Dialog */}
      <Dialog open={clSaveVersionDialog} onOpenChange={setClSaveVersionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-display">Save Cover Letter to Library</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Name <span className="text-destructive">*</span></Label>
              <Input className="mt-1.5" placeholder="e.g. Google — Frontend Role" value={clSaveVersionName} onChange={(e) => setClSaveVersionName(e.target.value)} autoFocus />
            </div>
            <div>
              <Label className="mb-2 block">PDF Style</Label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(CV_STYLES) as [CvStyle, { name: string; desc: string }][]).map(([k, v]) => (
                  <button key={k} onClick={() => setClSaveVersionStyle(k)} className={`rounded-lg border p-3 text-left transition-all ${clSaveVersionStyle === k ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                    <p className="text-xs font-semibold text-card-foreground">{v.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{v.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClSaveVersionDialog(false)}>Cancel</Button>
            <Button onClick={handleClSaveVersion} disabled={!clSaveVersionName.trim()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── FILES ── */}
      {activeTab === "files" && (
        <div className="space-y-6">
          {/* CV Document tree */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CV Documents</p>
              <button className="text-xs text-primary hover:underline" onClick={() => setActiveTab("cv")}>Open CV Editor →</button>
            </div>
            <div className="rounded-xl border border-border overflow-hidden">
              {/* Original row */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground">Original Upload</p>
                  <p className="text-xs text-muted-foreground">{formatDate(cvTree.original.createdAt)}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" title="View PDF" onClick={() => openPdfPreview("Original Upload", cvTree.original.content, "modern")}>
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>

              {/* Version rows */}
              {cvTree.versions.map((ver, vi) => (
                <div key={ver.id}>
                  <div className={`flex items-center gap-3 px-4 py-3 bg-secondary/20 ${vi < cvTree.versions.length - 1 || ver.variants.length > 0 ? "border-b border-border/60" : ""}`}>
                    <button
                      className="p-0.5 shrink-0"
                      onClick={() => setExpandedVersionIds((prev) => { const n = new Set(prev); n.has(ver.id) ? n.delete(ver.id) : n.add(ver.id); return n; })}
                    >
                      {expandedVersionIds.has(ver.id) ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                    </button>
                    <FileText className="h-4 w-4 text-primary/60 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-card-foreground">{ver.label}</p>
                        {ver.isAiEnhanced && <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">AI</span>}
                      </div>
                      <p className="text-xs text-muted-foreground">{formatDate(ver.createdAt)} · {ver.variants.length} variant{ver.variants.length !== 1 ? "s" : ""}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="View PDF" onClick={() => openPdfPreview(ver.label, ver.content, ver.style ?? "modern")}>
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteVersion(ver.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive/60 hover:text-destructive" />
                    </Button>
                  </div>

                  {expandedVersionIds.has(ver.id) && ver.variants.map((vr, vri) => (
                    <div key={vr.id} className={`flex items-center gap-3 px-4 py-2.5 pl-12 hover:bg-secondary/10 ${vri < ver.variants.length - 1 ? "border-b border-border/40" : vi < cvTree.versions.length - 1 ? "border-b border-border/60" : ""}`}>
                      <div className="w-px h-4 bg-border/60 mr-1 shrink-0" />
                      <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-card-foreground">{vr.label}</p>
                          {vr.isAiEnhanced && <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">AI</span>}
                        </div>
                        <p className="text-xs text-muted-foreground">{formatDate(vr.createdAt)}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="View PDF" onClick={() => openPdfPreview(vr.label, vr.content, vr.style ?? "modern")}>
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteVariant(ver.id, vr.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive/60 hover:text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              ))}

              {cvTree.versions.length === 0 && (
                <div className="px-4 py-4 text-xs text-muted-foreground italic">
                  No versions created yet. Go to the CV tab to create versions and variants.
                </div>
              )}
            </div>
          </div>

          {/* Uploaded files */}
          <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{files.length} uploaded file{files.length !== 1 ? "s" : ""}</p>
            <Button variant="outline" size="sm" className="gap-2 rounded-full" onClick={() => filesInputRef.current?.click()}>
              <Upload className="h-3.5 w-3.5" /> Upload File
            </Button>
            <input ref={filesInputRef} type="file" className="hidden" onChange={handleFileUpload} />
          </div>

          {files.length === 0 ? (
            <Card><CardContent className="p-10 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Upload className="h-8 w-8 opacity-30" />
              <p className="text-sm">No files uploaded yet</p>
              <Button variant="outline" size="sm" className="gap-2 rounded-full" onClick={() => filesInputRef.current?.click()}>
                <Upload className="h-3.5 w-3.5" /> Upload first file
              </Button>
            </CardContent></Card>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              {files.map((f, i) => (
                <div key={f.id} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/30 transition-colors ${i !== files.length - 1 ? "border-b border-border/60" : ""}`}>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.size} · {f.type} · Uploaded by {f.uploadedBy} · {formatDate(f.uploadedAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast({ title: "Download", description: `Downloading ${f.name}` })}><Download className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => saveFiles(files.filter((x) => x.id !== f.id))}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>{/* end uploaded files */}
        </div>
      )}

      {/* ── ACCOUNT (read-only — set by candidate during onboarding) ── */}
      {activeTab === "account" && (
        <div className="space-y-4 max-w-lg">
          {(candidate.jobAccount || candidate.dummyEmail) ? (
            <Card>
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <KeyRound className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-card-foreground">Job Application Account</p>
                    <p className="text-xs text-muted-foreground">Provided and authorized by {candidate.fullName.split(" ")[0]}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto text-green-400 border-green-400/30">
                    <CheckCircle className="h-3 w-3 mr-1" /> Authorized
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                      <p className="text-sm text-card-foreground font-mono">{candidate.jobAccount?.email ?? candidate.dummyEmail}</p>
                      <button
                        className="ml-auto text-[11px] text-primary hover:underline"
                        onClick={() => { navigator.clipboard.writeText(candidate.jobAccount?.email ?? candidate.dummyEmail ?? ""); toast({ title: "Copied!" }); }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Password</p>
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                      {(() => {
                        const pw = candidate.jobAccount?.password ?? candidate.dummyPassword ?? "";
                        return (
                          <p className="text-sm text-card-foreground font-mono">
                            {showJobPass ? pw : "•".repeat(Math.min(pw.length, 14))}
                          </p>
                        );
                      })()}
                      <button className="ml-auto text-[11px] text-primary hover:underline" onClick={() => setShowJobPass((v) => !v)}>
                        {showJobPass ? "Hide" : "Show"}
                      </button>
                      {showJobPass && (
                        <button
                          className="text-[11px] text-primary hover:underline"
                          onClick={() => { navigator.clipboard.writeText(candidate.jobAccount?.password ?? candidate.dummyPassword ?? ""); toast({ title: "Copied!" }); }}
                        >
                          Copy
                        </button>
                      )}
                    </div>
                  </div>

                  {candidate.jobAccount?.authorizedAt && (
                    <div className="pt-2 border-t border-border/60">
                      <p className="text-[11px] text-muted-foreground">
                        Authorized on {format(new Date(candidate.jobAccount.authorizedAt), "dd MMM yyyy 'at' HH:mm")}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card><CardContent className="p-10 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <KeyRound className="h-8 w-8 opacity-30" />
              <p className="text-sm font-medium text-card-foreground">No account provided yet</p>
              <p className="text-xs text-muted-foreground text-center max-w-xs">
                {candidate.fullName.split(" ")[0]} will provide their job application email and password at the end of onboarding.
              </p>
            </CardContent></Card>
          )}
        </div>
      )}

      {/* ── JOB DISCOVERY ── */}
      {activeTab === "job-discovery" && (
        <div className="space-y-4">
          {/* Header row */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              <div>
                <h2 className="font-display text-base font-semibold text-foreground">Job Matches</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{filteredJobs.length} position{filteredJobs.length !== 1 ? "s" : ""} matched · scraped from live job boards</p>
              </div>
              {/* Score filter */}
              <div className="flex gap-1 rounded-lg border border-border p-1">
                {([["all", "All"], ["high", "80%+"], ["medium", "50–79%"]] as const).map(([val, label]) => (
                  <button key={val} onClick={() => setJobScoreFilter(val)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${jobScoreFilter === val ? "bg-secondary text-card-foreground" : "text-muted-foreground hover:text-card-foreground"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {skippedCount > 0 && (
                <button
                  onClick={() => setShowSkipped((v) => !v)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showSkipped ? `Hide skipped (${skippedCount})` : `Show skipped (${skippedCount})`}
                </button>
              )}
              <Button variant="outline" size="sm" className="gap-2 rounded-full" onClick={handleRefreshJobs} disabled={jobsRefreshing}>
                {jobsRefreshing ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Refreshing…</> : <><RefreshCw className="h-3.5 w-3.5" />Refresh Jobs</>}
              </Button>
            </div>
          </div>

          {/* Candidate criteria chips */}
          <div className="flex gap-2 flex-wrap">
            {ob.targetRoles && ob.targetRoles.split(",").slice(0, 3).map((r) => (
              <span key={r} className="rounded-full bg-primary/5 border border-primary/10 px-2.5 py-0.5 text-xs text-primary">🎯 {r.trim()}</span>
            ))}
            {ob.preferredLocation && <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">📍 {ob.preferredLocation}</span>}
            {ob.preferredSalary && <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">💰 {ob.preferredSalary}</span>}
            {ob.germanLevel && <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">🇩🇪 {ob.germanLevel}</span>}
          </div>

          {/* Job list */}
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <div key={job.id} className={`rounded-xl border bg-card overflow-hidden transition-colors ${job.skipped ? "opacity-50 border-border/40" : expandedJobId === job.id ? "border-primary/30" : "border-border hover:border-primary/20"}`}>
                <div className="flex items-center gap-4 p-4">
                  {/* Match score ring */}
                  <div className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl text-center border-2 ${
                    job.matchScore >= 80 ? "border-green-400/40 bg-green-500/5 text-green-400"
                    : job.matchScore >= 60 ? "border-yellow-400/40 bg-yellow-500/5 text-yellow-400"
                    : "border-orange-400/40 bg-orange-500/5 text-orange-400"
                  }`}>
                    <span className="text-sm font-bold leading-none">{job.matchScore}%</span>
                    <span className="text-[9px] mt-0.5 opacity-70">match</span>
                  </div>

                  {/* Job info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-card-foreground text-sm">{job.title}</p>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{job.jobType}</span>
                      {job.inQueue && <span className="rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[10px] text-green-400 flex items-center gap-1"><CheckCircle className="h-2.5 w-2.5" />In Queue</span>}
                      {job.isDuplicate && <span className="rounded-full bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5 text-[10px] text-yellow-400">Possible duplicate</span>}
                      {job.skipped && <span className="rounded-full bg-secondary border border-border px-2 py-0.5 text-[10px] text-muted-foreground">Skipped · {job.skipReason}</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                      <span className="font-medium text-card-foreground/80">{job.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                      {job.salary && <span>{job.salary}</span>}
                      {job.source && <span className="text-muted-foreground/50">via {job.source}</span>}
                      <span className="text-muted-foreground/60">{formatDate(job.postedAt)}</span>
                    </div>
                    {/* Match reasons */}
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {job.matchReasons.map((r) => (
                        <span key={r} className="flex items-center gap-1 rounded bg-primary/5 border border-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                          <Star className="h-2.5 w-2.5" />{r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {job.skipped ? (
                      <Button
                        size="sm" variant="outline" className="h-8 text-xs gap-1.5"
                        onClick={() => { saveJobs(discoveredJobs.map((j) => j.id === job.id ? { ...j, skipped: false, skipReason: undefined } : j)); }}
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Restore
                      </Button>
                    ) : (
                      <Button
                        size="sm" className={`h-8 text-xs gap-1.5 ${job.inQueue ? "" : "bg-primary"}`}
                        variant={job.inQueue ? "secondary" : "default"}
                        onClick={() => !job.inQueue && handleAddToQueue(job)}
                        disabled={job.inQueue}
                      >
                        {job.inQueue ? <><CheckCircle className="h-3.5 w-3.5" />Added</> : <><Plus className="h-3.5 w-3.5" />Add to Queue</>}
                      </Button>
                    )}
                    <div className="flex gap-1.5">
                      <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1" onClick={() => {
                        if (expandedJobId === job.id) { setExpandedJobId(null); } else { setExpandedJobId(job.id); setExpandedJobTab((p) => ({ ...p, [job.id]: "desc" })); }
                      }}>
                        {expandedJobId === job.id ? "Less" : "Details"}
                      </Button>
                      {!job.inQueue && !job.skipped && (
                        <Button
                          variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          title="Skip this job"
                          onClick={() => { setSkipDialog({ open: true, job }); setSkipReason(SKIP_REASONS[0]); }}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Search externally" onClick={() => window.open(`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title + ' ' + job.company)}`, '_blank')}>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expanded section — Description / Tailored CV / Cover Letter */}
                {expandedJobId === job.id && (() => {
                  const tab = expandedJobTab[job.id] ?? "desc";
                  const setTab = (t: "desc" | "cv" | "cl") => setExpandedJobTab((prev) => ({ ...prev, [job.id]: t }));
                  return (
                    <div className="border-t border-border/40">
                      {/* Tabs */}
                      <div className="flex items-center gap-0 border-b border-border/40 px-4">
                        {([["desc", "Job Description"], ["cv", "Tailored CV"], ["cl", "Cover Letter"]] as const).map(([key, label]) => (
                          <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-colors -mb-px ${
                              tab === key
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                        {(tab === "cv" || tab === "cl") && (
                          <div className="ml-auto flex items-center gap-1.5 py-2">
                            <Button
                              size="sm" variant="outline"
                              className="h-7 text-[11px] gap-1.5 rounded-full"
                              onClick={() => {
                                const content = tab === "cv" ? job.generatedCv : job.generatedCoverLetter;
                                if (content) { navigator.clipboard.writeText(content); toast({ title: "Copied to clipboard" }); }
                              }}
                            >
                              <Copy className="h-3 w-3" /> Copy
                            </Button>
                            <Button
                              size="sm"
                              className="h-7 text-[11px] gap-1.5 rounded-full"
                              onClick={() => handleSaveDocToFiles(job, tab)}
                            >
                              <FileText className="h-3 w-3" /> Save to Files
                            </Button>
                          </div>
                        )}
                      </div>
                      {/* Content */}
                      <div className="px-4 py-4">
                        {tab === "desc" && (
                          <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
                        )}
                        {(tab === "cv" || tab === "cl") && (
                          <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-muted-foreground bg-muted/30 rounded-lg p-4 max-h-80 overflow-y-auto border border-border/40">
                            {tab === "cv" ? (job.generatedCv ?? "No CV generated yet.") : (job.generatedCoverLetter ?? "No cover letter generated yet.")}
                          </pre>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                <Search className="h-8 w-8 opacity-30" />
                <p className="text-sm">{jobScoreFilter !== "all" ? "No jobs match this filter." : "No jobs found. Click Refresh to search."}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FAQ ── */}
      {activeTab === "faq" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-foreground">Frequently Asked Questions</h2>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span>{faqItems.length} total</span>
                <span className="text-green-400">{faqItems.filter((f) => f.status === "approved").length} approved</span>
                <span className="text-yellow-400">{faqItems.filter((f) => f.status === "pending").length} pending approval</span>
              </div>
            </div>
            <Button className="rounded-full gap-1 h-9" onClick={openAddFaq}><Plus className="h-4 w-4" /> Add Q&amp;A</Button>
          </div>

          {faqItems.length === 0 ? (
            <Card><CardContent className="p-10 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <MessageSquare className="h-8 w-8 opacity-30" />
              <p className="text-sm font-medium text-card-foreground">No Q&amp;A added yet</p>
              <p className="text-xs text-center max-w-xs">Add questions and answers — candidate will see them and can approve or override.</p>
              <Button variant="outline" className="rounded-full gap-1 text-xs mt-1" onClick={openAddFaq}><Plus className="h-3.5 w-3.5" /> Add first Q&amp;A</Button>
            </CardContent></Card>
          ) : (
            <div className="space-y-3">
              {faqItems.map((f) => (
                <Card key={f.id} className={f.status === "pending" ? "border-yellow-400/30" : "border-green-400/20"}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-card-foreground">{f.question}</p>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${f.status === "approved" ? "bg-green-400/10 text-green-400" : "bg-yellow-400/10 text-yellow-400"}`}>
                            {f.status === "approved" ? "Approved" : "Pending Approval"}
                          </span>
                          {f.lockedByCandidate && <span className="rounded-full px-2 py-0.5 text-[10px] bg-primary/10 text-primary">Candidate Answer</span>}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{f.answer}</p>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground/60">
                          <span>Added {formatDate(f.createdAt)} by {f.createdByName}</span>
                          {f.status === "approved" && f.verifiedByName && <span>· Approved by {f.verifiedByName}</span>}
                        </div>
                        {/* Activity log toggle */}
                        {f.activity?.length > 0 && (
                          <button className="text-[11px] text-primary hover:underline" onClick={() => setExpandedFaqId(expandedFaqId === f.id ? null : f.id)}>
                            {expandedFaqId === f.id ? "Hide history" : `Show history (${f.activity.length})`}
                          </button>
                        )}
                        {expandedFaqId === f.id && (
                          <div className="mt-2 space-y-1 border-l-2 border-border pl-3">
                            {f.activity.map((a, i) => (
                              <p key={i} className="text-[11px] text-muted-foreground/70">
                                <span className="font-medium text-muted-foreground">{a.userName}</span> {a.action.replace(/_/g, " ")} · {formatDate(a.timestamp)}
                                {a.previousAnswer && <span className="block pl-2 italic opacity-70">Was: {a.previousAnswer.slice(0, 60)}{a.previousAnswer.length > 60 ? "…" : ""}</span>}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        {f.status === "pending" && (
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-green-400 border-green-400/30 hover:bg-green-400/10" onClick={() => handleFaqApprove(f.id)}>
                            <CheckCircle className="h-3 w-3" /> Approve
                          </Button>
                        )}
                        {f.status === "approved" && (
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground" onClick={() => handleFaqUnverify(f.id)}>Unverify</Button>
                        )}
                        {!f.lockedByCandidate && (
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditFaq(f)}><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => saveFaq(faqItems.filter((x) => x.id !== f.id))}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── FAQ Dialog ── */}
      <Dialog open={faqDialog} onOpenChange={setFaqDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">{editingFaqId ? "Edit Q&A" : "Add Q&A"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Question <span className="text-destructive">*</span></Label>
              <Input
                className="mt-1.5"
                placeholder="e.g. What is their notice period?"
                value={faqForm.question}
                onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                autoFocus
              />
            </div>
            <div>
              <Label>Answer</Label>
              <Textarea
                className="mt-1.5 resize-none"
                rows={4}
                placeholder="e.g. 3 months, but open to negotiation."
                value={faqForm.answer}
                onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFaqDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveFaq} disabled={!faqForm.question.trim()}>{editingFaqId ? "Save Changes" : "Add Q&A"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Skip Job Dialog ── */}
      <Dialog open={skipDialog.open} onOpenChange={(o) => !o && setSkipDialog({ open: false, job: null })}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Skip This Job</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {skipDialog.job && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-card-foreground">{skipDialog.job.title}</span> at {skipDialog.job.company}
              </p>
            )}
            <div>
              <Label>Reason for skipping</Label>
              <Select value={skipReason} onValueChange={setSkipReason}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SKIP_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSkipDialog({ open: false, job: null })}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => skipDialog.job && handleSkipJob(skipDialog.job, skipReason)}
            >
              Skip Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── New Version Dialog ── */}
      <Dialog open={newVersionDialog} onOpenChange={setNewVersionDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">New CV Version</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-xs text-muted-foreground">Name this version by target industry or role, e.g. "SaaS Industry", "Finance", "Product Management".</p>
            <div>
              <Label>Version Name</Label>
              <Input
                className="mt-1.5"
                placeholder="e.g. SaaS Industry"
                value={newVersionName}
                onChange={(e) => setNewVersionName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddVersion()}
                autoFocus
              />
            </div>
            <div>
              <Label className="mb-1.5 block">Style</Label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(CV_STYLES) as CvStyle[]).map((s) => (
                  <label key={s} className={`flex flex-col gap-0.5 rounded-lg border p-2.5 cursor-pointer transition-colors ${newVersionStyle === s ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                    <input type="radio" name="newVersionStyle" value={s} checked={newVersionStyle === s} onChange={() => setNewVersionStyle(s)} className="sr-only" />
                    <span className="text-xs font-semibold text-card-foreground">{CV_STYLES[s].name}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">{CV_STYLES[s].desc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setNewVersionDialog(false); setNewVersionName(""); }}>Cancel</Button>
            <Button onClick={handleAddVersion} disabled={!newVersionName.trim()}>Create Version</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── New Variant Dialog ── */}
      <Dialog open={newVariantDialog} onOpenChange={setNewVariantDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">New Variant</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-xs text-muted-foreground">
              Name this variant by target company, e.g. "Google", "SAP", "Siemens".
            </p>
            <div>
              <Label>Variant Name</Label>
              <Input
                className="mt-1.5"
                placeholder="e.g. Google"
                value={newVariantName}
                onChange={(e) => setNewVariantName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddVariant()}
                autoFocus
              />
            </div>
            <div>
              <Label className="mb-1.5 block">Style</Label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(CV_STYLES) as CvStyle[]).map((s) => (
                  <label key={s} className={`flex flex-col gap-0.5 rounded-lg border p-2.5 cursor-pointer transition-colors ${newVariantStyle === s ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                    <input type="radio" name="newVariantStyle" value={s} checked={newVariantStyle === s} onChange={() => setNewVariantStyle(s)} className="sr-only" />
                    <span className="text-xs font-semibold text-card-foreground">{CV_STYLES[s].name}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">{CV_STYLES[s].desc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setNewVariantDialog(false); setNewVariantName(""); setNewVariantForVersionId(null); }}>Cancel</Button>
            <Button onClick={handleAddVariant} disabled={!newVariantName.trim()}>Create Variant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Enhance CV Modal ── */}
      <Dialog open={enhanceOpen} onOpenChange={setEnhanceOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Enhance with Arbeitly</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            {/* Prompt section */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Enhance the CV using Arbeitly's AI — optimising for ATS systems, improving language, and tailoring content to the candidate's target roles.
              </p>
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input type="checkbox" checked={useCustomPrompt} onChange={(e) => setUseCustomPrompt(e.target.checked)} className="mt-0.5 accent-primary" />
                <span className="text-sm text-card-foreground">Add a custom prompt</span>
              </label>
              {useCustomPrompt && (
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Emphasise leadership experience, tailor for a senior marketing role..."
                  className="min-h-[90px] resize-none text-sm"
                />
              )}
            </div>

            {/* Save as section */}
            <div className="space-y-3 pt-3 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Save As</p>

              {/* Name */}
              <div>
                <Label>Name <span className="text-destructive">*</span></Label>
                <Input
                  className="mt-1.5"
                  placeholder={enhanceSaveType === "version" ? "e.g. SaaS Industry" : "e.g. Google"}
                  value={enhanceSaveName}
                  onChange={(e) => setEnhanceSaveName(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Version or Variant */}
              <div className="flex gap-3">
                <label className={`flex-1 flex items-center gap-2.5 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${enhanceSaveType === "version" ? "border-primary bg-primary/5" : "border-border hover:border-border/80"}`}>
                  <input type="radio" name="enhanceType" value="version" checked={enhanceSaveType === "version"} onChange={() => setEnhanceSaveType("version")} className="accent-primary" />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Version</p>
                    <p className="text-[11px] text-muted-foreground">New top-level version</p>
                  </div>
                </label>
                <label className={`flex-1 flex items-center gap-2.5 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${enhanceSaveType === "variant" ? "border-primary bg-primary/5" : "border-border hover:border-border/80"} ${cvTree.versions.length === 0 ? "opacity-40 cursor-not-allowed" : ""}`}>
                  <input type="radio" name="enhanceType" value="variant" checked={enhanceSaveType === "variant"} onChange={() => setEnhanceSaveType("variant")} className="accent-primary" disabled={cvTree.versions.length === 0} />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">Variant</p>
                    <p className="text-[11px] text-muted-foreground">Under an existing version</p>
                  </div>
                </label>
              </div>

              {/* Parent version picker (only for variant) */}
              {enhanceSaveType === "variant" && cvTree.versions.length > 0 && (
                <div>
                  <Label>Belongs to</Label>
                  <Select value={enhanceSaveParentId} onValueChange={setEnhanceSaveParentId}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select a version" /></SelectTrigger>
                    <SelectContent>
                      {cvTree.versions.map((v) => (
                        <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Style */}
            <div>
              <Label className="mb-1.5 block">PDF Style</Label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(CV_STYLES) as CvStyle[]).map((s) => (
                  <label key={s} className={`flex flex-col gap-0.5 rounded-lg border p-2.5 cursor-pointer transition-colors ${enhanceSaveStyle === s ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                    <input type="radio" name="enhanceStyle" value={s} checked={enhanceSaveStyle === s} onChange={() => setEnhanceSaveStyle(s)} className="sr-only" />
                    <span className="text-xs font-semibold text-card-foreground">{CV_STYLES[s].name}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">{CV_STYLES[s].desc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Prompt counter */}
            <div className="flex items-center justify-between text-xs border-t border-border pt-3">
              <span className="text-muted-foreground">Prompts used for this candidate</span>
              <span className={`font-semibold tabular-nums ${promptsUsed >= CV_PROMPT_LIMIT ? "text-destructive" : "text-card-foreground"}`}>
                {promptsUsed}/{CV_PROMPT_LIMIT}
              </span>
            </div>
            {promptsUsed >= CV_PROMPT_LIMIT && <p className="text-xs text-destructive -mt-3">Prompt limit reached.</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEnhanceOpen(false)}>Cancel</Button>
            <Button
              onClick={handleEnhance}
              disabled={
                isEnhancing ||
                !enhanceSaveName.trim() ||
                promptsUsed >= CV_PROMPT_LIMIT ||
                (useCustomPrompt && !customPrompt.trim()) ||
                (enhanceSaveType === "variant" && !enhanceSaveParentId)
              }
            >
              {isEnhancing
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Enhancing...</>
                : <><Wand2 className="h-4 w-4 mr-2" />Enhance & Save</>
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── PDF Preview Modal ── */}
      <Dialog open={pdfPreviewOpen} onOpenChange={setPdfPreviewOpen}>
        <DialogContent className="sm:max-w-3xl flex flex-col p-0" style={{ height: "85vh" }}>
          <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
            <div className="flex items-center justify-between gap-4">
              <DialogTitle className="font-display truncate">{pdfPreviewTitle}</DialogTitle>
              <Button size="sm" className="shrink-0 gap-1.5" onClick={() => {
                const w = window.open("", "_blank");
                if (w) { w.document.write(pdfPreviewHtml); w.document.close(); setTimeout(() => w.print(), 400); }
              }}>
                <Download className="h-3.5 w-3.5" /> Print / Download PDF
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden bg-secondary/20">
            <iframe
              srcDoc={pdfPreviewHtml}
              className="w-full h-full border-0 bg-white"
              title="CV PDF Preview"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* ── App Dialog ── */}
      <Dialog open={appDialog} onOpenChange={setAppDialog}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0"><DialogTitle className="font-display">{editingAppId ? "Edit Application" : "Add Application"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2 overflow-y-auto flex-1 pr-1">
            <div><Label>Position Name <span className="text-destructive">*</span></Label><Input className="mt-1.5" placeholder="e.g. Software Engineer" value={appForm.job} onChange={(e) => setAppForm({ ...appForm, job: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Company <span className="text-destructive">*</span></Label><Input className="mt-1.5" value={appForm.company} onChange={(e) => setAppForm({ ...appForm, company: e.target.value })} /></div>
              <div><Label>Date</Label><Input className="mt-1.5" type="date" value={appForm.date} onChange={(e) => setAppForm({ ...appForm, date: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Status</Label>
                <Select value={appForm.status} onValueChange={(v) => setAppForm({ ...appForm, status: v as AppStatus })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{allStatuses.map((s) => <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Salary</Label><Input className="mt-1.5" placeholder="e.g. €60,000" value={appForm.salary} onChange={(e) => setAppForm({ ...appForm, salary: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Contact Person</Label><Input className="mt-1.5" value={appForm.contactPerson} onChange={(e) => setAppForm({ ...appForm, contactPerson: e.target.value })} /></div>
              <div><Label>References</Label><Input className="mt-1.5" value={appForm.references} onChange={(e) => setAppForm({ ...appForm, references: e.target.value })} /></div>
            </div>
            <div><Label>Job URL</Label><Input className="mt-1.5" placeholder="https://..." value={appForm.url} onChange={(e) => setAppForm({ ...appForm, url: e.target.value })} /></div>
            <div><Label>Next Action</Label><Input className="mt-1.5" value={appForm.nextAction} onChange={(e) => setAppForm({ ...appForm, nextAction: e.target.value })} /></div>
            <div><Label>Job Description</Label><Textarea className="mt-1.5 resize-none" rows={3} value={appForm.jobDescription} onChange={(e) => setAppForm({ ...appForm, jobDescription: e.target.value })} /></div>
            <div>
              <Label>CV Used</Label>
              <Select value={appForm.cvUsed || "__none"} onValueChange={(v) => setAppForm({ ...appForm, cvUsed: v === "__none" ? "" : v })}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select CV version (optional)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">Not specified</SelectItem>
                  <SelectItem value="Original Upload">Original Upload</SelectItem>
                  {cvTree.versions.map((v) => (
                    <React.Fragment key={v.id}>
                      <SelectItem value={v.name}>{v.name}</SelectItem>
                      {v.variants.map((vr) => (
                        <SelectItem key={vr.id} value={vr.label}>↳ {vr.label}</SelectItem>
                      ))}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="shrink-0 pt-2">
            <Button variant="outline" onClick={() => setAppDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveApp} disabled={!appForm.job.trim() || !appForm.company.trim()}>{editingAppId ? "Save Changes" : "Add Application"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Import Preview Dialog ── */}
      <Dialog open={importDialog} onOpenChange={setImportDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-display">Import Applications</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{importRows.length} row{importRows.length !== 1 ? "s" : ""} found. {importErrors.length > 0 ? "Fix all errors before importing." : "Review and confirm."}</p>
          {importErrors.length > 0 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-1">
              {importErrors.map((e, i) => (
                <p key={i} className="flex items-center gap-2 text-xs text-destructive"><AlertTriangle className="h-3.5 w-3.5 shrink-0" />{e}</p>
              ))}
            </div>
          )}
          <div className="overflow-auto flex-1 border border-border rounded-lg">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-secondary/80 backdrop-blur">
                <tr>
                  {["Job", "Company", "Status", "Date", "Salary", "Contact", "Next Action"].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-muted-foreground font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {importRows.map((r, i) => (
                  <tr key={i} className={`border-t border-border/50 ${r._error ? "bg-destructive/5" : "hover:bg-secondary/30"}`}>
                    <td className="px-3 py-2 font-medium text-card-foreground truncate max-w-[180px]">{r.job || <span className="text-destructive italic">missing</span>}</td>
                    <td className="px-3 py-2 text-muted-foreground truncate max-w-[140px]">{r.company || <span className="text-destructive italic">missing</span>}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.status}</td>
                    <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{r.date}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.salary}</td>
                    <td className="px-3 py-2 text-muted-foreground truncate max-w-[120px]">{r.contactPerson}</td>
                    <td className="px-3 py-2 text-muted-foreground truncate max-w-[160px]">{r.nextAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setImportDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirmImport} disabled={importErrors.length > 0 || importRows.length === 0}>
              Import {importRows.length} Application{importRows.length !== 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default EmployeeCandidateView;
