import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

type AddJobDialogProps = {
  onAdd: (job: { job: string; company: string; candidate: string; cvVersion: string }) => void;
  candidates: string[];
  trigger?: React.ReactNode;
};

const AddJobDialog = ({ onAdd, candidates, trigger }: AddJobDialogProps) => {
  const [open, setOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [candidate, setCandidate] = useState("");
  const [cvVersion, setCvVersion] = useState("v3");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !company || !candidate) return;
    onAdd({ job: jobTitle, company, candidate, cvVersion });
    setJobTitle("");
    setCompany("");
    setCandidate("");
    setCvVersion("v3");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="h-8">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Job
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Add New Job Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Senior Frontend Developer" className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. SAP SE" className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="candidate">Candidate</Label>
            <Select value={candidate} onValueChange={setCandidate}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select candidate" />
              </SelectTrigger>
              <SelectContent>
                {candidates.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="cvVersion">CV Version</Label>
            <Select value={cvVersion} onValueChange={setCvVersion}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="v1">v1</SelectItem>
                <SelectItem value="v2">v2</SelectItem>
                <SelectItem value="v3">v3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Add to Board</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddJobDialog;
