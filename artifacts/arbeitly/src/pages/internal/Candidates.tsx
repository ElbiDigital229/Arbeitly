import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Search, User, Mail, Phone, Linkedin, MapPin, Calendar, Briefcase,
  GraduationCap, Target, FileText, Download, CheckCircle, AlertCircle,
  Globe, Star, Award, ChevronRight,
} from "lucide-react";

type Candidate = {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  linkedin: string;
  plan: "Basic" | "Standard" | "Premium" | "Ultimate";
  applicationsUsed: number;
  applicationsTotal: number;
  status: "Active" | "New" | "Inactive" | "On Hold";
  joined: string;
  dob: string;
  address: string;
  placeOfBirth: string;
  currentTitle: string;
  employer: string;
  field: string;
  yearsExp: string;
  workedInGermany: string;
  currentSalary: string;
  noticePeriod: string;
  educationLevel: string;
  degreeTitle: string;
  university: string;
  universityLocation: string;
  skills: string[];
  certifications: string;
  careerGoal: string;
  targetRoles: string;
  targetIndustries: string;
  employmentType: string;
  preferredLocation: string;
  openToRelocation: string;
  salaryRange: string;
  targetCompanies: string;
  germanLevel: string;
  drivingLicense: string;
  hearAboutUs: string;
  additionalNotes: string;
  hasCv: boolean;
  hasCoverLetter: boolean;
};

