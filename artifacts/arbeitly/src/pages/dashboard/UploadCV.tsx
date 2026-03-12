import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, CheckCircle, Link, ClipboardPaste, Download, Loader2, X, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UploadCV = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedCV, setOptimizedCV] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("paste");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "File too large", description: "Maximum file size is 10MB", variant: "destructive" });
        return;
      }
      setUploadedFile(file);
      toast({ title: "CV Uploaded", description: `${file.name} uploaded successfully` });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith(".docx"))) {
      setUploadedFile(file);
      toast({ title: "CV Uploaded", description: `${file.name} uploaded successfully` });
    } else {
      toast({ title: "Invalid file", description: "Please upload a PDF or DOCX file", variant: "destructive" });
    }
  };

  const handleExtractFromUrl = async () => {
    if (!jobUrl.trim()) return;
    setIsExtracting(true);
    // Simulate extraction
    await new Promise((r) => setTimeout(r, 1500));
    setJobDescription(`Senior Frontend Developer at Example Corp\n\nWe are looking for an experienced frontend developer with 5+ years of experience in React, TypeScript, and modern web technologies.\n\nRequirements:\n- React & TypeScript expertise\n- Experience with state management (Redux, Zustand)\n- CI/CD pipeline knowledge\n- Strong communication skills\n- German language (B2+)\n\nBenefits:\n- Competitive salary\n- Remote-first culture\n- 30 days vacation`);
    setIsExtracting(false);
    setActiveTab("paste");
    toast({ title: "Extracted", description: "Job description extracted from URL" });
  };

  const handleOptimize = async () => {
    if (!uploadedFile || !jobDescription.trim()) {
      toast({ title: "Missing info", description: "Please upload a CV and provide a job description", variant: "destructive" });
      return;
    }
    setIsOptimizing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setOptimizedCV("optimized");
    setIsOptimizing(false);
    toast({ title: "CV Optimized!", description: "Your CV has been tailored for this position" });
  };

  const handleExport = (format: "pdf" | "docx") => {
    toast({ title: "Exporting...", description: `Downloading optimized CV as ${format.toUpperCase()}` });
    // In a real app this would trigger a download
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Upload & Optimize CV</h1>
        <p className="text-muted-foreground">Upload your CV, add a job description, and get an ATS-optimized version</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: CV Upload */}
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">1. Upload Your CV</h2>
          <Card>
            <CardContent className="p-6">
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
                  <h3 className="font-display text-base font-semibold text-foreground">Drop your CV here</h3>
                  <p className="mt-1 text-sm text-muted-foreground">PDF or DOCX up to 10MB</p>
                  <Button className="mt-4" variant="outline" size="sm">Browse Files</Button>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileUpload} />
            </CardContent>
          </Card>
        </div>

        {/* Right: Job Description */}
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">2. Add Job Description</h2>
          <Card>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="paste" className="flex-1">
                    <ClipboardPaste className="h-3.5 w-3.5 mr-1.5" />
                    Paste Description
                  </TabsTrigger>
                  <TabsTrigger value="url" className="flex-1">
                    <Link className="h-3.5 w-3.5 mr-1.5" />
                    From URL
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="paste" className="mt-4">
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    className="min-h-[200px] resize-none"
                  />
                </TabsContent>
                <TabsContent value="url" className="mt-4 space-y-3">
                  <div>
                    <Label htmlFor="jobUrl">Job Listing URL</Label>
                    <Input
                      id="jobUrl"
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                      placeholder="https://linkedin.com/jobs/view/..."
                      className="mt-1.5"
                    />
                  </div>
                  <Button onClick={handleExtractFromUrl} disabled={!jobUrl.trim() || isExtracting} className="w-full">
                    {isExtracting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Extracting...</> : "Extract Job Description"}
                  </Button>
                  {jobDescription && (
                    <p className="text-xs text-success flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Description extracted — switch to "Paste" tab to review
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Optimize button */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">3. Optimize & Export</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {uploadedFile && jobDescription ? "Ready to optimize your CV" : "Upload your CV and add a job description to continue"}
              </p>
            </div>
            <Button onClick={handleOptimize} disabled={!uploadedFile || !jobDescription.trim() || isOptimizing} size="lg">
              {isOptimizing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Optimizing...</> : "Optimize CV"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export options */}
      {optimizedCV && (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-success" />
                <div>
                  <h3 className="font-display font-semibold text-foreground">CV Optimized Successfully</h3>
                  <p className="text-sm text-muted-foreground">Your CV has been tailored for the position</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => toast({ title: "Preview", description: "Opening CV preview..." })}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" onClick={() => handleExport("docx")}>
                  <Download className="h-4 w-4 mr-2" />
                  DOCX
                </Button>
                <Button onClick={() => handleExport("pdf")}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-card-foreground text-sm">ATS Optimization</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Keywords & formatting aligned with ATS standards</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-card-foreground text-sm">Multi-Language</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Generate optimized versions in German & English</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-card-foreground text-sm">Template Options</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Choose from professional CV templates</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadCV;
