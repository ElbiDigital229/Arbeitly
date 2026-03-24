import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type OnboardingData = {
  // Step 1
  firstName: string;
  lastName: string;
  applicationEmail: string;
  phone: string;
  linkedin: string;
  dob: string;
  placeOfBirth: string;
  address: string;
  // Step 2
  currentJobTitle: string;
  currentEmployer: string;
  currentField: string;
  yearsExperience: string;
  currentSalary: string;
  workedInGermany: string;
  noticePeriod: string;
  highestStudy: string;
  degreeTitle: string;
  university: string;
  universityLocation: string;
  // Step 3
  topSkills: string;
  certifications: string;
  careerGoal: string;
  targetRoles: string;
  targetIndustries: string;
  employmentType: string;
  preferredLocation: string;
  openToRelocation: string;
  preferredSalary: string;
  targetCompanies: string;
  openToCareerChange: string;
  // Step 4
  germanLevel: string;
  drivingLicense: string;
  transitionMotivation: string;
  trainingNeeds: string;
  howHeard: string;
  additionalInfo: string;
};

export type JobAccount = {
  email: string;
  password: string;
  authorizedAt: string;
};

export type Customer = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  planId: string;
  planName: string;
  planPrice: string;
  planType: "free" | "paid";
  signedUpAt: string;
  status: "active" | "pending";
  onboarding?: Partial<OnboardingData>;
  jobAccount?: JobAccount;
  assignedEmployeeId?: string | null;
  assignedAt?: string | null;
  lastOpenedApplications?: string | null;
  // Application quota (paid candidates)
  applicationQuota?: number;
  applicationsUsed?: number;
  // Dummy credentials for external job applications (created by candidate during onboarding)
  dummyEmail?: string;
  dummyPassword?: string;
  // CV export limit (free candidates)
  cvExportLimit?: number;
  cvExportsUsed?: number;
  // CV creation limit (free candidates)
  cvCreationLimit?: number;
  cvCreationsUsed?: number;
  // Marketing questionnaire (free candidates — filled at signup, NOT the paid onboarding)
  marketingData?: { industry?: string; targetCountry?: string; howHeard?: string };
};

type CustomersContextType = {
  customers: Customer[];
  currentCustomer: Customer | null;
  addCustomer: (customer: Omit<Customer, "id" | "signedUpAt">) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  login: (email: string, password: string) => Customer | null;
  loginDirect: (customer: Customer) => void;
  logout: () => void;
};

const CustomersContext = createContext<CustomersContextType | null>(null);

