import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, ChevronLeft, Upload, CheckCircle } from "lucide-react";
import logo from "@/assets/logo.png";

const STEPS = [
  { id: 1, title: "Personal Details", description: "Let us know who you are" },
  { id: 2, title: "Professional Background", description: "Tell us about your experience" },
  { id: 3, title: "Skills & Career Goals", description: "What are you aiming for?" },
  { id: 4, title: "Final Details", description: "Almost done — a few last things" },
];

const StepIndicator = ({ current }: { current: number }) => (
  <div className="flex items-center gap-0 mb-10">
    {STEPS.map((step, i) => (
      <div key={step.id} className="flex items-center flex-1 last:flex-none">
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              current > step.id
                ? "bg-primary text-primary-foreground"
                : current === step.id
                ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {current > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
          </div>
          <span className={`mt-1.5 text-xs font-medium hidden sm:block ${current === step.id ? "text-primary" : "text-muted-foreground"}`}>
            {step.title}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`flex-1 h-px mx-2 mb-4 ${current > step.id ? "bg-primary" : "bg-border"}`} />
        )}
      </div>
    ))}
  </div>
);

const FieldGroup = ({ children, title }: { children: React.ReactNode; title?: string }) => (
  <div className="mb-6">
    {title && <h3 className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">{title}</h3>}
    <div className="space-y-4">{children}</div>
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <Label className="text-sm text-foreground mb-1.5 block">{label}</Label>
    {children}
  </div>
);

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/customer");
  };

  const currentStep = STEPS[step - 1];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <img src={logo} alt="Arbeitly" className="h-7" />
          <span className="text-xs text-muted-foreground">Step {step} of {STEPS.length}</span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-2xl">
        <StepIndicator current={step} />

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">{currentStep.title}</h1>
            <p className="mt-1 text-muted-foreground">{currentStep.description}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* ── STEP 1: Personal Details ── */}
            {step === 1 && (
              <div>
                <FieldGroup title="Basic Information">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="First Name">
                      <Input placeholder="Max" />
                    </Field>
                    <Field label="Last Name">
                      <Input placeholder="Müller" />
                    </Field>
                  </div>
                  <Field label="Email Address for Applications">
                    <Input type="email" placeholder="max@example.com" />
                  </Field>
                  <Field label="Phone Number">
                    <Input placeholder="+49 170 1234567" />
                  </Field>
                  <Field label="LinkedIn Profile URL">
                    <Input placeholder="https://linkedin.com/in/yourprofile" />
                  </Field>
                </FieldGroup>

                <FieldGroup title="Personal Information">
                  <Field label="Date of Birth">
                    <Input type="date" />
                  </Field>
                  <Field label="Place of Birth">
                    <Input placeholder="Berlin, Germany" />
                  </Field>
                  <Field label="Address">
                    <Input placeholder="Musterstraße 12, 10115 Berlin" />
                  </Field>
                </FieldGroup>
              </div>
            )}

            {/* ── STEP 2: Professional Background ── */}
            {step === 2 && (
              <div>
                <FieldGroup title="Work Experience">
                  <Field label="Current / Last Job Title">
                    <Input placeholder="e.g. Software Engineer" />
                  </Field>
                  <Field label="Current / Last Employer">
                    <Input placeholder="e.g. Siemens AG" />
                  </Field>
                  <Field label="What is your current field?">
                    <Input placeholder="e.g. Software Development, Marketing, Finance…" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Years of Experience">
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                        <SelectContent>
                          {["Less than 1 year", "1–2 years", "3–5 years", "6–10 years", "10+ years"].map((v) => (
                            <SelectItem key={v} value={v}>{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Current Salary (annual EUR)">
                      <Input placeholder="e.g. 60,000" />
                    </Field>
                  </div>
                  <Field label="Have you worked in Germany?">
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="currently">Currently working there</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Notice Period">
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        {["Immediately available", "2 weeks", "1 month", "2 months", "3 months", "3+ months"].map((v) => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>

                <FieldGroup title="Education">
                  <Field label="Highest Level of Study">
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        {["High School", "Vocational Training (Ausbildung)", "Bachelor's Degree", "Master's Degree", "PhD / Doctorate", "Other"].map((v) => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Degree / Training Title">
                    <Input placeholder="e.g. B.Sc. Computer Science" />
                  </Field>
                  <Field label="University / Institute">
                    <Input placeholder="e.g. TU Berlin" />
                  </Field>
                  <Field label="University Location (city and country)">
                    <Input placeholder="e.g. Berlin, Germany" />
                  </Field>
                </FieldGroup>
              </div>
            )}

            {/* ── STEP 3: Skills & Career Goals ── */}
            {step === 3 && (
              <div>
                <FieldGroup title="Skills">
                  <Field label="Your Top 5 Skills">
                    <Textarea placeholder="e.g. React, TypeScript, Project Management, Data Analysis, Communication" rows={3} />
                  </Field>
                  <Field label="Relevant Certifications (if any)">
                    <Textarea placeholder="e.g. AWS Certified Developer, PMP, CISSP…" rows={2} />
                  </Field>
                </FieldGroup>

                <FieldGroup title="Career Goals">
                  <Field label="Primary Career Goal(s)">
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        {["Get a higher salary", "Change industries", "Get promoted", "Move to Germany", "Work remotely", "Find more stability", "Other"].map((v) => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Which job titles / roles are you targeting?">
                    <Textarea placeholder="e.g. Senior Frontend Developer, Product Manager, Data Scientist…" rows={2} />
                  </Field>
                  <Field label="Which industries do you want to work in?">
                    <Textarea placeholder="e.g. FinTech, Automotive, Healthcare, E-Commerce…" rows={2} />
                  </Field>
                  <Field label="Type of Employment">
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        {["Full-time", "Part-time", "Contract / Freelance", "Internship", "Working Student"].map((v) => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>

                <FieldGroup title="Location Preferences">
                  <Field label="Preferred Job Location (city/cities)">
                    <Input placeholder="e.g. Berlin, Munich, Remote" />
                  </Field>
                  <Field label="Open to Relocation?">
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes — open to anywhere</SelectItem>
                        <SelectItem value="specific">Yes — specific cities only</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Preferred Salary Range (annual EUR)">
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        {["Under €30k", "€30k–€45k", "€45k–€60k", "€60k–€80k", "€80k–€100k", "€100k+"].map((v) => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Specific companies you want to target? (optional)">
                    <Textarea placeholder="e.g. Zalando, SAP, BMW Group…" rows={2} />
                  </Field>
                  <Field label="Are you open to a career change?">
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No, staying in my field</SelectItem>
                        <SelectItem value="maybe">Open to it</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
              </div>
            )}

            {/* ── STEP 4: Final Details ── */}
            {step === 4 && (
              <div>
                <FieldGroup title="Language & Credentials">
                  <Field label="Current level of German language">
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        {["None", "A1 – Beginner", "A2 – Elementary", "B1 – Intermediate", "B2 – Upper Intermediate", "C1 – Advanced", "C2 – Proficient / Native"].map((v) => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Do you hold a valid driving license?">
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>

                <FieldGroup title="Additional Information">
                  <Field label="If transitioning to a new industry, what motivates this change?">
                    <Textarea placeholder="Tell us what's driving the change…" rows={2} />
                  </Field>
                  <Field label="Do you need additional training to transition? (optional)">
                    <Textarea placeholder="e.g. I'd like to complete a data science bootcamp…" rows={2} />
                  </Field>
                  <Field label="How did you hear about us?">
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        {["Google / Search", "LinkedIn", "Instagram", "Friend / Referral", "Job Board", "Other"].map((v) => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Anything else you'd like us to consider?">
                    <Textarea placeholder="Any additional context about your job search…" rows={3} />
                  </Field>
                </FieldGroup>

                <FieldGroup title="Documents">
                  <Field label="Upload Your CV">
                    <label className="flex items-center gap-3 border-2 border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-colors group bg-[hsl(196_89%_9%)]">
                      <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Click to upload CV</p>
                        <p className="text-xs text-muted-foreground">PDF, DOCX up to 10MB</p>
                      </div>
                      <input type="file" accept=".pdf,.docx,.doc" className="hidden" />
                    </label>
                  </Field>
                  <Field label="Upload Your Cover Letter (optional)">
                    <label className="flex items-center gap-3 border-2 border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-colors group bg-[hsl(196_89%_9%)]">
                      <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Click to upload Cover Letter</p>
                        <p className="text-xs text-muted-foreground">PDF, DOCX up to 10MB</p>
                      </div>
                      <input type="file" accept=".pdf,.docx,.doc" className="hidden" />
                    </label>
                  </Field>
                </FieldGroup>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-border mt-8">
              <Button
                type="button"
                variant="ghost"
                onClick={back}
                disabled={step === 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>

              {step < 4 ? (
                <Button type="button" onClick={next} className="rounded-full gap-2 px-8">
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="rounded-full gap-2 px-8">
                  Complete Setup
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
