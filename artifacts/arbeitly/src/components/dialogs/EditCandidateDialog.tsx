import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Candidate = {
  name: string;
  email: string;
  plan: string;
  applications: number;
  status: string;
  joined: string;
};

type EditCandidateDialogProps = {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: Candidate) => void;
};

const EditCandidateDialog = ({ candidate, open, onOpenChange, onSave }: EditCandidateDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("Starter");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    if (candidate) {
      setName(candidate.name);
      setEmail(candidate.email);
      setPlan(candidate.plan);
      setStatus(candidate.status);
    }
  }, [candidate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidate || !name || !email) return;
    onSave({ ...candidate, name, email, plan, status });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Edit Candidate</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="editName">Full Name</Label>
            <Input id="editName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="editEmail">Email</Label>
            <Input id="editEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Plan</Label>
              <Select value={plan} onValueChange={setPlan}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Starter">Starter</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

export default EditCandidateDialog;
