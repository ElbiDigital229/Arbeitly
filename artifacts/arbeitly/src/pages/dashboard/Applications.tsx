import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Pencil, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddApplicationDialog from "@/components/dialogs/AddApplicationDialog";
import EditApplicationDialog from "@/components/dialogs/EditApplicationDialog";
import { useToast } from "@/hooks/use-toast";

type Application = {
  job: string;
  company: string;
  date: string;
  status: string;
  cvVersion: string;
  coverLetter: string;
  candidate?: string;
};

const candidates = ["Anna Schmidt", "Thomas Wagner", "Lisa Müller", "Peter Fischer", "Maria Becker"];

const initialApplications: Application[] = [
  { job: "Senior Frontend Developer", company: "SAP SE", date: "2026-03-06", status: "Applied", cvVersion: "v3", coverLetter: "CL-SAP-v1", candidate: "Anna Schmidt" },
  { job: "Full Stack Engineer", company: "BMW Group", date: "2026-03-04", status: "Interview", cvVersion: "v3", coverLetter: "CL-BMW-v1", candidate: "Thomas Wagner" },
  { job: "React Developer", company: "Siemens", date: "2026-03-01", status: "Applied", cvVersion: "v2", coverLetter: "CL-Siemens-v1", candidate: "Peter Fischer" },
  { job: "Software Architect", company: "Allianz", date: "2026-02-28", status: "Rejected", cvVersion: "v2", coverLetter: "CL-Allianz-v1", candidate: "Lisa Müller" },
  { job: "Tech Lead", company: "Bosch", date: "2026-02-25", status: "Offer", cvVersion: "v1", coverLetter: "CL-Bosch-v2", candidate: "Peter Fischer" },
  { job: "Backend Engineer", company: "Deutsche Bank", date: "2026-02-20", status: "Applied", cvVersion: "v3", coverLetter: "CL-DB-v1", candidate: "Maria Becker" },
];

const statusColors: Record<string, string> = {
  Applied: "bg-info/10 text-info",
  Interview: "bg-warning/10 text-warning",
  Rejected: "bg-destructive/10 text-destructive",
  Offer: "bg-success/10 text-success",
};

const Applications = () => {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("all");
  const [editApp, setEditApp] = useState<Application | null>(null);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [editOpen, setEditOpen] = useState(false);
  const { toast } = useToast();

  const filtered = applications.filter((a) => {
    const matchesSearch = a.job.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase());
    const matchesCandidate = selectedCandidate === "all" || a.candidate === selectedCandidate;
    return matchesSearch && matchesCandidate;
  });

  const handleAdd = (app: Application) => {
    setApplications((prev) => [app, ...prev]);
    toast({ title: "Application Added", description: `${app.job} at ${app.company} tracked` });
  };

  const handleEdit = (app: Application, index: number) => {
    setEditApp(app);
    setEditIndex(index);
    setEditOpen(true);
  };

  const handleSave = (updated: Application) => {
    setApplications((prev) => prev.map((a, i) => (i === editIndex ? updated : a)));
    toast({ title: "Application Updated", description: `${updated.job} at ${updated.company} updated` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Applications</h1>
          <p className="text-muted-foreground">Track all your job applications</p>
        </div>
        <AddApplicationDialog onAdd={handleAdd} />
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search applications..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
          <SelectTrigger className="w-[200px]">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="All Candidates" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Candidates</SelectItem>
            {candidates.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Job Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Candidate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">CV</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Cover Letter</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app, i) => {
                  const realIndex = applications.indexOf(app);
                  return (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-card-foreground">{app.job}</td>
                      <td className="px-4 py-3 text-muted-foreground">{app.company}</td>
                      <td className="px-4 py-3 text-muted-foreground">{app.candidate || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{app.date}</td>
                      <td className="px-4 py-3 text-muted-foreground">{app.cvVersion}</td>
                      <td className="px-4 py-3 text-muted-foreground">{app.coverLetter}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[app.status]}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(app, realIndex)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <EditApplicationDialog
        application={editApp}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleSave}
        candidates={candidates}
      />
    </div>
  );
};

export default Applications;
