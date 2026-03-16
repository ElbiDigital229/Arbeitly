import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RichTextEditor from "@/components/editor/RichTextEditor";
import PdfExportDialog from "@/components/editor/PdfExportDialog";
import AddJobDialog from "@/components/dialogs/AddJobDialog";
import { useApplications } from "@/context/ApplicationsContext";
import { statusLabels, statusColors as appStatusColors } from "@/data/applications";
import type { Application, ApplicationStatus } from "@/data/applications";
import { useToast } from "@/hooks/use-toast";
import {
  Search, User, Mail, Phone, Linkedin, MapPin, Calendar, Briefcase,
  GraduationCap, Target, FileText, Download, CheckCircle, AlertCircle,
  Globe, Star, Award, ChevronRight, Sparkles, Clock, Copy, Check,
  Wand2, Loader2, Save, ExternalLink, Image, Plus, Eye, EyeOff,
  KeyRound, Shield, Pencil, Zap, Building, ChevronDown, ChevronUp,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import {
  type JobListing,
  seedJobs, computeScore, sourceBadgeColors, scoreColor, scoreBarColor,
} from "@/data/jobs";

// ─── Types ───────────────────────────────────────────────────────────────────

type DocVersion = {
  id: string;
  label: string;
  sublabel: string;
  type: "original" | "improved";
  date: string;
  content: string;
};

type Candidate = {
  id: string; name: string; initials: string; email: string; phone: string;
  linkedin: string; plan: "Basic" | "Standard" | "Premium" | "Ultimate";
  applicationsUsed: number; applicationsTotal: number;
  status: "Active" | "New" | "Inactive" | "On Hold";
  joined: string; dob: string; address: string; placeOfBirth: string;
  currentTitle: string; employer: string; field: string; yearsExp: string;
  workedInGermany: string; currentSalary: string; noticePeriod: string;
  educationLevel: string; degreeTitle: string; university: string;
  universityLocation: string; skills: string[]; certifications: string;
  careerGoal: string; targetRoles: string; targetIndustries: string;
  employmentType: string; preferredLocation: string; openToRelocation: string;
  salaryRange: string; targetCompanies: string; germanLevel: string;
  drivingLicense: string; hearAboutUs: string; additionalNotes: string;
  hasCv: boolean; hasCoverLetter: boolean;
  appEmail: string; appEmailPassword: string; appEmailNotes: string;
};

// ─── Mock document versions ───────────────────────────────────────────────────

const cvVersions: Record<string, DocVersion[]> = {
  "1": [
    {
      id: "v1", label: "Version 1", sublabel: "Original upload", type: "original", date: "Feb 15, 2026",
      content: `ANNA SCHMIDT
anna.schmidt@example.com  |  +49 170 1234567  |  Berlin, Germany
linkedin.com/in/anna-schmidt

EXPERIENCE

Senior UX Designer — Zalando SE, Berlin  (2022 – Present)
- Designed user interfaces for checkout and product pages
- Ran user research and usability tests
- Worked with developers and product managers

UX Designer — Freelance  (2020 – 2022)
- Various client projects across e-commerce and SaaS
- Produced wireframes, mockups and prototypes

EDUCATION

M.A. Communication Design — UdK Berlin  (2018)
B.A. Graphic Design — HTW Berlin  (2016)

SKILLS
Figma, Sketch, Adobe XD, HTML/CSS, User Research, Prototyping`,
    },
    {
      id: "v2", label: "Version 2", sublabel: "AI-improved · ATS-optimised", type: "improved", date: "Feb 17, 2026",
      content: `ANNA SCHMIDT
Senior UX Designer & Design Systems Lead
anna.schmidt@example.com  |  +49 170 1234567  |  Berlin, Germany
linkedin.com/in/anna-schmidt

PROFESSIONAL SUMMARY
Results-driven Senior UX Designer with 6+ years delivering user-centred digital products at scale for e-commerce platforms serving 50M+ users. Deep expertise in design systems, end-to-end UX research, and cross-functional product leadership. Proven track record of measurable impact on conversion and user satisfaction metrics.

PROFESSIONAL EXPERIENCE

Senior UX Designer — Zalando SE, Berlin  (Jan 2022 – Present)
• Owned UX strategy for checkout redesign, reducing cart abandonment by 18%
• Built and maintained a design system adopted across 12 product squads
• Facilitated 30+ user research sessions per quarter across diverse cohorts
• Collaborated with Engineering, Product, and Data in agile sprint ceremonies
• Mentored 2 junior designers; introduced design critique culture

UX Designer — Freelance, Remote  (Mar 2020 – Dec 2021)
• Delivered end-to-end product design for 8 SaaS and e-commerce clients
• Produced high-fidelity Figma prototypes and comprehensive design handoff docs
• Improved client NPS by an average of 22 points post-redesign

EDUCATION
M.A. Communication Design — Universität der Künste Berlin  (2018)  |  GPA 1.3
B.A. Graphic Design — HTW Berlin  (2016)  |  GPA 1.5

TECHNICAL SKILLS
Design Tools:   Figma, Sketch, Adobe XD, InVision, Principle
Front-End:      HTML5, CSS3, React (basic)
Methodologies:  Design Thinking, UX Research, Agile / Scrum, A/B Testing

CERTIFICATIONS
Google UX Design Certificate  (2022)`,
    },
  ],
  "2": [
    {
      id: "v1", label: "Version 1", sublabel: "Original upload", type: "original", date: "Feb 20, 2026",
      content: `THOMAS WAGNER
t.wagner@example.com  |  +49 176 9876543  |  Munich, Germany

EXPERIENCE

Data Analyst — BMW Group, Munich  (2021 – Present)
- Built dashboards in Power BI
- Wrote SQL queries for reporting
- Analysed sales and production data

Junior Data Analyst — KPMG  (2019 – 2021)
- Supported consulting teams with Excel and data models

EDUCATION

B.Sc. Business Informatics — LMU Munich  (2019)

SKILLS
Python, SQL, Power BI, Excel, Tableau`,
    },
    {
      id: "v2", label: "Version 2", sublabel: "AI-improved · ATS-optimised", type: "improved", date: "Feb 22, 2026",
      content: `THOMAS WAGNER
Data Analyst | Business Intelligence Specialist
t.wagner@example.com  |  +49 176 9876543  |  Munich, Germany

PROFESSIONAL SUMMARY
Analytical and detail-oriented Data Analyst with 5+ years of experience transforming complex datasets into actionable business intelligence. Skilled in Python, SQL, and Power BI, with a strong track record of building executive dashboards and optimising reporting pipelines in automotive and consulting environments.

PROFESSIONAL EXPERIENCE

Data Analyst — BMW Group, Munich  (Sep 2021 – Present)
• Developed 15+ executive Power BI dashboards tracking production KPIs across 3 plants
• Reduced monthly reporting cycle from 5 days to under 8 hours via automated SQL pipelines
• Analysed sales and production data for 6 European markets; presented findings to C-suite
• Collaborated with Finance and Operations on quarterly forecasting models

Junior Data Analyst — KPMG Advisory, Munich  (Jul 2019 – Aug 2021)
• Supported 4 client engagements across automotive and logistics sectors
• Built advanced Excel models and VBA macros saving 12+ hours per week
• Contributed to data migration and governance projects for DAX-listed clients

EDUCATION
B.Sc. Business Informatics — Ludwig Maximilian University of Munich  (2019)  |  GPA 1.7

TECHNICAL SKILLS
Languages:       Python (pandas, NumPy, matplotlib), SQL, VBA
BI Tools:        Power BI (PL-300 Certified), Tableau, SSRS
Databases:       SQL Server, PostgreSQL, Oracle
Other:           Excel (Advanced), Azure Data Factory, Git

CERTIFICATIONS
Microsoft Power BI Data Analyst (PL-300)  ·  2023`,
    },
  ],
  "3": [
    {
      id: "v1", label: "Version 1", sublabel: "Original upload", type: "original", date: "Jan 10, 2026",
      content: `LISA MÜLLER
lisa.mueller@example.com  |  +49 151 5554321  |  Frankfurt, Germany

EXPERIENCE

Software Engineer — Deutsche Bank, Frankfurt  (2019 – Present)
- Backend development in Java and Spring Boot
- Worked on banking APIs and microservices
- Deployed services to Kubernetes on AWS

Software Engineer — Freelance  (2017 – 2019)
- Built web apps for small businesses

EDUCATION

M.Sc. Computer Science — Goethe University Frankfurt  (2017)
B.Sc. Computer Science — Goethe University Frankfurt  (2015)

SKILLS
Java, Spring Boot, Kubernetes, AWS, React, PostgreSQL`,
    },
    {
      id: "v2", label: "Version 2", sublabel: "AI-improved · ATS-optimised", type: "improved", date: "Jan 12, 2026",
      content: `LISA MÜLLER
Senior Software Engineer | Cloud & Backend Specialist
lisa.mueller@example.com  |  +49 151 5554321  |  Frankfurt, Germany

PROFESSIONAL SUMMARY
Senior Software Engineer with 8+ years of experience building scalable, cloud-native backend systems in high-stakes financial environments. Expert in Java, Spring Boot, and AWS; proven ability to lead cross-team technical initiatives and deliver complex microservices architecture in regulated industries.

PROFESSIONAL EXPERIENCE

Senior Software Engineer — Deutsche Bank AG, Frankfurt  (Mar 2019 – Present)
• Architected and maintained 12 REST and gRPC microservices handling 2M+ daily transactions
• Led migration of monolithic trading platform to Kubernetes (EKS), reducing deployment time by 60%
• Implemented CI/CD pipelines via GitHub Actions; reduced release cycle from bi-weekly to daily
• Collaborated with InfoSec on PCI-DSS compliance for payment processing APIs
• Mentored 3 junior engineers; introduced TDD practices across the team

Software Engineer — Freelance, Remote  (Jun 2017 – Feb 2019)
• Designed and delivered full-stack web applications for 5 SME clients (React + Spring Boot)
• Integrated third-party payment and CRM APIs; built automated testing suites (JUnit, Mockito)

EDUCATION
M.Sc. Computer Science — Goethe University Frankfurt  (2017)  |  GPA 1.2
B.Sc. Computer Science — Goethe University Frankfurt  (2015)  |  GPA 1.4

TECHNICAL SKILLS
Languages:    Java 17, TypeScript, Python, SQL, Bash
Frameworks:   Spring Boot, React, Hibernate, Testcontainers
Cloud & DevOps: AWS (EC2, EKS, Lambda, RDS), Kubernetes, Docker, Terraform
Databases:    PostgreSQL, Redis, MongoDB
Tools:        Git, Jira, Confluence, Datadog

CERTIFICATIONS
AWS Certified Developer – Associate  ·  2022`,
    },
  ],
  "4": [
    {
      id: "v1", label: "Version 1", sublabel: "Original upload", type: "original", date: "Jan 5, 2026",
      content: `PETER FISCHER
p.fischer@example.com  |  +49 172 3456789  |  Düsseldorf, Germany

EXPERIENCE

Engineering Manager — Vodafone Germany  (2018 – Present)
- Led a team of 12 engineers
- Managed roadmap and stakeholders
- Worked on network software projects

Senior Engineer — Nokia Networks  (2013 – 2018)
- Software development for telecoms

EDUCATION

M.Sc. Electrical Engineering — RWTH Aachen  (2010)

SKILLS
Team Leadership, Python, Go, System Architecture, Agile`,
    },
    {
      id: "v2", label: "Version 2", sublabel: "AI-improved · ATS-optimised", type: "improved", date: "Jan 8, 2026",
      content: `PETER FISCHER
Engineering Manager | Technology Executive
p.fischer@example.com  |  +49 172 3456789  |  Düsseldorf, Germany

PROFESSIONAL SUMMARY
Strategic Engineering Manager with 15+ years in software and telecommunications, including 6 years leading high-performing engineering organisations. Proven expertise in scaling teams, delivering large-scale distributed systems, and aligning engineering strategy with business goals at enterprise level.

PROFESSIONAL EXPERIENCE

Engineering Manager — Vodafone Germany, Düsseldorf  (Apr 2018 – Present)
• Led cross-functional engineering organisation of 35 engineers across 3 squads
• Delivered €12M network automation platform, reducing manual ops costs by 40%
• Defined and executed 3-year technology roadmap aligned with group CTO strategy
• Drove adoption of OKR framework; improved on-time delivery rate from 62% to 88%
• Recruited and onboarded 18 engineers; maintained < 8% annual attrition

Senior Software Engineer — Nokia Networks, Munich  (Sep 2013 – Mar 2018)
• Led backend development for 4G/5G network management software (Go, Python)
• Reduced core network downtime by 30% through predictive monitoring tools
• Represented engineering in client-facing technical workshops across 6 countries

EDUCATION
M.Sc. Electrical Engineering & IT — RWTH Aachen University  (2010)  |  GPA 1.4

TECHNICAL SKILLS
Leadership:   Engineering Management, OKRs, Hiring, Performance Reviews
Languages:    Python, Go, Bash, SQL
Platforms:    AWS, Azure, Kubernetes, Terraform, CI/CD (Jenkins, GitHub Actions)
Methodologies: Agile, SAFe, Systems Thinking

CERTIFICATIONS
Project Management Professional (PMP)  ·  AWS Solutions Architect – Associate`,
    },
  ],
  "5": [
    {
      id: "v1", label: "Version 1", sublabel: "Original upload", type: "original", date: "Mar 7, 2026",
      content: `MARIA BECKER
maria.becker@example.com  |  +49 163 8765432  |  Hamburg, Germany

EXPERIENCE

Marketing Coordinator — Otto Group, Hamburg  (2024 – Present)
- Social media content creation
- Helped with email campaigns
- Used Google Ads for paid campaigns

Intern — Rewe Digital  (2023)
- Marketing internship

EDUCATION

B.A. Marketing & Communication — Hamburg University of Applied Sciences  (2023)

SKILLS
Social Media, Content Marketing, Google Ads, Canva, Copywriting`,
    },
    {
      id: "v2", label: "Version 2", sublabel: "AI-improved · ATS-optimised", type: "improved", date: "Mar 9, 2026",
      content: `MARIA BECKER
Marketing Coordinator | Digital Growth Specialist
maria.becker@example.com  |  +49 163 8765432  |  Hamburg, Germany

PROFESSIONAL SUMMARY
Dynamic Marketing Coordinator with 2+ years of hands-on experience in digital marketing, content creation, and performance advertising. Proficient in managing multi-channel campaigns, producing conversion-driven content, and analysing campaign metrics to drive continuous improvement.

PROFESSIONAL EXPERIENCE

Marketing Coordinator — Otto Group, Hamburg  (Feb 2024 – Present)
• Managed social media presence across Instagram, LinkedIn, and TikTok (combined reach: 280K followers)
• Produced 40+ pieces of branded content per month; average engagement rate 4.7%
• Executed Google Ads and Meta Ads campaigns with combined monthly budget of €15K; achieved 3.2x ROAS
• Coordinated email marketing campaigns to 120K subscribers via Salesforce Marketing Cloud
• Supported quarterly reporting with performance dashboards in Google Looker Studio

Marketing Intern — Rewe Digital, Cologne  (Sep 2023 – Jan 2024)
• Assisted campaign team with A/B testing copy and creative for performance ads
• Conducted competitor benchmarking and compiled weekly trend reports

EDUCATION
B.A. Marketing & Communication — Hamburg University of Applied Sciences  (2023)  |  GPA 1.8

SKILLS
Digital Marketing:  Google Ads (Certified), Meta Ads Manager, SEO/SEM
Content:            Canva, Adobe Premiere, Copywriting, Email Marketing
Analytics:          Google Analytics 4, Looker Studio, Excel
CRM / Tools:        Salesforce Marketing Cloud, HubSpot, Notion

CERTIFICATIONS
Google Ads Search Certification  ·  2024`,
    },
  ],
  "6": [
    {
      id: "v1", label: "Version 1", sublabel: "Original upload", type: "original", date: "Dec 1, 2025",
      content: `HANS SCHULZ
hans.schulz@example.com  |  +49 179 2345678  |  Leipzig, Germany

EXPERIENCE

Project Manager — Siemens AG, Leipzig  (2014 – Present)
- Managed large infrastructure projects
- Stakeholder management
- Used PRINCE2 and MS Project

Project Engineer — ThyssenKrupp  (2008 – 2014)
- Technical project support

EDUCATION

B.Eng. Industrial Engineering — University of Leipzig  (2008)

SKILLS
PRINCE2, MS Project, Risk Management, Stakeholder Management, SAP`,
    },
    {
      id: "v2", label: "Version 2", sublabel: "AI-improved · ATS-optimised", type: "improved", date: "Dec 4, 2025",
      content: `HANS SCHULZ
Senior Project Manager | Infrastructure & Operations Leader
hans.schulz@example.com  |  +49 179 2345678  |  Leipzig, Germany

PROFESSIONAL SUMMARY
Seasoned Project Manager with 15+ years delivering complex capital projects in manufacturing and infrastructure sectors. PRINCE2 Practitioner and PMP-certified professional with a consistent record of on-budget, on-schedule delivery of multi-million-euro programmes. Expert in stakeholder management, risk mitigation, and cross-functional team leadership.

PROFESSIONAL EXPERIENCE

Senior Project Manager — Siemens AG, Leipzig  (Jan 2014 – Present)
• Managed a portfolio of 6 concurrent infrastructure projects with combined budget of €42M
• Delivered flagship €18M automation programme 3 weeks ahead of schedule, saving €1.2M
• Led stakeholder governance across 40+ internal and external stakeholders
• Implemented agile-waterfall hybrid methodology, improving sprint delivery rate by 25%
• Coached and certified 4 junior PMs in PRINCE2 Foundation

Project Engineer — ThyssenKrupp Industrial Solutions, Essen  (Aug 2008 – Dec 2013)
• Provided technical project support for 3 major production plant upgrades (€5M–€10M)
• Coordinated design, procurement, and commissioning phases for cross-site projects
• Developed risk registers and mitigation plans adopted as department standard

EDUCATION
B.Eng. Industrial Engineering — University of Leipzig  (2008)  |  GPA 1.9

TECHNICAL SKILLS
PM Methodologies:  PRINCE2 Practitioner, PMP, Agile/Scrum
Tools:             MS Project, SAP PS, Jira, Confluence, PowerPoint
Financial:         Budget control, EVM, forecasting, cost-benefit analysis

CERTIFICATIONS
PMP – Project Management Professional  ·  2015
PRINCE2 Practitioner  ·  2013`,
    },
  ],
};

const clVersions: Record<string, DocVersion[]> = {
  "1": [
    {
      id: "v1", label: "Version 1", sublabel: "Original upload", type: "original", date: "Feb 15, 2026",
      content: `Anna Schmidt
anna.schmidt@example.com  |  Berlin, Germany

Dear Hiring Manager,

I am writing to apply for the position advertised on your website. I am a UX Designer with over 6 years of experience and I think I would be a great fit for your team.

In my current role at Zalando I work on user interfaces and do user research. I am good at Figma and understand what users need.

I would love to join your company and contribute to your design team. Please find my CV attached.

Best regards,
Anna Schmidt`,
    },
    {
      id: "v2", label: "Version 2", sublabel: "AI-improved · ATS-optimised", type: "improved", date: "Feb 17, 2026",
      content: `Anna Schmidt
Senior UX Designer  ·  anna.schmidt@example.com  ·  +49 170 1234567  ·  Berlin, Germany

[Date]

Dear [Hiring Manager's Name],

I am writing to express my strong interest in the Senior UX Designer position at [Company]. With six years of experience designing high-impact digital products for one of Europe's largest e-commerce platforms, I bring a combination of strategic UX thinking, design system expertise, and a passion for measurable user outcomes.

At Zalando SE, I led the end-to-end UX redesign of the checkout experience — a project that reduced cart abandonment by 18% and directly contributed to a €30M+ revenue uplift. I also built and governed a design system now adopted by 12 product squads, significantly reducing design-to-development handoff time. These experiences have made me fluent in working across ambiguous, fast-moving product environments while maintaining design quality and consistency.

What draws me to [Company] specifically is [reason related to company]. I admire your approach to [product area] and believe my background in [relevant field] positions me to contribute meaningfully from day one.

I would welcome the opportunity to discuss how my experience aligns with your team's goals. I am available for an interview at your convenience and can be reached via email or phone.

Warm regards,
Anna Schmidt`,
    },
  ],
  "2": [
    {
      id: "v1", label: "Version 1", sublabel: "Original upload", type: "original", date: "Feb 20, 2026",
      content: `Thomas Wagner
t.wagner@example.com

Dear Sir or Madam,

I would like to apply for a Senior Data Analyst position. I have been working as a Data Analyst at BMW for the past few years and I have experience with SQL, Python and Power BI.

I am a hard worker and always try to deliver good results. I am looking for a new challenge with a higher salary.

Thank you for considering my application.

Best regards,
Thomas Wagner`,
    },
    {
      id: "v2", label: "Version 2", sublabel: "AI-improved · ATS-optimised", type: "improved", date: "Feb 22, 2026",
      content: `Thomas Wagner
Data Analyst  ·  t.wagner@example.com  ·  +49 176 9876543  ·  Munich, Germany

[Date]

Dear [Hiring Manager's Name],

I am writing to apply for the Senior Data Analyst / Business Intelligence role at [Company]. With five years of analytical experience — including three years at BMW Group where I built executive-facing dashboards and automated reporting pipelines — I am confident I can add immediate value to your data team.

In my current role, I reduced BMW's monthly reporting cycle from five days to under eight hours by redesigning our SQL data pipelines and transitioning manual processes to automated workflows. I also built a suite of Power BI dashboards that track production KPIs across three manufacturing plants, used daily by senior leadership for strategic decisions.

I am particularly drawn to [Company]'s data-driven culture and your focus on [specific area]. I believe my combination of technical depth in SQL and Python with strong stakeholder communication skills — honed through regular C-suite presentations — aligns closely with what you are looking for.

I would be delighted to discuss how my background can support your analytics initiatives. Please find my CV attached for your review.

Kind regards,
Thomas Wagner`,
    },
  ],
  "3": [
    {
      id: "v1", label: "Version 1", sublabel: "Original upload", type: "original", date: "Jan 10, 2026",
      content: `Lisa Müller — Cover Letter

To whom it may concern,

I want to apply for a senior backend engineer role. I have worked at Deutsche Bank for several years as a software engineer. I know Java, Spring Boot and AWS.

I am looking for a remote role with a good salary. I think I would fit well in your engineering team.

Please see my attached CV.

Regards,
Lisa Müller`,
    },
    {
      id: "v2", label: "Version 2", sublabel: "AI-improved · ATS-optimised", type: "improved", date: "Jan 12, 2026",
      content: `Lisa Müller
Senior Software Engineer  ·  lisa.mueller@example.com  ·  +49 151 5554321  ·  Frankfurt, Germany

[Date]

Dear [Hiring Manager's Name],

I am reaching out to apply for the Senior Backend Engineer position at [Company]. With eight years of experience building production-grade microservices in Java and Spring Boot — most recently for one of Europe's largest financial institutions — I bring both the technical depth and the delivery track record that complex engineering environments demand.

At Deutsche Bank, I architected and maintain 12 REST and gRPC microservices processing over two million transactions daily. Leading our migration to Kubernetes on AWS reduced deployment times by 60% and significantly improved system reliability. I am also proud to have championed test-driven development practices that reduced production incidents by 35% across my squad.

I am actively seeking a fully remote Senior or Staff Engineer role at a product-led company, and [Company]'s engineering culture — particularly your commitment to [engineering value] — strongly resonates with me. I am eager to contribute to a team where technical rigour and engineering ownership are genuinely valued.

I would welcome a conversation about the role and how I can contribute. My CV is attached for your review.

Best regards,
Lisa Müller`,
    },
  ],
  "4": [{ id: "v1", label: "Version 1", sublabel: "Original upload", type: "original", date: "Jan 5, 2026", content: `Peter Fischer — Cover Letter\n\nDear Hiring Manager,\n\nI am an experienced Engineering Manager looking for a director-level position. I have led teams at Vodafone and Nokia for many years.\n\nI am interested in a new challenge in a growing company.\n\nBest,\nPeter Fischer` }, { id: "v2", label: "Version 2", sublabel: "AI-improved · ATS-optimised", type: "improved", date: "Jan 8, 2026", content: `Peter Fischer\nEngineering Manager  ·  p.fischer@example.com  ·  +49 172 3456789  ·  Düsseldorf, Germany\n\n[Date]\n\nDear [Hiring Manager's Name],\n\nI am writing to apply for the Director of Engineering position at [Company]. With 15 years in software and telecommunications — including six years leading engineering organisations at Vodafone Germany — I bring a unique combination of deep technical background and executive leadership experience.\n\nMy most significant achievement at Vodafone was delivering a €12M network automation platform that reduced operational costs by 40% and is now deployed across seven European markets. Beyond delivery, I rebuilt the engineering organisation from 12 to 35 engineers while maintaining under 8% annual attrition — a result I attribute to intentional culture-building, clear career frameworks, and strong technical mentorship.\n\nI am drawn to [Company] because of your trajectory and your emphasis on engineering excellence. I believe I can help you scale your teams and technical capabilities effectively while maintaining the speed and culture that makes early-stage growth exciting.\n\nI would be glad to discuss the opportunity in more detail.\n\nWarm regards,\nPeter Fischer` }],
  "5": [{ id: "v1", label: "Version 1", sublabel: "Original upload", type: "original", date: "Mar 7, 2026", content: `Maria Becker\nmaria.becker@example.com\n\nHello,\n\nI am applying for a Marketing Manager position. I work at Otto Group in marketing and I have experience with social media and Google Ads.\n\nI am a creative person and I enjoy working in teams.\n\nThank you,\nMaria Becker` }, { id: "v2", label: "Version 2", sublabel: "AI-improved · ATS-optimised", type: "improved", date: "Mar 9, 2026", content: `Maria Becker\nDigital Marketing Specialist  ·  maria.becker@example.com  ·  +49 163 8765432  ·  Hamburg, Germany\n\n[Date]\n\nDear [Hiring Manager's Name],\n\nI am writing to apply for the Marketing Manager position at [Company]. As a Digital Marketing Coordinator at Otto Group, I have built hands-on expertise in content strategy, paid advertising, and campaign analytics — and I am eager to step into a leadership role where I can drive broader marketing strategy.\n\nIn my current role, I manage social media channels reaching 280,000 followers, execute Google and Meta Ads campaigns generating a 3.2x return on ad spend, and coordinate email marketing to 120,000 subscribers. I thrive at the intersection of creativity and data — I am equally comfortable writing conversion copy and optimising campaign performance in Looker Studio.\n\nI admire [Company]'s approach to [marketing area] and I believe my energy, digital-native skill set, and genuine enthusiasm for brand building would be a strong fit for your growing marketing team.\n\nI look forward to the opportunity to discuss this further.\n\nBest regards,\nMaria Becker` }],
  "6": [{ id: "v1", label: "Version 1", sublabel: "Original upload", type: "original", date: "Dec 1, 2025", content: `Hans Schulz\nhans.schulz@example.com\n\nDear Hiring Manager,\n\nI am a Senior Project Manager with over 15 years of experience. I have worked at Siemens and ThyssenKrupp on large infrastructure projects.\n\nI am looking for a Programme Manager or Operations Director role.\n\nPlease find my CV attached.\n\nBest regards,\nHans Schulz` }, { id: "v2", label: "Version 2", sublabel: "AI-improved · ATS-optimised", type: "improved", date: "Dec 4, 2025", content: `Hans Schulz\nSenior Project Manager  ·  hans.schulz@example.com  ·  +49 179 2345678  ·  Leipzig, Germany\n\n[Date]\n\nDear [Hiring Manager's Name],\n\nI am writing to apply for the Programme Manager position at [Company]. With 15 years delivering complex capital and infrastructure programmes — most recently at Siemens AG where I managed a €42M project portfolio — I offer the strategic oversight, stakeholder leadership, and delivery rigour that large-scale programmes demand.\n\nMy proudest achievement at Siemens was steering an €18M automation programme to completion three weeks ahead of schedule, saving €1.2M in contractor costs. This required navigating 40+ stakeholders, resolving critical supply chain delays, and pivoting delivery methodology mid-project — an experience that sharpened my ability to lead under pressure while keeping teams aligned and motivated.\n\nI am drawn to [Company] because of your ambition in [sector] and your reputation for delivery excellence. I believe my PMP and PRINCE2 Practitioner credentials, combined with my hands-on experience in manufacturing and infrastructure, make me a strong fit for this role.\n\nI would welcome the opportunity to speak with you directly.\n\nKind regards,\nHans Schulz` }],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) =>
  value ? (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground font-medium">{value}</p>
      </div>
    </div>
  ) : null;

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 mt-6 first:mt-0">{children}</h3>
);

