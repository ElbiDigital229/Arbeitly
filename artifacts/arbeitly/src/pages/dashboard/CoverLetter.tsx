import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, CheckCircle, Link, ClipboardPaste, Download, Loader2, Eye, PenTool } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const toneOptions = ["Professional", "Enthusiastic", "Formal", "Creative"];

const CoverLetter = () => {
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [activeTab, setActiveTab] = useState("paste");
  const [tone, setTone] = useState("Professional");
  const [language, setLanguage] = useState("english");

  const handleExtractFromUrl = async () => {
    if (!jobUrl.trim()) return;
    setIsExtracting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setJobDescription(`Senior Frontend Developer at Example Corp\n\nWe are looking for an experienced frontend developer with 5+ years of experience in React, TypeScript, and modern web technologies.\n\nRequirements:\n- React & TypeScript expertise\n- Experience with state management\n- CI/CD pipeline knowledge\n- German language (B2+)`);
    setIsExtracting(false);
    setActiveTab("paste");
    toast({ title: "Extracted", description: "Job description extracted from URL" });
  };

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast({ title: "Missing info", description: "Please provide a job description", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setGeneratedLetter(`Dear Hiring Manager,

I am writing to express my strong interest in the Senior Frontend Developer position at Example Corp. With over five years of experience in building scalable web applications using React and TypeScript, I am confident in my ability to contribute meaningfully to your team.

In my current role, I have led the development of customer-facing products serving over 100,000 users, implemented component libraries that reduced development time by 40%, and mentored junior developers. My experience with modern state management solutions and CI/CD pipelines aligns well with your requirements.

I am particularly drawn to Example Corp's commitment to innovation and remote-first culture. I believe my technical expertise, combined with my strong communication skills and B2-level German proficiency, make me an excellent fit for this role.

I look forward to the opportunity to discuss how I can contribute to your team's success.

Best regards,
[Your Name]`);
    setIsGenerating(false);
    toast({ title: "Cover Letter Generated!", description: "Your personalized cover letter is ready" });
  };

  const handleExport = (format: "pdf" | "docx") => {
    toast({ title: "Exporting...", description: `Downloading cover letter as ${format.toUpperCase()}` });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast({ title: "Copied!", description: "Cover letter copied to clipboard" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Cover Letter Generator</h1>
        <p className="text-muted-foreground">Create a tailored cover letter for any job in seconds</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Job Description */}
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">1. Job Description</h2>
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
                    className="min-h-[220px] resize-none"
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
                      <CheckCircle className="h-3 w-3" /> Extracted — switch to "Paste" tab to review
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <h2 className="font-display text-lg font-semibold text-foreground">2. Preferences</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {toneOptions.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGenerate} disabled={!jobDescription.trim() || isGenerating} className="w-full" size="lg">
                {isGenerating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</> : <><PenTool className="h-4 w-4 mr-2" />Generate Cover Letter</>}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Generated Letter */}
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">3. Your Cover Letter</h2>
          <Card className="h-fit">
            <CardContent className="p-6">
              {generatedLetter ? (
                <div className="space-y-4">
                  <Textarea
                    value={generatedLetter}
                    onChange={(e) => setGeneratedLetter(e.target.value)}
                    className="min-h-[360px] resize-none font-serif text-sm leading-relaxed"
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      <ClipboardPaste className="h-3.5 w-3.5 mr-1.5" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExport("docx")}>
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      DOCX
                    </Button>
                    <Button size="sm" onClick={() => handleExport("pdf")}>
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      PDF
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-3">
                    <FileText className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-muted-foreground">Your cover letter will appear here</p>
                  <p className="text-sm text-muted-foreground mt-1">Add a job description and click generate</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoverLetter;
