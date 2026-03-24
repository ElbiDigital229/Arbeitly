import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCircle, LayoutDashboard, Shield, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [signInOpen, setSignInOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSignInOpen(false);
      }
    };
    if (signInOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [signInOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Arbeitly" className="h-8" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">How It Works</a>
          <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Sign In dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => setSignInOpen((v) => !v)}
            >
              Sign In
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${signInOpen ? "rotate-180" : ""}`} />
            </Button>

            {signInOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="px-4 pt-3 pb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Choose your portal
                </p>
                <Link
                  to="/candidate/login"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-card-foreground hover:bg-secondary/60 transition-colors"
                  onClick={() => setSignInOpen(false)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <UserCircle className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Candidate</p>
                    <p className="text-[11px] text-muted-foreground">Job seekers & applicants</p>
                  </div>
                </Link>
                <Link
                  to="/employee/login"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-card-foreground hover:bg-secondary/60 transition-colors border-t border-border/40"
                  onClick={() => setSignInOpen(false)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Employee</p>
                    <p className="text-[11px] text-muted-foreground">Arbeitly team members</p>
                  </div>
                </Link>
                <Link
                  to="/superadmin/login"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-card-foreground hover:bg-secondary/60 transition-colors border-t border-border/40"
                  onClick={() => setSignInOpen(false)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <Shield className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Super Admin</p>
                    <p className="text-[11px] text-muted-foreground">Platform management</p>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Get Started — goes to free candidate signup */}
          <Button size="sm" className="rounded-full" asChild>
            <Link to="/register?plan=free">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
