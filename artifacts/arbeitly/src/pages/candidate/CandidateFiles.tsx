import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText, Download, ChevronRight, ChevronDown, FolderOpen, FolderClosed,
  Languages, Cpu, User, Upload, Search, ScrollText, File,
} from "lucide-react";
import { useCustomers } from "@/context/CustomersContext";

type CvStyle = "modern" | "classic" | "minimal";
type Language = "EN" | "DE";
type CvSource = "uploaded" | "generated" | "reviewed";
type CvVariant = { id: string; name: string; label: string; content: string; createdAt: string; style: CvStyle; language?: Language; source?: CvSource };
type CvVersion = { id: string; letter: string; name: string; label: string; content: string; createdAt: string; style: CvStyle; variants: CvVariant[]; language?: Language; source?: CvSource };
type CvTree = { original: { content: string; createdAt: string; language?: Language }; versions: CvVersion[] };

type SelectedFile = { content: string; style: CvStyle; label: string } | null;

const sourceMeta: Record<CvSource, { label: string; icon: React.ElementType; className: string }> = {
  uploaded: { label: "Uploaded", icon: Upload, className: "bg-secondary text-muted-foreground border-border" },
  generated: { label: "AI Generated", icon: Cpu, className: "bg-blue-500/10 text-blue-400 border-blue-400/20" },
  reviewed:  { label: "Human Reviewed", icon: User, className: "bg-green-500/10 text-green-400 border-green-400/20" },
};

const LangBadge = ({ lang }: { lang?: Language }) => {
  if (!lang) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${lang === "DE" ? "bg-yellow-400/10 text-yellow-500 border-yellow-400/20" : "bg-primary/10 text-primary border-primary/20"}`}>
      <Languages className="h-2.5 w-2.5" />{lang}
    </span>
  );
};

const SourceBadge = ({ source }: { source?: CvSource }) => {
  if (!source) return null;
  const m = sourceMeta[source];
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${m.className}`}>
      <Icon className="h-2.5 w-2.5" />{m.label}
    </span>
  );
};

const formatDate = (iso: string) => {
  try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return iso; }
};

