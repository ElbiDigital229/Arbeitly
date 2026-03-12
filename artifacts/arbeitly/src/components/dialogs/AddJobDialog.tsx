import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Upload, X, ExternalLink, ImageIcon } from "lucide-react";
import type { Application, ApplicationStatus } from "@/data/applications";

type AddJobDialogProps = {
  onAdd: (app: Omit<Application, "id" | "date">) => void;
  candidates: string[];
  defaultCandidate?: string;
  defaultStatus?: ApplicationStatus;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const cvVersionOptions = ["v1 — Original", "v2 — AI Enhanced", "v3 — Latest Edit"];

const FieldLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
    {children}{required && <span className="text-primary ml-0.5">*</span>}
  </Label>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-bold text-primary uppercase tracking-widest pt-2 pb-1 border-b border-border mb-3">
    {children}
  </p>
);

const AddJobDialog = ({ onAdd, candidates, defaultCandidate, defaultStatus = "to-apply", trigger, open: controlledOpen, onOpenChange: controlledOnOpenChange }: AddJobDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = (v: boolean) => { setInternalOpen(v); controlledOnOpenChange?.(v); };
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core fields
  const [candidate, setCandidate] = useState(defaultCandidate ?? "");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [cvVersion, setCvVersion] = useState("v2 — AI Enhanced");
  const [status, setStatus] = useState<ApplicationStatus>(defaultStatus);

  // Details
  const [datePosted, setDatePosted] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [dateSubmitted, setDateSubmitted] = useState("");
  const [salaryExpectation, setSalaryExpectation] = useState("");
  const [notes, setNotes] = useState("");
  const [jdScreenshot, setJdScreenshot] = useState<string | undefined>();
  const [jdFileName, setJdFileName] = useState("");

  const reset = () => {
    setCandidate(defaultCandidate ?? "");
    setJobTitle(""); setCompany(""); setCvVersion("v2 — AI Enhanced");
    setStatus(defaultStatus); setDatePosted(""); setJobUrl("");
    setDateSubmitted(""); setSalaryExpectation(""); setNotes("");
    setJdScreenshot(undefined); setJdFileName("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setJdFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setJdScreenshot(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !company || !candidate) return;
    onAdd({
      candidate, job: jobTitle, company,
      cvVersion: cvVersion.split(" ")[0],
      status, datePosted, jobUrl, jdScreenshot,
      dateSubmitted, salaryExpectation, notes,
    });
    reset();
    setOpen(false);
  };

  const handleOpenChange = (o: boolean) => {
    setOpen(o);
    if (!o) reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="h-8 gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Job
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden" aria-describedby={undefined}>
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-border shrink-0">
          <DialogTitle className="font-display text-base">Add New Application</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 max-h-[65vh]">
            <div className="px-6 py-4 space-y-4">

              {/* ── Core info ── */}
              <SectionHeading>Application Details</SectionHeading>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <FieldLabel required>Candidate</FieldLabel>
                  <Select value={candidate} onValueChange={setCandidate} required>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Select candidate…" />
                    </SelectTrigger>
                    <SelectContent>
                      {candidates.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <FieldLabel required>Job Title</FieldLabel>
                  <Input
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Developer"
                    className="h-9 text-sm"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <FieldLabel required>Company</FieldLabel>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. SAP SE"
                    className="h-9 text-sm"
                    required
                  />
                </div>

                <div>
                  <FieldLabel>CV Version Used</FieldLabel>
                  <Select value={cvVersion} onValueChange={setCvVersion}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cvVersionOptions.map((v) => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <FieldLabel>Status</FieldLabel>
                  <Select value={status} onValueChange={(v) => setStatus(v as ApplicationStatus)}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to-apply">To Apply</SelectItem>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ── Dates & URL ── */}
              <SectionHeading>Dates & Link</SectionHeading>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Job Date Posted</FieldLabel>
                  <Input type="date" value={datePosted} onChange={(e) => setDatePosted(e.target.value)} className="h-9 text-sm" />
                </div>
                <div>
                  <FieldLabel>Date Submitted</FieldLabel>
                  <Input type="date" value={dateSubmitted} onChange={(e) => setDateSubmitted(e.target.value)} className="h-9 text-sm" />
                </div>
                <div className="col-span-2">
                  <FieldLabel>Job URL</FieldLabel>
                  <div className="relative">
                    <ExternalLink className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                      placeholder="https://company.com/jobs/role"
                      className="h-9 text-sm pl-8"
                    />
                  </div>
                </div>
              </div>

              {/* ── JD Screenshot ── */}
              <SectionHeading>Job Description Screenshot</SectionHeading>

              {jdScreenshot ? (
                <div className="relative rounded-xl overflow-hidden border border-border bg-card">
                  <img src={jdScreenshot} alt="JD Screenshot" className="w-full max-h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="gap-1.5 rounded-full h-7 text-xs"
                      onClick={() => { setJdScreenshot(undefined); setJdFileName(""); }}
                    >
                      <X className="h-3 w-3" /> Remove
                    </Button>
                  </div>
                  <div className="px-3 py-2 text-xs text-muted-foreground bg-card/80 border-t border-border truncate">
                    {jdFileName}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all p-6 flex flex-col items-center gap-2 text-muted-foreground"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-foreground">Attach screenshot</p>
                    <p className="text-[11px] text-muted-foreground">PNG, JPG, WebP up to 5MB</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-primary/80 font-medium">
                    <Upload className="h-3 w-3" /> Browse file
                  </div>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* ── Salary & Notes ── */}
              <SectionHeading>Additional Info</SectionHeading>

              <div>
                <FieldLabel>Salary Expectation</FieldLabel>
                <Input
                  value={salaryExpectation}
                  onChange={(e) => setSalaryExpectation(e.target.value)}
                  placeholder="e.g. €85k–€100k"
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <FieldLabel>Additional Notes</FieldLabel>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any relevant notes about this application…"
                  className="text-sm min-h-[80px] resize-none"
                />
              </div>

            </div>
          </ScrollArea>

          <DialogFooter className="px-6 py-3 border-t border-border shrink-0 gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="gap-1.5" disabled={!jobTitle || !company || !candidate}>
              <Plus className="h-3.5 w-3.5" /> Add Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddJobDialog;
