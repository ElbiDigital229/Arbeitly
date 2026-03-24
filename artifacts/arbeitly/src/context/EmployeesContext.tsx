import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type CandidateAssignment = {
  candidateId: string;
  applicationQuota: number;
  applicationsUsed: number;
  assignedAt: string;
};

export type Employee = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  status: "active" | "inactive";
  assignedCandidateIds: string[];
  assignments: CandidateAssignment[];
  createdAt: string;
};

type EmployeesContextType = {
  employees: Employee[];
  currentEmployee: Employee | null;
  addEmployee: (data: Omit<Employee, "id" | "createdAt" | "assignedCandidateIds" | "assignments">) => Employee;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  loginEmployee: (email: string, password: string) => Employee | null;
  logoutEmployee: () => void;
  loginEmployeeDirect: (emp: Employee) => void;
};

const EmployeesContext = createContext<EmployeesContextType | null>(null);

const STORAGE_KEY = "arbeitly_employees";
const SESSION_KEY = "arbeitly_employee_session";

const SEED_EMPLOYEE: Employee = {
  id: "seed_emp_001",
  fullName: "Jonas Weber",
  email: "jonas@arbeitly.com",
  password: "test123",
  status: "active",
  assignedCandidateIds: ["seed_cust_001", "seed_cust_002"],
  assignments: [
    { candidateId: "seed_cust_001", applicationQuota: 200, applicationsUsed: 45, assignedAt: "2026-01-16T09:00:00Z" },
    { candidateId: "seed_cust_002", applicationQuota: 300, applicationsUsed: 12, assignedAt: "2026-01-21T10:00:00Z" },
  ],
  createdAt: "2026-01-10T08:00:00Z",
};

const SEED_BOARD_DATA: Record<string, object[]> = {
  seed_cust_001: [
    { id: "app_s1_1", job: "Senior Software Engineer", company: "BMW Group", url: "", status: "interview", source: "platform", addedById: "seed_emp_001", addedByName: "Jonas Weber", seenByCandidate: true, date: "2026-02-10", salary: "€85,000", contactPerson: "Anna Schmidt", nextAction: "Follow up after second interview", jobDescription: "Backend-focused role working on vehicle data platform." },
    { id: "app_s1_2", job: "Tech Lead", company: "FlexMobility", url: "", status: "applied", source: "platform", addedById: "seed_emp_001", addedByName: "Jonas Weber", seenByCandidate: true, date: "2026-03-18", salary: "€92,000", contactPerson: "John Doe", nextAction: "Wait for response", cvUsed: "Google" },
    { id: "app_s1_3", job: "Senior Software Engineer", company: "N26", url: "", status: "to-apply", source: "self", addedById: "seed_cust_001", addedByName: "Sarah Müller", seenByCandidate: true, date: "2026-03-18", salary: "€78,000 - €95,000", cvUsed: "Google" },
    { id: "app_s1_4", job: "Software Architect", company: "SAP SE", url: "", status: "to-apply", source: "self", addedById: "seed_cust_001", addedByName: "Sarah Müller", seenByCandidate: true, date: "2026-02-20", salary: "€95,000" },
    { id: "app_s1_5", job: "Backend Engineer", company: "Celonis", url: "", status: "rejected", source: "self", addedById: "seed_cust_001", addedByName: "Sarah Müller", seenByCandidate: true, date: "2026-01-28", salary: "€78,000" },
    { id: "app_s1_6", job: "Tech Lead", company: "Zalando", url: "", status: "applied", source: "platform", addedById: "seed_emp_001", addedByName: "Jonas Weber", seenByCandidate: false, date: "2026-03-19", salary: "€92,000", nextAction: "Waiting for HR response" },
    { id: "app_s1_7", job: "Backend Engineer", company: "Celonis", url: "", status: "interview", source: "platform", addedById: "seed_emp_001", addedByName: "Jonas Weber", seenByCandidate: false, date: "2026-03-19", salary: "€82,000", nextAction: "Technical interview next week", cvUsed: "SaaS Industry" },
  ],
  seed_cust_002: [
    { id: "app_s2_1", job: "Senior Financial Analyst", company: "Deutsche Bank", url: "", status: "applied", source: "platform", addedById: "seed_emp_001", addedByName: "Jonas Weber", seenByCandidate: true, date: "2026-02-05", salary: "€72,000", contactPerson: "Klaus Weber", nextAction: "Send thank-you note" },
    { id: "app_s2_2", job: "Finance Manager", company: "Commerzbank", url: "", status: "interview", source: "self", addedById: "seed_cust_002", addedByName: "Ahmed Hassan", seenByCandidate: true, date: "2026-02-12", salary: "€80,000", nextAction: "Prepare case study for panel interview" },
    { id: "app_s2_3", job: "FP&A Analyst", company: "Siemens AG", url: "", status: "accepted", source: "platform", addedById: "seed_emp_001", addedByName: "Jonas Weber", seenByCandidate: true, date: "2026-01-20", salary: "€75,000", contactPerson: "Maria Braun" },
  ],
};

