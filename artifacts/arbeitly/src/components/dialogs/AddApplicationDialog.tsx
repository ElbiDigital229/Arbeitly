import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

type Application = {
  job: string;
  company: string;
  date: string;
  status: string;
  cvVersion: string;
  coverLetter: string;
};

type AddApplicationDialogProps = {
  onAdd: (app: Application) => void;
};

const AddApplicationDialog = ({ onAdd }: AddApplicationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [cvVersion, setCvVersion] = useState("v3");
  const [status, setStatus] = useState("Applied");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !company) return;
    onAdd({
      job: jobTitle,
      company,
      date: new Date().toISOString().split("T")[0],
      status,
      cvVersion,
      coverLetter: `CL-${company.split(" ")[0]}-v1`,
    });
    setJobTitle("");
    setCompany("");
    setCvVersion("v3");
    setStatus("Applied");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Application
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Add New Application</DialogTitle>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cvVersion">CV Version</Label>
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
              <Label htmlFor="status">Status</Label>
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
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Add Application</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddApplicationDialog;
