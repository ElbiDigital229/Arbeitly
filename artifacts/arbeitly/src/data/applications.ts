// ─── Shared application types & seed data ────────────────────────────────────

export type ApplicationStatus = "to-apply" | "applied" | "interview" | "offer" | "rejected";

export type Application = {
  id: string;
  candidate: string;
  job: string;
  company: string;
  cvVersion: string;
  status: ApplicationStatus;
  datePosted: string;
  jobUrl: string;
  jdScreenshot?: string;
  dateSubmitted: string;
  salaryExpectation: string;
  notes: string;
  date: string;
};

export const statusLabels: Record<ApplicationStatus, string> = {
  "to-apply": "To Apply",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

export const statusColors: Record<ApplicationStatus, string> = {
  "to-apply": "bg-muted text-muted-foreground",
  applied: "bg-[hsl(210_80%_52%/0.15)] text-[hsl(210_80%_62%)]",
  interview: "bg-[hsl(38_92%_50%/0.15)] text-[hsl(38_92%_60%)]",
  offer: "bg-[hsl(152_60%_42%/0.15)] text-[hsl(152_60%_52%)]",
  rejected: "bg-[hsl(0_72%_51%/0.15)] text-[hsl(0_72%_61%)]",
};

export const candidateNames = [
  "Anna Schmidt", "Thomas Wagner", "Lisa Müller",
  "Peter Fischer", "Maria Becker", "Hans Schulz",
];

export const initialApplications: Application[] = [
  {
    id: "1", status: "to-apply", candidate: "Anna Schmidt", job: "DevOps Engineer", company: "Bosch",
    cvVersion: "v3", date: "Mar 8",
    datePosted: "2026-03-06", dateSubmitted: "", salaryExpectation: "€90k–€105k",
    jobUrl: "https://bosch.com/careers/devops-engineer",
    notes: "Great match for Anna's cloud background. Apply before March 15.",
  },
  {
    id: "2", status: "to-apply", candidate: "Thomas Wagner", job: "Cloud Architect", company: "SAP SE",
    cvVersion: "v3", date: "Mar 7",
    datePosted: "2026-03-05", dateSubmitted: "", salaryExpectation: "€95k–€115k",
    jobUrl: "https://sap.com/jobs/cloud-architect",
    notes: "Strong requirement for AWS which Thomas has. Worth applying.",
  },
  {
    id: "3", status: "to-apply", candidate: "Lisa Müller", job: "Data Engineer", company: "Zalando",
    cvVersion: "v2", date: "Mar 7",
    datePosted: "2026-03-04", dateSubmitted: "", salaryExpectation: "€100k+",
    jobUrl: "https://jobs.zalando.com/data-engineer",
    notes: "Remote-friendly role. Lisa's target company.",
  },
  {
    id: "4", status: "applied", candidate: "Anna Schmidt", job: "Senior Frontend Dev", company: "SAP SE",
    cvVersion: "v3", date: "Mar 6",
    datePosted: "2026-03-01", dateSubmitted: "2026-03-06", salaryExpectation: "€85k–€100k",
    jobUrl: "https://sap.com/jobs/senior-frontend",
    notes: "Applied via LinkedIn. Awaiting response.",
  },
  {
    id: "5", status: "applied", candidate: "Peter Fischer", job: "React Developer", company: "Siemens",
    cvVersion: "v2", date: "Mar 1",
    datePosted: "2026-02-28", dateSubmitted: "2026-03-01", salaryExpectation: "€120k+",
    jobUrl: "https://siemens.com/jobs/react-developer",
    notes: "",
  },
  {
    id: "6", status: "applied", candidate: "Thomas Wagner", job: "Backend Engineer", company: "Deutsche Bank",
    cvVersion: "v3", date: "Feb 20",
    datePosted: "2026-02-18", dateSubmitted: "2026-02-20", salaryExpectation: "€70k–€85k",
    jobUrl: "https://db.com/careers/backend-engineer",
    notes: "Applied through referral from colleague.",
  },
  {
    id: "7", status: "applied", candidate: "Maria Becker", job: "Platform Engineer", company: "BMW Group",
    cvVersion: "v2", date: "Feb 18",
    datePosted: "2026-02-15", dateSubmitted: "2026-02-18", salaryExpectation: "€50k–€60k",
    jobUrl: "https://bmw-group.com/jobs/platform-engineer",
    notes: "",
  },
  {
    id: "8", status: "interview", candidate: "Anna Schmidt", job: "Full Stack Engineer", company: "BMW Group",
    cvVersion: "v3", date: "Mar 4",
    datePosted: "2026-02-20", dateSubmitted: "2026-02-25", salaryExpectation: "€90k–€105k",
    jobUrl: "https://bmw-group.com/jobs/fullstack",
    notes: "Interview scheduled for March 12. Technical round.",
  },
  {
    id: "9", status: "interview", candidate: "Lisa Müller", job: "Tech Lead", company: "Infineon",
    cvVersion: "v3", date: "Feb 25",
    datePosted: "2026-02-10", dateSubmitted: "2026-02-15", salaryExpectation: "€100k+",
    jobUrl: "https://infineon.com/careers/tech-lead",
    notes: "2nd round interview pending. Good feedback from hiring manager.",
  },
  {
    id: "10", status: "offer", candidate: "Peter Fischer", job: "Tech Lead", company: "Bosch",
    cvVersion: "v1", date: "Feb 25",
    datePosted: "2026-02-05", dateSubmitted: "2026-02-10", salaryExpectation: "€120k+",
    jobUrl: "https://bosch.com/careers/tech-lead",
    notes: "Offer received: €125k base + bonus. Reviewing contract.",
  },
  {
    id: "11", status: "rejected", candidate: "Thomas Wagner", job: "Software Architect", company: "Allianz",
    cvVersion: "v2", date: "Feb 28",
    datePosted: "2026-02-01", dateSubmitted: "2026-02-10", salaryExpectation: "€80k–€95k",
    jobUrl: "https://allianz.com/careers/software-architect",
    notes: "Rejected after technical screen. Lacking cloud certifications.",
  },
  {
    id: "12", status: "rejected", candidate: "Maria Becker", job: "SRE Engineer", company: "Delivery Hero",
    cvVersion: "v1", date: "Feb 15",
    datePosted: "2026-01-28", dateSubmitted: "2026-02-01", salaryExpectation: "€50k–€60k",
    jobUrl: "https://deliveryhero.com/careers/sre",
    notes: "Overqualified note in rejection. Try a different role.",
  },
];
