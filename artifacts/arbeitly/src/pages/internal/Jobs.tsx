import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApplications } from "@/context/ApplicationsContext";
import { useToast } from "@/hooks/use-toast";
import {
  Search, ExternalLink, MapPin, Building, ChevronDown, ChevronUp,
  Zap, Clock, RefreshCw, TrendingUp, Star, UserCheck, Briefcase, Plus,
  X, Tag,
} from "lucide-react";

// ─── Types & shared data from @/data/jobs ─────────────────────────────────────

import {
  type JobSource, type JobListing,
  seedJobs, computeScore, sourceBadgeColors, scoreColor, scoreBarColor,
} from "@/data/jobs";

type CandidateProfile = {
  name: string;
  initials: string;
  plan: "Basic" | "Standard" | "Premium" | "Ultimate";
  skills: string[];
  suggestedCv: string;
};

// ─── Seed data ────────────────────────────────────────────────────────────────

const candidateProfiles: CandidateProfile[] = [
  { name: "Anna Schmidt",  initials: "AS", plan: "Premium",  skills: ["Figma", "UX Research", "Prototyping", "Design Systems", "HTML/CSS"], suggestedCv: "v2" },
  { name: "Thomas Wagner", initials: "TW", plan: "Standard", skills: ["Python", "SQL", "Power BI", "Excel", "Tableau"], suggestedCv: "v3" },
  { name: "Lisa Müller",   initials: "LM", plan: "Premium",  skills: ["Java", "Spring Boot", "Kubernetes", "AWS", "React"], suggestedCv: "v2" },
  { name: "Peter Fischer", initials: "PF", plan: "Ultimate", skills: ["Team Leadership", "System Architecture", "Python", "Go", "Agile / Scrum"], suggestedCv: "v1" },
  { name: "Maria Becker",  initials: "MB", plan: "Basic",    skills: ["Social Media", "Content Marketing", "Google Ads", "Canva", "Copywriting"], suggestedCv: "v1" },
  { name: "Hans Schulz",   initials: "HS", plan: "Standard", skills: ["PRINCE2", "MS Project", "Risk Management", "Stakeholder Management", "SAP"], suggestedCv: "v1" },
];

const jobs = seedJobs;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const planColors: Record<string, string> = {
  Basic: "bg-muted text-muted-foreground",
  Standard: "bg-blue-500/15 text-blue-400",
  Premium: "bg-primary/15 text-primary",
  Ultimate: "bg-purple-500/15 text-purple-400",
};

// ─── JobCard ─────────────────────────────────────────────────────────────────

type ScoredCandidate = CandidateProfile & { score: number; added: boolean };

