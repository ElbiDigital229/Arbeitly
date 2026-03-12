import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, FileText, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Candidates", value: "156", icon: Users, change: "+12 this month" },
  { label: "Active Applications", value: "89", icon: Briefcase, change: "+23 this week" },
  { label: "Documents Generated", value: "342", icon: FileText, change: "+45 this week" },
  { label: "Success Rate", value: "28%", icon: TrendingUp, change: "+5% vs last month" },
];

const recentActivity = [
  { action: "CV optimized", candidate: "Anna Schmidt", time: "5 min ago" },
  { action: "Application submitted", candidate: "Thomas Wagner", time: "12 min ago" },
  { action: "Cover letter generated", candidate: "Lisa Müller", time: "25 min ago" },
  { action: "Interview scheduled", candidate: "Peter Fischer", time: "1 hour ago" },
  { action: "New candidate registered", candidate: "Maria Becker", time: "2 hours ago" },
];

const InternalOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Operations Overview</h1>
        <p className="text-muted-foreground">Monitor platform activity and candidate progress</p>
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
          <CardTitle className="font-display">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-medium text-card-foreground">{item.action}</p>
                  <p className="text-sm text-muted-foreground">{item.candidate}</p>
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InternalOverview;
