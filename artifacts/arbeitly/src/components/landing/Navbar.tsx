import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, UserCircle } from "lucide-react";
import logo from "@/assets/logo.png";

const Navbar = () => {
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
          <Button variant="outline" size="sm" className="rounded-full gap-2 border-border/60 text-muted-foreground hover:text-foreground" asChild>
            <Link to="/candidate/login">
              <UserCircle className="h-3.5 w-3.5" />
              Candidate Portal
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full gap-2 border-border/60 text-muted-foreground hover:text-foreground" asChild>
            <Link to="/employee/login">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Employee Portal
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button size="sm" className="rounded-full" asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
