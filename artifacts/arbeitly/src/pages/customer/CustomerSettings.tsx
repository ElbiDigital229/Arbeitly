import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Check, CreditCard, ShieldCheck } from "lucide-react";

const planInfo = {
  name: "Premium",
  price: "€499",
  billing: "One-time payment",
  paidOn: "March 12, 2026",
  applications: 400,
  used: 47,
  features: [
    "400 Job applications",
    "Expert Resume / Cover Letter Review",
    "Standard Resume",
    "Standard Cover Letters",
    "1 Human Assistant",
  ],
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">{children}</h3>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <Label className="text-sm text-foreground mb-1.5 block">{label}</Label>
    {children}
  </div>
);

const CustomerSettings = () => {
  const [saved, setSaved] = useState(false);
  const usedPct = Math.round((planInfo.used / planInfo.applications) * 100);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">Settings</h1>

        <Tabs defaultValue="account">
          <TabsList className="mb-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>

          {/* ── ACCOUNT TAB ── */}
          <TabsContent value="account">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
              <div>
                <SectionLabel>Personal Information</SectionLabel>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="First Name">
                      <Input defaultValue="Max" className="mt-1.5" />
                    </Field>
                    <Field label="Last Name">
                      <Input defaultValue="Müller" className="mt-1.5" />
                    </Field>
                  </div>
                  <Field label="Email Address">
                    <Input type="email" defaultValue="max.muller@example.com" className="mt-1.5" />
                  </Field>
                  <Field label="Phone Number">
                    <Input defaultValue="+49 170 1234567" className="mt-1.5" />
                  </Field>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <SectionLabel>Change Password</SectionLabel>
                <div className="space-y-4">
                  <Field label="Current Password">
                    <Input type="password" placeholder="••••••••" className="mt-1.5" />
                  </Field>
                  <Field label="New Password">
                    <Input type="password" placeholder="••••••••" className="mt-1.5" />
                  </Field>
                  <Field label="Confirm New Password">
                    <Input type="password" placeholder="••••••••" className="mt-1.5" />
                  </Field>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} className="rounded-full px-8 gap-2">
                  {saved && <Check className="h-4 w-4" />}
                  {saved ? "Saved!" : "Save Changes"}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ── SUBSCRIPTION TAB ── */}
          <TabsContent value="subscription">
            <div className="space-y-4">
              {/* Plan card */}
              <div className="rounded-2xl border border-primary bg-card p-6 glow-accent">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Current Plan</p>
                    <h2 className="font-display text-2xl font-bold text-card-foreground">{planInfo.name}</h2>
                  </div>
                  <span className="font-display text-3xl font-bold text-primary">{planInfo.price}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  {planInfo.billing} · Paid on {planInfo.paidOn}
                </p>
                <ul className="grid grid-cols-2 gap-2 mb-4">
                  {planInfo.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-4">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  One-time payment — no recurring charges
                </div>
              </div>

              {/* Usage card */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Application Usage</p>
                <div className="flex items-baseline justify-between mb-3">
                  <p className="text-sm text-muted-foreground">
                    <span className="text-xl font-bold text-foreground">{planInfo.used}</span>{" "}
                    of {planInfo.applications} applications sent
                  </p>
                  <span className="text-sm font-semibold text-foreground">{usedPct}%</span>
                </div>
                <Progress value={usedPct} className="h-3 rounded-full" />
                <p className="mt-2 text-xs text-muted-foreground">
                  {planInfo.applications - planInfo.used} applications remaining in your package
                </p>
              </div>

              {/* Upgrade nudge */}
              <div className="rounded-2xl border border-border bg-card p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Need more applications?</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Upgrade to Ultimate for tailored applications + LinkedIn Makeover</p>
                </div>
                <Button variant="outline" className="rounded-full shrink-0 ml-4 gap-2">
                  <CreditCard className="h-4 w-4" />
                  Upgrade
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ── PROFILE TAB ── */}
          <TabsContent value="profile">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-8">
              {/* Personal */}
              <div>
                <SectionLabel>Personal Details</SectionLabel>
                <div className="space-y-4">
                  <Field label="Email Address for Applications">
                    <Input defaultValue="max.muller@example.com" className="mt-1.5" />
                  </Field>
                  <Field label="LinkedIn Profile URL">
                    <Input defaultValue="https://linkedin.com/in/maxmuller" className="mt-1.5" />
                  </Field>
                  <Field label="Phone Number">
                    <Input defaultValue="+49 170 1234567" className="mt-1.5" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Date of Birth">
                      <Input type="date" defaultValue="1993-04-15" className="mt-1.5" />
                    </Field>
                    <Field label="Place of Birth">
                      <Input defaultValue="Berlin, Germany" className="mt-1.5" />
                    </Field>
                  </div>
                  <Field label="Address">
                    <Input defaultValue="Musterstraße 12, 10115 Berlin" className="mt-1.5" />
                  </Field>
                </div>
              </div>

              {/* Professional */}
              <div className="border-t border-border pt-6">
                <SectionLabel>Professional Background</SectionLabel>
                <div className="space-y-4">
                  <Field label="Current / Last Job Title">
                    <Input defaultValue="Software Engineer" className="mt-1.5" />
                  </Field>
                  <Field label="Current / Last Employer">
                    <Input defaultValue="Siemens AG" className="mt-1.5" />
                  </Field>
                  <Field label="Current Field">
                    <Input defaultValue="Software Development" className="mt-1.5" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Years of Experience">
                      <Select defaultValue="6–10 years">
                        <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["Less than 1 year", "1–2 years", "3–5 years", "6–10 years", "10+ years"].map((v) => (
                            <SelectItem key={v} value={v}>{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Current Salary (EUR/year)">
                      <Input defaultValue="72,000" className="mt-1.5" />
                    </Field>
                  </div>
                  <Field label="Notice Period">
                    <Select defaultValue="1 month">
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Immediately available", "2 weeks", "1 month", "2 months", "3 months", "3+ months"].map((v) => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </div>

              {/* Education */}
              <div className="border-t border-border pt-6">
                <SectionLabel>Education</SectionLabel>
                <div className="space-y-4">
                  <Field label="Highest Level of Study">
                    <Select defaultValue="Master's Degree">
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["High School", "Vocational Training", "Bachelor's Degree", "Master's Degree", "PhD / Doctorate", "Other"].map((v) => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Degree Title">
                    <Input defaultValue="M.Sc. Computer Science" className="mt-1.5" />
                  </Field>
                  <Field label="University / Institute">
                    <Input defaultValue="TU Berlin" className="mt-1.5" />
                  </Field>
                </div>
              </div>

              {/* Career Goals */}
              <div className="border-t border-border pt-6">
                <SectionLabel>Career Goals</SectionLabel>
                <div className="space-y-4">
                  <Field label="Target Job Titles / Roles">
                    <Textarea defaultValue="Senior Software Engineer, Tech Lead, Engineering Manager" rows={2} className="mt-1.5" />
                  </Field>
                  <Field label="Target Industries">
                    <Textarea defaultValue="FinTech, SaaS, E-Commerce" rows={2} className="mt-1.5" />
                  </Field>
                  <Field label="Preferred Job Location">
                    <Input defaultValue="Berlin, Munich, Remote" className="mt-1.5" />
                  </Field>
                  <Field label="Preferred Salary Range (EUR/year)">
                    <Select defaultValue="€80k–€100k">
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Under €30k", "€30k–€45k", "€45k–€60k", "€60k–€80k", "€80k–€100k", "€100k+"].map((v) => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </div>

              {/* Skills */}
              <div className="border-t border-border pt-6">
                <SectionLabel>Skills & Certifications</SectionLabel>
                <div className="space-y-4">
                  <Field label="Top 5 Skills">
                    <Textarea defaultValue="React, TypeScript, Node.js, AWS, System Design" rows={2} className="mt-1.5" />
                  </Field>
                  <Field label="Certifications">
                    <Textarea defaultValue="AWS Certified Developer – Associate" rows={2} className="mt-1.5" />
                  </Field>
                </div>
              </div>

              <div className="flex justify-end border-t border-border pt-6">
                <Button onClick={handleSave} className="rounded-full px-8 gap-2">
                  {saved && <Check className="h-4 w-4" />}
                  {saved ? "Saved!" : "Save Profile"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default CustomerSettings;
