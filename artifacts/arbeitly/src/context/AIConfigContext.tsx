import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type LLMProvider = "claude" | "gemini";

export type PromptVersion = {
  version: number;
  content: string;
  updatedAt: string;
};

export type PromptConfig = {
  current: string;
  history: PromptVersion[];
};

export type LanguageRule = "en" | "de" | "de-preferred";
// en         = English only jobs → use EN CV
// de         = German only jobs → use DE CV (auto-generate if missing)
// de-preferred = both EN+DE accepted → use DE CV (auto-generate if missing)

export type AIConfig = {
  provider: LLMProvider;
  apiKey: string;
  cvEnhancementPrompt: PromptConfig;
  jobTailoringPrompt: PromptConfig;
  coverLetterPrompt: PromptConfig;
  jobMatchingPrompt: PromptConfig;
  languageRules: {
    englishOnly: LanguageRule;
    germanOnly: LanguageRule;
    bothAccepted: LanguageRule;
  };
};

type AIConfigContextType = {
  config: AIConfig;
  updateProvider: (provider: LLMProvider) => void;
  updateApiKey: (key: string) => void;
  updatePrompt: (field: keyof Omit<AIConfig, "provider" | "apiKey" | "languageRules">, content: string) => void;
  updateLanguageRules: (rules: AIConfig["languageRules"]) => void;
};

const STORAGE_KEY = "arbeitly_ai_config";

const DEFAULT_CONFIG: AIConfig = {
  provider: "claude",
  apiKey: "",
  cvEnhancementPrompt: {
    current: "You are a professional CV writer with expertise in the German job market. Enhance this CV to be more impactful, concise, and tailored for senior roles. Use strong action verbs, quantify achievements where possible, and ensure the language is professional and ATS-friendly. Maintain the candidate's authentic voice.",
    history: [],
  },
  jobTailoringPrompt: {
    current: "You are an expert in tailoring CVs for specific job applications. Given the candidate's base CV and the job description below, create a tailored version that highlights the most relevant experience and skills. Adjust the summary, reorder bullet points, and emphasise keywords from the job description. Do not fabricate any experience.",
    history: [],
  },
  coverLetterPrompt: {
    current: "You are a professional cover letter writer specialising in the German job market. Write a compelling, personalised cover letter based on the candidate's profile and the job description. The letter should be concise (3-4 paragraphs), professional, and demonstrate genuine interest in the role. Include specific references to the job requirements.",
    history: [],
  },
  jobMatchingPrompt: {
    current: "You are a job matching expert. Given the candidate's profile (experience, skills, target roles, location preferences, salary expectations, German language level) and a job description, calculate a match score from 0-100 and list the key matching reasons. Be objective and focus on role fit, location, salary range, required skills, and language requirements.",
    history: [],
  },
  languageRules: {
    englishOnly: "en",
    germanOnly: "de",
    bothAccepted: "de-preferred",
  },
};

const AIConfigContext = createContext<AIConfigContextType | null>(null);

export function AIConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AIConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_CONFIG, ...JSON.parse(stored) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const updateProvider = (provider: LLMProvider) => setConfig((prev) => ({ ...prev, provider }));

  const updateApiKey = (apiKey: string) => setConfig((prev) => ({ ...prev, apiKey }));

  const updatePrompt = (
    field: keyof Omit<AIConfig, "provider" | "apiKey" | "languageRules">,
    content: string
  ) => {
    setConfig((prev) => {
      const existing = prev[field] as PromptConfig;
      const newVersion: PromptVersion = {
        version: (existing.history.length || 0) + 1,
        content: existing.current,
        updatedAt: new Date().toISOString(),
      };
      return {
        ...prev,
        [field]: {
          current: content,
          history: [newVersion, ...existing.history],
        },
      };
    });
  };

  const updateLanguageRules = (rules: AIConfig["languageRules"]) =>
    setConfig((prev) => ({ ...prev, languageRules: rules }));

  return (
    <AIConfigContext.Provider value={{ config, updateProvider, updateApiKey, updatePrompt, updateLanguageRules }}>
      {children}
    </AIConfigContext.Provider>
  );
}

export function useAIConfig() {
  const ctx = useContext(AIConfigContext);
  if (!ctx) throw new Error("useAIConfig must be used within AIConfigProvider");
  return ctx;
}
