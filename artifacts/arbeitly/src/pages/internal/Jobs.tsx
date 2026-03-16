import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApplications } from "@/context/ApplicationsContext";
import { useToast } from "@/hooks/use-toast";
import {
  Search, ExternalLink, MapPin, Building, ChevronDown, ChevronUp,
  Zap, Clock, RefreshCw, TrendingUp, Star, UserCheck, Briefcase, Plus,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type JobSource = "LinkedIn" | "Indeed" | "Google Jobs" | "StepStone" | "XING";

type JobListing = {
  id: string;
  title: string;
  company: string;
  location: string;
  source: JobSource;
  url: string;
  dateDiscovered: string;
  description: string;
  skills: string[];
  salaryRange: string;
};

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

const jobs: JobListing[] = [
  {
    id: "j1", title: "Senior UX Designer", company: "N26", location: "Berlin (Hybrid)",
    source: "LinkedIn", url: "https://n26.com/careers/ux-designer", dateDiscovered: "2026-03-12",
    description: "Join our design team to create user-centred experiences for 8M+ customers across mobile and web. Own the end-to-end design process for key product areas alongside product and engineering.",
    skills: ["Figma", "UX Research", "Design Systems", "Prototyping", "HTML/CSS"],
    salaryRange: "€80k–€95k",
  },
  {
    id: "j2", title: "Full Stack Engineer", company: "BMW Group", location: "Munich",
    source: "Indeed", url: "https://bmw-group.com/jobs/fullstack", dateDiscovered: "2026-03-12",
    description: "Build and maintain scalable web applications for BMW's internal platforms. Work with React on the frontend and Java Spring Boot on the backend in an agile product team.",
    skills: ["React", "Java", "Spring Boot", "AWS", "Kubernetes"],
    salaryRange: "€90k–€110k",
  },
  {
    id: "j3", title: "Senior Data Analyst", company: "McKinsey & Company", location: "Frankfurt",
    source: "LinkedIn", url: "https://mckinsey.com/careers/analyst", dateDiscovered: "2026-03-11",
    description: "Deliver data-driven insights for C-suite clients across financial services and automotive. Requires strong SQL, Python, and visualisation skills to translate data into clear stories.",
    skills: ["Python", "SQL", "Tableau", "Power BI", "Excel"],
    salaryRange: "€75k–€90k",
  },
  {
    id: "j4", title: "Software Architect", company: "Allianz", location: "Munich",
    source: "Google Jobs", url: "https://allianz.com/careers/architect", dateDiscovered: "2026-03-11",
    description: "Design and evolve cloud-native architecture for Allianz Digital. Lead technical decision-making for a cross-functional team of 12 engineers and define the long-term platform roadmap.",
    skills: ["System Architecture", "AWS", "Go", "Python", "Team Leadership"],
    salaryRange: "€100k–€125k",
  },
  {
    id: "j5", title: "Growth Marketing Manager", company: "About You", location: "Hamburg",
    source: "XING", url: "https://aboutyou.com/careers/marketing", dateDiscovered: "2026-03-10",
    description: "Drive user acquisition and retention through data-driven campaigns. Own paid social, SEO, and content channels. Report directly to the CMO and manage a €500k quarterly budget.",
    skills: ["Google Ads", "Social Media", "Content Marketing", "Copywriting", "Canva"],
    salaryRange: "€45k–€60k",
  },
  {
    id: "j6", title: "Programme Manager", company: "Bosch", location: "Stuttgart",
    source: "StepStone", url: "https://bosch.com/careers/programme-manager", dateDiscovered: "2026-03-10",
    description: "Lead cross-functional programmes in Bosch's manufacturing division. Coordinate 3+ projects simultaneously. Strong PRINCE2, MS Project, and SAP experience required.",
    skills: ["PRINCE2", "MS Project", "Stakeholder Management", "Risk Management", "SAP"],
    salaryRange: "€80k–€100k",
  },
  {
    id: "j7", title: "Backend Engineer (Go)", company: "Celonis", location: "Munich / Remote",
    source: "LinkedIn", url: "https://celonis.com/careers/backend-go", dateDiscovered: "2026-03-09",
    description: "Build high-throughput data processing systems in Go for Celonis's process mining platform. Work in a product team shipping features used daily by Fortune 500 companies.",
    skills: ["Go", "AWS", "Kubernetes", "System Architecture", "Python"],
    salaryRange: "€95k–€115k",
  },
  {
    id: "j8", title: "Tech Lead – Platform", company: "Personio", location: "Munich / Berlin",
    source: "LinkedIn", url: "https://personio.com/careers/tech-lead", dateDiscovered: "2026-03-09",
    description: "Lead a team of 6 engineers building Personio's core HR platform. Set technical direction, run architecture reviews, and mentor engineers. React, Java, and strong agile skills required.",
    skills: ["Team Leadership", "System Architecture", "Agile / Scrum", "React", "Java"],
    salaryRange: "€110k–€130k",
  },
];

// ─── Scoring ──────────────────────────────────────────────────────────────────

function computeScore(jobSkills: string[], candidateSkills: string[]): number {
  if (jobSkills.length === 0) return 0;
  const lower = candidateSkills.map((s) => s.toLowerCase());
  const matches = jobSkills.filter((s) => lower.includes(s.toLowerCase())).length;
  return Math.round((matches / jobSkills.length) * 100);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sourceBadgeColors: Record<JobSource, string> = {
  LinkedIn: "bg-[#0077B5]/15 text-[#0077B5]",
  Indeed: "bg-[#2557A7]/15 text-[#5580cc]",
  "Google Jobs": "bg-[#EA4335]/15 text-[#EA4335]",
  StepStone: "bg-[#E8650A]/15 text-[#E8650A]",
  XING: "bg-[#006567]/15 text-[#00a0a0]",
};

const planColors: Record<string, string> = {
  Basic: "bg-muted text-muted-foreground",
  Standard: "bg-blue-500/15 text-blue-400",
  Premium: "bg-primary/15 text-primary",
  Ultimate: "bg-purple-500/15 text-purple-400",
};

function scoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-muted-foreground";
}

function scoreBarColor(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-warning";
  return "bg-muted-foreground";
}

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

const Jobs = () => {
  const { addApplication } = useApplications();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [threshold, setThreshold] = useState(0);

  const filtered = jobs.filter((j) => {
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
      {/* ── Header ── */}
      <div className="shrink-0 px-6 py-4 border-b border-border bg-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" /> Job Discovery
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {jobs.length} jobs found across {new Set(jobs.map((j) => j.source)).size} sources
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
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
