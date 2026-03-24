import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";

const ADMIN_EMAIL = "admin@arbeitly.de";
const ADMIN_PASSWORD = "admin2024";

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
      localStorage.setItem("arbeitly_superadmin_auth", "true");
      navigate("/superadmin");
    } else {
      setError("Invalid credentials.");
    }
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
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="font-display text-4xl font-bold text-foreground">
            Super Admin Access
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Manage pricing plans, customers, and platform configuration.
          </p>
          <div className="mt-8 rounded-2xl border border-border bg-card/60 backdrop-blur p-5 text-left space-y-2 text-sm text-muted-foreground">
            <p>• Manage pricing plans</p>
            <p>• View all registered customers</p>
            <p>• Configure AI settings & prompts</p>
            <p>• Monitor platform activity</p>
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
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Arbeitly" className="h-8" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Super Admin
              </span>
            </Link>
            <Link to="/" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground">Admin Sign In</h1>
          <p className="mt-1 text-sm text-muted-foreground">Restricted access — authorised personnel only</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
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
                className="mt-1.5"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button className="w-full rounded-full mt-2" type="submit">
              <Shield className="h-4 w-4 mr-2" />
              Sign In to Admin Panel
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
