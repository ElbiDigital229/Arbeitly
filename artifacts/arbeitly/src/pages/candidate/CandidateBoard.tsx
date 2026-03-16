import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, FileText, TrendingUp, Clock, MoreHorizontal, Plus, User } from "lucide-react";

type AppStatus = "to-apply" | "applied" | "interview" | "offer" | "rejected";

type BoardApp = {
  id: string;
  job: string;
  company: string;
  cvVersion: string;
  date: string;
  status: AppStatus;
};

type ColumnDef = { id: AppStatus; title: string; color: string };

const columnDefs: ColumnDef[] = [
  { id: "to-apply", title: "To Apply", color: "bg-muted-foreground" },
  { id: "applied", title: "Applied", color: "bg-info" },
  { id: "interview", title: "Interview", color: "bg-warning" },
  { id: "offer", title: "Offer", color: "bg-success" },
  { id: "rejected", title: "Rejected", color: "bg-destructive" },
];

const seedApps: BoardApp[] = [
  { id: "c1", job: "DevOps Engineer", company: "Bosch", cvVersion: "v3", date: "Mar 8", status: "to-apply" },
  { id: "c2", job: "Cloud Architect", company: "SAP SE", cvVersion: "v3", date: "Mar 7", status: "to-apply" },
  { id: "c3", job: "Data Engineer", company: "Zalando", cvVersion: "v2", date: "Mar 7", status: "to-apply" },
  { id: "c4", job: "Senior Frontend Dev", company: "SAP SE", cvVersion: "v3", date: "Mar 6", status: "applied" },
  { id: "c5", job: "React Developer", company: "Siemens", cvVersion: "v2", date: "Mar 1", status: "applied" },
  { id: "c6", job: "Backend Engineer", company: "Deutsche Bank", cvVersion: "v3", date: "Feb 20", status: "applied" },
  { id: "c7", job: "Full Stack Engineer", company: "BMW Group", cvVersion: "v3", date: "Mar 4", status: "interview" },
  { id: "c8", job: "Tech Lead", company: "Infineon", cvVersion: "v3", date: "Feb 25", status: "interview" },
  { id: "c9", job: "Tech Lead", company: "Bosch", cvVersion: "v1", date: "Feb 25", status: "offer" },
  { id: "c10", job: "Software Architect", company: "Allianz", cvVersion: "v2", date: "Feb 28", status: "rejected" },
  { id: "c11", job: "SRE Engineer", company: "Delivery Hero", cvVersion: "v1", date: "Feb 15", status: "rejected" },
];

const CandidateBoard = () => {
  const [apps, setApps] = useState(seedApps);

  const byStatus = columnDefs.reduce((acc, col) => {
    acc[col.id] = apps.filter((a) => a.status === col.id);
    return acc;
  }, {} as Record<AppStatus, BoardApp[]>);

  const totalApps = apps.length;
  const interviewCount = byStatus.interview.length + byStatus.offer.length;
  const interviewRate = totalApps > 0 ? Math.round((interviewCount / totalApps) * 100) : 0;

  const handleAddApp = (status: AppStatus) => {
    const newApp: BoardApp = {
      id: `c${Date.now()}`,
      job: "New Position",
      company: "Company",
      cvVersion: "v3",
      date: "Mar 16",
      status,
    };
    setApps((prev) => [...prev, newApp]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-lg font-bold text-foreground">Application Board</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-normal">
              <Briefcase className="h-3 w-3 mr-1" /> {totalApps} Applications
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal">
              <FileText className="h-3 w-3 mr-1" /> 3 CVs
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal">
              <TrendingUp className="h-3 w-3 mr-1" /> {interviewRate}% Interview Rate
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-3 h-full min-w-max">
          {columnDefs.map((col) => (
            <div key={col.id} className="w-[280px] flex flex-col shrink-0">
              <div className="flex items-center justify-between px-2 py-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${col.color}`} />
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">{col.title}</span>
                  <span className="text-xs text-muted-foreground bg-secondary rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                    {byStatus[col.id].length}
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto pb-2 min-h-[60px] rounded-lg">
                {byStatus[col.id].map((card) => (
                  <Card key={card.id} className="hover:border-primary/40 transition-colors bg-card border-border">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-card-foreground leading-snug truncate">{card.job}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{card.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">{card.cvVersion}</Badge>
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <User className="h-2.5 w-2.5" />
                            Anna
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {card.date}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <button
                  onClick={() => handleAddApp(col.id)}
                  className="w-full flex items-center gap-1 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-secondary transition-colors"
                >
                  <Plus className="h-3 w-3" /> Add application
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateBoard;
