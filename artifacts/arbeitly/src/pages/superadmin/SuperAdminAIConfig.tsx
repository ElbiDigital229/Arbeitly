import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, Eye, EyeOff, Clock, ChevronDown, ChevronRight } from "lucide-react";
import { useAIConfig, type PromptConfig, type LanguageRule, type AIConfig } from "@/context/AIConfigContext";
import { useToast } from "@/hooks/use-toast";

type PromptField = keyof Omit<AIConfig, "provider" | "apiKey" | "languageRules">;

const PROMPT_KEYS: { key: PromptField; label: string; description: string }[] = [
  { key: "cvEnhancementPrompt", label: "CV Enhancement", description: "Used to improve and enhance candidate CV content with AI" },
  { key: "jobTailoringPrompt",  label: "Job Tailoring",  description: "Tailors CV/cover letter to a specific job description" },
  { key: "coverLetterPrompt",  label: "Cover Letter",   description: "Generates cover letters for job applications" },
  { key: "jobMatchingPrompt",  label: "Job Matching",   description: "Scores and matches candidate profiles to job listings" },
];

const LANG_RULES: { key: keyof AIConfig["languageRules"]; label: string; desc: string }[] = [
  { key: "englishOnly",  label: "English-only job", desc: "Job description is in English only" },
  { key: "germanOnly",   label: "German-only job",  desc: "Job description is in German only" },
  { key: "bothAccepted", label: "Both accepted",    desc: "Job accepts both EN and DE applications" },
];

const ACTION_LABELS: Record<LanguageRule, string> = {
  "en": "Use English CV",
  "de": "Use German CV (auto-translate if missing)",
  "de-preferred": "Prefer German, fallback to English",
};

function PromptCard({ promptKey, config, onUpdate }: {
  promptKey: PromptField;
  config: PromptConfig;
  onUpdate: (content: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(config.current);
  const [expanded, setExpanded] = useState(false);
  const meta = PROMPT_KEYS.find((p) => p.key === promptKey)!;

  const save = () => { onUpdate(draft); setDraft(draft); setEditing(false); };
  const cancel = () => { setDraft(config.current); setEditing(false); };

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); }
    catch { return iso; }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="font-display text-base">{meta.label}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">{meta.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
              v{config.history.length + 1}
            </span>
            {!editing && (
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setEditing(true)}>
                <Wand2 className="h-3 w-3" /> Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {editing ? (
          <>
            <Textarea
              className="min-h-[200px] font-mono text-xs resize-y"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <div className="flex items-center gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={cancel}>Cancel</Button>
              <Button size="sm" onClick={save} disabled={!draft.trim()}>Save Prompt</Button>
            </div>
          </>
        ) : (
          <div className="rounded-lg bg-secondary/50 p-3">
            <p className="text-xs font-mono text-card-foreground whitespace-pre-wrap line-clamp-4">{config.current}</p>
          </div>
        )}

        {config.history.length > 0 && (
          <div>
            <button
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              {config.history.length} previous version{config.history.length !== 1 ? "s" : ""}
            </button>
            {expanded && (
              <div className="mt-2 space-y-2">
                {[...config.history].map((h, i) => (
                  <div key={i} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {formatDate(h.updatedAt)} · v{h.version}
                      </p>
                      <Button variant="link" size="sm" className="h-5 px-0 text-[11px]" onClick={() => { setDraft(h.content); setEditing(true); }}>
                        Restore
                      </Button>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground whitespace-pre-wrap line-clamp-3">{h.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function SuperAdminAIConfig() {
  const { config, updateProvider, updateApiKey, updatePrompt, updateLanguageRules } = useAIConfig();
  const { toast } = useToast();
  const [showKey, setShowKey] = useState(false);
  const [apiKeyDraft, setApiKeyDraft] = useState(config.apiKey);

  const saveApiKey = () => {
    updateApiKey(apiKeyDraft);
    toast({ title: "API key saved" });
  };

  const updateLangRule = (key: keyof typeof config.languageRules, value: LanguageRule) => {
    updateLanguageRules({ ...config.languageRules, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">AI Configuration</h1>
        <p className="text-muted-foreground">Manage LLM provider, prompts, and language routing rules</p>
      </div>

      {/* Provider + API key */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">LLM Provider</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Provider</Label>
              <Select value={config.provider} onValueChange={(v) => updateProvider(v as typeof config.provider)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="claude">Anthropic Claude</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>API Key</Label>
              <div className="flex gap-2 mt-1.5">
                <div className="relative flex-1">
                  <Input
                    type={showKey ? "text" : "password"}
                    placeholder="sk-..."
                    value={apiKeyDraft}
                    onChange={(e) => setApiKeyDraft(e.target.value)}
                    className="font-mono text-xs pr-8"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowKey((v) => !v)}
                  >
                    {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <Button size="sm" onClick={saveApiKey} disabled={!apiKeyDraft.trim()}>Save</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language routing rules */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">Language Routing Rules</CardTitle>
          <p className="text-xs text-muted-foreground">System detects job language requirement and routes to correct CV automatically</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {LANG_RULES.map(({ key, label, desc }) => (
              <div key={key} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <Select
                  value={config.languageRules[key]}
                  onValueChange={(v) => updateLangRule(key, v as LanguageRule)}
                >
                  <SelectTrigger className="w-64 text-xs h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(ACTION_LABELS) as [LanguageRule, string][]).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prompts */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-foreground">AI Prompts</h2>
        {PROMPT_KEYS.map(({ key }) => (
          <PromptCard
            key={key}
            promptKey={key}
            config={config[key] as PromptConfig}
            onUpdate={(content) => {
              updatePrompt(key, content);
              toast({ title: "Prompt updated" });
            }}
          />
        ))}
      </div>
    </div>
  );
}
