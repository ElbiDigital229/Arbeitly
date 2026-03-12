import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Style definitions ────────────────────────────────────────────────────────

type PdfStyle = "classic" | "modern" | "minimal";

const styleConfig: Record<PdfStyle, { label: string; desc: string }> = {
  classic: {
    label: "Classic",
    desc: "Traditional serif layout — timeless professional format",
  },
  modern: {
    label: "Modern",
    desc: "Clean sans-serif with teal section accents",
  },
  minimal: {
    label: "Minimal",
    desc: "Generous whitespace, ultra-clean typography",
  },
};

// ─── Print CSS per style ──────────────────────────────────────────────────────

function getPrintCss(style: PdfStyle): string {
  const base = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    @page { margin: 2.2cm 2.5cm; }
    html, body { width: 100%; }
    ul, ol { padding-left: 1.4em; }
    ul li, ol li { margin-bottom: 0.25em; line-height: 1.6; }
    p { margin-bottom: 0.5em; line-height: 1.65; }
    strong { font-weight: 700; }
    em { font-style: italic; }
    hr { border: none; border-top: 1px solid #ccc; margin: 1em 0; }
  `;

  if (style === "classic") {
    return base + `
      body {
        font-family: Georgia, "Times New Roman", Times, serif;
        font-size: 11pt;
        color: #1a1a1a;
        line-height: 1.65;
      }
      h1 {
        font-family: Georgia, serif;
        font-size: 18pt;
        font-weight: bold;
        text-align: center;
        letter-spacing: 0.04em;
        margin-bottom: 0.2em;
        color: #000;
      }
      h2 {
        font-family: Georgia, serif;
        font-size: 8.5pt;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: #2c2c2c;
        margin-top: 1.2em;
        margin-bottom: 0.4em;
        padding-bottom: 0.2em;
        border-bottom: 1.5px solid #1a1a1a;
      }
      h3 {
        font-family: Georgia, serif;
        font-size: 11pt;
        font-weight: bold;
        margin-top: 0.7em;
        margin-bottom: 0.15em;
      }
      ul { list-style: disc; }
      ol { list-style: decimal; }
    `;
  }

  if (style === "modern") {
    return base + `
      body {
        font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
        font-size: 10.5pt;
        color: #1e2a32;
        line-height: 1.6;
      }
      h1 {
        font-family: "Inter", sans-serif;
        font-size: 20pt;
        font-weight: 800;
        color: #0a1f29;
        letter-spacing: -0.01em;
        margin-bottom: 0.15em;
      }
      h2 {
        font-family: "Inter", sans-serif;
        font-size: 7.5pt;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: #00b9d4;
        margin-top: 1.3em;
        margin-bottom: 0.5em;
        padding-left: 0.7em;
        border-left: 3px solid #00b9d4;
      }
      h3 {
        font-family: "Inter", sans-serif;
        font-size: 10.5pt;
        font-weight: 600;
        margin-top: 0.7em;
        margin-bottom: 0.1em;
        color: #0a1f29;
      }
      ul { list-style: none; padding-left: 0; }
      ul li::before { content: "▸ "; color: #00b9d4; font-size: 8pt; }
      ol { list-style: decimal; }
    `;
  }

  // minimal
  return base + `
    body {
      font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;
      font-size: 10.5pt;
      color: #222;
      line-height: 1.7;
    }
    h1 {
      font-size: 22pt;
      font-weight: 300;
      letter-spacing: -0.02em;
      color: #111;
      margin-bottom: 0.1em;
    }
    h2 {
      font-size: 7.5pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      color: #888;
      margin-top: 1.6em;
      margin-bottom: 0.6em;
    }
    h3 {
      font-size: 10.5pt;
      font-weight: 600;
      margin-top: 0.8em;
      margin-bottom: 0.1em;
    }
    ul { list-style: none; padding-left: 0; }
    ul li::before { content: "— "; color: #aaa; }
    ol { list-style: decimal; padding-left: 1.2em; }
    p { color: #333; }
  `;
}

// ─── Build print-ready HTML ───────────────────────────────────────────────────

function buildPrintHtml(content: string, style: PdfStyle, title: string): string {
  const css = getPrintCss(style);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  ${style === "modern" ? `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet" />` : ""}
  <style>${css}</style>
</head>
<body>${content}</body>
</html>`;
}

// ─── Style preview card ───────────────────────────────────────────────────────

const StylePreview = ({ style }: { style: PdfStyle }) => {
  if (style === "classic") {
    return (
      <div className="w-full h-full bg-white rounded p-3 flex flex-col gap-1.5 overflow-hidden">
        <div className="w-3/4 h-2.5 bg-gray-800 rounded-sm mx-auto" />
        <div className="w-1/2 h-1.5 bg-gray-400 rounded-sm mx-auto" />
        <div className="w-full border-b border-gray-800 mt-1" />
        <div className="mt-0.5 space-y-1">
          <div className="w-1/3 h-1.5 bg-gray-700 rounded-sm" style={{ letterSpacing: "0.15em" }} />
          <div className="w-full border-b border-gray-700 mt-0.5" />
          <div className="w-full h-1 bg-gray-300 rounded-sm" />
          <div className="w-5/6 h-1 bg-gray-300 rounded-sm" />
          <div className="w-4/5 h-1 bg-gray-300 rounded-sm" />
        </div>
        <div className="mt-1 space-y-1">
          <div className="w-1/3 h-1.5 bg-gray-700 rounded-sm" />
          <div className="w-full border-b border-gray-700 mt-0.5" />
          <div className="flex gap-1 items-start">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-0.5 shrink-0" />
            <div className="w-3/4 h-1 bg-gray-300 rounded-sm" />
          </div>
          <div className="flex gap-1 items-start">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-0.5 shrink-0" />
            <div className="w-2/3 h-1 bg-gray-300 rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (style === "modern") {
    return (
      <div className="w-full h-full bg-white rounded p-3 flex flex-col gap-1.5 overflow-hidden">
        <div className="w-3/4 h-3 bg-[#0a1f29] rounded-sm" />
        <div className="w-1/2 h-1.5 bg-gray-400 rounded-sm" />
        <div className="mt-1 space-y-1.5">
          <div className="flex items-center gap-1">
            <div className="w-0.5 h-3 bg-[#00b9d4] rounded-full" />
            <div className="w-1/3 h-1.5 bg-[#00b9d4]/70 rounded-sm" />
          </div>
          <div className="w-full h-1 bg-gray-200 rounded-sm" />
          <div className="w-5/6 h-1 bg-gray-200 rounded-sm" />
          <div className="w-4/5 h-1 bg-gray-200 rounded-sm" />
        </div>
        <div className="mt-1 space-y-1.5">
          <div className="flex items-center gap-1">
            <div className="w-0.5 h-3 bg-[#00b9d4] rounded-full" />
            <div className="w-1/4 h-1.5 bg-[#00b9d4]/70 rounded-sm" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1 bg-[#00b9d4]/50 rounded-full" />
            <div className="w-2/3 h-1 bg-gray-200 rounded-sm" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1 bg-[#00b9d4]/50 rounded-full" />
            <div className="w-3/5 h-1 bg-gray-200 rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  // minimal
  return (
    <div className="w-full h-full bg-white rounded p-3 flex flex-col gap-2 overflow-hidden">
      <div className="w-2/3 h-3.5 bg-gray-800 rounded-sm" style={{ fontWeight: 300 }} />
      <div className="w-1/2 h-1 bg-gray-300 rounded-sm" />
      <div className="mt-2 space-y-1">
        <div className="w-1/3 h-1 bg-gray-300 rounded-sm" />
        <div className="w-full h-1 bg-gray-200 rounded-sm mt-1" />
        <div className="w-5/6 h-1 bg-gray-200 rounded-sm" />
        <div className="w-4/5 h-1 bg-gray-200 rounded-sm" />
      </div>
      <div className="mt-2 space-y-1">
        <div className="w-1/4 h-1 bg-gray-300 rounded-sm" />
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-2 h-px bg-gray-300" />
          <div className="w-2/3 h-1 bg-gray-200 rounded-sm" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-px bg-gray-300" />
          <div className="w-3/5 h-1 bg-gray-200 rounded-sm" />
        </div>
      </div>
    </div>
  );
};

// ─── PdfExportDialog ──────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  title?: string;
}

const PdfExportDialog = ({ open, onOpenChange, content, title = "Document" }: Props) => {
  const [selected, setSelected] = useState<PdfStyle>("modern");

  const handleExport = () => {
    const html = buildPrintHtml(content, selected, title);
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    // Wait for fonts/resources then print
    win.addEventListener("load", () => {
      setTimeout(() => {
        win.focus();
        win.print();
      }, 400);
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-4 w-4 text-primary" />
            Export as PDF
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose a style template for your exported document.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(styleConfig) as PdfStyle[]).map((s) => {
              const isSelected = selected === s;
              return (
                <button
                  key={s}
                  onClick={() => setSelected(s)}
                  className={cn(
                    "relative flex flex-col rounded-xl border-2 overflow-hidden transition-all text-left",
                    isSelected
                      ? "border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.15)]"
                      : "border-border hover:border-border/80 hover:bg-secondary/20"
                  )}
                >
                  {/* Document preview thumbnail */}
                  <div className="h-36 bg-gray-100 p-2">
                    <StylePreview style={s} />
                  </div>

                  {/* Label area */}
                  <div className="px-3 py-2.5 bg-card">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-foreground">{styleConfig[s].label}</span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <Check className="h-2.5 w-2.5 text-primary-foreground" />
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">{styleConfig[s].desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-3.5 w-3.5" /> Export PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PdfExportDialog;
