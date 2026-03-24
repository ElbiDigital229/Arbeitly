import { useState, useMemo, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Building2, Link as LinkIcon, Plus, MessageSquare, Pencil, Trash2, Download, FileUp, AlertTriangle, LayoutList, LayoutGrid, FileText, Sparkles } from "lucide-react";
import { useCustomers } from "@/context/CustomersContext";
import { useToast } from "@/hooks/use-toast";

type AppStatus = "to-apply" | "applied" | "interview" | "accepted" | "rejected";

type BoardApp = {
  id: string;
  job: string;
  company: string;
  url?: string;
  notes?: string;
  status: AppStatus;
  source: "self" | "platform";
  addedById?: string;
  addedByName?: string;
  seenByCandidate?: boolean;
  date: string;
  salary?: string;
  references?: string;
  contactPerson?: string;
  nextAction?: string;
  jobDescription?: string;
  cvUsed?: string;
};

const statusLabels: Record<AppStatus, string> = {
  "to-apply": "To Apply",
  "applied":   "Applied",
  "interview": "Interview",
  "accepted":  "Accepted",
  "rejected":  "Rejected",
};

const statusColors: Record<AppStatus, string> = {
  "to-apply":  "bg-muted text-muted-foreground",
  "applied":   "bg-blue-500/10 text-blue-400",
  "interview": "bg-yellow-500/10 text-yellow-400",
  "accepted":  "bg-green-500/10 text-green-400",
  "rejected":  "bg-destructive/10 text-destructive",
};

const allStatuses: AppStatus[] = ["to-apply", "applied", "interview", "accepted", "rejected"];

const seedApps: BoardApp[] = [
  { id: "c1",  job: "DevOps Engineer",     company: "Bosch",         status: "to-apply",  source: "platform", date: "2026-03-08" },
  { id: "c2",  job: "Cloud Architect",     company: "SAP SE",        status: "to-apply",  source: "platform", date: "2026-03-07" },
  { id: "c3",  job: "Data Engineer",       company: "Zalando",       status: "to-apply",  source: "platform", date: "2026-03-07" },
  { id: "c4",  job: "Senior Frontend Dev", company: "SAP SE",        status: "applied",   source: "platform", date: "2026-03-06" },
  { id: "c5",  job: "React Developer",     company: "Siemens",       status: "applied",   source: "self",     date: "2026-03-01" },
  { id: "c6",  job: "Backend Engineer",    company: "Deutsche Bank", status: "applied",   source: "platform", date: "2026-02-20" },
  { id: "c7",  job: "Full Stack Engineer", company: "BMW Group",     status: "interview", source: "platform", date: "2026-03-04" },
  { id: "c8",  job: "Tech Lead",           company: "Infineon",      status: "interview", source: "platform", date: "2026-02-25" },
  { id: "c9",  job: "Tech Lead",           company: "Bosch",         status: "accepted",  source: "platform", date: "2026-02-25" },
  { id: "c10", job: "Software Architect",  company: "Allianz",       status: "rejected",  source: "platform", date: "2026-02-28" },
  { id: "c11", job: "SRE Engineer",        company: "Delivery Hero", status: "rejected",  source: "self",     date: "2026-02-15" },
];

const emptyForm = {
  job: "",
  company: "",
  url: "",
  status: "to-apply" as AppStatus,
  date: new Date().toISOString().split("T")[0],
  salary: "",
  references: "",
  contactPerson: "",
  nextAction: "",
  jobDescription: "",
  cvUsed: "",
};

const formatDate = (iso: string) => {
  try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return iso; }
};

const CSV_COLUMNS = ["job", "company", "url", "status", "date", "salary", "contactPerson", "nextAction", "notes"] as const;
type CsvRow = { job: string; company: string; url: string; status: string; date: string; salary: string; contactPerson: string; nextAction: string; notes: string; _error?: string };

