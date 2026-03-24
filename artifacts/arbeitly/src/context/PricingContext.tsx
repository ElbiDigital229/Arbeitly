import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type PlanFeature = { text: string; included: boolean };

export type Plan = {
  id: string;
  name: string;
  price: string;
  priceSuffix: string;
  billing: string;
  displayPrice: string;
  totalLabel: string;
  popular: boolean;
  free: boolean;
  isActive: boolean;
  applicationLimit: number; // 0 = unlimited / not applicable (free); >0 = quota for paid plans
  cvCreationLimit: number; // 0 = unlimited; >0 = max CV builds for free plan
  features: PlanFeature[];
};

const defaultPlans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "€0",
    priceSuffix: "",
    billing: "forever free",
    displayPrice: "Free forever",
    totalLabel: "€0.00",
    popular: false,
    free: true,
    isActive: true,
    applicationLimit: 0,
    cvCreationLimit: 10,
    features: [
      { text: "Job application tracker (list + kanban)", included: true },
      { text: "Up to 20 applications", included: true },
      { text: "Basic profile", included: true },
      { text: "Human Assistant", included: false },
      { text: "Resume / Cover Letter service", included: false },
      { text: "LinkedIn Makeover", included: false },
    ],
  },
  {
    id: "basic",
    name: "Basic",
    price: "€299",
    priceSuffix: "",
    billing: "one time payment",
    displayPrice: "€299 one-time",
    totalLabel: "€299.00",
    popular: false,
    free: false,
    isActive: true,
    applicationLimit: 200,
    cvCreationLimit: 0,
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
    displayPrice: "€399 one-time",
    totalLabel: "€399.00",
    popular: false,
    free: false,
    isActive: true,
    applicationLimit: 300,
    cvCreationLimit: 0,
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
    displayPrice: "€499 one-time",
    totalLabel: "€499.00",
    popular: true,
    free: false,
    isActive: true,
    applicationLimit: 400,
    cvCreationLimit: 0,
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
    displayPrice: "€499 + 8.5% success fee",
    totalLabel: "€499 + 8.5% success fee",
    popular: false,
    free: false,
    isActive: true,
    applicationLimit: 999,
    cvCreationLimit: 0,
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

type PricingContextType = {
  plans: Plan[];
  updatePlan: (plan: Plan) => void;
  addPlan: (plan: Omit<Plan, "id">) => void;
  deletePlan: (id: string) => void;
};

const PricingContext = createContext<PricingContextType | null>(null);

export function PricingProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<Plan[]>(() => {
    try {
      const stored = localStorage.getItem("arbeitly_plans");
      if (!stored) return defaultPlans;
      const parsed: Plan[] = JSON.parse(stored);
      // Ensure free plan always exists (migration for existing stored plans)
      const hasFreePlan = parsed.some((p) => p.id === "free");
      if (!hasFreePlan) {
        return [defaultPlans[0], ...parsed];
      }
      return parsed;
    } catch {
      return defaultPlans;
    }
  });

  useEffect(() => {
    localStorage.setItem("arbeitly_plans", JSON.stringify(plans));
  }, [plans]);

  const updatePlan = (updated: Plan) =>
    setPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

  const addPlan = (plan: Omit<Plan, "id">) =>
    setPlans((prev) => [...prev, { ...plan, id: crypto.randomUUID() }]);

  const deletePlan = (id: string) =>
    setPlans((prev) => prev.filter((p) => p.id !== id));

  return (
    <PricingContext.Provider value={{ plans, updatePlan, addPlan, deletePlan }}>
      {children}
    </PricingContext.Provider>
  );
}

export function usePricing() {
  const ctx = useContext(PricingContext);
  if (!ctx) throw new Error("usePricing must be used within PricingProvider");
  return ctx;
}
