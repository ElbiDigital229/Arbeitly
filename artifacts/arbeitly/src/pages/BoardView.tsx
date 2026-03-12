import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, FileText, TrendingUp, Clock, MoreHorizontal, Plus, GripVertical, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddJobDialog from "@/components/dialogs/AddJobDialog";
import { useToast } from "@/hooks/use-toast";
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

type ApplicationCard = {
  id: string;
  job: string;
  company: string;
  date: string;
  cvVersion: string;
  candidate: string;
};

type ColumnId = "to-apply" | "applied" | "interview" | "offer" | "rejected";

type Column = {
  id: ColumnId;
  title: string;
  color: string;
};

const columnDefs: Column[] = [
  { id: "to-apply", title: "To Apply", color: "bg-muted-foreground" },
  { id: "applied", title: "Applied", color: "bg-info" },
  { id: "interview", title: "Interview", color: "bg-warning" },
  { id: "offer", title: "Offer", color: "bg-success" },
  { id: "rejected", title: "Rejected", color: "bg-destructive" },
];

const candidates = [
  "Anna Schmidt",
  "Thomas Wagner",
  "Lisa Müller",
  "Peter Fischer",
  "Maria Becker",
];

const initialCards: Record<ColumnId, ApplicationCard[]> = {
  "to-apply": [
    { id: "1", job: "DevOps Engineer", company: "Bosch", date: "Mar 8", cvVersion: "v3", candidate: "Anna Schmidt" },
    { id: "2", job: "Cloud Architect", company: "SAP SE", date: "Mar 7", cvVersion: "v3", candidate: "Thomas Wagner" },
    { id: "3", job: "Data Engineer", company: "Zalando", date: "Mar 7", cvVersion: "v2", candidate: "Lisa Müller" },
  ],
  applied: [
    { id: "4", job: "Senior Frontend Dev", company: "SAP SE", date: "Mar 6", cvVersion: "v3", candidate: "Anna Schmidt" },
    { id: "5", job: "React Developer", company: "Siemens", date: "Mar 1", cvVersion: "v2", candidate: "Peter Fischer" },
    { id: "6", job: "Backend Engineer", company: "Deutsche Bank", date: "Feb 20", cvVersion: "v3", candidate: "Thomas Wagner" },
    { id: "7", job: "Platform Engineer", company: "BMW Group", date: "Feb 18", cvVersion: "v2", candidate: "Maria Becker" },
  ],
  interview: [
    { id: "8", job: "Full Stack Engineer", company: "BMW Group", date: "Mar 4", cvVersion: "v3", candidate: "Anna Schmidt" },
    { id: "9", job: "Tech Lead", company: "Infineon", date: "Feb 25", cvVersion: "v3", candidate: "Lisa Müller" },
  ],
  offer: [
    { id: "10", job: "Tech Lead", company: "Bosch", date: "Feb 25", cvVersion: "v1", candidate: "Peter Fischer" },
  ],
  rejected: [
    { id: "11", job: "Software Architect", company: "Allianz", date: "Feb 28", cvVersion: "v2", candidate: "Thomas Wagner" },
    { id: "12", job: "SRE Engineer", company: "Delivery Hero", date: "Feb 15", cvVersion: "v1", candidate: "Maria Becker" },
  ],
};

// Sortable card
function SortableCard({ card }: { card: ApplicationCard }) {
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
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground leading-snug">{card.job}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.company}</p>
            </div>
            <div {...listeners} className="ml-2 mt-0.5 text-muted-foreground hover:text-foreground">
              <GripVertical className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
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

// Card overlay (shown while dragging)
function CardOverlay({ card }: { card: ApplicationCard }) {
  return (
    <Card className="cursor-grabbing shadow-xl border-primary/50 bg-card w-[264px]">
      <CardContent className="p-3">
        <p className="text-sm font-medium text-card-foreground">{card.job}</p>
        <p className="text-xs text-muted-foreground mt-1">{card.company}</p>
      </CardContent>
    </Card>
  );
}

// Droppable column
function DroppableColumn({ column, cards }: { column: Column; cards: ApplicationCard[] }) {
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

        <button className="w-full flex items-center gap-1 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-secondary transition-colors">
          <Plus className="h-3 w-3" />
          Add application
        </button>
      </div>
    </div>
  );
}