function JobCard({ job, onAddToQueue }: {
  job: JobListing;
  onAddToQueue: (job: JobListing, candidate: CandidateProfile) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [addedNames, setAddedNames] = useState<Set<string>>(new Set());

  const scored: ScoredCandidate[] = candidateProfiles
    .map((c) => ({ ...c, score: computeScore(job.skills, c.skills), added: addedNames.has(c.name) }))
    .sort((a, b) => b.score - a.score);

  const topCandidate = scored[0];

  const handleAdd = (candidate: CandidateProfile) => {
    onAddToQueue(job, candidate);
    setAddedNames((prev) => new Set(prev).add(candidate.name));
  };

  return (
    <Card className="border-border bg-card overflow-hidden">
      {/* Summary row */}
      <CardContent className="p-0">
        <button
          className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-secondary/30 transition-colors"
          onClick={() => setExpanded((e) => !e)}
        >
          {/* Company initial circle */}
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0 mt-0.5">
            {job.company[0]}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{job.title}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Building className="h-3 w-3" />{job.company}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />{job.location}
                  </span>
                  <span className="text-xs text-primary font-medium">{job.salaryRange}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sourceBadgeColors[job.source]}`}>
                  {job.source}
                </span>
                <div className={`flex items-center gap-1 text-xs font-bold ${scoreColor(topCandidate.score)}`}>
                  <Star className="h-3 w-3" />
                  {topCandidate.score}%
                </div>
                {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {job.skills.map((s) => (
                <span key={s} className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </button>

        {/* Expanded panel */}
        {expanded && (
          <div className="border-t border-border bg-background/50">
            {/* Description */}
            <div className="px-5 py-4">
              <p className="text-xs text-muted-foreground leading-relaxed">{job.description}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> Discovered {job.dateDiscovered}
                </span>
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3" /> View full listing
                </a>
              </div>
            </div>

            {/* Candidate match list */}
            <div className="px-5 pb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Candidate Match Ranking
              </p>
              <div className="space-y-2">
                {scored.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center gap-3 rounded-xl bg-card border border-border px-3 py-2.5"
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[11px] font-bold text-secondary-foreground shrink-0">
                      {c.initials}
                    </div>

                    {/* Name + plan */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-foreground truncate">{c.name}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${planColors[c.plan]}`}>
                          {c.plan}
                        </span>
                      </div>
                      {/* Score bar */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${scoreBarColor(c.score)}`}
                            style={{ width: `${c.score}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-bold min-w-[28px] ${scoreColor(c.score)}`}>
                          {c.score}%
                        </span>
                      </div>
                    </div>

                    {/* Suggested CV tag */}
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium shrink-0">
                      {c.suggestedCv}
                    </span>

                    {/* Action */}
                    <Button
                      size="sm"
                      variant={c.added ? "outline" : "default"}
                      disabled={c.added}
                      className="h-7 px-2.5 text-[11px] gap-1 shrink-0 rounded-full"
                      onClick={() => handleAdd(c)}
                    >
                      {c.added ? (
                        <><UserCheck className="h-3 w-3" /> Added</>
                      ) : (
                        <><Plus className="h-3 w-3" /> Add to Queue</>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const thresholdOptions = [
  { label: "All matches", value: 0 },
  { label: "50%+", value: 50 },
  { label: "60%+", value: 60 },
  { label: "75%+", value: 75 },
  { label: "90%+", value: 90 },
];

// ─── Blank form state ─────────────────────────────────────────────────────────

const blankForm = {
  title: "", company: "", location: "", source: "Manual" as JobSource,
  url: "", description: "", skillsRaw: "", salaryRange: "",
};

// ─── Main component ───────────────────────────────────────────────────────────

const Jobs = () => {
  const { addApplication } = useApplications();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [threshold, setThreshold] = useState(0);
  const [allJobs, setAllJobs] = useState<JobListing[]>(jobs);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(blankForm);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const set = (field: keyof typeof blankForm, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const addTag = () => {
    const v = tagInput.trim();
    if (v && !tags.includes(v)) setTags((t) => [...t, v]);
    setTagInput("");
  };

  const handleOpen = () => {
    setForm(blankForm);
    setTags([]);
    setTagInput("");
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.company.trim()) {
      toast({ title: "Required fields missing", description: "Title and company are required.", variant: "destructive" });
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const newJob: JobListing = {
      id: `manual-${Date.now()}`,
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location.trim() || "Remote",
      source: form.source,
      url: form.url.trim(),
      dateDiscovered: today,
      description: form.description.trim() || "No description provided.",
      skills: tags.length > 0 ? tags : form.skillsRaw.split(",").map((s) => s.trim()).filter(Boolean),
      salaryRange: form.salaryRange.trim(),
    };
    setAllJobs((prev) => [newJob, ...prev]);
    setDialogOpen(false);
    toast({ title: "Job added", description: `${newJob.title} at ${newJob.company} added to Job Discovery.` });
  };

  const filtered = allJobs.filter((j) => {
    const q = search.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.source.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q)
    );
  });

  const handleAddToQueue = (job: JobListing, candidate: CandidateProfile) => {
    const score = computeScore(job.skills, candidate.skills);
    addApplication({
      candidate: candidate.name,
      job: job.title,
      company: job.company,
      cvVersion: candidate.suggestedCv,
      status: "to-apply",
      datePosted: job.dateDiscovered,
      dateSubmitted: "",
      salaryExpectation: job.salaryRange,
      jobUrl: job.url,
      notes: `Discovered via ${job.source} on ${job.dateDiscovered}. AI match score: ${score}%.`,
    });
    toast({
      title: "Added to queue",
      description: `${job.title} added to ${candidate.name}'s applications.`,
    });
  };

  const visibleJobs = threshold === 0
    ? filtered
    : filtered.filter((j) => {
        const bestScore = Math.max(...candidateProfiles.map((c) => computeScore(j.skills, c.skills)));
        return bestScore >= threshold;
      });

  return (
    <div className="flex flex-col h-full -m-6 overflow-hidden">
      {/* ── Add Job Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" /> Add Job Manually
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[65vh] pr-3">
            <div className="space-y-4 pb-1">
              {/* Title + Company */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Job Title <span className="text-destructive">*</span></Label>
                  <Input placeholder="e.g. Senior UX Designer" value={form.title} onChange={(e) => set("title", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Company <span className="text-destructive">*</span></Label>
                  <Input placeholder="e.g. Zalando SE" value={form.company} onChange={(e) => set("company", e.target.value)} />
                </div>
              </div>

              {/* Location + Source */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Location</Label>
                  <Input placeholder="e.g. Berlin (Hybrid)" value={form.location} onChange={(e) => set("location", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Source</Label>
                  <Select value={form.source} onValueChange={(v) => set("source", v as JobSource)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Indeed">Indeed</SelectItem>
                      <SelectItem value="Google Jobs">Google Jobs</SelectItem>
                      <SelectItem value="StepStone">StepStone</SelectItem>
                      <SelectItem value="XING">XING</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Salary + URL */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Salary Range</Label>
                  <Input placeholder="e.g. €60k–€80k" value={form.salaryRange} onChange={(e) => set("salaryRange", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Job URL</Label>
                  <Input placeholder="https://…" value={form.url} onChange={(e) => set("url", e.target.value)} />
                </div>
              </div>

              {/* Skills tag builder */}
              <div className="space-y-1.5">
                <Label>Required Skills</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a skill and press Enter or +"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    className="flex-1"
                  />
                  <Button type="button" variant="secondary" size="sm" onClick={addTag} className="shrink-0">
                    <Tag className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((t) => (
                      <span key={t} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                        {t}
                        <button onClick={() => setTags((prev) => prev.filter((x) => x !== t))}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label>Job Description</Label>
                <Textarea
                  placeholder="Paste the job description here…"
                  className="min-h-[100px] text-sm resize-none"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="mt-2">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Header ── */}
      <div className="shrink-0 px-6 py-4 border-b border-border bg-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" /> Job Discovery
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {allJobs.length} jobs found across {new Set(allJobs.map((j) => j.source)).size} sources
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button size="sm" onClick={handleOpen} className="h-8 gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Add Manually
            </Button>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <RefreshCw className="h-3 w-3" /> Last synced: 2 min ago
            </span>
            <div className="flex items-center gap-2 text-xs">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <span className="text-foreground font-medium">{visibleJobs.length}</span>
              <span className="text-muted-foreground">matching jobs</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search jobs, companies, sources…"
              className="pl-9 h-8 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Score threshold chips */}
          <div className="flex items-center gap-1.5">
            {thresholdOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setThreshold(opt.value)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                  threshold === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Job list ── */}
      <div className="flex-1 overflow-y-auto p-6">
        {visibleJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <Briefcase className="h-7 w-7 text-primary/60" />
            </div>
            <p className="text-sm font-medium text-foreground">No jobs match your filters</p>
            <p className="text-xs text-muted-foreground mt-1">Try lowering the match threshold or clearing the search.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleJobs.map((job) => (
              <JobCard key={job.id} job={job} onAddToQueue={handleAddToQueue} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
