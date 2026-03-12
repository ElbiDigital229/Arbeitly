import { motion } from "framer-motion";
import { FileText, PenTool, Search, BarChart3, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "CV Optimization",
    description: "AI-powered ATS optimization with keyword extraction. Upload your CV and get a polished, recruiter-ready version.",
  },
  {
    icon: PenTool,
    title: "Cover Letter Engine",
    description: "Generate job-specific cover letters tailored to each role. Editable and ready to send in seconds.",
  },
  {
    icon: Search,
    title: "Job Discovery",
    description: "Intelligent job matching from LinkedIn, Indeed, and more. Find roles that fit your skills and experience.",
  },
  {
    icon: BarChart3,
    title: "Application Tracking",
    description: "Monitor every application's status. From applied to offer — track your entire job search journey.",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Full support for German and English. Generate documents in either language with natural fluency.",
  },
  {
    icon: Shield,
    title: "GDPR Compliant",
    description: "EU-hosted infrastructure with encryption at rest and in transit. Your data stays secure and private.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-4xl font-bold text-foreground">
            Why <span className="text-gradient">Arbeitly</span>?
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Applying for jobs is exhausting. We built Arbeitly so you can focus on your current job while we apply to better ones for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
