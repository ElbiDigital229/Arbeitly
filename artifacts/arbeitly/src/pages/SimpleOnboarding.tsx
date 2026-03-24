import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import logo from "@/assets/logo.png";
import { useCustomers } from "@/context/CustomersContext";

const INDUSTRIES = [
  "Technology / Software",
  "Finance / Banking",
  "Healthcare / Medical",
  "Engineering",
  "Marketing / Sales",
  "Education",
  "Legal",
  "Consulting",
  "Manufacturing",
  "Retail / E-Commerce",
  "Media / Creative",
  "Other",
];

const COUNTRIES = [
  "Germany",
  "Austria",
  "Switzerland",
  "Netherlands",
  "United Kingdom",
  "France",
  "Spain",
  "United States",
  "Canada",
  "Australia",
  "Other",
];

const REFERRAL_SOURCES = [
  "Google / Search Engine",
  "LinkedIn",
  "Instagram",
  "Facebook",
  "Friend or Colleague",
  "Job Forum / Community",
  "YouTube",
  "Other",
];

const SimpleOnboarding = () => {
  const navigate = useNavigate();
  const { currentCustomer, updateCustomer } = useCustomers();

  useEffect(() => {
    if (!currentCustomer) navigate("/candidate/login");
  }, [currentCustomer, navigate]);

  const [form, setForm] = useState({
    industry: "",
    targetCountry: "",
    howHeard: "",
  });
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.industry || !form.targetCountry || !form.howHeard) {
      setError(true);
      return;
    }
    if (currentCustomer) {
      updateCustomer(currentCustomer.id, {
        marketingData: {
          industry: form.industry,
          targetCountry: form.targetCountry,
          howHeard: form.howHeard,
        },
      });
    }
    navigate("/candidate/portal");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <img src={logo} alt="Arbeitly" className="h-8 mb-8" />

        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
          Step 2 of 2 — Quick Setup
        </p>
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">
          Tell us a little about yourself
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Three quick questions to personalise your experience.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            Please answer all three questions to continue.
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="industry">What industry are you in?</Label>
            <Select
              value={form.industry}
              onValueChange={(v) => setForm({ ...form, industry: v })}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((i) => (
                  <SelectItem key={i} value={i}>{i}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="targetCountry">Which country are you looking to apply in?</Label>
            <Select
              value={form.targetCountry}
              onValueChange={(v) => setForm({ ...form, targetCountry: v })}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="howHeard">How did you hear about us?</Label>
            <Select
              value={form.howHeard}
              onValueChange={(v) => setForm({ ...form, howHeard: v })}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select a source" />
              </SelectTrigger>
              <SelectContent>
                {REFERRAL_SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full rounded-full mt-2" type="submit">
            Go to My Dashboard
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default SimpleOnboarding;