const QA = ({ q, a }: { q: string; a: string }) =>
  a ? (
    <div className="py-3 border-b border-border last:border-0">
      <p className="text-xs text-muted-foreground mb-1">{q}</p>
      <p className="text-sm text-foreground">{a}</p>
    </div>
  ) : null;

// Doc editor tab — rich text editor on left, version list on right
const DocEditorTab = ({
  versions: initialVersions,
  label,
  docType,
}: {
  versions: DocVersion[];
  label: string;
  docType?: string;
}) => {
  const [localVersions, setLocalVersions] = useState<DocVersion[]>(initialVersions);
  const [selectedId, setSelectedId] = useState(initialVersions[0]?.id ?? "v1");
  const [copied, setCopied] = useState(false);
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});

  // Enhance dialog state
  const [enhanceOpen, setEnhanceOpen] = useState(false);
  const [enhancePrompt, setEnhancePrompt] = useState("");
  const [enhancing, setEnhancing] = useState(false);
  const [enhanceError, setEnhanceError] = useState("");

  // Save version dialog state
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState("");

  // Export PDF dialog state
  const [exportOpen, setExportOpen] = useState(false);

  const active = localVersions.find((v) => v.id === selectedId) ?? localVersions[0];
  const content = editedContent[selectedId] ?? active.content;

  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const handleCopy = () => {
    const text = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnhance = async () => {
    setEnhancing(true);
    setEnhanceError("");
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, prompt: enhancePrompt, docType }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error ?? "Request failed");
      }
      const { enhancedContent } = await res.json() as { enhancedContent: string };
      const newId = `ai-${Date.now()}`;
      const newVersion: DocVersion = {
        id: newId,
        label: `Version ${localVersions.length + 1}`,
        sublabel: enhancePrompt.trim() ? `AI · ${enhancePrompt.trim().slice(0, 40)}` : "AI Enhanced",
        type: "improved",
        date: today,
        content: enhancedContent,
      };
      setLocalVersions((prev) => [...prev, newVersion]);
      setEditedContent((prev) => ({ ...prev, [newId]: enhancedContent }));
      setSelectedId(newId);
      setEnhanceOpen(false);
      setEnhancePrompt("");
    } catch (err) {
      setEnhanceError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setEnhancing(false);
    }
  };

  const handleSaveVersion = () => {
    const name = saveName.trim() || `Version ${localVersions.length + 1}`;
    const newId = `saved-${Date.now()}`;
    const newVersion: DocVersion = {
      id: newId,
      label: name,
      sublabel: "Manual save",
      type: "improved",
      date: today,
      content,
    };
    setLocalVersions((prev) => [...prev, newVersion]);
    setSelectedId(newId);
    setSaveOpen(false);
    setSaveName("");
  };

  return (
    <>
      <div className="flex h-full overflow-hidden">
        {/* ── Rich Text Editor ── */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-border overflow-hidden">
          {/* Header bar above toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card shrink-0">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full shrink-0 ${active.type === "original" ? "bg-muted-foreground" : "bg-primary"}`} />
              <span className="text-xs font-semibold text-foreground">{active.label}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground truncate max-w-[180px]">{active.sublabel}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs rounded-full px-3" onClick={handleCopy}>
                {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 text-xs rounded-full px-3"
                onClick={() => { setSaveName(""); setSaveOpen(true); }}
              >
                <Save className="h-3 w-3" /> Save version
              </Button>
              <Button
                size="sm"
                className="h-7 gap-1.5 text-xs rounded-full px-3 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30"
                variant="ghost"
                onClick={() => { setEnhancePrompt(""); setEnhanceError(""); setEnhanceOpen(true); }}
              >
                <Wand2 className="h-3 w-3" /> Enhance with AI
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 text-xs rounded-full px-3"
                onClick={() => setExportOpen(true)}
              >
                <Download className="h-3 w-3" /> Export PDF
              </Button>
            </div>
          </div>

          {/* Tiptap editor — remounts when version changes so content resets cleanly */}
          <div className="flex-1 overflow-hidden">
            <RichTextEditor
              key={`${selectedId}`}
              content={content}
              onChange={(html) =>
                setEditedContent((prev) => ({ ...prev, [selectedId]: html }))
              }
            />
          </div>
        </div>

        {/* ── Version panel ── */}
        <div className="w-60 shrink-0 flex flex-col overflow-hidden bg-card">
          <div className="px-4 py-3 border-b border-border shrink-0">
            <p className="text-xs font-bold text-primary uppercase tracking-widest">Versions</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {localVersions.map((v) => {
              const isActive = v.id === selectedId;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedId(v.id)}
                  className={`w-full text-left rounded-xl border p-3 transition-all ${
                    isActive
                      ? "border-primary/50 bg-primary/10"
                      : "border-border hover:border-border/80 hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {v.type === "improved" ? (
                      <Sparkles className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    ) : (
                      <FileText className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    )}
                    <span className={`text-xs font-bold truncate ${isActive ? "text-primary" : "text-foreground"}`}>
                      {v.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed truncate">{v.sublabel}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="h-3 w-3 text-muted-foreground/60" />
                    <span className="text-[10px] text-muted-foreground/60">{v.date}</span>
                  </div>
                  {v.type === "improved" && (
                    <div className="mt-2">
                      <span className="text-[10px] font-semibold bg-primary/10 text-primary rounded-full px-2 py-0.5 border border-primary/20">
                        AI Enhanced
                      </span>
                    </div>
                  )}
                </button>
              );
            })}

            {/* Enhance shortcut at bottom of version list */}
            <button
              onClick={() => { setEnhancePrompt(""); setEnhanceError(""); setEnhanceOpen(true); }}
              className="w-full rounded-xl border border-dashed border-primary/30 p-3 text-left hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Wand2 className="h-3.5 w-3.5 text-primary/60" />
                <span className="text-xs text-primary/70 font-medium">Enhance with AI…</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ── Enhance with AI dialog ── */}
      <Dialog open={enhanceOpen} onOpenChange={(o) => { if (!enhancing) setEnhanceOpen(o); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-primary" />
              Enhance with AI
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Optionally describe what you'd like the AI to focus on. Leave blank for a general improvement.
            </p>
            <Textarea
              placeholder="e.g. Make it more concise, add quantified results, tailor for a tech startup…"
              value={enhancePrompt}
              onChange={(e) => setEnhancePrompt(e.target.value)}
              className="min-h-[90px] resize-none text-sm"
              disabled={enhancing}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !enhancing) handleEnhance();
              }}
            />
            {enhanceError && (
              <p className="text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{enhanceError}</p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" size="sm" onClick={() => setEnhanceOpen(false)} disabled={enhancing}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleEnhance} disabled={enhancing} className="gap-2 min-w-[110px]">
              {enhancing ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Enhancing…</>
              ) : (
                <><Wand2 className="h-3.5 w-3.5" /> Enhance</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Save version dialog ── */}
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Save className="h-4 w-4 text-primary" />
              Save as version
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Give this version a name to save the current state of the document.
            </p>
            <Input
              placeholder={`Version ${localVersions.length + 1}`}
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              className="text-sm"
              onKeyDown={(e) => { if (e.key === "Enter") handleSaveVersion(); }}
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSaveOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSaveVersion} className="gap-2">
              <Save className="h-3.5 w-3.5" /> Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── PDF Export dialog ── */}
      <PdfExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        content={content}
        title={`${label} — ${active.label}`}
      />
    </>
  );
};

// ─── Candidate data ────────────────────────────────────────────────────────────

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
    appEmail: "anna.schmidt.apply@gmail.com", appEmailPassword: "Arb3itly!2026#AS", appEmailNotes: "Created 2026-02-16. 2FA disabled. Recovery: anna.schmidt@example.com",
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
    appEmail: "thomas.wagner.jobs@gmail.com", appEmailPassword: "Arb3itly!2026#TW", appEmailNotes: "Created 2026-02-21. Password changed once. Recovery linked to t.wagner@example.com",
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
    appEmail: "lisa.mueller.apply@gmail.com", appEmailPassword: "Arb3itly!2026#LM", appEmailNotes: "Created 2026-01-12. Recovery: lisa.mueller@example.com",
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
    appEmail: "peter.fischer.apply@gmail.com", appEmailPassword: "Arb3itly!2026#PF", appEmailNotes: "Created 2026-01-06. Uses phone 2FA. Recovery: p.fischer@example.com",
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
    appEmail: "maria.becker.apply@gmail.com", appEmailPassword: "Arb3itly!2026#MB", appEmailNotes: "Created 2026-03-08. No 2FA set yet. Recovery: maria.becker@example.com",
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
    appEmail: "hans.schulz.apply@gmail.com", appEmailPassword: "Arb3itly!2026#HS", appEmailNotes: "Created 2025-12-03. Account inactive — candidate on pause.",
  },
];

// ─── Candidate Kanban components ─────────────────────────────────────────────

type KanbanColumnDef = { id: ApplicationStatus; title: string; color: string };

const kanbanColumnDefs: KanbanColumnDef[] = [
  { id: "to-apply", title: "To Apply", color: "bg-muted-foreground" },
  { id: "applied", title: "Applied", color: "bg-info" },
  { id: "interview", title: "Interview", color: "bg-warning" },
  { id: "offer", title: "Offer", color: "bg-success" },
  { id: "rejected", title: "Rejected", color: "bg-destructive" },
];

function MiniSortableCard({ card }: { card: Application }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="cursor-grab active:cursor-grabbing hover:border-primary/40 transition-colors bg-card border-border">
        <CardContent className="p-2.5">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-xs font-medium text-card-foreground leading-snug truncate">{card.job}</p>
                <span className={`text-[8px] font-bold px-1.5 py-0 rounded-full leading-relaxed ${appStatusColors[card.status]}`}>
                  {statusLabels[card.status]}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{card.company}</p>
            </div>
            <div {...listeners} className="ml-1.5 mt-0.5 text-muted-foreground hover:text-foreground shrink-0">
              <GripVertical className="h-3 w-3" />
            </div>
          </div>
          {card.salaryExpectation && (
            <p className="text-[9px] text-primary/70 mt-1 font-medium truncate">{card.salaryExpectation}</p>
          )}
          <div className="flex items-center justify-between mt-1.5">
            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">{card.cvVersion}</Badge>
            <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
              <Clock className="h-2.5 w-2.5" />
              {card.date}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MiniCardOverlay({ card }: { card: Application }) {
  return (
    <Card className="cursor-grabbing shadow-xl border-primary/50 bg-card w-[160px]">
      <CardContent className="p-2.5">
        <p className="text-xs font-medium text-card-foreground truncate">{card.job}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{card.company}</p>
      </CardContent>
    </Card>
  );
}

function MiniDroppableColumn({
  column, cards, onAddClick,
}: {
  column: KanbanColumnDef; cards: Application[]; onAddClick: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const cardIds = cards.map((c) => c.id);

  return (
    <div className="w-[175px] flex flex-col shrink-0">
      <div className="flex items-center gap-1.5 px-1.5 py-1.5 mb-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${column.color}`} />
        <span className="text-[10px] font-semibold text-foreground uppercase tracking-wider">{column.title}</span>
        <span className="text-[10px] text-muted-foreground bg-secondary rounded-full px-1.5 py-0 min-w-[16px] text-center">
          {cards.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-1.5 overflow-y-auto pb-1.5 min-h-[50px] rounded-lg transition-colors ${isOver ? "bg-primary/5 ring-1 ring-primary/20" : ""}`}
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <MiniSortableCard key={card.id} card={card} />
          ))}
        </SortableContext>
        <button
          onClick={onAddClick}
          className="w-full flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] text-muted-foreground hover:bg-secondary transition-colors"
        >
          <Plus className="h-2.5 w-2.5" /> Add application
        </button>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

const Candidates = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Candidate>(candidates[0]);
  const { applications, addApplication, moveCard } = useApplications();
  const { toast } = useToast();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [quickAddStatus, setQuickAddStatus] = useState<ApplicationStatus>("to-apply");
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const [showPassword, setShowPassword] = useState(false);
  const [editAccount, setEditAccount] = useState(false);
  const [accountEmail, setAccountEmail] = useState(selected.appEmail);
  const [accountPassword, setAccountPassword] = useState(selected.appEmailPassword);
  const [accountNotes, setAccountNotes] = useState(selected.appEmailNotes);

  useEffect(() => {
    setShowPassword(false);
    setEditAccount(false);
    setAccountEmail(selected.appEmail);
    setAccountPassword(selected.appEmailPassword);
    setAccountNotes(selected.appEmailNotes);
  }, [selected.id]);

  const filtered = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const candidateApplications = applications.filter((a) => a.candidate === selected.name);
  const allCandidateNames = candidates.map((c) => c.name);

  const byStatus = useMemo(() => {
    const map: Record<ApplicationStatus, Application[]> = {
      "to-apply": [], applied: [], interview: [], offer: [], rejected: [],
    };
    for (const app of candidateApplications) {
      map[app.status].push(app);
    }
    return map;
  }, [candidateApplications]);

  const findStatus = (cardId: string): ApplicationStatus | null => {
    const app = applications.find((a) => a.id === cardId);
    return app ? app.status : null;
  };

  const activeCard = useMemo(
    () => applications.find((a) => a.id === activeId) ?? null,
    [activeId, applications]
  );

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeStatus = findStatus(active.id as string);
    const overStatus = (kanbanColumnDefs.find((c) => c.id === over.id)?.id ?? findStatus(over.id as string)) as ApplicationStatus | null;
    if (!activeStatus || !overStatus || activeStatus === overStatus) return;
    moveCard(active.id as string, overStatus, over.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const activeStatus = findStatus(active.id as string);
    const overStatus = (kanbanColumnDefs.find((c) => c.id === over.id)?.id ?? findStatus(over.id as string)) as ApplicationStatus | null;
    if (!activeStatus || !overStatus || activeStatus !== overStatus) return;
    moveCard(active.id as string, overStatus, over.id as string);
  };

  const usedPct = selected.applicationsTotal > 0
    ? Math.round((selected.applicationsUsed / selected.applicationsTotal) * 100)
    : 100;

  const candidateCvVersions = cvVersions[selected.id] ?? [];
  const candidateClVersions = clVersions[selected.id] ?? [];

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
          className="flex-1 flex flex-col overflow-hidden bg-background min-w-0"
        >
          {/* Candidate header */}
          <div className="px-6 py-4 border-b border-border bg-card shrink-0">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                {selected.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-display text-lg font-bold text-foreground">{selected.name}</h1>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[selected.status]}`}>{selected.status}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planColors[selected.plan]}`}>{selected.plan} Plan</span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{selected.currentTitle} · {selected.employer}</p>
                <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{selected.email}</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{selected.phone}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Joined {selected.joined}</span>
                </div>
              </div>
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
          <Tabs defaultValue="profile" className="flex-1 flex flex-col overflow-hidden min-h-0">
            <div className="px-6 pt-3 border-b border-border shrink-0 bg-card">
              <TabsList className="h-8">
                <TabsTrigger value="profile" className="gap-1.5 text-xs h-7"><User className="h-3.5 w-3.5" />Profile</TabsTrigger>
                <TabsTrigger value="applications" className="gap-1.5 text-xs h-7">
                  <Briefcase className="h-3.5 w-3.5" />Applications
                  {candidateApplications.length > 0 && (
                    <span className="ml-0.5 bg-primary/20 text-primary text-[10px] font-bold rounded-full px-1.5 py-0 leading-4">
                      {candidateApplications.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="onboarding" className="gap-1.5 text-xs h-7"><Target className="h-3.5 w-3.5" />Onboarding</TabsTrigger>
                <TabsTrigger value="cv" className="gap-1.5 text-xs h-7"><FileText className="h-3.5 w-3.5" />CV</TabsTrigger>
                <TabsTrigger value="cover-letter" className="gap-1.5 text-xs h-7"><Sparkles className="h-3.5 w-3.5" />Cover Letter</TabsTrigger>
                <TabsTrigger value="documents" className="gap-1.5 text-xs h-7"><Download className="h-3.5 w-3.5" />Files</TabsTrigger>
                <TabsTrigger value="account" className="gap-1.5 text-xs h-7"><Shield className="h-3.5 w-3.5" />Account</TabsTrigger>
                <TabsTrigger value="job-discovery" className="gap-1.5 text-xs h-7"><Zap className="h-3.5 w-3.5" />Job Discovery</TabsTrigger>
              </TabsList>
            </div>

            {/* ── Profile ── */}
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
                      <span key={s} className="text-xs font-medium bg-primary/10 text-primary rounded-full px-2.5 py-1 border border-primary/20">{s}</span>
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

            {/* ── Onboarding ── */}
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

            {/* ── CV Editor ── */}
            <TabsContent value="cv" className="flex-1 overflow-hidden mt-0 min-h-0">
              {candidateCvVersions.length > 0 ? (
                <DocEditorTab key={`cv-${selected.id}`} versions={candidateCvVersions} label="Curriculum Vitae" docType="cv" />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">No CV uploaded yet</div>
              )}
            </TabsContent>

            {/* ── Cover Letter Editor ── */}
            <TabsContent value="cover-letter" className="flex-1 overflow-hidden mt-0 min-h-0">
              {candidateClVersions.length > 0 ? (
                <DocEditorTab key={`cl-${selected.id}`} versions={candidateClVersions} label="Cover Letter" docType="cover-letter" />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">No cover letter uploaded yet</div>
              )}
            </TabsContent>

            {/* ── Files ── */}
            <TabsContent value="documents" className="flex-1 overflow-y-auto p-6 mt-0">
              <div className="max-w-xl space-y-3">
                {[
                  { label: "Curriculum Vitae", has: selected.hasCv, size: "245 KB" },
                  { label: "Cover Letter", has: selected.hasCoverLetter, size: "128 KB" },
                  { label: "LinkedIn Profile PDF", has: false, size: "" },
                ].map(({ label, has, size }) => (
                  <div key={label} className={`rounded-2xl border p-5 flex items-center gap-4 ${has ? "border-border bg-card" : "border-dashed border-border bg-card/50 opacity-60"}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${has ? "bg-primary/10 border border-primary/20" : "bg-secondary"}`}>
                      <FileText className={`h-5 w-5 ${has ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{label}</p>
                      {has ? (
                        <p className="text-xs text-muted-foreground">{label.replace(" ", "_")}_{selected.name.replace(" ", "_")}.pdf · {size} · Uploaded {selected.joined}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Not yet uploaded</p>
                      )}
                    </div>
                    {has ? (
                      <Button variant="outline" size="sm" className="shrink-0 gap-1.5 rounded-full"><Download className="h-3.5 w-3.5" /> Download</Button>
                    ) : (
                      <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ── Applications ── */}
            <TabsContent value="applications" className="flex-1 overflow-hidden p-4 mt-0 flex flex-col">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Job Applications
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {candidateApplications.length === 0
                      ? "No applications yet"
                      : `${candidateApplications.length} application${candidateApplications.length > 1 ? "s" : ""} tracked`}
                  </p>
                </div>
                <AddJobDialog
                  onAdd={(app) => addApplication({ ...app, candidate: selected.name })}
                  candidates={allCandidateNames}
                  defaultCandidate={selected.name}
                  trigger={
                    <Button size="sm" className="gap-1.5 rounded-full h-8 text-xs">
                      <Plus className="h-3.5 w-3.5" /> Add Application
                    </Button>
                  }
                />
              </div>

              {candidateApplications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Briefcase className="h-7 w-7 text-primary/60" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No applications yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Track job applications for {selected.name} using the button above.</p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCorners}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex-1 overflow-x-auto">
                    <div className="flex gap-2 h-full min-w-max">
                      {kanbanColumnDefs.map((col) => (
                        <MiniDroppableColumn
                          key={col.id}
                          column={col}
                          cards={byStatus[col.id]}
                          onAddClick={() => { setQuickAddStatus(col.id); setQuickAddOpen(true); }}
                        />
                      ))}
                    </div>
                  </div>
                  <DragOverlay>
                    {activeCard ? <MiniCardOverlay card={activeCard} /> : null}
                  </DragOverlay>
                </DndContext>
              )}

              <AddJobDialog
                key={quickAddStatus}
                open={quickAddOpen}
                onOpenChange={setQuickAddOpen}
                onAdd={(app) => {
                  addApplication({ ...app, candidate: selected.name });
                  toast({ title: "Application Added", description: `${app.job} at ${app.company}` });
                }}
                candidates={allCandidateNames}
                defaultCandidate={selected.name}
                defaultStatus={quickAddStatus}
                trigger={<span className="hidden" />}
              />
            </TabsContent>

            {/* ── Account ── */}
            <TabsContent value="account" className="flex-1 overflow-y-auto p-6 mt-0">
              <div className="max-w-lg space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Application Account</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Email account used to apply on behalf of {selected.name}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 h-8 rounded-full text-xs"
                    onClick={() => {
                      if (editAccount) toast({ title: "Account updated", description: "Credentials saved." });
                      setEditAccount(!editAccount);
                    }}
                  >
                    {editAccount
                      ? <><Check className="h-3.5 w-3.5" /> Save</>
                      : <><Pencil className="h-3.5 w-3.5" /> Edit</>}
                  </Button>
                </div>

                {/* Credentials card */}
                <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Login Credentials</p>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">Email Address</p>
                    {editAccount ? (
                      <Input
                        value={accountEmail}
                        onChange={(e) => setAccountEmail(e.target.value)}
                        className="h-8 text-sm font-mono"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-2.5 bg-secondary rounded-xl px-3 py-2">
                          <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="text-sm font-mono text-foreground">{accountEmail}</span>
                        </div>
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8 shrink-0"
                          onClick={() => {
                            navigator.clipboard.writeText(accountEmail);
                            toast({ title: "Copied", description: "Email copied to clipboard" });
                          }}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">Password</p>
                    {editAccount ? (
                      <Input
                        value={accountPassword}
                        onChange={(e) => setAccountPassword(e.target.value)}
                        className="h-8 text-sm font-mono"
                        placeholder="New password"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-2.5 bg-secondary rounded-xl px-3 py-2">
                          <KeyRound className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="text-sm font-mono text-foreground tracking-wider">
                            {showPassword ? accountPassword : "•".repeat(Math.min(accountPassword.length, 18))}
                          </span>
                        </div>
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8 shrink-0"
                          onClick={() => setShowPassword((p) => !p)}
                        >
                          {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8 shrink-0"
                          onClick={() => {
                            navigator.clipboard.writeText(accountPassword);
                            toast({ title: "Copied", description: "Password copied to clipboard" });
                          }}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes card */}
                <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Account Notes</p>
                  {editAccount ? (
                    <Textarea
                      value={accountNotes}
                      onChange={(e) => setAccountNotes(e.target.value)}
                      className="text-sm resize-none min-h-[80px]"
                      placeholder="e.g. Created date, 2FA status, recovery email..."
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {accountNotes || <span className="italic">No notes added.</span>}
                    </p>
                  )}
                </div>

                {/* Security reminder */}
                <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/5 p-4">
                  <Shield className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    These credentials are stored for internal transparency only. Access is restricted to authorised Arbeitly staff. Do not share outside the team.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* ── Job Discovery ── */}
            <TabsContent value="job-discovery" className="flex-1 overflow-y-auto p-6 mt-0">
              <CandidateJobDiscovery candidate={selected} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ─── Candidate Job Discovery sub-component ────────────────────────────────────

function CandidateJobDiscovery({ candidate }: { candidate: Candidate }) {
  const { addApplication } = useApplications();
  const { toast } = useToast();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addedJobs, setAddedJobs] = useState<Set<string>>(new Set());

  const scored = seedJobs
    .map((job) => ({ ...job, score: computeScore(job.skills, candidate.skills) }))
    .sort((a, b) => b.score - a.score);

  const handleAdd = (job: JobListing, score: number) => {
    addApplication({
      candidate: candidate.name,
      job: job.title,
      company: job.company,
      cvVersion: "v1",
      status: "to-apply",
      datePosted: job.dateDiscovered,
      dateSubmitted: "",
      salaryExpectation: job.salaryRange,
      jobUrl: job.url,
      notes: `Discovered via ${job.source}. Match score: ${score}%.`,
    });
    setAddedJobs((prev) => new Set(prev).add(job.id));
    toast({ title: "Added to queue", description: `${job.title} added to ${candidate.name}'s applications.` });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" /> Job Matches for {candidate.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {scored.length} jobs ranked by skill match · Candidate skills: {candidate.skills.join(", ")}
        </p>
      </div>

      <div className="space-y-2.5">
        {scored.map((job) => {
          const isExpanded = expandedId === job.id;
          const isAdded = addedJobs.has(job.id);

          return (
            <div key={job.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              <button
                className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-secondary/30 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : job.id)}
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">
                  {job.company[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{job.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Building className="h-3 w-3" />{job.company}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />{job.location}
                        </span>
                        <span className="text-xs text-primary font-medium">{job.salaryRange}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sourceBadgeColors[job.source]}`}>
                        {job.source}
                      </span>
                      <div className={`flex items-center gap-1 text-xs font-bold ${scoreColor(job.score)}`}>
                        <Star className="h-3 w-3" />
                        {job.score}%
                      </div>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${scoreBarColor(job.score)}`} style={{ width: `${job.score}%` }} />
                    </div>
                    <span className={`text-[10px] font-bold min-w-[28px] ${scoreColor(job.score)}`}>{job.score}%</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {job.skills.map((s) => {
                      const hasSkill = candidate.skills.some((cs) => cs.toLowerCase() === s.toLowerCase());
                      return (
                        <span key={s} className={`text-[10px] px-2 py-0.5 rounded-full ${hasSkill ? "bg-primary/15 text-primary font-semibold" : "bg-secondary text-secondary-foreground"}`}>
                          {s}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-border bg-background/50 px-4 py-3 space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{job.description}</p>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" /> Discovered {job.dateDiscovered}
                    </span>
                    <a href={job.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                      <ExternalLink className="h-3 w-3" /> View full listing
                    </a>
                  </div>
                  <Button
                    size="sm"
                    variant={isAdded ? "outline" : "default"}
                    disabled={isAdded}
                    className="h-7 px-3 text-[11px] gap-1 rounded-full"
                    onClick={() => handleAdd(job, job.score)}
                  >
                    {isAdded ? <><Check className="h-3 w-3" /> Added to Queue</> : <><Plus className="h-3 w-3" /> Add to Queue</>}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Candidates;
