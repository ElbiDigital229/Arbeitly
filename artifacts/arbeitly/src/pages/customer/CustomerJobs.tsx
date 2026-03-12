import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, CalendarCheck, Send, Clock, XCircle, CheckCircle, Trophy } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  applied:   { label: "Applied",            color: "bg-primary/10 text-primary border-primary/20",                                                icon: Send },
  reviewing: { label: "Reviewing",          color: "bg-[hsl(210_80%_52%/0.1)] text-[hsl(210_80%_52%)] border-[hsl(210_80%_52%/0.2)]",           icon: Clock },
  interview: { label: "Interview Scheduled",color: "bg-[hsl(38_92%_50%/0.1)] text-[hsl(38_92%_50%)] border-[hsl(38_92%_50%/0.2)]",              icon: CalendarCheck },
  rejected:  { label: "Rejected",           color: "bg-destructive/10 text-destructive border-destructive/20",                                    icon: XCircle },
  offer:     { label: "Offer Received",     color: "bg-[hsl(152_60%_42%/0.1)] text-[hsl(152_60%_42%)] border-[hsl(152_60%_42%/0.2)]",           icon: Trophy },
};

const jobs = [
  { id: 1,  company: "Zalando",        role: "Senior Frontend Developer",  location: "Berlin, DE",     platform: "LinkedIn", date: "Mar 10, 2026", status: "reviewing" },
  { id: 2,  company: "SAP SE",         role: "Product Manager",            location: "Munich, DE",     platform: "Indeed",   date: "Mar 10, 2026", status: "interview" },
  { id: 3,  company: "BMW Group",      role: "Software Engineer",          location: "Munich, DE",     platform: "XING",     date: "Mar 9, 2026",  status: "applied" },
  { id: 4,  company: "Delivery Hero",  role: "Full Stack Developer",       location: "Berlin, DE",     platform: "LinkedIn", date: "Mar 8, 2026",  status: "rejected" },
  { id: 5,  company: "Deutsche Bank",  role: "Data Analyst",               location: "Frankfurt, DE",  platform: "LinkedIn", date: "Mar 7, 2026",  status: "applied" },
  { id: 6,  company: "Siemens AG",     role: "UX Designer",                location: "Munich, DE",     platform: "Indeed",   date: "Mar 6, 2026",  status: "reviewing" },
  { id: 7,  company: "N26",            role: "Backend Engineer",           location: "Berlin, DE",     platform: "LinkedIn", date: "Mar 5, 2026",  status: "applied" },
  { id: 8,  company: "Volkswagen",     role: "IT Project Manager",         location: "Wolfsburg, DE",  platform: "XING",     date: "Mar 4, 2026",  status: "rejected" },
  { id: 9,  company: "HelloFresh",     role: "Marketing Manager",          location: "Berlin, DE",     platform: "LinkedIn", date: "Mar 3, 2026",  status: "interview" },
  { id: 10, company: "Bosch",          role: "Systems Architect",          location: "Stuttgart, DE",  platform: "Indeed",   date: "Mar 2, 2026",  status: "applied" },
  { id: 11, company: "Shopify",        role: "Senior Engineer",            location: "Remote",          platform: "LinkedIn", date: "Mar 1, 2026",  status: "reviewing" },
  { id: 12, company: "Allianz",        role: "Business Analyst",           location: "Munich, DE",     platform: "XING",     date: "Feb 28, 2026", status: "applied" },
  { id: 13, company: "Spotify",        role: "Engineering Manager",        location: "Berlin, DE",     platform: "LinkedIn", date: "Feb 26, 2026", status: "rejected" },
  { id: 14, company: "ING DiBa",       role: "Data Engineer",              location: "Frankfurt, DE",  platform: "Indeed",   date: "Feb 24, 2026", status: "applied" },
  { id: 15, company: "TeamViewer",     role: "Cloud Developer",            location: "Stuttgart, DE",  platform: "LinkedIn", date: "Feb 22, 2026", status: "offer" },
];

const filterTabs = ["All", "Applied", "Reviewing", "Interview Scheduled", "Rejected", "Offer Received"];

const CustomerJobs = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const filtered = jobs.filter((j) => {
    const matchSearch =
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.role.toLowerCase().includes(search.toLowerCase());
    const cfg = statusConfig[j.status];
    const matchTab = activeTab === "All" || cfg.label === activeTab;
    return matchSearch && matchTab;
  });

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-display text-2xl font-bold text-foreground">Jobs Applied</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tracking <span className="text-foreground font-semibold">{jobs.length}</span> applications submitted on your behalf
        </p>
      </motion.div>

      {/* Search + filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-4 space-y-3"
      >
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search company or role…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card overflow-hidden"
      >
        {/* Table header */}
        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-border bg-card/50">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Company / Role</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Location</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Platform</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Date</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            No applications match your filter.
          </div>
        ) : (
          filtered.map((job, i) => {
            const cfg = statusConfig[job.status];
            const Icon = cfg.icon;
            return (
              <div
                key={job.id}
                className={`grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-4 items-center hover:bg-secondary/30 transition-colors ${
                  i < filtered.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{job.role}</p>
                  <p className="text-xs text-muted-foreground truncate">{job.company}</p>
                </div>
                <p className="text-xs text-muted-foreground">{job.location}</p>
                <span className="text-xs font-medium text-muted-foreground">{job.platform}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{job.date}</span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold whitespace-nowrap ${cfg.color}`}
                >
                  <Icon className="h-3 w-3" />
                  {cfg.label}
                </span>
              </div>
            );
          })
        )}
      </motion.div>

      <p className="mt-3 text-xs text-muted-foreground text-right">
        Showing {filtered.length} of {jobs.length} applications
      </p>
    </div>
  );
};

export default CustomerJobs;
