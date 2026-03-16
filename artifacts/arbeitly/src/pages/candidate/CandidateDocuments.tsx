import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Trash2, Clock, CheckCircle } from "lucide-react";

const cvVersions = [
  { id: 1, title: "CV - Anna Schmidt v3", version: "Version 3", active: true, uploadDate: "Mar 6, 2026", size: "245 KB" },
  { id: 2, title: "CV - Anna Schmidt v2", version: "Version 2", active: false, uploadDate: "Feb 20, 2026", size: "230 KB" },
  { id: 3, title: "CV - Anna Schmidt v1", version: "Version 1", active: false, uploadDate: "Feb 10, 2026", size: "218 KB" },
];

const otherDocuments = [
  { id: 4, title: "Cover Letter - SAP Senior Frontend", type: "Cover Letter", date: "Mar 6, 2026", size: "85 KB" },
  { id: 5, title: "Cover Letter - BMW Full Stack", type: "Cover Letter", date: "Mar 4, 2026", size: "78 KB" },
  { id: 6, title: "Cover Letter - Siemens React Dev", type: "Cover Letter", date: "Mar 1, 2026", size: "82 KB" },
  { id: 7, title: "Reference Letter - Prof. Weber", type: "Reference", date: "Jan 15, 2026", size: "120 KB" },
  { id: 8, title: "Certificates - AWS Solutions Architect", type: "Certificate", date: "Dec 10, 2025", size: "340 KB" },
];

const CandidateDocuments = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Documents</h1>
        <p className="text-muted-foreground">Manage your CVs and other documents</p>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">Your CVs</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {cvVersions.map((cv) => (
            <Card key={cv.id} className={cv.active ? "border-primary/40" : ""}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  {cv.active && (
                    <span className="flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-[10px] font-medium text-success">
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-card-foreground text-sm">{cv.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{cv.version}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {cv.uploadDate}
                  </span>
                  <span>{cv.size}</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 text-xs h-8">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs h-8">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">Other Documents</h2>
        <div className="space-y-3">
          {otherDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-card-foreground text-sm">{doc.title}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>{doc.type}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {doc.date}
                    </span>
                    <span>·</span>
                    <span>{doc.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateDocuments;
