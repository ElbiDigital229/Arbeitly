import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, MapPin, Building } from "lucide-react";

const jobs = [
  { title: "Senior Frontend Developer", company: "SAP SE", location: "Walldorf", source: "LinkedIn", match: 92 },
  { title: "Full Stack Engineer", company: "BMW Group", location: "Munich", source: "Indeed", match: 87 },
  { title: "React Developer", company: "Siemens", location: "Berlin", source: "LinkedIn", match: 85 },
  { title: "Software Architect", company: "Allianz", location: "Munich", source: "Google Jobs", match: 78 },
  { title: "Backend Engineer", company: "Deutsche Bank", location: "Frankfurt", source: "Indeed", match: 75 },
  { title: "DevOps Engineer", company: "Bosch", location: "Stuttgart", source: "LinkedIn", match: 72 },
];

const Jobs = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Job Discovery</h1>
        <p className="text-muted-foreground">Browse and match jobs from external sources</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search jobs..." className="pl-9" />
      </div>

      <div className="grid gap-4">
        {jobs.map((job, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-card-foreground">{job.title}</h3>
                  <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
                    {job.match}% match
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Building className="h-3.5 w-3.5" />{job.company}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                  <span className="flex items-center gap-1"><ExternalLink className="h-3.5 w-3.5" />{job.source}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Generate CL</Button>
                <Button size="sm">Apply</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
