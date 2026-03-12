import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const monthlyData = [
  { month: "Oct", applications: 4 },
  { month: "Nov", applications: 7 },
  { month: "Dec", applications: 3 },
  { month: "Jan", applications: 8 },
  { month: "Feb", applications: 10 },
  { month: "Mar", applications: 6 },
];

const statusData = [
  { name: "Applied", value: 12, color: "hsl(210, 80%, 52%)" },
  { name: "Interview", value: 6, color: "hsl(38, 92%, 50%)" },
  { name: "Rejected", value: 4, color: "hsl(0, 72%, 51%)" },
  { name: "Offer", value: 2, color: "hsl(152, 60%, 42%)" },
];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Insights into your job search performance</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">Applications Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 87%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <Tooltip />
                <Bar dataKey="applications" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">Status Breakdown</CardTitle>
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
            <div className="flex justify-center gap-4 mt-2">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 text-center">
            <p className="font-display text-3xl font-bold text-card-foreground">24</p>
            <p className="text-sm text-muted-foreground mt-1">Total Applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <p className="font-display text-3xl font-bold text-card-foreground">18</p>
            <p className="text-sm text-muted-foreground mt-1">Documents Generated</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <p className="font-display text-3xl font-bold text-card-foreground">33%</p>
            <p className="text-sm text-muted-foreground mt-1">Interview Rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
