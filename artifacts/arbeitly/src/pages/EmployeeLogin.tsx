import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";
import { useEmployees } from "@/context/EmployeesContext";

const EmployeeLogin = () => {
  const navigate = useNavigate();
  const { loginEmployee, loginEmployeeDirect, employees } = useEmployees();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const emp = loginEmployee(form.email, form.password);
    if (emp) {
      navigate("/employee/internal");
    } else {
      setError("Invalid email or password, or account is inactive.");
    }
  };

  const handleGuest = () => {
    // Log in as first active employee for guest/demo access, or navigate without session
    const active = employees.find((e) => e.status === "active");
    if (active) loginEmployeeDirect(active);
    navigate("/employee/internal");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-radial items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <h2 className="font-display text-4xl font-bold text-foreground">
            Employee Access
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Internal portal for Arbeitly team members. Manage candidates, job pipelines, and operations.
          </p>
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
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Arbeitly" className="h-8" />
            </Link>
            <Link to="/" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground">Employee Sign In</h1>
          <p className="mt-1 text-sm text-muted-foreground">Access the internal operations portal</p>

          {error && (
            <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@arbeitly.com"
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
            <Button className="w-full rounded-full" type="submit">
              Sign In to Portal
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          <Button
            variant="outline"
            className="w-full rounded-full"
            type="button"
            onClick={handleGuest}
          >
            Continue as Guest
          </Button>

          <div className="mt-6 pt-5 border-t border-border text-center">
            <p className="text-[11px] text-muted-foreground/60 mb-2 uppercase tracking-widest font-medium">Developer Reference</p>
            <Link
              to="/old-portal"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <span>📁</span> Browse Old Portal Files
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
