import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "€19",
    period: "/month",
    description: "Perfect for getting started",
    features: [
      "5 CV optimizations/month",
      "10 Cover letters/month",
      "Basic job matching",
      "Application tracking",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "€49",
    period: "/month",
    description: "For serious job seekers",
    features: [
      "Unlimited CV optimizations",
      "Unlimited cover letters",
      "Advanced job matching",
      "Priority application tracking",
      "Multi-language support",
      "Analytics dashboard",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "€99",
    period: "/month",
    description: "For teams and agencies",
    features: [
      "Everything in Professional",
      "Team management",
      "Custom CV templates",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
    ],
    popular: false,
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
            Start with a free trial. Upgrade when you're ready.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl border p-8 ${
                plan.popular
                  ? "border-primary bg-card shadow-xl glow-accent scale-105"
                  : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                  Most Popular
                </div>
              )}
              <h3 className="font-display text-xl font-bold text-card-foreground">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold text-card-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <Button
                className="mt-6 w-full rounded-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() =>
                  navigate(`/register?plan=${plan.name.toLowerCase()}&price=${plan.price}`)
                }
              >
                Get Started
              </Button>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