const BoardView = () => {
  const [columns, setColumns] = useState(initialCards);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("all");
  const { toast } = useToast();
  const [nextId, setNextId] = useState(13);

  const handleAddJob = (job: { job: string; company: string; candidate: string; cvVersion: string }) => {
    const newCard: ApplicationCard = {
      id: String(nextId),
      job: job.job,
      company: job.company,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      cvVersion: job.cvVersion,
      candidate: job.candidate,
    };
    setNextId((prev) => prev + 1);
    setColumns((prev) => ({ ...prev, "to-apply": [newCard, ...prev["to-apply"]] }));
    toast({ title: "Job Added", description: `${job.job} at ${job.company} added to board` });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Find which column a card is in
  const findColumn = (cardId: string): ColumnId | null => {
    for (const [colId, cards] of Object.entries(columns)) {
      if (cards.some((c) => c.id === cardId)) return colId as ColumnId;
    }
    return null;
  };

  const activeCard = useMemo(() => {
    if (!activeId) return null;
    for (const cards of Object.values(columns)) {
      const found = cards.find((c) => c.id === activeId);
      if (found) return found;
    }
    return null;
  }, [activeId, columns]);

  // Filtered columns based on candidate selection
  const filteredColumns = useMemo(() => {
    if (selectedCandidate === "all") return columns;
    const filtered: Record<ColumnId, ApplicationCard[]> = {} as any;
    for (const [colId, cards] of Object.entries(columns)) {
      filtered[colId as ColumnId] = cards.filter((c) => c.candidate === selectedCandidate);
    }
    return filtered;
  }, [columns, selectedCandidate]);

  const totalApps = Object.values(filteredColumns).reduce((sum, cards) => sum + cards.length, 0);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeCol = findColumn(active.id as string);
    // over could be a column id or a card id
    let overCol = columnDefs.find((c) => c.id === over.id)?.id || findColumn(over.id as string);

    if (!activeCol || !overCol || activeCol === overCol) return;

    setColumns((prev) => {
      const activeCards = [...prev[activeCol]];
      const overCards = [...prev[overCol as ColumnId]];
      const activeIndex = activeCards.findIndex((c) => c.id === active.id);
      const [movedCard] = activeCards.splice(activeIndex, 1);

      // Find insert position
      const overIndex = overCards.findIndex((c) => c.id === over.id);
      if (overIndex >= 0) {
        overCards.splice(overIndex, 0, movedCard);
      } else {
        overCards.push(movedCard);
      }

      return { ...prev, [activeCol]: activeCards, [overCol as ColumnId]: overCards };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeCol = findColumn(active.id as string);
    const overCol = columnDefs.find((c) => c.id === over.id)?.id || findColumn(over.id as string);

    if (!activeCol || !overCol) return;

    if (activeCol === overCol) {
      // Reorder within same column
      setColumns((prev) => {
        const cards = [...prev[activeCol]];
        const oldIndex = cards.findIndex((c) => c.id === active.id);
        const newIndex = cards.findIndex((c) => c.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const [item] = cards.splice(oldIndex, 1);
          cards.splice(newIndex, 0, item);
        }
        return { ...prev, [activeCol]: cards };
      });
    }
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
              <TrendingUp className="h-3 w-3 mr-1" /> 33% Interview Rate
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
              {candidates.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AddJobDialog onAdd={handleAddJob} candidates={candidates} />
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
              <DroppableColumn key={col.id} column={col} cards={filteredColumns[col.id]} />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeCard ? <CardOverlay card={activeCard} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default BoardView;