const SEED_CUSTOMERS: Customer[] = [
  {
    id: "seed_cust_001",
    fullName: "Sarah Müller",
    email: "sarah@example.com",
    password: "test123",
    planId: "starter",
    planName: "Starter",
    planPrice: "€29/mo",
    planType: "paid",
    signedUpAt: "2026-01-15T10:00:00Z",
    status: "active",
    assignedEmployeeId: "seed_emp_001",
    assignedAt: "2026-01-16T09:00:00Z",
    applicationQuota: 200,
    applicationsUsed: 45,
    dummyEmail: "sarah.applications@gmail.com",
    dummyPassword: "SarahApply2024!",
    onboarding: {
      firstName: "Sarah",
      lastName: "Müller",
      applicationEmail: "sarah.muller@gmail.com",
      phone: "+49 151 1234 5678",
      linkedin: "linkedin.com/in/sarahmuller",
      currentJobTitle: "Software Engineer",
      currentEmployer: "Siemens AG",
      currentField: "Technology",
      yearsExperience: "5",
      currentSalary: "€65,000",
      noticePeriod: "3 months",
      highestStudy: "Bachelor's",
      degreeTitle: "Computer Science",
      university: "TU München",
      targetRoles: "Senior Software Engineer, Tech Lead",
      preferredLocation: "Berlin",
      preferredSalary: "€85,000",
      germanLevel: "B2",
      openToRelocation: "Yes",
    },
  },
  {
    id: "seed_cust_002",
    fullName: "Ahmed Hassan",
    email: "ahmed@example.com",
    password: "test123",
    planId: "professional",
    planName: "Professional",
    planPrice: "€59/mo",
    planType: "paid",
    signedUpAt: "2026-01-20T14:30:00Z",
    status: "active",
    assignedEmployeeId: "seed_emp_001",
    assignedAt: "2026-01-21T10:00:00Z",
    applicationQuota: 300,
    applicationsUsed: 12,
    dummyEmail: "ahmed.applications@gmail.com",
    dummyPassword: "AhmedApply2024!",
    onboarding: {
      firstName: "Ahmed",
      lastName: "Hassan",
      applicationEmail: "ahmed.hassan@gmail.com",
      phone: "+49 160 9876 5432",
      currentJobTitle: "Financial Analyst",
      currentEmployer: "PwC Germany",
      currentField: "Finance",
      yearsExperience: "7",
      currentSalary: "€58,000",
      noticePeriod: "1 month",
      highestStudy: "Master's",
      degreeTitle: "Finance & Accounting",
      university: "Goethe University Frankfurt",
      targetRoles: "Senior Financial Analyst, Finance Manager",
      preferredLocation: "Frankfurt",
      preferredSalary: "€75,000",
      germanLevel: "C1",
      openToRelocation: "No",
    },
  },
  {
    id: "seed_cust_free",
    fullName: "Nina Weber",
    email: "nina@example.com",
    password: "test123",
    planId: "free",
    planName: "Free",
    planPrice: "€0/mo",
    planType: "free",
    signedUpAt: "2026-03-01T11:00:00Z",
    status: "active",
    cvExportLimit: 10,
    cvExportsUsed: 3,
    cvCreationLimit: 10,
    cvCreationsUsed: 2,
    marketingData: {
      industry: "Technology / Software",
      targetCountry: "Germany",
      howHeard: "LinkedIn",
    },
  },
  {
    id: "seed_cust_003",
    fullName: "Priya Sharma",
    email: "priya@example.com",
    password: "test123",
    planId: "starter",
    planName: "Starter",
    planPrice: "€29/mo",
    planType: "paid",
    signedUpAt: "2026-02-01T09:15:00Z",
    status: "active",
    applicationQuota: 200,
    applicationsUsed: 3,
    dummyEmail: "priya.applications@gmail.com",
    dummyPassword: "PriyaApply2024!",
    onboarding: {
      firstName: "Priya",
      lastName: "Sharma",
      applicationEmail: "priya.sharma@gmail.com",
      phone: "+49 172 5550 9988",
      currentJobTitle: "Marketing Manager",
      currentEmployer: "Zalando SE",
      currentField: "Marketing",
      yearsExperience: "6",
      currentSalary: "€55,000",
      noticePeriod: "2 months",
      highestStudy: "Bachelor's",
      degreeTitle: "Business Administration",
      university: "Humboldt University Berlin",
      targetRoles: "Senior Marketing Manager, Head of Marketing",
      preferredLocation: "Düsseldorf",
      preferredSalary: "€70,000",
      germanLevel: "A2",
      openToRelocation: "Yes",
    },
  },
];

