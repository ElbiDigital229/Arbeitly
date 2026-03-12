import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Clock } from "lucide-react";

const documents = [
  { name: "CV - Max Müller v3", type: "CV", created: "2026-03-06", format: "PDF", status: "Current" },
  { name: "CV - Max Müller v2", type: "CV", created: "2026-02-20", format: "PDF", status: "Previous" },
  { name: "CV - Max Müller v1", type: "CV", created: "2026-02-10", format: "DOCX", status: "Previous" },
  { name: "CL - SAP Senior Frontend", type: "Cover Letter", created: "2026-03-06", format: "PDF", status: "Current" },
  { name: "CL - BMW Full Stack", type: "Cover Letter", created: "2026-03-04", format: "PDF", status: "Current" },
  { name: "CL - Siemens React Dev", type: "Cover Letter", created: "2026-03-01", format: "PDF", status: "Current" },
];

const Documents = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Documents</h1>
        <p className="text-muted-foreground">Manage your CVs and cover letters</p>
      </div>

      <div className="grid gap-4">
        {documents.map((doc, i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-card-foreground">{doc.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>{doc.type}</span>
                    <span>·</span>
                    <span>{doc.format}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {doc.created}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {doc.status === "Current" && (
                  <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                    Current
                  </span>
                )}
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Documents;
