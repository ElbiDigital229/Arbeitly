import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, ChevronLeft, Upload, CheckCircle, ShieldCheck, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo.png";
import { useCustomers, type OnboardingData } from "@/context/CustomersContext";

const STEPS = [
  { id: 1, title: "Personal Details", description: "Let us know who you are" },
  { id: 2, title: "Professional Background", description: "Tell us about your experience" },
  { id: 3, title: "Skills & Career Goals", description: "What are you aiming for?" },
  { id: 4, title: "Final Details", description: "Almost done — a few last things" },
  { id: 5, title: "Job Application Account", description: "Create a dedicated email account for applying" },
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

const Field = ({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) => (
  <div>
    <Label className="text-sm text-foreground mb-1.5 block">
      {label}
      {required && <span className="text-destructive ml-0.5"> *</span>}
    </Label>
    {children}
  </div>
);

// Required Select keys per step for validation
const REQUIRED_SELECTS: Record<number, { key: keyof OnboardingData; label: string }[]> = {
  2: [
    { key: "yearsExperience", label: "Years of Experience" },
    { key: "workedInGermany", label: "Worked in Germany" },
    { key: "noticePeriod", label: "Notice Period" },
    { key: "highestStudy", label: "Highest Level of Study" },
  ],
  3: [
    { key: "careerGoal", label: "Primary Career Goal" },
    { key: "employmentType", label: "Type of Employment" },
    { key: "openToRelocation", label: "Open to Relocation" },
    { key: "preferredSalary", label: "Preferred Salary Range" },
  ],
  4: [
    { key: "germanLevel", label: "German Language Level" },
    { key: "drivingLicense", label: "Driving License" },
    { key: "howHeard", label: "How did you hear about us" },
  ],
};

const emptyData = (): Partial<OnboardingData> => ({
  firstName: "", lastName: "", applicationEmail: "", phone: "", linkedin: "",
  dob: "", placeOfBirth: "", address: "",
  currentJobTitle: "", currentEmployer: "", currentField: "", yearsExperience: "",
  currentSalary: "", workedInGermany: "", noticePeriod: "", highestStudy: "",
  degreeTitle: "", university: "", universityLocation: "",
  topSkills: "", certifications: "", careerGoal: "", targetRoles: "",
  targetIndustries: "", employmentType: "", preferredLocation: "", openToRelocation: "",
  preferredSalary: "", targetCompanies: "", openToCareerChange: "",
  germanLevel: "", drivingLicense: "", transitionMotivation: "", trainingNeeds: "",
  howHeard: "", additionalInfo: "",
});

const Onboarding = () => {
  const navigate = useNavigate();
  const { currentCustomer, updateCustomer } = useCustomers();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>(emptyData);
  const [errors, setErrors] = useState<string[]>([]);

  // Block re-entry: if onboarding already completed, redirect to view page
  const alreadyOnboarded = currentCustomer?.onboarding &&
    Object.values(currentCustomer.onboarding).some((v) => v);
  if (alreadyOnboarded) {
    navigate("/candidate/onboarding", { replace: true });
    return null;
  }

  // Step 5 — job application account
  const [jobEmail, setJobEmail] = useState("");
  const [jobPassword, setJobPassword] = useState("");
  const [jobPasswordConfirm, setJobPasswordConfirm] = useState("");
  const [jobAuthorized, setJobAuthorized] = useState(false);
  const [showJobPass, setShowJobPass] = useState(false);
  const [showJobPassConfirm, setShowJobPassConfirm] = useState(false);

  const set = (key: keyof OnboardingData, value: string) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const validateStep = (): boolean => {
    const missing: string[] = [];

    const requiredInputs: Record<number, { key: keyof OnboardingData; label: string }[]> = {
      1: [
        { key: "firstName", label: "First Name" },
        { key: "lastName", label: "Last Name" },
        { key: "applicationEmail", label: "Email Address for Applications" },
        { key: "phone", label: "Phone Number" },
        { key: "dob", label: "Date of Birth" },
        { key: "placeOfBirth", label: "Place of Birth" },
        { key: "address", label: "Address" },
      ],
      2: [
        { key: "currentJobTitle", label: "Current Job Title" },
        { key: "currentEmployer", label: "Current Employer" },
        { key: "currentField", label: "Current Field" },
        { key: "university", label: "University / Institute" },
      ],
      3: [
        { key: "topSkills", label: "Top 5 Skills" },
        { key: "targetRoles", label: "Target Job Titles / Roles" },
        { key: "targetIndustries", label: "Target Industries" },
        { key: "preferredLocation", label: "Preferred Job Location" },
      ],
      4: [],
      5: [],
    };

    requiredInputs[step]?.forEach(({ key, label }) => {
      if (!data[key]?.trim()) missing.push(label);
    });

    REQUIRED_SELECTS[step]?.forEach(({ key, label }) => {
      if (!data[key]) missing.push(label);
    });

    // Step 5 custom validation
    if (step === 5) {
      if (!jobEmail.trim()) missing.push("Job application email");
      if (!jobPassword.trim()) missing.push("Password");
      if (jobPassword !== jobPasswordConfirm) missing.push("Passwords do not match");
      if (!jobAuthorized) missing.push("You must acknowledge and authorize use of this account");
    }

    setErrors(missing);
    return missing.length === 0;
  };

  const next = () => {
    if (validateStep()) {
      setErrors([]);
      setStep((s) => Math.min(s + 1, 5));
    }
  };

  const back = () => {
    setErrors([]);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    if (currentCustomer) {
      updateCustomer(currentCustomer.id, {
        onboarding: data as OnboardingData,
        jobAccount: {
          email: jobEmail.trim(),
          password: jobPassword,
          authorizedAt: new Date().toISOString(),
        },
      });
    }
    navigate("/candidate/portal");
  };

  const currentStepDef = STEPS[step - 1];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <img src={logo} alt="Arbeitly" className="h-7" />
          <span className="text-xs text-muted-foreground">Step {step} of 5</span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-2xl">
        <StepIndicator current={step} />

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">{currentStepDef.title}</h1>
            <p className="mt-1 text-muted-foreground">{currentStepDef.description}</p>
          </div>

          {errors.length > 0 && (
            <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <p className="font-semibold mb-1">Please fill in all required fields:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {errors.map((e) => <li key={e}>{e}</li>)}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ── STEP 1: Personal Details ── */}
            {step === 1 && (
              <div>
                <FieldGroup title="Basic Information">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="First Name" required>
                      <Input placeholder="Max" value={data.firstName} onChange={(e) => set("firstName", e.target.value)} />
                    </Field>
                    <Field label="Last Name" required>
                      <Input placeholder="Müller" value={data.lastName} onChange={(e) => set("lastName", e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Email Address for Applications" required>
                    <Input type="email" placeholder="max@example.com" value={data.applicationEmail} onChange={(e) => set("applicationEmail", e.target.value)} />
                  </Field>
                  <Field label="Phone Number" required>
                    <Input placeholder="+49 170 1234567" value={data.phone} onChange={(e) => set("phone", e.target.value)} />
                  </Field>
                  <Field label="LinkedIn Profile URL">
                    <Input placeholder="https://linkedin.com/in/yourprofile" value={data.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
                  </Field>
                </FieldGroup>

                <FieldGroup title="Personal Information">
                  <Field label="Date of Birth" required>
                    <Input type="date" value={data.dob} onChange={(e) => set("dob", e.target.value)} />
                  </Field>
                  <Field label="Place of Birth" required>
                    <Input placeholder="Berlin, Germany" value={data.placeOfBirth} onChange={(e) => set("placeOfBirth", e.target.value)} />
                  </Field>
                  <Field label="Address" required>
                    <Input placeholder="Musterstraße 12, 10115 Berlin" value={data.address} onChange={(e) => set("address", e.target.value)} />
                  </Field>
                </FieldGroup>
              </div>
            )}

            {/* ── STEP 2: Professional Background ── */}
            {step === 2 && (
              <div>
                <FieldGroup title="Work Experience">
                  <Field label="Current / Last Job Title" required>
                    <Input placeholder="e.g. Software Engineer" value={data.currentJobTitle} onChange={(e) => set("currentJobTitle", e.target.value)} />
                  </Field>
                  <Field label="Current / Last Employer" required>
                    <Input placeholder="e.g. Siemens AG" value={data.currentEmployer} onChange={(e) => set("currentEmployer", e.target.value)} />
                  </Field>
                  <Field label="What is your current field?" required>
                    <Input placeholder="e.g. Software Development, Marketing…" value={data.currentField} onChange={(e) => set("currentField", e.target.value)} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Years of Experience" required>
                      <Select value={data.yearsExperience} onValueChange={(v) => set("yearsExperience", v)}>
                        <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                        <SelectContent>
                          {["Less than 1 year", "1–2 years", "3–5 years", "6–10 years", "10+ years"].map((v) => (
                            <SelectItem key={v} value={v}>{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Current Salary (annual EUR)">
                      <Input placeholder="e.g. 60,000" value={data.currentSalary} onChange={(e) => set("currentSalary", e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Have you worked in Germany?" required>
                    <Select value={data.workedInGermany} onValueChange={(v) => set("workedInGermany", v)}>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="currently">Currently working there</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Notice Period" required>
                    <Select value={data.noticePeriod} onValueChange={(v) => set("noticePeriod", v)}>
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
                  <Field label="Highest Level of Study" required>
                    <Select value={data.highestStudy} onValueChange={(v) => set("highestStudy", v)}>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        {["High School", "Vocational Training (Ausbildung)", "Bachelor's Degree", "Master's Degree", "PhD / Doctorate", "Other"].map((v) => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Degree / Training Title">
                    <Input placeholder="e.g. B.Sc. Computer Science" value={data.degreeTitle} onChange={(e) => set("degreeTitle", e.target.value)} />
                  </Field>
                  <Field label="University / Institute" required>
                    <Input placeholder="e.g. TU Berlin" value={data.university} onChange={(e) => set("university", e.target.value)} />
                  </Field>
                  <Field label="University Location">
                    <Input placeholder="e.g. Berlin, Germany" value={data.universityLocation} onChange={(e) => set("universityLocation", e.target.value)} />
                  </Field>
                </FieldGroup>
              </div>
            )}

            {/* ── STEP 3: Skills & Career Goals ── */}
            {step === 3 && (
              <div>
                <FieldGroup title="Skills">
                  <Field label="Your Top 5 Skills" required>
                    <Textarea placeholder="e.g. React, TypeScript, Project Management, Data Analysis, Communication" rows={3} value={data.topSkills} onChange={(e) => set("topSkills", e.target.value)} />
                  </Field>
                  <Field label="Relevant Certifications (optional)">
                    <Textarea placeholder="e.g. AWS Certified Developer, PMP, CISSP…" rows={2} value={data.certifications} onChange={(e) => set("certifications", e.target.value)} />
                  </Field>
                </FieldGroup>

                <FieldGroup title="Career Goals">
                  <Field label="Primary Career Goal" required>
                    <Select value={data.careerGoal} onValueChange={(v) => set("careerGoal", v)}>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        {["Get a higher salary", "Change industries", "Get promoted", "Move to Germany", "Work remotely", "Find more stability", "Other"].map((v) => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Target Job Titles / Roles" required>
                    <Textarea placeholder="e.g. Senior Frontend Developer, Product Manager…" rows={2} value={data.targetRoles} onChange={(e) => set("targetRoles", e.target.value)} />
                  </Field>
                  <Field label="Target Industries" required>
                    <Textarea placeholder="e.g. FinTech, Automotive, Healthcare…" rows={2} value={data.targetIndustries} onChange={(e) => set("targetIndustries", e.target.value)} />
                  </Field>
                  <Field label="Type of Employment" required>
                    <Select value={data.employmentType} onValueChange={(v) => set("employmentType", v)}>
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
                  <Field label="Preferred Job Location" required>
                    <Input placeholder="e.g. Berlin, Munich, Remote" value={data.preferredLocation} onChange={(e) => set("preferredLocation", e.target.value)} />
                  </Field>
                  <Field label="Open to Relocation?" required>
                    <Select value={data.openToRelocation} onValueChange={(v) => set("openToRelocation", v)}>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes — open to anywhere</SelectItem>
                        <SelectItem value="specific">Yes — specific cities only</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Preferred Salary Range (annual EUR)" required>
                    <Select value={data.preferredSalary} onValueChange={(v) => set("preferredSalary", v)}>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        {["Under €30k", "€30k–€45k", "€45k–€60k", "€60k–€80k", "€80k–€100k", "€100k+"].map((v) => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Target Companies (optional)">
                    <Textarea placeholder="e.g. Zalando, SAP, BMW Group…" rows={2} value={data.targetCompanies} onChange={(e) => set("targetCompanies", e.target.value)} />
                  </Field>
                  <Field label="Open to a career change?">
                    <Select value={data.openToCareerChange} onValueChange={(v) => set("openToCareerChange", v)}>
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
                  <Field label="Current level of German language" required>
                    <Select value={data.germanLevel} onValueChange={(v) => set("germanLevel", v)}>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        {["None", "A1 – Beginner", "A2 – Elementary", "B1 – Intermediate", "B2 – Upper Intermediate", "C1 – Advanced", "C2 – Proficient / Native"].map((v) => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Do you hold a valid driving license?" required>
                    <Select value={data.drivingLicense} onValueChange={(v) => set("drivingLicense", v)}>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>

                <FieldGroup title="Additional Information">
                  <Field label="If transitioning, what motivates this change?">
                    <Textarea placeholder="Tell us what's driving the change…" rows={2} value={data.transitionMotivation} onChange={(e) => set("transitionMotivation", e.target.value)} />
                  </Field>
                  <Field label="Do you need additional training? (optional)">
                    <Textarea placeholder="e.g. I'd like to complete a data science bootcamp…" rows={2} value={data.trainingNeeds} onChange={(e) => set("trainingNeeds", e.target.value)} />
                  </Field>
                  <Field label="How did you hear about us?" required>
                    <Select value={data.howHeard} onValueChange={(v) => set("howHeard", v)}>
                      <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        {["Google / Search", "LinkedIn", "Instagram", "Friend / Referral", "Job Board", "Other"].map((v) => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Anything else you'd like us to consider? (optional)">
                    <Textarea placeholder="Any additional context about your job search…" rows={3} value={data.additionalInfo} onChange={(e) => set("additionalInfo", e.target.value)} />
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

            {/* ── STEP 5: Job Application Account ── */}
            {step === 5 && (
              <div className="space-y-6">
                {/* Explainer */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 flex gap-4">
                  <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-foreground">Create a dedicated job application account</p>
                    <p className="text-sm text-muted-foreground">
                      To help apply for jobs on your behalf, we need a separate email address and password — not your personal ones.
                      Please create a new dummy email (e.g. on Gmail or Outlook) just for job applications.
                    </p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5 pt-1">
                      <li>Do <strong>not</strong> use your personal or work email</li>
                      <li>Create something like <span className="font-mono text-primary">yourname.jobs@gmail.com</span></li>
                      <li>Your recruiter will use this to apply on your behalf</li>
                    </ul>
                  </div>
                </div>

                <FieldGroup title="Account Details">
                  <Field label="Job Application Email" required>
                    <Input
                      type="email"
                      placeholder="e.g. max.muller.jobs@gmail.com"
                      value={jobEmail}
                      onChange={(e) => setJobEmail(e.target.value)}
                    />
                  </Field>
                  <Field label="Password" required>
                    <div className="relative">
                      <Input
                        type={showJobPass ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={jobPassword}
                        onChange={(e) => setJobPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowJobPass((v) => !v)}>
                        {showJobPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </Field>
                  <Field label="Confirm Password" required>
                    <div className="relative">
                      <Input
                        type={showJobPassConfirm ? "text" : "password"}
                        placeholder="Repeat the password"
                        value={jobPasswordConfirm}
                        onChange={(e) => setJobPasswordConfirm(e.target.value)}
                        className="pr-10"
                      />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowJobPassConfirm((v) => !v)}>
                        {showJobPassConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {jobPassword && jobPasswordConfirm && jobPassword !== jobPasswordConfirm && (
                      <p className="text-xs text-destructive mt-1">Passwords do not match</p>
                    )}
                    {jobPassword && jobPasswordConfirm && jobPassword === jobPasswordConfirm && (
                      <p className="text-xs text-green-400 mt-1 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Passwords match</p>
                    )}
                  </Field>
                </FieldGroup>

                {/* Authorization checkbox */}
                <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 cursor-pointer hover:border-primary/40 transition-colors">
                  <input
                    type="checkbox"
                    className="mt-0.5 shrink-0 h-4 w-4 accent-primary"
                    checked={jobAuthorized}
                    onChange={(e) => setJobAuthorized(e.target.checked)}
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    I acknowledge that I have created this email address solely for job application purposes and I <strong className="text-foreground">authorize Arbeitly and my assigned recruiter</strong> to use these credentials to apply for jobs on my behalf. I understand I can revoke this authorization at any time by contacting my recruiter.
                  </span>
                </label>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-border mt-8">
              <Button type="button" variant="ghost" onClick={back} disabled={step === 1} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>

              {step < 5 ? (
                <Button type="button" onClick={next} className="rounded-full gap-2 px-8">
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="rounded-full gap-2 px-8" disabled={!jobAuthorized}>
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
