import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "€299",
    priceSuffix: "",
    billing: "one time payment",
    applications: 200,
    popular: false,
    features: [
      { text: "200 Job applications", included: true },
      { text: "Expert Resume / Cover Letter Review (1,2)", included: true },
      { text: "Standard Resume*", included: true },
      { text: "Standard Cover Letters*", included: true },
      { text: "1 Human Assistant", included: true },
      { text: "LinkedIn Makeover", included: false },
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: "€399",
    priceSuffix: "",
    billing: "one time payment",
    applications: 300,
    popular: false,
    features: [
      { text: "300 Job applications", included: true },
      { text: "Expert Resume / Cover Letter Review (1,2)", included: true },
      { text: "Standard Resume*", included: true },
      { text: "Standard Cover Letters*", included: true },
      { text: "1 Human Assistant", included: true },
      { text: "LinkedIn Makeover", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "€499",
    priceSuffix: "",
    billing: "one time payment",
    applications: 400,
    popular: true,
    features: [
      { text: "400 Job applications", included: true },
      { text: "Expert Resume / Cover Letter Review (1,2)", included: true },
      { text: "Standard Resume*", included: true },
      { text: "Standard Cover Letters*", included: true },
      { text: "1 Human Assistant", included: true },
      { text: "LinkedIn Makeover", included: false },
    ],
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: "€499",
    priceSuffix: "+ 8.5% SUCCESS FEE",
    billing: "one time payment",
    applications: 0,
    popular: false,
    features: [
      { text: "Tailored Job Applications", included: true },
      { text: "Expert Resume / Cover Letter Review (2)", included: true },
      { text: "Custom Resume for every application", included: true },
      { text: "Custom Cover Letters for every application", included: true },
      { text: "1 Human Assistant", included: true },
      { text: "LinkedIn Makeover (2)", included: true },
    ],
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-4xl font-bold text-foreground">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            One-time payment. No hidden fees. No monthly charges.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.popular
                  ? "border-primary bg-card shadow-xl glow-accent scale-105"
                  : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <h3 className="font-display text-lg font-bold text-card-foreground uppercase tracking-wide">
                {plan.name}
              </h3>

              <div className="mt-4">
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="font-display text-4xl font-bold text-card-foreground">
                    {plan.price}
                  </span>
                </div>
                {plan.priceSuffix && (
                  <p className="text-xs font-semibold text-primary mt-0.5">{plan.priceSuffix}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{plan.billing}</p>
              </div>

              <Button
                className="mt-5 w-full rounded-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => navigate(`/register?plan=${plan.id}`)}
              >
                Get Started
              </Button>

              <ul className="mt-6 space-y-2.5 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-2.5 text-sm">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? "text-muted-foreground" : "text-muted-foreground/50"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center max-w-xl mx-auto text-xs text-muted-foreground space-y-1">
          <p>1. Expert Resume / Cover Letter Review can be excluded</p>
          <p>2. Pro-rata refunds are NOT applicable on Resume Review and LinkedIn Makeover as they are a one-time effort from Experts.</p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
