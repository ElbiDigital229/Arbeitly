import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  User, CreditCard, Calendar, Mail, CheckCircle, Clock, BarChart2, KeyRound,
  Info, Shield, ClipboardList, CheckCircle2,
} from "lucide-react";
import { useCustomers } from "@/context/CustomersContext";
import { useAuditLog, type AuditAction, type AuditUserType } from "@/context/AuditLogContext";
import { format } from "date-fns";
import { Link, useSearchParams } from "react-router-dom";

type Tab = "profile" | "settings" | "activity";

const actionLabels: Record<AuditAction, string> = {
  candidate_signed_up: "Signed up", candidate_assigned: "Assigned to advisor", candidate_reassigned: "Reassigned",
  prompt_limit_bumped: "AI limit updated", application_added: "Application added",
  application_status_changed: "Status updated", application_deleted: "Application removed",
  cv_version_created: "CV version created", cv_variant_created: "CV variant created", cv_enhanced: "CV enhanced by AI",
  cl_version_created: "Cover letter version saved", cl_variant_created: "Cover letter variant saved", cl_enhanced: "Cover letter enhanced",
  faq_item_added: "FAQ item prepared", faq_item_edited: "FAQ item updated", faq_item_deleted: "FAQ item removed",
  faq_item_approved: "FAQ item approved", faq_item_unverified: "FAQ item unverified", faq_candidate_override: "FAQ answer overridden",
  job_added_to_queue: "Job added to applications", job_skipped: "Job skipped", employee_account_created: "Account created",
  candidate_viewed_as_employee: "Profile viewed", csv_imported: "Applications imported", csv_exported: "Applications exported",
};

const userTypeDotColors: Record<AuditUserType, string> = {
  candidate: "bg-blue-400", employee: "bg-primary", superadmin: "bg-purple-400",
};

