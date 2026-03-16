import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, TrendingUp, CheckCircle, Clock, FileText, Calendar, Target } from "lucide-react";
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";

const statusData = [
  { name: "To Apply", value: 3, color: "hsl(220, 10%, 46%)" },
  { name: "Applied", value: 4, color: "hsl(210, 80%, 52%)" },
  { name: "Interview", value: 2, color: "hsl(38, 92%, 50%)" },
  { name: "Offer", value: 1, color: "hsl(152, 60%, 42%)" },
  { name: "Rejected", value: 2, color: "hsl(0, 72%, 51%)" },
];

const weeklyData = [
  { week: "W1", applications: 2, interviews: 0, responses: 1 },
  { week: "W2", applications: 3, interviews: 1, responses: 2 },
  { week: "W3", applications: 1, interviews: 1, responses: 1 },
  { week: "W4", applications: 4, interviews: 0, responses: 3 },
  { week: "W5", applications: 2, interviews: 2, responses: 1 },
  { week: "W6", applications: 0, interviews: 1, responses: 2 },
];

const monthlyData = [
  { month: "Jan", applications: 3, interviews: 1, offers: 0 },
  { month: "Feb", applications: 6, interviews: 2, offers: 1 },
  { month: "Mar", applications: 3, interviews: 1, offers: 0 },
];

const radarData = [
  { subject: "Technical", score: 88, fullMark: 100 },
  { subject: "Experience", score: 75, fullMark: 100 },
  { subject: "Education", score: 90, fullMark: 100 },
  { subject: "Language", score: 82, fullMark: 100 },
  { subject: "Location", score: 95, fullMark: 100 },
];

const CandidateAnalytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Insights into your job search performance</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-card-foreground">12</p>
                <p className="text-xs text-muted-foreground">Total Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
                <TrendingUp className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-card-foreground">25%</p>
                <p className="text-xs text-muted-foreground">Interview Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-card-foreground">8%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info/10">
                <Clock className="h-4 w-4 text-info" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-card-foreground">5d</p>
                <p className="text-xs text-muted-foreground">Avg Response Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">Application Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name} ({item.value})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">Weekly Activity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 87%)" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="applications" stroke="hsl(210, 80%, 52%)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="interviews" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="responses" stroke="hsl(152, 60%, 42%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">Monthly Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 87%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="applications" fill="hsl(210, 80%, 52%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="interviews" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="offers" fill="hsl(152, 60%, 42%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">Profile Match Score</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="hsl(220, 13%, 87%)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" />
                <PolarRadiusAxis tick={{ fontSize: 10 }} stroke="hsl(220, 13%, 87%)" />
                <Radar dataKey="score" stroke="hsl(38, 92%, 50%)" fill="hsl(38, 92%, 50%)" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">Performance Insights</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5 flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 shrink-0">
                <FileText className="h-4 w-4 text-success" />
              </div>
              <div>
                <h4 className="font-medium text-card-foreground text-sm">Top Performing CV</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Version 3 has the highest interview conversion rate at 40%.</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-card-foreground text-sm">Best Application Day</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Tuesday applications have a 35% higher response rate.</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10 shrink-0">
                <Target className="h-4 w-4 text-warning" />
              </div>
              <div>
                <h4 className="font-medium text-card-foreground text-sm">Industry Focus</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Automotive sector (BMW, Bosch) shows strongest match at 85%.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateAnalytics;
