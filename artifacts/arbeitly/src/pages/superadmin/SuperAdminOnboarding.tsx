import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, GripVertical, X } from "lucide-react";
import { useOnboardingConfig, type OnboardingQuestion, type QuestionType, type OnboardingConfigSection as OnboardingSection } from "@/context/OnboardingConfigContext";
import { useToast } from "@/hooks/use-toast";

const TYPE_LABELS: Record<QuestionType, string> = {
  text: "Short text", dropdown: "Dropdown",
  multiselect: "Multi-select",
};

const emptyQ = (_section: OnboardingSection, order: number): OnboardingQuestion => ({
  id: "", label: "", placeholder: "", type: "text", options: [], required: true, order,
});

function QuestionCard({
  q, onEdit, onDelete,
}: { q: OnboardingQuestion; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors group">
      <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0 cursor-grab" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-card-foreground">{q.label || "(untitled)"}</p>
          <Badge variant="outline" className="text-[10px]">{TYPE_LABELS[q.type]}</Badge>
          {q.required && <Badge variant="outline" className="text-[10px] border-destructive/30 text-destructive">Required</Badge>}
        </div>
        {q.placeholder && <p className="text-xs text-muted-foreground mt-0.5 truncate">Placeholder: {q.placeholder}</p>}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDelete}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
      </div>
    </div>
  );
}

export default function SuperAdminOnboarding() {
  const { paidQuestions, freeQuestions, upsertQuestion, deleteQuestion } = useOnboardingConfig();
  const { toast } = useToast();
  const [section, setSection] = useState<OnboardingSection>("paid");
  const [dialog, setDialog] = useState<{ open: boolean; q: OnboardingQuestion }>({
    open: false, q: emptyQ("paid", 0),
  });
  const [optionInput, setOptionInput] = useState("");

  const questions = section === "paid" ? paidQuestions : freeQuestions;

  const openAdd = () => setDialog({ open: true, q: emptyQ(section, questions.length + 1) });
  const openEdit = (q: OnboardingQuestion) => setDialog({ open: true, q: { ...q, options: [...(q.options ?? [])] } });
  const closeDialog = () => { setDialog({ open: false, q: emptyQ(section, 0) }); setOptionInput(""); };

  const setField = <K extends keyof typeof dialog.q>(k: K, v: typeof dialog.q[K]) =>
    setDialog((prev) => ({ ...prev, q: { ...prev.q, [k]: v } }));

  const addOption = () => {
    if (!optionInput.trim()) return;
    setField("options", [...(dialog.q.options ?? []), optionInput.trim()]);
    setOptionInput("");
  };

  const removeOption = (i: number) =>
    setField("options", (dialog.q.options ?? []).filter((_, idx) => idx !== i));

  const handleSave = () => {
    const q = dialog.q;
    const id = q.id || `q_${Date.now()}`;
    upsertQuestion(section, { ...q, id });
    toast({ title: q.id ? "Question updated" : "Question added" });
    closeDialog();
  };

  const handleDelete = (id: string) => {
    deleteQuestion(section, id);
    toast({ title: "Question deleted" });
  };

  const needsOptions = dialog.q.type === "dropdown" || dialog.q.type === "multiselect";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Onboarding Config</h1>
          <p className="text-muted-foreground">Configure questions shown to candidates during onboarding</p>
        </div>
        <Button onClick={openAdd} className="rounded-full gap-2">
          <Plus className="h-4 w-4" /> Add Question
        </Button>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2">
        {(["paid", "free"] as OnboardingSection[]).map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${section === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
          >
            {s === "paid" ? "Paid Onboarding" : "Free Onboarding"}
            <span className="ml-2 text-xs opacity-70">
              ({(s === "paid" ? paidQuestions : freeQuestions).length})
            </span>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base">
            {section === "paid" ? "Paid Plan Questions" : "Free Plan Questions"}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {section === "paid" ? "Extended questionnaire for paid candidates" : "Basic questionnaire for free candidates"}
          </p>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p className="text-sm">No questions yet. Add your first question.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {questions.map((q) => (
                <QuestionCard
                  key={q.id}
                  q={q}
                  onEdit={() => openEdit(q)}
                  onDelete={() => handleDelete(q.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={dialog.open} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{dialog.q.id ? "Edit Question" : "Add Question"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Question Label <span className="text-destructive">*</span></Label>
              <Input className="mt-1.5" placeholder="e.g. What is your target role?" value={dialog.q.label} onChange={(e) => setField("label", e.target.value)} />
            </div>
            <div>
              <Label>Placeholder (optional)</Label>
              <Input className="mt-1.5" placeholder="e.g. Enter your answer here..." value={dialog.q.placeholder ?? ""} onChange={(e) => setField("placeholder", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type</Label>
                <Select value={dialog.q.type} onValueChange={(v) => setField("type", v as QuestionType)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2 pb-0.5">
                <Switch id="req" checked={dialog.q.required} onCheckedChange={(v) => setField("required", v)} />
                <Label htmlFor="req">Required</Label>
              </div>
            </div>

            {needsOptions && (
              <div>
                <Label className="mb-2 block">Options</Label>
                <div className="flex gap-2">
                  <Input placeholder="Add option..." value={optionInput} onChange={(e) => setOptionInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addOption()} />
                  <Button variant="outline" size="sm" onClick={addOption} disabled={!optionInput.trim()}>
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(dialog.q.options ?? []).map((opt, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-xs text-muted-foreground">
                      {opt}
                      <button onClick={() => removeOption(i)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSave} disabled={!dialog.q.label.trim()}>{dialog.q.id ? "Save" : "Add Question"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
