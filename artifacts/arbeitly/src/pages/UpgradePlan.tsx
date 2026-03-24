import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import logo from "@/assets/logo.png";
import { usePricing } from "@/context/PricingContext";
import { useCustomers } from "@/context/CustomersContext";

const UpgradePlan = () => {
  const navigate = useNavigate();
  const { plans } = usePricing();
  const { currentCustomer } = useCustomers();

  useEffect(() => {
    if (!currentCustomer) navigate("/candidate/login");
  }, [currentCustomer, navigate]);

  // Only show paid plans
  const paidPlans = plans.filter((p) => !p.free);

  const handleSelect = (planId: string) => {
    // Store intent so Payment.tsx knows this is an upgrade (not new registration)
    sessionStorage.setItem("arbeitly_upgrade_plan", planId);
    navigate(`/payment?plan=${planId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card px-6 h-14 flex items-center justify-between">
        <Link to="/candidate/portal">
          <img src={logo} alt="Arbeitly" className="h-7" />
        </Link>
        <Link to="/candidate/portal" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to portal
        </Link>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Upgrade</p>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Choose a plan, {currentCustomer?.fullName.split(" ")[0]}
          </h1>
          <p className="mt-3 text-muted-foreground">
            You're currently on the <span className="text-primary font-medium">Free</span> plan.
            Upgrade to unlock full onboarding, human assistance, and more.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {paidPlans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.popular
                  ? "border-primary bg-card shadow-xl scale-105"
                  : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-display text-base font-bold text-card-foreground">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold text-foreground">{plan.price}</span>
                </div>
                {plan.priceSuffix && (
                  <p className="text-xs font-semibold text-primary mt-0.5">{plan.priceSuffix}</p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">{plan.billing}</p>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f.text} className={`flex items-start gap-2 text-xs ${f.included ? "text-muted-foreground" : "text-muted-foreground/40 line-through"}`}>
                    <Check className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${f.included ? "text-primary" : "text-muted-foreground/30"}`} />
                    {f.text}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full rounded-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleSelect(plan.id)}
              >
                Select {plan.name}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpgradePlan;
