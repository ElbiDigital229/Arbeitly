import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type QuestionType = "text" | "dropdown" | "multiselect";

export type OnboardingQuestion = {
  id: string;
  label: string;
  placeholder?: string;
  type: QuestionType;
  options?: string[]; // for dropdown + multiselect
  required: boolean;
  order: number;
};

export type OnboardingConfigSection = "paid" | "free";

type OnboardingConfigContextType = {
  paidQuestions: OnboardingQuestion[];
  freeQuestions: OnboardingQuestion[];
  upsertQuestion: (section: OnboardingConfigSection, question: OnboardingQuestion) => void;
  deleteQuestion: (section: OnboardingConfigSection, id: string) => void;
  reorderQuestions: (section: OnboardingConfigSection, questions: OnboardingQuestion[]) => void;
};

const STORAGE_KEY_PAID = "arbeitly_onboarding_config_paid";
const STORAGE_KEY_FREE = "arbeitly_onboarding_config_free";

const DEFAULT_PAID_QUESTIONS: OnboardingQuestion[] = [
  { id: "q_p_01", label: "First Name", type: "text", required: true, order: 1 },
  { id: "q_p_02", label: "Last Name", type: "text", required: true, order: 2 },
  { id: "q_p_03", label: "Application Email", placeholder: "Email used when applying to jobs", type: "text", required: true, order: 3 },
  { id: "q_p_04", label: "Phone Number", type: "text", required: false, order: 4 },
  { id: "q_p_05", label: "LinkedIn Profile URL", type: "text", required: false, order: 5 },
  { id: "q_p_06", label: "Date of Birth", type: "text", required: false, order: 6 },
  { id: "q_p_07", label: "Place of Birth", type: "text", required: false, order: 7 },
  { id: "q_p_08", label: "Current Address", type: "text", required: false, order: 8 },
  { id: "q_p_09", label: "Current Job Title", type: "text", required: true, order: 9 },
  { id: "q_p_10", label: "Current Employer", type: "text", required: false, order: 10 },
  { id: "q_p_11", label: "Industry / Field", type: "text", required: false, order: 11 },
  { id: "q_p_12", label: "Years of Experience", type: "dropdown", options: ["0-1", "1-3", "3-5", "5-8", "8-12", "12+"], required: true, order: 12 },
  { id: "q_p_13", label: "Current Salary (€)", type: "text", required: false, order: 13 },
  { id: "q_p_14", label: "Notice Period", type: "dropdown", options: ["Immediate", "2 weeks", "1 month", "2 months", "3 months", "6 months"], required: false, order: 14 },
  { id: "q_p_15", label: "Have you worked in Germany before?", type: "dropdown", options: ["Yes", "No"], required: false, order: 15 },
  { id: "q_p_16", label: "Highest Level of Education", type: "dropdown", options: ["High School", "Bachelor's", "Master's", "PhD", "Vocational Training", "Other"], required: false, order: 16 },
  { id: "q_p_17", label: "Degree Title", type: "text", required: false, order: 17 },
  { id: "q_p_18", label: "University", type: "text", required: false, order: 18 },
  { id: "q_p_19", label: "Top Skills", placeholder: "e.g. React, Project Management, Python", type: "text", required: true, order: 19 },
  { id: "q_p_20", label: "Certifications", type: "text", required: false, order: 20 },
  { id: "q_p_21", label: "Career Goal", placeholder: "Briefly describe your career objective", type: "text", required: true, order: 21 },
  { id: "q_p_22", label: "Target Roles", placeholder: "e.g. Senior Engineer, Product Manager", type: "text", required: true, order: 22 },
  { id: "q_p_23", label: "Target Industries", type: "text", required: false, order: 23 },
  { id: "q_p_24", label: "Employment Type Preference", type: "dropdown", options: ["Full-time", "Part-time", "Remote", "Hybrid", "Flexible"], required: false, order: 24 },
  { id: "q_p_25", label: "Preferred Location in Germany", type: "text", required: true, order: 25 },
  { id: "q_p_26", label: "Open to Relocation?", type: "dropdown", options: ["Yes", "No", "Within Germany only"], required: false, order: 26 },
  { id: "q_p_27", label: "Preferred Salary (€)", type: "text", required: false, order: 27 },
  { id: "q_p_28", label: "German Language Level", type: "dropdown", options: ["A1", "A2", "B1", "B2", "C1", "C2", "Native"], required: true, order: 28 },
  { id: "q_p_29", label: "Driving Licence", type: "dropdown", options: ["Yes", "No"], required: false, order: 29 },
  { id: "q_p_30", label: "How did you hear about Arbeitly?", type: "dropdown", options: ["Google", "LinkedIn", "Friend/Referral", "Instagram", "Facebook", "Other"], required: false, order: 30 },
];

