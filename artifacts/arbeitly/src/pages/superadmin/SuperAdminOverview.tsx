import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users, CreditCard, TrendingUp, Activity,
  DollarSign, Briefcase, BarChart3, UserRoundCog,
} from "lucide-react";
import { useCustomers } from "@/context/CustomersContext";
import { useEmployees } from "@/context/EmployeesContext";
import { usePricing } from "@/context/PricingContext";
import { useTransactions } from "@/context/TransactionsContext";
import { format } from "date-fns";

const SuperAdminOverview = () => {
  const { customers } = useCustomers();
  const { employees } = useEmployees();
  const { plans } = usePricing();
  const { transactions } = useTransactions();

  // ── Computed values ──────────────────────────────────────────────────────────
  const paidCustomers = customers.filter((c) => c.planType === "paid");
  const freeCustomers = customers.filter((c) => c.planType === "free");
  const activeCustomers = customers.filter((c) => c.status === "active");

  const newThisMonth = customers.filter((c) => {
    const d = new Date(c.signedUpAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const totalRevenue = transactions
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => {
      const n = parseFloat(t.amount.replace(/[^0-9.]/g, ""));
      return sum + (isNaN(n) ? 0 : n);
    }, 0);

  const totalAppsUsed = customers.reduce((sum, c) => sum + (c.applicationsUsed ?? 0), 0);
  const totalAppQuota = customers.reduce((sum, c) => sum + (c.applicationQuota ?? 0), 0);

  const planBreakdown = customers.reduce<Record<string, number>>((acc, c) => {
    const plan = c.planName ?? "Unknown";
    acc[plan] = (acc[plan] ?? 0) + 1;
    return acc;
  }, {});

  // Monthly revenue (last 6 months)
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
    const monthTxs = transactions.filter((t) => {
      const td = new Date(t.date);
      return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth() && t.status === "paid";
    });
    const revenue = monthTxs.reduce((sum, t) => {
      const n = parseFloat(t.amount.replace(/[^0-9.]/g, ""));
      return sum + (isNaN(n) ? 0 : n);
    }, 0);
    return { label, revenue, count: monthTxs.length };
  });
  const maxRevenue = Math.max(...months.map((m) => m.revenue), 1);

  const recentCustomers = [...customers]
    .sort((a, b) => new Date(b.signedUpAt).getTime() - new Date(a.signedUpAt).getTime())
    .slice(0, 6);

  // ── KPI cards ──────────────────────────────────────────────────────────────
  const kpis = [
    {
      label: "Total Candidates",
      value: customers.length,
      icon: Users,
      sub: (
        <div className="flex gap-2 mt-2">
          <Badge variant="default" className="text-[10px]">{paidCustomers.length} paid</Badge>
          <Badge variant="secondary" className="text-[10px]">{freeCustomers.length} free</Badge>
        </div>
      ),
    },
    {
      label: "Active Customers",
      value: activeCustomers.length,
      icon: Activity,
      sub: <p className="text-xs text-muted-foreground mt-2">{Math.round((activeCustomers.length / Math.max(customers.length, 1)) * 100)}% active rate</p>,
    },
    {
      label: "New This Month",
      value: newThisMonth,
      icon: TrendingUp,
      sub: <p className="text-xs text-muted-foreground mt-2">vs all time: {customers.length}</p>,
    },
    {
      label: "Total Revenue",
      value: `€${totalRevenue.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      valueClass: "text-primary",
      sub: <p className="text-xs text-muted-foreground mt-2">{transactions.filter((t) => t.status === "paid").length} transactions</p>,
    },
    {
      label: "Apps Submitted",
      value: totalAppsUsed,
      icon: Briefcase,
      sub: <p className="text-xs text-muted-foreground mt-2">of {totalAppQuota} total quota</p>,
    },
    {
      label: "Active Plans",
      value: plans.filter((p) => p.isActive).length,
      icon: CreditCard,
      sub: <p className="text-xs text-muted-foreground mt-2">{plans.length} total plans</p>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground">Platform summary, metrics and recent activity</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </div>
              <p className={`font-display text-3xl font-bold ${kpi.valueClass ?? ""}`}>{kpi.value}</p>
              {kpi.sub}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue chart — full width */}
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
                <p className="text-[10px] text-muted-foreground font-medium">
                  {m.revenue > 0 ? `€${m.revenue.toFixed(0)}` : "—"}
                </p>
                <div className="w-full rounded-t overflow-hidden bg-secondary relative" style={{ height: "100px" }}>
                  <div
                    className="absolute bottom-0 w-full bg-primary rounded-t transition-all"
                    style={{ height: `${Math.max(m.revenue > 0 ? 4 : 0, (m.revenue / maxRevenue) * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom row: Recent signups | Plan breakdown | Employee workload */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Recent Signups */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-sm">Recent Signups</CardTitle>
          </CardHeader>
          <CardContent>
            {recentCustomers.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No candidates yet.</p>
            ) : (
              <div className="space-y-3">
                {recentCustomers.map((c) => (
                  <div key={c.id} className="flex items-start justify-between gap-2 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium text-card-foreground truncate">{c.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium text-primary">{c.planName}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(c.signedUpAt), "dd MMM")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customers by Plan */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> By Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(planBreakdown).length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No data yet.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(planBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([plan, count]) => (
                    <div key={plan} className="flex items-center gap-3">
                      <p className="text-xs font-medium text-card-foreground w-20 truncate">{plan}</p>
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${(count / Math.max(customers.length, 1)) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground w-5 text-right">{count}</p>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employee Workload */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-sm flex items-center gap-2">
              <UserRoundCog className="h-4 w-4" /> Employee Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            {employees.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No employees yet.</p>
            ) : (
              <div className="space-y-3">
                {employees.map((e) => {
                  const load = e.assignedCandidateIds.length;
                  const maxLoad = 10;
                  return (
                    <div key={e.id} className="flex items-center gap-3">
                      <p className="text-xs font-medium text-card-foreground w-20 truncate">{e.fullName}</p>
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${(load / maxLoad) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground w-5 text-right">{load}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default SuperAdminOverview;
