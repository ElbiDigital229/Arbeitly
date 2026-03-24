import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Upload, Plus, Trash2, ArrowLeft, ArrowRight, CheckCircle2,
  Loader2, Eye, Download, ScrollText, Pencil, Languages,
} from "lucide-react";
import { useCustomers } from "@/context/CustomersContext";
import { useToast } from "@/hooks/use-toast";

// ── Types ────────────────────────────────────────────────────────────────────

type CvStyle = "modern" | "classic" | "minimal";
type Language = "EN" | "DE";
type CvSource = "uploaded" | "generated" | "reviewed";
type Step = "landing" | "entry" | "extracting" | "template" | "language" | "editor";

type CvVariant = {
  id: string; name: string; label: string; content: string;
  createdAt: string; style: CvStyle; language?: Language; source?: CvSource;
};
type CvVersion = {
  id: string; letter: string; name: string; label: string; content: string;
  createdAt: string; style: CvStyle; variants: CvVariant[];
  language?: Language; source?: CvSource;
};
type CvTree = {
  original: { content: string; createdAt: string; language?: Language };
  versions: CvVersion[];
};

type ExpItem = { id: string; company: string; role: string; period: string; description: string };
type EduItem = { id: string; institution: string; degree: string; period: string };
type EditorData = {
  versionName: string; style: CvStyle; language: Language;
  fullName: string; email: string; phone: string; location: string; linkedin: string;
  summary: string; experience: ExpItem[]; education: EduItem[]; skills: string;
};

// ── Mock extraction data ─────────────────────────────────────────────────────

const MOCK_EXTRACT: Omit<EditorData, "versionName" | "style" | "language"> = {
  fullName: "Anna Müller",
  email: "anna.muller@gmail.com",
  phone: "+49 151 2345 6789",
  location: "Munich, Germany",
  linkedin: "linkedin.com/in/anna-mueller",
  summary: "Results-driven software engineer with 5+ years of experience building scalable web applications across fintech and industrial sectors.",
  experience: [
    { id: "e1", company: "Siemens AG", role: "Senior Software Engineer", period: "Mar 2021 – Present", description: "Led a team of 6 engineers to rebuild the internal tools platform, reducing deployment time by 40%." },
    { id: "e2", company: "MAN Energy Solutions", role: "Software Engineer", period: "Jun 2018 – Feb 2021", description: "Developed RESTful APIs and React frontends for the IoT monitoring dashboard used by 200+ engineers daily." },
  ],
  education: [
    { id: "edu1", institution: "TU München", degree: "M.Sc. Computer Science", period: "2015 – 2018" },
    { id: "edu2", institution: "LMU Munich", degree: "B.Sc. Informatics", period: "2012 – 2015" },
  ],
  skills: "React, TypeScript, Node.js, Python, PostgreSQL, Docker, AWS, Agile, Scrum",
};

const emptyEditor = (): EditorData => ({
  versionName: "My CV", style: "modern", language: "EN",
  fullName: "", email: "", phone: "", location: "", linkedin: "",
  summary: "", experience: [], education: [], skills: "",
});

const newExpItem = (): ExpItem => ({ id: `exp_${Date.now()}`, company: "", role: "", period: "", description: "" });
const newEduItem = (): EduItem => ({ id: `edu_${Date.now()}`, institution: "", degree: "", period: "" });

// ── HTML renderer ────────────────────────────────────────────────────────────

const CSS: Record<CvStyle, string> = {
  modern: `body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a2e;margin:0;padding:0}.w{max-width:780px;margin:0 auto;padding:40px 48px}h1{font-size:2rem;font-weight:700;margin:0 0 4px;color:#0f172a}h2{font-size:.9rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#0ea5e9;border-bottom:2px solid #0ea5e9;padding-bottom:4px;margin:20px 0 8px}p,li{font-size:.88rem;line-height:1.65;color:#334155;margin:3px 0}ul{padding-left:18px}strong{color:#0f172a}.contact{font-size:.82rem;color:#64748b;margin:4px 0 20px}`,
  classic: `body{font-family:Georgia,serif;color:#1a1a1a;margin:0;padding:0}.w{max-width:780px;margin:0 auto;padding:48px 56px}h1{font-size:1.9rem;font-weight:700;margin:0 0 4px;border-bottom:3px double #1a1a1a;padding-bottom:8px}h2{font-size:.9rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin:20px 0 6px;color:#1a1a1a}p,li{font-size:.9rem;line-height:1.7;color:#2d2d2d;margin:3px 0}ul{padding-left:20px}.contact{font-size:.82rem;color:#555;margin:4px 0 20px}`,
  minimal: `body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#222;margin:0;padding:0}.w{max-width:760px;margin:0 auto;padding:44px 52px}h1{font-size:1.8rem;font-weight:300;letter-spacing:.04em;margin:0 0 4px}h2{font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.12em;color:#888;margin:24px 0 6px}p,li{font-size:.87rem;line-height:1.6;color:#444;margin:3px 0}ul{padding-left:16px}hr{border:none;border-top:1px solid #e5e5e5;margin:12px 0}.contact{font-size:.8rem;color:#888;margin:4px 0 20px}`,
};

