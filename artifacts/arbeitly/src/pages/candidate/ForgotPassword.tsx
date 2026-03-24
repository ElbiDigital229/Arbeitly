import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import logo from "@/assets/logo.png";
import { useCustomers } from "@/context/CustomersContext";

const ForgotPassword = () => {
  const { customers } = useCustomers();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [resetLink, setResetLink] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const customer = customers.find((c) => c.email.toLowerCase() === email.toLowerCase().trim());
    if (!customer) {
      setError("No account found with that email address.");
      return;
    }

    // Generate token and store with 30-min expiry
    const token = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
    const expiry = Date.now() + 30 * 60 * 1000;
    localStorage.setItem(`arbeitly_reset_${token}`, JSON.stringify({ email: email.toLowerCase().trim(), expiry }));

    setResetLink(`/candidate/reset-password?token=${token}`);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-hero-radial items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
            <KeyRound className="h-7 w-7 text-primary" />
          </div>
          <h2 className="font-display text-4xl font-bold text-foreground">Reset Password</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            We'll send you a link to reset your password. Tokens expire in 30 minutes.
          </p>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="flex items-center gap-2 mb-8">
            <img src={logo} alt="Arbeitly" className="h-8" />
          </Link>

          {submitted ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h1 className="font-display text-xl font-bold text-foreground">Check your email</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    A reset link was sent to <strong>{email}</strong>. It expires in 30 minutes.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Demo Mode</p>
                <p className="text-xs text-muted-foreground">
                  In production, an email would be sent. For demo purposes, use the button below:
                </p>
                <Button asChild className="w-full rounded-full" size="sm">
                  <Link to={resetLink}>Open Reset Link</Link>
                </Button>
              </div>

              <Link to="/candidate/login" className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold text-foreground">Forgot Password?</h1>
              <p className="mt-1 text-sm text-muted-foreground">Enter your email and we'll send a reset link.</p>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="mt-1.5"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button className="w-full rounded-full" type="submit">
                  Send Reset Link
                </Button>
              </form>

              <Link to="/candidate/login" className="mt-5 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to login
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