const candidates: Candidate[] = [
  {
    id: "1", name: "Anna Schmidt", initials: "AS", email: "anna.schmidt@example.com", phone: "+49 170 1234567",
    linkedin: "linkedin.com/in/anna-schmidt", plan: "Premium", applicationsUsed: 47, applicationsTotal: 400,
    status: "Active", joined: "Feb 15, 2026", dob: "1993-04-12", address: "Musterstraße 12, 10115 Berlin",
    placeOfBirth: "Hamburg, Germany", currentTitle: "Senior UX Designer", employer: "Zalando SE",
    field: "Product Design", yearsExp: "6–10 years", workedInGermany: "Currently working there",
    currentSalary: "72,000", noticePeriod: "1 month", educationLevel: "Master's Degree",
    degreeTitle: "M.A. Communication Design", university: "UdK Berlin", universityLocation: "Berlin, Germany",
    skills: ["Figma", "UX Research", "Prototyping", "Design Systems", "HTML/CSS"],
    certifications: "Google UX Design Certificate", careerGoal: "Get promoted",
    targetRoles: "Principal Designer, Design Manager, Head of Design", targetIndustries: "FinTech, SaaS, E-Commerce",
    employmentType: "Full-time", preferredLocation: "Berlin, Munich, Remote",
    openToRelocation: "Yes — specific cities only", salaryRange: "€80k–€100k",
    targetCompanies: "Spotify, N26, Personio", germanLevel: "C1 – Advanced",
    drivingLicense: "Yes", hearAboutUs: "LinkedIn", additionalNotes: "Open to hybrid roles. Not interested in agencies.",
    hasCv: true, hasCoverLetter: true,
  },
  {
    id: "2", name: "Thomas Wagner", initials: "TW", email: "t.wagner@example.com", phone: "+49 176 9876543",
    linkedin: "linkedin.com/in/thomas-wagner", plan: "Standard", applicationsUsed: 18, applicationsTotal: 300,
    status: "Active", joined: "Feb 20, 2026", dob: "1989-07-28", address: "Schillerstraße 5, 80336 Munich",
    placeOfBirth: "Munich, Germany", currentTitle: "Data Analyst", employer: "BMW Group",
    field: "Data & Analytics", yearsExp: "3–5 years", workedInGermany: "Currently working there",
    currentSalary: "58,000", noticePeriod: "2 months", educationLevel: "Bachelor's Degree",
    degreeTitle: "B.Sc. Business Informatics", university: "LMU Munich", universityLocation: "Munich, Germany",
    skills: ["Python", "SQL", "Power BI", "Excel", "Tableau"],
    certifications: "Microsoft PL-300 (Power BI)", careerGoal: "Get a higher salary",
    targetRoles: "Senior Data Analyst, Data Engineer, Analytics Manager", targetIndustries: "Automotive, Finance, Consulting",
    employmentType: "Full-time", preferredLocation: "Munich, Frankfurt",
    openToRelocation: "No", salaryRange: "€60k–€80k",
    targetCompanies: "McKinsey, Siemens, SAP", germanLevel: "C2 – Proficient / Native",
    drivingLicense: "Yes", hearAboutUs: "Google / Search", additionalNotes: "",
    hasCv: true, hasCoverLetter: false,
  },
  {
    id: "3", name: "Lisa Müller", initials: "LM", email: "lisa.mueller@example.com", phone: "+49 151 5554321",
    linkedin: "linkedin.com/in/lisa-mueller", plan: "Premium", applicationsUsed: 62, applicationsTotal: 400,
    status: "Active", joined: "Jan 10, 2026", dob: "1991-11-03", address: "Kaiserstraße 8, 60311 Frankfurt",
    placeOfBirth: "Frankfurt, Germany", currentTitle: "Software Engineer", employer: "Deutsche Bank",
    field: "Software Development", yearsExp: "6–10 years", workedInGermany: "Currently working there",
    currentSalary: "85,000", noticePeriod: "3 months", educationLevel: "Master's Degree",
    degreeTitle: "M.Sc. Computer Science", university: "Goethe University Frankfurt", universityLocation: "Frankfurt, Germany",
    skills: ["Java", "Spring Boot", "Kubernetes", "AWS", "React"],
    certifications: "AWS Certified Developer – Associate", careerGoal: "Work remotely",
    targetRoles: "Senior Backend Engineer, Tech Lead, Staff Engineer", targetIndustries: "FinTech, Cloud, SaaS",
    employmentType: "Full-time", preferredLocation: "Berlin, Remote",
    openToRelocation: "Yes — open to anywhere", salaryRange: "€100k+",
    targetCompanies: "Stripe, Adyen, Celonis", germanLevel: "C2 – Proficient / Native",
    drivingLicense: "No", hearAboutUs: "LinkedIn", additionalNotes: "Prefers fully remote. Strong preference for international teams.",
    hasCv: true, hasCoverLetter: true,
  },
  {
    id: "4", name: "Peter Fischer", initials: "PF", email: "p.fischer@example.com", phone: "+49 172 3456789",
    linkedin: "linkedin.com/in/peter-fischer-dev", plan: "Ultimate", applicationsUsed: 12, applicationsTotal: 0,
    status: "Active", joined: "Jan 5, 2026", dob: "1985-02-14", address: "Königsallee 22, 40212 Düsseldorf",
    placeOfBirth: "Cologne, Germany", currentTitle: "Engineering Manager", employer: "Vodafone Germany",
    field: "Software Engineering", yearsExp: "10+ years", workedInGermany: "Currently working there",
    currentSalary: "115,000", noticePeriod: "3+ months", educationLevel: "Master's Degree",
    degreeTitle: "M.Sc. Electrical Engineering", university: "RWTH Aachen", universityLocation: "Aachen, Germany",
    skills: ["Team Leadership", "System Architecture", "Python", "Go", "Agile / Scrum"],
    certifications: "PMP, AWS Solutions Architect", careerGoal: "Get promoted",
    targetRoles: "Director of Engineering, VP Engineering, CTO", targetIndustries: "Telecommunications, Cloud, Scale-up",
    employmentType: "Full-time", preferredLocation: "Berlin, Düsseldorf, Hamburg",
    openToRelocation: "Yes — open to anywhere", salaryRange: "€100k+",
    targetCompanies: "Amazon, Google, Klarna", germanLevel: "C2 – Proficient / Native",
    drivingLicense: "Yes", hearAboutUs: "Friend / Referral", additionalNotes: "Looking for executive track only.",
    hasCv: true, hasCoverLetter: true,
  },
  {
    id: "5", name: "Maria Becker", initials: "MB", email: "maria.becker@example.com", phone: "+49 163 8765432",
    linkedin: "linkedin.com/in/maria-becker", plan: "Basic", applicationsUsed: 3, applicationsTotal: 200,
    status: "New", joined: "Mar 7, 2026", dob: "1997-09-22", address: "Lindenstraße 3, 20099 Hamburg",
    placeOfBirth: "Hamburg, Germany", currentTitle: "Marketing Coordinator", employer: "Otto Group",
    field: "Marketing", yearsExp: "1–2 years", workedInGermany: "Currently working there",
    currentSalary: "38,000", noticePeriod: "2 weeks", educationLevel: "Bachelor's Degree",
    degreeTitle: "B.A. Marketing & Communication", university: "Hamburg University of Applied Sciences",
    universityLocation: "Hamburg, Germany",
    skills: ["Social Media", "Content Marketing", "Google Ads", "Canva", "Copywriting"],
    certifications: "Google Ads Certification", careerGoal: "Get a higher salary",
    targetRoles: "Marketing Manager, Digital Marketing Specialist, Growth Manager", targetIndustries: "E-Commerce, FMCG, Media",
    employmentType: "Full-time", preferredLocation: "Hamburg, Berlin",
    openToRelocation: "Yes — specific cities only", salaryRange: "€45k–€60k",
    targetCompanies: "About You, Rewe, Bertelsmann", germanLevel: "C2 – Proficient / Native",
    drivingLicense: "Yes", hearAboutUs: "Instagram", additionalNotes: "",
    hasCv: true, hasCoverLetter: false,
  },
  {
    id: "6", name: "Hans Schulz", initials: "HS", email: "hans.schulz@example.com", phone: "+49 179 2345678",
    linkedin: "linkedin.com/in/hans-schulz", plan: "Standard", applicationsUsed: 45, applicationsTotal: 300,
    status: "Inactive", joined: "Dec 1, 2025", dob: "1980-05-30", address: "Augustusplatz 7, 04109 Leipzig",
    placeOfBirth: "Leipzig, Germany", currentTitle: "Project Manager", employer: "Siemens AG",
    field: "Project Management", yearsExp: "10+ years", workedInGermany: "Currently working there",
    currentSalary: "90,000", noticePeriod: "3 months", educationLevel: "Bachelor's Degree",
    degreeTitle: "B.Eng. Industrial Engineering", university: "University of Leipzig", universityLocation: "Leipzig, Germany",
    skills: ["PRINCE2", "MS Project", "Risk Management", "Stakeholder Management", "SAP"],
    certifications: "PMP, PRINCE2 Practitioner", careerGoal: "Find more stability",
    targetRoles: "Senior PM, Programme Manager, Operations Director", targetIndustries: "Manufacturing, Energy, Infrastructure",
    employmentType: "Full-time", preferredLocation: "Leipzig, Berlin, Dresden",
    openToRelocation: "Yes — specific cities only", salaryRange: "€80k–€100k",
    targetCompanies: "Bosch, BASF, Bayer", germanLevel: "C2 – Proficient / Native",
    drivingLicense: "Yes", hearAboutUs: "Job Board", additionalNotes: "Pause requested due to personal reasons.",
    hasCv: true, hasCoverLetter: true,
  },
];

