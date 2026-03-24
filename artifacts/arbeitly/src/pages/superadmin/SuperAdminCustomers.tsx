import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Search, Users, Pencil, ChevronDown, ExternalLink, UserRoundCog } from "lucide-react";
import { useCustomers, type Customer } from "@/context/CustomersContext";
import { usePricing } from "@/context/PricingContext";
import { useEmployees } from "@/context/EmployeesContext";
import { format } from "date-fns";

type EditForm = {
  fullName: string;
  email: string;
  planId: string;
  status: "active" | "pending";
};

const onboardingLabels: Record<string, string> = {
  firstName: "First Name",
  lastName: "Last Name",
  applicationEmail: "Application Email",
  phone: "Phone",
  linkedin: "LinkedIn",
  dob: "Date of Birth",
  placeOfBirth: "Place of Birth",
  address: "Address",
  currentJobTitle: "Job Title",
  currentEmployer: "Employer",
  currentField: "Field",
  yearsExperience: "Years of Experience",
  currentSalary: "Current Salary",
  workedInGermany: "Worked in Germany",
  noticePeriod: "Notice Period",
  highestStudy: "Education Level",
  degreeTitle: "Degree",
  university: "University",
  universityLocation: "University Location",
  topSkills: "Top Skills",
  certifications: "Certifications",
  careerGoal: "Career Goal",
  targetRoles: "Target Roles",
  targetIndustries: "Target Industries",
  employmentType: "Employment Type",
  preferredLocation: "Preferred Location",
  openToRelocation: "Open to Relocation",
  preferredSalary: "Preferred Salary",
  targetCompanies: "Target Companies",
  openToCareerChange: "Open to Career Change",
  germanLevel: "German Level",
  drivingLicense: "Driving License",
  transitionMotivation: "Transition Motivation",
  trainingNeeds: "Training Needs",
  howHeard: "How They Heard",
  additionalInfo: "Additional Info",
};

