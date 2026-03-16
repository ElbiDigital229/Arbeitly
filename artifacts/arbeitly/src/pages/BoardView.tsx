import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, FileText, TrendingUp, Clock, MoreHorizontal, Plus, GripVertical, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddJobDialog from "@/components/dialogs/AddJobDialog";
import { useToast } from "@/hooks/use-toast";
import { useApplications } from "@/context/ApplicationsContext";
import type { Application, ApplicationStatus } from "@/data/applications";
import { candidateNames } from "@/data/applications";
import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";

type ColumnDef = { id: ApplicationStatus; title: string; color: string };

const columnDefs: ColumnDef[] = [
  { id: "to-apply", title: "To Apply", color: "bg-muted-foreground" },
  { id: "applied", title: "Applied", color: "bg-info" },
  { id: "interview", title: "Interview", color: "bg-warning" },
  { id: "offer", title: "Offer", color: "bg-success" },
  { id: "rejected", title: "Rejected", color: "bg-destructive" },
];


// ─── Sortable card ────────────────────────────────────────────────────────────

function SortableCard({ card }: { card: Application }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="cursor-grab active:cursor-grabbing hover:border-primary/40 transition-colors bg-card border-border">
        <CardContent className="p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground leading-snug truncate">{card.job}</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{card.company}</p>
            </div>
            <div {...listeners} className="ml-2 mt-0.5 text-muted-foreground hover:text-foreground shrink-0">
              <GripVertical className="h-3.5 w-3.5" />
            </div>
          </div>
          {card.salaryExpectation && (
            <p className="text-[10px] text-primary/70 mt-1 font-medium">{card.salaryExpectation}</p>
          )}
          <div className="flex items-center justify-between mt-2.5">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">{card.cvVersion}</Badge>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <User className="h-2.5 w-2.5" />
                {card.candidate.split(" ")[0]}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {card.date}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CardOverlay({ card }: { card: Application }) {
  return (
    <Card className="cursor-grabbing shadow-xl border-primary/50 bg-card w-[264px]">
      <CardContent className="p-3">
        <p className="text-sm font-medium text-card-foreground">{card.job}</p>
        <p className="text-xs text-muted-foreground mt-1">{card.company}</p>
      </CardContent>
    </Card>
  );
}

// ─── Droppable column ─────────────────────────────────────────────────────────

function DroppableColumn({
  column, cards, onAddClick,
}: {
  column: ColumnDef; cards: Application[]; onAddClick: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const cardIds = cards.map((c) => c.id);

  return (
    <div className="w-[280px] flex flex-col shrink-0">
      <div className="flex items-center justify-between px-2 py-2 mb-2">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${column.color}`} />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">{column.title}</span>
          <span className="text-xs text-muted-foreground bg-secondary rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
            {cards.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2 overflow-y-auto pb-2 min-h-[60px] rounded-lg transition-colors ${isOver ? "bg-primary/5 ring-1 ring-primary/20" : ""}`}
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </SortableContext>

        <button
          onClick={onAddClick}
          className="w-full flex items-center gap-1 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-secondary transition-colors"
        >
          <Plus className="h-3 w-3" /> Add application
        </button>
      </div>
    </div>
  );
}

// ─── BoardView ────────────────────────────────────────────────────────────────

const BoardView = () => {
  const { applications, addApplication, moveCard } = useApplications();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("all");
  const [quickAddStatus, setQuickAddStatus] = useState<ApplicationStatus>("to-apply");
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const { toast } = useToast();

  const handleAddJob = (app: Omit<Application, "id" | "date">) => {
    addApplication(app);
    toast({ title: "Application Added", description: `${app.job} at ${app.company}` });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const byStatus = useMemo(() => {
    const map: Record<ApplicationStatus, Application[]> = {
      "to-apply": [], applied: [], interview: [], offer: [], rejected: [],
    };
    for (const app of applications) {
      if (selectedCandidate === "all" || app.candidate === selectedCandidate) {
        map[app.status].push(app);
      }
    }
    return map;
  }, [applications, selectedCandidate]);

  const totalApps = Object.values(byStatus).reduce((s, arr) => s + arr.length, 0);
  const interviewCount = byStatus.interview.length + byStatus.offer.length;
  const interviewRate = totalApps > 0 ? Math.round((interviewCount / totalApps) * 100) : 0;

  const findStatus = (cardId: string): ApplicationStatus | null => {
    const app = applications.find((a) => a.id === cardId);
    return app ? app.status : null;
  };

  const activeCard = useMemo(
    () => applications.find((a) => a.id === activeId) ?? null,
    [activeId, applications]
  );

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeStatus = findStatus(active.id as string);
    const overStatus = (columnDefs.find((c) => c.id === over.id)?.id ?? findStatus(over.id as string)) as ApplicationStatus | null;
    if (!activeStatus || !overStatus || activeStatus === overStatus) return;
    moveCard(active.id as string, overStatus, over.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const activeStatus = findStatus(active.id as string);
    const overStatus = (columnDefs.find((c) => c.id === over.id)?.id ?? findStatus(over.id as string)) as ApplicationStatus | null;
    if (!activeStatus || !overStatus || activeStatus !== overStatus) return;
    moveCard(active.id as string, overStatus, over.id as string);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Board toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-lg font-bold text-foreground">Application Board</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-normal">
              <Briefcase className="h-3 w-3 mr-1" /> {totalApps} Applications
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal">
              <FileText className="h-3 w-3 mr-1" /> 8 Documents
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal">
              <TrendingUp className="h-3 w-3 mr-1" /> {interviewRate}% Interview Rate
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
            <SelectTrigger className="h-8 w-[200px] text-xs">
              <User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="All Candidates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Candidates</SelectItem>
              {candidateNames.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AddJobDialog onAdd={handleAddJob} candidates={candidateNames} />
        </div>
      </div>

      {/* Kanban columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-3 h-full min-w-max">
            {columnDefs.map((col) => (
              <DroppableColumn
                key={col.id}
                column={col}
                cards={byStatus[col.id]}
                onAddClick={() => { setQuickAddStatus(col.id); setQuickAddOpen(true); }}
              />
            ))}
          </div>
        </div>
        <DragOverlay>
          {activeCard ? <CardOverlay card={activeCard} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Quick-add dialog opened from column "+ Add application" */}
      <AddJobDialog
        key={quickAddStatus}
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
        onAdd={handleAddJob}
        candidates={candidateNames}
        defaultStatus={quickAddStatus}
        trigger={<span className="hidden" />}
      />
    </div>
  );
};

export default BoardView;
