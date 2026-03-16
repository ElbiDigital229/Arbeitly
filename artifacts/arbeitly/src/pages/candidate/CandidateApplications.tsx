import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar, Building2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AppStatus = "to-apply" | "applied" | "interview" | "offer" | "rejected";

type CandidateApp = {
  id: string;
  job: string;
  company: string;
  location: string;
  salary: string;
  appliedDate: string;
  status: AppStatus;
  note: string;
};

const statusLabels: Record<AppStatus, string> = {
  "to-apply": "To Apply",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

const statusColors: Record<AppStatus, string> = {
  "to-apply": "bg-muted text-muted-foreground",
  applied: "bg-info/10 text-info",
  interview: "bg-warning/10 text-warning",
  offer: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

const applications: CandidateApp[] = [
  { id: "1", job: "DevOps Engineer", company: "Bosch", location: "Stuttgart, DE", salary: "€90k–€105k", appliedDate: "—", status: "to-apply", note: "Great match for cloud background. Apply before March 15." },
  { id: "2", job: "Cloud Architect", company: "SAP SE", location: "Walldorf, DE", salary: "€95k–€115k", appliedDate: "—", status: "to-apply", note: "Strong AWS requirement. Worth applying." },
  { id: "3", job: "Data Engineer", company: "Zalando", location: "Berlin, DE (Remote)", salary: "€100k+", appliedDate: "—", status: "to-apply", note: "Remote-friendly role. Target company." },
  { id: "4", job: "Senior Frontend Dev", company: "SAP SE", location: "Walldorf, DE", salary: "€85k–€100k", appliedDate: "Mar 6, 2026", status: "applied", note: "Applied via LinkedIn. Awaiting response." },
  { id: "5", job: "React Developer", company: "Siemens", location: "Munich, DE", salary: "€120k+", appliedDate: "Mar 1, 2026", status: "applied", note: "Submitted through company portal." },
  { id: "6", job: "Backend Engineer", company: "Deutsche Bank", location: "Frankfurt, DE", salary: "€70k–€85k", appliedDate: "Feb 20, 2026", status: "applied", note: "Applied through referral from colleague." },
  { id: "7", job: "Platform Engineer", company: "BMW Group", location: "Munich, DE", salary: "€50k–€60k", appliedDate: "Feb 18, 2026", status: "applied", note: "Waiting for initial screening." },
  { id: "8", job: "Full Stack Engineer", company: "BMW Group", location: "Munich, DE", salary: "€90k–€105k", appliedDate: "Feb 25, 2026", status: "interview", note: "Interview scheduled for March 12. Technical round." },
  { id: "9", job: "Tech Lead", company: "Infineon", location: "Neubiberg, DE", salary: "€100k+", appliedDate: "Feb 15, 2026", status: "interview", note: "2nd round pending. Good feedback from hiring manager." },
  { id: "10", job: "Tech Lead", company: "Bosch", location: "Stuttgart, DE", salary: "€120k+", appliedDate: "Feb 10, 2026", status: "offer", note: "Offer received: €125k base + bonus. Reviewing contract." },
  { id: "11", job: "Software Architect", company: "Allianz", location: "Munich, DE", salary: "€80k–€95k", appliedDate: "Feb 10, 2026", status: "rejected", note: "Rejected after technical screen. Lacking cloud certifications." },
  { id: "12", job: "SRE Engineer", company: "Delivery Hero", location: "Berlin, DE", salary: "€50k–€60k", appliedDate: "Feb 1, 2026", status: "rejected", note: "Overqualified note in rejection." },
];

const CandidateApplications = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      const q = search.toLowerCase();
      const matchesSearch = a.job.toLowerCase().includes(q) || a.company.toLowerCase().includes(q) || a.location.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Applications</h1>
        <p className="text-muted-foreground">{filtered.length} application{filtered.length !== 1 ? "s" : ""} tracked</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search applications..." className="pl-9 h-9 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[180px] text-xs">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="to-apply">To Apply</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((app) => (
          <div key={app.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary shrink-0">
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-card-foreground text-sm truncate">{app.job}</p>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium shrink-0 ${statusColors[app.status]}`}>
                  {statusLabels[app.status]}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="font-medium">{app.company}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {app.location}
                </span>
                <span>{app.salary}</span>
                {app.appliedDate !== "—" && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {app.appliedDate}
                  </span>
                )}
              </div>
              {app.note && (
                <p className="text-xs text-muted-foreground/80 mt-1.5 truncate">{app.note}</p>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No applications match your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateApplications;