const SuperAdminCustomers = () => {
  const navigate = useNavigate();
  const { customers, updateCustomer } = useCustomers();
  const { plans } = usePricing();
  const { employees } = useEmployees();
  const [search, setSearch] = useState("");
  const [editDialog, setEditDialog] = useState<{ open: boolean; customer: Customer | null }>({
    open: false,
    customer: null,
  });
  const [editForm, setEditForm] = useState<EditForm>({
    fullName: "",
    email: "",
    planId: "",
    status: "active",
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.planName.toLowerCase().includes(search.toLowerCase()),
  );

  const openEdit = (c: Customer) => {
    setEditForm({ fullName: c.fullName, email: c.email, planId: c.planId, status: c.status });
    setEditDialog({ open: true, customer: c });
  };

  const saveEdit = () => {
    if (!editDialog.customer) return;
    const plan = plans.find((p) => p.id === editForm.planId);
    updateCustomer(editDialog.customer.id, {
      fullName: editForm.fullName,
      email: editForm.email,
      planId: editForm.planId,
      planName: plan?.name ?? editDialog.customer.planName,
      planPrice: plan?.totalLabel ?? plan?.price ?? editDialog.customer.planPrice,
      status: editForm.status,
    });
    setEditDialog({ open: false, customer: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Candidates</h1>
          <p className="text-muted-foreground">All candidates registered via the sign-up flow</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          {customers.length} total
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email or plan..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              {customers.length === 0
                ? "No customers yet. Sign-ups will appear here after completing registration."
                : "No customers match your search."}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((c) => (
                <Collapsible
                  key={c.id}
                  open={expandedId === c.id}
                  onOpenChange={(open) => setExpandedId(open ? c.id : null)}
                >
                  <div className="rounded-lg border border-border hover:border-border/80 transition-colors overflow-hidden">
                    {/* Row */}
                    <div className="flex items-center gap-3 px-4 py-3">
                      {(() => {
                          const assignedEmp = employees.find((e) =>
                            e.assignedCandidateIds.includes(c.id)
                          );
                          return (
                            <div className="flex-1 min-w-0 grid grid-cols-5 gap-3 items-center text-sm">
                              <div className="col-span-1">
                                <p className="font-medium text-card-foreground truncate">{c.fullName}</p>
                                <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                              </div>
                              <div className="hidden md:block">
                                <p className="font-medium text-primary text-xs">{c.planName}</p>
                                <p className="text-xs text-muted-foreground">{c.planPrice}</p>
                              </div>
                              <div className="hidden lg:block text-xs text-muted-foreground">
                                {format(new Date(c.signedUpAt), "dd MMM yyyy")}
                              </div>
                              <div>
                                <Badge
                                  variant={c.status === "active" ? "default" : "secondary"}
                                  className="capitalize text-xs"
                                >
                                  {c.status}
                                </Badge>
                              </div>
                              <div className="hidden xl:flex items-center gap-1.5 text-xs">
                                {assignedEmp ? (
                                  <>
                                    <UserRoundCog className="h-3.5 w-3.5 text-primary shrink-0" />
                                    <span className="font-medium text-foreground truncate">{assignedEmp.fullName}</span>
                                  </>
                                ) : (
                                  <span className="text-muted-foreground italic">Unassigned</span>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 gap-1.5 text-xs"
                          onClick={() => navigate(`/superadmin/customers/${c.id}`)}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 gap-1.5 text-xs"
                          onClick={() => openEdit(c)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <CollapsibleTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-8 gap-1 text-xs">
                            <ChevronDown
                              className={`h-3.5 w-3.5 transition-transform ${expandedId === c.id ? "rotate-180" : ""}`}
                            />
                            Profile
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>

                    {/* Expanded profile */}
                    <CollapsibleContent>
                      <div className="border-t border-border px-4 py-4 bg-muted/20">
                        {c.planType === "free" ? (
                          <>
                            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                              Marketing Questions
                            </p>
                            {c.onboarding?.currentField || c.onboarding?.preferredLocation || c.onboarding?.howHeard ? (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                                {c.onboarding.currentField && (
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">Industry</p>
                                    <p className="text-sm text-card-foreground mt-0.5">{c.onboarding.currentField}</p>
                                  </div>
                                )}
                                {c.onboarding.preferredLocation && (
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">Target Country</p>
                                    <p className="text-sm text-card-foreground mt-0.5">{c.onboarding.preferredLocation}</p>
                                  </div>
                                )}
                                {c.onboarding.howHeard && (
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">How They Heard</p>
                                    <p className="text-sm text-card-foreground mt-0.5">{c.onboarding.howHeard}</p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">
                                Marketing questions not yet answered.
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                              Onboarding Profile
                            </p>
                            {c.onboarding && Object.keys(c.onboarding).length > 0 ? (
                              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-3">
                                {(Object.entries(c.onboarding) as [string, string][])
                                  .filter(([, v]) => v)
                                  .map(([key, value]) => (
                                    <div key={key}>
                                      <p className="text-xs font-medium text-muted-foreground">
                                        {onboardingLabels[key] ?? key}
                                      </p>
                                      <p className="text-sm text-card-foreground mt-0.5 break-words">{value}</p>
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">
                                This customer has not completed onboarding yet.
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(o) => !o && setEditDialog({ open: false, customer: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Customer</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label>Full Name</Label>
              <Input
                className="mt-1.5"
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                className="mt-1.5"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Plan</Label>
              <Select value={editForm.planId} onValueChange={(v) => setEditForm({ ...editForm, planId: v })}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select plan…" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} — {p.price}{p.priceSuffix ? ` ${p.priceSuffix}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(v) => setEditForm({ ...editForm, status: v as "active" | "pending" })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog({ open: false, customer: null })}>
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={!editForm.fullName || !editForm.email}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuperAdminCustomers;
