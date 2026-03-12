import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Application = {
  job: string;
  company: string;
  date: string;
  status: string;
  cvVersion: string;
  coverLetter: string;
  candidate?: string;
};

type EditApplicationDialogProps = {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: Application) => void;
  candidates?: string[];
};

const EditApplicationDialog = ({ application, open, onOpenChange, onSave, candidates = [] }: EditApplicationDialogProps) => {
  const [job, setJob] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("Applied");
  const [cvVersion, setCvVersion] = useState("v3");
  const [coverLetter, setCoverLetter] = useState("");
  const [candidate, setCandidate] = useState("");

  useEffect(() => {
    if (application) {
      setJob(application.job);
      setCompany(application.company);
      setStatus(application.status);
      setCvVersion(application.cvVersion);
      setCoverLetter(application.coverLetter);
      setCandidate(application.candidate || "");
    }
  }, [application]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!application || !job || !company) return;
    onSave({ ...application, job, company, status, cvVersion, coverLetter, candidate });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Edit Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="editJob">Job Title</Label>
            <Input id="editJob" value={job} onChange={(e) => setJob(e.target.value)} className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="editCompany">Company</Label>
            <Input id="editCompany" value={company} onChange={(e) => setCompany(e.target.value)} className="mt-1.5" required />
          </div>
          {candidates.length > 0 && (
            <div>
              <Label>Candidate</Label>
              <Select value={candidate} onValueChange={setCandidate}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select candidate" /></SelectTrigger>
                <SelectContent>
                  {candidates.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>CV Version</Label>
              <Select value={cvVersion} onValueChange={setCvVersion}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="v1">v1</SelectItem>
                  <SelectItem value="v2">v2</SelectItem>
                  <SelectItem value="v3">v3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Interview">Interview</SelectItem>
                  <SelectItem value="Offer">Offer</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="editCL">Cover Letter</Label>
            <Input id="editCL" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} className="mt-1.5" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditApplicationDialog;