const planColors: Record<string, string> = {
  Basic: "bg-secondary/80 text-secondary-foreground",
  Standard: "bg-[hsl(210_80%_52%/0.15)] text-[hsl(210_80%_62%)]",
  Premium: "bg-primary/10 text-primary",
  Ultimate: "bg-[hsl(38_92%_50%/0.15)] text-[hsl(38_92%_60%)]",
};

const statusColors: Record<string, string> = {
  Active: "bg-[hsl(152_60%_42%/0.15)] text-[hsl(152_60%_52%)]",
  New: "bg-primary/10 text-primary",
  Inactive: "bg-muted text-muted-foreground",
  "On Hold": "bg-[hsl(38_92%_50%/0.15)] text-[hsl(38_92%_60%)]",
};

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  value ? (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground font-medium">{value}</p>
      </div>
    </div>
  ) : null
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 mt-6 first:mt-0">{children}</h3>
);

const QA = ({ q, a }: { q: string; a: string }) => (
  a ? (
    <div className="py-3 border-b border-border last:border-0">
      <p className="text-xs text-muted-foreground mb-1">{q}</p>
      <p className="text-sm text-foreground">{a}</p>
    </div>
  ) : null
);

const Candidates = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Candidate>(candidates[0]);

  const filtered = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const usedPct = selected.applicationsTotal > 0
    ? Math.round((selected.applicationsUsed / selected.applicationsTotal) * 100)
    : 100;

  return (
    <div className="flex h-full gap-0 -m-6 overflow-hidden" style={{ height: "calc(100vh - 48px)" }}>
      {/* ── Left: Candidate List ── */}
      <div className="w-72 shrink-0 border-r border-border flex flex-col bg-card">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search candidates…"
              className="pl-9 h-9 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{filtered.length} candidates</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className={`w-full text-left px-4 py-3 border-b border-border transition-colors flex items-start gap-3 group ${
                selected.id === c.id ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-secondary/40"
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                selected.id === c.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}>
                {c.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                  <ChevronRight className={`h-3.5 w-3.5 shrink-0 transition-opacity ${selected.id === c.id ? "text-primary opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-60"}`} />
                </div>
                <p className="text-xs text-muted-foreground truncate">{c.currentTitle}</p>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${planColors[c.plan]}`}>{c.plan}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusColors[c.status]}`}>{c.status}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: Detail Pane ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col overflow-hidden bg-background"
        >
          {/* Candidate header */}
          <div className="px-6 py-5 border-b border-border bg-card shrink-0">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-base font-bold text-primary shrink-0">
                {selected.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-display text-xl font-bold text-foreground">{selected.name}</h1>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[selected.status]}`}>
                    {selected.status}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planColors[selected.plan]}`}>
                    {selected.plan} Plan
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{selected.currentTitle} · {selected.employer}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{selected.email}</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{selected.phone}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Joined {selected.joined}</span>
                </div>
              </div>
              {/* Usage pill */}
              {selected.applicationsTotal > 0 && (
                <div className="shrink-0 text-right">
                  <p className="text-xs text-muted-foreground mb-1">Applications used</p>
                  <p className="font-display text-lg font-bold text-primary">{selected.applicationsUsed}<span className="text-xs text-muted-foreground font-normal">/{selected.applicationsTotal}</span></p>
                  <div className="w-28 mt-1">
                    <Progress value={usedPct} className="h-1.5 rounded-full" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue="profile" className="h-full flex flex-col">
              <div className="px-6 pt-4 border-b border-border shrink-0">
                <TabsList>
                  <TabsTrigger value="profile" className="gap-1.5">
                    <User className="h-3.5 w-3.5" /> Profile
                  </TabsTrigger>
                  <TabsTrigger value="onboarding" className="gap-1.5">
                    <Target className="h-3.5 w-3.5" /> Onboarding
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="gap-1.5">
                    <FileText className="h-3.5 w-3.5" /> Documents
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* ── Profile Tab ── */}
              <TabsContent value="profile" className="flex-1 overflow-y-auto p-6 mt-0">
                <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
                  <div>
                    <SectionTitle>Personal Details</SectionTitle>
                    <div className="space-y-4">
                      <InfoRow icon={Calendar} label="Date of Birth" value={selected.dob} />
                      <InfoRow icon={MapPin} label="Place of Birth" value={selected.placeOfBirth} />
                      <InfoRow icon={MapPin} label="Address" value={selected.address} />
                      <InfoRow icon={Mail} label="Email" value={selected.email} />
                      <InfoRow icon={Phone} label="Phone" value={selected.phone} />
                      <InfoRow icon={Linkedin} label="LinkedIn" value={selected.linkedin} />
                    </div>

                    <SectionTitle>Education</SectionTitle>
                    <div className="space-y-4">
                      <InfoRow icon={GraduationCap} label="Highest Level" value={selected.educationLevel} />
                      <InfoRow icon={GraduationCap} label="Degree" value={selected.degreeTitle} />
                      <InfoRow icon={GraduationCap} label="University" value={selected.university} />
                      <InfoRow icon={MapPin} label="University Location" value={selected.universityLocation} />
                    </div>
                  </div>

                  <div>
                    <SectionTitle>Professional Background</SectionTitle>
                    <div className="space-y-4">
                      <InfoRow icon={Briefcase} label="Current / Last Title" value={selected.currentTitle} />
                      <InfoRow icon={Briefcase} label="Employer" value={selected.employer} />
                      <InfoRow icon={Globe} label="Field" value={selected.field} />
                      <InfoRow icon={Star} label="Years of Experience" value={selected.yearsExp} />
                      <InfoRow icon={CheckCircle} label="Worked in Germany" value={selected.workedInGermany} />
                      <InfoRow icon={Briefcase} label="Current Salary (EUR)" value={`€${selected.currentSalary}`} />
                      <InfoRow icon={Calendar} label="Notice Period" value={selected.noticePeriod} />
                    </div>

                    <SectionTitle>Skills</SectionTitle>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selected.skills.map((s) => (
                        <span key={s} className="text-xs font-medium bg-primary/10 text-primary rounded-full px-2.5 py-1 border border-primary/20">
                          {s}
                        </span>
                      ))}
                    </div>
                    {selected.certifications && (
                      <div className="flex items-start gap-2 mt-2">
                        <Award className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Certifications</p>
                          <p className="text-sm text-foreground font-medium">{selected.certifications}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* ── Onboarding Tab ── */}
              <TabsContent value="onboarding" className="flex-1 overflow-y-auto p-6 mt-0">
                <div className="max-w-2xl">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <SectionTitle>Career Goals</SectionTitle>
                    <QA q="Primary career goal" a={selected.careerGoal} />
                    <QA q="Target roles / job titles" a={selected.targetRoles} />
                    <QA q="Target industries" a={selected.targetIndustries} />
                    <QA q="Type of employment" a={selected.employmentType} />

                    <SectionTitle>Location & Preferences</SectionTitle>
                    <QA q="Preferred job location" a={selected.preferredLocation} />
                    <QA q="Open to relocation" a={selected.openToRelocation} />
                    <QA q="Preferred salary range" a={selected.salaryRange} />
                    <QA q="Specific target companies" a={selected.targetCompanies || "None specified"} />

                    <SectionTitle>Language & Credentials</SectionTitle>
                    <QA q="German language level" a={selected.germanLevel} />
                    <QA q="Valid driving license" a={selected.drivingLicense} />

                    <SectionTitle>Additional Information</SectionTitle>
                    <QA q="How did you hear about us" a={selected.hearAboutUs} />
                    <QA q="Additional notes" a={selected.additionalNotes || "None provided"} />
                  </div>
                </div>
              </TabsContent>

              {/* ── Documents Tab ── */}
              <TabsContent value="documents" className="flex-1 overflow-y-auto p-6 mt-0">
                <div className="max-w-xl space-y-3">
                  <div className={`rounded-2xl border p-5 flex items-center gap-4 ${selected.hasCv ? "border-border bg-card" : "border-dashed border-border bg-card/50 opacity-60"}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selected.hasCv ? "bg-primary/10 border border-primary/20" : "bg-secondary"}`}>
                      <FileText className={`h-5 w-5 ${selected.hasCv ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">Curriculum Vitae</p>
                      {selected.hasCv ? (
                        <p className="text-xs text-muted-foreground">CV_{selected.name.replace(" ", "_")}.pdf · 245 KB · Uploaded {selected.joined}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Not yet uploaded</p>
                      )}
                    </div>
                    {selected.hasCv ? (
                      <Button variant="outline" size="sm" className="shrink-0 gap-1.5 rounded-full">
                        <Download className="h-3.5 w-3.5" /> Download
                      </Button>
                    ) : (
                      <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </div>

                  <div className={`rounded-2xl border p-5 flex items-center gap-4 ${selected.hasCoverLetter ? "border-border bg-card" : "border-dashed border-border bg-card/50 opacity-60"}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selected.hasCoverLetter ? "bg-primary/10 border border-primary/20" : "bg-secondary"}`}>
                      <FileText className={`h-5 w-5 ${selected.hasCoverLetter ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">Cover Letter</p>
                      {selected.hasCoverLetter ? (
                        <p className="text-xs text-muted-foreground">CL_{selected.name.replace(" ", "_")}.pdf · 128 KB · Uploaded {selected.joined}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Not yet uploaded</p>
                      )}
                    </div>
                    {selected.hasCoverLetter ? (
                      <Button variant="outline" size="sm" className="shrink-0 gap-1.5 rounded-full">
                        <Download className="h-3.5 w-3.5" /> Download
                      </Button>
                    ) : (
                      <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </div>

                  <div className="rounded-2xl border border-dashed border-border bg-card/50 p-5 flex items-center gap-4 opacity-60">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-secondary">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">LinkedIn Profile PDF</p>
                      <p className="text-xs text-muted-foreground">Not yet uploaded</p>
                    </div>
                    <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Candidates;
