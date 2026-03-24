import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, CheckCircle2, XCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { useCustomers } from "@/context/CustomersContext";

type TokenState = "loading" | "valid" | "invalid" | "expired";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { customers, updateCustomer } = useCustomers();

  const token = searchParams.get("token") ?? "";
  const [tokenState, setTokenState] = useState<TokenState>("loading");
  const [tokenEmail, setTokenEmail] = useState("");
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) { setTokenState("invalid"); return; }
    try {
      const raw = localStorage.getItem(`arbeitly_reset_${token}`);
      if (!raw) { setTokenState("invalid"); return; }
      const { email, expiry } = JSON.parse(raw);
      if (Date.now() > expiry) { setTokenState("expired"); return; }
      setTokenEmail(email);
      setTokenState("valid");
    } catch {
      setTokenState("invalid");
    }
  }, [token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }

    const customer = customers.find((c) => c.email.toLowerCase() === tokenEmail.toLowerCase());
    if (!customer) { setError("Account not found."); return; }

    updateCustomer(customer.id, { password: form.password });
    localStorage.removeItem(`arbeitly_reset_${token}`);
    setSuccess(true);

    setTimeout(() => navigate("/candidate/login"), 3000);
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
          <h2 className="font-display text-4xl font-bold text-foreground">Set New Password</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Choose a strong password to secure your account.
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

          {tokenState === "loading" && (
            <p className="text-sm text-muted-foreground">Verifying reset link...</p>
          )}

          {(tokenState === "invalid" || tokenState === "expired") && (
            <div className="space-y-5 text-center">
              <div className="h-12 w-12 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">
                  {tokenState === "expired" ? "Link Expired" : "Invalid Link"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {tokenState === "expired"
                    ? "This reset link has expired. Reset links are valid for 30 minutes."
                    : "This reset link is invalid or has already been used."}
                </p>
              </div>
              <Button asChild className="w-full rounded-full">
                <Link to="/candidate/forgot-password">Request New Link</Link>
              </Button>
              <Link to="/candidate/login" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Back to login
              </Link>
            </div>
          )}

          {tokenState === "valid" && !success && (
            <>
              <h1 className="font-display text-2xl font-bold text-foreground">Set New Password</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Setting password for <strong>{tokenEmail}</strong>
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 8 characters"
                    className="mt-1.5"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    placeholder="Repeat password"
                    className="mt-1.5"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button className="w-full rounded-full" type="submit">
                  Reset Password
                </Button>
              </form>
            </>
          )}

          {success && (
            <div className="space-y-5 text-center">
              <div className="h-12 w-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">Password Updated!</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Your password has been reset. Redirecting to login...
                </p>
              </div>
              <Button asChild className="w-full rounded-full">
                <Link to="/candidate/login">Go to Login</Link>
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
