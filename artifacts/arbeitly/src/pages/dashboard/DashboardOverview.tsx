import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, TrendingUp, Clock } from "lucide-react";

const stats = [
  { label: "Total Applications", value: "24", icon: Briefcase, change: "+3 this week" },
  { label: "Documents Generated", value: "18", icon: FileText, change: "+5 this week" },
  { label: "Interview Rate", value: "33%", icon: TrendingUp, change: "+8% vs last month" },
  { label: "Pending Review", value: "6", icon: Clock, change: "2 urgent" },
];

const recentApplications = [
  { job: "Senior Frontend Developer", company: "SAP SE", date: "2026-03-06", status: "Applied" },
  { job: "Full Stack Engineer", company: "BMW Group", date: "2026-03-04", status: "Interview" },
  { job: "React Developer", company: "Siemens", date: "2026-03-01", status: "Applied" },
  { job: "Software Architect", company: "Allianz", date: "2026-02-28", status: "Rejected" },
  { job: "Tech Lead", company: "Bosch", date: "2026-02-25", status: "Offer" },
];

const statusColors: Record<string, string> = {
  Applied: "bg-info/10 text-info",
  Interview: "bg-warning/10 text-warning",
  Rejected: "bg-destructive/10 text-destructive",
  Offer: "bg-success/10 text-success",
};

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Welcome back, Max</h1>
        <p className="text-muted-foreground">Here's your job search overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display text-card-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentApplications.map((app, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-medium text-card-foreground">{app.job}</p>
                  <p className="text-sm text-muted-foreground">{app.company} · {app.date}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[app.status]}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
