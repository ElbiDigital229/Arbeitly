import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Lock, ShieldCheck, RotateCcw, CreditCard } from "lucide-react";
import logo from "@/assets/logo.png";

const planDetails: Record<string, { features: string[]; price: string; billing: string }> = {
  starter: {
    price: "€19",
    billing: "€19.00 billed monthly",
    features: ["5 CV optimizations/month", "10 Cover letters/month", "Basic job matching", "Application tracking"],
  },
  professional: {
    price: "€49",
    billing: "€49.00 billed monthly",
    features: ["Unlimited CV optimizations", "Unlimited cover letters", "Advanced job matching", "Analytics dashboard"],
  },
  enterprise: {
    price: "€99",
    billing: "€99.00 billed monthly",
    features: ["Everything in Professional", "Team management", "API access", "Dedicated account manager"],
  },
};

const trustBadges = [
  { icon: Lock, label: "256-bit SSL encryption" },
  { icon: ShieldCheck, label: "Secure payment processing" },
  { icon: RotateCcw, label: "30-day money-back guarantee" },
];

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get("plan") || "professional";
  const plan = planDetails[planParam] ?? planDetails.professional;
  const planName = planParam.charAt(0).toUpperCase() + planParam.slice(1);

  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/onboarding");
  };

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
            Step 2 of 3 — Payment
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">
            Order Summary
          </h2>
          <p className="text-muted-foreground mb-8">You're one step away from landing your dream job.</p>

          {/* Plan summary card */}
          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-6 mb-6">
            <div className="flex items-baseline justify-between mb-1">
              <span className="font-display text-lg font-bold text-card-foreground">{planName} Plan</span>
              <span className="font-display text-2xl font-bold text-primary">{plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">{plan.billing}</p>
            <div className="border-t border-border pt-4">
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
              <span className="text-sm font-medium text-card-foreground">Total today</span>
              <span className="font-display text-lg font-bold text-card-foreground">{plan.price}.00</span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="space-y-3">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 text-primary shrink-0" />
                {label}
              </div>
            ))}
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

          <h1 className="font-display text-2xl font-bold text-foreground">Complete Payment</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your card details are encrypted and secure</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {/* Card number */}
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative mt-1.5">
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                  className="pr-10"
                  required
                />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Name on card */}
            <div>
              <Label htmlFor="cardName">Name on Card</Label>
              <Input
                id="cardName"
                placeholder="Max Müller"
                className="mt-1.5"
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value })}
                required
              />
            </div>

            {/* Expiry + CVC */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  className="mt-1.5"
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  maxLength={4}
                  className="mt-1.5"
                  value={card.cvc}
                  onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                  required
                />
              </div>
            </div>

            {/* Mobile plan summary */}
            <div className="lg:hidden rounded-xl border border-border bg-card p-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-card-foreground font-medium">{planName} Plan</span>
                <span className="font-bold text-primary">{plan.price}/mo</span>
              </div>
            </div>

            <Button className="w-full rounded-full mt-2" type="submit">
              <Lock className="h-4 w-4 mr-2" />
              Pay {plan.price} &amp; Activate
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <span className="text-primary cursor-pointer hover:underline">Terms of Service</span>{" "}
            and{" "}
            <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            <Link to={`/register?plan=${planParam}`} className="text-primary hover:underline">
              ← Back to account creation
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;