const buildPdfHtml = (content: string, style: CvStyle): string => {
  const css: Record<CvStyle, string> = {
    modern: `body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a2e;margin:0;padding:0}.w{max-width:780px;margin:0 auto;padding:40px 48px}h1{font-size:2rem;font-weight:700;margin:0 0 4px;color:#0f172a}h2{font-size:1rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#0ea5e9;border-bottom:2px solid #0ea5e9;padding-bottom:4px;margin:24px 0 10px}p,li{font-size:.92rem;line-height:1.65;color:#334155;margin:4px 0}ul{padding-left:18px}strong{color:#0f172a}`,
    classic: `body{font-family:Georgia,serif;color:#1a1a1a;margin:0;padding:0}.w{max-width:780px;margin:0 auto;padding:48px 56px}h1{font-size:1.9rem;font-weight:700;margin:0 0 4px;border-bottom:3px double #1a1a1a;padding-bottom:8px}h2{font-size:1rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin:24px 0 8px;color:#1a1a1a}p,li{font-size:.93rem;line-height:1.7;color:#2d2d2d;margin:4px 0}ul{padding-left:20px}`,
    minimal: `body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#222;margin:0;padding:0}.w{max-width:760px;margin:0 auto;padding:44px 52px}h1{font-size:1.8rem;font-weight:300;letter-spacing:.04em;margin:0 0 4px}h2{font-size:.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.12em;color:#888;margin:28px 0 8px}p,li{font-size:.9rem;line-height:1.6;color:#444;margin:3px 0}ul{padding-left:16px}hr{border:none;border-top:1px solid #e5e5e5;margin:16px 0}`,
  };
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{box-sizing:border-box}${css[style]}</style></head><body><div class="w">${content}</div></body></html>`;
};

const emptyTree: CvTree = { original: { content: "", createdAt: "" }, versions: [] };

// ── Tree node row ─────────────────────────────────────────────────────────────

const TreeNode = ({
  icon: Icon, label, date, language, source, style, selected, depth = 0,
  hasChildren, expanded, onToggle, onSelect, onDownload,
}: {
  icon: React.ElementType; label: string; date?: string;
  language?: Language; source?: CvSource; style?: CvStyle;
  selected: boolean; depth?: number; hasChildren?: boolean;
  expanded?: boolean; onToggle?: () => void; onSelect: () => void;
  onDownload?: () => void;
}) => (
  <div
    className={`flex items-center gap-1.5 px-2 py-2 rounded-lg cursor-pointer transition-colors group ${selected ? "bg-primary/10 border border-primary/20" : "hover:bg-secondary/60"}`}
    style={{ paddingLeft: `${8 + depth * 16}px` }}
    onClick={onSelect}
  >
    {hasChildren ? (
      <button
        type="button"
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
      >
        {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
      </button>
    ) : (
      <span className="w-3.5 shrink-0" />
    )}
    <Icon className={`h-3.5 w-3.5 shrink-0 ${selected ? "text-primary" : "text-muted-foreground"}`} />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1 flex-wrap">
        <span className={`text-xs font-medium truncate ${selected ? "text-primary" : "text-card-foreground"}`}>{label}</span>
        <LangBadge lang={language} />
        <SourceBadge source={source} />
      </div>
      {date && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{date}{style ? ` · ${style.charAt(0).toUpperCase() + style.slice(1)}` : ""}</p>}
    </div>
    {onDownload && (
      <button
        type="button"
        className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all p-1"
        title="Download PDF"
        onClick={(e) => { e.stopPropagation(); onDownload(); }}
      >
        <Download className="h-3 w-3" />
      </button>
    )}
  </div>
);

// ── Section header ─────────────────────────────────────────────────────────────

const SectionHeader = ({
  icon: Icon, label, count, expanded, onToggle,
}: {
  icon: React.ElementType; label: string; count: number; expanded: boolean; onToggle: () => void;
}) => (
  <button
    type="button"
    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary/40 transition-colors text-left"
    onClick={onToggle}
  >
    {expanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
    <Icon className="h-3.5 w-3.5 text-primary" />
    <span className="text-xs font-semibold text-foreground flex-1">{label}</span>
    {count > 0 && (
      <span className="text-[10px] font-medium text-muted-foreground bg-secondary rounded-full px-1.5 py-0.5">{count}</span>
    )}
  </button>
);

// ── Main component ────────────────────────────────────────────────────────────

export default function CandidateFiles() {
  const { currentCustomer } = useCustomers();
  const id = currentCustomer?.id;
  const isPaid = currentCustomer?.planType === "paid";

  const loadTree = (key: string): CvTree => {
    try { const s = id ? localStorage.getItem(`${key}_${id}`) : null; return s ? JSON.parse(s) : emptyTree; }
    catch { return emptyTree; }
  };

  const cvTree = loadTree("arbeitly_cv_tree");
  const clTree = loadTree("arbeitly_cl_tree");

  const [selected, setSelected] = useState<SelectedFile>(null);
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());
  const [expandedCl, setExpandedClVersions] = useState<Set<string>>(new Set());
  const [cvSectionOpen, setCvSectionOpen] = useState(true);
  const [clSectionOpen, setClSectionOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filterChips = [
    { key: "all", label: "All" },
    { key: "uploaded", label: "Uploaded" },
    { key: "generated", label: "AI Generated" },
    { key: "reviewed", label: "Reviewed" },
    { key: "EN", label: "EN" },
    { key: "DE", label: "DE" },
  ];

  const matchesFilter = (source?: CvSource, lang?: Language) =>
    activeFilter === "all" || activeFilter === source || activeFilter === lang;
  const matchesSearch = (label: string) =>
    !searchQuery || label.toLowerCase().includes(searchQuery.toLowerCase());

  const filterTree = useMemo(() => (tree: CvTree): CvTree => {
    const filteredVersions = tree.versions
      .map((v) => {
        const vMatch = matchesSearch(v.name) && matchesFilter(v.source, v.language);
        const filteredVariants = v.variants.filter((vr) => matchesSearch(vr.label) && matchesFilter(vr.source, vr.language));
        if (vMatch || filteredVariants.length > 0) return { ...v, variants: vMatch ? v.variants : filteredVariants };
        return null;
      })
      .filter(Boolean) as CvVersion[];
    const showOriginal = (!searchQuery || "original upload".includes(searchQuery.toLowerCase())) &&
      (activeFilter === "all" || activeFilter === tree.original.language || activeFilter === "uploaded");
    return { original: showOriginal ? tree.original : { content: "", createdAt: "" }, versions: filteredVersions };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, activeFilter]);

  const filteredCv = filterTree(cvTree);
  const filteredCl = filterTree(clTree);

  function countTree(t: CvTree) {
    let n = t.original.content ? 1 : 0;
    for (const v of t.versions) { n++; n += v.variants.length; }
    return n;
  }

  const toggleVersion = (vid: string, set: Set<string>, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    next.has(vid) ? next.delete(vid) : next.add(vid);
    setter(next);
  };

  const downloadPdf = (content: string, style: CvStyle = "modern") => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(buildPdfHtml(content, style));
    win.document.close();
    win.setTimeout(() => win.print(), 400);
  };

  const selectFile = (content: string, style: CvStyle = "modern", label: string) => {
    setSelected({ content, style, label });
  };

  const renderTree = (
    tree: CvTree,
    expandedSet: Set<string>,
    setExpanded: (s: Set<string>) => void,
  ) => (
    <div className="space-y-0.5 pl-1">
      {tree.original.content && (
        <TreeNode
          icon={File}
          label="Original Upload"
          date={formatDate(tree.original.createdAt)}
          language={tree.original.language}
          source="uploaded"
          selected={selected?.label === "Original Upload"}
          onSelect={() => selectFile(tree.original.content, "modern", "Original Upload")}
          onDownload={() => downloadPdf(tree.original.content, "modern")}
        />
      )}
      {tree.versions.map((v) => (
        <div key={v.id}>
          <TreeNode
            icon={FileText}
            label={v.name}
            date={formatDate(v.createdAt)}
            style={v.style}
            language={v.language}
            source={v.source ?? "reviewed"}
            selected={selected?.label === v.name}
            hasChildren={v.variants.length > 0}
            expanded={expandedSet.has(v.id)}
            onToggle={() => toggleVersion(v.id, expandedSet, setExpanded)}
            onSelect={() => selectFile(v.content, v.style, v.name)}
            onDownload={() => downloadPdf(v.content, v.style)}
          />
          {expandedSet.has(v.id) && v.variants.map((vr) => (
            <TreeNode
              key={vr.id}
              icon={FileText}
              label={vr.label}
              date={formatDate(vr.createdAt)}
              style={vr.style}
              language={vr.language}
              source={vr.source ?? "generated"}
              depth={1}
              selected={selected?.label === vr.label}
              onSelect={() => selectFile(vr.content, vr.style, vr.label)}
              onDownload={() => downloadPdf(vr.content, vr.style)}
            />
          ))}
        </div>
      ))}
    </div>
  );

  const cvCount = countTree(filteredCv);
  const clCount = countTree(filteredCl);
  const totalCount = cvCount + clCount;

  return (
    <div className="flex h-[calc(100vh-48px)]">
      {/* ── Left: file explorer ── */}
      <div className="w-72 flex-shrink-0 flex flex-col border-r border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border shrink-0">
          <h1 className="font-display text-sm font-bold text-foreground">Your Files</h1>
          <p className="text-[10px] text-muted-foreground mt-0.5">{totalCount} file{totalCount !== 1 ? "s" : ""}</p>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-border shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              className="h-7 pl-7 text-xs bg-secondary border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            {filterChips.map((chip) => (
              <button
                key={chip.key}
                onClick={() => setActiveFilter(chip.key)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors ${
                  activeFilter === chip.key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-muted-foreground border-border hover:border-primary/40"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tree */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {/* CVs section */}
          <SectionHeader
            icon={cvSectionOpen ? FolderOpen : FolderClosed}
            label="CVs"
            count={cvCount}
            expanded={cvSectionOpen}
            onToggle={() => setCvSectionOpen((v) => !v)}
          />
          {cvSectionOpen && (
            cvCount > 0
              ? renderTree(filteredCv, expandedVersions, setExpandedVersions)
              : <p className="text-[11px] text-muted-foreground pl-8 py-2">No files match your search.</p>
          )}

          {/* Cover Letters section — paid only, hidden for free users */}
          {isPaid && (
            <>
              <SectionHeader
                icon={clSectionOpen ? FolderOpen : FolderClosed}
                label="Cover Letters"
                count={clCount}
                expanded={clSectionOpen}
                onToggle={() => setClSectionOpen((v) => !v)}
              />
              {clSectionOpen && (
                clCount > 0
                  ? renderTree(filteredCl, expandedCl, setExpandedClVersions)
                  : <p className="text-[11px] text-muted-foreground pl-8 py-2">No cover letters yet.</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Right: preview panel ── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-secondary/10">
        {selected ? (
          <>
            <div className="flex items-center gap-3 px-5 py-2.5 border-b border-border bg-card/50 shrink-0">
              <ScrollText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-card-foreground">{selected.label}</span>
              <Badge variant="secondary" className="text-[10px]">{selected.style}</Badge>
              <div className="flex-1" />
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1.5 text-xs"
                onClick={() => downloadPdf(selected.content, selected.style)}
              >
                <Download className="h-3.5 w-3.5" /> Download PDF
              </Button>
            </div>
            <div className="flex-1 overflow-hidden p-4">
              <iframe
                key={selected.label}
                srcDoc={buildPdfHtml(selected.content, selected.style)}
                className="w-full h-full rounded-xl border border-border/30 shadow-lg bg-white"
                title="File Preview"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <FileText className="h-10 w-10 opacity-20" />
            <p className="text-sm">Select a file to preview</p>
            <p className="text-xs opacity-60">Click any file in the tree on the left</p>
          </div>
        )}
      </div>
    </div>
  );
}
