import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MessageSquare, CheckCircle, ChevronDown, ChevronRight, RotateCcw } from "lucide-react";
import { useCustomers } from "@/context/CustomersContext";

type FaqStatus = "pending" | "approved";
type FaqActivityEntry = {
  timestamp: string;
  userId: string;
  userName: string;
  userType: "candidate" | "employee";
  action: "created" | "answer_updated" | "approved" | "unverified" | "candidate_override";
  previousAnswer?: string;
  newAnswer?: string;
};
type FaqItem = {
  id: string;
  question: string;
  answer: string;
  status: FaqStatus;
  createdAt: string;
  createdById: string;
  createdByName: string;
  lockedByCandidate?: boolean;
  verifiedAt?: string;
  verifiedById?: string;
  verifiedByName?: string;
  activity: FaqActivityEntry[];
};

const formatDate = (iso: string) => {
  try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return iso; }
};

export default function CandidateFaqView() {
  const { currentCustomer, updateCustomer } = useCustomers();
  const id = currentCustomer?.id;
  const faqKey = id ? `arbeitly_faq_${id}` : null;

  const loadFaq = (): FaqItem[] => {
    try { const s = faqKey ? localStorage.getItem(faqKey) : null; return s ? JSON.parse(s) : []; }
    catch { return []; }
  };

  const [items, setItems] = useState<FaqItem[]>(loadFaq);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [overrideDialog, setOverrideDialog] = useState(false);
  const [overrideTargetId, setOverrideTargetId] = useState<string | null>(null);
  const [overrideAnswer, setOverrideAnswer] = useState("");

  const save = (updated: FaqItem[]) => {
    setItems(updated);
    if (faqKey) localStorage.setItem(faqKey, JSON.stringify(updated));
  };

  const approve = (faqId: string) => {
    if (!currentCustomer) return;
    save(items.map((f) => f.id === faqId ? {
      ...f,
      status: "approved" as FaqStatus,
      verifiedAt: new Date().toISOString(),
      verifiedById: currentCustomer.id,
      verifiedByName: currentCustomer.fullName,
      activity: [{
        timestamp: new Date().toISOString(),
        userId: currentCustomer.id,
        userName: currentCustomer.fullName,
        userType: "candidate" as const,
        action: "approved" as const,
      }, ...(f.activity || [])],
    } : f));
  };

  const unverify = (faqId: string) => {
    if (!currentCustomer) return;
    save(items.map((f) => f.id === faqId ? {
      ...f,
      status: "pending" as FaqStatus,
      verifiedAt: undefined, verifiedById: undefined, verifiedByName: undefined,
      activity: [{
        timestamp: new Date().toISOString(),
        userId: currentCustomer.id,
        userName: currentCustomer.fullName,
        userType: "candidate" as const,
        action: "unverified" as const,
      }, ...(f.activity || [])],
    } : f));
  };

  const openOverride = (faqId: string, currentAnswer: string) => {
    setOverrideTargetId(faqId);
    setOverrideAnswer(currentAnswer);
    setOverrideDialog(true);
  };

  const submitOverride = () => {
    if (!overrideTargetId || !overrideAnswer.trim() || !currentCustomer) return;
    save(items.map((f) => f.id === overrideTargetId ? {
      ...f,
      answer: overrideAnswer.trim(),
      status: "approved" as FaqStatus,
      lockedByCandidate: true,
      verifiedAt: new Date().toISOString(),
      verifiedById: currentCustomer.id,
      verifiedByName: currentCustomer.fullName,
      activity: [{
        timestamp: new Date().toISOString(),
        userId: currentCustomer.id,
        userName: currentCustomer.fullName,
        userType: "candidate" as const,
        action: "candidate_override" as const,
        previousAnswer: f.answer,
        newAnswer: overrideAnswer.trim(),
      }, ...(f.activity || [])],
    } : f));
    setOverrideDialog(false);
    setOverrideTargetId(null);
    setOverrideAnswer("");
  };

  const approved = items.filter((f) => f.status === "approved").length;
  const pending = items.filter((f) => f.status === "pending").length;

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">FAQ</h1>
        <p className="text-sm text-muted-foreground mt-1">Questions and answers prepared by your advisor. Review and approve each one.</p>
      </div>

      {/* Stats bar */}
      {items.length > 0 && (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">{items.length} total</span>
          <span className="flex items-center gap-1.5 text-green-400 font-medium">
            <CheckCircle className="h-3.5 w-3.5" />{approved} approved
          </span>
          {pending > 0 && (
            <span className="flex items-center gap-1.5 text-yellow-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-yellow-400 inline-block" />{pending} awaiting your approval
            </span>
          )}
        </div>
      )}

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <MessageSquare className="h-10 w-10 opacity-20" />
            <p className="text-sm font-medium text-card-foreground">No FAQ yet</p>
            <p className="text-xs text-center max-w-xs">Your advisor hasn't added any Q&A yet. Check back later.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((f) => (
            <Card key={f.id} className={f.status === "pending" ? "border-yellow-400/30" : f.lockedByCandidate ? "border-primary/30" : "border-green-400/20"}>
              <CardContent className="p-5 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-card-foreground">{f.question}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${f.status === "approved" ? "bg-green-400/10 text-green-400" : "bg-yellow-400/10 text-yellow-400"}`}>
                        {f.status === "approved" ? "Approved" : "Pending your approval"}
                      </span>
                      {f.lockedByCandidate && (
                        <span className="rounded-full px-2 py-0.5 text-[10px] bg-primary/10 text-primary">Your answer</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">
                      By {f.createdByName} · {formatDate(f.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Answer */}
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap bg-secondary/30 rounded-lg px-4 py-3">{f.answer}</p>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  {f.status === "pending" && (
                    <>
                      <Button size="sm" className="h-8 gap-1.5 text-xs bg-green-500 hover:bg-green-600 text-white" onClick={() => approve(f.id)}>
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                      </Button>
                      {!f.lockedByCandidate && (
                        <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => openOverride(f.id, f.answer)}>
                          Submit my answer
                        </Button>
                      )}
                    </>
                  )}
                  {f.status === "approved" && (
                    <Button size="sm" variant="ghost" className="h-8 text-xs gap-1.5 text-muted-foreground" onClick={() => unverify(f.id)}>
                      <RotateCcw className="h-3 w-3" /> Unverify
                    </Button>
                  )}
                </div>

                {/* Activity log */}
                {(f.activity?.length ?? 0) > 0 && (
                  <div>
                    <button
                      className="flex items-center gap-1 text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                      onClick={() => setExpandedId(expandedId === f.id ? null : f.id)}
                    >
                      {expandedId === f.id ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      History ({f.activity.length})
                    </button>
                    {expandedId === f.id && (
                      <div className="mt-2 space-y-1.5 border-l-2 border-border pl-3">
                        {f.activity.map((a, i) => (
                          <div key={i} className="text-[11px] text-muted-foreground/70">
                            <span className="font-medium text-muted-foreground">{a.userName}</span>{" "}
                            {a.action.replace(/_/g, " ")} · {formatDate(a.timestamp)}
                            {a.previousAnswer && (
                              <p className="pl-2 italic opacity-70 mt-0.5">Was: {a.previousAnswer.slice(0, 80)}{a.previousAnswer.length > 80 ? "…" : ""}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Override Dialog */}
      <Dialog open={overrideDialog} onOpenChange={setOverrideDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Submit Your Answer</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Your answer will replace the advisor's answer and mark this item as approved. This cannot be undone by your advisor.</p>
          <Textarea
            className="resize-none"
            rows={5}
            placeholder="Write your answer here..."
            value={overrideAnswer}
            onChange={(e) => setOverrideAnswer(e.target.value)}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOverrideDialog(false)}>Cancel</Button>
            <Button onClick={submitOverride} disabled={!overrideAnswer.trim()}>Submit & Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