export function CustomersProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const stored = localStorage.getItem("arbeitly_customers");
      const existing: Customer[] = stored ? JSON.parse(stored) : [];
      // Inject seed customers if not already present (idempotent by ID)
      const seedIds = SEED_CUSTOMERS.map((c) => c.id);
      const hasSeed = seedIds.every((id) => existing.some((c) => c.id === id));
      if (!hasSeed) {
        const withoutOldSeeds = existing.filter((c) => !seedIds.includes(c.id));
        return [...withoutOldSeeds, ...SEED_CUSTOMERS];
      }
      return existing;
    } catch {
      return SEED_CUSTOMERS;
    }
  });

  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(() => {
    try {
      const stored = sessionStorage.getItem("arbeitly_candidate_session");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("arbeitly_customers", JSON.stringify(customers));
    // Keep current customer in sync if it was updated
    if (currentCustomer) {
      const updated = customers.find((c) => c.id === currentCustomer.id);
      if (updated) setCurrentCustomer(updated);
    }
  }, [customers]);

  useEffect(() => {
    if (currentCustomer) {
      sessionStorage.setItem("arbeitly_candidate_session", JSON.stringify(currentCustomer));
    } else {
      sessionStorage.removeItem("arbeitly_candidate_session");
    }
  }, [currentCustomer]);

  // Seed demo data for Sarah Müller (paid candidate seed_cust_001)
  useEffect(() => {
    // Applications
    const appsKey = "arbeitly_apps_seed_cust_001";
    if (!localStorage.getItem(appsKey)) {
      const sarahApps = [
        { id: "sa1", job: "Senior Frontend Developer", company: "SAP SE", status: "to-apply", source: "platform", addedById: "emp_001", addedByName: "Arbeitly Team", seenByCandidate: true, date: "2026-03-18", url: "https://sap.com/jobs/123", salary: "€85,000", cvUsed: "Sarah Müller CV" },
        { id: "sa2", job: "Lead React Engineer", company: "BMW Group", status: "to-apply", source: "platform", addedById: "emp_001", addedByName: "Arbeitly Team", seenByCandidate: true, date: "2026-03-17", url: "https://bmw.com/jobs/456", salary: "€90,000" },
        { id: "sa3", job: "Software Engineer II", company: "Siemens AG", status: "to-apply", source: "self", addedById: "seed_cust_001", addedByName: "Sarah Müller", seenByCandidate: true, date: "2026-03-15", url: "https://siemens.com/careers", salary: "€80,000", cvUsed: "Sarah Müller CV" },
        { id: "sa4", job: "Full Stack Developer", company: "Delivery Hero", status: "applied", source: "platform", addedById: "emp_001", addedByName: "Arbeitly Team", seenByCandidate: true, date: "2026-03-10", url: "https://deliveryhero.com/jobs", salary: "€78,000", cvUsed: "Sarah Müller CV", contactPerson: "Tom Becker" },
        { id: "sa5", job: "Frontend Architect", company: "Zalando", status: "applied", source: "platform", addedById: "emp_001", addedByName: "Arbeitly Team", seenByCandidate: true, date: "2026-03-08", url: "https://zalando.com/jobs", salary: "€88,000", cvUsed: "Sarah Müller CV" },
        { id: "sa6", job: "React Developer", company: "N26", status: "applied", source: "self", addedById: "seed_cust_001", addedByName: "Sarah Müller", seenByCandidate: true, date: "2026-03-05", salary: "€75,000" },
        { id: "sa7", job: "Senior Software Engineer", company: "Bosch", status: "interview", source: "platform", addedById: "emp_001", addedByName: "Arbeitly Team", seenByCandidate: true, date: "2026-03-02", url: "https://bosch.com/careers", salary: "€85,000", cvUsed: "Sarah Müller CV", contactPerson: "Anna Hoffmann", nextAction: "Technical interview scheduled Apr 5" },
        { id: "sa8", job: "Tech Lead", company: "Deutsche Bank", status: "interview", source: "platform", addedById: "emp_001", addedByName: "Arbeitly Team", seenByCandidate: true, date: "2026-02-28", url: "https://db.com/jobs", salary: "€95,000", cvUsed: "Sarah Müller CV" },
        { id: "sa9", job: "Software Engineer", company: "Allianz", status: "accepted", source: "platform", addedById: "emp_001", addedByName: "Arbeitly Team", seenByCandidate: true, date: "2026-02-20", salary: "€82,000", cvUsed: "Sarah Müller CV", nextAction: "Offer received — decide by Apr 10" },
        { id: "sa10", job: "Cloud Engineer", company: "Infineon", status: "rejected", source: "platform", addedById: "emp_001", addedByName: "Arbeitly Team", seenByCandidate: true, date: "2026-02-15", salary: "€78,000" },
        { id: "sa11", job: "DevOps Engineer", company: "Volkswagen AG", status: "rejected", source: "self", addedById: "seed_cust_001", addedByName: "Sarah Müller", seenByCandidate: true, date: "2026-02-10" },
      ];
      localStorage.setItem(appsKey, JSON.stringify(sarahApps));
    }

    // CV tree
    const cvKey = "arbeitly_cv_tree_seed_cust_001";
    if (!localStorage.getItem(cvKey)) {
      const sarahCvTree = {
        original: { content: "<h1>Sarah Müller</h1><p>sarah.muller@gmail.com · +49 151 1234 5678 · Berlin, Germany · linkedin.com/in/sarahmuller</p>", createdAt: "2026-01-16T10:00:00Z", language: "EN" },
        versions: [
          {
            id: "sv_1", letter: "A", name: "Sarah Müller CV", label: "Sarah Müller CV",
            content: `<h1>Sarah Müller</h1><p class="contact">sarah.muller@gmail.com · +49 151 1234 5678 · Berlin, Germany · linkedin.com/in/sarahmuller</p><h2>Summary</h2><p>Results-driven Senior Software Engineer with 5+ years building scalable web applications. Expert in React, TypeScript, and cloud-native architectures. Passionate about clean code and high-performance systems.</p><h2>Experience</h2><div style="margin-bottom:10px"><strong>Software Engineer — Siemens AG</strong><br><small style="color:#888">Mar 2021 – Present</small><p>Led migration of legacy Angular app to React 18, reducing bundle size by 45%. Mentored 3 junior engineers and introduced automated testing pipelines that reduced regression bugs by 70%.</p></div><div style="margin-bottom:10px"><strong>Junior Developer — Allianz Technology</strong><br><small style="color:#888">Jun 2019 – Feb 2021</small><p>Developed React-based internal dashboards for claims processing teams. Collaborated with UX designers to ship 12 product iterations in 18 months.</p></div><h2>Education</h2><div style="margin-bottom:8px"><strong>B.Sc. Computer Science — TU München</strong><br><small style="color:#888">2015 – 2019</small></div><h2>Skills</h2><ul><li>React</li><li>TypeScript</li><li>Node.js</li><li>AWS</li><li>PostgreSQL</li><li>Docker</li><li>German (Native)</li><li>English (C1)</li></ul>`,
            createdAt: "2026-01-17T10:00:00Z", style: "modern", language: "EN", source: "uploaded", variants: []
          },
          {
            id: "sv_2", letter: "B", name: "Sarah Müller CV — Tailored (SAP)", label: "Sarah Müller CV — Tailored (SAP)",
            content: `<h1>Sarah Müller</h1><p class="contact">sarah.muller@gmail.com · +49 151 1234 5678 · Berlin, Germany · linkedin.com/in/sarahmuller</p><h2>Summary</h2><p>Senior Software Engineer with expertise in enterprise-grade React applications and SAP ecosystem integrations. 5+ years delivering high-impact solutions in regulated industries with a focus on scalability and developer experience.</p><h2>Experience</h2><div style="margin-bottom:10px"><strong>Software Engineer — Siemens AG</strong><br><small style="color:#888">Mar 2021 – Present</small><p>Architected and delivered a React-based enterprise portal serving 8,000+ internal users. Integrated with SAP BTP services and implemented role-based access control using Azure AD.</p></div><div style="margin-bottom:10px"><strong>Junior Developer — Allianz Technology</strong><br><small style="color:#888">Jun 2019 – Feb 2021</small><p>Built React frontends for claims automation workflows. Collaborated across 4 international teams and contributed to SAP integration layer documentation.</p></div><h2>Education</h2><div style="margin-bottom:8px"><strong>B.Sc. Computer Science — TU München</strong><br><small style="color:#888">2015 – 2019</small></div><h2>Skills</h2><ul><li>React</li><li>TypeScript</li><li>SAP BTP</li><li>Node.js</li><li>Azure AD</li><li>REST APIs</li><li>German (Native)</li><li>English (C1)</li></ul>`,
            createdAt: "2026-03-18T09:00:00Z", style: "modern", language: "EN", source: "generated", variants: []
          }
        ]
      };
      localStorage.setItem(cvKey, JSON.stringify(sarahCvTree));
    }

    // Cover letter tree
    const clKey = "arbeitly_cl_tree_seed_cust_001";
    if (!localStorage.getItem(clKey)) {
      const sarahClTree = {
        original: { content: "", createdAt: "" },
        versions: [
          {
            id: "cl_sv_1", letter: "A", name: "Cover Letter — SAP SE", label: "Cover Letter — SAP SE",
            content: `<h1>Cover Letter</h1><p><strong>Sarah Müller</strong><br>sarah.muller@gmail.com · Berlin, Germany</p><br><p>March 18, 2026</p><p>Dear Hiring Team at SAP SE,</p><p>I am writing to express my strong interest in the Senior Frontend Developer position at SAP SE. With over 5 years of experience building enterprise-grade React applications and a deep familiarity with SAP's technology ecosystem, I am confident I would make an immediate and lasting contribution to your team.</p><p>At Siemens AG, I led the migration of a critical legacy system to a modern React 18 architecture, reducing load times by 45% while improving developer velocity. This work gave me hands-on experience with large-scale enterprise environments similar to SAP's.</p><p>I am particularly drawn to SAP's commitment to innovation in enterprise software. I would welcome the opportunity to bring my technical expertise and collaborative work style to help drive your next generation of frontend experiences.</p><p>Thank you for considering my application. I look forward to discussing how my background aligns with your team's goals.</p><p>Warm regards,<br><strong>Sarah Müller</strong></p>`,
            createdAt: "2026-03-18T10:00:00Z", style: "modern", language: "EN", source: "generated", variants: []
          }
        ]
      };
      localStorage.setItem(clKey, JSON.stringify(sarahClTree));
    }
  }, []);

  // Seed demo data for the free seed candidate (only if not already set)
  useEffect(() => {
    // Demo applications
    const appsKey = "arbeitly_apps_seed_cust_free";
    if (!localStorage.getItem(appsKey)) {
      const demoApps = [
        { id: "na1", job: "Frontend Developer", company: "Zalando", status: "to-apply", source: "self", addedById: "seed_cust_free", addedByName: "Nina Weber", seenByCandidate: true, date: "2026-03-10", url: "https://jobs.zalando.com", salary: "€60,000", cvUsed: "Nina Weber CV" },
        { id: "na2", job: "UX Engineer", company: "N26", status: "to-apply", source: "self", addedById: "seed_cust_free", addedByName: "Nina Weber", seenByCandidate: true, date: "2026-03-09" },
        { id: "na3", job: "React Developer", company: "Delivery Hero", status: "applied", source: "self", addedById: "seed_cust_free", addedByName: "Nina Weber", seenByCandidate: true, date: "2026-03-05", salary: "€58,000", contactPerson: "Mia Schulz", cvUsed: "Nina Weber CV" },
        { id: "na4", job: "Junior Frontend Eng", company: "Flixbus", status: "applied", source: "self", addedById: "seed_cust_free", addedByName: "Nina Weber", seenByCandidate: true, date: "2026-03-03", nextAction: "Follow up next week" },
        { id: "na5", job: "Software Engineer", company: "Siemens", status: "interview", source: "self", addedById: "seed_cust_free", addedByName: "Nina Weber", seenByCandidate: true, date: "2026-02-28", salary: "€65,000", contactPerson: "Klaus Meyer", nextAction: "Technical interview on Apr 2", cvUsed: "Nina Weber CV" },
        { id: "na6", job: "Web Developer", company: "HelloFresh", status: "rejected", source: "self", addedById: "seed_cust_free", addedByName: "Nina Weber", seenByCandidate: true, date: "2026-02-20" },
      ];
      localStorage.setItem(appsKey, JSON.stringify(demoApps));
    }

    // Demo CV tree
    const cvKey = "arbeitly_cv_tree_seed_cust_free";
    if (!localStorage.getItem(cvKey)) {
      const cvHtmlModern = `
        <h1>Nina Weber</h1>
        <p>nina@example.com · +49 176 1234 5678 · Berlin, Germany · linkedin.com/in/nina-weber</p>
        <h2>Summary</h2>
        <p>Passionate frontend developer with 3 years of experience building responsive, accessible web applications using React and TypeScript. Strong eye for design and UX detail.</p>
        <h2>Experience</h2>
        <div style="margin-bottom:12px"><strong>Junior Frontend Developer — Freelance</strong><br><small style="color:#888">Jan 2024 – Present</small><p>Built client-facing dashboards for 4 SMEs using React, Tailwind CSS, and Vite. Improved page load time by 35% through code splitting and lazy loading.</p></div>
        <div style="margin-bottom:12px"><strong>Web Development Intern — MediaMind GmbH</strong><br><small style="color:#888">Jun 2022 – Dec 2023</small><p>Developed and maintained WordPress and React-based websites. Collaborated with designers to implement pixel-perfect UI from Figma mockups.</p></div>
        <h2>Education</h2>
        <div style="margin-bottom:8px"><strong>B.Sc. Computer Science — Freie Universität Berlin</strong><br><small style="color:#888">2019 – 2022</small></div>
        <h2>Skills</h2>
        <ul><li>React</li><li>TypeScript</li><li>Tailwind CSS</li><li>Node.js</li><li>Figma</li><li>Git</li><li>REST APIs</li><li>German (Native)</li><li>English (C1)</li></ul>
      `;
      const demoCvTree = {
        original: { content: cvHtmlModern, createdAt: "2026-03-01T12:00:00Z", language: "EN" },
        versions: [
          {
            id: "v_demo_1",
            letter: "A",
            name: "Nina Weber CV",
            label: "Nina Weber CV",
            content: cvHtmlModern,
            createdAt: "2026-03-02T10:00:00Z",
            style: "modern",
            language: "EN",
            source: "uploaded",
            variants: [],
          },
        ],
      };
      localStorage.setItem(cvKey, JSON.stringify(demoCvTree));
    }
  }, []);

  const addCustomer = (customer: Omit<Customer, "id" | "signedUpAt">): Customer => {
    const newCustomer: Customer = {
      ...customer,
      id: crypto.randomUUID(),
      signedUpAt: new Date().toISOString(),
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    );
  };

  const login = (email: string, password: string): Customer | null => {
    // Always read fresh from localStorage to avoid stale closure issues
    let pool = customers;
    try {
      const fresh = localStorage.getItem("arbeitly_customers");
      if (fresh) pool = JSON.parse(fresh);
    } catch { /* ignore */ }

    const match = pool.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password,
    );
    if (match) {
      setCurrentCustomer(match);
    }
    return match ?? null;
  };

  const loginDirect = (customer: Customer) => setCurrentCustomer(customer);

  const logout = () => setCurrentCustomer(null);

  return (
    <CustomersContext.Provider
      value={{ customers, currentCustomer, addCustomer, updateCustomer, login, loginDirect, logout }}
    >
      {children}
    </CustomersContext.Provider>
  );
}

export function useCustomers() {
  const ctx = useContext(CustomersContext);
  if (!ctx) throw new Error("useCustomers must be used within CustomersProvider");
  return ctx;
}
