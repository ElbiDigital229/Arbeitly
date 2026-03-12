import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  CalendarCheck,
  TrendingUp,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  Linkedin,
  Globe,
} from "lucide-react";

const statCards = [
  { label: "Applications Sent", value: "47", sub: "of 400 total", icon: Send, color: "text-primary" },
  { label: "Interviews Booked", value: "5", sub: "this month", icon: CalendarCheck, color: "text-[hsl(152_60%_42%)]" },
  { label: "Response Rate", value: "14.9%", sub: "industry avg: 8%", icon: TrendingUp, color: "text-[hsl(38_92%_50%)]" },
  { label: "Offers Received", value: "1", sub: "keep it up!", icon: Trophy, color: "text-primary" },
];

const recentActivity = [
  { type: "applied", company: "SAP SE", role: "Product Manager", date: "Mar 10", platform: "LinkedIn" },
  { type: "interview", company: "HelloFresh", role: "Marketing Manager", date: "Mar 9", platform: "Indeed" },
  { type: "reviewing", company: "Zalando", role: "Senior Frontend Developer", date: "Mar 8", platform: "LinkedIn" },
  { type: "rejected", company: "Delivery Hero", role: "Full Stack Developer", date: "Mar 7", platform: "LinkedIn" },
  { type: "applied", company: "N26", role: "Backend Engineer", date: "Mar 6", platform: "LinkedIn" },
  { type: "applied", company: "Siemens AG", role: "UX Designer", date: "Mar 5", platform: "XING" },
];

const platforms = [
  { name: "LinkedIn", count: 28, pct: 60 },
  { name: "Indeed", count: 12, pct: 25 },
  { name: "XING", count: 7, pct: 15 },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  applied: { label: "Applied", color: "bg-primary/10 text-primary border-primary/20", icon: Send },
  reviewing: { label: "Reviewing", color: "bg-[hsl(210_80%_52%/0.1)] text-[hsl(210_80%_52%)] border-[hsl(210_80%_52%/0.2)]", icon: Clock },
  interview: { label: "Interview", color: "bg-[hsl(38_92%_50%/0.1)] text-[hsl(38_92%_50%)] border-[hsl(38_92%_50%/0.2)]", icon: CalendarCheck },
  rejected: { label: "Rejected", color: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
  offer: { label: "Offer", color: "bg-[hsl(152_60%_42%/0.1)] text-[hsl(152_60%_42%)] border-[hsl(152_60%_42%/0.2)]", icon: CheckCircle },
};

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

const CustomerDashboard = () => {
  const pct = Math.round((47 / 400) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Usage banner */}
      <motion.div {...fade(0)} className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Premium Plan</p>
            <h2 className="font-display text-xl font-bold text-card-foreground">Application Usage</h2>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="text-foreground font-semibold">47</span> of{" "}
              <span className="text-foreground font-semibold">400</span> applications sent
            </p>
          </div>
          <span className="font-display text-3xl font-bold text-primary">{pct}%</span>
        </div>
        <Progress value={pct} className="h-3 rounded-full" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>0 used</span>
          <span>353 remaining</span>
          <span>400 total</span>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            {...fade(0.1 + i * 0.05)}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <p className={`font-display text-3xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div {...fade(0.3)} className="md:col-span-2 rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-bold text-card-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((item, i) => {
              const cfg = statusConfig[item.type];
              const Icon = cfg.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border ${cfg.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-medium truncate">{item.role}</p>
                    <p className="text-xs text-muted-foreground">{item.company} · {item.platform}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Platform Breakdown */}
        <motion.div {...fade(0.35)} className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-bold text-card-foreground mb-4">Platforms Used</h3>
          <div className="space-y-4">
            {platforms.map((p) => (
              <div key={p.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-foreground font-medium">{p.name}</span>
                  <span className="text-muted-foreground">{p.count} applications</span>
                </div>
                <Progress value={p.pct} className="h-2 rounded-full" />
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-3">Status Overview</p>
            <div className="space-y-2">
              {[
                { label: "Applied", count: 24, type: "applied" },
                { label: "Reviewing", count: 15, type: "reviewing" },
                { label: "Interviews", count: 5, type: "interview" },
                { label: "Rejected", count: 2, type: "rejected" },
                { label: "Offers", count: 1, type: "offer" },
              ].map((s) => {
                const cfg = statusConfig[s.type];
                return (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${cfg.color.split(" ")[1]}`}>{s.label}</span>
                    <span className="text-xs text-muted-foreground font-medium">{s.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
