import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Settings2, Play, Pause, Trash2, Plus, Clock, Globe } from "lucide-react";
import { useScraperConfig, type ScraperConfig, type ScraperSource, type ScraperCadence } from "@/context/ScraperConfigContext";
import { useCustomers } from "@/context/CustomersContext";

const SOURCES: { value: ScraperSource; label: string }[] = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "indeed", label: "Indeed" },
  { value: "xing", label: "XING" },
  { value: "stepstone", label: "StepStone" },
];

const CADENCES: { value: ScraperCadence; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "every-48h", label: "Every 48 hours" },
  { value: "weekly", label: "Weekly" },
  { value: "manual", label: "Manual only" },
];

const emptyConfig = (candidateId = ""): Omit<ScraperConfig, "candidateId"> & { candidateId: string } => ({
  candidateId,
  isActive: true,
  sources: ["linkedin", "indeed"],
  targetRoles: "",
  locations: "",
  industries: "",
  jobType: "full-time",
  keywords: "",
  cadence: "daily",
});

export default function SuperAdminScraper() {
  const { configs, upsertConfig, deleteConfig } = useScraperConfig();
  const { customers } = useCustomers();
  const [dialog, setDialog] = useState<{ open: boolean; form: ReturnType<typeof emptyConfig> }>({ open: false, form: emptyConfig() });
  const [search, setSearch] = useState("");

  const openAdd = () => setDialog({ open: true, form: emptyConfig() });
  const openEdit = (c: ScraperConfig) => setDialog({ open: true, form: { ...c } });
  const closeDialog = () => setDialog({ open: false, form: emptyConfig() });

  const setField = <K extends keyof ScraperConfig>(k: K, v: ScraperConfig[K]) =>
    setDialog((prev) => ({ ...prev, form: { ...prev.form, [k]: v } }));

  const toggleSource = (source: ScraperSource) => {
    const curr = dialog.form.sources;
    const next = curr.includes(source) ? curr.filter((s) => s !== source) : [...curr, source];
    setField("sources", next);
  };

  const handleSave = () => {
    if (!dialog.form.candidateId) return;
    upsertConfig(dialog.form);
    closeDialog();
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "Never";
    try { return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); }
    catch { return iso; }
  };

  const filteredConfigs = configs.filter((c) => {
    const cand = customers.find((x) => x.id === c.candidateId);
    return !search || cand?.fullName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Scraper & Job Matching</h1>
          <p className="text-muted-foreground">Per-candidate scraper configuration and job discovery settings</p>
        </div>
        <Button onClick={openAdd} className="rounded-full gap-2">
          <Plus className="h-4 w-4" /> Configure Candidate
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground">Total Configs</p>
          <p className="font-display text-2xl font-bold mt-1">{configs.length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="flex items-center gap-2"><Play className="h-4 w-4 text-green-400" /><p className="text-xs text-muted-foreground">Active</p></div>
          <p className="font-display text-2xl font-bold mt-1">{configs.filter((c) => c.isActive).length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="flex items-center gap-2"><Pause className="h-4 w-4 text-yellow-400" /><p className="text-xs text-muted-foreground">Paused</p></div>
          <p className="font-display text-2xl font-bold mt-1">{configs.filter((c) => !c.isActive).length}</p>
        </CardContent></Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input placeholder="Search candidates..." className="pl-9 h-9 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Config cards */}
      <div className="space-y-3">
        {filteredConfigs.map((c) => {
          const cand = customers.find((x) => x.id === c.candidateId);
          return (
            <Card key={c.candidateId} className={c.isActive ? "" : "opacity-60"}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-card-foreground">{cand?.fullName ?? c.candidateId}</p>
                      <Badge variant={c.isActive ? "default" : "secondary"} className="text-[10px]">
                        {c.isActive ? "Active" : "Paused"}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] gap-1">
                        <Clock className="h-2.5 w-2.5" />{CADENCES.find((x) => x.value === c.cadence)?.label ?? c.cadence}
                      </Badge>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-muted-foreground">
                      <span><strong className="text-card-foreground">Roles:</strong> {c.targetRoles || "—"}</span>
                      <span><strong className="text-card-foreground">Location:</strong> {c.locations || "—"}</span>
                      <span><strong className="text-card-foreground">Industry:</strong> {c.industries || "—"}</span>
                      <span><strong className="text-card-foreground">Type:</strong> {c.jobType || "—"}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      {c.sources.map((s) => (
                        <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{s}</span>
                      ))}
                    </div>
                    <div className="mt-2 text-[11px] text-muted-foreground flex items-center gap-4">
                      <span>Last run: {formatDate(c.lastRunAt)}</span>
                      <span>Next: {formatDate(c.nextRunAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Switch
                      checked={c.isActive}
                      onCheckedChange={(v) => upsertConfig({ ...c, isActive: v })}
                    />
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(c)}>
                      <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { if (confirm("Delete?")) deleteConfig(c.candidateId); }}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filteredConfigs.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <Globe className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No scraper configs yet. Add one to start discovering jobs.</p>
          </div>
        )}
      </div>

      {/* Config Dialog */}
      <Dialog open={dialog.open} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{dialog.form.candidateId && configs.find((c) => c.candidateId === dialog.form.candidateId) ? "Edit Scraper Config" : "Configure Scraper"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Candidate</Label>
              <Select value={dialog.form.candidateId} onValueChange={(v) => setField("candidateId", v)}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select candidate" /></SelectTrigger>
                <SelectContent>
                  {customers.filter((c) => c.planType === "paid").map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Target Roles</Label>
              <Input className="mt-1.5" placeholder="e.g. Software Engineer, Product Manager" value={dialog.form.targetRoles} onChange={(e) => setField("targetRoles", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Locations</Label>
                <Input className="mt-1.5" placeholder="e.g. Berlin, Munich" value={dialog.form.locations} onChange={(e) => setField("locations", e.target.value)} />
              </div>
              <div>
                <Label>Industries</Label>
                <Input className="mt-1.5" placeholder="e.g. Tech, Finance" value={dialog.form.industries} onChange={(e) => setField("industries", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Job Type</Label>
                <Select value={dialog.form.jobType} onValueChange={(v) => setField("jobType", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Cadence</Label>
                <Select value={dialog.form.cadence} onValueChange={(v) => setField("cadence", v as ScraperCadence)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CADENCES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Keywords</Label>
              <Input className="mt-1.5" placeholder="e.g. React, TypeScript, Agile" value={dialog.form.keywords} onChange={(e) => setField("keywords", e.target.value)} />
            </div>
            <div>
              <Label className="mb-2 block">Sources</Label>
              <div className="flex flex-wrap gap-2">
                {SOURCES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => toggleSource(s.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      dialog.form.sources.includes(s.value)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-muted-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={dialog.form.isActive} onCheckedChange={(v) => setField("isActive", v)} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSave} disabled={!dialog.form.candidateId || !dialog.form.targetRoles}>Save Config</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
