import { motion } from "framer-motion";
import { Upload, Wand2, Send, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Understanding Career Goals",
    description: "We understand your career goals and analyse your profile. Application documents are updated and improved.",
  },
  {
    icon: Wand2,
    step: "02",
    title: "Job Hunting & Applications",
    description: "We search for the most relevant jobs and apply on the ones that align with your career goals.",
  },
  {
    icon: Send,
    step: "03",
    title: "Realtime Application Tracking",
    description: "From application submission to interview scheduling, you can track all updates, anytime.",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Job Secured",
    description: "We celebrate your success as you land the job that fits your goals. We're here to support your continued growth.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-section-light">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-4xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Four simple steps to transform your job search
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="text-center rounded-xl border border-border bg-card p-6"
            >
              <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <item.icon className="h-7 w-7 text-primary" />
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {item.step}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