const buildHtml = (content: string, style: CvStyle) =>
  `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{box-sizing:border-box}${CSS[style]}</style></head><body><div class="w">${content}</div></body></html>`;

const editorToHtml = (d: EditorData): string => {
  const contact = [d.email, d.phone, d.location, d.linkedin].filter(Boolean).join(" · ");
  const exp = d.experience.filter((e) => e.company || e.role).map((e) => `
    <div style="margin-bottom:10px">
      <strong>${e.role || ""}${e.company ? ` — ${e.company}` : ""}</strong>${e.period ? `<br><span style="font-size:.8em;opacity:.7">${e.period}</span>` : ""}
      ${e.description ? `<p style="margin:4px 0">${e.description.replace(/\n/g, "<br>")}</p>` : ""}
    </div>`).join("");
  const edu = d.education.filter((e) => e.institution || e.degree).map((e) => `
    <div style="margin-bottom:8px">
      <strong>${e.degree || ""}${e.institution ? ` — ${e.institution}` : ""}</strong>${e.period ? `<br><span style="font-size:.8em;opacity:.7">${e.period}</span>` : ""}
    </div>`).join("");
  const skills = d.skills.trim()
    ? `<ul>${d.skills.split(/[,\n]/).map((s) => s.trim()).filter(Boolean).map((s) => `<li>${s}</li>`).join("")}</ul>`
    : "";
  return `
    <h1>${d.fullName || "Your Name"}</h1>
    ${contact ? `<p class="contact">${contact}</p>` : ""}
    ${d.summary ? `<h2>Summary</h2><p>${d.summary.replace(/\n/g, "<br>")}</p>` : ""}
    ${exp ? `<h2>Experience</h2>${exp}` : ""}
    ${edu ? `<h2>Education</h2>${edu}` : ""}
    ${skills ? `<h2>Skills</h2>${skills}` : ""}
  `;
};

const emptyTree: CvTree = { original: { content: "", createdAt: "" }, versions: [] };

const EXTRACT_STEPS = [
  "Reading document...",
  "Identifying sections...",
  "Extracting personal info...",
  "Parsing work experience...",
  "Finalising CV data...",
];

const formatDate = (iso: string) => {
  try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return iso; }
};

// ── Template cards ────────────────────────────────────────────────────────────

type TemplateOption = { style: CvStyle; label: string; desc: string; accent: string };
const TEMPLATES: TemplateOption[] = [
  { style: "modern", label: "Modern", desc: "Clean with blue accents", accent: "#0ea5e9" },
  { style: "classic", label: "Classic", desc: "Elegant serif style", accent: "#1a1a1a" },
  { style: "minimal", label: "Minimal", desc: "Understated & spacious", accent: "#888" },
];