const formatTs = (iso: string) => {
  try { return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
  catch { return iso; }
};

const CandidateProfile = () => {
  const { currentCustomer, updateCustomer } = useCustomers();
  const { getForCandidate } = useAuditLog();
  const [searchParams] = useSearchParams();

  const initialTab: Tab = (searchParams.get("tab") as Tab) ?? "profile";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  // Settings state
  const firstName = currentCustomer?.fullName.split(" ")[0] ?? "";
  const lastName  = currentCustomer?.fullName.split(" ").slice(1).join(" ") ?? "";
  const [profile, setProfile] = useState({ firstName, lastName, email: currentCustomer?.email ?? "" });
  const [profileSaved, setProfileSaved] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif]   = useState(true);
  const [smsNotif, setSmsNotif]     = useState(false);

  if (!currentCustomer) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p>Please <Link to="/candidate/login" className="text-primary underline">sign in</Link> to view your profile.</p>
      </div>
    );
  }

  const isPaid = currentCustomer.planType === "paid";
  const applicationsUsed = currentCustomer.applicationsUsed ?? 0;
  const applicationQuota = currentCustomer.applicationQuota ?? 0;
  const quotaPct = applicationQuota > 0 ? Math.min(100, (applicationsUsed / applicationQuota) * 100) : 0;
  const quotaColor = quotaPct >= 90 ? "bg-destructive" : quotaPct >= 70 ? "bg-yellow-400" : "bg-primary";

  const hasOnboarding = isPaid && currentCustomer.onboarding && Object.values(currentCustomer.onboarding).some((v) => v);
  const hasMarketing = currentCustomer.marketingData && Object.values(currentCustomer.marketingData).some((v) => v);

  const initials = currentCustomer.fullName
    .split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const myActivity = getForCandidate(currentCustomer.id);

  const handleProfileSave = () => {
    const fullName = `${profile.firstName.trim()} ${profile.lastName.trim()}`.trim();
    updateCustomer(currentCustomer.id, { fullName, email: profile.email.trim() });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handlePasswordSave = () => {
    setPwError("");
    if (pw.current !== currentCustomer.password) { setPwError("Current password is incorrect."); return; }
    if (pw.next.length < 6) { setPwError("New password must be at least 6 characters."); return; }
    if (pw.next !== pw.confirm) { setPwError("New passwords do not match."); return; }
    updateCustomer(currentCustomer.id, { password: pw.next });
    setPw({ current: "", next: "", confirm: "" });
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 3000);
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: "profile",  label: "Profile"   },
    { id: "settings", label: "Settings"  },
    { id: "activity", label: `Activity${myActivity.length > 0 ? ` (${myActivity.length})` : ""}` },
  ];

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">My Account</h1>
        <p className="text-muted-foreground">Profile, settings, and activity</p>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 rounded-lg border border-border p-1 w-fit">
        {TABS.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "secondary" : "ghost"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* ── Profile tab ── */}
      {activeTab === "profile" && (
        <>
          {/* Avatar + name */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-xl font-bold shrink-0">
                  {initials}
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-card-foreground">{currentCustomer.fullName}</h2>
                  <p className="text-sm text-muted-foreground">{currentCustomer.email}</p>
                  <Badge variant={currentCustomer.status === "active" ? "default" : "secondary"} className="mt-1.5 capitalize">
                    {currentCustomer.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account details */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-base flex items-center gap-2">
                <User className="h-4 w-4" /> Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-card-foreground">{currentCustomer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="font-medium text-card-foreground">
                    {format(new Date(currentCustomer.signedUpAt), "dd MMMM yyyy")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Your Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-lg font-bold text-primary">{currentCustomer.planName}</p>
                  <p className="text-sm text-muted-foreground">{currentCustomer.planPrice}</p>
                </div>
                <Badge variant="default" className="text-xs">Active</Badge>
              </div>
            </CardContent>
          </Card>

          {/* CV Usage — free users only */}
          {!isPaid && (currentCustomer.cvCreationLimit ?? 0) > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-base flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" /> CV Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* CV Builds */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">CV Builds used</span>
                    <span className="font-semibold text-card-foreground tabular-nums">
                      {currentCustomer.cvCreationsUsed ?? 0} / {currentCustomer.cvCreationLimit}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        (currentCustomer.cvCreationsUsed ?? 0) >= (currentCustomer.cvCreationLimit ?? 10)
                          ? "bg-destructive"
                          : (currentCustomer.cvCreationsUsed ?? 0) / (currentCustomer.cvCreationLimit ?? 10) >= 0.7
                          ? "bg-yellow-400"
                          : "bg-primary"
                      }`}
                      style={{ width: `${Math.min(100, ((currentCustomer.cvCreationsUsed ?? 0) / (currentCustomer.cvCreationLimit ?? 10)) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(currentCustomer.cvCreationLimit ?? 0) - (currentCustomer.cvCreationsUsed ?? 0)} builds remaining
                  </p>
                </div>
                {/* PDF Exports */}
                {(currentCustomer.cvExportLimit ?? 0) > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">PDF Exports used</span>
                      <span className="font-semibold text-card-foreground tabular-nums">
                        {currentCustomer.cvExportsUsed ?? 0} / {currentCustomer.cvExportLimit}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          (currentCustomer.cvExportsUsed ?? 0) >= (currentCustomer.cvExportLimit ?? 10)
                            ? "bg-destructive"
                            : (currentCustomer.cvExportsUsed ?? 0) / (currentCustomer.cvExportLimit ?? 10) >= 0.7
                            ? "bg-yellow-400"
                            : "bg-primary"
                        }`}
                        style={{ width: `${Math.min(100, ((currentCustomer.cvExportsUsed ?? 0) / (currentCustomer.cvExportLimit ?? 10)) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {(currentCustomer.cvExportLimit ?? 0) - (currentCustomer.cvExportsUsed ?? 0)} exports remaining
                    </p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground border-t border-border pt-3">
                  Limits reset on plan upgrade. <span className="text-primary cursor-pointer">Upgrade to remove limits →</span>
                </p>
              </CardContent>
            </Card>
          )}

          {/* Application Quota — paid only */}
          {isPaid && applicationQuota > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-base flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" /> Application Quota
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Applications submitted</span>
                  <span className="font-semibold text-card-foreground tabular-nums">{applicationsUsed} / {applicationQuota}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${quotaColor}`} style={{ width: `${quotaPct}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {applicationQuota - applicationsUsed} applications remaining.
                  {quotaPct >= 90 && <span className="text-destructive font-medium"> Running low — consider upgrading.</span>}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Dummy credentials — paid only */}
          {isPaid && currentCustomer.dummyEmail && (
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-base flex items-center gap-2">
                  <KeyRound className="h-4 w-4" /> Application Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">Your advisor uses these credentials to submit applications on your behalf.</p>
                <div className="rounded-lg border border-border bg-secondary/40 p-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-mono text-xs font-medium text-card-foreground">{currentCustomer.dummyEmail}</span>
                  </div>
                  {currentCustomer.dummyPassword && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Password</span>
                      <span className="font-mono text-xs font-medium text-card-foreground">{currentCustomer.dummyPassword}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Signup Info — free users only */}
          {!isPaid && hasMarketing && (
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-base flex items-center gap-2">
                  <Info className="h-4 w-4" /> Signup Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground mb-3">Responses you gave when you signed up.</p>
                {currentCustomer.marketingData?.industry && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Industry</span>
                    <span className="font-medium text-card-foreground">{currentCustomer.marketingData.industry}</span>
                  </div>
                )}
                {currentCustomer.marketingData?.targetCountry && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Target Country</span>
                    <span className="font-medium text-card-foreground">{currentCustomer.marketingData.targetCountry}</span>
                  </div>
                )}
                {currentCustomer.marketingData?.howHeard && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">How you heard about us</span>
                    <span className="font-medium text-card-foreground">{currentCustomer.marketingData.howHeard}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Onboarding status — paid users only */}
          {isPaid && (
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-base flex items-center gap-2">
                  {hasOnboarding
                    ? <CheckCircle className="h-4 w-4 text-green-500" />
                    : <Clock className="h-4 w-4 text-yellow-500" />}
                  Onboarding Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasOnboarding ? (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Your profile is complete.</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/candidate/onboarding">View Answers</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Complete your onboarding to help us find the best jobs for you.</p>
                    <Button size="sm" asChild>
                      <Link to="/onboarding">Complete Now</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* ── Settings tab ── */}
      {activeTab === "settings" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input className="mt-1.5" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input className="mt-1.5" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" className="mt-1.5" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={handleProfileSave}>Save Changes</Button>
                {profileSaved && (
                  <span className="flex items-center gap-1 text-sm text-green-500">
                    <CheckCircle2 className="h-4 w-4" /> Saved
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display">Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Current Password</Label>
                <Input type="password" className="mt-1.5" placeholder="••••••••" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
              </div>
              <div>
                <Label>New Password</Label>
                <Input type="password" className="mt-1.5" placeholder="••••••••" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input type="password" className="mt-1.5" placeholder="••••••••" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
              </div>
              {pwError && <p className="text-sm text-destructive">{pwError}</p>}
              <div className="flex items-center gap-3">
                <Button onClick={handlePasswordSave} disabled={!pw.current || !pw.next || !pw.confirm}>
                  Update Password
                </Button>
                {pwSaved && (
                  <span className="flex items-center gap-1 text-sm text-green-500">
                    <CheckCircle2 className="h-4 w-4" /> Password updated
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display">Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="mt-1.5 w-[200px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-card-foreground">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive updates about your applications via email</p>
                </div>
                <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-card-foreground">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Get real-time browser notifications</p>
                </div>
                <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-card-foreground">SMS Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive text messages for important updates</p>
                </div>
                <Switch checked={smsNotif} onCheckedChange={setSmsNotif} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display">Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary">
                <Shield className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">Your data is secure</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    All personal data is encrypted and stored securely. You can request a full data export or account deletion at any time by contacting support.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* ── Activity tab ── */}
      {activeTab === "activity" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" /> My Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {myActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
                <ClipboardList className="h-8 w-8 opacity-20" />
                <p className="text-sm">No activity recorded yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {myActivity.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 px-5 py-3 hover:bg-secondary/20 transition-colors">
                    <div className="mt-1.5">
                      <div className={`h-2 w-2 rounded-full shrink-0 ${userTypeDotColors[entry.userType]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-card-foreground">{entry.userName}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-foreground/80">{actionLabels[entry.action] ?? entry.action}</span>
                      </div>
                      {entry.detail && <p className="text-xs text-muted-foreground mt-0.5">{entry.detail}</p>}
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 shrink-0 whitespace-nowrap pt-0.5">{formatTs(entry.timestamp)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CandidateProfile;