export const EmployeesProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const existing: Employee[] = stored ? JSON.parse(stored) : [];
      // Inject seed employee if not already present
      const hasSeed = existing.some((e) => e.id === SEED_EMPLOYEE.id);
      if (!hasSeed) return [...existing, SEED_EMPLOYEE];
      return existing;
    } catch { return [SEED_EMPLOYEE]; }
  });

  // Seed app data for seed candidates (runs once, idempotent)
  useEffect(() => {
    Object.entries(SEED_BOARD_DATA).forEach(([candidateId, apps]) => {
      const key = `arbeitly_apps_${candidateId}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(apps));
      }
    });

    // Seed FAQ data for seed_cust_001
    const faqKey = "arbeitly_faq_seed_cust_001";
    if (!localStorage.getItem(faqKey)) {
      const seedFaq = [
        { id: "faq_s1_1", question: "Tell me about yourself.", answer: "I am a Software Engineer with 5 years of experience specialising in backend and cloud technologies. I have worked at Siemens AG managing large-scale microservices and am passionate about building reliable, scalable systems.", status: "pending", createdAt: "2026-03-10T09:00:00Z", createdById: "seed_emp_001", createdByName: "Jonas Weber", lockedByCandidate: false, activity: [{ timestamp: "2026-03-10T09:00:00Z", userId: "seed_emp_001", userName: "Jonas Weber", userType: "employee", action: "created" }] },
        { id: "faq_s1_2", question: "Why do you want to leave your current role?", answer: "I am looking for a new challenge where I can take on more ownership and work on product-level decisions. My current role has been valuable but I feel ready to step into a lead or senior architect position.", status: "approved", createdAt: "2026-03-11T10:30:00Z", createdById: "seed_emp_001", createdByName: "Jonas Weber", verifiedAt: "2026-03-12T08:00:00Z", verifiedById: "seed_cust_001", verifiedByName: "Sarah Müller", lockedByCandidate: false, activity: [{ timestamp: "2026-03-12T08:00:00Z", userId: "seed_cust_001", userName: "Sarah Müller", userType: "candidate", action: "approved" }, { timestamp: "2026-03-11T10:30:00Z", userId: "seed_emp_001", userName: "Jonas Weber", userType: "employee", action: "created" }] },
        { id: "faq_s1_3", question: "What is your notice period?", answer: "My current notice period is 3 months. However, I am open to negotiating an earlier start date depending on the company's needs.", status: "pending", createdAt: "2026-03-14T14:00:00Z", createdById: "seed_emp_001", createdByName: "Jonas Weber", lockedByCandidate: false, activity: [{ timestamp: "2026-03-14T14:00:00Z", userId: "seed_emp_001", userName: "Jonas Weber", userType: "employee", action: "created" }] },
      ];
      localStorage.setItem(faqKey, JSON.stringify(seedFaq));
    }

    // Seed audit log (idempotent)
    const auditKey = "arbeitly_audit_log";
    if (!localStorage.getItem(auditKey)) {
      const now = Date.now();
      const seedAudit = [
        { id: "au_01", timestamp: new Date(now - 1 * 86400000).toISOString(), userId: "seed_emp_001", userName: "Jonas Weber", userType: "employee", action: "faq_item_added", targetId: "seed_cust_001", targetName: "Sarah Müller", detail: "Added Q&A: What is your notice period?" },
        { id: "au_02", timestamp: new Date(now - 2 * 86400000).toISOString(), userId: "seed_cust_001", userName: "Sarah Müller", userType: "candidate", action: "faq_item_approved", targetId: "seed_cust_001", targetName: "Sarah Müller", detail: "Approved: Why do you want to leave your current role?" },
        { id: "au_03", timestamp: new Date(now - 3 * 86400000).toISOString(), userId: "seed_emp_001", userName: "Jonas Weber", userType: "employee", action: "application_added", targetId: "seed_cust_001", targetName: "Sarah Müller", detail: "Added: Backend Engineer at Celonis" },
        { id: "au_04", timestamp: new Date(now - 4 * 86400000).toISOString(), userId: "seed_emp_001", userName: "Jonas Weber", userType: "employee", action: "cv_enhanced", targetId: "seed_cust_001", targetName: "Sarah Müller", detail: "AI enhanced CV for Senior Software Engineer role" },
        { id: "au_05", timestamp: new Date(now - 5 * 86400000).toISOString(), userId: "seed_cust_001", userName: "Sarah Müller", userType: "candidate", action: "application_status_changed", targetId: "seed_cust_001", targetName: "Sarah Müller", detail: "Status changed: BMW Group → Interview" },
        { id: "au_06", timestamp: new Date(now - 6 * 86400000).toISOString(), userId: "seed_emp_001", userName: "Jonas Weber", userType: "employee", action: "faq_item_added", targetId: "seed_cust_001", targetName: "Sarah Müller", detail: "Added Q&A: Why do you want to leave your current role?" },
        { id: "au_07", timestamp: new Date(now - 7 * 86400000).toISOString(), userId: "seed_emp_001", userName: "Jonas Weber", userType: "employee", action: "application_added", targetId: "seed_cust_001", targetName: "Sarah Müller", detail: "Added: Tech Lead at Zalando" },
        { id: "au_08", timestamp: new Date(now - 8 * 86400000).toISOString(), userId: "seed_emp_001", userName: "Jonas Weber", userType: "employee", action: "cv_version_created", targetId: "seed_cust_001", targetName: "Sarah Müller", detail: "Created CV version: Senior Engineer — Modern style" },
        { id: "au_09", timestamp: new Date(now - 3 * 86400000).toISOString(), userId: "seed_emp_001", userName: "Jonas Weber", userType: "employee", action: "application_added", targetId: "seed_cust_002", targetName: "Ahmed Hassan", detail: "Added: Senior Financial Analyst at Deutsche Bank" },
        { id: "au_10", timestamp: new Date(now - 5 * 86400000).toISOString(), userId: "seed_cust_002", userName: "Ahmed Hassan", userType: "candidate", action: "application_status_changed", targetId: "seed_cust_002", targetName: "Ahmed Hassan", detail: "Status changed: Commerzbank → Interview" },
        { id: "au_11", timestamp: new Date(now - 6 * 86400000).toISOString(), userId: "seed_emp_001", userName: "Jonas Weber", userType: "employee", action: "candidate_assigned", targetId: "seed_cust_002", targetName: "Ahmed Hassan", detail: "Assigned Ahmed Hassan to Jonas Weber" },
        { id: "au_12", timestamp: new Date(now - 10 * 86400000).toISOString(), userId: "seed_cust_001", userName: "Sarah Müller", userType: "candidate", action: "candidate_signed_up", targetId: "seed_cust_001", targetName: "Sarah Müller", detail: "Signed up on Starter plan" },
        { id: "au_13", timestamp: new Date(now - 12 * 86400000).toISOString(), userId: "seed_cust_002", userName: "Ahmed Hassan", userType: "candidate", action: "candidate_signed_up", targetId: "seed_cust_002", targetName: "Ahmed Hassan", detail: "Signed up on Starter plan" },
        { id: "au_14", timestamp: new Date(now - 2 * 86400000).toISOString(), userId: "seed_emp_001", userName: "Jonas Weber", userType: "employee", action: "job_added_to_queue", targetId: "seed_cust_001", targetName: "Sarah Müller", detail: "Queued job: Cloud Architect at SAP SE" },
      ];
      localStorage.setItem(auditKey, JSON.stringify(seedAudit));
    }
  }, []);

  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    if (currentEmployee) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentEmployee));
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }, [currentEmployee]);

  const addEmployee = (data: Omit<Employee, "id" | "createdAt" | "assignedCandidateIds" | "assignments">) => {
    const emp: Employee = {
      ...data,
      id: `emp_${Date.now()}`,
      assignedCandidateIds: [],
      assignments: [],
      createdAt: new Date().toISOString(),
    };
    setEmployees((prev) => [emp, ...prev]);
    return emp;
  };

  const updateEmployee = (id: string, data: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...data } : e))
    );
    setCurrentEmployee((prev) =>
      prev?.id === id ? { ...prev, ...data } : prev
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const loginEmployee = (email: string, password: string): Employee | null => {
    const fresh = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Employee[];
    const emp = fresh.find(
      (e) => e.email.toLowerCase() === email.toLowerCase() && e.password === password && e.status === "active"
    );
    if (emp) setCurrentEmployee(emp);
    return emp ?? null;
  };

  const loginEmployeeDirect = (emp: Employee) => {
    setCurrentEmployee(emp);
  };

  const logoutEmployee = () => {
    setCurrentEmployee(null);
  };

  return (
    <EmployeesContext.Provider value={{
      employees, currentEmployee,
      addEmployee, updateEmployee, deleteEmployee,
      loginEmployee, logoutEmployee, loginEmployeeDirect,
    }}>
      {children}
    </EmployeesContext.Provider>
  );
};

export const useEmployees = () => {
  const ctx = useContext(EmployeesContext);
  if (!ctx) throw new Error("useEmployees must be used inside EmployeesProvider");
  return ctx;
};
