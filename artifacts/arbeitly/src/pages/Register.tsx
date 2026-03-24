import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import logo from "@/assets/logo.png";
import { usePricing } from "@/context/PricingContext";
import { useCustomers } from "@/context/CustomersContext";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { plans } = usePricing();
  const { addCustomer, loginDirect } = useCustomers();

  const planParam = searchParams.get("plan") || "premium";
  const plan = plans.find((p) => p.id === planParam) ?? plans[0];
  const planName = plan?.name ?? planParam;
  const isFree = plan?.free === true;

  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isFree) {
      // Free plan: create account immediately, skip payment
      const newCustomer = addCustomer({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        planId: plan.id,
        planName: plan.name,
        planPrice: plan.price,
        planType: "free",
        status: "active",
      });
      loginDirect(newCustomer);
      navigate("/onboarding/simple");
    } else {
      // Paid plan: save to sessionStorage and go to payment
      sessionStorage.setItem(
        "arbeitly_register",
        JSON.stringify({ fullName: form.fullName, email: form.email, password: form.password }),
      );
      navigate(`/payment?plan=${planParam}`);
    }
  };

  if (!plan) return null;

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-radial items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-6">
            {isFree ? "Step 1 of 2 — Create Account" : "Step 1 of 3 — Create Account"}
          </p>
          <h2 className="font-display text-4xl font-bold text-foreground">
            You've chosen the{" "}
            <span className="text-gradient">{planName}</span> plan
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            {isFree
              ? "Create your account and start tracking your job search for free."
              : "Create your account to continue. Payment details come next."}
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-card/60 backdrop-blur p-6">
            <div className="flex items-baseline justify-between mb-4">
              <span className="font-display text-lg font-bold text-card-foreground">{planName}</span>
              <span className="font-display text-sm font-bold text-primary">
                {plan.displayPrice || plan.price}
                {plan.priceSuffix ? ` ${plan.priceSuffix}` : ""}
              </span>
            </div>
            <ul className="space-y-2">
              {plan.features
                .filter((f) => f.included)
                .map((f) => (
                  <li key={f.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {f.text}
                  </li>
                ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Link to="/pricing" className="flex items-center gap-2 mb-8">
            <img src={logo} alt="Arbeitly" className="h-8" />
          </Link>

          <h1 className="font-display text-2xl font-bold text-foreground">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Fill in your details to get started</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Max Müller"
                className="mt-1.5"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1.5"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-1.5"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="mt-1.5"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
            </div>
            <Button className="w-full rounded-full mt-2" type="submit">
              {isFree ? "Create Free Account" : "Continue to Payment"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Want a different plan?{" "}
            <Link to="/pricing" className="font-medium text-primary hover:underline">Go back</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
