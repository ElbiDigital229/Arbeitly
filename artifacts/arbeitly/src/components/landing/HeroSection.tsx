import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-hero overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-hero-radial opacity-60" />

      <div className="container relative z-10 mx-auto px-6 pt-24 pb-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-display text-5xl md:text-7xl font-extrabold leading-tight text-foreground"
        >
          We Apply.
          <br />
          <span className="text-gradient">You Grow.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed"
        >
          Arbeitly helps you land your ideal role by managing job searches, optimizing CVs, applying on jobs on your behalf and handling application tracking.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mx-auto mt-3 max-w-xl text-muted-foreground"
        >
          We save your time and ensure your applications are professional, targeted, and effective.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Button variant="hero" size="xl" asChild>
            <Link to="/register?plan=free">
              Get Started
              <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="hero-outline" size="xl" asChild>
            <a href="#how-it-works">Schedule a Free Call</a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-14 flex justify-center items-center gap-8 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />ATS-Optimized CVs</span>
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />German & English</span>
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />GDPR Compliant</span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
