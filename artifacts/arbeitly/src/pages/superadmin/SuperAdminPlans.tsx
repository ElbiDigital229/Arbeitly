import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Check, X, Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { usePricing, type Plan, type PlanFeature } from "@/context/PricingContext";

const emptyPlan = (): Omit<Plan, "id"> => ({
  name: "",
  price: "",
  priceSuffix: "",
  billing: "one time payment",
  displayPrice: "",
  totalLabel: "",
  popular: false,
  free: false,
  isActive: true,
  applicationLimit: 0,
  cvCreationLimit: 0,
  features: [{ text: "", included: true }],
});

type EditState = { open: boolean; plan: Omit<Plan, "id"> & { id?: string } };

const SuperAdminPlans = () => {
  const { plans, updatePlan, addPlan, deletePlan } = usePricing();
  const [dialog, setDialog] = useState<EditState>({ open: false, plan: emptyPlan() });

  const openAdd = () => setDialog({ open: true, plan: emptyPlan() });

  const openEdit = (plan: Plan) =>
    setDialog({ open: true, plan: { ...plan, features: plan.features.map((f) => ({ ...f })) } });

  const closeDialog = () => setDialog({ open: false, plan: emptyPlan() });

  const setField = <K extends keyof Omit<Plan, "id">>(key: K, value: Plan[K]) =>
    setDialog((prev) => ({ ...prev, plan: { ...prev.plan, [key]: value } }));

  const setFeature = (idx: number, field: keyof PlanFeature, value: string | boolean) =>
    setDialog((prev) => {
      const features = [...prev.plan.features];
      features[idx] = { ...features[idx], [field]: value };
      return { ...prev, plan: { ...prev.plan, features } };
    });

  const addFeature = () =>
    setDialog((prev) => ({
      ...prev,
      plan: { ...prev.plan, features: [...prev.plan.features, { text: "", included: true }] },
    }));

  const removeFeature = (idx: number) =>
    setDialog((prev) => ({
      ...prev,
      plan: { ...prev.plan, features: prev.plan.features.filter((_, i) => i !== idx) },
    }));

  const handleSave = () => {
    const { id, ...rest } = dialog.plan;
    // Auto-fill displayPrice and totalLabel from price if not set
    const plan = {
      ...rest,
      displayPrice: rest.displayPrice || rest.price,
      totalLabel: rest.totalLabel || rest.price,
    };
    if (id) {
      updatePlan({ ...plan, id });
    } else {
      addPlan(plan);
    }
    closeDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this plan?")) deletePlan(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Pricing Plans</h1>
          <p className="text-muted-foreground">Manage plans shown on the public pricing page</p>
        </div>
        <Button onClick={openAdd} className="rounded-full gap-2">
          <Plus className="h-4 w-4" />
          Add Plan
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {plans.map((plan) => (
          <Card key={plan.id} className={`${plan.popular ? "border-primary shadow-lg" : ""} ${!plan.isActive ? "opacity-50" : ""}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="font-display text-base uppercase tracking-wide">
                      {plan.name}
                    </CardTitle>
                    {!plan.isActive && (
                      <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">Inactive</span>
                    )}
                  </div>
                  <div className="mt-1 flex items-baseline gap-1 flex-wrap">
                    <span className="font-display text-2xl font-bold text-primary">{plan.price}</span>
                  </div>
                  {plan.priceSuffix && (
                    <p className="text-xs font-semibold text-primary">{plan.priceSuffix}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">{plan.billing}</p>
                  {plan.applicationLimit > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {plan.applicationLimit} app limit
                    </p>
                  )}
                  {plan.cvCreationLimit > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {plan.cvCreationLimit} CV builds
                    </p>
                  )}
                </div>
                {plan.popular && (
                  <span className="shrink-0 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                    Popular
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-1.5">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    {f.included ? (
                      <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0 mt-0.5" />
                    )}
                    <span className={f.included ? "text-muted-foreground" : "text-muted-foreground/50"}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 pt-2 border-t border-border">
                <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => openEdit(plan)}>
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  title={plan.isActive ? "Deactivate" : "Activate"}
                  onClick={() => updatePlan({ ...plan, isActive: !plan.isActive })}
                >
                  {plan.isActive
                    ? <ToggleRight className="h-3.5 w-3.5 text-primary" />
                    : <ToggleLeft className="h-3.5 w-3.5 text-muted-foreground" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(plan.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialog.open} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {dialog.plan.id ? "Edit Plan" : "Add New Plan"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Plan Name</Label>
                <Input
                  className="mt-1.5"
                  placeholder="e.g. Premium"
                  value={dialog.plan.name}
                  onChange={(e) => setField("name", e.target.value)}
                />
              </div>
              <div>
                <Label>Price</Label>
                <Input
                  className="mt-1.5"
                  placeholder="e.g. €499"
                  value={dialog.plan.price}
                  onChange={(e) => setField("price", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Price Suffix</Label>
                <Input
                  className="mt-1.5"
                  placeholder="e.g. + 8.5% SUCCESS FEE"
                  value={dialog.plan.priceSuffix}
                  onChange={(e) => setField("priceSuffix", e.target.value)}
                />
              </div>
              <div>
                <Label>Billing Text</Label>
                <Input
                  className="mt-1.5"
                  placeholder="e.g. one time payment"
                  value={dialog.plan.billing}
                  onChange={(e) => setField("billing", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Display Price (short)</Label>
                <Input
                  className="mt-1.5"
                  placeholder="e.g. €499 one-time"
                  value={dialog.plan.displayPrice}
                  onChange={(e) => setField("displayPrice", e.target.value)}
                />
              </div>
              <div>
                <Label>Total Label (checkout)</Label>
                <Input
                  className="mt-1.5"
                  placeholder="e.g. €499.00"
                  value={dialog.plan.totalLabel}
                  onChange={(e) => setField("totalLabel", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Application Limit</Label>
                <Input
                  className="mt-1.5"
                  type="number"
                  min={0}
                  placeholder="0 = unlimited"
                  value={dialog.plan.applicationLimit}
                  onChange={(e) => setField("applicationLimit", parseInt(e.target.value) || 0)}
                />
                <p className="text-[11px] text-muted-foreground mt-1">0 = unlimited / not applicable</p>
              </div>
              <div>
                <Label>CV Creation Limit</Label>
                <Input
                  className="mt-1.5"
                  type="number"
                  min={0}
                  placeholder="0 = unlimited"
                  value={dialog.plan.cvCreationLimit}
                  onChange={(e) => setField("cvCreationLimit", parseInt(e.target.value) || 0)}
                />
                <p className="text-[11px] text-muted-foreground mt-1">0 = unlimited (paid plans)</p>
              </div>
              <div className="flex flex-col justify-end gap-3 pb-1">
                <div className="flex items-center gap-2">
                  <Switch
                    id="isActive"
                    checked={dialog.plan.isActive}
                    onCheckedChange={(v) => setField("isActive", v)}
                  />
                  <Label htmlFor="isActive">Plan active</Label>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="popular"
                checked={dialog.plan.popular}
                onCheckedChange={(v) => setField("popular", v)}
              />
              <Label htmlFor="popular">Mark as "Most Popular"</Label>
            </div>

            <div>
              <Label className="mb-2 block">Features</Label>
              <div className="space-y-2">
                {dialog.plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Switch
                      checked={f.included}
                      onCheckedChange={(v) => setFeature(i, "included", v)}
                    />
                    <Input
                      className="flex-1"
                      placeholder="Feature description"
                      value={f.text}
                      onChange={(e) => setFeature(i, "text", e.target.value)}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeFeature(i)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-3 gap-1" onClick={addFeature}>
                <Plus className="h-3.5 w-3.5" />
                Add Feature
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSave} disabled={!dialog.plan.name || !dialog.plan.price}>
              {dialog.plan.id ? "Save Changes" : "Create Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuperAdminPlans;