const DEFAULT_FREE_QUESTIONS: OnboardingQuestion[] = [
  { id: "q_f_01", label: "Are you currently a German resident?", type: "dropdown", options: ["Yes", "No", "Planning to relocate"], required: true, order: 1 },
  { id: "q_f_02", label: "Where did you hear about Arbeitly?", type: "dropdown", options: ["Google", "LinkedIn", "Friend/Referral", "Instagram", "Facebook", "Other"], required: false, order: 2 },
  { id: "q_f_03", label: "How are you currently managing your job search?", type: "dropdown", options: ["Spreadsheet", "Manually / no tracking", "Another tool", "Just getting started"], required: false, order: 3 },
];

const OnboardingConfigContext = createContext<OnboardingConfigContextType | null>(null);

export function OnboardingConfigProvider({ children }: { children: ReactNode }) {
  const [paidQuestions, setPaidQuestions] = useState<OnboardingQuestion[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PAID);
      return stored ? JSON.parse(stored) : DEFAULT_PAID_QUESTIONS;
    } catch { return DEFAULT_PAID_QUESTIONS; }
  });

  const [freeQuestions, setFreeQuestions] = useState<OnboardingQuestion[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FREE);
      return stored ? JSON.parse(stored) : DEFAULT_FREE_QUESTIONS;
    } catch { return DEFAULT_FREE_QUESTIONS; }
  });

  useEffect(() => { localStorage.setItem(STORAGE_KEY_PAID, JSON.stringify(paidQuestions)); }, [paidQuestions]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_FREE, JSON.stringify(freeQuestions)); }, [freeQuestions]);

  const upsertQuestion = (section: OnboardingConfigSection, question: OnboardingQuestion) => {
    const setter = section === "paid" ? setPaidQuestions : setFreeQuestions;
    setter((prev) => {
      const idx = prev.findIndex((q) => q.id === question.id);
      if (idx >= 0) { const u = [...prev]; u[idx] = question; return u; }
      return [...prev, question];
    });
  };

  const deleteQuestion = (section: OnboardingConfigSection, id: string) => {
    const setter = section === "paid" ? setPaidQuestions : setFreeQuestions;
    setter((prev) => prev.filter((q) => q.id !== id));
  };

  const reorderQuestions = (section: OnboardingConfigSection, questions: OnboardingQuestion[]) => {
    const setter = section === "paid" ? setPaidQuestions : setFreeQuestions;
    setter(questions.map((q, i) => ({ ...q, order: i + 1 })));
  };

  return (
    <OnboardingConfigContext.Provider value={{ paidQuestions, freeQuestions, upsertQuestion, deleteQuestion, reorderQuestions }}>
      {children}
    </OnboardingConfigContext.Provider>
  );
}

export function useOnboardingConfig() {
  const ctx = useContext(OnboardingConfigContext);
  if (!ctx) throw new Error("useOnboardingConfig must be used within OnboardingConfigProvider");
  return ctx;
}
