import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCustomers } from "@/context/CustomersContext";
import { useEmployees } from "@/context/EmployeesContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Search,
  Briefcase,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  LayoutGrid,
  List,
  Mail,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";

type AppStatus = "to-apply" | "applied" | "interview" | "accepted" | "rejected";
type BoardApp = { id: string; status: AppStatus };

const getStats = (candidateId: string) => {
  try {
    const stored = localStorage.getItem(`arbeitly_apps_${candidateId}`);
    if (!stored) return { total: 0, interviews: 0, accepted: 0 };
    const apps = JSON.parse(stored) as BoardApp[];
    return {
      total: apps.length,
      interviews: apps.filter((a) => a.status === "interview").length,
      accepted: apps.filter((a) => a.status === "accepted").length,
    };
  } catch {
    return { total: 0, interviews: 0, accepted: 0 };
  }
};

const EmployeeCandidates = () => {
  const navigate = useNavigate();
  const { customers } = useCustomers();
  const { currentEmployee } = useEmployees();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");

  const assignedIds = currentEmployee?.assignedCandidateIds ?? [];
  const assignedCandidates = customers
    .filter((c) => assignedIds.includes(c.id))
    .filter((c) => {
      const q = search.toLowerCase();
      return (
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.onboarding?.currentJobTitle ?? "").toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-foreground">My Candidates</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {assignedIds.length} candidate{assignedIds.length !== 1 ? "s" : ""} assigned to you
          </p>
        </div>

        {/* Search */}
        <div className="relative w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            className="pl-9 h-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => setView("list")}
          >
            <List className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {assignedCandidates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
          <User className="h-10 w-10 opacity-30" />
          <p className="text-sm">
            {search ? "No candidates match your search." : "No candidates assigned to you yet."}
          </p>
        </div>
      )}

      {/* ── LIST VIEW ── */}
      {view === "list" && assignedCandidates.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_40px] gap-4 px-5 py-3 bg-secondary/40 border-b border-border text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            <span>Candidate</span>
            <span>Contact</span>
            <span>Field</span>
            <span className="text-center">Apps</span>
            <span className="text-center">Interviews</span>
            <span className="text-center">Accepted</span>
            <span />
          </div>

          {/* Rows */}
          {assignedCandidates.map((candidate, i) => {
            const stats = getStats(candidate.id);
            const jobTitle = candidate.onboarding?.currentJobTitle;
            const field = candidate.onboarding?.currentField;
            const initials = candidate.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={candidate.id}
                className={`group grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_40px] gap-4 px-5 py-3.5 items-center hover:bg-secondary/30 transition-colors cursor-pointer ${
                  i !== assignedCandidates.length - 1 ? "border-b border-border/60" : ""
                }`}
                onClick={() => navigate(`/employee/portal/candidates/${candidate.id}`)}
              >
                {/* Name + title */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-xs font-bold text-primary">{initials}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-card-foreground truncate">
                      {candidate.fullName}
                    </p>
                    {jobTitle && (
                      <p className="text-xs text-muted-foreground truncate">{jobTitle}</p>
                    )}
                    <Badge
                      variant={candidate.planType === "paid" ? "default" : "secondary"}
                      className="text-[9px] px-1.5 py-0 mt-0.5"
                    >
                      {candidate.planName}
                    </Badge>
                  </div>
                </div>

                {/* Contact */}
                <div className="min-w-0 space-y-0.5">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                    <Mail className="h-3 w-3 shrink-0" />
                    {candidate.email}
                  </p>
                  {candidate.onboarding?.preferredLocation && (
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {candidate.onboarding.preferredLocation}
                    </p>
                  )}
                </div>

                {/* Field */}
                <div>
                  {field ? (
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] text-muted-foreground">
                      {field}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground/40">—</span>
                  )}
                </div>

                {/* Stats */}
                <p className="text-sm font-semibold text-center text-card-foreground">{stats.total}</p>
                <p className="text-sm font-semibold text-center text-yellow-400">{stats.interviews}</p>
                <p className="text-sm font-semibold text-center text-green-400">{stats.accepted}</p>

                {/* Arrow */}
                <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
              </div>
            );
          })}
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {view === "grid" && assignedCandidates.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {assignedCandidates.map((candidate) => {
            const stats = getStats(candidate.id);
            const jobTitle = candidate.onboarding?.currentJobTitle;
            const field = candidate.onboarding?.currentField;

            return (
              <div
                key={candidate.id}
                className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer flex flex-col gap-4"
                onClick={() => navigate(`/employee/portal/candidates/${candidate.id}`)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-sm font-bold text-primary">
                      {candidate.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-card-foreground text-sm truncate">{candidate.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{candidate.email}</p>
                    {jobTitle && <p className="text-xs text-muted-foreground/80 truncate mt-0.5">{jobTitle}</p>}
                  </div>
                  <Badge variant={candidate.planType === "paid" ? "default" : "secondary"} className="shrink-0 text-[10px]">
                    {candidate.planName}
                  </Badge>
                </div>

                {(field || candidate.onboarding?.preferredLocation) && (
                  <div className="flex flex-wrap gap-1.5">
                    {field && <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] text-muted-foreground">{field}</span>}
                    {candidate.onboarding?.preferredLocation && (
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] text-muted-foreground">
                        📍 {candidate.onboarding.preferredLocation}
                      </span>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-secondary/60 px-3 py-2 text-center">
                    <Briefcase className="h-3 w-3 text-muted-foreground mx-auto mb-0.5" />
                    <p className="text-sm font-semibold text-card-foreground">{stats.total}</p>
                    <p className="text-[10px] text-muted-foreground">Apps</p>
                  </div>
                  <div className="rounded-lg bg-secondary/60 px-3 py-2 text-center">
                    <TrendingUp className="h-3 w-3 text-yellow-400/80 mx-auto mb-0.5" />
                    <p className="text-sm font-semibold text-yellow-400">{stats.interviews}</p>
                    <p className="text-[10px] text-muted-foreground">Interviews</p>
                  </div>
                  <div className="rounded-lg bg-secondary/60 px-3 py-2 text-center">
                    <CheckCircle2 className="h-3 w-3 text-green-400/80 mx-auto mb-0.5" />
                    <p className="text-sm font-semibold text-green-400">{stats.accepted}</p>
                    <p className="text-[10px] text-muted-foreground">Accepted</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                  <span>Joined {format(new Date(candidate.signedUpAt), "dd MMM yyyy")}</span>
                  <span className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    View <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmployeeCandidates;
