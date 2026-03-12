import Navbar from "@/components/landing/Navbar";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground"
          >
            Choose Your Plan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Start with a 14-day free trial. No credit card required. Upgrade or downgrade anytime.
          </motion.p>
        </div>
      </div>

      <PricingSection />
      
      <div className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mt-8 text-left">
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2">Can I change plans anytime?</h3>
                <p className="text-sm text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.</p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2">What payment methods do you accept?</h3>
                <p className="text-sm text-muted-foreground">We accept all major credit cards, PayPal, and SEPA bank transfers for EU customers.</p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2">Is there a refund policy?</h3>
                <p className="text-sm text-muted-foreground">Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service.</p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2">Do you offer custom enterprise solutions?</h3>
                <p className="text-sm text-muted-foreground">Absolutely! Contact our sales team for custom pricing tailored to your organization's needs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;
