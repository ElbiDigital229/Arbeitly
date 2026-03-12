import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Wand2, Activity } from "lucide-react";

const stats = [
  { label: "Active Users", value: "156", icon: Users },
  { label: "AI Generations Today", value: "89", icon: Wand2 },
  { label: "System Health", value: "99.9%", icon: Activity },
  { label: "Admin Users", value: "3", icon: Shield },
];

const AdminOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Admin Overview</h1>
        <p className="text-muted-foreground">System status and AI configuration management</p>
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
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a href="/admin/cv-prompts" className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                <Wand2 className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="font-medium text-card-foreground text-sm">Edit CV Prompts</p>
                <p className="text-xs text-muted-foreground">Configure AI generation parameters</p>
              </div>
            </a>
            <a href="/admin/cl-prompts" className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                <Wand2 className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="font-medium text-card-foreground text-sm">Edit Cover Letter Prompts</p>
                <p className="text-xs text-muted-foreground">Adjust tone and formatting logic</p>
              </div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">System Logs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { msg: "CV prompt updated by admin@arbeitly.de", time: "2 hours ago" },
              { msg: "New subscription: Professional plan", time: "4 hours ago" },
              { msg: "System backup completed", time: "6 hours ago" },
              { msg: "AI model updated to GPT-4o", time: "1 day ago" },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-card-foreground">{log.msg}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{log.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
