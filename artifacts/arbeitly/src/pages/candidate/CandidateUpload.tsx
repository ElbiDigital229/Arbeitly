import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, X, CheckCircle, Lightbulb, Shield, FileCheck, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const CandidateUpload = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState("cv");
  const [version, setVersion] = useState("v1");
  const [description, setDescription] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Maximum file size is 5MB", variant: "destructive" });
        return;
      }
      setUploadedFile(file);
      toast({ title: "File selected", description: `${file.name} ready to upload` });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith(".doc") || file.name.endsWith(".docx"))) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Maximum file size is 5MB", variant: "destructive" });
        return;
      }
      setUploadedFile(file);
      toast({ title: "File selected", description: `${file.name} ready to upload` });
    } else {
      toast({ title: "Invalid file", description: "Please upload a PDF, DOC, or DOCX file", variant: "destructive" });
    }
  };

  const handleUpload = () => {
    if (!uploadedFile) {
      toast({ title: "No file selected", description: "Please select a file to upload", variant: "destructive" });
      return;
    }
    toast({ title: "Upload Complete", description: `${uploadedFile.name} has been uploaded successfully` });
    setUploadedFile(null);
    setDescription("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Upload CV</h1>
        <p className="text-muted-foreground">Upload and manage your CV versions</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-5">
              {uploadedFile ? (
                <div className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-success" />
                    <div>
                      <p className="font-medium text-card-foreground">{uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(0)} KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setUploadedFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-12 px-6 hover:border-accent/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 mb-3">
                    <Upload className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground">Drop your file here</h3>
                  <p className="mt-1 text-sm text-muted-foreground">PDF, DOC, or DOCX up to 5MB</p>
                  <Button className="mt-4" variant="outline" size="sm">Browse Files</Button>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileUpload} />

              <div>
                <Label>Document Type</Label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cv">CV / Resume</SelectItem>
                    <SelectItem value="cover-letter">Cover Letter</SelectItem>
                    <SelectItem value="reference">Reference Letter</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Version</Label>
                <Select value={version} onValueChange={setVersion}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v1">Version 1</SelectItem>
                    <SelectItem value="v2">Version 2</SelectItem>
                    <SelectItem value="v3">Version 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Description (optional)</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add notes about this document version..."
                  className="mt-1.5 resize-none min-h-[80px]"
                />
              </div>

              <Button className="w-full" onClick={handleUpload} disabled={!uploadedFile}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">Upload Guidelines</h3>
              <div className="space-y-5">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <FileCheck className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-card-foreground text-sm">CV Version Management</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Keep up to 3 versions of your CV. Mark the most relevant one as Active for each application type.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-card-foreground text-sm">File Requirements</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Accepted formats: PDF, DOC, DOCX. Maximum file size: 5MB. Use clear, professional filenames.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-card-foreground text-sm">ATS Optimization</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Use standard section headings, avoid tables and graphics in your CV for best ATS compatibility.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10 shrink-0">
                    <Lightbulb className="h-4 w-4 text-warning" />
                  </div>
                  <div>
                    <h4 className="font-medium text-card-foreground text-sm">Pro Tip</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Tailor your CV for each job category. Use Version 1 for frontend roles, Version 2 for full-stack, and Version 3 for leadership positions.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateUpload;
