import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AddCandidateDialog from "@/components/dialogs/AddCandidateDialog";
import EditCandidateDialog from "@/components/dialogs/EditCandidateDialog";
import { useToast } from "@/hooks/use-toast";

type Candidate = {
  name: string;
  email: string;
  plan: string;
  applications: number;
  status: string;
  joined: string;
};

const initialCandidates: Candidate[] = [
  { name: "Anna Schmidt", email: "anna@example.com", plan: "Professional", applications: 8, status: "Active", joined: "2026-02-15" },
  { name: "Thomas Wagner", email: "thomas@example.com", plan: "Starter", applications: 3, status: "Active", joined: "2026-02-20" },
  { name: "Lisa Müller", email: "lisa@example.com", plan: "Professional", applications: 12, status: "Active", joined: "2026-01-10" },
  { name: "Peter Fischer", email: "peter@example.com", plan: "Enterprise", applications: 15, status: "Active", joined: "2026-01-05" },
  { name: "Maria Becker", email: "maria@example.com", plan: "Starter", applications: 1, status: "New", joined: "2026-03-07" },
  { name: "Hans Schulz", email: "hans@example.com", plan: "Professional", applications: 6, status: "Inactive", joined: "2025-12-01" },
];

const planColors: Record<string, string> = {
  Starter: "bg-secondary text-secondary-foreground",
  Professional: "bg-accent/10 text-accent",
  Enterprise: "bg-primary/10 text-primary",
};

const Candidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [search, setSearch] = useState("");
  const [editCandidate, setEditCandidate] = useState<Candidate | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const { toast } = useToast();

  const filtered = candidates.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (candidate: Candidate) => {
    setCandidates((prev) => [candidate, ...prev]);
    toast({ title: "Candidate Added", description: `${candidate.name} has been added` });
  };

  const handleEdit = (candidate: Candidate) => {
    setEditCandidate(candidate);
    setEditOpen(true);
  };

  const handleSave = (updated: Candidate) => {
    setCandidates((prev) =>
      prev.map((c) => (c.email === editCandidate?.email && c.name === editCandidate?.name ? updated : c))
    );
    toast({ title: "Candidate Updated", description: `${updated.name} has been updated` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Candidates</h1>
          <p className="text-muted-foreground">Manage candidate profiles and applications</p>
        </div>
        <AddCandidateDialog onAdd={handleAdd} />
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search candidates..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Plan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Applications</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Joined</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-card-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className={planColors[c.plan]}>{c.plan}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.applications}</td>
                    <td className="px-4 py-3">
                      <Badge variant={c.status === "Active" ? "default" : "secondary"}>{c.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.joined}</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(c)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <EditCandidateDialog
        candidate={editCandidate}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleSave}
      />
    </div>
  );
};

export default Candidates;