const TemplateMiniPreview = ({ style }: { style: CvStyle }) => {
  const accent = style === "modern" ? "#0ea5e9" : style === "classic" ? "#1a1a1a" : "#aaa";
  return (
    <div className="h-32 bg-white rounded-t-lg overflow-hidden p-3 space-y-1.5">
      <div className="h-2.5 rounded-sm bg-slate-800" style={{ width: "60%" }} />
      <div className="h-1.5 rounded-sm bg-slate-400/50" style={{ width: "45%" }} />
      <div className="mt-2 h-0.5 rounded" style={{ background: accent, width: "100%" }} />
      <div className="h-1.5 rounded-sm" style={{ background: accent + "99", width: "30%", marginTop: 4 }} />
      <div className="h-1 rounded-sm bg-slate-200" />
      <div className="h-1 rounded-sm bg-slate-200" style={{ width: "85%" }} />
      <div className="h-1 rounded-sm bg-slate-200" style={{ width: "90%" }} />
      <div className="mt-1 h-0.5 rounded" style={{ background: accent, width: "100%" }} />
      <div className="h-1.5 rounded-sm" style={{ background: accent + "99", width: "30%", marginTop: 4 }} />
      <div className="h-1 rounded-sm bg-slate-200" />
      <div className="h-1 rounded-sm bg-slate-200" style={{ width: "75%" }} />
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

export default function CandidateCVBuilder() {
  const { currentCustomer, updateCustomer } = useCustomers();
  const { toast } = useToast();
  const id = currentCustomer?.id;
  const uploadRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const storageKey = id ? `arbeitly_cv_tree_${id}` : null;
  const isPaid = currentCustomer?.planType === "paid";
  const creationLimit = currentCustomer?.cvCreationLimit ?? null;
  const creationsUsed = currentCustomer?.cvCreationsUsed ?? 0;
  const exportLimit = currentCustomer?.cvExportLimit ?? null;
  const exportsUsed = currentCustomer?.cvExportsUsed ?? 0;
  const canCreate = isPaid || creationLimit === null || creationsUsed < creationLimit;

  const loadTree = (): CvTree => {
    try {
      const s = storageKey ? localStorage.getItem(storageKey) : null;
      return s ? JSON.parse(s) : emptyTree;
    } catch { return emptyTree; }
  };

  const [cvTree, setCvTree] = useState<CvTree>(loadTree);
  const [step, setStep] = useState<Step>("landing");
  const [extractStep, setExtractStep] = useState(0);
  const [editorData, setEditorData] = useState<EditorData>(emptyEditor());
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null);
  const [saveDialog, setSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState("");

  // ── Live preview HTML (debounced) ────────────────────────────────────────
  const previewHtml = useMemo(
    () => buildHtml(editorToHtml(editorData), editorData.style),
    [editorData]
  );

  useEffect(() => {
    if (step !== "editor" || !iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (doc) {
      doc.open();
      doc.write(previewHtml);
      doc.close();
    }
  }, [previewHtml, step]);

  const saveTree = (tree: CvTree) => {
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(tree));
    setCvTree(tree);
  };

  // ── Extraction animation ─────────────────────────────────────────────────
  useEffect(() => {
    if (step !== "extracting") return;
    setExtractStep(0);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setExtractStep(i);
      if (i >= EXTRACT_STEPS.length) {
        clearInterval(iv);
        setTimeout(() => {
          setEditorData((d) => ({ ...d, ...MOCK_EXTRACT }));
          setStep("template");
        }, 600);
      }
    }, 500);
    return () => clearInterval(iv);
  }, [step]);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawContent = (e.target?.result as string) || `Uploaded: ${file.name}`;
      saveTree({ ...cvTree, original: { content: rawContent, createdAt: new Date().toISOString(), language: "EN" } });
    };
    reader.readAsText(file);
    setStep("extracting");
  };

  const startCreate = () => {
    if (!canCreate) {
      toast({ title: "CV creation limit reached", description: "Upgrade your plan to create more CVs.", variant: "destructive" });
      return;
    }
    setEditorData(emptyEditor());
    setEditingVersionId(null);
    setStep("template");
  };

  const openEdit = (v: CvVersion) => {
    // Parse HTML back — best-effort, just set style/language and name
    setEditorData((d) => ({ ...d, versionName: v.name, style: v.style, language: v.language ?? "EN" }));
    setEditingVersionId(v.id);
    setStep("editor");
  };

  const handleSaveVersion = () => {
    const name = saveName.trim() || editorData.versionName || "My CV";
    const content = editorToHtml(editorData);

    if (editingVersionId) {
      saveTree({
        ...cvTree,
        versions: cvTree.versions.map((v) =>
          v.id === editingVersionId ? { ...v, name, label: name, content, style: editorData.style, language: editorData.language } : v
        ),
      });
    } else {
      const newVersion: CvVersion = {
        id: `v_${Date.now()}`,
        letter: String.fromCharCode(65 + cvTree.versions.length),
        name, label: name, content,
        createdAt: new Date().toISOString(),
        style: editorData.style,
        language: editorData.language,
        source: "uploaded",
        variants: [],
      };
      saveTree({ ...cvTree, versions: [...cvTree.versions, newVersion] });
      if (!isPaid && id) updateCustomer(id, { cvCreationsUsed: creationsUsed + 1 });
    }
    setSaveDialog(false);
    setSaveName("");
    setStep("landing");
    toast({ title: "CV saved", description: `"${name}" is ready in your CV list.` });
  };

  const handleExportPdf = () => {
    const html = buildHtml(editorToHtml(editorData), editorData.style);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.setTimeout(() => win.print(), 400);
  };

  const handleDeleteVersion = (vid: string) => {
    saveTree({ ...cvTree, versions: cvTree.versions.filter((v) => v.id !== vid) });
  };

  const setExp = (items: ExpItem[]) => setEditorData((d) => ({ ...d, experience: items }));
  const setEdu = (items: EduItem[]) => setEditorData((d) => ({ ...d, education: items }));

  // ── Extraction screen ────────────────────────────────────────────────────

  if (step === "extracting") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-48px)] p-6">
        <div className="max-w-sm w-full space-y-8 text-center">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Extracting CV Data</h2>
            <p className="text-sm text-muted-foreground mt-1">{EXTRACT_STEPS[Math.min(extractStep, EXTRACT_STEPS.length - 1)]}</p>
          </div>
          <div className="space-y-2.5 text-left">
            {EXTRACT_STEPS.map((label, i) => (
              <div key={i} className={`flex items-center gap-2.5 text-sm transition-all ${i < extractStep ? "text-card-foreground" : i === extractStep ? "text-muted-foreground" : "text-muted-foreground/30"}`}>
                {i < extractStep
                  ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  : i === extractStep
                  ? <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
                  : <div className="h-4 w-4 rounded-full border border-border/40 shrink-0" />}
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Wizard step: Template ────────────────────────────────────────────────

  if (step === "template") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-48px)] p-6">
        <div className="w-full max-w-2xl space-y-8">
          {/* Step indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</div>
              <span className="text-sm font-medium text-foreground">Template</span>
            </div>
            <div className="flex-1 h-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full border border-border text-muted-foreground text-xs font-bold flex items-center justify-center">2</div>
              <span className="text-sm text-muted-foreground">Language</span>
            </div>
            <div className="flex-1 h-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full border border-border text-muted-foreground text-xs font-bold flex items-center justify-center">3</div>
              <span className="text-sm text-muted-foreground">Fill in Details</span>
            </div>
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Choose a Template</h1>
            <p className="text-sm text-muted-foreground mt-1">You can change this at any time in the editor.</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {TEMPLATES.map(({ style, label, desc }) => (
              <button
                key={style}
                type="button"
                onClick={() => {
                  setEditorData((d) => ({ ...d, style }));
                  setStep("language");
                }}
                className={`rounded-xl border-2 overflow-hidden text-left transition-all hover:shadow-md ${
                  editorData.style === style ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40"
                }`}
              >
                <TemplateMiniPreview style={style} />
                <div className="px-3 py-2.5 border-t border-border/50 bg-card">
                  <p className="text-sm font-semibold text-card-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                {editorData.style === style && (
                  <div className="absolute" />
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="ghost" className="gap-2 text-muted-foreground" onClick={() => setStep("landing")}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Wizard step: Language ────────────────────────────────────────────────

  if (step === "language") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-48px)] p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Step indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">✓</div>
              <span className="text-sm text-muted-foreground">Template</span>
            </div>
            <div className="flex-1 h-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</div>
              <span className="text-sm font-medium text-foreground">Language</span>
            </div>
            <div className="flex-1 h-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full border border-border text-muted-foreground text-xs font-bold flex items-center justify-center">3</div>
              <span className="text-sm text-muted-foreground">Fill in Details</span>
            </div>
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Choose Language</h1>
            <p className="text-sm text-muted-foreground mt-1">Select the language for your CV.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(["EN", "DE"] as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setEditorData((d) => ({ ...d, language: lang }))}
                className={`rounded-xl border-2 p-6 text-center transition-all font-display ${
                  editorData.language === lang
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="text-3xl mb-2">{lang === "EN" ? "🇬🇧" : "🇩🇪"}</div>
                <p className="text-base font-semibold text-card-foreground">{lang === "EN" ? "English" : "German"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{lang === "EN" ? "For international roles" : "Für deutsche Stellen"}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="ghost" className="gap-2 text-muted-foreground" onClick={() => setStep("template")}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button className="gap-2 rounded-full px-6" onClick={() => setStep("editor")}>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Editor + Live Preview (split layout) ─────────────────────────────────

  if (step === "editor") {
    const TemplateTab = ({ s }: { s: CvStyle }) => (
      <button
        type="button"
        onClick={() => setEditorData((d) => ({ ...d, style: s }))}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${editorData.style === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
      >
        {s.charAt(0).toUpperCase() + s.slice(1)}
      </button>
    );

    return (
      <div className="flex h-[calc(100vh-48px)]">
        {/* ── Left: form ── */}
        <div className="w-[480px] flex-shrink-0 flex flex-col border-r border-border overflow-hidden">
          {/* Editor toolbar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-card shrink-0">
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-muted-foreground px-2 text-xs" onClick={() => setStep("landing")}>
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Button>
            <div className="flex-1" />
            <div className="flex items-center bg-secondary rounded-lg p-0.5 gap-0.5">
              <TemplateTab s="modern" />
              <TemplateTab s="classic" />
              <TemplateTab s="minimal" />
            </div>
            <div className="flex gap-1">
              {(["EN", "DE"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setEditorData((d) => ({ ...d, language: lang }))}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold border transition-colors ${editorData.language === lang ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
                >
                  <Languages className="h-3 w-3" />{lang}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable form */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* CV Name */}
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">CV Name</Label>
              <Input className="mt-1.5" placeholder="e.g. My CV – Software Engineer" value={editorData.versionName} onChange={(e) => setEditorData((d) => ({ ...d, versionName: e.target.value }))} />
            </div>

            {/* Personal Info */}
            <div className="rounded-xl border border-border p-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Personal Info</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label className="text-xs">Full Name</Label>
                  <Input className="mt-1" placeholder="Anna Müller" value={editorData.fullName} onChange={(e) => setEditorData((d) => ({ ...d, fullName: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-xs">Email</Label>
                  <Input className="mt-1" placeholder="anna@example.com" value={editorData.email} onChange={(e) => setEditorData((d) => ({ ...d, email: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-xs">Phone</Label>
                  <Input className="mt-1" placeholder="+49 123 456 789" value={editorData.phone} onChange={(e) => setEditorData((d) => ({ ...d, phone: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-xs">Location</Label>
                  <Input className="mt-1" placeholder="Berlin, Germany" value={editorData.location} onChange={(e) => setEditorData((d) => ({ ...d, location: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-xs">LinkedIn</Label>
                  <Input className="mt-1" placeholder="linkedin.com/in/anna" value={editorData.linkedin} onChange={(e) => setEditorData((d) => ({ ...d, linkedin: e.target.value }))} />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-border p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Summary</p>
              <Textarea
                placeholder="A short professional summary..."
                rows={3}
                className="resize-none text-sm"
                value={editorData.summary}
                onChange={(e) => setEditorData((d) => ({ ...d, summary: e.target.value }))}
              />
            </div>

            {/* Work Experience */}
            <div className="rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Work Experience</p>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => setExp([...editorData.experience, newExpItem()])}>
                  <Plus className="h-3 w-3" /> Add
                </Button>
              </div>
              {editorData.experience.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No experience yet. Click Add to start.</p>
              )}
              {editorData.experience.map((exp, i) => (
                <div key={exp.id} className="rounded-lg bg-secondary/40 p-3 space-y-2 border border-border/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Experience {i + 1}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setExp(editorData.experience.filter((_, j) => j !== i))}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Job Title" className="h-8 text-xs" value={exp.role} onChange={(e) => setExp(editorData.experience.map((x, j) => j === i ? { ...x, role: e.target.value } : x))} />
                    <Input placeholder="Company" className="h-8 text-xs" value={exp.company} onChange={(e) => setExp(editorData.experience.map((x, j) => j === i ? { ...x, company: e.target.value } : x))} />
                    <Input placeholder="Period (e.g. Jan 2022 – Present)" className="h-8 text-xs col-span-2" value={exp.period} onChange={(e) => setExp(editorData.experience.map((x, j) => j === i ? { ...x, period: e.target.value } : x))} />
                  </div>
                  <Textarea
                    placeholder="Key responsibilities..."
                    rows={2}
                    className="resize-none text-xs"
                    value={exp.description}
                    onChange={(e) => setExp(editorData.experience.map((x, j) => j === i ? { ...x, description: e.target.value } : x))}
                  />
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Education</p>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => setEdu([...editorData.education, newEduItem()])}>
                  <Plus className="h-3 w-3" /> Add
                </Button>
              </div>
              {editorData.education.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No education yet. Click Add to start.</p>
              )}
              {editorData.education.map((edu, i) => (
                <div key={edu.id} className="rounded-lg bg-secondary/40 p-3 space-y-2 border border-border/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Education {i + 1}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEdu(editorData.education.filter((_, j) => j !== i))}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Degree / Certification" className="h-8 text-xs" value={edu.degree} onChange={(e) => setEdu(editorData.education.map((x, j) => j === i ? { ...x, degree: e.target.value } : x))} />
                    <Input placeholder="Institution" className="h-8 text-xs" value={edu.institution} onChange={(e) => setEdu(editorData.education.map((x, j) => j === i ? { ...x, institution: e.target.value } : x))} />
                    <Input placeholder="Period (e.g. 2018 – 2022)" className="h-8 text-xs col-span-2" value={edu.period} onChange={(e) => setEdu(editorData.education.map((x, j) => j === i ? { ...x, period: e.target.value } : x))} />
                  </div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="rounded-xl border border-border p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Skills</p>
              <Textarea
                placeholder="React, TypeScript, Node.js, SQL, Agile..."
                rows={3}
                className="resize-none text-sm"
                value={editorData.skills}
                onChange={(e) => setEditorData((d) => ({ ...d, skills: e.target.value }))}
              />
              <p className="text-[10px] text-muted-foreground">Comma or newline separated</p>
            </div>

            {/* Bottom spacing */}
            <div className="h-4" />
          </div>

          {/* Footer actions */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-card shrink-0">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExportPdf}>
              <Download className="h-3.5 w-3.5" /> Export PDF
            </Button>
            <div className="flex-1" />
            <Button
              size="sm"
              className="rounded-full gap-1.5 px-5"
              onClick={() => { setSaveName(editorData.versionName || "My CV"); setSaveDialog(true); }}
            >
              Save CV
            </Button>
          </div>
        </div>

        {/* ── Right: live preview ── */}
        <div className="flex-1 bg-secondary/20 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-card/50 shrink-0">
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Live Preview</span>
            <span className="ml-auto text-[10px] text-muted-foreground/60">Updates as you type</span>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <iframe
              ref={iframeRef}
              className="w-full h-full rounded-lg shadow-lg border border-border/30 bg-white"
              title="CV Preview"
            />
          </div>
        </div>

        {/* Save dialog — must live inside the editor return so it renders when step=editor */}
        <Dialog open={saveDialog} onOpenChange={setSaveDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-display">Save CV</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>CV Name</Label>
                <Input
                  className="mt-1.5"
                  placeholder="e.g. Software Engineer – Modern"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  autoFocus
                />
              </div>
              {!isPaid && creationLimit !== null && !editingVersionId && (
                <p className="text-xs text-muted-foreground">
                  After saving: {creationsUsed + 1} / {creationLimit} CV builds used.
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSaveDialog(false)}>Cancel</Button>
              <Button onClick={handleSaveVersion} disabled={!saveName.trim()}>Save CV</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ── Landing (entry choice or existing CVs) ────────────────────────────────

  const hasAnyCv = !!cvTree.original.content || cvTree.versions.length > 0;

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">My CV</h1>
          <p className="text-sm text-muted-foreground mt-1">Build, upload, and export your CV in three professional templates.</p>
        </div>
      </div>

      {/* Plan usage — free users only */}
      {!isPaid && (
        <div className="grid grid-cols-2 gap-3">
          {creationLimit !== null && (
            <div className={`rounded-xl border px-4 py-3 ${creationsUsed >= creationLimit ? "border-destructive/30 bg-destructive/5" : "border-border bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">CV Builds</span>
                <span className={`text-sm font-bold tabular-nums ${creationsUsed >= creationLimit ? "text-destructive" : "text-card-foreground"}`}>
                  {creationsUsed} <span className="text-muted-foreground font-normal">/ {creationLimit}</span>
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${creationsUsed >= creationLimit ? "bg-destructive" : creationsUsed / creationLimit >= 0.7 ? "bg-yellow-400" : "bg-primary"}`}
                  style={{ width: `${Math.min(100, (creationsUsed / creationLimit) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">{creationLimit - creationsUsed} builds remaining</p>
            </div>
          )}
          {exportLimit !== null && (
            <div className={`rounded-xl border px-4 py-3 ${exportsUsed >= exportLimit ? "border-destructive/30 bg-destructive/5" : "border-border bg-card"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">PDF Exports</span>
                <span className={`text-sm font-bold tabular-nums ${exportsUsed >= exportLimit ? "text-destructive" : "text-card-foreground"}`}>
                  {exportsUsed} <span className="text-muted-foreground font-normal">/ {exportLimit}</span>
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${exportsUsed >= exportLimit ? "bg-destructive" : exportsUsed / exportLimit >= 0.7 ? "bg-yellow-400" : "bg-primary"}`}
                  style={{ width: `${Math.min(100, (exportsUsed / exportLimit) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">{exportLimit - exportsUsed} exports remaining</p>
            </div>
          )}
        </div>
      )}

      {/* Entry cards */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => uploadRef.current?.click()}
          className="group rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-card p-6 text-left transition-all hover:bg-secondary/30 hover:shadow-sm"
        >
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm font-semibold text-card-foreground">Upload Existing CV</p>
          <p className="text-xs text-muted-foreground mt-1">Upload a PDF or Word file. We'll extract your info and fill the editor automatically.</p>
        </button>

        <button
          type="button"
          onClick={startCreate}
          disabled={!canCreate}
          className={`group rounded-xl border-2 border-dashed bg-card p-6 text-left transition-all ${canCreate ? "border-border hover:border-primary/50 hover:bg-secondary/30 hover:shadow-sm" : "border-border/40 opacity-50 cursor-not-allowed"}`}
        >
          <div className="h-10 w-10 rounded-xl bg-secondary border border-border flex items-center justify-center mb-3">
            <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-sm font-semibold text-card-foreground">Create from Scratch</p>
          <p className="text-xs text-muted-foreground mt-1">
            {!canCreate && creationLimit !== null
              ? `CV creation limit reached (${creationLimit}). Upgrade to create more.`
              : "Use our multi-step wizard to build a professional CV with live preview."}
          </p>
        </button>
      </div>

      <input ref={uploadRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={(e) => {
        const f = e.target.files?.[0]; if (f) handleFileSelect(f); e.target.value = "";
      }} />

      {/* Saved CVs */}
      {hasAnyCv && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Saved CVs</h2>

          {cvTree.original.content && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors group">
              <ScrollText className="h-5 w-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground">Original Upload</p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatDate(cvTree.original.createdAt)}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7" title="Export" onClick={() => {
                  const html = buildHtml(cvTree.original.content, "modern");
                  const win = window.open("", "_blank"); if (!win) return;
                  win.document.write(html); win.document.close(); win.setTimeout(() => win.print(), 400);
                }}>
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {cvTree.versions.map((v) => (
            <div key={v.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors group">
              <ScrollText className="h-5 w-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-card-foreground">{v.name}</p>
                  <Badge variant="secondary" className="text-[10px] py-0">{v.style}</Badge>
                  {v.language && (
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${v.language === "DE" ? "bg-yellow-400/10 text-yellow-500 border-yellow-400/20" : "bg-primary/10 text-primary border-primary/20"}`}>
                      <Languages className="h-2.5 w-2.5" />{v.language}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{formatDate(v.createdAt)}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit" onClick={() => openEdit(v)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" title="Export PDF" onClick={() => {
                  const html = buildHtml(v.content, v.style);
                  const win = window.open("", "_blank"); if (!win) return;
                  win.document.write(html); win.document.close(); win.setTimeout(() => win.print(), 400);
                }}>
                  <Download className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" title="Delete" onClick={() => handleDeleteVersion(v.id)}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save dialog */}
      <Dialog open={saveDialog} onOpenChange={setSaveDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Save CV</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>CV Name</Label>
              <Input
                className="mt-1.5"
                placeholder="e.g. Software Engineer – Modern"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                autoFocus
              />
            </div>
            {!isPaid && creationLimit !== null && !editingVersionId && (
              <p className="text-xs text-muted-foreground">
                After saving: {creationsUsed + 1} / {creationLimit} CV builds used.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveVersion} disabled={!saveName.trim()}>Save CV</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
