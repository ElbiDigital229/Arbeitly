import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, TrendingUp, DollarSign, BarChart3, Activity } from "lucide-react";
import { useCustomers } from "@/context/CustomersContext";
import { useEmployees } from "@/context/EmployeesContext";
import { useTransactions } from "@/context/TransactionsContext";

export default function SuperAdminAnalytics() {
  const { customers } = useCustomers();
  const { employees } = useEmployees();
  const { transactions } = useTransactions();

  const totalRevenue = transactions.filter((t) => t.status === "paid").reduce((sum, t) => {
    const n = parseFloat(t.amount.replace(/[^0-9.]/g, ""));
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  const paidCustomers = customers.filter((c) => c.planType === "paid");
  const freeCustomers = customers.filter((c) => c.planType === "free");
  const activeCustomers = customers.filter((c) => c.status === "active");

  // Applications submitted (aggregated from customer data)
  const totalAppsUsed = customers.reduce((sum, c) => sum + (c.applicationsUsed ?? 0), 0);
  const totalAppQuota = customers.reduce((sum, c) => sum + (c.applicationQuota ?? 0), 0);

  // Per-plan breakdown
  const planBreakdown = customers.reduce<Record<string, number>>((acc, c) => {
    const plan = c.planName ?? "Unknown";
    acc[plan] = (acc[plan] ?? 0) + 1;
    return acc;
  }, {});

  // Monthly transactions (last 6 months)
  const now = new Date();
  const months: { label: string; revenue: number; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
    const monthTxs = transactions.filter((t) => {
      const td = new Date(t.date);
      return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth() && t.status === "paid";
    });
    const revenue = monthTxs.reduce((sum, t) => {
      const n = parseFloat(t.amount.replace(/[^0-9.]/g, ""));
      return sum + (isNaN(n) ? 0 : n);
    }, 0);
    months.push({ label, revenue, count: monthTxs.length });
  }

  const maxRevenue = Math.max(...months.map((m) => m.revenue), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Platform-wide metrics and performance overview</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Card><CardContent className="p-5">
          <div className="flex items-center gap-2 mb-2"><Users className="h-4 w-4 text-muted-foreground" /><p className="text-xs text-muted-foreground">Total Customers</p></div>
          <p className="font-display text-3xl font-bold">{customers.length}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="default" className="text-[10px]">{paidCustomers.length} paid</Badge>
            <Badge variant="secondary" className="text-[10px]">{freeCustomers.length} free</Badge>
          </div>
        </CardContent></Card>

        <Card><CardContent className="p-5">
          <div className="flex items-center gap-2 mb-2"><Activity className="h-4 w-4 text-muted-foreground" /><p className="text-xs text-muted-foreground">Active Customers</p></div>
          <p className="font-display text-3xl font-bold">{activeCustomers.length}</p>
          <p className="text-xs text-muted-foreground mt-2">{Math.round((activeCustomers.length / Math.max(customers.length, 1)) * 100)}% active rate</p>
        </CardContent></Card>

        <Card><CardContent className="p-5">
          <div className="flex items-center gap-2 mb-2"><DollarSign className="h-4 w-4 text-muted-foreground" /><p className="text-xs text-muted-foreground">Total Revenue</p></div>
          <p className="font-display text-3xl font-bold text-primary">€{totalRevenue.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-muted-foreground mt-2">{transactions.filter((t) => t.status === "paid").length} transactions</p>
        </CardContent></Card>

        <Card><CardContent className="p-5">
          <div className="flex items-center gap-2 mb-2"><Briefcase className="h-4 w-4 text-muted-foreground" /><p className="text-xs text-muted-foreground">Apps Submitted</p></div>
          <p className="font-display text-3xl font-bold">{totalAppsUsed}</p>
          <p className="text-xs text-muted-foreground mt-2">of {totalAppQuota} total quota</p>
        </CardContent></Card>
      </div>

      {/* Revenue chart (bar) */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Monthly Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 h-40">
            {months.map((m) => (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                <p className="text-[10px] text-muted-foreground font-medium">€{m.revenue.toFixed(0)}</p>
                <div className="w-full rounded-t overflow-hidden bg-secondary relative" style={{ height: "100px" }}>
                  <div
                    className="absolute bottom-0 w-full bg-primary rounded-t transition-all"
                    style={{ height: `${Math.max(4, (m.revenue / maxRevenue) * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {/* Plan breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Customers by Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(planBreakdown).sort((a, b) => b[1] - a[1]).map(([plan, count]) => (
                <div key={plan} className="flex items-center gap-3">
                  <p className="text-sm font-medium text-card-foreground w-28 truncate">{plan}</p>
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(count / Math.max(customers.length, 1)) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground w-6 text-right">{count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Employee load */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">Employee Workload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employees.map((e) => {
                const load = e.assignedCandidateIds.length;
                const maxLoad = 10;
                return (
                  <div key={e.id} className="flex items-center gap-3">
                    <p className="text-sm font-medium text-card-foreground w-28 truncate">{e.fullName}</p>
                    <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${(load / maxLoad) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground w-6 text-right">{load}</p>
                  </div>
                );
              })}
              {employees.length === 0 && <p className="text-sm text-muted-foreground">No employees yet</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