const CandidateApplications = () => {
  const { currentCustomer, updateCustomer } = useCustomers();
  const { toast } = useToast();
  const storageKey = currentCustomer ? `arbeitly_apps_${currentCustomer.id}` : null;

  const [apps, setApps] = useState<BoardApp[]>(() => {
    if (!currentCustomer) return seedApps;
    try {
      const stored = storageKey && localStorage.getItem(storageKey);
      if (stored) {
        return (JSON.parse(stored) as BoardApp[]).map((a) => ({
          ...a,
          status: (a.status === ("offer" as AppStatus) ? "accepted" : a.status) as AppStatus,
        }));
      }
      return [];
    } catch { return []; }
  });

  // Mark all unseen entries as seen on mount + update lastOpenedApplications
  useEffect(() => {
    if (!currentCustomer || !storageKey) return;
    const now = new Date().toISOString();
    const updated = apps.map((a) =>
      !a.seenByCandidate && a.addedById !== currentCustomer.id
        ? { ...a, seenByCandidate: true }
        : a
    );
    const hasUnseen = apps.some((a) => !a.seenByCandidate && a.addedById !== currentCustomer.id);
    if (hasUnseen) {
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setApps(updated);
    }
    updateCustomer(currentCustomer.id, { lastOpenedApplications: now });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(apps));
  }, [apps, storageKey]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "self" | "platform">("all");
  const [viewMode, setViewMode] = useState<"list" | "board">("board");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  // Flat CV options: name + version + variant for the "CV Used" selector
  const cvOptions = useMemo(() => {
    if (!currentCustomer) return [];
    try {
      const tree = JSON.parse(localStorage.getItem(`arbeitly_cv_tree_${currentCustomer.id}`) || "null");
      if (!tree) return [];
      const opts: { value: string; label: string }[] = [];
      if (tree.original?.content) opts.push({ value: "Original Upload", label: "Original Upload" });
      (tree.versions ?? []).forEach((v: { name: string; style?: string; language?: string; variants?: { label: string; style?: string; language?: string }[] }) => {
        if (v.name) {
          const meta = [v.style, v.language].filter(Boolean).join(", ");
          opts.push({ value: v.name, label: meta ? `${v.name} (${meta})` : v.name });
          (v.variants ?? []).forEach((vr) => {
            const vmeta = [vr.style, vr.language].filter(Boolean).join(", ");
            const val = `${v.name} › ${vr.label}`;
            opts.push({ value: val, label: vmeta ? `${val} (${vmeta})` : val });
          });
        }
      });
      return opts;
    } catch { return []; }
  }, [currentCustomer]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return apps.filter((a) => {
      const matchSearch = a.job.toLowerCase().includes(q) || a.company.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      const matchSource = sourceFilter === "all" || a.source === sourceFilter;
      return matchSearch && matchStatus && matchSource;
    });
  }, [apps, search, statusFilter, sourceFilter]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDuplicateWarning(false);
    setDialogOpen(true);
  };

  const openEdit = (app: BoardApp) => {
    setEditingId(app.id);
    setDuplicateWarning(false);
    setForm({
      job: app.job,
      company: app.company,
      url: app.url ?? "",
      status: app.status,
      date: app.date,
      salary: app.salary ?? "",
      references: app.references ?? "",
      contactPerson: app.contactPerson ?? "",
      nextAction: app.nextAction ?? "",
      jobDescription: app.jobDescription ?? "",
      cvUsed: app.cvUsed ?? "",
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.job.trim() || !form.company.trim()) return;
    if (editingId) {
      setApps((prev) => prev.map((a) => a.id === editingId ? {
        ...a,
        job: form.job.trim(),
        company: form.company.trim(),
        url: form.url.trim(),
        status: form.status,
        date: form.date,
        salary: form.salary.trim(),
        references: form.references.trim(),
        contactPerson: form.contactPerson.trim(),
        nextAction: form.nextAction.trim(),
        jobDescription: form.jobDescription.trim(),
        cvUsed: form.cvUsed.trim() || undefined,
      } : a));
    } else {
      const isDuplicate = apps.some(
        (a) =>
          a.company.toLowerCase() === form.company.trim().toLowerCase() &&
          a.job.toLowerCase() === form.job.trim().toLowerCase()
      );
      if (isDuplicate && !duplicateWarning) {
        setDuplicateWarning(true);
        return;
      }
      setApps((prev) => [{
        id: `app_${Date.now()}`,
        job: form.job.trim(),
        company: form.company.trim(),
        url: form.url.trim(),
        status: form.status,
        source: "self",
        addedById: currentCustomer?.id ?? "candidate",
        addedByName: currentCustomer?.fullName ?? "You",
        seenByCandidate: true,
        date: form.date,
        salary: form.salary.trim(),
        references: form.references.trim(),
        contactPerson: form.contactPerson.trim(),
        nextAction: form.nextAction.trim(),
        jobDescription: form.jobDescription.trim(),
        cvUsed: form.cvUsed.trim() || undefined,
      }, ...prev]);
    }
    setDialogOpen(false);
    setForm(emptyForm);
    setEditingId(null);
    setDuplicateWarning(false);
  };

  const handleDelete = (id: string) => {
    setApps((prev) => prev.filter((a) => a.id !== id));
  };

  const handleStatusChange = (id: string, status: AppStatus) => {
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
  };

  // ── CSV Import / Export ──
  const importRef = useRef<HTMLInputElement>(null);
  const [importDialog, setImportDialog] = useState(false);
  const [importRows, setImportRows] = useState<CsvRow[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const handleExportCsv = () => {
    const header = CSV_COLUMNS.join(",");
    const rows = apps.map((a) => CSV_COLUMNS.map((col) => {
      const val = (a as Record<string, unknown>)[col] ?? "";
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(","));
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url; el.download = `applications_${currentCustomer?.fullName?.replace(/\s+/g, "_") ?? "export"}.csv`;
    el.click(); URL.revokeObjectURL(url);
  };

  const handleDownloadTemplate = () => {
    const csv = CSV_COLUMNS.join(",") + "\n" + `"Software Engineer","Acme GmbH","https://example.com","to-apply","${new Date().toISOString().split("T")[0]}","€60,000","Jane Smith","Send CV","Great opportunity"`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url; el.download = "applications_template.csv"; el.click(); URL.revokeObjectURL(url);
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
      if (jobIdx === -1 || coIdx === -1) { toast({ title: "Invalid CSV — needs 'job' and 'company' columns", variant: "destructive" }); return; }
      const parseVal = (row: string[], idx: number) => idx >= 0 ? (row[idx] ?? "").replace(/^"|"$/g, "").trim() : "";
      const parsed: CsvRow[] = lines.slice(1).map((line) => {
        const cols = line.match(/("(?:[^"]|"")*"|[^,]*)/g) ?? line.split(",");
        const row: CsvRow = { job: parseVal(cols, jobIdx), company: parseVal(cols, coIdx), url: parseVal(cols, header.indexOf("url")), status: parseVal(cols, header.indexOf("status")) || "to-apply", date: parseVal(cols, header.indexOf("date")) || new Date().toISOString().split("T")[0], salary: parseVal(cols, header.indexOf("salary")), contactPerson: parseVal(cols, header.indexOf("contactperson")), nextAction: parseVal(cols, header.indexOf("nextaction")), notes: parseVal(cols, header.indexOf("notes")) };
        if (!row.job || !row.company) row._error = "Missing job or company";
        if (!allStatuses.includes(row.status as AppStatus)) row.status = "to-apply";
        return row;
      });
      setImportRows(parsed);
      setImportErrors(parsed.filter((r) => r._error).map((r, i) => `Row ${i + 2}: ${r._error}`));
      setImportDialog(true);
    };
    reader.readAsText(file); e.target.value = "";
  };

  const handleConfirmImport = () => {
    if (importErrors.length > 0) return;
    const newApps: BoardApp[] = importRows.map((r) => ({ id: `app_${Date.now()}_${Math.random().toString(36).slice(2)}`, job: r.job, company: r.company, url: r.url, status: r.status as AppStatus, date: r.date, salary: r.salary, contactPerson: r.contactPerson, nextAction: r.nextAction, source: "self", addedById: currentCustomer?.id, addedByName: currentCustomer?.fullName, seenByCandidate: true }));
    setApps((prev) => [...newApps, ...prev]);
    setImportDialog(false); setImportRows([]);
    toast({ title: `${newApps.length} application${newApps.length !== 1 ? "s" : ""} imported` });
  };

  const isPaid = currentCustomer?.planType === "paid";
  const applicationsUsed = currentCustomer?.applicationsUsed ?? 0;
  const applicationQuota = currentCustomer?.applicationQuota ?? 0;
  const quotaPct = applicationQuota > 0 ? Math.min(100, (applicationsUsed / applicationQuota) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Quota banner — paid only */}
      {isPaid && applicationQuota > 0 && (
        <div className={`flex items-center gap-4 rounded-xl border px-4 py-3 ${quotaPct >= 90 ? "border-destructive/30 bg-destructive/5" : "border-border bg-card"}`}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-card-foreground">Applications submitted by advisor</span>
              <span className={`text-xs font-semibold tabular-nums ${quotaPct >= 90 ? "text-destructive" : "text-card-foreground"}`}>
                {applicationsUsed} / {applicationQuota}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${quotaPct >= 90 ? "bg-destructive" : quotaPct >= 70 ? "bg-yellow-400" : "bg-primary"}`}
                style={{ width: `${quotaPct}%` }}
              />
            </div>
          </div>
          {applicationsUsed >= applicationQuota && (
            <p className="text-xs text-muted-foreground mt-1">Arbeitly applications paused — quota reached. Self applications still allowed.</p>
          )}
          {quotaPct >= 90 && applicationsUsed < applicationQuota && (
            <Button size="sm" className="rounded-full text-xs shrink-0 h-7" onClick={() => {}}>
              Upgrade Plan
            </Button>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Applications</h1>
          <p className="text-muted-foreground">{filtered.length} application{filtered.length !== 1 ? "s" : ""} tracked</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-border bg-secondary/40 p-0.5 gap-0.5">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode("list")}
              title="List view"
            >
              <LayoutList className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === "board" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode("board")}
              title="Kanban view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
          </div>
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
          <Button className="rounded-full gap-1 h-9" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Application
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search applications..." className="pl-9 h-9 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[150px] text-xs">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {allStatuses.map((s) => (
              <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Source filter toggle */}
        <div className="flex items-center rounded-lg border border-border bg-secondary/40 p-0.5 gap-0.5">
          <button
            type="button"
            onClick={() => setSourceFilter("all")}
            className={`px-3 h-7 rounded-md text-xs font-medium transition-colors ${sourceFilter === "all" ? "bg-card text-card-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSourceFilter("self")}
            className={`px-3 h-7 rounded-md text-xs font-medium transition-colors ${sourceFilter === "self" ? "bg-card text-card-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            Self
          </button>
          <button
            type="button"
            onClick={() => setSourceFilter("platform")}
            className={`px-3 h-7 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${sourceFilter === "platform" ? "bg-teal-500/20 text-teal-400 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 inline-block" />
            Arbeitly
          </button>
        </div>
      </div>

      {/* ── List View ── */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {filtered.map((app) => {
            const isOwn = !app.addedById || app.addedById === currentCustomer?.id;
            return (
            <div key={app.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary shrink-0">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-card-foreground text-sm">{app.job}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium shrink-0 ${statusColors[app.status]}`}>
                    {statusLabels[app.status]}
                  </span>
                  {app.source === "platform" ? (
                    <span className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium bg-teal-500/10 text-teal-400 border-teal-400/20 shrink-0">
                      <Sparkles className="h-2.5 w-2.5" /> Arbeitly
                    </span>
                  ) : (
                    <span className="rounded-full border px-2 py-0.5 text-[10px] font-medium bg-secondary text-muted-foreground border-border shrink-0">
                      Self
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                  <span className="font-medium">{app.company}</span>
                  <span>{formatDate(app.date)}</span>
                  {app.salary && <span>💰 {app.salary}</span>}
                  {app.contactPerson && <span>👤 {app.contactPerson}</span>}
                  {app.cvUsed && (() => {
                    const cvExists = cvOptions.some((o) => o.value === app.cvUsed);
                    return cvExists ? (
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" /> {app.cvUsed}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 line-through text-muted-foreground">
                        <FileText className="h-3 w-3" /> {app.cvUsed} <span className="no-underline not-italic">(not available)</span>
                      </span>
                    );
                  })()}
                  {app.url ? (
                    <a href={app.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                      <LinkIcon className="h-3 w-3" /> Job post
                    </a>
                  ) : (
                    <span className="rounded-full px-1.5 py-0.5 bg-secondary text-muted-foreground text-[9px]">No URL</span>
                  )}
                </div>
                {app.nextAction && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground/80 mt-1.5">
                    <MessageSquare className="h-3 w-3 shrink-0" />
                    <span className="truncate">Next: {app.nextAction}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Select value={app.status} onValueChange={(v) => handleStatusChange(app.id, v as AppStatus)} disabled={!isOwn}>
                  <SelectTrigger className="h-7 w-[120px] text-xs border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allStatuses.map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">{statusLabels[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isOwn && (
                  <>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => openEdit(app)}>
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => handleDelete(app.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <p className="text-sm">No applications yet.</p>
              <Button variant="outline" className="rounded-full gap-1 text-xs" onClick={openAdd}>
                <Plus className="h-3.5 w-3.5" /> Add your first application
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── Board / Kanban View ── */}
      {viewMode === "board" && (
        <div className="overflow-x-auto -mx-6 px-6 pb-4" style={{ scrollbarWidth: "thin" }}>
          <div className="flex gap-3" style={{ minWidth: "max-content" }}>
            {allStatuses.map((col) => {
              const colApps = filtered.filter((a) => a.status === col);
              return (
                <div key={col} className="flex flex-col gap-2 w-60 flex-shrink-0">
                  <div className="flex items-center justify-between px-1">
                    <span className={`text-xs font-semibold uppercase tracking-wider`}>{statusLabels[col]}</span>
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-muted-foreground px-1.5">
                      {colApps.length}
                    </span>
                  </div>
                  <div className="space-y-2 min-h-16">
                    {colApps.map((app) => {
                      const isOwn = !app.addedById || app.addedById === currentCustomer?.id;
                      return (
                        <div key={app.id} className="rounded-xl border border-border bg-card p-3 space-y-2 hover:border-primary/30 transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-card-foreground leading-snug">{app.job}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{app.company}</p>
                            </div>
                            {isOwn && (
                              <div className="flex shrink-0">
                                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => openEdit(app)}>
                                  <Pencil className="h-3 w-3 text-muted-foreground" />
                                </Button>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {app.source === "platform" ? (
                              <span className="flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[9px] font-medium bg-teal-500/10 text-teal-400 border-teal-400/20">
                                <Sparkles className="h-2 w-2" /> Arbeitly
                              </span>
                            ) : (
                              <span className="rounded-full border px-1.5 py-0.5 text-[9px] font-medium bg-secondary text-muted-foreground border-border">Self</span>
                            )}
                            {app.cvUsed && (() => {
                              const cvExists = cvOptions.some((o) => o.value === app.cvUsed);
                              return cvExists ? (
                                <span className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] bg-secondary text-muted-foreground">
                                  <FileText className="h-2 w-2" /> {app.cvUsed}
                                </span>
                              ) : (
                                <span className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] bg-secondary text-muted-foreground line-through">
                                  <FileText className="h-2 w-2" /> {app.cvUsed}
                                </span>
                              );
                            })()}
                            {!app.url && (
                              <span className="rounded-full px-1.5 py-0.5 bg-secondary text-muted-foreground text-[9px]">No URL</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground">{formatDate(app.date)}</span>
                            <Select value={app.status} onValueChange={(v) => handleStatusChange(app.id, v as AppStatus)} disabled={!isOwn}>
                              <SelectTrigger className="h-6 w-[100px] text-[10px] border-border px-1.5">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {allStatuses.map((s) => (
                                  <SelectItem key={s} value={s} className="text-xs">{statusLabels[s]}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      );
                    })}
                    {colApps.length === 0 && (
                      <div className="rounded-xl border border-dashed border-border/50 py-6 flex items-center justify-center">
                        <span className="text-[10px] text-muted-foreground/50">Empty</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="font-display">{editingId ? "Edit Application" : "Add Application"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 overflow-y-auto flex-1 pr-1">
            {/* Row 1: Position + Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Position Name <span className="text-destructive">*</span></Label>
                <Input className="mt-1.5" placeholder="e.g. Software Engineer" value={form.job} onChange={(e) => setForm({ ...form, job: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Company <span className="text-destructive">*</span></Label>
                <Input className="mt-1.5" placeholder="e.g. Siemens" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
              <div>
                <Label>Application Date</Label>
                <Input className="mt-1.5" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as AppStatus })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {allStatuses.map((s) => <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Salary</Label>
                <Input className="mt-1.5" placeholder="e.g. €60,000/yr" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Contact Person</Label>
                <Input className="mt-1.5" placeholder="e.g. Anna Müller" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
              </div>
              <div>
                <Label>References</Label>
                <Input className="mt-1.5" placeholder="e.g. John Smith" value={form.references} onChange={(e) => setForm({ ...form, references: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Website / Job URL</Label>
              <Input className="mt-1.5" placeholder="https://..." value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
            </div>
            <div>
              <Label>Next Action Steps</Label>
              <Input className="mt-1.5" placeholder="e.g. Follow up on Friday" value={form.nextAction} onChange={(e) => setForm({ ...form, nextAction: e.target.value })} />
            </div>
            {cvOptions.length > 0 && (
              <div>
                <Label>CV Used</Label>
                <Select value={form.cvUsed} onValueChange={(v) => setForm({ ...form, cvUsed: v === "__none__" ? "" : v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select CV used (optional)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None</SelectItem>
                    {cvOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>Job Description</Label>
              <Textarea className="mt-1.5 resize-none" placeholder="Paste or summarise the job description..." rows={4} value={form.jobDescription} onChange={(e) => setForm({ ...form, jobDescription: e.target.value })} />
            </div>
          </div>
          {duplicateWarning && (
            <p className="text-xs text-yellow-400 flex items-center gap-1.5 pb-1">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              A similar application already exists. You can still save it.
            </p>
          )}
          <DialogFooter className="shrink-0 pt-2">
            <Button variant="outline" onClick={() => { setDialogOpen(false); setDuplicateWarning(false); }}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.job.trim() || !form.company.trim()}>
              {editingId ? "Save Changes" : "Add Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Preview Dialog */}
      <Dialog open={importDialog} onOpenChange={setImportDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-display">Import Applications</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{importRows.length} row{importRows.length !== 1 ? "s" : ""} found. {importErrors.length > 0 ? "Fix all errors before importing." : "Review and confirm."}</p>
          {importErrors.length > 0 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-1">
              {importErrors.map((e, i) => <p key={i} className="flex items-center gap-2 text-xs text-destructive"><AlertTriangle className="h-3.5 w-3.5 shrink-0" />{e}</p>)}
            </div>
          )}
          <div className="overflow-auto flex-1 border border-border rounded-lg">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-secondary/80 backdrop-blur">
                <tr>{["Job", "Company", "Status", "Date", "Salary", "Contact", "Next Action"].map((h) => <th key={h} className="text-left px-3 py-2 text-muted-foreground font-medium whitespace-nowrap">{h}</th>)}</tr>
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

export default CandidateApplications;
