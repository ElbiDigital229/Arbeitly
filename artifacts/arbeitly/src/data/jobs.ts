export type JobSource = "LinkedIn" | "Indeed" | "Google Jobs" | "StepStone" | "XING" | "Manual";

export type JobListing = {
  id: string;
  title: string;
  company: string;
  location: string;
  source: JobSource;
  url: string;
  dateDiscovered: string;
  description: string;
  skills: string[];
  salaryRange: string;
};

export const seedJobs: JobListing[] = [
  {
    id: "j1", title: "Senior UX Designer", company: "N26", location: "Berlin (Hybrid)",
    source: "LinkedIn", url: "https://n26.com/careers/ux-designer", dateDiscovered: "2026-03-12",
    description: "Join our design team to create user-centred experiences for 8M+ customers across mobile and web. Own the end-to-end design process for key product areas alongside product and engineering.",
    skills: ["Figma", "UX Research", "Design Systems", "Prototyping", "HTML/CSS"],
    salaryRange: "€80k–€95k",
  },
  {
    id: "j2", title: "Full Stack Engineer", company: "BMW Group", location: "Munich",
    source: "Indeed", url: "https://bmw-group.com/jobs/fullstack", dateDiscovered: "2026-03-12",
    description: "Build and maintain scalable web applications for BMW's internal platforms. Work with React on the frontend and Java Spring Boot on the backend in an agile product team.",
    skills: ["React", "Java", "Spring Boot", "AWS", "Kubernetes"],
    salaryRange: "€90k–€110k",
  },
  {
    id: "j3", title: "Senior Data Analyst", company: "McKinsey & Company", location: "Frankfurt",
    source: "LinkedIn", url: "https://mckinsey.com/careers/analyst", dateDiscovered: "2026-03-11",
    description: "Deliver data-driven insights for C-suite clients across financial services and automotive. Requires strong SQL, Python, and visualisation skills to translate data into clear stories.",
    skills: ["Python", "SQL", "Tableau", "Power BI", "Excel"],
    salaryRange: "€75k–€90k",
  },
  {
    id: "j4", title: "Software Architect", company: "Allianz", location: "Munich",
    source: "Google Jobs", url: "https://allianz.com/careers/architect", dateDiscovered: "2026-03-11",
    description: "Design and evolve cloud-native architecture for Allianz Digital. Lead technical decision-making for a cross-functional team of 12 engineers and define the long-term platform roadmap.",
    skills: ["System Architecture", "AWS", "Go", "Python", "Team Leadership"],
    salaryRange: "€100k–€125k",
  },
  {
    id: "j5", title: "Growth Marketing Manager", company: "About You", location: "Hamburg",
    source: "XING", url: "https://aboutyou.com/careers/marketing", dateDiscovered: "2026-03-10",
    description: "Drive user acquisition and retention through data-driven campaigns. Own paid social, SEO, and content channels. Report directly to the CMO and manage a €500k quarterly budget.",
    skills: ["Google Ads", "Social Media", "Content Marketing", "Copywriting", "Canva"],
    salaryRange: "€45k–€60k",
  },
  {
    id: "j6", title: "Programme Manager", company: "Bosch", location: "Stuttgart",
    source: "StepStone", url: "https://bosch.com/careers/programme-manager", dateDiscovered: "2026-03-10",
    description: "Lead cross-functional programmes in Bosch's manufacturing division. Coordinate 3+ projects simultaneously. Strong PRINCE2, MS Project, and SAP experience required.",
    skills: ["PRINCE2", "MS Project", "Stakeholder Management", "Risk Management", "SAP"],
    salaryRange: "€80k–€100k",
  },
  {
    id: "j7", title: "Backend Engineer (Go)", company: "Celonis", location: "Munich / Remote",
    source: "LinkedIn", url: "https://celonis.com/careers/backend-go", dateDiscovered: "2026-03-09",
    description: "Build high-throughput data processing systems in Go for Celonis's process mining platform. Work in a product team shipping features used daily by Fortune 500 companies.",
    skills: ["Go", "AWS", "Kubernetes", "System Architecture", "Python"],
    salaryRange: "€95k–€115k",
  },
  {
    id: "j8", title: "Tech Lead – Platform", company: "Personio", location: "Munich / Berlin",
    source: "LinkedIn", url: "https://personio.com/careers/tech-lead", dateDiscovered: "2026-03-09",
    description: "Lead a team of 6 engineers building Personio's core HR platform. Set technical direction, run architecture reviews, and mentor engineers. React, Java, and strong agile skills required.",
    skills: ["Team Leadership", "System Architecture", "Agile / Scrum", "React", "Java"],
    salaryRange: "€110k–€130k",
  },
];

export function computeScore(jobSkills: string[], candidateSkills: string[]): number {
  if (jobSkills.length === 0) return 0;
  const lower = candidateSkills.map((s) => s.toLowerCase());
  const matches = jobSkills.filter((s) => lower.includes(s.toLowerCase())).length;
  return Math.round((matches / jobSkills.length) * 100);
}

export const sourceBadgeColors: Record<JobSource, string> = {
  LinkedIn: "bg-[#0077B5]/15 text-[#0077B5]",
  Indeed: "bg-[#2557A7]/15 text-[#5580cc]",
  "Google Jobs": "bg-[#EA4335]/15 text-[#EA4335]",
  StepStone: "bg-[#E8650A]/15 text-[#E8650A]",
  XING: "bg-[#006567]/15 text-[#00a0a0]",
  Manual: "bg-primary/15 text-primary",
};

export function scoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-muted-foreground";
}

export function scoreBarColor(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-warning";
  return "bg-muted-foreground";
}
